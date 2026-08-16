import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import VishalLayout from "../layouts/VishalLayout";

import Home from "../features/home/pages/Home";
import Consultation from "../features/consultation/pages/Consultation";
import Astrologers from "../features/astrologers/pages/Astrologers";
import AstrologerDetails from "../features/astrologers/pages/AstrologerDetails";
import VishalBhardwajDetails from "../features/astrologers/pages/VishalBhardwajDetails";
import VishalBooking from "../features/astrologers/pages/VishalBooking";

import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =====================================================
          VISHAL BHARDWAJ CONSULTATION LAYOUT
      ====================================================== */}
      <Route element={<VishalLayout />}>
        <Route path="/astrologers/vishal-bhardwaj" element={<VishalBhardwajDetails />} />
        <Route path="/astrologers/vishal-bhardwaj/book-consultation" element={<VishalBooking />} />
      </Route>

      {/* =====================================================
          MAIN WEBSITE
      ====================================================== */}
      <Route element={<MainLayout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />

        <Route path="/book-consultation" element={<Consultation />} />

        <Route path="/astrologers" element={<Astrologers />} />
        <Route path="/astrologers/:slug" element={<AstrologerDetails />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
