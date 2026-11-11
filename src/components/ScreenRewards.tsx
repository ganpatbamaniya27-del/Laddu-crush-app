import React, { useState } from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { Crown, Sparkles, Trophy, CheckCircle, ArrowLeft } from 'lucide-react';

interface ScreenRewardsProps {
  coins: number;
  hammerCount: number;
  swapCount: number;
  bombCount: number;
  lang: Language;
  onBack: () => void;
  onClaimDaily: (addedCoins: number) => void;
  onBuyBooster: (type: 'hammer' | 'swap' | 'bomb', cost: number) => void;
  onWatchAdForReward?: () => void;
}

export const ScreenRewards: React.FC<ScreenRewardsProps> = ({
  coins,
  hammerCount,
  swapCount,
  bombCount,
  lang,
  onBack,
  onClaimDaily,
  onBuyBooster,
  onWatchAdForReward,
}) => {
  const t = TRANSLATIONS[lang];
  const [claimedToday, setClaimedToday] = useState<boolean>(false);
  const [showClaimBurst, setShowClaimBurst] = useState<boolean>(false);

  const handleClaim = () => {
    if (claimedToday) return;
    sound.playWin();
    setShowClaimBurst(true);
    setClaimedToday(true);
    onClaimDaily(1500);
    setTimeout(() => setShowClaimBurst(false), 2000);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 select-none overflow-y-auto bg-gradient-to-b from-[#2b0a21] via-[#1a0515] to-[#0c0310] scrollbar-thin">
      {/* Background radial gold aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(255,215,0,0.15)_0%,_transparent_70%)] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between pb-2 border-b border-amber-400/30">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="w-9 h-9 rounded-full bg-black/50 border border-amber-400/60 flex items-center justify-center text-amber-300 hover:bg-black/70 active:scale-95 transition-all cursor-pointer shadow"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-300 fill-amber-400" />
          <h2 className="font-cinzel text-base font-black tracking-widest text-amber-200">
            {t.vipClub.toUpperCase()}
          </h2>
        </div>

        {/* Current coins */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 border border-amber-400/60 text-amber-300 text-xs font-bold">
          <span>🪙</span>
          <span>{(coins / 1000).toFixed(1)}K</span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col gap-3 py-2">
        {/* VIP PASS ACTIVE Card (Screen 4 VIP Pass Box) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#3e0f2d] via-[#4d1338] to-[#3e0f2d] border border-amber-400 shadow-[0_4px_18px_rgba(255,215,0,0.25)]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-sm font-black tracking-wider text-amber-300">
                {t.vipPass}
              </span>
              <span className="text-amber-500">·</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] border border-emerald-400/60 tracking-wider">
                {t.active}
              </span>
            </div>
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          </div>

          <div className="text-[11px] text-amber-100/90 leading-relaxed">
            <p className="font-semibold text-yellow-200 mb-0.5">{t.dailyBonus}</p>
            <p className="text-amber-200/80">{t.bonusPerks}</p>
          </div>
        </div>

        {/* Sponsored Video Ad Earning Banner */}
        {onWatchAdForReward && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-400/25 to-amber-500/20 border border-amber-400 flex items-center justify-between shadow-[0_0_15px_rgba(255,215,0,0.25)]">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">📺</span>
              <div>
                <p className="font-cinzel font-black text-xs text-yellow-200">
                  {t.watchAndEarn}
                </p>
                <p className="text-[10px] text-amber-200/90 font-semibold">
                  {lang === 'gu' ? '+૫૦૦ સિક્કા અને ૧ મફત હથોડી' : '+500 Coins & +1 Free Hammer'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onWatchAdForReward();
              }}
              className="py-1.5 px-3 rounded-xl btn-gold-royal text-[11px] font-black cursor-pointer shadow active:scale-95"
            >
              {lang === 'gu' ? 'જુઓ' : 'WATCH'}
            </button>
          </div>
        )}

        {/* GOLD BOOSTERS Section (Screen 4 Boosters Showcase) */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-cinzel text-xs font-black tracking-wider text-amber-300">
              {t.goldBoosters}
            </span>
            <span className="text-[10px] text-amber-200/70">
              {lang === 'gu' ? 'સિક્કાથી ખરીદો' : 'Refill with Coins'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Mega Hammer */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-400/50 flex flex-col items-center justify-between text-center">
              <span className="text-2xl">🔨</span>
              <span className="text-[11px] font-bold text-amber-200 mt-1 uppercase">
                {t.megaHammer}
              </span>
              <span className="text-xs font-black text-amber-400 my-0.5">
                x{hammerCount}
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  onBuyBooster('hammer', 500);
                }}
                disabled={coins < 500}
                className="w-full mt-1 py-1 rounded-md bg-amber-400/20 hover:bg-amber-400/30 disabled:opacity-40 text-amber-300 font-bold text-[10px] border border-amber-400/50 cursor-pointer"
              >
                +1 (500 🪙)
              </button>
            </div>

            {/* Cookie Swap */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-400/50 flex flex-col items-center justify-between text-center">
              <span className="text-2xl">⇄</span>
              <span className="text-[11px] font-bold text-amber-200 mt-1 uppercase">
                {t.cookieSwap}
              </span>
              <span className="text-xs font-black text-amber-400 my-0.5">
                x{swapCount}
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  onBuyBooster('swap', 400);
                }}
                disabled={coins < 400}
                className="w-full mt-1 py-1 rounded-md bg-amber-400/20 hover:bg-amber-400/30 disabled:opacity-40 text-amber-300 font-bold text-[10px] border border-amber-400/50 cursor-pointer"
              >
                +1 (400 🪙)
              </button>
            </div>

            {/* Jalebi Bomb */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-400/50 flex flex-col items-center justify-between text-center">
              <span className="text-2xl">💣</span>
              <span className="text-[11px] font-bold text-amber-200 mt-1 uppercase">
                {t.jalebiBomb}
              </span>
              <span className="text-xs font-black text-amber-400 my-0.5">
                x{bombCount}
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  onBuyBooster('bomb', 600);
                }}
                disabled={coins < 600}
                className="w-full mt-1 py-1 rounded-md bg-amber-400/20 hover:bg-amber-400/30 disabled:opacity-40 text-amber-300 font-bold text-[10px] border border-amber-400/50 cursor-pointer"
              >
                +1 (600 🪙)
              </button>
            </div>
          </div>
        </div>

        {/* GOLD LEADERBOARD Section (Screen 4 Leaderboard) */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-cinzel text-xs font-black tracking-wider text-amber-300">
              {t.goldLeaderboard}
            </span>
            <span className="text-[10px] font-bold text-amber-400 uppercase">
              {t.thisWeek}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {/* 1st Place - YOU */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500/30 via-yellow-400/30 to-amber-600/30 border border-yellow-300 shadow-[0_0_12px_rgba(255,215,0,0.3)]">
              <div className="flex items-center gap-2.5">
                <span className="font-black text-amber-300 text-sm">1st</span>
                <span className="text-lg">👸</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-yellow-100">
                      {lang === 'gu' ? 'તમે (YOU)' : 'YOU'}
                    </span>
                    <Crown className="w-3.5 h-3.5 text-yellow-300 fill-amber-400" />
                  </div>
                  <span className="text-[10px] text-amber-300/80">
                    Grand Sweet Master
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-cinzel font-black text-sm text-yellow-200">
                  124,500
                </span>
                <div className="text-[9px] text-emerald-400 font-bold">#1 Top Rank</div>
              </div>
            </div>

            {/* 2nd Place */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-amber-400/30">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-slate-300 text-xs">2nd</span>
                <span className="text-lg">👸</span>
                <div>
                  <span className="font-bold text-xs text-slate-200">ROYALPLAYER</span>
                  <div className="text-[9px] text-amber-200/60">Palace Champion</div>
                </div>
              </div>
              <span className="font-cinzel font-bold text-xs text-slate-200">
                112,300
              </span>
            </div>

            {/* 3rd Place */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-amber-400/30">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-amber-600 text-xs">3rd</span>
                <span className="text-lg">👸</span>
                <div>
                  <span className="font-bold text-xs text-slate-200">SWEETKING</span>
                  <div className="text-[9px] text-amber-200/60">Diwali Legend</div>
                </div>
              </div>
              <span className="font-cinzel font-bold text-xs text-slate-200">
                98,700
              </span>
            </div>

            {/* 4th Place */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-black/20 border border-amber-400/20">
              <div className="flex items-center gap-2.5">
                <span className="font-semibold text-slate-400 text-xs">4th</span>
                <span className="text-lg">👳</span>
                <div>
                  <span className="font-semibold text-xs text-slate-300">MAHARAJA_LADDU</span>
                </div>
              </div>
              <span className="font-cinzel font-semibold text-xs text-slate-400">
                84,200
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Burst Confetti/Alert */}
      {showClaimBurst && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pointer-events-none">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#4d1033] to-[#1f0514] border-2 border-yellow-300 text-center shadow-[0_0_30px_gold] animate-bounce">
            <span className="text-5xl block mb-2">🎉</span>
            <h3 className="font-cinzel text-xl font-black text-yellow-300 mb-1">
              +1,500 🪙 CLAIMED!
            </h3>
            <p className="text-xs text-amber-100">
              {lang === 'gu'
                ? 'દૈનિક બોનસ તમારા રોયલ વોલેટમાં ઉમેરાઈ ગયું!'
                : 'Daily VIP reward added to your royal treasury!'}
            </p>
          </div>
        </div>
      )}

      {/* Primary Gilded Action Button: CLAIM REWARDS (Screen 4 CTA) */}
      <div className="relative z-10 w-full pt-2">
        <button
          onClick={handleClaim}
          disabled={claimedToday}
          className={`w-full py-3.5 px-6 rounded-xl font-cinzel font-black text-base tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
            claimedToday
              ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
              : 'btn-gold-royal active:scale-95'
          }`}
        >
          {claimedToday ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>{t.claimed}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-950" />
              <span>{t.claimRewards} (+1,500 🪙)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
