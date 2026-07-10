// Antigravity Pixel Pet - Core Application Logic

// Global State
const state = {
  pet: null,
  foods: [],
  toys: [],
  particles: [],
  coins: 100, // Start with some coins so they can buy something immediately!
  inventory: ['none'], // Unlocked accessories
  activeAccessory: 'none',
  currentWallpaper: 'cozy-night',
  unlockedPets: ['cat', 'slime', 'shiba', 'ghost'],
  activePetType: 'cat',
  activeColorPalette: 'cat', // maps to PALETTES in sprites.js
  isNightMode: false,
  logMessages: [],
  windows: {
    status: { open: true, x: 50, y: 80, width: 320, height: 280, minimized: false, zIndex: 10 },
    shop: { open: false, x: 420, y: 120, width: 340, height: 400, minimized: false, zIndex: 5 },
    game: { open: false, x: 200, y: 150, width: 450, height: 380, minimized: false, zIndex: 5 },
    logs: { open: true, x: 800, y: 500, width: 300, height: 200, minimized: false, zIndex: 5 }
  }
};

// Log logger helper
function addLog(message) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  state.logMessages.unshift(`[${time}] ${message}`);
  if (state.logMessages.length > 50) state.logMessages.pop();
  
  const logContent = document.getElementById('log-content');
  if (logContent) {
    logContent.innerHTML = state.logMessages.map(m => `<div class="log-line">${m}</div>`).join('');
  }
}

// Particle System
class Particle {
  constructor(x, y, type, text = '') {
    this.x = x;
    this.y = y;
    this.type = type; // 'heart', 'star', 'zzz', 'crumb', 'sparkle', 'coin', 'text'
    this.text = text;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = type === 'zzz' ? -1 - Math.random() : -2 - Math.random() * 2;
    this.alpha = 1.0;
    this.life = 0;
    this.maxLife = type === 'zzz' ? 120 : 60;
    this.size = type === 'zzz' ? 12 : 8 + Math.random() * 6;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.type === 'zzz') {
      this.vx += Math.sin(this.life / 10) * 0.1; // Drift left and right
    } else {
      this.vy += 0.05; // Gentle gravity for crumbs/sparkles
    }

    this.life++;
    this.alpha = 1 - (this.life / this.maxLife);
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    
    if (this.type === 'heart') {
      ctx.fillStyle = '#ff4757';
      ctx.font = `${this.size}px Arial`;
      ctx.fillText('❤️', this.x, this.y);
    } else if (this.type === 'star') {
      ctx.fillStyle = '#ffa502';
      ctx.font = `${this.size}px Arial`;
      ctx.fillText('⭐', this.x, this.y);
    } else if (this.type === 'zzz') {
      ctx.fillStyle = '#70a1ff';
      ctx.font = `bold ${this.size}px "Courier New", monospace`;
      ctx.fillText('Zzz', this.x, this.y);
    } else if (this.type === 'crumb') {
      ctx.fillStyle = '#f5cd79';
      ctx.fillRect(this.x, this.y, 4, 4);
    } else if (this.type === 'coin') {
      ctx.fillStyle = '#ffd32a';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff9f43';
      ctx.stroke();
    } else if (this.type === 'text') {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#1e272e';
      ctx.lineWidth = 3;
      ctx.font = `bold 12px "Press Start 2P", monospace`;
      ctx.strokeText(this.text, this.x, this.y);
      ctx.fillText(this.text, this.x, this.y);
    }
    
    ctx.restore();
  }
}

// Food class
class Food {
  constructor(x, y, type = 'sushi') {
    this.x = x;
    this.y = y;
    this.type = type; // 'sushi', 'fish', 'burger', 'cookie'
    this.vy = 0;
    this.gravity = 0.4;
    this.bounce = 0.2;
    this.isGround = false;
    this.width = 24;
    this.height = 24;
    this.ticks = 0;
    this.bounces = 0;
  }

  update(desktopWidth, groundY, platforms) {
    if (!this.isGround) {
      this.vy += this.gravity;
      this.y += this.vy;

      // Check landing on platforms (simulated windows)
      let landedOnPlatform = false;
      for (const plat of platforms) {
        if (this.x + this.width > plat.x && 
            this.x < plat.x + plat.width && 
            this.y + this.height >= plat.y && 
            this.y + this.height - this.vy <= plat.y + 10) {
          
          this.y = plat.y - this.height;
          this.vy = -this.vy * this.bounce;
          if (Math.abs(this.vy) < 1) {
            this.vy = 0;
            this.isGround = true;
          }
          landedOnPlatform = true;
          break;
        }
      }

      // Check ground collision
      if (!landedOnPlatform && this.y + this.height >= groundY) {
        this.y = groundY - this.height;
        this.vy = -this.vy * this.bounce;
        if (Math.abs(this.vy) < 1) {
          this.vy = 0;
          this.isGround = true;
        }
      }
    }
    this.ticks++;
  }

  draw(ctx) {
    ctx.save();
    // Enable crisp pixel rendering
    ctx.imageSmoothingEnabled = false;
    
    // Draw simple food pixel representations
    const px = this.x;
    const py = this.y;
    
    ctx.fillStyle = '#1e272e'; // Outline
    ctx.fillRect(px, py, this.width, this.height);

    if (this.type === 'sushi') {
      // Sushi inside
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px+2, py+2, this.width-4, this.height-4);
      ctx.fillStyle = '#ff4757'; // Salmon top
      ctx.fillRect(px+4, py+2, this.width-8, 6);
      ctx.fillStyle = '#2ed573'; // Wasabi side
      ctx.fillRect(px+6, py+12, 4, 4);
    } else if (this.type === 'fish') {
      ctx.fillStyle = '#74b9ff';
      ctx.fillRect(px+2, py+2, this.width-4, this.height-4);
      ctx.fillStyle = '#2f3542'; // eye
      ctx.fillRect(px+16, py+6, 4, 4);
      ctx.fillStyle = '#a4b0be'; // tail
      ctx.fillRect(px+2, py+6, 4, 12);
    } else if (this.type === 'burger') {
      ctx.fillStyle = '#eccc68'; // Buns
      ctx.fillRect(px+2, py+2, this.width-4, 4);
      ctx.fillRect(px+2, py+16, this.width-4, 4);
      ctx.fillStyle = '#ff4757'; // Tomato
      ctx.fillRect(px+2, py+6, this.width-4, 3);
      ctx.fillStyle = '#2ed573'; // Lettuce
      ctx.fillRect(px+2, py+9, this.width-4, 3);
      ctx.fillStyle = '#747d8c'; // Meat
      ctx.fillRect(px+4, py+12, this.width-8, 4);
    } else if (this.type === 'cookie') {
      ctx.fillStyle = '#f5cd79'; // Cookie base
      ctx.fillRect(px+2, py+2, this.width-4, this.height-4);
      ctx.fillStyle = '#57606f'; // Choc chips
      ctx.fillRect(px+6, py+6, 4, 4);
      ctx.fillRect(px+14, py+8, 4, 4);
      ctx.fillRect(px+10, py+14, 4, 4);
    }
    
    ctx.restore();
  }
}

// Toy Ball class
class ToyBall {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = 0;
    this.radius = 12;
    this.gravity = 0.4;
    this.bounce = 0.6;
    this.friction = 0.98;
    this.rotation = 0;
  }

  update(desktopWidth, groundY, platforms) {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;

    // Boundary walls
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx = -this.vx * this.bounce;
      audio.playBoing();
    }
    if (this.x + this.radius > desktopWidth) {
      this.x = desktopWidth - this.radius;
      this.vx = -this.vx * this.bounce;
      audio.playBoing();
    }

    // Platforms collision
    for (const plat of platforms) {
      if (this.x + this.radius > plat.x && 
          this.x - this.radius < plat.x + plat.width && 
          this.y + this.radius >= plat.y && 
          this.y + this.radius - this.vy <= plat.y + 10) {
        
        this.y = plat.y - this.radius;
        this.vy = -this.vy * this.bounce;
        this.vx += (Math.random() - 0.5) * 1; // minor roll variance
        if (Math.abs(this.vy) < 0.8) this.vy = 0;
        break;
      }
    }

    // Ground collision
    if (this.y + this.radius >= groundY) {
      this.y = groundY - this.radius;
      this.vy = -this.vy * this.bounce;
      if (Math.abs(this.vy) < 0.8) {
        this.vy = 0;
      }
    }

    // Update rotation based on horizontal movement
    this.rotation += this.vx * 0.1;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Draw cute pixel toy ball (beach ball style)
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4757';
    ctx.fill();
    ctx.strokeStyle = '#1e272e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Stripes
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.quadraticCurveTo(this.radius/2, 0, 0, this.radius);
    ctx.strokeStyle = '#ffd32a';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.quadraticCurveTo(-this.radius/2, 0, 0, this.radius);
    ctx.strokeStyle = '#74b9ff';
    ctx.stroke();

    ctx.restore();
  }
}

// Pet Class
class Pet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = 64;
    this.height = 64;
    this.scale = 4; // 16x16 grid * 4 = 64px
    
    // Physics
    this.gravity = 0.6;
    this.bounce = 0.15;
    this.friction = 0.95;
    this.isGrounded = false;
    this.currentPlatform = null; // references platform if standing on one

    // AI & States
    this.action = 'idle'; // idle, walk, sleep, eat, drag, happy
    this.direction = 1; // 1 = right, -1 = left
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDuration = 250; // ms per frame

    // Targets for pathfinding
    this.targetX = null;
    this.targetY = null;
    this.targetObject = null; // target food or toy

    // Pet dragging state
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    // Pet stats
    this.stats = {
      hunger: 80,    // 0 = starving, 100 = full
      energy: 90,    // 0 = exhausted, 100 = full energy
      love: 60,      // affection
      mood: 75       // overall mood
    };

    // Keep track of pet mood thresholds
    this.moodText = "Happy";
    
    // Timer loops
    this.aiTickTimer = 0;
    this.statsDepletionTimer = 0;
  }

  update(desktopWidth, groundY, platforms, deltaTime) {
    // 1. Stats Depletion (every 10 seconds)
    this.statsDepletionTimer += deltaTime;
    if (this.statsDepletionTimer >= 10000) {
      this.statsDepletionTimer = 0;
      this.depleteStats();
    }

    // 2. Dragging state vs Physics state
    if (this.isDragging) {
      this.action = 'drag';
      this.vx = (this.x - this.lastMouseX);
      this.vy = (this.y - this.lastMouseY);
      this.lastMouseX = this.x;
      this.lastMouseY = this.y;
      
      // Sweat drop / dizzy particles
      if (Math.random() < 0.08) {
        state.particles.push(new Particle(this.x + this.width / 2, this.y, 'crumb'));
      }
    } else {
      // Apply Physics
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= this.friction;

      // Platform collisions (falling onto window tops)
      let landed = false;
      this.currentPlatform = null;

      if (this.vy >= 0) { // Only land when falling
        for (const plat of platforms) {
          if (this.x + this.width - 15 > plat.x && 
              this.x + 15 < plat.x + plat.width && 
              this.y + this.height >= plat.y && 
              this.y + this.height - this.vy <= plat.y + 12) {
            
            this.y = plat.y - this.height;
            this.vy = 0;
            this.isGrounded = true;
            this.currentPlatform = plat;
            landed = true;
            break;
          }
        }
      }

      // Ground collision
      if (!landed && this.y + this.height >= groundY) {
        this.y = groundY - this.height;
        if (this.vy > 2) {
          // Play bounce effect
          audio.playBoing();
          this.vy = -this.vy * this.bounce;
        } else {
          this.vy = 0;
        }
        this.isGrounded = true;
        landed = true;
      }

      // Left / Right boundaries
      if (this.x < 0) {
        this.x = 0;
        this.vx = -this.vx * 0.3;
        this.direction = 1;
        audio.playHurt();
      }
      if (this.x + this.width > desktopWidth) {
        this.x = desktopWidth - this.width;
        this.vx = -this.vx * 0.3;
        this.direction = -1;
        audio.playHurt();
      }

      // If in mid-air
      if (Math.abs(this.vy) > 0.5) {
        this.isGrounded = false;
      }

      // 3. AI / Behavior Decisions (if grounded)
      if (this.isGrounded) {
        this.aiTickTimer += deltaTime;
        if (this.aiTickTimer >= 1000) { // Every 1 second
          this.aiTickTimer = 0;
          this.decideNextAction();
        }

        // Execute behavior
        this.executeBehavior(deltaTime);
      } else {
        // Air behavior
        if (this.action !== 'drag') {
          this.action = 'drag'; // look dizzy when falling
        }
      }
    }

    // 4. Update Animation Frames
    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.frameDuration) {
      this.frameTimer = 0;
      this.frameIndex++;
      
      // Zzz animation particles if sleeping
      if (this.action === 'sleep' && this.frameIndex % 2 === 0) {
        state.particles.push(new Particle(this.x + (this.direction > 0 ? 45 : 15), this.y + 10, 'zzz'));
        audio.playSnore();
      }
    }

    // 5. Update stats display text
    this.updateStatsDisplay();
  }

  depleteStats() {
    if (this.action === 'sleep') {
      this.stats.energy = Math.min(100, this.stats.energy + 12);
      this.stats.hunger = Math.max(0, this.stats.hunger - 2);
    } else {
      this.stats.energy = Math.max(0, this.stats.energy - 3);
      this.stats.hunger = Math.max(0, this.stats.hunger - 4);
    }
    
    // Affection drops very slowly if ignored
    this.stats.love = Math.max(0, this.stats.love - 1);
    
    // Mood is an average of other stats
    this.stats.mood = Math.round((this.stats.hunger + this.stats.energy + this.stats.love) / 3);

    // Warn user if starving or exhausted
    if (this.stats.hunger < 20) {
      addLog(`${this.getPetName()} is starving! Feed them!`);
    }
    if (this.stats.energy < 20 && this.action !== 'sleep') {
      addLog(`${this.getPetName()} is exhausted and wants to sleep.`);
    }
  }

  getPetName() {
    const names = {
      cat: 'Momo 🐱',
      blackCat: 'Kuro 🐈‍⬛',
      slime: 'Bubbles 💧',
      pinkSlime: 'Cherry 🌸',
      shiba: 'Pochi 🐶',
      ghost: 'Spooky 👻'
    };
    return names[state.activePetType] || 'Pet';
  }

  updateStatsDisplay() {
    const hungerBar = document.getElementById('hunger-bar');
    const energyBar = document.getElementById('energy-bar');
    const loveBar = document.getElementById('love-bar');
    const moodVal = document.getElementById('mood-value');
    const coinCount = document.getElementById('coin-count');

    if (hungerBar) hungerBar.style.width = `${this.stats.hunger}%`;
    if (energyBar) energyBar.style.width = `${this.stats.energy}%`;
    if (loveBar) loveBar.style.width = `${this.stats.love}%`;
    
    // Set Mood status label
    if (this.stats.mood > 80) this.moodText = "Ecstatic ✨";
    else if (this.stats.mood > 60) this.moodText = "Happy 😊";
    else if (this.stats.mood > 40) this.moodText = "Content 😐";
    else if (this.stats.mood > 20) this.moodText = "Sad / Hungry 🥺";
    else this.moodText = "Depressed 😭";

    if (moodVal) moodVal.innerText = `${this.moodText} (${this.stats.mood}%)`;
    if (coinCount) coinCount.innerText = state.coins;
  }

  decideNextAction() {
    // If sleeping or eating, don't interrupt immediately unless special triggers
    if (this.action === 'sleep' || this.action === 'eat' || this.action === 'happy') {
      // Sleep finishes when energy is high
      if (this.action === 'sleep' && this.stats.energy >= 98) {
        this.action = 'idle';
        addLog(`${this.getPetName()} woke up full of energy!`);
      }
      return;
    }

    // 1. Food Attraction
    if (state.foods.length > 0) {
      // Find nearest food
      let nearestFood = null;
      let minDist = Infinity;
      for (const food of state.foods) {
        const dist = Math.abs(food.x - this.x);
        // Only target if food is on the same level (approx same Y) or pet is on ground and food is on ground
        if (dist < minDist) {
          minDist = dist;
          nearestFood = food;
        }
      }
      
      if (nearestFood) {
        this.targetObject = nearestFood;
        this.action = 'walk';
        this.targetX = nearestFood.x;
        addLog(`${this.getPetName()} smelled food and is walking over!`);
        return;
      }
    }

    // 2. Toy Chase
    if (state.toys.length > 0 && Math.random() < 0.6) {
      const nearestToy = state.toys[0]; // grab the toy
      this.targetObject = nearestToy;
      this.action = 'walk';
      this.targetX = nearestToy.x;
      return;
    }

    // 3. Regular Wandering
    if (Math.random() < 0.35) { // 35% chance to change state
      const choices = ['idle', 'walk', 'idle', 'walk'];
      const chosen = choices[Math.floor(Math.random() * choices.length)];
      
      if (chosen === 'walk') {
        this.action = 'walk';
        // Pick target within boundaries
        const boundaryWidth = document.getElementById('desktop').clientWidth;
        // Wander around current level
        if (this.currentPlatform) {
          // Wander within platform bounds
          this.targetX = this.currentPlatform.x + Math.random() * (this.currentPlatform.width - this.width);
        } else {
          // Wander on ground
          this.targetX = Math.random() * (boundaryWidth - this.width);
        }
        this.targetObject = null;
      } else {
        this.action = 'idle';
        this.targetX = null;
      }
    }
  }

  executeBehavior(deltaTime) {
    if (this.action === 'walk' && this.targetX !== null) {
      const speed = this.stats.energy < 30 ? 1.0 : 2.0; // slower if tired
      const diffX = this.targetX - this.x;
      
      // Update orientation
      if (diffX > 5) {
        this.direction = 1; // right
        this.vx = speed;
      } else if (diffX < -5) {
        this.direction = -1; // left
        this.vx = -speed;
      } else {
        // Arrived at target
        this.vx = 0;
        this.targetX = null;
        
        // If we were chasing food/toy, interact!
        if (this.targetObject) {
          if (this.targetObject instanceof Food) {
            this.eatFood(this.targetObject);
          } else if (this.targetObject instanceof ToyBall) {
            this.playWithToy(this.targetObject);
          }
          this.targetObject = null;
        } else {
          this.action = 'idle';
        }
      }
    }

    if (this.action === 'eat' && this.targetObject) {
      this.vx = 0;
      // Chewing animation tick handled by render frames. We stay in eating state for 2 seconds.
      // Every bite releases crumbs
      if (Math.random() < 0.2) {
        state.particles.push(new Particle(this.x + (this.direction > 0 ? 40 : 15), this.y + 40, 'crumb'));
      }
    }
  }

  eatFood(food) {
    this.action = 'eat';
    this.targetObject = food;
    audio.playEat();
    
    setTimeout(() => {
      // Remove food from global list
      const idx = state.foods.indexOf(food);
      if (idx > -1) state.foods.splice(idx, 1);

      // Increase stats
      this.stats.hunger = Math.min(100, this.stats.hunger + 30);
      this.stats.energy = Math.min(100, this.stats.energy + 10);
      this.stats.love = Math.min(100, this.stats.love + 5);
      
      // Earn Coins!
      const earnedCoins = 15;
      state.coins += earnedCoins;
      audio.playSuccess();
      
      state.particles.push(new Particle(this.x + this.width/2, this.y, 'text', `+${earnedCoins} Coins!`));
      addLog(`${this.getPetName()} finished eating and gained ${earnedCoins} coins!`);
      
      // Bouncing happy celebrate
      this.celebrate();
    }, 2000);
  }

  playWithToy(toy) {
    // Push the toy in the direction the pet is walking
    toy.vx = this.direction * 6;
    toy.vy = -4; // slight bounce
    audio.playBoing();

    this.stats.energy = Math.max(10, this.stats.energy - 8);
    this.stats.love = Math.min(100, this.stats.love + 10);
    state.coins += 5;
    
    state.particles.push(new Particle(toy.x, toy.y - 10, 'text', '+5!'));
    
    // Jump in joy
    this.vy = -5;
    this.action = 'happy';
    setTimeout(() => {
      this.action = 'idle';
    }, 800);
  }

  celebrate() {
    this.action = 'happy';
    this.vy = -6; // jump!
    audio.playLove();
    
    // Spawn heart particles
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        state.particles.push(new Particle(this.x + this.width/2 + (Math.random()-0.5)*20, this.y + 10, 'heart'));
      }, i * 150);
    }

    setTimeout(() => {
      this.action = 'idle';
    }, 1500);
  }

  pet() {
    // Click / Rub pet
    this.stats.love = Math.min(100, this.stats.love + 8);
    audio.playLove();
    state.particles.push(new Particle(this.x + this.width / 2, this.y + 15, 'heart'));
    
    if (this.action !== 'sleep') {
      this.action = 'happy';
      setTimeout(() => {
        if (this.action === 'happy') this.action = 'idle';
      }, 1000);
    }
  }

  draw(ctx) {
    const spriteMatrix = getPetSprite(state.activePetType, this.action, this.frameIndex);
    const palette = PALETTES[state.activeColorPalette] || PALETTES[state.activePetType];
    const flipX = this.direction === -1;

    // Wizard hats or ribbons offset adjusts depending on sleeping/dragging poses
    let accOffset = { x: 0, y: -2 };
    if (this.action === 'sleep') {
      accOffset = { x: this.direction === 1 ? -1 : 1, y: 3 };
    } else if (this.action === 'drag') {
      accOffset = { x: 0, y: -4 };
    }

    drawPixelSprite(
      ctx,
      spriteMatrix,
      this.x,
      this.y,
      this.scale,
      flipX,
      palette,
      state.activeAccessory === 'none' ? null : state.activeAccessory,
      accOffset
    );
  }
}

// OS Window drag logic
let draggingWindow = null;
let winDragOffsetX = 0;
let winDragOffsetY = 0;

function setupWindowDragging() {
  const headers = document.querySelectorAll('.window-header');
  
  headers.forEach(header => {
    header.addEventListener('mousedown', e => {
      const win = header.parentElement;
      const winId = win.id.replace('window-', '');
      
      draggingWindow = winId;
      winDragOffsetX = e.clientX - win.offsetLeft;
      winDragOffsetY = e.clientY - win.offsetTop;
      
      // Bring clicked window to top
      focusWindow(winId);
      e.preventDefault();
    });
  });

  window.addEventListener('mousemove', e => {
    if (!draggingWindow) return;
    
    const win = document.getElementById(`window-${draggingWindow}`);
    const desktop = document.getElementById('desktop');
    
    let newX = e.clientX - winDragOffsetX;
    let newY = e.clientY - winDragOffsetY;
    
    // Keep window inside desktop boundaries
    newX = Math.max(0, Math.min(newX, desktop.clientWidth - win.clientWidth));
    newY = Math.max(0, Math.min(newY, desktop.clientHeight - win.clientHeight));
    
    win.style.left = `${newX}px`;
    win.style.top = `${newY}px`;
    
    // Save to state
    state.windows[draggingWindow].x = newX;
    state.windows[draggingWindow].y = newY;
  });

  window.addEventListener('mouseup', () => {
    draggingWindow = null;
  });
}

function focusWindow(winId) {
  // Reset all z-indexes
  Object.keys(state.windows).forEach(key => {
    const w = document.getElementById(`window-${key}`);
    if (w) w.style.zIndex = 5;
    state.windows[key].zIndex = 5;
  });
  
  // Set focused z-index
  const focusedWin = document.getElementById(`window-${winId}`);
  if (focusedWin) {
    focusedWin.style.zIndex = 10;
    state.windows[winId].zIndex = 10;
  }
}

function openWindow(winId) {
  const win = document.getElementById(`window-${winId}`);
  if (win) {
    win.classList.remove('hidden');
    state.windows[winId].open = true;
    focusWindow(winId);
  }
}

function closeWindow(winId) {
  const win = document.getElementById(`window-${winId}`);
  if (win) {
    win.classList.add('hidden');
    state.windows[winId].open = false;
  }
}

// Retrieve bounding rects of open windows so pet can walk on them
function getPlatformRects() {
  const platforms = [];
  Object.keys(state.windows).forEach(key => {
    const winState = state.windows[key];
    const winEl = document.getElementById(`window-${key}`);
    
    if (winState.open && winEl && !winEl.classList.contains('hidden')) {
      platforms.push({
        x: winEl.offsetLeft,
        y: winEl.offsetTop,
        width: winEl.clientWidth,
        height: winEl.clientHeight
      });
    }
  });
  return platforms;
}

// Initialise Application
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('pet-canvas');
  const ctx = canvas.getContext('2d');
  
  // Resize Canvas to fill desktop
  const desktop = document.getElementById('desktop');
  function resizeCanvas() {
    canvas.width = desktop.clientWidth;
    canvas.height = desktop.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Spawning Pet at center ground
  const groundY = desktop.clientHeight - 40; // taskbar top
  state.pet = new Pet(desktop.clientWidth / 2 - 32, groundY - 64);
  
  // Setup Window drag listeners
  setupWindowDragging();
  
  // Feed button drops food
  const feedBtn = document.getElementById('btn-feed');
  feedBtn.addEventListener('click', () => {
    const foodTypes = ['sushi', 'fish', 'burger', 'cookie'];
    const chosenType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
    
    // Spawn food near cursor or random top
    const rx = 100 + Math.random() * (desktop.clientWidth - 200);
    const ry = 50;
    
    const newFood = new Food(rx, ry, chosenType);
    state.foods.push(newFood);
    
    addLog(`Dropped a piece of ${chosenType}!`);
    audio.playBoing();
    
    // Awaken pet if sleeping
    if (state.pet.action === 'sleep') {
      state.pet.action = 'idle';
      addLog(`${state.pet.getPetName()} woke up to the smell of food!`);
    }
  });

  // Play button drops toy ball
  const playBtn = document.getElementById('btn-play');
  playBtn.addEventListener('click', () => {
    if (state.toys.length >= 2) {
      addLog(`Too many toys on screen!`);
      return;
    }
    const rx = 150 + Math.random() * (desktop.clientWidth - 300);
    const newToy = new ToyBall(rx, 50);
    state.toys.push(newToy);
    addLog(`Dropped a toy ball!`);
    audio.playBoing();

    // Awaken pet if sleeping
    if (state.pet.action === 'sleep') {
      state.pet.action = 'idle';
    }
  });

  // Pet action button
  const petBtn = document.getElementById('btn-pet');
  petBtn.addEventListener('click', () => {
    state.pet.pet();
    addLog(`You petted ${state.pet.getPetName()}!`);
  });

  // Sleep toggle
  const sleepBtn = document.getElementById('btn-sleep');
  sleepBtn.addEventListener('click', () => {
    if (state.pet.action === 'sleep') {
      state.pet.action = 'idle';
      sleepBtn.innerText = '💤 Sleep';
      addLog(`${state.pet.getPetName()} woke up!`);
      toggleDayNight(false);
    } else {
      state.pet.action = 'sleep';
      sleepBtn.innerText = '☀️ Wake';
      addLog(`${state.pet.getPetName()} fell asleep. Zzz...`);
      toggleDayNight(true);
    }
  });

  // Sound and Music triggers
  const btnMusic = document.getElementById('btn-music');
  btnMusic.addEventListener('click', () => {
    if (audio.isPlayingBGM) {
      audio.stopBGM();
      btnMusic.innerText = '📻 Play BGM';
      btnMusic.classList.remove('active');
    } else {
      audio.startBGM();
      btnMusic.innerText = '📻 Pause BGM';
      btnMusic.classList.add('active');
    }
  });

  const btnMute = document.getElementById('btn-mute');
  btnMute.addEventListener('click', () => {
    const isMuted = audio.toggleMute();
    btnMute.innerText = isMuted ? '🔇 Unmute SFX' : '🔊 Mute SFX';
  });

  // Day/Night switch
  function toggleDayNight(isNight) {
    state.isNightMode = isNight;
    const desktop = document.getElementById('desktop');
    if (isNight) {
      desktop.classList.add('night-theme');
      addLog(`Night time falls...`);
    } else {
      desktop.classList.remove('night-theme');
      addLog(`Morning rises!`);
    }
  }

  // Pet Drag & Drop event handlers (Mouse & Touch)
  let grabOffsetX = 0;
  let grabOffsetY = 0;

  function grabPet(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    // Check if click was inside pet boundaries
    if (mx >= state.pet.x && mx <= state.pet.x + state.pet.width &&
        my >= state.pet.y && my <= state.pet.y + state.pet.height) {
      
      state.pet.isDragging = true;
      state.pet.isGrounded = false;
      state.pet.targetX = null;
      state.pet.targetObject = null;
      grabOffsetX = mx - state.pet.x;
      grabOffsetY = my - state.pet.y;
      state.pet.lastMouseX = state.pet.x;
      state.pet.lastMouseY = state.pet.y;
      
      audio.playBoing();
      addLog(`Grabbed ${state.pet.getPetName()}!`);
    }
  }

  function movePet(clientX, clientY) {
    if (!state.pet.isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    
    state.pet.x = mx - grabOffsetX;
    state.pet.y = my - grabOffsetY;
  }

  function releasePet() {
    if (!state.pet.isDragging) return;
    state.pet.isDragging = false;
    addLog(`Threw ${state.pet.getPetName()}!`);
  }

  // Mouse Listeners
  canvas.addEventListener('mousedown', e => grabPet(e.clientX, e.clientY));
  window.addEventListener('mousemove', e => movePet(e.clientX, e.clientY));
  window.addEventListener('mouseup', releasePet);

  // Touch Listeners (Mobile compatibility)
  canvas.addEventListener('touchstart', e => {
    if (e.touches.length > 0) grabPet(e.touches[0].clientX, e.touches[0].clientY);
  });
  window.addEventListener('touchmove', e => {
    if (e.touches.length > 0) movePet(e.touches[0].clientX, e.touches[0].clientY);
  });
  window.addEventListener('touchend', releasePet);

  // Quick action icons on simulated desktop
  document.getElementById('icon-shop').addEventListener('click', () => openWindow('shop'));
  document.getElementById('icon-game').addEventListener('click', () => openWindow('game'));
  document.getElementById('icon-status').addEventListener('click', () => openWindow('status'));
  document.getElementById('icon-logs').addEventListener('click', () => openWindow('logs'));

  // Close button handlers
  document.querySelectorAll('.btn-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const winId = btn.closest('.window-frame').id.replace('window-', '');
      closeWindow(winId);
    });
  });

  // Shop setup
  setupShop();

  // Minigame setup
  setupMinigame();

  // Main Loop Variables
  let lastTime = performance.now();

  function mainLoop(time) {
    const deltaTime = time - lastTime;
    lastTime = time;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const activeGroundY = canvas.height - 40; // taskbar top
    const platforms = getPlatformRects();

    // 1. Update & Draw Food
    for (let i = state.foods.length - 1; i >= 0; i--) {
      const food = state.foods[i];
      food.update(canvas.width, activeGroundY, platforms);
      food.draw(ctx);
    }

    // 2. Update & Draw Toys
    for (let i = state.toys.length - 1; i >= 0; i--) {
      const toy = state.toys[i];
      toy.update(canvas.width, activeGroundY, platforms);
      toy.draw(ctx);

      // Check if pet touches toy ball (and isn't dragging, eating, or sleeping)
      const dist = Math.sqrt(Math.pow((state.pet.x + 32) - toy.x, 2) + Math.pow((state.pet.y + 32) - toy.y, 2));
      if (dist < 40 && state.pet.action === 'walk' && state.pet.targetObject === toy) {
        state.pet.playWithToy(toy);
      }
    }

    // 3. Update & Draw Pet
    state.pet.update(canvas.width, activeGroundY, platforms, deltaTime);
    state.pet.draw(ctx);

    // 4. Update & Draw Particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.update();
      p.draw(ctx);
      if (p.life >= p.maxLife) {
        state.particles.splice(i, 1);
      }
    }

    requestAnimationFrame(mainLoop);
  }

  // Start loop
  requestAnimationFrame(mainLoop);
  addLog(`Pet Studio initialized! Welcome your new companion.`);
});

// Shop Logic
function setupShop() {
  const shopContent = document.getElementById('shop-items-container');
  
  // Custom accessories list
  const shopItems = [
    { id: 'glasses', name: 'Cool Glasses', cost: 30, desc: 'Make your pet look extremely smart.', type: 'accessory' },
    { id: 'bow', name: 'Cute Ribbon', cost: 40, desc: 'A beautiful red bow-tie ribbon.', type: 'accessory' },
    { id: 'chefHat', name: 'Chef Hat', cost: 60, desc: 'For pets that love to cook (or eat).', type: 'accessory' },
    { id: 'wizardHat', name: 'Wizard Hat', cost: 100, desc: 'Spawns wizard sparks. Magical!', type: 'accessory' },
    { id: 'crown', name: 'Gold Crown', cost: 150, desc: 'Fits a royal pixel pet perfectly.', type: 'accessory' },
    
    // Pet Skins
    { id: 'skin-blackCat', name: 'Black Cat Skin', cost: 80, desc: 'Unlock Kuro the Black Cat.', type: 'skin', petType: 'blackCat' },
    { id: 'skin-pinkSlime', name: 'Pink Slime Skin', cost: 80, desc: 'Unlock Cherry the Pink Slime.', type: 'skin', petType: 'pinkSlime' },
    { id: 'skin-shiba', name: 'Shiba Dog Skin', cost: 120, desc: 'Unlock Pochi the Shiba Dog.', type: 'skin', petType: 'shiba' },
    { id: 'skin-ghost', name: 'Spooky Ghost Skin', cost: 120, desc: 'Unlock Spooky the floating Ghost.', type: 'skin', petType: 'ghost' },
  ];

  function renderShop() {
    shopContent.innerHTML = shopItems.map(item => {
      const isOwned = state.inventory.includes(item.id);
      const isEquipped = state.activeAccessory === item.id || (item.type === 'skin' && state.activePetType === item.petType);
      
      let actionBtnText = `Buy (${item.cost} c)`;
      let btnClass = 'btn-buy';
      if (isOwned) {
        if (isEquipped) {
          actionBtnText = 'Equipped';
          btnClass = 'btn-equip active';
        } else {
          actionBtnText = 'Equip';
          btnClass = 'btn-equip';
        }
      }

      return `
        <div class="shop-card">
          <div class="shop-card-info">
            <div class="shop-card-title">${item.name}</div>
            <div class="shop-card-desc">${item.desc}</div>
          </div>
          <button class="shop-btn ${btnClass}" data-id="${item.id}">${actionBtnText}</button>
        </div>
      `;
    }).join('');

    // Attach click listeners to buy/equip buttons
    shopContent.querySelectorAll('.shop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-id');
        const item = shopItems.find(i => i.id === itemId);
        
        if (state.inventory.includes(itemId)) {
          // Equip logic
          if (item.type === 'accessory') {
            if (state.activeAccessory === itemId) {
              state.activeAccessory = 'none'; // unequip
              addLog(`Unequipped ${item.name}.`);
            } else {
              state.activeAccessory = itemId;
              addLog(`Equipped ${item.name}!`);
              audio.playSuccess();
            }
          } else if (item.type === 'skin') {
            state.activePetType = item.petType;
            state.activeColorPalette = item.petType;
            addLog(`Switched pet to ${item.name}!`);
            audio.playSuccess();
          }
        } else {
          // Buy logic
          if (state.coins >= item.cost) {
            state.coins -= item.cost;
            state.inventory.push(itemId);
            addLog(`Bought ${item.name}!`);
            audio.playSuccess();
          } else {
            addLog(`Not enough coins to buy ${item.name}!`);
            audio.playHurt();
          }
        }
        
        renderShop();
        state.pet.updateStatsDisplay();
      });
    });
  }

  renderShop();
  // Expose renderShop globally so other events can trigger it
  window.renderShop = renderShop;
}

// Catch Food Minigame
function setupMinigame() {
  const gameCanvas = document.getElementById('minigame-canvas');
  const gameCtx = gameCanvas.getContext('2d');
  const startBtn = document.getElementById('btn-start-game');
  
  let gameRunning = false;
  let score = 0;
  let petX = gameCanvas.width / 2 - 24;
  const petY = gameCanvas.height - 48;
  const petWidth = 48;
  const petHeight = 48;
  let gameItems = [];
  let keys = {};
  let gameLoopId = null;
  let spawnTimer = 0;
  
  window.addEventListener('keydown', e => {
    keys[e.key] = true;
  });
  window.addEventListener('keyup', e => {
    keys[e.key] = false;
  });

  startBtn.addEventListener('click', () => {
    if (gameRunning) {
      stopGame();
    } else {
      startGame();
    }
  });

  function startGame() {
    gameRunning = true;
    score = 0;
    gameItems = [];
    petX = gameCanvas.width / 2 - 24;
    startBtn.innerText = '🛑 Stop Game';
    addLog(`Starting minigame! Use Left/Right arrows or mouse to move.`);
    audio.playSuccess();
    
    // Focus minigame window
    focusWindow('game');

    // Attach mouse movement in minigame canvas
    gameCanvas.addEventListener('mousemove', handleCanvasMouseMove);

    lastTime = performance.now();
    gameLoopId = requestAnimationFrame(gameLoop);
  }

  function stopGame() {
    gameRunning = false;
    startBtn.innerText = '🎮 Start Catch Game';
    cancelAnimationFrame(gameLoopId);
    gameCanvas.removeEventListener('mousemove', handleCanvasMouseMove);
    
    // Clear minigame screen
    gameCtx.fillStyle = '#2f3542';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameCtx.fillStyle = '#ffffff';
    gameCtx.font = '14px "Press Start 2P"';
    gameCtx.textAlign = 'center';
    gameCtx.fillText('GAME OVER', gameCanvas.width / 2, gameCanvas.height / 2 - 10);
    gameCtx.fillText(`Coins Earned: ${score}`, gameCanvas.width / 2, gameCanvas.height / 2 + 20);
    
    // Award coins to player!
    state.coins += score;
    state.pet.updateStatsDisplay();
    if (window.renderShop) window.renderShop(); // Refresh shop button states with new coins
    addLog(`Minigame ended. You earned ${score} coins!`);
  }

  function handleCanvasMouseMove(e) {
    const rect = gameCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    petX = mx - petWidth / 2;
    // Bound constraints
    petX = Math.max(0, Math.min(petX, gameCanvas.width - petWidth));
  }

  let lastTime = 0;

  function gameLoop(time) {
    if (!gameRunning) return;
    const dt = time - lastTime;
    lastTime = time;

    // Update Pet position with Keyboard
    if (keys['ArrowLeft'] || keys['a']) {
      petX = Math.max(0, petX - 5);
    }
    if (keys['ArrowRight'] || keys['d']) {
      petX = Math.min(gameCanvas.width - petWidth, petX + 5);
    }

    // Spawn falling items (food vs bombs)
    spawnTimer += dt;
    if (spawnTimer >= 800) {
      spawnTimer = 0;
      const isBomb = Math.random() < 0.25; // 25% chance of bomb
      gameItems.push({
        x: Math.random() * (gameCanvas.width - 20),
        y: 0,
        speed: 2 + Math.random() * 3,
        type: isBomb ? 'bomb' : 'food',
        color: isBomb ? '#ff4757' : '#2ed573',
        size: 16
      });
    }

    // Update Items
    for (let i = gameItems.length - 1; i >= 0; i--) {
      const item = gameItems[i];
      item.y += item.speed;

      // Check collision with pet
      if (item.x + item.size > petX &&
          item.x < petX + petWidth &&
          item.y + item.size > petY &&
          item.y < petY + petHeight) {
        
        // Colllision!
        gameItems.splice(i, 1);
        if (item.type === 'food') {
          score += 5;
          audio.playEat();
        } else {
          // Hit bomb!
          audio.playHurt();
          stopGame();
          return;
        }
        continue;
      }

      // Check boundary fall
      if (item.y > gameCanvas.height) {
        gameItems.splice(i, 1);
      }
    }

    // Render Game Canvas
    // Clear
    gameCtx.fillStyle = '#2f3542';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw Grid Lines (Retro background style)
    gameCtx.strokeStyle = '#3e4453';
    gameCtx.lineWidth = 1;
    for (let x = 0; x < gameCanvas.width; x += 30) {
      gameCtx.beginPath();
      gameCtx.moveTo(x, 0);
      gameCtx.lineTo(x, gameCanvas.height);
      gameCtx.stroke();
    }
    for (let y = 0; y < gameCanvas.height; y += 30) {
      gameCtx.beginPath();
      gameCtx.moveTo(0, y);
      gameCtx.lineTo(gameCanvas.width, y);
      gameCtx.stroke();
    }

    // Draw Falling items
    gameItems.forEach(item => {
      gameCtx.save();
      gameCtx.fillStyle = item.color;
      if (item.type === 'food') {
        // Draw apple pixel-like
        gameCtx.fillRect(item.x, item.y, item.size, item.size);
        gameCtx.fillStyle = '#2ed573'; // Leaf
        gameCtx.fillRect(item.x + 6, item.y - 4, 4, 4);
      } else {
        // Draw Bomb
        gameCtx.beginPath();
        gameCtx.arc(item.x + item.size/2, item.y + item.size/2, item.size/2, 0, Math.PI*2);
        gameCtx.fillStyle = '#1e272e';
        gameCtx.fill();
        // Fuse spark
        gameCtx.fillStyle = '#ffd32a';
        gameCtx.fillRect(item.x + item.size/2 + 2, item.y - 2, 4, 4);
      }
      gameCtx.restore();
    });

    // Draw Pet mascot
    const spriteMatrix = getPetSprite(state.activePetType, 'idle', Math.floor(time / 250));
    const palette = PALETTES[state.activeColorPalette] || PALETTES[state.activePetType];
    
    // Draw pet in minigame canvas (scaled to 3)
    drawPixelSprite(gameCtx, spriteMatrix, petX, petY, 3, false, palette, state.activeAccessory === 'none' ? null : state.activeAccessory, { x: 0, y: -2 });

    // Draw Score UI
    gameCtx.fillStyle = '#ffffff';
    gameCtx.font = '10px "Press Start 2P"';
    gameCtx.textAlign = 'left';
    gameCtx.fillText(`Score/Coins: ${score}`, 15, 25);

    gameLoopId = requestAnimationFrame(gameLoop);
  }
}
