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
import { useEffect } from "react";
import useAuthStore from "@/store";
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
      text: "Chart.js Bar Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => 832),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => 455),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const AdminDashboard = () => {
  const shop = useAuthStore((state) => state.shop);

  useEffect(() => {
    console.log("dashboard shop", shop);

    // TODO: call an endpoint which returns these values queries by range (Date A to Date B)
    // 1. number of users (query by):
    // 2. number of redeemed rewards

    // endpoint name: "/shop/{shopId}/dashboard/{from}/{to}"
    // returns { users: number, redeemedRewards: number }

    // should loop through the ChosenAction's of the shop and calculate the total number of users and redeemed rewards
  }, [shop]);

  return (
    <Box pos="relative">
      <HeaderAdmin title="Dashboard" />
      <Flex direction="column" gap={10} px={8} py={10} overflow-x="hidden">
        <Flex>
          <Select
            maxW="300px"
            bg="white"
            borderRadius="md"
            fontWeight="bold"
            focusBorderColor="primary.500"
            cursor="pointer"
          >
            <option value="option1">Today</option>
            <option value="option1">Yesterday</option>
            <option value="option1">7 Days ago</option>
            <option value="option1">30 Days ago</option>
            <option value="option1">This month</option>
            <option value="option1">This year</option>
            <option value="option1">Custom date</option>
          </Select>
        </Flex>
        <Box bg="surface.popover" borderRadius="md" p={6}>
          <StatGroup>
            <Stat>
              <StatLabel>Sent</StatLabel>
              <StatNumber>345,670</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Clicked</StatLabel>
              <StatNumber>45</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                9.05%
              </StatHelpText>
            </Stat>
          </StatGroup>
          <Bar options={options} data={data} />
        </Box>
      </Flex>
    </Box>
  );
};

export default AdminDashboard;
