import { Outlet, NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Clock,
  CreditCard,
  FolderOpen,
  BookOpen,
  Bell,
  Database,
  ChevronRight,
  User,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { alerts } from "../data/mockData";

const nav = [
  { to: "/", label: "ダッシュボード", icon: LayoutDashboard, end: true },
  { to: "/bulletin-board", label: "掲示板", icon: MessageSquare },
  { to: "/applications", label: "社内申請", icon: FileText },
  { to: "/attendance", label: "勤怠", icon: Clock },
  { to: "/accounting", label: "会計", icon: CreditCard },
  { to: "/documents", label: "文書管理", icon: FolderOpen },
  { to: "/internal-docs", label: "社内ナレッジ", icon: BookOpen },
  { to: "/alerts", label: "通知", icon: Bell },
  { to: "/masters", label: "マスタ", icon: Database },
];

const unreadCount = alerts.filter((a) => a.status === "未対応").length;

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close user menu on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSidebarHamburger = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileOpen(false);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const currentPage = nav.find((n) =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  );

  const SidebarNav = () => (
    <nav className="flex-1 overflow-y-auto py-2 px-2">
      {nav.map((item) => {
        const Icon = item.icon;
        const isNotif = item.to === "/alerts";
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-colors
              ${collapsed ? "lg:justify-center lg:px-0" : ""}
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative flex-shrink-0">
                  <Icon size={18} />
                  {isNotif && unreadCount > 0 && collapsed && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900" />
                  )}
                </div>
                {!collapsed && (
                  <>
                    <span className="text-sm flex-1 truncate">{item.label}</span>
                    {isNotif && unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-tight">
                        {unreadCount}
                      </span>
                    )}
                  </>
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-30 h-screen
          flex flex-col bg-slate-900 flex-shrink-0
          transition-all duration-200 ease-in-out
          w-64
          ${collapsed ? "lg:w-16" : "lg:w-60"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar top: hamburger only */}
        <div
          className={`h-14 flex items-center border-b border-slate-700/60 flex-shrink-0
            ${collapsed ? "justify-center" : "px-3"}`}
        >
          <button
            onClick={handleSidebarHamburger}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="メニューを切り替え"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <SidebarNav />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 flex-shrink-0 z-10">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="メニューを開く"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
            <span className="text-slate-400 hidden sm:inline">社内ポータル</span>
            {location.pathname !== "/" && (
              <>
                <ChevronRight size={13} className="text-slate-300 hidden sm:inline flex-shrink-0" />
                <span className="text-slate-800 font-medium truncate">
                  {currentPage?.label ?? ""}
                </span>
              </>
            )}
            {location.pathname === "/" && (
              <span className="text-slate-800 font-medium">ダッシュボード</span>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Bell */}
            <NavLink
              to="/alerts"
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="通知"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center leading-none font-medium">
                  {unreadCount}
                </span>
              )}
            </NavLink>

            {/* User avatar + dropdown */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors
                  ${userMenuOpen ? "bg-blue-700 ring-2 ring-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                aria-label="ユーザーメニュー"
              >
                <User size={16} className="text-white" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                  {/* User info */}
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <User size={20} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">田中 一郎</p>
                        <p className="text-xs text-slate-600">営業部 / 課長</p>
                        <p className="text-xs text-slate-400 truncate">tanaka@company.com</p>
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Settings size={15} className="text-slate-400" />
                      個人設定
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors mt-0.5">
                      <LogOut size={15} className="text-red-400" />
                      ログアウト
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
