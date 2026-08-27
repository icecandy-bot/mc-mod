import { useEffect, useState } from "react";
import { Package, ListChecks, Plus } from "lucide-react";
import ModGuide from "@/components/ModGuide";
import Recommendations from "@/components/Recommendations";
import RecommendationForm from "@/components/RecommendationForm";
import type { Recommendation } from "@/lib/supabase";
import { loadSelectedMods, saveSelectedMods } from "@/lib/selectionStore";

type Tab = "guide" | "recommendations" | "form";

export default function App() {
  const [tab, setTab] = useState<Tab>("recommendations");
  const [editingRec, setEditingRec] = useState<Recommendation | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionLoaded, setSelectionLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadSelectedMods().then((ids) => {
      if (!cancelled) {
        setSelectedIds(ids);
        setSelectionLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleMod = (id: string) => {
    setSelectedIds((previous) => {
      const next = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];
      void saveSelectedMods(next);
      return next;
    });
  };

  const startCreate = () => {
    setEditingRec(null);
    setTab("form");
  };

  const startEdit = (rec: Recommendation) => {
    setEditingRec(rec);
    setTab("form");
  };

  const handleFormDone = () => {
    setEditingRec(null);
    setTab("recommendations");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-1">
            <TabButton active={tab === "recommendations"} onClick={() => setTab("recommendations")} icon={<ListChecks className="w-4 h-4" />} label="推薦列表" />
            <TabButton active={tab === "guide"} onClick={() => setTab("guide")} icon={<Package className="w-4 h-4" />} label="模組清單" />
            <TabButton active={tab === "form"} onClick={startCreate} icon={<Plus className="w-4 h-4" />} label="我要推薦" />
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">
        {tab === "guide" && (
          <>
            {!selectionLoaded && <p className="mb-4 text-sm text-stone-500">正在載入你的模組選擇…</p>}
            <ModGuide selectedIds={selectedIds} onToggle={toggleMod} />
            <p className="mt-5 text-sm text-stone-500">已選取 {selectedIds.length} 個模組；選擇會自動保存。</p>
          </>
        )}
        {tab === "recommendations" && <Recommendations onEdit={startEdit} />}
        {tab === "form" && <RecommendationForm editingRec={editingRec} onDone={handleFormDone} />}
      </main>

      {tab !== "form" && (
        <button onClick={startCreate} className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-green-800 text-white shadow-lg hover:bg-green-900 active:scale-95 transition-all flex items-center justify-center sm:hidden">
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${active ? "border-green-800 text-green-900" : "border-transparent text-stone-500 hover:text-stone-700"}`}>
      {icon}
      {label}
    </button>
  );
}
