import { useState } from "react";
import { Users, Building2, Shield, Search, Plus, ChevronRight, Mail, MapPin, CreditCard, Clock } from "lucide-react";
import { employees, clients, roles } from "../data/mockData";

type Tab = "employees" | "clients" | "roles";

const roleColors: Record<string, string> = {
  管理者: "bg-red-100 text-red-700",
  経理: "bg-purple-100 text-purple-700",
  人事: "bg-blue-100 text-blue-700",
  一般: "bg-slate-100 text-slate-600",
};

const statusColors: Record<string, string> = {
  在職: "bg-green-100 text-green-700",
  休職: "bg-yellow-100 text-yellow-700",
  退職: "bg-red-100 text-red-700",
  取引中: "bg-green-100 text-green-700",
  要確認: "bg-amber-100 text-amber-700",
};

export function Masters() {
  const [tab, setTab] = useState<Tab>("employees");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredEmployees = employees.filter(
    (e) => e.name.includes(search) || e.department.includes(search) || e.email.includes(search)
  );
  const filteredClients = clients.filter(
    (c) => c.name.includes(search) || c.contact.includes(search) || c.address.includes(search)
  );

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-slate-900">マスタ</h1>
          <p className="text-slate-500 text-sm mt-0.5">社員・取引先・権限の管理</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-slate-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Plus size={14} />
          {tab === "employees" ? "社員を追加" : tab === "clients" ? "取引先を追加" : "権限を追加"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {([
            { id: "employees", label: "社員", icon: Users, count: employees.length },
            { id: "clients", label: "取引先", icon: Building2, count: clients.length },
            { id: "roles", label: "権限", icon: Shield, count: roles.length },
          ] as { id: Tab; label: string; icon: any; count: number }[]).map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSelected(null); setSearch(""); }}
                className={`flex items-center gap-2 text-sm px-4 py-1.5 rounded-md transition-colors
                  ${tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Icon size={14} />
                {t.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-slate-100" : "bg-slate-200"}`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {tab !== "roles" && (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={tab === "employees" ? "名前、部署、メールで検索..." : "会社名、担当者で検索..."}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex gap-5">
        <div className="flex-1">
          {tab === "employees" && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">社員ID</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">氏名</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">部署</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">役職</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">メール</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">入社日</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">権限</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">状態</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      onClick={() => setSelected(emp)}
                      className={`border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors
                        ${selected?.id === emp.id ? "bg-slate-50" : ""}`}
                    >
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{emp.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-medium">
                              {emp.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-slate-800 font-medium">{emp.name}</p>
                            <p className="text-xs text-slate-400">{emp.nameKana}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{emp.department}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{emp.position}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{emp.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{emp.joinDate}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[emp.role] || "bg-slate-100 text-slate-600"}`}>
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[emp.status]}`}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "clients" && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">会社名</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">住所</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">担当者</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">契約形態</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">支払条件</th>
                    <th className="text-right text-xs text-slate-500 font-medium px-4 py-3">与信枠</th>
                    <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">状態</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      onClick={() => setSelected(client)}
                      className={`border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors
                        ${selected?.id === client.id ? "bg-slate-50" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Building2 size={13} className="text-slate-500" />
                          </div>
                          <p className="text-sm text-slate-800 font-medium">{client.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-[180px]">
                        <span className="truncate block">{client.address}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{client.contact}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{client.contractType}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{client.paymentTerms}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-slate-700">
                        ¥{(client.creditLimit / 10000).toFixed(0)}万
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[client.status]}`}>
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "roles" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelected(role)}
                  className={`bg-white rounded-xl border cursor-pointer p-5 hover:shadow-md transition-all
                    ${selected?.id === role.id ? "border-slate-400 shadow-md" : "border-slate-200"}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Shield size={15} className="text-slate-600" />
                        <h3 className="text-slate-900 text-sm">{role.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500">{role.description}</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                      {role.members}名
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {role.permissions.map((perm) => (
                      <span key={perm} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail side panel for employees/clients */}
        {selected && tab !== "roles" && (
          <div className="w-72 bg-white rounded-xl border border-slate-200 p-5 flex-shrink-0 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 text-sm">
                {tab === "employees" ? "社員情報" : "取引先情報"}
              </h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            {tab === "employees" && (
              <div className="space-y-4">
                <div className="text-center py-2">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-400 to-slate-700 flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xl font-semibold">{selected.name.charAt(0)}</span>
                  </div>
                  <p className="text-slate-900 font-medium text-sm">{selected.name}</p>
                  <p className="text-slate-500 text-xs">{selected.nameKana}</p>
                </div>
                <div className="space-y-2.5">
                  <DetailItem icon={<Building2 size={13} />} label={selected.department} sub={selected.position} />
                  <DetailItem icon={<Mail size={13} />} label={selected.email} />
                  <DetailItem icon={<CreditCard size={13} />} label={selected.joinDate} sub="入社日" />
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[selected.role]}`}>{selected.role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>{selected.status}</span>
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <button className="flex-1 bg-slate-800 text-white text-xs py-2 rounded-lg hover:bg-slate-700 transition-colors">編集</button>
                  <button className="flex-1 bg-slate-100 text-slate-600 text-xs py-2 rounded-lg hover:bg-slate-200 transition-colors">権限変更</button>
                </div>
              </div>
            )}

            {tab === "clients" && (
              <div className="space-y-3.5">
                <div className="space-y-2">
                  <DetailItem icon={<Building2 size={13} />} label={selected.name} />
                  <DetailItem icon={<MapPin size={13} />} label={selected.address} />
                  <DetailItem icon={<Users size={13} />} label={selected.contact} sub="担当者" />
                  <DetailItem icon={<CreditCard size={13} />} label={selected.contractType} sub="契約形態" />
                  <DetailItem icon={<Clock size={13} />} label={selected.paymentTerms} sub="支払条件" />
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">与信枠</p>
                  <p className="text-sm font-semibold text-slate-800">
                    ¥{selected.creditLimit.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>{selected.status}</span>
                </div>
                <div className="pt-1 flex gap-2">
                  <button className="flex-1 bg-slate-800 text-white text-xs py-2 rounded-lg hover:bg-slate-700 transition-colors">編集</button>
                  <button className="flex-1 bg-slate-100 text-slate-600 text-xs py-2 rounded-lg hover:bg-slate-200 transition-colors">取引履歴</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 text-slate-400 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-slate-700">{label}</p>
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}