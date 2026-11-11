import React from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { X, Heart, Film, Sparkles, Clock } from 'lucide-react';
import { MAX_LIVES, LivesState } from '../utils/livesSystem';

interface LivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  livesState: LivesState;
  coins: number;
  onWatchAdForLife: () => void;
  onBuyFullLives: (cost: number) => void;
}

export const LivesModal: React.FC<LivesModalProps> = ({
  isOpen,
  onClose,
  lang,
  livesState,
  coins,
  onWatchAdForLife,
  onBuyFullLives,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];
  const isFull = livesState.lives >= MAX_LIVES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-[360px] p-6 rounded-3xl bg-gradient-to-b from-[#3d0f2b] via-[#240819] to-[#12030d] border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] text-center overflow-hidden">
        
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

        {/* Heart Icon & Title */}
        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse">
          <Heart className="w-9 h-9 text-red-500 fill-red-500 drop-shadow" />
        </div>

        <h2 className="font-cinzel text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-red-400 to-amber-300 drop-shadow mb-1">
          {lang === 'gu' ? 'રોયલ લાઈવ્સ' : 'ROYAL LIVES'}
        </h2>

        {/* Hearts Visual */}
        <div className="flex justify-center gap-2 my-3">
          {Array.from({ length: MAX_LIVES }).map((_, idx) => (
            <span
              key={idx}
              className={`text-2xl transition-all ${
                idx < livesState.lives
                  ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] scale-110'
                  : 'text-neutral-700 opacity-40'
              }`}
            >
              ❤️
            </span>
          ))}
        </div>

        {/* Status / Countdown */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-red-500/30 mb-4 text-xs">
          {isFull ? (
            <span className="font-bold text-emerald-400">
              {lang === 'gu' ? 'તમામ લાઈવ્સ ભરેલી છે (૫/૫)' : 'Your Lives are FULL (5/5)'}
            </span>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-amber-200 font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'gu' ? 'આગામી લાઈફ:' : 'Next life in:'}</span>
              <span className="font-mono font-black text-yellow-300 text-sm">
                {livesState.formattedCountdown}
              </span>
            </div>
          )}
        </div>

        {/* Refill Options */}
        {!isFull && (
          <div className="flex flex-col gap-2.5">
            {/* Rewarded Video Ad Refill (+1 Life Free) */}
            <button
              onClick={() => {
                sound.playClick();
                onWatchAdForLife();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-amber-950 font-cinzel font-black text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_gold] hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Film className="w-4 h-4 text-amber-950" />
              <span>{lang === 'gu' ? 'જાહેરાત જોઈને +૧ લાઈફ મેળવો' : 'WATCH AD FOR +1 LIFE (ADMOB)'}</span>
            </button>

            {/* Spend Coins Refill (Full 5/5 Lives for 500 Coins) */}
            <button
              onClick={() => {
                if (coins >= 500) {
                  sound.playWin();
                  onBuyFullLives(500);
                }
              }}
              disabled={coins < 500}
              className="w-full py-2.5 px-4 rounded-xl btn-maroon-royal font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{lang === 'gu' ? '૫૦૦ સિક્કામાં ફુલ લાઈવ્સ (૫/૫)' : 'Refill Full Lives (500 🪙)'}</span>
            </button>
          </div>
        )}

        {isFull && (
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-xl btn-gold-royal font-cinzel font-black text-xs tracking-wider"
          >
            {lang === 'gu' ? 'રમો' : 'PLAY NOW'}
          </button>
        )}
      </div>
    </div>
  );
};
