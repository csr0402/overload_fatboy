// Dark Mode Toggle Logic
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const target = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', target);
  localStorage.setItem('theme', target);
  updateThemeIcon(target);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '☀' : '☾';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateThemeIcon(document.documentElement.getAttribute('data-theme'));
});

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

});

// 動態載入 canvas-confetti (全站拉炮效果)
if (!document.querySelector('script[src*="canvas-confetti"]')) {
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
  document.head.appendChild(script);
}

// 監聽全站按鍵 'C' 觸發隨機拉炮
document.addEventListener('keydown', function (event) {
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

    switch (edge) {
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

// ====== i18n Translation Logic ======
document.addEventListener('DOMContentLoaded', () => {
  // Inject Google Translate script dynamically
  const gtDiv = document.createElement('div');
  gtDiv.id = 'google_translate_element';
  document.body.appendChild(gtDiv);

  const gtScript = document.createElement('script');
  gtScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(gtScript);

  // Initialize lang icon
  const savedLang = localStorage.getItem('site_lang') || 'zh-TW';
  updateLangIcon(savedLang);
});

window.googleTranslateElementInit = function () {
  new google.translate.TranslateElement({
    pageLanguage: 'zh-TW',
    includedLanguages: 'en,zh-TW',
    autoDisplay: false
  }, 'google_translate_element');

  // Apply saved language on load after a short delay
  setTimeout(() => {
    const savedLang = localStorage.getItem('site_lang') || 'zh-TW';
    if (savedLang !== 'zh-TW') {
      changeLanguage(savedLang);
    }
  }, 500);
};

function toggleLanguage() {
  const currentLang = localStorage.getItem('site_lang') || 'zh-TW';
  const targetLang = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
  changeLanguage(targetLang);
  localStorage.setItem('site_lang', targetLang);
  updateLangIcon(targetLang);
}

function changeLanguage(lang) {
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  } else {
    // If not loaded yet, retry
    setTimeout(() => changeLanguage(lang), 300);
  }
}

function updateLangIcon(lang) {
  const btn = document.getElementById('lang-toggle-btn');
  if (btn) {
    btn.classList.add('notranslate');
    btn.setAttribute('translate', 'no');
    // 使用 innerHTML 時確保不會被 Google 翻譯掃描
    btn.innerHTML = `<span class="notranslate">${lang === 'en' ? '中' : 'EN'}</span>`;
    btn.style.fontSize = lang === 'en' ? '1rem' : '0.9rem';
  }
}

// ====== Chart.js Data & Initialization ======
document.addEventListener('DOMContentLoaded', () => {
  let chartsInitialized = false;

  // 圖表通用字體與顏色設定 (配合深淺色主題)
  const getChartColors = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      textColor: isDark ? '#eaf7ff' : '#16324f',
      gridColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      xihuColor: '#2eb872',
      qianzhenColor: '#1689d8'
    };
  };

  const initCharts = () => {
    if (chartsInitialized) return;
    chartsInitialized = true;

    const colors = getChartColors();

    // 1. 人口趨勢折線圖 (Line Chart)
    const ctxPop = document.getElementById('populationChart');
    if (ctxPop) {
      new Chart(ctxPop, {
        type: 'line',
        data: {
          labels: ['2016', '2018', '2020', '2022', '2024', '2026'],
          datasets: [
            {
              label: '溪湖鎮 (萬人)',
              data: [5.5, 5.46, 5.42, 5.38, 5.34, 5.33],
              borderColor: colors.xihuColor,
              backgroundColor: 'rgba(46, 184, 114, 0.2)',
              tension: 0.4,
              fill: true
            },
            {
              label: '前鎮區 (萬人)',
              data: [19.2, 18.8, 18.5, 18.1, 17.8, 17.6],
              borderColor: colors.qianzhenColor,
              backgroundColor: 'rgba(22, 137, 216, 0.2)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: colors.textColor, font: { family: "'Noto Sans TC', sans-serif" } } }
          },
          scales: {
            x: { grid: { color: colors.gridColor }, ticks: { color: colors.textColor } },
            y: { grid: { color: colors.gridColor }, ticks: { color: colors.textColor } }
          },
          animation: {
            duration: 2000,
            easing: 'easeOutQuart'
          }
        }
      });
    }

    // 1.5 人口密度長條圖 (Bar Chart)
    const ctxDensity = document.getElementById('densityChart');
    if (ctxDensity) {
      new Chart(ctxDensity, {
        type: 'bar',
        data: {
          labels: ['溪湖鎮', '前鎮區'],
          datasets: [
            {
              label: '人口密度 (人/km²)',
              data: [1665, 9225],
              backgroundColor: [
                'rgba(46, 184, 114, 0.8)',
                'rgba(22, 137, 216, 0.8)'
              ],
              borderColor: [
                colors.xihuColor,
                colors.qianzhenColor
              ],
              borderWidth: 1,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.raw + ' 人/km²';
                }
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.textColor, font: { family: "'Noto Sans TC', sans-serif", size: 14 } } },
            y: { grid: { color: colors.gridColor }, ticks: { color: colors.textColor } }
          },
          animation: {
            duration: 2000,
            easing: 'easeOutQuart'
          }
        }
      });
    }

    // 2. 產業結構與職業別雷達圖 (Radar Chart)
    const ctxInd = document.getElementById('industryChart');
    if (ctxInd) {
      new Chart(ctxInd, {
        type: 'radar',
        data: {
          labels: ['農業與一級產業', '傳統製造業', '科技與軟體業', '服務與零售業', '港埠與物流業', '觀光與休閒業'],
          datasets: [
            {
              label: '溪湖鎮',
              data: [9, 5, 1, 5, 0, 6],
              backgroundColor: 'rgba(46, 184, 114, 0.2)',
              borderColor: colors.xihuColor,
              pointBackgroundColor: colors.xihuColor,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: colors.xihuColor
            },
            {
              label: '前鎮區',
              data: [1, 8, 9, 9, 10, 8],
              backgroundColor: 'rgba(22, 137, 216, 0.2)',
              borderColor: colors.qianzhenColor,
              pointBackgroundColor: colors.qianzhenColor,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: colors.qianzhenColor
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: colors.textColor, font: { family: "'Noto Sans TC', sans-serif" } } }
          },
          scales: {
            r: {
              angleLines: { color: colors.gridColor },
              grid: { color: colors.gridColor },
              pointLabels: { color: colors.textColor, font: { family: "'Noto Sans TC', sans-serif", size: 12 } },
              ticks: { display: false, min: 0, max: 10 }
            }
          },
          animation: {
            duration: 1500
          }
        }
      });
    }
  };

  // ====== 捲動觸發動畫與圖表初始化 ======
  // 1. 處理 animate-on-scroll 元素的顯示
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view'); // 加上這個類別，CSS 就會把 opacity 變回 1
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
  });

  // 2. 處理圖表繪製 (避免重複繪製)
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !chartsInitialized) {
        initCharts(); // 呼叫之前提供的 initCharts 函式
      }
    });
  }, { threshold: 0.2 });

  const chartsSection = document.querySelector('.charts-grid') || document.querySelector('.compare-cards-container');
  if (chartsSection) chartObserver.observe(chartsSection);
});

// ====== Attractions Interactive Gallery Logic ======
document.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('.attractions-gallery');

  galleries.forEach(gallery => {
    const cards = Array.from(gallery.querySelectorAll('.blog-card'));
    if (cards.length === 0) return;

    let currentIndex = 0;
    let isAnimating = false;

    // Initialize first card
    cards[currentIndex].classList.add('active');

    gallery.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }

      if (isAnimating || cards.length <= 1) return;
      isAnimating = true;

      const currentCard = cards[currentIndex];
      currentIndex = (currentIndex + 1) % cards.length;
      const nextCard = cards[currentIndex];

      currentCard.classList.remove('anim-enter');
      currentCard.classList.add('anim-leave');

      const onLeaveEnd = () => {
        currentCard.removeEventListener('animationend', onLeaveEnd);
        currentCard.classList.remove('active', 'anim-leave');

        nextCard.classList.add('active', 'anim-enter');

        const onEnterEnd = () => {
          nextCard.removeEventListener('animationend', onEnterEnd);
          isAnimating = false;
        };
        nextCard.addEventListener('animationend', onEnterEnd);
      };

      currentCard.addEventListener('animationend', onLeaveEnd);
    });
  });
});

// ====== Word Clouds Interaction ======
document.addEventListener('DOMContentLoaded', () => {
  const words = document.querySelectorAll('.cloud-word');
  const centerWords = document.querySelectorAll('.cloud-center-word');
  const allInteractive = [...words, ...centerWords];
  const placeholder = document.querySelector('.detail-placeholder');
  const content = document.querySelector('.detail-content');
  const detailTitle = document.querySelector('.detail-title');
  const detailDesc = document.querySelector('.detail-desc');
  const detailPanel = document.getElementById('word-detail-panel');

  if (!detailPanel || allInteractive.length === 0) return;

  function showWordDetail(word) {
    const currentLang = localStorage.getItem('site_lang') || 'zh-TW';
    const text = currentLang === 'en' ? word.getAttribute('data-en') : word.getAttribute('data-zh');
    const desc = currentLang === 'en' ? word.getAttribute('data-desc-en') : word.getAttribute('data-desc-zh');
    const card = word.closest('.word-cloud-card');
    const isXihu = card && card.classList.contains('xihu-cloud');
    const region = isXihu ? (currentLang === 'en' ? 'Xihu' : '溪湖') : (currentLang === 'en' ? 'Qianzhen' : '前鎮');
    const badgeClass = isXihu ? 'badge-xihu' : 'badge-qianzhen';

    // Highlight active word (clear all, set current)
    allInteractive.forEach(w => w.classList.remove('active-word'));
    word.classList.add('active-word');

    // Update panel content
    detailTitle.innerHTML = `${text} <span class="region-badge ${badgeClass}" style="margin: 0; font-size: 0.8rem; padding: 2px 10px;">${region}</span>`;
    detailDesc.textContent = desc;

    // Transition
    placeholder.style.display = 'none';
    content.style.display = 'block';

    // Left border color by region
    detailPanel.style.borderLeftColor = isXihu ? 'var(--secondary)' : 'var(--primary)';
  }

  function bindWordEvents(word) {
    word.addEventListener('mouseenter', () => showWordDetail(word));
    word.addEventListener('click', (e) => {
      e.preventDefault();
      showWordDetail(word);

      const link = word.getAttribute('data-link');

      if (typeof confetti === 'function') {
        const rect = word.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        const isXihu = word.closest('.word-cloud-card').classList.contains('xihu-cloud');
        const colors = link
          ? ['#ff3c78', '#ff80ab', '#ffffff']
          : (isXihu ? ['#2eb872', '#5ee39a', '#ffffff'] : ['#1689d8', '#53b7ff', '#ffffff']);
        confetti({ particleCount: 28, spread: 55, origin: { x, y }, colors, startVelocity: 18, ticks: 60, zIndex: 9999 });
      }

      // Navigate to external link if data-link is set
      if (link) {
        setTimeout(() => window.open(link, '_blank', 'noopener,noreferrer'), 400);
      }
    });
  }

  allInteractive.forEach(bindWordEvents);

  // Sync detail panel when language is toggled
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      setTimeout(() => {
        const currentLang = localStorage.getItem('site_lang') || 'zh-TW';
        if (placeholder) {
          placeholder.textContent = currentLang === 'en'
            ? (placeholder.getAttribute('data-en') || placeholder.textContent)
            : (placeholder.getAttribute('data-zh') || placeholder.textContent);
        }
        const activeWord = document.querySelector('.cloud-word.active-word, .cloud-center-word.active-word');
        if (activeWord) showWordDetail(activeWord);
      }, 50);
    });
  }

  // Set initial placeholder text
  const initialLang = localStorage.getItem('site_lang') || 'zh-TW';
  if (placeholder) {
    placeholder.textContent = initialLang === 'en'
      ? (placeholder.getAttribute('data-en') || placeholder.textContent)
      : (placeholder.getAttribute('data-zh') || placeholder.textContent);
  }
});
