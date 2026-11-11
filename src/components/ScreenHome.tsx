import React from 'react';
import { SweetIcon } from './SweetIcon';
import { AdMobBanner } from './AdMobBanner';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Sparkles, Trophy, ShoppingBag, Gift, Crown, Tv, Heart, Target, RotateCw } from 'lucide-react';
import { LivesState } from '../utils/livesSystem';

interface ScreenHomeProps {
  lang: Language;
  onToggleLang: () => void;
  onPlay: () => void;
  onOpenMap: () => void;
  onOpenShop: () => void;
  onOpenDaily: () => void;
  onOpenVip: () => void;
  onOpenWatchAndEarn: () => void;
  onOpenLuckySpin: () => void;
  onOpenMissions: () => void;
  onOpenAchievements: () => void;
  onOpenLivesModal: () => void;
  livesState: LivesState;
  coins: number;
  playerLevel: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  lang,
  onToggleLang,
  onPlay,
  onOpenMap,
  onOpenShop,
  onOpenDaily,
  onOpenVip,
  onOpenWatchAndEarn,
  onOpenLuckySpin,
  onOpenMissions,
  onOpenAchievements,
  onOpenLivesModal,
  livesState,
  coins,
  playerLevel,
  soundEnabled,
  onToggleSound,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3.5 overflow-y-auto select-none bg-gradient-to-b from-[#3d0f2a] via-[#22071a] to-[#0c0314] scrollbar-thin">
      {/* Background Royal Damask / Filigree watermark */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
      
      {/* Decorative Ornate Corner Filigree */}
      <div className="absolute top-2 left-2 text-amber-400/40 pointer-events-none">
        <svg width="36" height="36" viewBox="0 0 40 40" fill="currentColor">
          <path d="M0 0 L40 0 C25 5 15 15 10 30 L0 40 Z" opacity="0.6"/>
          <circle cx="8" cy="8" r="3" fill="#FFD700"/>
        </svg>
      </div>
      <div className="absolute top-2 right-2 text-amber-400/40 pointer-events-none -scale-x-100">
        <svg width="36" height="36" viewBox="0 0 40 40" fill="currentColor">
          <path d="M0 0 L40 0 C25 5 15 15 10 30 L0 40 Z" opacity="0.6"/>
          <circle cx="8" cy="8" r="3" fill="#FFD700"/>
        </svg>
      </div>

      {/* Top Header Utilities: Sound, Lives/Hearts Meter & Language */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <button
          onClick={() => {
            sound.playClick();
            onToggleSound();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 border border-amber-400/40 text-amber-300 text-xs font-semibold hover:border-amber-300 transition-all cursor-pointer"
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-amber-500/70" />}
        </button>

        {/* Clickable Royal Hearts / Lives Meter */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenLivesModal();
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/60 text-red-300 text-xs font-black shadow-[0_0_12px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
          <span>{livesState.lives}/5</span>
          {livesState.lives < 5 && (
            <span className="text-[10px] text-amber-300/80 font-mono ml-0.5">
              ({livesState.formattedCountdown})
            </span>
          )}
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onToggleLang();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/60 text-amber-300 text-xs font-bold hover:bg-amber-400/25 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{t.langToggle}</span>
        </button>
      </div>

      {/* Central Hero: Gilded Title & Royal Laddu Mascot */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-1 text-center">
        {/* Glowing Royal Mascot Laddu */}
        <div className="relative mb-2 flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-amber-400/30 via-yellow-200/40 to-amber-500/30 blur-xl animate-pulse" />
          
          <div className="relative flex items-center justify-center -space-x-4">
            <div className="w-11 h-11 transform -rotate-12 translate-y-2 z-0 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
              <SweetIcon type="kaju_katli" />
            </div>

            <div className="relative w-24 h-24 z-10 animate-bounce duration-1000 filter drop-shadow-[0_10px_20px_rgba(255,215,0,0.5)]">
              <SweetIcon type="motichoor" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center">
                <Crown className="w-7 h-7 text-yellow-300 fill-amber-400 drop-shadow-[0_2px_6px_rgba(255,215,0,0.9)]" />
              </div>
            </div>

            <div className="w-11 h-11 transform rotate-12 translate-y-2 z-0 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
              <SweetIcon type="jalebi" />
            </div>
          </div>
        </div>

        {/* 3D Gilded Title Lockup */}
        <div className="relative px-5 py-1.5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-950/80 to-transparent border-y border-amber-400/40 -z-10 rounded-xl" />
          
          <h1 className="font-cinzel text-3xl sm:text-4xl font-black tracking-wider leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#FFD700] to-[#B37400] drop-shadow-[0_4px_12px_rgba(255,215,0,0.6)]">
            {t.appTitle}
          </h1>

          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-[10px] font-bold tracking-[0.25em] text-amber-200 uppercase drop-shadow">
              {t.tagline}
            </span>
            <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
          </div>
        </div>

        {/* Gilded Big Play Button */}
        <div className="w-full max-w-[270px] mt-4">
          <button
            onClick={() => {
              sound.playClick();
              onPlay();
            }}
            className="w-full relative group py-3.5 px-6 rounded-2xl btn-gold-royal font-cinzel font-black text-xl tracking-widest flex items-center justify-center gap-3 cursor-pointer shadow-[0_6px_20px_rgba(255,184,0,0.6)] active:scale-95 transition-all"
          >
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="w-full h-full animate-gold-shimmer" />
            </div>
            <span className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-[#4a2300] border-b-[8px] border-b-transparent ml-1" />
            <span>{t.play}</span>
          </button>

          {/* Secondary Levels Map Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenMap();
            }}
            className="w-full mt-2.5 py-2 px-4 rounded-xl btn-maroon-royal font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.levelsMap}</span>
          </button>
        </div>

        {/* New Features Quick Row (Spin, Missions, Trophies) */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[290px] mt-3">
          {/* LUCKY SPIN */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLuckySpin();
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-amber-500/20 to-black/60 border border-amber-400/60 shadow hover:border-yellow-300 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCw className="w-4 h-4 text-yellow-300 mb-0.5" />
            <span className="text-[10px] font-black text-amber-200">
              {lang === 'gu' ? 'લકી સ્પિન' : 'SPIN'}
            </span>
          </button>

          {/* MISSIONS */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenMissions();
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-amber-500/20 to-black/60 border border-amber-400/60 shadow hover:border-yellow-300 active:scale-95 transition-all cursor-pointer"
          >
            <Target className="w-4 h-4 text-yellow-300 mb-0.5" />
            <span className="text-[10px] font-black text-amber-200">
              {lang === 'gu' ? 'મિશન' : 'MISSIONS'}
            </span>
          </button>

          {/* ACHIEVEMENTS / TROPHIES */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAchievements();
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-amber-500/20 to-black/60 border border-amber-400/60 shadow hover:border-yellow-300 active:scale-95 transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-yellow-300 mb-0.5" />
            <span className="text-[10px] font-black text-amber-200">
              {lang === 'gu' ? 'ટ્રોફી' : 'TROPHIES'}
            </span>
          </button>
        </div>
      </div>

      {/* Official Google AdMob Banner Container - On Home Screen Only */}
      <div className="relative z-10 w-full my-1">
        <AdMobBanner visible={true} />
      </div>

      {/* Bottom Hub: 3 Actions (Shop, 7-Day Rewards, VIP Club) */}
      <div className="relative z-10 w-full pt-1">
        <div className="grid grid-cols-3 gap-2 mb-2">
          {/* SHOP */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#330f24] to-[#1a0613] border border-amber-400/50 shadow-md hover:border-amber-300 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center mb-0.5 text-amber-300">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold text-amber-200 tracking-wider">
              {t.shop}
            </span>
          </button>

          {/* 7 DAYS REWARDS */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenDaily();
            }}
            className="relative flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#330f24] to-[#1a0613] border border-amber-400/50 shadow-md hover:border-amber-300 active:scale-95 transition-all cursor-pointer"
          >
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-amber-300 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-amber-300" />
            
            <div className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center mb-0.5 text-amber-300">
              <Gift className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold text-amber-200 tracking-wider">
              {lang === 'gu' ? '૭ દિવસ ભેટ' : '7 DAYS'}
            </span>
          </button>

          {/* VIP CLUB */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenVip();
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#330f24] to-[#1a0613] border border-amber-400/50 shadow-md hover:border-amber-300 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center mb-0.5 text-amber-300">
              <Crown className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold text-amber-200 tracking-wider">
              {t.vipClub}
            </span>
          </button>
        </div>

        {/* Bottom Player Status Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-black/60 border border-amber-400/60 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-amber-300">
              {t.playerLevel} {playerLevel}
            </span>
            <span className="text-amber-500/80">·</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-extrabold tracking-wider border border-amber-400/40">
              VIP
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-xs tracking-wide">
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 border border-amber-100 flex items-center justify-center text-[9px] text-amber-950 font-black">
              🪙
            </div>
            <span>{(coins / 1000).toFixed(1)}K</span>
          </div>
        </div>
      </div>
    </div>
  );
};
