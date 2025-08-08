import { useMemo } from "react";
import { format, parseISO, isAfter, subDays } from "date-fns";
import { useToken } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const filterTimestampsByRange = (timestamps, range, customFrom, customTo) => {
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
      return timestamps.filter((ts) => isAfter(parseISO(ts), subDays(now, 7)));
    case "30":
      return timestamps.filter((ts) => isAfter(parseISO(ts), subDays(now, 30)));
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
      end.setHours(23, 59, 59, 999); // Include entire 'to' day

      return timestamps.filter((ts) => {
        const date = parseISO(ts);
        return date >= start && date <= end;
      });
    default:
      return timestamps;
  }
};

const groupRewardsByDay = (timestamps) => {
  return timestamps.reduce((acc, timestamp) => {
    const day = format(parseISO(timestamp), "yyyy-MM-dd");
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
};

const prepareChartData = (groupedDataList) => {
  const allDates = Array.from(
    new Set(groupedDataList.flatMap(({ data }) => Object.keys(data))),
  ).sort();

  const datasets = groupedDataList.map(({ data, label, color }) => ({
    label,
    data: allDates.map((date) => data[date] || 0),
    backgroundColor: color,
  }));

  return {
    labels: allDates,
    datasets,
  };
};

export const useCombinedChartData = ({
  clicked,
  redeemed,
  range,
  customFrom,
  customTo,
}) => {
  const [primary300] = useToken("colors", ["primary.300"]);
  const [secondary300] = useToken("colors", ["secondary.300"]);
  const { t } = useTranslation();

  const clickedFilteredTimestamps = useMemo(() => {
    return filterTimestampsByRange(clicked, range, customFrom, customTo);
  }, [clicked, range, customFrom, customTo]);

  const redeemedFilteredTimestamps = useMemo(() => {
    return filterTimestampsByRange(redeemed, range, customFrom, customTo);
  }, [redeemed, range, customFrom, customTo]);

  const combinedChartData = useMemo(() => {
    if (
      !clickedFilteredTimestamps.length &&
      !redeemedFilteredTimestamps.length
    ) {
      return { labels: [], datasets: [] };
    }

    const clickedGrouped = groupRewardsByDay(clickedFilteredTimestamps);
    const redeemedGrouped = groupRewardsByDay(redeemedFilteredTimestamps);

    return prepareChartData([
      {
        data: clickedGrouped,
        label: t("chart.launched_games"),
        color: primary300,
      },
      {
        data: redeemedGrouped,
        label: t("chart.redeemed_rewards"),
        color: secondary300,
      },
    ]);
  }, [clickedFilteredTimestamps, redeemedFilteredTimestamps]);

  return {
    combinedChartData,
    clickedFilteredTimestamps,
    redeemedFilteredTimestamps,
  };
};
