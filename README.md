# EARLY Deck (formerly Timeular-Deck)

<p align="center">
  <img src="resources/readme/banner.svg" alt="EARLY Deck — time tracking for Stream Deck and OpenDeck" width="100%" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-0d9488.svg" alt="MIT License"></a>
</p>

___

# Hassle-free time tracking using [Elgato Stream Deck](https://www.elgato.com/en/gaming/stream-deck) / [OpenDeck](https://opendeck.app) and [EARLY](https://early.app) (formerly Timeular) time tracking

A Stream Deck plugin, built against Elgato's official SDK, that also runs under
[OpenDeck](https://github.com/nekename/OpenDeck) — the open-source, Linux-capable Stream Deck
alternative, since OpenDeck implements the same plugin protocol. One codebase, both hosts.

It includes four actions:
- **Start Activity** — starts tracking a specific EARLY activity.
- **Stop Tracking** — stops whatever is currently being tracked.
- **Toggle Activity** — starts/stops a specific activity and shows whether it's running.
- **Current Activity** — a read-only key that shows whatever activity is currently tracked.

## ✏️ Setup

1. **Install Node.js 20+** (the plugin SDK's build tooling requires it).
2. **Install dependencies and build:**
   ```sh
   npm install
   npm run build
   ```
   This compiles `src/` into `com.zavalalabs.early-deck.sdPlugin/bin/plugin.js`.
3. **Install the plugin:**
   - *Official Stream Deck software*: enable Developer Mode (`streamdeck dev`, via `@elgato/cli`,
     or Preferences → Plugins on the official app), then symlink/copy
     `com.zavalalabs.early-deck.sdPlugin` into Stream Deck's `Plugins` folder.
   - *OpenDeck (Linux)*: install OpenDeck (requires Node.js installed **natively**, not via
     Flatpak, plus the `40-streamdeck.rules` udev rule), then copy/symlink
     `com.zavalalabs.early-deck.sdPlugin` into its plugins directory and restart OpenDeck.
4. **Get an EARLY API Key & Secret** from your profile's Public API settings at
   [early.app](https://early.app), and enter them in any EARLY Deck key's property inspector
   (they're shared — set them once).
5. For **Start Activity** / **Toggle Activity** keys, pick which activity they control from the
   dropdown in their property inspector (populated live from your EARLY account).

For active development, `npm run watch` rebuilds on save and restarts the plugin.

## 📞 Help

Hit a bug, or something not behaving as expected? [Open an issue](https://github.com/zavalalabs/Timeular-Deck/issues/new/choose) — pick the **Bug report** template and fill in the host (official Stream Deck software vs. OpenDeck) and any relevant log output; that's almost always what's needed to track something down. Feature ideas are welcome too, via the **Feature request** template.

## 📄 License

[MIT](LICENSE) — do what you like with it, including forking it for the official Stream Deck SDK or OpenDeck's OpenAction API.

## Known Issues
- The official Elgato Stream Deck app doesn't ship for Linux at all, so on Linux OpenDeck is the
  only way to test this plugin locally; cross-checking against the official app needs a
  Windows/Mac machine.
- Elgato's own scaffolding CLI (`@elgato/cli`) has Windows/macOS-only code paths (developer-mode
  toggling, installed-plugin discovery) and crashes outright on Linux — this project's
  `package.json`/`manifest.json`/`rollup.config.mjs` were hand-authored from its own template
  instead.
