import React from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { X, Crown, Sparkles, Check, Flame } from 'lucide-react';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const VipModal: React.FC<VipModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-[360px] p-5 rounded-2xl bg-gradient-to-b from-[#3a0e28] via-[#240819] to-[#12030d] border-2 border-amber-400 shadow-[0_0_35px_rgba(255,215,0,0.5)] text-center">
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
        <div className="flex flex-col items-center justify-center mb-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center mb-2 shadow-[0_0_15px_gold]">
            <Crown className="w-8 h-8 text-amber-950 fill-amber-950" />
          </div>
          <h2 className="font-cinzel text-xl font-black text-amber-200 tracking-wider">
            {t.vipClub}
          </h2>
          <span className="text-xs px-2.5 py-0.5 mt-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-400/60">
            {t.active.toUpperCase()} · ROYAL TIER
          </span>
        </div>

        {/* Perks list */}
        <div className="flex flex-col gap-2 mb-5 text-left">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-amber-400/30">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-amber-100">
              {lang === 'gu' ? '+૫૦% વધારે સિક્કા દરેક જીત પર' : '+50% Extra Coins on every victory'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-amber-400/30">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-amber-100">
              {lang === 'gu' ? 'દૈનિક મફત રોયલ બોમ્બ અને હથોડી' : 'Daily Free Hammer & Jalebi Bomb refill'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-amber-400/30">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-amber-100">
              {lang === 'gu' ? 'ગોલ્ડ લીડરબોર્ડમાં વિશેષ તાજ અને બેજ' : 'Exclusive Gold Crown on Leaderboard'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-amber-400/30">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-amber-100">
              {lang === 'gu' ? 'અમર્યાદિત એનર્જી - ગમે ત્યારે રમો' : 'Unlimited Lives & Instant Play anytime'}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3 rounded-xl btn-gold-royal font-cinzel font-black text-sm tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <Sparkles className="w-4 h-4 text-amber-950" />
          <span>{lang === 'gu' ? 'સમજાયું' : 'CONTINUE PLAYING'}</span>
        </button>
      </div>
    </div>
  );
};
