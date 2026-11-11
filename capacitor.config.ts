export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
    cleartext?: boolean;
    url?: string;
  };
  plugins?: Record<string, unknown>;
}

const config: CapacitorConfig = {
  appId: 'com.royal.ladducrush',
  appName: 'Laddu Crush - Premium',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    // Google Mobile Ads (AdMob) Plugin Configuration for Android
    AdMob: {
      appId: {
        // Replace with your real Google AdMob Android App ID when publishing
        android: 'ca-app-pub-3940256099942544~3347511713',
      },
    },
  },
};

export default config;
