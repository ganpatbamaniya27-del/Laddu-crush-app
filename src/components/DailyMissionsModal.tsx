import React from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { X, Target, CheckCircle, Sparkles, Award } from 'lucide-react';

export interface Mission {
  id: string;
  title: string;
  titleGu: string;
  target: number;
  current: number;
  rewardCoins: number;
  rewardBooster?: 'hammer' | 'bomb' | 'swap';
  claimed: boolean;
}

interface DailyMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  missions: Mission[];
  onClaimMission: (missionId: string) => void;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  isOpen,
  onClose,
  lang,
  missions,
  onClaimMission,
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
          <Target className="w-5 h-5 text-amber-300" />
          <h2 className="font-cinzel text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 drop-shadow">
            {lang === 'gu' ? 'દૈનિક મિશન' : 'DAILY MISSIONS'}
          </h2>
        </div>
        <p className="text-[11px] text-amber-200/80 mb-4">
          {lang === 'gu' ? 'રોજિંદા મિશન પૂર્ણ કરી ઇનામો મેળવો!' : 'Complete daily quests to claim royal bounty!'}
        </p>

        {/* Missions List */}
        <div className="flex flex-col gap-2.5">
          {missions.map(m => {
            const isCompleted = m.current >= m.target;
            const progressPercent = Math.min(100, Math.round((m.current / m.target) * 100));

            return (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-black/40 border border-amber-400/40 flex flex-col gap-2 shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-100">
                      {lang === 'gu' ? m.titleGu : m.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-yellow-300">
                    <span>+{m.rewardCoins} 🪙</span>
                    {m.rewardBooster === 'hammer' && <span>+🔨</span>}
                    {m.rewardBooster === 'bomb' && <span>+💣</span>}
                  </div>
                </div>

                {/* Progress bar and counter */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-black/70 border border-amber-400/40 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 whitespace-nowrap">
                    {Math.min(m.current, m.target)} / {m.target}
                  </span>
                </div>

                {/* Claim Button */}
                <div className="flex justify-end pt-0.5">
                  {m.claimed ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.claimed}</span>
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => {
                        sound.playWin();
                        onClaimMission(m.id);
                      }}
                      className="py-1 px-4 rounded-lg btn-gold-royal text-[11px] font-black tracking-wider flex items-center gap-1 cursor-pointer shadow-[0_0_10px_gold] animate-pulse"
                    >
                      <Sparkles className="w-3 h-3 text-amber-950" />
                      <span>{t.claimRewards}</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-semibold px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                      In Progress
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
