import React from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { X, Tv, Sparkles, Film, CheckCircle } from 'lucide-react';
import { AdRewardType } from './RewardedAdModal';

interface WatchAndEarnModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  adsWatchedToday: number;
  totalAdEarnings: number;
  onStartWatchAd: (type: AdRewardType) => void;
}

export const WatchAndEarnModal: React.FC<WatchAndEarnModalProps> = ({
  isOpen,
  onClose,
  lang,
  adsWatchedToday,
  totalAdEarnings,
  onStartWatchAd,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  const maxAdsPerDay = 10;
  const isDailyLimitReached = adsWatchedToday >= maxAdsPerDay;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-[380px] max-h-[90vh] overflow-y-auto p-5 rounded-2xl bg-gradient-to-b from-[#3a0e28] via-[#240819] to-[#12030d] border-2 border-amber-400 shadow-[0_0_35px_rgba(255,215,0,0.5)] scrollbar-thin">
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
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-300">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-cinzel text-lg font-black text-amber-200 tracking-wider">
              {t.watchAndEarn}
            </h2>
            <span className="text-[10px] text-amber-300/80">
              {lang === 'gu' ? 'મફત સિક્કા અને બૂસ્ટર મેળવો' : 'Watch Videos & Collect Free Boosters'}
            </span>
          </div>
        </div>

        {/* Daily Watch Tracker Box */}
        <div className="p-3 my-3 rounded-xl bg-black/50 border border-amber-400/40">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-amber-200">{t.adsWatchedToday}:</span>
            <span className="font-black text-amber-300">
              {adsWatchedToday} / {maxAdsPerDay}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-black/80 border border-amber-400/40 overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300"
              style={{ width: `${Math.min(100, (adsWatchedToday / maxAdsPerDay) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-amber-300/80">
            <span>{lang === 'gu' ? 'આજની કમાણી:' : "Today's Earnings:"}</span>
            <span className="font-bold text-yellow-300">+{totalAdEarnings} 🪙</span>
          </div>
        </div>

        {/* Available Rewarded Ad Tasks */}
        <div className="flex flex-col gap-2.5 mb-4">
          {/* Task 1: +500 Coins */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#4d1338]/60 to-[#2e0921]/60 border border-amber-400/40">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🪙</span>
              <div>
                <p className="font-bold text-xs text-amber-200">
                  {lang === 'gu' ? '+૫૦૦ રોયલ સિક્કા' : '+500 Royal Coins'}
                </p>
                <p className="text-[10px] text-amber-300/70">
                  {lang === 'gu' ? 'ટૂંકો ૫-સેકન્ડનો વિડીયો જુઓ' : 'Short 5s festive video'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onStartWatchAd('coins_500');
              }}
              disabled={isDailyLimitReached}
              className="py-1.5 px-3 rounded-lg btn-gold-royal text-[11px] font-black cursor-pointer disabled:opacity-40 flex items-center gap-1 shadow"
            >
              <Film className="w-3 h-3 text-amber-950" />
              <span>{lang === 'gu' ? 'જુઓ' : 'WATCH'}</span>
            </button>
          </div>

          {/* Task 2: +1 Mega Hammer */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#4d1338]/60 to-[#2e0921]/60 border border-amber-400/40">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🔨</span>
              <div>
                <p className="font-bold text-xs text-amber-200">
                  {lang === 'gu' ? '+૧ મેગા હથોડી (મફત)' : '+1 Free Mega Hammer'}
                </p>
                <p className="text-[10px] text-amber-300/70">
                  {lang === 'gu' ? 'કોઈપણ મીઠાઈ તોડવા માટે' : 'Crush any single sweet'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onStartWatchAd('booster_hammer');
              }}
              disabled={isDailyLimitReached}
              className="py-1.5 px-3 rounded-lg btn-gold-royal text-[11px] font-black cursor-pointer disabled:opacity-40 flex items-center gap-1 shadow"
            >
              <Film className="w-3 h-3 text-amber-950" />
              <span>{lang === 'gu' ? 'જુઓ' : 'WATCH'}</span>
            </button>
          </div>

          {/* Task 3: +1 Jalebi Bomb */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#4d1338]/60 to-[#2e0921]/60 border border-amber-400/40">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">💣</span>
              <div>
                <p className="font-bold text-xs text-amber-200">
                  {lang === 'gu' ? '+૧ જલેબી બોમ્બ (મફત)' : '+1 Free Jalebi Bomb'}
                </p>
                <p className="text-[10px] text-amber-300/70">
                  {lang === 'gu' ? '૩×૩ ધમાકેદાર બ્લાસ્ટ' : 'Big 3x3 blast'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onStartWatchAd('booster_bomb');
              }}
              disabled={isDailyLimitReached}
              className="py-1.5 px-3 rounded-lg btn-gold-royal text-[11px] font-black cursor-pointer disabled:opacity-40 flex items-center gap-1 shadow"
            >
              <Film className="w-3 h-3 text-amber-950" />
              <span>{lang === 'gu' ? 'જુઓ' : 'WATCH'}</span>
            </button>
          </div>
        </div>

        {/* Footer info note */}
        <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-center">
          <p className="text-[10px] text-amber-200/80 leading-normal">
            ✨ {lang === 'gu'
              ? 'રોયલ સ્પોન્સર્સના વિડીયો જોઈને તમે ગેમને સપોર્ટ કરો છો અને બદલામાં તમને અનલિમિટેડ મફત ઇનામ મળે છે!'
              : 'Watching rewarded videos directly supports Laddu Crush and unlocks premium boosters for free!'}
          </p>
        </div>
      </div>
    </div>
  );
};
