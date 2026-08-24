// Fixed flat rates in RWF
const PRICING_TIERS = {
  small: 35000,
  medium: 55000,
  large: 85000
};

document.addEventListener('DOMContentLoaded', () => {
  const moveSizeSelect = document.getElementById('moveSize');
  const priceDisplay = document.getElementById('priceDisplay');
  const bookingForm = document.getElementById('booking-form');

  // Update displayed price whenever customer changes move size
  moveSizeSelect.addEventListener('change', (e) => {
    const selectedSize = e.target.value;
    const price = PRICING_TIERS[selectedSize];
    priceDisplay.textContent = price.toLocaleString() + ' RWF';
  });

  // Handle Form Submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const bookingData = {
      moveSize: moveSizeSelect.value,
      price: PRICING_TIERS[moveSizeSelect.value],
      pickupFloor: document.getElementById('pickupFloor').value,
      dropoffFloor: document.getElementById('dropoffFloor').value,
      specialNotes: document.getElementById('specialNotes').value,
    };

    console.log('Booking Data:', bookingData);
    alert(`Thank you! Your move request for ${bookingData.price.toLocaleString()} RWF has been received.`);
  });
});
