import { Routes, Route, Navigate } from "react-router-dom";

import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import LayoutSuperAdmin from "./components/LayoutSuperAdmin";
import LayoutAdmin from "./components/LayoutAdmin";
import NotFound from "./components/NotFound";

import ResetPassword from "./pages/auth/ResetPassword";
import Login from "./pages/auth/Login";
import SuperAdminHome from "./pages/super-admin/SuperAdminHome";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminGoogle from "./pages/admin/dashboard/AdminGoogle";
import AdminFacebook from "./pages/admin/dashboard/AdminFacebook";
import AdminInstagram from "./pages/admin/dashboard/AdminInstagram";
import AdminTiktok from "./pages/admin/dashboard/AdminTiktok";
import AdminUsersData from "./pages/admin/AdminUsersData";
import AdminCampaign from "./pages/admin/campaign";
import AdminSMS from "./pages/admin/AdminSMS";
import AdminReview from "./pages/admin/AdminReview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAccount from "@/pages/admin/AdminAccount";
import AdminCreateShop from "@/pages/admin/AdminCreateShop";
import Play from "@/pages/user";
import Redeem from "@/pages/user/redeem";

const Admin = "ADMIN";
const SuperAdmin = "SUPER_ADMIN";

const App = () => {
  return (
    <Routes>
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="play/:shopId" element={<Play />} />
      <Route
        path="play/:shopId/redeem/:userId/action/:actionId"
        element={<Redeem />}
      />
      <Route element={<PersistLogin />}>
        <Route exact path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route element={<RequireAuth allowedRole={SuperAdmin} />}>
          <Route path="/super-admin/*" element={<LayoutSuperAdmin />}>
            <Route path="dashboard" element={<SuperAdminHome />} />
            <Route
              path="*"
              element={<Navigate to="/super-admin/dashboard" />}
            />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRole={Admin} />}>
          <Route path="/admin/create-shop" element={<AdminCreateShop />} />

          <Route path="/admin/:shopId/*" element={<LayoutAdmin />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="google" element={<AdminGoogle />} />
            <Route path="facebook" element={<AdminFacebook />} />
            <Route path="instagram" element={<AdminInstagram />} />
            <Route path="tiktok" element={<AdminTiktok />} />
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
