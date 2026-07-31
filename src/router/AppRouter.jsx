import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import Analytics from "../pages/Analytics";
import Dashboard from "../pages/Dashboard";
import Education from "../pages/Education";
import Experiences from "../pages/Experiences";
import ForgotPassword from "../pages/ForgotPassword";
import Login from "../pages/Login";
import Media from "../pages/Media";
import Migration from "../pages/Migration";
import Profile from "../pages/Profile";
import Portfolio from "../pages/Portfolio";
import ResetPassword from "../pages/ResetPassword";
import Seo from "../pages/Seo";
import Settings from "../pages/Settings";
import Skills from "../pages/Skills";

function AppRouter() {
  return <BrowserRouter><Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route element={<ProtectedRoute />}><Route element={<MainLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/projects" element={<Navigate to="/portfolio" replace />} />
      <Route path="/media" element={<Media />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/experiences" element={<Experiences />} />
      <Route path="/education" element={<Education />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/seo" element={<Seo />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/integrations" element={<Navigate to="/settings" replace />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/migration" element={<Migration />} />
    </Route></Route>
  </Routes></BrowserRouter>;
}
export default AppRouter;
