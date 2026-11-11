import React from 'react';
import { ADMOB_CONFIG } from '../config/admob.config';

interface AdMobBannerProps {
  visible: boolean;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center py-1 select-none pointer-events-auto">
      {/* Standard Google AdMob 320x50 Mobile Banner Container */}
      <div className="w-[320px] h-[50px] bg-[#1a120b] border border-amber-400/50 rounded-lg flex items-center justify-between px-3 shadow-[0_2px_10px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* AdMob Official Test Indicator */}
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-[#4285F4] text-white text-[9px] font-black tracking-wider uppercase">
            Ad
          </span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-amber-200 leading-tight">
              Google AdMob Test Banner
            </span>
            <span className="text-[8px] font-mono text-amber-400/70">
              {ADMOB_CONFIG.isTesting ? 'ca-app-pub-3940256099942544/6300978111' : 'Active Banner'}
            </span>
          </div>
        </div>

        {/* Google Ad Choices / Info Symbol */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-amber-300 font-semibold px-2 py-1 rounded bg-amber-400/20 border border-amber-400/40">
            320×50
          </span>
          <div className="w-4 h-4 rounded-full bg-black/60 flex items-center justify-center text-[10px] text-neutral-400" title="Google Ad Choices">
            ⓘ
          </div>
        </div>
      </div>
    </div>
  );
};
