// Функция для подтверждения (если не загружена из script.js)
function showConfirm(message) {
    return new Promise(resolve => {
        // Проверяем есть ли уже функция в window (т.е. загружена ли она из script.js)
        if (window.showConfirm && window.showConfirm !== showConfirm) {
            resolve(window.showConfirm(message));
            return;
        }
        
        // Иначе показываем встроенное модальное окно
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            backdrop-filter: blur(2px);
        `;
        
        const box = document.createElement('div');
        box.style.cssText = `
            background: rgba(15, 17, 23, 0.95);
            border: 1px solid rgba(255,107,0,0.3);
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            color: white;
            font-family: Montserrat, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        `;
        
        box.innerHTML = `
            <div style="font-size: 1rem; font-weight: 600; margin-bottom: 20px;">${message}</div>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button id="cancelBtn" style="padding: 8px 16px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #aaa; border-radius: 6px; cursor: pointer; font-weight: 600; font-family: inherit; transition: all 0.2s;">Отмена</button>
                <button id="confirmBtn" style="padding: 8px 16px; border: none; background: linear-gradient(135deg, #ff6b00, #ff9500); color: white; border-radius: 6px; cursor: pointer; font-weight: 700; font-family: inherit; transition: all 0.2s;">Да</button>
            </div>
        `;
        
        modal.appendChild(box);
        document.body.appendChild(modal);
        
        const cancelBtn = box.querySelector('#cancelBtn');
        const confirmBtn = box.querySelector('#confirmBtn');
        
        cancelBtn.addEventListener('click', function() {
            modal.remove();
            resolve(false);
        });
        
        confirmBtn.addEventListener('click', function() {
            modal.remove();
            resolve(true);
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
                resolve(false);
            }
        });
    });
}

// Делаем функцию глобальной
window.showConfirm = showConfirm;

// Функция удаления игрока из globalPlayerStats
function deletePlayer(playerKey) {
    try {
        if (!playerKey) {
            console.error('deletePlayer: playerKey не передан');
            return false;
        }
        
        var stats = JSON.parse(localStorage.getItem('globalPlayerStats') || '{}');
        if (!stats || typeof stats !== 'object') {
            console.error('deletePlayer: не удалось загрузить статистику');
            return false;
        }
        
        if (stats[playerKey]) {
            delete stats[playerKey];
            localStorage.setItem('globalPlayerStats', JSON.stringify(stats));
            
            // Пытаемся синхронизировать с облаком если доступна функция
            if (typeof pushStatsToCloud === 'function') {
                pushStatsToCloud(stats);
            } else if (window.pushStatsToCloud) {
                window.pushStatsToCloud(stats);
            }
            
            console.log('deletePlayer: Игрок ' + playerKey + ' удалён');
            return true;
        } else {
            console.warn('deletePlayer: Игрок ' + playerKey + ' не найден');
            console.log('deletePlayer: Доступные игроки:', Object.keys(stats));
            return false;
        }
    } catch (e) {
        console.error('deletePlayer: Ошибка -', e.message);
        return false;
    }
}

// Делаем глобальной
window.deletePlayer = deletePlayer;

document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы DOM
    const passwordScreen = document.getElementById('passwordScreen');
    const adminPanel = document.getElementById('adminPanel');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminPasswordInput = document.getElementById('adminPassword');
    const passwordError = document.getElementById('passwordError');
    
    // Элементы статистики
    const onlineNowElement = document.getElementById('onlineNow');
    const totalVisitsElement = document.getElementById('totalVisits');
    const uniqueVisitsElement = document.getElementById('uniqueVisits');
    const lastVisitElement = document.getElementById('lastVisit');
    const maintenanceStatusElement = document.getElementById('maintenanceStatus');
    const visitsLogElement = document.getElementById('visitsLog');
    const sessionTimeElement = document.getElementById('sessionTime');
    
    const ONLINE_HEARTBEAT_KEY = 'onlineHeartbeats';
    const ONLINE_CUTOFF_MS = 5 * 60 * 1000; // 5 минут неактивности

    // Элементы управления техработами
    const statusIndicator = document.getElementById('statusIndicator');
    const statusDetails = document.getElementById('statusDetails');
    const maintenanceTimeElement = document.getElementById('maintenanceTime');
    const maintenanceReasonElement = document.getElementById('maintenanceReason');
    const maintenanceToggle = document.getElementById('maintenanceToggle');
    const maintenanceUntil = document.getElementById('maintenanceUntil');
    const maintenanceReasonInput = document.getElementById('maintenanceReasonInput');
    const saveMaintenanceBtn = document.getElementById('saveMaintenance');
    const testMaintenanceBtn = document.getElementById('testMaintenance');
    const maintenanceMessage = document.getElementById('maintenanceMessage');
    
    // Элементы таблицы ролей
    const rolesTableBody = document.getElementById('rolesTableBody');
    const saveRolesBtn = document.getElementById('saveRoles');
    const resetRolesBtn = document.getElementById('resetRoles');
    const rolesMessage = document.getElementById('rolesMessage');
    
    // Системные кнопки
    const clearStatsBtn = document.getElementById('clearStats');
    const exportDataBtn = document.getElementById('exportData');
    const systemMessage = document.getElementById('systemMessage');
    
    // Время сессии
    let sessionStartTime = new Date();
    let isAuthenticated = false;
    
    // Пароль админа
    const ADMIN_PASSWORD = 'parol123kotamb';
    
    // Роли для Standoff 2
    const defaultRolesS2 = [
        { id: 'rifler', name: 'Рифлер', killMultiplier: 1.1, skillMultiplier: 1.0, impact: 1.0 },
        { id: 'sniper', name: 'Снайпер', killMultiplier: 1.1, skillMultiplier: 1.05, impact: 1.1 },
        { id: 'lurker', name: 'Люркер', killMultiplier: 1.0, skillMultiplier: 0.95, impact: 1.0 },
        { id: 'opener', name: 'Опенер', killMultiplier: 1.05, skillMultiplier: 1.05, impact: 1.1 },
        { id: 'support', name: 'Саппорт', killMultiplier: 1.0, skillMultiplier: 0.9, impact: 0.9 },
        { id: 'captain', name: 'Капитан', killMultiplier: 0.95, skillMultiplier: 1.1, impact: 1.05 },
        { id: 'captain_sniper', name: 'Капитан-снайпер', killMultiplier: 1.0, skillMultiplier: 1.1, impact: 1.15 }
    ];
    
    // Роли для CS2
    const defaultRolesCS2 = [
        { id: 'rifler', name: 'Рифлер', killMultiplier: 1.05, skillMultiplier: 1.0, impact: 1.0 },
        { id: 'sniper', name: 'AWPer', killMultiplier: 1.15, skillMultiplier: 1.1, impact: 1.2 },
        { id: 'lurker', name: 'Люркер', killMultiplier: 1.0, skillMultiplier: 0.95, impact: 1.0 },
        { id: 'opener', name: 'Entry', killMultiplier: 1.1, skillMultiplier: 1.05, impact: 1.1 },
        { id: 'support', name: 'Саппорт', killMultiplier: 0.95, skillMultiplier: 0.9, impact: 0.9 },
        { id: 'captain', name: 'IGL', killMultiplier: 0.9, skillMultiplier: 1.15, impact: 1.1 },
        { id: 'captain_sniper', name: 'IGL-AWPer', killMultiplier: 1.0, skillMultiplier: 1.1, impact: 1.15 }
    ];
    
    let currentRoleMode = 's2';
    const MAINTENANCE_STATE_ENDPOINT = '/.netlify/functions/maintenance-state';
    let maintenanceServerUnavailable = false;
    let currentMaintenanceState = {
        maintenance_mode: 'false',
        maintenance_until: null,
        maintenance_reason: null,
        updated_at: null
    };

    function isMaintenanceEndpointMissing(error) {
        return !!(error && typeof error.message === 'string' && error.message.indexOf('maintenance_state_http_404') === 0);
    }

    function disableMaintenanceServerSync() {
        maintenanceServerUnavailable = true;
        if (window._maintenanceSyncInterval) {
            clearInterval(window._maintenanceSyncInterval);
            window._maintenanceSyncInterval = null;
        }
    }

    function getRoleStorageKey(mode) {
        return mode === 'cs2' ? 'roleMultipliersCS2' : 'roleMultipliers';
    }

    function getDefaultRoles(mode) {
        return mode === 'cs2' ? defaultRolesCS2 : defaultRolesS2;
    }

    function normalizeMaintenanceState(raw) {
        const mode = raw && raw.maintenance_mode === 'true' ? 'true' : 'false';
        const until = raw && typeof raw.maintenance_until === 'string' && raw.maintenance_until.trim()
            ? raw.maintenance_until.trim()
            : null;
        const reason = raw && typeof raw.maintenance_reason === 'string' && raw.maintenance_reason.trim()
            ? raw.maintenance_reason.trim()
            : null;
        return {
            maintenance_mode: mode,
            maintenance_until: until,
            maintenance_reason: reason,
            updated_at: raw && typeof raw.updated_at === 'string' ? raw.updated_at : null
        };
    }

    function applyMaintenanceStateToLocalStorage(state) {
        localStorage.setItem('maintenance_mode', state.maintenance_mode);
        if (state.maintenance_until) localStorage.setItem('maintenance_until', state.maintenance_until);
        else localStorage.removeItem('maintenance_until');
        if (state.maintenance_reason) localStorage.setItem('maintenance_reason', state.maintenance_reason);
        else localStorage.removeItem('maintenance_reason');
    }

    function readMaintenanceStateFromLocalStorage() {
        return normalizeMaintenanceState({
            maintenance_mode: localStorage.getItem('maintenance_mode'),
            maintenance_until: localStorage.getItem('maintenance_until'),
            maintenance_reason: localStorage.getItem('maintenance_reason')
        });
    }

    async function fetchMaintenanceStateFromServer() {
        if (maintenanceServerUnavailable) {
            throw new Error('maintenance_endpoint_unavailable');
        }
        const response = await fetch(MAINTENANCE_STATE_ENDPOINT, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('maintenance_state_http_' + response.status);
        }
        return normalizeMaintenanceState(await response.json());
    }

    async function saveMaintenanceStateToServer(state) {
        if (maintenanceServerUnavailable) {
            throw new Error('maintenance_endpoint_unavailable');
        }
        const response = await fetch(MAINTENANCE_STATE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(normalizeMaintenanceState(state))
        });
        if (!response.ok) {
            throw new Error('maintenance_state_http_' + response.status);
        }
        return normalizeMaintenanceState(await response.json());
    }

    function updateMaintenanceUi(state) {
        const maintenance = state.maintenance_mode;
        const until = state.maintenance_until;
        const reason = state.maintenance_reason;

        if (maintenance === 'true') {
            statusIndicator.className = 'status-indicator status-active';
            statusIndicator.innerHTML = '<span class="status-dot"></span><span class="status-text">Технические работы на сайте включены — сайт временно недоступен</span>';
            maintenanceToggle.value = 'true';
            maintenanceStatusElement.textContent = 'Техработы включены';
            maintenanceStatusElement.style.color = '#f44336';
        } else {
            statusIndicator.className = 'status-indicator status-inactive';
            statusIndicator.innerHTML = '<span class="status-dot"></span><span class="status-text">Технические работы на сайте выключены — сайт доступен</span>';
            maintenanceToggle.value = 'false';
            maintenanceStatusElement.textContent = 'Техработы выключены';
            maintenanceStatusElement.style.color = '#4CAF50';
        }

        if (until) {
            const date = new Date(until);
            maintenanceTimeElement.textContent = Number.isNaN(date.getTime()) ? until : date.toLocaleString('ru-RU');
            maintenanceUntil.value = until.substring(0, 16);
        } else {
            maintenanceTimeElement.textContent = 'Не запланировано';
            maintenanceUntil.value = '';
        }

        if (reason) {
            maintenanceReasonElement.textContent = reason;
            maintenanceReasonInput.value = reason;
        } else {
            maintenanceReasonElement.textContent = 'Не указана';
            maintenanceReasonInput.value = '';
        }

        const quickStatus = document.getElementById('quickMaintenanceStatus');
        if (quickStatus) {
            quickStatus.textContent = maintenance === 'true' ? 'Техработы включены' : 'Техработы выключены';
            quickStatus.classList.toggle('active', maintenance === 'true');
        }
    }
    
    // Применение темы админки
    function applyAdminTheme() {
        const theme = localStorage.getItem('pageTheme') || 'dark';
        if (theme === 'light') {
            document.body.classList.add('admin-theme-light');
        } else {
            document.body.classList.remove('admin-theme-light');
        }
        const btn = document.getElementById('adminThemeToggle');
        if (btn) btn.textContent = theme === 'light' ? '🌙 Тёмная тема админки' : '☀️ Светлая тема админки';
    }

    function initAdminPanel() {
        applyAdminTheme();
        
        const savedAuth = localStorage.getItem('adminAuthenticated');
        if (savedAuth === 'true') {
            isAuthenticated = true;
            showAdminPanel();
        }
        
        setupEventListeners();
        
        updateSessionTime();
        setInterval(updateSessionTime, 1000);
    }
    
    // Настройка обработчиков событий
    function setupEventListeners() {
        loginBtn.addEventListener('click', handleLogin);
        adminPasswordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
        
        logoutBtn.addEventListener('click', handleLogout);
        
        saveMaintenanceBtn.addEventListener('click', saveMaintenanceSettings);
        testMaintenanceBtn.addEventListener('click', testMaintenanceView);
        
        saveRolesBtn.addEventListener('click', saveRoleMultipliers);
        resetRolesBtn.addEventListener('click', resetRoleMultipliers);
        
        const themeToggleBtn = document.getElementById('adminThemeToggle');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', function() {
                const cur = localStorage.getItem('pageTheme') || 'dark';
                localStorage.setItem('pageTheme', cur === 'dark' ? 'light' : 'dark');
                applyAdminTheme();
            });
        }
        
        const clearCacheBtn = document.getElementById('clearCacheBtn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', function() {
                showConfirm('Вы уверены? Это удалит все сохранённые данные (localStorage)? Восстановить их будет невозможно!')
                .then(confirmed => {
                    if (!confirmed) return;
                    localStorage.clear();
                    showToast('Все данные очищены. Страница будет перезагружена.', 'info', 2200);
                    setTimeout(() => location.reload(), 700);
                });
            });
        }
        
        clearStatsBtn.addEventListener('click', clearStatistics);
        exportDataBtn.addEventListener('click', exportAllData);
        
        const quickMaintenanceToggle = document.getElementById('quickMaintenanceToggle');
        const quickExport = document.getElementById('quickExport');
        if (quickMaintenanceToggle) {
            quickMaintenanceToggle.addEventListener('click', toggleMaintenanceQuick);
        }
        if (quickExport) {
            quickExport.addEventListener('click', () => exportDataBtn.click());
        }
        
        const clearMatchHistoryBtn = document.getElementById('clearMatchHistory');
        if (clearMatchHistoryBtn) {
            clearMatchHistoryBtn.addEventListener('click', clearMatchHistory);
        }

        const generateSimulationApiBtn = document.getElementById('generateSimulationApi');
        const copySimulationApiBtn = document.getElementById('copySimulationApi');
        const openSimulationApiBtn = document.getElementById('openSimulationApi');

        if (generateSimulationApiBtn) {
            generateSimulationApiBtn.addEventListener('click', function() {
                const url = buildSimulationApiUrl();
                const output = document.getElementById('simulationApiUrl');
                if (output) output.value = url;
            });
        }
        if (copySimulationApiBtn) {
            copySimulationApiBtn.addEventListener('click', function() {
                const output = document.getElementById('simulationApiUrl');
                if (!output || !output.value) return;
                navigator.clipboard.writeText(output.value).then(function() {
                    showMessage(systemMessage, 'Ссылка API скопирована в буфер обмена.', 'success');
                }).catch(function() {
                    showMessage(systemMessage, 'Не удалось скопировать ссылку. Попробуйте вручную.', 'error');
                });
            });
        }
        if (openSimulationApiBtn) {
            openSimulationApiBtn.addEventListener('click', function() {
                const output = document.getElementById('simulationApiUrl');
                if (!output || !output.value) return;
                window.open(output.value, '_blank');
            });
        }
    }
    
    function buildSimulationApiUrl() {
        const mode = document.getElementById('simulationApiMode')?.value || 's2';
        const format = document.getElementById('simulationApiFormat')?.value || 'mr9';
        const bo = document.getElementById('simulationApiBo')?.value || '3';
        const mapSelection = document.getElementById('simulationApiMapSelection')?.value || 'random';
        const mapsRaw = document.getElementById('simulationApiMaps')?.value || '';
        const team1 = document.getElementById('simulationApiTeam1')?.value || '';
        const team2 = document.getElementById('simulationApiTeam2')?.value || '';
        const tournament = document.getElementById('simulationApiTournament')?.value || '';
        const downloadPhoto = document.getElementById('simulationApiDownloadPhoto')?.checked;

        const params = new URLSearchParams();
        params.set('api', 'simulate');
        params.set('mode', mode);
        params.set('format', format);
        params.set('bo', bo);
        params.set('mapSelection', mapSelection);
        if (mapsRaw.trim()) {
            const maps = mapsRaw.split(',').map(function(item) { return item.trim(); }).filter(Boolean);
            if (maps.length) {
                params.set('maps', maps.join(','));
            }
        }
        if (team1.trim()) params.set('team1', team1.trim());
        if (team2.trim()) params.set('team2', team2.trim());
        if (tournament.trim()) params.set('tournament', tournament.trim());
        if (downloadPhoto) params.set('downloadPhoto', '1');

        const base = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/') + 'index.html';
        return base + '?' + params.toString();
    }
    
    // Быстрое переключение техработ
    function toggleMaintenanceQuick() {
        const current = currentMaintenanceState.maintenance_mode === 'true';
        maintenanceToggle.value = (!current).toString();
        saveMaintenanceSettings();
    }
    
    // Вход в админку
    function handleLogin() {
        const password = adminPasswordInput.value.trim();
        
        if (password === ADMIN_PASSWORD) {
            isAuthenticated = true;
            localStorage.setItem('adminAuthenticated', 'true');
            showAdminPanel();
            passwordError.style.display = 'none';
            adminPasswordInput.value = '';
        } else {
            passwordError.style.display = 'block';
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
        }
    }
    
    // Выход из админки
    function handleLogout() {
        isAuthenticated = false;
        localStorage.removeItem('adminAuthenticated');
        showPasswordScreen();
    }
    
    // Показать экран ввода пароля
    function showPasswordScreen() {
        passwordScreen.classList.remove('hidden');
        adminPanel.classList.add('hidden');
        if (window._onlineInterval) {
            clearInterval(window._onlineInterval);
            window._onlineInterval = null;
        }
        if (window._maintenanceSyncInterval) {
            clearInterval(window._maintenanceSyncInterval);
            window._maintenanceSyncInterval = null;
        }
    }
    
    // Показать админ-панель
    function showAdminPanel() {
        passwordScreen.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        loadStatistics();
        loadMatchHistory();
        loadMaintenanceSettings();
        initRoleTabs();
        loadRoleMultipliers(currentRoleMode);
        initCloudSection();
        initPlayersManagement();
        initRankingManagement();
        
        if (window._onlineInterval) clearInterval(window._onlineInterval);
        window._onlineInterval = setInterval(updateOnlineNow, 15000);
        if (window._maintenanceSyncInterval) clearInterval(window._maintenanceSyncInterval);
        if (!maintenanceServerUnavailable) {
            window._maintenanceSyncInterval = setInterval(function() {
                if (!maintenanceServerUnavailable) {
                    loadMaintenanceSettings(false);
                }
            }, 10000);
        }
    }
    
    // Получить количество онлайн пользователей
    function getOnlineNowCount() {
        try {
            const raw = localStorage.getItem(ONLINE_HEARTBEAT_KEY);
            if (!raw) return 0;
            const heartbeats = JSON.parse(raw);
            const now = Date.now();
            let count = 0;
            Object.keys(heartbeats).forEach(function (id) {
                if (now - heartbeats[id] < ONLINE_CUTOFF_MS) count++;
            });
            return count;
        } catch (e) {
            return 0;
        }
    }

    function updateOnlineNow() {
        if (onlineNowElement) onlineNowElement.textContent = getOnlineNowCount();
    }
    
    // Загрузка статистики
    function loadStatistics() {
        updateOnlineNow();
        
        const totalVisits = parseInt(localStorage.getItem('visitorCount')) || 0;
        totalVisitsElement.textContent = totalVisits.toLocaleString();
        
        const uniqueVisits = Math.floor(totalVisits * 0.7);
        uniqueVisitsElement.textContent = uniqueVisits.toLocaleString();
        
        const lastVisit = localStorage.getItem('lastVisit');
        if (lastVisit) {
            const date = new Date(lastVisit);
            lastVisitElement.textContent = date.toLocaleString('ru-RU');
        } else {
            lastVisitElement.textContent = 'Нет данных';
        }
        
        const maintenance = currentMaintenanceState.maintenance_mode;
        if (maintenance === 'true') {
            maintenanceStatusElement.textContent = 'Техработы включены';
            maintenanceStatusElement.style.color = '#f44336';
        } else {
            maintenanceStatusElement.textContent = 'Техработы выключены';
            maintenanceStatusElement.style.color = '#4CAF50';
        }
        
        updateVisitsLog();
    }
    
    // Загрузка истории матчей
    function loadMatchHistory() {
        const container = document.getElementById('matchHistoryLog');
        if (!container) return;
        let history = [];
        try {
            history = JSON.parse(localStorage.getItem('matchHistory') || '[]');
        } catch (e) {}
        // Apply optional date filter from admin UI
        try {
            const fromInput = document.getElementById('matchFilterFrom');
            const toInput = document.getElementById('matchFilterTo');
            if (fromInput && toInput) {
                const fromVal = fromInput.value;
                const toVal = toInput.value;
                if (fromVal || toVal) {
                    const fromTs = fromVal ? (new Date(fromVal + 'T00:00:00').getTime()) : -Infinity;
                    const toTs = toVal ? (new Date(toVal + 'T23:59:59').getTime()) : Infinity;
                    history = history.filter(h => {
                        try { const d = new Date(h.date).getTime(); return d >= fromTs && d <= toTs; } catch(e){ return false; }
                    });
                }
            }
        } catch(e) {}
        container.innerHTML = '';
        if (history.length === 0) {
            container.innerHTML = '<div class="visit-item" style="color: #aaa; text-align: center;">Нет сыгранных матчей. Сыграйте несколько матчей в симуляторе на главной странице.</div>';
            const totalEl = document.getElementById('matchTotalCount'); if (totalEl) totalEl.textContent = '0';
            return;
        }
        
        history.forEach(function(m, i) { if (!m.id) m.id = Date.now() - (history.length - i) * 1000; });
        try { localStorage.setItem('matchHistory', JSON.stringify(history)); } catch(e){}

        history.slice().reverse().forEach(function (m) {
            const date = new Date(m.date);
            const dateStr = date.toLocaleString('ru-RU');
            const mapsStr = (m.maps || []).map(function (map) {
                return map.mapName + ' ' + map.team1Score + ':' + map.team2Score;
            }).join(', ');
            const isCS2 = m.gameMode === 'cs2';
            const modeLabel = isCS2
                ? '<span style="font-size:0.72rem;background:rgba(13,110,253,0.25);color:#74b3ff;border-radius:6px;padding:2px 8px;font-weight:700;margin-left:6px;">🎮 CS2</span>'
                : '<span style="font-size:0.72rem;background:rgba(255,107,0,0.2);color:#ff9a40;border-radius:6px;padding:2px 8px;font-weight:700;margin-left:6px;">🔫 S2</span>';
            const matchUrl = 'index.html?match=' + m.id + (isCS2 ? '&mode=cs2' : '&mode=s2');
            const row = document.createElement('div');
            row.className = 'visit-item';
            row.style.cssText += 'flex-wrap:wrap;gap:10px;align-items:center;';
            row.innerHTML =
                '<div style="flex:1;min-width:180px;">' +
                    '<div style="font-weight:600;display:flex;align-items:center;">' + (m.tournamentName || 'Турнир') + modeLabel + '</div>' +
                    '<div class="visit-time">' + dateStr + '</div>' +
                    '<div style="font-size:0.82rem;color:#888;margin-top:3px;">' +
                        (m.maps ? m.maps.length + ' карт' : '') +
                        (m.mvpNickname ? ' ⭐ MVP: ' + m.mvpNickname : '') +
                    '</div>' +
                '</div>' +
                '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">' +
                    '<div style="font-weight:700;color:#ff6b00;">' + m.team1Name + ' <span style="color:#fff;">' + m.team1Score + ':' + m.team2Score + '</span> ' + m.team2Name + '</div>' +
                    '<div style="font-size:0.78rem;color:#666;">' + mapsStr + '</div>' +
                    '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
                        '<a href="' + matchUrl + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.3));border:1px solid rgba(168,85,247,0.5);color:#c084fc;border-radius:8px;padding:6px 14px;font-size:0.78rem;font-weight:700;text-decoration:none;" >📊 Открыть симулятор с этим матчем</a>' +
                        '<a href="match.html?id=' + m.id + '" target="_blank" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,107,0,0.15);border:1px solid rgba(255,107,0,0.4);color:#ff6b00;border-radius:8px;padding:6px 14px;font-size:0.78rem;font-weight:700;text-decoration:none;">📋 Страница матча</a>' +
                        '<button class="delete-match-btn" data-match-id="' + m.id + '" style="display:inline-flex;align-items:center;gap:5px;background:rgba(240,68,68,0.15);border:1px solid rgba(240,68,68,0.4);color:#f04444;border-radius:8px;padding:6px 14px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;transition:.2s;">🗑️ Удалить матч</button>' +
                    '</div>' +
                '</div>';
            container.appendChild(row);
        });
        const totalEl = document.getElementById('matchTotalCount'); if (totalEl) totalEl.textContent = history.length.toString();
        
        // Attach delete handlers
        container.querySelectorAll('.delete-match-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const matchId = this.getAttribute('data-match-id');
                if (matchId) {
                    deleteMatch(matchId);
                }
            });
        });
    }

    // Apply/reset filter buttons
    (function attachMatchFilterHandlers() {
        const applyBtn = document.getElementById('applyMatchFilter');
        const resetBtn = document.getElementById('resetMatchFilter');
        if (applyBtn) applyBtn.addEventListener('click', function() { loadMatchHistory(); });
        if (resetBtn) resetBtn.addEventListener('click', function() {
            const f = document.getElementById('matchFilterFrom');
            const t = document.getElementById('matchFilterTo');
            if (f) f.value = '';
            if (t) t.value = '';
            loadMatchHistory();
        });
    })();

    function clearMatchHistory() {
        showConfirm('Вы уверены, что хотите удалить всю историю сыгранных матчей?')
        .then(confirmed => {
            if (!confirmed) return;
            localStorage.removeItem('matchHistory');
            loadMatchHistory();
            showMessage(systemMessage, 'История сыгранных матчей успешно очищена.', 'success');
        });
    }

    function deleteMatch(matchId) {
        // Подтверждение удаления
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(2px);
        `;
        
        const box = document.createElement('div');
        box.style.cssText = `
            background: rgba(15, 17, 23, 0.95);
            border: 1px solid rgba(255,107,0,0.3);
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            color: white;
            font-family: Montserrat, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        `;
        
        box.innerHTML = `
            <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Удалить матч?</div>
            <div style="color: #aaa; margin-bottom: 24px; font-size: 0.95rem;">
                Матч будет удален из истории и его статистика будет удалена. Это действие необратимо.
            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button id="cancelDelete" style="padding: 8px 16px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #aaa; border-radius: 6px; cursor: pointer; font-weight: 600; font-family: inherit; transition: all 0.2s;">Отмена</button>
                <button id="confirmDelete" style="padding: 8px 16px; border: none; background: linear-gradient(135deg, #ff6b00, #ff9500); color: white; border-radius: 6px; cursor: pointer; font-weight: 700; font-family: inherit; transition: all 0.2s;">Удалить</button>
            </div>
        `;
        
        modal.appendChild(box);
        box.querySelector('#cancelDelete').addEventListener('click', function() { modal.remove(); });
        box.querySelector('#confirmDelete').addEventListener('click', function() {
            modal.remove();
            performDelete();
        });
        
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) { modal.remove(); }
        });
        
        function performDelete() {
            try {
                let history = JSON.parse(localStorage.getItem('matchHistory') || '[]');
                const matchToDelete = history.find(function(m) { return m.id === matchId || m.id === parseInt(matchId); });
                
                if (window.removeMatchFromStats && matchToDelete) {
                    window.removeMatchFromStats(matchToDelete);
                }
                
                history = history.filter(function(m) { return m.id !== matchId && m.id !== parseInt(matchId); });
                localStorage.setItem('matchHistory', JSON.stringify(history));
                
                // Синхронизируем изменения в облако если ключи настроены
                if (typeof pushMatchHistoryToCloud === 'function') {
                    pushMatchHistoryToCloud();
                }
                
                loadMatchHistory();
                if (systemMessage) {
                    showMessage(systemMessage, 'Матч успешно удалён.', 'success');
                }
            } catch (e) {
                if (systemMessage) {
                    showMessage(systemMessage, 'Ошибка при удалении матча.', 'error');
                }
            }
        }
    }

    // Обновление лога посещений
    function updateVisitsLog() {
        const visits = JSON.parse(localStorage.getItem('visitLogs')) || [];
        visitsLogElement.innerHTML = '';
        
        const recentVisits = visits.slice(-10).reverse();
        
        if (recentVisits.length === 0) {
            visitsLogElement.innerHTML = '<div class="visit-item" style="color: #aaa; text-align: center;">Нет данных о посещениях</div>';
            return;
        }
        
        recentVisits.forEach(visit => {
            const visitItem = document.createElement('div');
            visitItem.className = 'visit-item';
            
            const date = new Date(visit.timestamp);
            const timeString = date.toLocaleString('ru-RU');
            
            visitItem.innerHTML = `
                <div>
                    <div style="font-weight: 500;">Посещение сайта пользователем</div>
                    <div class="visit-time">${timeString}</div>
                </div>
                <div style="color: #ff6b00;">
                    <i class="fas fa-user"></i>
                </div>
            `;
            
            visitsLogElement.appendChild(visitItem);
        });
    }
    
    // Обновление времени сессии
    function updateSessionTime() {
        if (!isAuthenticated) return;
        
        const now = new Date();
        const diff = Math.floor((now - sessionStartTime) / 1000);
        
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        sessionTimeElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Загрузка настроек техработ
    async function loadMaintenanceSettings(showErrors = false) {
        try {
            currentMaintenanceState = await fetchMaintenanceStateFromServer();
            maintenanceServerUnavailable = false;
        } catch (error) {
            if (isMaintenanceEndpointMissing(error)) {
                disableMaintenanceServerSync();
            }
            currentMaintenanceState = readMaintenanceStateFromLocalStorage();
            if (showErrors) {
                showMessage(maintenanceMessage, 'Не удалось загрузить настройки с сервера. Используются локальные настройки.', 'info');
            }
        }

        applyMaintenanceStateToLocalStorage(currentMaintenanceState);
        updateMaintenanceUi(currentMaintenanceState);
        loadStatistics();
    }
    
    // Сохранение настроек техработ
    async function saveMaintenanceSettings() {
        const isMaintenance = maintenanceToggle.value === 'true';
        const until = maintenanceUntil.value;
        const reason = maintenanceReasonInput.value.trim();

        const nextState = normalizeMaintenanceState({
            maintenance_mode: isMaintenance ? 'true' : 'false',
            maintenance_until: until || null,
            maintenance_reason: reason || null
        });

        try {
            currentMaintenanceState = await saveMaintenanceStateToServer(nextState);
        } catch (error) {
            if (isMaintenanceEndpointMissing(error) || error.message === 'maintenance_endpoint_unavailable') {
                disableMaintenanceServerSync();
                currentMaintenanceState = normalizeMaintenanceState(nextState);
            } else {
                showMessage(maintenanceMessage, 'Не удалось сохранить настройки на сервере. Изменения сохранены локально.', 'error');
                return;
            }
        }

        applyMaintenanceStateToLocalStorage(currentMaintenanceState);
        updateMaintenanceUi(currentMaintenanceState);
        
        const visits = JSON.parse(localStorage.getItem('visitLogs')) || [];
        visits.push({
            timestamp: new Date().toISOString(),
            type: 'maintenance_update',
            status: isMaintenance ? 'enabled' : 'disabled'
        });
        localStorage.setItem('visitLogs', JSON.stringify(visits.slice(-100)));
        
        showMessage(maintenanceMessage, 'Настройки технических работ успешно сохранены!', 'success');
        loadStatistics();
    }
    
    // Предпросмотр страницы техработ
    function testMaintenanceView() {
        const isMaintenance = maintenanceToggle.value === 'true';
        const until = maintenanceUntil.value;
        const reason = maintenanceReasonInput.value.trim();
        
        if (!isMaintenance) {
            showMessage(maintenanceMessage, 'Технические работы на сайте выключены. Включите их, чтобы увидеть предпросмотр.', 'info');
            return;
        }
        
        let html = `
            <div style="background: rgba(0,0,0,0.9); position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; display: flex; justify-content: center; align-items: center; color: white;">
                <div style="max-width: 600px; padding: 40px; text-align: center;">
                    <h1 style="color: #ff6b00; margin-bottom: 20px; font-size: 2.5rem;">ПРЕДПРОСМОТР СТРАНИЦЫ ТЕХНИЧЕСКИХ РАБОТ</h1>
                    <p style="font-size: 1.2rem; margin-bottom: 30px;">Страница технических работ будет выглядеть примерно так. Пользователи увидят информационное сообщение о временной недоступности сайта.</p>
                    <div style="background: rgba(255,107,0,0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
        `;
        
        if (until) {
            const date = new Date(until);
            html += `<p><i class="fas fa-clock"></i> Планируемая дата окончания работ: ${date.toLocaleString('ru-RU')}</p>`;
        }
        
        if (reason) {
            html += `<p><i class="fas fa-info-circle"></i> Причина: ${reason}</p>`;
        }
        
        html += `
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" style="background: #ff6b00; color: white; border: none; padding: 12px 30px; border-radius: 5px; font-size: 1rem; cursor: pointer; margin-top: 20px;">
                        Закрыть предпросмотр
                    </button>
                </div>
            </div>
        `;
        
        const testDiv = document.createElement('div');
        testDiv.innerHTML = html;
        document.body.appendChild(testDiv);
    }
    
    // Загрузка множителей ролей
    function loadRoleMultipliers(mode) {
        currentRoleMode = mode || currentRoleMode || 's2';
        const savedRoles = JSON.parse(localStorage.getItem(getRoleStorageKey(currentRoleMode))) || getDefaultRoles(currentRoleMode);
        
        rolesTableBody.innerHTML = '';
        
        savedRoles.forEach(role => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${role.name}</strong><br>
                    <small style="color: #aaa;">ID: ${role.id}</small>
                </td>
                <td>
                    <input type="number" step="0.01" min="0.5" max="2.0" 
                           value="${role.killMultiplier}" 
                           data-role="${role.id}" 
                           data-field="killMultiplier"
                           class="role-input">
                </td>
                <td>
                    <input type="number" step="0.01" min="0.5" max="2.0" 
                           value="${role.skillMultiplier}" 
                           data-role="${role.id}" 
                           data-field="skillMultiplier"
                           class="role-input">
                </td>
                <td>
                    <input type="number" step="0.01" min="0.5" max="2.0" 
                           value="${role.impact}" 
                           data-role="${role.id}" 
                           data-field="impact"
                           class="role-input">
                </td>
            `;
            rolesTableBody.appendChild(row);
        });
    }
    
    // Сохранение множителей ролей
    function saveRoleMultipliers() {
        const inputs = document.querySelectorAll('.role-input');
        const roles = JSON.parse(localStorage.getItem(getRoleStorageKey(currentRoleMode))) || getDefaultRoles(currentRoleMode);
        
        inputs.forEach(input => {
            const roleId = input.dataset.role;
            const field = input.dataset.field;
            const value = parseFloat(input.value);
            
            if (!isNaN(value) && value >= 0.5 && value <= 2.0) {
                const role = roles.find(r => r.id === roleId);
                if (role) {
                    role[field] = value;
                }
            }
        });
        
        localStorage.setItem(getRoleStorageKey(currentRoleMode), JSON.stringify(roles));
        
        const visits = JSON.parse(localStorage.getItem('visitLogs')) || [];
        visits.push({
            timestamp: new Date().toISOString(),
            type: 'role_multipliers_update'
        });
        localStorage.setItem('visitLogs', JSON.stringify(visits.slice(-100)));
        
        showMessage(rolesMessage, 'Множители ролей успешно сохранены!', 'success');
    }
    
    // Сброс множителей ролей
    function resetRoleMultipliers() {
        showConfirm('Вы уверены, что хотите сбросить множители ролей к значениям по умолчанию?')
        .then(confirmed => {
            if (!confirmed) return;
            localStorage.setItem(getRoleStorageKey(currentRoleMode), JSON.stringify(getDefaultRoles(currentRoleMode)));
            loadRoleMultipliers(currentRoleMode);

            const visits = JSON.parse(localStorage.getItem('visitLogs')) || [];
            visits.push({
                timestamp: new Date().toISOString(),
                type: 'role_multipliers_reset'
            });
            localStorage.setItem('visitLogs', JSON.stringify(visits.slice(-100)));

            showMessage(rolesMessage, 'Множители ролей сброшены к значениям по умолчанию!', 'success');
        });
    }

    function setRoleTabsVisualState(mode) {
        const tabS2 = document.getElementById('roleTabS2');
        const tabCS2 = document.getElementById('roleTabCS2');
        if (!tabS2 || !tabCS2) return;

        const activeStyles = {
            border: '1px solid #ff6b00',
            background: 'rgba(255,107,0,0.25)',
            color: '#ff9a40'
        };
        const inactiveStyles = {
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.05)',
            color: '#666'
        };

        Object.assign(tabS2.style, mode === 's2' ? activeStyles : inactiveStyles);
        Object.assign(tabCS2.style, mode === 'cs2' ? activeStyles : inactiveStyles);
    }

    function initRoleTabs() {
        const tabS2 = document.getElementById('roleTabS2');
        const tabCS2 = document.getElementById('roleTabCS2');
        if (!tabS2 || !tabCS2) return;

        const savedMode = localStorage.getItem('adminRoleMode');
        currentRoleMode = savedMode === 'cs2' ? 'cs2' : 's2';
        setRoleTabsVisualState(currentRoleMode);

        tabS2.onclick = function () {
            currentRoleMode = 's2';
            localStorage.setItem('adminRoleMode', 's2');
            setRoleTabsVisualState('s2');
            loadRoleMultipliers('s2');
        };

        tabCS2.onclick = function () {
            currentRoleMode = 'cs2';
            localStorage.setItem('adminRoleMode', 'cs2');
            setRoleTabsVisualState('cs2');
            loadRoleMultipliers('cs2');
        };
    }
    
    // Очистка статистики
    function clearStatistics() {
        showConfirm('Вы уверены, что хотите очистить всю статистику посещений? Это действие необратимо.')
        .then(confirmed => {
            if (!confirmed) return;
            localStorage.removeItem('visitorCount');
            localStorage.removeItem('lastVisit');
            localStorage.removeItem('visitLogs');
            
            const visits = [];
            visits.push({
                timestamp: new Date().toISOString(),
                type: 'statistics_cleared',
                clearedBy: 'admin'
            });
            localStorage.setItem('visitLogs', JSON.stringify(visits.slice(-100)));
            
            loadStatistics();
            showMessage(systemMessage, 'Статистика посещений успешно очищена!', 'success');
        });
    }
    
    // Экспорт всех данных
    function exportAllData() {
        const data = {
            exportDate: new Date().toISOString(),
            statistics: {
                visitorCount: localStorage.getItem('visitorCount') || 0,
                lastVisit: localStorage.getItem('lastVisit') || null,
                maintenance_mode: currentMaintenanceState.maintenance_mode || 'false',
                maintenance_until: currentMaintenanceState.maintenance_until || null,
                maintenance_reason: currentMaintenanceState.maintenance_reason || null
            },
            roles: JSON.parse(localStorage.getItem('roleMultipliers')) || defaultRolesS2,
            rolesCS2: JSON.parse(localStorage.getItem('roleMultipliersCS2')) || defaultRolesCS2,
            visitLogs: JSON.parse(localStorage.getItem('visitLogs')) || [],
            theme: localStorage.getItem('imageTheme') || 'orange'
        };
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `standoff2_admin_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showMessage(systemMessage, 'Данные успешно экспортированы в JSON-файл!', 'success');
    }
    
    // ============================================================
    // Облачное хранилище JSONBin.io
    // ============================================================
    function initCloudSection() {
        var keyInput = document.getElementById('cloudMasterKey');
        var binInput = document.getElementById('cloudBinId');
        var statusEl = document.getElementById('cloudStatusMsg');
        if (!keyInput || !binInput) return;

        keyInput.value = localStorage.getItem('cloud_access_key') || '';
        binInput.value = localStorage.getItem('cloud_bin_id') || '';

        function setStatus(msg, color) {
            if (statusEl) { statusEl.textContent = msg; statusEl.style.color = color || '#888'; }
        }

        function getKeys() {
            return {
                key: (keyInput.value || '').trim(),
                bin: (binInput.value || '').trim()
            };
        }

        var saveBtn = document.getElementById('saveCloudKeys');
        var testBtn = document.getElementById('testCloudConnection');
        var pushBtn = document.getElementById('pushCloudStats');
        var pullBtn = document.getElementById('pullCloudStats');

        if (saveBtn) saveBtn.onclick = function() {
            var k = getKeys();
            if (!k.key || !k.bin) { setStatus('Ошибка: нужны и Access Key, и Bin ID', '#f44336'); return; }
            localStorage.setItem('cloud_access_key', k.key);
            localStorage.setItem('cloud_bin_id', k.bin);
            localStorage.removeItem('cloud_master_key');
            setStatus('Ключи доступа к облаку успешно сохранены!', '#4bcd7b');
        };

        if (testBtn) testBtn.onclick = function() {
            var k = getKeys();
            if (!k.key || !k.bin) { setStatus('Ошибка: нужны и Access Key, и Bin ID', '#f44336'); return; }
            setStatus('Проверка подключения к облаку...', '#aaa');
            fetch('https://api.jsonbin.io/v3/b/' + k.bin + '/latest', {
                headers: { 'X-Access-Key': k.key }
            }).then(function(r) {
                if (!r.ok) return Promise.reject('HTTP ' + r.status);
                return r.json();
            }).then(function(data) {
                var upd = data.record && data.record.updatedAt;
                setStatus('Подключение к облаку OK!' + (upd ? ' Последнее обновление: ' + new Date(upd).toLocaleString('ru-RU') : ''), '#4bcd7b');
            }).catch(function(e) {
                setStatus('Ошибка подключения: ' + e + '. Проверьте Access Key и Bin ID', '#f44336');
            });
        };

        if (pushBtn) pushBtn.onclick = function() {
            var k = getKeys();
            if (!k.key || !k.bin) { setStatus('Ошибка: нужны и Access Key, и Bin ID', '#f44336'); return; }
            var stats = {};
            var history = [];
            try { stats = JSON.parse(localStorage.getItem('globalPlayerStats') || '{}'); } catch(e) {}
            try { history = JSON.parse(localStorage.getItem('matchHistory') || '[]'); } catch(e) {}
            if (Object.keys(stats).length === 0 && history.length === 0) { setStatus('Нет данных для выгрузки. Сначала сыграйте матчи с включённой статистикой.', '#f0c040'); return; }
            setStatus('Выгрузка данных в облако...', '#aaa');
            var uploadData = {
                globalPlayerStats: stats,
                matchHistory: history,
                updatedAt: new Date().toISOString()
            };
            fetch('https://api.jsonbin.io/v3/b/' + k.bin, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-Access-Key': k.key },
                body: JSON.stringify(uploadData)
            }).then(function(r) {
                if (!r.ok) return Promise.reject('HTTP ' + r.status);
                return r.json();
            }).then(function() {
                var msg = Object.keys(stats).length + ' игроков';
                if (history.length > 0) {
                    msg = msg + ' и ' + history.length + ' матчей';
                }
                setStatus('Данные успешно выгружены в облако! (' + msg + ')', '#4bcd7b');
            }).catch(function(e) {
                setStatus('Ошибка выгрузки: ' + e, '#f44336');
            });
        };

        if (pullBtn) pullBtn.onclick = function() {
            var k = getKeys();
            if (!k.key || !k.bin) { setStatus('Ошибка: нужны и Access Key, и Bin ID', '#f44336'); return; }
            setStatus('Загрузка данных из облака...', '#aaa');
            fetch('https://api.jsonbin.io/v3/b/' + k.bin + '/latest', {
                headers: { 'X-Access-Key': k.key }
            }).then(function(r) {
                if (!r.ok) return Promise.reject('HTTP ' + r.status);
                return r.json();
            }).then(function(data) {
                var cloudStats = (data.record && data.record.globalPlayerStats) || null;
                var cloudHistory = (data.record && data.record.matchHistory) || null;
                var updatedItems = 0;
                
                if (cloudStats && Object.keys(cloudStats).length > 0) {
                    localStorage.setItem('globalPlayerStats', JSON.stringify(cloudStats));
                    updatedItems += Object.keys(cloudStats).length;
                }
                
                if (cloudHistory && Array.isArray(cloudHistory) && cloudHistory.length > 0) {
                    localStorage.setItem('matchHistory', JSON.stringify(cloudHistory));
                    updatedItems = Math.max(updatedItems, cloudHistory.length);
                    setStatus('Данные успешно загружены из облака! ' + updatedItems + ' записей обновлено ' + (cloudStats ? '(игроки + матчи)' : '(матчи)'), '#4bcd7b');
                } else if (updatedItems > 0) {
                    setStatus('Данные успешно загружены из облака! ' + updatedItems + ' игроков обновлено', '#4bcd7b');
                } else {
                    setStatus('В облаке нет данных для загрузки', '#f0c040');
                }
                if (updatedItems > 0 && window.location.hash === '#admin') {
                    setTimeout(function() {
                        if (typeof loadPlayers === 'function') loadPlayers();
                        if (typeof loadMatchHistory === 'function') loadMatchHistory();
                    }, 500);
                }
            }).catch(function(e) {
                setStatus('Ошибка загрузки: ' + e, '#f44336');
            });
        };
    }

    // ============================================================
    // DeepSeek API для AI-тренера
    // ============================================================
    function initDeepSeekSection() {
        const keyInput = document.getElementById('deepseekKeyInput');
        const statusEl = document.getElementById('deepseekAdminStatus');
        const saveBtn  = document.getElementById('saveDeepSeekKey');
        const testBtn  = document.getElementById('testDeepSeekKey');
        const clearBtn = document.getElementById('clearDeepSeekKey');
        if (!keyInput) return;

        const DS_ENDPOINT = '/.netlify/functions/deepseek-key';

        function setStatus(msg, color) {
            if (statusEl) { statusEl.textContent = msg; statusEl.style.color = color || '#888'; }
        }

        function getJBCreds() {
            return {
                accessKey: localStorage.getItem('cloud_access_key') || '',
                binId: localStorage.getItem('cloud_bin_id') || ''
            };
        }

        function checkCreds() {
            const c = getJBCreds();
            if (!c.accessKey || !c.binId) {
                setStatus('Для работы DeepSeek API сначала настройте JSONBin (Access Key и Bin ID) в разделе выше.', '#f0c040');
                return false;
            }
            return true;
        }

        function loadCurrentKey() {
            const c = getJBCreds();
            if (!c.accessKey || !c.binId) { setStatus('Настройте JSONBin в разделе выше', '#888'); return; }
            fetch(`${DS_ENDPOINT}?ak=${encodeURIComponent(c.accessKey)}&bid=${encodeURIComponent(c.binId)}`, { cache: 'no-store' })
                .then(r => r.ok ? r.json() : null)
                .then(data => {
                    if (data && data.key && data.key.length > 6) {
                        keyInput.placeholder = data.key.slice(0, 6) + '••••••••••••••••••••' + data.key.slice(-4);
                        setStatus('Ключ DeepSeek API загружен из облака. Готов к использованию.', '#4bcd7b');
                    } else {
                        setStatus('Ключ DeepSeek API не найден в облаке. Вставьте ключ и сохраните.', '#888');
                    }
                }).catch(() => setStatus('Не удалось загрузить ключ из облака', '#f0c040'));
        }
        loadCurrentKey();

        if (saveBtn) saveBtn.onclick = function() {
            if (!checkCreds()) return;
            const val = keyInput.value.trim();
            if (!val) { setStatus('Введите API ключ DeepSeek', '#f44336'); return; }
            setStatus('Сохранение ключа...', '#aaa');
            const c = getJBCreds();
            fetch(DS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_PASSWORD },
                body: JSON.stringify({ key: val, accessKey: c.accessKey, binId: c.binId })
            }).then(r => r.ok ? r.json() : Promise.reject('HTTP ' + r.status))
              .then(() => {
                  setStatus('Ключ DeepSeek API успешно сохранён в облаке! AI-тренер активирован.', '#4bcd7b');
                  keyInput.placeholder = val.slice(0, 6) + '••••••••••••••••••••' + val.slice(-4);
                  keyInput.value = '';
              }).catch(e => setStatus('Ошибка сохранения ключа: ' + e, '#f44336'));
        };

        if (testBtn) testBtn.onclick = function() {
            if (!checkCreds()) return;
            setStatus('Проверка API ключа DeepSeek...', '#aaa');
            const c = getJBCreds();
            fetch(`${DS_ENDPOINT}?ak=${encodeURIComponent(c.accessKey)}&bid=${encodeURIComponent(c.binId)}`, { cache: 'no-store' })
                .then(r => r.ok ? r.json() : Promise.reject('HTTP ' + r.status))
                .then(data => {
                    const k = data && data.key;
                    if (!k) { setStatus('Ключ DeepSeek не найден в облаке. Сохраните его сначала.', '#888'); return; }
                    return fetch('https://api.deepseek.com/chat/completions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + k },
                        body: JSON.stringify({ model: 'deepseek-chat', max_tokens: 5, messages: [{ role: 'user', content: 'test' }] })
                    }).then(r => {
                        if (r.status === 200 || r.status === 400) setStatus('Ключ DeepSeek API валиден! AI-тренер готов к работе.', '#4bcd7b');
                        else if (r.status === 401) setStatus('Неверный API ключ DeepSeek (401). Проверьте ключ.', '#f44336');
                        else if (r.status === 402) setStatus('Недостаточно средств на балансе DeepSeek API (402). Пополните баланс.', '#f44336');
                        else setStatus('Ошибка проверки DeepSeek API: HTTP ' + r.status, '#f0c040');
                    });
                }).catch(e => setStatus('Ошибка проверки ключа: ' + e, '#f44336'));
        };

        if (clearBtn) clearBtn.onclick = function() {
            if (!checkCreds()) return;
            showConfirm('Вы уверены, что хотите удалить сохранённый DeepSeek API ключ? AI-тренер перестанет работать.')
            .then(confirmed => {
                if (!confirmed) return;
                setStatus('Удаление ключа...', '#aaa');
                const c = getJBCreds();
                fetch(DS_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_PASSWORD },
                    body: JSON.stringify({ key: '', accessKey: c.accessKey, binId: c.binId })
                }).then(r => r.ok ? r.json() : Promise.reject('HTTP ' + r.status))
                  .then(() => {
                      keyInput.value = '';
                      keyInput.placeholder = 'sk-...';
                      setStatus('Ключ DeepSeek API удалён из облака. AI-тренер отключён.', '#888');
                  }).catch(e => setStatus('Ошибка удаления ключа: ' + e, '#f44336'));
            });
        };
    }

    // ============================================================
    // Управление статистикой игроков
    // ============================================================
    function initPlayersManagement() {
        const searchInput = document.getElementById('playerSearchInput');
        const sortSelect = document.getElementById('playerSortSelect');
        const refreshBtn = document.getElementById('playerRefreshBtn');
        if (!searchInput) return;

        searchInput.addEventListener('input', function() {
            loadPlayers();
        });

        sortSelect.addEventListener('change', function() {
            loadPlayers();
        });

        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                loadPlayers();
            });
        }

        loadPlayers();
    }

    function loadPlayers() {
        try {
            const stats = JSON.parse(localStorage.getItem('globalPlayerStats') || '{}');
            const tableBody = document.getElementById('playersTableBody');
            if (!tableBody) return;

            if (Object.keys(stats).length === 0) {
                tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#666;padding:20px;">Нет данных. Статистика отключена или нет сыгранных матчей.</td></tr>';
                return;
            }

            let players = [];
            for (let key in stats) {
                if (stats.hasOwnProperty(key)) {
                    players.push(stats[key]);
                }
            }

            players = filterAndSortPlayers(players);

            tableBody.innerHTML = '';
            if (players.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#666;padding:20px;">По вашему запросу ничего не найдено.</td></tr>';
                return;
            }

            players.forEach(player => {
                const kd = player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills.toFixed(2);
                const avgAdr = player.totalRounds > 0 ? (player.adrSum / player.totalRounds).toFixed(1) : '0.0';
                const avgKast = player.totalRounds > 0 ? ((player.kastSum / player.totalRounds) * 100).toFixed(1) : '0.0';
                const rating = player.matches > 0 ? (player.ratingSum / player.matches).toFixed(2) : '0.00';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${escapeHtml(player.nickname)}</strong></td>
                    <td>${escapeHtml(player.teamName)}</td>
                    <td>${player.matches}</td>
                    <td>${kd}</td>
                    <td>${rating}</td>
                    <td>${avgAdr}</td>
                    <td>${avgKast}%</td>
                    <td>
                        <button class="delete-player-btn" data-player-key="${player.nickname.toLowerCase()}" 
                                style="background:#f44336;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:0.85rem;">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);

                const deleteBtn = row.querySelector('.delete-player-btn');
                deleteBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const playerKey = this.getAttribute('data-player-key');
                    handlePlayerDelete(playerKey, player.nickname);
                });
            });
        } catch (e) {
            console.error('Error loading players:', e);
        }
    }

    function filterAndSortPlayers(players) {
        const searchInput = document.getElementById('playerSearchInput');
        const sortSelect = document.getElementById('playerSortSelect');
        const searchValue = (searchInput.value || '').toLowerCase();
        const sortValue = sortSelect.value;

        let filtered = players;
        if (searchValue) {
            filtered = players.filter(p => p.nickname.toLowerCase().includes(searchValue));
        }

        // Сортировка
        filtered.sort((a, b) => {
            switch (sortValue) {
                case 'matches':
                    return b.matches - a.matches;
                case 'kills':
                    return b.kills - a.kills;
                case 'kd':
                    const kdA = a.deaths > 0 ? a.kills / a.deaths : a.kills;
                    const kdB = b.deaths > 0 ? b.kills / b.deaths : b.kills;
                    return kdB - kdA;
                case 'rating':
                default:
                    const ratingA = a.matches > 0 ? a.ratingSum / a.matches : 0;
                    const ratingB = b.matches > 0 ? b.ratingSum / b.matches : 0;
                    return ratingB - ratingA;
            }
        });

        return filtered;
    }

    function handlePlayerDelete(playerKey, playerNick) {
        if (!playerKey) {
            showMessage(document.getElementById('playersMessage'), 'Ошибка: ключ игрока не определён.', 'error');
            return;
        }
        
        showConfirm(`Вы уверены, что хотите удалить ${playerNick} из глобальной статистики? Это действие необратимо.`)
        .then(confirmed => {
            if (!confirmed) return;
            
            console.log('handlePlayerDelete: Попытка удалить игрока', { playerKey, playerNick });

            const result = deletePlayer(playerKey);
            console.log('handlePlayerDelete: Результат deletePlayer -', result);
            
            if (result) {
                showMessage(document.getElementById('playersMessage'), `Игрок ${playerNick} успешно удалён.`, 'success');
                setTimeout(function() { loadPlayers(); }, 300);
            } else {
                showMessage(document.getElementById('playersMessage'), 'Ошибка: не удалось удалить игрока (см. консоль).', 'error');
            }
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Показ сообщений
    function showMessage(element, text, type) {
        if (!element) return;
        element.textContent = text;
        element.className = `message message-${type}`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }

    // ============================================================
    // Управление Ranking таблицей команд
    // ============================================================
    let currentRankingMode = 's2';

    function initRankingManagement() {
        const tabS2 = document.getElementById('rankingTabS2');
        const tabCS2 = document.getElementById('rankingTabCS2');
        const addBtn = document.getElementById('addRankingTeam');

        if (tabS2) {
            tabS2.addEventListener('click', function() {
                currentRankingMode = 's2';
                updateRankingTabsStyle();
                loadRanking();
            });
        }

        if (tabCS2) {
            tabCS2.addEventListener('click', function() {
                currentRankingMode = 'cs2';
                updateRankingTabsStyle();
                loadRanking();
            });
        }

        if (addBtn) {
            addBtn.addEventListener('click', addTeamToRanking);
        }

        loadRanking();
    }

    function updateRankingTabsStyle() {
        const tabS2 = document.getElementById('rankingTabS2');
        const tabCS2 = document.getElementById('rankingTabCS2');
        const activeStyles = { border: '1px solid #ff6b00', background: 'rgba(255,107,0,0.25)', color: '#ff9a40' };
        const inactiveStyles = { border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#666' };

        if (tabS2) Object.assign(tabS2.style, currentRankingMode === 's2' ? activeStyles : inactiveStyles);
        if (tabCS2) Object.assign(tabCS2.style, currentRankingMode === 'cs2' ? activeStyles : inactiveStyles);
    }

    function getRankingStorageKey() {
        return currentRankingMode === 'cs2' ? 'rankingCS2' : 'rankingS2';
    }

    function loadRanking() {
        try {
            const ranking = JSON.parse(localStorage.getItem(getRankingStorageKey()) || '[]');
            const tableBody = document.getElementById('rankingTableBody');
            if (!tableBody) return;

            tableBody.innerHTML = '';

            if (ranking.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#666;padding:20px;">Нет команд. Добавьте первую команду выше.</td></tr>';
                return;
            }

            // Сортируем по RP (по убыванию)
            ranking.sort((a, b) => b.rp - a.rp);

            ranking.forEach((team, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="text-align:center;font-weight:700;color:#ff6b00;">${index + 1}</td>
                    <td><strong>${escapeHtml(team.name)}</strong></td>
                    <td style="text-align:center;font-weight:600;color:#fff;">${team.rp}</td>
                    <td style="text-align:center;">
                        <button class="edit-rp-btn" data-team-id="${team.id}" style="background:#4CAF50;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:0.8rem;margin-right:4px;font-family:inherit;">
                            ✏️ RP
                        </button>
                        <button class="delete-team-btn" data-team-id="${team.id}" style="background:#f44336;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:0.8rem;font-family:inherit;">
                            🗑️ Удалить
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);

                const editBtn = row.querySelector('.edit-rp-btn');
                const deleteBtn = row.querySelector('.delete-team-btn');

                editBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    editTeamRP(team.id, team.name, team.rp);
                });

                deleteBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    deleteTeamFromRanking(team.id, team.name);
                });
            });
        } catch (e) {
            console.error('Error loading ranking:', e);
        }
    }

    function addTeamToRanking() {
        const nameInput = document.getElementById('rankingTeamName');
        const rpInput = document.getElementById('rankingTeamRP');
        const msgEl = document.getElementById('rankingMessage');

        const name = (nameInput.value || '').trim();
        const rp = parseInt(rpInput.value) || 1000;

        if (!name) {
            showMessage(msgEl, 'Введите название команды.', 'error');
            return;
        }

        try {
            const ranking = JSON.parse(localStorage.getItem(getRankingStorageKey()) || '[]');
            const team = {
                id: Date.now().toString(),
                name: name,
                rp: rp
            };

            ranking.push(team);
            localStorage.setItem(getRankingStorageKey(), JSON.stringify(ranking));

            // Синхронизируем в облако
            if (typeof pushRankingToCloud === 'function') {
                pushRankingToCloud();
            }

            showMessage(msgEl, `Команда "${name}" добавлена с ${rp} RP.`, 'success');
            nameInput.value = '';
            rpInput.value = '1000';
            loadRanking();
        } catch (e) {
            showMessage(msgEl, 'Ошибка при добавлении команды.', 'error');
        }
    }

    function editTeamRP(teamId, teamName, currentRP) {
        const newRPStr = window.prompt(`Введите новое количество RP для команды "${teamName}"\n(текущее значение: ${currentRP}):`, currentRP.toString());
        if (!newRPStr) return;

        const newRP = parseInt(newRPStr);
        if (isNaN(newRP)) {
            window.alert('Ошибка: введите корректное число.');
            return;
        }

        try {
            const ranking = JSON.parse(localStorage.getItem(getRankingStorageKey()) || '[]');
            const team = ranking.find(t => t.id === teamId);
            if (team) {
                team.rp = newRP;
                localStorage.setItem(getRankingStorageKey(), JSON.stringify(ranking));

                if (typeof pushRankingToCloud === 'function') {
                    pushRankingToCloud();
                }

                const msgEl = document.getElementById('rankingMessage');
                showMessage(msgEl, `RP команды "${teamName}" изменено на ${newRP}.`, 'success');
                loadRanking();
            }
        } catch (e) {
            window.alert('Ошибка при изменении RP.');
        }
    }

    function deleteTeamFromRanking(teamId, teamName) {
        showConfirm(`Удалить команду "${teamName}" из рейтинга? Это действие необратимо.`)
        .then(confirmed => {
            if (!confirmed) return;

            try {
                const ranking = JSON.parse(localStorage.getItem(getRankingStorageKey()) || '[]');
                const filtered = ranking.filter(t => t.id !== teamId);
                localStorage.setItem(getRankingStorageKey(), JSON.stringify(filtered));

                if (typeof pushRankingToCloud === 'function') {
                    pushRankingToCloud();
                }

                const msgEl = document.getElementById('rankingMessage');
                showMessage(msgEl, `Команда "${teamName}" удалена.`, 'success');
                loadRanking();
            } catch (e) {
                const msgEl = document.getElementById('rankingMessage');
                showMessage(msgEl, 'Ошибка при удалении команды.', 'error');
            }
        });
    }

    // Инициализация
    initAdminPanel();
    initDeepSeekSection();
});