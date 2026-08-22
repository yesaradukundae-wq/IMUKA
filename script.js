// --- Supabase Credentials ---
const SUPABASE_URL = "https://YOUR_SUPABASE_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Multilingual Translations ---
const translations = {
  en: {
    heroTitle: "Seamless Relocation in Kigali",
    heroDesc: "Submit your move details and get your confirmed quote in under two minutes.",
    labelName: "Full Name",
    labelPhone: "Phone Number",
    labelPickup: "Pickup Neighborhood",
    labelDropoff: "Destination Neighborhood",
    labelMoveType: "Type of Move",
    labelTruck: "Truck Size Required",
    labelDate: "Move Date",
    labelStairs: "Stairs required at pickup or destination?",
    estTitle: "Rates & Pricing",
    estAmount: "Starting from 80,000 RWF",
    btnSubmit: "Confirm Booking Request"
  },
  rw: {
    heroTitle: "Kwimuka Biraworoheye i Kigali",
    heroDesc: "Ohereza amakuru yo kwimuka ubone igiciro kyo kwemeza mu minota ibiri gusa.",
    labelName: "Amasina Yombi",
    labelPhone: "Nimero ya Telefone",
    labelPickup: "Aho Upakurira",
    labelDropoff: "Aho Upakururira",
    labelMoveType: "Ubwoko bwo Kwimuka",
    labelTruck: "Ingano y'Imodoka",
    labelDate: "Ibitariki byo Kwimuka",
    labelStairs: "Harimo Ingarani/Amashyiga?",
    estTitle: "Ibiciro",
    estAmount: "Bihagaze ku 80,000 RWF",
    btnSubmit: "Saba Kwimuka"
  },
  fr: {
    heroTitle: "Déménagement Facile à Kigali",
    heroDesc: "Soumettez vos détails et obtenez votre devis confirmé en moins de deux minutes.",
    labelName: "Nom Complet",
    labelPhone: "Numéro de Téléphone",
    labelPickup: "Quartier de Départ",
    labelDropoff: "Quartier d'Arrivée",
    labelMoveType: "Type de Déménagement",
    labelTruck: "Taille du Camion",
    labelDate: "Date du Déménagement",
    labelStairs: "Escaliers au départ ou à l'arrivée?",
    estTitle: "Tarification",
    estAmount: "À partir de 80 000 RWF",
    btnSubmit: "Confirmer la Réservation"
  }
};

let currentLang = 'en';

function switchLanguage(lang, evt) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  if (evt && evt.target) evt.target.classList.add('active');

  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      elem.innerText = translations[lang][key];
    }
  });
}

// Set minimum move date to today
const dateInput = document.getElementById('moveDate');
if (dateInput) {
  dateInput.min = new Date().toISOString().split('T')[0];
}

// --- Form Submission ---
document.getElementById('imukaBookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    customer_name: document.getElementById('custName').value,
    customer_phone: document.getElementById('custPhone').value,
    pickup_location: document.getElementById('pickupLoc').value,
    dropoff_location: document.getElementById('dropoffLoc').value,
    move_type: document.getElementById('moveType').value,
    truck_size: document.getElementById('truckSize').value,
    has_stairs: document.getElementById('hasStairs').checked,
    pickup_date: document.getElementById('moveDate').value,
    estimated_price_min: 80000,
    estimated_price_max: 500000
  };

  const submitBtn = e.target.querySelector('.btn-submit');
  submitBtn.innerText = "Processing...";
  submitBtn.disabled = true;

  const { data, error } = await supabaseClient
    .from('bookings')
    .insert([payload])
    .select();

  if (error) {
    alert("Unable to process automatically. Redirecting to WhatsApp...");
    console.error("Supabase Error:", error);
    submitBtn.innerText = translations[currentLang].btnSubmit;
    submitBtn.disabled = false;
  } else {
    const booking = data[0];
    const refCode = booking.booking_ref;

    alert(`🎉 Success! Booking Reference: ${refCode}`);

    // Pre-filled WhatsApp Message
    const waText = `Hello IMUKA! I just submitted a move request on the website.\nReference: ${refCode}\nFrom: ${payload.pickup_location}\nTo: ${payload.dropoff_location}\nDate: ${payload.pickup_date}`;
    window.location.href = `https://wa.me/250791639756?text=${encodeURIComponent(waText)}`;
  }
});