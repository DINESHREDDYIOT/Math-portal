/* ========================================================
   Math Galaxy 🚀 Kid-Friendly Interactive Engine
   Numbers 1-10, Adding Toys, Cookie Crunch, Shapes,
   Games, Streak Milestone Bonuses, 10-Question Coin Challenge
   & ALL World Languages (Bengali, Hindi, Spanish, French, Arabic, etc.)
   ======================================================== */

class MathGalaxyApp {
  constructor() {
    // Player Stats
    this.coins = parseInt(localStorage.getItem('mg_coins')) || 50;
    this.stars = parseInt(localStorage.getItem('mg_stars')) || 5;
    this.streak = parseInt(localStorage.getItem('mg_streak')) || 7;
    this.claimedMilestones = JSON.parse(localStorage.getItem('mg_milestones') || '[7]');
    this.unlockedStickers = JSON.parse(localStorage.getItem('mg_stickers') || '["puppy"]');
    
    // Settings
    this.currentLang = localStorage.getItem('mg_lang') || 'en';
    this.soundEnabled = localStorage.getItem('mg_sound') !== 'false';
    this.voiceEnabled = localStorage.getItem('mg_voice') !== 'false';
    this.theme = localStorage.getItem('mg_theme') || 'theme-galaxy';

    // State: Count Tab
    this.currentNum = 1;
    this.currentToy = '⚽';

    // State: Adding Tab
    this.addP1 = 2;
    this.addP2 = 2;
    this.addToyA = '⚽';
    this.addToyB = '🏏';

    // State: Subtraction Tab
    this.cookieTotal = 4;
    this.cookieEaten = 0;

    // State: Games
    this.balloonScore = 0;
    this.balloonTarget = 3;
    this.duckCount = 3;
    this.duckToy = '🦆';
    this.basketACount = 2;
    this.basketBCount = 5;

    // State: 10-Question Lesson Challenge
    this.lessonActive = false;
    this.lessonIndex = 0;
    this.lessonScore = 0;
    this.lessonCoinsEarned = 0;
    this.lessonAnswered = false;

    // Init Audio Context
    this.initAudio();

    // Start App
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.initConfetti();
    this.initTranslations();
    this.initNavigation();
    this.initCountTab();
    this.initAddTab();
    this.initSubTab();
    this.initShapesTab();
    this.initGamesTab();
    this.initStreakSystem();
    this.initStickerBook();
    this.initMascot();
    this.initSettings();
    this.initLessonChallenge();
    this.initWorldLanguages();
    this.updateStatsDisplay();

    // Welcome cheer
    setTimeout(() => {
      this.cheerMascot(this.t('welcome_mascot'), false);
    }, 600);
  }

  /* ========================================================
     AUDIO FX (Web Audio API Synthesizer)
     ======================================================== */
  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (e) {
      console.warn('Web Audio not available', e);
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, delay = 0) {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch (e) {}
  }

  playChime() {
    this.playTone(523.25, 'sine', 0.1, 0);
    this.playTone(659.25, 'sine', 0.1, 0.08);
    this.playTone(783.99, 'sine', 0.18, 0.16);
  }

  playPop() {
    this.playTone(400, 'sine', 0.06);
    this.playTone(800, 'sine', 0.08, 0.03);
  }

  playCrunch() {
    this.playTone(200, 'triangle', 0.08);
    this.playTone(320, 'sawtooth', 0.06, 0.04);
  }

  playFanfare() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((f, i) => this.playTone(f, 'triangle', 0.2, i * 0.1));
  }

  playOops() {
    this.playTone(280, 'sawtooth', 0.12, 0);
    this.playTone(200, 'sawtooth', 0.18, 0.08);
  }

  speak(text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = 1.3;
      u.rate = 0.9;

      const langMap = {
        bn: 'bn-BD', hi: 'hi-IN', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
        zh: 'zh-CN', ja: 'ja-JP', ar: 'ar-SA', ru: 'ru-RU', it: 'it-IT',
        pt: 'pt-BR', te: 'te-IN', ta: 'ta-IN', ur: 'ur-PK'
      };
      u.lang = langMap[this.currentLang] || 'en-US';
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ========================================================
     TRANSLATIONS & CORE DICTIONARIES
     ======================================================== */
  initTranslations() {
    this.i18n = {
      en: {
        app_title: 'Math Galaxy',
        app_tagline: 'Play, Count & Smile! ✨',
        coins: 'Coins',
        stars: 'Stars',
        stickers: 'Stickers',
        streak_label: 'Day Streak!',
        welcome_mascot: 'Welcome to Math Galaxy! Tap me for cheers! 🚀',
        lesson_cta_title: '10-Question Coin Challenge!',
        lesson_cta_desc: 'Right = +1 Coin 🪙 • Wrong = -1 Coin 🪙!',
        lesson_cta_btn: "Let's Start a Lesson!",
        nav_count: 'Count 1 to 10',
        nav_count_sub: 'Meet Numbers!',
        nav_add: 'Put Together',
        nav_add_sub: '2 Balls + 2 Bats = 4!',
        nav_sub: 'Eat Cookies',
        nav_sub_sub: 'Take Away!',
        nav_shapes: 'Shapes',
        nav_shapes_sub: 'Circle, Square & Star!',
        nav_games: 'Play Games',
        nav_games_sub: 'Pop Balloons & Win!',
        count_heading: 'Touch a number to count!',
        count_subheading: 'A number tells us HOW MANY toys we have! 🎈',
        pick_toy: 'Pick toys:',
        tap_toys_cue: '👉 Tap each toy to hear it count!',
        prev_btn: 'Back',
        next_btn: 'Next',
        count_all_btn: 'Count All!',
        add_heading: 'Plus (+) means Putting Together!',
        add_subheading: 'We put toys together in one big box! 📦',
        in_all_box: 'In all! 🧺',
        count_together_btn: 'Count Together!',
        try_these: 'Try these fun toys:',
        sub_heading: 'Minus (-) means Taking Away!',
        sub_subheading: 'Tap a cookie to eat it! Nom nom! 😋',
        cookie_plate_title: '🍪 The Cookie Plate',
        eat_cookie_cue: '👇 Tap a cookie to eat it!',
        bake_more_btn: 'Bake More Cookies!',
        read_story_btn: 'Say Story',
        cookie_story_title: '📖 Cookie Story',
        zero_rule: 'Zero Rule: If you eat ALL cookies, you have 0 (ZERO) left!',
        start_with: 'Start with:',
        shapes_heading: 'Shapes are Everywhere!',
        shapes_subheading: 'A ball is round, a gift box is square, and pizza is triangle! 🍕',
        shape_circle: 'Circle',
        circle_desc: 'Round with NO corners! Like a ball ⚽ or coin 🪙!',
        roll_me: 'Roll Ball!',
        shape_square: 'Square',
        square_desc: 'Has 4 straight sides! Like a gift box 🎁!',
        open_gift: 'Open Gift!',
        shape_triangle: 'Triangle',
        triangle_desc: 'Has 3 pointy corners! Like pizza 🍕!',
        yummy_pizza: 'Yummy Pizza!',
        shape_star: 'Star',
        star_desc: 'Has 5 shiny points! Twinkles in Galaxy ✨!',
        twinkle: 'Twinkle Star!',
        riddle_title: 'Shape Riddle!',
        games_heading: 'Play Fun Games & Win Stars!',
        games_subheading: 'Pop balloons, count toys, and win shiny coins! 🪙',
        game_balloon_tab: '1. Balloon Pop!',
        game_duck_tab: '2. Count Animals!',
        game_moreless_tab: '3. Which has MORE?',
        nums: ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN']
      },
      bn: {
        app_title: 'ম্যাথ গ্যালাক্সি 🚀',
        app_tagline: 'খেলো, গণনা করো ও হাসো! ✨',
        coins: 'কয়েন',
        stars: 'তারা',
        stickers: 'স্টিকার',
        streak_label: 'দিনের স্ট্রিক!',
        welcome_mascot: 'ম্যাথ গ্যালাক্সিতে স্বাগতম! আমার গায়ে ট্যাপ করো! 🚀',
        lesson_cta_title: '১০টি প্রশ্নের কয়েন চ্যালেঞ্জ!',
        lesson_cta_desc: 'সঠিক হলে = +১ কয়েন 🪙 • ভুল হলে = -১ কয়েন 🪙!',
        lesson_cta_btn: 'এসো পাঠ শুরু করি!',
        nav_count: '১ থেকে ১০ গণনা',
        nav_count_sub: 'সংখ্যা চেনা!',
        nav_add: 'একত্রে রাখা (+)',
        nav_add_sub: '২ টি বল + ২ টি ব্যাট = ৪!',
        nav_sub: 'বিস্কুট খাওয়া (-)',
        nav_sub_sub: 'বিয়োগ শেখা!',
        nav_shapes: 'আকার ও আকৃতি',
        nav_shapes_sub: 'গোল, চারকোনা ও তারা!',
        nav_games: 'মজার খেলা',
        nav_games_sub: 'বেলুন ফাটাও ও জেতো!',
        count_heading: 'গণনা করতে সংখ্যা ছোঁও!',
        count_subheading: 'সংখ্যা আমাদের জানায় আমাদের কাছে কতটি খেলনা আছে! 🎈',
        pick_toy: 'খেলনা বেছে নাও:',
        tap_toys_cue: '👉 প্রতিটি খেলনা ছুঁয়ে গুনো!',
        prev_btn: 'আগে',
        next_btn: 'পরে',
        count_all_btn: 'একসাথে গুনো!',
        add_heading: 'যোগ (+) মানে একসাথে রাখা!',
        add_subheading: 'আমরা খেলনাগুলোকে একটি বড় বাক্সে রাখি! 📦',
        in_all_box: 'সব মিলিয়ে! 🧺',
        count_together_btn: 'একত্রে গণনা করো!',
        try_these: 'এই খেলনাগুলো চেষ্টা করো:',
        sub_heading: 'বিয়োগ (-) মানে সরিয়ে নেওয়া!',
        sub_subheading: 'বিস্কুট খাওয়ার জন্য ছুঁয়ে দাও! মচমচে! 😋',
        cookie_plate_title: '🍪 বিস্কুটের প্লেট',
        eat_cookie_cue: '👇 বিস্কুটে ট্যাপ করে খেয়ে ফেলো!',
        bake_more_btn: 'আরও বিস্কুট বানাও!',
        read_story_btn: 'গল্প শোনো',
        cookie_story_title: '📖 বিস্কুটের গল্প',
        zero_rule: 'শূন্যের নিয়ম: সব বিস্কুট খেলে থাকে ০ (শূন্য)!',
        start_with: 'শুরু করো:',
        shapes_heading: 'চারপাশে কতরকম আকার!',
        shapes_subheading: 'বল গোল, উপহার চারকোনা, আর পিজ্জা ত্রিকোণ! 🍕',
        shape_circle: 'বৃত্ত (গোল)',
        circle_desc: 'কোনো কোণা নেই! ফুটবলের মতো গোল ⚽!',
        roll_me: 'বল গড়িয়ে দাও!',
        shape_square: 'বর্গক্ষেত্র (চারকোনা)',
        square_desc: '৪টি সমান বাহু আছে! উপহারের বাক্সের মতো 🎁!',
        open_gift: 'উপহার খোলো!',
        shape_triangle: 'ত্রিভুজ (তিনকোনা)',
        triangle_desc: '৩টি চোখা কোণা আছে! পিজ্জা স্লাইসের মতো 🍕!',
        yummy_pizza: 'সুস্বাদু পিজ্জা!',
        shape_star: 'তারা (স্টার)',
        star_desc: '৫টি উজ্জ্বল বিন্দু! আকাশে জ্বলজ্বল করে ✨!',
        twinkle: 'ঝলমলে তারা!',
        riddle_title: 'ধাঁধার খেলা!',
        games_heading: 'খেলাধুলা ও তারা জেতো!',
        games_subheading: 'বেলুন ফাটাও, প্রাণী গুনো ও কয়েন জেতো! 🪙',
        game_balloon_tab: '১. বেলুন ফাটানো!',
        game_duck_tab: '২. প্রাণী গণনা!',
        game_moreless_tab: '৩. কোথায় বেশি আছে?',
        nums: ['শূন্য', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ']
      },
      hi: {
        app_title: 'मैथ गैलेक्सी 🚀',
        app_tagline: 'खेलो, गिनो और मुस्कुराओ! ✨',
        coins: 'सिक्के',
        stars: 'तारे',
        stickers: 'स्टिकर',
        streak_label: 'दिन की स्ट्रीक!',
        welcome_mascot: 'मैथ गैलेक्सी में स्वागत है! मुझसे मिलो! 🚀',
        lesson_cta_title: '१० प्रश्नों की सिक्का चुनौती!',
        lesson_cta_desc: 'सही = +१ सिक्का 🪙 • गलत = -१ सिक्का 🪙!',
        lesson_cta_btn: 'चलो पाठ शुरू करें!',
        nav_count: '१ से १० गिनती',
        nav_count_sub: 'संख्या पहचान!',
        nav_add: 'साथ मिलाना (+)',
        nav_add_sub: '२ गेंद + २ बैट = ४!',
        nav_sub: 'बिस्कुट खाना (-)',
        nav_sub_sub: 'घटाना सीखो!',
        nav_shapes: 'मजेदार आकार',
        nav_shapes_sub: 'गोल, चौकोर और तारा!',
        nav_games: 'मजेदार खेल',
        nav_games_sub: 'गुब्बारे फोड़ो और जीतो!',
        count_heading: 'गिनती के लिए संख्या छुओ!',
        count_subheading: 'संख्या बताती है कि कितने खिलौने हैं! 🎈',
        pick_toy: 'खिलौना चुनो:',
        tap_toys_cue: '👉 गिनने के लिए खिलौनों को छुओ!',
        prev_btn: 'पीछे',
        next_btn: 'आगे',
        count_all_btn: 'सब गिनो!',
        add_heading: 'जोड़ (+) का मतलब मिलाना!',
        add_subheading: 'खिलौनों को एक डिब्बे में इकट्ठा करते हैं! 📦',
        in_all_box: 'कुल मिलाकर! 🧺',
        count_together_btn: 'एक साथ गिनो!',
        try_these: 'ये खिलौने आजमाएं:',
        sub_heading: 'घटाव (-) मतलब कम करना!',
        sub_subheading: 'बिस्कुट खाने के लिए छुओ! कुरकुरा! 😋',
        cookie_plate_title: '🍪 बिस्कुट की प्लेट',
        eat_cookie_cue: '👇 बिस्कुट पर टैप करके खाओ!',
        bake_more_btn: 'और बिस्कुट बनाओ!',
        read_story_btn: 'कहानी सुनो',
        cookie_story_title: '📖 बिस्कुट की कहानी',
        zero_rule: 'शून्य का नियम: सारे खा लिए तो ० (शून्य) बचा!',
        start_with: 'शुरू करें:',
        shapes_heading: 'चारों तरफ मजेदार आकार!',
        shapes_subheading: 'गेंद गोल है, डिब्बा चौकोर है और पिज्जा तिकोना है! 🍕',
        shape_circle: 'वृत्त (गोल)',
        circle_desc: 'कोई कोना नहीं! फुटबॉल जैसा गोल ⚽!',
        roll_me: 'गेंद घुमाओ!',
        shape_square: 'वर्ग (चौकोर)',
        square_desc: '४ सीधी भुजाएं! उपहार के डिब्बे जैसा 🎁!',
        open_gift: 'उपहार खोलो!',
        shape_triangle: 'त्रिभुज (तिकोना)',
        triangle_desc: '३ नुकीले कोने! पिज्जा स्लाइस जैसा 🍕!',
        yummy_pizza: 'स्वादिष्ट पिज्जा!',
        shape_star: 'तारा (स्टार)',
        star_desc: '५ चमकीले बिंदु! आसमान में चमकता है ✨!',
        twinkle: 'चमकीला तारा!',
        riddle_title: 'आकार पहेली!',
        games_heading: 'खेल खेलो और सितारे जीतो!',
        games_subheading: 'गुब्बारे फोड़ो, जानवर गिनो और सिक्के जीतो! 🪙',
        game_balloon_tab: '१. गुब्बारा फोड़ो!',
        game_duck_tab: '२. जानवर गिनो!',
        game_moreless_tab: '३. किसमें ज्यादा है?',
        nums: ['शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस']
      },
      es: {
        app_title: 'Math Galaxy 🚀',
        app_tagline: '¡Juega, cuenta y sonríe! ✨',
        coins: 'Monedas',
        stars: 'Estrellas',
        stickers: 'Pegatinas',
        streak_label: '¡Racha de días!',
        welcome_mascot: '¡Bienvenido a Math Galaxy! ¡Tócame para animarte! 🚀',
        lesson_cta_title: '¡Desafío de 10 Preguntas!',
        lesson_cta_desc: '¡Correcto = +1 Moneda 🪙 • Incorrecto = -1 Moneda 🪙!',
        lesson_cta_btn: '¡Comencemos una lección!',
        nav_count: 'Contar 1 al 10',
        nav_count_sub: '¡Conoce números!',
        nav_add: 'Juntar (+)',
        nav_add_sub: '¡2 Balones + 2 Bates = 4!',
        nav_sub: 'Comer galletas (-)',
        nav_sub_sub: '¡Quitar galletas!',
        nav_shapes: 'Formas divertidas',
        nav_shapes_sub: '¡Círculo, cuadrado y estrella!',
        nav_games: 'Juegos divertidos',
        nav_games_sub: '¡Explota globos y gana!',
        count_heading: '¡Toca un número para contar!',
        count_subheading: '¡Un número nos dice CUÁNTOS juguetes hay! 🎈',
        pick_toy: 'Elige juguete:',
        tap_toys_cue: '👉 ¡Toca cada juguete para contarlo!',
        prev_btn: 'Atrás',
        next_btn: 'Siguiente',
        count_all_btn: '¡Contar todos!',
        add_heading: '¡Sumar (+) significa juntar!',
        add_subheading: '¡Juntamos juguetes en una sola canasta! 📦',
        in_all_box: '¡En total! 🧺',
        count_together_btn: '¡Contar juntos!',
        try_these: 'Prueba estos juguetes:',
        sub_heading: '¡Restar (-) significa quitar!',
        sub_subheading: '¡Toca una galleta para comerla! ¡Ñam ñam! 😋',
        cookie_plate_title: '🍪 El plato de galletas',
        eat_cookie_cue: '👇 ¡Toca una galleta para comerla!',
        bake_more_btn: '¡Hornear más galletas!',
        read_story_btn: 'Leer historia',
        cookie_story_title: '📖 Historia de galletas',
        zero_rule: 'Regla del Cero: ¡Si comes todas, te quedan 0 (CERO)!',
        start_with: 'Comenzar con:',
        shapes_heading: '¡Las formas están en todas partes!',
        shapes_subheading: '¡Una pelota es redonda, una caja es cuadrada y la pizza es triángulo! 🍕',
        shape_circle: 'Círculo',
        circle_desc: '¡Redondo sin esquinas! ¡Como una pelota ⚽!',
        roll_me: '¡Rodar pelota!',
        shape_square: 'Cuadrado',
        square_desc: '¡4 lados iguales! ¡Como una caja de regalo 🎁!',
        open_gift: '¡Abrir regalo!',
        shape_triangle: 'Triángulo',
        triangle_desc: '¡3 esquinas puntiagudas! ¡Como una pizza 🍕!',
        yummy_pizza: '¡Rica pizza!',
        shape_star: 'Estrella',
        star_desc: '¡5 puntas brillantes! ¡Brilla en la Galaxia ✨!',
        twinkle: '¡Estrella brillante!',
        riddle_title: '¡Adivinanza de formas!',
        games_heading: '¡Juegos y gana estrellas!',
        games_subheading: '¡Explota globos, cuenta patitos y gana monedas! 🪙',
        game_balloon_tab: '1. ¡Explota globos!',
        game_duck_tab: '2. ¡Cuenta patitos!',
        game_moreless_tab: '3. ¿Cuál tiene MÁS?',
        nums: ['CERO', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ']
      }
    };
  }

  t(key) {
    const dict = this.i18n[this.currentLang] || this.i18n.en;
    return dict[key] || this.i18n.en[key] || key;
  }

  setLanguage(lang, displayName) {
    this.currentLang = lang;
    localStorage.setItem('mg_lang', lang);

    const label = document.getElementById('current-lang-label');
    if (label) label.textContent = displayName || lang.toUpperCase();

    // Update text content with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (k) el.textContent = this.t(k);
    });

    const titleEl = document.getElementById('app-title-text');
    if (titleEl) titleEl.textContent = this.t('app_title');
    const tagEl = document.getElementById('app-tagline-text');
    if (tagEl) tagEl.textContent = this.t('app_tagline');

    this.renderCountStage();
    this.renderAddSentence();
    this.renderCookieSentence();
    this.updateStreakModal();
  }

  /* ========================================================
     NAVIGATION
     ======================================================== */
  initNavigation() {
    const navBtns = document.querySelectorAll('.kid-nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.playPop();
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tabId = btn.getAttribute('data-tab');
        document.querySelectorAll('.kid-tab-content').forEach(pane => {
          pane.classList.remove('active');
        });
        const target = document.getElementById(tabId);
        if (target) {
          target.classList.add('active');
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  /* ========================================================
     TAB 1: COUNT 1 TO 10
     ======================================================== */
  initCountTab() {
    const numBtns = document.querySelectorAll('.num-btn');
    numBtns.forEach(b => {
      b.addEventListener('click', () => {
        this.playPop();
        numBtns.forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        this.currentNum = parseInt(b.getAttribute('data-num')) || 1;
        this.renderCountStage();
      });
    });

    const toyBtns = document.querySelectorAll('.toy-opt-btn');
    toyBtns.forEach(b => {
      b.addEventListener('click', () => {
        this.playPop();
        toyBtns.forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        this.currentToy = b.getAttribute('data-toy') || '⚽';
        this.renderCountStage();
      });
    });

    document.getElementById('btn-count-prev')?.addEventListener('click', () => {
      if (this.currentNum > 1) {
        this.currentNum--;
        this.syncNumBtn();
        this.renderCountStage();
      }
    });

    document.getElementById('btn-count-next')?.addEventListener('click', () => {
      if (this.currentNum < 10) {
        this.currentNum++;
        this.syncNumBtn();
        this.renderCountStage();
      }
    });

    document.getElementById('btn-count-all')?.addEventListener('click', () => {
      this.animateCountAll();
    });

    document.getElementById('btn-speak-count')?.addEventListener('click', () => {
      const dict = this.i18n[this.currentLang] || this.i18n.en;
      const word = dict.nums ? dict.nums[this.currentNum] : this.currentNum;
      this.speak(`${this.currentNum}! ${word}!`);
    });

    document.getElementById('btn-speak-count-intro')?.addEventListener('click', () => {
      this.speak(`${this.t('count_heading')} ${this.t('count_subheading')}`);
    });

    this.renderCountStage();
  }

  syncNumBtn() {
    document.querySelectorAll('.num-btn').forEach(btn => {
      const n = parseInt(btn.getAttribute('data-num'));
      btn.classList.toggle('active', n === this.currentNum);
    });
  }

  renderCountStage() {
    const bigNum = document.getElementById('count-big-num');
    const bigWord = document.getElementById('count-big-word');
    const itemsBox = document.getElementById('count-items-box');
    if (!bigNum || !bigWord || !itemsBox) return;

    bigNum.textContent = this.currentNum;
    const dict = this.i18n[this.currentLang] || this.i18n.en;
    bigWord.textContent = (dict.nums && dict.nums[this.currentNum]) || this.currentNum;

    itemsBox.innerHTML = '';
    for (let i = 1; i <= this.currentNum; i++) {
      const item = document.createElement('div');
      item.className = 'toy-item-card';
      item.innerHTML = `<span>${this.currentToy}</span><span class="toy-index-tag">${i}</span>`;
      item.addEventListener('click', () => {
        this.playPop();
        item.classList.add('counted');
        this.speak(`${i}`);
        this.addStars(1);
      });
      itemsBox.appendChild(item);
    }
  }

  animateCountAll() {
    const items = document.querySelectorAll('.toy-item-card');
    items.forEach((item, idx) => {
      setTimeout(() => {
        this.playTone(300 + idx * 60, 'sine', 0.12);
        item.classList.add('counted');
        this.speak(`${idx + 1}`);
        if (idx === items.length - 1) {
          setTimeout(() => {
            this.playFanfare();
            this.fireConfetti();
            this.addCoins(5);
            this.cheerMascot(`🎉 Wonderful! You counted ${this.currentNum} toys!`, true);
          }, 300);
        }
      }, idx * 350);
    });
  }

  /* ========================================================
     TAB 2: PUT TOGETHER (ADDING +)
     Primary Example: 2 balls + 2 bats = 4 in all!
     ======================================================== */
  initAddTab() {
    document.getElementById('add-p1-minus')?.addEventListener('click', () => {
      if (this.addP1 > 1) {
        this.addP1--;
        this.renderAddPlayground();
      }
    });

    document.getElementById('add-p1-plus')?.addEventListener('click', () => {
      if (this.addP1 < 5) {
        this.addP1++;
        this.renderAddPlayground();
      }
    });

    document.getElementById('add-p2-minus')?.addEventListener('click', () => {
      if (this.addP2 > 1) {
        this.addP2--;
        this.renderAddPlayground();
      }
    });

    document.getElementById('add-p2-plus')?.addEventListener('click', () => {
      if (this.addP2 < 5) {
        this.addP2++;
        this.renderAddPlayground();
      }
    });

    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.playPop();
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.addP1 = parseInt(btn.getAttribute('data-a')) || 2;
        this.addP2 = parseInt(btn.getAttribute('data-b')) || 2;
        this.addToyA = btn.getAttribute('data-toy-a') || '⚽';
        this.addToyB = btn.getAttribute('data-toy-b') || '🏏';
        this.renderAddPlayground();
      });
    });

    document.getElementById('btn-count-add-together')?.addEventListener('click', () => {
      this.animateAddTogether();
    });

    document.getElementById('btn-speak-add-intro')?.addEventListener('click', () => {
      this.speak(`${this.t('add_heading')} ${this.t('add_subheading')}`);
    });

    this.renderAddPlayground();
  }

  renderAddPlayground() {
    const p1Count = document.getElementById('add-p1-count');
    const p2Count = document.getElementById('add-p2-count');
    const p1Toys = document.getElementById('add-p1-toys');
    const p2Toys = document.getElementById('add-p2-toys');
    const totalBadge = document.getElementById('add-total-badge');
    const totalToys = document.getElementById('add-total-toys');
    const p1Title = document.getElementById('p1-title-text');
    const p2Title = document.getElementById('p2-title-text');

    if (!p1Count || !p2Count || !totalBadge) return;

    p1Count.textContent = this.addP1;
    p2Count.textContent = this.addP2;
    const total = this.addP1 + this.addP2;
    totalBadge.textContent = total;

    if (p1Title) p1Title.textContent = `${this.addP1} ${this.addToyA}`;
    if (p2Title) p2Title.textContent = `${this.addP2} ${this.addToyB}`;

    if (p1Toys) {
      p1Toys.innerHTML = '';
      for (let i = 0; i < this.addP1; i++) {
        const s = document.createElement('span');
        s.textContent = this.addToyA;
        p1Toys.appendChild(s);
      }
    }

    if (p2Toys) {
      p2Toys.innerHTML = '';
      for (let i = 0; i < this.addP2; i++) {
        const s = document.createElement('span');
        s.textContent = this.addToyB;
        p2Toys.appendChild(s);
      }
    }

    if (totalToys) {
      totalToys.innerHTML = '';
      for (let i = 0; i < this.addP1; i++) {
        const s = document.createElement('span');
        s.textContent = this.addToyA;
        totalToys.appendChild(s);
      }
      for (let i = 0; i < this.addP2; i++) {
        const s = document.createElement('span');
        s.textContent = this.addToyB;
        totalToys.appendChild(s);
      }
    }

    this.renderAddSentence();
  }

  renderAddSentence() {
    const total = this.addP1 + this.addP2;
    const sentEl = document.getElementById('add-sentence');
    if (!sentEl) return;

    if (this.currentLang === 'bn') {
      sentEl.innerHTML = `<span class="pill-blue">${this.addP1} টি ${this.addToyA}</span> + <span class="pill-green">${this.addP2} টি ${this.addToyB}</span> = <span class="pill-gold">মোট ${total} টি খেলনা! 🎉</span>`;
    } else if (this.currentLang === 'hi') {
      sentEl.innerHTML = `<span class="pill-blue">${this.addP1} ${this.addToyA}</span> + <span class="pill-green">${this.addP2} ${this.addToyB}</span> = <span class="pill-gold">कुल ${total} खिलौने! 🎉</span>`;
    } else if (this.currentLang === 'es') {
      sentEl.innerHTML = `<span class="pill-blue">${this.addP1} ${this.addToyA}</span> + <span class="pill-green">${this.addP2} ${this.addToyB}</span> = <span class="pill-gold">¡${total} en total! 🎉</span>`;
    } else {
      sentEl.innerHTML = `<span class="pill-blue">${this.addP1} ${this.addToyA}</span> + <span class="pill-green">${this.addP2} ${this.addToyB}</span> = <span class="pill-gold">${total} in all! 🎉</span>`;
    }
  }

  animateAddTogether() {
    const total = this.addP1 + this.addP2;
    const totalToys = document.querySelectorAll('#add-total-toys span');
    totalToys.forEach((toy, idx) => {
      setTimeout(() => {
        this.playPop();
        toy.style.transform = 'scale(1.4)';
        setTimeout(() => toy.style.transform = 'scale(1)', 200);
        this.speak(`${idx + 1}`);

        if (idx === totalToys.length - 1) {
          setTimeout(() => {
            this.playFanfare();
            this.fireConfetti();
            this.addCoins(5);
            this.cheerMascot(`🎈 Woohoo! ${this.addP1} + ${this.addP2} = ${total}!`, true);
          }, 300);
        }
      }, idx * 300);
    });
  }

  /* ========================================================
     TAB 3: EAT COOKIES (TAKING AWAY -)
     ======================================================== */
  initSubTab() {
    const plateBtns = document.querySelectorAll('.plate-size-btn');
    plateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.playPop();
        plateBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.cookieTotal = parseInt(btn.getAttribute('data-count')) || 4;
        this.cookieEaten = 0;
        this.renderCookiePlate();
      });
    });

    document.getElementById('btn-bake-more')?.addEventListener('click', () => {
      this.playChime();
      this.cookieEaten = 0;
      this.renderCookiePlate();
      this.cheerMascot('🍪 Fresh warm cookies baked!', false);
    });

    document.getElementById('btn-speak-sub')?.addEventListener('click', () => {
      const left = this.cookieTotal - this.cookieEaten;
      this.speak(`${this.cookieTotal} minus ${this.cookieEaten} equals ${left} cookies left!`);
    });

    document.getElementById('btn-speak-sub-intro')?.addEventListener('click', () => {
      this.speak(`${this.t('sub_heading')} ${this.t('sub_subheading')}`);
    });

    this.renderCookiePlate();
  }

  renderCookiePlate() {
    const plate = document.getElementById('cookie-plate');
    if (!plate) return;

    plate.innerHTML = '';
    for (let i = 0; i < this.cookieTotal; i++) {
      const cookie = document.createElement('div');
      cookie.className = 'cookie-item';
      cookie.textContent = '🍪';
      cookie.addEventListener('click', () => {
        if (!cookie.classList.contains('eaten')) {
          cookie.classList.add('eaten');
          this.playCrunch();
          this.cookieEaten++;
          this.renderCookieSentence();
          this.addStars(1);
          if (this.cookieTotal - this.cookieEaten === 0) {
            this.cheerMascot('😋 All gone! Exactly 0 cookies left!', true);
            this.fireConfetti();
          }
        }
      });
      plate.appendChild(cookie);
    }

    this.renderCookieSentence();
  }

  renderCookieSentence() {
    const left = this.cookieTotal - this.cookieEaten;
    const eqEl = document.getElementById('cookie-equation-text');
    const storyEl = document.getElementById('cookie-story-text');

    if (eqEl) {
      eqEl.innerHTML = `${this.cookieTotal} &minus; ${this.cookieEaten} = <strong style="color:#f472b6;">${left}</strong>`;
    }

    if (storyEl) {
      if (this.currentLang === 'bn') {
        storyEl.innerHTML = `প্লেটে ছিল <strong>${this.cookieTotal} টি বিস্কুট</strong>। আপনি <strong>${this.cookieEaten} টি</strong> খেয়েছেন। বাকি আছে <strong>${left} টি</strong>!`;
      } else if (this.currentLang === 'hi') {
        storyEl.innerHTML = `प्लेट में <strong>${this.cookieTotal} बिस्कुट</strong> थे। आपने <strong>${this.cookieEaten}</strong> खा लिए। अब <strong>${left}</strong> बचे हैं!`;
      } else if (this.currentLang === 'es') {
        storyEl.innerHTML = `Teníamos <strong>${this.cookieTotal} galletas</strong>. Comiste <strong>${this.cookieEaten}</strong>. ¡Quedan <strong>${left} galletas</strong>!`;
      } else {
        storyEl.innerHTML = `We had <strong>${this.cookieTotal} cookies</strong>. You ate <strong>${this.cookieEaten}</strong>. Leaves <strong>${left} cookies left</strong>!`;
      }
    }
  }

  /* ========================================================
     TAB 4: FUN SHAPES
     ======================================================== */
  initShapesTab() {
    const shapeBtns = document.querySelectorAll('.shape-interact-btn');
    shapeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const shape = btn.getAttribute('data-shape');
        this.playPop();
        if (shape === 'circle') {
          const el = document.getElementById('draw-circle');
          el.style.transform = 'rotate(720deg) scale(1.1)';
          this.speak(this.t('shape_circle'));
          setTimeout(() => el.style.transform = 'none', 600);
        } else if (shape === 'square') {
          const el = document.getElementById('draw-square');
          el.style.transform = 'scale(1.3) rotate(15deg)';
          this.speak(this.t('shape_square'));
          setTimeout(() => el.style.transform = 'none', 500);
        } else if (shape === 'triangle') {
          const el = document.getElementById('draw-triangle');
          el.style.transform = 'translateY(-18px) rotate(-15deg)';
          this.speak(this.t('shape_triangle'));
          setTimeout(() => el.style.transform = 'none', 500);
        } else if (shape === 'star') {
          const el = document.getElementById('draw-star');
          el.style.transform = 'scale(1.4) rotate(360deg)';
          this.speak(this.t('shape_star'));
          this.fireConfetti();
          setTimeout(() => el.style.transform = 'none', 600);
        }
      });
    });

    const optBtns = document.querySelectorAll('.shape-opt-btn');
    optBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const ans = btn.getAttribute('data-ans');
        const feedback = document.getElementById('shape-feedback');
        if (!feedback) return;
        feedback.classList.remove('hidden', 'correct', 'wrong');

        if (ans === 'circle') {
          feedback.classList.add('correct');
          feedback.textContent = '🎉 Yes! Circle is round like a ball with NO corners! ⚽';
          this.playFanfare();
          this.fireConfetti();
          this.addCoins(10);
          this.cheerMascot('🌟 Brilliant! Circle has 0 corners!', true);
        } else {
          feedback.classList.add('wrong');
          feedback.textContent = 'Try again! Think of a ball that rolls! ⚽';
          this.playTone(200, 'sawtooth', 0.15);
        }
      });
    });

    document.getElementById('btn-speak-riddle')?.addEventListener('click', () => {
      this.speak(document.getElementById('shape-riddle-text')?.textContent || 'Which shape is round?');
    });

    document.getElementById('btn-speak-shapes-intro')?.addEventListener('click', () => {
      this.speak(`${this.t('shapes_heading')} ${this.t('shapes_subheading')}`);
    });
  }

  /* ========================================================
     TAB 5: PLAY GAMES
     ======================================================== */
  initGamesTab() {
    const miniBtns = document.querySelectorAll('.mini-tab-btn');
    miniBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.playPop();
        miniBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const game = btn.getAttribute('data-game');
        document.querySelectorAll('.mini-game-pane').forEach(p => p.classList.remove('active'));
        document.getElementById(`game-${game}`)?.classList.add('active');
      });
    });

    // Game 1: Balloon Pop
    this.renderBalloons();
    document.getElementById('btn-new-balloons')?.addEventListener('click', () => {
      this.renderBalloons();
    });

    document.getElementById('btn-speak-balloon')?.addEventListener('click', () => {
      this.speak(`Can you find and pop balloon number ${this.balloonTarget}?`);
    });

    // Game 2: Count Animals
    this.renderDuckGame();

    // Game 3: More vs Less
    this.renderMoreLessGame();
  }

  // Balloon Pop Logic
  renderBalloons() {
    const sky = document.getElementById('balloons-sky-area');
    const msg = document.getElementById('balloon-target-msg');
    if (!sky) return;

    this.balloonTarget = Math.floor(Math.random() * 5) + 1;
    if (msg) msg.textContent = `Can you find and pop balloon number ${this.balloonTarget}? 🎈`;

    sky.innerHTML = '';
    const colors = ['balloon-red', 'balloon-blue', 'balloon-yellow', 'balloon-green', 'balloon-purple'];
    const nums = [this.balloonTarget];

    while (nums.length < 4) {
      const rand = Math.floor(Math.random() * 6) + 1;
      if (!nums.includes(rand)) nums.push(rand);
    }
    nums.sort(() => Math.random() - 0.5);

    nums.forEach((num, idx) => {
      const b = document.createElement('div');
      b.className = `balloon-item ${colors[idx % colors.length]}`;
      b.textContent = num;
      b.addEventListener('click', () => {
        if (num === this.balloonTarget) {
          b.classList.add('popping');
          this.playPop();
          this.balloonScore++;
          const scEl = document.getElementById('balloon-score');
          if (scEl) scEl.textContent = this.balloonScore;
          this.addCoins(10);
          this.addStars(1);
          this.fireConfetti();
          this.cheerMascot(`🎉 POP! You found balloon ${this.balloonTarget}!`, true);
          setTimeout(() => this.renderBalloons(), 600);
        } else {
          this.playTone(200, 'sawtooth', 0.12);
          b.style.transform = 'scale(0.85)';
          setTimeout(() => b.style.transform = 'scale(1)', 200);
          this.cheerMascot(`That is ${num}! Find balloon ${this.balloonTarget}! 🎈`, false);
        }
      });
      sky.appendChild(b);
    });
  }

  // Count Animals Game
  renderDuckGame() {
    const pond = document.getElementById('duck-pond');
    const optionsRow = document.getElementById('duck-options');
    const feedback = document.getElementById('duck-feedback');
    if (!pond || !optionsRow) return;

    this.duckCount = Math.floor(Math.random() * 4) + 2;
    const animals = ['🦆', '🐶', '🐱', '🐸', '🐰'];
    this.duckToy = animals[Math.floor(Math.random() * animals.length)];

    pond.innerHTML = '';
    for (let i = 0; i < this.duckCount; i++) {
      const a = document.createElement('span');
      a.className = 'pond-item';
      a.textContent = this.duckToy;
      pond.appendChild(a);
    }

    optionsRow.innerHTML = '';
    feedback?.classList.add('hidden');

    const opts = [this.duckCount];
    while (opts.length < 3) {
      const r = Math.floor(Math.random() * 5) + 1;
      if (!opts.includes(r)) opts.push(r);
    }
    opts.sort(() => Math.random() - 0.5);

    opts.forEach(val => {
      const btn = document.createElement('button');
      btn.className = 'duck-opt-btn';
      btn.textContent = val;
      btn.addEventListener('click', () => {
        if (val === this.duckCount) {
          this.playFanfare();
          this.fireConfetti();
          this.addCoins(10);
          this.addStars(1);
          feedback.classList.remove('hidden');
          feedback.textContent = `🎉 Super! Exactly ${this.duckCount} ${this.duckToy}!`;
          this.cheerMascot(`🌟 You counted all ${this.duckCount}!`, true);
          setTimeout(() => this.renderDuckGame(), 1200);
        } else {
          this.playTone(200, 'sawtooth', 0.15);
          feedback.classList.remove('hidden');
          feedback.textContent = `Try counting again! Almost there!`;
        }
      });
      optionsRow.appendChild(btn);
    });

    document.getElementById('btn-speak-duck')?.addEventListener('click', () => {
      this.speak(`How many cute animals do you see? Count them!`);
    });
  }

  // More or Less Game
  renderMoreLessGame() {
    const boxA = document.getElementById('basket-a-items');
    const boxB = document.getElementById('basket-b-items');
    const basketA = document.getElementById('basket-a');
    const basketB = document.getElementById('basket-b');
    const feedback = document.getElementById('moreless-feedback');
    if (!boxA || !boxB) return;

    feedback?.classList.add('hidden');
    this.basketACount = Math.floor(Math.random() * 4) + 1;
    this.basketBCount = Math.floor(Math.random() * 4) + 1;
    while (this.basketACount === this.basketBCount) {
      this.basketBCount = Math.floor(Math.random() * 4) + 1;
    }

    boxA.innerHTML = '';
    for (let i = 0; i < this.basketACount; i++) {
      const s = document.createElement('span');
      s.textContent = '🍓';
      boxA.appendChild(s);
    }

    boxB.innerHTML = '';
    for (let i = 0; i < this.basketBCount; i++) {
      const s = document.createElement('span');
      s.textContent = '🍓';
      boxB.appendChild(s);
    }

    const checkAnswer = (chosenCount, otherCount, name) => {
      if (chosenCount > otherCount) {
        this.playFanfare();
        this.fireConfetti();
        this.addCoins(10);
        this.addStars(1);
        feedback.classList.remove('hidden');
        feedback.textContent = `🎉 Correct! Basket ${name} has ${chosenCount}, which is MORE than ${otherCount}!`;
        this.cheerMascot(`🍓 Yum! ${chosenCount} is more than ${otherCount}!`, true);
        setTimeout(() => this.renderMoreLessGame(), 1200);
      } else {
        this.playTone(200, 'sawtooth', 0.15);
        feedback.classList.remove('hidden');
        feedback.textContent = `Oops! That basket has fewer berries. Try the bigger one!`;
      }
    };

    basketA.onclick = () => checkAnswer(this.basketACount, this.basketBCount, 'A');
    basketB.onclick = () => checkAnswer(this.basketBCount, this.basketACount, 'B');

    document.getElementById('btn-speak-moreless')?.addEventListener('click', () => {
      this.speak(`Which basket has MORE yummy berries? Tap the bigger one!`);
    });
  }

  /* ========================================================
     10-QUESTION COIN CHALLENGE (LESSON)
     Correct: +1 Coin 🪙 | Wrong: -1 Coin 🪙!
     ======================================================== */
  initLessonChallenge() {
    this.lessonQuestions = [
      { prompt: 'How many balls do you see? Count them!', visual: '⚽ ⚽ ⚽', options: ['2', '3', '4'], answer: '3' },
      { prompt: '2 balls ⚽ + 2 bats 🏏 = how many in all?', visual: '⚽ ⚽ + 🏏 🏏', options: ['3', '4', '5'], answer: '4' },
      { prompt: '3 cookies - 1 cookie eaten = how many left?', visual: '🍪 🍪 (1 eaten)', options: ['1', '2', '3'], answer: '2' },
      { prompt: 'Which shape is round like a ball? ⚽', visual: '🟢 ⚽ 🥞', options: ['Circle 🟢', 'Square 🟦', 'Triangle 🔺'], answer: 'Circle 🟢' },
      { prompt: 'Which number is BIGGER?', visual: '🐘 5   vs   🐭 2', options: ['2', '5', '1'], answer: '5' },
      { prompt: 'How many cute ducks in the pond?', visual: '🦆 🦆', options: ['1', '2', '4'], answer: '2' },
      { prompt: '1 apple 🍎 + 2 apples 🍎 = how many in all?', visual: '🍎 + 🍎 🍎', options: ['2', '3', '4'], answer: '3' },
      { prompt: 'Which shape has 3 pointy corners like pizza 🍕?', visual: '🍕 🔺 🥳', options: ['Triangle 🔺', 'Circle 🟢', 'Square 🟦'], answer: 'Triangle 🔺' },
      { prompt: '4 cookies - 2 cookies eaten = how many left?', visual: '🍪 🍪 🍪 🍪 (2 eaten)', options: ['1', '2', '3'], answer: '2' },
      { prompt: 'Count the shiny stars in the sky!', visual: '⭐ ⭐ ⭐ ⭐', options: ['3', '4', '5'], answer: '4' }
    ];

    const btnStart = document.getElementById('btn-start-lesson-cta');
    const modalLesson = document.getElementById('lesson-modal');
    const btnClose = document.getElementById('btn-close-lesson');
    const btnNext = document.getElementById('btn-lesson-next');
    const btnRestart = document.getElementById('btn-lesson-restart');
    const btnFinish = document.getElementById('btn-lesson-finish');

    btnStart?.addEventListener('click', () => {
      this.playPop();
      this.startLesson();
    });

    btnClose?.addEventListener('click', () => {
      modalLesson?.classList.add('hidden');
      this.lessonActive = false;
    });

    btnNext?.addEventListener('click', () => {
      this.nextLessonQuestion();
    });

    btnRestart?.addEventListener('click', () => {
      this.startLesson();
    });

    btnFinish?.addEventListener('click', () => {
      modalLesson?.classList.add('hidden');
      this.lessonActive = false;
    });

    document.getElementById('btn-speak-lesson-q')?.addEventListener('click', () => {
      const q = this.lessonQuestions[this.lessonIndex];
      if (q) this.speak(q.prompt);
    });
  }

  startLesson() {
    this.lessonActive = true;
    this.lessonIndex = 0;
    this.lessonScore = 0;
    this.lessonCoinsEarned = 0;
    this.lessonDotResults = [];

    const modal = document.getElementById('lesson-modal');
    const stage = document.getElementById('lesson-question-stage');
    const complete = document.getElementById('lesson-complete-stage');

    modal?.classList.remove('hidden');
    stage?.classList.remove('hidden');
    complete?.classList.add('hidden');

    this.renderLessonDots();
    this.renderLessonQuestion();
  }

  renderLessonDots() {
    const dotsBar = document.getElementById('lesson-dots-bar');
    if (!dotsBar) return;
    dotsBar.innerHTML = '';

    for (let i = 0; i < 10; i++) {
      const dot = document.createElement('div');
      dot.className = 'lesson-dot';
      dot.textContent = i + 1;
      if (i === this.lessonIndex) dot.classList.add('active');
      if (this.lessonDotResults && this.lessonDotResults[i] === true) {
        dot.classList.add('dot-correct');
        dot.textContent = '✓';
      } else if (this.lessonDotResults && this.lessonDotResults[i] === false) {
        dot.classList.add('dot-wrong');
        dot.textContent = '✕';
      }
      dotsBar.appendChild(dot);
    }
  }

  renderLessonQuestion() {
    this.lessonAnswered = false;
    const qIndexEl = document.getElementById('lesson-q-index');
    const trackerEl = document.getElementById('lesson-session-coins');
    const promptEl = document.getElementById('lesson-prompt-text');
    const visualEl = document.getElementById('lesson-visual-display');
    const optsGrid = document.getElementById('lesson-options-grid');
    const fbBox = document.getElementById('lesson-feedback-box');
    const nextRow = document.getElementById('lesson-next-row');

    if (qIndexEl) qIndexEl.textContent = this.lessonIndex + 1;
    if (trackerEl) trackerEl.textContent = (this.lessonCoinsEarned >= 0 ? `+${this.lessonCoinsEarned}` : `${this.lessonCoinsEarned}`);

    fbBox?.classList.add('hidden');
    nextRow?.classList.add('hidden');

    const q = this.lessonQuestions[this.lessonIndex];
    if (!q) return;

    if (promptEl) promptEl.textContent = q.prompt;
    if (visualEl) visualEl.textContent = q.visual;

    if (optsGrid) {
      optsGrid.innerHTML = '';
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'lesson-opt-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => this.handleLessonAnswer(opt, btn, q));
        optsGrid.appendChild(btn);
      });
    }

    this.renderLessonDots();
  }

  handleLessonAnswer(selected, btn, q) {
    if (this.lessonAnswered) return;
    this.lessonAnswered = true;

    const isCorrect = (String(selected).trim() === String(q.answer).trim());
    const fbBox = document.getElementById('lesson-feedback-box');
    const fbEmoji = document.getElementById('lesson-feedback-emoji');
    const fbText = document.getElementById('lesson-feedback-text');
    const nextRow = document.getElementById('lesson-next-row');

    document.querySelectorAll('.lesson-opt-btn').forEach(b => {
      b.disabled = true;
      if (String(b.textContent).trim() === String(q.answer).trim()) {
        b.classList.add('correct');
      }
    });

    if (isCorrect) {
      btn.classList.add('correct');
      this.playChime();
      this.fireConfetti();
      this.lessonScore++;
      this.lessonCoinsEarned++;
      this.addCoins(1); // Gain +1 coin!
      this.lessonDotResults[this.lessonIndex] = true;

      fbBox.className = 'lesson-feedback-box correct-fb';
      if (fbEmoji) fbEmoji.textContent = '🎉';
      if (fbText) fbText.textContent = 'Super Job! Correct! +1 Coin 🪙';
      this.cheerMascot('🎉 Correct! You won +1 Coin! 🪙', true);
      this.speak('Correct! You won one coin!');
    } else {
      btn.classList.add('wrong');
      this.playOops();
      this.lessonCoinsEarned--;
      this.loseCoin(1); // Lose -1 coin!
      this.lessonDotResults[this.lessonIndex] = false;

      fbBox.className = 'lesson-feedback-box wrong-fb';
      if (fbEmoji) fbEmoji.textContent = '😅';
      if (fbText) fbText.textContent = `Oops! The answer is ${q.answer}. -1 Coin 🪙`;
      this.cheerMascot(`Oops! Don't worry, keep trying!`, false);
      this.speak('Oops! Lost one coin! Try the next one!');
    }

    fbBox?.classList.remove('hidden');
    nextRow?.classList.remove('hidden');

    const trackerEl = document.getElementById('lesson-session-coins');
    if (trackerEl) trackerEl.textContent = (this.lessonCoinsEarned >= 0 ? `+${this.lessonCoinsEarned}` : `${this.lessonCoinsEarned}`);

    this.renderLessonDots();
  }

  nextLessonQuestion() {
    if (this.lessonIndex < 9) {
      this.lessonIndex++;
      this.renderLessonQuestion();
    } else {
      this.finishLesson();
    }
  }

  finishLesson() {
    const stage = document.getElementById('lesson-question-stage');
    const complete = document.getElementById('lesson-complete-stage');
    const summaryText = document.getElementById('lesson-summary-text');
    const netCoinsText = document.getElementById('lesson-net-coins');

    stage?.classList.add('hidden');
    complete?.classList.remove('hidden');

    if (summaryText) summaryText.textContent = `You answered ${this.lessonScore} out of 10 correct!`;
    if (netCoinsText) {
      if (this.lessonCoinsEarned >= 0) {
        netCoinsText.textContent = `+${this.lessonCoinsEarned} 🪙 Coins Earned! 🎉`;
      } else {
        netCoinsText.textContent = `${this.lessonCoinsEarned} 🪙 Coins this round!`;
      }
    }

    this.playFanfare();
    this.fireConfetti();
    this.cheerMascot(`🏆 Lesson complete! You scored ${this.lessonScore}/10! 🚀`, true);
  }

  /* ========================================================
     WORLD LANGUAGES SYSTEM (Search & All Languages)
     ======================================================== */
  initWorldLanguages() {
    this.worldLanguagesList = [
      { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
      { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
      { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
      { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
      { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
      { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
      { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
      { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
      { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
      { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
      { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
      { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
      { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
      { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
      { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
      { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
      { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
      { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
      { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
      { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
      { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
      { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
      { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
      { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
      { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
      { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
      { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: '🇺🇦' },
      { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷' },
      { code: 'he', name: 'Hebrew', native: 'עברית', flag: '🇮🇱' },
      { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
      { code: 'tl', name: 'Filipino', native: 'Tagalog', flag: '🇵🇭' },
      { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾' },
      { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷' },
      { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴' },
      { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺' },
      { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿' },
      { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
      { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
      { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴' }
    ];

    const container = document.getElementById('world-languages-container');
    const searchInput = document.getElementById('lang-search-input');
    const btnLang = document.getElementById('btn-language');
    const modalLang = document.getElementById('language-modal');
    const btnCloseLang = document.getElementById('btn-close-lang');

    btnLang?.addEventListener('click', () => {
      this.playPop();
      modalLang?.classList.remove('hidden');
      if (searchInput) searchInput.value = '';
      this.renderWorldLanguages(this.worldLanguagesList);
    });

    btnCloseLang?.addEventListener('click', () => {
      modalLang?.classList.add('hidden');
    });

    searchInput?.addEventListener('input', (e) => {
      const q = (e.target.value || '').toLowerCase().trim();
      const filtered = this.worldLanguagesList.filter(l => 
        l.name.toLowerCase().includes(q) || 
        l.native.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
      );
      this.renderWorldLanguages(filtered);
    });

    this.renderWorldLanguages(this.worldLanguagesList);
  }

  renderWorldLanguages(list) {
    const container = document.getElementById('world-languages-container');
    const modalLang = document.getElementById('language-modal');
    if (!container) return;

    container.innerHTML = '';
    list.forEach(l => {
      const btn = document.createElement('button');
      btn.className = `lang-choice-btn ${this.currentLang === l.code ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="lang-flag">${l.flag}</span>
        <div class="lang-info">
          <strong>${l.native}</strong>
          <span>${l.name}</span>
        </div>
      `;
      btn.addEventListener('click', () => {
        this.playPop();
        this.setLanguage(l.code, `${l.flag} ${l.native}`);
        modalLang?.classList.add('hidden');
        this.speak(`Language set to ${l.name}`);

        // Trigger Google Translate if available for non-core languages
        try {
          const select = document.querySelector('.goog-te-combo');
          if (select) {
            select.value = l.code;
            select.dispatchEvent(new Event('change'));
          }
        } catch (e) {}
      });
      container.appendChild(btn);
    });
  }

  /* ========================================================
     DAILY STREAK SYSTEM (7-day = 7 coins, 14-day = 14 coins...)
     ======================================================== */
  initStreakSystem() {
    const btnStreak = document.getElementById('btn-streak-modal');
    const modalStreak = document.getElementById('streak-modal');
    const btnCloseStreak = document.getElementById('btn-close-streak');
    const btnClaim = document.getElementById('btn-claim-streak');

    btnStreak?.addEventListener('click', () => {
      this.playPop();
      modalStreak?.classList.remove('hidden');
      this.updateStreakModal();
    });

    btnCloseStreak?.addEventListener('click', () => {
      modalStreak?.classList.add('hidden');
    });

    btnClaim?.addEventListener('click', () => {
      this.claimStreakDay();
    });

    this.updateStreakDisplay();
  }

  claimStreakDay() {
    this.streak++;
    localStorage.setItem('mg_streak', this.streak);
    this.playChime();
    this.fireConfetti();

    if (this.streak % 7 === 0) {
      const rewardCoins = this.streak;
      this.addCoins(rewardCoins);
      this.playFanfare();
      this.cheerMascot(`🔥 WOW! ${this.streak}-Day Streak Milestone! +${rewardCoins} 🪙 Coins!`, true);
    } else {
      this.addCoins(2);
      this.cheerMascot(`🔥 Day ${this.streak} checked in! Keep going!`, false);
    }

    this.updateStreakDisplay();
    this.updateStreakModal();
  }

  updateStreakDisplay() {
    const streakEl = document.getElementById('user-streak');
    if (streakEl) streakEl.textContent = this.streak;
  }

  updateStreakModal() {
    const daysNum = document.getElementById('streak-days-num');
    const msg = document.getElementById('streak-milestone-msg');
    if (daysNum) daysNum.textContent = this.streak;

    if (msg) {
      if (this.streak >= 7 && this.streak < 14) {
        msg.textContent = `🎉 7-Day Milestone! You got +7 🪙 Coins! Next reward at 14 days (+14 🪙)!`;
      } else if (this.streak >= 14 && this.streak < 21) {
        msg.textContent = `🌟 14-Day Milestone! You got +14 🪙 Coins! Next reward at 21 days (+21 🪙)!`;
      } else if (this.streak >= 21) {
        msg.textContent = `🏆 Incredible Streak! You earn +${this.streak} coins every 7 days!`;
      } else {
        const left = 7 - this.streak;
        msg.textContent = `Only ${left} more days until you get 7 FREE Coins! 🪙`;
      }
    }

    const step7 = document.getElementById('m-step-7');
    const step14 = document.getElementById('m-step-14');
    const step21 = document.getElementById('m-step-21');
    const step28 = document.getElementById('m-step-28');

    if (step7) step7.className = `milestone-step ${this.streak >= 7 ? 'reached' : ''}`;
    if (step14) step14.className = `milestone-step ${this.streak >= 14 ? 'reached' : ''}`;
    if (step21) step21.className = `milestone-step ${this.streak >= 21 ? 'reached' : ''}`;
    if (step28) step28.className = `milestone-step ${this.streak >= 28 ? 'reached' : ''}`;
  }

  /* ========================================================
     STICKER BOOK MODAL
     ======================================================== */
  initStickerBook() {
    const btnStickers = document.getElementById('btn-stickers');
    const modalStickers = document.getElementById('sticker-modal');
    const btnCloseStickers = document.getElementById('btn-close-stickers');

    btnStickers?.addEventListener('click', () => {
      this.playPop();
      modalStickers?.classList.remove('hidden');
      this.renderStickerBook();
    });

    btnCloseStickers?.addEventListener('click', () => {
      modalStickers?.classList.add('hidden');
    });
  }

  renderStickerBook() {
    const container = document.getElementById('stickers-container');
    const coinsDisplay = document.getElementById('modal-coins-display');
    if (!container) return;

    if (coinsDisplay) coinsDisplay.textContent = this.coins;

    const allStickers = [
      { id: 'puppy', icon: '🐶', name: 'Cute Puppy' },
      { id: 'rocket', icon: '🚀', name: 'Space Rocket' },
      { id: 'icecream', icon: '🍦', name: 'Sweet Ice Cream' },
      { id: 'unicorn', icon: '🦄', name: 'Magic Unicorn' },
      { id: 'car', icon: '🚗', name: 'Speedy Car' },
      { id: 'crown', icon: '👑', name: 'Galaxy Crown' }
    ];

    container.innerHTML = '';
    allStickers.forEach(st => {
      const isUnlocked = this.unlockedStickers.includes(st.id);
      const slot = document.createElement('div');
      slot.className = `sticker-slot ${isUnlocked ? 'unlocked' : 'locked'}`;
      slot.innerHTML = `
        <div class="sticker-icon">${st.icon}</div>
        <div class="sticker-name">${st.name}</div>
        <div style="font-size:0.75rem; color:#facc15; font-weight:800; margin-top:2px;">
          ${isUnlocked ? '✅ Unlocked!' : '🪙 15 Coins'}
        </div>
      `;

      if (!isUnlocked) {
        slot.addEventListener('click', () => {
          if (this.coins >= 15) {
            this.coins -= 15;
            localStorage.setItem('mg_coins', this.coins);
            this.unlockedStickers.push(st.id);
            localStorage.setItem('mg_stickers', JSON.stringify(this.unlockedStickers));
            this.playFanfare();
            this.fireConfetti();
            this.updateStatsDisplay();
            this.renderStickerBook();
            this.cheerMascot(`🎉 Yay! You unlocked ${st.name}!`, true);
          } else {
            this.playTone(200, 'sawtooth', 0.15);
            alert('Need 15 coins to unlock this sticker! Play games to earn coins! 🪙');
          }
        });
      }
      container.appendChild(slot);
    });
  }

  /* ========================================================
     MASCOT COMPANION (MathBot 🤖)
     ======================================================== */
  initMascot() {
    const btn = document.getElementById('mascot-btn');
    const avatar = document.getElementById('mascot-avatar');
    const bubble = document.getElementById('mascot-bubble');
    const textEl = document.getElementById('mascot-text');
    if (!btn || !avatar || !textEl) return;

    const funCheers = [
      'You are a Math Galaxy superstar! ⭐',
      'High five! You are doing so great! ✋',
      'Math is like a superpower! 🦸‍♂️',
      'Boing! Tap me anytime for sparkles! 🎈',
      '2 balls + 2 bats = 4 in all! ⚽🏏',
      'Numbers are everywhere in space! 🚀',
      'Did you know? Stars twinkle just for you! ✨'
    ];
    let cheerIdx = 0;

    btn.addEventListener('click', () => {
      this.playTone(587.33, 'sine', 0.1);
      setTimeout(() => this.playTone(880, 'sine', 0.15), 90);

      avatar.classList.remove('flipping');
      void avatar.offsetWidth;
      avatar.classList.add('flipping');
      setTimeout(() => avatar.classList.remove('flipping'), 850);

      bubble?.classList.remove('pop');
      void bubble?.offsetWidth;
      bubble?.classList.add('pop');

      cheerIdx = (cheerIdx + 1) % funCheers.length;
      textEl.textContent = funCheers[cheerIdx];
      this.speak(funCheers[cheerIdx]);
      this.fireConfetti();
    });
  }

  cheerMascot(msg, isVictory = false) {
    const avatar = document.getElementById('mascot-avatar');
    const bubble = document.getElementById('mascot-bubble');
    const textEl = document.getElementById('mascot-text');
    if (!textEl) return;

    textEl.textContent = msg;

    if (avatar) {
      avatar.classList.remove('dancing');
      void avatar.offsetWidth;
      avatar.classList.add('dancing');
      setTimeout(() => avatar.classList.remove('dancing'), isVictory ? 2000 : 1000);
    }

    if (bubble) {
      bubble.classList.remove('pop');
      void bubble.offsetWidth;
      bubble.classList.add('pop');
    }
  }

  /* ========================================================
     SETTINGS & MODALS (Themes, Audio, Voice)
     ======================================================== */
  initSettings() {
    // Theme Picker
    const btnTheme = document.getElementById('btn-theme-picker');
    const modalTheme = document.getElementById('theme-modal');
    const btnCloseTheme = document.getElementById('btn-close-theme');

    btnTheme?.addEventListener('click', () => {
      this.playPop();
      modalTheme?.classList.remove('hidden');
    });

    btnCloseTheme?.addEventListener('click', () => {
      modalTheme?.classList.add('hidden');
    });

    document.querySelectorAll('.theme-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const th = btn.getAttribute('data-theme');
        this.playPop();
        document.querySelectorAll('.theme-choice-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.applyTheme(th);
        modalTheme?.classList.add('hidden');
      });
    });

    // Sound toggle
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    soundToggle?.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      localStorage.setItem('mg_sound', this.soundEnabled);
      if (soundIcon) soundIcon.textContent = this.soundEnabled ? '🔊' : '🔇';
      if (this.soundEnabled) this.playPop();
    });

    // Voice toggle
    const voiceBtn = document.getElementById('btn-voice-toggle');
    const voiceIcon = document.getElementById('voice-icon');
    const voiceLabel = document.getElementById('voice-label');
    voiceBtn?.addEventListener('click', () => {
      this.voiceEnabled = !this.voiceEnabled;
      localStorage.setItem('mg_voice', this.voiceEnabled);
      if (voiceIcon) voiceIcon.textContent = this.voiceEnabled ? '🗣️' : '🤐';
      if (voiceLabel) voiceLabel.textContent = this.voiceEnabled ? 'Voice ON' : 'Voice OFF';
      if (this.voiceEnabled) {
        this.playPop();
        this.speak('Voice is ON!');
      }
    });
  }

  applyTheme(theme) {
    this.theme = theme;
    document.body.className = theme;
    localStorage.setItem('mg_theme', theme);
  }

  /* ========================================================
     REWARDS & DISPLAY HELPERS
     ======================================================== */
  addCoins(amount) {
    this.coins += amount;
    localStorage.setItem('mg_coins', this.coins);
    this.updateStatsDisplay();
    this.showFloatingReward(`+${amount} 🪙`, '#header-coins-pill', 'reward-coins');
  }

  loseCoin(amount = 1) {
    this.coins = Math.max(0, this.coins - amount);
    localStorage.setItem('mg_coins', this.coins);
    this.updateStatsDisplay();
    this.showFloatingReward(`-${amount} 🪙`, '#header-coins-pill', 'reward-coins-lost');
  }

  addStars(amount) {
    this.stars += amount;
    localStorage.setItem('mg_stars', this.stars);
    this.updateStatsDisplay();
    this.showFloatingReward(`+${amount} ⭐`, '#header-stars-pill', 'reward-stars');
  }

  showFloatingReward(text, selector, className) {
    const target = document.querySelector(selector);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const bubble = document.createElement('div');
    bubble.className = `floating-reward-bubble ${className}`;
    bubble.textContent = text;
    bubble.style.left = `${rect.left + rect.width / 2 - 25}px`;
    bubble.style.top = `${rect.top}px`;
    document.body.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1000);
  }

  updateStatsDisplay() {
    const coinsEl = document.getElementById('user-coins');
    const starsEl = document.getElementById('user-stars');
    const streakEl = document.getElementById('user-streak');
    if (coinsEl) coinsEl.textContent = this.coins;
    if (starsEl) starsEl.textContent = this.stars;
    if (streakEl) streakEl.textContent = this.streak;
  }

  /* ========================================================
     CONFETTI PARTICLE ENGINE
     ======================================================== */
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
    if (!this.canvas || !this.ctx) return;
    const colors = ['#facc15', '#f472b6', '#38bdf8', '#4ade80', '#c084fc', '#fb923c'];
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        life: 1
      });
    }

    if (!this.confettiRunning) {
      this.confettiRunning = true;
      this.animateConfetti();
    }
  }

  animateConfetti() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.vRot;
      p.life -= 0.015;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.confettiRunning = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// Launch Math Galaxy
window.addEventListener('DOMContentLoaded', () => {
  window.app = new MathGalaxyApp();
});
