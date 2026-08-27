import { useEffect, useMemo, useState } from "react";
import { supabase, type Recommendation } from "@/lib/supabase";
import {
  MOD_SECTIONS,
  LEVEL_LABEL,
  LEVEL_STYLE,
  type ModLevel,
} from "@/lib/mods";
import {
  Loader2,
  Save,
  X,
  Check,
  AlertCircle,
  Package,
  Search,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";

interface RecommendationFormProps {
  editingRec: Recommendation | null;
  onDone: () => void;
}

const LEVEL_ORDER: ModLevel[] = ["core", "recommend", "optional", "dep", "warn"];

export default function RecommendationForm({
  editingRec,
  onDone,
}: RecommendationFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [note, setNote] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customMods, setCustomMods] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [editingCustomIndex, setEditingCustomIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [activeLevels, setActiveLevels] = useState<Set<ModLevel>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingRec) {
      setAuthorName(editingRec.author_name);
      setNote(editingRec.note || "");
      setSelectedIds(editingRec.mod_ids);
      setCustomMods(editingRec.custom_mods || []);
    }
  }, [editingRec]);

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

  const toggleMod = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addCustomMod = () => {
    const name = customInput.trim();
    if (!name) return;
    if (editingCustomIndex !== null) {
      setCustomMods((prev) =>
        prev.map((m, i) => (i === editingCustomIndex ? name : m))
      );
      setEditingCustomIndex(null);
    } else {
      setCustomMods((prev) => [...prev, name]);
    }
    setCustomInput("");
  };

  const removeCustomMod = (index: number) => {
    setCustomMods((prev) => prev.filter((_, i) => i !== index));
    if (editingCustomIndex === index) setEditingCustomIndex(null);
  };

  const startEditCustom = (index: number) => {
    setCustomInput(customMods[index]);
    setEditingCustomIndex(index);
  };

  const toggleLevel = (level: ModLevel) => {
    setActiveLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  const handleSubmit = async () => {
    const name = authorName.trim();
    if (!name) {
      setError("請填入你的名字。");
      return;
    }
    if (selectedIds.length === 0 && customMods.length === 0) {
      setError("請至少勾選或輸入一個模組。");
      return;
    }

    setSaving(true);
    setError(null);

    if (editingRec) {
      const { error } = await supabase
        .from("recommendations")
        .update({
          author_name: name,
          mod_ids: selectedIds,
          custom_mods: customMods,
          note: note.trim() || null,
        })
        .eq("id", editingRec.id)
        .eq("edit_token", editingRec.edit_token);

      setSaving(false);
      if (error) {
        setError("更新失敗，請稍後再試。");
        return;
      }
      onDone();
    } else {
      const { data, error } = await supabase
        .from("recommendations")
        .insert({
          author_name: name,
          mod_ids: selectedIds,
          custom_mods: customMods,
          note: note.trim() || null,
        })
        .select("id, edit_token")
        .single();

      setSaving(false);
      if (error || !data) {
        setError("儲存失敗，請稍後再試。");
        return;
      }

      const tokens: Record<string, string> = JSON.parse(
        localStorage.getItem("mc-mod-rec-tokens") || "{}"
      );
      tokens[data.id] = data.edit_token;
      localStorage.setItem("mc-mod-rec-tokens", JSON.stringify(tokens));

      onDone();
    }
  };

  return (
    <div className="space-y-5">
      {/* Header info */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-800">
            {editingRec ? "編輯你的推薦" : "建立你的模組推薦"}
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            勾選你想推薦的模組，填入名字後送出。
          </p>
        </div>
        <button
          onClick={onDone}
          className="p-2 rounded-lg text-stone-500 hover:bg-stone-200 transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Name + note */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            你的名字 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="例如：ice_candy"
            maxLength={30}
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
        </div>      
      </div>

      {/* Selected counter */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-800 text-white">
        <Check className="w-4 h-4" />
        <span className="text-sm font-medium">
          已勾選 {selectedIds.length} 個模組
        </span>
      </div>

      {/* Search and filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋模組名稱或功能..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
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
          {(query || activeLevels.size > 0) && (
            <button
              onClick={() => {
                setQuery("");
                setActiveLevels(new Set());
              }}
              className="px-3 py-1 rounded-full text-xs font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              清除篩選
            </button>
          )}
        </div>
      </div>

      {/* Mod list */}
      <div className="space-y-6">
        {filteredSections.map((section) => (
          <div key={section.id}>
            <div className="flex items-center gap-2 mb-2.5">
              <Package className="w-4 h-4 text-green-800" />
              <h3 className="text-sm font-bold text-stone-700">{section.title}</h3>
            </div>
            <div className="grid gap-2">
              {section.mods.map((mod) => {
                const selected = selectedIds.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    onClick={() => toggleMod(mod.id)}
                    className={`group flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
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
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{mod.effect}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom mods input */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-green-800" />
          <h3 className="text-sm font-bold text-stone-700">自己填模組（選填）</h3>
        </div>
        <p className="text-xs text-stone-500">
          清單上沒有的模組可以在這裡自己輸入。
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomMod();
              }
            }}
            placeholder="輸入模組名稱後按 Enter..."
            maxLength={60}
            className="flex-1 px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
          />
          <button
            onClick={addCustomMod}
            disabled={!customInput.trim()}
            className="px-3 py-2 rounded-lg bg-green-800 text-white text-sm font-medium hover:bg-green-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {editingCustomIndex !== null ? "更新" : "加入"}
          </button>
          {editingCustomIndex !== null && (
            <button
              onClick={() => {
                setCustomInput("");
                setEditingCustomIndex(null);
              }}
              className="px-3 py-2 rounded-lg border border-stone-300 text-stone-600 text-sm font-medium hover:bg-stone-100 transition-colors"
            >
              取消
            </button>
          )}
        </div>
        {customMods.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {customMods.map((mod, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-xs text-green-900"
              >
                {mod}
                <button
                  onClick={() => startEditCustom(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => removeCustomMod(index)}
                  className="text-green-600 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onDone}
          className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-100 transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-800 text-white text-sm font-bold hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              儲存中...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {editingRec ? "更新推薦" : "送出推薦"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
