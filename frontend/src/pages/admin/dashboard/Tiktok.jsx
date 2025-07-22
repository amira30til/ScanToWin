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

const TIKTOK_NAME = "Tiktok";

const Tiktok = () => {
  return <SocialDashboard title="Tiktok Dashboard" social={TIKTOK_NAME} />;
};

export default Tiktok;
