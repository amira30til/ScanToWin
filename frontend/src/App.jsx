import { Routes, Route, Navigate } from "react-router-dom";

import PersistLogin from "./components/layout/PersistLogin";
import RequireAuth from "./components/layout/RequireAuth";
import LayoutSuperAdmin from "./components/layout/LayoutSuperAdmin";
import LayoutAdmin from "./components/layout/LayoutAdmin";
import NotFound from "./components/NotFound";

import ResetPassword from "./pages/auth/ResetPassword";
import Login from "./pages/auth/Login";
import SuperAdmin from "./pages/super-admin";
import Dashboard from "./pages/admin/dashboard";
import Google from "./pages/admin/dashboard/Google";
import Facebook from "./pages/admin/dashboard/Facebook";
import Instagram from "./pages/admin/dashboard/Instagram";
import Tiktok from "./pages/admin/dashboard/Tiktok";
import AdminUsersData from "./pages/admin/AdminUsersData";
import AdminCampaign from "./pages/admin/campaign";
import AdminSMS from "./pages/admin/AdminSMS";
import AdminReview from "./pages/admin/AdminReview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAccount from "@/pages/admin/AdminAccount";
import AdminCreateShop from "@/pages/admin/AdminCreateShop";
import Play from "@/pages/user";
import Redeem from "@/pages/user/Redeem";
import ComingSoon from "./components/ComingSoon";

const ADMIN_ROLE = "ADMIN";
const SUPER_ADMIN_ROLE = "SUPER_ADMIN";

const App = () => {
  return (
    <Routes>
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="play/:shopId" element={<Play />} />
      <Route
        path="play/:shopId/redeem/:userId/action/:actionId"
        element={<Redeem />}
      />
      <Route path="play/:shopId/coming-soon" element={<ComingSoon />} />

      <Route element={<PersistLogin />}>
        <Route exact path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route element={<RequireAuth allowedRole={SUPER_ADMIN_ROLE} />}>
          <Route path="/super-admin/*" element={<LayoutSuperAdmin />}>
            <Route path="dashboard" element={<SuperAdmin />} />
            <Route
              path="*"
              element={<Navigate to="/super-admin/dashboard" />}
            />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRole={ADMIN_ROLE} />}>
          <Route path="/admin/create-shop" element={<AdminCreateShop />} />

          <Route path="/admin/:shopId/*" element={<LayoutAdmin />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="google" element={<Google />} />
            <Route path="facebook" element={<Facebook />} />
            <Route path="instagram" element={<Instagram />} />
            <Route path="tiktok" element={<Tiktok />} />
            <Route path="usersdata" element={<AdminUsersData />} />
            <Route path="campaign" element={<AdminCampaign />} />
            <Route path="sms" element={<AdminSMS />} />
            <Route path="review" element={<AdminReview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="account" element={<AdminAccount />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
          <Route path="/admin" element={<LayoutAdmin />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
