import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Analytics from "../pages/Analytics";
import Dashboard from "../pages/Dashboard";
import Education from "../pages/Education";
import Experiences from "../pages/Experiences";
import Media from "../pages/Media";
import Profile from "../pages/Profile";
import Projects from "../pages/Projects";
import Seo from "../pages/Seo";
import Settings from "../pages/Settings";
import Skills from "../pages/Skills";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/media" element={<Media />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/education" element={<Education />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/seo" element={<Seo />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;