import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Clothes',
    subcategory: 'Unisex',
    condition: 'Good',
    listingType: 'sale',
    salePrice: '',
    rentPricePerDay: '',
    rentPricePerWeek: '',
    deposit: '',
    brand: '',
    size: '',
    color: '',
    material: '',
    quantity: 1,
    city: '',
    state: '',
    zipCode: ''
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Add product data
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('subcategory', formData.subcategory);
      data.append('condition', formData.condition);
      data.append('listingType', formData.listingType);
      data.append('quantity', formData.quantity);

      // Add pricing
      if (formData.listingType === 'sale' || formData.listingType === 'both') {
        data.append('price[sale]', formData.salePrice);
      }
      if (formData.listingType === 'rent' || formData.listingType === 'both') {
        data.append('price[rent][perDay]', formData.rentPricePerDay);
        data.append('price[rent][perWeek]', formData.rentPricePerWeek);
        if (formData.deposit) {
          data.append('price[rent][deposit]', formData.deposit);
        }
      }

      // Add specifications
      if (formData.brand) data.append('specifications[brand]', formData.brand);
      if (formData.size) data.append('specifications[size]', formData.size);
      if (formData.color) data.append('specifications[color]', formData.color);
      if (formData.material) data.append('specifications[material]', formData.material);

      // Add location
      data.append('location[city]', formData.city);
      if (formData.state) data.append('location[state]', formData.state);
      if (formData.zipCode) data.append('location[zipCode]', formData.zipCode);

      // Add images
      images.forEach((image) => {
        data.append('images', image);
      });

      const response = await api.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Listing created successfully!');
      navigate(`/products/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>

      <form onSubmit={handleSubmit} className="card p-8">
        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Designer Dress - Perfect for Weddings"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input"
              placeholder="Describe your item in detail..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                <option value="Clothes">Clothes</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
                <option value="Bags">Bags</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                For *
              </label>
              <select
                name="subcategory"
                required
                value={formData.subcategory}
                onChange={handleChange}
                className="input"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                name="condition"
                required
                value={formData.condition}
                onChange={handleChange}
                className="input"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Type *
            </label>
            <select
              name="listingType"
              required
              value={formData.listingType}
              onChange={handleChange}
              className="input"
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="both">Both (Rent & Sale)</option>
            </select>
          </div>

          {(formData.listingType === 'sale' || formData.listingType === 'both') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price ($) *
              </label>
              <input
                type="number"
                name="salePrice"
                required
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={handleChange}
                className="input"
                placeholder="0.00"
              />
            </div>
          )}

          {(formData.listingType === 'rent' || formData.listingType === 'both') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Day ($) *
                </label>
                <input
                  type="number"
                  name="rentPricePerDay"
                  required
                  min="0"
                  step="0.01"
                  value={formData.rentPricePerDay}
                  onChange={handleChange}
                  className="input"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Week ($) *
                </label>
                <input
                  type="number"
                  name="rentPricePerWeek"
                  required
                  min="0"
                  step="0.01"
                  value={formData.rentPricePerWeek}
                  onChange={handleChange}
                  className="input"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit ($)
                </label>
                <input
                  type="number"
                  name="deposit"
                  min="0"
                  step="0.01"
                  value={formData.deposit}
                  onChange={handleChange}
                  className="input"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Nike, Zara"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="input"
                placeholder="e.g., M, L, 32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Black, Blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Cotton, Leather"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="input"
                placeholder="e.g., New York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="input"
                placeholder="e.g., NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 10001"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <p className="text-sm text-gray-600 mb-2">Upload up to 10 images (JPG, PNG, WEBP)</p>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            className="input"
          />
          {images.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">{images.length} image(s) selected</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Listing...' : 'Create Listing'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary px-8 py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
