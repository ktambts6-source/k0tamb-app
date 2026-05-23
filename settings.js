// Управление настройками темы, звука, светлой/тёмной темы и подробных комментариев
console.log('settings.js loaded');

// Debug: Enable ranking mode directly via console
window.enableRankingMode = function() {
    localStorage.setItem('rankingModeEnabled', 'true');
    console.log('Ranking mode enabled (debug mode)');
};

window.disableRankingMode = function() {
    localStorage.setItem('rankingModeEnabled', 'false');
    console.log('Ranking mode disabled (debug mode)');
};

// Function to show password modal
window.showRankingPasswordModal = function(callback) {
    console.log('showRankingPasswordModal called');
    var modal = document.getElementById('rankingPasswordModal');
    var passwordInput = document.getElementById('rankingPassword');
    var errorEl = document.getElementById('rankingPasswordError');
    var confirmBtn = document.getElementById('rankingPasswordConfirm');
    var cancelBtn = document.getElementById('rankingPasswordCancel');
    
    console.log('modal found:', !!modal);
    console.log('passwordInput found:', !!passwordInput);
    console.log('errorEl found:', !!errorEl);
    console.log('confirmBtn found:', !!confirmBtn);
    console.log('cancelBtn found:', !!cancelBtn);
    
    if (!modal) {
        console.error('rankingPasswordModal not found!');
        if (callback) callback(false);
        return;
    }
    
    // Clear previous password and error
    passwordInput.value = '';
    errorEl.style.display = 'none';
    errorEl.textContent = '';
    
    // Open modal
    console.log('Opening modal...');
    modal.classList.remove('hidden');
    passwordInput.focus();
    console.log('Modal should be visible now');
    
    // Setup event handlers
    var handleConfirm = function() {
        var pwd = passwordInput.value;
        if (pwd !== 'parol123kotamb') {
            errorEl.textContent = 'Неправильный пароль';
            errorEl.style.display = 'block';
            return;
        }
        modal.classList.add('hidden');
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
        passwordInput.onkeypress = null;
        if (callback) callback(true);
    };
    
    var handleCancel = function() {
        modal.classList.add('hidden');
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
        passwordInput.onkeypress = null;
        if (callback) callback(false);
    };
    
    confirmBtn.onclick = handleConfirm;
    cancelBtn.onclick = handleCancel;
    
    // Allow Enter key to confirm
    passwordInput.onkeypress = function(e) {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };
    
    // Close button
    var closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = handleCancel;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired, initializing settings...');

    const settingsBtn = document.getElementById('openSettings');
    const themeModal = document.getElementById('themeModal');
    const closeButtons = document.querySelectorAll('.close-modal');

    let applyThemeBtn = document.getElementById('applyTheme');
    console.log('applyThemeBtn found:', !!applyThemeBtn);

    const themeOptions = document.querySelectorAll('.theme-option');
    const detailedCommentsToggle = document.getElementById('detailedCommentsToggle');
    const soundOnCompletion = document.getElementById('soundOnCompletion');
    const pageThemeDark = document.getElementById('pageThemeDark');
    const pageThemeLight = document.getElementById('pageThemeLight');
    const statsTrackingToggle = document.getElementById('statsTrackingToggle');
    
    let selectedTheme = localStorage.getItem('imageTheme') || 'orange';
    
    function applyPageTheme() {
        const theme = localStorage.getItem('pageTheme') || 'dark';
        if (theme === 'light') {
            document.body.classList.add('theme-light');
        } else {
            document.body.classList.remove('theme-light');
        }
    }
    
    applyPageTheme();

    let rankingModeToggle = null;
    let rankingListenerAdded = false;
    
    settingsBtn.addEventListener('click', function() {
        themeModal.classList.remove('hidden');
        
        if (detailedCommentsToggle) {
            detailedCommentsToggle.checked = localStorage.getItem('detailedCommentsEnabled') !== 'false';
        }
        
        var mapIntroToggle = document.getElementById('mapIntroToggle');
        if (mapIntroToggle) {
            mapIntroToggle.checked = localStorage.getItem('mapIntroEnabled') !== 'false';
        }
        
        if (soundOnCompletion) {
            soundOnCompletion.checked = localStorage.getItem('soundOnCompletion') === 'true';
        }
        
        if (statsTrackingToggle) {
            statsTrackingToggle.checked = localStorage.getItem('statsTrackingEnabled') === 'true';
        }

        rankingModeToggle = document.getElementById('rankingModeToggle');
        console.log('🔍 Trying to find rankingModeToggle...');
        console.log('rankingModeToggle element:', rankingModeToggle);
        console.log('rankingModeToggle is null?', rankingModeToggle === null);
        console.log('rankingModeToggle is undefined?', rankingModeToggle === undefined);
        
        if (rankingModeToggle) {
            const savedValue = localStorage.getItem('rankingModeEnabled');
            rankingModeToggle.checked = savedValue === 'true';
            console.log('✅ rankingModeToggle FOUND and loaded');
            console.log('Saved value in localStorage:', savedValue);
            console.log('rankingModeToggle.checked now:', rankingModeToggle.checked);
        } else {
            console.error('❌ rankingModeToggle NOT FOUND! ID might be wrong');
        }

        const pageTheme = localStorage.getItem('pageTheme') || 'dark';
        if (pageThemeDark) pageThemeDark.checked = (pageTheme === 'dark');
        if (pageThemeLight) pageThemeLight.checked = (pageTheme === 'light');

        themeOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.theme === selectedTheme) {
                option.classList.add('selected');
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            themeModal.classList.add('hidden');
        });
    });

    themeModal.addEventListener('click', function(e) {
        if (e.target === themeModal) {
            themeModal.classList.add('hidden');
        }
    });

    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            themeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedTheme = this.dataset.theme;
        });
    });

    // Apply Theme Button Click Handler
    console.log('applyThemeBtn element:', applyThemeBtn);
    if (applyThemeBtn) {
        console.log('✅ Attaching click listener to applyThemeBtn...');
        applyThemeBtn.addEventListener('click', function(event) {
            console.log('🔥 === SAVE BUTTON CLICKED ===');
            
            rankingModeToggle = document.getElementById('rankingModeToggle');
            console.log('🔍 On SAVE click - rankingModeToggle:', rankingModeToggle);
            console.log('rankingModeToggle.checked:', rankingModeToggle ? rankingModeToggle.checked : 'ELEMENT NOT FOUND!');
            
            if (rankingModeToggle) {
                const newValue = rankingModeToggle.checked ? 'true' : 'false';
                localStorage.setItem('rankingModeEnabled', newValue);
                console.log('✅ Ranking mode saved to localStorage:', newValue);
            } else {
                console.error('❌ rankingModeToggle NOT FOUND ON SAVE!');
            }
            
            localStorage.setItem('imageTheme', selectedTheme);
            
            if (detailedCommentsToggle) {
                localStorage.setItem('detailedCommentsEnabled', detailedCommentsToggle.checked ? 'true' : 'false');
            }
            
            var mapIntroToggle = document.getElementById('mapIntroToggle');
            if (mapIntroToggle) {
                localStorage.setItem('mapIntroEnabled', mapIntroToggle.checked ? 'true' : 'false');
            }
            
            if (soundOnCompletion) {
                localStorage.setItem('soundOnCompletion', soundOnCompletion.checked ? 'true' : 'false');
            }
            
            if (statsTrackingToggle) {
                localStorage.setItem('statsTrackingEnabled', statsTrackingToggle.checked ? 'true' : 'false');
            }
            
            const pageTheme = pageThemeLight && pageThemeLight.checked ? 'light' : 'dark';
            localStorage.setItem('pageTheme', pageTheme);
            applyPageTheme();
            
            if (typeof window.updateStatsTabVisibility === 'function') {
                window.updateStatsTabVisibility();
            }
            
            themeModal.classList.add('hidden');
            
            if (typeof currentTheme !== 'undefined') {
                currentTheme = selectedTheme;
            }
            
            console.log('Settings saved successfully!');
            alert('✅ Все настройки сохранены!');
        });
    } else {
        console.error('applyThemeBtn not found!');
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !themeModal.classList.contains('hidden')) {
            themeModal.classList.add('hidden');
        }
    });
});
