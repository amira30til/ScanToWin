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

const TIKTOK_NAME = "Tiktok";

const Tiktok = () => {
  const { t } = useTranslation();
  return (
    <SocialDashboard title={t("tiktok_dashboard_title")} social={TIKTOK_NAME} />
  );
};

export default Tiktok;
