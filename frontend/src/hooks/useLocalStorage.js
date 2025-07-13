import { useState, useEffect } from "react";

export function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item || item === "undefined") return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error("useLocalStorage error (get):", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("useLocalStorage error (set):", error);
    }
  }, [key, storedValue]);

  const remove = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.error("useLocalStorage error (remove):", error);
    }
  };

  return [storedValue, setStoredValue, remove];
}
