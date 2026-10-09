import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Flame,
  BookOpen,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import Logo from "./Logo";

interface RitualSubItem {
  label: string;
  path?: string;
  disabled?: boolean;
  badge?: string;
}

interface RitualSection {
  id: string;
  label: string;
  aliasComment?: string;
  basePath?: string;
  items: RitualSubItem[];
}

/**
 * Disciplines grouped under Yagya & Puja:
 * - Upcoming Puja (/admin/upcoming-pujas)
 * - Puja Catalogue (/admin/puja-services, /admin/puja/categories)
 * - Yagya Catalogue (/admin/yagya-services)
 * - Japa Catalogue (/admin/japa-services)
 * - Path Catalogue (/admin/path-services)
 * - Homa Catalogue (/admin/homa-services)
 * - Puja in Kashi (Disabled / Coming Soon)
 */
const RITUAL_SECTIONS: RitualSection[] = [
  {
    id: "upcoming",
    label: "Upcoming Puja",
    basePath: "/admin/upcoming-puja",
    items: [
      { label: "View All Upcoming Pujas", path: "/admin/upcoming-pujas" },
    ],
  },
  {
    id: "puja",
    label: "Puja", // Puja Catalogue
    aliasComment: "Puja Catalogue",
    basePath: "/admin/puja",
    items: [
      { label: "Puja Categories", path: "/admin/puja/categories" },
      { label: "All Pujas", path: "/admin/puja-services" },
    ],
  },
  {
    id: "yagya",
    label: "Yagya",
    basePath: "/admin/yagya",
    items: [
      { label: "Yagya Categories", path: "/admin/yagya/categories" },
      { label: "All Yagya", path: "/admin/yagya-services" },
    ],
  },
  {
    id: "japa",
    label: "Japa / Chanting",
    basePath: "/admin/japa",
    items: [
      { label: "Japa Categories", path: "/admin/japa/categories" },
      { label: "All Japa", path: "/admin/japa-services" },
    ],
  },
  {
    id: "path",
    label: "Path / Recitation",
    aliasComment: "Path Catalogue",
    basePath: "/admin/path",
    items: [
      { label: "Path Categories", path: "/admin/path/categories" },
      { label: "All Path", path: "/admin/path-services" },
    ],
  },
  {
    id: "homa",
    label: "Homa / Havan",
    basePath: "/admin/homa",
    items: [
      { label: "Homa Categories", path: "/admin/homa/categories" },
      { label: "All Homa", path: "/admin/homa-services" },
    ],
  },
  {
    id: "kashi",
    label: "Puja in Kashi",
    items: [
      {
        label: "Explore Puja in Kashi",
        disabled: true,
        badge: "Coming Soon",
      },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onClose,
  onLogout,
}: SidebarProps) {
  const location = useLocation();

  // Route matches for Yagya & Puja umbrella
  const isYagyaPujaActive =
    location.pathname.startsWith("/admin/upcoming-puja") ||
    location.pathname.startsWith("/admin/upcoming-pujas") ||
    location.pathname.startsWith("/admin/puja-services") ||
    location.pathname.startsWith("/admin/puja/categories") ||
    location.pathname.startsWith("/admin/puja-categories") ||
    location.pathname.startsWith("/admin/yagya-services") ||
    location.pathname.startsWith("/admin/yagya/categories") ||
    location.pathname.startsWith("/admin/yagya-categories") ||
    location.pathname.startsWith("/admin/japa/categories") ||
    location.pathname.startsWith("/admin/japa-categories") ||
    location.pathname.startsWith("/admin/japa-services") ||
    location.pathname.startsWith("/admin/homa/categories") ||
    location.pathname.startsWith("/admin/homa-categories") ||
    location.pathname.startsWith("/admin/homa-services") ||
    location.pathname.startsWith("/admin/path-services") ||
    location.pathname.startsWith("/admin/path/categories") ||
    location.pathname.startsWith("/admin/path-categories");

  // Route matches for Library
  const isLibraryActive =
    location.pathname.startsWith("/admin/library/blogs") ||
    location.pathname.startsWith("/admin/blogs");

  // Accordion state for Yagya & Puja parent
  const [isYagyaPujaOpen, setIsYagyaPujaOpen] = useState(true);

  // Accordion state for sub-sections under Yagya & Puja
  const [openSubSections, setOpenSubSections] = useState<Record<string, boolean>>({
    upcoming: true,
    puja: true,
    yagya: true,
    japa: true,
    path: true,
    homa: true,
    kashi: false,
  });

  // Accordion state for Library
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

  // Auto-expand Yagya & Puja and active sub-section whenever route changes
  useEffect(() => {
    if (isYagyaPujaActive) {
      setIsYagyaPujaOpen(true);
      if (
        location.pathname.startsWith("/admin/upcoming-puja") ||
        location.pathname.startsWith("/admin/upcoming-pujas")
      ) {
        setOpenSubSections((prev) => ({ ...prev, upcoming: true }));
      } else if (
        location.pathname.startsWith("/admin/puja-services") ||
        location.pathname.startsWith("/admin/puja/categories") ||
        location.pathname.startsWith("/admin/puja-categories")
      ) {
        setOpenSubSections((prev) => ({ ...prev, puja: true }));
      } else if (location.pathname.startsWith("/admin/yagya-services")) {
        setOpenSubSections((prev) => ({ ...prev, yagya: true }));
      } else if (location.pathname.startsWith("/admin/japa-services")) {
        setOpenSubSections((prev) => ({ ...prev, japa: true }));
      } else if (
        location.pathname.startsWith("/admin/path-services") ||
        location.pathname.startsWith("/admin/path/categories") ||
        location.pathname.startsWith("/admin/path-categories")
      ) {
        setOpenSubSections((prev) => ({ ...prev, path: true }));
      } else if (
        location.pathname.startsWith("/admin/homa-services") ||
        location.pathname.startsWith("/admin/homa/categories") ||
        location.pathname.startsWith("/admin/homa-categories")
      ) {
        setOpenSubSections((prev) => ({ ...prev, homa: true }));
      }
    }
  }, [location.pathname, isYagyaPujaActive]);

  const toggleSubSection = (id: string) => {
    setOpenSubSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isSubItemActive = (path?: string) => {
    if (!path) return false;
    const basePath = path.split("?")[0];
    if (
      basePath === "/admin/puja/categories" ||
      basePath === "/admin/puja-categories"
    ) {
      return (
        location.pathname.startsWith("/admin/puja/categories") ||
        location.pathname.startsWith("/admin/puja-categories")
      );
    }
    if (
      basePath === "/admin/upcoming-pujas" ||
      basePath === "/admin/upcoming-puja"
    ) {
      return (
        location.pathname.startsWith("/admin/upcoming-pujas") ||
        location.pathname.startsWith("/admin/upcoming-puja")
      );
    }
    if (
      basePath === "/admin/homa/categories" ||
      basePath === "/admin/homa-categories"
    ) {
      return (
        location.pathname.startsWith("/admin/homa/categories") ||
        location.pathname.startsWith("/admin/homa-categories")
      );
    }
    if (
      basePath === "/admin/path/categories" ||
      basePath === "/admin/path-categories"
    ) {
      return (
        location.pathname.startsWith("/admin/path/categories") ||
        location.pathname.startsWith("/admin/path-categories")
      );
    }
    return (
      location.pathname === basePath ||
      location.pathname.startsWith(basePath + "/")
    );
  };

  const isSectionActive = (section: RitualSection) => {
    if (section.id === "upcoming") {
      return (
        location.pathname.startsWith("/admin/upcoming-puja") ||
        location.pathname.startsWith("/admin/upcoming-pujas")
      );
    }
    if (section.id === "puja") {
      return (
        location.pathname.startsWith("/admin/puja-services") ||
        location.pathname.startsWith("/admin/puja/categories") ||
        location.pathname.startsWith("/admin/puja-categories")
      );
    }
    return section.items.some((item) => isSubItemActive(item.path));
  };

  const handleLinkClick = () => {
    if (mobileOpen) {
      onClose();
    }
  };

  const sidebarContent = (
    <>
      <div
        className={`flex items-center px-4 py-5 border-b border-cream-200 ${collapsed ? "justify-center" : "justify-between"
          }`}
      >
        {collapsed ? <Logo collapsed /> : <Logo />}
        <button
          onClick={onClose}
          className="lg:hidden text-charcoal-400 hover:text-charcoal-600 cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* 1. Dashboard */}
        {collapsed ? (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition group relative ${isActive
                ? "bg-saffron-500 text-white"
                : "text-charcoal-500 hover:bg-cream-100"
              }`
            }
            title="Dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
            {location.pathname === "/admin/dashboard" && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-saffron-500 rounded-r-full" />
            )}
          </NavLink>
        ) : (
          <NavLink
            to="/admin/dashboard"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                ? "bg-saffron-50 text-saffron-700"
                : "text-charcoal-600 hover:bg-cream-100"
              }`
            }
          >
            <LayoutDashboard
              className={`w-[18px] h-[18px] ${location.pathname === "/admin/dashboard"
                ? "text-saffron-600"
                : "text-charcoal-400"
                }`}
            />
            <span className="flex-1">Dashboard</span>
          </NavLink>
        )}

        {/* 2. Yagya & Puja (Umbrella Navigation) */}
        {collapsed ? (
          <NavLink
            to="/admin/upcoming-pujas"
            className={`flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition group relative ${isYagyaPujaActive
              ? "bg-saffron-500 text-white"
              : "text-charcoal-500 hover:bg-cream-100"
              }`}
            title="Yagya & Puja"
          >
            <Flame className="w-5 h-5" />
            {isYagyaPujaActive && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-saffron-500 rounded-r-full" />
            )}
          </NavLink>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setIsYagyaPujaOpen((prev) => !prev)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${isYagyaPujaActive
                ? "bg-saffron-50 text-saffron-700 font-semibold"
                : "text-charcoal-600 hover:bg-cream-100"
                }`}
              aria-expanded={isYagyaPujaOpen}
            >
              <Flame
                className={`w-[18px] h-[18px] ${isYagyaPujaActive ? "text-saffron-600" : "text-charcoal-400"
                  }`}
              />
              <span className="flex-1 text-left font-semibold">Yagya & Puja</span>
              <ChevronDown
                className={`w-4 h-4 text-charcoal-400 transition-transform ${isYagyaPujaOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Nested Disciplines */}
            {isYagyaPujaOpen && (
              <div className="mt-1 ml-3.5 pl-2.5 border-l border-cream-200 space-y-1">
                {RITUAL_SECTIONS.map((section) => {
                  const sectionActive = isSectionActive(section);
                  const isOpen = !!openSubSections[section.id];

                  return (
                    <div key={section.id} className="py-0.5">
                      {/* Section Toggle Header */}
                      <button
                        type="button"
                        onClick={() => toggleSubSection(section.id)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-[0.14em] transition cursor-pointer ${sectionActive
                          ? "text-saffron-700 bg-saffron-50/60 font-bold"
                          : "text-charcoal-500 hover:text-charcoal-800 hover:bg-cream-50"
                          }`}
                        aria-expanded={isOpen}
                      >
                        <span>{section.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-charcoal-400 transition-transform ${isOpen ? "rotate-180 text-saffron-600" : ""
                            }`}
                        />
                      </button>

                      {/* Section Child Items */}
                      {isOpen && (
                        <div className="ml-2 pl-2 border-l border-cream-200/80 space-y-0.5 mt-0.5 mb-1">
                          {section.items.map((item, idx) => {
                            if (item.disabled) {
                              return (
                                <div
                                  key={item.label}
                                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12.5px] text-charcoal-400 cursor-not-allowed opacity-70 select-none"
                                  title="Admin module is not yet implemented"
                                >
                                  <span>{item.label}</span>
                                  {item.badge && (
                                    <span className="text-[9.5px] bg-cream-200/80 text-charcoal-500 px-1.5 py-0.5 rounded font-medium">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                              );
                            }

                            const active = isSubItemActive(item.path);

                            return (
                              <NavLink
                                key={`${item.label}-${idx}`}
                                to={item.path || "#"}
                                onClick={handleLinkClick}
                                className={`block px-2.5 py-1.5 rounded-md text-[13px] transition ${active
                                  ? "text-saffron-700 font-semibold bg-saffron-50/70"
                                  : "text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-50 font-normal"
                                  }`}
                              >
                                {item.label}
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. Library */}
        {collapsed ? (
          <NavLink
            to="/admin/library/blogs"
            className={`flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition group relative ${isLibraryActive
              ? "bg-saffron-500 text-white"
              : "text-charcoal-500 hover:bg-cream-100"
              }`}
            title="Library"
          >
            <BookOpen className="w-5 h-5" />
            {isLibraryActive && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-saffron-500 rounded-r-full" />
            )}
          </NavLink>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setIsLibraryOpen((prev) => !prev)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${isLibraryActive
                ? "bg-saffron-50 text-saffron-700 font-semibold"
                : "text-charcoal-600 hover:bg-cream-100"
                }`}
              aria-expanded={isLibraryOpen}
            >
              <BookOpen
                className={`w-[18px] h-[18px] ${isLibraryActive ? "text-saffron-600" : "text-charcoal-400"
                  }`}
              />
              <span className="flex-1 text-left">Library</span>
              <ChevronDown
                className={`w-4 h-4 text-charcoal-400 transition-transform ${isLibraryOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {isLibraryOpen && (
              <div className="mt-1 ml-6 pl-3 border-l border-cream-200 space-y-0.5">
                <NavLink
                  to="/admin/library/blogs"
                  onClick={handleLinkClick}
                  className={`block px-3 py-1.5 rounded-lg text-[13px] transition ${isLibraryActive
                    ? "text-saffron-700 font-semibold bg-saffron-50/60"
                    : "text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-50"
                    }`}
                >
                  Blog Posts
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* 4. Logout */}
      <div className="px-3 py-4 border-t border-cream-200">
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition w-full cursor-pointer ${collapsed ? "justify-center" : ""
            }`}
          title="Logout"
        >
          <LogOut className="w-[18px] h-[18px]" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-cream-200 transition-all duration-300 z-30 ${collapsed ? "w-20" : "w-64"
          }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div
            className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 h-screen w-64 bg-white animate-slide-in flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
