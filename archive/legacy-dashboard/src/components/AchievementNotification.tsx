import React, { useEffect, useState } from 'react';
import { X, Gift, Sparkles } from 'lucide-react';
import { getAchievementRarityColor, type Achievement } from '../utils/achievementSystem';
import { ParticleSystem } from './ParticleSystem';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  isVisible: boolean;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  isVisible
}) => {
  const [showReward, setShowReward] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const { play } = useSoundEffects();

  useEffect(() => {
    if (isVisible) {
      // Play achievement sound
      play('achievement');
      // Show particles
      setShowParticles(true);
      // 3秒後に報酬表示
      const rewardTimer = setTimeout(() => setShowReward(true), 1000);
      // 8秒後に自動クローズ
      const closeTimer = setTimeout(onClose, 8000);

      return () => {
        clearTimeout(rewardTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isVisible, onClose, play]);

  if (!isVisible) return null;

  const rarityColor = getAchievementRarityColor(achievement.rarity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
      <div className={`
        relative max-w-md w-full glass-card rounded-3xl shadow-glass dark:shadow-glass-dark overflow-hidden
        animate-scale-in transform-gpu hover-lift
      `}>
        {/* 背景エフェクト - グラデーション */}
        <div className={`absolute inset-0 bg-gradient-to-br ${rarityColor} opacity-10 gradient-animate`} />

        {/* グロー効果 */}
        <div className="absolute inset-0 opacity-30 blur-3xl">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-b ${rarityColor} animate-glow`} />
        </div>

        {/* キラキラエフェクト */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
            </div>
          ))}
        </div>

        {/* クローズボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 glass-light dark:glass-dark rounded-full transition-all hover-scale hover:shadow-lg"
        >
          <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>

        <div className="relative p-8 text-center">
          {/* 実績アイコン */}
          <div className="mb-6">
            <div className={`
              inline-flex items-center justify-center w-24 h-24 rounded-full
              bg-gradient-to-br ${rarityColor} shadow-glow-lg
              animate-bounce-subtle float
              transform transition-transform hover:scale-110 hover:rotate-12
            `}>
              <span className="text-5xl drop-shadow-lg">{achievement.icon}</span>
            </div>
          </div>

          {/* 実績情報 */}
          <div className="mb-6">
            <div className={`
              inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3
              bg-gradient-to-r ${rarityColor}
            `}>
              {achievement.rarity.toUpperCase()} 実績
            </div>

            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              実績解放！
            </h2>

            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-3">
              {achievement.name}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {achievement.description}
            </p>
          </div>

          {/* 報酬表示 */}
          {showReward && (
            <div className="animate-slide-in-bottom">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-800 dark:text-yellow-200">
                    報酬獲得！
                  </span>
                </div>

                <div className="text-sm">
                  <div className="font-bold text-yellow-700 dark:text-yellow-300 mb-1">
                    {achievement.reward.value}
                  </div>
                  <div className="text-yellow-600 dark:text-yellow-400 text-xs">
                    {achievement.reward.description}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
            >
              閉じる
            </button>

            <button
              onClick={() => {
                // SNSシェア機能
                const shareText = `🏆 実績解放！\n${achievement.name}\n\n${achievement.description}\n\n#ジユウノコンパス #FIRE実績 #資産形成RPG`;
                const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                window.open(shareUrl, '_blank');
              }}
              className={`
                px-6 py-2 text-white rounded-lg font-medium transition-all
                bg-gradient-to-r ${rarityColor} hover:shadow-lg transform hover:scale-105
              `}
            >
              シェアする
            </button>
          </div>
        </div>
      </div>

      {/* Particle Effects */}
      <ParticleSystem
        type="stars"
        isActive={showParticles}
        onComplete={() => setShowParticles(false)}
      />
    </div>
  );
};

// 実績一覧表示コンポーネント
interface AchievementListProps {
  achievements: Achievement[];
  unlockedIds: string[];
  progress: Record<string, number>;
}

export const AchievementList: React.FC<AchievementListProps> = ({
  achievements,
  unlockedIds,
  progress
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: '全て', icon: '🏆' },
    { id: 'milestone', name: 'マイルストーン', icon: '🎯' },
    { id: 'behavior', name: '行動', icon: '💪' },
    { id: 'special', name: '特別', icon: '⭐' },
    { id: 'streak', name: '継続', icon: '🔥' }
  ];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => unlockedIds.includes(a.id)).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          🏆 実績一覧
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          解放済み: {unlockedCount} / {totalCount} ({Math.round((unlockedCount / totalCount) * 100)}%)
        </p>

        {/* 進捗バー */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${selectedCategory === category.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }
            `}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* 実績グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map(achievement => {
          const isUnlocked = unlockedIds.includes(achievement.id);
          const progressValue = progress[achievement.id] || 0;
          const rarityColor = getAchievementRarityColor(achievement.rarity);

          return (
            <div
              key={achievement.id}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${isUnlocked
                  ? `bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-yellow-200 dark:border-yellow-800 shadow-md`
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-75'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* アイコン */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-2xl
                  ${isUnlocked
                    ? `bg-gradient-to-br ${rarityColor}`
                    : 'bg-slate-200 dark:bg-slate-700 grayscale'
                  }
                `}>
                  {isUnlocked ? achievement.icon : '❓'}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold text-sm ${isUnlocked ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>
                      {isUnlocked ? achievement.name : '???'}
                    </h3>
                    {isUnlocked && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${rarityColor}`}>
                        {achievement.rarity}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs mb-3 ${isUnlocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {isUnlocked ? achievement.description : '条件を満たすと解放されます'}
                  </p>

                  {/* 進捗バー */}
                  {!isUnlocked && progressValue > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>進捗</span>
                        <span>{progressValue.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-600 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 報酬情報 */}
                  {isUnlocked && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                      <div className="text-xs text-yellow-800 dark:text-yellow-200">
                        <span className="font-bold">報酬: </span>
                        {achievement.reward.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};