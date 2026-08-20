import { Outlet } from "react-router-dom";
import VishalNavbar from "../components/layout/VishalNavbar";
import VishalFooter from "../components/layout/VishalFooter";

const VishalLayout = () => {
  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#2b241d]">
      <VishalNavbar />
      <main className="min-h-[calc(100vh-75px)]">
        <Outlet />
      </main>
      <VishalFooter />
    </div>
  );
};

export default VishalLayout;
