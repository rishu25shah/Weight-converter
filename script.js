/**
 * Weight Converter Application Logic
 * Implements bidirectional unit conversions matching python weight_converer.py
 */

(function () {
  'use strict';

  // Conversion factors relative to 1 Kilogram (kg)
  // Python script used 2.205 for kg <-> lbs
  const FACTORS_TO_KG = {
    kg: 1,
    lbs: 1 / 2.205, // 1 lb in kg (matching weight_converer.py: convert = weight / 2.205)
    g: 0.001,
    oz: (1 / 2.205) / 16,
    st: (1 / 2.205) * 14
  };

  const UNIT_LABELS = {
    kg: 'KG',
    lbs: 'LBS',
    g: 'G',
    oz: 'OZ',
    st: 'ST'
  };

  // State
  let currentPrecision = 1;
  const STORAGE_KEY_HISTORY = 'weight_converter_history';
  const STORAGE_KEY_THEME = 'weight_converter_theme';

  // DOM Elements
  const weightInput = document.getElementById('weight-input');
  const fromUnitSelect = document.getElementById('from-unit-select');
  const toUnitSelect = document.getElementById('to-unit-select');
  const inputUnitBadge = document.getElementById('input-unit-badge');
  const swapUnitsBtn = document.getElementById('swap-units-btn');
  const quickClearBtn = document.getElementById('quick-clear-btn');
  const resultValue = document.getElementById('result-value');
  const resultUnit = document.getElementById('result-unit');
  const formulaDisplay = document.getElementById('formula-display');
  const copyResultBtn = document.getElementById('copy-result-btn');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const precisionButtons = document.querySelectorAll('.precision-btn');
  const presetChips = document.querySelectorAll('.preset-chip');

  /**
   * Convert value between any supported units
   */
  function convertWeight(value, fromUnit, toUnit) {
    if (isNaN(value) || value === null || value === '') return null;
    
    // Direct kg <-> lbs calculation for exact adherence to python weight_converer.py
    if (fromUnit === 'kg' && toUnit === 'lbs') {
      return value * 2.205;
    }
    if (fromUnit === 'lbs' && toUnit === 'kg') {
      return value / 2.205;
    }
    if (fromUnit === toUnit) {
      return value;
    }

    // Generalized conversion through Kilograms base
    const valueInKg = value * FACTORS_TO_KG[fromUnit];
    return valueInKg / FACTORS_TO_KG[toUnit];
  }

  /**
   * Format formula explanation string
   */
  function getFormulaText(value, fromUnit, toUnit, result) {
    if (value === null || isNaN(value)) return 'Enter a value to see formula';
    
    const fromStr = UNIT_LABELS[fromUnit];
    const toStr = UNIT_LABELS[toUnit];

    if (fromUnit === 'kg' && toUnit === 'lbs') {
      return `${value} kg × 2.205 = ${result} ${toStr}`;
    } else if (fromUnit === 'lbs' && toUnit === 'kg') {
      return `${value} lbs ÷ 2.205 = ${result} ${toStr}`;
    } else if (fromUnit === toUnit) {
      return `${value} ${fromStr} = ${result} ${toStr}`;
    } else {
      const ratio = (FACTORS_TO_KG[fromUnit] / FACTORS_TO_KG[toUnit]);
      const formattedRatio = ratio >= 1 ? ratio.toFixed(3) : ratio.toFixed(5);
      return `${value} ${fromStr} × ${formattedRatio} = ${result} ${toStr}`;
    }
  }

  /**
   * Perform calculation and update DOM
   */
  function updateConversion(recordHistory = false) {
    const rawVal = weightInput.value.trim();
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    // Update input unit badge
    inputUnitBadge.textContent = UNIT_LABELS[fromUnit];

    if (rawVal === '' || isNaN(Number(rawVal))) {
      resultValue.textContent = '0.0';
      resultUnit.textContent = UNIT_LABELS[toUnit];
      formulaDisplay.textContent = 'Please enter a valid weight value';
      return;
    }

    const inputWeight = parseFloat(rawVal);
    const converted = convertWeight(inputWeight, fromUnit, toUnit);

    if (converted !== null) {
      const formattedResult = Number(converted.toFixed(currentPrecision)).toLocaleString(undefined, {
        minimumFractionDigits: currentPrecision,
        maximumFractionDigits: currentPrecision
      });

      resultValue.textContent = formattedResult;
      resultUnit.textContent = UNIT_LABELS[toUnit];
      formulaDisplay.textContent = getFormulaText(inputWeight, fromUnit, toUnit, formattedResult);

      // Micro-animation on result
      resultValue.style.transform = 'scale(1.05)';
      setTimeout(() => {
        resultValue.style.transform = 'scale(1)';
      }, 150);

      if (recordHistory && inputWeight > 0) {
        saveHistory({
          fromVal: inputWeight,
          fromUnit: UNIT_LABELS[fromUnit],
          toVal: formattedResult,
          toUnit: UNIT_LABELS[toUnit],
          rawFromUnit: fromUnit,
          rawToUnit: toUnit,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }
  }

  // Swap units logic
  function swapUnits() {
    const temp = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = temp;

    // Trigger update
    updateConversion(true);
  }

  // Toast notification
  let toastTimer = null;
  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // Copy result to clipboard
  function copyResult() {
    const val = resultValue.textContent;
    const unit = resultUnit.textContent;
    const textToCopy = `${val} ${unit}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied ${textToCopy} to clipboard!`);
      }).catch(() => {
        fallbackCopy(textToCopy);
      });
    } else {
      fallbackCopy(textToCopy);
    }
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copied ${text} to clipboard!`);
  }

  // History Management
  function getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveHistory(entry) {
    let history = getHistory();
    // Don't add duplicate of most recent entry
    if (history.length > 0) {
      const last = history[0];
      if (last.fromVal === entry.fromVal && last.fromUnit === entry.fromUnit && last.toUnit === entry.toUnit) {
        return;
      }
    }
    history.unshift(entry);
    if (history.length > 8) history = history.slice(0, 8);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // Storage unavailable or disabled
    }
    renderHistory();
  }

  function renderHistory() {
    const history = getHistory();
    historyList.innerHTML = '';

    if (history.length === 0) {
      historyList.innerHTML = '<li class="history-empty">No conversions yet. Enter a value to convert!</li>';
      return;
    }

    history.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.title = 'Click to restore this conversion';
      li.innerHTML = `
        <div>
          <span class="history-from">${item.fromVal} ${item.fromUnit}</span>
          <span class="history-arrow">&rarr;</span>
          <span class="history-to">${item.toVal} ${item.toUnit}</span>
        </div>
        <span class="history-time">${item.time}</span>
      `;
      li.addEventListener('click', () => {
        weightInput.value = item.fromVal;
        fromUnitSelect.value = item.rawFromUnit;
        toUnitSelect.value = item.rawToUnit;
        updateConversion(false);
      });
      historyList.appendChild(li);
    });
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    renderHistory();
    showToast('History cleared');
  }

  // Theme Management
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/>
        <path d="M12 20v2"/>
        <path d="m4.93 4.93 1.41 1.41"/>
        <path d="m17.66 17.66 1.41 1.41"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
        <path d="m6.34 17.66-1.41 1.41"/>
        <path d="m19.07 4.93-1.41 1.41"/>
      `;
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY_THEME, newTheme);
    applyTheme(newTheme);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(savedTheme);
  }

  // Event Listeners
  let debounceTimeout = null;
  weightInput.addEventListener('input', () => {
    updateConversion(false);
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (weightInput.value.trim() !== '') {
        updateConversion(true);
      }
    }, 800);
  });

  fromUnitSelect.addEventListener('change', () => updateConversion(true));
  toUnitSelect.addEventListener('change', () => updateConversion(true));
  swapUnitsBtn.addEventListener('click', swapUnits);

  quickClearBtn.addEventListener('click', () => {
    weightInput.value = '';
    weightInput.focus();
    updateConversion(false);
  });

  copyResultBtn.addEventListener('click', copyResult);
  clearHistoryBtn.addEventListener('click', clearHistory);
  themeToggleBtn.addEventListener('click', toggleTheme);

  // Preset Chips
  presetChips.forEach((btn) => {
    btn.addEventListener('click', () => {
      weightInput.value = btn.getAttribute('data-val');
      updateConversion(true);
    });
  });

  // Precision Buttons
  precisionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      precisionButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentPrecision = parseInt(btn.getAttribute('data-precision'), 10) || 1;
      updateConversion(false);
    });
  });

  // Initialization
  initTheme();
  renderHistory();
  updateConversion(false);

})();
