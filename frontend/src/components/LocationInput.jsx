import React, { useEffect, useRef, useState } from "react";

const LocationInput = () => {
  const inputRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "us" },
      },
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      console.log("Selected place:", place);
    });
  }, [loaded]);

  useEffect(() => {
    if (window.google) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_MAPS_API_KEY}&libraries=maps,places&v=beta`;
    script.async = true;
    script.defer = true;

    script.onload = () => setLoaded(true);

    document.body.appendChild(script);
  }, []);

  return <input ref={inputRef} type="text" placeholder="Enter a location" />;
};

export default LocationInput;
