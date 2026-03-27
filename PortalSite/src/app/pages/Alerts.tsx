import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  FileText,
  CreditCard,
  Calendar,
  RefreshCw,
  Filter,
} from "lucide-react";
import { alerts } from "../data/mockData";

const severityColors: Record<string, string> = {
  高: "bg-red-100 text-red-700 border-red-200",
  中: "bg-amber-100 text-amber-700 border-amber-200",
  低: "bg-blue-100 text-blue-700 border-blue-200",
};

const typeIcons: Record<string, React.ReactNode> = {
  契約更新: <FileText size={15} className="text-blue-600" />,
  有給残日数: <Calendar size={15} className="text-green-600" />,
  勤怠未入力: <Clock size={15} className="text-orange-600" />,
  未承認申請: <Bell size={15} className="text-purple-600" />,
  支払期限: <CreditCard size={15} className="text-red-600" />,
};

type SeverityFilter = "すべて" | "高" | "中" | "低";
type StatusFilter = "すべて" | "未対応" | "対応済";

export function Notifications() {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("すべて");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("未対応");
  const [localAlerts, setLocalAlerts] = useState(alerts);

  const filtered = localAlerts.filter((a) => {
    const matchSev = severityFilter === "すべて" || a.severity === severityFilter;
    const matchStatus = statusFilter === "すべて" || a.status === statusFilter;
    return matchSev && matchStatus;
  });

  const markDone = (id: string) => {
    setLocalAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "対応済" } : a))
    );
  };

  const stats = {
    total: localAlerts.length,
    high: localAlerts.filter((a) => a.severity === "高" && a.status === "未対応").length,
    mid: localAlerts.filter((a) => a.severity === "中" && a.status === "未対応").length,
    done: localAlerts.filter((a) => a.status === "対応済").length,
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-slate-900">通知</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            未対応 {localAlerts.filter((a) => a.status === "未対応").length}件 / 全{localAlerts.length}件
          </p>
        </div>
        <button className="flex items-center gap-2 text-slate-600 text-sm px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <RefreshCw size={14} />
          更新
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-xs text-slate-500 mb-1">高 - 未対応</p>
          <p className="text-xl font-semibold text-red-700">
            {stats.high}
            <span className="text-sm font-normal text-slate-500 ml-1">件</span>
          </p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-xs text-slate-500 mb-1">中 - 未対応</p>
          <p className="text-xl font-semibold text-amber-700">
            {stats.mid}
            <span className="text-sm font-normal text-slate-500 ml-1">件</span>
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">合計</p>
          <p className="text-xl font-semibold text-slate-700">
            {stats.total}
            <span className="text-sm font-normal text-slate-500 ml-1">件</span>
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">対応済</p>
          <p className="text-xl font-semibold text-green-700">
            {stats.done}
            <span className="text-sm font-normal text-slate-500 ml-1">件</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(["すべて", "未対応", "対応済"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors
                ${statusFilter === s ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-slate-400" />
          <span className="text-xs text-slate-500">重要度:</span>
          {(["すべて", "高", "中", "低"] as SeverityFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors
                ${severityFilter === s
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-xl border-l-4 border border-slate-200 p-4 hover:shadow-sm transition-all
              ${alert.severity === "高" && alert.status === "未対応"
                ? "border-l-red-500"
                : alert.severity === "中" && alert.status === "未対応"
                ? "border-l-amber-500"
                : "border-l-slate-300"
              }
              ${alert.status === "対応済" ? "opacity-60" : ""}
            `}
          >
            <div className="flex items-start gap-4">
              {/* Type icon */}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                alert.status === "対応済" ? "bg-green-50" : "bg-slate-50"
              }`}>
                {alert.status === "対応済" ? (
                  <CheckCircle size={15} className="text-green-600" />
                ) : (
                  typeIcons[alert.type] || <AlertTriangle size={15} className="text-slate-500" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                        severityColors[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {alert.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Deadline badge */}
                    {alert.status === "未対応" && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
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
                    )}
                    {alert.status === "対応済" && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                        対応済
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-800 font-medium mb-1">{alert.detail}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>担当: {alert.target}</span>
                  <span>期限: {alert.dueDate}</span>
                </div>
              </div>

              {/* Action button */}
              {alert.status === "未対応" && (
                <button
                  onClick={() => markDone(alert.id)}
                  className="flex-shrink-0 text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  対応済にする
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CheckCircle size={36} className="mx-auto mb-3 text-green-400" />
            <p className="text-slate-600 text-sm font-medium">対象の通知はありません</p>
            <p className="text-slate-400 text-xs mt-1">すべての通知が確認済みです</p>
          </div>
        )}
      </div>
    </div>
  );
}