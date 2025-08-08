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

const INSTAGRAM_NAME = "Instagram";

const Instagram = () => {
  const { t } = useTranslation();
  return (
    <SocialDashboard
      title={t("instagram_dashboard_title")}
      social={INSTAGRAM_NAME}
    />
  );
};

export default Instagram;
