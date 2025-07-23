import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// import axios from "axios";

import { getActionsByShop } from "@/services/actionService";

import {
  Box,
  Flex,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react";
import HeaderAdmin from "@/components/HeaderAdmin";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { format, parseISO, isAfter, subDays } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Rewards Over Time",
    },
  },
};

const groupRewardsByDay = (timestamps) => {
  return timestamps.reduce((acc, timestamp) => {
    const day = format(parseISO(timestamp), "yyyy-MM-dd");
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
};

const prepareChartData = (groupedData) => {
  const labels = Object.keys(groupedData).sort();
  const values = labels.map((label) => groupedData[label]);

  return {
    labels,
    datasets: [
      {
        label: "Rewards",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };
};

// MOCKED DATA FOR TESTING
const MOCK_REWARD_TIMESTAMPS = [
  "2025-07-22T10:00:00Z",
  "2025-07-22T11:30:00Z",
  "2025-07-21T14:00:00Z",
  "2025-07-20T09:15:00Z",
  "2025-07-20T10:45:00Z",
  "2025-07-18T08:30:00Z",
  "2025-07-15T16:00:00Z",
  "2025-07-10T13:00:00Z",
  "2025-06-25T12:00:00Z",
  "2025-06-10T18:15:00Z",
  "2025-05-30T14:45:00Z",
  "2025-05-01T09:10:00Z",
  "2025-04-15T08:00:00Z",
  "2025-03-25T20:00:00Z",
  "2025-03-05T17:30:00Z",
  "2025-02-10T11:25:00Z",
  "2025-01-01T10:00:00Z",
  "2024-12-15T13:40:00Z",
  "2024-11-25T07:55:00Z",
  "2024-10-10T18:20:00Z",
  "2024-09-18T09:50:00Z",
  "2024-08-01T15:35:00Z",
  "2024-07-14T12:15:00Z",
  "2024-06-30T16:45:00Z",
  "2024-06-10T11:30:00Z",
  "2024-05-20T14:00:00Z",
  "2024-04-05T17:45:00Z",
  "2024-03-15T10:10:00Z",
  "2024-02-25T08:30:00Z",
  "2024-02-10T19:20:00Z",
  "2024-01-05T13:15:00Z",
  "2023-12-22T11:00:00Z",
  "2023-11-18T16:00:00Z",
  "2023-10-01T14:45:00Z",
  "2023-09-10T09:30:00Z",
  "2023-08-28T20:00:00Z",
  "2023-08-15T10:00:00Z",
  "2023-07-30T07:00:00Z",
  "2023-07-10T15:00:00Z",
  "2023-07-01T13:00:00Z",
];

const SocialDashboard = ({ title, social }) => {
  const { shopId } = useParams();
  const [range, setRange] = useState("30"); // Default to last 30 days

  const { data: actionsByShop, isLoading: isLoadingActions } = useQuery({
    queryKey: ["actions-by-shop", shopId],
    queryFn: async () => {
      const response = await getActionsByShop(shopId);
      return response.data.data.chosenActions;
    },
    enabled: !!shopId,
  });

  // MOCK: Simulate fetched reward timestamps
  const rewardTimestamps = MOCK_REWARD_TIMESTAMPS;
  const isLoadingTimestamps = false;

  // If you're ready to use the actual endpoint later:
  /*
  const { data: rewardTimestamps, isLoading: isLoadingTimestamps } = useQuery({
    queryKey: ["rewards-timestamps", shopId],
    queryFn: async () => {
      const response = await axios.get(`/shop/${shopId}/dashboard/rewards`);
      return response.data.data;
    },
    enabled: !!shopId,
  });
  */

  const filteredTimestamps = useMemo(() => {
    if (!rewardTimestamps) return [];
    const now = new Date();

    switch (range) {
      case "today":
        return rewardTimestamps.filter((ts) => {
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

        return rewardTimestamps.filter((ts) => {
          const date = parseISO(ts);
          return date >= start && date < end;
        });
      }
      case "7":
        return rewardTimestamps.filter((ts) =>
          isAfter(parseISO(ts), subDays(now, 7)),
        );
      case "30":
        return rewardTimestamps.filter((ts) =>
          isAfter(parseISO(ts), subDays(now, 30)),
        );
      case "month":
        return rewardTimestamps.filter((ts) => {
          const date = parseISO(ts);
          return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth()
          );
        });
      case "year":
        return rewardTimestamps.filter((ts) => {
          const date = parseISO(ts);
          return date.getFullYear() === now.getFullYear();
        });
      case "custom":
        // TODO: handle custom date range using a DatePicker component
        return rewardTimestamps; // fallback: return all
      default:
        return rewardTimestamps;
    }
  }, [rewardTimestamps, range]);

  const chartData = useMemo(() => {
    if (!filteredTimestamps.length) return { labels: [], datasets: [] };
    const grouped = groupRewardsByDay(filteredTimestamps);
    return prepareChartData(grouped);
  }, [filteredTimestamps]);

  useEffect(() => {
    if (actionsByShop) {
      const currentAction = actionsByShop.find(
        (action) => action.name === social,
      );
      console.log("Current Action:", currentAction);
    }
  }, [actionsByShop]);

  if (isLoadingActions || isLoadingTimestamps) return <Box>Loading...</Box>;

  return (
    <Box pos="relative">
      <HeaderAdmin title={title} />
      <Flex direction="column" gap={10} px={8} py={10} overflowX="hidden">
        <Flex>
          <Select
            maxW="300px"
            bg="white"
            borderRadius="md"
            fontWeight="bold"
            focusBorderColor="primary.500"
            cursor="pointer"
            onChange={(e) => setRange(e.target.value)}
            value={range}
          >
            <option value="today">Today</option>
            <option value="1">Yesterday</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
            <option value="custom">Custom date</option>
          </Select>
        </Flex>
        <Box bg="surface.popover" borderRadius="md" p={6}>
          <StatGroup>
            <Stat>
              <StatLabel>Total Rewards</StatLabel>
              <StatNumber>{rewardTimestamps?.length || 0}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12%
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>In Selected Range</StatLabel>
              <StatNumber>{filteredTimestamps.length}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                7%
              </StatHelpText>
            </Stat>
          </StatGroup>
          <Bar options={options} data={chartData} />
        </Box>
      </Flex>
    </Box>
  );
};

export default SocialDashboard;
