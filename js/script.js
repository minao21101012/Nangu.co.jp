// 開演時刻 (例: 今日の16:00)
const SHOW_START_TIME = new Date();
SHOW_START_TIME.setHours(9, 0, 0, 0);

// 右側メッセージの切り替え間隔
const LANGUAGE_INTERVAL = 6000; // 6秒

const rightPanelLanguages = ['ja', 'kg', 'en', 'ko', 'th'];
const rightPanelTexts = {
    ja: {
        welcome: 'ご来場ありがとうございます',
        scheduleLabel: '予定時刻',
        scheduleTitle: '開会式 09:00'
    },
    kg: {
        welcome: 'ゆくさ おじゃったもんせ',
        scheduleLabel: '予定時刻',
        scheduleTitle: '開会式 09:00'
    },
    en: {
        welcome: 'Thank you for coming',
        scheduleLabel: 'Scheduled time',
        scheduleTitle: 'Opening Ceremony 09:00'
    },
    ko: {
        welcome: '문화제에 와 주셔서 감사합니다',
        scheduleLabel: '예정 시각',
        scheduleTitle: '개회식 09:00'
    },
    th: {
        welcome: 'ขอบคุณที่มาร่วมงานเทศกาล',
        scheduleLabel: 'กำหนดเวลา',
        scheduleTitle: 'พิธีเปิด 09:00'
    }
};
let currentRightPanelLanguageIndex = 0;

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
    const messageElement = document.getElementById('thank-you-message');
    const scheduleLabelElement = document.getElementById('schedule-label');
    const scheduleTitleElement = document.getElementById('schedule-title');
    const currentLang = rightPanelLanguages[currentRightPanelLanguageIndex];
    const currentTextSet = rightPanelTexts[currentLang] || rightPanelTexts.ja;

    if (messageElement) {
        messageElement.innerHTML = currentTextSet.welcome;
    }

    if (scheduleLabelElement) {
        scheduleLabelElement.textContent = currentTextSet.scheduleLabel;
    }

    if (scheduleTitleElement) {
        scheduleTitleElement.textContent = currentTextSet.scheduleTitle;
    }
    
    currentRightPanelLanguageIndex = (currentRightPanelLanguageIndex + 1) % rightPanelLanguages.length;
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
