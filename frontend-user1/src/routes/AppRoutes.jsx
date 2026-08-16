import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import VishalLayout from "../layouts/VishalLayout";

import Home from "../features/home/pages/Home";
import Consultation from "../features/consultation/pages/Consultation";
import Astrologers from "../features/astrologers/pages/Astrologers";
import AstrologerDetails from "../features/astrologers/pages/AstrologerDetails";
import VishalBhardwajDetails from "../features/astrologers/pages/VishalBhardwajDetails";
import AcharyaAnuragBhardwajDetails from "../features/astrologers/pages/AcharyaAnuragBhardwajDetails";
import VishalBooking from "../features/astrologers/pages/VishalBooking";

import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";

import Favorites from "../pages/Favorites";
import NotFound from "../pages/NotFound";

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
          ACHARYA ANURAG BHARDWAJ CONSULTATION LAYOUT
      ====================================================== */}
      <Route element={<VishalLayout />}>
        <Route path="/astrologers/acharya-anurag-bhardwaj" element={<AcharyaAnuragBhardwajDetails />} />
      </Route>

      {/* =====================================================
          MAIN WEBSITE
      ====================================================== */}
      <Route element={<MainLayout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />

        <Route path="/book-consultation" element={<Consultation />} />

        {/* Astrologers */}
        <Route path="/astrologers" element={<Astrologers />} />
        <Route path="/astrologers/:slug" element={<AstrologerDetails />} />

        {/* Favorites */}
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/wishlist" element={<Favorites />} />

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
