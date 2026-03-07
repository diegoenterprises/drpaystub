import React, { Component } from "react";

// ─── WMO Weather Code Mapping ────────────────────────────────────────────────
const WMO = {
  0: { label: "Clear Sky", group: "clear" },
  1: { label: "Mostly Clear", group: "clear" },
  2: { label: "Partly Cloudy", group: "partlyCloudy" },
  3: { label: "Overcast", group: "cloudy" },
  45: { label: "Foggy", group: "fog" },
  48: { label: "Depositing Rime Fog", group: "fog" },
  51: { label: "Light Drizzle", group: "drizzle" },
  53: { label: "Moderate Drizzle", group: "drizzle" },
  55: { label: "Dense Drizzle", group: "drizzle" },
  56: { label: "Freezing Drizzle", group: "drizzle" },
  57: { label: "Heavy Freezing Drizzle", group: "drizzle" },
  61: { label: "Slight Rain", group: "rain" },
  63: { label: "Moderate Rain", group: "rain" },
  65: { label: "Heavy Rain", group: "rain" },
  66: { label: "Freezing Rain", group: "rain" },
  67: { label: "Heavy Freezing Rain", group: "rain" },
  71: { label: "Slight Snow", group: "snow" },
  73: { label: "Moderate Snow", group: "snow" },
  75: { label: "Heavy Snow", group: "snow" },
  77: { label: "Snow Grains", group: "snow" },
  80: { label: "Slight Showers", group: "rain" },
  81: { label: "Moderate Showers", group: "rain" },
  82: { label: "Violent Showers", group: "rain" },
  85: { label: "Slight Snow Showers", group: "snow" },
  86: { label: "Heavy Snow Showers", group: "snow" },
  95: { label: "Thunderstorm", group: "thunder" },
  96: { label: "Thunderstorm w/ Hail", group: "thunder" },
  99: { label: "Thunderstorm w/ Heavy Hail", group: "thunder" },
};

function getWeatherInfo(code) {
  return WMO[code] || { label: "Unknown", group: "clear" };
}

function getSeason(lat) {
  const month = new Date().getMonth();
  const isNorthern = lat >= 0;
  if (isNorthern) {
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "autumn";
    return "winter";
  }
  if (month >= 2 && month <= 4) return "autumn";
  if (month >= 5 && month <= 7) return "winter";
  if (month >= 8 && month <= 10) return "spring";
  return "summer";
}

function getTimePhase(hour) {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

// Gradient palettes per time-of-day + weather condition
function getGradient(timePhase, weatherGroup, isDay) {
  if (!isDay || timePhase === "night") {
    if (weatherGroup === "snow") return "linear-gradient(135deg, #1a1a3e 0%, #2d2b55 30%, #3a3570 60%, #1e1e3f 100%)";
    if (weatherGroup === "rain" || weatherGroup === "thunder") return "linear-gradient(135deg, #0d1117 0%, #161b22 40%, #1c2333 70%, #0d1117 100%)";
    if (weatherGroup === "cloudy" || weatherGroup === "fog") return "linear-gradient(135deg, #111827 0%, #1e293b 50%, #0f172a 100%)";
    return "linear-gradient(135deg, #0c1445 0%, #1a1a4e 30%, #0a1628 60%, #071236 100%)";
  }
  if (timePhase === "dawn") {
    if (weatherGroup === "rain") return "linear-gradient(135deg, #374151 0%, #6b7280 30%, #9ca3af 60%, #d1d5db 100%)";
    return "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 20%, #be185d 50%, #f59e0b 80%, #fbbf24 100%)";
  }
  if (timePhase === "dusk") {
    if (weatherGroup === "rain") return "linear-gradient(135deg, #1f2937 0%, #374151 30%, #6b7280 60%, #9ca3af 100%)";
    return "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 20%, #db2777 45%, #f97316 70%, #fbbf24 100%)";
  }
  // Day
  if (weatherGroup === "snow") return "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 30%, #a5b4fc 60%, #ddd6fe 100%)";
  if (weatherGroup === "rain" || weatherGroup === "drizzle") return "linear-gradient(135deg, #374151 0%, #4b5563 30%, #6b7280 50%, #9ca3af 80%, #d1d5db 100%)";
  if (weatherGroup === "thunder") return "linear-gradient(135deg, #1f2937 0%, #374151 30%, #4b5563 50%, #374151 80%, #1f2937 100%)";
  if (weatherGroup === "fog") return "linear-gradient(135deg, #d1d5db 0%, #e5e7eb 30%, #f3f4f6 50%, #e5e7eb 80%, #d1d5db 100%)";
  if (weatherGroup === "cloudy") return "linear-gradient(135deg, #60a5fa 0%, #93c5fd 25%, #bfdbfe 50%, #dbeafe 75%, #93c5fd 100%)";
  if (weatherGroup === "partlyCloudy") return "linear-gradient(135deg, #2563eb 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #60a5fa 100%)";
  // Clear
  if (timePhase === "morning") return "linear-gradient(135deg, #1d4ed8 0%, #2563eb 25%, #3b82f6 50%, #60a5fa 75%, #93c5fd 100%)";
  return "linear-gradient(135deg, #1e40af 0%, #1d4ed8 20%, #2563eb 45%, #3b82f6 70%, #60a5fa 100%)";
}

function getTextColor(timePhase, weatherGroup, isDay) {
  if (!isDay || timePhase === "night") return "#e2e8f0";
  if (weatherGroup === "snow") return "#1e1b4b";
  if (weatherGroup === "rain" || weatherGroup === "drizzle" || weatherGroup === "thunder") return "#f1f5f9";
  if (weatherGroup === "fog") return "#374151";
  if (timePhase === "dawn" || timePhase === "dusk") return "#fef3c7";
  return "#ffffff";
}

function getSubTextColor(timePhase, weatherGroup, isDay) {
  if (!isDay || timePhase === "night") return "rgba(226,232,240,0.6)";
  if (weatherGroup === "snow") return "rgba(30,27,75,0.55)";
  if (weatherGroup === "rain" || weatherGroup === "thunder") return "rgba(241,245,249,0.55)";
  if (weatherGroup === "fog") return "rgba(55,65,81,0.55)";
  if (timePhase === "dawn" || timePhase === "dusk") return "rgba(254,243,199,0.6)";
  return "rgba(255,255,255,0.6)";
}

function windDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

// ─── Inline CSS keyframes (injected once) ────────────────────────────────────
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const css = `
    @keyframes wx-float { 0%{transform:translateY(0) translateX(0)} 33%{transform:translateY(-8px) translateX(4px)} 66%{transform:translateY(4px) translateX(-3px)} 100%{transform:translateY(0) translateX(0)} }
    @keyframes wx-drift { 0%{transform:translateX(-100%)} 100%{transform:translateX(calc(100vw + 100%))} }
    @keyframes wx-fall { 0%{transform:translateY(-20px) rotate(0deg);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(200px) rotate(45deg);opacity:0} }
    @keyframes wx-rain-fall { 0%{transform:translateY(-10px) translateX(0);opacity:0} 5%{opacity:0.7} 95%{opacity:0.5} 100%{transform:translateY(200px) translateX(-20px);opacity:0} }
    @keyframes wx-shimmer { 0%{opacity:0.3} 50%{opacity:0.8} 100%{opacity:0.3} }
    @keyframes wx-pulse-glow { 0%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.15);opacity:1} 100%{transform:scale(1);opacity:0.6} }
    @keyframes wx-lightning { 0%{opacity:0} 1%{opacity:0.9} 2%{opacity:0} 3%{opacity:0.6} 4%{opacity:0} 100%{opacity:0} }
    @keyframes wx-star-twinkle { 0%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} 100%{opacity:0.2;transform:scale(0.8)} }
    @keyframes wx-gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes wx-fog-drift { 0%{transform:translateX(-5%) scaleX(1)} 50%{transform:translateX(5%) scaleX(1.1)} 100%{transform:translateX(-5%) scaleX(1)} }
    @keyframes wx-fadeIn { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes wx-temp-count { 0%{opacity:0;transform:scale(0.8)} 100%{opacity:1;transform:scale(1)} }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

// ─── Particle generators ─────────────────────────────────────────────────────

function renderSnowParticles(count) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const size = 3 + Math.random() * 5;
    const left = Math.random() * 100;
    const delay = Math.random() * 6;
    const dur = 4 + Math.random() * 4;
    particles.push(
      <div key={`snow-${i}`} style={{
        position: "absolute", width: size, height: size, borderRadius: "50%",
        background: "rgba(255,255,255,0.8)", left: `${left}%`, top: -10,
        animation: `wx-fall ${dur}s ${delay}s linear infinite`,
        filter: "blur(0.5px)",
      }} />
    );
  }
  return particles;
}

function renderRainParticles(count) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100;
    const delay = Math.random() * 3;
    const dur = 1.2 + Math.random() * 1;
    const width = 1.5 + Math.random() * 0.5;
    const height = 12 + Math.random() * 10;
    particles.push(
      <div key={`rain-${i}`} style={{
        position: "absolute", width, height, borderRadius: 2,
        background: "rgba(148,163,184,0.5)", left: `${left}%`, top: -15,
        animation: `wx-rain-fall ${dur}s ${delay}s linear infinite`,
      }} />
    );
  }
  return particles;
}

function renderStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const size = 1.5 + Math.random() * 2;
    const left = Math.random() * 100;
    const top = Math.random() * 70;
    const delay = Math.random() * 4;
    const dur = 2 + Math.random() * 3;
    stars.push(
      <div key={`star-${i}`} style={{
        position: "absolute", width: size, height: size, borderRadius: "50%",
        background: "#fff", left: `${left}%`, top: `${top}%`,
        animation: `wx-star-twinkle ${dur}s ${delay}s ease-in-out infinite`,
      }} />
    );
  }
  return stars;
}

function renderSunGlow(isDay) {
  if (!isDay) return null;
  return (
    <div style={{
      position: "absolute", top: -30, right: "8%", width: 120, height: 120,
      borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(251,191,36,0.15) 40%, transparent 70%)",
      animation: "wx-pulse-glow 4s ease-in-out infinite",
      filter: "blur(8px)",
    }} />
  );
}

function renderClouds(count, colorBase) {
  const clouds = [];
  for (let i = 0; i < count; i++) {
    const w = 80 + Math.random() * 100;
    const h = 20 + Math.random() * 16;
    const top = 5 + Math.random() * 55;
    const delay = Math.random() * 20;
    const dur = 25 + Math.random() * 20;
    const opacity = 0.08 + Math.random() * 0.12;
    clouds.push(
      <div key={`cloud-${i}`} style={{
        position: "absolute", width: w, height: h, top: `${top}%`, left: "-120px",
        borderRadius: "50%", background: colorBase, opacity,
        filter: `blur(${6 + Math.random() * 8}px)`,
        animation: `wx-drift ${dur}s ${delay}s linear infinite`,
      }} />
    );
  }
  return clouds;
}

function renderFogLayers() {
  const layers = [];
  for (let i = 0; i < 4; i++) {
    const top = 20 + i * 18;
    const opacity = 0.15 + Math.random() * 0.12;
    const dur = 8 + i * 3;
    layers.push(
      <div key={`fog-${i}`} style={{
        position: "absolute", top: `${top}%`, left: "-10%", width: "120%", height: 30,
        borderRadius: "50%", background: "rgba(255,255,255,0.5)", opacity,
        filter: "blur(20px)",
        animation: `wx-fog-drift ${dur}s ${i * 2}s ease-in-out infinite`,
      }} />
    );
  }
  return layers;
}

function renderLightning() {
  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(255,255,255,0.15)",
      animation: "wx-lightning 8s 2s ease-in-out infinite", pointerEvents: "none",
    }} />
  );
}

function renderParticles(weatherGroup, isDay, timePhase) {
  const elements = [];
  if (weatherGroup === "snow") {
    elements.push(...renderSnowParticles(30));
    elements.push(...renderClouds(3, "#e2e8f0"));
  } else if (weatherGroup === "rain" || weatherGroup === "drizzle") {
    elements.push(...renderRainParticles(weatherGroup === "drizzle" ? 15 : 35));
    elements.push(...renderClouds(4, "#64748b"));
  } else if (weatherGroup === "thunder") {
    elements.push(...renderRainParticles(40));
    elements.push(...renderClouds(5, "#475569"));
    elements.push(renderLightning());
  } else if (weatherGroup === "fog") {
    elements.push(...renderFogLayers());
  } else if (weatherGroup === "cloudy") {
    elements.push(...renderClouds(5, isDay ? "#fff" : "#94a3b8"));
  } else if (weatherGroup === "partlyCloudy") {
    elements.push(...renderClouds(3, isDay ? "#fff" : "#94a3b8"));
    if (isDay) elements.push(renderSunGlow(true));
    if (!isDay) elements.push(...renderStars(12));
  } else {
    // Clear
    if (isDay) {
      elements.push(renderSunGlow(true));
    } else {
      elements.push(...renderStars(25));
    }
  }
  return elements;
}

// ─── SVG Weather Icons (minimal, elegant) ────────────────────────────────────
function WeatherIcon({ group, isDay, color, size = 48 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  const stroke = color;
  const sw = 1.5;

  if (group === "clear" && isDay) {
    // Sun
    return (
      <svg style={s} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="9" stroke={stroke} strokeWidth={sw} fill="none" style={{ animation: "wx-pulse-glow 3s ease-in-out infinite" }} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const r1 = 14, r2 = 18;
          const rad = (deg * Math.PI) / 180;
          return <line key={i} x1={24 + r1 * Math.cos(rad)} y1={24 + r1 * Math.sin(rad)} x2={24 + r2 * Math.cos(rad)} y2={24 + r2 * Math.sin(rad)} stroke={stroke} strokeWidth={sw} strokeLinecap="round" style={{ animation: `wx-shimmer 2s ${i * 0.25}s ease-in-out infinite` }} />;
        })}
      </svg>
    );
  }
  if (group === "clear" && !isDay) {
    // Moon
    return (
      <svg style={s} viewBox="0 0 48 48" fill="none">
        <path d="M30 10a14 14 0 1 0 8 28 14 14 0 0 1-8-28z" stroke={stroke} strokeWidth={sw} fill="none" style={{ animation: "wx-pulse-glow 4s ease-in-out infinite" }} />
      </svg>
    );
  }
  if (group === "partlyCloudy") {
    return (
      <svg style={s} viewBox="0 0 48 48" fill="none">
        <circle cx="18" cy="16" r="7" stroke={stroke} strokeWidth={sw} fill="none" opacity="0.6" />
        <path d="M12 32a8 8 0 0 1 0-10 8 8 0 0 1 10-2 6 6 0 0 1 12 0 6 6 0 0 1 4 6 5 5 0 0 1-3 6z" stroke={stroke} strokeWidth={sw} fill="none" style={{ animation: "wx-float 6s ease-in-out infinite" }} />
      </svg>
    );
  }
  if (group === "cloudy" || group === "fog") {
    return (
      <svg style={s} viewBox="0 0 48 48" fill="none">
        <path d="M10 30a8 8 0 0 1 2-12 10 10 0 0 1 18-2 8 8 0 0 1 8 8 6 6 0 0 1-2 6z" stroke={stroke} strokeWidth={sw} fill="none" style={{ animation: "wx-float 7s ease-in-out infinite" }} />
        {group === "fog" && <><line x1="8" y1="36" x2="40" y2="36" stroke={stroke} strokeWidth={1} opacity="0.4" /><line x1="12" y1="40" x2="36" y2="40" stroke={stroke} strokeWidth={1} opacity="0.3" /></>}
      </svg>
    );
  }
  if (group === "rain" || group === "drizzle") {
    return (
      <svg style={s} viewBox="0 0 48 48" fill="none">
        <path d="M10 26a7 7 0 0 1 2-10 9 9 0 0 1 16-2 7 7 0 0 1 8 7 5 5 0 0 1-2 5z" stroke={stroke} strokeWidth={sw} fill="none" />
        {[16, 24, 32].map((x, i) => (
          <line key={i} x1={x} y1="33" x2={x - 2} y2="40" stroke={stroke} strokeWidth={sw} strokeLinecap="round" opacity="0.6" style={{ animation: `wx-shimmer 1.5s ${i * 0.3}s ease-in-out infinite` }} />
        ))}
      </svg>
    );
  }
  if (group === "snow") {
    return (
      <svg style={s} viewBox="0 0 48 48" fill="none">
        <path d="M10 26a7 7 0 0 1 2-10 9 9 0 0 1 16-2 7 7 0 0 1 8 7 5 5 0 0 1-2 5z" stroke={stroke} strokeWidth={sw} fill="none" />
        {[16, 24, 32].map((x, i) => (
          <circle key={i} cx={x} cy={36 + i * 2} r="2" stroke={stroke} strokeWidth={1} fill="none" style={{ animation: `wx-shimmer 2s ${i * 0.5}s ease-in-out infinite` }} />
        ))}
      </svg>
    );
  }
  if (group === "thunder") {
    return (
      <svg style={s} viewBox="0 0 48 48" fill="none">
        <path d="M10 24a7 7 0 0 1 2-10 9 9 0 0 1 16-2 7 7 0 0 1 8 7 5 5 0 0 1-2 5z" stroke={stroke} strokeWidth={sw} fill="none" />
        <polyline points="22,28 20,35 26,33 23,42" stroke="#fbbf24" strokeWidth={2} fill="none" strokeLinejoin="round" style={{ animation: "wx-shimmer 1.5s ease-in-out infinite" }} />
      </svg>
    );
  }
  // Default
  return (
    <svg style={s} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="10" stroke={stroke} strokeWidth={sw} fill="none" />
    </svg>
  );
}

// ─── Main Widget ─────────────────────────────────────────────────────────────

const CACHE_KEY = "wx_cache";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

class WeatherWidget extends Component {
  constructor(props) {
    super(props);
    // Immediately load cached data so there's zero flash of "Loading..."
    const cached = WeatherWidget.readCache();
    this.state = {
      weather: cached?.weather || null,
      location: cached?.location || null,
      loading: !cached,
      error: null,
    };
  }

  static readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts < CACHE_TTL) return parsed;
    } catch (_) {}
    return null;
  }

  static writeCache(weather, location) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ weather, location, ts: Date.now() }));
    } catch (_) {}
  }

  componentDidMount() {
    injectStyles();
    this.fetchWeather();
  }

  getLocation = () => {
    // Race browser geolocation vs IP lookup — whoever resolves first wins
    const geoPromise = new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("No geolocation"));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        reject,
        { timeout: 3000, maximumAge: 600000, enableHighAccuracy: false }
      );
    });

    const ipPromise = new Promise((resolve, reject) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => { ctrl.abort(); reject(new Error("IP timeout")); }, 3000);
      fetch("https://ipapi.co/json/", { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => {
          clearTimeout(timer);
          if (d?.latitude && d?.longitude) resolve({ lat: d.latitude, lon: d.longitude });
          else reject(new Error("No coords"));
        })
        .catch((e) => { clearTimeout(timer); reject(e); });
    });

    return Promise.any([geoPromise, ipPromise]).catch(() => ({ lat: 40.7128, lon: -74.006 }));
  };

  fetchWeather = async () => {
    try {
      // If we already have cached data showing, fetch fresh in background (no loading state)
      const hasCached = !!this.state.weather;

      const { lat, lon } = await this.getLocation();

      // Fetch weather + reverse geocode in parallel
      const [weatherRes, geoRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day,uv_index` +
          `&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset` +
          `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=1`
        ).then((r) => r.json()),
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`,
          { headers: { "Accept-Language": "en" } }
        ).then((r) => r.json()).catch(() => null),
      ]);

      const city = geoRes?.address?.city || geoRes?.address?.town || geoRes?.address?.county || "Your Area";
      const state = geoRes?.address?.state || "";

      const weather = {
        temp: Math.round(weatherRes.current.temperature_2m),
        feelsLike: Math.round(weatherRes.current.apparent_temperature),
        humidity: weatherRes.current.relative_humidity_2m,
        windSpeed: Math.round(weatherRes.current.wind_speed_10m),
        windDir: weatherRes.current.wind_direction_10m,
        uvIndex: weatherRes.current.uv_index,
        weatherCode: weatherRes.current.weather_code,
        isDay: weatherRes.current.is_day === 1,
        high: Math.round(weatherRes.daily.temperature_2m_max[0]),
        low: Math.round(weatherRes.daily.temperature_2m_min[0]),
        sunrise: weatherRes.daily.sunrise?.[0],
        sunset: weatherRes.daily.sunset?.[0],
      };
      const location = { city, state, lat, lon };

      WeatherWidget.writeCache(weather, location);
      this.setState({ weather, location, loading: false });
    } catch (err) {
      console.error("[Weather] Fetch error:", err);
      // If we have cache, keep showing it; otherwise show error
      if (!this.state.weather) {
        this.setState({ error: err.message, loading: false });
      }
    }
  };

  render() {
    const { weather, location, loading, error } = this.state;

    if (loading) {
      return (
        <div style={{
          width: "100%", height: 140, borderRadius: 20, marginBottom: 24,
          background: "var(--color-bg-card)", border: "1px solid var(--color-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "wx-shimmer 2s ease-in-out infinite",
        }}>
          <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 500 }}>Loading weather...</span>
        </div>
      );
    }

    if (error || !weather) return null;

    const hour = new Date().getHours();
    const timePhase = getTimePhase(hour);
    const { label: conditionLabel, group: weatherGroup } = getWeatherInfo(weather.weatherCode);
    const season = getSeason(location?.lat || 40);
    const gradient = getGradient(timePhase, weatherGroup, weather.isDay);
    const textColor = getTextColor(timePhase, weatherGroup, weather.isDay);
    const subColor = getSubTextColor(timePhase, weatherGroup, weather.isDay);

    const seasonWord = season.charAt(0).toUpperCase() + season.slice(1);
    const timeWord = timePhase === "dawn" ? "Dawn" : timePhase === "dusk" ? "Dusk" : timePhase === "night" ? "Night" : timePhase === "morning" ? "Morning" : "Afternoon";

    return (
      <div style={{
        position: "relative", width: "100%", borderRadius: 20, overflow: "hidden",
        marginBottom: 24, background: gradient, backgroundSize: "200% 200%",
        animation: "wx-gradient-shift 12s ease infinite",
        boxShadow: "0 8px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}>
        {/* Particle Layer */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          {renderParticles(weatherGroup, weather.isDay, timePhase)}
        </div>

        {/* Frosted Glass Overlay */}
        <div style={{
          position: "relative", zIndex: 2,
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(1px)", WebkitBackdropFilter: "blur(1px)",
          padding: "28px 32px 24px",
        }}>
          {/* Main Content Row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16,
            animation: "wx-fadeIn 0.8s ease-out",
          }}>
            {/* Left: Icon + Temp */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <WeatherIcon group={weatherGroup} isDay={weather.isDay} color={textColor} size={52} />
              <div>
                <div style={{
                  fontSize: 48, fontWeight: 200, letterSpacing: "-0.04em", lineHeight: 1,
                  color: textColor, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                  animation: "wx-temp-count 0.6s ease-out",
                }}>
                  {weather.temp}<span style={{ fontSize: 24, fontWeight: 300, verticalAlign: "top", marginLeft: 2 }}>°F</span>
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 500, color: textColor, marginTop: 2,
                  letterSpacing: "0.01em",
                }}>
                  {conditionLabel}
                </div>
              </div>
            </div>

            {/* Center: Details */}
            <div style={{
              display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: subColor, marginBottom: 3 }}>Feels Like</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: textColor }}>{weather.feelsLike}°</div>
              </div>
              <div style={{ width: 1, height: 28, background: `${textColor}15` }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: subColor, marginBottom: 3 }}>High / Low</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: textColor }}>{weather.high}° / {weather.low}°</div>
              </div>
              <div style={{ width: 1, height: 28, background: `${textColor}15` }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: subColor, marginBottom: 3 }}>Wind</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: textColor }}>{weather.windSpeed} mph {windDirection(weather.windDir)}</div>
              </div>
              <div style={{ width: 1, height: 28, background: `${textColor}15` }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: subColor, marginBottom: 3 }}>Humidity</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: textColor }}>{weather.humidity}%</div>
              </div>
              {weather.uvIndex > 0 && weather.isDay && (
                <>
                  <div style={{ width: 1, height: 28, background: `${textColor}15` }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: subColor, marginBottom: 3 }}>UV Index</div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: textColor }}>{Math.round(weather.uvIndex)}</div>
                  </div>
                </>
              )}
            </div>

            {/* Right: Location + Season */}
            <div style={{ textAlign: "right", minWidth: 120 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: textColor, marginBottom: 2 }}>
                {location?.city || "---"}
              </div>
              {location?.state && (
                <div style={{ fontSize: 12, color: subColor, marginBottom: 4 }}>{location.state}</div>
              )}
              <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                color: subColor,
                padding: "3px 10px", borderRadius: 999,
                background: `${textColor}10`, display: "inline-block",
              }}>
                {seasonWord} {timeWord}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WeatherWidget;
