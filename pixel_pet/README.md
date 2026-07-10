# 🐱 Antigravity Pixel Pet Studio (Lofi Edition)

An interactive, retro-modern, glassmorphic desktop environment mockup containing a cute pixel-art companion that you can interact with. Inspired by Tamagotchis, classic desktop Shimeji pets, and the Claude Pet.

## ✨ Features

- **🎮 4 Adorable Pet Types & Skins:**
  - **Momo 🐱 (Orange Cat)**: A lazy cat that loves napping and wiggling its tail.
  - **Kuro 🐈‍⬛ (Black Cat)**: A sleek dark cat with glowing yellow eyes.
  - **Bubbles 💧 (Cyan Slime)**: A bouncy, squishy, bouncy slime droplet.
  - **Cherry 🌸 (Pink Slime)**: A super cute blush-pink bouncy slime.
  - **Pochi 🐶 (Shiba Dog)**: A happy, panting puppy.
  - **Spooky 👻 (Ghost)**: A floating ghost that blinks and waves its tail.
- **✨ Dynamic Accessories:** Customize your pet in the shop by equipping hats and items on top of the pet:
  - Wizard Hat 🧙‍♂️ (spawns magic stars)
  - Gold Crown 👑
  - Chef Hat 👨‍🍳
  - Red Bow 🎀
  - Cool Glasses 🕶️
- **🧪 Desktop Simulation Physics:**
  - Grab your pet with your mouse/touch and **throw them** around the desktop! Watch them fall with realistic gravity and bounce off boundaries.
  - **Platform Landing:** The pet will land and walk on top of the headers of your open desktop windows! Close or drag windows to change their paths.
- **🍎 Full Care Interactions:**
  - **Feed:** Drops random treats (Sushi, Burger, Cookie, Fish). The pet runs to eat them, leaving food crumbs!
  - **Play:** Drops a rolling toy beach-ball. The pet will chase and push it with its nose.
  - **Pet:** Click/rub their head to show affection, releasing cute heart particles.
  - **Sleep:** Dim the desktop to night mode, turn on stars, and let your pet snore with `Zzz` notes.
- **🎹 8-Bit Retro Sound System (Web Audio API):**
  - Procedural sound effects for eating, jumping, petting, napping, level-up, and hit walls.
  - A loopable, chill, procedural 8-bit lofi background track!
- **🕹️ "Retro Catch" Minigame:**
  - A built-in arcade window game where you move your pet to catch falling treats and avoid red bombs. Earn "Pet Coins" to unlock cosmetics.

## 🚀 How to Run

1. Open your browser and go to:
   👉 **[http://localhost:8000](http://localhost:8000)**
2. Click **📻 Play BGM** to start the chiptune, and **🔊 Mute/Unmute** to manage sound effects.

## 📁 File Structure

- [index.html](file:///Users/wd/pixel-pet/index.html) - Simulated workspace layout and UI containers.
- [index.css](file:///Users/wd/pixel-pet/index.css) - Styling, glassmorphic UI, night themes, and star animations.
- [sprites.js](file:///Users/wd/pixel-pet/sprites.js) - Color-palette indexes, pixel art coordinate matrices (16x16), and dynamic rendering controls.
- [sound.js](file:///Users/wd/pixel-pet/sound.js) - Web Audio API synthesized procedural SFX and background melody.
- [app.js](file:///Users/wd/pixel-pet/app.js) - Physics engine, boundary collision, pathfinding AI, shop logic, and keyboard minigame.
