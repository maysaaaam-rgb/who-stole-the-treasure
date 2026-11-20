# Quiet Island (`home3d/quiet/`) — Sound & Asset Credits

All audio in Quiet Island (`home3d/quiet.js`) is synthesized procedurally in real time using the browser's built-in **Web Audio API** (zero external audio files, zero third-party licensing dependencies, 0 KB download overhead):

1. **Gentle Waves:** Low-pass filtered pink/white noise buffer with slow ocean-swell gain LFO (`0.14 Hz`).
2. **Wind:** Band-pass filtered noise with dual-frequency gust LFO (`0.22 Hz` + `0.37 Hz`) that rises during `uneasy` and `loud` states.
3. **Rain:** High-pass / band-pass raindrop noise texture that crossfades in smoothly during the `loud` state.
4. **Thunder:** Low-pass filtered noise rumble burst with exponential envelope decay triggered `0.35s` after each soft lightning flash.
5. **Birdsong Chirps:** Frequency-modulated sine chirps (`2400–3600 Hz`) triggered gently in the `calm` and `returning` states.
6. **Calm Island Melody (Ukulele / Marimba):** Soft C-major pentatonic plucked sine + triangle harmonic arpeggios (`C5, D5, E5, G5, A5, C6`) that rise gently as creatures return to the island.
7. **Creature Return Chime ("Ding"):** Warm ascending harmonic bell (`E5 → B5`) played as each creature hops back out during `returning`.
8. **Water Splash:** Short band-pass noise burst for the axolotl dive and jumping sea fish.

All additional living creatures (seagull flock, painted butterflies, beach crab, pond frog, jumping sea fish), storm clouds, rain streaks, sunbeams, and lighthouse beacon are built procedurally with Three.js geometry and HTML5 Canvas textures inside `home3d/quiet.js` (`0` Tripo credits used, keeping `home3d/` well under the `12 MB` first-load budget).
