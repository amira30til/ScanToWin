// App.js - Updated with enhanced animations
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import PersistLogin from "./components/layout/PersistLogin";
import RequireAuth from "./components/layout/RequireAuth";
import LayoutSuperAdmin from "./components/layout/LayoutSuperAdmin";
import LayoutAdmin from "./components/layout/LayoutAdmin";
import NotFound from "./components/NotFound";

import ResetPassword from "./pages/auth/ResetPassword";
import Login from "./pages/auth/Login";
import SuperAdmin from "./pages/super-admin";
import AdminDetails from "./pages/super-admin/admin-details";
import Dashboard from "./pages/admin/dashboard";
import Google from "./pages/admin/dashboard/Google";
import Facebook from "./pages/admin/dashboard/Facebook";
import Instagram from "./pages/admin/dashboard/Instagram";
import Tiktok from "./pages/admin/dashboard/Tiktok";
import AdminCampaign from "./pages/admin/campaign";
import Users from "./pages/admin/Users";
import Account from "@/pages/admin/Account";
import CreateShop from "@/pages/admin/CreateShop";
import Play from "@/pages/user";
import Redeem from "@/pages/user/Redeem";
import ComingSoon from "./components/ComingSoon";
import PageTransitionWrapper from "./components/PageTransitionWrapper";
import AdminsPage from "./pages/super-admin/_components/admins/admins-page";
import ActionsPage from "./pages/super-admin/_components/actions/actions-page";
import GamesPage from "./pages/super-admin/_components/games/games-page";

import "./theme/animation.css";

const ADMIN_ROLE = "ADMIN";
const SUPER_ADMIN_ROLE = "SUPER_ADMIN";

const App = () => {
  return (
    <PageTransitionWrapper>
      <Routes>
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="user/:shopId" element={<Play />} />
        <Route
          path="user/:shopId/redeem/:userId/action/:actionId"
          element={<Redeem />}
        />
        <Route path="user/:shopId/coming-soon" element={<ComingSoon />} />

        <Route element={<PersistLogin />}>
          <Route exact path="/" element={<Login />} />
          <Route path="login" element={<Login />} />

          <Route element={<RequireAuth allowedRole={SUPER_ADMIN_ROLE} />}>
            <Route path="/super-admin/*" element={<LayoutSuperAdmin />}>
              <Route path="admins" element={<AdminsPage />} />
              <Route path="actions" element={<ActionsPage />} />
              <Route path="games" element={<GamesPage />} />
              <Route path=":adminId" element={<AdminDetails />} />
              <Route
                path="*"
                element={<Navigate to="/super-admin/admins" replace />}
              />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRole={ADMIN_ROLE} />}>
            <Route path="/admin/create-shop" element={<CreateShop />} />
            <Route path="/admin/:shopId/*" element={<LayoutAdmin />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="google" element={<Google />} />
              <Route path="facebook" element={<Facebook />} />
              <Route path="instagram" element={<Instagram />} />
              <Route path="tiktok" element={<Tiktok />} />
              <Route path="campaign" element={<AdminCampaign />} />
              <Route path="users" element={<Users />} />
              <Route path="account" element={<Account />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
            <Route path="/admin" element={<LayoutAdmin />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransitionWrapper>
  );
};

export default App;
