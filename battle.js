window.initBattleEngine = function(bossType) {
  const canvas = document.getElementById('battleCanvas');
  const ctx = canvas.getContext('2d');
  
  // Game state
  let isGameOver = false;
  let isWin = false;
  let startTime = Date.now();
  const survivalTimeMs = 30000; // Increased to 30 seconds for more patterns
  let lastTime = Date.now();
  
  // Player state
  const player = {
    x: 320,
    y: 350,
    size: 14,
    speed: 250, 
    hp: 50,
    maxHp: 50,
    invulnTime: 0
  };
  
  // Input tracking
  const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
  const handleKeyDown = (e) => { if(keys.hasOwnProperty(e.code)) keys[e.code] = true; };
  const handleKeyUp = (e) => { if(keys.hasOwnProperty(e.code)) keys[e.code] = false; };
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Arena bounds
  const arena = { x: 120, y: 160, w: 400, h: 280 };

  // Entities
  let bullets = [];
  let warnings = [];
  let stateTimer = 0;
  let phase = 0; // Defines the current attack pattern

  // Utility to add bullets
  const addBullet = (b) => {
    bullets.push({
      x: b.x, y: b.y, vx: b.vx || 0, vy: b.vy || 0, 
      width: b.width || b.size, height: b.height || b.size,
      type: b.type || 'circle', color: b.color || '#fff',
      update: b.update, customData: b.customData || {}
    });
  };

  // 溪湖 (Xihu) Attack Patterns
  const xihuAttacks = (dt, elapsed) => {
    stateTimer -= dt;
    if (stateTimer <= 0) {
      phase = Math.floor(Math.random() * 3);
      stateTimer = 2.5; // Change pattern every 2.5 seconds
    }

    if (phase === 0 && Math.random() < 0.2) {
      // Pattern 1: Grape Rain
      addBullet({
        x: arena.x + Math.random() * arena.w,
        y: arena.y - 20,
        vy: 100 + Math.random() * 100,
        vx: (Math.random() - 0.5) * 40,
        size: 10, type: 'circle', color: '#8e44ad'
      });
    } else if (phase === 1 && Math.random() < 0.05) {
      // Pattern 2: Sheep Stampede (Horizontal)
      const isLeft = Math.random() > 0.5;
      addBullet({
        x: isLeft ? arena.x - 30 : arena.x + arena.w + 30,
        y: arena.y + 20 + Math.random() * (arena.h - 40),
        vx: isLeft ? 150 : -150,
        vy: Math.random() > 0.5 ? 30 : -30, // Bounce effect
        width: 20, height: 16, type: 'rect', color: '#ecf0f1',
        update: function(dt) {
           this.y += this.vy * dt;
           if (this.y < arena.y || this.y > arena.y + arena.h - this.height) this.vy *= -1;
        }
      });
    } else if (phase === 2 && Math.random() < 0.03) {
      // Pattern 3: Sugar Train (Warning then dash)
      const isLeft = Math.random() > 0.5;
      const yPos = arena.y + 20 + Math.random() * (arena.h - 60);
      warnings.push({ x: arena.x, y: yPos, w: arena.w, h: 40, life: 1.0 });
      
      setTimeout(() => {
        addBullet({
          x: isLeft ? arena.x - 100 : arena.x + arena.w + 100,
          y: yPos,
          vx: isLeft ? 600 : -600, // Very fast
          width: 80, height: 40, type: 'rect', color: '#27ae60'
        });
      }, 1000); // 1 second warning
    }
  };

  // 前鎮 (Qianzhen) Attack Patterns
  const qianzhenAttacks = (dt, elapsed) => {
    stateTimer -= dt;
    if (stateTimer <= 0) {
      phase = Math.floor(Math.random() * 3);
      stateTimer = 3.0;
    }

    if (phase === 0 && Math.random() < 0.15) {
      // Pattern 1: Falling Containers
      addBullet({
        x: arena.x + Math.random() * arena.w,
        y: arena.y - 40,
        vy: 200 + Math.random() * 150,
        width: 30, height: 30, type: 'rect', color: '#1689d8'
      });
    } else if (phase === 1 && Math.random() < 0.02) {
      // Pattern 2: Ferris Wheel Spawner
      addBullet({
        x: arena.x + arena.w / 2,
        y: arena.y + 40,
        size: 30, type: 'circle', color: '#f39c12',
        customData: { angle: 0, life: 5.0, shotTimer: 0 },
        update: function(dt) {
          this.customData.life -= dt;
          this.customData.angle += dt * 2;
          this.customData.shotTimer -= dt;
          if (this.customData.shotTimer <= 0) {
            this.customData.shotTimer = 0.2;
            for(let i=0; i<4; i++) {
              let a = this.customData.angle + i * (Math.PI / 2);
              addBullet({
                x: this.x, y: this.y,
                vx: Math.cos(a) * 120, vy: Math.sin(a) * 120,
                size: 8, type: 'circle', color: '#e67e22'
              });
            }
          }
          if (this.customData.life <= 0) this.y = -999; // mark for deletion
        }
      });
    } else if (phase === 2 && Math.random() < 0.04) {
      // Pattern 3: Light Rail Slash (Vertical)
      const xPos = arena.x + 20 + Math.random() * (arena.w - 60);
      warnings.push({ x: xPos, y: arena.y, w: 40, h: arena.h, life: 0.8 });
      
      setTimeout(() => {
        addBullet({
          x: xPos,
          y: arena.y - 100,
          vy: 700,
          width: 40, height: 80, type: 'rect', color: '#3498db'
        });
      }, 800);
    }
  };

  // Game Loop
  const loop = () => {
    if (isGameOver || isWin) return;

    const now = Date.now();
    const dt = Math.min((now - lastTime) / 1000, 0.05); // cap dt
    lastTime = now;
    const elapsed = now - startTime;

    // Update Player
    if (keys.ArrowUp) player.y -= player.speed * dt;
    if (keys.ArrowDown) player.y += player.speed * dt;
    if (keys.ArrowLeft) player.x -= player.speed * dt;
    if (keys.ArrowRight) player.x += player.speed * dt;

    // Clamp to arena
    player.x = Math.max(arena.x + player.size/2, Math.min(arena.x + arena.w - player.size/2, player.x));
    player.y = Math.max(arena.y + player.size/2, Math.min(arena.y + arena.h - player.size/2, player.y));

    if (player.invulnTime > 0) player.invulnTime -= dt;

    // Boss Attacks
    if (bossType === 'xihu') xihuAttacks(dt, elapsed);
    else qianzhenAttacks(dt, elapsed);

    // Update Warnings
    for (let i = warnings.length - 1; i >= 0; i--) {
      warnings[i].life -= dt;
      if (warnings[i].life <= 0) warnings.splice(i, 1);
    }

    // Update Bullets & Collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      if (b.update) b.update(dt);
      
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Remove out of bounds
      if (b.x < arena.x - 200 || b.x > arena.x + arena.w + 200 || 
          b.y < arena.y - 200 || b.y > arena.y + arena.h + 200) {
        bullets.splice(i, 1);
        continue;
      }

      // Collision check (AABB for rect, circle for circle)
      if (player.invulnTime <= 0) {
        let hit = false;
        if (b.type === 'circle') {
          const dx = player.x - b.x;
          const dy = player.y - b.y;
          hit = Math.sqrt(dx*dx + dy*dy) < (player.size/2 + b.width);
        } else if (b.type === 'rect') {
          hit = player.x > b.x && player.x < b.x + b.width &&
                player.y > b.y && player.y < b.y + b.height;
        }

        if (hit) {
          player.hp -= 1;
          player.invulnTime = 1.0;
          if (player.hp <= 0) {
            isGameOver = true;
            endBattle(false);
          }
        }
      }
    }

    // Check Win Condition
    if (elapsed >= survivalTimeMs) {
      isWin = true;
      endBattle(true);
    }

    draw();
    requestAnimationFrame(loop);
  };

  const draw = () => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#fff';
    ctx.font = '24px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'center';
    if (bossType === 'xihu') {
      ctx.fillText("😡 溪湖醬 - 農村暴走模式", canvas.width/2, 40);
      ctx.font = '16px "Noto Sans TC"';
      ctx.fillText("「準備好嚐嚐巨峰葡萄與五分車的猛烈撞擊了嗎！」", canvas.width/2, 70);
    } else {
      ctx.fillText("😡 前鎮醬 - 科技鎮壓模式", canvas.width/2, 40);
      ctx.font = '16px "Noto Sans TC"';
      ctx.fillText("「太不識貨了！讓你見識一下前鎮重工業的威力！」", canvas.width/2, 70);
    }

    // Time Remaining
    const elapsed = Date.now() - startTime;
    const remain = Math.max(0, (survivalTimeMs - elapsed) / 1000).toFixed(1);
    ctx.fillStyle = '#ff5e7e';
    ctx.fillText(`生存倒數: ${remain} 秒`, canvas.width/2, 110);

    // Draw Arena
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(arena.x, arena.y, arena.w, arena.h);

    // Draw Warnings
    warnings.forEach(w => {
      ctx.fillStyle = (Math.floor(Date.now() / 100) % 2 === 0) ? 'rgba(255, 0, 0, 0.4)' : 'rgba(255, 255, 0, 0.2)';
      ctx.fillRect(w.x, w.y, w.w, w.h);
    });

    // Draw Bullets
    bullets.forEach(b => {
      ctx.fillStyle = b.color;
      if (b.type === 'circle') {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.width, 0, Math.PI*2);
        ctx.fill();
      } else {
        ctx.fillRect(b.x, b.y, b.width, b.height);
      }
    });

    // Draw Player Heart
    if (player.invulnTime <= 0 || Math.floor(Date.now() / 100) % 2 === 0) {
      drawHeart(ctx, player.x, player.y, player.size, '#ff0000');
    }

    // Draw HP
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText("HP", arena.x, arena.y + arena.h + 30);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(arena.x + 30, arena.y + arena.h + 16, player.maxHp * 3, 20);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(arena.x + 30, arena.y + arena.h + 16, player.hp * 3, 20);
    ctx.fillStyle = '#fff';
    ctx.fillText(`${player.hp} / ${player.maxHp}`, arena.x + 40 + player.maxHp * 3, arena.y + arena.h + 31);
  };

  const drawHeart = (ctx, x, y, size, color) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size/10, size/10);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(0, -3, -10, -5, -10, 0);
    ctx.bezierCurveTo(-10, 5, 0, 10, 0, 13);
    ctx.bezierCurveTo(0, 10, 10, 5, 10, 0);
    ctx.bezierCurveTo(10, -5, 0, -3, 0, 3);
    ctx.fill();
    ctx.restore();
  };

  const endBattle = (won) => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    
    draw();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.textAlign = 'center';
    if (won) {
      ctx.fillStyle = '#00ff00';
      ctx.font = '36px "Noto Sans TC"';
      ctx.fillText("你活下來了！", canvas.width/2, canvas.height/2);
      ctx.fillStyle = '#fff';
      ctx.font = '20px "Noto Sans TC"';
      ctx.fillText("她累倒在地上，似乎氣消了... (請按 F5 重新開始)", canvas.width/2, canvas.height/2 + 40);
    } else {
      ctx.fillStyle = '#ff0000';
      ctx.font = '36px Arial';
      ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
      ctx.fillStyle = '#fff';
      ctx.font = '20px "Noto Sans TC"';
      ctx.fillText("你無法承受她的怒火... (請按 F5 重新開始)", canvas.width/2, canvas.height/2 + 40);
    }
  };

  loop();
};
