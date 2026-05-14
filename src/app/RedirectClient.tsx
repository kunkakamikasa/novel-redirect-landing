"use client";

import { useEffect } from "react";

declare global { interface Window { gtag?: (...args: unknown[]) => void; } }

type RedirectClientProps = { destinationUrl?: string; entry: string; };

function mergeParams(destinationUrl: string, currentSearch: string) {
  const target = new URL(destinationUrl);
  const incoming = new URLSearchParams(currentSearch);
  incoming.forEach((value, key) => { target.searchParams.set(key, value); });
  return target.toString();
}

export default function RedirectClient({ destinationUrl, entry }: RedirectClientProps) {
  const missingConfig = !destinationUrl;

  useEffect(() => {
    if (!destinationUrl) return;

    let url: string;
    try {
      url = mergeParams(destinationUrl, window.location.search);
    } catch {
      return;
    }

    const payload = {
      entry,
      path: window.location.pathname,
      search: window.location.search,
      referrer: document.referrer || "",
      finalUrl: url,
      ts: new Date().toISOString(),
    };

    window.gtag?.("event", "page_view", {
      page_path: window.location.pathname,
      page_location: window.location.href,
      page_title: document.title,
    });

    window.gtag?.("event", "redirect_start", {
      event_category: "redirect",
      entry,
      destination_host: new URL(url).hostname,
    });

    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/page-view", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/page-view", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => undefined);
    }

    const timer = window.setTimeout(() => { window.location.replace(url); }, 180);
    return () => window.clearTimeout(timer);
  }, [destinationUrl, entry]);

  return (
    <main className="redirect-shell" aria-label="Novel redirect page">
      <section className="card">
        <span className="badge">Novel App</span>
        <h1>{missingConfig ? "Redirect not configured" : "Opening your story"}</h1>
        <p>{missingConfig ? "The destination link is not ready yet." : "Please wait a moment while we take you to the reading page."}</p>
        {missingConfig ? null : <div className="loader" aria-hidden="true" />}
        {destinationUrl ? <a className="fallback" href={destinationUrl}>Continue</a> : null}
      </section>
    </main>
  );
}
