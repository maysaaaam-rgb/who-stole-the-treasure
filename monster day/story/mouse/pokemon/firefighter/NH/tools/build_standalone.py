import base64, os, json

def to_base64_img(path):
    if not os.path.exists(path):
        return None
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
        return f"data:image/png;base64,{data}"

def to_base64_audio(path):
    if not os.path.exists(path):
        return None
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
        return f"data:audio/mp3;base64,{data}"

print("1. Bundling Audio...")
audio_map = {
    "dog_throw": "cat-vs-dog/assets/audio/202.mp3",
    "cat_throw": "cat-vs-dog/assets/audio/324.mp3",
    "hit_fence": "cat-vs-dog/assets/audio/308.mp3",
    "hit_ground": "cat-vs-dog/assets/audio/244.mp3",
    "hit_char": "cat-vs-dog/assets/audio/168.mp3",
    "dog_hurt": "cat-vs-dog/assets/audio/123.mp3",
    "dog_bark": "cat-vs-dog/assets/audio/117.mp3",
    "cat_hurt": "cat-vs-dog/assets/audio/413.mp3",
    "cat_meow": "cat-vs-dog/assets/audio/15.mp3",
    "powerup_select": "cat-vs-dog/assets/audio/26.mp3",
    "heal": "cat-vs-dog/assets/audio/28.mp3",
    "powerup_active": "cat-vs-dog/assets/audio/287.mp3",
    "click": "cat-vs-dog/assets/audio/122.mp3",
    "charge_whistle": "cat-vs-dog/assets/audio/9.mp3",
    "victory": "cat-vs-dog/assets/audio/419.mp3"
}

bundled_audio = {}
for k, v in audio_map.items():
    b64 = to_base64_audio(v)
    if b64:
        bundled_audio[k] = b64

print(f"Bundled {len(bundled_audio)} audio clips.")

print("2. Bundling Sprites & Background...")
bundled_sprites = {}

# Background
bg_b64 = to_base64_img("cat-vs-dog/assets/sprites/png_shapes/30.png")
if bg_b64:
    bundled_sprites["bg"] = bg_b64

# Animation configs
anim_config = {
    "cat_idle": ("assembled/sprites/DefineSprite_288", 37),
    "cat_windup": ("assembled/sprites/DefineSprite_325", 25),
    "cat_release": ("assembled/sprites/DefineSprite_325", 70),
    "cat_hit_hurt": ("assembled/sprites/DefineSprite_289", 5),
    "cat_victory": ("assembled/sprites/DefineSprite_405", 22),
    "cat_meter": ("assembled/sprites/DefineSprite_257", 37),

    "dog_idle": ("assembled/sprites/DefineSprite_170", 28),
    "dog_windup": ("assembled/sprites/DefineSprite_205", 25),
    "dog_release": ("assembled/sprites/DefineSprite_205", 70),
    "dog_hit_hurt": ("assembled/sprites/DefineSprite_171", 5),
    "dog_victory": ("assembled/sprites/DefineSprite_418", 12),
    "dog_meter": ("assembled/sprites/DefineSprite_118", 37),

    "wind": ("assembled/sprites/DefineSprite_216", 16),
    "proj_bone": ("assembled/sprites/DefineSprite_92", 8),
    "proj_can": ("assembled/sprites/DefineSprite_220", 18),
    "proj_bomb": ("assembled/sprites/DefineSprite_409", 8),
    "bandage_heal": ("assembled/sprites/DefineSprite_323", 18),
    "dog_bar": ("assembled/sprites/DefineSprite_208", 29),
    "cat_bar": ("assembled/sprites/DefineSprite_209", 31)
}

base_sprites = "cat-vs-dog/assets/sprites"
for anim_key, (folder, count) in anim_config.items():
    for i in range(1, count + 1):
        p = f"{base_sprites}/{folder}/{i}.png"
        b64 = to_base64_img(p)
        if b64:
            bundled_sprites[f"{anim_key}_{i}"] = b64

# Buttons
btn_config = [
    ("dog_x2", "DefineButton2_180"),
    ("dog_bomb", "DefineButton2_183"),
    ("dog_gas", "DefineButton2_186"),
    ("dog_heal", "DefineButton2_189"),
    ("cat_x2", "DefineButton2_192"),
    ("cat_bomb", "DefineButton2_194"),
    ("cat_gas", "DefineButton2_196"),
    ("cat_heal", "DefineButton2_198")
]

for name, folder in btn_config:
    bundled_sprites[f"{name}_up"] = to_base64_img(f"{base_sprites}/assembled/buttons/{folder}/1_up.png")
    bundled_sprites[f"{name}_over"] = to_base64_img(f"{base_sprites}/assembled/buttons/{folder}/2_over.png")
    bundled_sprites[f"{name}_down"] = to_base64_img(f"{base_sprites}/assembled/buttons/{folder}/3_down.png")

# Shapes
for s in ["406", "407", "408", "226", "108", "12"]:
    p = f"{base_sprites}/png_shapes/{s}.png"
    b64 = to_base64_img(p)
    if b64:
        bundled_sprites[f"shape_{s}"] = b64

print(f"Bundled {len(bundled_sprites)} image assets.")

# 3. Read CSS & JS
with open("cat-vs-dog/css/style.css", "r", encoding="utf-8") as f:
    css_content = f.read()

with open("cat-vs-dog/js/game-audio.js", "r", encoding="utf-8") as f:
    audio_js = f.read()

with open("cat-vs-dog/js/sprite-manager.js", "r", encoding="utf-8") as f:
    sprite_js = f.read()

with open("cat-vs-dog/js/game-engine.js", "r", encoding="utf-8") as f:
    engine_js = f.read()

with open("cat-vs-dog/js/main.js", "r", encoding="utf-8") as f:
    main_js = f.read()

# 4. Assemble HTML
html_template = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Cat vs Dog (Fleabag vs Mutt) | Standalone Single-File Port</title>
  <style>
{css_content}
  </style>
</head>
<body>
  <header class="header-bar">
    <div class="brand-badge">
      🐱 <span>CAT</span> VS <span>DOG</span> 🐶
    </div>
    <div class="controls-cluster">
      <select id="game-mode-select" class="glass-select" title="Game Mode">
        <option value="1P">1 Player (vs CPU)</option>
        <option value="2P">2 Players (Pass &amp; Play)</option>
      </select>
      <select id="difficulty-select" class="glass-select" title="Wind Difficulty">
        <option value="normal">Wind: Normal (-7 to +7)</option>
        <option value="easy">Wind: Calm (-1 to +1)</option>
      </select>
      <button id="btn-toggle-sfx" class="btn-3d active" title="Toggle Sound FX">🔊 SFX</button>
      <button id="btn-toggle-music" class="btn-3d" title="Toggle Theme Music">🎵 Music</button>
      <button id="btn-reset" class="btn-3d" title="Restart Game">🔄 Reset</button>
      <button id="btn-fullscreen" class="btn-3d" title="Classroom Fullscreen">📺</button>
    </div>
  </header>

  <main class="game-frame">
    <canvas id="battle-canvas" width="600" height="430"></canvas>
    <div id="loading-overlay" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading Standalone Game...</div>
    </div>
    <div id="game-over-modal" class="modal-overlay">
      <div class="modal-card">
        <div id="winner-avatar" class="winner-avatar">🏆</div>
        <h2 id="game-over-title" class="modal-title">Victory!</h2>
        <p id="game-over-desc" class="modal-desc">Winner details...</p>
        <button id="btn-rematch" class="btn-3d btn-primary" style="padding: 12px 24px; font-size: 1rem;">
          ⚔️ Play Rematch
        </button>
      </div>
    </div>
  </main>

  <footer class="hint-tray">
    <span class="hint-pill">🖱️ Click &amp; Hold to Charge Power</span>
    <span class="hint-pill">🎯 Release to Launch Over Fence</span>
    <span class="hint-pill">💨 Watch Wind Vane Indicator</span>
    <span class="hint-pill">⚡ Tap Power-ups: x2 Double, 💣 Bomb, 🧪 Stink, 🩹 Heal</span>
  </footer>

  <script>
    window.BUNDLED_AUDIO = {json.dumps(bundled_audio)};
    window.BUNDLED_SPRITES = {json.dumps(bundled_sprites)};

{audio_js}

{sprite_js}

{engine_js}

{main_js}
  </script>
</body>
</html>
'''

with open("cat-vs-dog/standalone.html", "w", encoding="utf-8") as f:
    f.write(html_template)

sz_mb = os.path.getsize("cat-vs-dog/standalone.html") / (1024 * 1024)
print(f"Successfully generated cat-vs-dog/standalone.html ({sz_mb:.2f} MB)")
