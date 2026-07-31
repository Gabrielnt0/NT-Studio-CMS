import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import PageContainer from "../components/layout/PageContainer";
import Sidebar from "../components/layout/Sidebar";

function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Header onOpenMenu={() => setIsMobileMenuOpen(true)} />

        <main>
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
