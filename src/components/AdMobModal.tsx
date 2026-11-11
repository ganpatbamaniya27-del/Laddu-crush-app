import React, { useState, useEffect } from 'react';
import { RewardedRewardType } from '../services/admobService';
import { sound } from '../utils/audio';
import { X, Sparkles, CheckCircle, AlertTriangle, Loader2, Volume2, VolumeX } from 'lucide-react';

interface AdMobModalProps {
  adData: {
    type: 'interstitial' | 'rewarded';
    rewardType?: RewardedRewardType;
    unitId: string;
    onRewarded?: () => void;
    onClosed?: () => void;
  } | null;
  onClose: () => void;
}

export const AdMobModal: React.FC<AdMobModalProps> = ({ adData, onClose }) => {
  if (!adData) return null;

  const isRewarded = adData.type === 'rewarded';
  const initialDuration = isRewarded ? 5 : 3;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showExitWarning, setShowExitWarning] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Simulate official AdMob network ad request with loading latency
  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);
    setTimeLeft(initialDuration);
    setIsCompleted(false);
    setShowExitWarning(false);

    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // 800ms simulated SDK network load

    return () => clearTimeout(loadTimer);
  }, [adData, initialDuration]);

  // Countdown timer once ad is loaded
  useEffect(() => {
    if (isLoading || loadError) return;

    if (timeLeft <= 0) {
      if (!isCompleted) {
        setIsCompleted(true);
        if (isRewarded && adData.onRewarded) {
          sound.playWin();
          adData.onRewarded();
        }
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      if (!isMuted) sound.playClick();
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, loadError, timeLeft, isCompleted, isRewarded, adData, isMuted]);

  const handleClose = () => {
    if (!isRewarded || isCompleted) {
      sound.playClick();
      onClose();
    } else {
      setShowExitWarning(true);
    }
  };

  const getRewardLabel = () => {
    if (adData.rewardType === 'coins_500') return '+500 Royal Coins';
    if (adData.rewardType === 'extra_life') return '+1 Royal Heart (Life)';
    if (adData.rewardType === 'extra_moves') return '+5 Extra Moves';
    if (adData.rewardType === 'extra_spin') return '+1 Lucky Spin';
    return '+500 Coins';
  };

  const progressPercent = Math.min(100, Math.round(((initialDuration - timeLeft) / initialDuration) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-[420px] rounded-3xl overflow-hidden bg-[#0d0914] border-2 border-[#4285F4] shadow-[0_0_40px_rgba(66,133,244,0.45)] flex flex-col justify-between min-h-[500px]">
        
        {/* AdMob SDK Official Top Header */}
        <div className="w-full bg-[#181a24] border-b border-neutral-800 p-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#4285F4] text-white text-[10px] font-black tracking-wider uppercase">
              Ad · Test
            </span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white">
                Google AdMob {isRewarded ? 'Rewarded Video' : 'Interstitial'}
              </span>
              <span className="text-[9px] font-mono text-neutral-400 truncate max-w-[190px]">
                {adData.unitId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-black/60 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleClose}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                isCompleted || !isRewarded
                  ? 'bg-amber-400 text-amber-950 shadow-[0_0_12px_gold]'
                  : 'bg-black/60 border border-neutral-700 text-neutral-400'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar (Rewarded Video) */}
        {isRewarded && !isLoading && (
          <div className="w-full h-1.5 bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4285F4] to-yellow-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Main Ad Body: Loading / Error / Active Test Commercial */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-[#4285F4] animate-spin" />
              <span className="text-xs font-bold text-neutral-300">
                Loading Ad from Google Mobile Ads SDK...
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                Requesting: {adData.unitId}
              </span>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-3">
              <AlertTriangle className="w-10 h-10 text-red-400" />
              <span className="text-sm font-bold text-red-300">{loadError}</span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full animate-fade-in">
              {/* Ad Visual Graphic Container */}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#1a237e] via-[#283593] to-[#3949ab] border-2 border-[#4285F4] shadow-[0_0_30px_rgba(66,133,244,0.5)] flex items-center justify-center mb-1">
                <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4285F4]/20 border border-[#4285F4]/50 text-[#90caf9] text-[11px] font-bold">
                <span>Google AdMob Test Experience</span>
              </div>

              <h3 className="font-cinzel text-xl font-black text-white mt-1">
                {isRewarded ? 'Watch to Claim Reward' : 'Level Transition Interstitial'}
              </h3>

              <p className="text-xs text-neutral-300 max-w-[280px] leading-relaxed">
                {isRewarded
                  ? `Complete watching to earn ${getRewardLabel()}.`
                  : 'Ad displayed every 3 completed levels. Gameplay is never interrupted.'}
              </p>

              {/* Status Ribbon */}
              <div className="mt-4 px-4 py-2 rounded-xl bg-black/60 border border-neutral-700 w-full max-w-[280px]">
                {isCompleted ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle className="w-4 h-4" />
                    <span>Reward Granted: {getRewardLabel()}!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs">
                    <span>Reward in</span>
                    <span className="text-sm font-black text-yellow-300 font-mono">{timeLeft}s</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* AdMob Bottom Control Bar */}
        <div className="w-full bg-[#181a24] border-t border-neutral-800 p-4 flex items-center justify-between z-20">
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-white">
              {isRewarded ? getRewardLabel() : 'Laddu Crush - Level Break'}
            </span>
            <span className="text-[9px] text-neutral-400">
              {isCompleted ? 'Reward ready to collect' : `${timeLeft}s remaining`}
            </span>
          </div>

          <button
            onClick={handleClose}
            className={`px-5 py-2.5 rounded-xl font-cinzel font-black text-xs tracking-wider transition-all cursor-pointer ${
              isCompleted || !isRewarded
                ? 'btn-gold-royal shadow-lg active:scale-95'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}
          >
            {isCompleted ? 'CLAIM & CLOSE' : !isRewarded ? 'CONTINUE' : `${timeLeft}s`}
          </button>
        </div>

        {/* Early Exit Forfeit Confirmation Modal */}
        {showExitWarning && (
          <div className="absolute inset-0 z-40 bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <AlertTriangle className="w-12 h-12 text-amber-400 mb-3" />
            <h4 className="font-cinzel text-lg font-black text-white mb-1">
              Close Ad Early?
            </h4>
            <p className="text-xs text-neutral-300 mb-5 max-w-[260px]">
              If you close before the video ends, you will not receive your {getRewardLabel()}!
            </p>

            <div className="flex gap-2.5 w-full max-w-[280px]">
              <button
                onClick={() => {
                  setShowExitWarning(false);
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl bg-red-950 border border-red-500/50 text-red-200 text-xs font-bold"
              >
                Forfeit Reward
              </button>
              <button
                onClick={() => setShowExitWarning(false)}
                className="flex-1 py-2 rounded-xl btn-gold-royal text-xs font-black"
              >
                Keep Watching
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
