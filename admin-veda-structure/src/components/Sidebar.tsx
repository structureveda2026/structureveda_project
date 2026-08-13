import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  GraduationCap,
  CalendarCheck,
  ShoppingBag,
  Users,
  UserCog,
  CreditCard,
  Star,
  Ticket,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  X,
  MessageSquare,
} from "lucide-react";
import Logo from "./Logo";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  {
    label: "Catalog",
    path: "/admin/products",
    icon: Package,
    children: [
      { label: "Products", path: "/admin/products" },
      { label: "Categories", path: "/admin/categories" },
      { label: "Inventory", path: "/admin/products?tab=inventory" },
    ],
  },
  {
    label: "Courses",
    path: "/admin/courses",
    icon: GraduationCap,
    children: [
      { label: "All Courses", path: "/admin/courses" },
      { label: "Categories", path: "/admin/courses?tab=categories" },
    ],
  },
  {
    label: "Bookings",
    path: "/admin/bookings",
    icon: CalendarCheck,
    children: [
      { label: "Astrology Bookings", path: "/admin/bookings?type=Astrology" },
      { label: "Pandit Bookings", path: "/admin/bookings?type=Pandit" },
      { label: "Upcoming Sessions", path: "/admin/bookings?status=Upcoming" },
      { label: "Completed Sessions", path: "/admin/bookings?status=Completed" },
    ],
  },
  { label: "Consultations", path: "/admin/consultations", icon: MessageSquare },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
    children: [
      { label: "All Orders", path: "/admin/orders" },
      { label: "Pending", path: "/admin/orders?status=Pending" },
      { label: "Processing", path: "/admin/orders?status=Processing" },
      { label: "Shipped", path: "/admin/orders?status=Shipped" },
      { label: "Delivered", path: "/admin/orders?status=Delivered" },
      { label: "Cancelled", path: "/admin/orders?status=Cancelled" },
    ],
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: Users,
    children: [{ label: "All Customers", path: "/admin/customers" }],
  },
  {
    label: "Experts",
    path: "/admin/experts",
    icon: UserCog,
    children: [
      { label: "Pandits", path: "/admin/experts?type=Pandit" },
      { label: "Astrologers", path: "/admin/experts?type=Astrologer" },
      { label: "Spiritual Experts", path: "/admin/experts?type=Spiritual" },
    ],
  },
  { label: "Payments", path: "/admin/payments", icon: CreditCard },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
  { label: "Coupons & Offers", path: "/admin/coupons", icon: Ticket },
  { label: "Notifications", path: "/admin/notifications", icon: Bell },
  { label: "Reports & Analytics", path: "/admin/reports", icon: BarChart3 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
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

  const isActive = (path: string) => {
    const basePath = path.split("?")[0];
    return location.pathname === basePath;
  };

  const isParentActive = (item: NavItem) => {
    if (location.pathname === item.path) return true;
    return (
      item.children?.some((c) => location.pathname === c.path.split("?")[0]) ??
      false
    );
  };

  const sidebarContent = (
    <>
      <div
        className={`flex items-center px-4 py-5 border-b border-cream-200 ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {collapsed ? <Logo collapsed /> : <Logo />}
        <button
          onClick={onClose}
          className="lg:hidden text-charcoal-400 hover:text-charcoal-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isParentActive(item);
          const Icon = item.icon;

          if (collapsed) {
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={`flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition group relative ${
                  active
                    ? "bg-saffron-500 text-white"
                    : "text-charcoal-500 hover:bg-cream-100"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                {active && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-saffron-500 rounded-r-full" />
                )}
              </NavLink>
            );
          }

          return (
            <div key={item.label}>
              <NavLink
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-saffron-50 text-saffron-700"
                    : "text-charcoal-600 hover:bg-cream-100"
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] ${active ? "text-saffron-600" : "text-charcoal-400"}`}
                />
                <span className="flex-1">{item.label}</span>
                {item.children && (
                  <ChevronDown
                    className={`w-4 h-4 text-charcoal-300 transition-transform ${active ? "rotate-180" : ""}`}
                  />
                )}
              </NavLink>
              {item.children && active && (
                <div className="mt-0.5 ml-6 pl-3 border-l border-cream-200 space-y-0.5">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.label}
                      to={child.path}
                      className={`block px-3 py-2 rounded-lg text-[13px] transition ${
                        isActive(child.path)
                          ? "text-saffron-700 font-medium"
                          : "text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-50"
                      }`}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-cream-200">
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition w-full ${collapsed ? "justify-center" : ""}`}
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
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-cream-200 transition-all duration-300 z-30 ${collapsed ? "w-20" : "w-64"}`}
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
