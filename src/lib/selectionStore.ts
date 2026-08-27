import { supabase } from "./supabase";

const DEVICE_KEY = "ice-candy-device-id";
const LOCAL_KEY = "ice-candy-selected-mods";

function getDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(DEVICE_KEY, id);
  return id;
}

function readLocal(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

export async function loadSelectedMods(): Promise<string[]> {
  const deviceId = getDeviceId();
  const { data, error } = await supabase
    .from("mod_selections")
    .select("selected_ids")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (!error && data?.selected_ids) {
    const ids = Array.isArray(data.selected_ids) ? data.selected_ids : [];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(ids));
    return ids;
  }

  return readLocal();
}

export async function saveSelectedMods(selectedIds: string[]): Promise<void> {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(selectedIds));
  const deviceId = getDeviceId();
  const { error } = await supabase.from("mod_selections").upsert(
    {
      device_id: deviceId,
      selected_ids: selectedIds,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "device_id" },
  );

  if (error) {
    console.warn("Unable to sync module selections to Supabase; local backup kept.", error.message);
  }
}
