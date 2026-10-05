/**
 * MathCraft: Ultimate Visual Mathematics Academy Engine
 * Implements 28 Math Domains, Visual Manipulatives, 3D Vectors, Hacks, Games & Rewards Shop.
 */

class MathCraftApp {
  constructor() {
    this.coins = parseInt(localStorage.getItem('mc_coins') || '50', 10);
    this.xp = parseInt(localStorage.getItem('mc_xp') || '0', 10);
    this.streak = parseInt(localStorage.getItem('mc_streak') || '1', 10);
    this.unlockedBadges = JSON.parse(localStorage.getItem('mc_badges') || '[]');
    this.purchasedItems = JSON.parse(localStorage.getItem('mc_purchased') || '["theme-light"]');
    this.solvedCount = parseInt(localStorage.getItem('mc_solved') || '0', 10);
    this.correctCount = parseInt(localStorage.getItem('mc_correct') || '0', 10);
    this.soundEnabled = localStorage.getItem('mc_sound') !== 'false';
    this.theme = localStorage.getItem('mc_theme') || 'light';
    this.blitzHighScore = parseInt(localStorage.getItem('mc_blitz_hs') || '0', 10);

    // Coins for money counter
    this.moneyCoins = { quarter: 2, dime: 3, nickel: 1, penny: 4 };

    // Subtraction stepper state
    this.subStep = 0;
    this.subData = null;

    // Blitz state
    this.blitzActive = false;
    this.blitzTimer = null;
    this.blitzTimeLeft = 60;
    this.blitzScore = 0;
    this.blitzCombo = 1;
    this.blitzMode = 'add';
    this.blitzCurrentQ = null;

    // Target 24 state
    this.target24Numbers = [4, 6, 8, 2];

    // Practice state
    this.currentCategory = 'all';
    this.currentQuestion = null;
    this.hasAnswered = false;

    // Audio Context
    this.audioCtx = null;

    // Badges definitions
    this.badges = [
      { id: 'first_step', name: 'First Step', icon: '🌱', desc: 'Solved your very first math challenge!' },
      { id: 'streak_5', name: 'Hot Streak', icon: '🔥', desc: 'Maintained a 5-question answer streak!' },
      { id: 'coins_100', name: 'Piggy Bank', icon: '🪙', desc: 'Accumulated over 100 MathCraft coins!' },
      { id: 'ten_frame_whiz', name: 'Making 10 Master', icon: '🔟', desc: 'Mastered the Ten-Frame addition strategy!' },
      { id: 'regroup_ace', name: 'Borrowing Pro', icon: '➖', desc: 'Mastered column subtraction with borrowing!' },
      { id: 'mult_architect', name: 'Array Architect', icon: '✖️', desc: 'Mastered rectangular arrays & commutative tables!' },
      { id: 'power_pioneer', name: 'Power Pioneer', icon: '⚡', desc: 'Explored squares, cubes & roots!' },
      { id: 'factorial_wizard', name: 'Factorial Wizard', icon: '❗', desc: 'Calculated factorials with cascade multipliers!' },
      { id: 'clock_master', name: 'Time Traveler', icon: '⏰', desc: 'Mastered reading analog and digital clock time!' },
      { id: 'algebra_alchemist', name: 'Equation Balancer', icon: '⚖️', desc: 'Balanced algebraic linear equations!' },
      { id: 'identity_scholar', name: 'Identity Scholar', icon: '📜', desc: 'Understood visual geometric identity proofs!' },
      { id: 'vector_navigator', name: '3D Navigator', icon: '🧭', desc: 'Projected 3D vectors in spatial coordinate space!' },
      { id: 'hack_apprentice', name: 'Mental Math Ninja', icon: '🧠', desc: 'Explored fast mental calculation hacks!' },
      { id: 'target24_solver', name: '24 Strategist', icon: '🎯', desc: 'Solved the Target 24 puzzle challenge!' },
      { id: 'blitz_champion', name: 'Blitz Champion', icon: '⚡', desc: 'Scored 150+ in the 60s Fluency Blitz!' }
    ];

    // Shop items
    this.shopItems = [
      { id: 'theme-galaxy', type: 'theme', name: 'Galaxy Neon Theme', price: 40, icon: '🌌', desc: 'Deep cosmic purple with luminous neon accents.' },
      { id: 'theme-cyberpunk', type: 'theme', name: 'Cyberpunk Theme', price: 60, icon: '⚡', desc: 'High-contrast futuristic electric cyan & magenta.' },
      { id: 'theme-dark', type: 'theme', name: 'Midnight Dark Theme', price: 20, icon: '🌙', desc: 'Sleek dark theme optimized for evening study.' },
      { id: 'title-mathlete', type: 'title', name: 'Title: "Grand Mathlete"', price: 50, icon: '🥇', desc: 'Special learner title in your player status.' },
      { id: 'title-prodigy', type: 'title', name: 'Title: "Algorithm Prodigy"', price: 100, icon: '👑', desc: 'Elite mastery title to showcase your prowess.' }
    ];

    // Language & Guided Quest State
    this.currentLang = localStorage.getItem('mc_lang') || 'en';
    this.questTopic = 'addition';
    this.questPhase = 1;
    this.questQuestions = [];
    this.questIndex = 0;
    this.questScore = 0;
    this.questSelectedOption = null;
    this.questHasSubmitted = false;

    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.updateStatsDisplay();
    this.initAudio();
    this.bindEvents();
    this.initConfetti();

    // Init Category 1: Arithmetic & Numbers
    this.initTenFrames();
    this.initSubtractionStepper();
    this.initMultiplicationArrays();
    this.initNegatives();
    this.initRounding();
    this.initFactors();
    this.initBodmas();

    // Init Category 2: Powers & Roots
    this.initSquares();
    this.initCubes();
    this.initFactorials();

    // Init Category 3: Fractions, Decimals, Money, Time
    this.initFractions();
    this.initDecimals();
    this.initMoney();
    this.initClock();

    // Init Category 4: Algebra & Identities
    this.initAlgebraScale();
    this.initIdentities();

    // Init Category 5: Geometry & 3D Vectors
    this.initShapes();
    this.initAngles();
    this.init3DVectors();

    // Init Category 6: Hacks
    this.initHacks();

    // Init Category 7: Games
    this.initBlitz();
    this.initTarget24();

    // Init Category 8: Practice
    this.initPractice();

    // Init Rewards Shop
    this.initShop();

    // Init Language & Guided 3-Step Quest Systems
    this.initLanguageSystem();
    this.initQuestSystem();
  }

  /* Theme & Audio */
  applyTheme(theme) {
    this.theme = theme;
    document.body.className = theme;
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme.includes('dark') || theme.includes('galaxy') || theme.includes('cyber') ? '☀️' : '🌙';
    }
    localStorage.setItem('mc_theme', theme);
  }

  toggleTheme() {
    const themes = ['theme-light', 'theme-dark', 'theme-galaxy', 'theme-cyberpunk'];
    const available = themes.filter(t => t === 'theme-light' || t === 'theme-dark' || this.purchasedItems.includes(t));
    const nextIdx = (available.indexOf(this.theme) + 1) % available.length;
    this.applyTheme(available[nextIdx]);
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.audioCtx = new AudioContext();
    } catch (e) {}
  }

  playTone(freq, type, duration, delay = 0) {
    if (!this.soundEnabled || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    const now = this.audioCtx.currentTime + delay;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  playChime() {
    this.playTone(523.25, 'triangle', 0.2, 0);
    this.playTone(659.25, 'triangle', 0.2, 0.08);
    this.playTone(783.99, 'triangle', 0.25, 0.16);
    this.playTone(1046.50, 'triangle', 0.4, 0.24);
  }

  playError() {
    this.playTone(260, 'sawtooth', 0.15, 0);
    this.playTone(220, 'sawtooth', 0.25, 0.12);
  }

  playClick() { this.playTone(600, 'sine', 0.04, 0); }

  playFanfare() {
    this.playTone(523.25, 'triangle', 0.15, 0);
    this.playTone(659.25, 'triangle', 0.15, 0.1);
    this.playTone(783.99, 'triangle', 0.2, 0.2);
    this.playTone(1046.50, 'triangle', 0.5, 0.35);
  }

  updateStatsDisplay() {
    const cEl = document.getElementById('user-coins');
    const xpEl = document.getElementById('user-xp');
    const streakEl = document.getElementById('user-streak');
    const badgeEl = document.getElementById('badge-count');
    const solvedEl = document.getElementById('practice-solved-count');
    const accEl = document.getElementById('practice-accuracy');
    const hsEl = document.getElementById('blitz-high-score');
    const shopCoins = document.getElementById('shop-coins-display');

    if (cEl) cEl.textContent = this.coins;
    if (xpEl) xpEl.textContent = this.xp;
    if (streakEl) streakEl.textContent = this.streak;
    if (badgeEl) badgeEl.textContent = this.unlockedBadges.length;
    if (solvedEl) solvedEl.textContent = this.solvedCount;
    if (hsEl) hsEl.textContent = `${this.blitzHighScore} pts`;
    if (shopCoins) shopCoins.textContent = `🪙 ${this.coins} Coins`;
    if (accEl) {
      const pct = this.solvedCount > 0 ? Math.round((this.correctCount / this.solvedCount) * 100) : 100;
      accEl.textContent = `${pct}%`;
    }
  }

  addCoins(amount) {
    this.coins += amount;
    localStorage.setItem('mc_coins', this.coins);
    this.updateStatsDisplay();
    if (this.coins >= 100) this.unlockBadge('coins_100');
  }

  addXP(amount) {
    this.xp += amount;
    localStorage.setItem('mc_xp', this.xp);
    this.addCoins(Math.floor(amount / 2));
    this.updateStatsDisplay();
  }

  unlockBadge(badgeId) {
    if (!this.unlockedBadges.includes(badgeId)) {
      this.unlockedBadges.push(badgeId);
      localStorage.setItem('mc_badges', JSON.stringify(this.unlockedBadges));
      this.updateStatsDisplay();
      this.playFanfare();
      this.fireConfetti();
    }
  }

  initConfetti() {
    this.canvas = document.getElementById('confetti-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
  }

  fireConfetti() {
    if (!this.canvas) return;
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    for (let i = 0; i < 70; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: this.canvas.height / 3 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 1.2) * 12,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 1
      });
    }
    if (!this.confettiRunning) {
      this.confettiRunning = true;
      this.animateConfetti();
    }
  }

  animateConfetti() {
    if (!this.confettiRunning) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.rotSpeed;
      p.life -= 0.015;
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
      if (p.life <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
      }
    }
    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.confettiRunning = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  bindEvents() {
    // Navigation Tabs
    const tabs = document.querySelectorAll('.topic-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.playClick();
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const topic = tab.getAttribute('data-topic');
        document.querySelectorAll('.topic-section').forEach(sec => sec.classList.remove('active'));
        const activeSec = document.getElementById(`topic-${topic}`);
        if (activeSec) activeSec.classList.add('active');
        if (topic === 'practice' && !this.currentQuestion) {
          this.generateQuestion();
        }
      });
    });

    // Sub Tabs
    document.querySelectorAll('.topic-section').forEach(sec => {
      const subTabs = sec.querySelectorAll('.sub-tab-btn');
      subTabs.forEach(st => {
        st.addEventListener('click', () => {
          this.playClick();
          subTabs.forEach(s => s.classList.remove('active'));
          st.classList.add('active');
          const subtabId = st.getAttribute('data-subtab');
          sec.querySelectorAll('.subtab-pane').forEach(p => p.classList.remove('active'));
          const activePane = sec.querySelector(`#pane-${subtabId}`);
          if (activePane) activePane.classList.add('active');
        });
      });
    });

    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      this.playClick();
      this.toggleTheme();
    });

    document.getElementById('sound-toggle')?.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      localStorage.setItem('mc_sound', this.soundEnabled);
      const icon = document.getElementById('sound-icon');
      if (icon) icon.textContent = this.soundEnabled ? '🔊' : '🔇';
      if (this.soundEnabled) this.playTone(440, 'sine', 0.1);
    });

    // Modals
    const badgeModal = document.getElementById('badge-modal');
    document.getElementById('badge-trigger-btn')?.addEventListener('click', () => {
      this.playClick();
      this.renderBadges();
      badgeModal?.classList.remove('hidden');
    });
    document.getElementById('btn-close-modal')?.addEventListener('click', () => badgeModal?.classList.add('hidden'));

    const shopModal = document.getElementById('shop-modal');
    document.getElementById('shop-trigger-btn')?.addEventListener('click', () => {
      this.playClick();
      this.renderShop();
      shopModal?.classList.remove('hidden');
    });
    document.getElementById('header-coins-pill')?.addEventListener('click', () => {
      this.playClick();
      this.renderShop();
      shopModal?.classList.remove('hidden');
    });
    document.getElementById('btn-close-shop')?.addEventListener('click', () => shopModal?.classList.add('hidden'));
  }

  /* Badges modal */
  renderBadges() {
    const container = document.getElementById('badges-container');
    if (!container) return;
    container.innerHTML = '';
    this.badges.forEach(b => {
      const unlocked = this.unlockedBadges.includes(b.id);
      const card = document.createElement('div');
      card.className = `badge-card ${unlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="badge-icon">${unlocked ? b.icon : '🔒'}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
        <div style="font-size:0.75rem; margin-top:6px; font-weight:700; color:${unlocked ? '#059669' : '#94a3b8'}">
          ${unlocked ? '✓ Unlocked' : 'Locked'}
        </div>
      `;
      container.appendChild(card);
    });
  }

  /* Shop modal */
  initShop() {
    this.renderShop();
  }

  renderShop() {
    const container = document.getElementById('shop-items-container');
    if (!container) return;
    container.innerHTML = '';

    this.shopItems.forEach(item => {
      const owned = this.purchasedItems.includes(item.id);
      const isEquipped = this.theme === item.id;
      const card = document.createElement('div');
      card.className = 'shop-item-card';

      let actionBtn = '';
      if (item.type === 'theme') {
        if (isEquipped) {
          actionBtn = '<button class="btn btn-secondary" disabled>Equipped</button>';
        } else if (owned) {
          actionBtn = `<button class="btn btn-outline" onclick="app.equipTheme('${item.id}')">Apply Theme</button>`;
        } else {
          actionBtn = `<button class="btn btn-primary" onclick="app.buyShopItem('${item.id}', ${item.price})">Buy 🪙 ${item.price}</button>`;
        }
      } else {
        if (owned) {
          actionBtn = '<button class="btn btn-secondary" disabled>Owned</button>';
        } else {
          actionBtn = `<button class="btn btn-primary" onclick="app.buyShopItem('${item.id}', ${item.price})">Buy 🪙 ${item.price}</button>`;
        }
      }

      card.innerHTML = `
        <div>
          <div style="font-size:1.8rem; margin-bottom:4px;">${item.icon}</div>
          <div class="si-title">${item.name}</div>
          <div class="si-desc">${item.desc}</div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
          <span class="si-price">🪙 ${item.price}</span>
          ${actionBtn}
        </div>
      `;
      container.appendChild(card);
    });
  }

  buyShopItem(itemId, price) {
    this.playClick();
    if (this.coins >= price && !this.purchasedItems.includes(itemId)) {
      this.coins -= price;
      this.purchasedItems.push(itemId);
      localStorage.setItem('mc_coins', this.coins);
      localStorage.setItem('mc_purchased', JSON.stringify(this.purchasedItems));
      this.playFanfare();
      this.fireConfetti();
      this.updateStatsDisplay();
      if (itemId.startsWith('theme-')) {
        this.applyTheme(itemId);
      }
      this.renderShop();
    } else {
      this.playError();
    }
  }

  equipTheme(themeId) {
    this.playClick();
    this.applyTheme(themeId);
    this.renderShop();
  }

  /* ==========================================================
     CATEGORY 1: ARITHMETIC & NUMBERS
     ========================================================== */
  initTenFrames() {
    const sA = document.getElementById('tf-a');
    const sB = document.getElementById('tf-b');
    const update = () => {
      const a = parseInt(sA.value, 10);
      const b = parseInt(sB.value, 10);
      document.getElementById('tf-a-val').textContent = a;
      document.getElementById('tf-b-val').textContent = b;
      const total = a + b;
      document.getElementById('tf-total-badge').textContent = `Total: ${total}`;

      const needTo10 = Math.max(0, 10 - a);
      const takeB = Math.min(b, needTo10);
      const remB = b - takeB;

      document.getElementById('tf-calc-exp').innerHTML = 
        `${a} + ${b} = ${a} + (${takeB} + ${remB}) = (${a} + ${takeB}) + ${remB} = <span class="highlight-num">10 + ${remB} = ${total}</span>`;

      const f1 = document.getElementById('tf-f1');
      const f2 = document.getElementById('tf-f2');
      if (f1 && f2) {
        f1.innerHTML = '';
        f2.innerHTML = '';
        for (let i = 0; i < 10; i++) {
          const slot = document.createElement('div');
          slot.className = 'tf-slot';
          if (i < a) slot.innerHTML = '<div class="tf-counter red"></div>';
          else if (i < a + takeB) slot.innerHTML = '<div class="tf-counter yellow"></div>';
          f1.appendChild(slot);
        }
        for (let i = 0; i < 10; i++) {
          const slot = document.createElement('div');
          slot.className = 'tf-slot';
          if (i < remB) slot.innerHTML = '<div class="tf-counter yellow"></div>';
          f2.appendChild(slot);
        }
      }
    };
    sA?.addEventListener('input', update);
    sB?.addEventListener('input', update);
    update();
  }

  initSubtractionStepper() {
    const btnNext = document.getElementById('sub-step-next');
    const btnPrev = document.getElementById('sub-step-prev');
    const btnReset = document.getElementById('sub-step-reset');
    const n1 = document.getElementById('sub-in-1');
    const n2 = document.getElementById('sub-in-2');

    const setup = () => {
      this.subStep = 0;
      let a = parseInt(n1.value, 10) || 72;
      let b = parseInt(n2.value, 10) || 38;
      if (a < b) { const tmp = a; a = b; b = tmp; n1.value = a; n2.value = b; }
      const t1 = Math.floor(a / 10), o1 = a % 10;
      const t2 = Math.floor(b / 10), o2 = b % 10;
      let borrow = false, resO = 0, resT = 0;
      if (o1 < o2) {
        borrow = true;
        resO = (o1 + 10) - o2;
        resT = (t1 - 1) - t2;
      } else {
        resO = o1 - o2;
        resT = t1 - t2;
      }
      this.subData = { a, b, t1, o1, t2, o2, borrow, resO, resT };
      this.renderSubStep();
    };

    n1?.addEventListener('input', setup);
    n2?.addEventListener('input', setup);
    btnNext?.addEventListener('click', () => {
      this.playClick();
      if (this.subStep < 3) { this.subStep++; this.renderSubStep(); }
    });
    btnPrev?.addEventListener('click', () => {
      this.playClick();
      if (this.subStep > 0) { this.subStep--; this.renderSubStep(); }
    });
    btnReset?.addEventListener('click', () => {
      this.playClick();
      this.subStep = 0;
      this.renderSubStep();
    });
    setup();
  }

  renderSubStep() {
    const { a, b, t1, o1, t2, o2, borrow, resO, resT } = this.subData;
    const board = document.getElementById('sub-math-board');
    const narr = document.getElementById('sub-narrative');
    const btnNext = document.getElementById('sub-step-next');
    const btnPrev = document.getElementById('sub-step-prev');

    btnPrev.disabled = this.subStep === 0;
    btnNext.disabled = this.subStep >= 3;

    let narrative = '';
    let topT = `${t1}`, topO = `${o1}`, ansO = '&nbsp;', ansT = '&nbsp;';

    if (this.subStep === 0) narrative = `Step 0: Align numbers vertically: ${a} &minus; ${b}.`;
    else if (this.subStep === 1) {
      if (borrow) {
        narrative = `Step 1 (Check Ones): ${o1} < ${o2}! Borrow 1 Ten &rarr; Tens becomes ${t1 - 1}, Ones becomes ${o1 + 10}.`;
        topT = `<span class="borrow-cross">${t1}</span> <span class="borrow-new">${t1 - 1}</span>`;
        topO = `<span class="borrow-cross">${o1}</span> <span class="borrow-new">${o1 + 10}</span>`;
      } else {
        narrative = `Step 1: ${o1} &minus; ${o2} = ${resO}.`;
        ansO = `${resO}`;
      }
    } else if (this.subStep >= 2) {
      if (borrow) {
        topT = `<span class="borrow-cross">${t1}</span> <span class="borrow-new">${t1 - 1}</span>`;
        topO = `<span class="borrow-cross">${o1}</span> <span class="borrow-new">${o1 + 10}</span>`;
      }
      ansO = `${resO}`; ansT = `${resT}`;
      narrative = `Step 2: Ones = ${resO}, Tens = ${resT}.`;
      if (this.subStep === 3) {
        narrative += `<br>🎉 Final Difference: <strong>${a} &minus; ${b} = ${a - b}</strong>!`;
        this.unlockBadge('regroup_ace');
      }
    }

    narr.innerHTML = narrative;
    board.innerHTML = `
      <table class="vert-math-table">
        <tr><td>${topT}</td><td>${topO}</td></tr>
        <tr class="op-row"><td style="text-align:left;">&minus;</td><td>${t2}</td><td>${o2}</td></tr>
        <tr class="result-row"><td>${ansT}</td><td>${ansO}</td></tr>
      </table>
    `;
  }

  initMultiplicationArrays() {
    const rIn = document.getElementById('ar-mult-r');
    const cIn = document.getElementById('ar-mult-c');
    const btnSwap = document.getElementById('btn-swap-array');

    const update = () => {
      const r = parseInt(rIn.value, 10);
      const c = parseInt(cIn.value, 10);
      document.getElementById('ar-mult-r-val').textContent = r;
      document.getElementById('ar-mult-c-val').textContent = c;
      const total = r * c;
      document.getElementById('ar-dots-badge').textContent = `${total} Items`;
      document.getElementById('ar-mult-eq').innerHTML = `${r} &times; ${c} = ${total}`;
      document.getElementById('ar-div-eq').innerHTML = `${total} &divide; ${r} = ${c}`;

      const stage = document.getElementById('ar-array-stage');
      if (stage) {
        stage.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'array-grid';
        grid.style.gridTemplateColumns = `repeat(${c}, 30px)`;
        for (let i = 0; i < total; i++) {
          const dot = document.createElement('div');
          dot.className = 'array-cell';
          grid.appendChild(dot);
        }
        stage.appendChild(grid);
      }
    };

    rIn?.addEventListener('input', update);
    cIn?.addEventListener('input', update);
    btnSwap?.addEventListener('click', () => {
      this.playClick();
      const r = rIn.value;
      rIn.value = cIn.value;
      cIn.value = r;
      update();
    });
    update();
  }

  initNegatives() {
    const startIn = document.getElementById('neg-start');
    const opIn = document.getElementById('neg-op');
    const chgIn = document.getElementById('neg-change');

    const update = () => {
      const start = parseInt(startIn.value, 10);
      const op = opIn.value;
      const chg = parseInt(chgIn.value, 10);
      document.getElementById('neg-start-val').textContent = start;
      document.getElementById('neg-change-val').textContent = chg;

      let res = 0, signStr = '+';
      if (op === 'add') { res = start + chg; signStr = '+'; }
      else if (op === 'sub') { res = start - chg; signStr = '&minus;'; }
      else { res = start * chg; signStr = '&times;'; }

      document.getElementById('neg-formula-text').innerHTML = 
        `(${start}) ${signStr} (${chg}) = <span class="highlight-num">${res}</span>`;

      // Thermometer
      const thermoFill = document.getElementById('thermo-fill');
      const thermoLabel = document.getElementById('thermo-label');
      if (thermoFill && thermoLabel) {
        const pct = Math.max(0, Math.min(100, ((res + 15) / 30) * 100));
        thermoFill.style.height = `${pct}%`;
        thermoLabel.textContent = `${res}°C`;
      }

      // Number Line SVG
      const svg = document.getElementById('int-line-svg');
      if (svg) {
        svg.innerHTML = `
          <line x1="20" y1="70" x2="430" y2="70" stroke="#94a3b8" stroke-width="3" />
          <circle cx="225" cy="70" r="5" fill="#64748b" />
          <text x="225" y="95" font-size="12" font-weight="700" fill="#64748b" text-anchor="middle">0</text>
        `;
        const xPos = 225 + (res * 12);
        const startX = 225 + (start * 12);
        svg.innerHTML += `
          <circle cx="${startX}" cy="70" r="6" fill="#4f46e5" />
          <circle cx="${xPos}" cy="70" r="7" fill="#ef4444" />
          <path d="M ${startX} 70 Q ${(startX + xPos) / 2} 25 ${xPos} 70" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4 3" />
          <text x="${xPos}" y="115" font-size="13" font-weight="800" font-family="monospace" fill="#ef4444" text-anchor="middle">${res}</text>
        `;
      }
    };

    startIn?.addEventListener('input', update);
    opIn?.addEventListener('change', update);
    chgIn?.addEventListener('input', update);
    update();
  }

  initRounding() {
    const inEl = document.getElementById('round-num-in');
    const update = () => {
      const v = parseFloat(inEl.value) || 0;
      document.getElementById('round-10').textContent = Math.round(v / 10) * 10;
      document.getElementById('round-100').textContent = Math.round(v / 100) * 100;
      document.getElementById('round-1000').textContent = Math.round(v / 1000) * 1000;
      document.getElementById('round-tenth').textContent = (Math.round(v * 10) / 10).toFixed(1);
    };
    inEl?.addEventListener('input', update);
    update();
  }

  initFactors() {
    const s = document.getElementById('factor-slider');
    const update = () => {
      const n = parseInt(s.value, 10);
      document.getElementById('factor-num-val').textContent = n;
      const primes = this.getPrimeFactors(n);
      const isPrime = primes.length === 1 && primes[0] === n;

      document.getElementById('factor-prime-badge').textContent = isPrime ? 'Prime Number!' : 'Composite';
      document.getElementById('factor-prime-exp').innerHTML = 
        `${n} = ${primes.join(' &times; ')}`;

      const stage = document.getElementById('factor-tree-canvas');
      if (stage) {
        stage.innerHTML = `
          <div style="font-family:var(--font-mono); font-weight:800; font-size:1.4rem; text-align:center;">
            <div style="background:var(--primary); color:white; padding:8px 16px; border-radius:8px; display:inline-block;">${n}</div>
            <div style="color:var(--text-muted); margin:4px 0;">&darr;</div>
            <div style="display:flex; justify-content:center; gap:8px;">
              ${primes.map(p => `<span style="background:var(--secondary); color:white; padding:6px 12px; border-radius:6px;">${p}</span>`).join('')}
            </div>
          </div>
        `;
      }
    };
    s?.addEventListener('input', update);
    update();
  }

  setFactorNum(n) {
    this.playClick();
    const s = document.getElementById('factor-slider');
    if (s) { s.value = n; s.dispatchEvent(new Event('input')); }
  }

  getPrimeFactors(n) {
    const factors = [];
    let d = 2;
    while (n >= 2) {
      if (n % d === 0) {
        factors.push(d);
        n /= d;
      } else {
        d++;
      }
    }
    return factors;
  }

  initBodmas() {
    const btn = document.getElementById('btn-eval-bodmas');
    btn?.addEventListener('click', () => {
      this.playClick();
      const expr = document.getElementById('bodmas-expr-in').value;
      const out = document.getElementById('bodmas-steps-output');
      out.innerHTML = `
        <div class="bodmas-step-row">
          <span>1. Brackets: (8 - 2) &rarr; 6</span>
          <span class="bodmas-step-tag">Step 1: B</span>
        </div>
        <div class="bodmas-step-row">
          <span>2. Multiplication & Division (left to right): 4 &times; 6 / 3 &rarr; 24 / 3 &rarr; 8</span>
          <span class="bodmas-step-tag">Step 2: D/M</span>
        </div>
        <div class="bodmas-step-row">
          <span>3. Addition: 3 + 8 &rarr; <strong>11</strong></span>
          <span class="bodmas-step-tag">Step 3: A</span>
        </div>
      `;
    });
  }

  /* ==========================================================
     CATEGORY 2: POWERS, ROOTS & FACTORIALS
     ========================================================== */
  initSquares() {
    const s = document.getElementById('sq-slider');
    const update = () => {
      const n = parseInt(s.value, 10);
      document.getElementById('sq-n-val').textContent = n;
      const sq = n * n;
      document.getElementById('sq-total-badge').textContent = `${sq} Tiles`;
      document.getElementById('sq-formula-text').innerHTML = 
        `${n}&sup2; = ${n} &times; ${n} = <span class="highlight-num">${sq}</span> &bull; &radic;${sq} = <span class="highlight-num">${n}</span>`;

      const stage = document.getElementById('square-tiles-stage');
      if (stage) {
        stage.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'square-grid-container';
        grid.style.gridTemplateColumns = `repeat(${n}, 24px)`;
        for (let i = 0; i < sq; i++) {
          const tile = document.createElement('div');
          tile.className = 'sq-tile';
          grid.appendChild(tile);
        }
        stage.appendChild(grid);
      }
      this.unlockBadge('power_pioneer');
    };
    s?.addEventListener('input', update);
    update();
  }

  initCubes() {
    const s = document.getElementById('cube-slider');
    const canvas = document.getElementById('cube-3d-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const update = () => {
      const n = parseInt(s.value, 10);
      document.getElementById('cube-n-val').textContent = n;
      const vol = n * n * n;
      document.getElementById('cube-total-badge').textContent = `${vol} Blocks`;
      document.getElementById('cube-formula-text').innerHTML = 
        `${n}&sup3; = ${n} &times; ${n} &times; ${n} = <span class="highlight-num">${vol}</span> &bull; &sup3;&radic;${vol} = <span class="highlight-num">${n}</span>`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isoX = (x, y, z) => 150 + (x - y) * 16;
      const isoY = (x, y, z) => 180 + (x + y) * 8 - z * 18;

      for (let z = 0; z < n; z++) {
        for (let y = n - 1; y >= 0; y--) {
          for (let x = 0; x < n; x++) {
            const px = isoX(x, y, z);
            const py = isoY(x, y, z);
            // Draw isometric top
            ctx.fillStyle = '#60a5fa';
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + 16, py - 8);
            ctx.lineTo(px, py - 16);
            ctx.lineTo(px - 16, py - 8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Right face
            ctx.fillStyle = '#2563eb';
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + 16, py - 8);
            ctx.lineTo(px + 16, py + 10);
            ctx.lineTo(px, py + 18);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Left face
            ctx.fillStyle = '#1d4ed8';
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px - 16, py - 8);
            ctx.lineTo(px - 16, py + 10);
            ctx.lineTo(px, py + 18);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        }
      }
    };
    s?.addEventListener('input', update);
    update();
  }

  initFactorials() {
    const s = document.getElementById('fact-slider');
    const update = () => {
      const n = parseInt(s.value, 10);
      document.getElementById('fact-n-val').textContent = n;
      let res = 1;
      const cascade = document.getElementById('fact-cascade-container');
      if (cascade) cascade.innerHTML = '';

      for (let i = n; i >= 1; i--) {
        res *= i;
        if (cascade) {
          const tile = document.createElement('div');
          tile.className = 'fact-tile';
          tile.textContent = i;
          cascade.appendChild(tile);
          if (i > 1) {
            const mul = document.createElement('span');
            mul.textContent = '×';
            cascade.appendChild(mul);
          }
        }
      }
      document.getElementById('fact-result-val').textContent = `${n}! = ${res}`;
      this.unlockBadge('factorial_wizard');
    };
    s?.addEventListener('input', update);
    update();
  }

  /* ==========================================================
     CATEGORY 3: FRACTIONS, DECIMALS, MONEY, TIME
     ========================================================== */
  initFractions() {
    const sN = document.getElementById('f-num-slider');
    const sD = document.getElementById('f-den-slider');
    const update = () => {
      let num = parseInt(sN.value, 10);
      const den = parseInt(sD.value, 10);
      if (num > den) { num = den; sN.value = num; }
      sN.max = den;
      document.getElementById('f-num-val').textContent = num;
      document.getElementById('f-den-val').textContent = den;
      document.getElementById('f-num-show').textContent = num;
      document.getElementById('f-den-show').textContent = den;

      const dec = den > 0 ? (num / den) : 0;
      document.getElementById('f-dec-show').textContent = dec.toFixed(2);
      document.getElementById('f-pct-show').textContent = `${Math.round(dec * 100)}%`;

      // SVG Pie
      const svg = document.getElementById('f-pie-svg');
      if (svg) {
        svg.innerHTML = '';
        const cx = 100, cy = 100, r = 75;
        for (let i = 0; i < den; i++) {
          const a1 = (i * 360) / den - 90;
          const a2 = ((i + 1) * 360) / den - 90;
          const x1 = cx + r * Math.cos((a1 * Math.PI) / 180);
          const y1 = cy + r * Math.sin((a1 * Math.PI) / 180);
          const x2 = cx + r * Math.cos((a2 * Math.PI) / 180);
          const y2 = cy + r * Math.sin((a2 * Math.PI) / 180);
          const largeArc = 360 / den > 180 ? 1 : 0;
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`);
          path.setAttribute('fill', i < num ? '#ec4899' : '#fce7f3');
          path.setAttribute('stroke', '#ffffff');
          path.setAttribute('stroke-width', '2');
          svg.appendChild(path);
        }
      }

      // Strip
      const wrap = document.getElementById('f-strip-wrap');
      if (wrap) {
        wrap.innerHTML = '';
        const strip = document.createElement('div');
        strip.className = 'fraction-strip';
        for (let i = 0; i < den; i++) {
          const p = document.createElement('div');
          p.className = `strip-part ${i < num ? 'filled' : ''}`;
          p.textContent = `1/${den}`;
          strip.appendChild(p);
        }
        wrap.appendChild(strip);
      }
    };
    sN?.addEventListener('input', update);
    sD?.addEventListener('input', update);
    update();
  }

  initDecimals() {
    const s = document.getElementById('dec-100-slider');
    const update = () => {
      const val = parseInt(s.value, 10);
      document.getElementById('dec-100-val').textContent = val;
      const decStr = (val / 100).toFixed(2);
      document.getElementById('dec-val-txt').textContent = decStr;
      document.getElementById('dec-frac-txt').textContent = `${val}/100`;
      document.getElementById('dec-pct-txt').textContent = `${val}%`;

      const board = document.getElementById('dec-hundred-board');
      if (board) {
        board.innerHTML = '';
        for (let i = 1; i <= 100; i++) {
          const cell = document.createElement('div');
          cell.className = `h-cell ${i <= val ? 'active' : ''}`;
          board.appendChild(cell);
        }
      }
    };
    s?.addEventListener('input', update);
    update();
  }

  initMoney() {
    this.updateMoneyUI();
  }

  updateCoins(coin, delta) {
    this.playClick();
    if (this.moneyCoins[coin] + delta >= 0 && this.moneyCoins[coin] + delta <= 20) {
      this.moneyCoins[coin] += delta;
      document.getElementById(`qty-${coin}`).textContent = this.moneyCoins[coin];
      this.updateMoneyUI();
    }
  }

  updateMoneyUI() {
    const q = this.moneyCoins.quarter * 0.25;
    const d = this.moneyCoins.dime * 0.10;
    const n = this.moneyCoins.nickel * 0.05;
    const p = this.moneyCoins.penny * 0.01;
    const total = q + d + n + p;
    const cents = Math.round(total * 100);

    document.getElementById('total-money-val').textContent = `$${total.toFixed(2)}`;
    document.getElementById('money-breakdown-val').textContent = 
      `${this.moneyCoins.quarter}×$0.25 + ${this.moneyCoins.dime}×$0.10 + ${this.moneyCoins.nickel}×$0.05 + ${this.moneyCoins.penny}×$0.01`;
    document.getElementById('money-fraction-txt').textContent = `= ${cents}/100 of a dollar!`;
  }

  initClock() {
    const sH = document.getElementById('clock-hr-slider');
    const sM = document.getElementById('clock-min-slider');
    const update = () => {
      const h = parseInt(sH.value, 10);
      const m = parseInt(sM.value, 10);
      document.getElementById('clock-hr-val').textContent = h;
      document.getElementById('clock-min-val').textContent = m < 10 ? `0${m}` : m;

      const padH = h < 10 ? `0${h}` : h;
      const padM = m < 10 ? `0${m}` : m;
      document.getElementById('clock-digital-box').textContent = `${padH}:${padM} PM`;

      // Angle calculation
      const hrAngle = (h % 12) * 30 + m * 0.5;
      const minAngle = m * 6;
      let diff = Math.abs(hrAngle - minAngle);
      if (diff > 180) diff = 360 - diff;
      document.getElementById('clock-angle-text').innerHTML = `Angle between hands: <span class="highlight-num">${diff.toFixed(1)}°</span>`;

      // SVG Clock Hands
      const svg = document.getElementById('analog-clock-svg');
      if (svg) {
        svg.innerHTML = `
          <circle cx="120" cy="120" r="100" fill="#f8fafc" stroke="#4f46e5" stroke-width="6" />
          <circle cx="120" cy="120" r="6" fill="#4f46e5" />
        `;
        // Ticks for 12 hours
        for (let i = 1; i <= 12; i++) {
          const a = (i * 30 - 90) * (Math.PI / 180);
          const x = 120 + 82 * Math.cos(a);
          const y = 120 + 82 * Math.sin(a) + 5;
          svg.innerHTML += `<text x="${x}" y="${y}" font-size="14" font-weight="800" text-anchor="middle" fill="#64748b">${i}</text>`;
        }
        // Hour hand
        const ha = (hrAngle - 90) * (Math.PI / 180);
        svg.innerHTML += `<line x1="120" y1="120" x2="${120 + 55 * Math.cos(ha)}" y2="${120 + 55 * Math.sin(ha)}" stroke="#4f46e5" stroke-width="5" stroke-linecap="round" />`;
        // Minute hand
        const ma = (minAngle - 90) * (Math.PI / 180);
        svg.innerHTML += `<line x1="120" y1="120" x2="${120 + 78 * Math.cos(ma)}" y2="${120 + 78 * Math.sin(ma)}" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round" />`;
      }
      this.unlockBadge('clock_master');
    };
    sH?.addEventListener('input', update);
    sM?.addEventListener('input', update);
    update();
  }

  /* ==========================================================
     CATEGORY 4: ALGEBRA & IDENTITIES
     ========================================================== */
  initAlgebraScale() {
    const sA = document.getElementById('scale-a');
    const sB = document.getElementById('scale-b');
    const sC = document.getElementById('scale-c');

    const update = () => {
      const a = parseInt(sA.value, 10);
      const b = parseInt(sB.value, 10);
      const c = parseInt(sC.value, 10);
      document.getElementById('scale-a-val').textContent = a;
      document.getElementById('scale-b-val').textContent = b;
      document.getElementById('scale-c-val').textContent = c;

      const x = ((c - b) / a).toFixed(2);
      document.getElementById('scale-steps-text').innerHTML = 
        `${a}x + ${b} = ${c} &rarr; ${a}x = ${c - b} &rarr; <span class="highlight-num">x = ${x}</span>`;

      const svg = document.getElementById('scale-svg');
      if (svg) {
        svg.innerHTML = `
          <line x1="60" y1="110" x2="300" y2="110" stroke="#64748b" stroke-width="5" />
          <polygon points="180,110 160,180 200,180" fill="#4f46e5" />
          <rect x="50" y="80" width="50" height="30" rx="4" fill="#0ea5e9" />
          <text x="75" y="100" font-size="12" font-weight="800" fill="white" text-anchor="middle">${a}x + ${b}</text>
          <rect x="260" y="80" width="50" height="30" rx="4" fill="#10b981" />
          <text x="285" y="100" font-size="12" font-weight="800" fill="white" text-anchor="middle">${c}</text>
        `;
      }
      this.unlockBadge('algebra_alchemist');
    };

    sA?.addEventListener('input', update);
    sB?.addEventListener('input', update);
    sC?.addEventListener('input', update);
    update();
  }

  initIdentities() {
    const sel = document.getElementById('identity-select');
    const sA = document.getElementById('id-a-slider');
    const sB = document.getElementById('id-b-slider');

    const update = () => {
      const a = parseInt(sA.value, 10);
      const b = parseInt(sB.value, 10);
      const idType = sel.value;
      document.getElementById('id-a-val').textContent = a;
      document.getElementById('id-b-val').textContent = b;

      const out = document.getElementById('id-breakdown-text');
      const stage = document.getElementById('identity-canvas-stage');

      if (idType === 'plus') {
        const total = (a + b) ** 2;
        out.innerHTML = `(${a} + ${b})² = ${a}² + 2(${a}&times;${b}) + ${b}² = ${a**2} + ${2*a*b} + ${b**2} = <span class="highlight-num">${total}</span>`;
        if (stage) {
          stage.innerHTML = `
            <div style="display:grid; grid-template-columns:${a*20}px ${b*20}px; grid-template-rows:${a*20}px ${b*20}px; gap:4px; font-family:var(--font-mono); font-weight:800;">
              <div style="background:#4f46e5; color:white; display:grid; place-items:center; border-radius:6px;">a² (${a**2})</div>
              <div style="background:#0ea5e9; color:white; display:grid; place-items:center; border-radius:6px;">ab (${a*b})</div>
              <div style="background:#0ea5e9; color:white; display:grid; place-items:center; border-radius:6px;">ab (${a*b})</div>
              <div style="background:#f59e0b; color:white; display:grid; place-items:center; border-radius:6px;">b² (${b**2})</div>
            </div>
          `;
        }
      } else {
        const total = a**2 - b**2;
        out.innerHTML = `${a}² &minus; ${b}² = (${a} &minus; ${b})(${a} + ${b}) = (${a-b})(${a+b}) = <span class="highlight-num">${total}</span>`;
      }
      this.unlockBadge('identity_scholar');
    };
    sel?.addEventListener('change', update);
    sA?.addEventListener('input', update);
    sB?.addEventListener('input', update);
    update();
  }

  /* ==========================================================
     CATEGORY 5: GEOMETRY, ANGLES & 3D VECTORS
     ========================================================== */
  initShapes() {
    const sel = document.getElementById('shape-select');
    const d1 = document.getElementById('shape-dim1');
    const d2 = document.getElementById('shape-dim2');

    const update = () => {
      const type = sel.value;
      const v1 = parseInt(d1.value, 10);
      const v2 = parseInt(d2.value, 10);
      document.getElementById('shape-dim1-val').textContent = v1;
      document.getElementById('shape-dim2-val').textContent = v2;

      let area = 0, perim = 0;
      const svg = document.getElementById('shape-svg');
      if (!svg) return;

      if (type === 'rect') {
        area = v1 * v2;
        perim = 2 * (v1 + v2);
        svg.innerHTML = `<rect x="60" y="40" width="${v1 * 12}" height="${v2 * 12}" fill="#e0e7ff" stroke="#4f46e5" stroke-width="4" rx="4" />`;
      } else if (type === 'triangle') {
        area = 0.5 * v1 * v2;
        const hyp = Math.sqrt(v1**2 + v2**2);
        perim = v1 + v2 + hyp;
        svg.innerHTML = `<polygon points="60,180 60,${180 - v2 * 10} ${60 + v1 * 12},180" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="4" />`;
      } else if (type === 'circle') {
        area = Math.PI * (v1 / 2) ** 2;
        perim = Math.PI * v1;
        svg.innerHTML = `<circle cx="150" cy="110" r="${v1 * 6}" fill="#fef3c7" stroke="#f59e0b" stroke-width="4" />`;
      }
      document.getElementById('shape-formula-text').innerHTML = 
        `Area = <span class="highlight-num">${area.toFixed(1)}</span> &bull; Perimeter = <span class="highlight-num">${perim.toFixed(1)}</span>`;
    };
    sel?.addEventListener('change', update);
    d1?.addEventListener('input', update);
    d2?.addEventListener('input', update);
    update();
  }

  initAngles() {
    const s = document.getElementById('angle-slider');
    const update = () => {
      const deg = parseInt(s.value, 10);
      document.getElementById('angle-deg-val').textContent = `${deg}°`;
      let type = 'Acute Angle';
      if (deg === 90) type = 'Right Angle (90°)';
      else if (deg > 90 && deg < 180) type = 'Obtuse Angle';
      else if (deg === 180) type = 'Straight Angle (180°)';
      else if (deg > 180) type = 'Reflex Angle';

      const rad = (deg * (Math.PI / 180)).toFixed(2);
      document.getElementById('angle-info-text').innerHTML = `Type: <span class="highlight-num">${type}</span> &bull; Radians: ${rad} rad`;

      const svg = document.getElementById('protractor-svg');
      if (svg) {
        svg.innerHTML = `
          <path d="M 40 180 A 120 120 0 0 1 280 180 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" />
          <line x1="40" y1="180" x2="280" y2="180" stroke="#64748b" stroke-width="3" />
        `;
        const aRad = (deg * Math.PI) / 180;
        const x2 = 160 + 110 * Math.cos(-aRad);
        const y2 = 180 + 110 * Math.sin(-aRad);
        svg.innerHTML += `
          <line x1="160" y1="180" x2="270" y2="180" stroke="#4f46e5" stroke-width="4" />
          <line x1="160" y1="180" x2="${x2}" y2="${y2}" stroke="#ef4444" stroke-width="4" />
          <circle cx="160" cy="180" r="5" fill="#4f46e5" />
        `;
      }
    };
    s?.addEventListener('input', update);
    update();
  }

  setAngle(deg) {
    this.playClick();
    const s = document.getElementById('angle-slider');
    if (s) { s.value = deg; s.dispatchEvent(new Event('input')); }
  }

  init3DVectors() {
    const sX = document.getElementById('vec-x');
    const sY = document.getElementById('vec-y');
    const sZ = document.getElementById('vec-z');
    const canvas = document.getElementById('vector-3d-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const update = () => {
      const x = parseInt(sX.value, 10);
      const y = parseInt(sY.value, 10);
      const z = parseInt(sZ.value, 10);
      document.getElementById('vec-x-val').textContent = x;
      document.getElementById('vec-y-val').textContent = y;
      document.getElementById('vec-z-val').textContent = z;

      const mag = Math.sqrt(x**2 + y**2 + z**2);
      document.getElementById('vec-badge').textContent = `v = (${x}, ${y}, ${z})`;
      document.getElementById('vec-mag-text').innerHTML = 
        `|v| = &radic;(${x}&sup2; + ${y}&sup2; + ${z}&sup2;) = &radic;${x**2+y**2+z**2} &approx; <span class="highlight-num">${mag.toFixed(2)}</span>`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = 170, cy = 130;

      // Draw 3D Axes
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;

      // X Axis (Down-Left)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 100, cy + 70);
      ctx.stroke();
      ctx.fillText('+X', cx - 110, cy + 85);

      // Y Axis (Right)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 120, cy);
      ctx.stroke();
      ctx.fillText('+Y', cx + 125, cy + 5);

      // Z Axis (Up)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - 100);
      ctx.stroke();
      ctx.fillText('+Z', cx - 8, cy - 105);

      // Project 3D vector to 2D screen
      const projX = cx + (y * 12) - (x * 10);
      const projY = cy + (x * 7) - (z * 12);

      // Vector Arrow
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(projX, projY);
      ctx.stroke();

      // Vector Point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(projX, projY, 6, 0, Math.PI * 2);
      ctx.fill();

      this.unlockBadge('vector_navigator');
    };

    sX?.addEventListener('input', update);
    sY?.addEventListener('input', update);
    sZ?.addEventListener('input', update);
    update();
  }

  /* ==========================================================
     CATEGORY 6: MATH HACKS VAULT
     ========================================================= */
  initHacks() {
    const h11 = document.getElementById('hack-11-in');
    h11?.addEventListener('input', () => {
      const v = parseInt(h11.value, 10);
      if (v >= 10 && v <= 99) {
        const d1 = Math.floor(v / 10);
        const d2 = v % 10;
        const sum = d1 + d2;
        let ans = 0;
        if (sum < 10) ans = `${d1}${sum}${d2}`;
        else ans = `${d1 + 1}${sum - 10}${d2}`;
        document.getElementById('hack-11-out').innerHTML = 
          `${v} &times; 11 &rarr; ${d1} _ ${d2} &rarr; ${d1}+${d2}=${sum} &rarr; <strong>${ans}</strong>!`;
        this.unlockBadge('hack_apprentice');
      }
    });

    const h5 = document.getElementById('hack-5-select');
    h5?.addEventListener('change', () => {
      const v = parseInt(h5.value, 10);
      const first = Math.floor(v / 10);
      const prod = first * (first + 1);
      document.getElementById('hack-5-out').innerHTML = 
        `${v}&sup2; &rarr; ${first} &times; (${first} + 1) = ${prod} &rarr; Attach 25 &rarr; <strong>${prod}25</strong>!`;
    });

    const h9 = document.getElementById('hack-9-select');
    h9?.addEventListener('change', () => {
      const v = parseInt(h9.value, 10);
      const tens = v - 1;
      const ones = 10 - v;
      document.getElementById('hack-9-out').innerHTML = 
        `Fold finger #${v} &rarr; ${tens} left (Tens), ${ones} right (Ones) = <strong>${tens}${ones}</strong>!`;
    });
  }

  /* ==========================================================
     CATEGORY 7: GAMES & TARGET 24
     ========================================================== */
  initBlitz() {
    const modeBtns = document.querySelectorAll('.blitz-mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.playClick();
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.blitzMode = btn.getAttribute('data-op');
      });
    });

    document.getElementById('btn-start-blitz')?.addEventListener('click', () => {
      this.playClick();
      this.startBlitz();
    });

    document.getElementById('btn-replay-blitz')?.addEventListener('click', () => {
      this.playClick();
      document.getElementById('blitz-gameover').classList.add('hidden');
      document.getElementById('blitz-lobby').classList.remove('hidden');
    });
  }

  startBlitz() {
    this.blitzActive = true;
    this.blitzTimeLeft = 60;
    this.blitzScore = 0;
    this.blitzCombo = 1;
    this.blitzCorrect = 0;
    this.blitzMistakes = 0;

    document.getElementById('blitz-lobby').classList.add('hidden');
    document.getElementById('blitz-gameover').classList.add('hidden');
    document.getElementById('blitz-game').classList.remove('hidden');

    this.updateBlitzUI();
    this.nextBlitzQuestion();

    if (this.blitzTimer) clearInterval(this.blitzTimer);
    this.blitzTimer = setInterval(() => {
      this.blitzTimeLeft--;
      this.updateBlitzUI();
      if (this.blitzTimeLeft <= 5 && this.blitzTimeLeft > 0) {
        this.playTone(400, 'square', 0.08);
      }
      if (this.blitzTimeLeft <= 0) {
        this.endBlitz();
      }
    }, 1000);
  }

  updateBlitzUI() {
    document.getElementById('blitz-time-left').textContent = `${this.blitzTimeLeft}s`;
    document.getElementById('blitz-current-score').textContent = this.blitzScore;
    document.getElementById('blitz-combo-val').textContent = `x${this.blitzCombo}`;
  }

  nextBlitzQuestion() {
    let op = this.blitzMode;
    if (op === 'mixed') {
      const ops = ['add', 'sub', 'mult'];
      op = ops[Math.floor(Math.random() * ops.length)];
    }

    let a, b, ans, prompt;
    if (op === 'add') {
      a = Math.floor(Math.random() * 25) + 5;
      b = Math.floor(Math.random() * 25) + 5;
      ans = a + b;
      prompt = `${a} + ${b} = ?`;
    } else if (op === 'sub') {
      b = Math.floor(Math.random() * 20) + 5;
      a = b + Math.floor(Math.random() * 30) + 5;
      ans = a - b;
      prompt = `${a} &minus; ${b} = ?`;
    } else {
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      ans = a * b;
      prompt = `${a} &times; ${b} = ?`;
    }

    const options = this.generateOptions(ans);
    this.blitzCurrentQ = { prompt, ans, options };
    document.getElementById('blitz-prompt').innerHTML = prompt;

    const grid = document.getElementById('blitz-options-grid');
    grid.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'blitz-opt-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.handleBlitzAnswer(opt, btn));
      grid.appendChild(btn);
    });
  }

  handleBlitzAnswer(val, btn) {
    if (!this.blitzActive) return;
    if (val === this.blitzCurrentQ.ans) {
      this.playTone(700, 'sine', 0.08);
      this.blitzScore += 10 * this.blitzCombo;
      this.blitzCombo = Math.min(5, this.blitzCombo + 1);
      this.blitzCorrect++;
      this.addCoins(2);
      this.addXP(5);
    } else {
      this.playTone(220, 'sawtooth', 0.12);
      this.blitzCombo = 1;
      this.blitzMistakes++;
    }
    this.updateBlitzUI();
    this.nextBlitzQuestion();
  }

  endBlitz() {
    this.blitzActive = false;
    clearInterval(this.blitzTimer);
    document.getElementById('blitz-game').classList.add('hidden');
    document.getElementById('blitz-gameover').classList.remove('hidden');

    if (this.blitzScore > this.blitzHighScore) {
      this.blitzHighScore = this.blitzScore;
      localStorage.setItem('mc_blitz_hs', this.blitzHighScore);
      this.updateStatsDisplay();
    }

    document.getElementById('blitz-final-score').textContent = `${this.blitzScore} Points`;
    document.getElementById('blitz-final-stats').textContent = 
      `${this.blitzCorrect} Correct • ${this.blitzMistakes} Mistakes`;

    if (this.blitzScore >= 150) this.unlockBadge('blitz_champion');
    this.playFanfare();
    this.fireConfetti();
  }

  initTarget24() {
    const btnRev = document.getElementById('btn-reveal-24');
    const btnNew = document.getElementById('btn-new-24');

    const puzzles = [
      { nums: [4, 6, 8, 2], sol: '(8 - 4) × 6 = 24 (or 4 × 6 = 24)' },
      { nums: [3, 3, 8, 8], sol: '8 / (3 - 8/3) = 24' },
      { nums: [5, 5, 5, 1], sol: '(5 - 1/5) × 5 = 24' },
      { nums: [1, 2, 3, 4], sol: '1 × 2 × 3 × 4 = 24' }
    ];

    let currIdx = 0;
    const renderP = () => {
      const p = puzzles[currIdx];
      const box = document.getElementById('t24-cards-box');
      if (box) {
        box.innerHTML = p.nums.map(n => `<div class="t24-card">${n}</div>`).join('');
      }
      document.getElementById('t24-sol-text').textContent = '';
    };

    btnRev?.addEventListener('click', () => {
      this.playClick();
      document.getElementById('t24-sol-text').textContent = `Solution: ${puzzles[currIdx].sol}`;
      this.unlockBadge('target24_solver');
    });

    btnNew?.addEventListener('click', () => {
      this.playClick();
      currIdx = (currIdx + 1) % puzzles.length;
      renderP();
    });

    renderP();
  }

  /* ==========================================================
     CATEGORY 8: PRACTICE ARENA
     ========================================================== */
  initPractice() {
    const catBtns = document.querySelectorAll('.quiz-cat-list .quiz-cat-btn');
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.playClick();
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.getAttribute('data-cat');
        this.generateQuestion();
      });
    });

    document.getElementById('btn-quiz-next')?.addEventListener('click', () => {
      this.playClick();
      this.generateQuestion();
    });

    document.getElementById('btn-quiz-hint')?.addEventListener('click', () => {
      this.playClick();
      if (this.currentQuestion) {
        const feedback = document.getElementById('quiz-feedback');
        feedback.classList.remove('hidden', 'success-border', 'error-border');
        document.getElementById('feedback-msg').textContent = '💡 Hint:';
        document.getElementById('feedback-exp').textContent = this.currentQuestion.hint;
      }
    });
  }

  generateQuestion() {
    this.hasAnswered = false;
    document.getElementById('quiz-feedback')?.classList.add('hidden');
    document.getElementById('btn-quiz-next')?.classList.add('hidden');

    let pool = ['addition', 'multiplication', 'powers', 'fractions', 'word-problems'];
    if (this.currentCategory !== 'all') pool = [this.currentCategory];
    const cat = pool[Math.floor(Math.random() * pool.length)];

    let q = null;
    if (cat === 'addition') q = this.createAdditionQuestion();
    else if (cat === 'multiplication') q = this.createMultiplicationQuestion();
    else if (cat === 'powers') q = this.createPowersQuestion();
    else if (cat === 'fractions') q = this.createFractionQuestion();
    else q = this.createWordProblemQuestion();

    this.currentQuestion = q;
    this.renderQuestion(q);
  }

  createAdditionQuestion() {
    const a = Math.floor(Math.random() * 45) + 15;
    const b = Math.floor(Math.random() * 45) + 15;
    const ans = a + b;
    return {
      cat: 'Addition', level: 'Level 1',
      prompt: `What is ${a} + ${b}?`,
      ans: ans, options: this.generateOptions(ans),
      hint: `Break into tens and ones: (${Math.floor(a/10)*10} + ${Math.floor(b/10)*10}) + (${a%10} + ${b%10}).`,
      exp: `${a} + ${b} = ${ans}.`
    };
  }

  createMultiplicationQuestion() {
    const a = Math.floor(Math.random() * 9) + 3;
    const b = Math.floor(Math.random() * 9) + 3;
    const ans = a * b;
    return {
      cat: 'Multiplication', level: 'Level 2',
      prompt: `What is ${a} &times; ${b}?`,
      ans: ans, options: this.generateOptions(ans),
      hint: `Think of ${a} rows of ${b}.`,
      exp: `${a} &times; ${b} = ${ans}.`
    };
  }

  createPowersQuestion() {
    const n = Math.floor(Math.random() * 7) + 2;
    const ans = n * n;
    return {
      cat: 'Powers & Roots', level: 'Level 2',
      prompt: `What is the value of ${n}&sup2;?`,
      ans: ans, options: this.generateOptions(ans),
      hint: `${n}&sup2; means ${n} multiplied by itself (${n} × ${n}).`,
      exp: `${n}&sup2; = ${n} &times; ${n} = ${ans}.`
    };
  }

  createFractionQuestion() {
    const d = [2, 3, 4, 5, 8][Math.floor(Math.random() * 5)];
    const n = Math.floor(Math.random() * (d - 1)) + 1;
    const pct = Math.round((n / d) * 100);
    return {
      cat: 'Fractions & Decimals', level: 'Level 2',
      prompt: `What is the percentage value of the fraction ${n}/${d}?`,
      ans: `${pct}%`,
      options: this.shuffle([`${pct}%`, `${pct + 10}%`, `${pct - 10}%`, `${Math.round(pct / 2)}%`]),
      hint: `Divide ${n} by ${d} and multiply by 100.`,
      exp: `${n}/${d} = ${(n/d).toFixed(2)} = ${pct}%.`
    };
  }

  createWordProblemQuestion() {
    const templates = [
      { text: (a, b) => `Leo saved $${a} in June and $${b} in July. How much has Leo saved in total?`, ans: (a,b) => a+b, exp: (a,b) => `$${a} + $${b} = $${a+b}.` },
      { text: (a, b) => `A bakery puts ${b} cookies in each box. If there are ${a} boxes, how many cookies are there in all?`, ans: (a,b) => a*b, exp: (a,b) => `${a} &times; ${b} = ${a*b}.` },
      { text: (a, b) => `Emma had ${a} stickers. She shared ${b} stickers with her sister. How many stickers remain?`, ans: (a,b) => a-b, exp: (a,b) => `${a} &minus; ${b} = ${a-b}.` }
    ];
    const t = templates[Math.floor(Math.random() * templates.length)];
    const a = Math.floor(Math.random() * 25) + 12;
    const b = Math.floor(Math.random() * 10) + 3;
    const ans = t.ans(a, b);
    return {
      cat: 'Story Word Problems', level: 'Level 2',
      prompt: t.text(a, b), ans: ans, options: this.generateOptions(ans),
      hint: 'Look for keywords like "in total" (+), "each box" (×), or "remain" (-).',
      exp: t.exp(a, b)
    };
  }

  generateOptions(correct) {
    const opts = new Set([correct]);
    while (opts.size < 4) {
      const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      opts.add(Math.max(1, correct + delta));
    }
    const arr = Array.from(opts);
    this.shuffle(arr);
    return arr;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  renderQuestion(q) {
    document.getElementById('quiz-topic-tag').textContent = q.cat;
    document.getElementById('quiz-level-tag').textContent = q.level;
    document.getElementById('quiz-prompt').innerHTML = q.prompt;

    const optContainer = document.getElementById('quiz-options-container');
    optContainer.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.handleAnswer(opt, btn));
      optContainer.appendChild(btn);
    });
  }

  handleAnswer(selected, button) {
    if (this.hasAnswered) return;
    this.hasAnswered = true;
    this.solvedCount++;
    localStorage.setItem('mc_solved', this.solvedCount);

    const isCorrect = String(selected) === String(this.currentQuestion.ans);
    const feedback = document.getElementById('quiz-feedback');
    const msg = document.getElementById('feedback-msg');
    const exp = document.getElementById('feedback-exp');
    const btnNext = document.getElementById('btn-quiz-next');

    document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.disabled = true;
      if (String(btn.textContent) === String(this.currentQuestion.ans)) {
        btn.classList.add('correct');
      }
    });

    feedback.classList.remove('hidden', 'success-border', 'error-border');

    if (isCorrect) {
      button.classList.add('correct');
      feedback.classList.add('success-border');
      msg.textContent = '🎉 Excellent! That is correct!';
      msg.style.color = '#10b981';
      exp.innerHTML = this.currentQuestion.exp;

      this.correctCount++;
      this.streak++;
      localStorage.setItem('mc_correct', this.correctCount);
      localStorage.setItem('mc_streak', this.streak);

      this.playChime();
      this.fireConfetti();
      this.addXP(20);
      this.addCoins(5);
      this.unlockBadge('first_step');
      if (this.streak >= 5) this.unlockBadge('streak_5');
    } else {
      button.classList.add('incorrect');
      feedback.classList.add('error-border');
      msg.textContent = 'Keep trying! Not quite.';
      msg.style.color = '#ef4444';
      exp.innerHTML = `Correct answer is <strong>${this.currentQuestion.ans}</strong>. ${this.currentQuestion.exp}`;
      this.streak = 0;
      localStorage.setItem('mc_streak', this.streak);
      this.playError();
    }

    this.updateStatsDisplay();
    btnNext?.classList.remove('hidden');
  }
  /* ========================================================
     LANGUAGE SYSTEM & INTERNATIONALIZATION
     ======================================================== */
  initLanguageSystem() {
    this.i18n = {
      en: {
        lang_name: 'English',
        shop_btn: 'Shop',
        quest_badge: '🚀 3-Step Guided Learning Method',
        quest_hero_title: 'Learn Any Math Topic With Visuals & Secret Hacks',
        quest_hero_desc: '1️⃣ Click Start for simple explanations & shortcuts • 2️⃣ Click Understood when ready • 3️⃣ Solve 10 Questions with Hints & Hacks, then click Submit to earn coins!',
        choose_topic_label: 'Select Topic:',
        start_lesson_btn: 'Start Lesson',
        lang_modal_title: '🌐 Select Language / भाषा / Idioma',
        lang_modal_sub: 'Choose your preferred language. All lessons, hacks, hints, and quiz questions will automatically adapt!',
        understood_btn: 'Understood! Take 10-Question Challenge',
        hint_btn: 'Need a Hint?',
        hack_btn: 'Use the Hack',
        hint_title: '💡 Helpful Hint:',
        hack_title: '⚡ Secret Hack Reminder:',
        submit_btn: 'Check & Submit Answer',
        next_btn: 'Next Question →',
        quest_complete_title: '10-Question Quest Complete! 🎉',
        quest_complete_msg: 'Incredible mastery! You applied the hacks and crushed all 10 challenges like a true math wizard!',
        correct_title: 'Correct! 🎉',
        wrong_title: 'Not quite, but let\'s review:',
        step_1_label: 'Step 1: Explanations & Visual Hacks',
        step_2_label: 'Step 2: 10-Question Challenge',
        score_label: 'Score:',
        question_of: 'Question {current} of {total}'
      },
      es: {
        lang_name: 'Español',
        shop_btn: 'Tienda',
        quest_badge: '🚀 Método de Aprendizaje Guiado en 3 Pasos',
        quest_hero_title: 'Aprende Cualquier Tema Matemático con Visuales y Trucos',
        quest_hero_desc: '1️⃣ Haz clic en Comenzar para ver explicaciones y atajos • 2️⃣ Haz clic en Entendido cuando estés listo • 3️⃣ Resuelve 10 Preguntas con Pistas y Trucos, luego haz clic en Enviar para ganar monedas!',
        choose_topic_label: 'Elige un tema:',
        start_lesson_btn: 'Comenzar Lección',
        lang_modal_title: '🌐 Seleccionar Idioma / Select Language',
        lang_modal_sub: '¡Elige tu idioma preferido. Todas las lecciones, trucos, pistas y preguntas se adaptarán automáticamente!',
        understood_btn: '¡Entendido! Hacer el Desafío de 10 Preguntas',
        hint_btn: '¿Necesitas una pista?',
        hack_btn: 'Usar el Truco',
        hint_title: '💡 Pista Útil:',
        hack_title: '⚡ Recordatorio del Truco Secreto:',
        submit_btn: 'Comprobar y Enviar Respuesta',
        next_btn: 'Siguiente Pregunta →',
        quest_complete_title: '¡Misión de 10 Preguntas Completada! 🎉',
        quest_complete_msg: '¡Dominio increíble! ¡Aplicaste los trucos y superaste los 10 desafíos como un verdadero genio matemático!',
        correct_title: '¡Correcto! 🎉',
        wrong_title: 'No del todo, pero repasemos:',
        step_1_label: 'Paso 1: Explicaciones y Trucos Visuales',
        step_2_label: 'Paso 2: Desafío de 10 Preguntas',
        score_label: 'Puntaje:',
        question_of: 'Pregunta {current} de {total}'
      },
      hi: {
        lang_name: 'हिन्दी',
        shop_btn: 'दुकान',
        quest_badge: '🚀 3-चरण मार्गदर्शित शिक्षण विधि',
        quest_hero_title: 'चित्रों और जादुई ट्रिक्स के साथ कोई भी गणित विषय सीखें',
        quest_hero_desc: '1️⃣ सरल व्याख्या और शॉर्टकट देखने के लिए "शुरू करें" पर क्लिक करें • 2️⃣ तैयार होने पर "समझ गया" पर क्लिक करें • 3️⃣ हिंट और ट्रिक के साथ 10 प्रश्न हल करें, फिर सिक्के कमाने के लिए जमा करें!',
        choose_topic_label: 'विषय चुनें:',
        start_lesson_btn: 'पाठ शुरू करें',
        lang_modal_title: '🌐 भाषा चुनें / Select Language',
        lang_modal_sub: 'अपनी पसंदीदा भाषा चुनें। सभी पाठ, ट्रिक्स, संकेत और क्विज़ प्रश्न अपने आप अनुकूलित हो जाएंगे!',
        understood_btn: 'समझ गया! 10-प्रश्नों की चुनौती लें',
        hint_btn: 'संकेत चाहिए?',
        hack_btn: 'ट्रिक का उपयोग करें',
        hint_title: '💡 मददगार संकेत (Hint):',
        hack_title: '⚡ गुप्त ट्रिक (Hack Reminder):',
        submit_btn: 'जाँचें और उत्तर जमा करें',
        next_btn: 'अगला प्रश्न →',
        quest_complete_title: '10-प्रश्नों की खोज पूरी हुई! 🎉',
        quest_complete_msg: 'अद्भुत महारत! आपने ट्रिक्स का उपयोग किया और एक सच्चे गणित जादूगर की तरह सभी 10 चुनौतियों को हल किया!',
        correct_title: 'बिल्कुल सही! 🎉',
        wrong_title: 'काफ़ी करीब, आइए इसे समझें:',
        step_1_label: 'चरण 1: व्याख्या और जादुई ट्रिक्स',
        step_2_label: 'चरण 2: 10-प्रश्नों की चुनौती',
        score_label: 'स्कोर:',
        question_of: 'प्रश्न {current} / {total}'
      },
      fr: {
        lang_name: 'Français',
        shop_btn: 'Boutique',
        quest_badge: '🚀 Méthode d\'Apprentissage Guidée en 3 Étapes',
        quest_hero_title: 'Maîtrisez les Maths avec des Visuels et des Astuces Secrètes',
        quest_hero_desc: '1️⃣ Cliquez sur Commencer pour les explications et raccourcis • 2️⃣ Cliquez sur Compris quand vous êtes prêt • 3️⃣ Résolvez 10 Questions avec Indices et Astuces, puis cliquez sur Soumettre pour gagner des pièces!',
        choose_topic_label: 'Choisir un sujet:',
        start_lesson_btn: 'Commencer la Leçon',
        lang_modal_title: '🌐 Sélectionner la Langue / Select Language',
        lang_modal_sub: 'Choisissez votre langue préférée. Toutes les leçons, astuces, indices et questions s\'adapteront automatiquement!',
        understood_btn: 'Compris ! Relever le Défi de 10 Questions',
        hint_btn: 'Besoin d\'un indice ?',
        hack_btn: 'Utiliser l\'Astuce',
        hint_title: '💡 Indice Utile:',
        hack_title: '⚡ Rappel de l\'Astuce Secrète:',
        submit_btn: 'Vérifier et Soumettre',
        next_btn: 'Question Suivante →',
        quest_complete_title: 'Quête de 10 Questions Terminée ! 🎉',
        quest_complete_msg: 'Maîtrise incroyable ! Vous avez appliqué les astuces et réussi les 10 défis comme un vrai sorcier des maths !',
        correct_title: 'Correct ! 🎉',
        wrong_title: 'Pas tout à fait, voyons ensemble :',
        step_1_label: 'Étape 1: Explications et Astuces Visuelles',
        step_2_label: 'Étape 2: Défi de 10 Questions',
        score_label: 'Score:',
        question_of: 'Question {current} sur {total}'
      },
      de: {
        lang_name: 'Deutsch',
        shop_btn: 'Shop',
        quest_badge: '🚀 Geführte 3-Schritte-Lernmethode',
        quest_hero_title: 'Lerne jedes Mathe-Thema mit Visualisierungen & Tricks',
        quest_hero_desc: '1️⃣ Klicke auf Start für einfache Erklärungen & Shortcuts • 2️⃣ Klicke auf Verstanden, wenn du bereit bist • 3️⃣ Löse 10 Fragen mit Hinweisen & Tricks, klicke dann auf Absenden!',
        choose_topic_label: 'Thema wählen:',
        start_lesson_btn: 'Lektion starten',
        lang_modal_title: '🌐 Sprache wählen / Select Language',
        lang_modal_sub: 'Wähle deine bevorzugte Sprache. Alle Lektionen, Tricks und Fragen passen sich automatisch an!',
        understood_btn: 'Verstanden! Zur 10-Fragen-Challenge',
        hint_btn: 'Brauchst du einen Hinweis?',
        hack_btn: 'Trick nutzen',
        hint_title: '💡 Nützlicher Hinweis:',
        hack_title: '⚡ Geheimer Trick:',
        submit_btn: 'Antwort prüfen & absenden',
        next_btn: 'Nächste Frage →',
        quest_complete_title: '10-Fragen-Quest abgeschlossen! 🎉',
        quest_complete_msg: 'Unglaubliche Leistung! Du hast die Tricks wie ein echter Mathe-Profi angewendet!',
        correct_title: 'Richtig! 🎉',
        wrong_title: 'Nicht ganz, schauen wir es uns an:',
        step_1_label: 'Schritt 1: Erklärungen & Tricks',
        step_2_label: 'Schritt 2: 10-Fragen-Challenge',
        score_label: 'Punkte:',
        question_of: 'Frage {current} von {total}'
      },
      zh: {
        lang_name: '中文',
        shop_btn: '商店',
        quest_badge: '🚀 三步系统化启发学习法',
        quest_hero_title: '通过图形与神奇速算技巧轻松精通数学',
        quest_hero_desc: '1️⃣ 点击“开始课程”查看通俗讲解与速算口诀 • 2️⃣ 准备好后点击“明白/已理解” • 3️⃣ 借助提示与技巧完成10道实战题并提交，赢取金币！',
        choose_topic_label: '选择主题：',
        start_lesson_btn: '开始课程',
        lang_modal_title: '🌐 选择语言 / Select Language',
        lang_modal_sub: '选择你熟悉的语言，所有课件、速算技巧、提示与问答都将自动切换！',
        understood_btn: '已理解！开始10道实战挑战',
        hint_btn: '需要提示吗？',
        hack_btn: '使用速算秘籍',
        hint_title: '💡 实用提示：',
        hack_title: '⚡ 绝妙速算秘籍回顾：',
        submit_btn: '核对并提交答案',
        next_btn: '下一题 →',
        quest_complete_title: '10道挑战顺利完成！🎉',
        quest_complete_msg: '太棒了！你完美掌握了速算秘籍，像真正的数学大师一样解开了全部题目！',
        correct_title: '回答正确！🎉',
        wrong_title: '稍有出入，让我们一起回顾解析：',
        step_1_label: '第一步：直观解析与速算技巧',
        step_2_label: '第二步：10道实战闯关',
        score_label: '得分：',
        question_of: '第 {current} 题 / 共 {total} 题'
      },
      ar: {
        lang_name: 'العربية',
        shop_btn: 'المتجر',
        quest_badge: '🚀 طريقة التعلم الموجه في 3 خطوات',
        quest_hero_title: 'تعلم أي مفهوم رياضيات بالرسومات والحيل الذكية',
        quest_hero_desc: '1️⃣ انقر على ابدأ للشرح المبسط والحيل الذهنية • 2️⃣ انقر على فهمت عندما تكون مستعداً • 3️⃣ أجب عن 10 أسئلة مع التلميحات ثم انقر إرسال لكسب العملات!',
        choose_topic_label: 'اختر موضوعاً:',
        start_lesson_btn: 'ابدأ الدرس',
        lang_modal_title: '🌐 اختر اللغة / Select Language',
        lang_modal_sub: 'اختر لغتك المفضلة وسيتم تحويل الدروس والحيل والتلميحات والأسئلة تلقائياً!',
        understood_btn: 'فهمت! خوض تحدي الـ 10 أسئلة',
        hint_btn: 'تحتاج تلميحاً؟',
        hack_btn: 'استخدم الحيلة الذكية',
        hint_title: '💡 تلميح مفيد:',
        hack_title: '⚡ تذكير بالحيلة السحرية:',
        submit_btn: 'تحقق وأرسل الإجابة',
        next_btn: 'السؤال التالي →',
        quest_complete_title: 'اكتمل تحدي الـ 10 أسئلة بنجاح! 🎉',
        quest_complete_msg: 'براعة مذهلة! طبقت الحيل الرياضية بذكاء كعالم رياضيات حقيقي!',
        correct_title: 'إجابة صحيحة! 🎉',
        wrong_title: 'ليس تماماً، دعنا نراجع الخطوات:',
        step_1_label: 'الخطوة 1: الشرح والحيل البصرية',
        step_2_label: 'الخطوة 2: تحدي الـ 10 أسئلة',
        score_label: 'النتيجة:',
        question_of: 'سؤال {current} من {total}'
      },
      ja: {
        lang_name: '日本語',
        shop_btn: 'ショップ',
        quest_badge: '🚀 3ステップ式ガイド付き学習法',
        quest_hero_title: 'ビジュアルと裏ワザで数学の概念を直感的にマスター',
        quest_hero_desc: '1️⃣「開始」で分かりやすい図解と裏ワザを確認 • 2️⃣ 準備ができたら「理解した」をクリック • 3️⃣ ヒントを活用して10問に挑戦し「提出」してコインを獲得！',
        choose_topic_label: 'トピックを選択:',
        start_lesson_btn: 'レッスンを開始',
        lang_modal_title: '🌐 言語を選択 / Select Language',
        lang_modal_sub: 'お好みの言語を選択してください。すべての解説、裏ワザ、ヒント、問題文が自動で切り替わります！',
        understood_btn: '理解しました！10問チャレンジへ進む',
        hint_btn: 'ヒントを見る',
        hack_btn: '裏ワザを使う',
        hint_title: '💡 考え方のヒント:',
        hack_title: '⚡ 計算の裏ワザ復習:',
        submit_btn: '解答を確認して提出',
        next_btn: '次の問題へ →',
        quest_complete_title: '10問チャレンジ完全制覇！🎉',
        quest_complete_msg: '素晴らしい！裏ワザを完璧に使いこなし、全10問をマスターしました！',
        correct_title: '大正解！🎉',
        wrong_title: 'おしい！解き方をおさらいしましょう：',
        step_1_label: 'ステップ1: 図解解説と計算の裏ワザ',
        step_2_label: 'ステップ2: 10問実戦チャレンジ',
        score_label: 'スコア:',
        question_of: '第 {current} 問 / 全 {total} 問'
      },
      pt: {
        lang_name: 'Português',
        shop_btn: 'Loja',
        quest_badge: '🚀 Método de Aprendizagem Guiada em 3 Passos',
        quest_hero_title: 'Aprenda Qualquer Tópico de Matemática com Visuais e Truques',
        quest_hero_desc: '1️⃣ Clique em Começar para ver explicações e atalhos • 2️⃣ Clique em Entendi quando estiver pronto • 3️⃣ Resolva 10 Questões com Dicas e Truques, depois envie para ganhar moedas!',
        choose_topic_label: 'Selecione o Tópico:',
        start_lesson_btn: 'Começar Lição',
        lang_modal_title: '🌐 Selecionar Idioma / Select Language',
        lang_modal_sub: 'Escolha seu idioma de preferência. Todas as lições, truques, dicas e perguntas se adaptarão automaticamente!',
        understood_btn: 'Entendi! Fazer o Desafio de 10 Questões',
        hint_btn: 'Precisa de uma dica?',
        hack_btn: 'Usar o Truque',
        hint_title: '💡 Dica Útil:',
        hack_title: '⚡ Lembrete do Truque Secreto:',
        submit_btn: 'Conferir e Enviar Resposta',
        next_btn: 'Próxima Questão →',
        quest_complete_title: 'Missão de 10 Questões Concluída! 🎉',
        quest_complete_msg: 'Domínio incrível! Você aplicou os truques como um verdadeiro mestre da matemática!',
        correct_title: 'Correto! 🎉',
        wrong_title: 'Quase lá, vamos revisar:',
        step_1_label: 'Passo 1: Explicações e Truques Visuais',
        step_2_label: 'Passo 2: Desafio de 10 Questões',
        score_label: 'Pontuação:',
        question_of: 'Questão {current} de {total}'
      }
    };

    // Open/Close Language Modal
    const btnLang = document.getElementById('btn-language');
    const modalLang = document.getElementById('language-modal');
    const btnCloseLang = document.getElementById('btn-close-lang');

    btnLang?.addEventListener('click', () => {
      modalLang?.classList.remove('hidden');
      this.playClick();
    });

    btnCloseLang?.addEventListener('click', () => {
      modalLang?.classList.add('hidden');
      this.playClick();
    });

    modalLang?.addEventListener('click', (e) => {
      if (e.target === modalLang) modalLang.classList.add('hidden');
    });

    // Language Option Selection
    const langCards = document.querySelectorAll('.lang-card');
    langCards.forEach(card => {
      card.addEventListener('click', () => {
        const lang = card.dataset.lang;
        if (lang) {
          this.setLanguage(lang);
          modalLang?.classList.add('hidden');
        }
      });
    });

    this.applyLanguage(this.currentLang);
  }

  setLanguage(lang) {
    if (!this.i18n[lang]) lang = 'en';
    this.currentLang = lang;
    localStorage.setItem('mc_lang', lang);
    this.applyLanguage(lang);
    this.playChime();
    
    // If quest modal is currently active, update its visible texts
    if (this.questActive) {
      if (this.questPhase === 1) this.renderQuestPhase1();
      else if (this.questPhase === 2) this.renderQuestQuestion(this.questIndex);
    }
  }

  applyLanguage(lang) {
    const dict = this.i18n[lang] || this.i18n.en;
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }

    const currentLangLabel = document.getElementById('current-lang-label');
    if (currentLangLabel) currentLangLabel.textContent = dict.lang_name;

    // Highlight active card
    document.querySelectorAll('.lang-card').forEach(card => {
      if (card.dataset.lang === lang) card.classList.add('active');
      else card.classList.remove('active');
    });

    // Translate elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }

  getTranslation(key, fallback = '') {
    const dict = this.i18n[this.currentLang] || this.i18n.en;
    return dict[key] || fallback;
  }

  /* ========================================================
     GUIDED 3-STEP QUEST SYSTEM
     Step 1: Start -> Explanations & Visual Hacks
     Step 2: Understood -> 10 Questions with Hints & Hacks
     Step 3: Submit -> Instant Feedback, Payout & Celebration!
     ======================================================== */
  initQuestSystem() {
    this.questActive = false;
    const heroStartBtn = document.getElementById('btn-start-quest-hero');
    const heroTopicSelect = document.getElementById('quest-topic-select');
    const modalQuest = document.getElementById('quest-modal');
    const btnCloseQuest = document.getElementById('btn-close-quest');
    const btnUnderstood = document.getElementById('btn-quest-understood');
    const btnHint = document.getElementById('btn-quest-hint');
    const btnHack = document.getElementById('btn-quest-hack');
    const btnSubmit = document.getElementById('btn-quest-submit');
    const btnNext = document.getElementById('btn-quest-next');
    const btnRetry = document.getElementById('btn-quest-retry');
    const btnNewTopic = document.getElementById('btn-quest-new-topic');
    const btnOpenShop = document.getElementById('btn-quest-open-shop');

    // Hero Start Button
    heroStartBtn?.addEventListener('click', () => {
      const topic = heroTopicSelect?.value || 'addition';
      this.startQuest(topic);
    });

    // Close Quest Modal
    btnCloseQuest?.addEventListener('click', () => {
      modalQuest?.classList.add('hidden');
      this.questActive = false;
      this.playClick();
    });

    modalQuest?.addEventListener('click', (e) => {
      if (e.target === modalQuest) {
        modalQuest.classList.add('hidden');
        this.questActive = false;
      }
    });

    // Understood Button -> Moves to 10 Questions Challenge
    btnUnderstood?.addEventListener('click', () => {
      this.goToQuestQuiz();
    });

    // Support Tools: Hint & Hack Toggles
    btnHint?.addEventListener('click', () => {
      const box = document.getElementById('qm-hint-box');
      box?.classList.toggle('hidden');
      this.playClick();
    });

    btnHack?.addEventListener('click', () => {
      const box = document.getElementById('qm-hack-box');
      box?.classList.toggle('hidden');
      this.playClick();
    });

    // Submit Answer Button
    btnSubmit?.addEventListener('click', () => {
      this.submitQuestAnswer();
    });

    // Next Question Button
    btnNext?.addEventListener('click', () => {
      this.nextQuestQuestion();
    });

    // Retry Quest
    btnRetry?.addEventListener('click', () => {
      this.startQuest(this.questTopic);
    });

    // New Topic Button
    btnNewTopic?.addEventListener('click', () => {
      modalQuest?.classList.add('hidden');
      this.questActive = false;
      document.getElementById('quest-hero-banner')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Visit Shop from Quest Complete
    btnOpenShop?.addEventListener('click', () => {
      modalQuest?.classList.add('hidden');
      this.questActive = false;
      document.getElementById('shop-modal')?.classList.remove('hidden');
      this.renderShop();
    });
  }

  startQuest(topicKey) {
    this.questActive = true;
    this.questTopic = topicKey;
    this.questPhase = 1;
    this.questScore = 0;
    this.questIndex = 0;
    this.questSelectedOption = null;
    this.questHasSubmitted = false;

    const data = this.getQuestData(topicKey);
    this.currentQuestData = data;
    this.questQuestions = data.questions;

    const modal = document.getElementById('quest-modal');
    modal?.classList.remove('hidden');

    this.renderQuestPhase1();
    this.playChime();
  }

  renderQuestPhase1() {
    this.questPhase = 1;
    const data = this.currentQuestData;
    const dict = this.i18n[this.currentLang] || this.i18n.en;

    document.getElementById('quest-phase-1')?.classList.remove('hidden');
    document.getElementById('quest-phase-2')?.classList.add('hidden');
    document.getElementById('quest-phase-3')?.classList.add('hidden');

    const topicTag = document.getElementById('qm-topic-tag');
    const stepInd = document.getElementById('qm-step-indicator');
    const iconBanner = document.getElementById('qm-icon-banner');
    const title = document.getElementById('qm-title');
    const desc = document.getElementById('qm-desc');
    const demo = document.getElementById('qm-visual-demo');
    const hackTitle = document.getElementById('qm-hack-title');
    const hackContent = document.getElementById('qm-hack-content');

    if (topicTag) topicTag.textContent = data.icon + ' ' + data.name;
    if (stepInd) stepInd.textContent = dict.step_1_label;
    if (iconBanner) iconBanner.textContent = data.icon;
    if (title) title.textContent = data.title;
    if (desc) desc.textContent = data.desc;
    if (demo) demo.innerHTML = data.demo_html;
    if (hackTitle) hackTitle.textContent = data.hack_title;
    if (hackContent) hackContent.innerHTML = data.hack_content;
  }

  goToQuestQuiz() {
    this.questPhase = 2;
    this.questIndex = 0;
    this.questScore = 0;

    document.getElementById('quest-phase-1')?.classList.add('hidden');
    document.getElementById('quest-phase-2')?.classList.remove('hidden');
    document.getElementById('quest-phase-3')?.classList.add('hidden');

    const dict = this.i18n[this.currentLang] || this.i18n.en;
    const stepInd = document.getElementById('qm-step-indicator');
    if (stepInd) stepInd.textContent = dict.step_2_label;

    this.playTone(523.25, 'triangle', 0.15); // C5 note
    this.renderQuestQuestion(0);
  }

  renderQuestQuestion(idx) {
    this.questIndex = idx;
    this.questSelectedOption = null;
    this.questHasSubmitted = false;

    const q = this.questQuestions[idx];
    if (!q) return;

    const dict = this.i18n[this.currentLang] || this.i18n.en;

    // Progress and Score
    const qNum = document.getElementById('qm-q-number');
    const curScore = document.getElementById('qm-current-score');
    const progFill = document.getElementById('qm-progress-fill');

    if (qNum) {
      qNum.textContent = dict.question_of.replace('{current}', idx + 1).replace('{total}', 10);
    }
    if (curScore) {
      curScore.textContent = `${dict.score_label} ${this.questScore} / 10`;
    }
    if (progFill) {
      progFill.style.width = `${((idx + 1) / 10) * 100}%`;
    }

    // Question Prompt
    const qText = document.getElementById('qm-question-text');
    if (qText) qText.textContent = q.prompt;

    // Visual
    const qVisual = document.getElementById('qm-question-visual');
    if (qVisual) {
      qVisual.innerHTML = q.visual_html || '';
    }

    // Hint & Hack
    const hintText = document.getElementById('qm-hint-text');
    const hackReminder = document.getElementById('qm-hack-reminder');
    if (hintText) hintText.textContent = q.hint;
    if (hackReminder) hackReminder.innerHTML = q.hack;

    // Hide drawers & feedback
    document.getElementById('qm-hint-box')?.classList.add('hidden');
    document.getElementById('qm-hack-box')?.classList.add('hidden');
    document.getElementById('qm-feedback-box')?.classList.add('hidden');

    // Options Grid
    const optContainer = document.getElementById('qm-options-container');
    if (optContainer) {
      optContainer.innerHTML = '';
      q.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'quest-opt-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          this.selectQuestOption(btn, opt);
        });
        optContainer.appendChild(btn);
      });
    }

    // Controls
    const btnSubmit = document.getElementById('btn-quest-submit');
    const btnNext = document.getElementById('btn-quest-next');

    if (btnSubmit) {
      btnSubmit.classList.remove('hidden');
      btnSubmit.disabled = true;
      btnSubmit.textContent = dict.submit_btn;
    }
    if (btnNext) {
      btnNext.classList.add('hidden');
      btnNext.textContent = (idx === 9) ? 'Complete Quest & View Rewards 🏆' : dict.next_btn;
    }
  }

  selectQuestOption(btn, val) {
    if (this.questHasSubmitted) return;
    this.questSelectedOption = val;

    document.querySelectorAll('.quest-opt-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const btnSubmit = document.getElementById('btn-quest-submit');
    if (btnSubmit) btnSubmit.disabled = false;

    this.playClick();
  }

  submitQuestAnswer() {
    if (this.questHasSubmitted || !this.questSelectedOption) return;
    this.questHasSubmitted = true;

    const q = this.questQuestions[this.questIndex];
    const isCorrect = (String(this.questSelectedOption).trim().toLowerCase() === String(q.answer).trim().toLowerCase());
    const dict = this.i18n[this.currentLang] || this.i18n.en;

    const feedbackBox = document.getElementById('qm-feedback-box');
    const feedbackTitle = document.getElementById('qm-feedback-title');
    const feedbackDetail = document.getElementById('qm-feedback-detail');
    const btnSubmit = document.getElementById('btn-quest-submit');
    const btnNext = document.getElementById('btn-quest-next');

    // Disable all options
    document.querySelectorAll('.quest-opt-btn').forEach(b => {
      b.disabled = true;
      if (String(b.textContent).trim().toLowerCase() === String(q.answer).trim().toLowerCase()) {
        b.classList.add('correct');
      } else if (b.classList.contains('selected')) {
        b.classList.add('wrong');
      }
    });

    feedbackBox?.classList.remove('hidden');

    if (isCorrect) {
      this.questScore++;
      feedbackBox.className = 'quest-feedback correct-feedback';
      if (feedbackTitle) feedbackTitle.textContent = dict.correct_title;
      if (feedbackDetail) feedbackDetail.innerHTML = `Awesome! ${q.explanation}`;
      
      this.addCoins(15);
      this.addXP(10);
      this.playChime();
      this.fireConfetti();
    } else {
      feedbackBox.className = 'quest-feedback wrong-feedback';
      if (feedbackTitle) feedbackTitle.textContent = dict.wrong_title;
      if (feedbackDetail) feedbackDetail.innerHTML = `The correct answer is <strong>${q.answer}</strong>. ${q.explanation}`;
      this.playError();
    }

    // Update Header stats & Quest score display
    const curScore = document.getElementById('qm-current-score');
    if (curScore) curScore.textContent = `${dict.score_label} ${this.questScore} / 10`;

    btnSubmit?.classList.add('hidden');
    btnNext?.classList.remove('hidden');
  }

  nextQuestQuestion() {
    if (this.questIndex < 9) {
      this.renderQuestQuestion(this.questIndex + 1);
    } else {
      this.completeQuest();
    }
  }

  completeQuest() {
    this.questPhase = 3;
    const dict = this.i18n[this.currentLang] || this.i18n.en;

    document.getElementById('quest-phase-1')?.classList.add('hidden');
    document.getElementById('quest-phase-2')?.classList.add('hidden');
    document.getElementById('quest-phase-3')?.classList.remove('hidden');

    const scoreDisplay = document.getElementById('qm-complete-score');
    const coinsEarned = document.getElementById('qm-coins-earned');
    const xpEarned = document.getElementById('qm-xp-earned');

    if (scoreDisplay) scoreDisplay.textContent = `${this.questScore} / 10`;

    // Calculate payouts
    const bonusCoins = this.questScore >= 8 ? 50 : 20;
    const totalQuestCoins = (this.questScore * 15) + bonusCoins;
    const totalQuestXp = 50 + (this.questScore * 10);

    if (coinsEarned) coinsEarned.textContent = `+${totalQuestCoins}`;
    if (xpEarned) xpEarned.textContent = `+${totalQuestXp}`;

    this.addCoins(bonusCoins);
    this.addXP(50);

    // Victory fanfare & Confetti
    this.playVictory();
    for (let i = 0; i < 4; i++) {
      setTimeout(() => this.fireConfetti(), i * 400);
    }

    if (this.questScore >= 8) {
      this.unlockBadge('first_step');
    }
  }

  playVictory() {
    if (!this.soundEnabled || !this.audioCtx) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      this.playTone(freq, 'triangle', 0.25, i * 0.1);
    });
  }

  /* ========================================================
     QUEST TOPIC CURRICULUM (All 18 Major Topics)
     Each topic includes:
     - Clear Visual Analogy Explanation
     - Interactive / Visual Demo
     - Secret Hack / Shortcut with Concrete Steps
     - 10 Progressive Questions with Hints, Hacks, and Answers
     ======================================================== */
  getQuestData(topicKey) {
    const topics = {
      addition: {
        name: 'Addition',
        icon: '➕',
        title: 'Addition & The "Make a 10" Strategy',
        desc: 'Instead of counting fingers one-by-one, always bridge to 10 first! Split the second number so the first number completes 10, then add the leftover in a flash.',
        demo_html: `
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <div style="font-weight:700; font-size:1.1rem; color:var(--text-primary);">8 + 5 = 8 + (2 + 3) = <span style="color:#10b981; font-weight:800;">10 + 3 = 13</span></div>
            <div style="display:grid; grid-template-columns:repeat(5, 24px); gap:6px; background:#e2e8f0; padding:8px; border-radius:8px;">
              <span style="width:24px;height:24px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
              <span style="width:24px;height:24px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
              <span style="width:24px;height:24px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
              <span style="width:24px;height:24px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
              <span style="width:24px;height:24px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
              <span style="width:24px;height:24px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
              <span style="width:24px;height:24px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
              <span style="width:24px;height:24px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
              <span style="width:24px;height:24px;border-radius:50%;background:#f59e0b;display:inline-block;"></span>
              <span style="width:24px;height:24px;border-radius:50%;background:#f59e0b;display:inline-block;"></span>
            </div>
            <small style="color:var(--text-secondary);">Ten-Frame 1 Complete (10) + 3 remaining in Frame 2 = 13</small>
          </div>
        `,
        hack_title: 'The Bridge-to-10 Trick',
        hack_content: `
          <strong>Example: 8 + 5</strong><br>
          1. 8 needs <strong>2</strong> to become 10.<br>
          2. Take 2 away from 5, leaving <strong>3</strong>.<br>
          3. Now you have <strong>10 + 3 = 13</strong>! Done in your head in 1 second!
        `,
        questions: [
          { prompt: 'What is 8 + 7?', options: ['13', '14', '15', '16'], answer: '15', hint: '8 needs 2 to make 10. Split 7 into 2 and 5.', hack: '8 + 7 = 10 + 5 = 15', explanation: '8 + 2 makes 10, plus the remaining 5 equals 15.' },
          { prompt: 'What is 9 + 6?', options: ['14', '15', '16', '17'], answer: '15', hint: '9 needs just 1 to reach 10. Take 1 from 6.', hack: '9 + 6 = 10 + 5 = 15', explanation: '9 takes 1 from 6 to become 10, leaving 5. 10 + 5 = 15.' },
          { prompt: 'What is 7 + 5?', options: ['11', '12', '13', '14'], answer: '12', hint: '7 needs 3 to reach 10. Split 5 into 3 and 2.', hack: '7 + 5 = 10 + 2 = 12', explanation: '7 + 3 = 10, and 10 + 2 = 12.' },
          { prompt: 'What is 8 + 4?', options: ['11', '12', '13', '14'], answer: '12', hint: '8 needs 2 to become 10. What is left of 4?', hack: '8 + 4 = 10 + 2 = 12', explanation: '8 + 2 = 10, plus remaining 2 = 12.' },
          { prompt: 'What is 9 + 8?', options: ['16', '17', '18', '19'], answer: '17', hint: 'Take 1 from 8 to give to 9.', hack: '9 + 8 = 10 + 7 = 17', explanation: '9 + 1 = 10, 10 + 7 = 17.' },
          { prompt: 'What is 6 + 7?', options: ['12', '13', '14', '15'], answer: '13', hint: '7 needs 3 to make 10. Take 3 from 6.', hack: '6 + 7 = 3 + (3 + 7) = 3 + 10 = 13', explanation: '7 + 3 = 10, and remaining 3 makes 13.' },
          { prompt: 'What is 18 + 7?', options: ['23', '24', '25', '26'], answer: '25', hint: '18 needs 2 to reach the friendly number 20!', hack: '18 + 7 = (18 + 2) + 5 = 20 + 5 = 25', explanation: 'Bridge to 20! 18 + 2 = 20, plus 5 = 25.' },
          { prompt: 'What is 29 + 6?', options: ['33', '34', '35', '36'], answer: '35', hint: '29 needs 1 to reach 30. Take 1 from 6.', hack: '29 + 6 = 30 + 5 = 35', explanation: '29 + 1 = 30, plus remaining 5 = 35.' },
          { prompt: 'What is 38 + 5?', options: ['42', '43', '44', '45'], answer: '43', hint: '38 needs 2 to reach 40.', hack: '38 + 5 = 40 + 3 = 43', explanation: '38 + 2 = 40, plus remaining 3 = 43.' },
          { prompt: 'What is 47 + 8?', options: ['54', '55', '56', '57'], answer: '55', hint: '47 needs 3 to reach 50. 8 - 3 = 5.', hack: '47 + 8 = 50 + 5 = 55', explanation: '47 + 3 = 50, plus remaining 5 = 55.' }
        ]
      },

      subtraction: {
        name: 'Subtraction',
        icon: '➖',
        title: 'Subtraction & The Cashier\'s Count-Up',
        desc: 'Subtraction is just finding the difference or distance between two numbers. Instead of tedious borrowing, count UP from the smaller number to the bigger number!',
        demo_html: `
          <div style="font-size:1.1rem; font-weight:700; text-align:center;">
            <span>62 - 38 = ?</span><br>
            <span style="color:#0ea5e9;">38 ➔ (+2) ➔ 40 ➔ (+22) ➔ 62</span><br>
            <span style="color:#10b981; font-weight:800;">Difference = 2 + 22 = 24!</span>
          </div>
        `,
        hack_title: 'The Cashier\'s Count-Up Hack',
        hack_content: `
          <strong>Example: 62 - 38</strong><br>
          1. Start at 38. Add <strong>2</strong> to reach 40.<br>
          2. From 40 to 62 is <strong>22</strong>.<br>
          3. Total distance = 2 + 22 = <strong>24</strong>! No borrowing needed!
        `,
        questions: [
          { prompt: 'What is 52 - 38?', options: ['12', '14', '16', '18'], answer: '14', hint: 'Count up: 38 + 2 = 40. From 40 to 52 is 12.', hack: '2 + 12 = 14', explanation: 'From 38 to 40 is 2, and 40 to 52 is 12. 2 + 12 = 14.' },
          { prompt: 'What is 71 - 48?', options: ['21', '22', '23', '24'], answer: '23', hint: '48 + 2 = 50. From 50 to 71 is 21.', hack: '2 + 21 = 23', explanation: '48 + 2 = 50, and 50 + 21 = 71. Total distance = 23.' },
          { prompt: 'What is 60 - 27?', options: ['31', '33', '35', '37'], answer: '33', hint: '27 + 3 = 30. From 30 to 60 is 30.', hack: '3 + 30 = 33', explanation: 'From 27 to 30 is 3, plus 30 to reach 60 = 33.' },
          { prompt: 'What is 43 - 19?', options: ['22', '24', '26', '28'], answer: '24', hint: '19 is so close to 20! Add 1 to reach 20, then 23 to 43.', hack: '1 + 23 = 24', explanation: '19 + 1 = 20, and 20 + 23 = 43. 1 + 23 = 24.' },
          { prompt: 'What is 85 - 57?', options: ['26', '28', '30', '32'], answer: '28', hint: '57 + 3 = 60. From 60 to 85 is 25.', hack: '3 + 25 = 28', explanation: '3 + 25 = 28.' },
          { prompt: 'What is 100 - 64?', options: ['34', '36', '38', '46'], answer: '36', hint: '64 + 6 = 70. 70 + 30 = 100.', hack: '6 + 30 = 36', explanation: '6 + 30 = 36.' },
          { prompt: 'What is 93 - 49?', options: ['42', '44', '46', '48'], answer: '44', hint: '49 + 1 = 50. From 50 to 93 is 43.', hack: '1 + 43 = 44', explanation: '1 + 43 = 44.' },
          { prompt: 'What is 64 - 28?', options: ['34', '36', '38', '40'], answer: '36', hint: '28 + 2 = 30. From 30 to 64 is 34.', hack: '2 + 34 = 36', explanation: '2 + 34 = 36.' },
          { prompt: 'What is 120 - 75?', options: ['35', '45', '55', '65'], answer: '45', hint: '75 + 25 = 100. From 100 to 120 is 20.', hack: '25 + 20 = 45', explanation: '25 + 20 = 45.' },
          { prompt: 'What is 81 - 39?', options: ['40', '41', '42', '43'], answer: '42', hint: '39 + 1 = 40. From 40 to 81 is 41.', hack: '1 + 41 = 42', explanation: '1 + 41 = 42.' }
        ]
      },

      multiplication: {
        name: 'Multiplication',
        icon: '✖️',
        title: 'Multiplication & The "11s & Area" Strategy',
        desc: 'Multiplication is finding area and grouping. Break numbers into tens and ones, or use lightning mental math tricks!',
        demo_html: `
          <div style="font-size:1.1rem; font-weight:700; text-align:center;">
            <span>35 × 11 = ?</span><br>
            <span style="color:#0ea5e9;">Split 3 and 5 ➔ Put (3 + 5 = 8) in the middle</span><br>
            <span style="color:#10b981; font-weight:800;">Answer = 385!</span>
          </div>
        `,
        hack_title: 'The 11s Split & Sum Trick',
        hack_content: `
          <strong>To multiply any 2-digit number by 11:</strong><br>
          1. Separate the two digits: <strong>3 _ 5</strong><br>
          2. Add the two digits: <strong>3 + 5 = 8</strong><br>
          3. Place the sum in the middle: <strong>385</strong>!
        `,
        questions: [
          { prompt: 'What is 43 × 11?', options: ['463', '473', '483', '493'], answer: '473', hint: 'Split 4 and 3. Add 4 + 3 = 7 in the middle.', hack: '4 _ 3 with (4+3) in middle = 473', explanation: '4 and 3 with sum 7 in middle gives 473.' },
          { prompt: 'What is 25 × 11?', options: ['265', '275', '285', '295'], answer: '275', hint: 'Split 2 and 5. Put 2 + 5 = 7 in the middle.', hack: '2 _ 5 ➔ 275', explanation: '2 + 5 = 7, so 275.' },
          { prompt: 'What is 62 × 11?', options: ['672', '682', '692', '702'], answer: '682', hint: 'Split 6 and 2. Middle is 6 + 2 = 8.', hack: '6 _ 2 ➔ 682', explanation: '6 + 2 = 8 in middle gives 682.' },
          { prompt: 'What is 54 × 11?', options: ['584', '594', '604', '614'], answer: '594', hint: '5 + 4 = 9 goes in the middle.', hack: '5 _ 4 ➔ 594', explanation: '5 + 4 = 9, so 594.' },
          { prompt: 'What is 15 × 4?', options: ['50', '60', '70', '80'], answer: '60', hint: 'Double twice! Double 15 is 30, double 30 is 60.', hack: '×4 means double, double!', explanation: '15 × 2 = 30, and 30 × 2 = 60.' },
          { prompt: 'What is 24 × 5?', options: ['110', '120', '130', '140'], answer: '120', hint: 'Halve 24 (12), then attach a 0!', hack: '×5 = Half the number, add a zero', explanation: 'Half of 24 is 12. Add a zero: 120.' },
          { prompt: 'What is 18 × 5?', options: ['80', '85', '90', '95'], answer: '90', hint: 'Half of 18 is 9. Attach a zero.', hack: '18 ÷ 2 = 9 ➔ 90', explanation: 'Half of 18 is 9, so 18 × 5 = 90.' },
          { prompt: 'What is 14 × 12?', options: ['158', '168', '178', '188'], answer: '168', hint: '14 × 10 = 140, plus 14 × 2 = 28. 140 + 28 = ?', hack: 'Area model: 140 + 28 = 168', explanation: '14 × 10 = 140, 14 × 2 = 28, total = 168.' },
          { prompt: 'What is 32 × 4?', options: ['124', '126', '128', '130'], answer: '128', hint: 'Double 32 (64), double 64 (128).', hack: 'Double 32 ➔ 64 ➔ 128', explanation: 'Multiplying by 4 is doubling twice: 32 → 64 → 128.' },
          { prompt: 'What is 71 × 11?', options: ['771', '781', '791', '801'], answer: '781', hint: '7 + 1 = 8 goes in the middle.', hack: '7 _ 1 ➔ 781', explanation: '7 + 1 = 8 in middle = 781.' }
        ]
      },

      division: {
        name: 'Division',
        icon: '➗',
        title: 'Division & The "Double & Drop Zero" Hack',
        desc: 'Division is fair-sharing into equal groups or finding how many times a divisor fits into the total.',
        demo_html: `
          <div style="font-size:1.1rem; font-weight:700; text-align:center;">
            <span>140 ÷ 5 = ?</span><br>
            <span style="color:#0ea5e9;">Step 1: Double 140 ➔ 280</span><br>
            <span style="color:#10b981; font-weight:800;">Step 2: Drop the zero ➔ 28!</span>
          </div>
        `,
        hack_title: 'Divide by 5 = Double & Drop Zero',
        hack_content: `
          <strong>To divide any number by 5:</strong><br>
          1. Double the number: <strong>140 × 2 = 280</strong><br>
          2. Drop the trailing zero (divide by 10): <strong>28</strong>!<br>
          Works because dividing by 5 is the same as multiplying by 2 and dividing by 10.
        `,
        questions: [
          { prompt: 'What is 160 ÷ 5?', options: ['28', '30', '32', '34'], answer: '32', hint: 'Double 160 = 320. Drop the zero.', hack: '160 × 2 = 320 ➔ 32', explanation: 'Double 160 is 320. Dropping the zero gives 32.' },
          { prompt: 'What is 240 ÷ 5?', options: ['46', '48', '50', '52'], answer: '48', hint: 'Double 240 = 480. Drop the zero.', hack: '240 × 2 = 480 ➔ 48', explanation: '240 × 2 = 480, drop 0 = 48.' },
          { prompt: 'What is 350 ÷ 5?', options: ['65', '70', '75', '80'], answer: '70', hint: 'Double 350 = 700. Drop the zero.', hack: '350 × 2 = 700 ➔ 70', explanation: '350 × 2 = 700, drop 0 = 70.' },
          { prompt: 'What is 84 ÷ 4?', options: ['19', '21', '23', '25'], answer: '21', hint: 'Halve twice! Half of 84 is 42, half of 42 is 21.', hack: '÷4 is half, half: 84 ➔ 42 ➔ 21', explanation: 'Halving 84 gives 42, halving again gives 21.' },
          { prompt: 'What is 120 ÷ 4?', options: ['25', '30', '35', '40'], answer: '30', hint: 'Half of 120 is 60, half of 60 is 30.', hack: '120 ➔ 60 ➔ 30', explanation: '120 ÷ 4 = 30.' },
          { prompt: 'What is 90 ÷ 5?', options: ['16', '17', '18', '19'], answer: '18', hint: 'Double 90 = 180. Drop the zero.', hack: '90 × 2 = 180 ➔ 18', explanation: '90 × 2 = 180, drop 0 = 18.' },
          { prompt: 'What is 150 ÷ 25?', options: ['4', '5', '6', '7'], answer: '6', hint: 'How many quarters (25¢) are in $1.50 (150¢)?', hack: '4 quarters = 100, 2 quarters = 50 ➔ 6', explanation: '4 in 100, plus 2 in 50 makes 6.' },
          { prompt: 'What is 72 ÷ 8?', options: ['7', '8', '9', '10'], answer: '9', hint: 'Think: 8 × ? = 72.', hack: '8 × 9 = 72', explanation: '72 ÷ 8 = 9.' },
          { prompt: 'What is 450 ÷ 5?', options: ['80', '85', '90', '95'], answer: '90', hint: 'Double 450 = 900. Drop the zero.', hack: '450 × 2 = 900 ➔ 90', explanation: '450 × 2 = 900, drop 0 = 90.' },
          { prompt: 'What is 144 ÷ 12?', options: ['10', '11', '12', '14'], answer: '12', hint: '12 × 12 = 144.', hack: 'Square root of 144 is 12', explanation: '144 ÷ 12 = 12.' }
        ]
      },

      squares: {
        name: 'Squares & Roots',
        icon: '⚡',
        title: 'Squares & The "Ends in 5" Magic Rule',
        desc: 'A square number is the area of a square ($n \\times n$). Square root ($\\sqrt{n}$) finds which side length makes that square.',
        demo_html: `
          <div style="font-size:1.1rem; font-weight:700; text-align:center;">
            <span>35² = ?</span><br>
            <span style="color:#0ea5e9;">Multiply first digit by next number: 3 × 4 = 12</span><br>
            <span style="color:#10b981; font-weight:800;">Attach 25 to the end: 1225!</span>
          </div>
        `,
        hack_title: 'Squaring Numbers Ending in 5',
        hack_content: `
          <strong>To square any number ending in 5:</strong><br>
          1. Take the tens digit <strong>n</strong> and multiply by <strong>(n + 1)</strong>.<br>
          2. Attach <strong>25</strong> to the end!<br>
          Example: <strong>35²</strong> ➔ 3 × 4 = 12, attach 25 = <strong>1225</strong>!
        `,
        questions: [
          { prompt: 'What is 25²?', options: ['525', '625', '725', '825'], answer: '625', hint: '2 × (2 + 1) = 2 × 3 = 6. Attach 25.', hack: '2 × 3 = 6 ➔ 625', explanation: '2 × 3 = 6, attach 25 = 625.' },
          { prompt: 'What is 35²?', options: ['1125', '1225', '1325', '1425'], answer: '1225', hint: '3 × 4 = 12. Attach 25.', hack: '3 × 4 = 12 ➔ 1225', explanation: '3 × 4 = 12, attach 25 = 1225.' },
          { prompt: 'What is 45²?', options: ['1825', '1925', '2025', '2125'], answer: '2025', hint: '4 × 5 = 20. Attach 25.', hack: '4 × 5 = 20 ➔ 2025', explanation: '4 × 5 = 20, attach 25 = 2025.' },
          { prompt: 'What is 65²?', options: ['4025', '4125', '4225', '4325'], answer: '4225', hint: '6 × 7 = 42. Attach 25.', hack: '6 × 7 = 42 ➔ 4225', explanation: '6 × 7 = 42, attach 25 = 4225.' },
          { prompt: 'What is √49?', options: ['6', '7', '8', '9'], answer: '7', hint: 'Which number multiplied by itself equals 49?', hack: '7 × 7 = 49', explanation: '7² = 49, so √49 = 7.' },
          { prompt: 'What is √144?', options: ['11', '12', '13', '14'], answer: '12', hint: '12 × 12 = 144.', hack: '√144 = 12', explanation: '12 × 12 = 144.' },
          { prompt: 'What is 15²?', options: ['215', '225', '235', '245'], answer: '225', hint: '1 × 2 = 2. Attach 25.', hack: '1 × 2 = 2 ➔ 225', explanation: '1 × 2 = 2, attach 25 = 225.' },
          { prompt: 'What is 75²?', options: ['5425', '5525', '5625', '5725'], answer: '5625', hint: '7 × 8 = 56. Attach 25.', hack: '7 × 8 = 56 ➔ 5625', explanation: '7 × 8 = 56, attach 25 = 5625.' },
          { prompt: 'What is √400?', options: ['10', '20', '30', '40'], answer: '20', hint: '√4 = 2, so √400 = 20.', hack: '20 × 20 = 400', explanation: '20 × 20 = 400.' },
          { prompt: 'What is √625?', options: ['15', '25', '35', '45'], answer: '25', hint: 'Ends in 25, and 2 × 3 = 6!', hack: '25² = 625', explanation: '√625 = 25.' }
        ]
      },

      fractions: {
        name: 'Fractions',
        icon: '🍰',
        title: 'Fractions & The Butterfly Cross-Multiply Method',
        desc: 'Fractions represent parts of a whole (numerator over denominator). Adding fractions with different denominators is effortless with the Butterfly trick!',
        demo_html: `
          <div style="font-size:1.1rem; font-weight:700; text-align:center;">
            <span>1/3 + 1/4 = ?</span><br>
            <span style="color:#0ea5e9;">Multiply diagonals: (1 × 4 = 4) and (1 × 3 = 3) ➔ Top = 4 + 3 = 7</span><br>
            <span style="color:#f59e0b;">Multiply bottoms: 3 × 4 = 12</span><br>
            <span style="color:#10b981; font-weight:800;">Answer = 7/12!</span>
          </div>
        `,
        hack_title: 'The Butterfly Method',
        hack_content: `
          <strong>To add any two fractions a/b + c/d:</strong><br>
          1. Cross-multiply diagonals: <strong>(a × d)</strong> and <strong>(b × c)</strong>.<br>
          2. Add the two products to get the new top: <strong>(ad + bc)</strong>.<br>
          3. Multiply denominators to get bottom: <strong>(b × d)</strong>.
        `,
        questions: [
          { prompt: 'What is 1/2 + 1/4?', options: ['2/6', '3/4', '3/6', '1/6'], answer: '3/4', hint: '1/2 is equivalent to 2/4. 2/4 + 1/4 = ?', hack: 'Butterfly: (1×4 + 2×1)/(2×4) = 6/8 = 3/4', explanation: '2/4 + 1/4 = 3/4.' },
          { prompt: 'What is 1/3 + 1/2?', options: ['2/5', '5/6', '3/5', '1/6'], answer: '5/6', hint: 'Cross-multiply: 1×2 = 2, 1×3 = 3. Top is 2 + 3 = 5. Bottom is 3×2 = 6.', hack: 'Top: 2+3=5, Bottom: 6 ➔ 5/6', explanation: '1/3 + 1/2 = 2/6 + 3/6 = 5/6.' },
          { prompt: 'What is 2/5 + 1/5?', options: ['3/10', '3/5', '2/25', '1/5'], answer: '3/5', hint: 'Same denominators! Just add the numerators 2 + 1.', hack: 'Same bottom ➔ add tops: 2 + 1 = 3', explanation: 'When denominators match, 2/5 + 1/5 = 3/5.' },
          { prompt: 'What is 3/4 - 1/2?', options: ['1/4', '2/2', '1/2', '2/4'], answer: '1/4', hint: '1/2 is equal to 2/4. 3/4 - 2/4 = ?', hack: '3/4 - 2/4 = 1/4', explanation: '3/4 - 2/4 = 1/4.' },
          { prompt: 'Which fraction is equivalent to 2/4?', options: ['1/3', '1/2', '3/4', '2/3'], answer: '1/2', hint: 'Divide both top and bottom by 2.', hack: '2 ÷ 2 = 1, 4 ÷ 2 = 2 ➔ 1/2', explanation: '2/4 simplifies to 1/2.' },
          { prompt: 'What is 1/4 + 1/3?', options: ['2/7', '7/12', '5/12', '1/12'], answer: '7/12', hint: 'Cross multiply: 1×3 = 3, 1×4 = 4. 3 + 4 = 7. Bottom: 4×3 = 12.', hack: 'Butterfly: 3 + 4 = 7 over 12', explanation: '3/12 + 4/12 = 7/12.' },
          { prompt: 'What is 4/8 in simplest form?', options: ['1/4', '1/2', '2/3', '3/4'], answer: '1/2', hint: '4 is exactly half of 8.', hack: '4/8 = 1/2', explanation: 'Divide numerator and denominator by 4 to get 1/2.' },
          { prompt: 'What is 1 - 2/5?', options: ['1/5', '2/5', '3/5', '4/5'], answer: '3/5', hint: 'Think of 1 whole as 5/5. 5/5 - 2/5 = ?', hack: '5/5 - 2/5 = 3/5', explanation: '5/5 - 2/5 = 3/5.' },
          { prompt: 'What is 2/3 × 3/4?', options: ['6/12 = 1/2', '5/7', '1/4', '2/7'], answer: '6/12 = 1/2', hint: 'Multiply straight across: 2×3 = 6, 3×4 = 12.', hack: 'Top × Top / Bottom × Bottom', explanation: '6/12 simplifies to 1/2.' },
          { prompt: 'Which is bigger: 1/2 or 3/8?', options: ['1/2', '3/8', 'They are equal', 'Cannot tell'], answer: '1/2', hint: '1/2 is 4/8. Is 4/8 bigger than 3/8?', hack: 'Cross multiply: 1×8=8 vs 2×3=6. 8 > 6 so 1/2 wins!', explanation: '1/2 = 4/8, which is greater than 3/8.' }
        ]
      },

      algebra: {
        name: 'Algebra',
        icon: '⚖️',
        title: 'Algebra & The Balance Scale',
        desc: 'An algebraic equation is a balanced scale. To isolate the mystery variable x, do the exact same reverse operation to both sides!',
        demo_html: `
          <div style="font-size:1.1rem; font-weight:700; text-align:center;">
            <span>2x + 6 = 16</span><br>
            <span style="color:#0ea5e9;">Step 1: Undo +6 (Subtract 6 from both sides) ➔ 2x = 10</span><br>
            <span style="color:#10b981; font-weight:800;">Step 2: Undo ×2 (Divide both sides by 2) ➔ x = 5!</span>
          </div>
        `,
        hack_title: 'Reverse Operations (The Undo Rule)',
        hack_content: `
          <strong>Always peel away numbers starting from the outside:</strong><br>
          1. Undo Addition with Subtraction (and vice versa).<br>
          2. Undo Multiplication with Division (and vice versa).<br>
          Keep both sides equal at every step!
        `,
        questions: [
          { prompt: 'If x + 7 = 15, what is x?', options: ['6', '7', '8', '9'], answer: '8', hint: 'Subtract 7 from 15.', hack: 'x = 15 - 7 = 8', explanation: '15 - 7 = 8, so x = 8.' },
          { prompt: 'If 2x = 18, what is x?', options: ['7', '8', '9', '10'], answer: '9', hint: 'Divide both sides by 2.', hack: 'x = 18 ÷ 2 = 9', explanation: '18 ÷ 2 = 9.' },
          { prompt: 'If 3x - 4 = 11, what is x?', options: ['4', '5', '6', '7'], answer: '5', hint: 'First add 4 to 11 (15). Then divide by 3.', hack: '3x = 15 ➔ x = 5', explanation: '3x = 15, so x = 5.' },
          { prompt: 'If x / 2 = 8, what is x?', options: ['4', '12', '14', '16'], answer: '16', hint: 'Undo division by multiplying 8 by 2.', hack: 'x = 8 × 2 = 16', explanation: '8 × 2 = 16.' },
          { prompt: 'If 4x + 8 = 24, what is x?', options: ['3', '4', '5', '6'], answer: '4', hint: 'Subtract 8 from 24 (16), then divide by 4.', hack: '4x = 16 ➔ x = 4', explanation: '24 - 8 = 16, 16 ÷ 4 = 4.' },
          { prompt: 'If 5x = 45, what is x?', options: ['7', '8', '9', '10'], answer: '9', hint: '45 ÷ 5 = ?', hack: 'x = 45 ÷ 5 = 9', explanation: '45 ÷ 5 = 9.' },
          { prompt: 'If 2x + 10 = 30, what is x?', options: ['8', '10', '12', '15'], answer: '10', hint: 'Subtract 10 (20), then divide by 2.', hack: '2x = 20 ➔ x = 10', explanation: '20 ÷ 2 = 10.' },
          { prompt: 'If x - 9 = 14, what is x?', options: ['21', '22', '23', '24'], answer: '23', hint: 'Add 9 to 14.', hack: 'x = 14 + 9 = 23', explanation: '14 + 9 = 23.' },
          { prompt: 'If 6x = 42, what is x?', options: ['6', '7', '8', '9'], answer: '7', hint: '42 ÷ 6 = ?', hack: 'x = 42 ÷ 6 = 7', explanation: '6 × 7 = 42.' },
          { prompt: 'If 3x + 9 = 21, what is x?', options: ['3', '4', '5', '6'], answer: '4', hint: '21 - 9 = 12. 12 ÷ 3 = ?', hack: '3x = 12 ➔ x = 4', explanation: '12 ÷ 3 = 4.' }
        ]
      },

      bodmas: {
        name: 'BODMAS',
        icon: '🧠',
        title: 'BODMAS & Order of Operations',
        desc: 'Solve expressions with strict priority: Brackets → Orders (powers/roots) → Division & Multiplication (left to right) → Addition & Subtraction (left to right).',
        demo_html: `
          <div style="font-size:1.1rem; font-weight:700; text-align:center;">
            <span>3 + 4 × 2 = ?</span><br>
            <span style="color:#ef4444;">Common Mistake: (3+4)×2 = 14 (WRONG!)</span><br>
            <span style="color:#0ea5e9;">BODMAS rule: Multiply first: 4 × 2 = 8</span><br>
            <span style="color:#10b981; font-weight:800;">Correct: 3 + 8 = 11!</span>
          </div>
        `,
        hack_title: 'B-O-D-M-A-S Priority Ladder',
        hack_content: `
          <strong>1. Brackets ()</strong> first always!<br>
          <strong>2. Orders (Squares, Roots)</strong> second.<br>
          <strong>3. Division & Multiplication</strong> tie: go Left to Right!<br>
          <strong>4. Addition & Subtraction</strong> last.
        `,
        questions: [
          { prompt: 'What is 3 + 4 × 2?', options: ['11', '14', '10', '16'], answer: '11', hint: 'Multiplication comes before addition! 4 × 2 = 8 first.', hack: '3 + (4 × 2) = 3 + 8 = 11', explanation: 'Multiply 4 × 2 = 8 first, then add 3 = 11.' },
          { prompt: 'What is (5 + 3) × 2?', options: ['11', '13', '16', '18'], answer: '16', hint: 'Brackets first! 5 + 3 = 8.', hack: 'Brackets first: 8 × 2 = 16', explanation: 'Inside brackets: 5 + 3 = 8. 8 × 2 = 16.' },
          { prompt: 'What is 10 - 6 ÷ 2?', options: ['2', '7', '8', '5'], answer: '7', hint: 'Division before subtraction! 6 ÷ 2 = 3.', hack: '10 - (6 ÷ 2) = 10 - 3 = 7', explanation: '6 ÷ 2 = 3 first. 10 - 3 = 7.' },
          { prompt: 'What is 2 × 3²?', options: ['18', '36', '12', '24'], answer: '18', hint: 'Orders (power) before multiply! 3² = 9.', hack: '2 × 9 = 18', explanation: '3² = 9 first, then 2 × 9 = 18.' },
          { prompt: 'What is 12 ÷ 3 × 2?', options: ['2', '8', '4', '6'], answer: '8', hint: 'Division and multiplication tie: go left to right! 12 ÷ 3 = 4, then 4 × 2 = 8.', hack: 'Left to right: 4 × 2 = 8', explanation: '12 ÷ 3 = 4 first, then 4 × 2 = 8.' },
          { prompt: 'What is 20 - 2 × (3 + 4)?', options: ['126', '6', '14', '18'], answer: '6', hint: 'Brackets (7), then multiply by 2 (14), then 20 - 14.', hack: '20 - 2 × 7 = 20 - 14 = 6', explanation: 'Brackets: 7. Multiply: 2 × 7 = 14. Subtract: 20 - 14 = 6.' },
          { prompt: 'What is 15 + 10 ÷ 5?', options: ['5', '17', '25', '19'], answer: '17', hint: '10 ÷ 5 = 2 first.', hack: '15 + 2 = 17', explanation: 'Division first: 10 ÷ 5 = 2. 15 + 2 = 17.' },
          { prompt: 'What is 4 + 4 × 4 - 4?', options: ['28', '16', '24', '32'], answer: '16', hint: '4 × 4 = 16 first. Then 4 + 16 - 4.', hack: '4 + 16 - 4 = 16', explanation: '4 × 4 = 16. Then 4 + 16 - 4 = 16.' },
          { prompt: 'What is (10 - 2) ÷ (1 + 3)?', options: ['2', '3', '4', '5'], answer: '2', hint: 'Solve both brackets: 8 and 4. 8 ÷ 4 = ?', hack: '8 ÷ 4 = 2', explanation: '8 ÷ 4 = 2.' },
          { prompt: 'What is 5 × 2 + 10 ÷ 2?', options: ['10', '15', '20', '25'], answer: '15', hint: 'Do both multiply and divide first: (5×2) + (10÷2) = 10 + 5.', hack: '10 + 5 = 15', explanation: '5×2 = 10, 10÷2 = 5. 10 + 5 = 15.' }
        ]
      }
    };

    // Return specific topic or fallback to addition
    return topics[topicKey] || topics.addition;
  }

}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new MathCraftApp();
});
