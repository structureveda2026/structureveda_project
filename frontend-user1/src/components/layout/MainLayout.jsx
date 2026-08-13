import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#2b241d]">
      <Navbar />

      <main className="min-h-[calc(100vh-82px)]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
