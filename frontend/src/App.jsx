import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import NotFound from "@/components/NotFound";
import RequireAuth from "@/components/RequireAuth";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import SuperAdminHome from "@/pages/super-admin/SuperAdminHome";
import PersistLogin from "@/pages/auth/PersistLogin";
import LayoutAdmin from "@/components/LayoutAdmin";
import AdminCampaign from "./pages/admin/AdminCampaign";
import AdminSMS from "./pages/admin/AdminSMS";
import AdminReview from "./pages/admin/AdminReview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAccount from "@/pages/admin/AdminAccount";
import AdminGoogle from "@/pages/admin/AdminGoogle";
import AdminInstagram from "./pages/admin/AdminInstagram";
import AdminTiktok from "./pages/admin/AdminTiktok";
import AdminUsersData from "./pages/admin/AdminUsersData";
import AdminFacebook from "./pages/admin/AdminFacebook";

const ROLES = {
  SuperAdmin: 5150,
  Admin: 2001,
};

const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />

      <Route element={<PersistLogin />}>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAuth allowedRoles={[ROLES.SuperAdmin]} />}>
          <Route path="super-admin" element={<SuperAdminHome />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="/admin/*" element={<LayoutAdmin />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="campaign" element={<AdminCampaign />} />
            <Route path="sms" element={<AdminSMS />} />
            <Route path="review" element={<AdminReview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="google" element={<AdminGoogle />} />
            <Route path="facebook" element={<AdminFacebook />} />
            <Route path="instagram" element={<AdminInstagram />} />
            <Route path="tiktok" element={<AdminTiktok />} />
            <Route path="usersdata" element={<AdminUsersData />} />
            <Route path="account" element={<AdminAccount />} />

            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
