/**
 * Personal Dashboard & Live Precision Clock
 * Yen - Personal Space
 */

// ==========================================================================
// Quotes Collection
// ==========================================================================
const QUOTES = [
  { text: "Make each day your masterpiece.", author: "John Wooden" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Small deeds done are better than great deeds planned.", author: "Peter Marshall" }
];

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
  miniGreeting: document.getElementById('mini-greeting'),

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

  // Quotes
  quoteText: document.getElementById('quote-text'),
  quoteAuthor: document.getElementById('quote-author'),

  // Toast
  toast: document.getElementById('toast')
};

// ==========================================================================
// Name Management
// ==========================================================================
function updateUserNameUI(name) {
  const initial = name.trim().charAt(0).toUpperCase() || 'Y';
  elements.brandAvatar.textContent = initial;
  elements.mainAvatar.textContent = initial;
  elements.navUserName.textContent = name;
  elements.userDisplayName.textContent = name;
  elements.footerUserName.textContent = name;
  document.title = `${name} • Personal Space & Live Clock`;
}

function initNameEditor() {
  updateUserNameUI(state.userName);

  elements.editNameBtn.addEventListener('click', () => {
    elements.userDisplayName.style.display = 'none';
    elements.editNameBtn.style.display = 'none';
    elements.nameEditForm.classList.remove('hidden');
    elements.nameInput.value = state.userName;
    elements.nameInput.focus();
    elements.nameInput.select();
  });

  elements.cancelNameBtn.addEventListener('click', closeNameEditor);

  elements.nameEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = elements.nameInput.value.trim();
    if (newName) {
      state.userName = newName;
      localStorage.setItem('personal_userName', newName);
      updateUserNameUI(newName);
      showToast(`Name updated to "${newName}"`);
    }
    closeNameEditor();
  });
}

function closeNameEditor() {
  elements.nameEditForm.classList.add('hidden');
  elements.userDisplayName.style.display = '';
  elements.editNameBtn.style.display = '';
}

// ==========================================================================
// Dynamic Greeting
// ==========================================================================
function updateGreeting(hours) {
  let greeting = 'Good day';
  let icon = '☀️';
  let mini = 'Welcome,';

  if (hours >= 5 && hours < 12) {
    greeting = 'Good morning';
    icon = '🌅';
    mini = 'Good morning,';
  } else if (hours >= 12 && hours < 17) {
    greeting = 'Good afternoon';
    icon = '☀️';
    mini = 'Good afternoon,';
  } else if (hours >= 17 && hours < 22) {
    greeting = 'Good evening';
    icon = '🌇';
    mini = 'Good evening,';
  } else {
    greeting = 'Good night';
    icon = '🌙';
    mini = 'Good night,';
  }

  elements.dynamicGreeting.textContent = greeting;
  elements.greetingIcon.textContent = icon;
  elements.miniGreeting.textContent = mini;
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
    elements.clockAmPm.style.display = 'inline-block';
    elements.clockAmPm.textContent = ampm;
  } else {
    elements.clockAmPm.style.display = 'none';
  }

  // Update Digital Numbers with leading zeros
  elements.clockHours.textContent = String(displayHours).padStart(2, '0');
  elements.clockMinutes.textContent = String(minutes).padStart(2, '0');
  elements.clockSeconds.textContent = String(seconds).padStart(2, '0');

  // Update Analog Clock Hands
  const secondDeg = (seconds + milliseconds / 1000) * 6; // 360 / 60
  const minuteDeg = (minutes + seconds / 60) * 6;
  const hourDeg = ((rawHours % 12) + minutes / 60) * 30; // 360 / 12

  elements.secondHand.style.transform = `rotate(${secondDeg}deg)`;
  elements.minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
  elements.hourHand.style.transform = `rotate(${hourDeg}deg)`;

  // Full Calendar Date
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString(undefined, dateOptions);
  elements.calendarDisplay.textContent = formattedDate;

  // Day Name Tag
  elements.currentDayName.textContent = now.toLocaleDateString(undefined, { weekday: 'long' });

  // Metrics
  const dOfYear = getDayOfYear(now);
  const wNumber = getWeekNumber(now);
  elements.dayOfYear.textContent = `Day ${dOfYear}`;
  elements.weekNumber.textContent = `Week ${wNumber}`;
}

function initTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    const offsetMinutes = -new Date().getTimezoneOffset();
    const offsetHours = offsetMinutes / 60;
    const gmtString = `GMT${offsetHours >= 0 ? '+' : ''}${offsetHours}`;

    elements.tzName.textContent = gmtString;
    elements.timezoneBadge.textContent = tz.split('/').pop().replace('_', ' ') + ` (${gmtString})`;
  } catch {
    elements.tzName.textContent = 'Local Time';
  }
}

function initClockControls() {
  // Format switch (12h / 24h)
  elements.formatLabel.textContent = state.is24Hour ? '24H' : '12H';
  elements.formatToggleBtn.addEventListener('click', () => {
    state.is24Hour = !state.is24Hour;
    localStorage.setItem('personal_format', state.is24Hour ? '24h' : '12h');
    elements.formatLabel.textContent = state.is24Hour ? '24H' : '12H';
    updateClock();
    showToast(`Switched to ${state.is24Hour ? '24-hour' : '12-hour'} format`);
  });

  // Copy timestamp button
  elements.copyTimeBtn.addEventListener('click', () => {
    const now = new Date();
    const timestamp = now.toLocaleString();
    navigator.clipboard.writeText(timestamp).then(() => {
      showToast('Timestamp copied to clipboard!');
    }).catch(() => {
      showToast(timestamp);
    });
  });
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
  elements.timerToggleBtn.addEventListener('click', () => {
    if (state.timerRunning) {
      clearInterval(state.timerInterval);
      state.timerRunning = false;
      elements.timerToggleBtn.textContent = 'Resume';
      elements.timerToggleBtn.classList.remove('primary');
    } else {
      state.timerRunning = true;
      elements.timerToggleBtn.textContent = 'Pause';
      elements.timerToggleBtn.classList.add('primary');
      state.timerInterval = setInterval(() => {
        state.timerSeconds++;
        elements.timerDisplay.textContent = formatTimerDigits(state.timerSeconds);
      }, 1000);
    }
  });

  elements.timerResetBtn.addEventListener('click', () => {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.timerSeconds = 0;
    elements.timerDisplay.textContent = '00:00';
    elements.timerToggleBtn.textContent = 'Start';
    elements.timerToggleBtn.classList.add('primary');
  });
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

  elements.accentDots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.color === accent);
  });
}

function initThemeAndAccents() {
  applyTheme(state.theme);
  applyAccent(state.accent);

  elements.themeToggleBtn.addEventListener('click', () => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(`Switched to ${nextTheme} theme`);
  });

  elements.accentDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const selectedColor = dot.dataset.color;
      applyAccent(selectedColor);
      showToast(`Applied ${selectedColor} accent`);
    });
  });
}

// ==========================================================================
// Quote Generator
// ==========================================================================
function initQuote() {
  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  const quote = QUOTES[randomIndex];
  elements.quoteText.textContent = `"${quote.text}"`;
  elements.quoteAuthor.textContent = `— ${quote.author}`;
}

// ==========================================================================
// Toast Notification
// ==========================================================================
let toastTimeout;
function showToast(message) {
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
  initQuote();

  // Run clock immediately and start high-refresh loop
  updateClock();
  setInterval(updateClock, 100);
});
