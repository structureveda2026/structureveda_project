import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Flame,
  BookOpen,
  LogOut,
  ChevronDown,
  X,
  Sparkles,
  CalendarCheck,
  Plus,
} from "lucide-react";
import Logo from "./Logo";
import LibrarySectionService from "../modules/library/services/librarySection.service";

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

interface LibrarySubItem {
  id?: string;
  label: string;
  path: string;
  aliases?: string[];
  isCustom?: boolean;
}

/**
 * Disciplines grouped under Yagya & Puja:
 * - Upcoming Puja (/admin/upcoming-pujas)
 * - Puja Catalogue (/admin/puja-services, /admin/puja/categories)
 * - Yagya Catalogue (/admin/yagya-services, /admin/yagya/categories)
 * - Japa Catalogue (/admin/japa-services, /admin/japa/categories)
 * - Path Catalogue (/admin/path-services, /admin/path/categories)
 * - Homa Catalogue (/admin/homa-services, /admin/homa/categories)
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

/**
 * Default Library navigation items (Scriptures & Sacred Texts):
 * Vedas | Mantra | Stotra | Sukti
 */
const DEFAULT_SCRIPTURE_ITEMS: LibrarySubItem[] = [
  {
    label: "Vedas",
    path: "/admin/library/vedas",
    aliases: ["/admin/vedas"],
  },
  // ── Mantra & Stotra ──────────────────────────────────
  {
    label: "Mantra",
    path: "/admin/library/mantra-branches",
    aliases: ["/admin/mantra-branches"],
  },
  {
    label: "Stotra",
    path: "/admin/library/stotra-branches",
    aliases: ["/admin/stotra-branches"],
  },
];

/**
 * Editorial / Articles under Library
 */
const ARTICLE_LIBRARY_ITEMS: LibrarySubItem[] = [
  {
    label: "Blog Posts",
    path: "/admin/library/blogs",
    aliases: ["/admin/blogs"],
  },
];

/**
 * Quick presets for adding common library sections
 */
const PRESET_LIBRARY_SUGGESTIONS = [
  { name: "Sukti", path: "/admin/library/sukti-branches" },
  { name: "Stuti", path: "/admin/library/stotra-branches?type=stuti" },
  { name: "Kavach", path: "/admin/library/stotra-branches?type=kavach" },
  { name: "Chalisa", path: "/admin/library/stotra-branches?type=chalisa" },
  { name: "Puranas", path: "/admin/library/puranas" },
  { name: "Upanishads", path: "/admin/library/upanishads" },
];

const CUSTOM_SECTIONS_STORAGE_KEY = "admin_custom_library_sections";
const HIDDEN_DEFAULT_SECTIONS_KEY = "admin_hidden_default_library_sections";


interface BookingSubItem {
  label: string;
  path: string;
  exact?: boolean;
}

/**
 * Centralized Booking Management Navigation
 */
const BOOKING_ITEMS: BookingSubItem[] = [
  { label: "Booking Overview", path: "/admin/booking-overview" },
  { label: "All Bookings", path: "/admin/bookings", exact: true },
  { label: "Ritual Bookings", path: "/admin/bookings/rituals" },
  { label: "Community Puja Bookings", path: "/admin/bookings/community-puja" },
  { label: "Astrologer Consultations", path: "/admin/bookings/consultations" },
  { label: "Payments", path: "/admin/payments" },
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

  // Dynamic custom library sections loaded from API with localStorage fallback
  const [customLibraryItems, setCustomLibraryItems] = useState<LibrarySubItem[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_SECTIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item: any) => ({
              id: item.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              label: String(item.label || "").trim(),
              path: String(item.path || "").trim(),
              isCustom: true,
            }))
            .filter((item: LibrarySubItem) => item.label && item.path);
        }
      }
    } catch (e) {
      console.error("Failed to load custom library sections from localStorage", e);
    }
    return [];
  });

  // Hidden default sections (user preference to hide seeded sections like Sukti)
  const [hiddenDefaultSections, setHiddenDefaultSections] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(HIDDEN_DEFAULT_SECTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const savedItems = JSON.parse(localStorage.getItem(CUSTOM_SECTIONS_STORAGE_KEY) || "[]");
          return new Set(
            parsed.map((hiddenId: string) => {
              const slug = String(hiddenId).replace(/^section-/, "").toLowerCase();
              const matchingItem = Array.isArray(savedItems)
                ? savedItems.find(
                    (item: any) =>
                      item.id === hiddenId ||
                      item.id === `section-${slug}` ||
                      String(item.path || "").split("/").pop()?.replace("-branches", "") === slug
                  )
                : null;
              return matchingItem?.label || hiddenId;
            })
          );
        }
      }
    } catch (e) {
      console.error("Failed to load hidden default sections", e);
    }
    return new Set();
  });

  // Preset/default sections from API (seeded sections that should be hidden instead of deleted)
  const [presetSections, setPresetSections] = useState<Set<string>>(new Set());

  // Persist hidden default sections
  useEffect(() => {
    try {
      localStorage.setItem(HIDDEN_DEFAULT_SECTIONS_KEY, JSON.stringify([...hiddenDefaultSections]));
    } catch (e) {
      console.error("Failed to save hidden default sections", e);
    }
  }, [hiddenDefaultSections]);

  // Older versions only hid Suktis in the admin sidebar. Complete that
  // removal against the API so the public frontend stops receiving it too.
  useEffect(() => {
    if (!hiddenDefaultSections.has("Suktis")) return;

    let active = true;
    LibrarySectionService.deleteSection("sukti")
      .then(() => {
        if (!active) return;
        setCustomLibraryItems((prev) =>
          prev.filter(
            (item) =>
              item.id !== "section-sukti" &&
              item.label.toLowerCase() !== "suktis" &&
              !item.path.toLowerCase().includes("sukti")
          )
        );
        setHiddenDefaultSections((prev) => {
          const next = new Set(prev);
          next.delete("Suktis");
          next.delete("section-sukti");
          return next;
        });
      })
      .catch((error) => {
        console.warn("Failed to complete the previous Sukti section removal:", error);
      });

    return () => {
      active = false;
    };
  }, [hiddenDefaultSections]);

  // Sync custom sections from backend API on mount - MERGE with localStorage defaults
  useEffect(() => {
    let active = true;
    LibrarySectionService.getSections().then((sections) => {
      if (!active || !Array.isArray(sections)) return;
      
      // Track preset/seeded sections (those with isPreset=true or slug in known presets)
      const presetSlugs = new Set<string>();
      sections.forEach((sec) => {
        if (sec.isPreset || ["mantra", "stotra", "sukti", "puranas"].includes(sec.slug)) {
          presetSlugs.add(sec.slug);
        }
      });
      setPresetSections(presetSlugs);

      const apiCustom = sections
        .filter((sec) => sec.slug !== "mantra" && sec.slug !== "stotra")
        .map((sec) => ({
          id: sec.id || `section-${sec.slug}`,
          label: sec.label || sec.name || sec.slug,
          path: sec.adminPath || `/admin/library/${sec.slug}-branches`,
          isCustom: true,
        }));
      
      // Merge API sections with existing localStorage sections (avoid duplicates)
      // But don't re-add hidden default sections
      setCustomLibraryItems((prev) => {
        const merged = [...prev];
        apiCustom.forEach((apiItem) => {
          const exists = merged.some((m) => m.path === apiItem.path || m.id === apiItem.id);
          const isHiddenDefault = hiddenDefaultSections.has(apiItem.label);
          if (!exists && !isHiddenDefault) {
            merged.push(apiItem);
          }
        });
        return merged;
      });
    });
    return () => {
      active = false;
    };
  }, [hiddenDefaultSections]);

  // Persist custom sections to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_SECTIONS_STORAGE_KEY, JSON.stringify(customLibraryItems));
    } catch (e) {
      console.error("Failed to save custom library sections to localStorage", e);
    }
  }, [customLibraryItems]);

  // Modal state for adding a new library section
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionPath, setNewSectionPath] = useState("");
  const [pathManuallyEdited, setPathManuallyEdited] = useState(false);
  const [modalError, setModalError] = useState("");

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setNewSectionName("");
    setNewSectionPath("");
    setPathManuallyEdited(false);
    setModalError("");
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewSectionName("");
    setNewSectionPath("");
    setPathManuallyEdited(false);
    setModalError("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewSectionName(val);
    setModalError("");
    if (!pathManuallyEdited) {
      const slug = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      if (slug) {
        setNewSectionPath(`/admin/library/${slug}-branches`);
      } else {
        setNewSectionPath("");
      }
    }
  };

  const handleApplyPreset = (name: string, path: string) => {
    setNewSectionName(name);
    setNewSectionPath(path);
    setPathManuallyEdited(true);
    setModalError("");
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSectionName.trim();
    let path = newSectionPath.trim();

    if (!name) {
      setModalError("Please enter a section name (e.g. Sukti, Stuti, Kavach).");
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!path) {
      path = `/admin/library/${slug}-branches`;
    }

    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    const sectionId = `section-${slug}`;

    // Check for duplicates in existing custom items
    const existingCustom = customLibraryItems.find(
      (item) => item.path === path || item.id === sectionId || item.label.toLowerCase() === name.toLowerCase()
    );
    if (existingCustom) {
      setModalError(`Section "${name}" already exists in sidebar.`);
      return;
    }

    // Check against default items
    const existingDefault = DEFAULT_SCRIPTURE_ITEMS.find(
      (item) => item.path === path || item.label.toLowerCase() === name.toLowerCase()
    );
    if (existingDefault) {
      setModalError(`Section "${name}" already exists as a default section.`);
      return;
    }

    // Check against article items
    const existingArticle = ARTICLE_LIBRARY_ITEMS.find(
      (item) => item.path === path || item.label.toLowerCase() === name.toLowerCase()
    );
    if (existingArticle) {
      setModalError(`Section "${name}" already exists as an article section.`);
      return;
    }

    const newItem: LibrarySubItem = {
      id: sectionId,
      label: name,
      path: path,
      isCustom: true,
    };

    setCustomLibraryItems((prev) => [...prev, newItem]);
    setIsLibraryOpen(true);
    handleCloseAddModal();

    // Persist to backend database API
    const frontendPath =
      slug === "purana" || slug === "puranas"
        ? "/library/purana"
        : `/library/mantra-stotra/all?type=${slug}`;

    try {
      await LibrarySectionService.createSection({
        id: sectionId,
        slug,
        name,
        enName: name,
        label: name,
        path: frontendPath,
        adminPath: path,
        categorySlug: "mantra-stotra",
      });
    } catch (apiErr) {
      console.warn("Backend API section creation fallback to local storage:", apiErr);
    }
  };

  const handleRemoveCustomItem = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const slugFromId = id.replace(/^section-/, "").toLowerCase();
    const itemToDelete = customLibraryItems.find(
      (item) =>
        item.id === id ||
        item.id === `section-${slugFromId}` ||
        item.label.toLowerCase() === slugFromId
    );

    // Check if it's a default/preset section
    const isDefaultSection = DEFAULT_SCRIPTURE_ITEMS.some(
      (item) =>
        item.label.toLowerCase() === id.toLowerCase() ||
        item.path === id ||
        item.path.split("/").pop()?.replace("-branches", "") === slugFromId
    );
    const isPresetSection =
      slugFromId !== "sukti" &&
      (presetSections.has(slugFromId) ||
        DEFAULT_SCRIPTURE_ITEMS.some((item) => item.label.toLowerCase() === id.toLowerCase()));
    
    if (isDefaultSection || isPresetSection) {
      // Hide default/preset section instead of deleting
      const label = DEFAULT_SCRIPTURE_ITEMS.find(
        (item) =>
          item.label.toLowerCase() === id.toLowerCase() ||
          item.path === id ||
          item.path.split("/").pop()?.replace("-branches", "") === slugFromId
      )?.label || itemToDelete?.label || id;
      setHiddenDefaultSections((prev) => {
        const next = new Set(prev);
        next.delete(id);
        next.delete(`section-${slugFromId}`);
        next.add(label);
        return next;
      });
      if (itemToDelete) {
        setCustomLibraryItems((prev) =>
          prev.filter((item) => item.id !== itemToDelete.id && item.path !== itemToDelete.path)
        );
      }
      return;
    }
    
    // For custom sections, proceed with deletion
    const slug = itemToDelete ? itemToDelete.path.split("/").pop()?.replace("-branches", "") : id.replace(/^section-/, "");
    
    // Optimistically remove from UI
    setCustomLibraryItems((prev) =>
      prev.filter(
        (item) =>
          item.id !== id &&
          item.id !== `section-${id.replace(/^section-/, "")}` &&
          item.label.toLowerCase() !== id.replace(/^section-/, "").toLowerCase()
      )
    );

    // Delete from backend using the slug
    try {
      const deleted = await LibrarySectionService.deleteSection(slug);
      if (!deleted) throw new Error(`Failed to remove the ${itemToDelete?.label || "library section"} section.`);
    } catch (apiErr) {
      console.warn("Backend API section deletion fallback:", apiErr);
      if (itemToDelete) {
        setCustomLibraryItems((prev) =>
          prev.some((item) => item.id === itemToDelete.id)
            ? prev
            : [...prev, itemToDelete]
        );
      }
    }
  };

  // Route matches for Library umbrella (recognizes Vedas, Mantras, Blogs & direct aliases & custom sections)
  const isLibraryActive =
    location.pathname.startsWith("/admin/library") ||
    location.pathname.startsWith("/admin/vedas") ||
    location.pathname.startsWith("/admin/mantra-branches") ||
    location.pathname.startsWith("/admin/stotra-branches") ||
    location.pathname.startsWith("/admin/sukti-branches") ||
    location.pathname.startsWith("/admin/mantra-stotra-items") ||
    location.pathname.startsWith("/admin/mantra-stotra-upload") ||
    location.pathname.startsWith("/admin/blogs") ||
    customLibraryItems.some((item) => {
      const basePath = item.path.split("?")[0];
      return location.pathname === basePath || location.pathname.startsWith(basePath + "/");
    });


  // Route matches for Booking Management umbrella
  const isBookingActive =
    location.pathname.startsWith("/admin/booking-overview") ||
    location.pathname.startsWith("/admin/bookings") ||
    location.pathname.startsWith("/admin/payments");

  // Accordion state for Booking Management
  const [isBookingOpen, setIsBookingOpen] = useState(true);

  // Auto-expand Booking Management whenever a booking route is active
  useEffect(() => {
    if (isBookingActive) {
      setIsBookingOpen(true);
    }
  }, [location.pathname, isBookingActive]);

  const isBookingItemActive = (item: BookingSubItem) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return (
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/")
    );
  };

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

  // Auto-expand Yagya & Puja and active sub-section whenever route changes or page refreshes
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
      } else if (
        location.pathname.startsWith("/admin/yagya-services") ||
        location.pathname.startsWith("/admin/yagya/categories") ||
        location.pathname.startsWith("/admin/yagya-categories")
      ) {
        setOpenSubSections((prev) => ({ ...prev, yagya: true }));
      } else if (
        location.pathname.startsWith("/admin/japa-services") ||
        location.pathname.startsWith("/admin/japa/categories") ||
        location.pathname.startsWith("/admin/japa-categories")
      ) {
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

  // Auto-expand Library accordion whenever a Library route is visited directly or refreshed
  useEffect(() => {
    if (isLibraryActive) {
      setIsLibraryOpen(true);
    }
  }, [location.pathname, isLibraryActive]);

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
      basePath === "/admin/yagya/categories" ||
      basePath === "/admin/yagya-categories"
    ) {
      return (
        location.pathname.startsWith("/admin/yagya/categories") ||
        location.pathname.startsWith("/admin/yagya-categories")
      );
    }
    if (
      basePath === "/admin/japa/categories" ||
      basePath === "/admin/japa-categories"
    ) {
      return (
        location.pathname.startsWith("/admin/japa/categories") ||
        location.pathname.startsWith("/admin/japa-categories")
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
    if (section.id === "yagya") {
      return (
        location.pathname.startsWith("/admin/yagya-services") ||
        location.pathname.startsWith("/admin/yagya/categories") ||
        location.pathname.startsWith("/admin/yagya-categories")
      );
    }
    if (section.id === "japa") {
      return (
        location.pathname.startsWith("/admin/japa-services") ||
        location.pathname.startsWith("/admin/japa/categories") ||
        location.pathname.startsWith("/admin/japa-categories")
      );
    }
    if (section.id === "path") {
      return (
        location.pathname.startsWith("/admin/path-services") ||
        location.pathname.startsWith("/admin/path/categories") ||
        location.pathname.startsWith("/admin/path-categories")
      );
    }
    if (section.id === "homa") {
      return (
        location.pathname.startsWith("/admin/homa-services") ||
        location.pathname.startsWith("/admin/homa/categories") ||
        location.pathname.startsWith("/admin/homa-categories")
      );
    }
    return section.items.some((item) => isSubItemActive(item.path));
  };

  const isLibraryItemActive = (item: LibrarySubItem) => {
    const contentType = new URLSearchParams(location.search).get("type");
    const isContentRoute =
      location.pathname.startsWith("/admin/library/mantra-stotra-items") ||
      location.pathname.startsWith("/admin/mantra-stotra-items") ||
      location.pathname.startsWith("/admin/library/mantra-stotra-upload") ||
      location.pathname.startsWith("/admin/mantra-stotra-upload");
    if (isContentRoute && (item.label === "Mantra" || item.label === "Stotra")) {
      return contentType === item.label.toLowerCase();
    }

    const [itemBasePath, itemQuery] = item.path.split("?");

    if (itemQuery) {
      if (
        (location.pathname === itemBasePath ||
          location.pathname.startsWith(itemBasePath + "/")) &&
        location.search.includes(itemQuery)
      ) {
        return true;
      }
    }

    if (
      location.pathname === itemBasePath ||
      location.pathname.startsWith(itemBasePath + "/")
    ) {
      return true;
    }
    if (item.aliases) {
      return item.aliases.some(
        (alias) =>
          location.pathname === alias ||
          location.pathname.startsWith(alias + "/")
      );
    }
    return false;
  };

  const handleLinkClick = () => {
    if (mobileOpen) {
      onClose();
    }
  };

  const sidebarContent = (
    <>
      <div
        className={`flex items-center px-4 py-5 border-b border-cream-200 ${
          collapsed ? "justify-center" : "justify-between"
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
              `flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition group relative ${
                isActive
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
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-saffron-50 text-saffron-700 font-semibold"
                  : "text-charcoal-600 hover:bg-cream-100"
              }`
            }
          >
            <LayoutDashboard
              className={`w-[18px] h-[18px] ${
                location.pathname === "/admin/dashboard"
                  ? "text-saffron-600"
                  : "text-charcoal-400"
              }`}
            />
            <span className="flex-1">Dashboard</span>
          </NavLink>
        )}


        {/* 2. Booking Management */}
        {collapsed ? (
          <NavLink
            to="/admin/bookings"
            className={`flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition group relative ${
              isBookingActive
                ? "bg-saffron-500 text-white"
                : "text-charcoal-500 hover:bg-cream-100"
            }`}
            title="Booking Management"
          >
            <CalendarCheck className="w-5 h-5" />
            {isBookingActive && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-saffron-500 rounded-r-full" />
            )}
          </NavLink>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setIsBookingOpen((prev) => !prev)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                isBookingActive
                  ? "bg-saffron-50 text-saffron-700 font-semibold"
                  : "text-charcoal-600 hover:bg-cream-100"
              }`}
              aria-expanded={isBookingOpen}
            >
              <CalendarCheck
                className={`w-[18px] h-[18px] ${
                  isBookingActive ? "text-saffron-600" : "text-charcoal-400"
                }`}
              />
              <span className="flex-1 text-left font-semibold">Booking Management</span>
              <ChevronDown
                className={`w-4 h-4 text-charcoal-400 transition-transform ${
                  isBookingOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isBookingOpen && (
              <div className="mt-1 ml-6 pl-3 border-l border-cream-200 space-y-0.5">
                {BOOKING_ITEMS.map((item) => {
                  const active = isBookingItemActive(item);
                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`block px-3 py-1.5 rounded-lg text-[13px] transition ${
                        active
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
        )}

        {/* 3. Astrologers Management */}
        {collapsed ? (
          <NavLink
            to="/admin/astrologers"
            className={({ isActive }) =>
              `flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition group relative ${
                isActive || location.pathname.startsWith("/admin/astrologers")
                  ? "bg-saffron-500 text-white"
                  : "text-charcoal-500 hover:bg-cream-100"
              }`
            }
            title="Astrologers"
          >
            <Sparkles className="w-5 h-5" />
            {location.pathname.startsWith("/admin/astrologers") && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-saffron-500 rounded-r-full" />
            )}
          </NavLink>
        ) : (
          <NavLink
            to="/admin/astrologers"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive || location.pathname.startsWith("/admin/astrologers")
                  ? "bg-saffron-50 text-saffron-700 font-semibold"
                  : "text-charcoal-600 hover:bg-cream-100"
              }`
            }
          >
            <Sparkles
              className={`w-[18px] h-[18px] ${
                location.pathname.startsWith("/admin/astrologers")
                  ? "text-saffron-600"
                  : "text-charcoal-400"
              }`}
            />
            <span className="flex-1">Astrologers</span>
          </NavLink>
        )}

        {/* 3. Yagya & Puja (Umbrella Navigation) */}
        {collapsed ? (
          <NavLink
            to="/admin/upcoming-pujas"
            className={`flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition group relative ${
              isYagyaPujaActive
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                isYagyaPujaActive
                  ? "bg-saffron-50 text-saffron-700 font-semibold"
                  : "text-charcoal-600 hover:bg-cream-100"
              }`}
              aria-expanded={isYagyaPujaOpen}
            >
              <Flame
                className={`w-[18px] h-[18px] ${
                  isYagyaPujaActive ? "text-saffron-600" : "text-charcoal-400"
                }`}
              />
              <span className="flex-1 text-left font-semibold">Yagya & Puja</span>
              <ChevronDown
                className={`w-4 h-4 text-charcoal-400 transition-transform ${
                  isYagyaPujaOpen ? "rotate-180" : ""
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
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-[0.14em] transition cursor-pointer ${
                          sectionActive
                            ? "text-saffron-700 bg-saffron-50/60 font-bold"
                            : "text-charcoal-500 hover:text-charcoal-800 hover:bg-cream-50"
                        }`}
                        aria-expanded={isOpen}
                      >
                        <span>{section.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-charcoal-400 transition-transform ${
                            isOpen ? "rotate-180 text-saffron-600" : ""
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
                                className={`block px-2.5 py-1.5 rounded-md text-[13px] transition ${
                                  active
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

        {/* 3. Library (Vedas, Mantras, Sukti, Custom Sections, Blog Posts) */}
        {collapsed ? (
          <NavLink
            to="/admin/library/vedas"
            className={`flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition group relative ${
              isLibraryActive
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
            <div
              onClick={() => setIsLibraryOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer select-none ${
                isLibraryActive
                  ? "bg-saffron-50 text-saffron-700 font-semibold"
                  : "text-charcoal-600 hover:bg-cream-100"
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsLibraryOpen((prev) => !prev);
                }
              }}
              aria-expanded={isLibraryOpen}
            >
              <div className="flex items-center gap-3">
                <BookOpen
                  className={`w-[18px] h-[18px] ${
                    isLibraryActive ? "text-saffron-600" : "text-charcoal-400"
                  }`}
                />
                <span className="font-semibold">Library</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenAddModal();
                  }}
                  className="p-1 rounded-md text-charcoal-400 hover:text-saffron-700 hover:bg-saffron-200/60 transition cursor-pointer"
                  title="Add New Library Section"
                  aria-label="Add New Library Section"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <ChevronDown
                  className={`w-4 h-4 text-charcoal-400 transition-transform ${
                    isLibraryOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {isLibraryOpen && (
              <div className="mt-1 ml-6 pl-3 border-l border-cream-200 space-y-0.5">
                {/* Default Scripture/Texts items (Vedas) */}
                {DEFAULT_SCRIPTURE_ITEMS.slice(0, 1)
                  .filter((item) => !hiddenDefaultSections.has(item.label))
                  .map((item) => {
                    const active = isLibraryItemActive(item);
                    return (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={handleLinkClick}
                        className={`block px-3 py-1.5 rounded-lg text-[13px] transition ${
                          active
                            ? "text-saffron-700 font-semibold bg-saffron-50/70"
                            : "text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-50 font-normal"
                        }`}
                      >
                        {item.label}
                      </NavLink>
                    );
                  })}

                {/* Default Scripture/Texts items (Mantra, Stotra, Sukti) */}
                {DEFAULT_SCRIPTURE_ITEMS.slice(1)
                  .filter((item) => !hiddenDefaultSections.has(item.label))
                  .map((item) => {
                    const active = isLibraryItemActive(item);
                    return (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={handleLinkClick}
                        className={`block px-3 py-1.5 rounded-lg text-[13px] transition ${
                          active
                            ? "text-saffron-700 font-semibold bg-saffron-50/70"
                            : "text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-50 font-normal"
                        }`}
                      >
                        {item.label}
                      </NavLink>
                    );
                  })}

                {/* Dynamically Added Custom Library Sections */}
                {customLibraryItems
                  .filter((item) => !hiddenDefaultSections.has(item.label))
                  .map((item) => {
                  const active = isLibraryItemActive(item);
                  return (
                    <div
                      key={item.id || item.label}
                      className="group flex items-center justify-between rounded-lg pr-1 hover:bg-cream-50/80 transition relative"
                    >
                      <NavLink
                        to={item.path}
                        onClick={handleLinkClick}
                        className={`flex-1 px-3 py-1.5 rounded-lg text-[13px] transition truncate ${
                          active
                            ? "text-saffron-700 font-semibold bg-saffron-50/70"
                            : "text-charcoal-500 hover:text-charcoal-700 font-normal"
                        }`}
                        title={item.label}
                      >
                        {item.label}
                      </NavLink>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveCustomItem(item.id || item.label.toLowerCase(), e);
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer z-10"
                        title={`Remove ${item.label}`}
                        aria-label={`Remove ${item.label}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                  })}

                {/* Inline Add Library Section Button */}
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-saffron-600 hover:text-saffron-800 hover:bg-saffron-50/60 rounded-md font-medium transition cursor-pointer text-left mt-1"
                  title="Add New Library Section"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>

                {/* Restore Hidden Default Sections */}
                {hiddenDefaultSections.size > 0 && (
                  <div className="pt-2 border-t border-cream-200 mt-1">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-charcoal-400 mb-1">
                      Hidden Sections
                    </p>
                    {[...hiddenDefaultSections].map((label) => (
                      <div
                        key={label}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[13px] text-charcoal-500 hover:bg-cream-50 transition"
                      >
                        <span>{label}</span>
                        <button
                          type="button"
                          onClick={() => setHiddenDefaultSections((prev) => { const next = new Set(prev); next.delete(label); return next; })}
                          className="p-1 text-saffron-600 hover:text-saffron-800 hover:bg-saffron-50 rounded transition cursor-pointer"
                          title={`Restore ${label}`}
                          aria-label={`Restore ${label}`}
                        >
                          <span className="text-[11px] font-bold">+</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Articles / Blog */}
                <div className="pt-2">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-charcoal-400 mb-1">
                    Articles
                  </p>
                  {ARTICLE_LIBRARY_ITEMS.map((item) => {
                    const active = isLibraryItemActive(item);
                    return (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={handleLinkClick}
                        className={`block px-3 py-1.5 rounded-lg text-[13px] transition ${
                          active
                            ? "text-saffron-700 font-semibold bg-saffron-50/70"
                            : "text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-50 font-normal"
                        }`}
                      >
                        {item.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* 4. Logout */}
      <div className="px-3 py-4 border-t border-cream-200">
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition w-full cursor-pointer ${
            collapsed ? "justify-center" : ""
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
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-cream-200 transition-all duration-300 z-30 ${
          collapsed ? "w-20" : "w-64"
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

      {/* Add Library Section Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-sm animate-fade-in"
          onClick={handleCloseAddModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-cream-200 w-full max-w-md overflow-hidden animate-slide-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-section-modal-title"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 bg-cream-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-saffron-100 flex items-center justify-center text-saffron-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="add-section-modal-title" className="text-base font-bold text-charcoal-900">
                    Add Library Section
                  </h3>
                  <p className="text-xs text-charcoal-500">
                    Add a new scripture or content section to the sidebar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="text-charcoal-400 hover:text-charcoal-600 p-1 rounded-lg hover:bg-cream-200/50 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSection} className="p-6 space-y-4">
              {/* Quick suggestions / Presets */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 mb-1.5 uppercase tracking-wider">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_LIBRARY_SUGGESTIONS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset.name, preset.path)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition cursor-pointer ${
                        newSectionName === preset.name
                          ? "bg-saffron-500 text-white border-saffron-500 font-medium"
                          : "border-cream-300 text-charcoal-600 bg-cream-50 hover:border-saffron-400 hover:text-saffron-700"
                      }`}
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Name */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Section Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={handleNameChange}
                  placeholder="e.g. Sukti, Stuti, Kavach, Upanishads"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-cream-300 bg-white text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition"
                  autoFocus
                />
              </div>

              {/* Path / Slug */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Path / Route Slug
                </label>
                <input
                  type="text"
                  value={newSectionPath}
                  onChange={(e) => {
                    setNewSectionPath(e.target.value);
                    setPathManuallyEdited(true);
                  }}
                  placeholder="e.g. /admin/library/sukti-branches"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-cream-300 bg-white text-charcoal-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition"
                />
                <p className="mt-1 text-[11px] text-charcoal-400">
                  Target route link (defaults to <code className="text-charcoal-600 font-mono">/admin/library/{"<slug>"}-branches</code>)
                </p>
              </div>

              {/* Error Message */}
              {modalError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                  {modalError}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-4 py-2 text-sm font-medium text-charcoal-600 hover:text-charcoal-800 hover:bg-cream-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-saffron-600 hover:bg-saffron-700 active:bg-saffron-800 rounded-lg shadow-sm transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Sidebar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
