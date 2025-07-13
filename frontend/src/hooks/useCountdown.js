import { useEffect, useState } from "react";

export function useCountdown(targetTimestamp) {
  const [timeLeft, setTimeLeft] = useState(() =>
    targetTimestamp ? Math.max(targetTimestamp - Date.now(), 0) : 0,
  );

  useEffect(() => {
    if (!targetTimestamp) return;

    const interval = setInterval(() => {
      const diff = targetTimestamp - Date.now();
      setTimeLeft(Math.max(diff, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    expired: timeLeft <= 0,
    raw: timeLeft,
  };
}
