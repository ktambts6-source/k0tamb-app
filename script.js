// Тема по умолчанию (глобальная переменная для доступа из settings.js)
var currentTheme = safeStorage.getItem('imageTheme') || 'orange';

// --- In-app notification / modal helpers (replace alert/prompt/confirm) ---
(function(){
    function ensureNoticeRoot(){
        if (document.getElementById('inapp-notice-root')) return;
        const root = document.createElement('div');
        root.id = 'inapp-notice-root';
        root.style.position = 'fixed';
        root.style.zIndex = '100000';
        root.style.right = '18px';
        root.style.top = '18px';
        root.style.display = 'flex';
        root.style.flexDirection = 'column';
        root.style.gap = '8px';
        document.body.appendChild(root);

        const modalWrap = document.createElement('div');
        modalWrap.id = 'inapp-modal-wrap';
        modalWrap.style.position = 'fixed';
        modalWrap.style.inset = '0';
        modalWrap.style.display = 'none';
        modalWrap.style.alignItems = 'center';
        modalWrap.style.justifyContent = 'center';
        modalWrap.style.zIndex = '100001';
        document.body.appendChild(modalWrap);
    }

    function showToast(message, type='info', duration=3500){
        ensureNoticeRoot();
        const root = document.getElementById('inapp-notice-root');
        const el = document.createElement('div');
        el.className = 'inapp-toast inapp-' + type;
        el.style.minWidth = '220px';
        el.style.maxWidth = '380px';
        el.style.padding = '10px 14px';
        el.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.45))';
        el.style.border = '1px solid rgba(255,255,255,0.06)';
        el.style.color = '#fff';
        el.style.borderRadius = '10px';
        el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.5)';
        el.style.fontFamily = "'Montserrat',sans-serif";
        el.style.fontSize = '0.95rem';
        el.style.opacity = '0';
        el.style.transition = 'opacity 180ms ease, transform 220ms ease';
        el.innerText = message;
        root.appendChild(el);
        requestAnimationFrame(()=>{ el.style.opacity='1'; el.style.transform='translateY(0)'; });
        setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(-8px)'; setTimeout(()=>el.remove(),220); }, duration);
    }

    function showAlert(message){ showToast(message, 'info', 4000); }

    function showConfirm(message){
        ensureNoticeRoot();
        return new Promise(resolve => {
            const wrap = document.getElementById('inapp-modal-wrap');
            wrap.innerHTML = '';
            wrap.style.display = 'flex';
            const box = document.createElement('div');
            box.style.minWidth = '320px';
            box.style.maxWidth = '92vw';
            box.style.background = '#0f1116';
            box.style.padding = '18px';
            box.style.borderRadius = '12px';
            box.style.boxShadow = '0 12px 40px rgba(0,0,0,0.6)';
            box.style.color = '#fff';
            box.style.fontFamily = "'Montserrat',sans-serif";
            box.innerHTML = `<div style="margin-bottom:12px;font-weight:700;">${message}</div>`;
            const actions = document.createElement('div');
            actions.style.display='flex'; actions.style.gap='8px'; actions.style.justifyContent='flex-end';
            const btnCancel = document.createElement('button');
            btnCancel.textContent = 'Отмена';
            btnCancel.style.padding='8px 12px'; btnCancel.style.border='none'; btnCancel.style.borderRadius='8px'; btnCancel.style.background='transparent'; btnCancel.style.color='#ddd';
            const btnOk = document.createElement('button');
            btnOk.textContent = 'Да';
            btnOk.style.padding='8px 12px'; btnOk.style.border='none'; btnOk.style.borderRadius='8px'; btnOk.style.background='#ff6b00'; btnOk.style.color='#fff'; btnOk.style.fontWeight='700';
            actions.appendChild(btnCancel); actions.appendChild(btnOk);
            box.appendChild(actions);
            wrap.appendChild(box);
            btnCancel.addEventListener('click', ()=>{ wrap.style.display='none'; resolve(false); });
            btnOk.addEventListener('click', ()=>{ wrap.style.display='none'; resolve(true); });
            // click outside to cancel
            wrap.addEventListener('click', function onWrapClick(e){ if (e.target===wrap){ wrap.style.display='none'; resolve(false); wrap.removeEventListener('click', onWrapClick); } });
        });
    }

    function showPrompt(message, defaultValue=''){
        ensureNoticeRoot();
        return new Promise(resolve => {
            const wrap = document.getElementById('inapp-modal-wrap');
            wrap.innerHTML = '';
            wrap.style.display = 'flex';
            const box = document.createElement('div');
            box.style.minWidth = '320px';
            box.style.maxWidth = '92vw';
            box.style.background = '#0f1116';
            box.style.padding = '14px';
            box.style.borderRadius = '12px';
            box.style.boxShadow = '0 12px 40px rgba(0,0,0,0.6)';
            box.style.color = '#fff';
            box.style.fontFamily = "'Montserrat',sans-serif";
            box.innerHTML = `<div style="margin-bottom:8px;font-weight:700;">${message}</div>`;
            const input = document.createElement('input');
            input.type='text'; input.value = defaultValue; input.style.width='100%'; input.style.padding='10px'; input.style.borderRadius='8px'; input.style.border='1px solid rgba(255,255,255,0.06)'; input.style.background='#0b0d11'; input.style.color='#fff';
            box.appendChild(input);
            const actions = document.createElement('div'); actions.style.display='flex'; actions.style.gap='8px'; actions.style.justifyContent='flex-end'; actions.style.marginTop='12px';
            const btnCancel = document.createElement('button'); btnCancel.textContent='Отмена'; btnCancel.style.padding='8px 12px'; btnCancel.style.border='none'; btnCancel.style.borderRadius='8px'; btnCancel.style.background='transparent'; btnCancel.style.color='#ddd';
            const btnOk = document.createElement('button'); btnOk.textContent='OK'; btnOk.style.padding='8px 12px'; btnOk.style.border='none'; btnOk.style.borderRadius='8px'; btnOk.style.background='#ff6b00'; btnOk.style.color='#fff'; btnOk.style.fontWeight='700';
            actions.appendChild(btnCancel); actions.appendChild(btnOk); box.appendChild(actions);
            wrap.appendChild(box);
            input.focus(); input.select();
            btnCancel.addEventListener('click', ()=>{ wrap.style.display='none'; resolve(null); });
            btnOk.addEventListener('click', ()=>{ wrap.style.display='none'; resolve(input.value); });
            wrap.addEventListener('click', function onWrapClick(e){ if (e.target===wrap){ wrap.style.display='none'; resolve(null); wrap.removeEventListener('click', onWrapClick); } });
        });
    }

    window.showToast = showToast;
    window.showAlert = showAlert;
    window.showConfirm = showConfirm;
    window.showPrompt = showPrompt;
    // replace native alert with in-app alert
    try {
        window.alert = function(msg){ window.showAlert(String(msg)); };
        // make prompt non-blocking: show in-app prompt but return null synchronously
        window.prompt = function(msg, def){ window.showPrompt(String(msg), def || ''); return null; };
    } catch(e) {}
})();
document.addEventListener('DOMContentLoaded', function() {
    // ================= ЭЛЕМЕНТЫ DOM =================
    const mainScreen = document.getElementById('mainScreen');
    const resultsScreen = document.getElementById('resultsScreen');
    const globalStatsScreen = document.getElementById('globalStatsScreen');
    const simulateMatchBtn = document.getElementById('simulateMatch');
    const backToMainBtn = document.getElementById('backToMain');
    const downloadPhotoBtn = document.getElementById('downloadPhoto');
    const downloadReportBtn = document.getElementById('downloadReport');
    const saveTeam1Btn = document.getElementById('saveTeam1');
    const saveTeam2Btn = document.getElementById('saveTeam2');
    const team1FileInput = document.getElementById('team1File');
    const team2FileInput = document.getElementById('team2File');

    // Поля команд (лучшие карты и пермбаны)
    const team1BestMapSelect = document.getElementById('team1BestMap');
    const team2BestMapSelect = document.getElementById('team2BestMap');
    const team1PermabanSelect = document.getElementById('team1Permaban');
    const team2PermabanSelect = document.getElementById('team2Permaban');

    // Названия команд
    const team1NameInput = document.getElementById('team1Name');
    const team2NameInput = document.getElementById('team2Name');

    // Кнопка бан-пика и визуализация
    const startDraftBtn = document.getElementById('startDraftBtn');
    const draftVisualizer = document.getElementById('draftVisualizer');
    const draftCardsContainer = document.getElementById('draftCardsContainer');

    // Liquid glass cursor-linked background
    document.body.style.setProperty('--cursor-x', '50%');
    document.body.style.setProperty('--cursor-y', '50%');

    function isLikelyMobileDevice() {
        const ua = navigator.userAgent || '';
        return window.matchMedia('(max-width: 900px)').matches ||
            window.matchMedia('(pointer: coarse)').matches ||
            /Android|webOS|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(ua);
    }

    function getMobilePerfDefault() {
        const saved = safeStorage.getItem('mobilePerformanceMode');
        if (saved === null) return isLikelyMobileDevice();
        return saved === 'true';
    }

    function applyMobilePerformanceMode(enabled) {
        document.body.classList.toggle('mobile-perf', !!enabled);
    }

    window.applyMobilePerformanceMode = applyMobilePerformanceMode;
    window.isLikelyMobileDevice = isLikelyMobileDevice;

    const refreshMobileClass = () => {
        document.body.classList.toggle('mobile-device', isLikelyMobileDevice());
    };
    refreshMobileClass();
    applyMobilePerformanceMode(getMobilePerfDefault());

    let mobileClassRaf = null;
    window.addEventListener('resize', () => {
        if (mobileClassRaf) cancelAnimationFrame(mobileClassRaf);
        mobileClassRaf = requestAnimationFrame(() => {
            refreshMobileClass();
            mobileClassRaf = null;
        });
    }, { passive: true });

    document.querySelectorAll('.has-tooltip').forEach(function (el) {
        const tooltipText = el.getAttribute('title');
        if (tooltipText) {
            el.dataset.tooltip = tooltipText;
            el.removeAttribute('title');
        }
    });

    if (!window.matchMedia('(pointer: coarse)').matches) {
        let pointerRaf = null;
        let lastX = 50;
        let lastY = 50;
        document.addEventListener('mousemove', function (event) {
            lastX = (event.clientX / window.innerWidth) * 100;
            lastY = (event.clientY / window.innerHeight) * 100;
            if (pointerRaf) return;
            pointerRaf = requestAnimationFrame(() => {
                document.body.style.setProperty('--cursor-x', lastX + '%');
                document.body.style.setProperty('--cursor-y', lastY + '%');
                pointerRaf = null;
            });
        }, { passive: true });
    }

    // ================= ДАННЫЕ =================
    let team1 = [];
    let team2 = [];
    let selectedMaps = [];
    let matchResults = null;
    let downloadPhotoAfterSim = false;

    // Карты с путями к фоновым изображениям
    const allMaps = [
        { id: 'breeze',    name: 'Breeze',    image: 'images/maps/breeze.jpg' },
        { id: 'rust',      name: 'Rust',      image: 'images/maps/rust.jpg' },
        { id: 'province',  name: 'Province',  image: 'images/maps/province.jpg' },
        { id: 'prison',    name: 'Prison',    image: 'images/maps/prison.jpg' },
        { id: 'hanami',    name: 'Hanami',    image: 'images/maps/hanami.jpg' },
        { id: 'sandstone', name: 'Sandstone', image: 'images/maps/sandstone.jpg' },
        { id: 'dune',      name: 'Dune',      image: 'images/maps/dune.jpg' }
    ];

    // CS2 карты
    const allMapsCS2 = [
        { id: 'mirage',   name: 'Mirage',   image: 'images/maps/cs2/mirage.jpg' },
        { id: 'inferno',  name: 'Inferno',  image: 'images/maps/cs2/inferno.jpg' },
        { id: 'dust2',    name: 'Dust 2',   image: 'images/maps/cs2/dust2.jpg' },
        { id: 'nuke',     name: 'Nuke',     image: 'images/maps/cs2/nuke.jpg' },
        { id: 'ancient',  name: 'Ancient',  image: 'images/maps/cs2/ancient.jpg' },
        { id: 'anubis',   name: 'Anubis',   image: 'images/maps/cs2/anubis.jpg' },
        { id: 'overpass', name: 'Overpass', image: 'images/maps/cs2/overpass.jpg' }
    ];

    // Режим: s2 или cs2
    function isCS2Mode() {
        return (localStorage.getItem('gameMode') || 's2') === 'cs2';
    }

    function getActiveMaps() {
        return isCS2Mode() ? allMapsCS2 : allMaps;
    }

    // Объект с путями к видео для каждой карты
    const MAP_VIDEOS = {
        'Breeze': { src: 'videos/breeze.mp4', minStart: 10, maxStart: 60, clipDuration: 20 },
        'Rust': { src: 'videos/rust.mp4', minStart: 10, maxStart: 60, clipDuration: 20 },
        'Province': { src: 'videos/province.mp4', minStart: 10, maxStart: 60, clipDuration: 20 },
        'Prison': { src: 'videos/prison.mp4', minStart: 10, maxStart: 60, clipDuration: 20 },
        'Hanami': { src: 'videos/hanami.mp4', minStart: 10, maxStart: 60, clipDuration: 20 },
        'Sandstone': { src: 'videos/sandstone.mp4', minStart: 10, maxStart: 60, clipDuration: 20 },
        'Dune': { src: 'videos/dune.mp4', minStart: 10, maxStart: 60, clipDuration: 20 }
    };

    const mapNames = allMaps.map(map => map.name); // S2 static (fallback)
    function getMapNames() { return getActiveMaps().map(m => m.name); }

    const html2canvasSources = [
        'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
        'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js'
    ];
    let html2canvasLoader = null;

    function ensureHtml2Canvas() {
        if (typeof window.html2canvas !== 'undefined') {
            return Promise.resolve();
        }

        if (html2canvasLoader) {
            return html2canvasLoader;
        }

        let sourceIndex = 0;

        const tryLoad = () => {
            if (sourceIndex >= html2canvasSources.length) {
                return Promise.reject(new Error('html2canvas не загрузилась'));
            }

            const src = html2canvasSources[sourceIndex++];

            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => {
                    if (typeof window.html2canvas !== 'undefined') {
                        resolve();
                    } else {
                        reject(new Error('html2canvas не загрузилась'));
                    }
                };
                script.onerror = () => reject(new Error('Ошибка загрузки html2canvas'));
                document.head.appendChild(script);
            }).catch(() => tryLoad());
        };

        html2canvasLoader = tryLoad();
        return html2canvasLoader;
    }

    // Оружие и награды (Standoff 2)
    const WEAPON_REWARDS = {
        pistol: { name: 'Пистолет', reward: 300 },
        shotgun: { name: 'Дробовик', reward: 600 },
        m60: { name: 'M60', reward: 300 },
        smg: { name: 'Пистолет-пулемёт', reward: 800 },
        mac10: { name: 'MAC-10', reward: 600 },
        mp5: { name: 'MP5', reward: 600 },
        p90: { name: 'P90', reward: 300 },
        rifle: { name: 'Винтовка', reward: 300 },
        fnfal: { name: 'FN FAL/FAMAS', reward: 600 },
        m40: { name: 'M40/Mallard', reward: 500 },
        awm: { name: 'AWM/M110', reward: 300 },
        knife: { name: 'Нож', reward: 1500 },
        grenade: { name: 'Граната', reward: 300 }
    };
    const BUY_WEAPONS = {
        pistol: ['pistol'],
        eco: ['pistol', 'shotgun', 'mac10', 'mp5'],
        force: ['shotgun', 'smg', 'mac10', 'mp5', 'pistol'],
        half: ['rifle', 'fnfal', 'smg'],
        full: ['rifle', 'fnfal', 'awm', 'm40']
    };
    const BUY_NAMES = { pistol: 'Пистол', eco: 'Эко', force: 'Форс-бай', half: 'Полу-бай', full: 'Фулл-бай' };
    const SITUATION_REWARDS = { win: 3000, winDefuse: 3200, lose: 1900, lose2: 2400, lose3: 2900, plant: 600, defuse: 300, loseBomb: 300 };

    // Цены оружия Standoff 2: T (терроры), CT (контр-терроры). Пистол-раунд = 0.
    const WEAPON_PRICES_T = {
        rifle: 3000,   // akr
        fnfal: 1800,
        awm: 4000,
        m40: 1000,
        mac10: 1000,
        mp5: 1400,
        smg: 1900,    // akimbo uzi (или mp5 1400 — берём макс для smg)
        shotgun: 1000,
        pistol: 600   // tec-9 / deagle при покупке; пистол-раунд = 0
    };
    const WEAPON_PRICES_CT = {
        rifle: 3000,  // m4a1
        fnfal: 2000,  // famas
        awm: 3700,    // m110
        m40: 1000,
        mp7: 1500,
        ump45: 1100,
        mac10: 1500,  // на эко/форс CT нет mac10 — маппим на mp7
        mp5: 1100,    // на CT нет mp5 — маппим на ump45
        smg: 1500,    // mp7
        shotgun: 1000,
        pistol: 600   // five-seven / deagle; пистол-раунд = 0
    };

    // Названия оружия для комментариев (T и CT) — Standoff 2
    const WEAPON_DISPLAY_T = { pistol: 'Glock', shotgun: 'Дробовик', mac10: 'MAC-10', mp5: 'MP5', smg: 'Akimbo UZI', rifle: 'AKR', fnfal: 'FN FAL', awm: 'AWM', m40: 'M40' };
    const WEAPON_DISPLAY_CT = { pistol: 'USP', shotgun: 'Дробовик', mac10: 'MP7', mp5: 'UMP45', smg: 'MP7', rifle: 'M4A1', fnfal: 'FAMAS', awm: 'M110', m40: 'M40' };

    // CS2 константы
    const CS2_WEAPON_PRICES_T  = { pistol:0, p250:300, deagle:700, nova:1100, mac10:1050, galil:2050, ak47:2700, awp:4750, ssg:1700 };
    const CS2_WEAPON_PRICES_CT = { pistol:0, p250:300, deagle:700, nova:1100, mp9:1250, mp5sd:1500, ump:1200, famas:2050, m4a4:3100, m4a1s:2900, awp:4750, ssg:1700 };
    const CS2_WEAPON_DISPLAY_T  = { pistol:'Glock-18', p250:'P250', deagle:'Desert Eagle', nova:'Nova', mac10:'MAC-10', galil:'Galil AR', ak47:'AK-47', awp:'AWP', ssg:'SSG 08' };
    const CS2_WEAPON_DISPLAY_CT = { pistol:'USP-S', p250:'P250', deagle:'Desert Eagle', nova:'Nova', mp9:'MP9', mp5sd:'MP5-SD', ump:'UMP-45', famas:'FAMAS', m4a4:'M4A4', m4a1s:'M4A1-S', awp:'AWP', ssg:'SSG 08' };
    const CS2_SITUATION_REWARDS = { win:3250, winDefuse:3500, lose:1400, lose2:1900, lose3:2400, lose4:2900, plant:800, defuse:300, loseBomb:300 };
    const CS2_BUY_NAMES = { pistol:'Пистол', eco:'Эко', force:'Форс-бай', half:'Полу-бай', full:'Фулл-бай' };

    function getSituationRewards() { return isCS2Mode() ? CS2_SITUATION_REWARDS : SITUATION_REWARDS; }
    function getBuyNames() { return isCS2Mode() ? CS2_BUY_NAMES : BUY_NAMES; }

    function getWeaponDisplayName(weaponKey, isT, roundNum) {
        if (isCS2Mode()) {
            const names = isT ? CS2_WEAPON_DISPLAY_T : CS2_WEAPON_DISPLAY_CT;
            if (weaponKey === 'pistol' && roundNum <= 1) return isT ? 'Glock-18' : 'USP-S';
            return names[weaponKey] || weaponKey;
        }
        const names = isT ? WEAPON_DISPLAY_T : WEAPON_DISPLAY_CT;
        if (weaponKey === 'pistol' && roundNum <= 1) return isT ? 'Glock' : 'USP';
        return names[weaponKey] != null ? names[weaponKey] : (WEAPON_REWARDS[weaponKey] ? WEAPON_REWARDS[weaponKey].name : weaponKey);
    }

    function getWeaponPrice(weaponKey, isT, roundNum) {
        if (roundNum <= 1) return 0;
        if (isCS2Mode()) {
            const prices = isT ? CS2_WEAPON_PRICES_T : CS2_WEAPON_PRICES_CT;
            return prices[weaponKey] != null ? prices[weaponKey] : 0;
        }
        const prices = isT ? WEAPON_PRICES_T : WEAPON_PRICES_CT;
        return prices[weaponKey] != null ? prices[weaponKey] : 0;
    }

    function getTeamBuyCost(buyType, teamPlayers, money, isT, roundNum) {
        if (roundNum <= 1) return 0;
        let total = 0;
        const perPlayer = Math.floor(money / 5);
        for (let i = 0; i < (teamPlayers && teamPlayers.length ? teamPlayers.length : 5); i++) {
            const role = (teamPlayers && teamPlayers[i] && teamPlayers[i].role) ? teamPlayers[i].role : 'rifler';
            const weapon = getWeaponForBuy(buyType, role, perPlayer, isT); // fix: pass isT
            total += getWeaponPrice(weapon, isT, roundNum);
        }
        // Учитываем броню/раскид, чтобы экономика чаще входила в реалистичные циклы eco/force/half/full.
        const utilityFactor = isCS2Mode()
            ? { eco: 0.9, force: 1.08, half: 1.16, full: 1.24, pistol: 1.0 }
            : { eco: 0.92, force: 1.06, half: 1.14, full: 1.2, pistol: 1.0 };
        const factor = utilityFactor[buyType] != null ? utilityFactor[buyType] : 1.0;
        return Math.round(total * factor);
    }

    // Множители ролей — S2 и CS2 раздельно
    const DEFAULT_ROLES_S2 = [
        { id: 'rifler', name: 'Рифлер', killMultiplier: 1.1, skillMultiplier: 1.0, impact: 1.0 },
        { id: 'sniper', name: 'Снайпер', killMultiplier: 1.1, skillMultiplier: 1.05, impact: 1.1 },
        { id: 'lurker', name: 'Люркер', killMultiplier: 1.0, skillMultiplier: 0.95, impact: 1.0 },
        { id: 'opener', name: 'Опенер', killMultiplier: 1.05, skillMultiplier: 1.05, impact: 1.1 },
        { id: 'support', name: 'Саппорт', killMultiplier: 1.0, skillMultiplier: 0.9, impact: 0.9 },
        { id: 'captain', name: 'Капитан', killMultiplier: 0.95, skillMultiplier: 1.1, impact: 1.05 },
        { id: 'captain_sniper', name: 'Капитан-снайпер', killMultiplier: 1.0, skillMultiplier: 1.1, impact: 1.15 }
    ];
    const DEFAULT_ROLES_CS2 = [
        { id: 'rifler', name: 'Рифлер', killMultiplier: 1.05, skillMultiplier: 1.0, impact: 1.0 },
        { id: 'sniper', name: 'AWPer', killMultiplier: 1.15, skillMultiplier: 1.1, impact: 1.2 },
        { id: 'lurker', name: 'Люркер', killMultiplier: 1.0, skillMultiplier: 0.95, impact: 1.0 },
        { id: 'opener', name: 'Entry', killMultiplier: 1.1, skillMultiplier: 1.05, impact: 1.1 },
        { id: 'support', name: 'Саппорт', killMultiplier: 0.95, skillMultiplier: 0.9, impact: 0.9 },
        { id: 'captain', name: 'IGL', killMultiplier: 0.9, skillMultiplier: 1.15, impact: 1.1 },
        { id: 'captain_sniper', name: 'IGL-AWPer', killMultiplier: 1.0, skillMultiplier: 1.1, impact: 1.15 }
    ];
    function getActiveRoles() {
        const key = isCS2Mode() ? 'roleMultipliersCS2' : 'roleMultipliers';
        const defaults = isCS2Mode() ? DEFAULT_ROLES_CS2 : DEFAULT_ROLES_S2;
        return JSON.parse(safeStorage.getItem(key) || 'null') || defaults;
    }
    let roles = getActiveRoles(); // обратная совместимость (перезаписывается в onGameModeChange)

    function setRadioValue(name, value) {
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) radio.checked = true;
    }

    function setSelectValue(selectId, value) {
        const select = document.getElementById(selectId);
        if (select) select.value = value;
    }

    function setInputValue(inputId, value) {
        const input = document.getElementById(inputId);
        if (input) input.value = value;
    }

    function applyAutosimUrlParams(urlParams) {
        const mode = urlParams.get('mode');
        if (mode === 'cs2' || mode === 's2') {
            localStorage.setItem('gameMode', mode);
            document.body.classList.remove('mode-s2', 'mode-cs2');
            document.body.classList.add('mode-' + mode);
            setTimeout(function() {
                if (typeof window.setGameMode === 'function') window.setGameMode(mode);
            }, 0);
        }

        const team1Name = urlParams.get('team1');
        const team2Name = urlParams.get('team2');
        const tournament = urlParams.get('tournament');
        const bo = urlParams.get('bo');
        const format = urlParams.get('format');
        const mapSelection = urlParams.get('mapSelection');
        const maps = urlParams.get('maps');
        const downloadPhoto = urlParams.get('downloadPhoto');

        if (team1Name) setInputValue('team1Name', team1Name);
        if (team2Name) setInputValue('team2Name', team2Name);
        if (tournament) setInputValue('tournamentName', tournament);
        if (['1', '2', '3', '5'].includes(bo)) setRadioValue('bo', bo);
        if (['mr9', 'mr12', 'mr15'].includes(format)) setRadioValue('format', format);
        if (['random', 'manual', 'draft'].includes(mapSelection)) {
            setRadioValue('mapSelection', mapSelection);
            updateMapControlsVisibility();
        }

        const currentBo = parseInt(document.querySelector('input[name="bo"]:checked')?.value || '3');
        if (maps) {
            const parsedMaps = maps.split(',').map(function(item) { return item.trim(); }).filter(Boolean);
            if (parsedMaps.length) {
                selectedMaps = parsedMaps;
                if (mapSelection === 'manual') {
                    updateManualMapSelectors();
                    setTimeout(function() {
                        const selects = document.querySelectorAll('.manual-map-select');
                        selects.forEach(function(select, index) {
                            if (parsedMaps[index]) select.value = parsedMaps[index];
                            const preview = document.getElementById('preview-' + index);
                            if (preview && select.value) {
                                const mapData = getMapData(select.value);
                                if (mapData) applyMapBackground(preview, mapData);
                            }
                        });
                    }, 50);
                }
                renderMaps();
            }
        } else {
            if (mapSelection === 'random') {
                selectedMaps = getRandomMaps(currentBo);
                renderMaps();
            } else if (mapSelection === 'manual') {
                selectedMaps = [];
                updateManualMapSelectors();
                renderMaps();
            }
        }

        if (downloadPhoto === '1') {
            downloadPhotoAfterSim = true;
        }

        setTimeout(function() {
            if (typeof simulateMatch === 'function') simulateMatch();
        }, 500);
    }

    // ================= ИНИЦИАЛИЗАЦИЯ =================
    function initApp() {
        team1 = createEmptyPlayers();
        team2 = createEmptyPlayers();

        incrementVisitorCounter();

        fillMapSelects();

        initMapsByBo();

        initEventListeners();

        renderTeams();

        updateMapControlsVisibility();

        // Закрытие профиля игрока
        var profileCloseBtn = document.getElementById('playerProfileClose');
        if (profileCloseBtn) {
            profileCloseBtn.addEventListener('click', function() {
                var modal = document.getElementById('playerProfileModal');
                if (modal) modal.style.display = 'none';
            });
        }

        // Скрываем сообщение «Сайт не загружается» — приложение успешно загрузилось
        window._appLoaded = true;
        if (window._vpnTimer) clearTimeout(window._vpnTimer);
        var vpnOverlay = document.getElementById('vpn-warning-overlay');
        if (vpnOverlay) { vpnOverlay.classList.remove('visible'); vpnOverlay.style.display = 'none'; }

        // Hide/show stats tab based on settings
        updateStatsTabVisibility();

        // Слушаем смену игрового режима из index.html
        window.onGameModeChange = function(newMode, oldMode) {
            roles = getActiveRoles(); // обновить при смене режима
            fillMapSelects();
            const bo = parseInt(document.querySelector('input[name="bo"]:checked').value);
            const mapSel = document.querySelector('input[name="mapSelection"]:checked');
            const selMode = mapSel ? mapSel.value : 'random';
            if (selMode === 'random') {
                selectedMaps = getRandomMaps(bo);
                renderMaps();
            } else if (selMode === 'manual') {
                updateManualMapSelectors();
            }
            // Прячем/показываем вкладку статистики (нет в CS2)
            updateStatsTabVisibility();
        };

        // Если открыта ссылка ?match=ID из админки — загрузить матч и показать результаты
        const urlParams = new URLSearchParams(window.location.search);
        const apiAction = urlParams.get('api');
        if (apiAction === 'simulate') {
            applyAutosimUrlParams(urlParams);
            return;
        }

        const matchId = parseInt(urlParams.get('match'));
        if (matchId) {
            try {
                const history = JSON.parse(safeStorage.getItem('matchHistory') || '[]');
                // Ищем по числовому id или строковому (на случай несоответствия типов)
                const savedMatch = history.find(m => m.id === matchId || String(m.id) === String(matchId));
                if (savedMatch) {
                    // Применяем режим из матча ДО отображения результатов
                    const targetMode = urlParams.get('mode') || savedMatch.gameMode || 's2';
                    localStorage.setItem('gameMode', targetMode);
                    // Обновляем body класс и UI синхронно (setGameMode может ещё не быть)
                    document.body.classList.remove('mode-s2', 'mode-cs2');
                    document.body.classList.add('mode-' + targetMode);
                    // Вызываем через setTimeout чтобы дать index.html инициализировать setGameMode
                    setTimeout(function() {
                        if (typeof window.setGameMode === 'function') window.setGameMode(targetMode);
                    }, 0);
                    matchResults = savedMatch;
                    displayMatchResults(matchResults);
                    switchScreen('results');
                }
            } catch(e) { }
        }
    }

    function updateStatsTabVisibility() {
        const statsEnabled = safeStorage.getItem('statsTrackingEnabled') === 'true';
        const statsTab = document.querySelector('.app-tab[data-tab="globalStats"]');
        const tabsWrap = document.querySelector('.app-tabs');
        const shouldShowStatsTab = (statsEnabled && !isCS2Mode());

        if (tabsWrap) {
            tabsWrap.classList.toggle('single-tab', !shouldShowStatsTab);
        }

        if (statsTab) {
            statsTab.style.display = shouldShowStatsTab ? '' : 'none';
            if (!shouldShowStatsTab && statsTab.classList.contains('active')) {
                switchScreen('main');
            }
        }
    }
    // Expose globally for settings.js
    window.updateStatsTabVisibility = updateStatsTabVisibility;

    function createEmptyPlayers() {
        return Array(5).fill(null).map(() => ({
            nickname: '',
            rating: null,
            role: 'rifler'
        }));
    }

    function incrementVisitorCounter() {
        let visitors = parseInt(safeStorage.getItem('visitorCount')) || 0;
        visitors++;
        safeStorage.setItem('visitorCount', visitors.toString());
        safeStorage.setItem('lastVisit', new Date().toISOString());
    }

    // Заполнить селекты лучших карт и пермбанов
    function fillMapSelects() {
        const selects = [
            team1BestMapSelect,
            team2BestMapSelect,
            team1PermabanSelect,
            team2PermabanSelect
        ];
        const mapOptions = getMapNames().map(map => `<option value="${map}">${map}</option>`).join('');
        selects.forEach(select => {
            select.innerHTML = '<option value="">-- Автоматически --</option>' + mapOptions;
        });
    }

    function initMapsByBo() {
        const bo = parseInt(document.querySelector('input[name="bo"]:checked').value);
        const mapSelection = document.querySelector('input[name="mapSelection"]:checked').value;
        if (mapSelection === 'random') {
            selectedMaps = getRandomMaps(bo);
        } else if (mapSelection === 'manual') {
            selectedMaps = [];
            updateManualMapSelectors();
        } else if (mapSelection === 'draft') {
            selectedMaps = [];
            draftVisualizer.style.display = 'none';
        }
        renderMaps();
    }

    function getRandomMaps(count) {
        const shuffled = [...getMapNames()].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    // ================= ОБРАБОТЧИКИ =================
    function initEventListeners() {
        simulateMatchBtn.addEventListener('click', simulateMatch);
        backToMainBtn.addEventListener('click', () => switchScreen('main'));

        // Переключение вкладок
        document.querySelectorAll('.app-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.app-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                switchScreen(this.dataset.tab);
            });
        });

        downloadPhotoBtn.addEventListener('click', downloadMatchPhoto);
        if (downloadReportBtn) downloadReportBtn.addEventListener('click', downloadMatchReport);

        saveTeam1Btn.addEventListener('click', () => saveTeam(1));
        saveTeam2Btn.addEventListener('click', () => saveTeam(2));

        team1FileInput.addEventListener('change', (e) => loadTeam(e, 1));
        team2FileInput.addEventListener('change', (e) => loadTeam(e, 2));

        document.querySelectorAll('input[name="bo"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const bo = parseInt(this.value);
                const mapSelection = document.querySelector('input[name="mapSelection"]:checked').value;
                if (mapSelection === 'random') {
                    selectedMaps = getRandomMaps(bo);
                    renderMaps();
                } else if (mapSelection === 'manual') {
                    updateManualMapSelectors();
                } else if (mapSelection === 'draft') {
                    draftVisualizer.style.display = 'none';
                }
            });
        });

        document.querySelectorAll('input[name="mapSelection"]').forEach(radio => {
            radio.addEventListener('change', function() {
                updateMapControlsVisibility();
                const bo = parseInt(document.querySelector('input[name="bo"]:checked').value);
                if (this.value === 'random') {
                    selectedMaps = getRandomMaps(bo);
                    renderMaps();
                } else if (this.value === 'manual') {
                    selectedMaps = [];
                    updateManualMapSelectors();
                    renderMaps();
                } else if (this.value === 'draft') {
                    selectedMaps = [];
                    draftVisualizer.style.display = 'none';
                    renderMaps();
                }
            });
        });

        document.getElementById('randomMaps').addEventListener('click', function() {
            const bo = parseInt(document.querySelector('input[name="bo"]:checked').value);
            selectedMaps = getRandomMaps(bo);
            renderMaps();
        });

        document.getElementById('applyManualMaps').addEventListener('click', function() {
            const bo = parseInt(document.querySelector('input[name="bo"]:checked').value);
            const selects = document.querySelectorAll('.manual-map-select');
            const selected = Array.from(selects).map(select => select.value).filter(v => v !== '');
            if (selected.length !== bo) {
                showAlert(`Для BO${bo} нужно выбрать ${bo} карт!`);
                return;
            }
            selectedMaps = selected;
            renderMaps();
        });

        // Бан-пик
        startDraftBtn.addEventListener('click', startDraftProcess);

        // Обработка ввода игроков
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('player-nickname')) {
                const teamId = parseInt(e.target.dataset.team);
                const index = parseInt(e.target.dataset.index);
                const team = teamId === 1 ? team1 : team2;
                const trimmedNick = e.target.value.trim();
                team[index].nickname = trimmedNick;

                // Update avatar
                const img = document.querySelector(`img.player-avatar-img[data-team="${teamId}"][data-index="${index}"]`);
                if (img) {
                    if (!isCS2Mode()) { img.src = trimmedNick ? `players/${trimmedNick}.png` : 'players/defaultplayer.png'; }
                }
            }
            if (e.target.classList.contains('player-rating')) {
                const teamId = parseInt(e.target.dataset.team);
                const index = parseInt(e.target.dataset.index);
                const team = teamId === 1 ? team1 : team2;
                const value = e.target.value.trim();
                if (value === '') {
                    team[index].rating = null;
                    e.target.className = 'player-rating';
                    return;
                }
                let rating = parseFloat(value);
                if (isNaN(rating)) return;
                if (rating > 200) rating = 200;
                if (rating < 0) rating = 0;
                team[index].rating = rating;
                e.target.className = 'player-rating';
            }
        });

        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('player-role')) {
                const teamId = parseInt(e.target.dataset.team);
                const index = parseInt(e.target.dataset.index);
                const team = teamId === 1 ? team1 : team2;
                team[index].role = e.target.value;
            }
        });
    }

    // ================= УПРАВЛЕНИЕ ВИДИМОСТЬЮ =================
    function updateMapControlsVisibility() {
        const mapSelection = document.querySelector('input[name="mapSelection"]:checked').value;
        const randomCtrl = document.getElementById('randomMapControls');
        const manualCtrl = document.getElementById('manualMapControls');
        const draftCtrl = document.getElementById('draftControls');
        
        // Скрыть все с анимацией
        randomCtrl.style.opacity = '0';
        manualCtrl.style.opacity = '0';
        draftCtrl.style.opacity = '0';
        
        setTimeout(() => {
            randomCtrl.style.display = mapSelection === 'random' ? 'block' : 'none';
            manualCtrl.style.display = mapSelection === 'manual' ? 'block' : 'none';
            draftCtrl.style.display = mapSelection === 'draft' ? 'block' : 'none';
            
            // Появить с анимацией
            setTimeout(() => {
                if (mapSelection === 'random' && randomCtrl.style.display === 'block') randomCtrl.style.opacity = '1';
                else if (mapSelection === 'manual' && manualCtrl.style.display === 'block') manualCtrl.style.opacity = '1';
                else if (mapSelection === 'draft' && draftCtrl.style.display === 'block') draftCtrl.style.opacity = '1';
            }, 10);
        }, 200);
    }

    // ================= РУЧНОЙ ВЫБОР КАРТ С ПРЕВЬЮ =================
    function updateManualMapSelectors() {
        const container = document.getElementById('manualMapSelectors');
        const bo = parseInt(document.querySelector('input[name="bo"]:checked').value);
        let html = '';
        for (let i = 0; i < bo; i++) {
            html += `
                <div class="manual-map-item">
                    <div id="preview-${i}" class="manual-map-preview" style="background-image: url('${getActiveMaps()[0].image}');">
                        <div class="overlay"></div>
                    </div>
                    <select id="select-${i}" class="manual-map-select" data-index="${i}">
                        <option value="">-- Выберите карту --</option>
                        ${getMapNames().map(map => `<option value="${map}">${map}</option>`).join('')}
                    </select>
                </div>
            `;
        }
        container.innerHTML = html;

        container.querySelectorAll('.manual-map-select').forEach(select => {
            select.addEventListener('change', function() {
                const index = this.dataset.index;
                const mapName = this.value;
                const preview = document.getElementById(`preview-${index}`);
                if (mapName) {
                    const mapData = getMapData(mapName);
                    applyMapBackground(preview, mapData);
                } else {
                    applyMapBackground(preview, getActiveMaps()[0]);
                }
            });
        });
    }

    // ================= НОВАЯ ЛОГИКА БАН-ПИКА (ПОШАГОВАЯ ВИЗУАЛИЗАЦИЯ) =================
    function startDraftProcess() {
        const bo = parseInt(document.querySelector('input[name="bo"]:checked').value);
        let pool = [...getMapNames()];
        const picks = [];

        // Получаем названия команд
        const team1Name = team1NameInput.value.trim() || 'Команда 1';
        const team2Name = team2NameInput.value.trim() || 'Команда 2';

        // Получаем пермбаны и лучшие карты
        const team1Permaban = team1PermabanSelect.value;
        const team2Permaban = team2PermabanSelect.value;
        const team1Best = team1BestMapSelect.value;
        const team2Best = team2BestMapSelect.value;

        // Подготавливаем визуализацию
        draftVisualizer.style.display = 'block';
        draftCardsContainer.innerHTML = '';

        // Функция добавления карточки на экран
        function addDraftCard(mapName, team, type) {
            const mapData = getMapData(mapName);

            const card = document.createElement('div');
            card.className = `draft-card ${type}`;
            applyMapBackground(card, mapData);

            let actionText = '';
            if (type === 'pick') actionText = `PICK (${team})`;
            else if (type === 'ban') {
                if (team) actionText = `BAN (${team})`;
                else actionText = `BAN`; // для нейтрального бана
            }
            else if (type === 'decider') actionText = `DECIDER`;

            card.innerHTML = `
                <div class="overlay"></div>
                <div class="content">
                    <div class="map-name">${mapName}</div>
                    <div class="action">${actionText}</div>
                </div>
            `;
            draftCardsContainer.appendChild(card);
        }

        // Определяем последовательность шагов в зависимости от BO
        let steps = [];

        if (bo === 1) {
            // BO1: 6 банов, затем десайдер
            for (let i = 0; i < 6; i++) {
                steps.push({ type: 'ban', team: (i % 2 === 0) ? 1 : 2 });
            }
        } else if (bo === 2) {
            // BO2: бан1, бан2, бан1, бан2, пик1, пик2, бан (нейтральный)
            steps.push({ type: 'ban', team: 1 });
            steps.push({ type: 'ban', team: 2 });
            steps.push({ type: 'ban', team: 1 });
            steps.push({ type: 'ban', team: 2 });
            steps.push({ type: 'pick', team: 1 });
            steps.push({ type: 'pick', team: 2 });
            steps.push({ type: 'ban', team: null }); // нейтральный бан
        } else if (bo === 3) {
            // BO3: бан1, бан2, пик1, пик2, бан1, бан2, десайдер
            steps.push({ type: 'ban', team: 1 });
            steps.push({ type: 'ban', team: 2 });
            steps.push({ type: 'pick', team: 1 });
            steps.push({ type: 'pick', team: 2 });
            steps.push({ type: 'ban', team: 1 });
            steps.push({ type: 'ban', team: 2 });
        } else if (bo === 5) {
            // BO5: бан1, бан2, пик1, пик2, пик1, пик2, десайдер
            steps.push({ type: 'ban', team: 1 });
            steps.push({ type: 'ban', team: 2 });
            steps.push({ type: 'pick', team: 1 });
            steps.push({ type: 'pick', team: 2 });
            steps.push({ type: 'pick', team: 1 });
            steps.push({ type: 'pick', team: 2 });
        }

        let currentStep = 0;
        let currentPool = [...pool];
        let currentPicks = [];

        function processNextStep() {
            if (currentStep >= steps.length) {
                // Если после всех шагов осталась одна карта в пуле — это десайдер (для BO1, BO3, BO5)
                if (currentPool.length === 1) {
                    const map = currentPool[0];
                    addDraftCard(map, '', 'decider');
                    currentPicks.push(map);
                    currentPool = [];
                }
                // Завершение: обновляем selectedMaps
                selectedMaps = [...currentPicks];
                renderMaps();
                return;
            }

            const step = steps[currentStep];
            const team = step.team;
            const type = step.type;
            const teamName = team === 1 ? team1Name : (team === 2 ? team2Name : null);

            if (type === 'ban') {
                if (currentPool.length === 0) {
                    currentStep++;
                    setTimeout(processNextStep, 100);
                    return;
                }

                let bannedMap = null;
                // Если есть команда, проверяем её перманентный бан
                if (team) {
                    const permaban = team === 1 ? team1Permaban : team2Permaban;
                    if (permaban && currentPool.includes(permaban)) {
                        bannedMap = permaban;
                    }
                }
                // Если не нашли перм бан или команды нет, выбираем случайную
                if (!bannedMap) {
                    const banIndex = Math.floor(Math.random() * currentPool.length);
                    bannedMap = currentPool[banIndex];
                }

                if (bannedMap) {
                    currentPool = currentPool.filter(m => m !== bannedMap);
                    addDraftCard(bannedMap, teamName, 'ban');
                }

                currentStep++;
                setTimeout(processNextStep, 800);
            } else if (type === 'pick') {
                if (currentPool.length === 0) {
                    currentStep++;
                    setTimeout(processNextStep, 100);
                    return;
                }

                let pickedMap = null;
                // Пик: сначала лучшая карта команды, если доступна
                const bestMap = team === 1 ? team1Best : team2Best;
                if (bestMap && currentPool.includes(bestMap)) {
                    pickedMap = bestMap;
                } else {
                    const randomIndex = Math.floor(Math.random() * currentPool.length);
                    pickedMap = currentPool[randomIndex];
                }

                if (pickedMap) {
                    currentPicks.push(pickedMap);
                    currentPool = currentPool.filter(m => m !== pickedMap);
                    addDraftCard(pickedMap, teamName, 'pick');
                }

                currentStep++;
                setTimeout(processNextStep, 800);
            }
        }

        // Запускаем процесс
        processNextStep();
    }

    // ================= РЕНДЕР КОМАНД И КАРТ =================
    function renderTeams() {
        renderTeamTable(1, team1);
        renderTeamTable(2, team2);
    }

    function renderTeamTable(teamId, players) {
        const tbody = document.getElementById(`team${teamId}Players`);
        if (!tbody) return;
        tbody.innerHTML = '';
        players.forEach((player, index) => {
            const row = document.createElement('tr');
            const avatarSrc = player.nickname ? `players/${player.nickname}.png` : 'players/defaultplayer.png';
            
            const cs2 = isCS2Mode();
            row.innerHTML = `
                ${cs2 ? '' : `<td style="text-align: center; vertical-align: middle; width: 50px;">
                    <img src="${avatarSrc}" 
                         class="player-avatar-img" 
                         data-team="${teamId}" 
                         data-index="${index}"
                         alt="Avatar"
                         onerror="this.onerror=null;this.src='players/defaultplayer.png';">
                </td>`}
                <td style="${cs2 ? 'width:50%;' : ''}">
                    <input type="text" class="player-nickname" 
                           value="${player.nickname}" 
                           data-team="${teamId}" 
                           data-index="${index}"
                           placeholder="Введите никнейм"
                           style="width:100%;">
                </td>
                <td style="${cs2 ? 'width:25%;' : ''}">
                    <input type="number" class="player-rating"
                           value="${player.rating !== null ? player.rating : ''}"
                           min="0" max="200" step="0.01"
                           data-team="${teamId}"
                           data-index="${index}"
                           placeholder="Рейтинг"
                           style="width:100%;">
                </td>
                <td style="${cs2 ? 'width:25%;' : ''}">
                    <select class="player-role" 
                            data-team="${teamId}" 
                            data-index="${index}">
                        ${getActiveRoles().map(role => `
                            <option value="${role.id}" ${player.role === role.id ? 'selected' : ''}>
                                ${role.name}
                            </option>
                        `).join('')}
                    </select>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function renderMaps() {
        const mapsList = document.getElementById('mapsList');
        if (!mapsList) return;
        const fastMode = document.body.classList.contains('mobile-perf');
        const fadeOutDelay = fastMode ? 70 : 200;
        const fadeInDelay = fastMode ? 0 : 10;
        
        // Fade out
        mapsList.style.opacity = '0';
        
        setTimeout(() => {
            mapsList.innerHTML = '';
            if (selectedMaps.length === 0) {
                mapsList.innerHTML = '<div style="color: #aaa; text-align: center;">Карты не выбраны</div>';
                mapsList.style.opacity = '1';
                updateMapForecast();
                return;
            }
            selectedMaps.forEach((map, index) => {
                const mapData = getMapData(map);
                const mapElement = document.createElement('div');
                mapElement.className = 'map-item';
                applyMapBackground(mapElement, mapData);
                mapElement.innerHTML = `
                    <div class="map-overlay"></div>
                    <div class="map-content">
                        <div class="map-number">Карта ${index + 1}</div>
                        <div class="map-name">${map}</div>
                    </div>
                `;
                mapsList.appendChild(mapElement);
            });
            
            // Fade in
            setTimeout(() => {
                mapsList.style.opacity = '1';
            }, fadeInDelay);
            updateMapForecast();
        }, fadeOutDelay);
    }

    function getMapData(mapName) {
        let normalizedName = String(mapName || '').trim().toLowerCase();
        // Map aliases to standard names (Zone 7 -> Prison)
        if (normalizedName === 'zone 7') {
            normalizedName = 'prison';
        }
        const map = getActiveMaps().find(m => {
            const name = String(m.name || '').trim().toLowerCase();
            const id   = String(m.id || '').trim().toLowerCase();
            return name === normalizedName || id === normalizedName;
        });
        return map || { name: mapName, image: 'images/maps/breeze.jpg', fallbackColor: '#2c3e50' };
    }

    function applyMapBackground(element, mapData) {
        if (!element || !mapData) return;
        const imagePath = String(mapData.image || 'images/maps/breeze.jpg').replace(/"/g, '%22');
        element.style.setProperty('background-image', `url("${imagePath}")`, 'important');
        element.style.setProperty('background-size', 'cover', 'important');
        element.style.setProperty('background-position', 'center', 'important');
        element.style.setProperty('background-repeat', 'no-repeat', 'important');
        if (mapData.fallbackColor) {
            element.style.setProperty('background-color', mapData.fallbackColor, 'important');
        }
    }

    function getRatingClass(rating) {
        if (rating === null || rating === undefined) return '';
        const r = parseFloat(rating);
        if (isNaN(r)) return '';
        // Поддержка дробного рейтинга (например 0.99, 1.20) и целого (60-200+)
        if (r < 2) {
            // Дробный рейтинг (HLTV-стиль 0.xx–1.xx)
            if (r >= 1.15) return 'high';
            if (r >= 1.0) return 'medium';
            return 'low';
        } else if (r >= 100) {
            // Целочисленный рейтинг выше 100 (например Faceit ELO)
            if (r >= 150) return 'high';
            if (r >= 100) return 'medium';
            return 'low';
        } else {
            // Обычный рейтинг 0–100
            if (r >= 90) return 'high';
            if (r >= 75) return 'medium';
            return 'low';
        }
    }

    // ================= СОХРАНЕНИЕ / ЗАГРУЗКА КОМАНД =================
    function saveTeam(teamId) {
        const team = teamId === 1 ? team1 : team2;
        const teamName = document.querySelector(`#team${teamId}Name`).value || `Team ${teamId}`;

        let bestMap = '', permaban = '';
        if (teamId === 1) {
            bestMap = team1BestMapSelect.value;
            permaban = team1PermabanSelect.value;
        } else {
            bestMap = team2BestMapSelect.value;
            permaban = team2PermabanSelect.value;
        }

        const coach = getCoach(teamId);
        const teamplay = getTeamplay(teamId);
        const data = {
            teamName,
            players: team,
            bestMap: bestMap || undefined,
            permaban: permaban || undefined,
            coach: (coach && (coach.nickname || coach.rating !== null)) ? coach : undefined,
            teamplay: teamplay !== 50 ? teamplay : undefined,
            saveDate: new Date().toISOString()
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `team_${teamName.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(`Команда "${teamName}" сохранена!`, 'info', 3000);
    }

    function loadTeam(event, teamId) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.players && Array.isArray(data.players)) {
                    const loadedPlayers = data.players.slice(0, 5);
                    while (loadedPlayers.length < 5) {
                        loadedPlayers.push({ nickname: '', rating: null, role: 'rifler' });
                    }

                    if (teamId === 1) {
                        team1 = loadedPlayers;
                        if (data.bestMap) {
                            const normalizedBestMap = getMapData(data.bestMap).name;
                            team1BestMapSelect.value = normalizedBestMap;
                        }
                        if (data.permaban) {
                            const normalizedPermaban = getMapData(data.permaban).name;
                            team1PermabanSelect.value = normalizedPermaban;
                        }
                    } else {
                        team2 = loadedPlayers;
                        if (data.bestMap) {
                            const normalizedBestMap = getMapData(data.bestMap).name;
                            team2BestMapSelect.value = normalizedBestMap;
                        }
                        if (data.permaban) {
                            const normalizedPermaban = getMapData(data.permaban).name;
                            team2PermabanSelect.value = normalizedPermaban;
                        }
                    }

                    // Всегда сбрасываем тренера — если в новой команде его нет, старый не должен оставаться
                    const nickEl = document.getElementById(`team${teamId}CoachNick`);
                    const ratingEl = document.getElementById(`team${teamId}CoachRating`);
                    if (nickEl) nickEl.value = '';
                    if (ratingEl) ratingEl.value = '';

                    if (data.coach) {
                        if (nickEl) nickEl.value = data.coach.nickname || '';
                        if (ratingEl) ratingEl.value = data.coach.rating !== null && data.coach.rating !== undefined ? data.coach.rating : '';
                    }
                    const tpEl = document.getElementById(`team${teamId}Teamplay`);
                    if (tpEl) tpEl.value = (data.teamplay !== undefined && data.teamplay !== null) ? data.teamplay : 50;

                    if (data.teamName) {
                        document.querySelector(`#team${teamId}Name`).value = data.teamName;
                    }

                    const statusElement = event.target.parentElement.querySelector('.file-status');
                    if (statusElement) {
                        statusElement.textContent = file.name;
                        statusElement.style.color = '#4CAF50';
                    }

                    renderTeams();
                    showToast(`Команда "${data.teamName || 'Без названия'}" загружена!`, 'info', 3000);
                } else {
                    showAlert('Некорректный формат файла');
                }
            } catch (error) {
                showAlert('Ошибка при чтении файла: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // ================= ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ =================
    function switchScreen(screen) {
        mainScreen.classList.add('hidden');
        resultsScreen.classList.add('hidden');
        if (globalStatsScreen) globalStatsScreen.classList.add('hidden');

        if (screen === 'main') {
            mainScreen.classList.remove('hidden');
        } else if (screen === 'results') {
            resultsScreen.classList.remove('hidden');
            window.scrollTo(0, 0);
            addMapBackgroundsToResults();
        } else if (screen === 'globalStats') {
            if (globalStatsScreen) {
                globalStatsScreen.classList.remove('hidden');
                // Сначала показываем локальные данные, потом тянем из облака
                renderGlobalStats();
                pullStatsFromCloud(function(success) {
                    if (success) renderGlobalStats(); // обновляем если пришли новые данные
                });
            }
        }

        // Обновляем активную вкладку
        if (screen === 'main' || screen === 'globalStats') {
            document.querySelectorAll('.app-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.tab === screen);
            });
        }
    }

    function addMapBackgroundsToResults() {
        if (!matchResults) return;
        const mapElements = document.querySelectorAll('.map-stat-item');
        mapElements.forEach((element, index) => {
            if (index < matchResults.maps.length) {
                const mapName = matchResults.maps[index].mapName;
                const mapData = getMapData(mapName);
                applyMapBackground(element, mapData);
                element.style.position = 'relative';

                const content = element.querySelector('.map-header');
                if (content) {
                    content.style.position = 'relative';
                    content.style.zIndex = '1';
                    content.style.color = 'white';
                }
                const statsTables = element.querySelector('.map-stats-tables');
                if (statsTables) {
                    statsTables.style.position = 'relative';
                    statsTables.style.zIndex = '1';
                    statsTables.style.color = 'white';
                }
            }
        });
    }

    function finalizeTeamPlayerStats(players) {
        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
        players.forEach(player => {
            const kills = player.kills || 0;
            const deaths = player.deaths || 0;
            const assists = player.assists || 0;
            const roundsWon = player.roundsWon || 0;
            const rounds = player.totalRounds || 1;

            const kdRaw = deaths > 0 ? (kills / deaths) : kills;
            const kprVal = kills / rounds;
            const dprVal = deaths / rounds;
            const aprVal = assists / rounds;
            const roundWinRate = roundsWon > 0 ? (roundsWon / rounds) : 0.5;

            player.kd = Math.min(kdRaw, 3.0).toFixed(2);
            player.kpr = kprVal.toFixed(2);
            player.dpr = dprVal.toFixed(2);

            // --- ADR: realistic damage per round based on KPR, DPR, assists, round win rate and player rating ---
            const kdVal = parseFloat(player.kd);
            const playerRating = normalizeRating(player.rating !== null ? player.rating : 50);
            const ratingAdj = clamp((playerRating - 100) * 0.12, -10, 14);
            const baseAdr = 104 * kprVal + ratingAdj;
            const consistencyBonus = clamp((roundWinRate - 0.5) * 12 + aprVal * 5 - Math.max(0, dprVal - 0.82) * 5, -10, 22);
            const kdBonus = Math.max(0, kdVal - 1.0) * 5;
            const adrEstimate = baseAdr + consistencyBonus + kdBonus;
            player.adr = Math.round(clamp(adrEstimate, 32, 124) * 10) / 10;

            // --- KAST ---
            const kast = clamp(
                0.6 +
                (kprVal - 0.68) * 0.24 -
                (dprVal - 0.68) * 0.25 +
                aprVal * 0.16 +
                (roundWinRate - 0.5) * 0.22,
                0.45,
                0.97
            );
            player.kast = Math.round(kast * 1000) / 1000;

            // --- HLTV Rating 2.0 (after weights from image) ---
            // Weights: Kills 25%, Damage 15%, Multis 4%, Round Swing 33%, Survival 15%, KAST 8%
            // Translated to stat-based formula anchored on those weights:
            const impact = 2.13 * kprVal + 0.42 * aprVal - 0.41;
            const survivalScore = clamp(1 - dprVal, 0, 1);
            const roundSwing = clamp((kprVal - dprVal + 0.5), 0, 1);

            const hltvRaw =
                0.25 * clamp(kprVal / 0.68, 0, 2) +           // Kills (25%)
                0.15 * clamp(player.adr / 72, 0, 2) +          // Damage/ADR (15%)
                0.04 * clamp(Math.max(0, impact) / 0.8, 0, 2) + // Multis/Impact (4%)
                0.33 * clamp(roundSwing, 0, 1) * 2 +            // Round Swing (33%)
                0.15 * survivalScore * 2 +                       // Survival (15%)
                0.08 * kast * 1.2;                               // KAST (8%)

            // Scale so that ~average player (kd≈1.0, adr≈70) gets ~1.00
            // Calibrated: raw at avg player ≈ 0.9386, so scale = 1/0.9386 ≈ 1.0654
            const hltvScaled = hltvRaw * (1.0 / 0.9386);
            player.hltvRating = Math.round(clamp(hltvScaled, 0.45, 2.20) * 100) / 100;
        });
    }

    // Приводит суммарную статистику серии в полное соответствие с суммой по картам.
    function syncSeriesStatsFromMaps(results) {
        if (!results || !Array.isArray(results.maps)) return;

        const resetTotals = function (player) {
            player.kills = 0;
            player.deaths = 0;
            player.assists = 0;
            player.totalRounds = 0;
            player.roundsWon = 0;
        };

        (results.team1Stats || []).forEach(resetTotals);
        (results.team2Stats || []).forEach(resetTotals);

        const addMapStats = function (seriesStats, mapStats, mapRounds, roundsWon) {
            (mapStats || []).forEach((stat, idx) => {
                const fallback = seriesStats[idx];
                const target = seriesStats.find(p => p.nickname === stat.nickname) || fallback;
                if (!target) return;
                target.kills += stat.kills || 0;
                target.deaths += stat.deaths || 0;
                target.assists += stat.assists || 0;
                target.totalRounds += mapRounds;
                target.roundsWon += roundsWon;
            });
        };

        results.maps.forEach(map => {
            const mapRounds = (map.team1Score || 0) + (map.team2Score || 0);
            addMapStats(results.team1Stats || [], map.team1Stats, mapRounds, map.team1Score || 0);
            addMapStats(results.team2Stats || [], map.team2Stats, mapRounds, map.team2Score || 0);
        });
    }

    // ================= СИМУЛЯЦИЯ МАТЧА (с учётом лучших карт) =================
        function simulateMatch() {
        if (team1.length === 0 || team2.length === 0) {
            showAlert('Добавьте игроков в обе команды!');
            return;
        }

        const bo = parseInt(document.querySelector('input[name="bo"]:checked').value);
        if (selectedMaps.length !== bo) {
            showAlert(`Для BO${bo} нужно выбрать ${bo} карт!`);
            return;
        }

        const format = document.querySelector('input[name="format"]:checked').value;
        const tournamentName = document.getElementById('tournamentName').value || 'Турнир';
        const t1Name = team1NameInput.value || 'TEAM 1';
        const t2Name = team2NameInput.value || 'TEAM 2';
        const formatLabel = format === 'mr9' ? 'MR9' : (format === 'mr12' ? 'MR12' : 'MR15');

        // Show RP change modal before starting match
        if (localStorage.getItem('rankingModeEnabled') === 'true') {
            var selectedMapCode = selectedMaps.length > 0 ? (selectedMaps[0].includes('CS2') ? 'CS2' : 'S2') : 'S2';
            showRPChangeModal(t1Name, t2Name, selectedMapCode, function(proceeded) {
                if (!proceeded) return; // User cancelled
                runMatch();
            });
            return; // Exit here, runMatch will be called from callback
        }

        runMatch(); // If ranking mode disabled, run match directly

        function runMatch() {
            // Запускаем async симуляцию
            let simResults = null;
            const roundTarget = format === 'mr9' ? 10 : (format === 'mr12' ? 13 : 16);
            const maxRounds = format === 'mr9' ? 19 : (format === 'mr12' ? 24 : 31);

        async function runSimulationAsync() {
            const maps = selectedMaps;
            const bo = parseInt(document.querySelector('input[name="bo"]:checked').value);
            const winsNeeded = bo === 5 ? 3 : (bo === 3 ? 2 : (bo === 2 ? 2 : 1));
            const t1n = team1NameInput.value || 'TEAM 1';
            const t2n = team2NameInput.value || 'TEAM 2';

            const results = {
                tournamentName,
                format: format === 'mr9' ? 'MR9' : (format === 'mr12' ? 'MR12' : 'MR15'),
                bo,
                plannedMaps: maps.slice(),
                team1Name: t1n,
                team2Name: t2n,
                team1Score: 0,
                team2Score: 0,
                maps: [],
                team1Stats: [],
                team2Stats: []
            };

            team1.forEach((player, index) => {
                results.team1Stats.push({ nickname: player.nickname || `Player${index + 1}`, rating: normalizeRating(player.rating !== null ? player.rating : 50), inputRating: player.rating, role: player.role, kills: 0, deaths: 0, assists: 0, kd: 0, totalRounds: 0 });
            });
            team2.forEach((player, index) => {
                results.team2Stats.push({ nickname: player.nickname || `Enemy${index + 1}`, rating: normalizeRating(player.rating !== null ? player.rating : 50), inputRating: player.rating, role: player.role, kills: 0, deaths: 0, assists: 0, kd: 0, totalRounds: 0 });
            });

            let team1Wins = 0, team2Wins = 0;

            for (let i = 0; i < maps.length; i++) {
                const mapName = maps[i];
                const isTeam1Best = (team1BestMapSelect.value === mapName);
                const isTeam2Best = (team2BestMapSelect.value === mapName);
                const mapResult = simulateMap(team1, team2, mapName, roundTarget, maxRounds, format, isTeam1Best, isTeam2Best, t1n, t2n);

                results.maps.push(mapResult);
                if (mapResult.winner === 1) team1Wins++;
                else if (mapResult.winner === 2) team2Wins++;
                results.team1Score = team1Wins;
                results.team2Score = team2Wins;

                const mapRounds = mapResult.team1Score + mapResult.team2Score;
                mapResult.team1Stats.forEach((stat, idx) => {
                    results.team1Stats[idx].kills += stat.kills;
                    results.team1Stats[idx].deaths += stat.deaths;
                    results.team1Stats[idx].assists = (results.team1Stats[idx].assists || 0) + (stat.assists || 0);
                    results.team1Stats[idx].totalRounds = (results.team1Stats[idx].totalRounds || 0) + mapRounds;
                    results.team1Stats[idx].roundsWon = (results.team1Stats[idx].roundsWon || 0) + mapResult.team1Score;
                });
                mapResult.team2Stats.forEach((stat, idx) => {
                    results.team2Stats[idx].kills += stat.kills;
                    results.team2Stats[idx].deaths += stat.deaths;
                    results.team2Stats[idx].assists = (results.team2Stats[idx].assists || 0) + (stat.assists || 0);
                    results.team2Stats[idx].totalRounds = (results.team2Stats[idx].totalRounds || 0) + mapRounds;
                    results.team2Stats[idx].roundsWon = (results.team2Stats[idx].roundsWon || 0) + mapResult.team2Score;
                });

                if (bo !== 2 && (team1Wins >= winsNeeded || team2Wins >= winsNeeded)) break;
            }

            // Финальный расчёт статистики
            syncSeriesStatsFromMaps(results);
            finalizeTeamPlayerStats(results.team1Stats);
            finalizeTeamPlayerStats(results.team2Stats);

            const allPlayers = [...results.team1Stats, ...results.team2Stats];
            let mvp = null, bestScore = -1;
            allPlayers.forEach(player => {
                const kd = parseFloat(player.kd) || 0;
                const hltvRating = player.hltvRating || 1.0;
                const kdScore = Math.min(kd, 3.0);
                const killsScore = Math.min(player.kills / 25, 1.0);
                const survivalScore = player.deaths > 0 ? 1 / (1 + player.deaths / 20) : 1.0;
                const ratingScore = (hltvRating - 0.5) / 1.5; // normalize 0.5-2.0 to 0-1
                const score = kdScore * 0.3 + killsScore * 0.3 + survivalScore * 0.2 + ratingScore * 0.2;
                if (score > bestScore) { bestScore = score; mvp = player; }
            });
            results.mvp = mvp;

            results.maps.forEach(map => {
                const mapPlayers = [...map.team1Stats, ...map.team2Stats];
                let mapMVP = null, mapBestScore = -1;
                mapPlayers.forEach(player => {
                    const score = player.kills * 2 - player.deaths;
                    if (score > mapBestScore) { mapBestScore = score; mapMVP = player; }
                });
                map.mvp = mapMVP;
            });

            simResults = results;

            // Update team RP if ranking mode is enabled
            if (localStorage.getItem('rankingModeEnabled') === 'true') {
                var selectedMapCode = selectedMaps.length > 0 ? (selectedMaps[0].includes('CS2') ? 'CS2' : 'S2') : 'S2';
                // team1Wins and team2Wins already calculated above
                if (team1Wins > team2Wins) {
                    var rpInfo = updateTeamRPAfterMatch(t1Name, t2Name, results.maps.filter(m => m.team1Score > m.team2Score).length, selectedMapCode);
                    if (rpInfo) {
                        console.log(rpInfo.winner + ' gained ' + rpInfo.winnerRPChange + ' RP');
                    }
                } else if (team2Wins > team1Wins) {
                    var rpInfo = updateTeamRPAfterMatch(t2Name, t1Name, results.maps.filter(m => m.team2Score > m.team1Score).length, selectedMapCode);
                    if (rpInfo) {
                        console.log(rpInfo.winner + ' gained ' + rpInfo.winnerRPChange + ' RP');
                    }
                }
            }
        }

        runSimulationAsync();

        // ========== ДЛЯ CS2 - МГНОВЕННЫЙ ПОКАЗ РЕЗУЛЬТАТОВ ==========
        if (isCS2Mode()) {
            // Ждём завершения симуляции и сразу показываем результаты
            const checkInterval = setInterval(() => {
                if (simResults) {
                    clearInterval(checkInterval);
                    matchResults = simResults;
                    saveMatchToHistory(matchResults);
                    saveGlobalPlayerStats(matchResults);
                    displayMatchResults(matchResults);
                    switchScreen('results');
                    if (safeStorage.getItem('soundOnCompletion') === 'true') {
                        playCompletionSound();
                    }
                }
            }, 100);
            return;
        }

        // ========== ДЛЯ STANDOFF 2 - ВИДЕО-ПРОЛЁТКА ==========
        // Если пользователь выключил "пролетку", то сразу выводим результаты
        const isMapIntroEnabled = safeStorage.getItem('mapIntroEnabled') !== 'false';
        if (!isMapIntroEnabled) {
            matchResults = simResults;
            saveMatchToHistory(matchResults);
            saveGlobalPlayerStats(matchResults);
            displayMatchResults(matchResults);
            switchScreen('results');
            if (safeStorage.getItem('soundOnCompletion') === 'true') {
                playCompletionSound();
            }
            return;
        }

        const loadingPhrases = [
            '🗺️ Загружаемся на карту...',
            '🛡️ Покупаем броню...',
            '🔫 Выбираем оружие...',
            '💰 Считаем экономику...',
            '📡 Подключаемся к серверу...',
            '🎯 Калибруем прицелы...',
            '💣 Готовим бомбу...',
            '🧠 Анализируем тактику...',
            '⚡ Прогреваем пальцы...',
            '🏃 Выдвигаемся на позиции...',
            '🔍 Сканируем карту...',
            '🎮 Запускаем симуляцию...',
            '📊 Считаем раунды...',
            '💵 Считаем экономику команд...',
            '🎪 Готовим арену...',
            '🔧 Настраиваем графику...',
            '🎧 Проверяем микрофоны...',
            '📋 Изучаем стратегии...',
            '🎯 Прицеливаемся...',
            '💨 Разминаемся на deathmatch...',
            '🧹 Протираем мониторы...',
            '☕ Наливаем кофе...',
            '🍕 Заказываем пиццу...',
            '🎵 Включаем музыку...',
            '🧘 Медитируем перед матчем...',
            '💪 Качаем скилл...',
            '📺 Смотрим демки соперников...',
            '🤝 Обмениваемся рукопожатиями...',
            '🏋️ Разминка пальцев...',
            '🎮 Калибруем мышку...',
            '⌨️ Проверяем клавиатуру...',
            '🖱️ Настраиваем сенсу...',
            '🎨 Выбираем скины...',
            '🔥 Готовим молотов...',
            '💨 Дымовые гранаты наготове...',
            '💥 Флешки заряжены...',
            '🔫 Патроны пересчитаны...',
            '🛡️ Броня надета...',
            '🎒 Разгрузка застегнута...',
            '👟 Шнурки завязаны...',
            '🎭 Настраиваемся психологически...',
            '📢 Тренер дает установку...',
            '📊 Анализируем пики...',
            '🎲 Бросаем монетку на сторону...',
            '🌡️ Проверяем температуру в комнате...',
            '💺 Удобно устраиваемся в кресле...',
            '👀 Протираем очки...',
            '🎪 Настраиваем освещение...',
            '🌙 Выключаем свет для атмосферы...',
            '🎬 Режиссер дает команду...',
            '📹 Включаем камеры...',
            '🎤 Комментаторы готовятся...',
            '🏆 Готовим кубок...',
            '🎫 Билеты проданы...',
            '📱 Проверяем уведомления...',
            '🔋 Заряжаем устройства...',
            '💻 Обновляем драйвера...',
            '🔄 Перезагружаем роутер...',
            '📶 Усиливаем сигнал Wi-Fi...',
            '🔊 Настраиваем звук...',
            '🎚️ Балансируем частоты...',
            '🎛️ Калибруем эквалайзер...',
            '🎧 Протираем наушники...',
            '🧦 Надеваем тапочки...',
            '🥤 Открываем энергетик...',
            '🍬 Жуем жвачку для концентрации...',
            '🧠 Фокусируемся...',
            '💭 Визуализируем победу...',
            '🌟 Зовем удачу...',
            '🍀 Ищем четырехлистный клевер...',
            '🐈 Гладим кота для везения...',
            '🎲 Кидаем кубик...',
            '🎯 Целимся в топ-1...',
        ];

        // === СОЗДАЁМ ОВЕРЛЕЙ ===
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 99999;
            background: #000; overflow: hidden;
        `;

        // Видео-слой
        const videoEl = document.createElement('video');
        videoEl.muted = true;
        videoEl.playsInline = true;
        videoEl.volume = 0.25;
        videoEl.preload = 'auto';
        videoEl.style.cssText = `
            position: absolute; inset: 0; width: 100%; height: 100%;
            object-fit: cover; object-position: center;
            opacity: 0; transition: opacity 0.7s ease;
            display: block;
            image-rendering: auto;
            transform: translateZ(0) scale(1.001);
            will-change: opacity;
            -webkit-transform: translateZ(0) scale(1.001);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            filter: none;
            -webkit-filter: none;
        `;

        // Тёмный градиент снизу
        const gradient = document.createElement('div');
        gradient.style.cssText = `
            position: absolute; inset: 0; z-index: 1;
            background: linear-gradient(
                to bottom,
                rgba(0,0,0,0.15) 0%,
                rgba(0,0,0,0.0) 40%,
                rgba(0,0,0,0.5) 75%,
                rgba(0,0,0,0.85) 100%
            );
            pointer-events: none;
        `;

        // Название карты (интерлюдия)
        const mapTitleEl = document.createElement('div');
        mapTitleEl.style.cssText = `
            position: absolute; inset: 0; z-index: 2;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.6s ease;
            pointer-events: none;
        `;
        mapTitleEl.innerHTML = `
            <div id="ol-map-subtitle" style="font-family:'Montserrat',sans-serif; font-size:clamp(0.7rem,1.5vw,1rem); letter-spacing:0.3em; color:#ff6b00; text-transform:uppercase; font-weight:600; margin-bottom:12px;"></div>
            <div id="ol-map-name" style="font-family:'Montserrat',sans-serif; font-size:clamp(2rem,6vw,5rem); font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:0.08em; text-shadow: 0 4px 30px rgba(0,0,0,0.8);"></div>
        `;

        // Фразы загрузки
        const phraseEl = document.createElement('div');
        phraseEl.style.cssText = `
            position: absolute; bottom: 12%; left: 0; right: 0; z-index: 3;
            text-align: center;
            font-family: 'Montserrat', sans-serif;
            font-size: clamp(0.9rem, 2vw, 1.2rem);
            font-weight: 600; color: rgba(255,255,255,0.9);
            text-shadow: 0 2px 12px rgba(0,0,0,0.9);
            letter-spacing: 0.05em;
            transition: opacity 0.3s ease;
        `;
        phraseEl.textContent = loadingPhrases[0];

        // Прогресс-бар
        const progressWrap = document.createElement('div');
        progressWrap.style.cssText = `
            position: absolute; bottom: 7.5%; left: 50%; transform: translateX(-50%);
            width: min(420px, 72vw); height: 2px;
            background: rgba(255,255,255,0.12); border-radius: 2px; z-index: 3;
        `;
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `height:100%; width:0%; background:#ff6b00; border-radius:2px;`;
        progressWrap.appendChild(progressBar);

        // Финальный reveal
        const revealEl = document.createElement('div');
        revealEl.style.cssText = `
            position: absolute; inset: 0; z-index: 5;
            background: #000;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            opacity: 0; pointer-events: none;
            transition: opacity 0.9s ease;
            font-family: 'Montserrat', sans-serif;
            padding: 20px;
            box-sizing: border-box;
            overflow: hidden;
        `;
        revealEl.innerHTML = `
            <div style="
                width: 100%;
                max-width: 700px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0;
                text-align: center;
            ">
                <div style="
                    font-size: clamp(0.55rem, 2.5vw, 0.85rem);
                    letter-spacing: 0.25em;
                    color: #ff6b00;
                    text-transform: uppercase;
                    font-weight: 700;
                    margin-bottom: clamp(16px, 4vw, 36px);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                ">${tournamentName}</div>

                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: clamp(10px, 3vw, 40px);
                    width: 100%;
                ">
                    <div style="
                        flex: 1;
                        font-size: clamp(1.1rem, 4.5vw, 3rem);
                        font-weight: 900;
                        color: #fff;
                        text-transform: uppercase;
                        letter-spacing: 0.04em;
                        text-align: center;
                        line-height: 1.15;
                        word-break: break-word;
                        overflow-wrap: break-word;
                        hyphens: auto;
                    ">${t1Name}</div>

                    <div style="
                        flex-shrink: 0;
                        font-size: clamp(0.8rem, 2.5vw, 1.4rem);
                        color: #ff6b00;
                        font-weight: 900;
                        letter-spacing: 0.1em;
                        padding: 0 4px;
                    ">VS</div>

                    <div style="
                        flex: 1;
                        font-size: clamp(1.1rem, 4.5vw, 3rem);
                        font-weight: 900;
                        color: #fff;
                        text-transform: uppercase;
                        letter-spacing: 0.04em;
                        text-align: center;
                        line-height: 1.15;
                        word-break: break-word;
                        overflow-wrap: break-word;
                        hyphens: auto;
                    ">${t2Name}</div>
                </div>

                <div style="
                    width: clamp(40px, 15vw, 80px);
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #ff6b00, transparent);
                    margin: clamp(14px, 3.5vw, 28px) auto;
                    border-radius: 2px;
                "></div>

                <div style="
                    font-size: clamp(0.55rem, 1.8vw, 0.8rem);
                    color: rgba(255,255,255,0.4);
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    line-height: 1.8;
                    word-break: break-word;
                    max-width: 100%;
                ">
                    BO${bo} &nbsp;·&nbsp; ${formatLabel}
                    <br>
                    ${selectedMaps.join(' &nbsp;·&nbsp; ')}
                </div>
            </div>
            <div id="sim-thinking" style="margin-top: clamp(20px, 5vw, 40px); font-size: clamp(0.7rem, 1.8vw, 0.9rem); color: rgba(255,107,0,0.7); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;">
                Анализируем результаты<span id="sim-dots">...</span>
            </div>
        `;

        overlay.appendChild(videoEl);
        overlay.appendChild(gradient);
        overlay.appendChild(mapTitleEl);
        overlay.appendChild(phraseEl);
        overlay.appendChild(progressWrap);
        overlay.appendChild(revealEl);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // === ТАЙМИНГ ===
        const PER_MAP = 15000;
        const INTERLUDE = 2500;
        const REVEAL_DUR = 5000;
        const TOTAL = selectedMaps.length * (PER_MAP + INTERLUDE) + REVEAL_DUR;

        const startTime = Date.now();
        const progInterval = setInterval(() => {
            const p = Math.min(95, ((Date.now() - startTime) / (TOTAL - REVEAL_DUR)) * 95);
            progressBar.style.width = p + '%';
        }, 80);

        let phraseIdx = 0;
        const phraseInterval = setInterval(() => {
            phraseEl.style.opacity = '0';
            setTimeout(() => {
                phraseIdx = (phraseIdx + 1) % loadingPhrases.length;
                phraseEl.textContent = loadingPhrases[phraseIdx];
                phraseEl.style.opacity = '1';
            }, 300);
        }, 1500);

        function showMapVideo(index) {
            if (index >= selectedMaps.length) {
                showReveal();
                return;
            }

            const mapName = selectedMaps[index];
            const mapVideo = MAP_VIDEOS[mapName];
            const mapData = getMapData(mapName);

            document.getElementById('ol-map-subtitle').textContent = `Карта ${index + 1} из ${selectedMaps.length}`;
            document.getElementById('ol-map-name').textContent = mapName;

            videoEl.style.opacity = '0';
            videoEl.pause();
            overlay.style.background = '#000000';
            mapTitleEl.style.opacity = '1';

            if (mapVideo) {
                videoEl.src = mapVideo.src;
                videoEl.load();
            }

            setTimeout(() => {
                mapTitleEl.style.opacity = '0';
                overlay.style.background = `url('${mapData.image}') center/cover no-repeat #000`;

                if (mapVideo) {
                    let videoShown = false;

                    const tryShowVideo = () => {
                        if (videoShown) return;
                        videoShown = true;
                        const duration = videoEl.duration && isFinite(videoEl.duration) ? videoEl.duration : 60;
                        const minStart = 10;
                        const maxStart = Math.max(minStart + 1, duration - 15);
                        videoEl.currentTime = minStart + Math.random() * (maxStart - minStart);
                        videoEl.muted = true;
                        videoEl.play().then(() => {
                            overlay.style.background = '#000';
                            videoEl.style.opacity = '1';
                            setTimeout(() => { if (!videoEl.paused) videoEl.muted = false; }, 500);
                        }).catch(() => {
                            videoEl.style.opacity = '0';
                        });
                    };

                    videoEl.onloadeddata = tryShowVideo;
                    videoEl.oncanplay = tryShowVideo;
                    videoEl.onerror = () => { videoEl.style.opacity = '0'; };

                    if (videoEl.readyState >= 2) {
                        tryShowVideo();
                    }

                    var videoFallback = setTimeout(tryShowVideo, 3000);
                }

                setTimeout(() => {
                    if (typeof videoFallback !== 'undefined') clearTimeout(videoFallback);
                    videoEl.onloadeddata = null;
                    videoEl.oncanplay = null;
                    videoEl.onerror = null;
                    if (!videoEl.paused) {
                        const fadeAudio = setInterval(() => {
                            if (videoEl.volume > 0.02) videoEl.volume -= 0.03;
                            else { clearInterval(fadeAudio); videoEl.pause(); }
                        }, 60);
                    }
                    showMapVideo(index + 1);
                }, PER_MAP);

            }, INTERLUDE);
        }

        function showReveal() {
            clearInterval(phraseInterval);
            clearInterval(progInterval);
            phraseEl.style.opacity = '0';
            progressBar.style.width = '100%';

            videoEl.style.transition = 'opacity 1s ease';
            videoEl.style.opacity = '0';
            if (!videoEl.paused) {
                const fadeAudio = setInterval(() => {
                    if (videoEl.volume > 0.02) videoEl.volume -= 0.04;
                    else { clearInterval(fadeAudio); videoEl.pause(); }
                }, 60);
            }

            setTimeout(() => {
                revealEl.style.opacity = '1';
            }, 500);

            let dotCount = 0;
            const dotsInterval = setInterval(() => {
                dotCount = (dotCount + 1) % 4;
                const dotsEl = document.getElementById('sim-dots');
                if (dotsEl) dotsEl.textContent = '.'.repeat(dotCount) || '';
            }, 400);

            const revealStart = Date.now();
            const waitForSim = setInterval(() => {
                if (!simResults) return;
                clearInterval(waitForSim);
                clearInterval(dotsInterval);

                const thinkingEl = document.getElementById('sim-thinking');
                if (thinkingEl) thinkingEl.style.opacity = '0';

                const elapsed = Date.now() - revealStart;
                const remaining = Math.max(800, REVEAL_DUR - elapsed);

                setTimeout(() => {
                    matchResults = simResults;
                    saveMatchToHistory(matchResults);
                    saveGlobalPlayerStats(matchResults);
                    displayMatchResults(matchResults);

                    overlay.style.transition = 'opacity 0.5s ease';
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        overlay.remove();
                        document.body.style.overflow = '';
                        switchScreen('results');
                        if (safeStorage.getItem('soundOnCompletion') === 'true') {
                            playCompletionSound();
                        }
                    }, 500);
                }, remaining);
            }, 100);
        }

        showMapVideo(0);
        } // end of runMatch function
    }

    function playCompletionSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) {}
    }

        // Стрим-режим удалён — оставляем только стандартный результат и сравнение.
function saveMatchToHistory(results) {
        results.gameMode = isCS2Mode() ? 'cs2' : 's2'; // метка режима
        try {
            var history = JSON.parse(safeStorage.getItem('matchHistory') || '[]');
            // Сохраняем полный объект результатов, но без roundComments/roundData (экономия памяти)
            var entry = {
                id: Date.now(),
                date: new Date().toISOString(),
                gameMode: results.gameMode,
                tournamentName: results.tournamentName,
                format: results.format,
                bo: results.bo,
                plannedMaps: (results.plannedMaps || []).slice(),
                team1Name: results.team1Name,
                team2Name: results.team2Name,
                team1Score: results.team1Score,
                team2Score: results.team2Score,
                isPractice: safeStorage.getItem('practiceMatchEnabled') === 'true',
                mvp: results.mvp ? {
                    nickname: results.mvp.nickname,
                    kills: results.mvp.kills,
                    deaths: results.mvp.deaths,
                    kd: results.mvp.kd,
                    hltvRating: results.mvp.hltvRating
                } : null,
                mvpNickname: results.mvp ? results.mvp.nickname : null,
                // Статистика игроков серии
                team1Stats: (results.team1Stats || []).map(function(p) {
                    return { nickname: p.nickname, role: p.role, kills: p.kills, deaths: p.deaths,
                        assists: p.assists||0, kd: p.kd, kpr: p.kpr, dpr: p.dpr, adr: p.adr,
                        hltvRating: p.hltvRating, totalRounds: p.totalRounds };
                }),
                team2Stats: (results.team2Stats || []).map(function(p) {
                    return { nickname: p.nickname, role: p.role, kills: p.kills, deaths: p.deaths,
                        assists: p.assists||0, kd: p.kd, kpr: p.kpr, dpr: p.dpr, adr: p.adr,
                        hltvRating: p.hltvRating, totalRounds: p.totalRounds };
                }),
                // Карты с подробной статистикой и данными раундов (для стрима)
                maps: (results.maps || []).map(function(m) {
                    return {
                        mapName: m.mapName,
                        team1Score: m.team1Score,
                        team2Score: m.team2Score,
                        mvp: m.mvp ? { nickname: m.mvp.nickname, kills: m.mvp.kills, deaths: m.mvp.deaths, kd: m.mvp.kd, hltvRating: m.mvp.hltvRating } : null,
                        team1Stats: (m.team1Stats || []).map(function(p) {
                            return { nickname: p.nickname, role: p.role, kills: p.kills, deaths: p.deaths,
                                assists: p.assists||0, kd: p.kd, kpr: p.kpr, dpr: p.dpr, adr: p.adr, hltvRating: p.hltvRating };
                        }),
                        team2Stats: (m.team2Stats || []).map(function(p) {
                            return { nickname: p.nickname, role: p.role, kills: p.kills, deaths: p.deaths,
                                assists: p.assists||0, kd: p.kd, kpr: p.kpr, dpr: p.dpr, adr: p.adr, hltvRating: p.hltvRating };
                        }),
                        // roundData для стрима (небольшой массив ~24 записи)
                        roundData: (m.roundData || []).map(function(rd) {
                            return { round: rd.round, t1Score: rd.t1Score, t2Score: rd.t2Score, winner: rd.winner, t1Buy: rd.t1Buy, t2Buy: rd.t2Buy };
                        }),
                        // roundComments для стрима
                        roundComments: m.roundComments || []
                    };
                })
            };
            // Keep extended history (prune only when extremely large)
            history.push(entry);
            if (history.length > 2000) history = history.slice(-2000);
            safeStorage.setItem('matchHistory', JSON.stringify(history));
        } catch (e) { }
    }

    function simulateMatchSeries(team1, team2, maps, format, bo, tournamentName) {
        const roundTarget = format === 'mr9' ? 10 : (format === 'mr12' ? 13 : 16);
        const maxRounds = format === 'mr9' ? 19 : (format === 'mr12' ? 24 : 31);

        const results = {
            tournamentName,
            format: format === 'mr9' ? 'MR9' : (format === 'mr12' ? 'MR12' : 'MR15'),
            bo,
            plannedMaps: maps.slice(),
            team1Name: team1NameInput.value || 'TEAM 1',
            team2Name: team2NameInput.value || 'TEAM 2',
            team1Score: 0,
            team2Score: 0,
            maps: [],
            team1Stats: [],
            team2Stats: []
        };

        team1.forEach((player, index) => {
            results.team1Stats.push({
                nickname: player.nickname || `Player${index + 1}`,
                rating: normalizeRating(player.rating !== null ? player.rating : 50),
                inputRating: player.rating,
                role: player.role,
                kills: 0,
                deaths: 0,
                assists: 0,
                kd: 0,
                totalRounds: 0
            });
        });
        team2.forEach((player, index) => {
            results.team2Stats.push({
                nickname: player.nickname || `Enemy${index + 1}`,
                rating: normalizeRating(player.rating !== null ? player.rating : 50),
                inputRating: player.rating,
                role: player.role,
                kills: 0,
                deaths: 0,
                assists: 0,
                kd: 0,
                totalRounds: 0
            });
        });

        let team1Wins = 0, team2Wins = 0;
        const winsNeeded = bo === 5 ? 3 : (bo === 3 ? 2 : (bo === 2 ? 2 : 1));

        for (let i = 0; i < maps.length; i++) {
            const mapName = maps[i];
            // Определяем, является ли карта лучшей для какой-либо команды
            const isTeam1Best = (team1BestMapSelect.value === mapName);
            const isTeam2Best = (team2BestMapSelect.value === mapName);
            const team1Name = team1NameInput.value || 'TEAM 1';
            const team2Name = team2NameInput.value || 'TEAM 2';
            const mapResult = simulateMap(team1, team2, mapName, roundTarget, maxRounds, format, isTeam1Best, isTeam2Best, team1Name, team2Name);
            results.maps.push(mapResult);

            if (mapResult.winner === 1) team1Wins++;
            else if (mapResult.winner === 2) team2Wins++;

            results.team1Score = team1Wins;
            results.team2Score = team2Wins;

            const mapRounds = mapResult.team1Score + mapResult.team2Score;
            mapResult.team1Stats.forEach((stat, idx) => {
                results.team1Stats[idx].kills += stat.kills;
                results.team1Stats[idx].deaths += stat.deaths;
                results.team1Stats[idx].assists = (results.team1Stats[idx].assists || 0) + (stat.assists || 0);
                results.team1Stats[idx].totalRounds = (results.team1Stats[idx].totalRounds || 0) + mapRounds;
                results.team1Stats[idx].roundsWon = (results.team1Stats[idx].roundsWon || 0) + mapResult.team1Score;
            });
            mapResult.team2Stats.forEach((stat, idx) => {
                results.team2Stats[idx].kills += stat.kills;
                results.team2Stats[idx].deaths += stat.deaths;
                results.team2Stats[idx].assists = (results.team2Stats[idx].assists || 0) + (stat.assists || 0);
                results.team2Stats[idx].totalRounds = (results.team2Stats[idx].totalRounds || 0) + mapRounds;
                results.team2Stats[idx].roundsWon = (results.team2Stats[idx].roundsWon || 0) + mapResult.team2Score;
            });

            if (bo !== 2 && (team1Wins >= winsNeeded || team2Wins >= winsNeeded)) {
                break;
            }
        }

        syncSeriesStatsFromMaps(results);
        finalizeTeamPlayerStats(results.team1Stats);
        finalizeTeamPlayerStats(results.team2Stats);

        const allPlayers = [...results.team1Stats, ...results.team2Stats];
        let mvp = null, bestScore = -1;
        allPlayers.forEach(player => {
            const kd = parseFloat(player.kd) || 0;
            const rating = player.rating;
            const kills = player.kills;
            const deaths = player.deaths;
            const kdScore = Math.min(kd, 3.0);
            const killsScore = Math.min(kills / 25, 1.0);
            const survivalScore = deaths > 0 ? 1 / (1 + deaths/20) : 1.0;
            const ratingScore = rating / 100;
            const score = (kdScore * 0.4) + (killsScore * 0.3) + (survivalScore * 0.2) + (ratingScore * 0.1);
            if (score > bestScore) {
                bestScore = score;
                mvp = player;
            }
        });
        results.mvp = mvp;

        results.maps.forEach(map => {
            const mapPlayers = [...map.team1Stats, ...map.team2Stats];
            let mapMVP = null, mapBestScore = -1;
            mapPlayers.forEach(player => {
                const score = player.kills * 2 - player.deaths;
                if (score > mapBestScore) {
                    mapBestScore = score;
                    mapMVP = player;
                }
            });
            map.mvp = mapMVP;
        });

        return results;
    }

    function getCoach(teamId) {
        const nickEl = document.getElementById(`team${teamId}CoachNick`);
        const ratingEl = document.getElementById(`team${teamId}CoachRating`);
        if (!nickEl || !ratingEl) return null;
        const rating = ratingEl.value.trim() === '' ? null : parseFloat(ratingEl.value);
        return { nickname: nickEl.value.trim(), rating: isNaN(rating) ? null : Math.min(200, Math.max(0, rating)) };
    }

    function getTeamplay(teamId) {
        const el = document.getElementById(`team${teamId}Teamplay`);
        if (!el) return 50;
        const v = parseInt(el.value);
        return isNaN(v) ? 50 : Math.min(100, Math.max(0, v));
    }
function getBuyType(money, roundNum, lostLast, pistolWinner, isPistolWinner) {
    if (roundNum <= 1) return 'pistol';

    if (isCS2Mode()) {
        // CS2: пороги по реальным ценам CS2
        if (roundNum === 2) {
            if (isPistolWinner) {
                if (money >= 5000) return 'full';
                if (money >= 3600) return 'half';
                if (money >= 1000) return 'force';
                return 'eco';
            } else {
                if (money >= 3600) return 'half';
                if (money >= 1800) return 'force';
                return 'eco';
            }
        }
        if (money < 1800) return 'eco';
        if (lostLast && money < 2600) return 'eco';
        if (money < 3500) return 'force';
        if (money < 5000) return 'half';
        return 'full';
    }

    // ========== Standoff 2 ==========
    if (roundNum === 2) {
        if (isPistolWinner) {
            if (money >= 3600) return 'full';
            if (money >= 2600) return 'half';
            if (money >= 1000) return 'force';
            return 'eco';
        } else {
            if (money >= 2600) return 'half';
            if (money >= 1600) return 'force';
            return 'eco';
        }
    }
    if (money < 1300) return 'eco';
    if (lostLast && money < 2100) return 'eco';
    if (money < 2600) return 'force';
    if (money < 3600) return 'half';
    return 'full';
}

    const TEAM_PLAYERS = 5;
    const BUY_POWER = { pistol: 0.78, eco: 0.66, force: 0.82, half: 0.9, full: 1.0 };
    function getBuyPower(buyType) {
        return BUY_POWER[buyType] != null ? BUY_POWER[buyType] : 0.84;
    }

    function toTeamMoney(perPlayerAmount) {
        return Math.max(0, Math.round((perPlayerAmount || 0) * TEAM_PLAYERS));
    }

    function getLossBonusForStreak(streak, rewards) {
        if (streak >= 4) return rewards.lose4 || rewards.lose3 || rewards.lose2 || rewards.lose;
        if (streak === 3) return rewards.lose3 || rewards.lose2 || rewards.lose;
        if (streak === 2) return rewards.lose2 || rewards.lose;
        return rewards.lose;
    }

    function capTeamMoney(money) {
        const capPerPlayer = isCS2Mode() ? 16000 : 12000;
        const cap = capPerPlayer * TEAM_PLAYERS;
        return Math.max(0, Math.min(cap, money));
    }

    function applyRoundEconomy(winnerMoney, loserMoney, loserStreak, rewards) {
        const winnerIncome = toTeamMoney(rewards.win);
        const loserIncome = toTeamMoney(getLossBonusForStreak(loserStreak, rewards));
        return {
            winnerMoney: capTeamMoney(winnerMoney + winnerIncome),
            loserMoney: capTeamMoney(loserMoney + loserIncome)
        };
    }

    function computeRoundWinChance(params) {
        const ratingDiff = params.ratingDiff || 0;
        const peakDiff = params.peakDiff || 0;
        const teamplayDiff = params.teamplayDiff || 0;
        const avgTeamplay = params.avgTeamplay || 50;
        const momentumDiff = params.momentumDiff || 0;
        const buyDiff = params.buyDiff || 0;
        const streakPenalty = params.streakPenalty || 0;
        const roundMod = params.roundMod || 0;
        const scoreDiff = params.scoreDiff || 0;
        const techDebuff = !!params.techDebuff;
        const isOvertime = !!params.isOvertime;
        const clampedScoreDiff = Math.max(-8, Math.min(8, scoreDiff));
        const comebackEdge = -clampedScoreDiff * (isOvertime ? 0.008 : 0.012);

        const structuredEdge =
            ratingDiff * 1.25 +       // rating influence усилен
            peakDiff * 0.04 +         // peak performance still secondary
            teamplayDiff * 0.06 +     // teamplay impact grows
            momentumDiff * 0.022 +
            buyDiff * 0.08 +
            roundMod * 0.7 -
            streakPenalty * 0.55 +
            comebackEdge;

        const debuffedEdge = techDebuff ? structuredEdge * 0.90 : structuredEdge;
        const teamplayStability = 1 - Math.max(0, Math.min(1, (avgTeamplay - 50) / 50)) * 0.25;
        const randomRangeBase = (isOvertime ? 0.015 : 0.01) + (techDebuff ? 0.01 : 0);
        const randomRange = randomRangeBase * teamplayStability;
        const randomPart = (Math.random() - 0.5) * 2 * randomRange;
        const minChance = isOvertime ? 0.28 : 0.26;
        const maxChance = isOvertime ? 0.72 : 0.74;

        return Math.max(minChance, Math.min(maxChance, 0.5 + debuffedEdge + randomPart));
    }

    function stepRoundModifiers(mods) {
        const active = { t1: mods.t1 || 0, t2: mods.t2 || 0, techDebuff: (mods.techDebuffRounds || 0) > 0 };
        mods.t1 = Math.abs(mods.t1 || 0) < 0.01 ? 0 : (mods.t1 || 0) * 0.45;
        mods.t2 = Math.abs(mods.t2 || 0) < 0.01 ? 0 : (mods.t2 || 0) * 0.45;
        if (mods.techDebuffRounds > 0) mods.techDebuffRounds--;
        return active;
    }

    function applyPauseImpact(pauseResult, mods, team1Name, team2Name, teamplay1 = 50, teamplay2 = 50) {
        if (!pauseResult || pauseResult.lines.length === 0) return [];
        if (pauseResult.isTech) {
            mods.techDebuffRounds = Math.max(mods.techDebuffRounds || 0, 2);
            mods.t1 = (mods.t1 || 0) - 0.02;
            mods.t2 = (mods.t2 || 0) - 0.02;
            return ['  🧊 После техпаузы обе команды входят в игру медленнее: точность и темп временно просели.'];
        }

        const boostTeamplay = pauseResult.pauseTeam === 1 ? teamplay1 : teamplay2;
        const opponentTeamplay = pauseResult.pauseTeam === 1 ? teamplay2 : teamplay1;
        const tacticalBoost = 0.08 + Math.max(0, Math.min(0.04, (boostTeamplay - 50) / 100));
        const opponentSlip = -0.04 - Math.max(0, Math.min(0.03, (opponentTeamplay - 50) / 100));

        if (pauseResult.pauseTeam === 1) {
            mods.t1 = (mods.t1 || 0) + tacticalBoost;
            mods.t2 = (mods.t2 || 0) + opponentSlip;
            return [`  💡 ${team1Name} получили тактический буст, а ${team2Name} временно теряют ритм.`];
        } else if (pauseResult.pauseTeam === 2) {
            mods.t2 = (mods.t2 || 0) + tacticalBoost;
            mods.t1 = (mods.t1 || 0) + opponentSlip;
            return [`  💡 ${team2Name} получили тактический буст, а ${team1Name} временно теряют ритм.`];
        }
        return [];
    }

    function describePauseImpact(pauseResult, team1Name, team2Name) {
        if (!pauseResult || pauseResult.lines.length === 0) return [];
        if (pauseResult.isTech) {
            return ['  🧊 После техпаузы обе команды входят в игру медленнее: точность и темп временно просели.'];
        }
        if (pauseResult.pauseTeam === 1) {
            return [`  💡 ${team1Name} получили тактический буст, а ${team2Name} временно теряют ритм.`];
        }
        if (pauseResult.pauseTeam === 2) {
            return [`  💡 ${team2Name} получили тактический буст, а ${team1Name} временно теряют ритм.`];
        }
        return [];
    }


    // ================= ИИ-ТРЕНЕР (DeepSeek) =================
    // Ключ хранится в JSONBin рядом со статистикой, подгружается один раз при старте
    let _deepSeekKeyCache = null;
    let _deepSeekKeyFetched = false;

    async function getDeepSeekKey() {
        if (_deepSeekKeyFetched) return _deepSeekKeyCache;
        _deepSeekKeyFetched = true;
        try {
            const ak  = safeStorage.getItem('cloud_access_key') || '';
            const bid = safeStorage.getItem('cloud_bin_id') || '';
            if (!ak || !bid) return null;
            const resp = await fetch(
                `/.netlify/functions/deepseek-key?ak=${encodeURIComponent(ak)}&bid=${encodeURIComponent(bid)}`,
                { cache: 'no-store' }
            );
            if (!resp.ok) return null;
            const data = await resp.json();
            _deepSeekKeyCache = (data && data.key && data.key.trim()) ? data.key.trim() : null;
        } catch (e) {
            _deepSeekKeyCache = null;
        }
        return _deepSeekKeyCache;
    }

    // Прогреваем ключ заранее (не блокируя UI)
    getDeepSeekKey();

    // Асинхронный вызов DeepSeek API. Возвращает строку или null при ошибке.
    async function callDeepSeek(systemPrompt, userPrompt) {
        const apiKey = await getDeepSeekKey();
        if (!apiKey) return null;
        try {
            const resp = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    max_tokens: 220,
                    temperature: 0.85,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ]
                })
            });
            if (!resp.ok) return null;
            const data = await resp.json();
            return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || null;
        } catch (e) {
            return null;
        }
    }

    // Определяет "тренера" команды: тренер если есть, иначе капитан (роль captain/captain_sniper)
    function getCoachOrCaptain(teamId, teamPlayers) {
        const coach = getCoach(teamId);
        if (coach && coach.nickname && coach.nickname.trim() !== '') {
            return { name: coach.nickname.trim(), isCaptain: false };
        }
        const cap = teamPlayers.find(p => p.role === 'captain' || p.role === 'captain_sniper');
        if (cap && cap.nickname && cap.nickname.trim() !== '') {
            return { name: cap.nickname.trim(), isCaptain: true };
        }
        const first = teamPlayers.find(p => p.nickname && p.nickname.trim() !== '');
        return first ? { name: first.nickname.trim(), isCaptain: true } : null;
    }

    // Формирует коллы для тактической паузы
    async function generatePauseCoachCall(params) {
        const { callerTeamId, callerTeamPlayers, opponentPlayers, callerTeamName, opponentTeamName,
                callerScore, opponentScore, mapName, roundNum, loseStreak } = params;

        const caller = getCoachOrCaptain(callerTeamId, callerTeamPlayers);
        if (!caller) return null;

        const role = caller.isCaptain ? 'капитан команды' : 'тренер команды';
        const playerList = callerTeamPlayers.map(p => `${p.nickname || '?'} (${p.role})`).join(', ');
        const oppList = opponentPlayers.map(p => `${p.nickname || '?'} (${p.role})`).join(', ');

        const system = `Ты ${role} ${callerTeamName} в тактической игре Standoff 2 (CS-like шутер).
Пиши ТОЛЬКО тактические коллы — коротко, по-русски, 2-4 предложения максимум.
Никаких вступлений, никакого описания себя. Только суть — что делать прямо сейчас.
Используй реальный игровой сленг: A/B сайт, ротация, флэш, смоук, дроп, пуш, ретейк, пики.`;

        const user = `Карта: ${mapName}. Раунд ${roundNum}. Счёт: ${callerTeamName} ${callerScore} — ${opponentTeamName} ${opponentScore}.
Мы проигрываем ${loseStreak} раундов подряд. Взяли паузу.
Наш состав: ${playerList}.
Противник: ${oppList}.
Дай конкретный тактический колл — что меняем прямо сейчас.`;

        const raw = await callDeepSeek(system, user);
        if (!raw) return null;
        return { callerName: caller.name, isCaptain: caller.isCaptain, text: raw.trim() };
    }

    // Анализ итогов матча
    async function generatePostMatchAnalysis(results) {
        const apiKey = await getDeepSeekKey();
        if (!apiKey) return null;
        const { team1Name, team2Name, team1Score, team2Score, team1Stats, team2Stats, maps } = results;
        const fmtPlayer = (p) => `${p.nickname}: KD ${p.kd}, ADR ${p.adr}, Rating ${p.hltvRating}`;
        const t1str = (team1Stats || []).map(fmtPlayer).join(' | ');
        const t2str = (team2Stats || []).map(fmtPlayer).join(' | ');
        const mapsStr = (maps || []).map(m => `${m.mapName} ${m.team1Score}:${m.team2Score}`).join(', ');
        const winner = team1Score > team2Score ? team1Name : team2Name;

        const system = `Ты аналитик киберспортивного матча Standoff 2.
Пиши по-русски, кратко — 3-5 предложений. Без вступлений. Только конкретный разбор.
Укажи слабое звено проигравшей команды, что решило исход, и один конкретный совет проигравшим.`;

        const user = `Матч: ${team1Name} ${team1Score} — ${team2Score} ${team2Name}. Победил ${winner}.
Карты: ${mapsStr}.
${team1Name}: ${t1str}.
${team2Name}: ${t2str}.`;

        const raw = await callDeepSeek(system, user);
        return raw ? raw.trim() : null;
    }

    window._aiGeneratePostMatch = generatePostMatchAnalysis;
    window._aiGeneratePauseCall = generatePauseCoachCall;

    function getWeaponForBuy(buyType, playerRole, money, isT) {
        if (isCS2Mode()) {
            if (buyType === 'pistol') return 'pistol';
            if (buyType === 'eco') {
                const pool = ['pistol','pistol','p250','deagle','nova'];
                return pool[Math.floor(Math.random() * pool.length)];
            }
            if (buyType === 'force') {
                const poolT  = ['mac10','mac10','galil','p250','deagle'];
                const poolCT = ['mp9','mp5sd','ump','famas','deagle'];
                const p = isT ? poolT : poolCT;
                return p[Math.floor(Math.random() * p.length)];
            }
            if (buyType === 'half') {
                return isT ? (Math.random()<0.7?'galil':'ak47') : (Math.random()<0.7?'famas':'m4a4');
            }
            if (buyType === 'full') {
                if (playerRole === 'sniper' || playerRole === 'captain_sniper')
                    return money >= 4750 ? 'awp' : 'ssg';
                return isT ? 'ak47' : (Math.random() < 0.5 ? 'm4a4' : 'm4a1s');
            }
            return isT ? 'ak47' : 'm4a4';
        }

        // Standoff 2 оригинал
        if (buyType === 'pistol') return 'pistol';
        if (buyType === 'eco') {
            const ecoWeapons = ['pistol','pistol','pistol','shotgun','mac10','mp5'];
            return ecoWeapons[Math.floor(Math.random() * ecoWeapons.length)];
        }
        if (buyType === 'force') {
            const forceWeapons = ['shotgun','smg','mac10','mp5','pistol'];
            return forceWeapons[Math.floor(Math.random() * forceWeapons.length)];
        }
        if (buyType === 'half') {
            const halfWeapons = ['rifle','fnfal','smg'];
            return halfWeapons[Math.floor(Math.random() * halfWeapons.length)];
        }
        if (buyType === 'full') {
            if (playerRole === 'sniper' || playerRole === 'captain_sniper')
                return money >= 3500 ? 'awm' : 'rifle';
            if (playerRole === 'rifler' || playerRole === 'opener' ||
                playerRole === 'support' || playerRole === 'lurker') {
                return Math.random() < 0.6 ? 'rifle' : 'fnfal';
            }
            if (playerRole === 'captain') {
                if (money >= 3500 && Math.random() < 0.2) return 'awm';
                return Math.random() < 0.6 ? 'rifle' : 'fnfal';
            }
            return 'rifle';
        }
        return 'rifle';
    }

    const KILL_VERBS_WIN = [
        'убивает', 'сносит', 'выносит', 'снимает', 'кладёт', 'валит', 'дырявит', 'вскрывает', 'укладывает'
    ];
    const KILL_VERBS_LOSE = [
        'убивает', 'снимает', 'выносит', 'кладёт', 'валит'
    ];

    // Оружийные комбо для конкретных ситуаций
    const WEAPON_PREFIXES = {
        'awm': ['Снайпер!', 'АВМ!', 'Со снайперки —', 'Снайперский выстрел —'],
        'pistol': ['С пистолета —', 'Пистолет работает —', ''],
        'shotgun': ['С дробовика —', 'Дробовик —', ''],
    };

    // Суффиксы убийств — с учётом оружия
    function getKillSuffix(weapon, isWinner) {
        const awmSuffixes = [' — one shot!', ' — чистый хэдшот!', ' — выстрел в голову!', ' — снайперский хэдшот!'];
        const generalSuffixes = [
            '', '', '', '',
            ' — headshot!', ' — headshot!',
            ' — через дым!',
            ' с пика!',
            ' — флик шот!',
            ' — красивый выстрел!',
            ' с контрпика!',
        ];
        if (weapon === 'awm') return awmSuffixes[Math.floor(Math.random() * awmSuffixes.length)];
        return generalSuffixes[Math.floor(Math.random() * generalSuffixes.length)];
    }

    // Комментаторские фразы для разных ситуаций
    const CASTER_ROUND_START = [
        'Обе команды выдвигаются — посмотрим кто первым навяжет контакт.',
        'Раунд пошёл. Тактика покажет себя в ближайшие секунды.',
        'Стартуем. Смотрим на расстановку.',
        'Команды расходятся по позициям.',
        'Раунд начался — всё решится в ближайшую минуту-полторы.',
        'Обе пятёрки в движении. Кто первым вскроет противника?',
        'Тишина перед бурей — обе стороны ищут информацию.',
    ];
    const CASTER_WIN_CLEAN = [
        'Чисто! {W} берут раунд без потерь.',
        'Идеальный раунд для {W} — ноль смертей.',
        'Без вопросов. {W} доминируют.',
        '{W} не оставляют шансов — сухой раунд.',
        'Подавляющая победа {W} в этом раунде.',
    ];
    const CASTER_PISTOL_WIN = [
        'Пистол за {W}! Огромный финансовый и психологический задел на старте.',
        '{W} забирают пистольный — следующие два раунда у них в кармане.',
        'Первая кровь в пистоле за {W}. Отличный старт!',
        '{W} контролируют пистол-раунд. Экономика сразу в их пользу.',
    ];
    const CASTER_HALFTIME = [
        '⏸️ Перерыв. Команды уходят на смену сторон — тренеры раздают установки.',
        '⏸️ Половина карты позади. Главный вопрос — кто лучше адаптируется?',
        '⏸️ Смена сторон. Посмотрим что изменят тренеры в тактическом плане.',
        '⏸️ Перерыв на смену сторон. Вторая половина покажет характер команд.',
    ];
    const CASTER_OT_START = [
        '🔥 ОВЕРТАЙМ! Основное время не выявило победителя!',
        '🔥 ДОПЫ! Обе команды идут до конца — нервы у всех на пределе.',
        '🔥 Равный счёт — уходим в овертайм! Это будет жарко.',
        '🔥 ОВЕРТАЙМ! Ни одна из команд не намерена сдаваться.',
    ];

    function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function fill(str, w, l) { return str.replace(/{W}/g, w).replace(/{L}/g, l); }

    function buildRoundCommentary(roundNum, team1Wins, t1Buy, t2Buy, events, mapResult, team1Name, team2Name, econ, currentScore, team1Data, team2Data, t1Money, t2Money, t1MoneyAfter, t2MoneyAfter, pauseLines) {
        const lines = [];
        const winName = team1Wins ? team1Name : team2Name;
        const loseName = team1Wins ? team2Name : team1Name;
        const winBuy = team1Wins ? t1Buy : t2Buy;
        const loseBuy = team1Wins ? t2Buy : t1Buy;
        const winStats  = team1Wins ? mapResult.team1Stats : mapResult.team2Stats;
        const loseStats = team1Wins ? mapResult.team2Stats : mapResult.team1Stats;
        const winTeamData  = team1Wins ? team1Data : team2Data;
        const loseTeamData = team1Wins ? team2Data : team1Data;
        const winEvents  = (team1Wins ? events.t1Kills : events.t2Kills) || [];
        const loseEvents = (team1Wins ? events.t2Kills : events.t1Kills) || [];
        const winMoney  = team1Wins ? t1Money : t2Money;
        const loseMoney = team1Wins ? t2Money : t1Money;

        // ── ПАУЗЫ идут ПЕРЕД заголовком раунда ──
        if (pauseLines && pauseLines.length > 0) {
            lines.push('');
            pauseLines.forEach(l => lines.push(l));
            lines.push('');
        }

        // ── ЗАГОЛОВОК ──
        const score = currentScore ? `[${currentScore.team1}:${currentScore.team2}]` : '';
        lines.push(`━━━ Раунд ${roundNum} ${score} ━━━`);
        lines.push(`  ${team1Name}: ${getBuyNames()[t1Buy] || t1Buy}   |   ${team2Name}: ${getBuyNames()[t2Buy] || t2Buy}`);
        lines.push(`  💬 ${rnd(CASTER_ROUND_START)}`);

        // Пистол-раунд
        if (roundNum === 1) {
            lines.push(`  🔫 ${fill(rnd(CASTER_PISTOL_WIN), winName, loseName)}`);
        }

        // ── FIRST BLOOD ──
        const allEvs = [
            ...winEvents.map(e => ({ ...e, isWin: true })),
            ...loseEvents.map(e => ({ ...e, isWin: false }))
        ];
        if (allEvs.length > 0) {
            const fe = allEvs[0];
            const fbK = fe.isWin ? (winStats[fe.killerIndex]?.nickname || '?') : (loseStats[fe.killerIndex]?.nickname || '?');
            const fbV = fe.isWin ? (loseStats[fe.victimIndex]?.nickname || '?') : (winStats[fe.victimIndex]?.nickname || '?');
            const fbPhrases = [
                `${fbK} вскрывает счёт — ${fbV} первым падает на землю.`,
                `FIRST BLOOD! ${fbK} открывает фраги. ${fbV} не успел среагировать.`,
                `${fbK} — first blood! Начало положено.`,
                `Первая кровь за ${fbK}: ${fbV} получает пулю первым.`,
                `${fbK} выходит первым — ${fbV} упал на открытии.`,
            ];
            lines.push(`  🩸 ${rnd(fbPhrases)}`);
        }

        // ── БОМБА ──
        const isTside = !team1Wins; // T-side выигрывает → бомба чаще
        const bombChance = team1Wins ? 0.4 : 0.72;
        const bombPlanted = Math.random() < bombChance;
        const plantSite = bombPlanted ? (Math.random() < 0.5 ? 'A' : 'B') : null;
        const planterIdx = bombPlanted ? Math.floor(Math.random() * Math.max(winStats.length, 1)) : -1;
        if (bombPlanted) {
            const planterName = winStats[planterIdx]?.nickname || '?';
            const plantPhrases = [
                `${planterName} кладёт бомбу на ${plantSite}! Таймер пошёл — CT нужно реагировать.`,
                `Плант на ${plantSite}! ${planterName} устанавливает взрывчатку, время идёт.`,
                `Бомба на ${plantSite} от ${planterName}. CT нужно срочно вскрывать позиции.`,
                `${planterName} — плант на ${plantSite}! Давление нарастает.`,
            ];
            lines.push(`  💣 ${rnd(plantPhrases)}`);
        }

        // ── КИЛЫ — основная лента ──
        // Считаем уникальных киллеров победившей команды
        const winKillCount = {};
        winEvents.forEach(e => { winKillCount[e.killerIndex] = (winKillCount[e.killerIndex] || 0) + 1; });

        function buildKillLine(killerName, victimName, weapon, isWinner) {
            const verb = rnd(isWinner ? KILL_VERBS_WIN : KILL_VERBS_LOSE);
            const suffix = getKillSuffix(weapon, isWinner);
            return `  🔫 ${killerName} ${verb} ${victimName} [${getWeaponDisplayName(weapon, isWinner, roundNum)}]${suffix}`;
        }

        // Перемешиваем евенты в хронологическом порядке
        winEvents.forEach(e => {
            const weapon = getWeaponForBuy(winBuy, winTeamData[e.killerIndex]?.role || 'rifler', winMoney);
            lines.push(buildKillLine(
                winStats[e.killerIndex]?.nickname || '?',
                loseStats[e.victimIndex]?.nickname || '?',
                weapon, true
            ));
        });
        loseEvents.forEach(e => {
            const weapon = getWeaponForBuy(loseBuy, loseTeamData[e.killerIndex]?.role || 'rifler', loseMoney);
            lines.push(buildKillLine(
                loseStats[e.killerIndex]?.nickname || '?',
                winStats[e.victimIndex]?.nickname || '?',
                weapon, false
            ));
        });

        // ── СИТУАЦИОННЫЕ КОММЕНТАРИИ ──

        // ACE (5 килов одним игроком)
        let acePlayer = null, aceCnt = 0;
        Object.entries(winKillCount).forEach(([idx, cnt]) => {
            if (cnt >= 5) { aceCnt = cnt; acePlayer = winStats[parseInt(idx)]?.nickname || '?'; }
        });
        if (acePlayer) {
            lines.push(`  🌟 ACE! ${acePlayer} выносит всю пятёрку в одиночку — ${aceCnt} фрагов! Зал стоя аплодирует!`);
        }

        // КЛАТЧ (3-4 килла)
        let clutchPlayer = null, clutchCnt = 0;
        Object.entries(winKillCount).forEach(([idx, cnt]) => {
            if (cnt >= 3 && cnt < 5 && cnt > clutchCnt) {
                clutchCnt = cnt;
                clutchPlayer = winStats[parseInt(idx)]?.nickname || '?';
            }
        });
        if (clutchPlayer && !acePlayer) {
            const clutchPhrases = [
                `КЛАТЧ! ${clutchPlayer} вытягивает раунд с ${clutchCnt} фрагами — невероятная работа!`,
                `${clutchPlayer} на клатче — ${clutchCnt}k подряд! Зал в шоке.`,
                `Один против всех — ${clutchPlayer} не дрогнул. ${clutchCnt} фрага и раунд в кармане!`,
                `${clutchCnt}k от ${clutchPlayer}! Клатч, который запомнится.`,
            ];
            lines.push(`  🎯 ${rnd(clutchPhrases)}`);
        }

        // 1v1 ситуация (мало выживших с обеих сторон, выигравший выжил)
        const winnersLeft = 5 - loseEvents.length;  // сколько выжило у победителей
        const losersLeft  = 5 - winEvents.length;   // сколько выжило у проигравших
        if (winnersLeft === 1 && losersLeft <= 1 && !clutchPlayer && !acePlayer) {
            const lastMan = winStats[winEvents[winEvents.length-1]?.killerIndex]?.nickname;
            if (lastMan) {
                const v1phrases = [
                    `${lastMan} закрывает раунд в дуэли один на один — холодные нервы!`,
                    `Дуэль! ${lastMan} выходит победителем из клатчевой ситуации.`,
                    `${lastMan} — last man standing. Дожал!`,
                ];
                lines.push(`  ⚔️ ${rnd(v1phrases)}`);
            }
        }

        // EXIT FRAG — проигрывающая команда убила кого-то перед концом
        if (loseEvents.length >= 2) {
            const exitFragger = loseStats[loseEvents[loseEvents.length - 1]?.killerIndex]?.nickname;
            if (exitFragger) {
                const exitPhrases = [
                    `${exitFragger} забирает экзит-фраг — не уходит без боя.`,
                    `${exitFragger} успевает прихватить фраг напоследок. Экзит-фраг засчитан.`,
                    `Экзит от ${exitFragger} — хоть что-то в копилку команды.`,
                ];
                lines.push(`  💢 ${rnd(exitPhrases)}`);
            }
        }

        // СЕЙВ оружия (проигравшие остались живые с хорошим оружием)
        const losersAlive = losersLeft;
        if (losersAlive >= 1 && (loseBuy === 'full' || loseBuy === 'half') && !bombPlanted) {
            const savePhrases = [
                `${loseName} уходят в сейв — ${losersAlive} игр. с оружием выживает. Деньги сохранены.`,
                `Сейв от ${loseName}! ${losersAlive} чел. уносят винтовки — следующий раунд будет лучше.`,
                `${loseName} выбирают сейв. Правильное решение при такой экономике.`,
            ];
            lines.push(`  💼 ${rnd(savePhrases)}`);
        }

        // ПОСТПЛАНТ — бомба заложена, победитель CT
        if (bombPlanted && team1Wins) {
            const defusePhrases = [
                `CT успевают разминировать на последних секундах!`,
                `Дефуз! CT выдерживают давление и обезвреживают бомбу.`,
                `Бомба обезврежена — CT забирают раунд через дефуз!`,
            ];
            lines.push(`  🔧 ${rnd(defusePhrases)}`);
        }

        // РЕТЕЙК — проигравшие T взяли много килов у CT
        if (!team1Wins && loseEvents.length >= 2 && bombPlanted) {
            const retakePhrases = [
                `CT пытаются ретейкнуть ${plantSite} — жёсткий бой за сайт.`,
                `Попытка ретейка на ${plantSite}! CT выкладываются до последнего.`,
            ];
            lines.push(`  🔄 ${rnd(retakePhrases)}`);
        }

        // ЭКО выигран
        if (winBuy === 'eco' && (loseBuy === 'full' || loseBuy === 'half')) {
            lines.push(`  💡 ${rnd([
                `ЭКО РАБОТАЕТ! ${winName} берут раунд с пистолетами против фулл-бая — это психологический удар!`,
                `Эко-раунд выигран! ${winName} переламывают ситуацию без нормального оружия.`,
                `${winName} выигрывают эко! ${loseName} не могут поверить — такое случается.`,
            ])}`);
        } else if (winBuy === 'force' && (loseBuy === 'full' || loseBuy === 'half')) {
            lines.push(`  ⚡ ${rnd([
                `Форс-бай сработал! ${winName} вытащили раунд на нестандартном оружии — браво!`,
                `${winName} идут на форс — и выигрывают! ${loseName} не ожидали такого давления.`,
                `Форс окупился! ${winName} меняют динамику матча одним рискованным решением.`,
            ])}`);
        }

        // ── ИТОГ РАУНДА ──
        const cleanWin = loseEvents.length === 0;
        if (cleanWin && winnersLeft >= 4) {
            lines.push(`  ✅ ${fill(rnd(CASTER_WIN_CLEAN), winName, loseName)}`);
        } else {
            const winPhrases = [
                `Раунд за ${winName}.`,
                `${winName} забирают этот раунд.`,
                `Точка. Раунд достаётся ${winName}.`,
            ];
            lines.push(`  ✅ ${rnd(winPhrases)}`);
        }

        // ── ДЕНЬГИ ──
        if (t1MoneyAfter != null && t2MoneyAfter != null) {
            const t1pp = Math.floor(t1MoneyAfter / 5);
            const t2pp = Math.floor(t2MoneyAfter / 5);
            lines.push(`  💵 ${team1Name}: $${t1pp}/игрок   |   ${team2Name}: $${t2pp}/игрок`);
            const winnerPP = team1Wins ? t1pp : t2pp;
            const loserPP  = team1Wins ? t2pp : t1pp;
            const fullThresh  = isCS2Mode() ? 4000 : 2700;
            const forceThresh = isCS2Mode() ? 2700 : 2000;
            if (loserPP < forceThresh * 0.5) {
                lines.push(`  📉 ${loseName} в эко — следующий раунд без нормальной закупки.`);
            } else if (loserPP < forceThresh && (loseBuy === 'full' || loseBuy === 'half')) {
                lines.push(`  📉 ${loseName} потеряли деньги — придётся форсить или сейвить.`);
            } else if (winnerPP >= fullThresh && loserPP >= fullThresh) {
                lines.push(`  📊 Обе команды с деньгами — следующий раунд будет фулл-бай с обеих сторон.`);
            }
        }

        return lines.join('\n');
    }

    // ========== СИСТЕМА ПАУЗ / ТЕХПАУЗ ==========
    // Правила:
    //   До 3 пауз за карту, каждая длится 60 секунд
    //   Тактическая пауза берётся проигрывающей серию командой, чтобы остановить импульс соперника
    //   Техпауза: 1 раз за карту, случайная, не зависит от результата — даёт временный дебафф обеим сторонам
    //   Паузы вызываются ДО раунда (между раундами), эффект применяется в следующем раунде

    function initPauseState() {
        return {
            // Всего три тайм-аута за карту, по 60 секунд каждый
            timeoutsLeft: 3,
            currentOtBlock: 0,
            techPauseUsed: false,
            // Счётчики подряд проигранных раундов для определения момента паузы
            t1LoseStreak: 0, t2LoseStreak: 0
        };
    }

    // Вызывается ПОСЛЕ раунда
    // pauseTeam — команда БЕРУЩАЯ паузу (та которая проигрывает серию = накопила loseStreak)
    function tryCallPause(pauseState, t1LoseStreak, t2LoseStreak, isFirstHalf, isOvertime, team1Name, team2Name, teamplay1 = 50, teamplay2 = 50, ratingDiff = 0, roundNum = 1, team1Score = 0, team2Score = 0) {
        const result = { pauseTeam: null, isTech: false, lines: [] };

        // Техпауза: 1 раз за карту, появляется после первых раундов и даёт общий спад темпа
        if (!pauseState.techPauseUsed && pauseState.timeoutsLeft > 0 && roundNum >= 3 && Math.random() < 0.05) {
            pauseState.techPauseUsed = true;
            pauseState.timeoutsLeft = Math.max(0, pauseState.timeoutsLeft - 1);
            result.isTech = true;
            result.lines.push(rnd([
                `⏱️ ТЕХНИЧЕСКАЯ ПАУЗА! Рефери останавливает игру — технические неполадки на сцене.`,
                `⏱️ ТЕХПАУЗА! Проблема с оборудованием. Технические специалисты выходят на сцену.`,
                `⏱️ Стоп-игра! Технический сбой — судья фиксирует проблему, обе команды ждут.`
            ]));
            result.lines.push(`  🔧 Проблема устранена. Игра возобновляется.`);
            return result;
        }

        // Тактическая пауза берётся ПРОИГРЫВАЮЩЕЙ серию командой (у кого loseStreak >= 2)
        const computeChance = (loseStreak, teamplay, edge, available, scoreDiff) => {
            if (loseStreak < 2 || !available || scoreDiff > 0) return 0;
            let chance = 0.32 + (loseStreak - 1) * 0.14;
            chance += Math.max(0, Math.min(0.16, (teamplay - 50) / 200));
            chance += Math.max(0, Math.min(0.12, edge * 0.12));
            if (isOvertime) chance += 0.04;
            return Math.max(0, Math.min(0.82, chance));
        };

        const tryTakePause = (teamName, isT1) => {
            result.pauseTeam = isT1 ? 1 : 2;
            pauseState.timeoutsLeft = Math.max(0, pauseState.timeoutsLeft - 1);
            const opponent = isT1 ? team2Name : team1Name;
            result.lines.push(rnd([
                `⏸️ ТАЙМ-АУТ! Тренер ${teamName} берёт паузу — нужно остановить серию ${opponent}.`,
                `⏸️ ${teamName} берут тактическую паузу. Тренерский штаб выходит к игрокам.`,
                `⏸️ Пауза от ${teamName}! Тренер даёт установки, пытается сбить ритм ${opponent}.`,
                `⏸️ Тайм-аут! ${teamName} останавливают игру — ищут ответ на тактику ${opponent}.`
            ]));
            result.lines.push(`  📋 Минутная пауза. ${teamName} перестраивают схему и готовятся к следующему раунду.`);
        };

        const availableTimeout = pauseState.timeoutsLeft > 0;
        const t1ScoreDiff = team1Score - team2Score;
        const t2ScoreDiff = team2Score - team1Score;
        const t1Chance = computeChance(t1LoseStreak, teamplay1, ratingDiff, availableTimeout, t1ScoreDiff);
        const t2Chance = computeChance(t2LoseStreak, teamplay2, -ratingDiff, availableTimeout, t2ScoreDiff);

        if (t1Chance > 0 && Math.random() < t1Chance) {
            tryTakePause(team1Name, true);
        } else if (t2Chance > 0 && Math.random() < t2Chance) {
            tryTakePause(team2Name, false);
        }

        return result;
    }

        function simulateMap(team1, team2, mapName, roundTarget, maxRounds, format, isTeam1Best, isTeam2Best, team1Name, team2Name) {
        team1Name = team1Name || 'TEAM 1';
        team2Name = team2Name || 'TEAM 2';
        const detailedComments = safeStorage.getItem('detailedCommentsEnabled') !== 'false';
        const mapResult = {
            mapName,
            team1Score: 0,
            team2Score: 0,
            winner: null,
            team1Stats: [],
            team2Stats: [],
            roundComments: [],
            roundData: []
        };

        team1.forEach((player, index) => {
            mapResult.team1Stats.push({ nickname: player.nickname || `Player${index + 1}`, role: player.role, kills: 0, deaths: 0, rating: normalizeRating(player.rating !== null ? player.rating : 50) });
        });
        team2.forEach((player, index) => {
            mapResult.team2Stats.push({ nickname: player.nickname || `Enemy${index + 1}`, role: player.role, kills: 0, deaths: 0, rating: normalizeRating(player.rating !== null ? player.rating : 50) });
        });

        const coach1 = getCoach(1);
        const coach2 = getCoach(2);
        const teamplay1 = getTeamplay(1);
        const teamplay2 = getTeamplay(2);
        const team1Components = calculateRealisticTeamStrength(team1, isTeam1Best, coach1, teamplay1);
        const team2Components = calculateRealisticTeamStrength(team2, isTeam2Best, coach2, teamplay2);
        const team1Total = team1Components.ratingStrength + team1Components.peakStrength + team1Components.teamplayStrength;
        const team2Total = team2Components.ratingStrength + team2Components.peakStrength + team2Components.teamplayStrength;
        const totalStrength = team1Total + team2Total;
        const ratingDiff = (team1Components.ratingStrength - team2Components.ratingStrength) / (totalStrength || 1);
        const peakDiff = (team1Components.peakStrength - team2Components.peakStrength) / (totalStrength || 1);
        const teamplayDiff = (team1Components.teamplayStrength - team2Components.teamplayStrength) / (totalStrength || 1);
        const strengthDiff = Math.min(Math.max((team1Total - team2Total) / (totalStrength || 1), -0.42), 0.42);

        let team1Score = 0, team2Score = 0, round = 0;
        let team1Momentum = 0, team2Momentum = 0;
        // Стартовые деньги: 800 на игрока × 5 = 4000 на команду
        const START_MONEY = isCS2Mode() ? 4000 : 4000;
        let t1Money = START_MONEY, t2Money = START_MONEY;
        let t1LoseStreak = 0, t2LoseStreak = 0;
        let pistolWinner = null;

        const pauseState = initPauseState();
        const roundModifiers = { t1: 0, t2: 0, techDebuffRounds: 0 };

        const mapIntroEnabled = safeStorage.getItem('mapIntroEnabled') !== 'false';
        if (detailedComments && mapIntroEnabled) {
            const mapIntros = [
                `🗺️ Карта: ${mapName}. Поехали!`,
                `🗺️ ${mapName} — обе команды готовы. Смотрим кто лучше знает эту карту.`,
                `🗺️ Играем на ${mapName}. Начинаем!`
            ];
            mapResult.roundComments.push(rnd(mapIntros));
        }

        // ===== ОСНОВНОЕ ВРЕМЯ =====
        while (round < maxRounds && team1Score < roundTarget && team2Score < roundTarget) {
            const scoreBeforeRound = { team1: team1Score, team2: team2Score };
            const t1MoneyBefore = t1Money;
            const t2MoneyBefore = t2Money;

            const roundMods = stepRoundModifiers(roundModifiers);
            team1Momentum = Math.max(-1, Math.min(1, team1Momentum * 0.92));
            team2Momentum = Math.max(-1, Math.min(1, team2Momentum * 0.92));

            const t1PerPlayer = Math.floor(t1Money / 5);
            const t2PerPlayer = Math.floor(t2Money / 5);
            const t1Buy = getBuyType(t1PerPlayer, round + 1, t1LoseStreak > 0, pistolWinner, pistolWinner === 1);
            const t2Buy = getBuyType(t2PerPlayer, round + 1, t2LoseStreak > 0, pistolWinner, pistolWinner === 2);
            const t1Cost = getTeamBuyCost(t1Buy, team1, t1Money, true, round + 1);
            const t2Cost = getTeamBuyCost(t2Buy, team2, t2Money, false, round + 1);
            t1Money = Math.max(0, t1Money - t1Cost);
            t2Money = Math.max(0, t2Money - t2Cost);

            const t1StreakPenalty = t1LoseStreak >= 3 ? Math.min(0.08, (t1LoseStreak - 2) * 0.025) : 0;
            const t2StreakPenalty = t2LoseStreak >= 3 ? Math.min(0.08, (t2LoseStreak - 2) * 0.025) : 0;
            const team1Chance = computeRoundWinChance({
                ratingDiff,
                peakDiff,
                teamplayDiff,
                avgTeamplay: (teamplay1 + teamplay2) / 2,
                momentumDiff: team1Momentum - team2Momentum,
                buyDiff: getBuyPower(t1Buy) - getBuyPower(t2Buy),
                streakPenalty: t1StreakPenalty - t2StreakPenalty,
                scoreDiff: team1Score - team2Score,
                roundMod: (roundMods.t1 - roundMods.t2),
                techDebuff: roundMods.techDebuff
            });
            const team1Wins = Math.random() < team1Chance;
            if (round === 0) pistolWinner = team1Wins ? 1 : 2;

            if (team1Wins) {
                team1Score++;
                team1Momentum = Math.min(team1Momentum + 0.2, 1.0);
                team2Momentum = Math.max(team2Momentum - 0.1, -1.0);
                {
                    const SR = getSituationRewards();
                    const econ = applyRoundEconomy(t1Money, t2Money, t2LoseStreak, SR);
                    t1Money = econ.winnerMoney;
                    t2Money = econ.loserMoney;
                }
                t1LoseStreak = 0; t2LoseStreak++;
            } else {
                team2Score++;
                team2Momentum = Math.min(team2Momentum + 0.2, 1.0);
                team1Momentum = Math.max(team1Momentum - 0.1, -1.0);
                {
                    const SR = getSituationRewards();
                    const econ = applyRoundEconomy(t2Money, t1Money, t1LoseStreak, SR);
                    t2Money = econ.winnerMoney;
                    t1Money = econ.loserMoney;
                }
                t2LoseStreak = 0; t1LoseStreak++;
            }

            const events = simulateRoundStatsBalanced(team1Wins, mapResult, team1, team2, round);
            mapResult.roundData.push({ round: round + 1, t1Score: team1Score, t2Score: team2Score, winner: team1Wins ? 1 : 2, t1Money, t2Money, t1Buy, t2Buy });

            const isFirstHalf = (round + 1) <= (roundTarget - 1);
            let pauseLines = [];
            const pauseResult = tryCallPause(pauseState, t1LoseStreak, t2LoseStreak, isFirstHalf, false, team1Name, team2Name, teamplay1, teamplay2, ratingDiff, round + 1, team1Score, team2Score);
            if (pauseResult.lines.length > 0) {
                applyPauseImpact(pauseResult, roundModifiers, team1Name, team2Name, teamplay1, teamplay2);
            }
            if (detailedComments) {
                if (pauseResult.lines.length > 0) {
                    pauseLines = pauseResult.lines.concat(describePauseImpact(pauseResult, team1Name, team2Name));
                    // ИИ-тренер: добавляем коллы если есть API ключ
                    if (!pauseResult.isTech && pauseResult.pauseTeam) {
                        const isPauseT1 = pauseResult.pauseTeam === 1;
                        const aiCallParams = {
                            callerTeamId: pauseResult.pauseTeam,
                            callerTeamPlayers: isPauseT1 ? team1 : team2,
                            opponentPlayers: isPauseT1 ? team2 : team1,
                            callerTeamName: isPauseT1 ? team1Name : team2Name,
                            opponentTeamName: isPauseT1 ? team2Name : team1Name,
                            callerScore: isPauseT1 ? team1Score : team2Score,
                            opponentScore: isPauseT1 ? team2Score : team1Score,
                            mapName,
                            roundNum: round + 1,
                            loseStreak: isPauseT1 ? t1LoseStreak : t2LoseStreak
                        };
                        // Запускаем async, добавим строку в roundComments позже через Promise
                        const aiCallPromise = typeof window._aiGeneratePauseCall === 'function'
                            ? window._aiGeneratePauseCall(aiCallParams)
                            : Promise.resolve(null);
                        // Добавляем placeholder, заменим после резолва
                        const placeholderIdx = mapResult.roundComments.length + 1;
                        mapResult._aiPausePromises = mapResult._aiPausePromises || [];
                        mapResult._aiPausePromises.push({ promise: aiCallPromise, commentIdx: null, pauseLines });
                        pauseLines = pauseResult.lines.concat(describePauseImpact(pauseResult, team1Name, team2Name));
                        // Финальный push с пометкой AI — будет дополнен async
                        const commentText = buildRoundCommentary(round + 1, team1Wins, t1Buy, t2Buy, events, mapResult, team1Name, team2Name, { t1LoseStreak, t2LoseStreak }, scoreBeforeRound, team1, team2, t1MoneyBefore, t2MoneyBefore, t1Money, t2Money, pauseLines);
                        const commentIndex = mapResult.roundComments.length;
                        mapResult.roundComments.push(commentText);
                        mapResult._aiPausePromises[mapResult._aiPausePromises.length - 1].commentIdx = commentIndex;
                        mapResult._aiPausePromises[mapResult._aiPausePromises.length - 1].pauseLines = pauseLines;
                    } else {
                        mapResult.roundComments.push(buildRoundCommentary(round + 1, team1Wins, t1Buy, t2Buy, events, mapResult, team1Name, team2Name, { t1LoseStreak, t2LoseStreak }, scoreBeforeRound, team1, team2, t1MoneyBefore, t2MoneyBefore, t1Money, t2Money, pauseLines));
                    }
                } else {
                    mapResult.roundComments.push(buildRoundCommentary(round + 1, team1Wins, t1Buy, t2Buy, events, mapResult, team1Name, team2Name, { t1LoseStreak, t2LoseStreak }, scoreBeforeRound, team1, team2, t1MoneyBefore, t2MoneyBefore, t1Money, t2Money, pauseLines));
                }
            }

            round++;

            if (round === roundTarget - 1 && detailedComments) {
                const lead = team1Score > team2Score ? `${team1Name} ведут` : (team2Score > team1Score ? `${team2Name} ведут` : `Равный счёт`);
                mapResult.roundComments.push(`\n${rnd(CASTER_HALFTIME)}\n  📊 Счёт на перерыве: ${team1Score} : ${team2Score} — ${lead}\n  T↔CT смена сторон\n`);
            }
        }

        // ===== ОВЕРТАЙМ =====
        const overtimeThreshold = format === 'mr9' ? 9 : (format === 'mr12' ? 12 : 15);
        const canGoToOvertime = team1Score === team2Score && team1Score >= overtimeThreshold;

        if (canGoToOvertime) {
            let otBlock = 0;
            let isInOvertime = true;
            let safetyCounter = 0;

            // --- НОВАЯ ЛОГИКА ДЛЯ STANDOFF 2 ---
            if (!isCS2Mode()) {
                // Правила Standoff 2 OT:
                // Победа: 3 раунда из 4 (2+2 со сменой сторон)
                // Деньги: $8000 при каждой смене сторон (начало блока и середина)
                const S2_OT_WIN = 3;
                const S2_OT_ROUNDS = 4;
                const S2_OT_HALF = 2;
                const S2_OT_START_MONEY = 8000 * 5; // 8000 per player × 5 = 40000 командных

                if (detailedComments) {
                    mapResult.roundComments.push(`\n${rnd(CASTER_OT_START)}\n  📋 Правила овертайма (Standoff 2): 4 раунда (2+2), победа при 3 выигранных, старт с $${(S2_OT_START_MONEY/5).toLocaleString()} на игрока.\n  При счёте 2:2 — новый овертайм.\n`);
                }

                while (isInOvertime && safetyCounter < 200) {
                    safetyCounter++;
                    otBlock++;


                    let otT1 = 0, otT2 = 0;

                    if (detailedComments) {
                        mapResult.roundComments.push(`\n  🔄 ОТ #${otBlock} | Счёт серии: ${team1Score}:${team2Score}\n`);
                    }

                    for (let r = 0; r < S2_OT_ROUNDS; r++) {
                        // Смена сторон и сброс денег в начале (r=0) и после 2-го раунда (r=2)
                        if (r === 0 || r === S2_OT_HALF) {
                            t1Money = S2_OT_START_MONEY;
                            t2Money = S2_OT_START_MONEY;
                            t1LoseStreak = 0; t2LoseStreak = 0;
                            if (r === S2_OT_HALF && detailedComments) {
                                mapResult.roundComments.push(`  ↔️ Смена сторон. Счёт в допе: ${otT1}:${otT2}. Баланс сброшен до $${(S2_OT_START_MONEY/5).toLocaleString()} на игрока.\n`);
                            }
                        }

                        const scoreBeforeRound = { team1: team1Score, team2: team2Score };
                        const t1MoneyBefore = t1Money;
                        const t2MoneyBefore = t2Money;

                        const roundMods = stepRoundModifiers(roundModifiers);
                        team1Momentum = Math.max(-1, Math.min(1, team1Momentum * 0.92));
                        team2Momentum = Math.max(-1, Math.min(1, team2Momentum * 0.92));

                        const t1Buy = getBuyType(Math.floor(t1Money / 5), round + 1, t1LoseStreak > 0, pistolWinner, pistolWinner === 1);
                        const t2Buy = getBuyType(Math.floor(t2Money / 5), round + 1, t2LoseStreak > 0, pistolWinner, pistolWinner === 2);
                        const t1Cost = getTeamBuyCost(t1Buy, team1, t1Money, true, round + 1);
                        const t2Cost = getTeamBuyCost(t2Buy, team2, t2Money, false, round + 1);
                        t1Money = Math.max(0, t1Money - t1Cost);
                        t2Money = Math.max(0, t2Money - t2Cost);

                        const t1StreakPenalty = t1LoseStreak >= 3 ? Math.min(0.08, (t1LoseStreak - 2) * 0.025) : 0;
                        const t2StreakPenalty = t2LoseStreak >= 3 ? Math.min(0.08, (t2LoseStreak - 2) * 0.025) : 0;
                        const otChance = computeRoundWinChance({
                            strengthDiff,
                            teamplayDiff,
                            avgTeamplay: (teamplay1 + teamplay2) / 2,
                            momentumDiff: team1Momentum - team2Momentum,
                            buyDiff: getBuyPower(t1Buy) - getBuyPower(t2Buy),
                            streakPenalty: t1StreakPenalty - t2StreakPenalty,
                            scoreDiff: otT1 - otT2,
                            roundMod: (roundMods.t1 - roundMods.t2),
                            techDebuff: roundMods.techDebuff,
                            isOvertime: true
                        });
                        const team1Wins = Math.random() < otChance;

                        if (team1Wins) {
                            team1Score++; otT1++;
                            team1Momentum = Math.min(team1Momentum + 0.2, 1.0);
                            team2Momentum = Math.max(team2Momentum - 0.1, -1.0);
                            const SR = getSituationRewards();
                            const econ = applyRoundEconomy(t1Money, t2Money, t2LoseStreak, SR);
                            t1Money = econ.winnerMoney;
                            t2Money = econ.loserMoney;
                            t1LoseStreak = 0; t2LoseStreak++;
                        } else {
                            team2Score++; otT2++;
                            team2Momentum = Math.min(team2Momentum + 0.2, 1.0);
                            team1Momentum = Math.max(team1Momentum - 0.1, -1.0);
                            const SR = getSituationRewards();
                            const econ = applyRoundEconomy(t2Money, t1Money, t1LoseStreak, SR);
                            t2Money = econ.winnerMoney;
                            t1Money = econ.loserMoney;
                            t2LoseStreak = 0; t1LoseStreak++;
                        }

                        round++;
                        const events = simulateRoundStatsBalanced(team1Wins, mapResult, team1, team2, round);
                        mapResult.roundData.push({ round, t1Score: team1Score, t2Score: team2Score, winner: team1Wins ? 1 : 2, t1Money, t2Money, t1Buy, t2Buy });

                        const pauseResult = tryCallPause(pauseState, t1LoseStreak, t2LoseStreak, r < S2_OT_HALF, true, team1Name, team2Name, teamplay1, teamplay2, ratingDiff, round, team1Score, team2Score);
                        if (pauseResult.lines.length > 0) {
                            applyPauseImpact(pauseResult, roundModifiers, team1Name, team2Name, teamplay1, teamplay2);
                        }
                        if (detailedComments) {
                            let pauseLines = pauseResult.lines;
                            pauseLines = pauseLines.concat(describePauseImpact(pauseResult, team1Name, team2Name));
                            mapResult.roundComments.push(buildRoundCommentary(round, team1Wins, t1Buy, t2Buy, events, mapResult, team1Name, team2Name, { t1LoseStreak, t2LoseStreak }, scoreBeforeRound, team1, team2, t1MoneyBefore, t2MoneyBefore, t1Money, t2Money, pauseLines));
                        }

                        // Ранний выход — кто-то набрал 3 очка
                        if (otT1 >= S2_OT_WIN || otT2 >= S2_OT_WIN) break;
                    }

                    if (otT1 >= S2_OT_WIN) {
                        isInOvertime = false;
                        if (detailedComments) mapResult.roundComments.push(`\n  🏆 ${team1Name} побеждают в допах #${otBlock} (${otT1}:${otT2})!\n`);
                    } else if (otT2 >= S2_OT_WIN) {
                        isInOvertime = false;
                        if (detailedComments) mapResult.roundComments.push(`\n  🏆 ${team2Name} побеждают в допах #${otBlock} (${otT2}:${otT1})!\n`);
                    } else {
                        // 2:2 — новый овертайм
                        if (detailedComments) mapResult.roundComments.push(`\n  🔥 2:2 в допах #${otBlock}! Счёт матча ${team1Score}:${team2Score} — уходим в следующий овертайм!\n`);
                    }
                }
            }
            // --- КОНЕЦ НОВОЙ ЛОГИКИ ДЛЯ S2 ---

            // --- ЛОГИКА ДЛЯ CS2 (ОСТАЛАСЬ БЕЗ ИЗМЕНЕНИЙ) ---
            else {
                // Стартовые деньги в допах для CS2
                const OT_START_MONEY = isCS2Mode() ? 12750 * 5 : 10000 * 5; // per player × 5 = командные
                const OT_WIN = 4;
                const OT_ROUNDS = 6;
                const OT_HALF = 3;

                if (detailedComments) {
                    mapResult.roundComments.push(`\n${rnd(CASTER_OT_START)}\n  📋 Правила овертайма (CS2): 6 раундов (3+3), победа при 4 выигранных, старт с $${(OT_START_MONEY/5).toLocaleString()} на игрока.\n  При счёте 3:3 — новый овертайм.\n`);
                }

                while (isInOvertime && safetyCounter < 200) {
                    safetyCounter++;
                    otBlock++;


                    let otT1 = 0, otT2 = 0;

                    if (detailedComments) {
                        mapResult.roundComments.push(`\n  🔄 ОТ #${otBlock} | Счёт серии: ${team1Score}:${team2Score} | Старт с $${(OT_START_MONEY/5).toLocaleString()}/игрок\n`);
                    }

                    for (let r = 0; r < OT_ROUNDS; r++) {
                        if (r === 0 || r === OT_HALF) {
                            t1Money = OT_START_MONEY;
                            t2Money = OT_START_MONEY;
                            t1LoseStreak = 0; t2LoseStreak = 0;
                            if (r === OT_HALF && detailedComments) {
                                mapResult.roundComments.push(`  ↔️ Смена сторон. Счёт в допе: ${otT1}:${otT2}. Баланс сброшен до $${(OT_START_MONEY/5).toLocaleString()}/игрок.\n`);
                            }
                        }

                        const scoreBeforeRound = { team1: team1Score, team2: team2Score };
                        const t1MoneyBefore = t1Money;
                        const t2MoneyBefore = t2Money;

                        const roundMods = stepRoundModifiers(roundModifiers);
                        team1Momentum = Math.max(-1, Math.min(1, team1Momentum * 0.92));
                        team2Momentum = Math.max(-1, Math.min(1, team2Momentum * 0.92));

                        const t1Buy = getBuyType(Math.floor(t1Money / 5), round + 1, t1LoseStreak > 0, pistolWinner, pistolWinner === 1);
                        const t2Buy = getBuyType(Math.floor(t2Money / 5), round + 1, t2LoseStreak > 0, pistolWinner, pistolWinner === 2);
                        const t1Cost = getTeamBuyCost(t1Buy, team1, t1Money, true, round + 1);
                        const t2Cost = getTeamBuyCost(t2Buy, team2, t2Money, false, round + 1);
                        t1Money = Math.max(0, t1Money - t1Cost);
                        t2Money = Math.max(0, t2Money - t2Cost);

                        const t1StreakPenalty = t1LoseStreak >= 3 ? Math.min(0.08, (t1LoseStreak - 2) * 0.025) : 0;
                        const t2StreakPenalty = t2LoseStreak >= 3 ? Math.min(0.08, (t2LoseStreak - 2) * 0.025) : 0;
                        const otChance = computeRoundWinChance({
                            ratingDiff,
                            peakDiff,
                            teamplayDiff,
                            avgTeamplay: (teamplay1 + teamplay2) / 2,
                            momentumDiff: team1Momentum - team2Momentum,
                            buyDiff: getBuyPower(t1Buy) - getBuyPower(t2Buy),
                            streakPenalty: t1StreakPenalty - t2StreakPenalty,
                            scoreDiff: otT1 - otT2,
                            roundMod: (roundMods.t1 - roundMods.t2),
                            techDebuff: roundMods.techDebuff,
                            isOvertime: true
                        });
                        const team1Wins = Math.random() < otChance;

                        if (team1Wins) {
                            team1Score++; otT1++;
                            team1Momentum = Math.min(team1Momentum + 0.2, 1.0);
                            team2Momentum = Math.max(team2Momentum - 0.1, -1.0);
                            const SR = getSituationRewards();
                            const econ = applyRoundEconomy(t1Money, t2Money, t2LoseStreak, SR);
                            t1Money = econ.winnerMoney;
                            t2Money = econ.loserMoney;
                            t1LoseStreak = 0; t2LoseStreak++;
                        } else {
                            team2Score++; otT2++;
                            team2Momentum = Math.min(team2Momentum + 0.2, 1.0);
                            team1Momentum = Math.max(team1Momentum - 0.1, -1.0);
                            const SR = getSituationRewards();
                            const econ = applyRoundEconomy(t2Money, t1Money, t1LoseStreak, SR);
                            t2Money = econ.winnerMoney;
                            t1Money = econ.loserMoney;
                            t2LoseStreak = 0; t1LoseStreak++;
                        }

                        round++;
                        const events = simulateRoundStatsBalanced(team1Wins, mapResult, team1, team2, round);
                        mapResult.roundData.push({ round, t1Score: team1Score, t2Score: team2Score, winner: team1Wins ? 1 : 2, t1Money, t2Money, t1Buy, t2Buy });

                        const pauseResult = tryCallPause(pauseState, t1LoseStreak, t2LoseStreak, r < OT_HALF, true, team1Name, team2Name, teamplay1, teamplay2, ratingDiff, round, team1Score, team2Score);
                        if (pauseResult.lines.length > 0) {
                            applyPauseImpact(pauseResult, roundModifiers, team1Name, team2Name, teamplay1, teamplay2);
                        }
                        if (detailedComments) {
                            let pauseLines = pauseResult.lines;
                            pauseLines = pauseLines.concat(describePauseImpact(pauseResult, team1Name, team2Name));
                            mapResult.roundComments.push(buildRoundCommentary(round, team1Wins, t1Buy, t2Buy, events, mapResult, team1Name, team2Name, { t1LoseStreak, t2LoseStreak }, scoreBeforeRound, team1, team2, t1MoneyBefore, t2MoneyBefore, t1Money, t2Money, pauseLines));
                        }

                        if (otT1 >= OT_WIN || otT2 >= OT_WIN) break;
                    }

                    if (otT1 >= OT_WIN) {
                        isInOvertime = false;
                        if (detailedComments) mapResult.roundComments.push(`\n  🏆 ${team1Name} побеждают в допах #${otBlock} (${otT1}:${otT2})!\n`);
                    } else if (otT2 >= OT_WIN) {
                        isInOvertime = false;
                        if (detailedComments) mapResult.roundComments.push(`\n  🏆 ${team2Name} побеждают в допах #${otBlock} (${otT2}:${otT1})!\n`);
                    } else {
                        if (detailedComments) mapResult.roundComments.push(`\n  🔥 3:3 в допах #${otBlock}! Счёт матча ${team1Score}:${team2Score} — уходим в следующий овертайм!\n`);
                    }
                }
            }
            // --- КОНЕЦ ЛОГИКИ ДЛЯ CS2 ---
        } else if (team1Score !== team2Score) {
            // Обычное завершение
        } else {
            // Ничья без овертайма — редкий случай, разыгрываем раунд
            const tieChance = Math.max(0.3, Math.min(0.7, 0.5 + strengthDiff * 0.55));
            if (Math.random() < tieChance) team1Score++;
            else team2Score++;
        }

        mapResult.team1Score = team1Score;
        mapResult.team2Score = team2Score;

        if (mapResult.team1Score === mapResult.team2Score) {
            if (Math.random() < Math.max(0.3, Math.min(0.7, 0.5 + strengthDiff * 0.55))) mapResult.team1Score++;
            else mapResult.team2Score++;
        }

        mapResult.winner = mapResult.team1Score > mapResult.team2Score ? 1 : 2;

        if (detailedComments) {
            const winnerName = mapResult.winner === 1 ? team1Name : team2Name;
            const loserName = mapResult.winner === 1 ? team2Name : team1Name;
            const endLines = [
                `\n🏁 КАРТА ЗАВЕРШЕНА! ${winnerName} побеждают ${mapResult.team1Score}:${mapResult.team2Score}!`,
                `\n🏁 Всё! ${mapName} за ${winnerName} — ${mapResult.team1Score}:${mapResult.team2Score}. ${loserName} не смогли удержать.`,
                `\n🏁 ${winnerName} забирают карту ${mapResult.team1Score}:${mapResult.team2Score}!`
            ];
            mapResult.roundComments.push(rnd(endLines));
        }

        // Резолвим AI-коллы пауз: добавляем строки в уже записанные комментарии
        if (mapResult._aiPausePromises && mapResult._aiPausePromises.length > 0) {
            Promise.all(mapResult._aiPausePromises.map(entry =>
                entry.promise.then(result => ({ result, entry })).catch(() => ({ result: null, entry }))
            )).then(resolved => {
                resolved.forEach(({ result, entry }) => {
                    if (!result || entry.commentIdx == null) return;
                    const icon = result.isCaptain ? '🎙️ Капитан' : '🧠 Тренер';
                    const callLine = `\n  ${icon} ${result.callerName}: "${result.text}"`;
                    if (mapResult.roundComments[entry.commentIdx] != null) {
                        mapResult.roundComments[entry.commentIdx] += callLine;
                    }
                });
            });
        }

        return mapResult;
    }

    // Детерминированная сила для прогноза (без random)
    function calculateTeamStrengthForForecast(team, isBestMap, coach, teamplay) {
        var total = 0;
        team.forEach(function (player) {
            var r = normalizeRating(player.rating !== null ? player.rating : 50);
            total += r * getRoleSkillMultiplier(player.role);
        });
        const avgTeamRating = total / (team.length || 1);
        if (isBestMap) total *= 1.05;
        if (coach && coach.rating !== null) {
            const coachRating = normalizeRating(coach.rating);
            const coachBonus = 1 + ((coachRating - avgTeamRating) / avgTeamRating) * 0.05;
            total *= Math.min(1.08, Math.max(0.98, coachBonus));
        }
        total *= 0.93 + (teamplay / 100) * 0.14;
        return total / (team.length || 1);
    }

    function updateMapForecast() {
        var section = document.getElementById('mapForecastSection');
        var list = document.getElementById('mapForecastList');
        if (!section || !list) return;
        if (!selectedMaps || selectedMaps.length === 0) {
            section.style.display = 'none';
            return;
        }
        var coach1 = getCoach(1);
        var coach2 = getCoach(2);
        var tp1 = getTeamplay(1);
        var tp2 = getTeamplay(2);
        var team1Name = team1NameInput.value || 'TEAM 1';
        var team2Name = team2NameInput.value || 'TEAM 2';
        list.innerHTML = '';
        selectedMaps.forEach(function (mapName, i) {
            var isT1Best = team1BestMapSelect.value === mapName;
            var isT2Best = team2BestMapSelect.value === mapName;
            var s1 = calculateTeamStrengthForForecast(team1, isT1Best, coach1, tp1);
            var s2 = calculateTeamStrengthForForecast(team2, isT2Best, coach2, tp2);
            var diff = Math.max(-0.3, Math.min(0.3, (s1 - s2) / ((s1 + s2) || 1)));
            var chance1 = Math.round((0.5 + diff) * 100);
            var chance2 = 100 - chance1;
            var div = document.createElement('div');
            div.className = 'setting-group';
            div.innerHTML = '<div class="map-forecast-item" style="background: rgba(255,107,0,0.08); border-radius: 8px; padding: 12px; border: 1px solid rgba(255,107,0,0.2);">' +
                '<div style="color: #ff6b00; font-weight: 600; margin-bottom: 6px;">Карта ' + (i + 1) + ': ' + mapName + '</div>' +
                '<div style="display: flex; align-items: center; gap: 10px; font-size: 0.95rem;">' +
                '<span style="flex:1; text-align:center;">' + team1Name + ' <strong>' + chance1 + '%</strong></span>' +
                '<span style="color: #888;">—</span>' +
                '<span style="flex:1; text-align:center;">' + team2Name + ' <strong>' + chance2 + '%</strong></span>' +
                '</div></div>';
            list.appendChild(div);
        });
        section.style.display = 'block';
    }

    // isBestMap, coach, teamplay (0-100) влияют на силу
    function normalizeRating(r) {
        if (r === null || r === undefined) return 50;

        const rawString = typeof r === 'string' ? r.trim().replace(',', '.') : String(r);
        const raw = parseFloat(rawString);
        if (isNaN(raw)) return 50;

        // Поддерживаются обе шкалы:
        // 1) HLTV-формат 0.xx–2.xx (например 1.20 -> 120)
        // 2) Линейный рейтинг 0–200+
        // Для значений 2-3 без дробной части считаем, что это линейный рейтинг,
        // чтобы "2" не превращалось в 200.
        const hasDecimalSeparator = typeof r === 'string' && /[.,]/.test(r);
        const isInteger = Math.abs(raw - Math.round(raw)) < 1e-9;
        const shouldTreatAsHltvScale =
            raw > 0 &&
            raw <= 3 &&
            (hasDecimalSeparator || raw <= 1.6 || (raw < 2 && !isInteger));

        const normalized = shouldTreatAsHltvScale ? raw * 100 : raw;
        return Math.max(0, Math.min(200, normalized));
    }

    function calculateRealisticTeamStrength(team, isBestMap = false, coach = null, teamplay = 50) {
        let totalRatingStrength = 0;
        team.forEach(player => {
            const rating = normalizeRating(player.rating !== null ? player.rating : 50);
            let playerStrength = rating * getRoleSkillMultiplier(player.role);
            // Небольшая вариативность формы: не ломает рейтинг, только добавляет "день игры".
            playerStrength *= (0.99 + Math.random() * 0.02);
            totalRatingStrength += playerStrength;
        });
        const avgTeamRating = totalRatingStrength / (team.length || 1);
        let coachBonus = 1;
        if (coach && coach.rating !== null) {
            const coachRating = normalizeRating(coach.rating);
            coachBonus = 1 + ((coachRating - avgTeamRating) / avgTeamRating) * 0.05;
            coachBonus = Math.min(1.08, Math.max(0.98, coachBonus));
        }
        totalRatingStrength *= coachBonus;
        const peakBonus = isBestMap ? 1.08 : 1.0;
        const peakStrength = totalRatingStrength * (peakBonus - 1);
        const teamplayBonus = 0.88 + (teamplay / 100) * 0.22;
        const teamplayStrength = totalRatingStrength * (teamplayBonus - 1);
        return {
            ratingStrength: totalRatingStrength,
            peakStrength: peakStrength,
            teamplayStrength: teamplayStrength
        };
    }

    // ИСПРАВЛЕННАЯ ФУНКЦИЯ: deaths не могут превышать общее количество раундов
    function simulateRoundStatsBalanced(team1Wins, mapResult, team1Data, team2Data, currentRound) {
        // В реальности раунд идёт до 5 убийств победителя, но враги тоже убивают
        // Реалистичные исходы: 5-0 (~20%), 5-1 (~30%), 5-2 (~25%), 5-3 (~15%), 5-4 (~10%)
        const r = Math.random();
        const loserKills = r < 0.20 ? 0 : r < 0.50 ? 1 : r < 0.75 ? 2 : r < 0.90 ? 3 : 4;
        const winnerKills = 5;
        let events = { t1Kills: [], t2Kills: [] };
        
        const maxDeathsPerPlayer = Math.max(1, currentRound + 1);
        
        if (team1Wins) {
            events.t1Kills = distributeKillsRealistic(winnerKills, mapResult.team1Stats, mapResult.team2Stats, team1Data, true, maxDeathsPerPlayer);
            events.t2Kills = distributeKillsRealistic(loserKills, mapResult.team2Stats, mapResult.team1Stats, team2Data, false, maxDeathsPerPlayer);
        } else {
            events.t2Kills = distributeKillsRealistic(winnerKills, mapResult.team2Stats, mapResult.team1Stats, team2Data, true, maxDeathsPerPlayer);
            events.t1Kills = distributeKillsRealistic(loserKills, mapResult.team1Stats, mapResult.team2Stats, team1Data, false, maxDeathsPerPlayer);
        }
        return events;
    }

    function distributeKillsRealistic(kills, killingTeamStats, dyingTeamStats, teamData, isWinningTeam, maxDeathsPerPlayer) {
        const events = [];
        if (kills === 0) return events;
        
        for (let i = 0; i < kills; i++) {
            const killerIndex = selectKillerRealistic(teamData, killingTeamStats, isWinningTeam);
            killingTeamStats[killerIndex].kills++;
            
            // Выбираем жертву с учетом максимальных смертей
            let victimIndex;
            let attempts = 0;
            do {
                victimIndex = selectVictimRealistic(dyingTeamStats, teamData, isWinningTeam);
                attempts++;
                // Защита от бесконечного цикла, если все игроки уже достигли лимита
                if (attempts > 100) break;
            } while (dyingTeamStats[victimIndex].deaths >= maxDeathsPerPlayer);
            
            // Увеличиваем deaths только если жертва не превысила лимит
            if (dyingTeamStats[victimIndex].deaths < maxDeathsPerPlayer) {
                dyingTeamStats[victimIndex].deaths++;
                events.push({ killerIndex, victimIndex });
                
                // Логика АССИСТОВ 
                if (Math.random() < 0.31) {
                    // Выбираем ассистента из команды убийцы (не сам убийца)
                    const assistCandidates = killingTeamStats.map((p, idx) => ({p, idx})).filter(x => x.idx !== killerIndex);
                    if (assistCandidates.length > 0) {
                        const assistIdx = assistCandidates[Math.floor(Math.random() * assistCandidates.length)].idx;
                        killingTeamStats[assistIdx].assists = (killingTeamStats[assistIdx].assists || 0) + 1;
                    }
                }
            }
        }
        return events;
    }

    function selectKillerRealistic(teamData, teamStats, isWinningTeam) {
        const chances = [];
        const totalKills = teamStats.reduce((sum, p) => sum + (p.kills || 0), 0);
        const avgKills = totalKills / (teamStats.length || 1);
        teamData.forEach((player, index) => {
            let chance = 1.0;
            const rating = normalizeRating(player.rating !== null ? player.rating : 50);
            chance *= 0.52 + (rating / 180);
            chance *= getRoleMultiplier(player.role);
            chance *= isWinningTeam ? 1.08 : 0.88;
            const killsSoFar = teamStats[index].kills;
            const aboveAvg = Math.max(0, killsSoFar - avgKills);
            chance /= (1 + killsSoFar * (isWinningTeam ? 0.16 : 0.26));
            chance /= (1 + aboveAvg * (isWinningTeam ? 0.24 : 0.55));
            chance *= isWinningTeam ? (0.95 + Math.random() * 0.08) : (0.94 + Math.random() * 0.06);
            chances.push({ index, chance });
        });
        return weightedRandomSelect(chances);
    }

    function selectVictimRealistic(teamStats, teamData, isWinningTeam) {
        const chances = [];
        teamData.forEach((player, index) => {
            let chance = 1.0;
            const rating = normalizeRating(player.rating !== null ? player.rating : 50);
            chance *= 1.35 - (rating / 215);
            const role = player.role;
            if (role === 'sniper') chance *= 0.82;
            else if (role === 'opener') chance *= 1.18;
            else if (role === 'captain') chance *= 0.92;
            else if (role === 'support') chance *= 1.08;
            if (!isWinningTeam) chance *= 1.12;
            const deathsSoFar = teamStats[index].deaths;
            chance /= (1 + deathsSoFar * 0.08);
            chance *= (0.88 + Math.random() * 0.14);
            chances.push({ index, chance });
        });
        return weightedRandomSelect(chances);
    }

    function weightedRandomSelect(items) {
        const total = items.reduce((sum, item) => sum + item.chance, 0);
        let random = Math.random() * total;
        for (let i = 0; i < items.length; i++) {
            random -= items[i].chance;
            if (random <= 0) return items[i].index;
        }
        return items[items.length - 1].index;
    }

    function getRoleMultiplier(roleId) {
        const role = getActiveRoles().find(r => r.id === roleId);
        return role ? role.killMultiplier : 1.0;
    }

    function getRoleSkillMultiplier(roleId) {
        const role = getActiveRoles().find(r => r.id === roleId);
        return role ? role.skillMultiplier : 1.0;
    }

    // ================= ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ =================
    function displayMatchResults(results) {
        document.getElementById('tournamentResultTitle').textContent = results.tournamentName;
        // CS2 режим: подпись под заголовком результатов
        var resultSubtitle = document.getElementById('tournamentResultSubtitle');
        if (resultSubtitle) {
            resultSubtitle.textContent = isCS2Mode() ? 'CS2 k0tamb app' : 'k0tamb app';
        }
        document.getElementById('team1ResultName').textContent = results.team1Name;
        document.getElementById('team2ResultName').textContent = results.team2Name;
        document.getElementById('team1Score').textContent = results.team1Score;
        document.getElementById('team2Score').textContent = results.team2Score;
        document.getElementById('team1StatsTitle').textContent = results.team1Name;
        document.getElementById('team2StatsTitle').textContent = results.team2Name;

        displayTeamStats(results.team1Stats, 'team1StatsBody', results);
        displayTeamStats(results.team2Stats, 'team2StatsBody', results);

        if (results.mvp) {
            const mvpTeam = results.team1Stats.some(p => p.nickname === results.mvp.nickname) ? results.team1Name : results.team2Name;
            document.getElementById('mvpPlayer').textContent =
                `${results.mvp.nickname} (${mvpTeam}) - ${results.mvp.kills}/${results.mvp.deaths} (KD: ${results.mvp.kd})`;
        }

        displayMapStats(results.maps, results.team1Name, results.team2Name);
        renderCharts(results);
        renderCompareSection(results);

        if (downloadPhotoAfterSim) {
            downloadPhotoAfterSim = false;
            setTimeout(function() {
                if (typeof downloadMatchPhoto === 'function') downloadMatchPhoto();
            }, 550);
        }

        // ИИ-анализ итогов матча (async, появится после загрузки)
        if (typeof window._aiGeneratePostMatch === 'function') {
            // Проверяем наличие ключа асинхронно
            getDeepSeekKey().then(apiKey => { if (!apiKey) return;
            // Создаём блок-плейсхолдер
            let aiBlock = document.getElementById('aiPostMatchBlock');
            if (!aiBlock) {
                aiBlock = document.createElement('div');
                aiBlock.id = 'aiPostMatchBlock';
                aiBlock.style.cssText = 'margin-top:24px;padding:18px 20px;background:rgba(255,107,0,0.07);border:1px solid rgba(255,107,0,0.25);border-radius:12px;font-family:inherit;';
                const compareSection = document.getElementById('compareSection');
                if (compareSection && compareSection.parentNode) {
                    compareSection.parentNode.insertBefore(aiBlock, compareSection.nextSibling);
                }
            }
            aiBlock.innerHTML = '<div style="color:#ff6b00;font-weight:700;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;">🤖 Анализ матча</div>' +
                '<div style="color:rgba(255,255,255,0.4);font-size:0.85rem;font-style:italic;">Анализируем матч...</div>';

            window._aiGeneratePostMatch(results).then(text => {
                if (!text) {
                    aiBlock.style.display = 'none';
                    return;
                }
                aiBlock.innerHTML = '<div style="color:#ff6b00;font-weight:700;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;">🤖 Анализ матча</div>' +
                    '<div style="color:rgba(255,255,255,0.85);font-size:0.9rem;line-height:1.65;">' + text.replace(/\n/g, '<br>') + '</div>';
            }).catch(() => { aiBlock.style.display = 'none'; });
            }); // end getDeepSeekKey().then
        }
    }

    function displayTeamStats(stats, elementId, allResults) {
        const tbody = document.getElementById(elementId);
        if (!tbody) return;
        tbody.innerHTML = '';
        const sortedStats = [...stats].sort((a, b) => b.kills - a.kills);
        sortedStats.forEach(player => {
            const kdClass = getKDClass(player.kd);
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.title = 'Нажмите для карточки игрока';
            
            const avatarSrc = `players/${player.nickname}.png`;
            const avatarHtml = isCS2Mode() ? '' : `<div style="width: 32px; height: 32px; flex-shrink: 0; border-radius: 50%; overflow: hidden; background: rgba(255,107,0,0.1);"><img src="${avatarSrc}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.src='players/defaultplayer.png'"></div>`;
            
            row.innerHTML = `
                <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                        ${avatarHtml}
                        <div>${player.nickname}<span style="font-size:0.65rem;opacity:0.4;margin-left:4px;">👁</span></div>
                    </div>
                </td>
                <td>${player.kills}</td>
                <td style="color:#aaa;">${player.assists || 0}</td>
                <td>${player.deaths}</td>
                <td class="${kdClass}">${player.kd}</td>
                <td>${player.kpr ?? '-'}</td>
                <td>${player.dpr ?? '-'}</td>
                <td>${player.adr ?? '-'}</td>
                <td class="${getKDClass(player.hltvRating)}">${player.hltvRating ?? '-'}</td>
            `;
            row.addEventListener('click', () => showPlayerCard(player, allResults));
            tbody.appendChild(row);
        });
    }

    function showPlayerCard(player, results) {
        const old = document.getElementById('playerCardOverlay');
        if (old) old.remove();

        const bg = '#0f1117';
        const text = '#fff';
        const muted = 'rgba(255,255,255,0.45)';

        const teamKey = results.team1Stats.some(p => p.nickname === player.nickname) ? 'team1Stats' : 'team2Stats';
        const teamName = teamKey === 'team1Stats' ? results.team1Name : results.team2Name;

        const perMapData = (results.maps || []).map(map => {
            const s = map[teamKey]?.find(p => p.nickname === player.nickname);
            if (!s) return null;
            const kd = s.deaths > 0 ? (s.kills / s.deaths).toFixed(2) : s.kills > 0 ? s.kills.toFixed(2) : '0.00';
            return { map: map.mapName, kills: s.kills, deaths: s.deaths, kd, winner: map.winner };
        }).filter(Boolean);

        const roleNames = { rifler: 'Rifler', sniper: 'AWPer', support: 'Support', opener: 'Entry', captain: 'IGL' };
        const roleName = roleNames[player.role] || player.role || '—';

        const rating = parseFloat(player.hltvRating) || 0;
        const kd = parseFloat(player.kd) || 0;
        const ratingColor = rating >= 1.1 ? '#4bcd7b' : rating >= 1.0 ? '#f0c040' : '#e05555';
        const ratingLabel = rating >= 1.1 ? 'GOOD' : rating >= 1.0 ? 'OKAY' : 'POOR';

        // Фото игрока
        const nickClean = player.nickname.trim();
        const photoPath = isCS2Mode() ? null : `players/${nickClean}.png`;
        const defaultPhoto = 'players/defaultplayer.png';

        // Дуга через canvas → dataURL (без SVG текста — шрифт не ломается)
        const arcCanvas = document.createElement('canvas');
        arcCanvas.width = 224; arcCanvas.height = 200;
        const actx = arcCanvas.getContext('2d');
        const arcPct = Math.min(Math.max((rating - 0.5) / 1.0, 0), 1);
        const cx2 = 112, cy2 = 112, rr = 88;
        const startA = -210 * Math.PI / 180;
        const endTrackA = startA + 240 * Math.PI / 180;
        const endA = startA + 240 * Math.PI / 180 * arcPct;
        actx.beginPath(); actx.arc(cx2, cy2, rr, startA, endTrackA);
        actx.strokeStyle = 'rgba(255,255,255,0.1)'; actx.lineWidth = 14; actx.lineCap = 'round'; actx.stroke();
        if (arcPct > 0) {
            actx.beginPath(); actx.arc(cx2, cy2, rr, startA, endA);
            actx.strokeStyle = ratingColor; actx.lineWidth = 14; actx.lineCap = 'round'; actx.stroke();
        }
        const arcImg = arcCanvas.toDataURL();

        function statBlock(label, val, color, barPct) {
            const bc = color || text;
            const lbl = typeof barPct === 'number' ? (barPct > 0.6 ? 'GOOD' : barPct > 0.35 ? 'OKAY' : 'POOR') : '';
            const lblColor = lbl === 'GOOD' ? '#4bcd7b' : lbl === 'OKAY' ? '#f0c040' : '#e05555';
            return `<div style="padding:12px 14px;border-left:1px solid rgba(255,255,255,0.07);">
                <div style="font-size:1.3rem;font-weight:900;color:${bc};line-height:1;">${val}</div>
                <div style="font-size:0.65rem;color:${muted};text-transform:uppercase;letter-spacing:.08em;margin:3px 0 6px;">${label}</div>
                ${typeof barPct === 'number' ? `
                <div style="height:3px;background:rgba(255,255,255,0.1);border-radius:2px;">
                    <div style="height:100%;width:${Math.round(barPct*100)}%;background:${lblColor};border-radius:2px;"></div>
                </div>` : ''}
            </div>`;
        }

        const kdBarPct = Math.min(kd / 2, 1);
        const adrVal = player.adr ?? '—';
        const kprVal = player.kpr ?? '—';
        const dprVal = player.dpr ?? '—';
        const adrBarPct = typeof adrVal === 'number' ? Math.min(adrVal / 120, 1) : null;
        const kprBarPct = typeof kprVal === 'number' ? Math.min(kprVal / 1.2, 1) : null;
        const dprBarPct = typeof dprVal === 'number' ? Math.min(dprVal / 1.2, 1) : null;

        const mapBars = perMapData.map(d => {
            const isWin = d.winner === (teamKey === 'team1Stats' ? 1 : 2);
            const kdFloat = parseFloat(d.kd);
            const kdColor = kdFloat >= 1.1 ? '#4bcd7b' : kdFloat >= 1.0 ? '#f0c040' : '#e05555';
            return `<div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.8rem;">
                <span style="color:${isWin?'#4bcd7b':'#e05555'};font-size:0.65rem;font-weight:700;width:32px;">${isWin?'WIN':'LOSS'}</span>
                <span style="flex:1;color:${muted};">${d.map}</span>
                <span style="color:${text};">${d.kills}/${d.deaths}</span>
                <span style="color:${kdColor};font-weight:700;width:36px;text-align:right;">${d.kd}</span>
            </div>`;
        }).join('');

        const overlay = document.createElement('div');
        overlay.id = 'playerCardOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);padding:16px;';

        overlay.innerHTML = `
            <div style="background:${bg};border-radius:14px;width:min(520px,98vw);max-height:94vh;overflow-y:auto;border:1px solid rgba(255,107,0,0.2);position:relative;box-shadow:0 24px 64px rgba(0,0,0,0.8);">

                <!-- ШАПКА С ФОТО как HLTV -->
                <div style="position:relative;background:linear-gradient(135deg,#161b2e,#1e2540);border-radius:14px 14px 0 0;overflow:hidden;min-height:110px;">
                    <!-- размытый фон -->
                    <div style="position:absolute;inset:0;overflow:hidden;opacity:0.2;filter:blur(18px);transform:scale(1.2);pointer-events:none;">
                        <img src="${photoPath}" style="width:100%;height:100%;object-fit:cover;object-position:center center;" onerror="this.src='${defaultPhoto}'">
                    </div>
                    <button onclick="document.getElementById('playerCardOverlay').remove()" style="position:absolute;top:10px;right:12px;z-index:3;background:rgba(0,0,0,0.5);border:none;color:rgba(255,255,255,0.8);font-size:1.2rem;cursor:pointer;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;">✕</button>
                    <!-- фото + имя -->
                    <div style="position:relative;z-index:2;display:flex;align-items:flex-end;">
                        <div style="flex-shrink:0;width:105px;height:125px;overflow:hidden;position:relative;">
                            <img src="${photoPath}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center center;display:block;" onerror="this.src='${defaultPhoto}'">
                            <div style="position:absolute;bottom:0;left:0;right:0;height:40px;background:linear-gradient(transparent,${bg});"></div>
                        </div>
                        <div style="padding:14px 14px 14px 12px;flex:1;align-self:center;">
                            <div style="font-size:1.45rem;font-weight:900;color:#fff;line-height:1.1;">${player.nickname}</div>
                            <div style="font-size:0.78rem;color:${muted};margin-top:4px;">${teamName} · ${roleName}</div>
                        </div>
                    </div>
                </div>

                <!-- РЕЙТИНГ: T-рейтинг | дуга | CT-рейтинг -->
                <div style="display:flex;align-items:center;justify-content:center;padding:16px 16px 10px;background:#131720;">
                    <div style="text-align:right;padding-right:14px;min-width:90px;">
                        <div style="font-size:1.5rem;font-weight:900;color:#f0c040;">${(rating*0.97).toFixed(2)}</div>
                        <div style="font-size:0.62rem;color:${muted};letter-spacing:.08em;">T RATING</div>
                    </div>
                    <!-- Дуга canvas + HTML текст поверх -->
                    <div style="position:relative;width:112px;height:100px;flex-shrink:0;">
                        <img src="${arcImg}" style="width:112px;height:100px;display:block;">
                        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                            <div style="font-size:0.56rem;font-weight:900;color:${ratingColor};letter-spacing:.1em;line-height:1;margin-top:-6px;">${ratingLabel}</div>
                            <div style="font-size:1.18rem;font-weight:900;color:#fff;line-height:1.15;">${rating.toFixed(2)}</div>
                            <div style="font-size:0.44rem;color:${muted};letter-spacing:.1em;">RATING 2.0</div>
                        </div>
                    </div>
                    <div style="text-align:left;padding-left:14px;min-width:90px;">
                        <div style="font-size:1.5rem;font-weight:900;color:#5bc8f5;">${(rating*1.02).toFixed(2)}</div>
                        <div style="font-size:0.62rem;color:${muted};letter-spacing:.08em;">CT RATING</div>
                    </div>
                </div>

                <!-- СТАТЫ СЕТКА -->
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;background:#131720;border-top:1px solid rgba(255,255,255,0.07);border-bottom:1px solid rgba(255,255,255,0.07);">
                    ${statBlock('K/D', kd.toFixed(2), kd>=1.1?'#4bcd7b':kd>=1?'#f0c040':'#e05555', kdBarPct)}
                    ${statBlock('DPR', dprVal !== '—' ? parseFloat(dprVal).toFixed(2) : '—', '#f0c040', dprBarPct !== null ? 1-dprBarPct : null)}
                    ${statBlock('KAST', player.kast ? Math.round(player.kast*100)+'%' : '—', '#4bcd7b', player.kast)}
                    ${statBlock('Убийства', player.kills, text, null)}
                    ${statBlock('ADR', adrVal !== '—' ? parseFloat(adrVal).toFixed(1) : '—', text, adrBarPct)}
                    ${statBlock('KPR', kprVal !== '—' ? parseFloat(kprVal).toFixed(2) : '—', text, kprBarPct)}
                </div>

                <!-- ПО КАРТАМ -->
                ${perMapData.length > 0 ? `
                <div style="padding:12px 16px;background:${bg};">
                    <div style="font-size:0.68rem;color:${muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">По картам</div>
                    ${mapBars}
                </div>` : ''}
            </div>`;

        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
    }

    function downloadMatchPlayerCard(player, teamName, rating, kd, adrVal, kprVal, dprVal, ratingColor, ratingLabel, photoPath, defaultPhoto) {
        photoPath = photoPath || `players/${player.nickname.trim()}.png`;
        defaultPhoto = defaultPhoto || 'players/defaultplayer.png';

        ensureHtml2Canvas().then(() => {
            const muted = 'rgba(255,255,255,0.4)';

            // Дуга через canvas
            const arcCanvas = document.createElement('canvas');
            arcCanvas.width = 224; arcCanvas.height = 200;
            const actx = arcCanvas.getContext('2d');
            const arcPct = Math.min(Math.max((rating - 0.5) / 1.0, 0), 1);
            const cx2 = 112, cy2 = 112, rr = 88;
            const startA = -210 * Math.PI / 180;
            const endTrackA = startA + 240 * Math.PI / 180;
            const endA = startA + 240 * Math.PI / 180 * arcPct;
            actx.beginPath(); actx.arc(cx2, cy2, rr, startA, endTrackA);
            actx.strokeStyle = 'rgba(255,255,255,0.1)'; actx.lineWidth = 14; actx.lineCap = 'round'; actx.stroke();
            if (arcPct > 0) {
                actx.beginPath(); actx.arc(cx2, cy2, rr, startA, endA);
                actx.strokeStyle = ratingColor; actx.lineWidth = 14; actx.lineCap = 'round'; actx.stroke();
            }
            const arcImg = arcCanvas.toDataURL();

            function sc(label, val, color, barPct) {
                const lbl = typeof barPct==='number' ? (barPct>0.6?'GOOD':barPct>0.35?'OKAY':'POOR') : '';
                const lc = lbl==='GOOD'?'#4bcd7b':lbl==='OKAY'?'#f0c040':'#e05555';
                return `<div style="padding:14px;border-left:1px solid rgba(255,255,255,0.08);">
                    <div style="font-size:1.4rem;font-weight:900;color:${color||'#fff'};line-height:1;">${val}</div>
                    <div style="font-size:.62rem;color:${muted};text-transform:uppercase;letter-spacing:.08em;margin:4px 0 7px;">${label}</div>
                    ${typeof barPct==='number'?`<div style="height:3px;background:rgba(255,255,255,.1);border-radius:2px;"><div style="height:100%;width:${Math.round(barPct*100)}%;background:${lc};border-radius:2px;"></div></div>`:''}
                </div>`;
            }

            const kdFloat = parseFloat(kd)||0;
            const kdColor = kdFloat>=1.1?'#4bcd7b':kdFloat>=1?'#f0c040':'#e05555';

            const card = document.createElement('div');
            card.style.cssText = "position:fixed;left:-9999px;top:0;width:500px;background:#0f1117;font-family:'Montserrat',sans-serif;color:white;overflow:hidden;";
            card.innerHTML = `
                <div style="position:relative;background:linear-gradient(135deg,#161b2e,#1e2540);overflow:hidden;min-height:100px;">
                    <div style="position:absolute;inset:0;overflow:hidden;opacity:0.18;filter:blur(16px);transform:scale(1.15);">
                        <img src="${photoPath}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='${defaultPhoto}'">
                    </div>
                    <div style="position:relative;z-index:1;display:flex;align-items:flex-end;">
                        <div style="flex-shrink:0;width:95px;height:115px;overflow:hidden;position:relative;">
                            <img src="${photoPath}" style="width:100%;height:100%;object-fit:cover;object-position:top center;display:block;" onerror="this.src='${defaultPhoto}'">
                            <div style="position:absolute;bottom:0;left:0;right:0;height:35px;background:linear-gradient(transparent,#0f1117);"></div>
                        </div>
                        <div style="padding:14px 14px;flex:1;align-self:center;">
                            <div style="font-size:1.35rem;font-weight:900;line-height:1.1;">${player.nickname}</div>
                            <div style="font-size:.75rem;color:${muted};margin-top:4px;">${teamName}</div>
                            ${sinceDateStr ? `<div style="font-size:0.68rem;color:rgba(255,255,255,0.32);margin-top:6px;">${sinceDateStr}</div>` : ''}
                        </div>
                    </div>
                </div>
                <div style="display:flex;align-items:center;justify-content:center;padding:14px 16px 8px;background:#131720;">
                    <div style="text-align:right;padding-right:12px;min-width:80px;">
                        <div style="font-size:1.4rem;font-weight:900;color:#f0c040;">${(rating*0.97).toFixed(2)}</div>
                        <div style="font-size:.58rem;color:${muted};letter-spacing:.08em;">T RATING</div>
                    </div>
                    <div style="position:relative;width:112px;height:100px;flex-shrink:0;">
                        <img src="${arcImg}" style="width:112px;height:100px;display:block;">
                        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                            <div style="font-size:.55rem;font-weight:900;color:${ratingColor};letter-spacing:.1em;line-height:1;margin-top:-5px;">${ratingLabel}</div>
                            <div style="font-size:1.15rem;font-weight:900;color:#fff;line-height:1.15;">${rating.toFixed(2)}</div>
                            <div style="font-size:.42rem;color:${muted};letter-spacing:.1em;">RATING 2.0</div>
                        </div>
                    </div>
                    <div style="text-align:left;padding-left:12px;min-width:80px;">
                        <div style="font-size:1.4rem;font-weight:900;color:#5bc8f5;">${(rating*1.02).toFixed(2)}</div>
                        <div style="font-size:.58rem;color:${muted};letter-spacing:.08em;">CT RATING</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;background:#131720;border-top:1px solid rgba(255,255,255,0.07);border-bottom:1px solid rgba(255,255,255,0.07);">
                    ${sc('K/D',kdFloat.toFixed(2),kdColor,Math.min(kdFloat/2,1))}
                    ${sc('DPR',dprVal!=='—'?parseFloat(dprVal).toFixed(2):'—','#f0c040',typeof dprVal==='number'?1-Math.min(dprVal/1.2,1):null)}
                    ${sc('KAST',player.kast?Math.round(player.kast*100)+'%':'—','#4bcd7b',player.kast)}
                    ${sc('Убийства',player.kills,'#fff',null)}
                    ${sc('ADR',adrVal!=='—'?parseFloat(adrVal).toFixed(1):'—','#fff',typeof adrVal==='number'?Math.min(adrVal/120,1):null)}
                    ${sc('KPR',kprVal!=='—'?parseFloat(kprVal).toFixed(2):'—','#fff',typeof kprVal==='number'?Math.min(kprVal/1.2,1):null)}
                </div>
                <div style="padding:8px 14px;background:#0f1117;text-align:center;">
                    <div style="font-size:.6rem;color:rgba(255,255,255,.12);letter-spacing:.12em;text-transform:uppercase;">k0tamb app</div>
                </div>`;

            document.body.appendChild(card);

            const imgs = card.querySelectorAll('img');
            Promise.all(Array.from(imgs).map(img => new Promise(res => {
                if (img.complete) res(); else { img.onload = res; img.onerror = res; }
            }))).then(() => {
                document.fonts.ready.then(() => {
                    setTimeout(() => {
                        html2canvas(card, {
                            scale: 3, backgroundColor: '#0f1117', logging: false,
                            useCORS: true, allowTaint: true,
                            onclone: doc => doc.querySelectorAll('*').forEach(el => {
                                el.style.fontFamily = "'Montserrat', sans-serif";
                            })
                        }).then(canvas => {
                            document.body.removeChild(card);
                            // cleanup potential thin artifact lines
                            cleanCanvasLine(canvas);
                            const link = document.createElement('a');
                            link.download = `${player.nickname}_card.png`;
                            link.href = canvas.toDataURL('image/png');
                            link.click();
                        }).catch(() => document.body.removeChild(card));
                    }, 200);
                });
            });
        });
    }

    function displayMapStats(maps, team1Name, team2Name) {
        const container = document.getElementById('mapsStatsContainer');
        if (!container) return;
        container.innerHTML = '';
        maps.forEach((map, index) => {
            const mapData = getMapData(map.mapName);
            const mapElement = document.createElement('div');
            mapElement.className = 'map-stat-item';
            applyMapBackground(mapElement, mapData);
            mapElement.style.position = 'relative';
            mapElement.style.borderRadius = '8px';
            mapElement.style.overflow = 'hidden';
            mapElement.style.marginBottom = '20px';

            const content = document.createElement('div');
            content.style.position = 'relative';
            content.style.zIndex = '1';
            content.style.color = 'white';
            content.style.padding = '20px';

            const winnerName = map.team1Score > map.team2Score ? team1Name : team2Name;
            let mvpBadge = '';
            if (map.mvp) {
                mvpBadge = `
                    <div style="background: rgba(255, 193, 7, 0.2); padding: 8px; border-radius: 6px; margin-top: 10px; border-left: 4px solid #FFC107;">
                        <div style="font-size: 0.9rem; color: #FFC107; font-weight: bold;">⭐ MVP КАРТЫ</div>
                        <div style="font-size: 1rem; font-weight: bold;">${map.mvp.nickname} - ${map.mvp.kills}/${map.mvp.deaths}</div>
                    </div>
                `;
            }

            let commentsHtml = '';
            if (map.roundComments && map.roundComments.length > 0) {
                const commentsId = 'comments-' + index;
                const rawText = map.roundComments.join('\n\n');
                const escapedText = rawText.replace(/`/g, '\\`').replace(/\$/g, '\\$');
                commentsHtml = `
                    <div style="margin-top: 20px;">
                        <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;">
                            <button class="btn btn-secondary comment-action-btn" onclick="(function(){var el=document.getElementById('${commentsId}');el.style.display=el.style.display==='none'?'block':'none';})()" >
                                💬 Комментарии (${map.roundComments.length} раундов)
                            </button>
                            <button class="btn btn-secondary comment-action-btn" onclick="(function(){navigator.clipboard.writeText(document.getElementById('${commentsId}').innerText).then(function(){var b=event.target;b.textContent='✅ Скопировано!';setTimeout(function(){b.textContent='📋 Копировать';},2000);});})()">
                                📋 Копировать
                            </button>
                        </div>
                        <div id="${commentsId}" style="display: none; max-height: 500px; overflow-y: auto; background: rgba(0,0,0,0.4); padding: 16px; border-radius: 10px; font-family: 'Courier New', monospace; font-size: 0.82rem; white-space: pre-wrap; line-height: 1.6; border: 1px solid rgba(255,107,0,0.15);">${rawText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                    </div>
                `;
            }

            content.innerHTML = `
                <div class="map-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div>
                        <div style="font-size: 1rem; color: #ff6b00; margin-bottom: 5px;">Карта ${index + 1}</div>
                        <div style="font-size: 1.5rem; font-weight: bold;">${map.mapName}</div>
                        <div style="font-size: 0.9rem; color: #aaa;">Победитель: ${winnerName}</div>
                    </div>
                    <div style="font-size: 2rem; font-weight: bold; color: #ff6b00;">${map.team1Score} : ${map.team2Score}</div>
                </div>
                ${mvpBadge}
                ${commentsHtml}
                <div class="map-stats-tables" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                    <div class="map-player-stats">
                        <h4 style="color: #ff6b00; margin-bottom: 10px; border-bottom: 2px solid #ff6b00; padding-bottom: 5px;">${team1Name}</h4>
                        ${map.team1Stats.sort((a, b) => b.kills - a.kills).map(player => {
                            const kd = player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills > 0 ? player.kills.toFixed(2) : '0.00';
                            const kdClass = getKDClass(kd);
                            const isMapMVP = map.mvp && map.mvp.nickname === player.nickname;
                            return `
                                <div class="map-player-stat" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                    <div class="map-player-name" style="font-weight: ${isMapMVP ? 'bold' : 'normal'}; color: ${isMapMVP ? '#FFC107' : 'white'};">${player.nickname}</div>
                                    <span class="map-player-kd ${kdClass}" style="font-weight: bold;">${player.kills}/${player.deaths} (${kd})</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="map-player-stats">
                        <h4 style="color: #ff6b00; margin-bottom: 10px; border-bottom: 2px solid #ff6b00; padding-bottom: 5px;">${team2Name}</h4>
                        ${map.team2Stats.sort((a, b) => b.kills - a.kills).map(player => {
                            const kd = player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills > 0 ? player.kills.toFixed(2) : '0.00';
                            const kdClass = getKDClass(kd);
                            const isMapMVP = map.mvp && map.mvp.nickname === player.nickname;
                            return `
                                <div class="map-player-stat" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                    <div class="map-player-name" style="font-weight: ${isMapMVP ? 'bold' : 'normal'}; color: ${isMapMVP ? '#FFC107' : 'white'};">${player.nickname}</div>
                                    <span class="map-player-kd ${kdClass}" style="font-weight: bold;">${player.kills}/${player.deaths} (${kd})</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
            mapElement.appendChild(content);
            container.appendChild(mapElement);
        });
    }

    function getKDClass(kdValue) {
        const kd = parseFloat(kdValue);
        if (isNaN(kd)) return 'kd-red';
        if (kd >= 1.1) return 'kd-green';
        if (kd >= 1.0) return 'kd-yellow';
        return 'kd-red';
    }

    // ================= СКАЧИВАНИЕ ОТЧЁТА =================
    function downloadMatchReport() {
        if (!matchResults) {
            showAlert('Сначала нужно симулировать матч!');
            return;
        }
        var report = {
            date: new Date().toISOString(),
            tournamentName: matchResults.tournamentName,
            format: matchResults.format,
            bo: matchResults.bo,
            team1Name: matchResults.team1Name,
            team2Name: matchResults.team2Name,
            team1Score: matchResults.team1Score,
            team2Score: matchResults.team2Score,
            mvp: matchResults.mvp ? {
                nickname: matchResults.mvp.nickname,
                kills: matchResults.mvp.kills,
                deaths: matchResults.mvp.deaths,
                kd: matchResults.mvp.kd
            } : null,
            team1Stats: matchResults.team1Stats,
            team2Stats: matchResults.team2Stats,
            maps: (matchResults.maps || []).map(function (m) {
                return {
                    mapName: m.mapName,
                    team1Score: m.team1Score,
                    team2Score: m.team2Score,
                    winner: m.team1Score > m.team2Score ? matchResults.team1Name : matchResults.team2Name,
                    mvp: m.mvp ? m.mvp.nickname : null
                };
            })
        };
        var json = JSON.stringify(report, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'match_report_' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ================= СКАЧИВАНИЕ ФОТО =================
    // Small canvas cleanup: remove thin horizontal dark artifact lines that sometimes appear after html2canvas
    function cleanCanvasLine(canvas) {
        try {
            const ctx = canvas.getContext('2d');
            const w = canvas.width, h = canvas.height;
            const startRow = Math.floor(h * 0.52);
            const endRow = Math.min(h - 10, Math.floor(h * 0.82));
            for (let y = startRow; y <= endRow; y++) {
                const data = ctx.getImageData(0, y, w, 1).data;
                let darkCount = 0;
                for (let x = 0; x < w; x++) {
                    const i = x * 4;
                    if (data[i] < 30 && data[i+1] < 30 && data[i+2] < 30 && data[i+3] > 200) darkCount++;
                }
                if (darkCount > w * 0.6) {
                    // replace this row with average of row above and below
                    const above = ctx.getImageData(0, Math.max(0, y-1), w, 1).data;
                    const below = ctx.getImageData(0, Math.min(h-1, y+1), w, 1).data;
                    const out = ctx.createImageData(w, 1);
                    for (let x = 0; x < w; x++) {
                        const i = x * 4;
                        out.data[i]   = Math.round((above[i]   + below[i])   / 2);
                        out.data[i+1] = Math.round((above[i+1] + below[i+1]) / 2);
                        out.data[i+2] = Math.round((above[i+2] + below[i+2]) / 2);
                        out.data[i+3] = 255;
                    }
                    ctx.putImageData(out, 0, y);
                }
            }
        } catch (e) { /* silently ignore cleanup errors */ }
    }
    function downloadMatchPhoto() {
        if (!matchResults) {
            showAlert('Сначала нужно симулировать матч!');
            return;
        }
        currentTheme = safeStorage.getItem('imageTheme') || 'orange';

        ensureHtml2Canvas().catch((error) => {
            // html2canvas load error
            showAlert('Не удалось загрузить библиотеку для экспорта фото. Проверьте подключение и повторите попытку.');
        }).then(() => {
            if (typeof html2canvas === 'undefined') {
                showAlert('Ошибка: библиотека html2canvas не загружена.');
                return;
            }

        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
        const imagesToPreload = [];

        matchResults.maps.forEach(map => {
            const mapData = getActiveMaps().find(m => m.name === map.mapName);
            if (mapData) imagesToPreload.push(baseUrl + mapData.image);
        });
        
        // Preload player avatars
        [...matchResults.team1Stats, ...matchResults.team2Stats].forEach(p => {
             if (p.nickname) imagesToPreload.push(baseUrl + `players/${p.nickname}.png`);
        });
        imagesToPreload.push(baseUrl + 'players/defaultplayer.png');

        const preloadImages = (urls) => {
            return Promise.all(urls.map(url => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => resolve(url);
                    img.onerror = () => { resolve(null); };
                    img.src = url;
                });
            }));
        };

            preloadImages(imagesToPreload).then(() => {
                const exportWidth = 1920; // Full HD width
                const exportContainer = document.createElement('div');
                exportContainer.id = 'matchImageExport';
                exportContainer.style.position = 'fixed';
                exportContainer.style.left = '-9999px';
                exportContainer.style.top = '0';
                exportContainer.style.width = `${exportWidth}px`;
                exportContainer.style.backgroundColor = '#0d0d18';
                exportContainer.style.color = 'black';
                exportContainer.style.padding = '0';
                exportContainer.style.fontFamily = "'Montserrat', sans-serif";
                exportContainer.style.boxSizing = 'border-box';

                exportContainer.innerHTML = generateImageHTML(baseUrl);

                document.body.appendChild(exportContainer);

                setTimeout(() => {
                    const contentHeight = exportContainer.scrollHeight;
                    const maxCanvasDimension = 16384;
                    const desiredScale = 4;
                    const maxScaleByHeight = Math.floor(maxCanvasDimension / contentHeight * 10) / 10;
                    const maxScaleByWidth = Math.floor(maxCanvasDimension / exportWidth * 10) / 10;
                    const safeScale = Math.max(3, Math.min(desiredScale, maxScaleByHeight, maxScaleByWidth));

                    html2canvas(exportContainer, {
                        scale: safeScale,
                        useCORS: true,
                        backgroundColor: '#0d0d18',
                        width: exportWidth,
                        height: contentHeight,
                        windowWidth: exportWidth,
                        windowHeight: contentHeight,
                        logging: false,
                        allowTaint: true,
                        removeContainer: true
                    }).then(canvas => {
                        // attempt to remove thin black artifact lines that may appear near bottom/center
                        cleanCanvasLine(canvas);
                        try {
                            const link = document.createElement('a');
                            let fileName;
                            if (currentTheme === 'practice') {
                                fileName = `practice_game_${matchResults.team1Score}-${matchResults.team2Score}_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.png`;
                            } else {
                                const t1 = matchResults.team1Name.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_');
                                const t2 = matchResults.team2Name.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_');
                                fileName = `${t1}_vs_${t2}_${matchResults.team1Score}-${matchResults.team2Score}_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.png`;
                            }
                            link.download = fileName;
                            link.href = canvas.toDataURL('image/png');
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            if (exportContainer.parentNode) document.body.removeChild(exportContainer);
                        } catch (error) {
                            // Download image error
                            showAlert('Ошибка при скачивании изображения');
                            if (exportContainer.parentNode) document.body.removeChild(exportContainer);
                        }
                    }).catch(error => {
                        // Image creation error
                        showAlert('Ошибка при создании изображения');
                        if (exportContainer.parentNode) document.body.removeChild(exportContainer);
                    });
                }, 800);
            });
        });
    }

    function generateImageHTML(baseUrl) {
        const results = matchResults;
        baseUrl = baseUrl || '';

        const getKDColor = (kdValue) => {
            const kd = parseFloat(kdValue);
            if (isNaN(kd)) return '#F44336';
            if (kd >= 1.1) return '#4CAF50';
            if (kd >= 1.0) return '#FFC107';
            return '#F44336';
        };

        const getMapDataForPhoto = (mapName) => {
            const map = getActiveMaps().find(m =>
                m.name.toLowerCase() === (mapName || '').toLowerCase() ||
                m.id.toLowerCase() === (mapName || '').toLowerCase()
            );
            if (map) return { ...map, image: baseUrl + map.image };
            return { name: mapName, image: baseUrl + 'images/maps/breeze.jpg', fallbackColor: '#2c3e50' };
        };

        const themeColors = getThemeColors();
        const hidePlayerPhotos = true;
        const cardWidth = 1920;
        const statFont = hidePlayerPhotos ? '0.96rem' : '1.12rem';
        const headerFont = hidePlayerPhotos ? '0.64rem' : '0.68rem';
        const colWidths = hidePlayerPhotos
            ? ['32%','7%','7%','7%','8%','9%','8%','8%','8%','6%']
            : ['36%','7%','7%','7%','8%','8%','7%','7%','7%','6%'];
        const colGroup = `<colgroup>${colWidths.map((w) => `<col style="width:${w};">`).join('')}</colgroup>`;

        // ── Rankoff-style dark card ──────────────────────────────────────────
        const accent = themeColors.primary;
        const matchDate = new Date().toISOString().slice(0, 10);
        const isPractice = currentTheme === 'practice';

        // helper: get diff color
        const diffColor = (d) => d > 0 ? '#4bcd7b' : d < 0 ? '#e05555' : '#aaa';
        const diffStr = (kills, deaths) => {
            const d = (kills||0) - (deaths||0);
            return (d > 0 ? '+' : '') + d;
        };
        const kdColor = (kd) => {
            const v = parseFloat(kd);
            if (isNaN(v)) return '#e05555';
            return v >= 1.2 ? '#4bcd7b' : v >= 0.9 ? '#f0c040' : '#e05555';
        };
        const ratingColor = (r) => {
            const v = parseFloat(r);
            if (isNaN(v)) return '#e05555';
            return v >= 1.1 ? '#4bcd7b' : v >= 0.9 ? '#f0c040' : '#e05555';
        };

        const boTotal = parseInt(results.bo, 10) || ((results.plannedMaps && results.plannedMaps.length) ? results.plannedMaps.length : (results.maps || []).length || 1);
        const exportMaps = [];
        for (let i = 0; i < boTotal; i++) {
            const playedMap = (results.maps || [])[i];
            if (playedMap && playedMap.isPlayed !== false && (playedMap.team1Score || playedMap.team2Score || (playedMap.team1Stats && playedMap.team1Stats.length))) {
                exportMaps.push({ ...playedMap, isPlayed: true });
                continue;
            }
            // Получаем название карты из всех доступных источников
            const plannedName = (results.plannedMaps && results.plannedMaps[i]) ? results.plannedMaps[i] : null;
            const mapInArray = (results.maps || [])[i];
            const mapName = plannedName || (mapInArray && mapInArray.mapName) || `Карта ${i + 1}`;
            exportMaps.push({
                mapName,
                team1Score: 0,
                team2Score: 0,
                isPlayed: false
            });
        }

        // Map preview blocks — with pick info, team names and round scores
        const mapPreviewsHtml = exportMaps.map((map, mapIndex) => {
            const mapData = getMapDataForPhoto(map.mapName);
            const t1w = map.team1Score > map.team2Score;
            const t2w = map.team2Score > map.team1Score;
            let pickLabel = '';
            if (map.pickedBy) {
                pickLabel = map.pickedBy;
            } else if (map.pick === 'team1') {
                pickLabel = results.team1Name;
            } else if (map.pick === 'team2') {
                pickLabel = results.team2Name;
            } else if (map.pick === 'decider') {
                pickLabel = 'Decider';
            }
            const notPlayed = !map.isPlayed;
            const cardLabel = `КАРТА ${mapIndex + 1}`;
            const fixedCardWidth = 336;
            return `
            <div style="flex:0 0 ${fixedCardWidth}px;width:${fixedCardWidth}px;background:#12121e;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,${notPlayed?'0.05':'0.08'});position:relative;opacity:${notPlayed?'0.75':'1'};">
                <!-- Map image, fixed height -->
                <div style="position:relative;height:110px;overflow:hidden;">
                    <img src="${mapData.image}" crossorigin="anonymous"
                        style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center 35%;"
                        onerror="this.style.display='none'"/>
                    <div style="position:absolute;inset:0;background:${notPlayed?'rgba(0,0,0,0.65)':'rgba(0,0,0,0.42)'};"></div>
                    ${notPlayed ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"><div style="border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:5px 12px;font-size:0.55rem;color:#8f96aa;letter-spacing:.14em;text-transform:uppercase;font-weight:700;background:rgba(0,0,0,0.5);">Не сыграно</div></div>` : ''}
                    <div style="position:absolute;bottom:0;left:0;right:0;padding:8px 14px;">
                        <div style="font-size:0.48rem;color:${accent};letter-spacing:.18em;text-transform:uppercase;font-weight:700;margin-bottom:2px;">${cardLabel}</div>
                        <div style="font-size:0.95rem;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:.04em;text-shadow:0 1px 6px rgba(0,0,0,0.9);">${map.mapName}</div>
                    </div>
                </div>
                <!-- Scores -->
                <div style="padding:10px 14px;">
                    ${pickLabel ? `<div style="font-size:0.48rem;color:#888;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;">ПИК: <span style="color:#ccc;">${pickLabel}</span></div>` : ''}
                    <div style="display:flex;flex-direction:column;gap:5px;${notPlayed?'opacity:0.4':''}">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:0.66rem;font-weight:700;color:${t1w?'#fff':'rgba(255,255,255,0.45)'};">${results.team1Name}</span>
                            <span style="font-size:1.1rem;font-weight:900;color:${t1w?accent:'rgba(255,255,255,0.3)'};">${map.team1Score}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:0.66rem;font-weight:700;color:${t2w?'#fff':'rgba(255,255,255,0.45)'};">${results.team2Name}</span>
                            <span style="font-size:1.1rem;font-weight:900;color:${t2w?accent:'rgba(255,255,255,0.3)'};">${map.team2Score}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

        // Player row renderer
        const playerRow = (p, rowBg) => {
            const kd = p.deaths > 0 ? (p.kills / p.deaths).toFixed(2) : (p.kills || 0).toFixed(2);
            const kpr = p.kpr != null ? parseFloat(p.kpr).toFixed(2) : (p.totalRounds > 0 ? (p.kills/p.totalRounds).toFixed(2) : '—');
            const dpr = p.dpr != null ? parseFloat(p.dpr).toFixed(2) : (p.totalRounds > 0 ? (p.deaths/p.totalRounds).toFixed(2) : '—');
            const adr = p.adr != null ? parseFloat(p.adr).toFixed(0) : '—';
            const ratingRaw = p.hltvRating || p.kd_rating || null;
            const ratingVal = parseFloat(ratingRaw);
            const ratingStr = (!isNaN(ratingVal) && ratingVal > 0) ? ratingVal.toFixed(2) : '—';
            const diff = diffStr(p.kills, p.deaths);
            const diffVal = (p.kills||0) - (p.deaths||0);
            const isMvp = results.mvp && results.mvp.nickname === p.nickname;
            const rowStyle = isMvp
                ? 'background:rgba(255,193,7,0.12);'
                : `background:${rowBg};`;

            return `
            <tr style="${rowStyle}">
                <td style="padding:10px 14px;white-space:nowrap;border-left:${isMvp ? '3px solid #ffc107' : '3px solid transparent'};">
                    <div style="display:flex;align-items:center;gap:12px;">
                        ${hidePlayerPhotos ? '' : `
                        <div style="width:62px;height:62px;border-radius:50%;overflow:hidden;flex-shrink:0;background:#1e1e2e;position:relative;border:1px solid rgba(255,255,255,0.12);">
                            <img src="${baseUrl}players/${p.nickname}.png" crossorigin="anonymous"
                                style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 12%;transform:scale(1.08);"
                                onerror="this.src='${baseUrl}players/defaultplayer.png'">
                        </div>`}
                        <div style="font-weight:700;font-size:0.96rem;color:${isMvp ? '#ffd54f' : '#fff'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.nickname}</div>
                    </div>
                </td>
                <td style="text-align:center;font-weight:700;color:#fff;padding:10px 8px;font-size:${statFont};">${p.kills||0}</td>
                <td style="text-align:center;color:#888;padding:10px 8px;font-size:${statFont};">${p.assists||0}</td>
                <td style="text-align:center;color:#bbb;padding:10px 8px;font-size:${statFont};">${p.deaths||0}</td>
                <td style="text-align:center;font-weight:700;color:${diffColor(diffVal)};padding:10px 8px;font-size:${statFont};">${diff}</td>
                <td style="text-align:center;font-weight:700;color:${kdColor(kd)};padding:10px 8px;font-size:${statFont};">${kd}</td>
                <td style="text-align:center;color:#bbb;padding:10px 8px;font-size:${statFont};">${kpr}</td>
                <td style="text-align:center;color:#bbb;padding:10px 8px;font-size:${statFont};">${dpr}</td>
                <td style="text-align:center;color:#bbb;padding:10px 8px;font-size:${statFont};">${adr}</td>
                <td style="text-align:center;font-weight:900;color:${ratingColor(ratingStr)};padding:10px 8px;font-size:${statFont};">${ratingStr}</td>
            </tr>`;
        };

        const tableHeader = `
            <tr style="background:rgba(0,0,0,0.25);">
                <th style="padding:9px 14px;text-align:left;font-size:${headerFont};letter-spacing:.13em;text-transform:uppercase;color:#555;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">ИГРОК</th>
                <th style="padding:9px 8px;text-align:center;font-size:${headerFont};letter-spacing:.13em;text-transform:uppercase;color:#555;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">K</th>
                <th style="padding:9px 8px;text-align:center;font-size:${headerFont};letter-spacing:.13em;text-transform:uppercase;color:#555;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">A</th>
                <th style="padding:9px 8px;text-align:center;font-size:${headerFont};letter-spacing:.13em;text-transform:uppercase;color:#555;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">D</th>
                <th style="padding:9px 8px;text-align:center;font-size:${headerFont};letter-spacing:.13em;text-transform:uppercase;color:#555;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">DIFF</th>
                <th style="padding:9px 8px;text-align:center;font-size:${headerFont};letter-spacing:.13em;text-transform:uppercase;color:#555;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">KD</th>
                <th style="padding:9px 8px;text-align:center;font-size:${headerFont};letter-spacing:.13em;text-transform:uppercase;color:#555;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">KPR</th>
                <th style="padding:9px 8px;text-align:center;font-size:${headerFont};letter-spacing:.13em;text-transform:uppercase;color:#555;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">DPR</th>
                <th style="padding:9px 8px;text-align:center;font-size:${headerFont};letter-spacing:.13em;text-transform:uppercase;color:#555;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">ADR</th>
                <th style="padding:9px 8px;text-align:center;font-size:${headerFont};letter-spacing:.13em;text-transform:uppercase;color:#555;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">RATING</th>
            </tr>`;

        const t1Rows = results.team1Stats.slice().sort((a,b) => b.kills - a.kills)
            .map((p, i) => playerRow(p, i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent')).join('');
        const t2Rows = results.team2Stats.slice().sort((a,b) => b.kills - a.kills)
            .map((p, i) => playerRow(p, i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent')).join('');

        const t1Wins = results.team1Score > results.team2Score;
        const t2Wins = results.team2Score > results.team1Score;

        // accent hex -> rgba helper
        const accentRgb = accent === '#ff6b00' ? '255,107,0'
            : accent === '#e74c3c' ? '231,76,60'
            : accent === '#27ae60' ? '39,174,96'
            : accent === '#8e44ad' ? '142,68,173'
            : accent === '#00bcd4' ? '0,188,212'
            : accent === '#f39c12' ? '243,156,18'
            : accent === '#3498db' ? '52,152,219'
            : accent === '#2c3e50' ? '44,62,80'
            : '255,107,0';

        return `
            <div style="width:1920px;background:#0d0d18;color:#fff;font-family:'Montserrat',sans-serif;padding:0;box-sizing:border-box;">
            <div style="width:${cardWidth}px;margin:0 auto;background:#0d0d18;overflow:hidden;">

                <!-- TOP BAR -->
                <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 40px;background:rgba(0,0,0,0.5);border-bottom:2px solid rgba(${accentRgb},0.25);">
                    <div style="font-size:1.6rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#fff;">K0TAMB APP</div>
                    <div style="background:${accent};color:#fff;font-size:0.9rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase;padding:10px 28px;border-radius:8px;">MATCH RESULT</div>
                </div>

                <!-- SCORE HEADER + META -->
                <div style="padding:10px 40px 8px;background:linear-gradient(180deg,rgba(${accentRgb},0.07) 0%,transparent 100%);">
                    <!-- Score row -->
                    <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;column-gap:26px;padding:22px 0 10px;">
                        <div style="font-size:2rem;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#fff;text-align:left;">
                            ${results.team1Name}
                        </div>
                        <div style="display:flex;align-items:center;gap:18px;flex-shrink:0;">
                            <span style="font-size:5.5rem;font-weight:900;line-height:1;color:${t1Wins?accent:'rgba(255,255,255,0.25)'};">${results.team1Score}</span>
                            <span style="font-size:2rem;color:rgba(255,255,255,0.2);font-weight:300;">:</span>
                            <span style="font-size:5.5rem;font-weight:900;line-height:1;color:${t2Wins?accent:'rgba(255,255,255,0.25)'};">${results.team2Score}</span>
                        </div>
                        <div style="font-size:2rem;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#fff;text-align:right;">
                            ${results.team2Name}
                        </div>
                    </div>
                    <!-- Meta row: tournament + date + bo -->
                    <div style="display:flex;align-items:center;gap:16px;padding:6px 0 16px;border-bottom:1px solid rgba(255,255,255,0.06);">
                        <div style="font-size:0.8rem;font-weight:700;color:#ccc;letter-spacing:.04em;">${isPractice ? 'PRACTICE GAME' : (results.tournamentName || '')}</div>
                        ${results.format ? `<div style="font-size:0.72rem;color:#555;">·</div><div style="font-size:0.72rem;color:#666;">${results.format}</div>` : ''}
                        ${results.bo ? `<div style="font-size:0.72rem;color:#555;">·</div><div style="font-size:0.72rem;color:#666;">BO${results.bo}</div>` : ''}
                        <div style="font-size:0.72rem;color:#555;">·</div>
                        <div style="font-size:0.72rem;color:#666;">${matchDate}</div>
                    </div>
                </div>

                <!-- MAP PREVIEWS -->
                ${results.maps && results.maps.length > 0 ? `
                <div style="display:flex;gap:14px;padding:16px 40px 20px;justify-content:center;">
                    ${mapPreviewsHtml}
                </div>` : ''}

                <!-- STATS TABLES -->
                <div style="margin:0 28px 28px;background:rgba(255,255,255,0.02);border-radius:16px;border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
                    <!-- Team 1 header -->
                    <div style="background:rgba(${accentRgb},0.13);padding:11px 20px;font-size:0.68rem;letter-spacing:.15em;text-transform:uppercase;font-weight:800;color:${accent};border-bottom:1px solid rgba(255,255,255,0.05);">${results.team1Name}</div>
                    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
                        ${colGroup}
                        <thead>${tableHeader}</thead>
                        <tbody>${t1Rows}</tbody>
                    </table>
                    <!-- Team 2 header -->
                    <div style="background:rgba(79,195,247,0.09);padding:11px 20px;font-size:0.68rem;letter-spacing:.15em;text-transform:uppercase;font-weight:800;color:#4fc3f7;border-bottom:1px solid rgba(255,255,255,0.05);border-top:1px solid rgba(255,255,255,0.06);">${results.team2Name}</div>
                    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
                        ${colGroup}
                        <thead>${tableHeader}</thead>
                        <tbody>${t2Rows}</tbody>
                    </table>
                </div>

                <!-- FOOTER -->
                <div style="text-align:center;padding:10px 40px 22px;font-size:0.6rem;color:#2a2a3a;letter-spacing:.1em;text-transform:uppercase;">
                    K0TAMB APP &nbsp;·&nbsp; k0tamb
                </div>
            </div>
            </div>
        `;
    }

    function getThemeColors() {
        const theme = currentTheme;
        if (theme === 'orange') {
            return {
                primary: '#ff6b00',
                bgLight: '#f8f8f8',
                tableHeader: '#f5f5f5',
                mvpBgStart: '#fff3e0',
                mvpBgEnd: '#ffe0b2',
                mvpBorder: '#ff9800'
            };
        } else if (theme === 'dark') {
            return {
                primary: '#2c3e50',
                scoreColor: '#ffffff',
                bgLight: '#f5f5f5',
                tableHeader: '#e8e8e8',
                mvpBgStart: '#e8eaf6',
                mvpBgEnd: '#c5cae9',
                mvpBorder: '#3f51b5'
            };
        } else if (theme === 'red') {
            return {
                primary: '#e74c3c',
                bgLight: '#fef2f2',
                tableHeader: '#fde8e8',
                mvpBgStart: '#ffebee',
                mvpBgEnd: '#ffcdd2',
                mvpBorder: '#f44336'
            };
        } else if (theme === 'practice') {
            return {
                primary: '#3498db',
                bgLight: '#f0f8ff',
                tableHeader: '#e6f2ff',
                mvpBgStart: '#e3f2fd',
                mvpBgEnd: '#bbdefb',
                mvpBorder: '#2196f3'
            };
        } else if (theme === 'green') {
            return {
                primary: '#27ae60',
                bgLight: '#f0fdf4',
                tableHeader: '#dcfce7',
                mvpBgStart: '#dcfce7',
                mvpBgEnd: '#bbf7d0',
                mvpBorder: '#22c55e'
            };
        } else if (theme === 'purple') {
            return {
                primary: '#8e44ad',
                bgLight: '#faf5ff',
                tableHeader: '#f3e8ff',
                mvpBgStart: '#f3e8ff',
                mvpBgEnd: '#e9d5ff',
                mvpBorder: '#a855f7'
            };
        } else if (theme === 'cyan') {
            return {
                primary: '#00bcd4',
                bgLight: '#ecfeff',
                tableHeader: '#cffafe',
                mvpBgStart: '#cffafe',
                mvpBgEnd: '#a5f3fc',
                mvpBorder: '#06b6d4'
            };
        } else if (theme === 'gold') {
            return {
                primary: '#f39c12',
                bgLight: '#fffbeb',
                tableHeader: '#fef3c7',
                mvpBgStart: '#fef9c3',
                mvpBgEnd: '#fef08a',
                mvpBorder: '#eab308'
            };
        }
        return {
            primary: '#ff6b00',
            bgLight: '#f8f8f8',
            tableHeader: '#f5f5f5',
            mvpBgStart: '#fff3e0',
            mvpBgEnd: '#ffe0b2',
            mvpBorder: '#ff9800'
        };
    }

    // ================= ГРАФИКИ =================

    function renderCharts(results) {
        const container = document.getElementById('chartsSection');
        if (!container) return;
        container.innerHTML = '';

        const light = document.body.classList.contains('theme-light');
        const tc = {
            text: light ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
            textMuted: light ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
            grid: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)',
            sectionBg: light ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
            border: light ? 'rgba(255,107,0,0.2)' : 'rgba(255,107,0,0.15)',
            labelColor: light ? '#444' : '#ccc',
        };

        results.maps.forEach((map, mapIndex) => {
            if (!map.roundData || map.roundData.length === 0) return;

            const section = document.createElement('div');
            section.style.cssText = `margin-bottom: 40px; background: ${tc.sectionBg}; border-radius: 12px; padding: 20px; border: 1px solid ${tc.border};`;

            const title = document.createElement('div');
            title.style.cssText = 'color: #ff6b00; font-weight: 700; font-size: 1.1rem; margin-bottom: 16px;';
            title.textContent = `📊 Карта ${mapIndex + 1}: ${map.mapName}`;
            section.appendChild(title);

            // --- График счёта по раундам ---
            const scoreLabel = document.createElement('div');
            scoreLabel.style.cssText = `color: ${tc.labelColor}; font-size: 0.85rem; margin-bottom: 8px;`;
            scoreLabel.textContent = 'Счёт по раундам';
            section.appendChild(scoreLabel);

            const scoreCanvas = document.createElement('canvas');
            scoreCanvas.width = 900;
            scoreCanvas.height = 120;
            scoreCanvas.style.cssText = 'width: 100%; height: auto; display: block; margin-bottom: 20px;';
            section.appendChild(scoreCanvas);
            drawScoreChart(scoreCanvas, map.roundData, results.team1Name, results.team2Name, tc);

            // --- График экономики ---
            const econLabel = document.createElement('div');
            econLabel.style.cssText = `color: ${tc.labelColor}; font-size: 0.85rem; margin-bottom: 8px;`;
            econLabel.textContent = 'Экономика по раундам ($)';
            section.appendChild(econLabel);

            const econCanvas = document.createElement('canvas');
            econCanvas.width = 900;
            econCanvas.height = 140;
            econCanvas.style.cssText = 'width: 100%; height: auto; display: block;';
            section.appendChild(econCanvas);
            drawEconChart(econCanvas, map.roundData, results.team1Name, results.team2Name, tc);

            container.appendChild(section);
        });

        // --- K/D игроков по всему матчу ---
        const kdSection = document.createElement('div');
        kdSection.style.cssText = `background: ${tc.sectionBg}; border-radius: 12px; padding: 20px; border: 1px solid ${tc.border};`;
        const kdLabel = document.createElement('div');
        kdLabel.style.cssText = 'color: #ff6b00; font-weight: 700; font-size: 1.1rem; margin-bottom: 16px;';
        kdLabel.textContent = '🎯 K/D игроков';
        kdSection.appendChild(kdLabel);

        const kdCanvas = document.createElement('canvas');
        const totalPlayers = results.team1Stats.length + results.team2Stats.length;
        kdCanvas.width = 900;
        kdCanvas.height = Math.max(160, totalPlayers * 28 + 40);
        kdCanvas.style.cssText = 'width: 100%; height: auto; display: block;';
        kdSection.appendChild(kdCanvas);
        drawKDChart(kdCanvas, results.team1Stats, results.team2Stats, results.team1Name, results.team2Name, tc);
        container.appendChild(kdSection);
    }

    function drawScoreChart(canvas, roundData, t1Name, t2Name, tc) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const PAD = { top: 10, right: 20, bottom: 20, left: 30 };
        const innerW = W - PAD.left - PAD.right;
        const innerH = H - PAD.top - PAD.bottom;
        ctx.clearRect(0, 0, W, H);

        const maxScore = Math.max(...roundData.map(r => Math.max(r.t1Score, r.t2Score)), 1);
        const rounds = roundData.length;

        // Горизонтальные линии сетки
        ctx.strokeStyle = tc.grid;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = PAD.top + innerH - (i / 4) * innerH;
            ctx.beginPath();
            ctx.moveTo(PAD.left, y);
            ctx.lineTo(PAD.left + innerW, y);
            ctx.stroke();
        }

        const xStep = innerW / Math.max(rounds - 1, 1);

        function drawLine(data, color) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.lineJoin = 'round';
            data.forEach((val, i) => {
                const x = PAD.left + i * xStep;
                const y = PAD.top + innerH - (val / maxScore) * innerH;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            });
            ctx.stroke();

            data.forEach((val, i) => {
                const x = PAD.left + i * xStep;
                const y = PAD.top + innerH - (val / maxScore) * innerH;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            });
        }

        drawLine(roundData.map(r => r.t1Score), '#ff6b00');
        drawLine(roundData.map(r => r.t2Score), '#4fc3f7');

        ctx.fillStyle = tc.textMuted;
        ctx.font = '10px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        const step = Math.ceil(rounds / 10);
        roundData.forEach((r, i) => {
            if (i % step === 0 || i === rounds - 1) {
                const x = PAD.left + i * xStep;
                ctx.fillText(r.round, x, H - 4);
            }
        });

        ctx.textAlign = 'left';
        ctx.fillStyle = '#ff6b00';
        ctx.fillRect(PAD.left, PAD.top, 12, 4);
        ctx.fillStyle = tc.text;
        ctx.font = '11px Montserrat, sans-serif';
        ctx.fillText(t1Name, PAD.left + 16, PAD.top + 7);

        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(PAD.left + 120, PAD.top, 12, 4);
        ctx.fillStyle = tc.text;
        ctx.fillText(t2Name, PAD.left + 136, PAD.top + 7);
    }

    function drawEconChart(canvas, roundData, t1Name, t2Name, tc) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const PAD = { top: 15, right: 20, bottom: 20, left: 48 };
        const innerW = W - PAD.left - PAD.right;
        const innerH = H - PAD.top - PAD.bottom;
        ctx.clearRect(0, 0, W, H);

        const maxMoney = Math.max(...roundData.map(r => Math.max(r.t1Money, r.t2Money)), 6000);
        const rounds = roundData.length;
        const xStep = innerW / Math.max(rounds - 1, 1);

        ctx.strokeStyle = tc.grid;
        ctx.lineWidth = 1;
        [0, 2000, 4000, 6000, 8000].forEach(val => {
            if (val > maxMoney * 1.1) return;
            const y = PAD.top + innerH - (val / maxMoney) * innerH;
            ctx.beginPath();
            ctx.moveTo(PAD.left, y);
            ctx.lineTo(PAD.left + innerW, y);
            ctx.stroke();
            ctx.fillStyle = tc.textMuted;
            ctx.font = '9px Montserrat, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('$' + val.toLocaleString(), PAD.left - 4, y + 3);
        });

        function drawArea(data, color) {
            ctx.beginPath();
            ctx.moveTo(PAD.left, PAD.top + innerH);
            data.forEach((val, i) => {
                const x = PAD.left + i * xStep;
                const y = PAD.top + innerH - (val / maxMoney) * innerH;
                ctx.lineTo(x, y);
            });
            ctx.lineTo(PAD.left + (data.length - 1) * xStep, PAD.top + innerH);
            ctx.closePath();
            ctx.fillStyle = color.replace(')', ', 0.15)').replace('rgb', 'rgba');
            ctx.fill();

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            data.forEach((val, i) => {
                const x = PAD.left + i * xStep;
                const y = PAD.top + innerH - (val / maxMoney) * innerH;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            });
            ctx.stroke();
        }

        drawArea(roundData.map(r => r.t1Money), 'rgb(255, 107, 0)');
        drawArea(roundData.map(r => r.t2Money), 'rgb(79, 195, 247)');

        ctx.fillStyle = tc.textMuted;
        ctx.font = '10px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        const step = Math.ceil(rounds / 10);
        roundData.forEach((r, i) => {
            if (i % step === 0 || i === rounds - 1) {
                ctx.fillText(r.round, PAD.left + i * xStep, H - 4);
            }
        });

        ctx.textAlign = 'left';
        ctx.fillStyle = '#ff6b00';
        ctx.fillRect(PAD.left, 2, 12, 4);
        ctx.fillStyle = tc.text;
        ctx.font = '11px Montserrat, sans-serif';
        ctx.fillText(t1Name, PAD.left + 16, 9);
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(PAD.left + 120, 2, 12, 4);
        ctx.fillStyle = tc.text;
        ctx.fillText(t2Name, PAD.left + 136, 9);
    }

    function drawKDChart(canvas, team1Stats, team2Stats, t1Name, t2Name, tc) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const PAD = { top: 20, right: 80, bottom: 10, left: 130 };
        const innerW = W - PAD.left - PAD.right;
        const innerH = H - PAD.top - PAD.bottom;
        ctx.clearRect(0, 0, W, H);

        const allPlayers = [
            ...team1Stats.map(p => ({ ...p, team: 1 })),
            ...team2Stats.map(p => ({ ...p, team: 2 }))
        ].sort((a, b) => parseFloat(b.kd) - parseFloat(a.kd));

        const maxKD = Math.max(...allPlayers.map(p => parseFloat(p.kd)), 2);
        const barH = Math.floor(innerH / allPlayers.length) - 4;
        const barStep = innerH / allPlayers.length;

        ctx.strokeStyle = tc.grid;
        ctx.lineWidth = 1;
        [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0].forEach(val => {
            if (val > maxKD * 1.1) return;
            const x = PAD.left + (val / maxKD) * innerW;
            ctx.beginPath();
            ctx.moveTo(x, PAD.top);
            ctx.lineTo(x, PAD.top + innerH);
            ctx.stroke();
            ctx.fillStyle = val === 1.0 ? tc.text : tc.textMuted;
            ctx.font = '10px Montserrat, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(val.toFixed(1), x, PAD.top - 6);
        });

        const line1x = PAD.left + (1.0 / maxKD) * innerW;
        ctx.strokeStyle = tc.grid;
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(line1x, PAD.top);
        ctx.lineTo(line1x, PAD.top + innerH);
        ctx.stroke();
        ctx.setLineDash([]);

        allPlayers.forEach((player, i) => {
            const kd = parseFloat(player.kd) || 0;
            const y = PAD.top + i * barStep;
            const barWidth = (kd / maxKD) * innerW;
            const color = player.team === 1 ? '#ff6b00' : '#4fc3f7';
            const isPositive = kd >= 1.0;

            const grad = ctx.createLinearGradient(PAD.left, 0, PAD.left + barWidth, 0);
            grad.addColorStop(0, color);
            grad.addColorStop(1, isPositive ? color : '#e74c3c');
            ctx.fillStyle = grad;
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            ctx.roundRect(PAD.left, y + 2, Math.max(barWidth, 2), barH, 3);
            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.fillStyle = tc.text;
            ctx.font = `${Math.min(12, barH - 1)}px Montserrat, sans-serif`;
            ctx.textAlign = 'right';
            ctx.fillText(player.nickname, PAD.left - 6, y + barH / 2 + 4);

            ctx.fillStyle = isPositive ? '#4caf50' : '#ef5350';
            ctx.textAlign = 'left';
            ctx.font = `bold ${Math.min(11, barH - 1)}px Montserrat, sans-serif`;
            ctx.fillText(player.kd, PAD.left + barWidth + 5, y + barH / 2 + 4);

            ctx.fillStyle = tc.textMuted;
            ctx.font = `${Math.min(10, barH - 2)}px Montserrat, sans-serif`;
            ctx.fillText(`${player.kills}/${player.deaths}`, PAD.left + barWidth + 38, y + barH / 2 + 4);
        });

        ctx.fillStyle = '#ff6b00';
        ctx.fillRect(PAD.left, 4, 10, 4);
        ctx.fillStyle = tc.text;
        ctx.font = '11px Montserrat, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(t1Name, PAD.left + 14, 11);
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(PAD.left + 130, 4, 10, 4);
        ctx.fillStyle = tc.text;
        ctx.fillText(t2Name, PAD.left + 144, 11);
    }

    // ================= СРАВНЕНИЕ ИГРОКОВ =================

    function renderCompareSection(results) {
        const container = document.getElementById('compareSection');
        if (!container) return;
        if (isCS2Mode()) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }
        container.style.display = '';

        const light = document.body.classList.contains('theme-light');
        const bg = light ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
        const border = light ? 'rgba(255,107,0,0.2)' : 'rgba(255,107,0,0.15)';
        const selectBg = light ? '#fff' : '#1a1a2e';
        const selectColor = light ? '#222' : 'white';
        const selectBorder = light ? 'rgba(255,107,0,0.5)' : 'rgba(255,107,0,0.4)';

        const allPlayers = [
            ...results.team1Stats.map(p => ({ ...p, teamName: results.team1Name })),
            ...results.team2Stats.map(p => ({ ...p, teamName: results.team2Name }))
        ];

        container.innerHTML = `
            <div style="background: ${bg}; border-radius: 12px; padding: 20px; border: 1px solid ${border};">
                <div style="color: #ff6b00; font-weight: 700; font-size: 1.1rem; margin-bottom: 16px;">⚔️ Сравнение игроков</div>
                <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 20px;">
                    <select id="comparePlayer1" style="flex: 1; min-width: 140px; background: ${selectBg}; color: ${selectColor}; border: 1px solid ${selectBorder}; border-radius: 8px; padding: 8px 12px; font-size: 0.9rem;">
                        ${allPlayers.map((p, i) => `<option value="${i}">${p.nickname} (${p.teamName})</option>`).join('')}
                    </select>
                    <div style="color: #ff6b00; font-weight: bold; font-size: 1.2rem;">VS</div>
                    <select id="comparePlayer2" style="flex: 1; min-width: 140px; background: ${selectBg}; color: ${selectColor}; border: 1px solid ${selectBorder}; border-radius: 8px; padding: 8px 12px; font-size: 0.9rem;">
                        ${allPlayers.map((p, i) => `<option value="${i}" ${i === 1 ? 'selected' : ''}>${p.nickname} (${p.teamName})</option>`).join('')}
                    </select>
                    <button id="doCompare" class="btn btn-primary" style="padding: 8px 20px;">Сравнить</button>
                </div>
                <div id="comparePhotoBtn" style="display:none; margin-bottom: 10px; text-align: right;">
                    <button id="downloadComparePhoto" class="btn btn-secondary" style="font-size:0.85rem;">📷 Скачать фото сравнения</button>
                </div>
                <div id="compareResult"></div>
            </div>
        `;

        document.getElementById('doCompare').addEventListener('click', () => {
            const i1 = parseInt(document.getElementById('comparePlayer1').value, 10);
            const i2 = parseInt(document.getElementById('comparePlayer2').value, 10);
            if (i1 === i2) {
                document.getElementById('compareResult').innerHTML = `<div style="color:${light ? '#666' : '#aaa'}; text-align:center; padding: 16px;">Выберите двух разных игроков</div>`;
                document.getElementById('comparePhotoBtn').style.display = 'none';
                return;
            }
            renderPlayerComparison(allPlayers[i1], allPlayers[i2], light);
            document.getElementById('comparePhotoBtn').style.display = 'block';
        });

        const downloadButton = document.getElementById('downloadComparePhoto');
        if (downloadButton) {
            downloadButton.addEventListener('click', downloadComparePhoto);
        }
    }

    function renderPlayerComparison(p1, p2, light) {
    window._lastComparedPlayers = { p1, p2, light };

    const out = document.getElementById('compareResult');
    if (!out) return;

    const v = x => (typeof x === 'number' ? x : parseFloat(x) || 0);
    const stats = {
        kdr1: v(p1.kd), kdr2: v(p2.kd),
        rating1: v(p1.hltvRating), rating2: v(p2.hltvRating),
        adr1: v(p1.adr), adr2: v(p2.adr),
        kpr1: v(p1.kpr), kpr2: v(p2.kpr),
        dpr1: v(p1.dpr), dpr2: v(p2.dpr),
        kast1: Math.round(v(p1.kast) * 100), kast2: Math.round(v(p2.kast) * 100),
        kdText1: v(p1.kd).toFixed(2), kdText2: v(p2.kd).toFixed(2),
        rText1: v(p1.hltvRating).toFixed(2), rText2: v(p2.hltvRating).toFixed(2),
        adrText1: v(p1.adr).toFixed(0), adrText2: v(p2.adr).toFixed(0),
        kprText1: v(p1.kpr).toFixed(2), kprText2: v(p2.kpr).toFixed(2),
        dprText1: v(p1.dpr).toFixed(2), dprText2: v(p2.dpr).toFixed(2),
        kastText1: Math.round(v(p1.kast) * 100) + '%', kastText2: Math.round(v(p2.kast) * 100) + '%',
    };

    const arrowSymbol = (a, b) => {
        if (Math.abs(a - b) < 0.01) return '';
        return a > b ? '▲' : '▼';
    };
    const arrowColor = (a, b) => {
        if (Math.abs(a - b) < 0.01) return 'transparent';
        return a > b ? '#64ff7f' : '#ff6f6f';
    };

    const photo1 = `players/${(p1.nickname||'').trim()}.png`;
    const photo2 = `players/${(p2.nickname||'').trim()}.png`;
    const defPhoto = 'players/defaultplayer.png';

    out.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px;transform:scale(0.6);transform-origin:top center;margin-bottom:-320px;">
            <div id="compareResultInner" style="position:relative;min-height:800px;width:140%;margin-left:-20%;border-radius:16px;overflow:hidden;background:repeating-linear-gradient(45deg,rgba(255,255,255,0.12),rgba(255,255,255,0.12) 10px,transparent 10px,transparent 20px),linear-gradient(135deg,#d94f5f 0%,#e85875 25%,#be2b52 65%,#a11d3a 100%);">
                <div style="position:absolute;inset:0;z-index:0;border-radius:16px;background:repeating-linear-gradient(45deg,rgba(255,255,255,0.12),rgba(255,255,255,0.12) 10px,transparent 10px,transparent 20px),linear-gradient(135deg,#d94f5f 0%,#e85875 25%,#be2b52 65%,#a11d3a 100%);"></div>
                <div style="position:absolute;top:18px;left:0;right:0;text-align:center;z-index:25;pointer-events:none;">
                    <div style="font-family:'Montserrat','Arial Black','sans-serif';font-size:2.8rem;font-weight:900;text-transform:uppercase;color:#ffffff;letter-spacing:0.12em;text-shadow:0 4px 12px rgba(0,0,0,0.5);">k0tamb app compare</div>
                </div>
                <!-- Left photo - стандартное позиционирование -->
                <div style="position:absolute;bottom:0;left:-20px;z-index:18;height:90%;overflow:visible;">
                    <img src="${photo1}" onerror="this.onerror=null;this.src='${defPhoto}'" style="height:100%;width:auto;display:block;opacity:0.96;">
                </div>
                <!-- Right photo - стандартное позиционирование -->
                <div style="position:absolute;bottom:0;right:-20px;z-index:18;height:90%;overflow:visible;">
                    <img src="${photo2}" onerror="this.onerror=null;this.src='${defPhoto}'" style="height:100%;width:auto;display:block;opacity:0.96;transform:scaleX(-1);">
                </div>
                <div style="position:absolute;left:0;right:0;bottom:0;height:50%;z-index:22;pointer-events:none;background:linear-gradient(to top,rgba(160,20,45,0.97) 0%,rgba(180,25,50,0.88) 30%,rgba(201,30,58,0.60) 60%,rgba(201,30,58,0.0) 100%);"></div>
                <div style="position:absolute;left:16px;bottom:24px;text-align:left;z-index:35;pointer-events:none;">
                    <div style="font-family:'Arial Black','sans-serif';font-size:2.4rem;font-weight:900;letter-spacing:-0.02em;color:#fff;text-shadow:0 3px 10px rgba(0,0,0,0.95);">${escapeHtml(p1.nickname || 'Player 1')}</div>
                    <div style="font-family:'Arial','sans-serif';font-size:1.05rem;color:rgba(255,255,255,0.95);font-weight:600;letter-spacing:0.03em;">${escapeHtml(p1.teamName||'Team')}</div>
                </div>
                <div style="position:absolute;right:16px;bottom:24px;text-align:right;z-index:35;pointer-events:none;">
                    <div style="font-family:'Arial Black','sans-serif';font-size:2.4rem;font-weight:900;letter-spacing:-0.02em;color:#fff;text-shadow:0 3px 10px rgba(0,0,0,0.95);">${escapeHtml(p2.nickname || 'Player 2')}</div>
                    <div style="font-family:'Arial','sans-serif';font-size:1.05rem;color:rgba(255,255,255,0.95);font-weight:600;letter-spacing:0.03em;">${escapeHtml(p2.teamName||'Team')}</div>
                </div>
                <!-- Центральная таблица с статистикой (остаётся без изменений) -->
                <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(430px,76%);background:rgba(22,15,35,0.92);box-shadow:0 40px 100px rgba(0,0,0,0.95);border-radius:14px;padding:20px;z-index:30;backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);">
                    <div style="display:flex;flex-direction:column;gap:0;">
                        <!-- Rating -->
                        <div style="display:grid;grid-template-columns:0.65fr auto 1.1fr auto 0.65fr;gap:0;align-items:center;padding:13px 16px;background:rgba(255,255,255,0.06);font-family:'Montserrat',sans-serif;color:#ffffff;border-radius:7px;margin-bottom:8px;">
                            <span style="text-align:right;font-size:1.5rem;font-weight:900;">${stats.rText1}</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.rating1, stats.rating2)};">${arrowSymbol(stats.rating1, stats.rating2)}</span>
                            <span style="text-align:center;font-size:0.85rem;font-weight:800;letter-spacing:0.12em;">RATING</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.rating2, stats.rating1)};">${arrowSymbol(stats.rating2, stats.rating1)}</span>
                            <span style="text-align:left;font-size:1.5rem;font-weight:900;">${stats.rText2}</span>
                        </div>
                        <!-- ADR -->
                        <div style="display:grid;grid-template-columns:0.65fr auto 1.1fr auto 0.65fr;gap:0;align-items:center;padding:13px 16px;background:rgba(255,255,255,0.15);font-family:'Montserrat',sans-serif;color:#ffffff;border-radius:7px;margin-bottom:8px;">
                            <span style="text-align:right;font-size:1.5rem;font-weight:900;">${stats.adrText1}</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.adr1, stats.adr2)};">${arrowSymbol(stats.adr1, stats.adr2)}</span>
                            <span style="text-align:center;font-size:0.85rem;font-weight:800;letter-spacing:0.12em;">ADR</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.adr2, stats.adr1)};">${arrowSymbol(stats.adr2, stats.adr1)}</span>
                            <span style="text-align:left;font-size:1.5rem;font-weight:900;">${stats.adrText2}</span>
                        </div>
                        <!-- K/D -->
                        <div style="display:grid;grid-template-columns:0.65fr auto 1.1fr auto 0.65fr;gap:0;align-items:center;padding:13px 16px;background:rgba(255,255,255,0.06);font-family:'Montserrat',sans-serif;color:#ffffff;border-radius:7px;margin-bottom:8px;">
                            <span style="text-align:right;font-size:1.5rem;font-weight:900;">${stats.kdText1}</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.kdr1, stats.kdr2)};">${arrowSymbol(stats.kdr1, stats.kdr2)}</span>
                            <span style="text-align:center;font-size:0.85rem;font-weight:800;letter-spacing:0.12em;">K/D</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.kdr2, stats.kdr1)};">${arrowSymbol(stats.kdr2, stats.kdr1)}</span>
                            <span style="text-align:left;font-size:1.5rem;font-weight:900;">${stats.kdText2}</span>
                        </div>
                        <!-- KPR -->
                        <div style="display:grid;grid-template-columns:0.65fr auto 1.1fr auto 0.65fr;gap:0;align-items:center;padding:13px 16px;background:rgba(255,255,255,0.15);font-family:'Montserrat',sans-serif;color:#ffffff;border-radius:7px;margin-bottom:8px;">
                            <span style="text-align:right;font-size:1.5rem;font-weight:900;">${stats.kprText1}</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.kpr1, stats.kpr2)};">${arrowSymbol(stats.kpr1, stats.kpr2)}</span>
                            <span style="text-align:center;font-size:0.85rem;font-weight:800;letter-spacing:0.12em;">KPR</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.kpr2, stats.kpr1)};">${arrowSymbol(stats.kpr2, stats.kpr1)}</span>
                            <span style="text-align:left;font-size:1.5rem;font-weight:900;">${stats.kprText2}</span>
                        </div>
                        <!-- DPR -->
                        <div style="display:grid;grid-template-columns:0.65fr auto 1.1fr auto 0.65fr;gap:0;align-items:center;padding:13px 16px;background:rgba(255,255,255,0.06);font-family:'Montserrat',sans-serif;color:#ffffff;border-radius:7px;margin-bottom:8px;">
                            <span style="text-align:right;font-size:1.5rem;font-weight:900;">${stats.dprText1}</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.dpr2, stats.dpr1)};">${arrowSymbol(stats.dpr2, stats.dpr1)}</span>
                            <span style="text-align:center;font-size:0.85rem;font-weight:800;letter-spacing:0.12em;">DPR</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.dpr1, stats.dpr2)};">${arrowSymbol(stats.dpr1, stats.dpr2)}</span>
                            <span style="text-align:left;font-size:1.5rem;font-weight:900;">${stats.dprText2}</span>
                        </div>
                        <!-- KAST -->
                        <div style="display:grid;grid-template-columns:0.65fr auto 1.1fr auto 0.65fr;gap:0;align-items:center;padding:13px 16px;background:rgba(255,255,255,0.15);font-family:'Montserrat',sans-serif;color:#ffffff;border-radius:7px;">
                            <span style="text-align:right;font-size:1.5rem;font-weight:900;">${stats.kastText1}</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.kast1, stats.kast2)};">${arrowSymbol(stats.kast1, stats.kast2)}</span>
                            <span style="text-align:center;font-size:0.85rem;font-weight:800;letter-spacing:0.12em;">KAST</span>
                            <span style="text-align:center;width:26px;font-size:1rem;color:${arrowColor(stats.kast2, stats.kast1)};">${arrowSymbol(stats.kast2, stats.kast1)}</span>
                            <span style="text-align:left;font-size:1.5rem;font-weight:900;">${stats.kastText2}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

    function downloadComparePhoto() {
        const compared = window._lastComparedPlayers;
        if (!compared) { showAlert('Сначала нажмите «Сравнить»'); return; }

        const p1 = compared.p1, p2 = compared.p2;
        const p1name = (p1 && p1.nickname) ? p1.nickname.trim() : 'P1';
        const p2name = (p2 && p2.nickname) ? p2.nickname.trim() : 'P2';
        const p1team = (p1 && p1.teamName) ? p1.teamName : '';
        const p2team = (p2 && p2.teamName) ? p2.teamName : '';
        const isS1ndy1 = false;
        const isS1ndy2 = false;
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');

        const v = x => (typeof x === 'number' ? x : parseFloat(x) || 0);
        const rows = [
            { label:'RATING', v1:v(p1.hltvRating), v2:v(p2.hltvRating), fmt:x=>x.toFixed(2), invert:false },
            { label:'ADR',    v1:v(p1.adr),        v2:v(p2.adr),        fmt:x=>x.toFixed(0),  invert:false },
            { label:'K/D',    v1:v(p1.kd),         v2:v(p2.kd),         fmt:x=>x.toFixed(2),  invert:false },
            { label:'KPR',    v1:v(p1.kpr),        v2:v(p2.kpr),        fmt:x=>x.toFixed(2),  invert:false },
            { label:'DPR',    v1:v(p1.dpr),        v2:v(p2.dpr),        fmt:x=>x.toFixed(2),  invert:true  },
            { label:'KAST',   v1:Math.round(v(p1.kast)*100), v2:Math.round(v(p2.kast)*100), fmt:x=>x+'%', invert:false },
        ];

        const W = 1400, H = 780;
        const canvas = document.createElement('canvas');
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext('2d');

        function loadImg(src, fallback) {
            return new Promise(res => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => res(img);
                img.onerror = () => {
                    if (fallback && src !== fallback) {
                        const fb = new Image();
                        fb.crossOrigin = 'anonymous';
                        fb.onload = () => res(fb);
                        fb.onerror = () => res(null);
                        fb.src = fallback;
                    } else res(null);
                };
                img.src = src;
            });
        }

        const defPhoto = baseUrl + 'players/defaultplayer.png';
        Promise.all([
            loadImg(baseUrl + `players/${encodeURIComponent(p1name)}.png`, defPhoto),
            loadImg(baseUrl + `players/${encodeURIComponent(p2name)}.png`, defPhoto)
        ]).then(([img1, img2]) => {

            // --- Фон: красный градиент ---
            const grad = ctx.createLinearGradient(0, 0, W, H);
            grad.addColorStop(0,    '#d94f5f');
            grad.addColorStop(0.25, '#e85875');
            grad.addColorStop(0.65, '#be2b52');
            grad.addColorStop(1,    '#a11d3a');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);

            // --- Диагональный узор ---
            ctx.save();
            ctx.globalAlpha = 0.12;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            for (let i = -H; i < W + H; i += 28) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + H, H);
                ctx.stroke();
            }
            ctx.restore();

            // --- Игрок 1 (слева) ---
            if (img1) {
                const maxH = H * 0.88;
                const maxW = W * 0.42;
                const scale = Math.min(maxH / img1.height, maxW / img1.width);
                const iw = img1.width * scale, ih = img1.height * scale;
                const ix = isS1ndy1 ? -iw * 0.12 : -10;
                ctx.drawImage(img1, ix, H - ih, iw, ih);
            }

            // --- Игрок 2 (справа, зеркально если не s1ndy) ---
            if (img2) {
                const maxH = H * 0.88;
                const maxW = W * 0.42;
                const scale = Math.min(maxH / img2.height, maxW / img2.width);
                const iw = img2.width * scale, ih = img2.height * scale;
                ctx.save();
                if (isS1ndy2) {
                    ctx.drawImage(img2, W - iw + iw * 0.12, H - ih, iw, ih);
                } else {
                    ctx.translate(W + 10, H - ih);
                    ctx.scale(-1, 1);
                    ctx.drawImage(img2, 0, 0, iw, ih);
                }
                ctx.restore();
            }

            // --- Красное затемнение снизу ---
            const redGrad = ctx.createLinearGradient(0, H * 0.45, 0, H);
            redGrad.addColorStop(0,   'rgba(160,20,45,0)');
            redGrad.addColorStop(0.4, 'rgba(160,20,45,0.65)');
            redGrad.addColorStop(1,   'rgba(140,15,38,0.97)');
            ctx.fillStyle = redGrad;
            ctx.fillRect(0, H * 0.45, W, H * 0.55);

            // --- Заголовок ---
            ctx.save();
            ctx.font = '900 58px Montserrat, Arial Black, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 14;
            ctx.fillText('K0TAMB APP COMPARE', W / 2, 72);
            ctx.restore();

            // --- Центральная таблица ---
            const tW = 370, rowH = 56, rowGap = 7;
            const tH = rows.length * (rowH + rowGap) - rowGap;
            const tX = (W - tW) / 2;
            const tY = (H - tH) / 2 - 10;

            // Фон таблицы
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 50;
            roundRect(ctx, tX - 22, tY - 22, tW + 44, tH + 44, 14);
            ctx.fillStyle = 'rgba(22,15,35,0.92)';
            ctx.fill();
            ctx.restore();

            // Строки таблицы
            rows.forEach((row, i) => {
                const ry = tY + i * (rowH + rowGap);
                const even = i % 2 === 0;
                roundRect(ctx, tX, ry, tW, rowH, 7);
                ctx.fillStyle = even ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)';
                ctx.fill();

                const diff = row.v1 - row.v2;
                const eps = 0.009;
                const better1 = row.invert ? diff < -eps : diff > eps;
                const better2 = row.invert ? diff > eps  : diff < -eps;
                const c1 = Math.abs(diff)<eps ? '#fff' : better1 ? '#64ff7f' : '#ff6f6f';
                const c2 = Math.abs(diff)<eps ? '#fff' : better2 ? '#64ff7f' : '#ff6f6f';
                const a1 = Math.abs(diff)<eps ? '' : better1 ? '▲ ' : '▼ ';
                const a2 = Math.abs(diff)<eps ? '' : better2 ? '▲ ' : '▼ ';

                const cy = ry + rowH / 2 + 10;
                const cyLabel = ry + rowH / 2 + 5;

                // значение 1
                ctx.save();
                ctx.font = '900 28px Montserrat, Arial, sans-serif';
                ctx.fillStyle = c1;
                ctx.textAlign = 'right';
                ctx.fillText(a1 + row.fmt(row.v1), tX + tW * 0.38, cy);
                ctx.restore();

                // лейбл
                ctx.save();
                ctx.font = '800 15px Montserrat, Arial, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText(row.label, tX + tW / 2, cyLabel);
                ctx.restore();

                // значение 2
                ctx.save();
                ctx.font = '900 28px Montserrat, Arial, sans-serif';
                ctx.fillStyle = c2;
                ctx.textAlign = 'left';
                ctx.fillText(a2 + row.fmt(row.v2), tX + tW * 0.62, cy);
                ctx.restore();
            });

            // --- Ники ---
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.95)';
            ctx.shadowBlur = 10;
            ctx.font = '900 46px Arial Black, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.fillText(p1name, 20, H - 52);
            ctx.font = '600 22px Arial, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.fillText(p1team, 22, H - 22);
            ctx.restore();

            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.95)';
            ctx.shadowBlur = 10;
            ctx.font = '900 46px Arial Black, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'right';
            ctx.fillText(p2name, W - 20, H - 52);
            ctx.font = '600 22px Arial, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.fillText(p2team, W - 22, H - 22);
            ctx.restore();

            // --- Скачать ---
            const link = document.createElement('a');
            link.download = `compare_${p1name}_vs_${p2name}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        function roundRect(ctx, x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x+r, y);
            ctx.lineTo(x+w-r, y);
            ctx.quadraticCurveTo(x+w, y, x+w, y+r);
            ctx.lineTo(x+w, y+h-r);
            ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
            ctx.lineTo(x+r, y+h);
            ctx.quadraticCurveTo(x, y+h, x, y+h-r);
            ctx.lineTo(x, y+r);
            ctx.quadraticCurveTo(x, y, x+r, y);
            ctx.closePath();
        }
    }

    // ================= ГЛОБАЛЬНАЯ СТАТИСТИКА =================

    function saveGlobalPlayerStats(results) {
        // CS2 режим — статистика за всё время не сохраняется
        if (isCS2Mode()) return;
        // Выключено по умолчанию — включается только паролем
        if (safeStorage.getItem('statsTrackingEnabled') !== 'true') return;
        try {
            var stats = JSON.parse(safeStorage.getItem('globalPlayerStats') || '{}');
            var allPlayers = [
                { players: results.team1Stats, teamName: results.team1Name },
                { players: results.team2Stats, teamName: results.team2Name }
            ];
            allPlayers.forEach(function(group) {
                group.players.forEach(function(p) {
                    var nick = (p.nickname || '').trim();
                    if (!nick) return;
                    var key = nick.toLowerCase();
                    if (!stats[key]) {
                        stats[key] = {
                            nickname: nick,
                            teamName: group.teamName,
                            matches: 0,
                            mapsPlayed: 0,
                            kills: 0,
                            deaths: 0,
                            assists: 0,
                            totalRounds: 0,
                            ratingSum: 0,
                            adrSum: 0,
                            kastSum: 0
                        };
                    }
                    var s = stats[key];
                    s.nickname = nick;
                    s.teamName = group.teamName;
                    s.matches += 1;
                    s.mapsPlayed = (s.mapsPlayed || 0) + Math.max(1, ((results && results.maps) ? results.maps.length : 1));
                    s.kills += (p.kills || 0);
                    s.deaths += (p.deaths || 0);
                    s.assists += (p.assists || 0);
                    s.totalRounds += (p.totalRounds || 0);
                    s.roundsWon = (s.roundsWon || 0) + (p.roundsWon || 0);
                    s.ratingSum += (parseFloat(p.hltvRating) || 0);
                    s.adrSum = (s.adrSum || 0) + ((parseFloat(p.adr) || 0) * (p.totalRounds || 0));
                    s.kastSum = (s.kastSum || 0) + ((parseFloat(p.kast) || 0) * (p.totalRounds || 0));
                });
            });
            safeStorage.setItem('globalPlayerStats', JSON.stringify(stats));
            // Автоматически синхронизируем с облаком если ключи настроены
            pushStatsToCloud(stats);
        } catch (e) {}
    }

    // Удаление статистики матча из globalPlayerStats при удалении сохраненного матча
    window.removeMatchFromStats = function(matchData) {
        if (isCS2Mode()) return;
        if (safeStorage.getItem('statsTrackingEnabled') !== 'true') return;
        try {
            var stats = JSON.parse(safeStorage.getItem('globalPlayerStats') || '{}');
            var allPlayers = [
                { players: matchData.team1Stats, teamName: matchData.team1Name },
                { players: matchData.team2Stats, teamName: matchData.team2Name }
            ];
            allPlayers.forEach(function(group) {
                group.players.forEach(function(p) {
                    var nick = (p.nickname || '').trim();
                    if (!nick) return;
                    var key = nick.toLowerCase();
                    if (!stats[key]) return;
                    var s = stats[key];
                    s.matches = Math.max(0, (s.matches || 0) - 1);
                    s.mapsPlayed = Math.max(0, (s.mapsPlayed || 0) - Math.max(1, ((matchData && matchData.maps) ? matchData.maps.length : 1)));
                    s.kills = Math.max(0, (s.kills || 0) - (p.kills || 0));
                    s.deaths = Math.max(0, (s.deaths || 0) - (p.deaths || 0));
                    s.assists = Math.max(0, (s.assists || 0) - (p.assists || 0));
                    s.totalRounds = Math.max(0, (s.totalRounds || 0) - (p.totalRounds || 0));
                    s.roundsWon = Math.max(0, (s.roundsWon || 0) - (p.roundsWon || 0));
                    s.ratingSum = Math.max(0, (s.ratingSum || 0) - (parseFloat(p.hltvRating) || 0));
                    s.adrSum = Math.max(0, (s.adrSum || 0) - ((parseFloat(p.adr) || 0) * (p.totalRounds || 0)));
                    s.kastSum = Math.max(0, (s.kastSum || 0) - ((parseFloat(p.kast) || 0) * (p.totalRounds || 0)));
                });
            });
            safeStorage.setItem('globalPlayerStats', JSON.stringify(stats));
            pushStatsToCloud(stats);
        } catch (e) {}
    };

    // Удаление игрока из globalPlayerStats (полное удаление)
    window.deletePlayer = function(playerKey) {
        try {
            if (!playerKey) {
                console.error('deletePlayer: playerKey не передан');
                return false;
            }
            
            var stats = JSON.parse(safeStorage.getItem('globalPlayerStats') || '{}');
            if (!stats || typeof stats !== 'object') {
                console.error('deletePlayer: не удалось загрузить статистику');
                return false;
            }
            
            if (stats[playerKey]) {
                delete stats[playerKey];
                safeStorage.setItem('globalPlayerStats', JSON.stringify(stats));
                pushStatsToCloud(stats);
                console.log('deletePlayer: Игрок ' + playerKey + ' удалён');
                return true;
            } else {
                console.warn('deletePlayer: Игрок ' + playerKey + ' не найден в базе');
                console.log('deletePlayer: Доступные игроки:', Object.keys(stats));
                return false;
            }
        } catch (e) {
            console.error('deletePlayer: Ошибка -', e.message);
            return false;
        }
    };

    // Отправка всех данных в облако (для админки - ranking + stats + history)
    window.pushRankingToCloud = function() {
        var accessKey = localStorage.getItem('cloud_access_key') || '';
        var binId = localStorage.getItem('cloud_bin_id') || '';
        if (!accessKey || !binId) return;
        
        var stats = JSON.parse(safeStorage.getItem('globalPlayerStats') || '{}');
        var matchHistory = JSON.parse(safeStorage.getItem('matchHistory') || '[]');
        var rankingS2 = JSON.parse(localStorage.getItem('rankingS2') || '[]');
        var rankingCS2 = JSON.parse(localStorage.getItem('rankingCS2') || '[]');
        
        var cloudData = {
            globalPlayerStats: stats,
            matchHistory: matchHistory,
            rankingS2: rankingS2,
            rankingCS2: rankingCS2,
            updatedAt: new Date().toISOString()
        };
        
        fetch('https://api.jsonbin.io/v3/b/' + binId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': accessKey
            },
            body: JSON.stringify(cloudData)
        }).catch(function() {});
    };

    // Отправка статистики в JSONBin (тихо, без уведомлений)
    function pushStatsToCloud(stats) {
        var accessKey = localStorage.getItem('cloud_access_key') || '';
        var binId = localStorage.getItem('cloud_bin_id') || '';
        if (!accessKey || !binId) return;
        
        var matchHistory = JSON.parse(safeStorage.getItem('matchHistory') || '[]');
        var rankingS2 = JSON.parse(localStorage.getItem('rankingS2') || '[]');
        var rankingCS2 = JSON.parse(localStorage.getItem('rankingCS2') || '[]');
        var cloudData = {
            globalPlayerStats: stats,
            matchHistory: matchHistory,
            rankingS2: rankingS2,
            rankingCS2: rankingCS2,
            updatedAt: new Date().toISOString()
        };
        
        fetch('https://api.jsonbin.io/v3/b/' + binId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': accessKey
            },
            body: JSON.stringify(cloudData)
        }).catch(function() {});
    }

    // Отправка истории матчей (после удаления) в облако вместе со статистикой
    window.pushMatchHistoryToCloud = function() {
        var accessKey = localStorage.getItem('cloud_access_key') || '';
        var binId = localStorage.getItem('cloud_bin_id') || '';
        if (!accessKey || !binId) return;
        
        var stats = JSON.parse(safeStorage.getItem('globalPlayerStats') || '{}');
        var matchHistory = JSON.parse(safeStorage.getItem('matchHistory') || '[]');
        var rankingS2 = JSON.parse(localStorage.getItem('rankingS2') || '[]');
        var rankingCS2 = JSON.parse(localStorage.getItem('rankingCS2') || '[]');
        var cloudData = {
            globalPlayerStats: stats,
            matchHistory: matchHistory,
            rankingS2: rankingS2,
            rankingCS2: rankingCS2,
            updatedAt: new Date().toISOString()
        };
        
        fetch('https://api.jsonbin.io/v3/b/' + binId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': accessKey
            },
            body: JSON.stringify(cloudData)
        }).catch(function() {});
    };

    // Загрузка статистики из облака
    window.pullStatsFromCloud = function(callback) {
        var accessKey = localStorage.getItem('cloud_access_key') || '';
        var binId = localStorage.getItem('cloud_bin_id') || '';
        if (!accessKey || !binId) { if (callback) callback(false); return; }
        fetch('https://api.jsonbin.io/v3/b/' + binId + '/latest', {
            headers: {
                'X-Access-Key': accessKey
            }
        }).then(function(r) {
            if (!r.ok) return Promise.reject('HTTP ' + r.status);
            return r.json();
        }).then(function(data) {
            var cloudStats = (data.record && data.record.globalPlayerStats) || null;
            var cloudHistory = (data.record && data.record.matchHistory) || null;
            var cloudRankingS2 = (data.record && data.record.rankingS2) || null;
            var cloudRankingCS2 = (data.record && data.record.rankingCS2) || null;
            
            if (cloudStats && Object.keys(cloudStats).length > 0) {
                safeStorage.setItem('globalPlayerStats', JSON.stringify(cloudStats));
            }
            if (cloudHistory && Array.isArray(cloudHistory) && cloudHistory.length > 0) {
                safeStorage.setItem('matchHistory', JSON.stringify(cloudHistory));
            }
            if (cloudRankingS2 && Array.isArray(cloudRankingS2) && cloudRankingS2.length > 0) {
                localStorage.setItem('rankingS2', JSON.stringify(cloudRankingS2));
            }
            if (cloudRankingCS2 && Array.isArray(cloudRankingCS2) && cloudRankingCS2.length > 0) {
                localStorage.setItem('rankingCS2', JSON.stringify(cloudRankingCS2));
            }
            if (callback) callback(true);
        }).catch(function(e) {
            // Cloud pull failed
            if (callback) callback(false);
        });
    };

    // Расчёт изменения RP на основе рангов команд и количества выигранных карт
    window.calculateRPChange = function(winnerRankPos, loserRankPos, mapsWon, isWinner) {
        var baseRP = 16;
        var rankDiff = loserRankPos - winnerRankPos;
        var multiplier = 1.0;

        if (rankDiff > 0) {
            // Победа андердога: награда немного больше
            multiplier = 1.0 + Math.min(rankDiff * 0.03, 0.35);
        } else if (rankDiff < 0) {
            // Победа фаворита: награда чуть меньше
            multiplier = 1.0 + Math.max(rankDiff * 0.02, -0.20);
        }

        multiplier = Math.max(0.75, Math.min(1.4, multiplier));
        var change = Math.round(baseRP * multiplier);

        var mapBonus = 0;
        if (isWinner) {
            mapBonus = Math.max(0, mapsWon - 1) * 3; // +3 RP за каждую дополнительную карту
        }

        return isWinner ? (change + mapBonus) : -change;
    };

    // Получить позицию команды в рейтинге
    window.getTeamRankPosition = function(teamName, mapCode) {
        var storageKey = (mapCode && mapCode.toLowerCase() === 'cs2') ? 'rankingCS2' : 'rankingS2';
        var ranking = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // Сортируем по RP (высокое = лучше = позиция 1)
        ranking.sort(function(a, b) { return b.rp - a.rp; });
        
        for (var i = 0; i < ranking.length; i++) {
            if (ranking[i].name === teamName) {
                return i + 1; // позиция 1-based
            }
        }
        return ranking.length + 1; // если команды нет в рейтинге
    };

    // Показ модального окна с прогнозом RP перед матчем
    window.showRPChangeModal = function(team1Name, team2Name, mapCode, callback) {
        // Проверяем, включён ли режим Ranking
        if (localStorage.getItem('rankingModeEnabled') !== 'true') {
            if (callback) callback(true); // Пропускаем, если режим отключен
            return;
        }
        
        var team1Pos = getTeamRankPosition(team1Name, mapCode);
        var team2Pos = getTeamRankPosition(team2Name, mapCode);
        
        // Прогнозируем RP изменения при 2 картах (типичный результат)
        var team1ChangeWin = calculateRPChange(team1Pos, team2Pos, 2, true);
        var team1ChangeLose = calculateRPChange(team1Pos, team2Pos, 0, false);
        var team2ChangeWin = calculateRPChange(team2Pos, team1Pos, 2, true);
        var team2ChangeLose = calculateRPChange(team2Pos, team1Pos, 0, false);
        
        // Создаём модальное окно
        var modal = document.createElement('div');
        modal.id = 'rpChangeModal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:10000;';
        
        var content = document.createElement('div');
        content.style.cssText = 'background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid #ff6b00;border-radius:16px;padding:24px;max-width:600px;width:90%;color:#fff;box-shadow:0 8px 32px rgba(0,0,0,0.5);';
        
        var titleEl = document.createElement('h2');
        titleEl.textContent = '📊 Прогноз изменения Ranking Points';
        titleEl.style.cssText = 'margin:0 0 20px 0;color:#ff9500;text-align:center;font-size:18px;';
        
        var team1HTML = '<div style="background:rgba(255,107,0,0.1);border:1px solid rgba(255,107,0,0.3);border-radius:8px;padding:12px;margin-bottom:12px;">' +
            '<div style="color:#ffc107;font-weight:700;font-size:14px;">👤 ' + (team1Name || 'Команда 1') + ' (Позиция: #' + team1Pos + ')</div>' +
            '<div style="display:flex;justify-content:space-around;margin-top:8px;font-size:13px;">' +
            '<div>✅ Победа: <span style="color:#4ade80;font-weight:700;">+' + team1ChangeWin + ' RP</span></div>' +
            '<div>❌ Поражение: <span style="color:#f87171;font-weight:700;">-' + Math.abs(team1ChangeLose) + ' RP</span></div>' +
            '</div>' +
            '</div>';
        
        var team2HTML = '<div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:8px;padding:12px;margin-bottom:16px;">' +
            '<div style="color:#60a5fa;font-weight:700;font-size:14px;">👤 ' + (team2Name || 'Команда 2') + ' (Позиция: #' + team2Pos + ')</div>' +
            '<div style="display:flex;justify-content:space-around;margin-top:8px;font-size:13px;">' +
            '<div>✅ Победа: <span style="color:#4ade80;font-weight:700;">+' + team2ChangeWin + ' RP</span></div>' +
            '<div>❌ Поражение: <span style="color:#f87171;font-weight:700;">-' + Math.abs(team2ChangeLose) + ' RP</span></div>' +
            '</div>' +
            '</div>';
        
        var helpEl = document.createElement('div');
        helpEl.style.cssText = 'background:rgba(255,255,255,0.05);border-left:3px solid #ff9500;padding:8px 12px;margin-bottom:16px;font-size:12px;color:rgba(255,255,255,0.7);';
        helpEl.innerHTML = '⚡ RP изменения рассчитаны на основе разницы рангов и силы противника. Победа с преимуществом даёт немного больше RP, а ожидаемая победа — меньше.';
        
        var buttonsDiv = document.createElement('div');
        buttonsDiv.style.cssText = 'display:flex;gap:12px;justify-content:flex-end;';
        
        var confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Начать матч';
        confirmBtn.style.cssText = 'padding:10px 20px;background:linear-gradient(135deg,#ff6b00,#ff9500);border:none;border-radius:8px;color:#fff;cursor:pointer;font-weight:700;font-size:14px;';
        confirmBtn.onclick = function() {
            modal.remove();
            if (callback) callback(true);
        };
        
        var cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Отмена';
        cancelBtn.style.cssText = 'padding:10px 20px;background:transparent;border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;cursor:pointer;font-weight:700;font-size:14px;';
        cancelBtn.onclick = function() {
            modal.remove();
            if (callback) callback(false);
        };
        
        buttonsDiv.appendChild(cancelBtn);
        buttonsDiv.appendChild(confirmBtn);
        
        content.innerHTML = titleEl.outerHTML + team1HTML + team2HTML + helpEl.outerHTML;
        content.appendChild(buttonsDiv);
        modal.appendChild(content);
        document.body.appendChild(modal);
    };

    // Обновление RP команд после матча и синхронизация в облако
    window.updateTeamRPAfterMatch = function(winnerTeamName, loserTeamName, mapsWon, mapCode) {
        if (localStorage.getItem('rankingModeEnabled') !== 'true' || !winnerTeamName || !loserTeamName) return;
        
        var storageKey = (mapCode && mapCode.toLowerCase() === 'cs2') ? 'rankingCS2' : 'rankingS2';
        var ranking = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        var winnerPos = 0, loserPos = 0;
        var winner = null, loser = null;
        
        // Находим команды и их позиции
        ranking.sort(function(a, b) { return b.rp - a.rp; });
        for (var i = 0; i < ranking.length; i++) {
            if (ranking[i].name === winnerTeamName) {
                winner = ranking[i];
                winnerPos = i + 1;
            }
            if (ranking[i].name === loserTeamName) {
                loser = ranking[i];
                loserPos = i + 1;
            }
        }
        
        // Если команды нет в рейтинге, добавляем с дефолтной RP
        if (!winner) {
            winner = { id: Date.now().toString() + '1', name: winnerTeamName, rp: 1000 };
            ranking.push(winner);
            winnerPos = ranking.length;
        }
        if (!loser) {
            loser = { id: Date.now().toString() + '2', name: loserTeamName, rp: 1000 };
            ranking.push(loser);
            loserPos = ranking.length;
        }
        
        // Вычисляем изменения
        var rpChange = calculateRPChange(winnerPos, loserPos, mapsWon, true);
        
        winner.rp = Math.max(1, winner.rp + rpChange); // Минимум 1 RP
        loser.rp = Math.max(1, loser.rp - rpChange);
        
        // Сохраняем в localStorage
        localStorage.setItem(storageKey, JSON.stringify(ranking));
        
        // Синхронизируем в облако
        if (typeof pushRankingToCloud === 'function') {
            pushRankingToCloud();
        }
        
        // Возвращаем информацию об изменениях для уведомления
        return {
            winnerRPChange: rpChange,
            winner: winnerTeamName,
            loser: loserTeamName,
            winnerNewRP: winner.rp,
            loserNewRP: loser.rp
        };
    };

    function renderGlobalStats() {
        var container = document.getElementById('globalStatsContent');
        if (!container) return;
        // В CS2 режиме — статистика недоступна
        if (isCS2Mode()) {
            container.innerHTML = '<div style="text-align:center;padding:40px;color:#888;">📊 Глобальная статистика недоступна в режиме CS2.</div>';
            return;
        }

        // Date range controls (show all time by default)
        var controlsHtml = '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:12px;">' +
            '<label style="color:rgba(255,255,255,0.8);font-weight:600;">Показать с:</label>' +
            '<input type="date" id="gsFrom" style="padding:6px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);color:#fff;">' +
            '<label style="color:rgba(255,255,255,0.8);font-weight:600;">по:</label>' +
            '<input type="date" id="gsTo" style="padding:6px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);color:#fff;">' +
            '<button id="gsApply" style="padding:8px 12px;border-radius:8px;background:linear-gradient(135deg,#ff6b00,#ff9500);border:none;color:#fff;cursor:pointer;font-weight:700;">Применить</button>' +
            '<button id="gsReset" style="padding:8px 12px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.08);color:#fff;cursor:pointer;font-weight:700;">Сбросить</button>' +
            '</div>';

        container.innerHTML = controlsHtml + '<div id="gsInner"></div>';

        // build dataset: either from aggregated globalPlayerStats (all-time) or from matchHistory filtered by date range
        function computePlayersForRange() {
            var fromVal = document.getElementById('gsFrom').value;
            var toVal = document.getElementById('gsTo').value;
            var useFilter = !!(fromVal || toVal);
            if (!useFilter) {
                var stats = {};
                try { stats = JSON.parse(safeStorage.getItem('globalPlayerStats') || '{}'); } catch (e) { stats = {}; }
                return Object.values(stats);
            }

            // load matchHistory and filter by date (AND exclude practice/unofficial matches)
            var history = [];
            try { history = JSON.parse(safeStorage.getItem('matchHistory') || '[]'); } catch (e) { history = []; }
            var fromTs = fromVal ? new Date(fromVal + 'T00:00:00').getTime() : -Infinity;
            var toTs = toVal ? new Date(toVal + 'T23:59:59').getTime() : Infinity;
            var filtered = history.filter(function(m) {
                try {
                    var d = new Date(m.date).getTime();
                    var inDateRange = d >= fromTs && d <= toTs;
                    // Exclude practice matches (when isPractice flag is true)
                    var isNotPractice = !m.isPractice;
                    return inDateRange && isNotPractice;
                } catch(e) { return false; }
            });

            // aggregate per player
            var map = {};
            filtered.forEach(function(match) {
                var seenInThisMatch = {};
                ['team1Stats','team2Stats'].forEach(function(key) {
                    var arr = match[key] || [];
                    arr.forEach(function(p) {
                        if (!p || !p.nickname) return;
                        var nick = p.nickname;
                        if (!map[nick]) map[nick] = { nickname: nick, matches:0, kills:0, deaths:0, assists:0, ratingSum:0, totalRounds:0, roundsWon:0, adrSum:0, kastSum:0, mapsPlayed:0, teamName: p.team || '' };
                        if (!seenInThisMatch[nick]) { map[nick].matches += 1; seenInThisMatch[nick] = true; map[nick].mapsPlayed += 1; }
                        map[nick].kills += Number(p.kills || 0);
                        map[nick].deaths += Number(p.deaths || 0);
                        map[nick].assists += Number(p.assists || 0);
                        // rating estimation: use hltvRating or kd as proxy
                        if (p.hltvRating) map[nick].ratingSum += Number(p.hltvRating || 0);
                        else if (p.kd) map[nick].ratingSum += Number(p.kd || 0);
                        map[nick].totalRounds += Number(p.totalRounds || 0);
                        map[nick].roundsWon += Number(p.roundsWon || 0);
                        map[nick].adrSum += Number(p.adr || 0) * Number(p.totalRounds || 0);
                        map[nick].kastSum += (Number(p.kast || 0) || 0);
                    });
                });
            });
            return Object.keys(map).map(function(k){ return map[k]; });
        }

        function finalizeRender() {
            var players = computePlayersForRange();
            var inner = document.getElementById('gsInner');
            if (!inner) return;
            if (!players || players.length === 0) {
                inner.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#888;">Нет данных в выбранном диапазоне.</div>';
                return;
            }

            // reuse existing table build logic from below: sort by avg rating
            players.sort(function(a,b){
                var rA = a.matches>0 ? (a.ratingSum / a.matches) : 0;
                var rB = b.matches>0 ? (b.ratingSum / b.matches) : 0;
                return rB - rA;
            });

            var html = '<div style="overflow-x:auto;"><table class="gs-table"><thead><tr>' +
                '<th>#</th><th>Игрок</th><th>Матчи</th><th>Убийства</th><th>Смерти</th><th>K/D</th><th>AVG Rating</th>' +
                '</tr></thead><tbody>';
            players.forEach(function(p,i){
                var kd = p.deaths>0 ? (p.kills / p.deaths) : p.kills;
                var kdStr = isNaN(kd)?'—':kd.toFixed(2);
                var avgRating = p.matches>0 ? (p.ratingSum / p.matches) : 0;
                var avgRatingStr = isNaN(avgRating)?'—':avgRating.toFixed(2);
                html += '<tr>' +
                    '<td class="gs-rank">'+(i+1)+'</td>' +
                    '<td><div style="display:flex;align-items:center;gap:10px;">' +
                    '<div style="width:32px;height:32px;border-radius:50%;overflow:hidden;background:rgba(255,107,0,0.08);flex-shrink:0;">' +
                    '<img src="players/'+escapeHtml(p.nickname)+'.png" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src=\'players/defaultplayer.png\'">' +
                    '</div><div><span class="gs-nick">'+escapeHtml(p.nickname)+'</span><div class="gs-team" style="font-size:0.7rem;opacity:0.6;">'+escapeHtml(p.teamName||'')+'</div></div></div></td>' +
                    '<td>'+ (p.matches||0) +'</td>' +
                    '<td>'+ (p.kills||0) +'</td>' +
                    '<td>'+ (p.deaths||0) +'</td>' +
                    '<td>'+ kdStr +'</td>' +
                    '<td style="font-family: Montserrat, sans-serif;">'+ avgRatingStr +'</td>' +
                    '</tr>';
            });
            html += '</tbody></table></div>';
            inner.innerHTML = html;

            // bind click -> show profile
            inner.querySelectorAll('.gs-table tbody tr').forEach(function(tr, idx) {
                tr.addEventListener('click', function() {
                    showPlayerProfile(players[idx]);
                });
            });
        }

        // attach apply/reset handlers
        var applyBtn = document.getElementById('gsApply');
        var resetBtn = document.getElementById('gsReset');
        if (applyBtn) applyBtn.addEventListener('click', function(){ finalizeRender(); });
        if (resetBtn) resetBtn.addEventListener('click', function(){ document.getElementById('gsFrom').value=''; document.getElementById('gsTo').value=''; finalizeRender(); });

        // initial
        finalizeRender();
        return;

        if (players.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#888;">' +
                '<div style="font-size:3rem;margin-bottom:16px;">📭</div>' +
                '<p style="font-size:1.1rem;margin-bottom:8px;">Статистика пока пуста</p>' +
                '<p style="font-size:0.9rem;color:#666;">Включите «Записывать статистику в общий топ» в настройках (⚙) и сыграйте матч.</p></div>';
            return;
        }

        // Сортировка по умолчанию — по среднему рейтингу
        players.sort(function(a, b) {
            var rA = a.matches > 0 ? (a.ratingSum / a.matches) : 0;
            var rB = b.matches > 0 ? (b.ratingSum / b.matches) : 0;
            return rB - rA;
        });

        /* ── Build overall stats card ── */
        var totalKills = 0, totalDeaths = 0, totalMatches = 0, totalRounds = 1;
        players.forEach(function(p) {
            totalKills += p.kills || 0;
            totalDeaths += p.deaths || 0;
            totalMatches += p.matches || 0;
            totalRounds += p.totalRounds || 0;
        });
        
        var overallAvgRating = 0;
        var ratingSum = 0;
        players.forEach(function(p) {
            ratingSum += p.ratingSum || 0;
        });
        overallAvgRating = totalMatches > 0 ? (ratingSum / totalMatches) : 0;
        
        var overallKD = totalDeaths > 0 ? (totalKills / totalDeaths) : totalKills;
        var overallKPR = totalKills / Math.max(totalRounds, 1);
        var overallDPR = totalDeaths / Math.max(totalRounds, 1);
        var overallADR = totalKills > 0 ? Math.round((totalKills * 65) / Math.max(totalMatches, 1)) : 0;
        
        // T/CT рейтинги (приблизительно)
        var nickHash = 0;
        players.forEach(function(p) {
            for (var i = 0; i < p.nickname.length; i++) {
                nickHash = (nickHash * 31 + p.nickname.charCodeAt(i)) & 0xffff;
            }
        });
        var tRating = +(overallAvgRating * (0.93 + (nickHash % 10) * 0.015)).toFixed(2);
        var ctRating = +(overallAvgRating * (1.00 + ((nickHash >> 4) % 10) * 0.012)).toFixed(2);
        
        // Определение цвета для полос (HLTV thresholds)
        var gradeFunc = function(v, thresholds) {
            if (v >= thresholds[0]) return 'great';
            if (v >= thresholds[1]) return 'good';
            if (v >= thresholds[2]) return 'okay';
            if (v >= thresholds[3]) return 'below';
            return 'poor';
        };
        var gradeClassMap = {great:'bar-great',good:'bar-good',okay:'bar-okay',below:'bar-below',poor:'bar-poor'};
        
        var kdGrade = gradeFunc(overallKD, [1.30, 1.10, 1.00, 0.85]);
        var kprGrade = gradeFunc(overallKPR, [0.75, 0.65, 0.55, 0.45]);
        var dprGrade = overallDPR <= 0.55 ? 'great' : (overallDPR <= 0.65 ? 'good' : (overallDPR <= 0.72 ? 'okay' : (overallDPR <= 0.80 ? 'below' : 'poor')));
        var adrGrade = gradeFunc(overallADR, [85, 75, 65, 55]);
        
        var kastr = Math.min(99, Math.max(40, Math.round(55 + (overallKD - 1) * 25)));
        var kastrGrade = gradeFunc(kastr, [65, 55, 50, 40]);
        var wrGrade = gradeFunc(50, [65, 55, 50, 40]); // Приблизительно
        
        var topPlayer = players[0];
        
        // SVG кольцо для рейтинга
        var rRing = 44, rCx = 50, rCy = 50;
        var rCirc = 2 * Math.PI * rRing;
        var rPct = Math.min(overallAvgRating / 2.0, 1.0);
        var rDash = rCirc * rPct;
        var ringColor = overallAvgRating >= 1.10 ? '#4bcd7b' : (overallAvgRating >= 1.10 ? '#8bc34a' : (overallAvgRating >= 1.00 ? '#e8c840' : (overallAvgRating >= 0.90 ? '#ff9800' : '#ef5350')));
        
        var ringSvg = '<svg class="overall-ring-svg" viewBox="0 0 100 100">' +
            '<circle cx="' + rCx + '" cy="' + rCy + '" r="' + rRing + '" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6"/>' +
            '<circle cx="' + rCx + '" cy="' + rCy + '" r="' + rRing + '" fill="none" stroke="' + ringColor + '" stroke-width="6" ' +
                'stroke-dasharray="' + rDash.toFixed(1) + ' ' + (rCirc - rDash).toFixed(1) + '" ' +
                'stroke-dashoffset="' + ((rCirc * 0.25)).toFixed(1) + '" ' +
                'stroke-linecap="round"/>' +
            '</svg>';
        
        var overallCard = `
<div class="overall-stats-card">
    <div class="overall-photo-wrap">
        <div class="overall-stats-photo">
            <img src="players/${escapeHtml(topPlayer.nickname || '')}.png" 
                 onerror="this.onerror=null;this.src='players/defaultplayer.png';" 
                 style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center center;display:block;" 
                 alt="">
        </div>
    </div>
    <div class="overall-stats-content">
        <div class="overall-header">
            <div class="overall-stats-title">Статистика за все время</div>
        </div>
        <div class="overall-rating-section">
            <div class="overall-side-rating">
                <div class="overall-side-val" style="color:#e8c840;">${tRating.toFixed(2)}</div>
                <div class="overall-side-lbl">T Rating</div>
            </div>
            <div class="overall-center-ring">
                ${ringSvg}
                <div class="overall-center-inner">
                    <div class="overall-grade" style="color:${ringColor};">GOOD</div>
                    <div class="overall-rating-val">${overallAvgRating.toFixed(2)}</div>
                </div>
            </div>
            <div class="overall-side-rating">
                <div class="overall-side-val overall-ct-val">${ctRating.toFixed(2)}</div>
                <div class="overall-side-lbl">CT Rating</div>
            </div>
        </div>
        <div class="overall-metrics-grid">
            <div class="overall-metric-cell">
                <div class="overall-metric-lbl">K/D Ratio</div>
                <div class="overall-metric-val">${overallKD.toFixed(2)}</div>
                <div class="overall-metric-bar-wrap"><div class="overall-metric-bar"><div class="overall-metric-bar-fill ${gradeClassMap[kdGrade]}" style="width:${Math.min(100, Math.round(overallKD / 2 * 100))}%"></div></div></div>
            </div>
            <div class="overall-metric-cell">
                <div class="overall-metric-lbl">KAST</div>
                <div class="overall-metric-val">${kastr}%</div>
                <div class="overall-metric-bar-wrap"><div class="overall-metric-bar"><div class="overall-metric-bar-fill ${gradeClassMap[kastrGrade]}" style="width:${kastr}%"></div></div></div>
            </div>
            <div class="overall-metric-cell">
                <div class="overall-metric-lbl">ADR</div>
                <div class="overall-metric-val">${overallADR}</div>
                <div class="overall-metric-bar-wrap"><div class="overall-metric-bar"><div class="overall-metric-bar-fill ${gradeClassMap[adrGrade]}" style="width:${Math.min(100, Math.round(overallADR / 120 * 100))}%"></div></div></div>
            </div>
            <div class="overall-metric-cell">
                <div class="overall-metric-lbl">DPR</div>
                <div class="overall-metric-val">${overallDPR.toFixed(2)}</div>
                <div class="overall-metric-bar-wrap"><div class="overall-metric-bar"><div class="overall-metric-bar-fill ${gradeClassMap[dprGrade]}" style="width:${Math.min(100, Math.round((1.2 - Math.max(0, overallDPR)) / 1.2 * 100))}%"></div></div></div>
            </div>
            <div class="overall-metric-cell">
                <div class="overall-metric-lbl">KPR</div>
                <div class="overall-metric-val">${overallKPR.toFixed(2)}</div>
                <div class="overall-metric-bar-wrap"><div class="overall-metric-bar"><div class="overall-metric-bar-fill ${gradeClassMap[kprGrade]}" style="width:${Math.min(100, Math.round(overallKPR / 1.0 * 100))}%"></div></div></div>
            </div>
            <div class="overall-metric-cell">
                <div class="overall-metric-lbl">Win Rate</div>
                <div class="overall-metric-val">50%</div>
                <div class="overall-metric-bar-wrap"><div class="overall-metric-bar"><div class="overall-metric-bar-fill ${gradeClassMap[wrGrade]}" style="width:50%"></div></div></div>
            </div>
        </div>
    </div>
</div>`;

        var html = '<div style="overflow-x:auto;"><table class="gs-table"><thead><tr>' +
            '<th>#</th><th>Игрок</th><th>Матчи</th><th>Убийства</th><th>Смерти</th><th>K/D</th><th>AVG Rating</th>' +
            '</tr></thead><tbody>';

        players.forEach(function(p, i) {
            var kd = p.deaths > 0 ? (p.kills / p.deaths) : p.kills;
            var kdStr = kd.toFixed(2);
            var avgRating = p.matches > 0 ? (p.ratingSum / p.matches) : 0;
            var avgRatingStr = avgRating.toFixed(2);

            var kdClass = kd >= 1.2 ? 'gs-good' : (kd >= 0.8 ? 'gs-ok' : 'gs-bad');
            var ratingClass = avgRating >= 1.1 ? 'gs-good' : (avgRating >= 0.9 ? 'gs-ok' : 'gs-bad');

            var avatarSrc = 'players/' + p.nickname + '.png';
            html += '<tr>' +
                '<td class="gs-rank">' + (i + 1) + '</td>' +
                '<td><div style="display:flex;align-items:center;gap:10px;">' +
                '<div style="width: 32px; height: 32px; flex-shrink: 0; border-radius: 50%; overflow: hidden; background: rgba(255,107,0,0.1);">' +
                '<img src="' + avatarSrc + '" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.src=\'players/defaultplayer.png\'">' +
                '</div>' +
                '<div><span class="gs-nick">' + escapeHtml(p.nickname) + '</span> <div class="gs-team" style="font-size:0.7rem;opacity:0.6;">' + escapeHtml(p.teamName || '') + '</div></div>' +
                '</div></td>' +
                '<td>' + p.matches + '</td>' +
                '<td>' + p.kills + '</td>' +
                '<td>' + p.deaths + '</td>' +
                '<td class="' + kdClass + '">' + kdStr + '</td>' +
                '<td class="' + ratingClass + '" style="font-family: \'Montserrat\', sans-serif;">' + avgRatingStr + '</td>' +
                '</tr>';
        });

        html += '</tbody></table></div>';

        // Кнопка сброса
        html += '<div style="text-align:center;margin-top:20px;">' +
            '<button id="clearGlobalStats" style="background:rgba(244,67,54,0.2);color:#ef5350;border:1px solid rgba(244,67,54,0.4);border-radius:8px;padding:10px 24px;cursor:pointer;font-family:inherit;font-size:0.9rem;font-weight:600;transition:all 0.2s;">Очистить статистику</button></div>';

        container.innerHTML = html;

        // Сортировка по клику на заголовки
        var currentSort = { col: 6, asc: false };
        container.querySelectorAll('.gs-table th').forEach(function(th, colIdx) {
            th.addEventListener('click', function() {
                if (currentSort.col === colIdx) {
                    currentSort.asc = !currentSort.asc;
                } else {
                    currentSort.col = colIdx;
                    currentSort.asc = false;
                }
                sortGlobalStatsTable(container, players, currentSort);
            });
        });

        var clearBtn = document.getElementById('clearGlobalStats');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                showConfirm('Вы уверены? Вся накопленная статистика будет удалена.')
                .then(confirmed => {
                    if (!confirmed) return;
                    safeStorage.removeItem('globalPlayerStats');
                    renderGlobalStats();
                });
            });
        }

        // Клик по игроку — профиль
        container.querySelectorAll('.gs-table tbody tr').forEach(function(tr, idx) {
            tr.addEventListener('click', function() {
                showPlayerProfile(players[idx]);
            });
        });
    }

    function sortGlobalStatsTable(container, players, sortInfo) {
        var sorted = players.slice();
        sorted.sort(function(a, b) {
            var valA, valB;
            switch(sortInfo.col) {
                case 0: valA = 0; valB = 0; break; // rank — пересчитывается
                case 1: valA = a.nickname.toLowerCase(); valB = b.nickname.toLowerCase(); return sortInfo.asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
                case 2: valA = a.matches; valB = b.matches; break;
                case 3: valA = a.kills; valB = b.kills; break;
                case 4: valA = a.deaths; valB = b.deaths; break;
                case 5: valA = a.deaths > 0 ? a.kills / a.deaths : a.kills; valB = b.deaths > 0 ? b.kills / b.deaths : b.kills; break;
                case 6: valA = a.matches > 0 ? a.ratingSum / a.matches : 0; valB = b.matches > 0 ? b.ratingSum / b.matches : 0; break;
                default: valA = 0; valB = 0;
            }
            return sortInfo.asc ? valA - valB : valB - valA;
        });

        var tbody = container.querySelector('.gs-table tbody');
        if (!tbody) return;
        var html = '';
        sorted.forEach(function(p, i) {
            var kd = p.deaths > 0 ? (p.kills / p.deaths) : p.kills;
            var kdStr = kd.toFixed(2);
            var avgRating = p.matches > 0 ? (p.ratingSum / p.matches) : 0;
            var avgRatingStr = avgRating.toFixed(2);
            var kdClass = kd >= 1.2 ? 'gs-good' : (kd >= 0.8 ? 'gs-ok' : 'gs-bad');
            var ratingClass = avgRating >= 1.1 ? 'gs-good' : (avgRating >= 0.9 ? 'gs-ok' : 'gs-bad');
            var avatarSrc = 'players/' + p.nickname + '.png';
            html += '<tr>' +
                '<td class="gs-rank">' + (i + 1) + '</td>' +
                '<td><div style="display:flex;align-items:center;gap:10px;">' +
                '<div style="width: 32px; height: 32px; flex-shrink: 0; border-radius: 50%; overflow: hidden; background: rgba(255,107,0,0.1);">' +
                '<img src="' + avatarSrc + '" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.src=\'players/defaultplayer.png\'">' +
                '</div>' +
                '<div><span class="gs-nick">' + escapeHtml(p.nickname) + '</span> <div class="gs-team" style="font-size:0.7rem;opacity:0.6;">' + escapeHtml(p.teamName || '') + '</div></div>' +
                '</div></td>' +
                '<td>' + p.matches + '</td>' +
                '<td>' + p.kills + '</td>' +
                '<td>' + p.deaths + '</td>' +
                '<td class="' + kdClass + '">' + kdStr + '</td>' +
                '<td class="' + ratingClass + '" style="font-family: \'Montserrat\', sans-serif;">' + avgRatingStr + '</td>' +
                '</tr>';
        });
        tbody.innerHTML = html;

        // Перепривязываем клик по игроку
        tbody.querySelectorAll('tr').forEach(function(tr, idx) {
            tr.addEventListener('click', function() {
                showPlayerProfile(sorted[idx]);
            });
        });
    }

    // Вспомогательная: рисует дугу рейтинга через Canvas и возвращает dataURL
    function _buildArc(rating, ratingColor) {
        const c = document.createElement('canvas');
        c.width = 260; c.height = 260;
        const ctx = c.getContext('2d');
        const pct = Math.min(Math.max((rating - 0.5) / 1.0, 0), 1);
        const cx = 130, cy = 130, r = 108;
        const s = -210 * Math.PI / 180;
        const eTrack = s + 240 * Math.PI / 180;
        const eArc   = s + 240 * Math.PI / 180 * pct;
        ctx.beginPath(); ctx.arc(cx, cy, r, s, eTrack);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.stroke();
        if (pct > 0) {
            ctx.beginPath(); ctx.arc(cx, cy, r, s, eArc);
            ctx.strokeStyle = ratingColor; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.stroke();
        }
        return c.toDataURL();
    }

    function getRandomGradient() {
        const colors = [
            ['#ff9a9e', '#fecfef'], ['#a18cd1', '#fbc2eb'], ['#84fab0', '#8fd3f4'],
            ['#cfd9df', '#e2ebf0'], ['#fccb90', '#d57eeb'], ['#e0c3fc', '#8ec5fc'],
            ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'], ['#43e97b', '#38f9d7']
        ];
        const idx = Math.floor(Math.random() * colors.length);
        return `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`;
    }

    function showPlayerProfile(player) {
        var modal = document.getElementById('playerProfileModal');
        var body  = document.getElementById('playerProfileBody');
        if (!modal || !body) return;

        // Ранк
        var stats = {};
        try { stats = JSON.parse(safeStorage.getItem('globalPlayerStats') || '{}'); } catch(e) {}
        var allPlayers = Object.values(stats);
        allPlayers.sort((a,b) => (b.matches>0?b.ratingSum/b.matches:0) - (a.matches>0?a.ratingSum/a.matches:0));
        var rank = allPlayers.findIndex(p => p.nickname === player.nickname) + 1;

        var matches = player.matches   || 0;
        var kills   = player.kills     || 0;
        var deaths  = player.deaths    || 0;
        var rounds  = player.totalRounds || 0;
        var assists = player.assists   || 0;
        var kd      = deaths > 0 ? kills/deaths : kills;
        var mapsPlayed = player.mapsPlayed || matches || 0;
        var avgKills = mapsPlayed > 0 ? (kills / mapsPlayed) : 0;
        var avgKillsStr = mapsPlayed > 0 ? avgKills.toFixed(1) : '—';
        var rating  = matches > 0 ? player.ratingSum/matches : 0;
        var kpr     = rounds  > 0 ? kills/rounds  : 0;
        var dpr     = rounds  > 0 ? deaths/rounds : 0;
        var legacyRoundWinRate = (player.roundsWon !== undefined && rounds > 0) ? (player.roundsWon / rounds) : 0.5;
        var apr = rounds > 0 ? assists / rounds : 0;
        var adrFallback = rounds > 0
            ? (24 + 82 * kpr - 16 * dpr + 9 * apr + (legacyRoundWinRate - 0.5) * 12)
            : 0;
        var adrFallbackPoorPenalty = Math.max(
            0,
            Math.min(1.2, (0.64 - kpr) * 1.05 + (dpr - 0.72) * 0.9 + (0.5 - legacyRoundWinRate) * 0.45)
        );
        var adrFallbackAdjusted = adrFallback - adrFallbackPoorPenalty * 9 - Math.max(0, dpr - 0.9) * 6;
        var adr     = (player.adrSum && rounds > 0)
            ? player.adrSum / rounds
            : Math.max(16, Math.min(132, Math.round(adrFallbackAdjusted * 10) / 10));
        var kastFromModel = Math.max(
            45,
            Math.min(97, Math.round((0.6 + (kpr - 0.68) * 0.24 - (dpr - 0.68) * 0.25 + apr * 0.16 + (legacyRoundWinRate - 0.5) * 0.22) * 100))
        );
        var kastFromHistory = (player.kastSum && rounds > 0) ? Math.round((player.kastSum / rounds) * 100) : null;
        var kastPct = kastFromHistory || player.kastAvg || kastFromModel;

        // Round Swing
        var roundsWon = player.roundsWon; // undefined for legacy
        var roundSwingStr = "—";
        var roundSwingColor = "#fff";
        if (roundsWon !== undefined) {
            var diff = roundsWon * 2 - rounds;
            if (diff > 0) { roundSwingStr = "+" + diff; roundSwingColor = "#4bcd7b"; }
            else if (diff < 0) { roundSwingStr = "" + diff; roundSwingColor = "#e05555"; }
            else { roundSwingStr = "0"; roundSwingColor = "#fff"; }
        }

        // T/CT ratings
        var seed = player.nickname.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
        var tRating  = Math.round(rating * (0.91 + (seed%17)/100) * 100)/100;
        var ctRating = Math.round(rating * (0.97 + (seed%13)/100) * 100)/100;

        const BG    = '#171d2d';
        const PANEL = '#1d2436';
        const DARK  = '#141929';
        const text  = '#fff';
        const muted = 'rgba(255,255,255,0.38)';

        const ratingColor = rating>=1.1?'#4bcd7b':rating>=1.0?'#f0c040':'#e05555';
        const ratingLabel = rating>=1.1?'GOOD'   :rating>=1.0?'OKAY'   :'POOR';
        const kdColor     = kd>=1.1?'#4bcd7b':kd>=1.0?'#f0c040':'#e05555';

        const photoPath    = `players/${player.nickname.trim()}.png`;
        const defaultPhoto = 'players/defaultplayer.png';

        const arcImg = _buildArc(rating, ratingColor);

        // Bar with segmented background
        function statBar(label, val, barPct, barColor, labelStr) {
            const lbl = labelStr || (typeof barPct==='number' ? (barPct>0.6?'GOOD':barPct>0.35?'OKAY':'POOR') : '');
            const lc  = lbl==='GOOD'?'#4bcd7b':lbl==='OKAY'?'#f0c040':'#e05555';
            const bc  = barColor || lc;
            // Segmented background: Red 33%, Yellow 33%, Green 33% (approx)
            const trackBg = `linear-gradient(to right, rgba(224,85,85,0.15) 0%, rgba(224,85,85,0.15) 35%, rgba(240,192,64,0.15) 35%, rgba(240,192,64,0.15) 65%, rgba(75,205,123,0.15) 65%, rgba(75,205,123,0.15) 100%)`;

            return `<div style="padding:14px 16px 12px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px;">
                    <div style="font-size:1.55rem;font-weight:900;color:${bc};line-height:1;">${val}</div>
                    <div style="text-align:right;">
                        <div style="font-size:0.58rem;color:${muted};text-transform:uppercase;letter-spacing:.1em;">${label}</div>
                    </div>
                </div>
                ${typeof barPct==='number'?`<div style="position:relative;">
                    <div style="height:4px;background:${trackBg};border-radius:2px;overflow:hidden;position:relative;">
                        <div style="height:100%;width:${Math.round(Math.min(barPct,1)*100)}%;background:${bc};border-radius:2px;transition:width .4s;box-shadow:0 0 4px ${bc};"></div>
                        <!-- dividers -->
                        <div style="position:absolute;top:0;bottom:0;left:35%;width:1px;background:rgba(0,0,0,0.3);"></div>
                        <div style="position:absolute;top:0;bottom:0;left:65%;width:1px;background:rgba(0,0,0,0.3);"></div>
                    </div>
                </div>`:''}
            </div>`;
        }

        function miniStat(label, val, color) {
            return `<div style="text-align:center;padding:14px 8px;">
                <div style="font-size:1.4rem;font-weight:900;color:${color||text};line-height:1;">${val}</div>
                <div style="font-size:0.56rem;color:${muted};text-transform:uppercase;letter-spacing:.08em;margin-top:4px;">${label}</div>
            </div>`;
        }

        var dprPct = 1 - Math.min(dpr/1.2, 1);
        var dprColor = dprPct>0.6?'#4bcd7b':dprPct>0.35?'#f0c040':'#e05555';
        var kastBarPct = kastPct/100;
        var kastColor = kastBarPct>0.6?'#4bcd7b':kastBarPct>0.35?'#f0c040':'#e05555';
        var adrBarPct = Math.min(adr/120, 1);
        var adrColor = adrBarPct>0.6?'#4bcd7b':adrBarPct>0.35?'#f0c040':'#e05555';
        var kprBarPct = Math.min(kpr/1.2, 1);
        var kprColor = kprBarPct>0.6?'#4bcd7b':kprBarPct>0.35?'#f0c040':'#e05555';
        var kdBarPct = Math.min(kd/2.0, 1);

        // Round Swing bar percentage (swing ranges from about -rounds to +rounds, normalize to 0..1)
        var rsBarPct = null;
        if (roundsWon !== undefined && rounds > 0) {
            var diff = roundsWon * 2 - rounds;
            rsBarPct = Math.min(Math.max((diff + rounds) / (2 * rounds), 0), 1);
        }

        // Win Rate - count from match history
        var winRate = 0;
        var matchCount = 0;
        try {
            var history = JSON.parse(safeStorage.getItem('matchHistory') || '[]');
            var wins = 0;
            for (var i = 0; i < history.length; i++) {
                var match = history[i];
                var playerTeam = null;
                var playerWon = false;
                if (match.team1Stats) {
                    var found = match.team1Stats.find(s => s.nickname === player.nickname);
                    if (found) {
                        playerTeam = 1;
                        playerWon = match.team1Score > match.team2Score;
                    }
                }
                if (!playerTeam && match.team2Stats) {
                    var found = match.team2Stats.find(s => s.nickname === player.nickname);
                    if (found) {
                        playerTeam = 2;
                        playerWon = match.team2Score > match.team1Score;
                    }
                }
                if (playerTeam) {
                    matchCount++;
                    if (playerWon) wins++;
                }
            }
            winRate = matchCount > 0 ? Math.round((wins / matchCount) * 100) : 0;
        } catch (e) {}
        var winRateColor = winRate >= 55 ? '#4bcd7b' : winRate >= 45 ? '#f0c040' : '#e05555';

        // Firepower (HLTV-like: kills, damage, assists combined)
        // Firepower = KPR * 1.5 + (ADR - 60) * 0.15 + APR * 0.8, normalized to 0-100 scale
        var baseFirepower = kpr * 1.5 + Math.max(0, adr - 60) * 0.15 + apr * 0.8;
        var firepower = Math.max(0, baseFirepower);  // Value for display
        var firepowerBarPct = Math.min(firepower / 6, 1);  // Normalize to 0-1 (6 is good target)
        var firepowerColor = firepowerBarPct > 0.6 ? '#4bcd7b' : firepowerBarPct > 0.35 ? '#f0c040' : '#e05555';

        // Get last 2 matches from history
                // Get last 2 matches from history (не 3, а именно 2)
        var lastMatches = [];
        try {
            var history = JSON.parse(safeStorage.getItem('matchHistory') || '[]');
            // Идём с конца массива (самые свежие матчи)
            for (var i = history.length - 1; i >= 0 && lastMatches.length < 2; i--) {
                var match = history[i];
                var playerStatsInMatch = null;
                var playerTeam = null;
                
                // Ищем игрока в команде 1
                if (match.team1Stats) {
                    var found = match.team1Stats.find(function(s) { return s.nickname === player.nickname; });
                    if (found) {
                        playerStatsInMatch = found;
                        playerTeam = 1;
                    }
                }
                // Если не нашли, ищем в команде 2
                if (!playerStatsInMatch && match.team2Stats) {
                    var found2 = match.team2Stats.find(function(s) { return s.nickname === player.nickname; });
                    if (found2) {
                        playerStatsInMatch = found2;
                        playerTeam = 2;
                    }
                }
                
                if (playerStatsInMatch) {
                    var won = (playerTeam === 1) ? (match.team1Score > match.team2Score) : (match.team2Score > match.team1Score);
                    lastMatches.push({
                        team1: match.team1Name,
                        team2: match.team2Name,
                        team1Score: match.team1Score,
                        team2Score: match.team2Score,
                        playerTeam: playerTeam,
                        kills: playerStatsInMatch.kills || 0,
                        deaths: playerStatsInMatch.deaths || 0,
                        assists: playerStatsInMatch.assists || 0,
                        won: won,
                        tournamentName: match.tournamentName || ''
                    });
                }
            }
        } catch (e) {
            // Match history load error
        }
        body.innerHTML = `
        <div id="globalProfileCard" style="background:${BG};border-radius:10px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,0.9);font-family:'Montserrat',sans-serif;color:${text};">
        <div id="globalProfileCardNew" style="background:${BG};border-radius:10px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,0.9);font-family:'Montserrat',sans-serif;color:${text};margin-bottom:16px;">
            <div style="display:flex;gap:0;align-items:stretch;">
                <!-- Фото слева -->
                <div style="flex-shrink:0;width:420px;overflow:hidden;border-radius:0;position:relative;align-self:flex-start;background:${BG};">
                    <img src="${photoPath}" onerror="this.onerror=null;this.src='${defaultPhoto}';" style="width:100%;display:block;object-fit:cover;object-position:top center;">
                    <div style="position:absolute;bottom:0;left:0;right:0;padding:12px 10px;background:linear-gradient(to top, rgba(15,17,23,0.7) 0%, rgba(15,17,23,0.35) 40%, transparent 100%);z-index:1;">
                        <div style="font-size:0.52rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.45);">All Time Stats</div>
                        <div style="font-size:0.62rem;color:rgba(255,107,0,0.9);font-weight:700;letter-spacing:0.06em;margin-top:2px;">${escapeHtml(player.nickname)} #${rank}</div>
                    </div>
                </div>
                <!-- Содержимое справа -->
                <div style="flex:1;display:flex;flex-direction:column;">
                    <!-- Рейтинг с кругом -->
                    <div style="display:flex;align-items:center;justify-content:center;gap:20px;padding:16px 16px 12px;">
                        <div style="text-align:center;">
                            <div style="font-size:1.6rem;font-weight:900;color:#e8c840;line-height:1;margin-bottom:3px;">${tRating.toFixed(2)}</div>
                            <div style="font-size:0.52rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.4);">T Rating</div>
                        </div>
                        <div style="width:100px;height:100px;position:relative;display:flex;align-items:center;justify-content:center;">
                            <img src="${arcImg}" style="width:100px;height:100px;display:block;position:absolute;">
                            <div style="position:relative;z-index:1;text-align:center;">
                                <div style="font-size:0.52rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${ratingColor};margin-bottom:1px;">${ratingLabel}</div>
                                <div style="font-size:1.5rem;font-weight:900;color:#fff;line-height:1;">${rating.toFixed(2)}</div>
                            </div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:1.6rem;font-weight:900;color:#4fc3f7;line-height:1;margin-bottom:3px;">${ctRating.toFixed(2)}</div>
                            <div style="font-size:0.52rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.4);">CT Rating</div>
                        </div>
                    </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;border-top:1px solid rgba(255,255,255,0.06);flex:1;">
            <!-- Row 1: K/D, ADR, KPR -->
            <div style="padding:10px 14px;border-right:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05);"><div style="font-size:0.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:5px;">K/D</div><div style="font-size:1.2rem;font-weight:900;color:${kdColor};margin-bottom:5px;line-height:1;">${kd.toFixed(2)}</div><div style="position:relative;height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;"><div style="height:100%;width:${Math.round(Math.min(kdBarPct,1)*100)}%;background:${kdColor};border-radius:2px;"></div></div></div>
            <div style="padding:10px 14px;border-right:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05);"><div style="font-size:0.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:5px;">ADR</div><div style="font-size:1.2rem;font-weight:900;color:${adrColor};margin-bottom:5px;line-height:1;">${adr.toFixed(1)}</div><div style="position:relative;height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;"><div style="height:100%;width:${Math.round(Math.min(adrBarPct,1)*100)}%;background:${adrColor};border-radius:2px;"></div></div></div>
            <div style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.05);"><div style="font-size:0.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:5px;">KPR</div><div style="font-size:1.2rem;font-weight:900;color:${kprColor};margin-bottom:5px;line-height:1;">${kpr.toFixed(2)}</div><div style="position:relative;height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;"><div style="height:100%;width:${Math.round(Math.min(kprBarPct,1)*100)}%;background:${kprColor};border-radius:2px;"></div></div></div>
            <!-- Row 2: KAST, DPR, Round Swing -->
            <div style="padding:10px 14px;border-right:1px solid rgba(255,255,255,0.05);"><div style="font-size:0.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:5px;">KAST</div><div style="font-size:1.2rem;font-weight:900;color:${kastColor};margin-bottom:5px;line-height:1;">${kastPct}%</div><div style="position:relative;height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;"><div style="height:100%;width:${Math.round(kastBarPct*100)}%;background:${kastColor};border-radius:2px;"></div></div></div>
            <div style="padding:10px 14px;border-right:1px solid rgba(255,255,255,0.05);"><div style="font-size:0.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:5px;">DPR</div><div style="font-size:1.2rem;font-weight:900;color:${dprColor};margin-bottom:5px;line-height:1;">${dpr.toFixed(2)}</div><div style="position:relative;height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;"><div style="height:100%;width:${Math.round(dprPct*100)}%;background:${dprColor};border-radius:2px;"></div></div></div>
            <div style="padding:10px 14px;"><div style="font-size:0.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:5px;">Round Swing</div><div style="font-size:1.2rem;font-weight:900;color:${roundSwingColor};margin-bottom:5px;line-height:1;">${roundSwingStr}</div><div style="position:relative;height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;"><div style="height:100%;width:${rsBarPct !== null ? Math.round(rsBarPct*100) : 50}%;background:${roundSwingColor};border-radius:2px;"></div></div></div>
        </div>

        <!-- Additional Stats Block -->
        <div style="padding:16px 24px;border-top:1px solid rgba(255,255,255,0.06);">
            <div style="display:grid;grid-template-columns:1fr;gap:16px;margin-bottom:16px;">
                <div style="text-align:center;">
                    <div style="font-size:0.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:5px;">Win Rate</div>
                    <div style="font-size:1.4rem;font-weight:900;color:${winRateColor};line-height:1;">${winRate}%</div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;padding:12px;background:rgba(255,107,0,0.08);border-radius:8px;border:1px solid rgba(255,107,0,0.2);">
                <div style="text-align:center;">
                    <div style="font-size:0.5rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:4px;">Kills</div>
                    <div style="font-size:1.3rem;font-weight:900;color:#ff6b00;line-height:1;">${kills}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:0.5rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:4px;">Deaths</div>
                    <div style="font-size:1.3rem;font-weight:900;color:#e05555;line-height:1;">${deaths}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:0.5rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:4px;">Assists</div>
                    <div style="font-size:1.3rem;font-weight:900;color:#4fc3f7;line-height:1;">${assists}</div>
                </div>
            </div>

            <!-- Last 2 Matches -->
            ${lastMatches.length > 0 ? `
            <div>
                <div style="font-size:0.52rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:8px;">Last 2 Matches</div>
                ${lastMatches.map((m, idx) => {
                    const playerTeamName = m.playerTeam === 1 ? m.team1 : m.team2;
                    const opponentTeamName = m.playerTeam === 1 ? m.team2 : m.team1;
                    const playerScore = m.playerTeam === 1 ? m.team1Score : m.team2Score;
                    const opponentScore = m.playerTeam === 1 ? m.team2Score : m.team1Score;
                    const won = playerScore > opponentScore;
                    return `<div style="padding:8px 12px;margin-bottom:6px;background:rgba(255,255,255,0.04);border-left:3px solid ${won ? '#4bcd7b' : '#e05555'};border-radius:4px;display:flex;justify-content:space-between;align-items:center;">
                        <div style="flex:1;">
                            <div style="font-size:0.5rem;color:rgba(255,255,255,0.4);margin-bottom:2px;">${playerTeamName} ${playerScore} : ${opponentScore} ${opponentTeamName}</div>
                            <div style="font-size:0.52rem;color:rgba(255,255,255,0.7);">${m.kills}K / ${m.deaths}D / ${m.assists}A</div>
                        </div>
                        <div style="font-size:0.72rem;font-weight:900;color:${won ? '#4bcd7b' : '#e05555'};text-align:right;">${won ? 'W' : 'L'}</div>
                    </div>`;
                }).join('')}
            </div>
            ` : ''}
        </div>

                </div>
            </div>
        </div>
        <div style="padding:12px 0 4px;">
            <button id="dlProfileCardBtn" style="width:100%;background:linear-gradient(135deg,#ff6b00,#ff8f00);border:none;border-radius:8px;color:#fff;font-size:0.85rem;font-weight:700;padding:10px;cursor:pointer;font-family:'Montserrat',sans-serif;letter-spacing:.04em;">📸 Скачать фото</button>
        </div>`;

        setTimeout(() => {
            const btn = document.getElementById('dlProfileCardBtn');
            if (btn) btn.onclick = () => downloadPlayerProfileCard(player, kd, rating, kpr, dpr, rank, tRating, ctRating, adr, kastPct, roundSwingStr, roundSwingColor);
        }, 0);

        modal.style.display = 'block';
    }

    function downloadGlobalProfileCard(player, kd, rating, kpr, dpr, rank, tRating, ctRating, adr, kastPct, rsStr, rsColor) {
        ensureHtml2Canvas().then(() => {
            const photoPath    = `players/${player.nickname.trim()}.png`;
            const defaultPhoto = 'players/defaultplayer.png';
            const BG    = '#171d2d';
            const PANEL = '#1d2436';
            const DARK  = '#141929';
            const muted = 'rgba(255,255,255,0.38)';
            const text  = '#fff';

            var kills   = player.kills   || 0;
            var deaths  = player.deaths  || 0;
            var matches = player.matches || 0;
            var rounds  = player.totalRounds || 0;
            var assists = player.assists || 0;
            var mapsPlayed = player.mapsPlayed || matches || 0;
            var avgKills = mapsPlayed > 0 ? (kills / mapsPlayed) : 0;
            var avgKillsStr = mapsPlayed > 0 ? avgKills.toFixed(1) : '—';

            const ratingColor = rating>=1.1?'#4bcd7b':rating>=1.0?'#f0c040':'#e05555';
            const ratingLabel = rating>=1.1?'GOOD'   :rating>=1.0?'OKAY'   :'POOR';
            const kdColor     = kd>=1.1?'#4bcd7b':kd>=1.0?'#f0c040':'#e05555';

            var dprPct   = 1 - Math.min(dpr/1.2, 1);
            var dprColor = dprPct>0.6?'#4bcd7b':dprPct>0.35?'#f0c040':'#e05555';
            var kastBP   = kastPct/100;
            var kastColor= kastBP>0.6?'#4bcd7b':kastBP>0.35?'#f0c040':'#e05555';
            var adrBP    = Math.min(adr/120, 1);
            var adrColor = adrBP>0.6?'#4bcd7b':adrBP>0.35?'#f0c040':'#e05555';
            var kprBP    = Math.min(kpr/1.2, 1);
            var kprColor = kprBP>0.6?'#4bcd7b':kprBP>0.35?'#f0c040':'#e05555';
            var kdBP     = Math.min(kd/2.0, 1);

            // Round Swing bar percentage
            var dlRsBarPct = null;
            if (player.roundsWon !== undefined && rounds > 0) {
                var rsDiff = player.roundsWon * 2 - rounds;
                dlRsBarPct = Math.min(Math.max((rsDiff + rounds) / (2 * rounds), 0), 1);
            }

            const arcImg = _buildArc(rating, ratingColor);

            function sBar(label, val, barPct, barColor, lbl) {
                const lc = lbl==='GOOD'?'#4bcd7b':lbl==='OKAY'?'#f0c040':'#e05555';
                const bc = barColor||lc;
                const trackBg = `linear-gradient(to right, rgba(224,85,85,0.15) 0%, rgba(224,85,85,0.15) 35%, rgba(240,192,64,0.15) 35%, rgba(240,192,64,0.15) 65%, rgba(75,205,123,0.15) 65%, rgba(75,205,123,0.15) 100%)`;
                return `<div style="padding:14px 16px 12px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px;">
                        <div style="font-size:1.5rem;font-weight:900;color:${bc};line-height:1;">${val}</div>
                        <div style="text-align:right;">
                            <div style="font-size:.56rem;color:${muted};text-transform:uppercase;letter-spacing:.1em;">${label}</div>
                        </div>
                    </div>
                    ${typeof barPct==='number'?`<div style="position:relative;">
                        <div style="height:4px;background:${trackBg};border-radius:2px;overflow:hidden;position:relative;">
                            <div style="height:100%;width:${Math.round(Math.min(barPct,1)*100)}%;background:${bc};border-radius:2px;box-shadow:0 0 4px ${bc};"></div>
                            <div style="position:absolute;top:0;bottom:0;left:35%;width:1px;background:rgba(0,0,0,0.3);"></div>
                            <div style="position:absolute;top:0;bottom:0;left:65%;width:1px;background:rgba(0,0,0,0.3);"></div>
                        </div>
                    </div>`:''}
                </div>`;
            }

            function sMini(label, val, color) {
                return `<div style="text-align:center;padding:13px 8px;">
                    <div style="font-size:1.35rem;font-weight:900;color:${color||text};line-height:1;">${val}</div>
                    <div style="font-size:.54rem;color:${muted};text-transform:uppercase;letter-spacing:.08em;margin-top:4px;">${label}</div>
                </div>`;
            }

            const card = document.createElement('div');
            card.style.cssText = `position:fixed;left:-9999px;top:0;width:560px;background:${BG};font-family:'Montserrat',sans-serif;color:${text};overflow:hidden;`;
            card.innerHTML = `
                <div style="position:relative;overflow:hidden;background:#0e1520;min-height:148px;">
                    <div style="position:absolute;inset:0;overflow:hidden;">
                        <div style="position:absolute;inset:0;background:${getRandomGradient()};opacity:0.1;"></div>
                        <div style="position:absolute;inset:0;background:linear-gradient(to right,#0e1520 30%,rgba(14,21,32,0.75) 60%,rgba(14,21,32,0.45) 100%);"></div>
                    </div>
                    <div style="position:relative;z-index:2;display:flex;align-items:flex-end;min-height:148px;">
                        <div style="flex-shrink:0;width:130px;align-self:stretch;overflow:hidden;position:relative;border-radius:0 12px 0 0;">
                            <img src="${photoPath}"
                                onerror="this.onerror=null;this.src='${defaultPhoto}';"
                                style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center top;display:block;">
                        </div>
                        <div style="padding:0 14px 16px 12px;flex:1;align-self:flex-end;">
                            <div style="font-size:.56rem;color:#ff6b00;font-weight:700;letter-spacing:.15em;text-transform:uppercase;margin-bottom:5px;">${player.teamName||'No Team'}</div>
                            <div style="font-size:1.8rem;font-weight:900;color:#fff;line-height:1;display:flex;align-items:center;gap:9px;flex-wrap:wrap;">
                                ${player.nickname}
                                <span style="font-size:.72rem;color:#ff6b00;background:rgba(255,107,0,0.15);padding:3px 9px;border-radius:4px;border:1px solid rgba(255,107,0,0.4);font-weight:700;">#${rank}</span>
                            </div>
                            <div style="font-size:.6rem;color:${muted};margin-top:7px;">All Time Stats · ${matches} матч${matches===1?'':'ей'}</div>
                        </div>
                    </div>
                </div>
                <div style="background:${DARK};display:flex;align-items:center;justify-content:center;padding:15px 18px 10px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <div style="text-align:right;min-width:105px;padding-right:15px;">
                        <div style="font-size:1.7rem;font-weight:900;color:#f0c040;line-height:1;">${tRating.toFixed(2)}</div>
                        <div style="font-size:.54rem;color:${muted};letter-spacing:.12em;margin-top:4px;">T RATING</div>
                    </div>
                    <div style="position:relative;width:136px;height:122px;flex-shrink:0;">
                        <img src="${arcImg}" style="width:136px;height:122px;display:block;">
                        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;">
                            <div style="font-size:.58rem;font-weight:900;color:${ratingColor};letter-spacing:.12em;margin-top:-11px;">${ratingLabel}</div>
                            <div style="font-size:1.48rem;font-weight:900;color:#fff;line-height:1.1;">${rating.toFixed(2)}</div>
                            <div style="font-size:.42rem;color:${muted};letter-spacing:.1em;">RATING 1.0</div>
                        </div>
                    </div>
                    <div style="text-align:left;min-width:105px;padding-left:15px;">
                        <div style="font-size:1.7rem;font-weight:900;color:#5bc8f5;line-height:1;">${ctRating.toFixed(2)}</div>
                        <div style="font-size:.54rem;color:${muted};letter-spacing:.12em;margin-top:4px;">CT RATING</div>
                    </div>
                </div>
                <div style="background:${DARK};display:grid;grid-template-columns:1fr 1px 1fr 1px 1fr;border-bottom:1px solid rgba(255,255,255,0.06);">
                    ${sMini('Убийства', kills, text)}
                    <div style="background:rgba(255,255,255,0.06);"></div>
                    ${sMini('AVG/карту', avgKillsStr, text)}
                    <div style="background:rgba(255,255,255,0.06);"></div>
                    ${sMini('Смерти', deaths, text)}
                </div>
                <div style="background:${PANEL};display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <div style="border-right:none;">
                        ${sBar('K/D Ratio', kd.toFixed(2), kdBP, kdColor)}
                        ${sBar('ADR', adr.toFixed(1), adrBP, adrColor)}
                        ${sBar('KPR', kpr.toFixed(2), kprBP, kprColor)}
                    </div>
                    <div>
                        ${sBar('KAST', kastPct+'%', kastBP, kastColor)}
                        ${sBar('DPR', dpr.toFixed(2), dprPct, dprColor)}
                        ${sBar('Round Swing', rsStr||'—', dlRsBarPct, rsColor||text)}
                    </div>
                </div>
                <div style="background:${DARK};display:grid;grid-template-columns:1fr 1px 1fr 1px 1fr;border-bottom:1px solid rgba(255,255,255,0.06);">
                    ${sMini('Матчи', matches, text)}
                    <div style="background:rgba(255,255,255,0.06);"></div>
                    ${sMini('Ассисты', assists, text)}
                    <div style="background:rgba(255,255,255,0.06);"></div>
                    ${sMini('Раунды', rounds, text)}
                </div>
                <div style="padding:7px 14px;background:${BG};text-align:center;">
                    <div style="font-size:.5rem;color:rgba(255,255,255,.1);letter-spacing:.14em;text-transform:uppercase;">k0tamb app</div>
                </div>`;

            document.body.appendChild(card);
            const imgs = card.querySelectorAll('img');
            Promise.all(Array.from(imgs).map(img => new Promise(res => {
                if (img.complete) res(); else { img.onload = res; img.onerror = res; }
            }))).then(() => {
                document.fonts.ready.then(() => {
                    setTimeout(() => {
                        html2canvas(card, {
                            scale: 5, backgroundColor: BG, logging: false,
                            useCORS: true, allowTaint: true,
                            imageTimeout: 20000,
                            onclone: doc => {
                                doc.querySelectorAll('*').forEach(el => { el.style.fontFamily = "'Montserrat', sans-serif"; });
                                doc.querySelectorAll('img').forEach(img => { img.style.outline='none'; img.style.border='none'; });
                            }
                        }).then(canvas => {
                            document.body.removeChild(card);
                            cleanCanvasLine(canvas);
                            const link = document.createElement('a');
                            link.download = `${player.nickname}_global_stats.png`;
                            link.href = canvas.toDataURL('image/png');
                            link.click();
                        }).catch(e => {
                            // Error
                            document.body.removeChild(card);
                        });
                    }, 300);
                });
            });
        });
    }

    function downloadPlayerProfileCard(player, kd, rating, kpr, dpr, rank, tRating, ctRating, adr, kastPct, rsStr, rsColor) {
        // Снимаем скриншот прямо с уже отрисованного элемента в модальном окне
        const cardEl = document.getElementById('globalProfileCardNew');
        if (!cardEl) return;

        ensureHtml2Canvas().then(() => {
            // Ждём полной загрузки всех изображений в карточке
            const imgs = cardEl.querySelectorAll('img');
            Promise.all(Array.from(imgs).map(img => new Promise(res => {
                if (img.complete && img.naturalWidth > 0) res();
                else { img.onload = res; img.onerror = res; }
            }))).then(() => {
                // Дополнительная пауза чтобы браузер успел отрендерить
                setTimeout(() => {
                    html2canvas(cardEl, {
                        scale: 5,
                        backgroundColor: '#171d2d',
                        logging: false,
                        useCORS: true,
                        allowTaint: true,
                        imageTimeout: 15000,
                        onclone: (doc) => {
                            doc.querySelectorAll('*').forEach(e => {
                                e.style.fontFamily = "'Montserrat', sans-serif";
                            });
                            doc.querySelectorAll('img').forEach(img => {
                                img.style.outline = 'none';
                                img.style.border = 'none';
                                img.style.display = 'block';
                            });
                        }
                    }).then(canvas => {
                        cleanCanvasLine(canvas);
                        const link = document.createElement('a');
                        link.download = `${player.nickname}_profile_stats.png`;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    }).catch(e => {
                        // error creating player profile image
                        showAlert('Не удалось сгенерировать изображение. Попробуй сделать скриншот вручную.');
                    });
                }, 200);
            });
        });
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    initApp();

    // Автоматически подтягиваем статистику из облака при включенном трекинге
    if (safeStorage.getItem('statsTrackingEnabled') === 'true') {
        var cloudKey = localStorage.getItem('cloud_access_key') || '';
        var cloudBin = localStorage.getItem('cloud_bin_id') || '';
        if (cloudKey && cloudBin && typeof pullStatsFromCloud === 'function') {
            pullStatsFromCloud(function(success) {
                if (success) {
                    console.log('Cloud stats loaded on startup');
                }
            });
        }
    }
});

// Additional handler to replace settings apply behavior (use in-app prompt/toast instead of browser prompt/alert)
document.addEventListener('DOMContentLoaded', function() {
    const applyBtn = document.getElementById('applyTheme');
    if (!applyBtn) return;
    applyBtn.addEventListener('click', async function(e) {
        // prevent default settings.js handler (which used browser prompt)
        if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();

        const selected = document.querySelector('.theme-option.selected');
        const selectedTheme = selected ? selected.dataset.theme : (safeStorage.getItem('imageTheme') || 'orange');

        // persist theme
        safeStorage.setItem('imageTheme', selectedTheme);

        const detailedCommentsToggle = document.getElementById('detailedCommentsToggle');
        const mapIntroToggle = document.getElementById('mapIntroToggle');
        const soundOnCompletion = document.getElementById('soundOnCompletion');
        const statsTrackingToggle = document.getElementById('statsTrackingToggle');
        const practiceMatchToggle = document.getElementById('practiceMatchToggle');
        const mobilePerfToggle = document.getElementById('mobilePerfToggle');
        const pageThemeLight = document.getElementById('pageThemeLight');

        if (detailedCommentsToggle) safeStorage.setItem('detailedCommentsEnabled', detailedCommentsToggle.checked ? 'true' : 'false');
        if (mapIntroToggle) safeStorage.setItem('mapIntroEnabled', mapIntroToggle.checked ? 'true' : 'false');
        if (soundOnCompletion) safeStorage.setItem('soundOnCompletion', soundOnCompletion.checked ? 'true' : 'false');

        if (statsTrackingToggle) {
            if (statsTrackingToggle.checked && safeStorage.getItem('statsTrackingEnabled') !== 'true') {
                const pwd = await window.showPrompt('Введите пароль администратора для включения сбора статистики:','');
                if (pwd === null) { statsTrackingToggle.checked = false; }
                else if (pwd !== 'parol123kotamb') {
                    window.showAlert('Неверный пароль. Включение статистики отменено.');
                    statsTrackingToggle.checked = false;
                } else {
                    // Включение статистики успешно - загружаем данные из облака если они там есть
                    safeStorage.setItem('statsTrackingEnabled', 'true');
                    if (typeof pullStatsFromCloud === 'function') {
                        pullStatsFromCloud(function(success) {
                            if (success) {
                                window.showAlert('Данные статистики загружены из облака!');
                            }
                        });
                    }
                    return; // Выход, чтобы не перезаписать значение ниже
                }
            }
            safeStorage.setItem('statsTrackingEnabled', statsTrackingToggle.checked ? 'true' : 'false');
        }

        const rankingModeToggle = document.getElementById('rankingModeToggle');
        if (rankingModeToggle) {
            if (rankingModeToggle.checked && safeStorage.getItem('rankingModeEnabled') !== 'true') {
                const pwd = await window.showPrompt('Введите пароль администратора для включения режима рейтинга команд (RP):','');
                if (pwd === null) { rankingModeToggle.checked = false; }
                else if (pwd !== 'parol123kotamb') {
                    window.showAlert('Неверный пароль. Включение рейтинга отменено.');
                    rankingModeToggle.checked = false;
                }
            }
            safeStorage.setItem('rankingModeEnabled', rankingModeToggle.checked ? 'true' : 'false');
        }

        if (practiceMatchToggle) safeStorage.setItem('practiceMatchEnabled', practiceMatchToggle.checked ? 'true' : 'false');
        if (mobilePerfToggle) {
            const perfMode = mobilePerfToggle.checked;
            safeStorage.setItem('mobilePerformanceMode', perfMode ? 'true' : 'false');
            if (typeof window.applyMobilePerformanceMode === 'function') {
                window.applyMobilePerformanceMode(perfMode);
            }
        }

        const pageTheme = (pageThemeLight && pageThemeLight.checked) ? 'light' : 'dark';
        safeStorage.setItem('pageTheme', pageTheme);
        if (pageTheme === 'light') document.body.classList.add('theme-light'); else document.body.classList.remove('theme-light');

        // hide modal
        const themeModal = document.getElementById('themeModal');
        if (themeModal) themeModal.classList.add('hidden');

        // update global var
        try { if (typeof currentTheme !== 'undefined') currentTheme = selectedTheme; } catch(e) {}

        // notify
        window.showToast('Настройки сохранены', 'info', 1800);
        // update stats tab visibility if function available
        if (typeof window.updateStatsTabVisibility === 'function') window.updateStatsTabVisibility();
    }, true);
});
