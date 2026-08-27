import { useMemo, useState } from "react";
import { Search, X, Package, AlertTriangle } from "lucide-react";
import {
  MOD_SECTIONS,
  LEVEL_LABEL,
  LEVEL_STYLE,
  type Mod,
  type ModLevel,
} from "@/lib/mods";

interface ModGuideProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const LEVEL_ORDER: ModLevel[] = ["core", "recommend", "optional", "dep", "warn"];

export default function ModGuide({ selectedIds, onToggle }: ModGuideProps) {
  const [query, setQuery] = useState("");
  const [activeLevels, setActiveLevels] = useState<Set<ModLevel>>(new Set());

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOD_SECTIONS.map((section) => {
      const mods = section.mods.filter((m) => {
        const matchesQuery =
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.effect.toLowerCase().includes(q);
        const matchesLevel =
          activeLevels.size === 0 || activeLevels.has(m.level);
        return matchesQuery && matchesLevel;
      });
      return { ...section, mods };
    }).filter((s) => s.mods.length > 0);
  }, [query, activeLevels]);

  const toggleLevel = (level: ModLevel) => {
    setActiveLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  const clearFilters = () => {
    setQuery("");
    setActiveLevels(new Set());
  };

  const hasFilters = query.trim() !== "" || activeLevels.size > 0;

  return (
    <div className="space-y-6">
      {/* Search and filter bar */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋模組名稱或功能..."
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {LEVEL_ORDER.map((level) => (
              <button
                key={level}
                onClick={() => toggleLevel(level)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeLevels.has(level)
                    ? LEVEL_STYLE[level] + " shadow-sm"
                    : "bg-white border border-stone-300 text-stone-600 hover:border-stone-400"
                }`}
              >
                {LEVEL_LABEL[level]}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 rounded-full text-xs font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
              >
                清除篩選
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mod sections */}
      <div className="space-y-8">
        {filteredSections.map((section) => (
          <div key={section.id}>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-green-800" />
              <h3 className="text-lg font-bold text-stone-800">{section.title}</h3>
            </div>
            {section.note && (
              <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800 leading-relaxed">{section.note}</p>
              </div>
            )}
            <div className="grid gap-2.5">
              {section.mods.map((mod) => (
                <ModCard
                  key={mod.id}
                  mod={mod}
                  selected={selectedIds.includes(mod.id)}
                  onToggle={() => onToggle(mod.id)}
                />
              ))}
            </div>
          </div>
        ))}
        {filteredSections.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>沒有符合條件的模組</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ModCard({
  mod,
  selected,
  onToggle,
}: {
  mod: Mod;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`group flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
        selected
          ? "border-green-700 bg-green-50 ring-1 ring-green-700"
          : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
      }`}
    >
      <div
        className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all ${
          selected
            ? "border-green-700 bg-green-700"
            : "border-stone-300 group-hover:border-stone-400"
        }`}
      >
        {selected && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-semibold ${selected ? "text-green-900" : "text-stone-800"}`}>
            {mod.name}
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${LEVEL_STYLE[mod.level]}`}>
            {LEVEL_LABEL[mod.level]}
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">{mod.effect}</p>
        <p className="text-[11px] text-stone-400 mt-1">負載：{mod.load}</p>
      </div>
    </button>
  );
}
