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

const GOOGLE_NAME = "Avis Google";

const Google = () => {
  return <SocialDashboard title="Google Dashboard" social={GOOGLE_NAME} />;
};

export default Google;
