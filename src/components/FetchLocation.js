
export default async function getLatLngFromAddress(address) {
    const apiKey='AIzaSyCavwYyxMy-eqPfjW1iUffUEP7SQ4evafM'
  if (!address) {
    throw new Error("Address is required");
  }
   console.log(address)
  if (!apiKey) {
    throw new Error("Google Maps API key is required");
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0];
      const lat = result.geometry.location.lat;
      const lng = result.geometry.location.lng;
      const formattedAddress = result.formatted_address;

      return { lat, lng, address: formattedAddress };
    } else {
      throw new Error(data.error_message || "Invalid address");
    }
  } catch (err) {
    throw new Error(err.message || "Failed to fetch location");
  }
}
