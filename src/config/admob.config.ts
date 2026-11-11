/**
 * Google AdMob Configuration for Laddu Crush (Android & Web)
 * 
 * Official Google Test Ad Unit IDs for Android:
 * https://developers.google.com/admob/android/test-ads
 * 
 * To switch to Production, set `isTesting: false` and paste your real
 * AdMob App ID and Ad Unit IDs generated in the Google AdMob console.
 */

export interface AdMobConfig {
  isTesting: boolean;
  appId: {
    android: string;
    ios: string;
  };
  adUnits: {
    banner: {
      android: string;
      ios: string;
    };
    interstitial: {
      android: string;
      ios: string;
    };
    rewarded: {
      android: string;
      ios: string;
    };
    rewardedInterstitial: {
      android: string;
      ios: string;
    };
  };
  interstitialFrequency: number; // Show interstitial every N completed levels
  rewardedCoinsAmount: number;   // Exactly 500 coins per rewarded ad
}

export const ADMOB_CONFIG: AdMobConfig = {
  // Set to false when publishing to Google Play Store
  isTesting: true,

  // Google AdMob App ID
  appId: {
    // Official Google Test App ID for Android
    android: 'ca-app-pub-3940256099942544~3347511713',
    ios: 'ca-app-pub-3940256099942544~1458602516',
  },

  // Google Official Test Ad Unit IDs
  adUnits: {
    // Banner Ad: Home screen only
    banner: {
      android: 'ca-app-pub-3940256099942544/6300978111',
      ios: 'ca-app-pub-3940256099942544/2934735716',
    },
    // Interstitial Ad: Shown every 3 completed levels
    interstitial: {
      android: 'ca-app-pub-3940256099942544/1033173712',
      ios: 'ca-app-pub-3940256099942544/4411468910',
    },
    // Rewarded Video Ad: 500 coins or extra lives
    rewarded: {
      android: 'ca-app-pub-3940256099942544/5224354917',
      ios: 'ca-app-pub-3940256099942544/1712485313',
    },
    // Rewarded Interstitial Ad
    rewardedInterstitial: {
      android: 'ca-app-pub-3940256099942544/5354046379',
      ios: 'ca-app-pub-3940256099942544/6978759866',
    },
  },

  // Game Monetization Rules
  interstitialFrequency: 3, // Exactly every 3 completed levels
  rewardedCoinsAmount: 500,  // Exactly 500 coins as requested
};
