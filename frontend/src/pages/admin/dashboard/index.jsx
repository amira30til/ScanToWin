import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { useChartData } from "./hooks/useChartData";
import { useAxiosPrivate } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useSelectStat } from "./hooks/useSelectStat";
import { useDisclosure } from "@chakra-ui/react";

import {
  getShopActionClick,
  getShopActionRedeem,
  getShopActionPlay,
} from "@/services/actionService";

import HeaderAdmin from "@/components/nav/HeaderAdmin";
import StatBox from "./components/StatBox";

import {
  Box,
  Flex,
  Select,
  Spinner,
  Input,
  Alert,
  AlertIcon,
  Text,
  CloseButton,
} from "@chakra-ui/react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

import { UserPlus, Gamepad2, Gift } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

const barOptions = {
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

export const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const Dashboard = () => {
  const { t } = useTranslation();

  const { shopId } = useParams();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultRange = searchParams.get("range") || "today";
  const axiosPrivate = useAxiosPrivate();
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const from = searchParams.get("from") || today;
  const to = searchParams.get("to") || today;

  const { data: shopActionClick, isLoading: shopActionClickIsLoading } =
    useQuery({
      queryKey: ["shop-action-click", shopId],
      queryFn: async () => {
        const response = await getShopActionClick(axiosPrivate, shopId);
        const data = response.data.data.data;
        return data.map((action) => action.clickedAt);
      },
      enabled: !!shopId,
    });

  const { data: shopActionRedeem, isLoading: shopActionRedeemIsLoading } =
    useQuery({
      queryKey: ["shop-action-redeem", shopId],
      queryFn: async () => {
        const response = await getShopActionRedeem(axiosPrivate, shopId);
        const data = response.data.data.data;
        return data.map((action) => action.redeemedAt);
      },
      enabled: !!shopId,
    });

  const { data: shopActionPlay, isLoading: shopActionPlayIsLoading } = useQuery(
    {
      queryKey: ["shop-action-play", shopId],
      queryFn: async () => {
        const response = await getShopActionPlay(axiosPrivate, shopId);
        const data = response.data.data.data;
        return data.map((action) => action.playedAt);
      },
      enabled: !!shopId,
    },
  );

  const clickedSelected = useSelectStat(shopActionClick);
  const redeemedSelected = useSelectStat(shopActionRedeem);
  const gamePlayedSelected = useSelectStat(shopActionPlay);

  const combinedChartDataBar = useChartData(
    [],
    redeemedSelected,
    gamePlayedSelected,
  );

  const combinedChartDataLine = useChartData(clickedSelected, [], []);

  const rangeHandler = (event, key) => {
    const value = event.target.value;

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set(key, value);
      return newParams;
    });
  };

  return (
    <Box pos="relative">
      <HeaderAdmin title={t("dashboard_title")} />
      <Flex direction="column" gap={10} px={8} py={10} overflowX="hidden">
        {isOpen && (
          <Alert
            status="info"
            variant="left-accent"
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
            <option value="today">{t("today")}</option>
            <option value="1">{t("yesterday")}</option>
            <option value="7">{t("last_7_days")}</option>
            <option value="30">{t("last_30_days")}</option>
            <option value="month">{t("this_month")}</option>
            <option value="year">{t("this_year")}</option>
            <option value="custom">{t("custom")}</option>
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

        {shopActionClickIsLoading ||
        shopActionRedeemIsLoading ||
        shopActionPlayIsLoading ? (
          <Flex minH="100%" w="100%" align="center" justify="center">
            <Spinner display="flex" align="center" color="secondary.500" />
          </Flex>
        ) : (
          <Flex gap={4}>
            <Box w="50%">
              <Flex gap={4} justify="start">
                <StatBox
                  title={t("gifts_won")}
                  value={redeemedSelected}
                  total={shopActionRedeem}
                  icon={Gift}
                />
                <StatBox
                  title={t("games_launched")}
                  value={gamePlayedSelected}
                  total={shopActionPlay}
                  icon={Gamepad2}
                />
              </Flex>

              <Box bg="surface.popover" borderRadius="md" px={6} py={4} mt={6}>
                <Bar options={barOptions} data={combinedChartDataBar} />
              </Box>
            </Box>

            <Box w="50%">
              <Flex gap={4} justify="start">
                <StatBox
                  title="Nombres d'abonnées"
                  value={clickedSelected}
                  total={shopActionClick}
                  icon={UserPlus}
                />
              </Flex>

              <Box bg="surface.popover" borderRadius="md" px={6} py={4} mt={6}>
                <Line options={lineOptions} data={combinedChartDataLine} />
              </Box>
            </Box>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Dashboard;
