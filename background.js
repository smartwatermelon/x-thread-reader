import { isStatusUrl, readerUrl } from "./shared.js";

async function autoOpen(details) {
  if (details.frameId !== 0 || !isStatusUrl(details.url)) return;
  // Don't redirect when the user is navigating back/forward, otherwise the
  // original X post becomes unreachable — Back would bounce straight forward.
  if (details.transitionQualifiers?.includes("forward_back")) return;
  try {
    const { autoOpen = true } = await chrome.storage.local.get("autoOpen");
    if (autoOpen)
      await chrome.tabs.update(details.tabId, { url: readerUrl(details.url) });
  } catch (error) {
    console.error("X Thread Reader: failed to auto-redirect", error);
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const stored = await chrome.storage.local.get("autoOpen");
    if (typeof stored.autoOpen !== "boolean")
      await chrome.storage.local.set({ autoOpen: true });
  } catch (error) {
    console.error("X Thread Reader: failed to initialize storage", error);
  }
});

chrome.webNavigation.onCommitted.addListener(autoOpen, {
  url: [
    { hostEquals: "x.com" },
    { hostEquals: "www.x.com" },
    { hostEquals: "twitter.com" },
    { hostEquals: "www.twitter.com" },
  ],
});

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  // Ignore anything that isn't our request; leave the port for other handlers.
  if (!message || typeof message !== "object" || message.type !== "open-reader")
    return;
  // The popup is not a tab, so sender.tab is undefined here; it passes the
  // target tab id explicitly instead.
  const tabId = message.tabId ?? sender.tab?.id;
  // From here we own the response so the popup never waits on a dropped port.
  if (!isStatusUrl(message.url) || typeof tabId !== "number") {
    respond({ ok: false, error: "Invalid open-reader request" });
    return;
  }
  chrome.tabs
    .update(tabId, { url: readerUrl(message.url) })
    .then(() => respond({ ok: true }))
    .catch((error) => respond({ ok: false, error: String(error) }));
  return true;
});
