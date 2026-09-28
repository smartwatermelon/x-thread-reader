# X Thread Reader (unpacked extension)

> ## ⚠️ Deprecated — use StopTheMadness Pro instead
>
> This extension is retired and the repo is archived. A URL-rewrite rule in
> [StopTheMadness Pro](https://apps.apple.com/us/app/stopthemadness-pro/id6471380298)
> does the same job with no custom extension code to maintain.
>
> The reader is now [unrollnow.com](https://unrollnow.com), which takes a
> status URL as `https://unrollnow.com/status/<id>`.
>
> ### Set it up (about 2 minutes)
>
> 1. Install [StopTheMadness Pro](https://apps.apple.com/us/app/stopthemadness-pro/id6471380298)
>    and enable its browser extension.
> 2. Add a URL replacement rule with this regular expression:
>
>    ```text
>    /^https:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[^/?#]+\/status\/([0-9]+)(?:[/?#].*)?$/
>    ```
>
> 3. Set the replacement to:
>
>    ```text
>    https://unrollnow.com/status/$1
>    ```
>
> 4. Open any `x.com/<user>/status/<id>` link. It should land on
>    `unrollnow.com/status/<id>`.
>
> The rule matches `x.com` and `twitter.com` status links only. Profiles,
> search, and the home timeline are untouched.
>
> If you installed the old extension, remove it at `chrome://extensions`.

---

## Legacy documentation

The rest of this file describes the retired extension. It is kept for
reference only.

A tiny Chrome/Chromium extension that redirects public X/Twitter status URLs
to the corresponding [Twitter Thread](https://twitter-thread.com) reader —
zero clicks. Visit an `x.com/<user>/status/<id>` link and it opens directly in
`twitter-thread.com/t/<id>`.

> **Unsupported, provided as-is.** This is a personal vibe-coded tool with no
> warranty and no guarantee of maintenance. It is not affiliated with X,
> Twitter, or twitter-thread.com. See [LICENSE](LICENSE).

## Install

1. In Chrome, open `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select this folder.
4. Visit any `x.com/<user>/status/<id>` link. It should open directly in
   Twitter Thread's reader.

Use the extension toolbar button to turn automatic opening on/off, or to
manually open the current X post in the reader.

## How it works

The extension watches for top-frame navigations to X/Twitter status URLs,
extracts the numeric status ID, and redirects the tab to
`https://twitter-thread.com/t/<status-id>`. Twitter Thread retrieves and
formats the thread. Navigating **back** to the original post is preserved (the
extension skips the redirect on back/forward navigation).

## Privacy

The extension has no analytics, no account, and no backend of its own. It never
signs in to X or reads an X cookie. The only thing it sends anywhere is the
public status URL you visit, which is handed to twitter-thread.com — the same
site you'd be opening by hand. Its single stored value is a local on/off
preference for automatic opening.

Private, deleted, or otherwise inaccessible posts can still fail to render on
twitter-thread.com.

## Permissions

| Permission | Why |
| --- | --- |
| `storage` | Remember the auto-open on/off toggle. |
| `tabs` | Read the active tab's URL and redirect it to the reader. |
| `webNavigation` | Detect when you land on an X/Twitter status page. |
| host access to `x.com`, `twitter.com`, `twitter-thread.com` | Match status URLs and perform the redirect. |

## License

[MIT](LICENSE) © 2026 Andrew Rich
