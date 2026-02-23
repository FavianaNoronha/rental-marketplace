import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Add-ons
  const [addDryCleaning, setAddDryCleaning] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('self-pickup');

  const DRY_CLEANING_FEE = 299;
  const INSURANCE_FEE = 199;
  const DELIVERY_FEE = 120;
  const PLATFORM_FEE_PERCENT = 18;

  useEffect(() => {
    fetchRentalDetails();
  }, [rentalId]);

  const fetchRentalDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `/api/rentals/${rentalId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRental(data.data);
    } catch (error) {
      toast.error('Failed to load rental details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!rental) return { subtotal: 0, fees: 0, total: 0, deposit: 0 };

    let subtotal = rental.rentalAmount;
    
    if (addDryCleaning) subtotal += DRY_CLEANING_FEE;
    if (addInsurance) subtotal += INSURANCE_FEE;
    if (deliveryOption === 'delivery') subtotal += DELIVERY_FEE;

    const platformFee = Math.round((rental.rentalAmount * PLATFORM_FEE_PERCENT) / 100);
    const total = subtotal + platformFee;
    const deposit = rental.securityDeposit;

    return { subtotal, platformFee, total, deposit, grandTotal: total + deposit };
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);

      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Razorpay SDK failed to load');
        return;
      }

      // Create order on backend
      const token = localStorage.getItem('token');
      const { data: orderData } = await axios.post(
        '/api/payments/create-order',
        { rentalId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Razorpay checkout options
      const options = {
        key: orderData.data.keyId,
        amount: orderData.data.amount * 100,
        currency: 'INR',
        name: 'Closetly',
        description: `Rental: ${orderData.data.productTitle}`,
        order_id: orderData.data.orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            await axios.post(
              '/api/payments/verify-payment',
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                rentalId
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Payment successful! Rental confirmed.');
            navigate(`/rentals/${rentalId}/success`);
          } catch (error) {
            toast.error('Payment verification failed');
            console.error(error);
          }
        },
        prefill: {
          name: rental.renter?.name || '',
          email: rental.renter?.email || '',
          contact: rental.renter?.phone || ''
        },
        notes: {
          rental_id: rentalId,
          product_id: rental.product?._id
        },
        theme: {
          color: '#6366F1'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error('Payment initiation failed');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Rental not found</p>
      </div>
    );
  }

  const { subtotal, platformFee, total, deposit, grandTotal } = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="flex gap-4">
                <img
                  src={rental.product?.images?.[0] || '/placeholder.jpg'}
                  alt={rental.product?.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{rental.product?.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Duration: {Math.ceil((new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">₹{rental.rentalAmount}</p>
                  <p className="text-sm text-gray-500">Rental Amount</p>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Add-ons</h3>
              
              {/* Dry Cleaning */}
              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addDryCleaning}
                    onChange={(e) => setAddDryCleaning(e.target.checked)}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <div>
                    <p className="font-medium">Professional Dry Cleaning</p>
                    <p className="text-sm text-gray-500">We'll dry clean the item before delivery</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">+₹{DRY_CLEANING_FEE}</p>
              </label>

              {/* Insurance */}
              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addInsurance}
                    onChange={(e) => setAddInsurance(e.target.checked)}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <div>
                    <p className="font-medium">Premium Insurance</p>
                    <p className="text-sm text-gray-500">Extra ₹50K coverage upgrade</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">+₹{INSURANCE_FEE}</p>
              </label>
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Delivery Method</h3>
              
              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    value="self-pickup"
                    checked={deliveryOption === 'self-pickup'}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <div>
                    <p className="font-medium">Self-Pickup (Save 10%)</p>
                    <p className="text-sm text-gray-500">{rental.product?.location || 'Pickup location'}</p>
                  </div>
                </div>
                <p className="font-semibold text-green-600">FREE</p>
              </label>

              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    checked={deliveryOption === 'delivery'}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <div>
                    <p className="font-medium">Home Delivery</p>
                    <p className="text-sm text-gray-500">Delivered within 2-4 hours</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">+₹{DELIVERY_FEE}</p>
              </label>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Payment Breakdown</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Rental Amount</span>
                  <span>₹{rental.rentalAmount}</span>
                </div>
                
                {addDryCleaning && (
                  <div className="flex justify-between text-gray-600">
                    <span>Dry Cleaning</span>
                    <span>₹{DRY_CLEANING_FEE}</span>
                  </div>
                )}
                
                {addInsurance && (
                  <div className="flex justify-between text-gray-600">
                    <span>Insurance</span>
                    <span>₹{INSURANCE_FEE}</span>
                  </div>
                )}
                
                {deliveryOption === 'delivery' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₹{DELIVERY_FEE}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee (18%)</span>
                  <span>₹{platformFee}</span>
                </div>
                
                <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex justify-between text-yellow-800 font-medium">
                    <span>Security Deposit (held)</span>
                    <span>₹{deposit}</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    Refunded within 48 hours of return
                  </p>
                </div>
                
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-indigo-600">
                  <span>Total Authorization</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">💳 Payment Breakdown:</span><br />
                  • You'll be charged <span className="font-bold">₹{total}</span> now<br />
                  • We'll hold <span className="font-bold">₹{deposit}</span> as deposit<br />
                  • Total authorization: <span className="font-bold">₹{grandTotal}</span>
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold
                         hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                         transition-colors"
              >
                {processing ? 'Processing...' : `Pay ₹${grandTotal}`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                🔒 Secured by Razorpay | UPI, Cards, Wallets accepted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
