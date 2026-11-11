import React, { useState } from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Gift, Sparkles, Check, Crown, Heart } from 'lucide-react';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onClaimDay: (reward: { coins: number; hammer?: number; bomb?: number; swap?: number; lives?: number }) => void;
}

interface DayRewardConfig {
  day: number;
  label: string;
  sublabel: string;
  icon: string;
  reward: { coins: number; hammer?: number; bomb?: number; swap?: number; lives?: number };
}

const SEVEN_DAYS: DayRewardConfig[] = [
  { day: 1, label: '500', sublabel: 'Coins', icon: '🪙', reward: { coins: 500 } },
  { day: 2, label: '1,000', sublabel: '+1 Life', icon: '❤️', reward: { coins: 1000, lives: 1 } },
  { day: 3, label: 'Hammer', sublabel: 'x2', icon: '🔨', reward: { coins: 300, hammer: 2 } },
  { day: 4, label: '1,500', sublabel: 'Coins', icon: '🪙', reward: { coins: 1500 } },
  { day: 5, label: 'Bomb', sublabel: 'x2', icon: '💣', reward: { coins: 400, bomb: 2 } },
  { day: 6, label: '2,500', sublabel: '+2 Swaps', icon: '⇄', reward: { coins: 2500, swap: 2 } },
  { day: 7, label: 'GRAND BOX', sublabel: '5,000 🪙 + VIP', icon: '👑', reward: { coins: 5000, hammer: 3, bomb: 3, swap: 2, lives: 5 } },
];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  lang,
  onClaimDay,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  // Retrieve or initialize login streak
  const [currentStreakDay, setCurrentStreakDay] = useState<number>(() => {
    const saved = localStorage.getItem('laddu_crush_streak_day');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(() => {
    const lastClaim = localStorage.getItem('laddu_crush_streak_last_claim');
    if (!lastClaim) return false;
    const hours = (Date.now() - parseInt(lastClaim, 10)) / (1000 * 60 * 60);
    return hours < 20; // 20 hours cooldown
  });

  const [claimedReward, setClaimedReward] = useState<DayRewardConfig | null>(null);

  const handleClaimToday = () => {
    if (hasClaimedToday) return;

    const todayConfig = SEVEN_DAYS[(currentStreakDay - 1) % SEVEN_DAYS.length];
    sound.playWin();

    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF80AB', '#00E676', '#FFFFFF'],
    });

    setHasClaimedToday(true);
    setClaimedReward(todayConfig);

    localStorage.setItem('laddu_crush_streak_last_claim', Date.now().toString());
    const nextDay = (currentStreakDay % 7) + 1;
    localStorage.setItem('laddu_crush_streak_day', nextDay.toString());
    setCurrentStreakDay(nextDay);

    onClaimDay(todayConfig.reward);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-[400px] max-h-[92vh] overflow-y-auto p-5 rounded-3xl bg-gradient-to-b from-[#3a0e28] via-[#240819] to-[#12030d] border-2 border-amber-400 shadow-[0_0_40px_rgba(255,215,0,0.5)] text-center scrollbar-thin">
        
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

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <Gift className="w-6 h-6 text-amber-300 fill-amber-400/20" />
          <h2 className="font-cinzel text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 drop-shadow">
            {lang === 'gu' ? '૭ દિવસ લોગીન ભેટ' : '7 DAYS LOGIN REWARDS'}
          </h2>
        </div>

        <p className="text-[11px] text-amber-100/80 mb-3 px-2">
          {lang === 'gu'
            ? 'રોજ લોગીન કરો અને ૭મા દિવસે ગ્રાન્ડ રોયલ મીઠાઈ બોક્સ જીતો!'
            : 'Login daily to unlock rewards culminating in the Day 7 Grand Royal Box!'}
        </p>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {SEVEN_DAYS.slice(0, 6).map(d => {
            const isCompleted = d.day < currentStreakDay;
            const isToday = d.day === currentStreakDay;

            return (
              <div
                key={d.day}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                  isToday
                    ? 'bg-amber-400/25 border-yellow-300 shadow-[0_0_15px_gold] scale-105'
                    : isCompleted
                    ? 'bg-black/50 border-emerald-500/50 text-neutral-400'
                    : 'bg-black/40 border-amber-400/30 text-amber-300/70'
                }`}
              >
                <div className="flex items-center justify-between w-full text-[10px] font-bold text-amber-300 mb-1 px-1">
                  <span>Day {d.day}</span>
                  {isCompleted && <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />}
                </div>

                <span className="text-2xl my-0.5">{d.icon}</span>
                <span className="font-black text-xs text-amber-100">{d.label}</span>
                <span className="text-[9px] text-amber-300/80 font-semibold">{d.sublabel}</span>

                {isToday && !hasClaimedToday && (
                  <span className="mt-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[8px] animate-pulse">
                    READY
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Day 7 Grand Prize Card (Spans full width) */}
        {(() => {
          const day7 = SEVEN_DAYS[6];
          const isDay7Today = currentStreakDay >= 7;

          return (
            <div
              className={`p-3 rounded-2xl border-2 flex items-center justify-between text-left mb-4 ${
                isDay7Today
                  ? 'bg-gradient-to-r from-amber-500/30 via-yellow-400/30 to-amber-600/30 border-yellow-300 shadow-[0_0_20px_gold] animate-pulse'
                  : 'bg-black/50 border-amber-400/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-2xl shadow">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-cinzel text-xs font-black text-yellow-200">
                      DAY 7 GRAND ROYAL BOX
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  </div>
                  <p className="text-[10px] text-amber-100/90 leading-tight mt-0.5">
                    5,000 🪙 + Full Lives + 3 Hammers + 3 Bombs!
                  </p>
                </div>
              </div>

              <span className="text-xs font-black text-yellow-300 font-mono">
                {currentStreakDay >= 7 ? 'UNLOCKED' : `${currentStreakDay}/7`}
              </span>
            </div>
          );
        })()}

        {/* Claim Feedback */}
        {claimedReward && (
          <div className="mb-3 p-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold animate-bounce">
            🎉 {lang === 'gu' ? 'ઇનામ સફળતાપૂર્વક મેળવ્યું!' : 'Reward Claimed Successfully!'}
          </div>
        )}

        {/* Claim / Collect CTA */}
        <button
          onClick={hasClaimedToday ? onClose : handleClaimToday}
          className={`w-full py-3.5 rounded-xl font-cinzel font-black text-xs sm:text-sm tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
            hasClaimedToday
              ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
              : 'btn-gold-royal active:scale-95 shadow-[0_0_20px_gold]'
          }`}
        >
          {hasClaimedToday ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'gu' ? 'આજની ભેટ મેળવી લીધી (બંધ કરો)' : 'TODAY CLAIMED (CLOSE)'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-950" />
              <span>{lang === 'gu' ? 'આજની ભેટ મેળવો' : 'CLAIM TODAY REWARD'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
