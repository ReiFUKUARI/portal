import { useState } from "react";
import { Plus, Search, Filter, ChevronDown, FileText, Train, Receipt } from "lucide-react";
import { applications } from "../data/mockData";

const statusColors: Record<string, string> = {
  申請中: "bg-yellow-100 text-yellow-700",
  承認済: "bg-green-100 text-green-700",
  差戻し: "bg-red-100 text-red-700",
  却下: "bg-gray-100 text-gray-600",
};

type Tab = "all" | "交通費申請" | "経費申請";

export function Applications() {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("すべて");
  const [selected, setSelected] = useState<(typeof applications)[0] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"交通費申請" | "経費申請">("交通費申請");

  const filtered = applications.filter((a) => {
    const matchTab = tab === "all" || a.type === tab;
    const matchSearch = a.applicant.includes(search) || a.description.includes(search) || a.id.includes(search);
    const matchStatus = statusFilter === "すべて" || a.status === statusFilter;
    return matchTab && matchSearch && matchStatus;
  });

  const stats = {
    all: applications.length,
    申請中: applications.filter((a) => a.status === "申請中").length,
    承認済: applications.filter((a) => a.status === "承認済").length,
    差戻し: applications.filter((a) => a.status === "差戻し").length,
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-slate-900">社内申請</h1>
          <p className="text-slate-500 text-sm mt-0.5">{filtered.length}件の申請</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setFormType("交通費申請"); setShowForm(true); }}
            className="flex items-center gap-2 bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Train size={14} />
            交通費申請
          </button>
          <button
            onClick={() => { setFormType("経費申請"); setShowForm(true); }}
            className="flex items-center gap-2 bg-orange-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Receipt size={14} />
            経費申請
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "すべて", value: stats.all, color: "text-slate-700", bg: "bg-slate-50" },
          { label: "申請中", value: stats.申請中, color: "text-yellow-700", bg: "bg-yellow-50" },
          { label: "承認済", value: stats.承認済, color: "text-green-700", bg: "bg-green-50" },
          { label: "差戻し", value: stats.差戻し, color: "text-red-700", bg: "bg-red-50" },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(s.label === "すべて" ? "すべて" : s.label)}
            className={`${s.bg} rounded-xl p-3.5 text-left border-2 transition-all
              ${statusFilter === (s.label === "すべて" ? "すべて" : s.label)
                ? "border-orange-400"
                : "border-transparent"}`}
          >
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>
              {s.value}
              <span className="text-sm font-normal ml-1">件</span>
            </p>
          </button>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(["all", "交通費申請", "経費申請"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors
                ${tab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {t === "all" ? "すべて" : t}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="申請者、内容で検索..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">申請ID</th>
              <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">種別</th>
              <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">申請者</th>
              <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">内容</th>
              <th className="text-right text-xs text-slate-500 font-medium px-4 py-3">金額</th>
              <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">申請日</th>
              <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app, i) => (
              <tr
                key={app.id}
                onClick={() => setSelected(app)}
                className={`border-b border-slate-100 cursor-pointer hover:bg-orange-50 transition-colors
                  ${selected?.id === app.id ? "bg-orange-50" : ""}`}
              >
                <td className="px-4 py-3">
                  <span className="text-xs font-mono text-slate-500">{app.id}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 text-sm">
                    {app.type === "交通費申請" ? (
                      <Train size={13} className="text-blue-500" />
                    ) : (
                      <Receipt size={13} className="text-orange-500" />
                    )}
                    <span className="text-slate-700">{app.type}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{app.applicant}</td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600 truncate max-w-[200px] block">{app.description}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-slate-800">¥{app.amount.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">{app.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      statusColors[app.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail / Form modal */}
      {(selected || showForm) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-slate-900">
                {showForm ? `${formType} - 新規申請` : `申請詳細 (${selected?.id})`}
              </h3>
              <button
                onClick={() => { setSelected(null); setShowForm(false); }}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {showForm ? (
                <ApplicationForm type={formType} onClose={() => setShowForm(false)} />
              ) : selected ? (
                <ApplicationDetail app={selected} />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicationDetail({ app }: { app: (typeof applications)[0] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="申請ID" value={app.id} />
        <Field label="種別" value={app.type} />
        <Field label="申請者" value={app.applicant} />
        <Field label="申請日" value={app.date} />
        <Field label="金額" value={`¥${app.amount.toLocaleString()}`} />
        <Field
          label="ステータス"
          value={
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              { 申請中: "bg-yellow-100 text-yellow-700", 承認済: "bg-green-100 text-green-700", 差戻し: "bg-red-100 text-red-700" }[app.status] || ""
            }`}>
              {app.status}
            </span>
          }
        />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-1">申請内容</p>
        <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{app.description}</p>
      </div>
      {app.status === "申請中" && (
        <div className="flex gap-2 pt-4">
          <button className="flex-1 bg-green-600 text-white text-sm py-2.5 rounded-lg hover:bg-green-700 transition-colors">
            承認する
          </button>
          <button className="flex-1 bg-red-50 text-red-600 text-sm py-2.5 rounded-lg hover:bg-red-100 transition-colors border border-red-200">
            差し戻す
          </button>
        </div>
      )}
    </div>
  );
}

function ApplicationForm({ type, onClose }: { type: string; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-500 block mb-1">申請日</label>
        <input type="date" defaultValue="2026-03-25" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      </div>
      {type === "交通費申請" ? (
        <>
          <div>
            <label className="text-xs text-slate-500 block mb-1">出発地</label>
            <input type="text" placeholder="例：渋谷" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">目的地</label>
            <input type="text" placeholder="例：新宿" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">往復 / 片道</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option>往復</option>
              <option>片道</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="text-xs text-slate-500 block mb-1">経費カテゴリ</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option>書籍・資料</option>
              <option>接待交際費</option>
              <option>消耗品</option>
              <option>研修・セミナー</option>
              <option>その他</option>
            </select>
          </div>
        </>
      )}
      <div>
        <label className="text-xs text-slate-500 block mb-1">金額（円）</label>
        <input type="number" placeholder="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      </div>
      <div>
        <label className="text-xs text-slate-500 block mb-1">申請内容・備考</label>
        <textarea
          rows={3}
          placeholder="詳細を記入してください"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button className="flex-1 bg-orange-600 text-white text-sm py-2.5 rounded-lg hover:bg-orange-700 transition-colors">
          申請する
        </button>
        <button onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 text-sm py-2.5 rounded-lg hover:bg-slate-200 transition-colors">
          キャンセル
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <div className="text-sm text-slate-800">{value}</div>
    </div>
  );
}