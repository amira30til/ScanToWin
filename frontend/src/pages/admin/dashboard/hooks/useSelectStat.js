import { useMemo } from "react";
import {
  parseISO,
  isAfter,
  subDays,
  isBefore,
  isWithinInterval,
} from "date-fns";
import { useLocation } from "react-router-dom";

const selectTimestampsByRange = (timestamps, range, customFrom, customTo) => {
  if (!timestamps) return [];

  const now = new Date();

  switch (range) {
    case "today":
      return timestamps.filter((ts) => {
        const date = parseISO(ts);
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate()
        );
      });
    case "1": {
      const start = new Date(now);
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);

      const end = new Date(now);
      end.setHours(0, 0, 0, 0);

      return timestamps.filter((ts) => {
        const date = parseISO(ts);
        return date >= start && date < end;
      });
    }
    case "7":
      const newDate = new Date();
      const sevenDaysAgo = subDays(newDate, 7);
      const result = timestamps.filter((ts) => {
        const date = parseISO(ts);
        return isWithinInterval(date, { start: sevenDaysAgo, end: now });
      });
      return result;
    case "30":
      return timestamps.filter((ts) => {
        const date = parseISO(ts);
        return isAfter(date, subDays(now, 30)) && isBefore(date, now);
      });
    case "month":
      return timestamps.filter((ts) => {
        const date = parseISO(ts);
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth()
        );
      });
    case "year":
      return timestamps.filter((ts) => {
        const date = parseISO(ts);
        return date.getFullYear() === now.getFullYear();
      });
    case "custom":
      if (!customFrom || !customTo) return timestamps;

      const start = new Date(customFrom);
      const end = new Date(customTo);
      end.setHours(23, 59, 59, 999);

      return timestamps.filter((ts) => {
        const date = parseISO(ts);
        return date >= start && date <= end;
      });
    default:
      return timestamps;
  }
};

export const useSelectStat = (stat) => {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const range = params.get("range") || "today";
  const from = params.get("from") || today;
  const to = params.get("to") || today;

  return useMemo(() => {
    return selectTimestampsByRange(stat, range, from, to);
  }, [stat, range, from, to]);
};
