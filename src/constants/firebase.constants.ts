import Constants from "expo-constants";

// Get Firebase config from app.config.js extra field
const FIREBASE_API_KEY = Constants.expoConfig?.extra?.FIREBASE_API_KEY || "";
const FIREBASE_APP_ID = Constants.expoConfig?.extra?.FIREBASE_APP_ID || "";
const FIREBASE_AUTH_DOMAIN = Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN || "";
const FIREBASE_DATABASE_URL = Constants.expoConfig?.extra?.FIREBASE_DATABASE_URL || "";
const FIREBASE_MEASUREMENT_ID = Constants.expoConfig?.extra?.FIREBASE_MEASUREMENT_ID || "";
const FIREBASE_MESSAGING_SENDER_ID = Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID || "";
const FIREBASE_PROJECT_ID = Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID || "";
const FIREBASE_STORAGE_BUCKET = Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET || "";

export const firebaseConfig = {
  apiKey: `${FIREBASE_API_KEY}`,
  authDomain: `${FIREBASE_AUTH_DOMAIN}`,
  databaseURL: `${FIREBASE_DATABASE_URL}`,
  projectId: `${FIREBASE_PROJECT_ID}`,
  storageBucket: `${FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${FIREBASE_APP_ID}`,
  measurementId: `${FIREBASE_MEASUREMENT_ID}`,
};
