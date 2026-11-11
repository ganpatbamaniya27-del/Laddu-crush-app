import React from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { ArrowLeft, Crown, Check, Lock, Sparkles } from 'lucide-react';
import { LEVELS } from '../data/levelsData';

interface ScreenLevelsMapProps {
  currentLevel: number;
  highestUnlockedLevel: number;
  levelStars: Record<number, number>;
  lang: Language;
  onBack: () => void;
  onSelectLevel: (lvl: number) => void;
  onWatchAdUnlockLevel?: () => void;
}

export const ScreenLevelsMap: React.FC<ScreenLevelsMapProps> = ({
  currentLevel,
  highestUnlockedLevel,
  levelStars,
  lang,
  onBack,
  onSelectLevel,
  onWatchAdUnlockLevel,
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedStage, setSelectedStage] = React.useState<1 | 2 | 3>(
    currentLevel <= 10 ? 1 : currentLevel <= 20 ? 2 : 3
  );

  const stageLevels = LEVELS.filter(l => l.stage === selectedStage);
  const totalLevels = LEVELS.length;
  const progressPercent = Math.round((highestUnlockedLevel / totalLevels) * 100);

  const stageName =
    selectedStage === 1 ? t.stage1Name : selectedStage === 2 ? t.stage2Name : t.stage3Name;

  // Pre-calculated horizontal offsets for the S-curve winding path
  // Alternates left and right to form a flowing royal serpentine path
  const getCurveOffset = (indexInStage: number) => {
    const pattern = [50, 75, 82, 60, 32, 18, 28, 55, 78, 50];
    return pattern[indexInStage % pattern.length];
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 select-none overflow-hidden bg-gradient-to-b from-[#2b0a21] via-[#1a0515] to-[#0c0310]">
      {/* Background Royal Damask / Filigree watermark */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,_#FFD700_0%,_transparent_65%)]" />

      {/* Top Header: Back, Stage Title (Screen 3 Header) */}
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

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black tracking-widest uppercase">
            <span className="text-sm">💎</span>
            <span>{t.levelsMap}</span>
          </div>
          <span className="font-cinzel text-xs font-bold text-amber-200 tracking-wider">
            {stageName}
          </span>
        </div>

        <div className="w-9 h-9 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="relative z-10 grid grid-cols-3 gap-1.5 my-2">
        {[1, 2, 3].map(stg => (
          <button
            key={stg}
            onClick={() => {
              sound.playClick();
              setSelectedStage(stg as 1 | 2 | 3);
            }}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              selectedStage === stg
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black shadow-[0_0_10px_gold]'
                : 'bg-black/40 border border-amber-400/40 text-amber-300/80 hover:text-amber-100'
            }`}
          >
            {t.stage} {stg} ({stg === 1 ? '1-10' : stg === 2 ? '11-20' : '21-30'})
          </button>
        ))}
      </div>

      {/* Winding Golden Map Canvas / Container */}
      <div className="relative z-10 flex-1 w-full my-1 overflow-y-auto px-2 py-4 scrollbar-thin">
        {/* Serpentine decorative SVG path connecting nodes */}
        <div className="relative min-h-[580px] w-full">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="50%" stopColor="#FFB300" />
                <stop offset="100%" stopColor="#8A4A00" />
              </linearGradient>
              <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FFD700" floodOpacity="0.7"/>
              </filter>
            </defs>
            {/* Draw curve through the 10 nodes */}
            {stageLevels.map((lvl, idx) => {
              if (idx === stageLevels.length - 1) return null;
              const y1 = idx * 56 + 32;
              const y2 = (idx + 1) * 56 + 32;
              const x1 = getCurveOffset(idx);
              const x2 = getCurveOffset(idx + 1);

              return (
                <g key={lvl.id}>
                  {/* Glowing wide backing ribbon */}
                  <line
                    x1={`${x1}%`}
                    y1={y1}
                    x2={`${x2}%`}
                    y2={y2}
                    stroke="url(#goldPathGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter="url(#pathGlow)"
                    opacity="0.85"
                  />
                  {/* Inner golden dotted ribbon */}
                  <line
                    x1={`${x1}%`}
                    y1={y1}
                    x2={`${x2}%`}
                    y2={y2}
                    stroke="#FFFDF0"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>

          {/* Level Nodes */}
          {stageLevels.map((level, idx) => {
            const isCompleted = level.id < highestUnlockedLevel;
            const isCurrent = level.id === currentLevel;
            const isUnlocked = level.id <= highestUnlockedLevel;
            const stars = levelStars[level.id] || 0;
            const posX = getCurveOffset(idx);
            const posY = idx * 56;

            return (
              <div
                key={level.id}
                style={{
                  left: `${posX}%`,
                  top: `${posY}px`,
                  transform: 'translate(-50%, 0)',
                }}
                className="absolute z-20 flex flex-col items-center"
              >
                {/* Node Button */}
                <button
                  disabled={!isUnlocked}
                  onClick={() => {
                    sound.playClick();
                    onSelectLevel(level.id);
                  }}
                  className={`relative flex items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-600 border-2 border-white shadow-[0_0_25px_gold] animate-pulse-subtle z-30'
                      : isCompleted
                      ? 'w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-2 border-yellow-200 shadow-[0_0_12px_rgba(255,215,0,0.5)] hover:scale-105 active:scale-95'
                      : 'w-11 h-11 rounded-xl bg-neutral-800/90 border border-neutral-600 text-neutral-400 cursor-not-allowed opacity-75'
                  }`}
                >
                  {isCurrent ? (
                    <div className="flex flex-col items-center">
                      <Crown className="w-5 h-5 text-amber-950 fill-yellow-200 -mt-1 drop-shadow" />
                      <span className="font-cinzel font-black text-sm text-amber-950 leading-none">
                        {level.id}
                      </span>
                      <span className="text-[9px] font-black tracking-widest text-red-950 uppercase">
                        {t.now}
                      </span>
                    </div>
                  ) : isCompleted ? (
                    <div className="flex flex-col items-center justify-center">
                      <Check className="w-5 h-5 text-amber-950 stroke-[3]" />
                      <span className="text-[10px] font-black text-amber-950">
                        {level.id}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                      <Lock className="w-4 h-4 mb-0.5" />
                      <span className="text-[9px] font-bold">{level.id}</span>
                    </div>
                  )}

                  {/* Stars for completed levels */}
                  {isCompleted && stars > 0 && (
                    <div className="absolute -bottom-2 flex gap-0.5 px-1 py-0.2 rounded-full bg-black/80 border border-amber-400/60">
                      {Array.from({ length: 3 }).map((_, sIdx) => (
                        <span
                          key={sIdx}
                          className={`text-[9px] ${sIdx < stars ? 'text-yellow-400' : 'text-slate-600'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Unlock via Ad Offer & Progress Bar (Screen 3 Bottom Strip) */}
      <div className="relative z-10 w-full pt-1 flex flex-col gap-1.5">
        {onWatchAdUnlockLevel && highestUnlockedLevel < totalLevels && (
          <button
            onClick={() => {
              sound.playClick();
              onWatchAdUnlockLevel();
            }}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/25 via-yellow-400/30 to-amber-500/25 border border-amber-300 text-yellow-300 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(255,215,0,0.3)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-sm">📺</span>
            <span>{t.unlockNextLevelAd} (Lvl {highestUnlockedLevel + 1})</span>
          </button>
        )}

        <div className="px-4 py-2.5 rounded-xl bg-black/60 border border-amber-400/60 shadow-inner flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-200">
            <span className="tracking-wider">{t.progress}</span>
            <span className="font-cinzel text-amber-300">
              {highestUnlockedLevel}/{totalLevels} · {progressPercent}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-black/80 border border-amber-400/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-200 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
