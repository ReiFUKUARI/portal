import { useState } from "react";
import { Clock, Calendar, Plus, Search, AlertCircle } from "lucide-react";
import { attendanceRecords, leaveRequests, overtimeRequests } from "../data/mockData";

type Tab = "records" | "leave" | "overtime";

const statusColors: Record<string, string> = {
  確定: "bg-green-100 text-green-700",
  未確定: "bg-yellow-100 text-yellow-700",
  未入力: "bg-red-100 text-red-700",
  申請中: "bg-yellow-100 text-yellow-700",
  承認済: "bg-green-100 text-green-700",
};

export function Attendance() {
  const [tab, setTab] = useState<Tab>("records");
  const [search, setSearch] = useState("");
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showOvertimeForm, setShowOvertimeForm] = useState(false);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-slate-900">勤怠</h1>
          <p className="text-slate-500 text-sm mt-0.5">勤怠実績・各種申請の管理</p>
        </div>
        <div className="flex gap-2">
          {tab === "leave" && (
            <button
              onClick={() => setShowLeaveForm(true)}
              className="flex items-center gap-2 bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={14} />
              有給申請
            </button>
          )}
          {tab === "overtime" && (
            <button
              onClick={() => setShowOvertimeForm(true)}
              className="flex items-center gap-2 bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={14} />
              残業申請
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">本日出勤者</p>
          <p className="text-xl font-semibold text-green-700">
            {attendanceRecords.filter((r) => r.clockIn).length}
            <span className="text-sm font-normal text-slate-500 ml-1">名</span>
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">勤怠未確定</p>
          <p className="text-xl font-semibold text-yellow-700">
            {attendanceRecords.filter((r) => r.status !== "確定").length}
            <span className="text-sm font-normal text-slate-500 ml-1">件</span>
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">有給申請中</p>
          <p className="text-xl font-semibold text-blue-700">
            {leaveRequests.filter((r) => r.status === "申請中").length}
            <span className="text-sm font-normal text-slate-500 ml-1">件</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {([
            { id: "records", label: "勤怠実績" },
            { id: "leave", label: "有給休暇申請" },
            { id: "overtime", label: "残業申請" },
          ] as { id: Tab; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors
                ${tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="社員名で検索..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-52"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {tab === "records" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">社員名</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">日付</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">出勤</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">退勤</th>
                <th className="text-right text-xs text-slate-500 font-medium px-4 py-3">残業時間</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords
                .filter((r) => r.employee.includes(search))
                .map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.employee}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{r.date}</td>
                    <td className="px-4 py-3">
                      {r.clockIn ? (
                        <span className="text-sm text-slate-700 flex items-center gap-1.5">
                          <Clock size={13} className="text-green-500" />
                          {r.clockIn}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">―</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.clockOut ? (
                        <span className="text-sm text-slate-700 flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-400" />
                          {r.clockOut}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">―</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm ${r.overtime > 0 ? "text-orange-600 font-medium" : "text-slate-400"}`}>
                        {r.overtime > 0 ? `${r.overtime}h` : "―"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 ${statusColors[r.status]}`}>
                        {r.status === "未入力" && <AlertCircle size={10} />}
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "leave" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">申請ID</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">社員名</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">種別</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">開始日</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">終了日</th>
                <th className="text-right text-xs text-slate-500 font-medium px-4 py-3">日数</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">理由</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests
                .filter((r) => r.employee.includes(search))
                .map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{r.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.employee}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{r.type}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{r.startDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{r.endDate}</td>
                    <td className="px-4 py-3 text-right text-sm text-slate-700">{r.days}日</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{r.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "overtime" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">申請ID</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">社員名</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">日付</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">開始</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">終了</th>
                <th className="text-right text-xs text-slate-500 font-medium px-4 py-3">時間数</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">理由</th>
                <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {overtimeRequests
                .filter((r) => r.employee.includes(search))
                .map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{r.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.employee}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{r.date}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{r.startTime}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{r.endTime}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-orange-600">{r.hours}h</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{r.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Leave Form Modal */}
      {showLeaveForm && (
        <FormModal title="有給休暇申請" onClose={() => setShowLeaveForm(false)}>
          <div className="space-y-4">
            <FormField label="種別">
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>有給休暇</option>
                <option>特別休暇</option>
                <option>半日休暇</option>
              </select>
            </FormField>
            <FormField label="開始日">
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </FormField>
            <FormField label="終了日">
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </FormField>
            <FormField label="理由">
              <textarea rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </FormField>
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 text-white text-sm py-2.5 rounded-lg hover:bg-green-700 transition-colors">申請する</button>
              <button onClick={() => setShowLeaveForm(false)} className="flex-1 bg-slate-100 text-slate-600 text-sm py-2.5 rounded-lg hover:bg-slate-200 transition-colors">キャンセル</button>
            </div>
          </div>
        </FormModal>
      )}

      {/* Overtime Form Modal */}
      {showOvertimeForm && (
        <FormModal title="残業申請" onClose={() => setShowOvertimeForm(false)}>
          <div className="space-y-4">
            <FormField label="日付">
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="開始時刻">
                <input type="time" defaultValue="18:00" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </FormField>
              <FormField label="終了時刻">
                <input type="time" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </FormField>
            </div>
            <FormField label="理由">
              <textarea rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </FormField>
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 text-white text-sm py-2.5 rounded-lg hover:bg-green-700 transition-colors">申請する</button>
              <button onClick={() => setShowOvertimeForm(false)} className="flex-1 bg-slate-100 text-slate-600 text-sm py-2.5 rounded-lg hover:bg-slate-200 transition-colors">キャンセル</button>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}

function FormModal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-slate-500 block mb-1">{label}</label>
      {children}
    </div>
  );
}