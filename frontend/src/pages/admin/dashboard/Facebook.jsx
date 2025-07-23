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

const FACEBOOK_NAME = "Facebook";

const Facebook = () => {
  return <SocialDashboard title="Facebook Dashboard" social={FACEBOOK_NAME} />;
};

export default Facebook;
