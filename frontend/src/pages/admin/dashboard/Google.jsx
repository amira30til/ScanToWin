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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <SocialDashboard
      title={t("google_dashboard")}
      social={t("google_dashboard")}
    />
  );
};

export default Google;
