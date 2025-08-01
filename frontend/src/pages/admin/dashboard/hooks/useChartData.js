import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { useToken } from "@chakra-ui/react";

const rewardsGroupBy = (timestamps) => {
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

export const useChartData = (clicked, redeemed, gamePlayed) => {
  const [primary300] = useToken("colors", ["primary.300"]);
  const [secondary300] = useToken("colors", ["secondary.300"]);
  const [tertiary300] = useToken("colors", ["tertiary.300"]);

  const combinedChartData = useMemo(() => {
    const clickedGrouped = rewardsGroupBy(clicked);
    const redeemedGrouped = rewardsGroupBy(redeemed);
    const socialDataGrouped = rewardsGroupBy(gamePlayed);

    return prepareChartData([
      {
        data: clickedGrouped || [],
        label: "Jeux lancés",
        color: primary300,
      },
      {
        data: redeemedGrouped || [],
        label: "Cadeaux gagnés",
        color: secondary300,
      },
      {
        data: socialDataGrouped || [],
        label: "Nombre d'abonnées",
        color: tertiary300,
      },
    ]);
  }, [clicked, redeemed, gamePlayed]);

  return combinedChartData;
};
