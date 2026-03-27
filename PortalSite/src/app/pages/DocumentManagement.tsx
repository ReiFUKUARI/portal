import { useState } from "react";
import {
  FileText,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Eye,
} from "lucide-react";
import { contracts } from "../data/mockData";

const typeColors: Record<string, string> = {
  契約書: "bg-blue-100 text-blue-700",
  見積書: "bg-orange-100 text-orange-700",
  発注書: "bg-purple-100 text-purple-700",
  受注書: "bg-teal-100 text-teal-700",
  請書: "bg-green-100 text-green-700",
};

const statusColors: Record<string, string> = {
  有効: "bg-green-100 text-green-700",
  期限切れ間近: "bg-amber-100 text-amber-700",
  確定: "bg-blue-100 text-blue-700",
  進行中: "bg-purple-100 text-purple-700",
  失効: "bg-red-100 text-red-700",
};

type TypeFilter = "すべて" | "契約書" | "見積書" | "発注書" | "受注書";

export function DocumentManagement() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("すべて");
  const [selected, setSelected] = useState<(typeof contracts)[0] | null>(null);

  const alertDocs = contracts.filter((c) => c.renewalAlert);

  const filtered = contracts.filter((c) => {
    const matchSearch = c.title.includes(search) || c.client.includes(search) || c.id.includes(search);
    const matchType = typeFilter === "すべて" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-slate-900">文書管理</h1>
          <p className="text-slate-500 text-sm mt-0.5">契約書・見積書・発注書・受注書の管理</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          <Plus size={14} />
          文書を登録
        </button>
      </div>

      {/* Alert banner */}
      {alertDocs.length > 0 && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={15} className="text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">更新期限が近い文書（{alertDocs.length}件）</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alertDocs.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className="text-xs bg-white border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
              >
                {d.title} — 期限: {d.endDate}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {(["契約書", "見積書", "発注書", "受注書"] as TypeFilter[]).map((type) => {
          const count = contracts.filter((c) => c.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? "すべて" : type)}
              className={`rounded-xl p-3.5 text-left border-2 transition-all ${typeColors[type]?.replace("text-", "border-").split(" ")[0] || ""}`}
              style={{ background: typeFilter === type ? undefined : "white" }}
            >
              <p className="text-xs text-slate-500 mb-1">{type}</p>
              <p className="text-xl font-semibold text-slate-800">
                {count}
                <span className="text-sm font-normal text-slate-500 ml-1">件</span>
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex gap-5">
        {/* List */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Search + filter bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="文書名、取引先で検索..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-1.5">
              {(["すべて", "契約書", "見積書", "発注書", "受注書"] as TypeFilter[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors
                    ${typeFilter === t
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">文書名</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">種別</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">取引先</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">開始日</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">終了日</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">ステータス</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => setSelected(doc)}
                    className={`border-b border-slate-100 cursor-pointer hover:bg-teal-50 transition-colors
                      ${selected?.id === doc.id ? "bg-teal-50" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {doc.renewalAlert && (
                          <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
                        )}
                        <span className="text-sm text-slate-800">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[doc.type] || "bg-slate-100 text-slate-600"}`}>
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{doc.client}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{doc.startDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{doc.endDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[doc.status] || "bg-slate-100 text-slate-600"}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button className="p-1.5 rounded text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors" title="プレビュー">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 rounded text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors" title="ダウンロード">
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-72 bg-white rounded-xl border border-slate-200 p-5 flex-shrink-0 h-fit">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[selected.type] || ""}`}>
                  {selected.type}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <h3 className="text-slate-900 text-sm mb-4 leading-snug">{selected.title}</h3>
            <div className="space-y-3">
              <Detail label="取引先" value={selected.client} />
              <Detail label="開始日" value={selected.startDate} />
              <Detail label="終了日" value={selected.endDate} />
              <Detail
                label="ステータス"
                value={
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>
                    {selected.status}
                  </span>
                }
              />
              {selected.renewalAlert && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">この文書は期限が近づいています。更新手続きを確認してください。</p>
                </div>
              )}
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 bg-teal-600 text-white text-xs py-2 rounded-lg hover:bg-teal-700 transition-colors">
                編集
              </button>
              <button className="flex-1 bg-slate-100 text-slate-600 text-xs py-2 rounded-lg hover:bg-slate-200 transition-colors">
                ダウンロード
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <div className="text-sm text-slate-700">{value}</div>
    </div>
  );
}
