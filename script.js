document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Navbar background change on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(15, 23, 42, 0.95)';
      navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(15, 23, 42, 0.8)';
      navbar.style.boxShadow = 'none';
    }
  });

  // Intersection Observer for scroll animations (fade in elements)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply to glass cards
  document.querySelectorAll('.glass-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });
  
  // Apply to table rows
  document.querySelectorAll('tbody tr').forEach((row, index) => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    row.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
    observer.observe(row);
  });
});

// 動態載入 canvas-confetti (全站拉炮效果)
if (!document.querySelector('script[src*="canvas-confetti"]')) {
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
  document.head.appendChild(script);
}

// 監聽全站按鍵 'C' 觸發隨機拉炮
document.addEventListener('keydown', function(event) {
  // 確保 confetti 套件已經載入
  if (typeof confetti !== 'function') return;
  
  // 避免在輸入框打字時誤觸
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

  if (event.key.toLowerCase() === 'c') {
    // 隨機選擇噴發位置 (上、下、左、右)
    const edges = ['top', 'bottom', 'left', 'right'];
    const edge = edges[Math.floor(Math.random() * edges.length)];
    
    // 播放拉炮音效
    const popperAudio = new Audio('audio/partypopper.mp3');
    popperAudio.volume = 0.5; // 音量適中
    popperAudio.play().catch(e => console.log('Audio error:', e));

    let originX = 0.5;
    let originY = 0.5;
    let velocity = 60;
    let spread = 80;
    let angle = 90;
    
    switch(edge) {
      case 'top':
        originX = Math.random(); // 頂部隨機水平位置
        originY = 0;
        angle = 270; // 往下噴發
        velocity = 40;
        spread = 100;
        break;
      case 'bottom':
        originX = Math.random(); // 底部隨機水平位置
        originY = 1;
        angle = 90; // 往上噴發
        velocity = 70;
        spread = 80;
        break;
      case 'left':
        originX = 0;
        originY = Math.random() * 0.6 + 0.2; // 左側隨機垂直位置 (避開太邊緣)
        angle = 0; // 往右噴發
        velocity = 55;
        spread = 60;
        break;
      case 'right':
        originX = 1;
        originY = Math.random() * 0.6 + 0.2; // 右側隨機垂直位置
        angle = 180; // 往左噴發
        velocity = 55;
        spread = 60;
        break;
    }
    
    // 執行拉炮
    confetti({
      particleCount: 120, // 紙片數量
      angle: angle,
      spread: spread,
      origin: { x: originX, y: originY },
      startVelocity: velocity,
      zIndex: 10000, // 確保蓋過所有元素
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
    });
  }
});
