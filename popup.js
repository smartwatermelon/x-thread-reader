import { isStatusUrl } from "./shared.js";

const toggle = document.querySelector("#auto-open");
const open = document.querySelector("#open");
const note = document.querySelector("#note");

const activeTab = async () =>
  (await chrome.tabs.query({ active: true, currentWindow: true }))[0];

// Attach the toggle listener only after the initial state is loaded, so a click
// during init can't race the stored value and leave the UI out of sync.
toggle.disabled = true;
(async () => {
  try {
    const { autoOpen = true } = await chrome.storage.local.get("autoOpen");
    toggle.checked = autoOpen;
    const tab = await activeTab();
    if (!isStatusUrl(tab?.url || "")) {
      open.disabled = true;
      note.textContent = "Open an X post first.";
    }
  } catch (error) {
    console.error("X Thread Reader: failed to read state", error);
  } finally {
    toggle.disabled = false;
    toggle.addEventListener("change", onToggle);
  }
})();

async function onToggle() {
  const previous = !toggle.checked;
  try {
    await chrome.storage.local.set({ autoOpen: toggle.checked });
  } catch (error) {
    // Restore the UI to match what's actually stored.
    toggle.checked = previous;
    note.textContent = "Couldn’t save that preference.";
    console.error("X Thread Reader: failed to save preference", error);
  }
}

open.addEventListener("click", async () => {
  const fail = () =>
    (note.textContent = "Couldn’t open this post in Twitter Thread.");
  open.disabled = true;
  try {
    const tab = await activeTab();
    // Re-check at click time: the tab may have navigated while the popup was
    // open, so don't send a request for a non-status URL.
    if (!isStatusUrl(tab?.url || "")) return fail();
    const response = await chrome.runtime.sendMessage({
      type: "open-reader",
      url: tab.url,
      tabId: tab.id,
    });
    if (response?.ok) window.close();
    else fail();
  } catch {
    fail();
  } finally {
    open.disabled = false;
  }
});
