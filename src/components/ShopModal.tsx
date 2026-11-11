import React from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { X, Sparkles, ShoppingBag } from 'lucide-react';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  lang: Language;
  onBuyBooster: (type: 'hammer' | 'swap' | 'bomb', cost: number) => void;
  onAddCoins: (amt: number) => void;
  onWatchAdForCoins?: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  coins,
  lang,
  onBuyBooster,
  onAddCoins,
  onWatchAdForCoins,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-[360px] max-h-[90vh] overflow-y-auto p-5 rounded-2xl bg-gradient-to-b from-[#3a0e28] via-[#240819] to-[#12030d] border-2 border-amber-400 shadow-[0_0_35px_rgba(255,215,0,0.5)] scrollbar-thin">
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
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-5 h-5 text-amber-300" />
          <h2 className="font-cinzel text-lg font-black text-amber-200 tracking-wider">
            {t.shop}
          </h2>
        </div>

        {/* Current Treasury balance */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-amber-400/40 mb-4">
          <span className="text-xs font-bold text-amber-300/80">
            {lang === 'gu' ? 'તમારું બેલેન્સ:' : 'Treasury Balance:'}
          </span>
          <span className="font-cinzel font-black text-amber-300 text-sm">
            {coins.toLocaleString()} 🪙
          </span>
        </div>

        {/* Boosters for Sale */}
        <div className="flex flex-col gap-2.5 mb-4">
          {/* Mega Hammer Pack */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#4d1338]/60 to-[#2e0921]/60 border border-amber-400/40">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🔨</span>
              <div>
                <p className="font-bold text-xs text-amber-200">{t.megaHammer} x3</p>
                <p className="text-[10px] text-amber-300/70">
                  {lang === 'gu' ? 'કોઈપણ મીઠાઈ તોડો' : 'Crush any single sweet'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playHammer();
                onBuyBooster('hammer', 1200);
                onBuyBooster('hammer', 0);
                onBuyBooster('hammer', 0);
              }}
              disabled={coins < 1200}
              className="py-1.5 px-3 rounded-lg btn-gold-royal text-[11px] font-black cursor-pointer disabled:opacity-40"
            >
              1,200 🪙
            </button>
          </div>

          {/* Cookie Swap Pack */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#4d1338]/60 to-[#2e0921]/60 border border-amber-400/40">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">⇄</span>
              <div>
                <p className="font-bold text-xs text-amber-200">{t.cookieSwap} x3</p>
                <p className="text-[10px] text-amber-300/70">
                  {lang === 'gu' ? 'મફત અદલાબદલી કરો' : 'Free swap any 2 sweets'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onBuyBooster('swap', 1000);
                onBuyBooster('swap', 0);
                onBuyBooster('swap', 0);
              }}
              disabled={coins < 1000}
              className="py-1.5 px-3 rounded-lg btn-gold-royal text-[11px] font-black cursor-pointer disabled:opacity-40"
            >
              1,000 🪙
            </button>
          </div>

          {/* Jalebi Bomb Pack */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#4d1338]/60 to-[#2e0921]/60 border border-amber-400/40">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">💣</span>
              <div>
                <p className="font-bold text-xs text-amber-200">{t.jalebiBomb} x3</p>
                <p className="text-[10px] text-amber-300/70">
                  {lang === 'gu' ? '૩×૩ મોટો ધમાકો' : 'Massive 3x3 explosion'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playExplosion();
                onBuyBooster('bomb', 1500);
                onBuyBooster('bomb', 0);
                onBuyBooster('bomb', 0);
              }}
              disabled={coins < 1500}
              className="py-1.5 px-3 rounded-lg btn-gold-royal text-[11px] font-black cursor-pointer disabled:opacity-40"
            >
              1,500 🪙
            </button>
          </div>
        </div>

        {/* Rewarded Video Ad Free Coins */}
        {onWatchAdForCoins && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border border-amber-400 mb-3 shadow-[0_0_12px_rgba(255,215,0,0.2)]">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">📺</span>
              <div>
                <p className="font-bold text-xs text-yellow-200">
                  {lang === 'gu' ? 'વિડીયો જાહેરાત જોઈને કમાઓ' : 'Watch Video (+500 🪙)'}
                </p>
                <p className="text-[10px] text-amber-300/80">
                  {lang === 'gu' ? 'મફતમાં ૫૦૦ સિક્કા મેળવો' : 'Earn 500 Royal Coins free'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onWatchAdForCoins();
              }}
              className="py-1.5 px-3 rounded-lg btn-gold-royal text-[11px] font-black cursor-pointer shadow active:scale-95"
            >
              {lang === 'gu' ? 'જુઓ' : 'FREE'}
            </button>
          </div>
        )}

        {/* Free Palace Coin Chest */}
        <div className="p-3 rounded-xl bg-amber-400/15 border border-amber-400/60 text-center">
          <p className="font-cinzel text-xs font-bold text-amber-200 mb-1">
            ✨ {lang === 'gu' ? 'રોયલ તિજોરી રિફિલ' : 'Royal Treasury Refill'} ✨
          </p>
          <p className="text-[10px] text-amber-300/80 mb-2">
            {lang === 'gu' ? 'મફતમાં ૨,૦૦૦ સિક્કા મેળવો' : 'Collect +2,000 Bonus Coins'}
          </p>
          <button
            onClick={() => {
              sound.playWin();
              onAddCoins(2000);
            }}
            className="w-full py-2 rounded-lg btn-gold-royal text-xs font-black tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-950" />
            <span>{lang === 'gu' ? '+૨,૦૦૦ સિક્કા મેળવો' : 'Collect +2,000 Coins'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
