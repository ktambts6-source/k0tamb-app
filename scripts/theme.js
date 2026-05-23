function getStoredTheme() {


    return localStorage.getItem('pageTheme') || 'dark';


}





function applyPageTheme() {


    var theme = getStoredTheme();


    if (theme === 'light') {


        document.body.classList.add('theme-light');


    } else {


        document.body.classList.remove('theme-light');


    }


    var btn = document.querySelector('.theme-toggle-btn');


    if (btn) {


        btn.textContent = theme === 'light' ? 'Р РЋР вЂљР РЋРЎСџР В Р вЂ°Р Р†РІР‚С›РЎС› Р В Р’В Р РЋРЎвЂєР В Р Р‹Р Р†Р вЂљРїС—Р…Р В Р’В Р РЋРїС—Р…Р В Р’В Р В РІР‚В¦Р В Р’В Р вЂ™Р’В°Р В Р Р‹Р В Р РЏ' : 'Р В Р вЂ Р С—РЎвЂ”Р вЂ¦Р В РІР‚С™Р В РЎвЂ”Р РЋРІР‚пїЅР В Р РЏ Р В Р’В Р В Р вЂ№Р В Р’В Р В РІР‚В Р В Р’В Р вЂ™Р’ВµР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р вЂ™Р’В»Р В Р’В Р вЂ™Р’В°Р В Р Р‹Р В Р РЏ';


    }


}





function togglePageTheme() {


    var current = getStoredTheme();


    var next = current === 'dark' ? 'light' : 'dark';


    localStorage.setItem('pageTheme', next);


    applyPageTheme();


}





// safeStorage wrapper for localStorage fallback (Р В Р’В Р СћРІР‚пїЅР В Р’В Р вЂ™Р’В»Р В Р Р‹Р В Р РЏ Р В Р Р‹Р В РЎвЂњР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р вЂ™Р’В°Р В Р Р‹Р В РІР‚С™Р В Р Р‹Р Р†Р вЂљРІвЂћвЂ“Р В Р Р‹Р Р†Р вЂљР’В¦ Р В Р’В Р вЂ™Р’В±Р В Р Р‹Р В РІР‚С™Р В Р’В Р вЂ™Р’В°Р В Р Р‹Р РЋРІР‚СљР В Р’В Р вЂ™Р’В·Р В Р’В Р вЂ™Р’ВµР В Р Р‹Р В РІР‚С™Р В Р’В Р РЋРІР‚СћР В Р’В Р В РІР‚В )


function getSafeStorage() {


    if (typeof window.safeStorage !== 'undefined') return window.safeStorage;


    try {


        localStorage.setItem('__storage_test__', '1');


        localStorage.removeItem('__storage_test__');


        return localStorage;


    } catch (e) {


        var memoryData = {};


        return {


            getItem: function(key) { return memoryData.hasOwnProperty(key) ? memoryData[key] : null; },


            setItem: function(key, value) { memoryData[key] = String(value); },


            removeItem: function(key) { delete memoryData[key]; },


            clear: function() { memoryData = {}; }


        };


    }


}





function initThemeControls() {


    applyPageTheme();


    document.addEventListener('DOMContentLoaded', function() {


        var btn = document.querySelector('.theme-toggle-btn');


        if (btn) btn.addEventListener('click', togglePageTheme);


    });


}





if (document.readyState === 'loading') {


    document.addEventListener('DOMContentLoaded', initThemeControls);


} else {


    initThemeControls();


}


