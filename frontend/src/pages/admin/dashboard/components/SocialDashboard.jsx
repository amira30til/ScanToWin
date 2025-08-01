import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useChartData } from "../hooks/useChartData";
import { useSelectStat } from "../hooks/useSelectStat";
import { useAxiosPrivate } from "@/hooks";
import { useDisclosure } from "@chakra-ui/react";

import {
  getActionsByShop,
  getChosenActionClickedAt,
  getChosenActionRedeemedAt,
  // getGamePlayedAt
} from "@/services/actionService";

import HeaderAdmin from "@/components/nav/HeaderAdmin";
import StatBox from "./StatBox";

import {
  Box,
  Flex,
  Select,
  Spinner,
  Input,
  Alert,
  AlertIcon,
  CloseButton,
  Text,
} from "@chakra-ui/react";
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

import { UserPlus, Gamepad2, Gift } from "lucide-react";

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
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultRange = searchParams.get("range") || "today";
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const from = searchParams.get("from") || today;
  const to = searchParams.get("to") || today;

  const axiosPrivate = useAxiosPrivate();

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
      const response = await getChosenActionClickedAt(axiosPrivate, actionId);
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
      const response = await getChosenActionRedeemedAt(axiosPrivate, actionId);
      const data = response.data.data.data;
      return data.map((action) => action.redeemedAt);
    },
    enabled: !!actionId,
  });

  //   const {
  //   data: gamePlayedTimestamps,
  //   isLoading: gamePlayedTimestampsLoading,
  // } = useQuery({
  //   queryKey: ["game-played-timestamps", actionId],
  //   queryFn: async () => {
  //     const response = await getGamePlayedAt(axiosPrivate, actionId);
  //     const data = response.data.data.data;
  //     return data.map((action) => action.playedAt);
  //   },
  //   enabled: !!actionId,
  // });

  const clickedSelected = useSelectStat(actionClickedTimestamps);
  const redeemedSelected = useSelectStat(actionRedeemedTimestamps);
  // const gamePlayedSelected = useSelectStat(actionPlayedTimestamps);
  const gamePlayedSelected = [];

  const combinedChartData = useChartData(
    clickedSelected,
    redeemedSelected,
    gamePlayedSelected,
  );

  const rangeHandler = (event, key) => {
    const value = event.target.value;

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set(key, value);
      return newParams;
    });
  };

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
            onChange={(event) => rangeHandler(event, "range")}
            value={defaultRange}
          >
            <option value="today">Today</option>
            <option value="1">Yesterday</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
            <option value="custom">Custom date</option>
          </Select>
          {defaultRange === "custom" && (
            <Flex>
              <Flex gap={2} mt={2}>
                <Input
                  type="date"
                  value={from}
                  onChange={(event) => rangeHandler(event, "from")}
                  bg="surface.popover"
                />
                <Input
                  type="date"
                  value={to}
                  onChange={(event) => rangeHandler(event, "to")}
                  bg="surface.popover"
                />
              </Flex>
            </Flex>
          )}
        </Flex>

        {isLoadingActions ||
        actionClickedTimestampsLoading ||
        // gamePlayedTimestampsLoading ||
        actionRedeemedTimestampsLoading ? (
          <Flex minH="100%" w="100%" align="center" justify="center">
            <Spinner display="flex" align="center" color="secondary.500" />
          </Flex>
        ) : (
          <Box>
            <Flex gap={4} justify="start">
              <StatBox
                title="Nombre d'abonnées"
                value={clickedSelected}
                total={actionClickedTimestamps}
                icon={UserPlus}
              />

              <StatBox
                title="Cadeaux Gagnés"
                value={redeemedSelected}
                total={actionRedeemedTimestamps}
                icon={Gamepad2}
              />

              <StatBox
                title="Jeux Lancées"
                value={gamePlayedSelected}
                // total={gamePlayedTimestamps}
                icon={Gift}
              />
            </Flex>
            <Box bg="surface.popover" borderRadius="md" px={6} py={4} mt={6}>
              <Bar options={options} data={combinedChartData} />
            </Box>
            {isOpen && (
              <Alert
                status="info"
                variant="left-accent"
                my={4}
                borderRadius="md"
                display="flex"
                justifyContent="space-between"
              >
                <Flex align="center">
                  <AlertIcon />
                  <Text>
                    Click on the legend items to toggle the visibility of each
                    statistic on the chart.
                  </Text>
                </Flex>
                <CloseButton alignSelf="flex-start" onClick={onClose} />
              </Alert>
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default SocialDashboard;
