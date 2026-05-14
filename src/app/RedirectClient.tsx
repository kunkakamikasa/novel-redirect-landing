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
    <main className="redirect-shell" aria-label="跳转承接页">
      <section className="card">
        <span className="badge">Novel App</span>
        <h1>{missingConfig ? "跳转配置缺失" : "正在进入阅读页面"}</h1>
        <p>{missingConfig ? "请先配置 DESTINATION_URL 后再投放该链接。" : "正在为你打开目标页面，请稍候。"}</p>
        {missingConfig ? null : <div className="loader" aria-hidden="true" />}
        {destinationUrl ? <a className="fallback" href={destinationUrl}>如果没有自动跳转，点这里继续</a> : null}
      </section>
    </main>
  );
}
