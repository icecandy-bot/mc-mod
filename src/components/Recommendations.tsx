import { useEffect, useState, useCallback } from "react";
import { supabase, type Recommendation } from "@/lib/supabase";
import { getModById, LEVEL_LABEL, LEVEL_STYLE } from "@/lib/mods";
import { Trash2, Pencil, Eye, Plus, Loader2, AlertCircle } from "lucide-react";

const TOKENS_KEY = "mc-mod-rec-tokens";

function getStoredTokens(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(TOKENS_KEY) || "{}");
  } catch {
    return {};
  }
}

function storeToken(id: string, token: string) {
  const tokens = getStoredTokens();
  tokens[id] = token;
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

function removeToken(id: string) {
  const tokens = getStoredTokens();
  delete tokens[id];
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export default function Recommendations({
  onEdit,
}: {
  onEdit: (rec: Recommendation) => void;
}) {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Record<string, string>>({});

  const fetchRecs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("recommendations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("無法載入推薦列表，請稍後再試。");
    } else {
      setRecs((data as Recommendation[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecs();
    setTokens(getStoredTokens());
  }, [fetchRecs]);

  const handleDelete = async (rec: Recommendation) => {
    if (!tokens[rec.id]) return;
    if (!confirm(`確定要刪除「${rec.author_name}」的推薦嗎？此操作無法復原。`)) return;

    const { error } = await supabase
      .from("recommendations")
      .delete()
      .eq("id", rec.id)
      .eq("edit_token", tokens[rec.id]);

    if (error) {
      setError("刪除失敗，請稍後再試。");
    } else {
      removeToken(rec.id);
      setTokens(getStoredTokens());
      fetchRecs();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm">載入推薦中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchRecs}
          className="px-4 py-2 rounded-lg bg-green-800 text-white text-sm font-medium hover:bg-green-900 transition-colors"
        >
          重試
        </button>
      </div>
    );
  }

  if (recs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <Plus className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-sm">目前還沒有推薦，前往「推薦模組」分頁建立第一個吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recs.map((rec) => {
        const isOwner = !!tokens[rec.id];
        return (
          <RecCard
            key={rec.id}
            rec={rec}
            isOwner={isOwner}
            onEdit={() => onEdit(rec)}
            onDelete={() => handleDelete(rec)}
          />
        );
      })}
    </div>
  );
}

function RecCard({
  rec,
  isOwner,
  onEdit,
  onDelete,
}: {
  rec: Recommendation;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const modCount = rec.mod_ids.length + (rec.custom_mods?.length || 0);
  const allMods = [...rec.mod_ids];
  const allCustom = rec.custom_mods || [];
  const visibleMods = expanded ? allMods : allMods.slice(0, 6);
  const visibleCustom = expanded ? allCustom : allCustom.slice(0, Math.max(0, 6 - visibleMods.length));

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-green-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {rec.author_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-stone-800 text-base">{rec.author_name}</h3>
              <p className="text-xs text-stone-400">
                {new Date(rec.created_at).toLocaleString("zh-TW", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" · "}
                {modCount} 個模組
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isOwner ? (
              <>
                <button
                  onClick={onEdit}
                  className="p-2 rounded-lg text-stone-500 hover:bg-green-50 hover:text-green-800 transition-colors"
                  title="編輯"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 rounded-lg text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="刪除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <span className="flex items-center gap-1 text-xs text-stone-400 px-2 py-1">
                <Eye className="w-3.5 h-3.5" />
                僅檢視
              </span>
            )}
          </div>
        </div>

        {rec.note && (
          <p className="text-sm text-stone-600 bg-stone-50 rounded-lg p-3 mb-3 leading-relaxed">
            {rec.note}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {visibleMods.map((id) => {
            const mod = getModById(id);
            if (!mod) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 text-xs text-stone-700"
              >
                {mod.name}
                <span className={`px-1 py-0.5 rounded text-[9px] font-bold ${LEVEL_STYLE[mod.level]}`}>
                  {LEVEL_LABEL[mod.level]}
                </span>
              </span>
            );
          })}
          {visibleCustom.map((name, i) => (
            <span
              key={`custom-${i}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-xs text-green-900"
            >
              {name}
              <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-green-700 text-white">
                自填
              </span>
            </span>
          ))}
          {modCount > 6 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-2.5 py-1 rounded-lg bg-green-50 text-xs font-medium text-green-800 hover:bg-green-100 transition-colors"
            >
              {expanded ? "收起" : `顯示全部 ${modCount} 個`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
