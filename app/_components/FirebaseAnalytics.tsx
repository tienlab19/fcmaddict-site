"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  registerAnalyticsTracker,
  trackAnalytics,
} from "@/features/analytics/application/track-analytics";
import { createFirebaseAnalyticsTracker } from "@/features/analytics/infrastructure/firebase-analytics-tracker";

function linkSource(link: HTMLAnchorElement) {
  if (link.dataset.analyticsSource) return link.dataset.analyticsSource;
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  return "content";
}

export function FirebaseAnalytics() {
  const pathname = usePathname();
  const lastPathname = useRef("");

  useEffect(() => {
    void createFirebaseAnalyticsTracker().then((tracker) => {
      if (tracker) registerAnalyticsTracker(tracker);
    }).catch((error: unknown) => {
      console.error("Firebase Analytics initialization failed.", error);
    });
  }, []);

  useEffect(() => {
    if (!pathname || lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    trackAnalytics("page_view", {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    function trackLink(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.dataset.analyticsIgnore === "true") return;

      const url = new URL(link.href, window.location.href);
      const source = linkSource(link);
      if (url.protocol === "mailto:") {
        trackAnalytics("support_contact", { source });
        return;
      }

      trackAnalytics("navigation_click", {
        source,
        destination: url.origin === window.location.origin
          ? url.pathname
          : url.hostname,
      });
    }

    function trackExpansion(event: Event) {
      const details = event.target;
      if (!(details instanceof HTMLDetailsElement) || !details.open) return;
      const contentType = details.dataset.analyticsContentType;
      const contentId = details.dataset.analyticsContentId;
      if (!contentType || !contentId) return;
      trackAnalytics("content_expand", {
        content_type: contentType,
        content_id: contentId,
      });
    }

    document.addEventListener("click", trackLink);
    document.addEventListener("toggle", trackExpansion, true);
    return () => {
      document.removeEventListener("click", trackLink);
      document.removeEventListener("toggle", trackExpansion, true);
    };
  }, []);

  return null;
}
