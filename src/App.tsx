import React, { useState, useEffect } from 'react';
import { ScreenHome } from './components/ScreenHome';
import { ScreenGameplay } from './components/ScreenGameplay';
import { ScreenLevelsMap } from './components/ScreenLevelsMap';
import { ScreenRewards } from './components/ScreenRewards';
import { ShopModal } from './components/ShopModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { VipModal } from './components/VipModal';
import { RewardedAdModal, AdRewardType } from './components/RewardedAdModal';
import { WatchAndEarnModal } from './components/WatchAndEarnModal';
import { LevelUpModal } from './components/LevelUpModal';
import { AdMobModal } from './components/AdMobModal';
import { LivesModal } from './components/LivesModal';
import { DailyLuckySpinModal } from './components/DailyLuckySpinModal';
import { DailyMissionsModal, Mission } from './components/DailyMissionsModal';
import { AchievementsModal, Achievement } from './components/AchievementsModal';
import { admobService, RewardedRewardType } from './services/admobService';
import { getStoredLivesState, consumeOneLife, addLives, refillAllLives, LivesState } from './utils/livesSystem';
import { Language, TRANSLATIONS } from './utils/translations';
import { sound } from './utils/audio';
import { LEVELS } from './data/levelsData';
import { Volume2, VolumeX, Sparkles, Tv, Crown, RotateCw, Target, Trophy, Heart } from 'lucide-react';

export type ScreenType = 'HOME' | 'GAMEPLAY' | 'MAP' | 'REWARDS';

const INITIAL_MISSIONS: Mission[] = [
  { id: 'm1', title: 'Match 50 Laddus', titleGu: '૫૦ લાડુ ક્રશ કરો', target: 50, current: 18, rewardCoins: 300, claimed: false },
  { id: 'm2', title: 'Win 2 Levels', titleGu: '૨ લેવલ જીતો', target: 2, current: 1, rewardCoins: 500, rewardBooster: 'hammer', claimed: false },
  { id: 'm3', title: 'Create 2 Sparkler Bombs', titleGu: '૨ ફુલઝડી બોમ્બ બનાવો', target: 2, current: 0, rewardCoins: 400, claimed: false },
  { id: 'm4', title: 'Earn 3-Star Rating', titleGu: '૩ સ્ટાર રેટિંગ મેળવો', target: 1, current: 1, rewardCoins: 600, rewardBooster: 'bomb', claimed: false },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'First Royal Win', titleGu: 'પ્રથમ રોયલ વિજય', desc: 'Clear Level 1', descGu: 'લેવલ ૧ જીતો', target: 1, current: 1, rewardCoins: 500, icon: '🏆', claimed: true },
  { id: 'a2', title: 'Laddu Maharaja', titleGu: 'લાડુ મહારાજા', desc: 'Reach Level 10', descGu: 'લેવલ ૧૦ પર પહોંચો', target: 10, current: 10, rewardCoins: 1500, icon: '👑', claimed: false },
  { id: 'a3', title: 'Diamond Crafter', titleGu: 'હીરા કલાકાર', desc: 'Match 40 Kaju Katlis', descGu: '૪૦ કાજુ કતરી મેળવો', target: 40, current: 32, rewardCoins: 800, icon: '💎', claimed: false },
  { id: 'a4', title: 'Bomb Specialist', titleGu: 'ધમાકા સ્પેશિયાલિસ્ટ', desc: 'Detonate 10 Bombs', descGu: '૧૦ બોમ્બ ફોડો', target: 10, current: 6, rewardCoins: 1000, icon: '💣', claimed: false },
  { id: 'a5', title: 'Triple Star Royalty', titleGu: 'ત્રણ સ્ટાર રોયલ્ટી', desc: 'Earn 10 3-Star Ratings', descGu: '૧૦ ત્રણ-સ્ટાર મેળવો', target: 10, current: 7, rewardCoins: 2000, icon: '⭐', claimed: false },
  { id: 'a6', title: 'Treasury Hoarder', titleGu: 'તિજોરીના માલિક', desc: 'Reach 20,000 Coins', descGu: '૨૦,૦૦૦ સિક્કા એકઠા કરો', target: 20000, current: 12400, rewardCoins: 2500, icon: '🪙', claimed: false },
  { id: 'a7', title: 'Jalebi Whirlwind', titleGu: 'જલેબી વમળ', desc: 'Match 50 Jalebi Spirals', descGu: '૫૦ જલેબી મેળવો', target: 50, current: 28, rewardCoins: 800, icon: '🌀', claimed: false },
  { id: 'a8', title: 'Palace Patron', titleGu: 'રાજમહેલના સમર્થક', desc: 'Watch 5 Rewarded Ads', descGu: '૫ વિડીયો જાહેરાત જુઓ', target: 5, current: 3, rewardCoins: 1000, icon: '📺', claimed: false },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('HOME');
  const [lang, setLang] = useState<Language>('gu');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Persistent Player Progression State
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('laddu_crush_coins');
    return saved ? parseInt(saved, 10) : 12400;
  });

  const [playerLevel, setPlayerLevel] = useState<number>(() => {
    const saved = localStorage.getItem('laddu_crush_player_lvl');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    const saved = localStorage.getItem('laddu_crush_current_lvl');
    return saved ? parseInt(saved, 10) : 12;
  });

  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState<number>(() => {
    const saved = localStorage.getItem('laddu_crush_unlocked_lvl');
    return saved ? parseInt(saved, 10) : 12;
  });

  const [levelStars, setLevelStars] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('laddu_crush_stars');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    const initial: Record<number, number> = {};
    for (let i = 1; i < 12; i++) {
      initial[i] = i % 2 === 0 ? 3 : 2;
    }
    return initial;
  });

  // Boosters inventory
  const [hammerCount, setHammerCount] = useState<number>(5);
  const [swapCount, setSwapCount] = useState<number>(3);
  const [bombCount, setBombCount] = useState<number>(3);

  // Lives / Hearts State
  const [livesState, setLivesState] = useState<LivesState>(() => getStoredLivesState());

  // AdMob State subscription
  const [adMobState, setAdMobState] = useState<{
    isBannerVisible: boolean;
    activeAdModal: {
      type: 'interstitial' | 'rewarded';
      rewardType?: RewardedRewardType;
      unitId: string;
      onRewarded?: () => void;
      onClosed?: () => void;
    } | null;
  }>({
    isBannerVisible: true,
    activeAdModal: null,
  });

  // Ads Earning State
  const [activeRewardedAd, setActiveRewardedAd] = useState<AdRewardType | null>(null);
  const [isWatchAndEarnOpen, setIsWatchAndEarnOpen] = useState<boolean>(false);
  const [extraMovesGrantedCount, setExtraMovesGrantedCount] = useState<number>(0);
  
  const [adsWatchedToday, setAdsWatchedToday] = useState<number>(() => {
    const saved = localStorage.getItem('laddu_crush_ads_watched');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [totalAdEarnings, setTotalAdEarnings] = useState<number>(() => {
    const saved = localStorage.getItem('laddu_crush_ad_earnings');
    return saved ? parseInt(saved, 10) : 1500;
  });

  // Modals state
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [isDailyOpen, setIsDailyOpen] = useState<boolean>(false);
  const [isVipOpen, setIsVipOpen] = useState<boolean>(false);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState<boolean>(false);
  const [levelUpNewLevel, setLevelUpNewLevel] = useState<number>(6);
  const [isLivesModalOpen, setIsLivesModalOpen] = useState<boolean>(false);
  const [isLuckySpinOpen, setIsLuckySpinOpen] = useState<boolean>(false);
  const [isMissionsOpen, setIsMissionsOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);

  // Missions & Achievements
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('laddu_crush_missions');
    return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('laddu_crush_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  // Subscribe to AdMob Service state
  useEffect(() => {
    const unsubscribe = admobService.subscribe(state => {
      setAdMobState({
        isBannerVisible: state.isBannerVisible,
        activeAdModal: state.activeAdModal,
      });
    });
    return unsubscribe;
  }, []);

  // Update banner visibility based on active screen (ONLY on Home Screen)
  useEffect(() => {
    if (activeScreen === 'HOME') {
      admobService.showHomeBanner();
    } else {
      admobService.hideHomeBanner();
    }
  }, [activeScreen]);

  // Lives countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLivesState(getStoredLivesState());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync to localStorage (Auto Save)
  useEffect(() => {
    localStorage.setItem('laddu_crush_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('laddu_crush_player_lvl', playerLevel.toString());
  }, [playerLevel]);

  useEffect(() => {
    localStorage.setItem('laddu_crush_current_lvl', currentLevel.toString());
  }, [currentLevel]);

  useEffect(() => {
    localStorage.setItem('laddu_crush_unlocked_lvl', highestUnlockedLevel.toString());
  }, [highestUnlockedLevel]);

  useEffect(() => {
    localStorage.setItem('laddu_crush_stars', JSON.stringify(levelStars));
  }, [levelStars]);

  useEffect(() => {
    localStorage.setItem('laddu_crush_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('laddu_crush_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('laddu_crush_ads_watched', adsWatchedToday.toString());
  }, [adsWatchedToday]);

  useEffect(() => {
    localStorage.setItem('laddu_crush_ad_earnings', totalAdEarnings.toString());
  }, [totalAdEarnings]);

  const currentLevelConfig =
    LEVELS.find(l => l.id === currentLevel) || LEVELS[0];

  const handleToggleSound = () => {
    const nextState = sound.toggleSound();
    setSoundEnabled(nextState);
  };

  const handleToggleLang = () => {
    setLang(prev => (prev === 'gu' ? 'en' : 'gu'));
  };

  const handleStartLevel = (lvlId: number) => {
    // Check lives
    const currentLives = getStoredLivesState().lives;
    if (currentLives <= 0) {
      sound.playClick();
      setIsLivesModalOpen(true);
      return;
    }

    // Consume 1 life to play
    consumeOneLife();
    setLivesState(getStoredLivesState());

    setCurrentLevel(lvlId);
    setActiveScreen('GAMEPLAY');
  };

  const handleWinLevel = (score: number, stars: number) => {
    const reward = currentLevelConfig.rewardCoins;
    setCoins(prev => prev + reward);

    setLevelStars(prev => ({
      ...prev,
      [currentLevel]: Math.max(prev[currentLevel] || 0, stars),
    }));

    // Check Level Progression
    if (currentLevel >= highestUnlockedLevel && currentLevel < LEVELS.length) {
      setHighestUnlockedLevel(currentLevel + 1);
      setCurrentLevel(currentLevel + 1);
      const nextLvl = playerLevel + 1;
      setPlayerLevel(nextLvl);
      setLevelUpNewLevel(nextLvl);
      setTimeout(() => setIsLevelUpOpen(true), 600);
    } else if (currentLevel < LEVELS.length) {
      setCurrentLevel(currentLevel + 1);
    }

    // Trigger Interstitial Ad after every 3 completed levels (Never during active gameplay!)
    admobService.onLevelCompleted(() => {
      setActiveScreen('MAP');
    });
  };

  const handleUseBooster = (type: 'hammer' | 'swap' | 'bomb') => {
    if (type === 'hammer') setHammerCount(h => Math.max(0, h - 1));
    if (type === 'swap') setSwapCount(s => Math.max(0, s - 1));
    if (type === 'bomb') setBombCount(b => Math.max(0, b - 1));
  };

  const handleBuyBooster = (type: 'hammer' | 'swap' | 'bomb', cost: number) => {
    if (coins >= cost) {
      setCoins(c => c - cost);
      if (type === 'hammer') setHammerCount(h => h + 1);
      if (type === 'swap') setSwapCount(s => s + 1);
      if (type === 'bomb') setBombCount(b => b + 1);
    }
  };

  const handleClaimDaily = (addedCoins: number) => {
    setCoins(c => c + addedCoins);
    setHammerCount(h => h + 1);
    setBombCount(b => b + 1);
  };

  // Rewarded Video Ads Handling via AdMob Service
  const handleStartWatchAd = (rewardType: AdRewardType) => {
    setActiveRewardedAd(rewardType);
  };

  const handleClaimLevelUpRegular = () => {
    setCoins(c => c + 1000);
    setHammerCount(h => h + 1);
    setIsLevelUpOpen(false);
    sound.playWin();
  };

  const handleWatchAdLevelUp3X = () => {
    setIsLevelUpOpen(false);
    handleStartWatchAd('level_up_3x');
  };

  const handleRewardEarned = (rewardType: AdRewardType) => {
    setAdsWatchedToday(a => a + 1);

    if (rewardType === 'coins_500') {
      setCoins(c => c + 500);
      setTotalAdEarnings(e => e + 500);
    } else if (rewardType === 'double_win') {
      setCoins(c => c + 2400);
      setTotalAdEarnings(e => e + 2400);
    } else if (rewardType === 'extra_moves') {
      setExtraMovesGrantedCount(cnt => cnt + 1);
    } else if (rewardType === 'booster_hammer') {
      setHammerCount(h => h + 1);
      setCoins(c => c + 250);
      setTotalAdEarnings(e => e + 250);
    } else if (rewardType === 'booster_bomb') {
      setBombCount(b => b + 1);
      setCoins(c => c + 250);
      setTotalAdEarnings(e => e + 250);
    } else if (rewardType === 'level_up_3x') {
      setCoins(c => c + 3000);
      setHammerCount(h => h + 1);
      setBombCount(b => b + 1);
      setTotalAdEarnings(e => e + 3000);
      sound.playWin();
    } else if (rewardType === 'unlock_level') {
      if (highestUnlockedLevel < LEVELS.length) {
        setHighestUnlockedLevel(h => h + 1);
        setCurrentLevel(highestUnlockedLevel + 1);
        sound.playWin();
      }
    }
  };

  // AdMob Rewarded Video for Extra Lives
  const handleWatchAdMobForLife = () => {
    setIsLivesModalOpen(false);
    admobService.showRewardedVideo(
      'extra_life',
      () => {
        addLives(1);
        setLivesState(getStoredLivesState());
        sound.playWin();
      }
    );
  };

  // AdMob Rewarded Video for Lucky Spin
  const handleWatchAdMobForSpin = () => {
    setIsLuckySpinOpen(false);
    admobService.showRewardedVideo(
      'extra_spin',
      () => {
        setIsLuckySpinOpen(true);
        sound.playWin();
      }
    );
  };

  // Missions claim handler
  const handleClaimMission = (missionId: string) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === missionId) {
          setCoins(c => c + m.rewardCoins);
          if (m.rewardBooster === 'hammer') setHammerCount(h => h + 1);
          if (m.rewardBooster === 'bomb') setBombCount(b => b + 1);
          return { ...m, claimed: true };
        }
        return m;
      })
    );
  };

  // Achievements claim handler
  const handleClaimAchievement = (achId: string) => {
    setAchievements(prev =>
      prev.map(a => {
        if (a.id === achId) {
          setCoins(c => c + a.rewardCoins);
          return { ...a, claimed: true };
        }
        return a;
      })
    );
  };

  const t = TRANSLATIONS[lang];

  return (
    <div className="relative min-h-screen w-full bg-[#08020e] text-amber-100 flex flex-col items-center justify-center overflow-x-hidden font-sans">
      {/* Grand Indian Royal Palace Ambient Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,_#4d1338_0%,_#1f0518_45%,_#09020e_100%)] opacity-90" />
        
        <div className="hidden lg:block absolute top-12 left-12 w-28 h-28 rounded-full bg-amber-400/10 blur-2xl animate-pulse" />
        <div className="hidden lg:block absolute bottom-24 right-16 w-36 h-36 rounded-full bg-yellow-400/10 blur-3xl animate-pulse" />
        
        {/* Corner Baroque Gold Filigree Brackets */}
        <div className="hidden lg:block absolute top-4 left-4 text-amber-400/30">
          <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0 0 L100 0 C60 10 30 40 20 80 L0 100 Z" opacity="0.4"/>
            <circle cx="20" cy="20" r="6" fill="#FFD700"/>
          </svg>
        </div>
        <div className="hidden lg:block absolute top-4 right-4 text-amber-400/30 -scale-x-100">
          <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0 0 L100 0 C60 10 30 40 20 80 L0 100 Z" opacity="0.4"/>
            <circle cx="20" cy="20" r="6" fill="#FFD700"/>
          </svg>
        </div>
      </div>

      {/* Main App Container: Centered Mobile Phone Chassis */}
      <main className="relative z-10 w-full max-w-[430px] h-[100dvh] max-h-[920px] flex flex-col bg-[#120310] sm:rounded-[36px] sm:border-[5px] sm:border-[#FFD700] sm:shadow-[0_0_50px_rgba(255,215,0,0.4),0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Top Speaker & Camera Notch */}
        <div className="hidden sm:flex justify-center items-center h-4 w-full bg-[#1e0719] shrink-0">
          <div className="w-16 h-1 rounded-full bg-amber-400/40" />
        </div>

        {/* Screen Content Viewport */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          {activeScreen === 'HOME' && (
            <ScreenHome
              lang={lang}
              onToggleLang={handleToggleLang}
              onPlay={() => handleStartLevel(currentLevel)}
              onOpenMap={() => setActiveScreen('MAP')}
              onOpenShop={() => setIsShopOpen(true)}
              onOpenDaily={() => setIsDailyOpen(true)}
              onOpenVip={() => setActiveScreen('REWARDS')}
              onOpenWatchAndEarn={() => setIsWatchAndEarnOpen(true)}
              onOpenLuckySpin={() => setIsLuckySpinOpen(true)}
              onOpenMissions={() => setIsMissionsOpen(true)}
              onOpenAchievements={() => setIsAchievementsOpen(true)}
              onOpenLivesModal={() => setIsLivesModalOpen(true)}
              livesState={livesState}
              coins={coins}
              playerLevel={playerLevel}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}

          {activeScreen === 'GAMEPLAY' && (
            <ScreenGameplay
              levelNumber={currentLevel}
              targetScore={currentLevelConfig.targetScore}
              initialMoves={currentLevelConfig.moves}
              coins={coins}
              lang={lang}
              onBack={() => setActiveScreen('MAP')}
              onWinLevel={handleWinLevel}
              onUpdateCoins={c => setCoins(c)}
              hammerCount={hammerCount}
              swapCount={swapCount}
              bombCount={bombCount}
              onUseBooster={handleUseBooster}
              onRequestWatchAd={type => handleStartWatchAd(type)}
              extraMovesGrantedCount={extraMovesGrantedCount}
            />
          )}

          {activeScreen === 'MAP' && (
            <ScreenLevelsMap
              currentLevel={currentLevel}
              highestUnlockedLevel={highestUnlockedLevel}
              levelStars={levelStars}
              lang={lang}
              onBack={() => setActiveScreen('HOME')}
              onSelectLevel={handleStartLevel}
              onWatchAdUnlockLevel={() => handleStartWatchAd('unlock_level')}
            />
          )}

          {activeScreen === 'REWARDS' && (
            <ScreenRewards
              coins={coins}
              hammerCount={hammerCount}
              swapCount={swapCount}
              bombCount={bombCount}
              lang={lang}
              onBack={() => setActiveScreen('HOME')}
              onClaimDaily={handleClaimDaily}
              onBuyBooster={handleBuyBooster}
              onWatchAdForReward={() => handleStartWatchAd('coins_500')}
            />
          )}
        </div>
      </main>

      {/* Screen Selector & Features Bar */}
      <footer className="relative z-10 w-full max-w-[760px] px-3 py-2 mt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs select-none">
        <button
          onClick={() => {
            sound.playClick();
            setActiveScreen('HOME');
          }}
          className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeScreen === 'HOME'
              ? 'bg-amber-400 border-yellow-200 text-amber-950 font-black shadow-[0_0_12px_gold]'
              : 'bg-black/60 border-amber-400/40 text-amber-300 hover:border-amber-300'
          }`}
        >
          <span>SCREEN 1: HOME</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveScreen('GAMEPLAY');
          }}
          className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeScreen === 'GAMEPLAY'
              ? 'bg-amber-400 border-yellow-200 text-amber-950 font-black shadow-[0_0_12px_gold]'
              : 'bg-black/60 border-amber-400/40 text-amber-300 hover:border-amber-300'
          }`}
        >
          <span>SCREEN 2: GAMEPLAY</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveScreen('MAP');
          }}
          className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeScreen === 'MAP'
              ? 'bg-amber-400 border-yellow-200 text-amber-950 font-black shadow-[0_0_12px_gold]'
              : 'bg-black/60 border-amber-400/40 text-amber-300 hover:border-amber-300'
          }`}
        >
          <span>SCREEN 3: MAP</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveScreen('REWARDS');
          }}
          className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeScreen === 'REWARDS'
              ? 'bg-amber-400 border-yellow-200 text-amber-950 font-black shadow-[0_0_12px_gold]'
              : 'bg-black/60 border-amber-400/40 text-amber-300 hover:border-amber-300'
          }`}
        >
          <span>SCREEN 4: REWARDS & VIP</span>
        </button>

        {/* Lucky Spin Quick Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            setIsLuckySpinOpen(true);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-amber-400/50 text-amber-300 hover:border-amber-300 cursor-pointer flex items-center gap-1"
        >
          <RotateCw className="w-3.5 h-3.5 text-yellow-300" />
          <span>SPIN</span>
        </button>

        {/* Daily Missions Quick Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            setIsMissionsOpen(true);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-amber-400/50 text-amber-300 hover:border-amber-300 cursor-pointer flex items-center gap-1"
        >
          <Target className="w-3.5 h-3.5 text-yellow-300" />
          <span>MISSIONS</span>
        </button>

        {/* Achievements Quick Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            setIsAchievementsOpen(true);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-amber-400/50 text-amber-300 hover:border-amber-300 cursor-pointer flex items-center gap-1"
        >
          <Trophy className="w-3.5 h-3.5 text-yellow-300" />
          <span>TROPHIES</span>
        </button>

        {/* AdMob Rewarded Video Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            setIsWatchAndEarnOpen(true);
          }}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-amber-950 font-black border border-yellow-200 shadow-[0_0_12px_gold] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Tv className="w-3.5 h-3.5" />
          <span>ADMOB ADS (+500 🪙)</span>
        </button>
      </footer>

      {/* Modals */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        coins={coins}
        lang={lang}
        onBuyBooster={handleBuyBooster}
        onAddCoins={amt => setCoins(c => c + amt)}
        onWatchAdForCoins={() => {
          setIsShopOpen(false);
          handleStartWatchAd('coins_500');
        }}
      />

      <DailyRewardModal
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
        lang={lang}
        onClaimDay={reward => {
          setCoins(c => c + (reward.coins || 0));
          if (reward.hammer) {
            const count = reward.hammer;
            setHammerCount(h => h + count);
          }
          if (reward.bomb) {
            const count = reward.bomb;
            setBombCount(b => b + count);
          }
          if (reward.swap) {
            const count = reward.swap;
            setSwapCount(s => s + count);
          }
          if (reward.lives) {
            addLives(reward.lives);
            setLivesState(getStoredLivesState());
          }
        }}
      />

      <VipModal
        isOpen={isVipOpen}
        onClose={() => setIsVipOpen(false)}
        lang={lang}
      />

      <WatchAndEarnModal
        isOpen={isWatchAndEarnOpen}
        onClose={() => setIsWatchAndEarnOpen(false)}
        lang={lang}
        adsWatchedToday={adsWatchedToday}
        totalAdEarnings={totalAdEarnings}
        onStartWatchAd={type => {
          setIsWatchAndEarnOpen(false);
          handleStartWatchAd(type);
        }}
      />

      <LevelUpModal
        isOpen={isLevelUpOpen}
        newLevel={levelUpNewLevel}
        lang={lang}
        onClaimRegular={handleClaimLevelUpRegular}
        onWatchAd3X={handleWatchAdLevelUp3X}
      />

      <LivesModal
        isOpen={isLivesModalOpen}
        onClose={() => setIsLivesModalOpen(false)}
        lang={lang}
        livesState={livesState}
        coins={coins}
        onWatchAdForLife={handleWatchAdMobForLife}
        onBuyFullLives={cost => {
          setCoins(c => c - cost);
          refillAllLives();
          setLivesState(getStoredLivesState());
          setIsLivesModalOpen(false);
        }}
      />

      <DailyLuckySpinModal
        isOpen={isLuckySpinOpen}
        onClose={() => setIsLuckySpinOpen(false)}
        lang={lang}
        onRewardWon={reward => {
          if (reward.type === 'coins') setCoins(c => c + reward.amount);
          if (reward.type === 'hammer') setHammerCount(h => h + reward.amount);
          if (reward.type === 'bomb') setBombCount(b => b + reward.amount);
          if (reward.type === 'swap') setSwapCount(s => s + reward.amount);
          if (reward.type === 'lives') {
            addLives(reward.amount);
            setLivesState(getStoredLivesState());
          }
        }}
        onWatchAdForExtraSpin={handleWatchAdMobForSpin}
      />

      <DailyMissionsModal
        isOpen={isMissionsOpen}
        onClose={() => setIsMissionsOpen(false)}
        lang={lang}
        missions={missions}
        onClaimMission={handleClaimMission}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        lang={lang}
        achievements={achievements}
        onClaimAchievement={handleClaimAchievement}
      />

      {/* AdMob Official Test Ad Modal (Interstitial & Rewarded) */}
      {adMobState.activeAdModal && (
        <AdMobModal
          adData={adMobState.activeAdModal}
          onClose={() => admobService.closeCurrentAd()}
        />
      )}

      {/* Rewarded Ad Fullscreen Simulator */}
      {activeRewardedAd && (
        <RewardedAdModal
          isOpen={!!activeRewardedAd}
          rewardType={activeRewardedAd}
          lang={lang}
          onClose={() => setActiveRewardedAd(null)}
          onRewardEarned={handleRewardEarned}
        />
      )}
    </div>
  );
}
