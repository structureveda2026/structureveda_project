import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Globe2,
  Heart,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Truck,
} from "lucide-react";

import { Link } from "react-router-dom";
import heroImage from "../../../assets/images/hero.jpg";
import prasadamSectionImage from "../../../assets/images/prasadam-section.jpg";
import rudrakshaImage from "../../../assets/images/p-rudraksha.jpg";
import yantraImage from "../../../assets/images/p-yantra.jpg";
import samagriImage from "../../../assets/images/p-samagri.jpg";
import malaImage from "../../../assets/images/p-mala.jpg";
import braceletImage from "../../../assets/images/p-bracelet.jpg";
import prasadamImage from "../../../assets/images/p-prasadam.jpg";
import astrologyCourseImage from "../../../assets/images/c-astrology.jpg";
import gitaCourseImage from "../../../assets/images/c-gita.jpg";
import meditationCourseImage from "../../../assets/images/c-meditation.jpg";
import basicsCourseImage from "../../../assets/images/c-basics.jpg";
import mantraCourseImage from "../../../assets/images/c-mantra.jpg";
import vastuCourseImage from "../../../assets/images/c-vastu.jpg";
import rahulExpertImage from "../../../assets/images/e-1.jpg";
import meeraExpertImage from "../../../assets/images/e-2.jpg";
import ananyaExpertImage from "../../../assets/images/e-4.jpg";
import PujaCard from "../../puja/components/PujaCard";
import { getFeaturedPujas } from "../../puja/data/pujaData";

const categories = [
  {
    title: "Spiritual Products",
    description: "Malas, yantras and energized items",
    icon: Leaf,
    path: "/shop",
  },
  {
    title: "Prasadam",
    description: "Temple offerings, shipped worldwide",
    icon: PackageCheck,
    path: "/prasadam",
  },
  {
    title: "Spiritual Courses",
    description: "Learn from verified teachers",
    icon: BookOpen,
    path: "/courses",
  },
  {
    title: "Consult an Expert",
    description: "One-to-one guidance sessions",
    icon: UserRound,
    path: "/experts",
  },
  {
    title: "Astrology Consultation",
    description: "Kundli, dasha and timing",
    icon: Sparkles,
    path: "/experts",
  },
  {
    title: "Book a Puja / Service",
    description: "Rituals performed for you",
    icon: CalendarDays,
    path: "/puja/upcoming",
  },
];

const products = [
  {
    category: "RUDRAKSHA",
    name: "Energized 5 Mukhi Rudraksha",
    description: "Hand-picked Nepal bead, energized with Vedic mantras.",
    price: "₹1,899",
    mrp: "₹2,599",
    discount: "27% OFF",
    rating: "4.8",
    reviews: "214",
    image: rudrakshaImage,
  },
  {
    category: "YANTRA",
    name: "Shree Vedic Yantra Plate",
    description: "Brass yantra engraved with precise sacred geometry.",
    price: "₹2,499",
    mrp: "₹3,299",
    discount: "24% OFF",
    rating: "4.7",
    reviews: "138",
    image: yantraImage,
  },
  {
    category: "PUJA KITS",
    name: "Complete Puja Samagri Kit",
    description: "Everything needed for a full home puja, neatly packed.",
    price: "₹1,299",
    mrp: "₹1,799",
    discount: "28% OFF",
    rating: "4.6",
    reviews: "302",
    image: samagriImage,
  },
  {
    category: "MALAS",
    name: "Sacred Tulsi Japa Mala",
    description: "108 hand-knotted tulsi beads with cotton tassel.",
    price: "₹999",
    mrp: "₹1,399",
    discount: "27% OFF",
    rating: "4.8",
    reviews: "411",
    image: malaImage,
  },
  {
    category: "BRACELETS",
    name: "Spiritual Healing Bracelet",
    description: "Amethyst and citrine with gold-tone spacers.",
    price: "₹1,499",
    mrp: "₹1,899",
    discount: "21% OFF",
    rating: "4.5",
    reviews: "176",
    image: braceletImage,
  },
  {
    category: "PRASADAM",
    name: "Temple Prasadam Box",
    description: "Fresh temple prasadam, sealed and shipped worldwide.",
    price: "₹799",
    mrp: "₹999",
    discount: "20% OFF",
    rating: "4.9",
    reviews: "285",
    image: prasadamImage,
  },
];

const courses = [
  {
    level: "Beginner",
    title: "Introduction to Vedic Astrology",
    instructor: "Acharya Rahul Sharma",
    duration: "8h 20m",
    lessons: "24 lessons",
    price: "₹2,999",
    mrp: "₹4,999",
    discount: "40% off",
    rating: "4.8",
    reviews: "1,240",
    image: astrologyCourseImage,
  },
  {
    level: "Beginner",
    title: "Bhagavad Gita for Everyday Life",
    instructor: "Smt. Meera Iyer",
    duration: "6h 45m",
    lessons: "18 lessons",
    price: "₹1,999",
    mrp: "₹2,999",
    discount: "33% off",
    rating: "4.9",
    reviews: "2,104",
    image: gitaCourseImage,
  },
  {
    level: "Beginner",
    title: "Meditation & Inner Wellness",
    instructor: "Yogacharya Devendra",
    duration: "5h 10m",
    lessons: "20 lessons",
    price: "₹1,499",
    mrp: "₹2,499",
    discount: "40% off",
    rating: "4.7",
    reviews: "1,876",
    image: meditationCourseImage,
  },
  {
    level: "Beginner",
    title: "Foundations of Vedic Wisdom",
    instructor: "Acharya Vivek Sharma",
    duration: "4h 30m",
    lessons: "16 lessons",
    price: "â‚¹1,299",
    mrp: "â‚¹1,999",
    discount: "35% off",
    rating: "4.7",
    reviews: "968",
    image: basicsCourseImage,
  },
  {
    level: "Intermediate",
    title: "Sacred Mantra Practice",
    instructor: "Pandit Keshav Joshi",
    duration: "5h 40m",
    lessons: "21 lessons",
    price: "â‚¹1,799",
    mrp: "â‚¹2,699",
    discount: "33% off",
    rating: "4.8",
    reviews: "1,126",
    image: mantraCourseImage,
  },
  {
    level: "Beginner",
    title: "Introduction to Vastu Shastra",
    instructor: "Dr. Ananya Rao",
    duration: "6h 15m",
    lessons: "22 lessons",
    price: "₹2,199",
    mrp: "₹3,299",
    discount: "33% off",
    rating: "4.7",
    reviews: "814",
    image: vastuCourseImage,
  },
];

const experts = [
  {
    name: "Acharya Rahul Sharma",
    expertise: "Vedic Astrology & Kundli",
    experience: "15+ years experience",
    rating: "4.9",
    reviews: "1,820",
    languages: "Hindi, English, Sanskrit",
    price: "₹999",
    image: rahulExpertImage,
  },
  {
    name: "Smt. Meera Iyer",
    expertise: "Spiritual Counselling & Scripture",
    experience: "12+ years experience",
    rating: "4.8",
    reviews: "940",
    languages: "English, Tamil, Hindi",
    price: "₹799",
    image: meeraExpertImage,
  },
  {
    name: "Pandit Keshav Joshi",
    expertise: "Puja, Rituals & Mantra Vidhi",
    experience: "28+ years experience",
    rating: "4.9",
    reviews: "2,310",
    languages: "Hindi, Sanskrit, Marathi",
    price: "₹1,299",
    image: meeraExpertImage,
  },
  {
    name: "Dr. Ananya Rao",
    expertise: "Vastu & Space Consultation",
    experience: "9+ years experience",
    rating: "4.7",
    reviews: "610",
    languages: "English, Kannada, Hindi",
    price: "₹1,499",
    image: ananyaExpertImage,
  },
];

const Home = () => {
  const featuredPujas = getFeaturedPujas();

  return (
    <main className="bg-[#fffaf0] text-[#2b241d]">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-[#ead8b8] bg-[#f8edd8]">
        <div className="mx-auto grid min-h-[680px] max-w-[1240px] items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          {/* LEFT */}
          <div>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.32em] text-[#ef6c1f]">
              Making wisdom easier, worldwide
            </p>

            <h1 className="font-serif text-[48px] leading-[1.02] tracking-[-0.035em] text-[#2b241d] sm:text-[62px] lg:text-[76px]">
              Ancient Wisdom.
              <br />
              Modern Access.
            </h1>

            <p className="mt-7 max-w-[610px] text-[16px] leading-8 text-[#75695c] sm:text-[17px]">
              Discover sacred products, spiritual courses and personalized
              guidance from trusted experts, all in one calm place.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 rounded-full bg-[#eab12c] px-7 py-3.5 text-[14px] font-semibold text-[#2b241d] shadow-[0_10px_25px_rgba(211,157,31,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#dca522]"
              >
                Explore Products
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/book-consultation"
                className="inline-flex items-center rounded-full border border-[#d8c7a7] bg-[#fffdf9] px-7 py-3.5 text-[14px] font-semibold text-[#4f463d] transition hover:border-[#c88918] hover:text-[#c88918]"
              >
                Book a Consultation
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid max-w-[570px] grid-cols-3 gap-6 border-t border-[#dfcda9] pt-7">
              <div>
                <p className="font-serif text-[34px]">40+</p>
                <p className="mt-1 text-[12px] text-[#75695c]">
                  Countries served
                </p>
              </div>

              <div>
                <p className="font-serif text-[34px]">120+</p>
                <p className="mt-1 text-[12px] text-[#75695c]">
                  Verified experts
                </p>
              </div>

              <div>
                <p className="font-serif text-[34px]">50k+</p>
                <p className="mt-1 text-[12px] text-[#75695c]">
                  Blessings delivered
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT HERO VISUAL */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[30px] border border-[#d8b77b] bg-[#e5a52b] shadow-[0_25px_70px_rgba(83,58,20,0.15)]">
              <img
                src={heroImage}
                alt="Traditional diya lamps and flowers"
                className="h-[520px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#5c2d0d]/20 via-transparent to-[#f7c34a]/10" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-[20px] border border-[#e5d2ad] bg-[#fffdf9] px-5 py-4 shadow-[0_15px_40px_rgba(80,60,30,0.12)] sm:left-8">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#fff3d7]">
                <Sparkles className="h-5 w-5 text-[#ef7624]" />
              </div>

              <div>
                <p className="text-[13px] font-semibold">
                  Energized before dispatch
                </p>
                <p className="mt-0.5 text-[11px] text-[#75695c]">
                  Ritual certificate included
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}
      <section className="bg-[#fffaf0] px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
              Where would you like to begin?
            </p>

            <h2 className="font-serif text-[38px] leading-tight sm:text-[48px]">
              Everything sacred, in one calm place
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className="group flex items-center gap-5 rounded-[22px] border border-[#e6cf9e] bg-[#fffdf9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#d9ad54] hover:shadow-[0_18px_40px_rgba(90,65,30,0.08)]"
                >
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#fbefd9]">
                    <Icon
                      size={22}
                      strokeWidth={1.6}
                      className="text-[#ed7927]"
                    />
                  </span>

                  <span className="min-w-0">
                    <span className="block font-serif text-[21px]">
                      {item.title}
                    </span>

                    <span className="mt-1 block text-[13px] text-[#75695c]">
                      {item.description}
                    </span>
                  </span>

                  <ArrowRight
                    size={18}
                    className="ml-auto shrink-0 text-[#827568] transition-transform group-hover:translate-x-1"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          UPCOMING PUJA
      ====================================================== */}
      <section className="border-t border-[#ead8b8] bg-[#fffaf0] px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                UPCOMING PUJA
              </p>

              <h2 className="font-serif text-[38px] leading-tight text-[#2b241d] sm:text-[46px]">
                Sacred Rituals. Authentic Tradition.
              </h2>

              <p className="mt-2 max-w-[650px] text-[14px] text-[#75695c]">
                Participate in sacred Vedic rituals performed in Kashi and other
                sacred places.
              </p>
            </div>

            <Link
              to="/puja/upcoming"
              className="inline-flex items-center gap-2 self-start rounded-full bg-[#eab12c] px-6 py-3 text-[13px] font-bold text-[#1c1308] shadow-[0_6px_20px_rgba(234,177,44,0.25)] transition hover:bg-[#dca522] sm:self-auto"
            >
              <span>View All Upcoming Puja</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPujas.slice(0, 3).map((puja) => (
              <PujaCard key={puja.id} puja={puja} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}
      <section className="border-y border-[#eadfc9] bg-[#fffdf9] px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
                Handpicked
              </p>

              <h2 className="font-serif text-[38px]">
                Featured Spiritual Products
              </h2>

              <p className="mt-2 max-w-[650px] text-[13px] text-[#75695c]">
                Energized, certified and packed with care, chosen by our trusted
                temple partners.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 self-start rounded-full border border-[#dfc99e] bg-white px-5 py-2.5 text-[12px] font-semibold transition hover:border-[#c88918] hover:text-[#c88918] sm:self-auto"
            >
              View All Products
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.name}
                className="group overflow-hidden rounded-[18px] border border-[#e5cf9f] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(80,60,30,0.1)]"
              >
                <div className="relative h-[280px] overflow-hidden bg-[#f8e5bd]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-[#ed7426] px-3 py-1 text-[9px] font-bold text-white">
                    {product.discount}
                  </span>

                  <button
                    type="button"
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#75695c] shadow-sm backdrop-blur"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={16} />
                  </button>
                </div>

                <div className="p-5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#ed7426]">
                    {product.category}
                  </p>

                  <h3 className="mt-2 font-serif text-[20px]">
                    {product.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#75695c]">
                    {product.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={11}
                        fill="#eab12c"
                        className="text-[#eab12c]"
                      />
                    ))}

                    <span className="ml-1 text-[10px] text-[#75695c]">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="font-serif text-[20px]">
                        {product.price}
                      </span>

                      <span className="ml-2 text-[10px] text-[#9a8d7d] line-through">
                        {product.mrp}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="rounded-full bg-[#eab12c] px-4 py-2 text-[11px] font-semibold transition hover:bg-[#dca522]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PRASADAM
      ====================================================== */}
      <section className="bg-[#f8edd8] px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[24px] border border-[#dfc89d] shadow-[0_20px_45px_rgba(80,60,30,0.1)]">
            <img
              src={prasadamSectionImage}
              alt="Prasadam prepared for delivery"
              className="h-[390px] w-full object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
              Prasadam Delivery
            </p>

            <h2 className="font-serif text-[38px] leading-tight sm:text-[46px]">
              Receive Blessings at Your Doorstep
            </h2>

            <p className="mt-4 text-[14px] leading-7 text-[#75695c]">
              Order authentic prasadam and energized items delivered to your
              home, wherever you are.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                [Globe2, "Worldwide Delivery"],
                [Leaf, "Authentic Prasadam"],
                [PackageCheck, "Secure Packaging"],
                [ShieldCheck, "Trusted Service"],
              ].map(([Icon, text]) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-full border border-[#dfc99e] bg-[#fffdf9] px-4 py-3"
                >
                  <Icon size={15} className="text-[#ed7426]" />
                  <span className="text-[11px] font-medium">{text}</span>
                </div>
              ))}
            </div>

            <Link
              to="/prasadam"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-6 py-3 text-[12px] font-semibold transition hover:bg-[#dca522]"
            >
              Explore Prasadam
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          COURSES
      ====================================================== */}
      <section className="bg-[#fffaf0] px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
                Courses
              </p>

              <h2 className="font-serif text-[38px]">Learn Ancient Wisdom</h2>

              <p className="mt-2 text-[13px] text-[#75695c]">
                Structured, unhurried courses taught by practitioners.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-full border border-[#dfc99e] bg-white px-5 py-2.5 text-[12px] font-semibold"
            >
              Explore All Courses
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.title}
                className="overflow-hidden rounded-[18px] border border-[#e4cd9d] bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(80,60,30,0.09)]"
              >
                <div className="relative h-[210px] overflow-hidden bg-[#f5e3bb]">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-[#fff2d4] px-3 py-1 text-[9px] font-medium">
                    {course.level}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-[20px] leading-tight">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-[11px] text-[#75695c]">
                    by {course.instructor}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-[#75695c]">
                    <span>{course.duration}</span>
                    <span>{course.lessons}</span>
                    <span>{course.level}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={11}
                        fill="#eab12c"
                        className="text-[#eab12c]"
                      />
                    ))}

                    <span className="ml-1 text-[10px]">
                      {course.rating} ({course.reviews})
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="font-serif text-[20px]">
                        {course.price}
                      </span>

                      <span className="ml-2 text-[10px] text-[#9a8d7d] line-through">
                        {course.mrp}
                      </span>
                    </div>

                    <Link
                      to="/courses"
                      className="rounded-full border border-[#dfc99e] px-4 py-2 text-[10px] font-semibold hover:border-[#c88918]"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          EXPERTS
      ====================================================== */}
      <section className="border-y border-[#eadfc9] bg-[#fffdf9] px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
                Consultations
              </p>

              <h2 className="font-serif text-[38px]">
                Guidance From Trusted Experts
              </h2>

              <p className="mt-2 text-[13px] text-[#75695c]">
                Verified astrologers, pandits and counsellors.
              </p>
            </div>

            <Link
              to="/experts"
              className="rounded-full border border-[#dfc99e] px-5 py-2.5 text-[11px] font-semibold"
            >
              View All Experts
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {experts.map((expert) => (
              <article
                key={expert.name}
                className="rounded-[18px] border border-[#e4cd9d] bg-white p-5 transition hover:shadow-[0_16px_35px_rgba(80,60,30,0.08)]"
              >
                <div className="flex gap-4">
                  <div className="h-[65px] w-[65px] shrink-0 overflow-hidden rounded-full border border-[#e4cd9d] bg-[#f8e7c2]">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-serif text-[18px]">{expert.name}</h3>

                    <p className="mt-0.5 text-[11px] text-[#ed7426]">
                      {expert.expertise}
                    </p>

                    <p className="mt-1 text-[10px] text-[#75695c]">
                      {expert.experience}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={11}
                      fill="#eab12c"
                      className="text-[#eab12c]"
                    />
                  ))}

                  <span className="ml-1 text-[10px] text-[#75695c]">
                    {expert.rating} ({expert.reviews})
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[#75695c]">
                  <span>{expert.languages}</span>
                  <span>•</span>
                  <span className="text-[#ed7426]">Available today</span>
                </div>

                <div className="my-4 h-px bg-[#eadfc9]" />

                <div className="flex items-center justify-between">
                  <p className="font-serif text-[20px]">
                    {expert.price}
                    <span className="ml-1 text-[10px] text-[#75695c]">
                      / consultation
                    </span>
                  </p>

                  <Link
                    to="/book-consultation"
                    className="rounded-full bg-[#eab12c] px-4 py-2 text-[10px] font-semibold hover:bg-[#dca522]"
                  >
                    Book Consultation
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section className="bg-[#f8edd8] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
              How it works
            </p>

            <h2 className="font-serif text-[38px]">Four simple steps</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "01",
                "Choose a Service",
                "Products, prasadam, courses or consultation.",
              ],
              [
                "02",
                "Select an Expert / Item",
                "Compare experience, ratings and availability.",
              ],
              [
                "03",
                "Book or Purchase",
                "Secure checkout with UPI, cards or wallets.",
              ],
              [
                "04",
                "Receive Guidance",
                "Delivery, session link or course access.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-[18px] border border-[#e3ca97] bg-[#fffdf9] p-6"
              >
                <p className="font-serif text-[28px] text-[#e3a52c]">
                  {number}
                </p>

                <h3 className="mt-3 font-serif text-[19px]">{title}</h3>

                <p className="mt-2 text-[11px] leading-5 text-[#75695c]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY VEDA
      ====================================================== */}
      <section className="bg-[#fffaf0] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
              Why us
            </p>

            <h2 className="font-serif text-[38px]">
              Why Choose Veda Structure?
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                ShieldCheck,
                "Authentic Products",
                "Carefully selected spiritual products and offerings.",
              ],
              [
                UserRound,
                "Trusted Experts",
                "Connect with experienced practitioners and guides.",
              ],
              [
                ShieldCheck,
                "Secure Payments",
                "Safe and reliable online payments.",
              ],
              [
                Globe2,
                "Worldwide Delivery",
                "Spiritual products delivered across the world.",
              ],
            ].map(([Icon, title, description]) => (
              <div
                key={title}
                className="rounded-[18px] border border-[#e3ca97] bg-white p-7 text-center"
              >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#fbefd9]">
                  <Icon size={19} className="text-[#ed7426]" />
                </div>

                <h3 className="mt-4 font-serif text-[19px]">{title}</h3>

                <p className="mt-2 text-[11px] leading-5 text-[#75695c]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
      ====================================================== */}
      <section className="border-t border-[#eadfc9] bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
              Community
            </p>

            <h2 className="font-serif text-[38px]">
              Trusted by families worldwide
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                quote:
                  "The prasadam reached Dubai in four days, sealed and fresh. My mother cried when she opened the box.",
                name: "Ananya M.",
                location: "Dubai",
              },
              {
                quote:
                  "My consultation with Acharya Rahul was refreshingly honest. No fear, no upselling, just clear guidance.",
                name: "Rohan S.",
                location: "Mumbai",
              },
            ].map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-[20px] border border-[#e3ca97] bg-[#fffdf9] p-7"
              >
                <p className="text-[30px] leading-none text-[#eab12c]">“</p>

                <p className="mt-3 text-[14px] leading-7 text-[#5f554b]">
                  {testimonial.quote}
                </p>

                <div className="mt-6 border-t border-[#eadfc9] pt-4">
                  <p className="text-[12px] font-semibold">
                    {testimonial.name}
                  </p>

                  <p className="mt-1 text-[10px] text-[#75695c]">
                    {testimonial.location}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3 rounded-full border border-[#e3ca97] bg-[#fffaf0] px-5 py-3">
              <Truck size={15} className="text-[#ed7426]" />
              <span className="text-[11px] text-[#75695c]">
                Free shipping on orders above ₹1,999
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="bg-[#f8edd8] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-[900px] rounded-[28px] border border-[#dfc99e] bg-[#fffdf9] px-6 py-14 text-center shadow-[0_20px_50px_rgba(80,60,30,0.08)] sm:px-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
            Begin your journey
          </p>

          <h2 className="mt-3 font-serif text-[38px] leading-tight sm:text-[48px]">
            Wisdom is closer than you think.
          </h2>

          <p className="mx-auto mt-4 max-w-[620px] text-[14px] leading-7 text-[#75695c]">
            Explore authentic spiritual products, learn from trusted teachers,
            or connect with an expert for personal guidance.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-7 py-3.5 text-[13px] font-semibold"
            >
              Explore Veda
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/book-consultation"
              className="rounded-full border border-[#d8c7a7] px-7 py-3.5 text-[13px] font-semibold"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
