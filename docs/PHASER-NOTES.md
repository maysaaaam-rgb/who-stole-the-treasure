# Phaser Notes — English Adventure Academy

## Local Copy in This Repository
- **Engine Bundle:** `island/lib/phaser.min.js` (**Phaser v4.2.1**, ~1.31 MB)
- **License File:** `island/lib/phaser-LICENSE.txt` (MIT License, Copyright © 2026 Richard Davey, Phaser Studio Inc.)

## Offline-First Rule (Never Use a CDN)
All pages in English Adventure Academy **must** load Phaser from the local copy inside this repository — **never from an external CDN** (`jsdelivr`, `cdnjs`, `unpkg`, etc.).
- Classroom smartboards, school Wi-Fi networks, and pupil tablets may be offline or behind school firewalls that block external script CDNs.
- Inside `island/` pages (such as `island/index.html` and `island/world.html`), include Phaser with:
  ```html
  <script src="lib/phaser.min.js"></script>
  ```
- Inside any sibling module folder at the repository root (for example `new-game/index.html`), reference the shared local copy with:
  ```html
  <script src="../island/lib/phaser.min.js"></script>
  ```
- Do not add a second copy of `phaser.min.js` elsewhere in the repository unless specifically needed for a standalone archive.

## Pages Currently Loading Phaser
| Page | Script Tag | Phaser Version |
| :--- | :--- | :--- |
| `island/index.html` (line 110) | `<script src="lib/phaser.min.js"></script>` | `4.2.1` (local) |
| `island/world.html` (line 109) | `<script src="lib/phaser.min.js"></script>` | `4.2.1` (local) |

## Official Phaser Resources
- **Official Examples Site:** https://phaser.io/examples
- **Official GitHub Repository:** https://github.com/phaserjs/phaser
