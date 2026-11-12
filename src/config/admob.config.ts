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
  interstitialFrequency: number;
  rewardedCoinsAmount: number;
}

export const ADMOB_CONFIG: AdMobConfig = {
  isTesting: false,
  appId: {
    android: 'ca-app-pub-7559010209576294~6378860956',
    ios: 'ca-app-pub-3940256099942544~1458002511',
  },
  adUnits: {
    banner: {
      android: 'ca-app-pub-7559010209576294/7671761323',
      ios: 'ca-app-pub-3940256099942544/2934735716',
    },
    interstitial: {
      android: 'ca-app-pub-7559010209576294/9858795171',
      ios: 'ca-app-pub-3940256099942544/4411468910',
    },
    rewarded: {
      android: 'ca-app-pub-7559010209576294/6542366699',
      ios: 'ca-app-pub-3940256099942544/1712485313',
    },
    rewardedInterstitial: {
      android: 'ca-app-pub-3940256099942544/5354046379',
      ios: 'ca-app-pub-3940256099942544/6978759866',
    },
  },
  interstitialFrequency: 3,
  rewardedCoinsAmount: 500,
};
