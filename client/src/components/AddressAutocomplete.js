import React, { useRef, useEffect, useState, useCallback } from "react";

// Google Maps script loader (singleton)
let googleScriptPromise = null;
function loadGoogleMaps(apiKey) {
  if (googleScriptPromise) return googleScriptPromise;
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve();
  }
  googleScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Google Maps script failed to load"));
    document.head.appendChild(script);
  });
  return googleScriptPromise;
}

/**
 * AddressAutocomplete — Google Places powered address field.
 *
 * Props:
 *   value       - current input value
 *   onChange     - (value) => void for the text field
 *   onSelect    - ({ address, address2, city, state, stateCode, zip, county, lat, lng, placeId, formatted }) => void
 *   placeholder - input placeholder
 *   className   - CSS class for the input
 *   name        - input name attribute
 *   id          - input id attribute
 *   style       - inline style object
 *   disabled    - disable the input
 *   country     - restrict to country (default "us")
 */
const AddressAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = "Start typing an address...",
  className = "form-control",
  name,
  id,
  style,
  disabled,
  country = "us",
  inputRef: externalRef,
}) => {
  const internalRef = useRef(null);
  const inputRef = externalRef || internalRef;
  const autocompleteRef = useRef(null);
  const [ready, setReady] = useState(false);

  const apiKey = process.env.REACT_APP_GOOGLE_PLACES_KEY;

  useEffect(() => {
    if (!apiKey) {
      console.warn("[AddressAutocomplete] No REACT_APP_GOOGLE_PLACES_KEY set");
      return;
    }
    loadGoogleMaps(apiKey).then(() => setReady(true)).catch(console.error);
  }, [apiKey]);

  const handlePlaceSelect = useCallback(() => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place || !place.address_components) return;

    const components = place.address_components;
    const get = (type, field = "long_name") => {
      const comp = components.find((c) => c.types.includes(type));
      return comp ? comp[field] : "";
    };

    const streetNumber = get("street_number");
    const route = get("route");
    const address = [streetNumber, route].filter(Boolean).join(" ");
    const subpremise = get("subpremise");
    const city =
      get("locality") ||
      get("sublocality_level_1") ||
      get("administrative_area_level_3") ||
      get("neighborhood") ||
      "";
    const county = get("administrative_area_level_2").replace(" County", "");
    const stateLong = get("administrative_area_level_1");
    const stateCode = get("administrative_area_level_1", "short_name");
    const zip = get("postal_code");
    const lat = place.geometry?.location?.lat() || null;
    const lng = place.geometry?.location?.lng() || null;

    // Update the text field
    if (onChange) onChange(address);

    // Fire structured callback
    if (onSelect) {
      onSelect({
        address,
        address2: subpremise || "",
        city,
        state: stateLong,
        stateCode,
        zip,
        county,
        lat,
        lng,
        placeId: place.place_id || "",
        formatted: place.formatted_address || "",
      });
    }
  }, [onChange, onSelect]);

  useEffect(() => {
    if (!ready || !inputRef.current) return;
    if (autocompleteRef.current) return; // already initialized

    const options = {
      types: ["address"],
      componentRestrictions: { country: country },
      fields: ["address_components", "geometry", "place_id", "formatted_address"],
    };

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
  }, [ready, handlePlaceSelect, country, inputRef]);

  return (
    <input
      ref={inputRef}
      type="text"
      className={className}
      name={name}
      id={id}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      style={style}
      disabled={disabled}
      autoComplete="off"
    />
  );
};

export default AddressAutocomplete;
