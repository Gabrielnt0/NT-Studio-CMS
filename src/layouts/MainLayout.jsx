import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import PageContainer from "../components/layout/PageContainer";
import Sidebar from "../components/layout/Sidebar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />

      <div className="min-h-screen lg:pl-64">
        <Header />

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