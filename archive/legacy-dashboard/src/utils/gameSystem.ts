// ゲーム要素システム - 資産形成をRPGのように楽しく！

export interface GameItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockCondition: {
    type: 'assets' | 'savings_rate' | 'age' | 'years_to_fire';
    value: number;
  };
  effect: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'weapon' | 'armor' | 'accessory' | 'consumable';
}

export interface PlayerStats {
  level: number;
  title: string;
  experience: number;
  unlockedItems: string[];
  achievements: string[];
}

// 装備アイテム一覧
export const GAME_ITEMS: GameItem[] = [
  // 武器系（収入アップ系）
  {
    id: 'salary_sword',
    name: '給与の剣',
    description: '毎月の給与を武器に変える基本装備。まずはここから冒険が始まる！',
    icon: '⚔️',
    unlockCondition: { type: 'assets', value: 0 },
    effect: '基本収入確保',
    rarity: 'common',
    category: 'weapon'
  },
  {
    id: 'side_hustle_bow',
    name: '副業の弓',
    description: '本業以外からの収入を狙い撃ち！遠距離から資産を増やす現代の必須武器。',
    icon: '🏹',
    unlockCondition: { type: 'assets', value: 1000000 },
    effect: '副収入+10%',
    rarity: 'rare',
    category: 'weapon'
  },
  {
    id: 'investment_staff',
    name: '投資の杖',
    description: '複利の魔法を操る賢者の武器。時間をかけるほど威力が増す伝説の杖。',
    icon: '🪄',
    unlockCondition: { type: 'assets', value: 5000000 },
    effect: '複利効果+15%',
    rarity: 'epic',
    category: 'weapon'
  },
  {
    id: 'fire_excalibur',
    name: 'FIREエクスカリバー',
    description: '経済的自由を切り開く伝説の聖剣。選ばれし者のみが扱える最強武器！',
    icon: '🗡️',
    unlockCondition: { type: 'assets', value: 25000000 },
    effect: '全ステータス+50%',
    rarity: 'legendary',
    category: 'weapon'
  },

  // 防具系（支出削減系）
  {
    id: 'frugal_shield',
    name: '節約の盾',
    description: '無駄遣いの攻撃を防ぐ頼れる盾。家計防衛の第一線で活躍する。',
    icon: '🛡️',
    unlockCondition: { type: 'savings_rate', value: 10 },
    effect: '支出-5%',
    rarity: 'common',
    category: 'armor'
  },
  {
    id: 'budget_armor',
    name: '家計管理の鎧',
    description: '予算オーバーのダメージを軽減する堅牢な鎧。着用者の財布を守り抜く。',
    icon: '🦺',
    unlockCondition: { type: 'savings_rate', value: 20 },
    effect: '予算管理+20%',
    rarity: 'rare',
    category: 'armor'
  },
  {
    id: 'minimalist_cloak',
    name: 'ミニマリストのマント',
    description: '物欲を無効化する神秘のマント。真の豊かさは物の少なさにあり。',
    icon: '🧥',
    unlockCondition: { type: 'savings_rate', value: 30 },
    effect: '物欲耐性+100%',
    rarity: 'epic',
    category: 'armor'
  },

  // アクセサリー系（特殊効果）
  {
    id: 'compound_ring',
    name: '複利の指輪',
    description: '時間経過で効果が倍増する魔法の指輪。長期投資家の必須アイテム。',
    icon: '💍',
    unlockCondition: { type: 'assets', value: 3000000 },
    effect: '時間経過で効果増大',
    rarity: 'rare',
    category: 'accessory'
  },
  {
    id: 'nisa_amulet',
    name: 'NISAのお守り',
    description: '税金ダメージを無効化する神聖なお守り。年間360万まで完全防御。',
    icon: '🧿',
    unlockCondition: { type: 'assets', value: 2000000 },
    effect: '税金ダメージ無効',
    rarity: 'epic',
    category: 'accessory'
  },
  {
    id: 'fire_compass',
    name: 'FIREコンパス',
    description: '経済的自由への道筋を示す伝説のコンパス。迷った時の道しるべ。',
    icon: '🧭',
    unlockCondition: { type: 'years_to_fire', value: 10 },
    effect: '目標達成率+25%',
    rarity: 'legendary',
    category: 'accessory'
  },

  // 消耗品系（精神安定系）
  {
    id: 'balance_potion',
    name: '残高確認ポtion',
    description: '残高を見て心を落ち着ける魔法の薬。1000万円達成で使用回数無限！',
    icon: '🧪',
    unlockCondition: { type: 'assets', value: 10000000 },
    effect: '精神安定（使用回数無限）',
    rarity: 'epic',
    category: 'consumable'
  },
  {
    id: 'market_crash_antidote',
    name: '暴落解毒剤',
    description: '市場暴落の毒を中和する特効薬。長期投資家の心の支え。',
    icon: '💊',
    unlockCondition: { type: 'assets', value: 15000000 },
    effect: '暴落耐性+90%',
    rarity: 'rare',
    category: 'consumable'
  },
  {
    id: 'retirement_elixir',
    name: '早期退職の秘薬',
    description: '働かなくても生きていける究極の秘薬。FIRE達成者のみが味わえる至福。',
    icon: '🍷',
    unlockCondition: { type: 'assets', value: 50000000 },
    effect: '労働からの完全解放',
    rarity: 'legendary',
    category: 'consumable'
  }
];

// プレイヤーレベルとタイトル
export const PLAYER_LEVELS = [
  { level: 1, title: '貯金初心者', minAssets: 0, maxAssets: 500000 },
  { level: 2, title: '節約見習い', minAssets: 500000, maxAssets: 1000000 },
  { level: 3, title: '家計管理士', minAssets: 1000000, maxAssets: 3000000 },
  { level: 4, title: '投資戦士', minAssets: 3000000, maxAssets: 5000000 },
  { level: 5, title: '資産形成騎士', minAssets: 5000000, maxAssets: 10000000 },
  { level: 6, title: '複利の魔法使い', minAssets: 10000000, maxAssets: 20000000 },
  { level: 7, title: 'FIRE候補生', minAssets: 20000000, maxAssets: 30000000 },
  { level: 8, title: '経済的自由戦士', minAssets: 30000000, maxAssets: 50000000 },
  { level: 9, title: 'FIREマスター', minAssets: 50000000, maxAssets: 100000000 },
  { level: 10, title: '伝説の資産家', minAssets: 100000000, maxAssets: Infinity }
];

// ユーモラスなメッセージ集
export const GAME_MESSAGES = {
  levelUp: [
    'レベルアップ！あなたの資産形成スキルが向上しました！🎉',
    'おめでとうございます！新しいタイトルを獲得しました！✨',
    'すごいじゃないですか！また一歩FIREに近づきましたね！🔥'
  ],
  itemUnlock: [
    '新しい装備を発見しました！冒険者の道具箱に追加されました！',
    'レアアイテムゲット！これで資産形成がもっと楽しくなりますね！',
    '伝説の装備を手に入れました！FIREへの道がさらに開けました！'
  ],
  encouragement: [
    'コツコツ積み立て、それが勇者の道！今日も一歩前進です！',
    '複利の魔法は時間をかけるほど強力になります。焦らずじっくりと！',
    '資産形成は長期戦！RPGと同じで、レベル上げには時間がかかるものです。',
    '今日の入金が明日の自由を作ります。未来の自分に投資しましょう！'
  ]
};

// ゲーム状態の計算
export const calculatePlayerStats = (
  assets: number, 
  savingsRate: number, 
  age: number, 
  yearsToFire: number | null
): PlayerStats => {
  // レベル計算
  const playerLevel = PLAYER_LEVELS.find(level => 
    assets >= level.minAssets && assets < level.maxAssets
  ) || PLAYER_LEVELS[PLAYER_LEVELS.length - 1];

  // 解放されたアイテム
  const unlockedItems = GAME_ITEMS.filter(item => {
    switch (item.unlockCondition.type) {
      case 'assets':
        return assets >= item.unlockCondition.value;
      case 'savings_rate':
        return savingsRate >= item.unlockCondition.value;
      case 'age':
        return age >= item.unlockCondition.value;
      case 'years_to_fire':
        return yearsToFire !== null && yearsToFire <= item.unlockCondition.value;
      default:
        return false;
    }
  }).map(item => item.id);

  // 経験値（資産額ベース）
  const experience = Math.floor(assets / 10000);

  return {
    level: playerLevel.level,
    title: playerLevel.title,
    experience,
    unlockedItems,
    achievements: [] // 今後実装
  };
};

// アイテムの希少度に応じた色
export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'rare': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'epic': return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'legendary': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// カテゴリーアイコン
export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'weapon': return '⚔️';
    case 'armor': return '🛡️';
    case 'accessory': return '💍';
    case 'consumable': return '🧪';
    default: return '📦';
  }
};