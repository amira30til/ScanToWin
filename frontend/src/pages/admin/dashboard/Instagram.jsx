import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SocialDashboard from "./components/SocialDashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const INSTAGRAM_NAME = "Instagram";

const Instagram = () => {
  return (
    <SocialDashboard title="Instagram Dashboard" social={INSTAGRAM_NAME} />
  );
};

export default Instagram;
