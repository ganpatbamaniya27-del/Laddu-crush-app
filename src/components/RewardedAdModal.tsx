import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { X, Volume2, VolumeX, Sparkles, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';

export type AdRewardType =
  | 'coins_500'
  | 'double_win'
  | 'extra_moves'
  | 'booster_hammer'
  | 'booster_bomb'
  | 'level_up_3x'
  | 'unlock_level';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardType: AdRewardType;
  lang: Language;
  onRewardEarned: (rewardType: AdRewardType) => void;
}

const AD_SPONSORS = [
  {
    title: 'Rajwadi Pure Ghee Mithai',
    subtitle: '100% Desi Ghee Laddus & Kaju Katli for Festivals',
    cta: 'Order Now & Get 30% Off',
    tag: 'SPONSORED · FESTIVE SPECIAL',
    icon: '🟡',
    accent: '#FFA500',
    bgColor: 'from-[#421300] via-[#240a00] to-[#120400]',
  },
  {
    title: 'Shree Swarna Jewellers',
    subtitle: 'Royal 24K Gold Necklaces & Diamond Crowns',
    cta: 'Explore Royal Catalog',
    tag: 'SPONSORED · LUXURY COLLECTION',
    icon: '👑',
    accent: '#FFD700',
    bgColor: 'from-[#3a2000] via-[#1f1100] to-[#0d0700]',
  },
  {
    title: 'Diwali Dhamaka Fireworks',
    subtitle: 'Eco-Friendly Sparkling Lights & Sky Shots',
    cta: 'Claim Festival Gift Box',
    tag: 'SPONSORED · LIMITED OFFER',
    icon: '🎆',
    accent: '#FF0055',
    bgColor: 'from-[#3a0820] via-[#1f0310] to-[#0d0107]',
  },
];

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  rewardType,
  lang,
  onRewardEarned,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [adAudio, setAdAudio] = useState<boolean>(true);
  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);
  const [sponsorIndex, setSponsorIndex] = useState<number>(0);

  // Pick a random sponsor when ad opens
  useEffect(() => {
    setTimeLeft(5);
    setIsCompleted(false);
    setShowQuitConfirm(false);
    setSponsorIndex(Math.floor(Math.random() * AD_SPONSORS.length));
  }, [isOpen]);

  // 5-second countdown timer
  useEffect(() => {
    if (!isOpen) return;
    if (timeLeft <= 0) {
      if (!isCompleted) {
        setIsCompleted(true);
        sound.playWin();
        onRewardEarned(rewardType);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      if (adAudio) sound.playClick();
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, isCompleted, adAudio, rewardType, onRewardEarned]);

  const sponsor = AD_SPONSORS[sponsorIndex];
  const progressPercent = Math.min(100, Math.round(((5 - timeLeft) / 5) * 100));

  const handleCloseClick = () => {
    if (isCompleted) {
      sound.playClick();
      onClose();
    } else {
      setShowQuitConfirm(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-[420px] rounded-3xl overflow-hidden bg-black border-2 border-amber-400 shadow-[0_0_50px_rgba(255,215,0,0.5)] flex flex-col justify-between">
        
        {/* Top Header: Progress Bar, Status Badge & Close */}
        <div className="relative z-20 w-full p-3 bg-gradient-to-b from-black/90 to-transparent">
          {/* Ad Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Status Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-amber-400/50 text-[11px] font-bold text-amber-200">
              {isCompleted ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-extrabold">{t.adReady}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
                  <span>
                    {t.adCountdown} <b className="text-yellow-300 font-black text-xs ml-1">{timeLeft}s</b>
                  </span>
                </>
              )}
            </div>

            {/* Audio & Close Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdAudio(!adAudio)}
                className="w-8 h-8 rounded-full bg-black/60 border border-white/30 flex items-center justify-center text-white/80 hover:text-white"
                aria-label="Toggle Ad Sound"
              >
                {adAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={handleCloseClick}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-amber-400 text-amber-950 shadow-[0_0_12px_gold] hover:bg-yellow-300'
                    : 'bg-black/60 border border-white/30 text-white/70 hover:bg-black/90'
                }`}
                aria-label="Close Ad"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video / Commercial Screen Presentation */}
        <div className={`relative w-full aspect-[4/3] flex flex-col items-center justify-center p-6 bg-gradient-to-br ${sponsor.bgColor} overflow-hidden text-center`}>
          {/* Animated Background Rays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,215,0,0.25)_0%,_transparent_70%)] animate-pulse" />
          
          {/* Sponsor Tag */}
          <span className="text-[10px] font-black tracking-widest text-amber-400/80 mb-2 uppercase">
            {sponsor.tag}
          </span>

          {/* Large Hero Icon */}
          <div className="text-6xl mb-3 animate-bounce filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
            {sponsor.icon}
          </div>

          {/* Sponsor Title & Subtitle */}
          <h3 className="font-cinzel text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 drop-shadow mb-1">
            {sponsor.title}
          </h3>
          <p className="text-xs text-amber-100/90 max-w-[280px] leading-relaxed mb-4">
            {sponsor.subtitle}
          </p>

          {/* External Call to Action button */}
          <div className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-300/60 text-xs font-bold text-amber-200 flex items-center gap-1.5 cursor-pointer transition-all">
            <span>{sponsor.cta}</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
          </div>

          {/* Reward Alert Ribbon at bottom of video */}
          {isCompleted && (
            <div className="absolute bottom-2 inset-x-4 py-1.5 rounded-lg bg-emerald-500/90 text-white font-black text-xs tracking-wider shadow-lg animate-bounce">
              🎉 {t.adRewardClaimed}
            </div>
          )}
        </div>

        {/* Bottom Banner Bar */}
        <div className="relative z-20 w-full p-4 bg-gradient-to-t from-black to-black/90 border-t border-amber-400/40 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-amber-300">
              {rewardType === 'coins_500' && '+500 🪙 Royal Coins'}
              {rewardType === 'double_win' && '2X Level Victory Coins'}
              {rewardType === 'extra_moves' && '+5 Extra Moves'}
              {rewardType === 'booster_hammer' && '+1 Mega Hammer 🔨'}
              {rewardType === 'booster_bomb' && '+1 Jalebi Bomb 💣'}
              {rewardType === 'level_up_3x' && '3X LEVEL UP REWARD (+3,000 🪙 & 💣)'}
              {rewardType === 'unlock_level' && 'INSTANT LEVEL UNLOCK! 🔓'}
            </span>
            <span className="text-[10px] text-amber-400/60">
              {isCompleted ? (lang === 'gu' ? 'ઇનામ ક્રેડિટ થઈ ગયું!' : 'Reward credited!') : (lang === 'gu' ? 'વિડીયો પૂરું થવા દો' : 'Finish watching to claim')}
            </span>
          </div>

          <button
            onClick={handleCloseClick}
            className={`px-5 py-2.5 rounded-xl font-cinzel font-black text-xs tracking-wider transition-all cursor-pointer ${
              isCompleted
                ? 'btn-gold-royal shadow-lg active:scale-95'
                : 'bg-white/10 border border-white/20 text-white/50 cursor-pointer'
            }`}
          >
            {isCompleted ? (lang === 'gu' ? 'સંગ્રહ કરો' : 'CLAIM & CLOSE') : `${timeLeft}s`}
          </button>
        </div>

        {/* Quit Confirmation Warning Modal */}
        {showQuitConfirm && (
          <div className="absolute inset-0 z-40 bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>

            <h4 className="font-cinzel text-lg font-black text-amber-200 mb-1">
              {lang === 'gu' ? 'જાહેરાત છોડવી છે?' : 'Quit Watching?'}
            </h4>
            <p className="text-xs text-amber-100/80 mb-5 max-w-[260px]">
              {lang === 'gu'
                ? 'જો તમે હમણાં જશો, તો તમને આ ઇનામ મળશે નહીં!'
                : 'If you leave before the countdown ends, you will lose your reward!'}
            </p>

            <div className="flex gap-2.5 w-full max-w-[280px]">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowQuitConfirm(false);
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 font-bold text-xs"
              >
                {lang === 'gu' ? 'છોડો' : 'Quit'}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowQuitConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl btn-gold-royal font-black text-xs"
              >
                {lang === 'gu' ? 'ચાલુ રાખો' : 'Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
