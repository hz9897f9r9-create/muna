// Use relative API path in production. During local dev, set `window.__API_URL__` if needed.
const API_URL = (typeof window !== 'undefined' && window.__API_URL__) ? window.__API_URL__ : '/api';

let dorms = [];

// Fetch all room data from API
async function loadDorms() {
  try {
    const response = await fetch(`${API_URL}/room/all`, { redirect: 'follow' });
    // If API responds with non-JSON or redirects (SSO), fallback to static file
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (data && data.success) {
      dorms = data.rooms;
      return dorms;
    }

    // Fallback to static rooms.json bundled in /public
    const fallbackResp = await fetch('/rooms.json');
    const fallback = await fallbackResp.json();
    if (fallback && fallback.success && Array.isArray(fallback.rooms)) {
      dorms = fallback.rooms;
      return dorms;
    }
  } catch (error) {
    console.error('Failed to load room information:', error);
  }
  return [];
}

// Ensure dorms are loaded once; many pages call this helper.
async function ensureDormsLoaded() {
  if (!Array.isArray(dorms) || dorms.length === 0) {
    await loadDorms();
  }
  return dorms;
}


// Get room information from localStorage
function getRoomData(roomId){
  const room = dorms.find(x => x.id === roomId || x.id === parseInt(roomId));
  return room || null;
}

// Get all room information
function getUpdatedDorms(){
  return dorms;
}

// Default amenities data for room details and admin UI
function getAmenities(){
  return [
    { title: '24/7 Security', description: 'Secure property with CCTV and gated access.' },
    { title: 'High-Speed Wi-Fi', description: 'Reliable internet in all rooms and common areas.' },
    { title: 'Shared Kitchen', description: 'Fully equipped kitchen available for residents.' },
    { title: 'Laundry Facilities', description: 'On-site laundry machines for resident use.' },
    { title: 'Cleaning Service', description: 'Regular cleaning service for shared spaces.' },
    { title: 'Study Lounge', description: 'Quiet study area for students and remote work.' }
  ];
}
