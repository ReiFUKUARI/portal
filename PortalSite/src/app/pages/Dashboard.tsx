import { useState } from "react";
import { Link } from "react-router";
import {
  Settings,
  ChevronRight,
  Pin,
  MessageSquare,
  Train,
  Receipt,
  Clock,
  Calendar,
  FolderOpen,
  BookOpen,
  CreditCard,
  Building2,
  ClipboardList,
  Check,
  X,
  AlertTriangle,
  Bell,
  FileText,
} from "lucide-react";
import { alerts, bulletinPosts } from "../data/mockData";

// ────────────────────────────────────────────
// Shortcut definitions
// ────────────────────────────────────────────
const ALL_SHORTCUTS = [
  {
    id: "transport",
    label: "交通費申請",
    icon: Train,
    to: "/applications",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "expense",
    label: "経費申請",
    icon: Receipt,
    to: "/applications",
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: "leave",
    label: "有給申請",
    icon: Calendar,
    to: "/attendance",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "overtime",
    label: "残業申請",
    icon: Clock,
    to: "/attendance",
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: "attendance",
    label: "勤怠実績",
    icon: ClipboardList,
    to: "/attendance",
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    id: "bulletin",
    label: "掲示板",
    icon: MessageSquare,
    to: "/bulletin-board",
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    id: "documents",
    label: "文書管理",
    icon: FolderOpen,
    to: "/documents",
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    id: "knowledge",
    label: "社内ナレッジ",
    icon: BookOpen,
    to: "/internal-docs",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: "accounting",
    label: "会計",
    icon: CreditCard,
    to: "/accounting",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "clients",
    label: "取引先",
    icon: Building2,
    to: "/masters",
    bg: "bg-slate-50",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  {
    id: "applications",
    label: "申請一覧",
    icon: FileText,
    to: "/applications",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

const DEFAULT_IDS = ["transport", "expense", "leave", "overtime", "attendance", "bulletin"];

// ────────────────────────────────────────────
// Alert type styles
// ────────────────────────────────────────────
const alertTypeColors: Record<string, string> = {
  契約更新: "bg-blue-100 text-blue-700",
  有給残日数: "bg-green-100 text-green-700",
  勤怠未入力: "bg-orange-100 text-orange-700",
  未承認申請: "bg-purple-100 text-purple-700",
  支払期限: "bg-red-100 text-red-700",
};

const categoryColors: Record<string, string> = {
  重要: "bg-red-100 text-red-700",
  お知らせ: "bg-blue-100 text-blue-700",
  健康: "bg-green-100 text-green-700",
  システム: "bg-purple-100 text-purple-700",
  イベント: "bg-orange-100 text-orange-700",
};

// ────────────────────────────────────────────
// Dashboard Component
// ────────────────────────────────────────────
export function Dashboard() {
  const [activeIds, setActiveIds] = useState<string[]>(DEFAULT_IDS);
  const [customizing, setCustomizing] = useState(false);

  const activeShortcuts = ALL_SHORTCUTS.filter((s) => activeIds.includes(s.id));
  const unreadAlerts = alerts.filter((a) => a.status === "未対応");
  const recentPosts = bulletinPosts.slice(0, 5);

  const toggleShortcut = (id: string) => {
    setActiveIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-slate-900">ダッシュボード</h1>
        <p className="text-slate-500 text-sm mt-0.5">{dateStr}　田中さん、おはようございます</p>
      </div>

      {/* ── よく使う機能 ── */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-slate-700">よく使う機能</h2>
          <button
            onClick={() => setCustomizing(true)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <Settings size={12} />
            カスタマイズ
          </button>
        </div>

        {activeShortcuts.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
            {activeShortcuts.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.id}
                  to={s.to}
                  className={`${s.bg} rounded-2xl p-3 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-150 group`}
                >
                  <div
                    className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <Icon size={22} className={s.iconColor} />
                  </div>
                  <span className="text-xs text-slate-700 text-center leading-tight">{s.label}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center">
            <p className="text-sm text-slate-400">機能が選択されていません</p>
            <button
              onClick={() => setCustomizing(true)}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              カスタマイズして追加する
            </button>
          </div>
        )}
      </section>

      {/* ── 通知 + 掲示板 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 通知 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-slate-700">通知</h2>
              {unreadAlerts.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-medium rounded-full px-2 py-0.5 leading-tight">
                  {unreadAlerts.length}
                </span>
              )}
            </div>
            <Link
              to="/alerts"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition-colors"
            >
              すべて見る
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {unreadAlerts.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={28} className="mx-auto mb-2 text-slate-200" />
                <p className="text-sm text-slate-400">未対応の通知はありません</p>
              </div>
            ) : (
              <div>
                {unreadAlerts.slice(0, 5).map((alert, i) => (
                  <Link
                    key={alert.id}
                    to="/alerts"
                    className={`flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors
                      ${i < Math.min(unreadAlerts.length, 5) - 1 ? "border-b border-slate-100" : ""}`}
                  >
                    {/* Severity dot */}
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        alert.severity === "高" ? "bg-red-500" : "bg-amber-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            alertTypeColors[alert.type] ?? "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 truncate">{alert.detail}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">担当: {alert.target}</p>
                    </div>
                    <span
                      className={`text-xs flex-shrink-0 px-1.5 py-0.5 rounded font-medium ${
                        alert.daysLeft < 0
                          ? "bg-red-100 text-red-700"
                          : alert.daysLeft === 0
                          ? "bg-red-100 text-red-700"
                          : alert.daysLeft <= 7
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {alert.daysLeft < 0
                        ? `${Math.abs(alert.daysLeft)}日超過`
                        : alert.daysLeft === 0
                        ? "本日期限"
                        : `残${alert.daysLeft}日`}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 掲示板 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-700">掲示板</h2>
            <Link
              to="/bulletin-board"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition-colors"
            >
              すべて見る
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {recentPosts.map((post, i) => (
              <Link
                key={post.id}
                to="/bulletin-board"
                className={`flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors
                  ${i < recentPosts.length - 1 ? "border-b border-slate-100" : ""}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {post.pinned ? (
                    <Pin size={13} className="text-blue-500" />
                  ) : (
                    <MessageSquare size={13} className="text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        categoryColors[post.category] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 truncate">{post.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-slate-400">{post.author}</span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{post.date}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-300 flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── カスタマイズ Modal ── */}
      {customizing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh]">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
              <div>
                <h3 className="text-slate-900">よく使う機能をカスタマイズ</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  表示する機能を選んでください（{activeIds.length}件選択中）
                </p>
              </div>
              <button
                onClick={() => setCustomizing(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Shortcut list */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-2">
                {ALL_SHORTCUTS.map((s) => {
                  const Icon = s.icon;
                  const isActive = activeIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleShortcut(s.id)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${
                        isActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 ${s.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon size={17} className={s.iconColor} />
                      </div>
                      <span className="text-xs text-slate-700 flex-1 leading-tight">{s.label}</span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive ? "border-blue-500 bg-blue-500" : "border-slate-300"
                        }`}
                      >
                        {isActive && <Check size={11} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setCustomizing(false)}
                className="w-full bg-slate-900 text-white text-sm py-3 rounded-xl hover:bg-slate-700 transition-colors"
              >
                保存して閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
