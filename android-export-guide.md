# Laddu Crush - Android APK / AAB Export Guide

This guide explains how to export **Laddu Crush: Premium Edition** into a signed Android APK (for direct device installation) or Android App Bundle (AAB for Google Play Store) with **Google AdMob** integration.

---

## Prerequisites
1. **Node.js** (v18 or v20+)
2. **Android Studio** (Hedgehog or newer with Android SDK 34+)
3. A Google AdMob Account (for production Ad Unit IDs)

---

## Step 1: Install Capacitor Android Dependencies
In your project directory, install the Capacitor CLI and Android platform:

```bash
npm install @capacitor/cli @capacitor/android @capacitor-community/admob --save
```

---

## Step 2: Initialize & Build the Web Assets
Build the optimized Vite production bundle:

```bash
npm run build
```

Then initialize the native Android project:

```bash
npx cap add android
npx cap sync
```

This creates the native `android/` directory with a full Gradle project.

---

## Step 3: Configure AndroidManifest.xml for Google AdMob
Open `android/app/src/main/AndroidManifest.xml` and verify the following:

### 1. Permissions (inside `<manifest>`):
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### 2. Google AdMob App ID (inside `<application>`):
```xml
<!-- Google AdMob Application ID -->
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-3940256099942544~3347511713"/>
```
> **Note**: For development and testing, keep the official Google test App ID `ca-app-pub-3940256099942544~3347511713`. Before publishing to the Play Store, replace this with your real App ID from the AdMob console.

---

## Step 4: Open in Android Studio & Build APK / AAB
Open the native project:

```bash
npx cap open android
```

### To build a Test APK:
1. In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Once finished, click **locate** to find the output `app-debug.apk`.
3. Transfer and install directly on your Android phone.

### To build a Release App Bundle (AAB for Google Play Store):
1. In Android Studio, go to **Build > Generate Signed Bundle / APK**.
2. Select **Android App Bundle** and click **Next**.
3. Create or select your Release Keystore file (`.jks`).
4. Select `release` build variant and click **Finish**.
5. Upload the generated `.aab` file to your Google Play Console!

---

## AdMob Configuration Summary

| Ad Type | Screen / Trigger | Google Official Test Unit ID |
| :--- | :--- | :--- |
| **Banner Ad** | Home Screen only | `ca-app-pub-3940256099942544/6300978111` |
| **Interstitial Ad** | Every 3 completed levels (Never during gameplay) | `ca-app-pub-3940256099942544/1033173712` |
| **Rewarded Video** | Watch for +500 Coins or +1 Life | `ca-app-pub-3940256099942544/5224354917` |

To switch from Test IDs to Production IDs, open `src/config/admob.config.ts`, set `isTesting: false`, and replace the IDs with your real AdMob unit IDs.
