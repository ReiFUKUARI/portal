import { useState } from "react";
import { Pin, ChevronRight, Plus, Search, Tag, Calendar, User } from "lucide-react";
import { bulletinPosts } from "../data/mockData";

const categoryColors: Record<string, string> = {
  重要: "bg-red-100 text-red-700",
  お知らせ: "bg-blue-100 text-blue-700",
  健康: "bg-green-100 text-green-700",
  システム: "bg-purple-100 text-purple-700",
  イベント: "bg-orange-100 text-orange-700",
};

export function BulletinBoard() {
  const [selected, setSelected] = useState<(typeof bulletinPosts)[0] | null>(bulletinPosts[0]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("すべて");

  const categories = ["すべて", ...Array.from(new Set(bulletinPosts.map((p) => p.category)))];

  const filtered = bulletinPosts.filter((p) => {
    const matchSearch = p.title.includes(search) || p.author.includes(search);
    const matchCat = categoryFilter === "すべて" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-slate-900">掲示板</h1>
          <p className="text-slate-500 text-sm mt-0.5">全{bulletinPosts.length}件の投稿</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={15} />
          新規投稿
        </button>
      </div>

      <div className="flex gap-5 h-[calc(100vh-200px)]">
        {/* List pane */}
        <div className="w-80 xl:w-96 flex-shrink-0 flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="タイトル、投稿者で検索..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filtered.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelected(post)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all
                  ${selected?.id === post.id
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  {post.pinned && <Pin size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      categoryColors[post.category] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {post.category}
                  </span>
                </div>
                <p className="text-sm text-slate-800 font-medium line-clamp-2 mb-2">{post.title}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <User size={11} />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {post.date}
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
                  {selected.pinned && (
                    <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      <Pin size={11} />
                      固定
                    </span>
                  )}
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      categoryColors[selected.category] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {selected.category}
                  </span>
                </div>
                <h2 className="text-slate-900 mb-4">{selected.title}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    {selected.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {selected.date}
                  </span>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-slate-700 leading-relaxed">{selected.content}</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <p className="text-sm">投稿を選択してください</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
