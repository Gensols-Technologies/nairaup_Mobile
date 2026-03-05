const dotenv = require("dotenv");
const path = require("path");

// Load .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

module.exports = {
  expo: {
  name: 'NairaUp',
  displayName: "Nairaup",
  slug: "nairaup",
  version: "0.0.1",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  scheme: "nairaup",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./src/assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#FFF"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  newArchEnabled: true,
  ios: {
    usesAppleSignIn: true,
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST,
    supportsTablet: true,
    bundleIdentifier: "com.nairaup.app",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      LSApplicationQueriesSchemes: ["btravel"]
    }
  },
  android: {
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#FFF"
    },
    package: "com.nairaup.app",
  },
  extra: {
    eas: {
      projectId: "b100f54a-55d8-4c63-b2d4-90f1d7458863"
    },
    // App Configuration
    PRODUCT_NAME: process.env.PRODUCT_NAME || "NairaUp",
    API_BEARER_TOKEN: process.env.API_BEARER_TOKEN || "",
    
    // API URLs
    API_DEV_URL: process.env.API_DEV_URL || "http://10.0.2.2:3335/api/v1",
    API_STAGING_URL: process.env.API_STAGING_URL || "http://10.0.2.2:3335/api/v1",
    API_PROD_URL: process.env.API_PROD_URL || "https://api.nairaup.com/api/v1",
    
    // Google Configuration
    ANDROID_GOOGLE_API_KEY: process.env.ANDROID_GOOGLE_API_KEY || "",
    IOS_GOOGLE_API_KEY: process.env.IOS_GOOGLE_API_KEY || "",
    ANDROID_MAP_KEY: process.env.ANDROID_MAP_KEY || "",
    IOS_MAP_KEY: process.env.IOS_MAP_KEY || "",
    
    // Firebase Configuration
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || "",
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || "",
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL || "",
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || "",
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || "",
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || "",
    
    // Paystack Configuration
    PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY || "",
    PAYSTACK_PUBLIC_KEY_LIVE: process.env.PAYSTACK_PUBLIC_KEY_LIVE || "",
    
    // OneSignal Configuration
    ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID || "",
    
    // Redux Persist Configuration
    PERSIST_CONFIG_KEY: process.env.PERSIST_CONFIG_KEY || "nairaup-persist",
    
    // Countries API Configuration
    COUNTRIES_API_URL: process.env.COUNTRIES_API_URL || "https://restcountries.com/v3.1",
    AUTH_TOKEN_COUNTRIES: process.env.AUTH_TOKEN_COUNTRIES || "",
  },
  plugins: [
    "expo-font",
    "expo-secure-store",
    "expo-web-browser",
    [
      "expo-notifications",
      {
        "icon": "./src/assets/images/icon.png",
        "color": `#0452C0`
      }
    ],
    [
      "expo-location",
      {
        "locationAlwaysAndWhenInUsePermission": `Turning on your location allows NairaUp recommend apartments and hotels near you`,
        "isIosBackgroundLocationEnabled": true,
        "isAndroidBackgroundLocationEnabled": true,
        "locationWhenInUsePermission": `Turning on your location allows NairaUp recommend apartments and hotels near you`
      }
    ],
    ["@react-native-community/datetimepicker"],
    [
      "expo-document-picker",
      {
        "iCloudContainerEnvironment": "Production"
      }
    ],
    [
      "expo-splash-screen",
      {
        "backgroundColor": "#FEEBCA",
        "image": "./src/assets/images/splash-icon.png",
        "dark": {
          "image": "./src/assets/images/splash-icon.png",
          "backgroundColor": "#FEEBCA"
        },
        "imageWidth": 200
      }
    ],
    [
      "@react-native-google-signin/google-signin"
    ],
  ],
  hooks: {
  },
  experiments: {
    typedRoutes: true
  }
  },
};
