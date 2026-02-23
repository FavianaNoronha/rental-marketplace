import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { differenceInDays, addDays, format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import './RentalCalendar.css';

const RentalCalendar = ({ productId, onDatesSelected, minDays = 1, maxDays = 7 }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, endDate] = dateRange;

  useEffect(() => {
    fetchBlockedDates();
  }, [productId]);

  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      onDatesSelected({
        startDate,
        endDate,
        days,
        valid: days >= minDays && days <= maxDays
      });
    } else {
      onDatesSelected(null);
    }
  }, [startDate, endDate]);

  const fetchBlockedDates = async () => {
    try {
      const response = await fetch(`/api/rentals/calendar/${productId}`);
      const data = await response.json();
      
      if (data.success) {
        // Convert blocked date strings to Date objects
        const blocked = data.data.blockedDates.map(dateStr => new Date(dateStr));
        setBlockedDates(blocked);
      }
    } catch (error) {
      console.error('Failed to fetch blocked dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isDateBlocked = (date) => {
    return blockedDates.some(blockedDate => isSameDay(date, blockedDate));
  };

  const tileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    // Disable dates more than 90 days in future
    const maxFutureDate = addDays(today, 90);
    if (date > maxFutureDate) return true;
    
    // Disable already booked dates
    return isDateBlocked(date);
  };

  const tileClassName = ({ date }) => {
    if (isDateBlocked(date)) {
      return 'blocked-date';
    }
    
    if (startDate && endDate) {
      if (date >= startDate && date <= endDate) {
        return 'selected-range';
      }
    } else if (startDate && isSameDay(date, startDate)) {
      return 'selected-start';
    }
    
    return '';
  };

  const handleDateChange = (value) => {
    if (Array.isArray(value)) {
      // Range selection
      const [start, end] = value;
      
      // Check if any date in range is blocked
      let hasBlockedDate = false;
      let currentDate = new Date(start);
      
      while (currentDate <= end) {
        if (isDateBlocked(currentDate)) {
          hasBlockedDate = true;
          break;
        }
        currentDate = addDays(currentDate, 1);
      }
      
      if (!hasBlockedDate) {
        setDateRange([start, end]);
      } else {
        alert('Selected range contains unavailable dates. Please choose different dates.');
      }
    } else {
      // Single date selection (start date)
      if (!startDate) {
        setDateRange([value, null]);
      } else if (!endDate) {
        if (value > startDate) {
          setDateRange([startDate, value]);
        } else {
          setDateRange([value, null]);
        }
      } else {
        setDateRange([value, null]);
      }
    }
  };

  const calculatePrice = () => {
    if (!startDate || !endDate) return null;
    
    const days = differenceInDays(endDate, startDate) + 1;
    return { days };
  };

  const priceInfo = calculatePrice();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="rental-calendar-container">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Rental Dates</h3>
        <p className="text-sm text-gray-600">
          Choose your rental period ({minDays}-{maxDays} days)
        </p>
      </div>

      <Calendar
        onChange={handleDateChange}
        value={dateRange}
        selectRange={false}
        tileDisabled={tileDisabled}
        tileClassName={tileClassName}
        minDate={new Date()}
        maxDate={addDays(new Date(), 90)}
        className="rental-calendar"
      />

      <div className="mt-4 space-y-2">
        {/* Selected Dates Display */}
        {startDate && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="font-semibold text-gray-900">
                  {format(startDate, 'MMM dd, yyyy')}
                </p>
              </div>
              
              {endDate && (
                <>
                  <div className="text-gray-400">→</div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-semibold text-gray-900">
                      {format(endDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </>
              )}
            </div>
            
            {priceInfo && (
              <div className="mt-3 pt-3 border-t border-indigo-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Total Duration: <span className="font-semibold">{priceInfo.days} day{priceInfo.days > 1 ? 's' : ''}</span>
                  </p>
                  
                  {priceInfo.days < minDays && (
                    <p className="text-xs text-red-600">
                      Minimum {minDays} days required
                    </p>
                  )}
                  
                  {priceInfo.days > maxDays && (
                    <p className="text-xs text-red-600">
                      Maximum {maxDays} days allowed
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-100 border border-indigo-300 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCalendar;
