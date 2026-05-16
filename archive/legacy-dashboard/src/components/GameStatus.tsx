import React from 'react';
import { Sword, Shield, Trophy } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import {
  GAME_MESSAGES,
  type GameItem
} from '../utils/gameSystem';

interface GameStatusProps {
  playerStats: any;
  playerAchievements: any;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  playerStats,
  playerAchievements
}) => {
  // 装備アイテムの取得
  const equippedWeapon = playerStats.equippedItems?.find((item: GameItem) => item.category === 'weapon');
  const equippedArmor = playerStats.equippedItems?.find((item: GameItem) => item.category === 'armor');
  const equippedAccessory = playerStats.equippedItems?.find((item: GameItem) => item.category === 'accessory');

  return (
    <div className="space-y-4">
      {/* プレイヤープロファイル */}
      <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl border-2 border-white/30">
                👤
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-900 text-xs font-black px-2 py-1 rounded-full border-2 border-indigo-600">
                Lv.{playerStats.level}
              </div>
            </div>
            <div>
              <div className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-1">
                {playerStats.title}
              </div>
              <h2 className="text-2xl font-black tracking-tight">冒険者</h2>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold border border-white/20">
                  RANK S
                </span>
                <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold border border-white/20">
                  FIRE PROGRESS: {Math.min(100, (playerAchievements.totalSaved / (playerStats.fireNumber || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* ステータスバー */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider text-indigo-200">
                <span>Experience Points (XP)</span>
                <span>{playerStats.exp} / {playerStats.nextLevelExp}</span>
              </div>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 transition-all duration-1000 ease-out"
                  style={{ width: `${(playerStats.exp / playerStats.nextLevelExp) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider text-red-200">
                  <span>Savings Power (HP)</span>
                  <span>{Math.round(playerStats.hp)} / {playerStats.maxHp}</span>
                </div>
                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-1000"
                    style={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider text-blue-200">
                  <span>Knowledge (MP)</span>
                  <span>{playerStats.mp} / {playerStats.maxMp}</span>
                </div>
                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000"
                    style={{ width: `${(playerStats.mp / playerStats.maxMp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 現在の装備 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: < Sword className="w-4 h-4 text-orange-500" />, label: '武器', item: equippedWeapon },
          { icon: < Shield className="w-4 h-4 text-blue-500" />, label: '防具', item: equippedArmor },
          { icon: < Trophy className="w-4 h-4 text-yellow-500" />, label: '装飾', item: equippedAccessory }
        ].map((slot, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-slate-100">
            <CardContent className="p-3 flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mb-2">
                {slot.icon}
              </div>
              <div className="text-[10px] font-bold text-slate-400 mb-1">{slot.label}</div>
              {slot.item ? (
                <div className="text-xl group relative cursor-help">
                  {slot.item.icon}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover:block z-50">
                    <div className="bg-slate-800 text-white text-[10px] p-2 rounded shadow-xl">
                      <div className="font-bold border-b border-white/20 pb-1 mb-1">{slot.item.name}</div>
                      <div className="text-slate-300">{slot.item.effect}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-300 text-sm">---</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 励ましメッセージ */}
      <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm italic text-sm text-slate-600 text-center">
        " {GAME_MESSAGES.encouragement[Math.floor(Math.random() * GAME_MESSAGES.encouragement.length)]} "
      </div>
    </div>
  );
};