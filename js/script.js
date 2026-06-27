// 開演時刻 (例: 今日の16:00)
const SHOW_START_TIME = new Date();
SHOW_START_TIME.setHours(16, 0, 0, 0);

// 言語リスト
const languages = ['ja', 'en', 'ko', 'th'];
let currentLanguageIndex = 0;
const LANGUAGE_INTERVAL = 6000; // 6秒

// 画面切り替え
const screens = ['screen-1'];
let currentScreenIndex = 0;
const SCREEN_INTERVAL = 12000; // 12秒（6秒×2画面）

// 時計更新
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// カウントダウン更新
function updateCountdown() {
    const now = new Date();
    let diff = SHOW_START_TIME - now;
    
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    
    if (!hoursEl || !minutesEl || !secondsEl) return;
    
    if (diff < 0) {
        // 開演後
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
    }
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

// 言語切り替え
function switchLanguage() {
    const currentLang = languages[currentLanguageIndex];
    const languageElements = Array.from(document.querySelectorAll('[data-lang-ja]'));

    languageElements.forEach(element => {
        element.classList.remove('lang-enter');
        element.classList.add('lang-flip');
    });
    
    setTimeout(() => {
        languageElements.forEach(element => {
            const textKey = `data-lang-${currentLang}`;
            const text = element.getAttribute(textKey);
            if (text) {
                // &#10; または改行を <br> に変換
                element.innerHTML = text.replace(/(?:&#10;|\n)/g, '<br>');
            }
        });

        requestAnimationFrame(() => {
            languageElements.forEach(element => {
                element.classList.remove('lang-flip');
                element.classList.add('lang-enter');
            });

            requestAnimationFrame(() => {
                languageElements.forEach(element => {
                    element.classList.remove('lang-enter');
                });
            });
        });
    }, 380);
    
    // 言語インジケーターを更新
    document.querySelectorAll('.lang-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeLangElement = document.getElementById(`lang-${currentLang}`);
    if (activeLangElement) {
        activeLangElement.classList.add('active');
    }
    
    // 次の言語に進める
    currentLanguageIndex = (currentLanguageIndex + 1) % languages.length;
}

// 画像ローテーション設定
const photoSources = [
    { src: 'img/117058.jpg', caption: '写真 1 / 3' },
    { src: 'img/IMG_5398_01.JPG', caption: '写真 2 / 3' },
    { src: 'img/minamioosumi.jpg', caption: '写真 3 / 3' }
];
let currentPhotoIndex = 0;
const PHOTO_INTERVAL = 7500; // 7.5秒

function rotatePhoto() {
    const photoEl = document.getElementById('photo-current');
    const captionEl = document.getElementById('photo-caption');
    if (!photoEl || !captionEl) return;

    if (photoEl.classList.contains('is-fading')) return;

    const nextPhotoIndex = (currentPhotoIndex + 1) % photoSources.length;
    const nextPhoto = photoSources[nextPhotoIndex];

    photoEl.classList.add('is-fading');

    const handleFadeOut = () => {
        photoEl.removeEventListener('transitionend', handleFadeOut);
        photoEl.src = nextPhoto.src;
        captionEl.textContent = nextPhoto.caption;
        currentPhotoIndex = nextPhotoIndex;

        requestAnimationFrame(() => {
            photoEl.classList.remove('is-fading');
        });
    };

    photoEl.addEventListener('transitionend', handleFadeOut);
}

// 画面切り替え
function switchScreen() {
    // 現在の画面を非表示
    const currentScreenEl = document.querySelector(`.${screens[currentScreenIndex]}`);
    if (currentScreenEl) {
        currentScreenEl.classList.remove('active');
    }
    
    // 次の画面を表示
    currentScreenIndex = (currentScreenIndex + 1) % screens.length;
    const nextScreenEl = document.querySelector(`.${screens[currentScreenIndex]}`);
    if (nextScreenEl) {
        nextScreenEl.classList.add('active');
    }
}

// 初期化
function init() {
    updateClock();
    updateCountdown();
    switchLanguage(); // 初回の言語表示
    
    // 1秒ごとに時計更新
    setInterval(updateClock, 1000);
    setInterval(updateCountdown, 1000);
    
    // 6秒ごとに言語切り替え
    setInterval(switchLanguage, LANGUAGE_INTERVAL);
    
    // 6秒ごとに写真ローテーション
    setInterval(rotatePhoto, PHOTO_INTERVAL);
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', init);
