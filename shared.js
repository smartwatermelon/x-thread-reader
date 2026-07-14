// Shared helpers used by both the service worker and the popup.
export const STATUS_RE =
  /^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^/?#]+\/status\/(\d+)/i;

export const isStatusUrl = (url) => STATUS_RE.test(url);

export const readerUrl = (source) => {
  const id = source.match(STATUS_RE)?.[1];
  if (!id) throw new Error(`Not an X status URL: ${source}`);
  return `https://twitter-thread.com/t/${id}`;
};
