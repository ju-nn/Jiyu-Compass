import React, { useEffect, useState } from 'react';
import { Crown, Sparkles, Gift, X } from 'lucide-react';
import { ParticleSystem } from './ParticleSystem';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface LevelUpNotificationProps {
  oldLevel: number;
  newLevel: number;
  newTitle: string;
  onClose: () => void;
  isVisible: boolean;
}

export const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({
  oldLevel,
  newLevel,
  newTitle,
  onClose,
  isVisible
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const { play } = useSoundEffects();

  useEffect(() => {
    if (isVisible) {
      // Play level up sound
      play('levelUp');
      // Show particles
      setShowParticles(true);
      // 1秒後に詳細表示
      const detailTimer = setTimeout(() => setShowDetails(true), 1000);
      // 0.5秒後に紙吹雪
      const confettiTimer = setTimeout(() => setShowConfetti(true), 500);
      // 6秒後に自動クローズ
      const closeTimer = setTimeout(onClose, 6000);

      return () => {
        clearTimeout(detailTimer);
        clearTimeout(confettiTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isVisible, onClose, play]);

  if (!isVisible) return null;

  // 紙吹雪の色配列
  const confettiColors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
    'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-orange-400'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* 紙吹雪エフェクト */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${confettiColors[i % confettiColors.length]} animate-confetti`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-lg w-full bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl shadow-2xl overflow-hidden animate-bounce-in">
        {/* 背景グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20" />

        {/* キラキラエフェクト */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
          ))}
        </div>

        {/* クローズボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-black/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        {/* Level Up Content */}
        {showParticles && <ParticleSystem type="stars" isActive={showParticles} />}

        <div className="relative p-8 text-center">
          {/* レベルアップアイコン */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-xl animate-level-up">
              <Crown className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* メインメッセージ */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-yellow-800 dark:text-yellow-200 mb-2 animate-glow">
              🎉 レベルアップ！ 🎉
            </h1>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                  Lv.{oldLevel}
                </div>
                <div className="text-xs text-slate-500">前のレベル</div>
              </div>

              <div className="text-3xl animate-bounce">→</div>

              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 animate-pulse">
                  Lv.{newLevel}
                </div>
                <div className="text-xs text-yellow-600">新しいレベル</div>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800">
              <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                新しい称号を獲得！
              </h2>
              <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
                「{newTitle}」
              </div>
            </div>
          </div>

          {/* 詳細情報 */}
          {showDetails && (
            <div className="animate-slide-in-bottom space-y-4">
              {/* 特典情報 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-blue-800 dark:text-blue-200">
                    レベルアップ特典
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
                    <span>✨</span>
                    <span>新しい装備が解放される可能性があります</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
                    <span>🎯</span>
                    <span>より高度な機能にアクセス可能</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
                    <span>🏆</span>
                    <span>新しい実績の解放</span>
                  </div>
                </div>
              </div>

              {/* 励ましメッセージ */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  🎮 素晴らしい進歩です！この調子で経済的自由という最終ボスを目指しましょう。
                  あなたの資産形成スキルがまた一段階レベルアップしました！
                </p>
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-all transform hover:scale-105"
            >
              続ける
            </button>

            <button
              onClick={() => {
                // SNSシェア機能
                const shareText = `🎉 レベルアップ！\nLv.${oldLevel} → Lv.${newLevel}\n新しい称号「${newTitle}」を獲得しました！\n\n#ジユウノコンパス #FIREレベルアップ #資産形成RPG`;
                const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                window.open(shareUrl, '_blank');
              }}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              シェアする
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 装備獲得通知コンポーネント
interface EquipmentUnlockNotificationProps {
  equipmentName: string;
  equipmentIcon: string;
  equipmentDescription: string;
  rarity: string;
  onClose: () => void;
  isVisible: boolean;
}

export const EquipmentUnlockNotification: React.FC<EquipmentUnlockNotificationProps> = ({
  equipmentName,
  equipmentIcon,
  equipmentDescription,
  rarity,
  onClose,
  isVisible
}) => {
  const [showParticles, setShowParticles] = useState(false);
  const { play } = useSoundEffects();

  useEffect(() => {
    if (isVisible) {
      // Play sound based on rarity
      if (rarity === 'legendary') {
        play('legendary');
      } else if (rarity === 'epic') {
        play('epic');
      } else if (rarity === 'rare') {
        play('rare');
      }
      // Show particles
      setShowParticles(true);
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, rarity, play]);

  if (!isVisible) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const rarityColor = getRarityColor(rarity);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-slide-in-right">
      <div className={`
        bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 overflow-hidden
        ${rarity === 'legendary' ? 'border-yellow-400 animate-glow' : 'border-slate-200 dark:border-slate-700'}
      `}>
        {/* 背景エフェクト */}
        <div className={`h-2 bg-gradient-to-r ${rarityColor}`} />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* 装備アイコン */}
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-2xl
              bg-gradient-to-br ${rarityColor} animate-bounce-in
            `}>
              {equipmentIcon}
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  装備獲得！
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${rarityColor}`}>
                  {rarity}
                </span>
              </div>

              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">
                {equipmentName}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {equipmentDescription}
              </p>

              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Particle Effects */}
      {rarity === 'legendary' && (
        <ParticleSystem
          type="stars"
          isActive={showParticles}
          onComplete={() => setShowParticles(false)}
        />
      )}
    </div>
  );
};