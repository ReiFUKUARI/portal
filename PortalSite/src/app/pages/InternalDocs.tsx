import { useState } from "react";
import { BookOpen, Search, Download, Eye, Clock, User, Tag } from "lucide-react";
import { internalDocs } from "../data/mockData";

const categoryColors: Record<string, string> = {
  就業規則: "bg-rose-100 text-rose-700",
  経費ルール: "bg-orange-100 text-orange-700",
  マニュアル: "bg-blue-100 text-blue-700",
  規程: "bg-purple-100 text-purple-700",
};

const categories = ["すべて", "就業規則", "経費ルール", "マニュアル", "規程"];

export function Knowledge() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("すべて");
  const [selected, setSelected] = useState<(typeof internalDocs)[0] | null>(internalDocs[0]);

  const filtered = internalDocs.filter((d) => {
    const matchSearch = d.title.includes(search) || d.updatedBy.includes(search);
    const matchCat = categoryFilter === "すべて" || d.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="mb-5">
        <h1 className="text-slate-900">社内ナレッジ</h1>
        <p className="text-slate-500 text-sm mt-0.5">就業規則・経費ルール・マニュアルなど</p>
      </div>

      <div className="flex gap-5 h-[calc(100vh-200px)]">
        {/* List pane */}
        <div className="w-80 xl:w-96 flex-shrink-0 flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="文書名で検索..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors
                  ${categoryFilter === cat
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Document list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filtered.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelected(doc)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all
                  ${selected?.id === doc.id
                    ? "bg-rose-50 border-rose-200 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      categoryColors[doc.category] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {doc.category}
                  </span>
                  <span className="text-xs text-slate-400 flex-shrink-0">{doc.version}</span>
                </div>
                <p className="text-sm text-slate-800 font-medium mb-2">{doc.title}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {doc.updatedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={11} />
                    {doc.updatedBy}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail pane */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          {selected ? (
            <>
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      categoryColors[selected.category] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {selected.category}
                  </span>
                  <span className="text-xs text-slate-400">{selected.version}</span>
                </div>
                <h2 className="text-slate-900 mb-4">{selected.title}</h2>
                <div className="flex items-center gap-5 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    更新日: {selected.updatedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    更新者: {selected.updatedBy}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} />
                    {selected.size}
                  </span>
                </div>
              </div>

              {/* Preview area */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-slate-50 rounded-xl border border-slate-200 h-64 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">文書プレビュー</p>
                    <p className="text-xs mt-1">PDFビューアーがここに表示されます</p>
                  </div>
                </div>

                <div className="mt-5 bg-slate-50 rounded-xl p-4">
                  <h4 className="text-slate-700 text-sm mb-3">変更履歴</h4>
                  <div className="space-y-2">
                    {[
                      { ver: selected.version, date: selected.updatedAt, by: selected.updatedBy, note: "最新版" },
                      { ver: "v" + (parseFloat(selected.version.slice(1)) - 0.1).toFixed(1), date: "2025-10-01", by: selected.updatedBy, note: "一部改定" },
                      { ver: "v1.0", date: "2024-04-01", by: "経営企画部", note: "初版" },
                    ].map((h, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="w-10 text-right font-mono text-slate-500">{h.ver}</span>
                        <span className="text-slate-400">{h.date}</span>
                        <span>{h.by}</span>
                        <span className="text-slate-400">{h.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-slate-100 flex gap-2">
                <button className="flex items-center gap-2 flex-1 justify-center bg-rose-600 text-white text-sm py-2 rounded-lg hover:bg-rose-700 transition-colors">
                  <Download size={14} />
                  ダウンロード
                </button>
                <button className="flex items-center gap-2 flex-1 justify-center bg-slate-100 text-slate-600 text-sm py-2 rounded-lg hover:bg-slate-200 transition-colors">
                  <Eye size={14} />
                  プレビュー
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <p className="text-sm">文書を選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}