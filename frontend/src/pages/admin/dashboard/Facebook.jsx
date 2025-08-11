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

const FACEBOOK_NAME = "Facebook";

const Facebook = () => {
  const { t } = useTranslation();
  return (
    <SocialDashboard title={t("facebook_dashboard")} social={FACEBOOK_NAME} />
  );
};

export default Facebook;
