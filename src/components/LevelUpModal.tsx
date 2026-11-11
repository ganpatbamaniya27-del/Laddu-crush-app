import React from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { Crown, Sparkles, Trophy, Film, X } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  lang: Language;
  onClaimRegular: () => void;
  onWatchAd3X: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  newLevel,
  lang,
  onClaimRegular,
  onWatchAd3X,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-[360px] p-6 rounded-3xl bg-gradient-to-b from-[#4d1338] via-[#2c0920] to-[#14030f] border-2 border-amber-300 shadow-[0_0_50px_rgba(255,215,0,0.7)] text-center overflow-hidden">
        
        {/* Golden Sunburst Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgba(255,215,0,0.3)_0%,_transparent_75%)] pointer-events-none animate-pulse" />

        {/* Top Trophy / Crown Lockup */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-400 to-amber-600 border-2 border-white shadow-[0_0_30px_gold] flex items-center justify-center animate-bounce">
            <Crown className="w-10 h-10 text-amber-950 fill-amber-950 drop-shadow" />
          </div>
        </div>

        {/* Header Titles */}
        <h2 className="font-cinzel text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#FFD700] to-[#B37400] drop-shadow-[0_4px_12px_rgba(255,215,0,0.8)] leading-none mb-1">
          {t.levelUp}
        </h2>

        <p className="text-xs font-bold text-amber-200 tracking-wider uppercase mb-3">
          {t.levelUpSubtitle}
        </p>

        {/* Promoted Level Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-amber-400/80 shadow mb-4">
          <span className="text-xs font-bold text-amber-400">
            {t.playerLevel} {newLevel - 1}
          </span>
          <span className="text-yellow-300 font-black">➔</span>
          <span className="font-cinzel text-sm font-black text-yellow-300 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            {t.playerLevel} {newLevel}
          </span>
        </div>

        {/* Level Up Rewards Preview Box */}
        <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/50 mb-4 text-left">
          <span className="text-[11px] font-bold text-amber-300/80 block mb-2 uppercase">
            {t.levelUpRewards}:
          </span>
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5 text-yellow-200">
              <span className="text-base">🪙</span>
              <span>1,000 Coins</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-200">
              <span className="text-base">🔨</span>
              <span>x1 Hammer</span>
            </div>
          </div>
        </div>

        {/* 3X LEVEL UP VIDEO AD MULTIPLIER BUTTON */}
        <div className="relative mb-3">
          <div className="absolute -top-2.5 right-4 z-10 px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] tracking-wider border border-yellow-300 shadow animate-pulse">
            3X MEGA MULTIPLIER
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onWatchAd3X();
            }}
            className="w-full py-3.5 px-4 rounded-2xl btn-gold-royal font-cinzel font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_gold] hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Film className="w-4 h-4 text-amber-950" />
            <span>{t.watchAd3x}</span>
          </button>
        </div>

        {/* Claim Regular 1X Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClaimRegular();
          }}
          className="text-xs font-semibold text-amber-300/70 hover:text-amber-200 underline cursor-pointer py-1"
        >
          {t.claimRegular}
        </button>
      </div>
    </div>
  );
};
