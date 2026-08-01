import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

const Analytics = lazy(() => import("../pages/Analytics"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Education = lazy(() => import("../pages/Education"));
const Experiences = lazy(() => import("../pages/Experiences"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const Login = lazy(() => import("../pages/Login"));
const Media = lazy(() => import("../pages/Media"));
const Migration = lazy(() => import("../pages/Migration"));
const Profile = lazy(() => import("../pages/Profile"));
const Portfolio = lazy(() => import("../pages/Portfolio"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const Seo = lazy(() => import("../pages/Seo"));
const Settings = lazy(() => import("../pages/Settings"));
const Skills = lazy(() => import("../pages/Skills"));
const Theme = lazy(() => import("../pages/Theme"));
const SiteBuilder = lazy(() => import("../pages/SiteBuilder"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-400" />
        Carregando...
      </div>
    </div>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route
                path="/projects"
                element={<Navigate to="/portfolio" replace />}
              />
              <Route path="/media" element={<Media />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/education" element={<Education />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/seo" element={<Seo />} />
              <Route path="/appearance" element={<Theme />} />
              <Route path="/site-builder" element={<SiteBuilder />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route
                path="/integrations"
                element={<Navigate to="/settings" replace />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/migration" element={<Migration />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
