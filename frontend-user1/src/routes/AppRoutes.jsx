import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../features/home/pages/Home";
import Consultation from "../features/consultation/pages/Consultation";
import Astrologers from "../features/astrologers/pages/Astrologers";
import AstrologerDetails from "../features/astrologers/pages/AstrologerDetails";

import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =====================================================
          MAIN WEBSITE
      ====================================================== */}
      <Route element={<MainLayout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Book Consultation */}
        <Route path="/book-consultation" element={<Consultation />} />

        <Route path="/astrologers" element={<Astrologers />} />
        <Route path="/astrologers/:slug" element={<AstrologerDetails />} />

        {/* =====================================================
            AUTH PAGES
        ====================================================== */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Future pages */}
        {/*
        <Route path="/shop" element={<Shop />} />
        <Route path="/prasad" element={<Prasadam />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/consult-expert" element={<ConsultExpert />} />
        <Route path="/about" element={<About />} />
        */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
