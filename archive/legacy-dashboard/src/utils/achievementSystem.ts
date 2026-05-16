// 実績システム - ユーザーの達成を記録・表彰する機能

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'behavior' | 'special' | 'streak';
  condition: {
    type: 'assets' | 'savings_rate' | 'streak_days' | 'total_saved' | 'fire_progress' | 'equipment_count';
    value: number;
    operator?: 'gte' | 'lte' | 'eq';
  };
  reward: {
    type: 'title' | 'equipment' | 'badge' | 'boost';
    value: string;
    description: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number; // 0-100の進捗率
}

export interface PlayerAchievements {
  unlockedAchievements: string[];
  progress: Record<string, number>;
  lastChecked: Date;
  streakDays: number;
  totalSaved: number;
}

// 実績一覧定義
export const ACHIEVEMENTS: Achievement[] = [
  // マイルストーン系
  {
    id: 'first_hundred_thousand',
    name: '🎉 初回10万円達成',
    description: '人生初の10万円貯金達成！小さな一歩が大きな変化の始まりです。',
    icon: '🎉',
    category: 'milestone',
    condition: { type: 'assets', value: 100000 },
    reward: {
      type: 'title',
      value: '貯金デビュー',
      description: '初心者の村を卒業した証'
    },
    rarity: 'common'
  },
  {
    id: 'first_million',
    name: '💰 百万長者見習い',
    description: 'ついに100万円の大台突破！これで立派な百万長者の仲間入りです。',
    icon: '💰',
    category: 'milestone',
    condition: { type: 'assets', value: 1000000 },
    reward: {
      type: 'equipment',
      value: 'millionaire_badge',
      description: '特別装備「百万長者バッジ」を獲得'
    },
    rarity: 'rare'
  },
  {
    id: 'five_million_club',
    name: '🚀 資産形成エリート',
    description: '500万円達成！もう初心者ではありません。上級者の仲間入りです。',
    icon: '🚀',
    category: 'milestone',
    condition: { type: 'assets', value: 5000000 },
    reward: {
      type: 'title',
      value: '資産形成エリート',
      description: '上級冒険者の証明'
    },
    rarity: 'epic'
  },
  {
    id: 'ten_million_master',
    name: '👑 一千万円マスター',
    description: '1000万円達成！精神安定ポーション∞が解放されました。もう残高を見るのが怖くありません。',
    icon: '👑',
    category: 'milestone',
    condition: { type: 'assets', value: 10000000 },
    reward: {
      type: 'equipment',
      value: 'balance_potion_infinite',
      description: '精神安定ポーション∞（使用回数無限）'
    },
    rarity: 'legendary'
  },

  // 行動系実績
  {
    id: 'savings_master',
    name: '💪 節約マスター',
    description: '貯蓄率30%達成！素晴らしい自制心です。支出管理の達人ですね。',
    icon: '💪',
    category: 'behavior',
    condition: { type: 'savings_rate', value: 30 },
    reward: {
      type: 'equipment',
      value: 'master_shield',
      description: '特別装備「マスターの盾」'
    },
    rarity: 'rare'
  },
  {
    id: 'extreme_saver',
    name: '🔥 極限節約家',
    description: '貯蓄率50%達成！これはもはや芸術の域です。尊敬します。',
    icon: '🔥',
    category: 'behavior',
    condition: { type: 'savings_rate', value: 50 },
    reward: {
      type: 'title',
      value: '極限節約家',
      description: '伝説の節約スキルの持ち主'
    },
    rarity: 'legendary'
  },

  // FIRE進捗系
  {
    id: 'halfway_hero',
    name: '⭐ FIRE中間地点',
    description: 'FIRE達成率50%突破！折り返し地点を通過しました。ゴールが見えてきましたね。',
    icon: '⭐',
    category: 'milestone',
    condition: { type: 'fire_progress', value: 50 },
    reward: {
      type: 'boost',
      value: 'motivation_boost',
      description: 'モチベーションブースト効果'
    },
    rarity: 'rare'
  },
  {
    id: 'almost_there',
    name: '🎯 FIRE目前',
    description: 'FIRE達成率80%突破！ラスボス戦直前です。あと少しで自由の身！',
    icon: '🎯',
    category: 'milestone',
    condition: { type: 'fire_progress', value: 80 },
    reward: {
      type: 'equipment',
      value: 'final_battle_sword',
      description: '最終決戦の剣'
    },
    rarity: 'epic'
  },
  {
    id: 'fire_master',
    name: '🏆 FIRE達成者',
    description: 'ついにFIRE達成！経済的自由を手に入れた伝説の勇者です。おめでとうございます！',
    icon: '🏆',
    category: 'special',
    condition: { type: 'fire_progress', value: 100 },
    reward: {
      type: 'title',
      value: 'FIRE達成者',
      description: '経済的自由を手に入れた証'
    },
    rarity: 'legendary'
  },

  // 装備コレクター系
  {
    id: 'equipment_collector',
    name: '🎒 装備コレクター',
    description: '5つの装備を解放！立派な冒険者の装備が揃いましたね。',
    icon: '🎒',
    category: 'behavior',
    condition: { type: 'equipment_count', value: 5 },
    reward: {
      type: 'badge',
      value: 'collector_badge',
      description: 'コレクターバッジ'
    },
    rarity: 'common'
  },
  {
    id: 'legendary_collector',
    name: '✨ 伝説のコレクター',
    description: '全装備解放達成！完璧なコレクションです。真の冒険者の証ですね。',
    icon: '✨',
    category: 'special',
    condition: { type: 'equipment_count', value: 15 },
    reward: {
      type: 'title',
      value: '伝説のコレクター',
      description: '全装備制覇の証'
    },
    rarity: 'legendary'
  }
];

// 実績チェック関数
export const checkAchievements = (
  currentAchievements: PlayerAchievements,
  playerData: {
    assets: number;
    savingsRate: number;
    fireProgress: number;
    equipmentCount: number;
    totalSaved: number;
  }
): { newAchievements: Achievement[]; updatedProgress: Record<string, number> } => {
  const newAchievements: Achievement[] = [];
  const updatedProgress: Record<string, number> = { ...currentAchievements.progress };

  ACHIEVEMENTS.forEach(achievement => {
    // 既に解放済みの場合はスキップ
    if (currentAchievements.unlockedAchievements.includes(achievement.id)) {
      return;
    }

    let currentValue = 0;
    let targetValue = achievement.condition.value;

    // 条件に応じて現在値を取得
    switch (achievement.condition.type) {
      case 'assets':
        currentValue = playerData.assets;
        break;
      case 'savings_rate':
        currentValue = playerData.savingsRate;
        break;
      case 'fire_progress':
        currentValue = playerData.fireProgress;
        break;
      case 'equipment_count':
        currentValue = playerData.equipmentCount;
        break;
      case 'total_saved':
        currentValue = playerData.totalSaved;
        break;
    }

    // 進捗率を計算
    const progress = Math.min(100, (currentValue / targetValue) * 100);
    updatedProgress[achievement.id] = progress;

    // 条件達成チェック
    const operator = achievement.condition.operator || 'gte';
    let isAchieved = false;

    switch (operator) {
      case 'gte':
        isAchieved = currentValue >= targetValue;
        break;
      case 'lte':
        isAchieved = currentValue <= targetValue;
        break;
      case 'eq':
        isAchieved = currentValue === targetValue;
        break;
    }

    if (isAchieved) {
      newAchievements.push({
        ...achievement,
        unlockedAt: new Date(),
        progress: 100
      });
    }
  });

  return { newAchievements, updatedProgress };
};

// 実績の希少度に応じた色を取得
export const getAchievementRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'from-gray-400 to-gray-600';
    case 'rare': return 'from-blue-400 to-blue-600';
    case 'epic': return 'from-purple-400 to-purple-600';
    case 'legendary': return 'from-yellow-400 to-yellow-600';
    default: return 'from-gray-400 to-gray-600';
  }
};

// 実績カテゴリーのアイコンを取得
export const getAchievementCategoryIcon = (category: string) => {
  switch (category) {
    case 'milestone': return '🎯';
    case 'behavior': return '💪';
    case 'special': return '⭐';
    case 'streak': return '🔥';
    default: return '🏆';
  }
};