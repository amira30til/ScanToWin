import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { useCombinedChartData } from "./hooks/useCombinedChartData";
import { useAxiosPrivate } from "@/hooks";
import { useTranslation } from "react-i18next";

import {
  getShopActionClick,
  getShopActionRedeem,
} from "@/services/actionService";

import HeaderAdmin from "@/components/nav/HeaderAdmin";
import StatBox from "./components/StatBox";

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

const Dashboard = () => {
  const { t } = useTranslation();

  const { shopId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultRange = searchParams.get("range") || "today";
  const [range, setRange] = useState(defaultRange);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const axiosPrivate = useAxiosPrivate();

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

  const {
    combinedChartData,
    clickedFilteredTimestamps,
    redeemedFilteredTimestamps,
  } = useCombinedChartData({
    clicked: shopActionClick,
    redeemed: shopActionRedeem,
    range,
    customFrom,
    customTo,
  });

  useEffect(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("range", range);
      return newParams;
    });
  }, [range, setSearchParams]);

  return (
    <Box pos="relative">
      <HeaderAdmin title={t("dashboard_title")} />
      <Flex direction="column" gap={10} px={8} py={10} overflowX="hidden">
        <Flex direction="column" gap={2}>
          <Select
            maxW="300px"
            bg="white"
            borderRadius="md"
            fontWeight="bold"
            focusBorderColor="primary.500"
            cursor="pointer"
            onChange={(e) => {
              setRange(e.target.value);
            }}
            value={range}
          >
            <option value="today">{t("today")}</option>
            <option value="1">{t("yesterday")}</option>
            <option value="7">{t("last_7_days")}</option>
            <option value="30">{t("last_30_days")}</option>
            <option value="month">{t("this_month")}</option>
            <option value="year">{t("this_year")}</option>
            <option value="custom">{t("custom")}</option>
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

        {shopActionClickIsLoading || shopActionRedeemIsLoading ? (
          <Flex minH="100%" w="100%" align="center" justify="center">
            <Spinner display="flex" align="center" color="secondary.500" />
          </Flex>
        ) : (
          <Box>
            <Flex gap={4} justify="start">
              <StatBox
                title={t("games_launched")}
                value={clickedFilteredTimestamps}
                total={shopActionClick}
                icon={IoLogoGameControllerB}
              />
              <StatBox
                title={t("gifts_won")}
                value={redeemedFilteredTimestamps}
                total={shopActionRedeem}
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

export default Dashboard;
