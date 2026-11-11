import React, { useState } from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Sparkles, Film, Trophy, RotateCw } from 'lucide-react';

interface DailyLuckySpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onRewardWon: (reward: { type: 'coins' | 'hammer' | 'bomb' | 'swap' | 'lives'; amount: number }) => void;
  onWatchAdForExtraSpin: () => void;
}

interface WheelSegment {
  id: number;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
  textColor: string;
  reward: { type: 'coins' | 'hammer' | 'bomb' | 'swap' | 'lives'; amount: number };
}

const SEGMENTS: WheelSegment[] = [
  { id: 0, label: '500', sublabel: 'Coins', icon: '🪙', color: '#B8860B', textColor: '#FFF8DC', reward: { type: 'coins', amount: 500 } },
  { id: 1, label: 'Mega', sublabel: 'Hammer', icon: '🔨', color: '#4A0E2E', textColor: '#FFD700', reward: { type: 'hammer', amount: 1 } },
  { id: 2, label: '1,000', sublabel: 'Coins', icon: '🪙', color: '#D4AF37', textColor: '#3A1E00', reward: { type: 'coins', amount: 1000 } },
  { id: 3, label: 'Jalebi', sublabel: 'Bomb', icon: '💣', color: '#350A22', textColor: '#FFD700', reward: { type: 'bomb', amount: 1 } },
  { id: 4, label: '250', sublabel: 'Coins', icon: '🪙', color: '#996515', textColor: '#FFF', reward: { type: 'coins', amount: 250 } },
  { id: 5, label: 'Free', sublabel: 'Swap', icon: '⇄', color: '#57143C', textColor: '#FFD700', reward: { type: 'swap', amount: 1 } },
  { id: 6, label: '+2', sublabel: 'Lives', icon: '❤️', color: '#C59B27', textColor: '#240000', reward: { type: 'lives', amount: 2 } },
  { id: 7, label: 'JACKPOT', sublabel: '2,500', icon: '🏆', color: '#FFD700', textColor: '#4A1D00', reward: { type: 'coins', amount: 2500 } },
];

export const DailyLuckySpinModal: React.FC<DailyLuckySpinModalProps> = ({
  isOpen,
  onClose,
  lang,
  onRewardWon,
  onWatchAdForExtraSpin,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wonPrize, setWonPrize] = useState<WheelSegment | null>(null);

  const [hasFreeSpin, setHasFreeSpin] = useState<boolean>(() => {
    const lastSpin = localStorage.getItem('laddu_crush_last_spin');
    if (!lastSpin) return true;
    const hoursSince = (Date.now() - parseInt(lastSpin, 10)) / (1000 * 60 * 60);
    return hoursSince >= 24;
  });

  const spinWheel = () => {
    if (isSpinning) return;

    sound.playClick();
    setIsSpinning(true);
    setWonPrize(null);

    // Pick winning segment with weighted probability
    const winningIndex = Math.floor(Math.random() * SEGMENTS.length);
    const degreesPerSegment = 360 / SEGMENTS.length;
    
    // Add 5 full rotations (1800 deg) + angle to land on target segment
    const extraSpins = 360 * 5;
    const targetDeg = extraSpins + (360 - (winningIndex * degreesPerSegment) - degreesPerSegment / 2);
    
    setRotation(prev => prev + targetDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = SEGMENTS[winningIndex];
      setWonPrize(prize);
      setHasFreeSpin(false);
      localStorage.setItem('laddu_crush_last_spin', Date.now().toString());

      sound.playWin();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4081', '#FFFFFF'],
      });

      onRewardWon(prize.reward);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-[380px] p-5 rounded-3xl bg-gradient-to-b from-[#3a0e28] via-[#240819] to-[#12030d] border-2 border-amber-400 shadow-[0_0_40px_rgba(255,215,0,0.5)] text-center overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => {
            if (!isSpinning) {
              sound.playClick();
              onClose();
            }
          }}
          disabled={isSpinning}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 border border-amber-400/50 flex items-center justify-center text-amber-300 hover:bg-black/70 cursor-pointer disabled:opacity-30 z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <RotateCw className="w-5 h-5 text-amber-300 animate-spin" />
          <h2 className="font-cinzel text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 drop-shadow">
            {lang === 'gu' ? 'દૈનિક લકી સ્પિન' : 'DAILY LUCKY SPIN'}
          </h2>
        </div>
        <p className="text-[11px] text-amber-200/80 mb-3">
          {lang === 'gu' ? 'ચક્ર ફેરવો અને રોયલ ઇનામ જીતો!' : 'Spin the royal wheel to win coins & boosters!'}
        </p>

        {/* The Wheel Container */}
        <div className="relative w-64 h-64 mx-auto my-2 flex items-center justify-center">
          {/* Top Indicator Arrow Needle */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-yellow-300" />
            <div className="w-2 h-2 rounded-full bg-red-600 mx-auto -mt-4 border border-white" />
          </div>

          {/* Rotating SVG Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-300 shadow-[0_0_25px_rgba(255,215,0,0.6)] relative overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {SEGMENTS.map((seg, idx) => {
                const angle = 360 / SEGMENTS.length;
                const startAngle = idx * angle;
                const endAngle = startAngle + angle;

                const x1 = 100 + 100 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 100 + 100 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 100 + 100 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 100 + 100 * Math.sin((Math.PI * endAngle) / 180);

                const textAngle = startAngle + angle / 2;
                const rad = (Math.PI * textAngle) / 180;
                const tx = 100 + 62 * Math.cos(rad);
                const ty = 100 + 62 * Math.sin(rad);

                return (
                  <g key={seg.id}>
                    {/* Pie Slice */}
                    <path
                      d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                      fill={seg.color}
                      stroke="#FFD700"
                      strokeWidth="1"
                    />
                    {/* Text Label */}
                    <g transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}>
                      <text
                        x={tx}
                        y={ty}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={seg.textColor}
                        fontSize="9"
                        fontWeight="900"
                        fontFamily="Outfit, sans-serif"
                      >
                        {seg.label}
                      </text>
                    </g>
                  </g>
                );
              })}
              {/* Outer Golden Studs */}
              <circle cx="100" cy="100" r="97" fill="none" stroke="#FFE885" strokeWidth="2" strokeDasharray="6 6" />
            </svg>

            {/* Center Gilded Hub */}
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-400 to-amber-600 border-2 border-white shadow-[0_0_15px_gold] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-950" />
            </div>
          </div>
        </div>

        {/* Won Prize Celebration Card */}
        {wonPrize && (
          <div className="my-2 p-2 rounded-xl bg-amber-400/20 border border-yellow-300 animate-bounce">
            <span className="text-xs font-black text-yellow-200">
              🎉 {lang === 'gu' ? 'તમે જીત્યા:' : 'YOU WON:'} {wonPrize.icon} {wonPrize.label} {wonPrize.sublabel}!
            </span>
          </div>
        )}

        {/* Spin Actions */}
        <div className="mt-3 flex flex-col gap-2">
          {hasFreeSpin ? (
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="w-full py-3 rounded-xl btn-gold-royal font-cinzel font-black text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_gold] disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? (lang === 'gu' ? 'ફરે છે...' : 'SPINNING...') : (lang === 'gu' ? 'મફત સ્પિન કરો!' : 'FREE SPIN!')}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onWatchAdForExtraSpin();
              }}
              disabled={isSpinning}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-amber-950 font-cinzel font-black text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_gold] hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Film className="w-4 h-4" />
              <span>{lang === 'gu' ? 'વિડીયો જોઈને વધુ ૧ સ્પિન મેળવો' : 'WATCH AD FOR EXTRA SPIN (ADMOB)'}</span>
            </button>
          )}

          <span className="text-[10px] text-amber-300/70">
            {hasFreeSpin ? '1 Free Daily Spin Available' : 'Free spin resets in 24 hours'}
          </span>
        </div>
      </div>
    </div>
  );
};
