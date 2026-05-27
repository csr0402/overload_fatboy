window.initBattleEngine = function(bossType, onEndCallback) {
  const canvas = document.getElementById('battleCanvas');
  const ctx = canvas.getContext('2d');
  
  // Game state
  let isGameOver = false;
  let isWin = false;
  let startTime = Date.now();
  const survivalTimeMs = 80000;
  const introTimeMs = 13000;
  let lastTime = Date.now();
  let globalTime = 0;
  let screenShake = 0;
  
  // Arena bounds (Responsive)
  const arena = { x: 0, y: 0, w: 450, h: 320 };

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    arena.x = (canvas.width - arena.w) / 2;
    arena.y = (canvas.height - arena.h) / 2 + 100; // shift down more to make room for text
  };
  window.addEventListener('resize', resize);
  resize(); // initial setup

  // Player state
  const player = {
    x: canvas.width / 2,
    y: arena.y + arena.h / 2,
    size: 24, 
    speed: 260, 
    hp: 20,
    maxHp: 20,
    invulnTime: 0,
    trails: []
  };

  // Boss Image Loading
  const bossImg = new Image();
  const bossImg2 = new Image();
  if (bossType === 'both') {
    bossImg.src = 'images/xihu_angry.png';
    bossImg2.src = 'images/qianzhen_angry.png';
  } else {
    bossImg.src = bossType === 'xihu' ? 'images/xihu_angry.png' : 'images/qianzhen_angry.png';
  }
  
  // Particles (Emoji or Text)
  let particles = [];
  const spawnParticles = (x, y, emojis, count, speedScale=1) => {
    for(let i=0; i<count; i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random()-0.5) * 250 * speedScale,
        vy: (Math.random()-0.5) * 250 * speedScale,
        life: 0.6 + Math.random()*0.4,
        maxLife: 1.0,
        text: emojis[Math.floor(Math.random() * emojis.length)],
        size: 16 + Math.random()*10,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random()-0.5) * 10
      });
    }
  };

  // Input tracking
  const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, KeyW: false, KeyA: false, KeyS: false, KeyD: false };
  const handleKeyDown = (e) => { if(keys.hasOwnProperty(e.code)) keys[e.code] = true; };
  const handleKeyUp = (e) => { if(keys.hasOwnProperty(e.code)) keys[e.code] = false; };
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Entities
  let bullets = [];
  let warnings = [];
  let xihuStateTimer = 0;
  let xihuPhase = 0;
  let xihuHasSpawned = false;
  let qianStateTimer = 0;
  const spawnGiantLeek = (side, duration) => {
    let pivotX, pivotY, startAngle, swingDir;
    const length = Math.max(arena.w, arena.h) * 0.53;
    
    if (side === 0) { // Left
      pivotX = arena.x - 20; pivotY = arena.y + arena.h/2;
      startAngle = -Math.PI/2; swingDir = 1; 
    } else if (side === 1) { // Right
      pivotX = arena.x + arena.w + 20; pivotY = arena.y + arena.h/2;
      startAngle = Math.PI/2; swingDir = 1; 
    } else if (side === 2) { // Top
      pivotX = arena.x + arena.w/2; pivotY = arena.y - 20;
      startAngle = Math.PI; swingDir = -1; 
    } else { // Bottom
      pivotX = arena.x + arena.w/2; pivotY = arena.y + arena.h + 20;
      startAngle = 0; swingDir = -1; 
    }

    const rotationSpeed = 3.6 * swingDir; 
    const segments = Math.floor(length / 25);
    
    // Master visual bullet (handles drawing)
    addBullet({
      x: pivotX, y: pivotY, size: 1, type: 'circle', emoji: '',
      customData: { angle: startAngle, length: length, life: duration, totalRot: 0 },
      render: function(ctx2) {
        ctx2.save();
        ctx2.translate(this.x, this.y);
        ctx2.rotate(this.customData.angle);
        
        ctx2.fillStyle = '#f5f6fa';
        ctx2.fillRect(0, -15, this.customData.length * 0.4, 30);
        
        ctx2.fillStyle = '#2ed573';
        ctx2.beginPath();
        ctx2.moveTo(this.customData.length * 0.4, -15);
        ctx2.lineTo(this.customData.length, -40);
        ctx2.lineTo(this.customData.length * 0.8, 0);
        ctx2.lineTo(this.customData.length, 40);
        ctx2.lineTo(this.customData.length * 0.4, 15);
        ctx2.fill();
        
        ctx2.strokeStyle = '#2d3436';
        ctx2.lineWidth = 3;
        ctx2.beginPath();
        ctx2.rect(0, -15, this.customData.length * 0.4, 30);
        ctx2.stroke();
        
        ctx2.beginPath();
        ctx2.moveTo(this.customData.length * 0.4, -15);
        ctx2.lineTo(this.customData.length, -40);
        ctx2.lineTo(this.customData.length * 0.8, 0);
        ctx2.lineTo(this.customData.length, 40);
        ctx2.lineTo(this.customData.length * 0.4, 15);
        ctx2.stroke();
        
        ctx2.restore();
      },
      update: function(dt) {
        this.customData.life -= dt;
        if (this.customData.life <= 0) {
          this.y = -9999;
          return;
        }
        const delta = rotationSpeed * dt;
        this.customData.totalRot += Math.abs(delta);
        if (this.customData.totalRot >= 1.5 * Math.PI) {
          this.y = -9999;
          return;
        }
        this.customData.angle += delta;
      }
    });

    // Invisible hitboxes for accurate collision
    for(let i=1; i<=segments; i++) {
      addBullet({
        x: pivotX + Math.cos(startAngle) * (i*25),
        y: pivotY + Math.sin(startAngle) * (i*25),
        size: 25, type: 'circle', emoji: '', emojiSize: 1,
        customData: { pivotX, pivotY, angle: startAngle, dist: i*25, speed: rotationSpeed, life: duration, totalRot: 0 },
        update: function(dt) {
          this.customData.life -= dt;
          if (this.customData.life <= 0) {
            this.y = -9999;
            return;
          }
          const delta = this.customData.speed * dt;
          this.customData.totalRot += Math.abs(delta);
          if (this.customData.totalRot >= 1.5 * Math.PI) {
            this.y = -9999;
            return;
          }
          this.customData.angle += delta;
          this.x = this.customData.pivotX + Math.cos(this.customData.angle) * this.customData.dist;
          this.y = this.customData.pivotY + Math.sin(this.customData.angle) * this.customData.dist;
        }
      });
    }
  };

  const addBullet = (b) => {
    bullets.push({
      x: b.x, y: b.y, vx: b.vx || 0, vy: b.vy || 0, 
      width: b.width || b.size, height: b.height || b.size,
      type: b.type || 'circle', emoji: b.emoji, emojiSize: b.emojiSize || 24,
      update: b.update, customData: b.customData || {},
      hasHit: false, render: b.render
    });
  };

  // 溪湖 (Xihu) Attack Patterns
  const xihuAttacks = (dt, elapsed) => {
    xihuStateTimer -= dt;
    if (xihuStateTimer <= 0) {
      xihuPhase = Math.floor(Math.random() * 4);
      xihuStateTimer = (xihuPhase === 0) ? 2.5 : ((xihuPhase === 1) ? 3.0 : ((xihuPhase === 2) ? 4.0 : 6.0)); 
      xihuHasSpawned = false;
    }

    if (xihuPhase === 0) {
      if (Math.random() < 0.08) {
        addBullet({
          x: arena.x + Math.random() * arena.w,
          y: arena.y - 30,
          vy: 120 + Math.random() * 100,
          vx: (Math.random() - 0.5) * 40,
          size: 16, type: 'circle', emoji: '🍇', emojiSize: 28
        });
      }
    } else if (xihuPhase === 1 && !xihuHasSpawned) {
      xihuHasSpawned = true;
      const sheepCount = 6 + Math.floor(Math.random() * 5);
      for(let i=0; i<sheepCount; i++) {
        const isLeft = Math.random() > 0.5;
        addBullet({
          x: isLeft ? arena.x - 40 - Math.random()*150 : arena.x + arena.w + 40 + Math.random()*150,
          y: arena.y + 20 + Math.random() * (arena.h - 40),
          vx: (isLeft ? 1 : -1) * (180 + Math.random()*100),
          vy: (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random()*80),
          width: 30, height: 30, type: 'rect', emoji: isLeft ? '🐑' : '🐏', emojiSize: 32,
          update: function(dt) {
             this.y += this.vy * dt;
             if (this.y < arena.y || this.y > arena.y + arena.h - this.height) this.vy *= -1;
          }
        });
      }
    } else if (xihuPhase === 2 && !xihuHasSpawned) {
      xihuHasSpawned = true;
      const trainCount = 4 + Math.floor(Math.random() * 3);
      
      for(let i=0; i<trainCount; i++) {
        const side = Math.floor(Math.random() * 4); // 0:Left, 1:Right, 2:Top, 3:Bottom
        const delayMs = 600 + Math.random() * 800; // staggered spawn
        
        let warnObj = { life: delayMs / 1000 };
        let trainObj = { width: 120, height: 60, type: 'rect', emoji: '🚂', emojiSize: 70 };
        
        if (side === 0) { // Left to Right
          const yPos = arena.y + 20 + Math.random() * (arena.h - 80);
          warnObj.x = arena.x; warnObj.y = yPos; warnObj.w = arena.w; warnObj.h = 60;
          trainObj.x = arena.x - 150; trainObj.y = yPos; trainObj.vx = 700;
        } else if (side === 1) { // Right to Left
          const yPos = arena.y + 20 + Math.random() * (arena.h - 80);
          warnObj.x = arena.x; warnObj.y = yPos; warnObj.w = arena.w; warnObj.h = 60;
          trainObj.x = arena.x + arena.w + 150; trainObj.y = yPos; trainObj.vx = -700;
        } else if (side === 2) { // Top to Bottom
          const xPos = arena.x + 20 + Math.random() * (arena.w - 80);
          warnObj.x = xPos; warnObj.y = arena.y; warnObj.w = 60; warnObj.h = arena.h;
          trainObj.x = xPos - 30; trainObj.y = arena.y - 150; trainObj.vy = 700;
          trainObj.width = 60; trainObj.height = 120;
        } else { // Bottom to Top
          const xPos = arena.x + 20 + Math.random() * (arena.w - 80);
          warnObj.x = xPos; warnObj.y = arena.y; warnObj.w = 60; warnObj.h = arena.h;
          trainObj.x = xPos - 30; trainObj.y = arena.y + arena.h + 150; trainObj.vy = -700;
          trainObj.width = 60; trainObj.height = 120;
        }
        
        warnings.push(warnObj);
        setTimeout(() => {
          if (screenShake < 12) screenShake = 12; 
          addBullet(trainObj);
        }, delayMs); 
      }
    } else if (xihuPhase === 3 && !xihuHasSpawned) {
      xihuHasSpawned = true;
      const duration = 5.5;
      const side = Math.floor(Math.random() * 4); // 0:Left, 1:Right, 2:Top, 3:Bottom
      spawnGiantLeek(side, duration);
    }
  };

  // 前鎮 (Qianzhen) Attack Patterns
  const qianzhenAttacks = (dt, elapsed) => {
    qianStateTimer -= dt;
    if (qianStateTimer <= 0) {
      qianPhase = Math.floor(Math.random() * 4);
      qianStateTimer = (qianPhase === 0) ? 2.5 : ((qianPhase === 1) ? 5.5 : ((qianPhase === 2) ? 4.0 : 6.0));
      qianHasSpawned = false;
    }

    if (qianPhase === 0) {
      if (Math.random() < 0.06) {
        const emojis = ['📦', '🚢', '🏢'];
        addBullet({
          x: arena.x + Math.random() * arena.w,
          y: arena.y - 40,
          vy: 200 + Math.random() * 150,
          width: 35, height: 35, type: 'rect', 
          emoji: emojis[Math.floor(Math.random()*emojis.length)], emojiSize: 40
        });
      }
    } else if (qianPhase === 1 && !qianHasSpawned) {
      qianHasSpawned = true;
      addBullet({
        x: arena.x + arena.w / 2,
        y: arena.y + 60,
        size: 40, type: 'circle', emoji: '🎡', emojiSize: 60,
        customData: { angle: 0, life: 5.0, shotTimer: 0 },
        update: function(dt) {
          this.customData.life -= dt;
          this.customData.angle += dt * 3;
          this.customData.shotTimer -= dt;
          if (this.customData.shotTimer <= 0) {
            this.customData.shotTimer = 0.8;
            const subEmojis = ['🛍️', '💸', '💳'];
            for(let i=0; i<4; i++) {
              let a = this.customData.angle + i * (Math.PI / 2);
              addBullet({
                x: this.x, y: this.y,
                vx: Math.cos(a) * 150, vy: Math.sin(a) * 150,
                size: 14, type: 'circle', 
                emoji: subEmojis[Math.floor(Math.random()*subEmojis.length)], emojiSize: 20
              });
            }
          }
          if (this.customData.life <= 0) this.y = -999; 
        }
      });
    } else if (qianPhase === 2 && !qianHasSpawned) {
      qianHasSpawned = true;
      const xPos = arena.x + 20 + Math.random() * (arena.w - 60);
      warnings.push({ x: xPos - 15, y: arena.y, w: 60, h: arena.h, life: 0.8 });
      
      setTimeout(() => {
        screenShake = 20;
        addBullet({
          x: xPos,
          y: arena.y - 120,
          vy: 850,
          width: 50, height: 100, type: 'rect', emoji: '🚈', emojiSize: 80
        });
      }, 800);
    } else if (qianPhase === 3 && !qianHasSpawned) {
      qianHasSpawned = true;
      const slotCount = 6;
      const slotWidth = arena.w / slotCount;
      const safeSlot = Math.floor(Math.random() * slotCount);
      const safeSlot2 = (safeSlot + 2 + Math.floor(Math.random() * 2)) % slotCount;
      
      for(let i=0; i<slotCount; i++) {
        if (i === safeSlot || i === safeSlot2) continue; // Safe gaps
        
        const xPos = arena.x + i * slotWidth;
        const width = slotWidth - 10; 
        const delayMs = 600 + Math.random() * 200; // staggered drop
        
        warnings.push({ x: xPos + 5, y: arena.y, w: width, h: arena.h, life: delayMs / 1000 });
        
        setTimeout(() => {
          if (screenShake < 15) screenShake = 15;
          addBullet({
            x: xPos + 5, y: arena.y - arena.h, width: width, height: arena.h, 
            vy: 1200, type: 'rect', emoji: '', emojiSize: 1, 
            render: function(ctx2) {
               ctx2.fillStyle = '#636e72';
               ctx2.fillRect(this.x, this.y, this.width, this.height);
               ctx2.strokeStyle = '#2d3436';
               ctx2.lineWidth = 4;
               ctx2.strokeRect(this.x, this.y, this.width, this.height);
               ctx2.fillStyle = '#b2bec3';
               for(let rY = this.y + 30; rY < this.y + this.height; rY += 60) {
                 ctx2.beginPath();
                 ctx2.arc(this.x + this.width/2, rY, 6, 0, Math.PI*2);
                 ctx2.fill();
               }
            }
          });
        }, delayMs);
      }
    }
  };

  // Game Loop
  const loop = () => {
    if (isGameOver || isWin) return;

    const now = Date.now();
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const elapsed = now - startTime;
    globalTime += dt;

    if (screenShake > 0) {
      screenShake -= dt * 40;
      if (screenShake < 0) screenShake = 0;
    }

    // Player Trails (Sweat/Panic trails)
    if (keys.ArrowUp || keys.ArrowDown || keys.ArrowLeft || keys.ArrowRight || keys.KeyW || keys.KeyA || keys.KeyS || keys.KeyD) {
      if (Math.random() < 0.3) {
        player.trails.push({
          x: player.x + (Math.random()-0.5)*20, 
          y: player.y + (Math.random()-0.5)*20, 
          life: 0.4
        });
      }
    }
    for(let i = player.trails.length - 1; i >= 0; i--) {
      player.trails[i].life -= dt;
      if (player.trails[i].life <= 0) player.trails.splice(i, 1);
    }

    // Update Player
    if (keys.ArrowUp || keys.KeyW) player.y -= player.speed * dt;
    if (keys.ArrowDown || keys.KeyS) player.y += player.speed * dt;
    if (keys.ArrowLeft || keys.KeyA) player.x -= player.speed * dt;
    if (keys.ArrowRight || keys.KeyD) player.x += player.speed * dt;

    player.x = Math.max(arena.x + player.size/2, Math.min(arena.x + arena.w - player.size/2, player.x));
    player.y = Math.max(arena.y + player.size/2, Math.min(arena.y + arena.h - player.size/2, player.y));

    if (player.invulnTime > 0) player.invulnTime -= dt;

    // Boss Attacks
    if (elapsed > 13000) {
      if (bossType === 'both') {
        xihuAttacks(dt, elapsed);
        qianzhenAttacks(dt, elapsed);
      } else if (bossType === 'xihu') {
        xihuAttacks(dt, elapsed);
      } else {
        qianzhenAttacks(dt, elapsed);
      }
    }

    // Update Warnings
    for (let i = warnings.length - 1; i >= 0; i--) {
      warnings[i].life -= dt;
      if (warnings[i].life <= 0) warnings.splice(i, 1);
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.rotSpeed * dt;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Update Bullets & Collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      if (b.update) b.update(dt);
      
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (b.x < arena.x - 500 || b.x > arena.x + arena.w + 500 || 
          b.y < arena.y - 1200 || b.y > arena.y + arena.h + 500) {
        bullets.splice(i, 1);
        continue;
      }

      if (!b.hasHit) {
        let hit = false;
        let shrink = 6; 
        if (b.type === 'circle') {
          const dx = player.x - b.x;
          const dy = player.y - b.y;
          hit = Math.sqrt(dx*dx + dy*dy) < (player.size/2 + b.width - shrink);
        } else if (b.type === 'rect') {
          hit = player.x > b.x + shrink && player.x < b.x + b.width - shrink &&
                player.y > b.y + shrink && player.y < b.y + b.height - shrink;
        }

        if (hit) {
          b.hasHit = true;
          player.hp -= 1;
          screenShake = 15;
          spawnParticles(player.x, player.y, ['💢', '💦', '💥'], 10, 1.5);
          
          if (b.emoji !== '🚂' && b.emoji !== '🚈') {
            b.y = -9999; // Move offscreen to be cleaned up
          }
          
          if (player.hp <= 0) {
            isGameOver = true;
            endBattle(false);
          }
        }
      }
    }

    if (elapsed >= survivalTimeMs + introTimeMs) {
      isWin = true;
      endBattle(true);
    }

    draw();
    requestAnimationFrame(loop);
  };

  const drawPolkaDots = () => {
    ctx.fillStyle = (bossType === 'xihu' || bossType === 'both') ? '#fdf0f5' : '#f0f8fd'; 
    if (bossType === 'both') {
      ctx.fillRect(0, 0, canvas.width/2, canvas.height);
      ctx.fillStyle = '#f0f8fd';
      ctx.fillRect(canvas.width/2, 0, canvas.width/2, canvas.height);
    } else {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    const dotSize = 10;
    const spacing = 60;
    const offsetX = (globalTime * -30) % spacing;
    const offsetY = (globalTime * -30) % spacing;

    for (let x = offsetX; x < canvas.width; x += spacing) {
      for (let y = offsetY; y < canvas.height; y += spacing) {
        ctx.fillStyle = (bossType === 'xihu' || (bossType === 'both' && x < canvas.width/2)) ? '#f8d0e0' : '#d0eaf8';
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI*2);
        ctx.fill();
      }
    }
  };

  const drawBossSprite = () => {
    if (bossImg.complete && bossImg.width > 0) {
      ctx.save();
      const bobY = Math.sin(globalTime * 3) * 15;
      
      const drawOneBoss = (img, side) => {
        const imgH = canvas.height * 0.8;
        const imgW = img.width * (imgH / img.height);
        
        let imgX;
        if (side === 'xihu') {
          imgX = Math.min(-imgW * 0.1, arena.x - imgW + 50); 
        } else {
          imgX = Math.max(canvas.width - imgW * 0.9, arena.x + arena.w - 50);
        }
        let imgY = canvas.height * 0.1;
        
        ctx.globalAlpha = 0.5;
        ctx.drawImage(img, imgX, imgY + bobY, imgW, imgH);
        
        if (Math.floor(globalTime * 2) % 2 === 0) {
          ctx.font = '60px Arial';
          ctx.fillText('💢', imgX + imgW/2 + (side==='xihu'?30:-30), imgY + bobY + 100);
        }
      };

      if (bossType === 'both') {
        drawOneBoss(bossImg, 'xihu');
        if (bossImg2.complete && bossImg2.width > 0) {
          drawOneBoss(bossImg2, 'qianzhen');
        }
      } else {
        drawOneBoss(bossImg, bossType);
      }
      
      ctx.restore();
    }
  };

  const draw = () => {
    ctx.save();
    
    drawPolkaDots();
    drawBossSprite();

    // Apply Screen Shake
    if (screenShake > 0) {
      const dx = (Math.random() - 0.5) * screenShake;
      const dy = (Math.random() - 0.5) * screenShake;
      ctx.translate(dx, dy);
    }

    // Draw Boss Info (Funny style)
    ctx.fillStyle = '#333';
    ctx.font = 'bold 28px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'center';
    
    const facePhase = Math.floor(globalTime * 2) % 2 === 0 ? '(╬ Ò ‸ Ó)' : '(ノಠ益ಠ)ノ';
    if (bossType === 'both') {
      ctx.fillText(`溪湖醬 & 前鎮醬 雙重暴走中 ${facePhase}`, canvas.width/2, 145);
      ctx.font = '16px "Noto Sans TC"';
      ctx.fillStyle = '#ff4757';
      ctx.fillText("「準備被巨峰葡萄跟輕軌踩扁吧！！」", canvas.width/2, 175);
    } else if (bossType === 'xihu') {
      ctx.fillText(`溪湖醬 暴走中 ${facePhase}`, canvas.width/2, 145);
      ctx.font = '16px "Noto Sans TC"';
      ctx.fillStyle = '#d63031';
      ctx.fillText("「準備被巨峰葡萄跟羊群踩扁吧！！」", canvas.width/2, 175);
    } else {
      ctx.fillText(`前鎮醬 暴走中 ${facePhase}`, canvas.width/2, 145);
      ctx.font = '16px "Noto Sans TC"';
      ctx.fillStyle = '#0984e3';
      ctx.fillText("「太不識貨了！讓你見識輕軌的威力！！」", canvas.width/2, 175);
    }

    // Time Remaining
    const elapsed = Date.now() - startTime;
    let remainStr = "";
    let remainVal = 80;
    let drawIntroTextFunc = null;

    if (elapsed <= introTimeMs) {
      const introRemain = Math.max(0, (introTimeMs - elapsed) / 1000).toFixed(1);
      remainStr = `準備迎戰！倒數: ${introRemain} 秒`;
      
      // Draw Sans-style intro text
      const introSeconds = elapsed / 1000;
      let introText = "";
      let isShaking = false;
      let isBlinking = false;
      
      if (introSeconds < 2) {
        introText = "這真是多美好的一天啊";
      } else if (introSeconds < 4) {
        introText = "小鳥在歌唱，鮮花在綻放...";
      } else if (introSeconds < 6) {
        introText = "像這樣的一天，像你這樣的孩子...";
      } else if (introSeconds < 8) {
        introText = "應該在地獄焚燒。";
        isShaking = true;
      } else {
        introText = "提示:用WASD或上下左右鍵躲避攻擊";
        isBlinking = true;
      }

      if (introText) {
        drawIntroTextFunc = () => {
          ctx.save();
          let textX = canvas.width / 2;
          let textY = arena.y + arena.h / 2;
          
          if (isShaking) {
            textX += (Math.random() - 0.5) * 6;
            textY += (Math.random() - 0.5) * 6;
          }
          
          if (!isBlinking || Math.floor(globalTime * 2) % 2 === 0) {
            ctx.font = 'bold 28px "Comic Sans MS", "Noto Sans TC", sans-serif';
            ctx.textAlign = 'center';
            
            // Outline
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 6;
            ctx.strokeText(introText, textX, textY);
            
            // Fill
            ctx.fillStyle = isShaking ? '#d63031' : (isBlinking ? '#ff9f43' : '#2d3436');
            ctx.fillText(introText, textX, textY);
          }
          ctx.restore();
        };
      }
    } else {
      const battleElapsed = elapsed - introTimeMs;
      remainVal = Math.max(0, (survivalTimeMs - battleElapsed) / 1000).toFixed(1);
      remainStr = `撐住啊！倒數: ${remainVal} 秒`;
    }

    ctx.fillStyle = remainVal < 5 && elapsed > introTimeMs ? '#ff4757' : '#fdcb6e';
    ctx.font = 'bold 22px "Noto Sans TC"';
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 4;
    ctx.strokeText(remainStr, canvas.width/2, 215);
    ctx.fillText(remainStr, canvas.width/2, 215);

    // Draw Arena (Dashed cute border)
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 4;
    ctx.setLineDash([15, 10]);
    ctx.strokeRect(arena.x, arena.y, arena.w, arena.h);
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(arena.x, arena.y, arena.w, arena.h);

    // Draw Warnings (危字樣)
    warnings.forEach(w => {
      const alpha = 0.4 + (Math.sin(globalTime * 20) * 0.2); 
      ctx.fillStyle = `rgba(255, 50, 50, ${alpha})`;
      ctx.fillRect(w.x, w.y, w.w, w.h);
      
      // Draw text overlay on warning
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px "Noto Sans TC"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.save();
      ctx.beginPath();
      ctx.rect(w.x, w.y, w.w, w.h);
      ctx.clip();
      for(let tx = w.x + 10; tx < w.x + w.w + 20; tx += 30) {
        for(let ty = w.y + 15 + (globalTime * 50) % 30; ty < w.y + w.h + 30; ty += 30) {
          ctx.fillText('危', tx, ty);
        }
      }
      ctx.restore();
    });

    // Draw Bullets (Emojis or Custom Render)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    bullets.forEach(b => {
      if (b.render) {
        b.render(ctx);
        return;
      }
      ctx.font = `${b.emojiSize}px Arial`;
      if (b.type === 'circle') {
        ctx.fillText(b.emoji, b.x, b.y);
      } else {
        ctx.fillText(b.emoji, b.x + b.width/2, b.y + b.height/2);
      }
    });

    // Draw Particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = `${p.size}px Arial`;
      ctx.fillText(p.text, 0, 0);
      ctx.restore();
    });

    // Draw Player Trails (Sweat)
    ctx.font = '12px Arial';
    player.trails.forEach(t => {
      ctx.globalAlpha = t.life / 0.4;
      ctx.fillText('💧', t.x, t.y);
    });
    ctx.globalAlpha = 1.0;

    // Draw Player Emoji
    const playerEmoji = player.invulnTime > 0 ? '😵' : (keys.ArrowUp||keys.ArrowDown||keys.ArrowLeft||keys.ArrowRight ? '😱' : '🥺');
    ctx.font = `${player.size * 1.5}px Arial`;
    const bob = Math.sin(globalTime * 15) * 3;
    ctx.fillText(playerEmoji, player.x, player.y + bob);

    // Draw HP
    ctx.fillStyle = '#2d3436';
    ctx.font = 'bold 18px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'left';
    const hpText = "血量 🚑";
    ctx.fillText(hpText, arena.x, arena.y + arena.h + 32);
    
    // Cute Pill HP Bar
    const barX = arena.x + 80;
    const barY = arena.y + arena.h + 18;
    const barW = player.maxHp * 4;
    
    ctx.fillStyle = '#dfe6e9';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, 20, 10);
    ctx.fill();
    
    const hpRatio = player.hp / player.maxHp;
    ctx.fillStyle = hpRatio > 0.4 ? '#ff7675' : '#d63031';
    if (player.hp > 0) {
      ctx.beginPath();
      ctx.roundRect(barX, barY, player.hp * 4, 20, 10);
      ctx.fill();
    }
    
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, 20, 10);
    ctx.stroke();

    ctx.fillStyle = '#2d3436';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.fillText(`${player.hp} / ${player.maxHp}`, barX + barW + 10, barY + 15);

    if (hpRatio <= 0.3 && Math.floor(globalTime * 8) % 2 === 0) {
      ctx.font = '24px Arial';
      ctx.fillText('🆘', barX + barW + 70, barY + 18);
    }

    if (typeof drawIntroTextFunc !== 'undefined' && drawIntroTextFunc) {
      drawIntroTextFunc();
    }

    ctx.restore();
  };

  const endBattle = (won) => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('resize', resize);
    
    if (window.fightAudio) {
      window.fightAudio.pause();
    }
    
    draw(); 
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.textAlign = 'center';
    if (won) {
      ctx.fillStyle = '#e17055';
      ctx.font = 'bold 48px "Noto Sans TC"';
      ctx.fillText("逃過一劫！ 🎉", canvas.width/2, canvas.height/2 - 20);
      
      ctx.fillStyle = '#2d3436';
      ctx.font = '20px "Noto Sans TC"';
      ctx.fillText("她氣消了，恭喜保住小命... 💦", canvas.width/2, canvas.height/2 + 30);
      ctx.fillText("即將進入結算畫面...", canvas.width/2, canvas.height/2 + 60);
    } else {
      ctx.fillStyle = '#d63031';
      ctx.font = 'bold 48px "Noto Sans TC"';
      ctx.fillText("被碾壓了... 💀", canvas.width/2, canvas.height/2 - 20);
      
      ctx.fillStyle = '#2d3436';
      ctx.font = '20px "Noto Sans TC"';
      ctx.fillText("她無情地把你打成馬賽克...", canvas.width/2, canvas.height/2 + 30);
      ctx.fillText("即將進入結算畫面...", canvas.width/2, canvas.height/2 + 60);
    }
    
    setTimeout(() => {
      if (onEndCallback) onEndCallback(won);
    }, 3500);
  };

  loop();
};

