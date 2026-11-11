import React, { useState, useEffect, useRef } from 'react';
import { SweetIcon, SweetType } from './SweetIcon';
import {
  BOARD_SIZE,
  Board,
  createInitialBoard,
  findMatches,
  applyGravity,
  getBombExplosionCoords,
  getRainbowClearCoords,
  getUniqueCellId,
} from '../utils/gameLogic';
import { TRANSLATIONS, Language } from '../utils/translations';
import { sound } from '../utils/audio';
import { ArrowLeft, Sparkles, Trophy, RotateCcw } from 'lucide-react';

interface ScreenGameplayProps {
  levelNumber: number;
  targetScore: number;
  initialMoves: number;
  coins: number;
  lang: Language;
  onBack: () => void;
  onWinLevel: (score: number, stars: number) => void;
  onUpdateCoins: (newCoins: number) => void;
  hammerCount: number;
  swapCount: number;
  bombCount: number;
  onUseBooster: (booster: 'hammer' | 'swap' | 'bomb') => void;
  onRequestWatchAd: (type: 'extra_moves' | 'double_win') => void;
  extraMovesGrantedCount: number;
}

type ActiveBooster = 'hammer' | 'swap' | 'bomb' | null;

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export const ScreenGameplay: React.FC<ScreenGameplayProps> = ({
  levelNumber,
  targetScore,
  initialMoves,
  coins,
  lang,
  onBack,
  onWinLevel,
  hammerCount,
  swapCount,
  bombCount,
  onUseBooster,
  onRequestWatchAd,
  extraMovesGrantedCount,
  onUpdateCoins,
}) => {
  const t = TRANSLATIONS[lang];

  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [score, setScore] = useState<number>(0);
  const [movesLeft, setMovesLeft] = useState<number>(initialMoves);
  const [scoreDelta, setScoreDelta] = useState<number | null>(null);
  const [comboBanner, setComboBanner] = useState<string | null>(null);
  
  // Selection & drag state
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [freeSwapCell, setFreeSwapCell] = useState<{ row: number; col: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeBooster, setActiveBooster] = useState<ActiveBooster>(null);

  // Touch drag coordinates
  const touchStartRef = useRef<{ row: number; col: number; x: number; y: number } | null>(null);

  // Sparkle / Pop Particles
  const [particles, setParticles] = useState<Particle[]>([]);

  // Victory / Game over local modals
  const [gameEnded, setGameEnded] = useState<'win' | 'lose' | null>(null);

  // Initialize or reset game on level change
  useEffect(() => {
    setBoard(createInitialBoard());
    setScore(0);
    setMovesLeft(initialMoves);
    setSelectedCell(null);
    setFreeSwapCell(null);
    setGameEnded(null);
    setIsProcessing(false);
    setActiveBooster(null);
  }, [levelNumber, initialMoves]);

  // Handle Rewarded Ad Extra Moves Grant
  useEffect(() => {
    if (extraMovesGrantedCount > 0) {
      setMovesLeft(m => m + 5);
      setGameEnded(null);
      sound.playWin();
    }
  }, [extraMovesGrantedCount]);

  // Particle system loop
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.3,
            alpha: p.alpha - 0.05,
          }))
          .filter(p => p.alpha > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [particles.length]);

  const triggerSparklesAt = (row: number, col: number, count: number = 6) => {
    const newParticles: Particle[] = [];
    const colors = ['#FFD700', '#FFE57F', '#FFA500', '#FFFFFF', '#FF80AB'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      newParticles.push({
        id: Date.now() + Math.random() * 10000,
        x: (col + 0.5) * (100 / BOARD_SIZE),
        y: (row + 0.5) * (100 / BOARD_SIZE),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      });
    }
    setParticles(prev => [...prev.slice(-30), ...newParticles]);
  };

  /**
   * Process match-3 cascades after any swap or sweet destruction
   */
  const processBoardMatches = async (currentBoard: Board, comboCount = 1) => {
    setIsProcessing(true);

    const result = findMatches(currentBoard);

    if (result.matchedCells.length > 0) {
      // Audio feedback
      sound.playPop(comboCount);
      if (comboCount > 1) {
        sound.playCombo(comboCount);
        const comboCoinBonus = comboCount >= 4 ? 300 : comboCount === 3 ? 150 : 50;
        onUpdateCoins(coins + comboCoinBonus);

        const banners = [
          `${t.delicious} (+50 🪙)`,
          `${t.fantastic} (+150 🪙)`,
          `${t.sweetDhamaka} (+300 🪙)`,
          `${t.royalCombo} (+500 🪙)`,
        ];
        setComboBanner(banners[Math.min(comboCount - 2, banners.length - 1)]);
        setTimeout(() => setComboBanner(null), 1200);
      }

      // Calculate score
      const basePoints = result.matchedCells.length * 100 * comboCount;
      const bonusPoints = result.specialSpawn ? 500 : 0;
      const totalPoints = basePoints + bonusPoints;

      setScore(prev => prev + totalPoints);
      setScoreDelta(totalPoints);
      setTimeout(() => setScoreDelta(null), 1000);

      // Trigger sparkle particles on matches
      result.matchedCells.forEach(cell => triggerSparklesAt(cell.row, cell.col, 4));

      // Mark matched cells as popping
      const poppingBoard = currentBoard.map((row, r) =>
        row.map((cell, c) => {
          const isMatched = result.matchedCells.some(m => m.row === r && m.col === c);
          return isMatched ? { ...cell, isPopping: true } : cell;
        })
      );

      // If a 4 or 5 match happened, keep one cell to become the special bomb or maha laddu
      if (result.specialSpawn) {
        const { row, col, type } = result.specialSpawn;
        poppingBoard[row][col] = {
          id: getUniqueCellId(),
          row,
          col,
          type,
          isPopping: false,
          isSpecial: true,
        };
      }

      setBoard(poppingBoard);

      // Wait for pop animation to finish, then apply gravity
      await new Promise(res => setTimeout(res, 300));
      const refilledBoard = applyGravity(poppingBoard);
      setBoard(refilledBoard);

      // Wait a moment for drop settle, then cascade check
      await new Promise(res => setTimeout(res, 220));
      await processBoardMatches(refilledBoard, comboCount + 1);
    } else {
      setIsProcessing(false);

      // Check win/lose conditions after cascading completes
      setScore(latestScore => {
        setMovesLeft(latestMoves => {
          if (latestScore >= targetScore && !gameEnded) {
            setGameEnded('win');
            sound.playWin();
          } else if (latestMoves <= 0 && latestScore < targetScore && !gameEnded) {
            setGameEnded('lose');
            sound.playGameOver();
          }
          return latestMoves;
        });
        return latestScore;
      });
    }
  };

  /**
   * Handle swap between two adjacent board cells
   */
  const handleSwap = async (r1: number, c1: number, r2: number, c2: number) => {
    if (isProcessing || gameEnded) return;

    sound.playClick();
    setIsProcessing(true);

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cellA = newBoard[r1][c1];
    const cellB = newBoard[r2][c2];

    // Check special bomb or maha laddu interactions first!
    if (cellA.type === 'maha_laddu' || cellB.type === 'maha_laddu') {
      sound.playExplosion();
      const targetType = cellA.type === 'maha_laddu' ? cellB.type : cellA.type;
      const clearCoords = getRainbowClearCoords(newBoard, targetType);

      clearCoords.forEach(coord => {
        newBoard[coord.row][coord.col].isPopping = true;
        triggerSparklesAt(coord.row, coord.col, 8);
      });

      setMovesLeft(m => Math.max(0, m - 1));
      setScore(s => s + clearCoords.length * 150);
      setBoard(newBoard);

      await new Promise(res => setTimeout(res, 300));
      const refilled = applyGravity(newBoard);
      setBoard(refilled);
      await new Promise(res => setTimeout(res, 200));
      await processBoardMatches(refilled, 1);
      return;
    }

    if (cellA.type === 'bomb_special' || cellB.type === 'bomb_special') {
      sound.playExplosion();
      const bombRow = cellA.type === 'bomb_special' ? r1 : r2;
      const bombCol = cellA.type === 'bomb_special' ? c1 : c2;
      const bombCoords = getBombExplosionCoords(bombRow, bombCol);

      bombCoords.forEach(coord => {
        newBoard[coord.row][coord.col].isPopping = true;
        triggerSparklesAt(coord.row, coord.col, 6);
      });

      setMovesLeft(m => Math.max(0, m - 1));
      setScore(s => s + bombCoords.length * 120);
      setBoard(newBoard);

      await new Promise(res => setTimeout(res, 300));
      const refilled = applyGravity(newBoard);
      setBoard(refilled);
      await new Promise(res => setTimeout(res, 200));
      await processBoardMatches(refilled, 1);
      return;
    }

    // Normal swap
    newBoard[r1][c1] = { ...cellB, row: r1, col: c1 };
    newBoard[r2][c2] = { ...cellA, row: r2, col: c2 };

    const matches = findMatches(newBoard);

    if (matches.matchedCells.length > 0) {
      // Valid swap!
      setBoard(newBoard);
      setMovesLeft(m => Math.max(0, m - 1));
      await new Promise(res => setTimeout(res, 150));
      await processBoardMatches(newBoard, 1);
    } else {
      // Invalid swap - animate revert
      setBoard(newBoard);
      await new Promise(res => setTimeout(res, 180));
      // Revert back
      const revertedBoard = newBoard.map(row => row.map(cell => ({ ...cell })));
      revertedBoard[r1][c1] = { ...cellA, row: r1, col: c1 };
      revertedBoard[r2][c2] = { ...cellB, row: r2, col: c2 };
      setBoard(revertedBoard);
      setIsProcessing(false);
    }
  };

  /**
   * Tap Cell Handler (Supports normal swap selection and active booster execution)
   */
  const handleCellClick = (r: number, c: number) => {
    if (isProcessing || gameEnded) return;

    // Handle Active Booster: Mega Hammer
    if (activeBooster === 'hammer') {
      sound.playHammer();
      triggerSparklesAt(r, c, 12);
      const newBoard = board.map(row => row.map(cell => ({ ...cell })));
      newBoard[r][c].isPopping = true;
      setBoard(newBoard);
      onUseBooster('hammer');
      setActiveBooster(null);

      setTimeout(() => {
        const refilled = applyGravity(newBoard);
        setBoard(refilled);
        processBoardMatches(refilled, 1);
      }, 250);
      return;
    }

    // Handle Active Booster: Jalebi Bomb
    if (activeBooster === 'bomb') {
      sound.playExplosion();
      const coords = getBombExplosionCoords(r, c);
      const newBoard = board.map(row => row.map(cell => ({ ...cell })));
      coords.forEach(coord => {
        newBoard[coord.row][coord.col].isPopping = true;
        triggerSparklesAt(coord.row, coord.col, 6);
      });
      setBoard(newBoard);
      onUseBooster('bomb');
      setActiveBooster(null);

      setTimeout(() => {
        const refilled = applyGravity(newBoard);
        setBoard(refilled);
        processBoardMatches(refilled, 1);
      }, 300);
      return;
    }

    // Handle Active Booster: Free Swap (Can swap any 2 tiles without spending moves)
    if (activeBooster === 'swap') {
      if (!freeSwapCell) {
        sound.playClick();
        setFreeSwapCell({ row: r, col: c });
      } else {
        sound.playClick();
        const r1 = freeSwapCell.row;
        const c1 = freeSwapCell.col;
        const newBoard = board.map(row => row.map(cell => ({ ...cell })));
        const temp = newBoard[r1][c1];
        newBoard[r1][c1] = { ...newBoard[r][c], row: r1, col: c1 };
        newBoard[r][c] = { ...temp, row: r, col: c };
        setBoard(newBoard);
        onUseBooster('swap');
        setActiveBooster(null);
        setFreeSwapCell(null);
        processBoardMatches(newBoard, 1);
      }
      return;
    }

    // Standard Match-3 Tap Selection
    if (!selectedCell) {
      sound.playClick();
      setSelectedCell({ row: r, col: c });
    } else {
      const dr = Math.abs(selectedCell.row - r);
      const dc = Math.abs(selectedCell.col - c);

      if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
        // Adjacent cell clicked -> Execute swap!
        const r1 = selectedCell.row;
        const c1 = selectedCell.col;
        setSelectedCell(null);
        handleSwap(r1, c1, r, c);
      } else {
        // Clicked non-adjacent or re-clicked -> update selection
        sound.playClick();
        setSelectedCell({ row: r, col: c });
      }
    }
  };

  /**
   * Touch / Drag Start
   */
  const handleTouchStart = (r: number, c: number, clientX: number, clientY: number) => {
    if (isProcessing || gameEnded || activeBooster) return;
    touchStartRef.current = { row: r, col: c, x: clientX, y: clientY };
  };

  /**
   * Touch / Drag End: calculate gesture direction (swipe)
   */
  const handleTouchEnd = (clientX: number, clientY: number) => {
    if (!touchStartRef.current || isProcessing || gameEnded) return;
    const { row, col, x, y } = touchStartRef.current;
    touchStartRef.current = null;

    const dx = clientX - x;
    const dy = clientY - y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const minSwipeDist = 20;

    if (absX > minSwipeDist || absY > minSwipeDist) {
      let targetRow = row;
      let targetCol = col;

      if (absX > absY) {
        // Horizontal swipe
        targetCol = dx > 0 ? col + 1 : col - 1;
      } else {
        // Vertical swipe
        targetRow = dy > 0 ? row + 1 : row - 1;
      }

      if (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE) {
        setSelectedCell(null);
        handleSwap(row, col, targetRow, targetCol);
      }
    }
  };

  const progressPercent = Math.min(100, Math.round((score / targetScore) * 100));

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 select-none overflow-hidden bg-gradient-to-b from-[#350d24] via-[#1d0617] to-[#0c0312]">
      {/* Background radial gold aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(255,215,0,0.12)_0%,_transparent_70%)] pointer-events-none" />

      {/* Particle Canvas / Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.alpha,
              boxShadow: `0 0 8px ${p.color}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Top Header: Back, Level Badge & Coins (Screen 2 Header) */}
      <div className="relative z-10 flex items-center justify-between pb-1">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="w-10 h-10 rounded-full bg-black/50 border border-amber-400/60 flex items-center justify-center text-amber-300 hover:bg-black/70 active:scale-95 transition-all cursor-pointer shadow-md"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Level indicator */}
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-950/90 via-amber-900/90 to-amber-950/90 border border-amber-400 shadow-[0_0_12px_rgba(255,215,0,0.3)]">
          <Trophy className="w-4 h-4 text-amber-300" />
          <span className="font-cinzel text-sm font-black tracking-wider text-amber-200">
            {t.level.toUpperCase()} {levelNumber}
          </span>
        </div>

        {/* Coins status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-amber-400/60 text-amber-300 text-xs font-black shadow-md">
          <span className="text-sm">🪙</span>
          <span>{(coins / 1000).toFixed(1)}K</span>
        </div>
      </div>

      {/* Royal Score Plaque & Multiplier Banner */}
      <div className="relative z-10 w-full mt-1">
        {/* Combo announcement banner */}
        {comboBanner && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-40 px-5 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-amber-950 font-black text-sm tracking-widest shadow-[0_0_20px_gold] animate-bounce">
            ✨ {comboBanner} ✨
          </div>
        )}

        <div className="relative px-4 py-2 rounded-2xl bg-gradient-to-r from-[#2a0b1f] via-[#471235] to-[#2a0b1f] border border-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            {/* Score & Points increment */}
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs font-bold tracking-widest text-amber-300">
                {t.score}:
              </span>
              <span className="font-cinzel text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-amber-300 to-yellow-500 drop-shadow">
                {score.toLocaleString()}
              </span>
              {scoreDelta && (
                <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/50 animate-bounce">
                  +{scoreDelta}
                </span>
              )}
            </div>

            {/* Target and Moves */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-amber-300/80 font-semibold">{t.moves}:</span>
                <span className={`font-black text-sm px-2 py-0.5 rounded-md ${movesLeft <= 5 ? 'bg-red-900/90 text-red-300 animate-pulse border border-red-500' : 'bg-black/40 text-amber-300 border border-amber-400/40'}`}>
                  {movesLeft}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar towards target */}
          <div className="w-full mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-black/60 border border-amber-400/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-200 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-amber-300/90 whitespace-nowrap">
              {score}/{targetScore}
            </span>
          </div>
        </div>
      </div>

      {/* Booster in-use alert indicator */}
      {activeBooster && (
        <div className="relative z-20 my-1 py-1 px-3 rounded-lg bg-amber-400/20 border border-amber-400 text-amber-200 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
            <span>
              {activeBooster === 'hammer' && (lang === 'gu' ? 'કોઈપણ મીઠાઈ પર ટૅપ કરીને ક્રશ કરો!' : 'Tap any sweet to crush it with the Hammer!')}
              {activeBooster === 'swap' && (lang === 'gu' ? 'અદલાબદલી કરવા માટે કોઈપણ ૨ મીઠાઈ પસંદ કરો' : 'Tap any 2 sweets to freely swap them!')}
              {activeBooster === 'bomb' && (lang === 'gu' ? '૩×૩ ધમાકા માટે મીઠાઈ પસંદ કરો!' : 'Tap anywhere to drop a 3x3 sweet bomb!')}
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveBooster(null);
              setFreeSwapCell(null);
            }}
            className="text-[10px] underline text-amber-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main 6x6 Match-3 Board (Matching Screen 2 Grid) */}
      <div className="relative z-10 w-full aspect-square max-w-[380px] mx-auto my-auto p-2 rounded-2xl bg-gradient-to-b from-[#240a1c] to-[#12030d] border-2 border-amber-400 shadow-[0_0_30px_rgba(255,215,0,0.45)]">
        {/* Subtle royal background pattern */}
        <div className="w-full h-full grid grid-cols-6 gap-1.5 p-1 rounded-xl bg-black/40 border border-amber-400/30">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selectedCell?.row === r && selectedCell?.col === c;
              const isFreeSwapSelected = freeSwapCell?.row === r && freeSwapCell?.col === c;

              return (
                <div
                  key={cell.id}
                  onClick={() => handleCellClick(r, c)}
                  onTouchStart={e => {
                    const touch = e.touches[0];
                    handleTouchStart(r, c, touch.clientX, touch.clientY);
                  }}
                  onTouchEnd={e => {
                    const touch = e.changedTouches[0];
                    handleTouchEnd(touch.clientX, touch.clientY);
                  }}
                  onMouseDown={e => handleTouchStart(r, c, e.clientX, e.clientY)}
                  onMouseUp={e => handleTouchEnd(e.clientX, e.clientY)}
                  className={`relative aspect-square rounded-xl flex items-center justify-center p-1 transition-all duration-150 cursor-pointer select-none touch-none
                    ${cell.isPopping ? 'sweet-pop-active' : ''}
                    ${isSelected || isFreeSwapSelected ? 'outline-3 outline-amber-300 scale-110 z-20 shadow-[0_0_18px_gold] bg-amber-400/30' : 'bg-[#fff5d6]/95 hover:bg-[#fff9e6] active:scale-95 shadow-md'}
                  `}
                >
                  <SweetIcon type={cell.type} isSpecial={cell.isSpecial} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Booster Row (Hammer, Swap, Bomb - Screen 2 Boosters) */}
      <div className="relative z-10 w-full pt-2">
        <div className="grid grid-cols-3 gap-3">
          {/* 1. MEGA HAMMER */}
          <button
            onClick={() => {
              if (hammerCount > 0 && !isProcessing) {
                sound.playClick();
                setActiveBooster(activeBooster === 'hammer' ? null : 'hammer');
                setSelectedCell(null);
              }
            }}
            className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border transition-all cursor-pointer shadow-md ${
              activeBooster === 'hammer'
                ? 'bg-amber-400 border-yellow-200 text-amber-950 scale-105 shadow-[0_0_15px_gold]'
                : 'bg-gradient-to-b from-[#4d1637] to-[#250819] border-amber-400/70 text-amber-200 hover:border-amber-300 active:scale-95'
            }`}
          >
            <span className="text-2xl mb-0.5">🔨</span>
            <span className="text-xs font-black tracking-wider uppercase">
              {t.hammer}
            </span>
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] border border-amber-200 shadow">
              x{hammerCount}
            </span>
          </button>

          {/* 2. FREE SWAP */}
          <button
            onClick={() => {
              if (swapCount > 0 && !isProcessing) {
                sound.playClick();
                setActiveBooster(activeBooster === 'swap' ? null : 'swap');
                setSelectedCell(null);
                setFreeSwapCell(null);
              }
            }}
            className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border transition-all cursor-pointer shadow-md ${
              activeBooster === 'swap'
                ? 'bg-amber-400 border-yellow-200 text-amber-950 scale-105 shadow-[0_0_15px_gold]'
                : 'bg-gradient-to-b from-[#4d1637] to-[#250819] border-amber-400/70 text-amber-200 hover:border-amber-300 active:scale-95'
            }`}
          >
            <span className="text-2xl mb-0.5">⇄</span>
            <span className="text-xs font-black tracking-wider uppercase">
              {t.swap}
            </span>
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] border border-amber-200 shadow">
              x{swapCount}
            </span>
          </button>

          {/* 3. JALEBI BOMB */}
          <button
            onClick={() => {
              if (bombCount > 0 && !isProcessing) {
                sound.playClick();
                setActiveBooster(activeBooster === 'bomb' ? null : 'bomb');
                setSelectedCell(null);
              }
            }}
            className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border transition-all cursor-pointer shadow-md ${
              activeBooster === 'bomb'
                ? 'bg-amber-400 border-yellow-200 text-amber-950 scale-105 shadow-[0_0_15px_gold]'
                : 'bg-gradient-to-b from-[#4d1637] to-[#250819] border-amber-400/70 text-amber-200 hover:border-amber-300 active:scale-95'
            }`}
          >
            <span className="text-2xl mb-0.5">💣</span>
            <span className="text-xs font-black tracking-wider uppercase">
              {t.bomb}
            </span>
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] border border-amber-200 shadow">
              x{bombCount}
            </span>
          </button>
        </div>
      </div>

      {/* Win / Loss Modal Dialog */}
      {gameEnded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[320px] p-6 rounded-2xl bg-gradient-to-b from-[#3d0f2b] to-[#1a0513] border-2 border-amber-400 shadow-[0_0_35px_rgba(255,215,0,0.6)] text-center">
            {gameEnded === 'win' ? (
              <>
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center text-5xl">
                  🏆
                </div>
                <h2 className="font-cinzel text-2xl font-black text-amber-300 drop-shadow mb-1">
                  {t.levelComplete}
                </h2>
                <p className="text-xs text-amber-100/90 mb-4">
                  {t.congratulations}
                </p>

                {/* Stars calculation */}
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3].map(starIdx => {
                    const earned = score >= targetScore * (1 + (starIdx - 1) * 0.4);
                    return (
                      <span
                        key={starIdx}
                        className={`text-3xl ${earned ? 'text-yellow-400 drop-shadow-[0_0_8px_gold] animate-bounce' : 'text-slate-600 opacity-40'}`}
                      >
                        ★
                      </span>
                    );
                  })}
                </div>

                <div className="p-3 mb-4 rounded-xl bg-black/40 border border-amber-400/40 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-300/80">{t.score}:</span>
                    <span className="font-bold text-amber-200">{score.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300/80">{t.coins}:</span>
                    <span className="font-bold text-yellow-400">+1,200 🪙</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      const stars = score >= targetScore * 1.8 ? 3 : score >= targetScore * 1.4 ? 2 : 1;
                      onWinLevel(score, stars);
                    }}
                    className="w-full py-3 rounded-xl btn-gold-royal font-cinzel font-black text-base tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    {t.nextLevel}
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onRequestWatchAd('double_win');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/25 via-yellow-400/25 to-amber-500/25 border border-amber-300 text-yellow-300 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(255,215,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="text-sm">📺</span>
                    <span>{t.doubleReward}</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center text-5xl">
                  🥀
                </div>
                <h2 className="font-cinzel text-2xl font-black text-red-400 drop-shadow mb-1">
                  {t.levelFailed}
                </h2>
                <p className="text-xs text-amber-100/80 mb-3">
                  {lang === 'gu'
                    ? 'તમે લક્ષ્ય સ્કોર સુધી પહોંચી શક્યા નથી. ફરી પ્રયાસ કરો!'
                    : 'Target score not reached. Keep crushing those laddus and try again!'}
                </p>

                {/* Rewarded Video Ad Salvage (+5 Extra Moves to continue immediately!) */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onRequestWatchAd('extra_moves');
                  }}
                  className="w-full mb-3 py-3 px-3 rounded-xl btn-gold-royal font-cinzel font-black text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_gold] animate-pulse"
                >
                  <span className="text-base">📺</span>
                  <span>{t.watchAdMoves}</span>
                </button>

                <div className="p-3 mb-4 rounded-xl bg-black/40 border border-amber-400/40 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-300/80">{t.score}:</span>
                    <span className="font-bold text-amber-200">{score.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300/80">{t.target}:</span>
                    <span className="font-bold text-amber-300">{targetScore.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onBack();
                    }}
                    className="flex-1 py-2.5 rounded-xl btn-maroon-royal font-bold text-xs"
                  >
                    {t.levelsMap}
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setBoard(createInitialBoard());
                      setScore(0);
                      setMovesLeft(initialMoves);
                      setGameEnded(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl btn-gold-royal font-black text-xs flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.tryAgain}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
