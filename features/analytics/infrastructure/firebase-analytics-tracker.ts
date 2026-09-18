import type { AnalyticsTracker } from "../domain/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDAfGI8F1LS7Erv4Q133sSQiRTkuA71Spw",
  authDomain: "fcm-addict.firebaseapp.com",
  projectId: "fcm-addict",
  storageBucket: "fcm-addict.firebasestorage.app",
  messagingSenderId: "351120905145",
  appId: "1:351120905145:web:df5d843dd506a577085c68",
  measurementId: "G-8ZL2G7LZ3F",
};

let trackerPromise: Promise<AnalyticsTracker | null> | null = null;

export function createFirebaseAnalyticsTracker() {
  trackerPromise ??= initializeTracker();
  return trackerPromise;
}

async function initializeTracker(): Promise<AnalyticsTracker | null> {
  const [{ getApp, getApps, initializeApp }, analyticsSdk] = await Promise.all([
    import("firebase/app"),
    import("firebase/analytics"),
  ]);

  if (!(await analyticsSdk.isSupported())) return null;

  const hasExistingApp = getApps().length > 0;
  const app = hasExistingApp ? getApp() : initializeApp(firebaseConfig);
  const analytics = hasExistingApp
    ? analyticsSdk.getAnalytics(app)
    : analyticsSdk.initializeAnalytics(app, {
        config: { send_page_view: false },
      });

  return {
    track({ name, params }) {
      const definedParams = Object.fromEntries(
        Object.entries(params ?? {}).filter((entry) => entry[1] !== undefined),
      );
      if (name === "page_view") {
        analyticsSdk.logEvent(analytics, "page_view", definedParams);
        return;
      }
      analyticsSdk.logEvent(analytics, name, definedParams);
    },
  };
}
