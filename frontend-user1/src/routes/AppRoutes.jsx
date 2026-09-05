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

import PujaListing from "../features/puja/pages/PujaListing";
import PujaDetails from "../features/puja/pages/PujaDetails";
import YagyaListing from "../features/yagya/pages/YagyaListing";
import YagyaDetails from "../features/yagya/pages/YagyaDetails";
import YagyaPujaLanding from "../features/yagyaPuja/pages/YagyaPujaLanding";
import PujaCatalogueListing from "../features/yagyaPuja/pages/PujaCatalogueListing";
import PujaServiceDetails from "../features/yagyaPuja/pages/PujaServiceDetails";
import YagyaCatalogueListing from "../features/yagyaPuja/pages/YagyaCatalogueListing";
import JapaCatalogueListing from "../features/yagyaPuja/pages/JapaCatalogueListing";
import JapaServiceDetails from "../features/yagyaPuja/pages/JapaServiceDetails";
import PathCatalogueListing from "../features/yagyaPuja/pages/PathCatalogueListing";
import PathServiceDetails from "../features/yagyaPuja/pages/PathServiceDetails";
import HomaCatalogueListing from "../features/yagyaPuja/pages/HomaCatalogueListing";
import HomaServiceDetails from "../features/yagyaPuja/pages/HomaServiceDetails";

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

        {/* Upcoming Puja Events (Preserved & Independent) */}
        <Route path="/puja" element={<PujaListing />} />
        <Route path="/puja/upcoming" element={<PujaListing />} />
        <Route path="/puja/:slug" element={<PujaDetails />} />

        {/* Vedic Yagyas */}
        <Route path="/yagya" element={<YagyaListing />} />
        <Route path="/yagyas" element={<YagyaListing />} />
        <Route path="/vedic-yagyas" element={<YagyaListing />} />
        <Route path="/yagya/:slug" element={<YagyaDetails />} />
        <Route path="/yagyas/:slug" element={<YagyaDetails />} />
        <Route path="/vedic-yagya/:slug" element={<YagyaDetails />} />

        {/* Yagya & Puja Module (Service Catalogue) */}
        <Route path="/yagya-puja" element={<YagyaPujaLanding />} />
        <Route path="/yagya-puja/puja" element={<PujaCatalogueListing />} />
        <Route path="/yagya-puja/puja/:slug" element={<PujaServiceDetails />} />
        <Route path="/yagya-puja/yagya" element={<YagyaCatalogueListing />} />
        <Route path="/yagya-puja/yagya/:slug" element={<YagyaDetails />} />
        <Route path="/yagya-puja/japa" element={<JapaCatalogueListing />} />
        <Route path="/yagya-puja/japa/:slug" element={<JapaServiceDetails />} />
        <Route path="/yagya-puja/path" element={<PathCatalogueListing />} />
        <Route path="/yagya-puja/path/:slug" element={<PathServiceDetails />} />
        <Route path="/yagya-puja/homa" element={<HomaCatalogueListing />} />
        <Route path="/yagya-puja/homa/:slug" element={<HomaServiceDetails />} />
        <Route path="/yagya-puja/kashi" element={<PujaListing />} />

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
