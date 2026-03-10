# Media Speed Controller

Chrome extension to control the playback speed of any video or audio on any website.

## Features

- **Slider control** - smoothly adjust speed from 0.25x to 5x
- **Preset buttons** - quick access to 0.5x, 1x, 1.5x, 2x, 2.5x, 3x, 4x, 5x
- **Fine-tune** - nudge speed up or down by 0.25 increments
- **Keyboard shortcuts** - control speed without opening the popup
- **On-page overlay** - briefly shows current speed when changed
- **Persistent speed** - remembers your setting across pages and sessions
- **Universal** - works on YouTube, Netflix, Spotify, Twitch, and any site with media
- **Auto-detect** - picks up dynamically loaded media elements (SPAs, infinite scroll, etc.)

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Speed up | `Alt + .` |
| Slow down | `Alt + ,` |
| Reset to 1x | `Alt + 0` |

## Install

### Chrome Web Store

[Install from the Chrome Web Store](https://chromewebstore.google.com/detail/gjphihdciimnefoenbgjmcoilgjkmnlp)

### Manual

1. Clone this repo or download the ZIP
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select this folder

## How It Works

A content script runs on every page and finds all `<video>` and `<audio>` elements. When you set a speed, it applies `playbackRate` to every media element on the page. A MutationObserver watches for new media elements added to the DOM so dynamically loaded players are covered automatically.

Your speed preference is saved to `chrome.storage.local` and restored on every page load.
