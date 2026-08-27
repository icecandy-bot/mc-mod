export type ModLevel = "core" | "recommend" | "optional" | "dep" | "warn";

export interface Mod {
  id: string;
  name: string;
  effect: string;
  level: ModLevel;
  load: string;
}

export interface ModSection {
  id: string;
  title: string;
  note?: string;
  mods: Mod[];
}

export const LEVEL_LABEL: Record<ModLevel, string> = {
  core: "核心必裝",
  recommend: "建議加入",
  optional: "可選擴充",
  dep: "隨依賴安裝",
  warn: "不建議",
};

export const LEVEL_STYLE: Record<ModLevel, string> = {
  core: "bg-red-600 text-white",
  recommend: "bg-green-700 text-white",
  optional: "bg-sky-700 text-white",
  dep: "bg-purple-700 text-white",
  warn: "bg-orange-600 text-white",
};

export const MOD_SECTIONS: ModSection[] = [
  {
    id: "sec1",
    title: "一、BOSS、地城與長期冒險",
    mods: [
      { id: "cataclysm", name: "L_Ender's Cataclysm", effect: "大型 BOSS、跨維度地城、終局裝備", level: "core", load: "高" },
      { id: "marium-soulslike", name: "Marium's Soulslike Weaponry", effect: "多個類魂 BOSS、傳奇武器、升級系統", level: "core", load: "中高" },
      { id: "graveyard", name: "The Graveyard (Forge)", effect: "墓園、地穴、亡靈怪物與恐怖結構", level: "core", load: "中" },
      { id: "irons-spells", name: "Iron's Spells 'n Spellbooks", effect: "法術敵人、法術結構與魔法 BOSS", level: "core", load: "中" },
      { id: "deeper-darker", name: "Deeper and Darker", effect: "深暗之域延伸內容、地城、怪物與終局挑戰", level: "recommend", load: "中高" },
      { id: "dungeon-now-loading", name: "Dungeon Now Loading", effect: "多主題地城與探索內容", level: "recommend", load: "中高" },
      { id: "bosses-rise", name: "Bosses' Rise", effect: "額外 BOSS 與探索挑戰", level: "optional", load: "中" },
      { id: "when-dungeons-arise", name: "When Dungeons Arise", effect: "大型遺跡與超大型地城", level: "warn", load: "很高；建議不裝" },
      { id: "yung-dungeons", name: "YUNG's Better Dungeons", effect: "改善原版地牢並增加探索變化", level: "optional", load: "中" },
      { id: "yung-strongholds", name: "YUNG's Better Strongholds", effect: "強化要塞，增加終界前長期目標", level: "optional", load: "中" },
      { id: "yung-nether-fortresses", name: "YUNG's Better Nether Fortresses", effect: "強化地獄堡壘探索", level: "optional", load: "中" },
      { id: "yung-end-island", name: "YUNG's Better End Island", effect: "改善終界島與終局探索", level: "optional", load: "中" },
      { id: "lootr", name: "Lootr", effect: "讓每位玩家擁有獨立地城戰利品", level: "core", load: "低" },
      { id: "majrusz", name: "Majrusz's Progressive Difficulty", effect: "隨遊戲進度逐步提高怪物與事件難度", level: "recommend", load: "低中" },
      { id: "apotheosis", name: "Apotheosis", effect: "強化附魔、稀有戰利品、Boss 裝備成長", level: "recommend", load: "中" },
      { id: "ftb-quests", name: "FTB Quests", effect: "任務、進度、多人合作目標與獎勵", level: "recommend", load: "低" },
      { id: "patchouli", name: "Patchouli", effect: "顯示模組手冊與冒險指南", level: "recommend", load: "低" },
    ],
  },
  {
    id: "sec2",
    title: "二、魔法系統",
    note: "第一版以 Iron's Spells 'n Spellbooks 為唯一主魔法系統。Ars Nouveau、Occultism、Mana and Artifice 不要同時全裝，避免法術粒子、配方與進度過度膨脹。",
    mods: [
      { id: "irons-spells-magic", name: "Iron's Spells 'n Spellbooks", effect: "主魔法系統；法術書、法術學派、法師裝備與法術戰鬥", level: "core", load: "中" },
      { id: "ars-nouveau", name: "Ars Nouveau", effect: "建構自訂法術、魔法自動化與魔法生物", level: "optional", load: "中高 (二選一或後期加入)" },
      { id: "occultism", name: "Occultism", effect: "召喚、靈魂、儀式與儲存魔法", level: "optional", load: "中" },
      { id: "curios", name: "Curios API", effect: "戒指、護符與法師配件欄位支援", level: "dep", load: "低" },
      { id: "geckolib", name: "GeckoLib", effect: "BOSS、怪物、武器與法師裝備動畫依賴", level: "dep", load: "低" },
      { id: "mana-artifice", name: "Mana and Artifice", effect: "大型法術、儀式與法師進階系統", level: "warn", load: "高" },
    ],
  },
  {
    id: "sec3",
    title: "三、武器、裝備與戰鬥風格",
    note: "使用 Better Combat 這條輕量路線。Epic Fight 會大幅改寫戰鬥系統，與 Better Combat、Simply Swords 可能產生風格與相容性問題，因此不放入主包。",
    mods: [
      { id: "marium-soulslike-combat", name: "Marium's Soulslike Weaponry", effect: "類魂武器、技能、姿勢與 BOSS 掉落", level: "core", load: "中高" },
      { id: "simply-swords", name: "Simply Swords", effect: "大量特殊近戰武器與武器技能", level: "recommend", load: "低中" },
      { id: "better-combat", name: "Better Combat", effect: "連擊、攻擊動畫、武器戰鬥手感", level: "core", load: "低中 (Simply Swords 建議搭配)" },
      { id: "combat-roll", name: "Combat Roll", effect: "翻滾、閃避與多人戰鬥機動性", level: "recommend", load: "低" },
      { id: "shield-expansion", name: "Shield Expansion", effect: "擴充盾牌種類、格擋與防禦玩法", level: "recommend", load: "低" },
      { id: "epic-knights", name: "Epic Knights: Armor and Weapons", effect: "中世紀護甲、武器與騎士風格", level: "optional", load: "中" },
      { id: "archers", name: "Archers (RPG Series)", effect: "弓箭職業、遠程武器與射手成長", level: "optional", load: "中" },
      { id: "simply-skills", name: "Simply Skills", effect: "角色技能與戰鬥能力成長", level: "optional", load: "低中" },
      { id: "player-animator", name: "Player Animator", effect: "玩家戰鬥與動作動畫依賴", level: "dep", load: "低" },
      { id: "attributefix", name: "AttributeFix", effect: "提高屬性上限，支援高階裝備與 BOSS", level: "dep", load: "低" },
      { id: "kubejs", name: "KubeJS", effect: "調整武器、戰利品、配方與難度", level: "optional", load: "低 (需要自訂整合時加入)" },
    ],
  },
  {
    id: "sec4",
    title: "四、效能優化與記憶體",
    mods: [
      { id: "embeddium", name: "Embeddium", effect: "Forge 版高效能渲染核心", level: "core", load: "不搭配 Oculus 光影" },
      { id: "modernfix", name: "ModernFix", effect: "降低記憶體使用、改善載入與修正錯誤", level: "core", load: "必裝" },
      { id: "ferritecore", name: "FerriteCore", effect: "降低記憶體佔用", level: "core", load: "必裝" },
      { id: "entity-culling", name: "Entity Culling", effect: "不渲染被牆遮住的實體與方塊", level: "core", load: "必裝" },
      { id: "immediatelyfast", name: "ImmediatelyFast", effect: "改善即時渲染效能", level: "core", load: "必裝" },
      { id: "ai-improvements", name: "AI Improvements", effect: "降低大量生物 AI 計算負擔", level: "recommend", load: "伺服器與單人都可用" },
      { id: "clumps", name: "Clumps", effect: "合併經驗球，降低多人刷怪場負擔", level: "recommend", load: "必裝" },
      { id: "servercore", name: "ServerCore", effect: "伺服器 tick 與實體管理優化", level: "recommend", load: "伺服器端優先" },
      { id: "alternate-current", name: "Alternate Current", effect: "優化紅石更新計算", level: "optional", load: "有大型紅石基地再裝" },
      { id: "fastfurnace", name: "FastFurnace", effect: "優化熔爐運算", level: "optional", load: "低負載" },
      { id: "fastworkbench", name: "FastWorkbench", effect: "優化工作台配方查詢", level: "optional", load: "低負載" },
      { id: "fastsuite", name: "FastSuite", effect: "優化大量配方載入", level: "optional", load: "模組多時加入" },
      { id: "smoothboot", name: "SmoothBoot (Reloaded)", effect: "改善啟動與載入時的 CPU 使用", level: "optional", load: "低負載" },
      { id: "spark", name: "Spark", effect: "分析伺服器卡頓與 tick", level: "dep", load: "需要排錯時使用" },
      { id: "noisium", name: "Noisium", effect: "改善噪聲與地形生成計算", level: "optional", load: "先測試再加入" },
      { id: "let-me-despawn", name: "Let Me Despawn", effect: "防止遠距離怪物過度累積", level: "optional", load: "多人伺服器建議" },
      { id: "dynamic-fps", name: "Dynamic FPS", effect: "遊戲切到背景時降低資源使用", level: "recommend", load: "筆電建議" },
      { id: "better-biome-blend", name: "Better Biome Blend", effect: "改善低負載下的生物群系色彩混合", level: "optional", load: "低負載" },
    ],
  },
  {
    id: "sec5",
    title: "五、繁體中文、輸入法與介面",
    mods: [
      { id: "rpmtw", name: "RPMTW Platform Mod", effect: "RPMTW 翻譯社群、繁體中文翻譯與中文相關功能", level: "core", load: "翻譯覆蓋率依模組而異" },
      { id: "imblocker", name: "IMBlocker", effect: "防止中文輸入法與遊戲快捷鍵互相干擾", level: "core", load: "指定安裝模組" },
      { id: "jei", name: "JEI (Just Enough Items)", effect: "查看物品、配方、模組來源與用途", level: "core", load: "Forge 1.20.1 建議使用" },
      { id: "jade", name: "Jade", effect: "看方塊、實體與容器資訊", level: "recommend", load: "低負載" },
      { id: "appleskin", name: "AppleSkin", effect: "顯示食物與飽食度資訊", level: "recommend", load: "低負載" },
      { id: "catalogue", name: "Catalogue", effect: "改善 Forge 模組設定介面", level: "optional", load: "低負載" },
      { id: "configured", name: "Configured", effect: "遊戲內開啟模組設定", level: "optional", load: "低負載" },
      { id: "controlling", name: "Controlling", effect: "搜尋按鍵設定，避免快捷鍵衝突", level: "recommend", load: "多模組必備" },
      { id: "mouse-tweaks", name: "Mouse Tweaks", effect: "改善物品拖曳與整理操作", level: "recommend", load: "客戶端" },
      { id: "ipn", name: "Inventory Profiles Next", effect: "整理背包、鎖定工具、快速移動物品", level: "recommend", load: "客戶端；確認 Forge 版本" },
    ],
  },
  {
    id: "sec6",
    title: "六、整理箱子、倉儲與背包",
    note: "Sophisticated Backpacks＋Sophisticated Storage＋Tom's Simple Storage 足夠支援多人基地，不要同時安裝太多套大型倉儲終端系統。",
    mods: [
      { id: "sophisticated-backpacks", name: "Sophisticated Backpacks", effect: "可升級背包、篩選、吸取、整理與自動補充", level: "core", load: "中" },
      { id: "sophisticated-storage", name: "Sophisticated Storage", effect: "可升級箱子、桶、木桶與大型儲存", level: "recommend", load: "中" },
      { id: "toms-storage", name: "Tom's Simple Storage Mod", effect: "連接箱子並用終端機搜尋物品", level: "recommend", load: "低中" },
      { id: "storage-drawers", name: "Storage Drawers", effect: "大量物品分類與抽屜儲存", level: "optional", load: "低中" },
      { id: "functional-storage", name: "Functional Storage", effect: "抽屜、壓縮儲存與分類", level: "optional", load: "低中 (與 Storage Drawers 二選一)" },
      { id: "iron-chests", name: "Iron Chests", effect: "升級箱子容量", level: "optional", load: "低" },
      { id: "iron-shulker", name: "Iron Shulker Boxes", effect: "擴充潛影盒容量與功能", level: "optional", load: "低" },
      { id: "item-collectors", name: "Item Collectors", effect: "自動收集掉落物", level: "optional", load: "低" },
      { id: "simple-backups", name: "Simple Backups", effect: "簡單世界備份", level: "dep", load: "低" },
    ],
  },
  {
    id: "sec7",
    title: "七、傳送、地圖、死亡與多人便利功能",
    mods: [
      { id: "waystones", name: "Waystones", effect: "傳送石碑、傳送卷軸與多人基地網路", level: "core", load: "低" },
      { id: "explorers-compass", name: "Explorer's Compass", effect: "搜尋模組地城與結構，作為 BOSS 導引", level: "core", load: "低" },
      { id: "natures-compass", name: "Nature's Compass", effect: "搜尋生物群系", level: "recommend", load: "低" },
      { id: "xaero-minimap", name: "Xaero's Minimap", effect: "小地圖、標記與死亡位置", level: "recommend", load: "低中" },
      { id: "xaero-worldmap", name: "Xaero's World Map", effect: "世界地圖與探索記錄", level: "recommend", load: "低中" },
      { id: "journeymap", name: "JourneyMap", effect: "地圖、標記與地城探索資訊", level: "optional", load: "中 (與 Xaero 系列二選一)" },
      { id: "corpse", name: "Corpse", effect: "死亡後保留物品於屍體中", level: "recommend", load: "低" },
      { id: "ftb-ultimine", name: "FTB Ultimine", effect: "大範圍採礦與砍樹", level: "optional", load: "低中；需限制範圍" },
      { id: "ftb-teams", name: "FTB Teams", effect: "多人隊伍、隊伍權限與共享進度", level: "recommend", load: "低" },
      { id: "ftb-chunks", name: "FTB Chunks", effect: "圈地、區塊載入與基地保護", level: "core", load: "中" },
      { id: "chunk-loaders", name: "Chunk Loaders", effect: "讓指定區塊在伺服器持續載入", level: "optional", load: "中 (管理員限制數量)" },
      { id: "opac", name: "Open Parties and Claims", effect: "另一套隊伍與領地保護系統", level: "optional", load: "中 (與 FTB Chunks 二選一)" },
    ],
  },
  {
    id: "sec8",
    title: "八、防破壞與伺服器安全",
    mods: [
      { id: "imblocker-sec", name: "IMBlocker", effect: "解決中文輸入法與遊戲輸入衝突", level: "core", load: "客戶端" },
      { id: "ftb-chunks-sec", name: "FTB Chunks", effect: "圈地、權限與基地保護", level: "core", load: "多人建議" },
      { id: "ftb-teams-sec", name: "FTB Teams", effect: "隊伍權限與共享進度", level: "recommend", load: "與 FTB Chunks 配合" },
      { id: "opac-sec", name: "Open Parties and Claims", effect: "圈地與隊伍保護替代方案", level: "optional", load: "不與 FTB Chunks 同時使用" },
      { id: "worldedit", name: "WorldEdit", effect: "建築管理與伺服器維護", level: "dep", load: "不建議給一般玩家無限制使用" },
      { id: "chunky", name: "Chunky", effect: "伺服器預生成區塊，減少探險時卡頓", level: "dep", load: "只在開服前使用" },
      { id: "spark-sec", name: "Spark", effect: "查詢 tick、記憶體與卡頓來源", level: "dep", load: "排錯用" },
      { id: "simple-backups-sec", name: "Simple Backups", effect: "定期備份世界", level: "dep", load: "多人伺服器強烈建議" },
    ],
  },
  {
    id: "sec9",
    title: "九、建造增強與裝飾",
    mods: [
      { id: "building-gadgets", name: "Building Gadgets", effect: "直線、牆面、平台、替換與建造工具", level: "core", load: "中" },
      { id: "construction-wand", name: "Construction Wand", effect: "直接延伸牆面、地板與建築結構", level: "recommend", load: "低" },
      { id: "effortless-building", name: "Effortless Building", effect: "鏡像、陣列、建造模式與隨機方塊", level: "recommend", load: "低中" },
      { id: "effortless-building-gadgets", name: "Effortless Building Gadgets", effect: "以工具快速放置幾何形狀", level: "optional", load: "中 (與 Building Gadgets 二選一)" },
      { id: "worldedit-build", name: "WorldEdit", effect: "大型建築與管理員快速施工", level: "dep", load: "低，但權限風險高" },
      { id: "chipped", name: "Chipped", effect: "大量方塊外觀變體", level: "optional", load: "中；物品數量增加" },
      { id: "framedblocks", name: "FramedBlocks", effect: "自訂形狀與偽裝方塊", level: "optional", load: "中" },
      { id: "supplementaries", name: "Supplementaries", effect: "原版風格裝飾、收納與機關", level: "recommend", load: "中" },
      { id: "decorative-blocks", name: "Decorative Blocks", effect: "中世紀與冒險風格建材", level: "optional", load: "低" },
    ],
  },
  {
    id: "sec10",
    title: "十、地形、生物群系與世界生成",
    note: "正式主包只選 Terralith 或 Tectonic 其中一條，再搭配少量 YUNG's 結構。不要同時使用 Terralith、Tectonic、Biomes O' Plenty、Regions Unexplored、When Dungeons Arise，否則地形生成與記憶體負擔會明顯增加。",
    mods: [
      { id: "terralith", name: "Terralith", effect: "大量原版風格地形與生物群系", level: "recommend", load: "中高" },
      { id: "tectonic", name: "Tectonic", effect: "山脈、峽谷與更有層次的地形", level: "optional", load: "中高 (與 Terralith 擇一測試)" },
      { id: "biomes-o-plenty", name: "Biomes O' Plenty", effect: "大量新生物群系、植物與世界內容", level: "optional", load: "中高 (與大型地形模組擇一)" },
      { id: "regions-unexplored", name: "Regions Unexplored", effect: "原版風格生物群系與植物", level: "optional", load: "中高 (與 Biomes O' Plenty 擇一)" },
      { id: "yung-dungeons-world", name: "YUNG's Better Dungeons", effect: "更有內容的地牢", level: "optional", load: "中" },
      { id: "yung-mineshafts", name: "YUNG's Better Mineshafts", effect: "強化礦坑探索", level: "optional", load: "中" },
      { id: "yung-ocean-monuments", name: "YUNG's Better Ocean Monuments", effect: "強化海底神殿", level: "optional", load: "中" },
      { id: "yung-desert-temples", name: "YUNG's Better Desert Temples", effect: "強化沙漠神殿", level: "optional", load: "中" },
      { id: "yung-jungle-temples", name: "YUNG's Better Jungle Temples", effect: "強化叢林神殿", level: "optional", load: "中" },
      { id: "yung-nether-fortresses-world", name: "YUNG's Better Nether Fortresses", effect: "強化地獄堡壘", level: "optional", load: "中" },
      { id: "yung-end-island-world", name: "YUNG's Better End Island", effect: "強化終界島", level: "optional", load: "中" },
      { id: "structory", name: "Structory", effect: "增加原版風格小型結構", level: "optional", load: "低中" },
      { id: "explorify", name: "Explorify", effect: "增加探索結構與小型地標", level: "optional", load: "低中" },
      { id: "choice-village", name: "ChoiceTheorem's Overhauled Village", effect: "強化村莊與村民聚落", level: "optional", load: "中" },
      { id: "towns-towers", name: "Towns and Towers", effect: "增加村莊、塔樓與聚落變化", level: "optional", load: "中" },
      { id: "when-dungeons-arise-world", name: "When Dungeons Arise", effect: "超大型地城與遺跡", level: "warn", load: "Intel UHD 負載很高" },
    ],
  },
];

export const RECOMMENDED_PACK: string[] = [
  "cataclysm", "marium-soulslike", "graveyard", "irons-spells",
  "simply-swords", "better-combat", "combat-roll", "explorers-compass",
  "waystones", "sophisticated-backpacks", "sophisticated-storage", "toms-storage",
  "building-gadgets", "construction-wand", "terralith", "yung-dungeons",
  "lootr", "ftb-quests", "ftb-teams", "ftb-chunks",
  "rpmtw", "imblocker", "jei", "jade",
  "embeddium", "modernfix", "ferrite-core", "entity-culling",
  "immediatelyfast", "ai-improvements", "clumps", "servercore",
  "dynamic-fps", "xaero-minimap", "xaero-worldmap", "corpse",
  "supplementaries", "apotheosis", "patchouli", "geckolib",
  "curios", "player-animator", "attributefix",
];

export const SUMMARY_ITEMS = [
  { label: "BOSS、地城與任務", value: "12–16 個" },
  { label: "魔法與依賴", value: "5–8 個" },
  { label: "武器與戰鬥", value: "8–10 個" },
  { label: "效能優化", value: "10–14 個" },
  { label: "中文與介面", value: "8–10 個" },
  { label: "收納、背包與整理", value: "8–10 個" },
  { label: "傳送、地圖與多人", value: "8–12 個" },
  { label: "建造與裝飾", value: "8–12 個" },
  { label: "地形與結構", value: "8–12 個" },
];

export const ALL_MODS: Mod[] = MOD_SECTIONS.flatMap((s) => s.mods);

export function getModById(id: string): Mod | undefined {
  return ALL_MODS.find((m) => m.id === id);
}
