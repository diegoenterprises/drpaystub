const axios = require("axios");

/**
 * Geolocate an IP address using the free ip-api.com service.
 * Returns null on failure (fire-and-forget safe).
 * Rate limit: 45 req/min — fine for registration/login events.
 */
async function geolocateIP(ip) {
  try {
    // Skip private / loopback IPs
    if (
      !ip ||
      ip === "::1" ||
      ip === "127.0.0.1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.16.") ||
      ip === "::ffff:127.0.0.1"
    ) {
      console.log("[Geo] Skipping private IP:", ip);
      return null;
    }

    // Strip IPv6 prefix if present
    const cleanIp = ip.replace(/^::ffff:/, "");

    const { data } = await axios.get(
      `http://ip-api.com/json/${cleanIp}?fields=status,country,countryCode,regionName,city,lat,lon,timezone,isp`,
      { timeout: 4000 }
    );

    if (data.status === "success") {
      console.log(`[Geo] Resolved ${cleanIp} → ${data.city}, ${data.regionName}, ${data.country}`);
      return {
        ip: cleanIp,
        city: data.city,
        region: data.regionName,
        country: data.country,
        countryCode: data.countryCode,
        lat: data.lat,
        lng: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        lastUpdated: new Date(),
      };
    }

    console.log("[Geo] ip-api returned non-success for", cleanIp, data);
    return null;
  } catch (e) {
    console.error("[Geo] IP lookup failed:", e.message);
    return null;
  }
}

module.exports = { geolocateIP };
