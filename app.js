/**
 * DIC-1 Personal Dashboard & Live Precision Clock
 * Yen - Personal Space
 */

// ==========================================================================
// State & Storage Initialization
// ==========================================================================
const state = {
  userName: localStorage.getItem('personal_userName') || 'Yen',
  theme: localStorage.getItem('personal_theme') || 'dark',
  accent: localStorage.getItem('personal_accent') || 'cyan',
  is24Hour: localStorage.getItem('personal_format') !== '12h', // default true (24h)
  timerRunning: false,
  timerSeconds: 0,
  timerInterval: null
};

// ==========================================================================
// DOM Elements
// ==========================================================================
const elements = {
  // Navigation & Branding
  brandAvatar: document.getElementById('brand-avatar'),
  mainAvatar: document.getElementById('main-avatar'),
  navUserName: document.getElementById('nav-user-name'),
  footerUserName: document.getElementById('footer-user-name'),
  userDisplayName: document.getElementById('user-display-name'),
  
  // Greeting
  dynamicGreeting: document.getElementById('dynamic-greeting'),
  greetingIcon: document.getElementById('greeting-icon'),

  // Name Editing
  editNameBtn: document.getElementById('edit-name-btn'),
  nameEditForm: document.getElementById('name-edit-form'),
  nameInput: document.getElementById('name-input'),
  cancelNameBtn: document.getElementById('cancel-name-btn'),

  // Digital Clock
  clockHours: document.getElementById('clock-hours'),
  clockMinutes: document.getElementById('clock-minutes'),
  clockSeconds: document.getElementById('clock-seconds'),
  clockAmPm: document.getElementById('clock-ampm'),
  calendarDisplay: document.getElementById('calendar-display'),
  currentDayName: document.getElementById('current-day-name'),
  formatToggleBtn: document.getElementById('format-toggle-btn'),
  formatLabel: document.getElementById('format-label'),
  copyTimeBtn: document.getElementById('copy-time-btn'),

  // Analog Clock Hands
  hourHand: document.getElementById('hour-hand'),
  minuteHand: document.getElementById('minute-hand'),
  secondHand: document.getElementById('second-hand'),

  // Metrics
  tzName: document.getElementById('tz-name'),
  timezoneBadge: document.getElementById('timezone-badge'),
  dayOfYear: document.getElementById('day-of-year'),
  weekNumber: document.getElementById('week-number'),

  // Focus Timer
  timerDisplay: document.getElementById('timer-display'),
  timerToggleBtn: document.getElementById('timer-toggle-btn'),
  timerResetBtn: document.getElementById('timer-reset-btn'),

  // Themes & Accents
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  accentDots: document.querySelectorAll('.accent-dot'),

  // Toast
  toast: document.getElementById('toast')
};

// ==========================================================================
// Name Management
// ==========================================================================
function updateUserNameUI(name) {
  const initial = name.trim().charAt(0).toUpperCase() || 'Y';
  if (elements.brandAvatar) elements.brandAvatar.textContent = initial;
  if (elements.mainAvatar) elements.mainAvatar.textContent = initial;
  if (elements.navUserName) elements.navUserName.textContent = `${name} • Personal Space`;
  if (elements.userDisplayName) elements.userDisplayName.textContent = name;
  if (elements.footerUserName) elements.footerUserName.textContent = name;
  document.title = `${name} • DIC-1 Personal Page & Live Clock`;
}

function initNameEditor() {
  updateUserNameUI(state.userName);

  if (elements.editNameBtn) {
    elements.editNameBtn.addEventListener('click', () => {
      elements.userDisplayName.style.display = 'none';
      elements.editNameBtn.style.display = 'none';
      elements.nameEditForm.classList.remove('hidden');
      elements.nameInput.value = state.userName;
      elements.nameInput.focus();
      elements.nameInput.select();
    });
  }

  if (elements.cancelNameBtn) {
    elements.cancelNameBtn.addEventListener('click', closeNameEditor);
  }

  if (elements.nameEditForm) {
    elements.nameEditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = elements.nameInput.value.trim();
      if (newName) {
        state.userName = newName;
        localStorage.setItem('personal_userName', newName);
        updateUserNameUI(newName);
        showToast(`姓名已更新為「${newName}」`);
      }
      closeNameEditor();
    });
  }
}

function closeNameEditor() {
  if (elements.nameEditForm) elements.nameEditForm.classList.add('hidden');
  if (elements.userDisplayName) elements.userDisplayName.style.display = '';
  if (elements.editNameBtn) elements.editNameBtn.style.display = '';
}

// ==========================================================================
// Dynamic Greeting
// ==========================================================================
function updateGreeting(hours) {
  let greeting = '歡迎蒞臨個人網站';
  let icon = '☀️';

  if (hours >= 5 && hours < 12) {
    greeting = '早安，祝您有充實的一天';
    icon = '🌅';
  } else if (hours >= 12 && hours < 18) {
    greeting = '午安，歡迎探索我的作品';
    icon = '☀️';
  } else if (hours >= 18 && hours < 22) {
    greeting = '傍晚好，歡迎蒞臨個人空間';
    icon = '🌇';
  } else {
    greeting = '夜深了，夜間模式為您守候';
    icon = '🌙';
  }

  if (elements.dynamicGreeting) elements.dynamicGreeting.textContent = greeting;
  if (elements.greetingIcon) elements.greetingIcon.textContent = icon;
}

// ==========================================================================
// Precision Live Clock
// ==========================================================================
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getWeekNumber(date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

function updateClock() {
  const now = new Date();
  const rawHours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // Dynamic greeting update
  updateGreeting(rawHours);

  // 12-hour or 24-hour formatting
  let displayHours = rawHours;
  let ampm = '';

  if (!state.is24Hour) {
    ampm = rawHours >= 12 ? 'PM' : 'AM';
    displayHours = rawHours % 12;
    displayHours = displayHours ? displayHours : 12; // 0 becomes 12
    if (elements.clockAmPm) {
      elements.clockAmPm.style.display = 'inline-block';
      elements.clockAmPm.textContent = ampm;
    }
  } else {
    if (elements.clockAmPm) elements.clockAmPm.style.display = 'none';
  }

  // Update Digital Numbers with leading zeros
  if (elements.clockHours) elements.clockHours.textContent = String(displayHours).padStart(2, '0');
  if (elements.clockMinutes) elements.clockMinutes.textContent = String(minutes).padStart(2, '0');
  if (elements.clockSeconds) elements.clockSeconds.textContent = String(seconds).padStart(2, '0');

  // Update Analog Clock Hands
  const secondDeg = (seconds + milliseconds / 1000) * 6; // 360 / 60
  const minuteDeg = (minutes + seconds / 60) * 6;
  const hourDeg = ((rawHours % 12) + minutes / 60) * 30; // 360 / 12

  if (elements.secondHand) elements.secondHand.style.transform = `rotate(${secondDeg}deg)`;
  if (elements.minuteHand) elements.minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
  if (elements.hourHand) elements.hourHand.style.transform = `rotate(${hourDeg}deg)`;

  // Full Calendar Date (Chinese friendly)
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dayName = days[now.getDay()];
  const formattedDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${dayName}`;
  if (elements.calendarDisplay) elements.calendarDisplay.textContent = formattedDate;

  // Day Name Tag
  if (elements.currentDayName) elements.currentDayName.textContent = dayName;

  // Metrics
  const dOfYear = getDayOfYear(now);
  const wNumber = getWeekNumber(now);
  if (elements.dayOfYear) elements.dayOfYear.textContent = `第 ${dOfYear} 天`;
  if (elements.weekNumber) elements.weekNumber.textContent = `第 ${wNumber} 週`;
}

function initTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Taipei';
    const offsetMinutes = -new Date().getTimezoneOffset();
    const offsetHours = offsetMinutes / 60;
    const gmtString = `GMT${offsetHours >= 0 ? '+' : ''}${offsetHours}`;

    if (elements.tzName) elements.tzName.textContent = gmtString;
    if (elements.timezoneBadge) elements.timezoneBadge.textContent = `${tz} (${gmtString})`;
  } catch {
    if (elements.tzName) elements.tzName.textContent = 'GMT+8';
  }
}

function initClockControls() {
  // Format switch (12h / 24h)
  if (elements.formatLabel) elements.formatLabel.textContent = state.is24Hour ? '24H 制' : '12H 制';
  if (elements.formatToggleBtn) {
    elements.formatToggleBtn.addEventListener('click', () => {
      state.is24Hour = !state.is24Hour;
      localStorage.setItem('personal_format', state.is24Hour ? '24h' : '12h');
      elements.formatLabel.textContent = state.is24Hour ? '24H 制' : '12H 制';
      updateClock();
      showToast(`已切換為 ${state.is24Hour ? '24 小時制' : '12 小時制'}`);
    });
  }

  // Copy timestamp button
  if (elements.copyTimeBtn) {
    elements.copyTimeBtn.addEventListener('click', () => {
      const now = new Date();
      const timestamp = now.toLocaleString('zh-TW');
      navigator.clipboard.writeText(timestamp).then(() => {
        showToast('目前時間已複製到剪貼簿！');
      }).catch(() => {
        showToast(timestamp);
      });
    });
  }
}

// ==========================================================================
// Focus Stopwatch Widget
// ==========================================================================
function formatTimerDigits(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function initFocusTimer() {
  if (elements.timerToggleBtn) {
    elements.timerToggleBtn.addEventListener('click', () => {
      if (state.timerRunning) {
        clearInterval(state.timerInterval);
        state.timerRunning = false;
        elements.timerToggleBtn.textContent = '繼續';
        elements.timerToggleBtn.classList.remove('primary');
      } else {
        state.timerRunning = true;
        elements.timerToggleBtn.textContent = '暫停';
        elements.timerToggleBtn.classList.add('primary');
        state.timerInterval = setInterval(() => {
          state.timerSeconds++;
          if (elements.timerDisplay) elements.timerDisplay.textContent = formatTimerDigits(state.timerSeconds);
        }, 1000);
      }
    });
  }

  if (elements.timerResetBtn) {
    elements.timerResetBtn.addEventListener('click', () => {
      clearInterval(state.timerInterval);
      state.timerRunning = false;
      state.timerSeconds = 0;
      if (elements.timerDisplay) elements.timerDisplay.textContent = '00:00';
      if (elements.timerToggleBtn) {
        elements.timerToggleBtn.textContent = '開始';
        elements.timerToggleBtn.classList.add('primary');
      }
    });
  }
}

// ==========================================================================
// Theme & Accent Switcher
// ==========================================================================
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  state.theme = theme;
  localStorage.setItem('personal_theme', theme);
}

function applyAccent(accent) {
  document.documentElement.setAttribute('data-accent', accent);
  state.accent = accent;
  localStorage.setItem('personal_accent', accent);

  if (elements.accentDots) {
    elements.accentDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.color === accent);
    });
  }
}

function initThemeAndAccents() {
  applyTheme(state.theme);
  applyAccent(state.accent);

  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener('click', () => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      showToast(`已切換為${nextTheme === 'dark' ? '深色' : '淺色'}主題`);
    });
  }

  if (elements.accentDots) {
    elements.accentDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const selectedColor = dot.dataset.color;
        applyAccent(selectedColor);
        showToast(`已套用 ${selectedColor} 霓虹主色`);
      });
    });
  }
}

// ==========================================================================
// Toast Notification
// ==========================================================================
let toastTimeout;
function showToast(message) {
  if (!elements.toast) return;
  clearTimeout(toastTimeout);
  elements.toast.textContent = message;
  elements.toast.classList.remove('hidden');

  toastTimeout = setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, 2500);
}

// ==========================================================================
// Application Bootstrap
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNameEditor();
  initThemeAndAccents();
  initTimezone();
  initClockControls();
  initFocusTimer();

  // Run clock immediately and start high-refresh loop
  updateClock();
  setInterval(updateClock, 100);
});
