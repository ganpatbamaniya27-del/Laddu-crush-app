import React from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { X, Trophy, CheckCircle, Sparkles, Award } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  titleGu: string;
  desc: string;
  descGu: string;
  target: number;
  current: number;
  rewardCoins: number;
  icon: string;
  claimed: boolean;
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  achievements: Achievement[];
  onClaimAchievement: (id: string) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  lang,
  achievements,
  onClaimAchievement,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-[390px] max-h-[90vh] overflow-y-auto p-5 rounded-3xl bg-gradient-to-b from-[#3a0e28] via-[#240819] to-[#12030d] border-2 border-amber-400 shadow-[0_0_40px_rgba(255,215,0,0.5)] scrollbar-thin">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 border border-amber-400/50 flex items-center justify-center text-amber-300 hover:bg-black/70 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5 text-amber-300" />
          <h2 className="font-cinzel text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 drop-shadow">
            {lang === 'gu' ? 'સિદ્ધિઓ અને ટ્રોફી' : 'ACHIEVEMENTS'}
          </h2>
        </div>
        <p className="text-[11px] text-amber-200/80 mb-4">
          {lang === 'gu' ? 'તમામ ટ્રોફી જીતીને રોયલ ઇનામો અનલોક કરો!' : 'Unlock royal trophies and collect rich coin rewards!'}
        </p>

        {/* Achievements List */}
        <div className="flex flex-col gap-2.5">
          {achievements.map(ach => {
            const isCompleted = ach.current >= ach.target;
            const progressPercent = Math.min(100, Math.round((ach.current / ach.target) * 100));

            return (
              <div
                key={ach.id}
                className="p-3 rounded-2xl bg-black/40 border border-amber-400/40 flex flex-col gap-2 shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{ach.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-amber-100">
                        {lang === 'gu' ? ach.titleGu : ach.title}
                      </span>
                      <span className="text-[10px] text-amber-300/70">
                        {lang === 'gu' ? ach.descGu : ach.desc}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-yellow-300 whitespace-nowrap">
                    +{ach.rewardCoins} 🪙
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-black/70 border border-amber-400/40 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 whitespace-nowrap">
                    {Math.min(ach.current, ach.target)} / {ach.target}
                  </span>
                </div>

                {/* Claim Button */}
                <div className="flex justify-end pt-0.5">
                  {ach.claimed ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.claimed}</span>
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => {
                        sound.playWin();
                        onClaimAchievement(ach.id);
                      }}
                      className="py-1 px-4 rounded-lg btn-gold-royal text-[11px] font-black tracking-wider flex items-center gap-1 cursor-pointer shadow-[0_0_10px_gold] animate-pulse"
                    >
                      <Sparkles className="w-3 h-3 text-amber-950" />
                      <span>{t.claimRewards}</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-semibold px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
