import { Outlet } from "react-router-dom";
import YagyaPujaNavBar from "../features/yagyaPuja/components/YagyaPujaNavBar";
import Footer from "../components/layout/Footer";

/**
 * DEDICATED YAGYA & PUJA LAYOUT
 *
 * Dedicated layout for the isolated /yagya-puja route hierarchy.
 * Displays only genuine Puja & Yagya branding and navigation,
 * completely excluding unrelated main website navigation items.
 */
const YagyaPujaLayout = () => {
  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#2b241d]">
      {/* 2-Row Dedicated Header & Navigation */}
      <YagyaPujaNavBar />

      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-160px)]">
        <Outlet />
      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
};

export default YagyaPujaLayout;
