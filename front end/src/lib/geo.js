/** Haversine distance in km between two [lat, lon] points. */
export function haversineDistanceKm([lat1, lon1], [lat2, lon2]) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatAddressFromNominatim(addr) {
  if (!addr) return '';
  const parts = [
    addr.house_number,
    addr.road,
    addr.neighbourhood || addr.suburb,
    addr.city || addr.town || addr.village || addr.municipality,
    addr.state,
    addr.postcode,
    addr.country,
  ].filter(Boolean);
  return [...new Set(parts)].join(', ');
}

export async function geocodeSearch(query, options = {}) {
  const trimmed = (query || '').trim();
  if (!trimmed) return { results: [], error: 'Enter an area or address.' };

  const cityHint = options.cityHint?.trim();
  const q = encodeURIComponent(
    cityHint ? `${trimmed}, ${cityHint}, Tamil Nadu, India` : `${trimmed}, India`
  );
  const params = `q=${q}&format=json&limit=6&addressdetails=1&countrycodes=in`;
  // Same-origin proxy (Vite dev + Vercel rewrite) avoids browser CORS blocks on Nominatim.
  const url = `/api/nominatim/search?${params}`;

  const res = await fetch(url);

  if (!res.ok) {
    return { results: [], error: `Geocoding failed (${res.status}). Try again in a moment.` };
  }

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    return { results: [], error: 'No matches found. Try a more specific locality name.' };
  }

  const results = data.map((item) => ({
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    displayName: item.display_name,
    shortLabel: item.name || item.display_name?.split(',')[0]?.trim() || trimmed,
    address: formatAddressFromNominatim(item.address),
    raw: item,
  }));

  return { results, error: '' };
}

export function googleMapsSearchUrl(lat, lon) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lon}`)}`;
}

export function googleMapsDirectionsUrl(destination, origin) {
  const dest = `${destination[0]},${destination[1]}`;
  if (origin && typeof origin[0] === 'number' && typeof origin[1] === 'number') {
    const orig = `${origin[0]},${origin[1]}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${orig}&destination=${dest}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
}
