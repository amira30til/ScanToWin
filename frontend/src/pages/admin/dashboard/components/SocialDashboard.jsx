import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCombinedChartData } from "../hooks/useCombinedChartData";

import {
  getActionsByShop,
  getChosenActionClickedAt,
  getChosenActionRedeemedAt,
} from "@/services/actionService";

import HeaderAdmin from "@/components/nav/HeaderAdmin";
import StatBox from "./StatBox";

import { Box, Flex, Select, Spinner, Input } from "@chakra-ui/react";
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

import { IoLogoGameControllerB } from "react-icons/io";
import { FaGift } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return Number.isInteger(value) ? value : "";
        },
        stepSize: 1,
      },
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const SocialDashboard = ({ title, social }) => {
  const { shopId } = useParams();
  const [actionId, setActionId] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultRange = searchParams.get("range") || "today";
  const [range, setRange] = useState(defaultRange);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const { data: actionsByShop, isLoading: isLoadingActions } = useQuery({
    queryKey: ["actions-by-shop", shopId],
    queryFn: async () => {
      const response = await getActionsByShop(shopId);
      return response.data.data.chosenActions;
    },
    enabled: !!shopId,
  });

  const {
    data: actionClickedTimestamps,
    isLoading: actionClickedTimestampsLoading,
  } = useQuery({
    queryKey: ["action-clicked-timestamps", actionId],
    queryFn: async () => {
      const response = await getChosenActionClickedAt(actionId);
      const data = response.data.data.data;
      return data.map((action) => action.clickedAt);
    },
    enabled: !!actionId,
  });

  const {
    data: actionRedeemedTimestamps,
    isLoading: actionRedeemedTimestampsLoading,
  } = useQuery({
    queryKey: ["action-redeemed-timestamps", actionId],
    queryFn: async () => {
      const response = await getChosenActionRedeemedAt(actionId);
      const data = response.data.data.data;
      return data.map((action) => action.redeemedAt);
    },
    enabled: !!actionId,
  });

  const {
    combinedChartData,
    clickedFilteredTimestamps,
    redeemedFilteredTimestamps,
  } = useCombinedChartData({
    clicked: actionClickedTimestamps,
    redeemed: actionRedeemedTimestamps,
    range,
    customFrom,
    customTo,
  });

  useEffect(() => {
    if (actionsByShop) {
      const currentAction = actionsByShop.find(
        (action) => action.name === social,
      );
      if (currentAction) {
        setActionId(currentAction.id);
      } else {
        navigate(`/admin/${shopId}/dashboard`);
      }
    }
  }, [actionsByShop, social]);

  useEffect(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("range", range);
      return newParams;
    });
  }, [range, setSearchParams]);

  return (
    <Box pos="relative">
      <HeaderAdmin title={title} />
      <Flex direction="column" gap={10} px={8} py={10} overflowX="hidden">
        <Flex direction="column" gap={2}>
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
          {range === "custom" && (
            <Flex>
              <Flex gap={2} mt={2}>
                <Input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  bg="surface.popover"
                />
                <Input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  bg="surface.popover"
                />
              </Flex>
            </Flex>
          )}
        </Flex>

        {isLoadingActions ||
        actionClickedTimestampsLoading ||
        actionRedeemedTimestampsLoading ? (
          <Flex minH="100%" w="100%" align="center" justify="center">
            <Spinner display="flex" align="center" color="secondary.500" />
          </Flex>
        ) : (
          <Box>
            <Flex gap={4} justify="start">
              <StatBox
                title="Jeux Lancées"
                value={redeemedFilteredTimestamps}
                total={actionRedeemedTimestamps}
                icon={IoLogoGameControllerB}
              />

              <StatBox
                title="Cadeaux Gagnés"
                value={clickedFilteredTimestamps}
                total={actionClickedTimestamps}
                icon={FaGift}
              />
            </Flex>
            <Box bg="surface.popover" borderRadius="md" px={6} py={4} mt={6}>
              <Bar options={options} data={combinedChartData} />
            </Box>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default SocialDashboard;
