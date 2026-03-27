import { useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Search, Plus } from "lucide-react";
import { receivables, payables } from "../data/mockData";

type Tab = "receivables" | "payables";

const recStatusColors: Record<string, string> = {
  未回収: "bg-blue-100 text-blue-700",
  超過: "bg-red-100 text-red-700",
  回収済: "bg-green-100 text-green-700",
};

const payStatusColors: Record<string, string> = {
  未払: "bg-yellow-100 text-yellow-700",
  支払済: "bg-green-100 text-green-700",
  期限超過: "bg-red-100 text-red-700",
};

export function Accounting() {
  const [tab, setTab] = useState<Tab>("receivables");
  const [search, setSearch] = useState("");

  const totalReceivable = receivables
    .filter((r) => r.status !== "回収済")
    .reduce((s, r) => s + r.amount, 0);
  const overdueReceivable = receivables
    .filter((r) => r.status === "超過")
    .reduce((s, r) => s + r.amount, 0);
  const totalPayable = payables
    .filter((p) => p.status !== "支払済")
    .reduce((s, p) => s + p.amount, 0);
  const overduePayable = payables
    .filter((p) => p.status === "期限超過")
    .reduce((s, p) => s + p.amount, 0);

  const filteredReceivables = receivables.filter((r) =>
    r.client.includes(search) || r.invoiceNo.includes(search)
  );
  const filteredPayables = payables.filter((p) =>
    p.vendor.includes(search) || p.invoiceNo.includes(search)
  );

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-slate-900">会計</h1>
          <p className="text-slate-500 text-sm mt-0.5">売掛・買掛の管理</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          <Plus size={14} />
          新規登録
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <SummaryCard
          label="売掛残高"
          value={totalReceivable}
          icon={<TrendingUp size={18} className="text-purple-600" />}
          bg="bg-purple-50"
          color="text-purple-700"
        />
        <SummaryCard
          label="売掛超過"
          value={overdueReceivable}
          icon={<AlertTriangle size={18} className="text-red-600" />}
          bg="bg-red-50"
          color="text-red-700"
          alert
        />
        <SummaryCard
          label="買掛残高"
          value={totalPayable}
          icon={<TrendingDown size={18} className="text-slate-600" />}
          bg="bg-slate-50"
          color="text-slate-700"
        />
        <SummaryCard
          label="支払期限超過"
          value={overduePayable}
          icon={<AlertTriangle size={18} className="text-red-600" />}
          bg="bg-red-50"
          color="text-red-700"
          alert
        />
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setTab("receivables")}
            className={`text-sm px-4 py-1.5 rounded-md transition-colors
              ${tab === "receivables" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            売掛
          </button>
          <button
            onClick={() => setTab("payables")}
            className={`text-sm px-4 py-1.5 rounded-md transition-colors
              ${tab === "payables" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            買掛
          </button>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="取引先、請求書番号で検索..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tables */}
      {tab === "receivables" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">請求ID</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">取引先</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">請求書番号</th>
                <th className="text-right text-xs text-slate-500 font-medium px-4 py-3">金額</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">発行日</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">期限日</th>
                <th className="text-right text-xs text-slate-500 font-medium px-4 py-3">超過日数</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceivables.map((r) => (
                <tr
                  key={r.id}
                  className={`border-b border-slate-100 hover:bg-purple-50 transition-colors cursor-pointer
                    ${r.status === "超過" ? "bg-red-50/40" : ""}`}
                >
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{r.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.client}</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-600">{r.invoiceNo}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-800">
                    ¥{r.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{r.issueDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{r.dueDate}</td>
                  <td className="px-4 py-3 text-right">
                    {r.daysOverdue > 0 ? (
                      <span className="text-sm font-medium text-red-600 flex items-center justify-end gap-1">
                        <AlertTriangle size={12} />
                        {r.daysOverdue}日
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">―</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${recStatusColors[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "payables" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">ID</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">仕入先</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">請求書番号</th>
                <th className="text-right text-xs text-slate-500 font-medium px-4 py-3">金額</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">発行日</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">支払期限</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">カテゴリ</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayables.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b border-slate-100 hover:bg-purple-50 transition-colors cursor-pointer
                    ${p.status === "期限超過" ? "bg-red-50/40" : ""}`}
                >
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{p.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{p.vendor}</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-600">{p.invoiceNo}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-800">
                    ¥{p.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{p.issueDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{p.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${payStatusColors[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  bg,
  color,
  alert,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
  color: string;
  alert?: boolean;
}) {
  return (
    <div className={`${bg} rounded-xl p-4 ${alert && value > 0 ? "ring-1 ring-red-300" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500">{label}</span>
        {icon}
      </div>
      <p className={`text-lg font-semibold ${color}`}>
        ¥{(value / 10000).toFixed(0)}
        <span className="text-xs font-normal text-slate-500 ml-1">万円</span>
      </p>
    </div>
  );
}
