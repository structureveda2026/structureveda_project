import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  PackageCheck,
  Video,
  HeartHandshake,
  AlertCircle,
} from "lucide-react";
import upcomingPujaService from "../../../services/upcomingPujaService";
import PujaHero from "../components/PujaHero";
import PujaAbout from "../components/PujaAbout";
import PujaBenefits from "../components/PujaBenefits";
import PujaSignificance from "../components/PujaSignificance";
import PujaProcedure from "../components/PujaProcedure";
import PujaPackages from "../components/PujaPackages";
import SankalpForm from "../components/SankalpForm";
import PujaFAQ from "../components/PujaFAQ";
import PujaCard from "../components/PujaCard";

const PujaDetails = () => {
  const { slug } = useParams();
  const [puja, setPuja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPujas, setRelatedPujas] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState("pkg-individual");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let isMounted = true;

    const fetchPujaData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await upcomingPujaService.getUpcomingPujaBySlug(slug);
        if (!isMounted) return;

        if (data) {
          setPuja(data);
          const defaultPkg = data.packages?.find((p) => p.isDefault) || data.packages?.[0];
          if (defaultPkg) {
            setSelectedPackageId(defaultPkg.id);
          }
        } else {
          setPuja(null);
        }

        // Fetch related upcoming pujas
        try {
          const allPujas = await upcomingPujaService.getUpcomingPujas();
          if (!isMounted) return;
          const related = allPujas.filter((p) => p.slug !== slug).slice(0, 3);
          setRelatedPujas(related);
        } catch (relatedErr) {
          console.warn("Could not load related pujas:", relatedErr);
        }
      } catch (err) {
        console.error("Error loading puja details:", err);
        if (isMounted) {
          setError("Unable to load ceremony details. Please check your connection.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPujaData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const selectedPackage = puja?.packages?.find((p) => p.id === selectedPackageId) || puja?.packages?.[0];

  const handleScrollToBooking = () => {
    const el = document.getElementById("packages");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectPackage = (packageId) => {
    setSelectedPackageId(packageId);
    setTimeout(() => {
      const el = document.getElementById("sankalp-details") || document.getElementById("sankalp-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#fffaf0] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 rounded-full border-4 border-[#eab12c]/30 border-t-[#c77722] animate-spin" />
          <p className="font-serif text-[18px] font-bold text-[#2b241d]">
            Loading Sacred Ceremony Details...
          </p>
          <p className="text-[13px] text-[#75695c]">
            Connecting with consecrated Vedic schedule
          </p>
        </div>
      </div>
    );
  }

  if (error || !puja) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6 text-center bg-[#fffaf0]">
        <div className="rounded-[28px] border border-[#ebdcc4] bg-[#fffdfa] p-10 max-w-[520px] shadow-sm">
          <AlertCircle size={44} className="mx-auto text-[#c77722] mb-3" />
          <h2 className="font-serif text-[26px] sm:text-[28px] font-bold text-[#2b241d]">
            {error ? "Unable to Load Ceremony" : "Puja Not Found"}
          </h2>
          <p className="mt-2.5 text-[14px] leading-relaxed text-[#75695c]">
            {error || "The sacred ritual you are looking for is either unavailable or has been rescheduled."}
          </p>
          <Link
            to="/puja/upcoming"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#eab12c] px-7 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.3)] transition-all hover:bg-[#dda018]"
          >
            Browse Upcoming Pujas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#2b241d]">
      {/* 1. HERO */}
      <PujaHero puja={puja} onBookClick={handleScrollToBooking} />

      {/* 2. ABOUT THE PUJA / SACRED OVERVIEW */}
      <PujaAbout puja={puja} />

      {/* 3. WHY PERFORM THIS PUJA? */}
      <PujaBenefits benefits={puja.whyPerform} />

      {/* 4. SPIRITUAL SIGNIFICANCE */}
      <PujaSignificance puja={puja} />

      {/* 5. WHAT'S INCLUDED? */}
      <section className="border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="mx-auto mb-12 max-w-[700px] text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
              TRANSPARENT DELIVERABLES
            </p>
            <h2 className="mt-3 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[42px]">
              What's Included in Your Participation
            </h2>
            <p className="mt-3 text-[15px] text-[#685c4f]">
              Complete peace of mind with authentic ritual execution and tangible holy blessings.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {puja.whatsIncluded?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 rounded-2xl border border-[#e6cca0] bg-white p-5 shadow-sm transition hover:border-[#d4872b]"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-[14px] font-medium text-[#4a3d31]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW THE PUJA IS PERFORMED */}
      <PujaProcedure steps={puja.procedureSteps} />

      {/* 7. WHO CAN PARTICIPATE? */}
      <section className="border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[960px]">
          <div className="rounded-[28px] border-2 border-[#d6b8a0] bg-gradient-to-r from-[#fffaf0] via-[#fbf2e1] to-[#fffaf0] p-8 text-center shadow-md sm:p-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
              ELIGIBILITY
            </p>
            <h2 className="mt-3 font-serif text-[30px] font-semibold text-[#2b241d] sm:text-[38px]">
              Who Can Participate?
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-[15.5px] leading-relaxed text-[#5e5143]">
              {puja.eligibility}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[13px] font-semibold text-[#5a4d40]">
              <span className="flex items-center gap-1.5">
                <UserCheck size={16} className="text-[#d4872b]" /> Individuals & Seekers
              </span>
              <span>✦</span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake size={16} className="text-[#d4872b]" /> Married Couples
              </span>
              <span>✦</span>
              <span className="flex items-center gap-1.5">
                <PackageCheck size={16} className="text-[#d4872b]" /> Entire Households
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BOOKING OPTIONS (CHOOSE YOUR PARTICIPATION) */}
      <PujaPackages
        packages={puja.packages}
        selectedPackageId={selectedPackageId}
        onSelectPackage={handleSelectPackage}
      />

      {/* 9. SANKALP DETAILS FORM */}
      <SankalpForm
        selectedPackage={selectedPackage}
        pujaTitle={puja.name}
      />

      {/* 10. FAQ */}
      <PujaFAQ faqs={puja.faqs} />

      {/* 11. RELATED PUJA */}
      {relatedPujas.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                  OTHER SACRED RITUALS
                </p>
                <h2 className="mt-2 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[38px]">
                  Related Upcoming Pujas
                </h2>
              </div>
              <Link
                to="/puja/upcoming"
                className="inline-flex items-center gap-2 rounded-full border border-[#d6b8a0] bg-white px-5 py-2.5 text-[12.5px] font-bold text-[#2b241d] transition hover:border-[#d4872b]"
              >
                <span>View All Pujas</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPujas.map((p) => (
                <PujaCard key={p.id} puja={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12. FINAL CTA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fffaf0] via-[#fbf3e4] to-[#f8edd8] px-5 py-20 text-center sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[750px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4872b]/30 bg-white/80 px-3.5 py-1 backdrop-blur-sm">
            <Sparkles size={13} className="text-[#c77722]" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              SANATAN TRADITION
            </span>
          </div>

          <h2 className="mt-4 font-serif text-[36px] font-semibold leading-tight text-[#2b241d] sm:text-[46px]">
            Take the Next Step Towards Your Sankalp.
          </h2>

          <p className="mt-4 text-[16px] leading-relaxed text-[#685c4f]">
            Register your participation in the sacred {puja.name} performed in Kashi with traditional Vedic authenticity.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleScrollToBooking}
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-9 py-4 text-[14.5px] font-bold text-[#1c1308] shadow-[0_12px_28px_rgba(234,177,44,0.28)] transition-all duration-300 hover:brightness-105"
            >
              <span>Book This Puja</span>
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <Link
              to="/puja/upcoming"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-white px-7 py-3.5 text-[14px] font-bold text-[#2b241d] transition hover:border-[#d4872b]"
            >
              Explore All Pujas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PujaDetails;
