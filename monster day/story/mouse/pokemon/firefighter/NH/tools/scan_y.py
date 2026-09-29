from PIL import Image

f104 = Image.open("src/assets/sprites/assembled/frames/104.png").convert("RGBA")

# Let us find where the buttons are:
# Buttons are 30x30, so they should be visible at bottom or top
# Let us inspect the 4 buttons for player 1 (Dog):
# In Frame 104, let us find non-background items
import numpy as np

arr = np.array(f104)
# Let's inspect where HUD and characters are by checking colors
# Health bar is red/green or distinctive
# Wind indicator is in the top center
print("Scanning key coordinates in frame 104...")
# Let us check y=20 (HUD / Health bar)
# y=280 (Characters)
# y=380 (Buttons / Ground)
for y in [15, 30, 50, 100, 200, 260, 300, 350, 380, 400]:
    row = arr[y, :, :3]
    # find x where row is dark/black or bright
    non_bg = np.where(np.any(row != [189, 146, 216], axis=-1))[0]
    # print sample
    print(f"y={y:3d}: non-sky pixels count={len(non_bg)}")
