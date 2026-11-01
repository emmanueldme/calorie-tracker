/**
 * NutriTrack - Pure Vanilla JavaScript Calorie & Macro Tracker
 * Persistent Storage: Browser localStorage
 * No external frameworks, no backend.
 */

(function () {
  'use strict';

  // --- STORAGE KEYS & INITIAL STATE ---
  const STORAGE_KEY = 'nutritrack_app_data_v1';

  // Default initial configuration
  const defaultData = {
    settings: {
      calorieGoal: 2000,
      proteinGoal: 140,
      carbsGoal: 220,
      fatGoal: 65,
      waterGoal: 8
    },
    days: {}
  };

  // Quick Preset Foods for instant logging
  const PRESET_FOODS = [
    { name: 'Oatmeal & Berries', serving: '1 bowl', calories: 240, protein: 7, carbs: 45, fat: 3.5, meal: 'breakfast' },
    { name: '2 Boiled Eggs', serving: '2 large', calories: 156, protein: 12.6, carbs: 1.2, fat: 10.6, meal: 'breakfast' },
    { name: 'Grilled Chicken Breast', serving: '150g', calories: 220, protein: 43, carbs: 0, fat: 4.5, meal: 'lunch' },
    { name: 'Brown / White Rice', serving: '1 cup cooked', calories: 215, protein: 4.5, carbs: 45, fat: 1.5, meal: 'lunch' },
    { name: 'Salmon Fillet', serving: '150g baked', calories: 280, protein: 34, carbs: 0, fat: 15, meal: 'dinner' },
    { name: 'Greek Yogurt (0% Fat)', serving: '170g / 1 cup', calories: 100, protein: 17, carbs: 6, fat: 0.5, meal: 'snacks' },
    { name: 'Medium Banana', serving: '1 fruit', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, meal: 'snacks' },
    { name: 'Whey Protein Shake', serving: '1 scoop + water', calories: 130, protein: 25, carbs: 3, fat: 1.5, meal: 'snacks' },
    { name: 'Avocado Toast', serving: '1 slice', calories: 220, protein: 5, carbs: 20, fat: 14, meal: 'breakfast' },
    { name: 'Mixed Green Salad with Olive Oil', serving: '1 large bowl', calories: 160, protein: 2, carbs: 6, fat: 14, meal: 'dinner' }
  ];

  // --- STATE ---
  let appState = loadAppData();
  let selectedDate = getTodayDateString();

  // If this is a completely brand new installation, seed today's date with a helpful starter
  if (Object.keys(appState.days).length === 0) {
    seedInitialDemoData();
  }

  // --- DOM ELEMENTS ---
  const datePickerInput = document.getElementById('datePickerInput');
  const currentDateDisplay = document.getElementById('currentDateDisplay');
  const prevDateBtn = document.getElementById('prevDateBtn');
  const nextDateBtn = document.getElementById('nextDateBtn');
  const todayQuickBtn = document.getElementById('todayQuickBtn');

  // Stats Elements
  const caloriesRemainingNumber = document.getElementById('caloriesRemainingNumber');
  const caloriesRemainingLabel = document.getElementById('caloriesRemainingLabel');
  const calorieRingCircle = document.getElementById('calorieRingCircle');
  const statGoalCalories = document.getElementById('statGoalCalories');
  const statFoodCalories = document.getElementById('statFoodCalories');
  const statExerciseCalories = document.getElementById('statExerciseCalories');

  const proteinCurrent = document.getElementById('proteinCurrent');
  const proteinTarget = document.getElementById('proteinTarget');
  const proteinBar = document.getElementById('proteinBar');

  const carbsCurrent = document.getElementById('carbsCurrent');
  const carbsTarget = document.getElementById('carbsTarget');
  const carbsBar = document.getElementById('carbsBar');

  const fatCurrent = document.getElementById('fatCurrent');
  const fatTarget = document.getElementById('fatTarget');
  const fatBar = document.getElementById('fatBar');

  // Calorie split
  const splitBarProtein = document.getElementById('splitBarProtein');
  const splitBarCarbs = document.getElementById('splitBarCarbs');
  const splitBarFat = document.getElementById('splitBarFat');
  const proteinCalPct = document.getElementById('proteinCalPct');
  const carbsCalPct = document.getElementById('carbsCalPct');
  const fatCalPct = document.getElementById('fatCalPct');

  // Water elements
  const waterCountEl = document.getElementById('waterCount');
  const waterGoalEl = document.getElementById('waterGoal');
  const waterVolumeEl = document.getElementById('waterVolume');
  const waterGlassesGrid = document.getElementById('waterGlassesGrid');
  const addWaterBtn = document.getElementById('addWaterBtn');
  const subWaterBtn = document.getElementById('subWaterBtn');

  // Meal Lists
  const mealLists = {
    breakfast: document.getElementById('breakfastList'),
    lunch: document.getElementById('lunchList'),
    dinner: document.getElementById('dinnerList'),
    snacks: document.getElementById('snacksList')
  };

  const mealKcalDisplays = {
    breakfast: document.getElementById('breakfastKcal'),
    lunch: document.getElementById('lunchKcal'),
    dinner: document.getElementById('dinnerKcal'),
    snacks: document.getElementById('snacksKcal')
  };

  // Exercise & Notes
  const exerciseList = document.getElementById('exerciseList');
  const exerciseKcalDisplay = document.getElementById('exerciseKcal');
  const dailyNoteInput = document.getElementById('dailyNoteInput');
  const saveNoteBtn = document.getElementById('saveNoteBtn');

  // Presets Container
  const presetChipsContainer = document.getElementById('presetChipsContainer');

  // Food Modal
  const foodModal = document.getElementById('foodModal');
  const foodForm = document.getElementById('foodForm');
  const foodModalTitle = document.getElementById('foodModalTitle');
  const closeFoodModalBtn = document.getElementById('closeFoodModalBtn');
  const cancelFoodModalBtn = document.getElementById('cancelFoodModalBtn');
  const foodItemIndex = document.getElementById('foodItemIndex');
  const foodTargetMeal = document.getElementById('foodTargetMeal');
  const foodMealSelect = document.getElementById('foodMealSelect');
  const foodNameInput = document.getElementById('foodNameInput');
  const foodServingInput = document.getElementById('foodServingInput');
  const foodCaloriesInput = document.getElementById('foodCaloriesInput');
  const foodProteinInput = document.getElementById('foodProteinInput');
  const foodCarbsInput = document.getElementById('foodCarbsInput');
  const foodFatInput = document.getElementById('foodFatInput');

  // Exercise Modal
  const exerciseModal = document.getElementById('exerciseModal');
  const exerciseForm = document.getElementById('exerciseForm');
  const openAddExerciseBtn = document.getElementById('openAddExerciseBtn');
  const closeExerciseModalBtn = document.getElementById('closeExerciseModalBtn');
  const cancelExerciseModalBtn = document.getElementById('cancelExerciseModalBtn');
  const exerciseItemIndex = document.getElementById('exerciseItemIndex');
  const exerciseNameInput = document.getElementById('exerciseNameInput');
  const exerciseDurationInput = document.getElementById('exerciseDurationInput');
  const exerciseCaloriesInput = document.getElementById('exerciseCaloriesInput');

  // Goals Modal
  const goalsModal = document.getElementById('goalsModal');
  const goalsForm = document.getElementById('goalsForm');
  const openGoalsModalBtn = document.getElementById('openGoalsModalBtn');
  const closeGoalsModalBtn = document.getElementById('closeGoalsModalBtn');
  const cancelGoalsModalBtn = document.getElementById('cancelGoalsModalBtn');
  const goalCaloriesInput = document.getElementById('goalCaloriesInput');
  const goalProteinInput = document.getElementById('goalProteinInput');
  const goalCarbsInput = document.getElementById('goalCarbsInput');
  const goalFatInput = document.getElementById('goalFatInput');
  const goalWaterInput = document.getElementById('goalWaterInput');

  // Data Modal
  const dataModal = document.getElementById('dataModal');
  const openDataModalBtn = document.getElementById('openDataModalBtn');
  const closeDataModalBtn = document.getElementById('closeDataModalBtn');
  const closeDataModalActionBtn = document.getElementById('closeDataModalActionBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  const importJsonFileInput = document.getElementById('importJsonFileInput');
  const clearTodayBtn = document.getElementById('clearTodayBtn');
  const resetAllBtn = document.getElementById('resetAllBtn');

  // Toast
  const toastNotification = document.getElementById('toastNotification');

  // --- STORAGE HELPERS ---
  function loadAppData() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) return JSON.parse(JSON.stringify(defaultData));
      const parsed = JSON.parse(serialized);
      // Ensure schema backwards-compatibility
      parsed.settings = Object.assign({}, defaultData.settings, parsed.settings || {});
      parsed.days = parsed.days || {};
      return parsed;
    } catch (e) {
      console.error('Error loading data from localStorage, falling back to defaults:', e);
      return JSON.parse(JSON.stringify(defaultData));
    }
  }

  function saveAppData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      showToast('Storage quota exceeded or storage unavailable!');
    }
  }

  function getDayData(dateStr) {
    if (!appState.days[dateStr]) {
      appState.days[dateStr] = {
        meals: [],
        exercises: [],
        waterCount: 0,
        note: ''
      };
    }
    return appState.days[dateStr];
  }

  function seedInitialDemoData() {
    const today = getTodayDateString();
    appState.days[today] = {
      meals: [
        {
          id: 'demo-1',
          type: 'breakfast',
          name: 'Oatmeal with Blueberries & Honey',
          serving: '1 bowl',
          calories: 280,
          protein: 8,
          carbs: 52,
          fat: 4.5
        },
        {
          id: 'demo-2',
          type: 'breakfast',
          name: 'Boiled Egg',
          serving: '1 large',
          calories: 78,
          protein: 6.3,
          carbs: 0.6,
          fat: 5.3
        },
        {
          id: 'demo-3',
          type: 'lunch',
          name: 'Grilled Chicken Breast with Brown Rice',
          serving: '1 plate',
          calories: 450,
          protein: 48,
          carbs: 45,
          fat: 8
        }
      ],
      exercises: [
        {
          id: 'demo-ex-1',
          name: 'Morning Brisk Walk',
          duration: 30,
          calories: 140
        }
      ],
      waterCount: 4,
      note: 'Felt energetic after morning walk! Drinking plenty of water.'
    };
    saveAppData();
  }

  // --- DATE UTILITIES ---
  function getTodayDateString() {
    const now = new Date();
    return formatLocalDate(now);
  }

  function formatLocalDate(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function parseDateString(dateStr) {
    const parts = dateStr.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }

  function formatDisplayDate(dateStr) {
    const todayStr = getTodayDateString();
    const parsed = parseDateString(dateStr);

    // Check yesterday
    const yDate = new Date();
    yDate.setDate(yDate.getDate() - 1);
    const yesterdayStr = formatLocalDate(yDate);

    // Check tomorrow
    const tDate = new Date();
    tDate.setDate(tDate.getDate() + 1);
    const tomorrowStr = formatLocalDate(tDate);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[parsed.getMonth()];
    const day = parsed.getDate();

    if (dateStr === todayStr) {
      return `Today, ${month} ${day}`;
    } else if (dateStr === yesterdayStr) {
      return `Yesterday, ${month} ${day}`;
    } else if (dateStr === tomorrowStr) {
      return `Tomorrow, ${month} ${day}`;
    } else {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return `${dayNames[parsed.getDay()]}, ${month} ${day}`;
    }
  }

  function changeDate(delta) {
    const cur = parseDateString(selectedDate);
    cur.setDate(cur.getDate() + delta);
    selectedDate = formatLocalDate(cur);
    renderApp();
  }

  // --- TOAST NOTIFICATION ---
  let toastTimer = null;
  function showToast(message) {
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2500);
  }

  // --- RENDERING ---
  function renderApp() {
    // 1. Update Date UI
    currentDateDisplay.textContent = formatDisplayDate(selectedDate);
    datePickerInput.value = selectedDate;

    // 2. Fetch current day's record
    const dayData = getDayData(selectedDate);

    // 3. Calculate Totals
    let foodKcalTotal = 0;
    let proteinTotal = 0;
    let carbsTotal = 0;
    let fatTotal = 0;

    const mealTotals = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0
    };

    // Render Meals
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
      const container = mealLists[mealType];
      container.innerHTML = '';

      const items = dayData.meals.filter(m => m.type === mealType);
      items.forEach((item, index) => {
        const itemCal = Number(item.calories) || 0;
        foodKcalTotal += itemCal;
        mealTotals[mealType] += itemCal;
        proteinTotal += Number(item.protein) || 0;
        carbsTotal += Number(item.carbs) || 0;
        fatTotal += Number(item.fat) || 0;

        const row = document.createElement('div');
        row.className = 'food-item-row';
        row.innerHTML = `
          <div class="food-item-info">
            <span class="food-item-name">${escapeHtml(item.name)}</span>
            <div class="food-item-meta">
              ${item.serving ? `<span>${escapeHtml(item.serving)}</span> &bull;` : ''}
              <span class="food-macro-tag">P: ${item.protein || 0}g</span>
              <span class="food-macro-tag">C: ${item.carbs || 0}g</span>
              <span class="food-macro-tag">F: ${item.fat || 0}g</span>
            </div>
          </div>
          <div class="food-item-right">
            <span class="food-item-kcal">${itemCal} kcal</span>
            <div class="food-item-actions">
              <button class="item-action-icon-btn edit-btn" title="Edit" data-id="${item.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="item-action-icon-btn delete-btn" title="Delete" data-id="${item.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        `;

        // Action bindings
        row.querySelector('.edit-btn').addEventListener('click', () => editFoodItem(item.id));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteFoodItem(item.id));

        container.appendChild(row);
      });

      // Update meal subtotal badge
      mealKcalDisplays[mealType].textContent = mealTotals[mealType].toLocaleString();
    });

    // 4. Render Exercise
    exerciseList.innerHTML = '';
    let exerciseKcalTotal = 0;
    (dayData.exercises || []).forEach(ex => {
      const exCal = Number(ex.calories) || 0;
      exerciseKcalTotal += exCal;

      const row = document.createElement('div');
      row.className = 'exercise-item-row';
      row.innerHTML = `
        <div>
          <span class="exercise-item-name">${escapeHtml(ex.name)}</span>
          <div class="exercise-item-meta">${ex.duration ? ex.duration + ' mins' : 'Activity'}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="exercise-item-burned">-${exCal} kcal</span>
          <button class="item-action-icon-btn delete-ex-btn" title="Delete activity" data-id="${ex.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;

      row.querySelector('.delete-ex-btn').addEventListener('click', () => deleteExerciseItem(ex.id));
      exerciseList.appendChild(row);
    });
    exerciseKcalDisplay.textContent = exerciseKcalTotal.toLocaleString();

    // 5. Update Daily Note
    dailyNoteInput.value = dayData.note || '';

    // 6. Ring & Equation calculations
    const goalCal = appState.settings.calorieGoal;
    const remainingKcal = goalCal - foodKcalTotal + exerciseKcalTotal;

    statGoalCalories.textContent = goalCal.toLocaleString();
    statFoodCalories.textContent = foodKcalTotal.toLocaleString();
    statExerciseCalories.textContent = exerciseKcalTotal.toLocaleString();

    caloriesRemainingNumber.textContent = Math.abs(remainingKcal).toLocaleString();
    if (remainingKcal >= 0) {
      caloriesRemainingLabel.textContent = 'kcal left';
      calorieRingCircle.style.stroke = '#10b981'; // emerald
    } else {
      caloriesRemainingLabel.textContent = 'kcal over';
      calorieRingCircle.style.stroke = '#ef4444'; // rose
    }

    // SVG Ring Progress
    // r=76: circumference = 2 * PI * 76 = 477.52
    const circumference = 2 * Math.PI * 76;
    const effectiveBudget = goalCal + exerciseKcalTotal;
    const progressFraction = effectiveBudget > 0 ? Math.min(1, foodKcalTotal / effectiveBudget) : 0;
    const strokeOffset = circumference - (progressFraction * circumference);
    calorieRingCircle.style.strokeDashoffset = strokeOffset;

    // 7. Update Macro Bars
    const targetP = appState.settings.proteinGoal;
    const targetC = appState.settings.carbsGoal;
    const targetF = appState.settings.fatGoal;

    proteinCurrent.textContent = Math.round(proteinTotal);
    proteinTarget.textContent = targetP;
    proteinBar.style.width = Math.min(100, targetP > 0 ? (proteinTotal / targetP) * 100 : 0) + '%';

    carbsCurrent.textContent = Math.round(carbsTotal);
    carbsTarget.textContent = targetC;
    carbsBar.style.width = Math.min(100, targetC > 0 ? (carbsTotal / targetC) * 100 : 0) + '%';

    fatCurrent.textContent = Math.round(fatTotal);
    fatTarget.textContent = targetF;
    fatBar.style.width = Math.min(100, targetF > 0 ? (fatTotal / targetF) * 100 : 0) + '%';

    // 8. Calorie Split breakdown
    const calFromProtein = proteinTotal * 4;
    const calFromCarbs = carbsTotal * 4;
    const calFromFat = fatTotal * 9;
    const totalMacroCals = calFromProtein + calFromCarbs + calFromFat;

    if (totalMacroCals > 0) {
      const pctP = Math.round((calFromProtein / totalMacroCals) * 100);
      const pctC = Math.round((calFromCarbs / totalMacroCals) * 100);
      const pctF = Math.max(0, 100 - pctP - pctC);

      splitBarProtein.style.width = pctP + '%';
      splitBarCarbs.style.width = pctC + '%';
      splitBarFat.style.width = pctF + '%';

      proteinCalPct.textContent = pctP + '%';
      carbsCalPct.textContent = pctC + '%';
      fatCalPct.textContent = pctF + '%';
    } else {
      splitBarProtein.style.width = '33.3%';
      splitBarCarbs.style.width = '33.3%';
      splitBarFat.style.width = '33.4%';
      proteinCalPct.textContent = '0%';
      carbsCalPct.textContent = '0%';
      fatCalPct.textContent = '0%';
    }

    // 9. Water Tracker Rendering
    const currentWater = dayData.waterCount || 0;
    const targetWater = appState.settings.waterGoal || 8;
    waterCountEl.textContent = currentWater;
    waterGoalEl.textContent = targetWater;
    waterVolumeEl.textContent = (currentWater * 250).toLocaleString();

    waterGlassesGrid.innerHTML = '';
    for (let i = 1; i <= targetWater; i++) {
      const cup = document.createElement('div');
      cup.className = 'water-cup' + (i <= currentWater ? ' filled' : '');
      cup.title = `Glass ${i} (250 ml)`;
      cup.addEventListener('click', () => {
        // If clicking the current level, toggle down one, otherwise set to clicked cup
        if (dayData.waterCount === i) {
          dayData.waterCount = i - 1;
        } else {
          dayData.waterCount = i;
        }
        saveAppData();
        renderApp();
      });
      waterGlassesGrid.appendChild(cup);
    }
  }

  // --- RENDER PRESET CHIPS ---
  function renderPresets() {
    presetChipsContainer.innerHTML = '';
    PRESET_FOODS.forEach(preset => {
      const chip = document.createElement('button');
      chip.className = 'preset-chip';
      chip.type = 'button';
      chip.innerHTML = `
        <span>${escapeHtml(preset.name)}</span>
        <span class="preset-cal">${preset.calories} kcal</span>
      `;
      chip.addEventListener('click', () => {
        openAddFoodModalWithPreset(preset);
      });
      presetChipsContainer.appendChild(chip);
    });
  }

  // --- FOOD MANAGEMENT ---
  window.openAddFoodModal = function (mealType) {
    foodForm.reset();
    foodItemIndex.value = '';
    foodTargetMeal.value = mealType || 'breakfast';
    foodMealSelect.value = mealType || 'breakfast';
    foodModalTitle.textContent = 'Add Food to ' + capitalize(mealType || 'Breakfast');
    openModal(foodModal);
    setTimeout(() => foodNameInput.focus(), 50);
  };

  function openAddFoodModalWithPreset(preset) {
    foodForm.reset();
    foodItemIndex.value = '';
    foodTargetMeal.value = preset.meal || 'breakfast';
    foodMealSelect.value = preset.meal || 'breakfast';
    foodNameInput.value = preset.name;
    foodServingInput.value = preset.serving || '';
    foodCaloriesInput.value = preset.calories;
    foodProteinInput.value = preset.protein || '';
    foodCarbsInput.value = preset.carbs || '';
    foodFatInput.value = preset.fat || '';

    foodModalTitle.textContent = `Quick Add: ${preset.name}`;
    openModal(foodModal);
  }

  function editFoodItem(id) {
    const dayData = getDayData(selectedDate);
    const item = dayData.meals.find(m => m.id === id);
    if (!item) return;

    foodItemIndex.value = item.id;
    foodTargetMeal.value = item.type;
    foodMealSelect.value = item.type;
    foodNameInput.value = item.name;
    foodServingInput.value = item.serving || '';
    foodCaloriesInput.value = item.calories;
    foodProteinInput.value = item.protein !== undefined ? item.protein : '';
    foodCarbsInput.value = item.carbs !== undefined ? item.carbs : '';
    foodFatInput.value = item.fat !== undefined ? item.fat : '';

    foodModalTitle.textContent = 'Edit Food Item';
    openModal(foodModal);
  }

  function deleteFoodItem(id) {
    const dayData = getDayData(selectedDate);
    dayData.meals = dayData.meals.filter(m => m.id !== id);
    saveAppData();
    renderApp();
    showToast('Food item removed');
  }

  foodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = foodItemIndex.value;
    const mealType = foodMealSelect.value;
    const name = foodNameInput.value.trim();
    const serving = foodServingInput.value.trim();
    const calories = Math.max(0, parseFloat(foodCaloriesInput.value) || 0);
    const protein = Math.max(0, parseFloat(foodProteinInput.value) || 0);
    const carbs = Math.max(0, parseFloat(foodCarbsInput.value) || 0);
    const fat = Math.max(0, parseFloat(foodFatInput.value) || 0);

    if (!name) return;

    const dayData = getDayData(selectedDate);

    if (id) {
      // Edit existing
      const existing = dayData.meals.find(m => m.id === id);
      if (existing) {
        existing.type = mealType;
        existing.name = name;
        existing.serving = serving;
        existing.calories = calories;
        existing.protein = protein;
        existing.carbs = carbs;
        existing.fat = fat;
      }
      showToast('Food updated!');
    } else {
      // Add new
      dayData.meals.push({
        id: 'food_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: mealType,
        name: name,
        serving: serving,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat
      });
      showToast('Food added to ' + capitalize(mealType));
    }

    saveAppData();
    closeModal(foodModal);
    renderApp();
  });

  // --- EXERCISE MANAGEMENT ---
  openAddExerciseBtn.addEventListener('click', () => {
    exerciseForm.reset();
    exerciseItemIndex.value = '';
    openModal(exerciseModal);
    setTimeout(() => exerciseNameInput.focus(), 50);
  });

  window.selectExercisePreset = function (name, duration, calories) {
    exerciseNameInput.value = name;
    exerciseDurationInput.value = duration;
    exerciseCaloriesInput.value = calories;
  };

  function deleteExerciseItem(id) {
    const dayData = getDayData(selectedDate);
    dayData.exercises = dayData.exercises.filter(ex => ex.id !== id);
    saveAppData();
    renderApp();
    showToast('Activity removed');
  }

  exerciseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = exerciseNameInput.value.trim();
    const duration = parseInt(exerciseDurationInput.value, 10) || 0;
    const calories = Math.max(1, parseFloat(exerciseCaloriesInput.value) || 0);

    if (!name) return;

    const dayData = getDayData(selectedDate);
    dayData.exercises.push({
      id: 'ex_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: name,
      duration: duration,
      calories: calories
    });

    saveAppData();
    closeModal(exerciseModal);
    renderApp();
    showToast(`Logged ${calories} kcal burned!`);
  });

  // --- WATER BUTTONS ---
  addWaterBtn.addEventListener('click', () => {
    const dayData = getDayData(selectedDate);
    dayData.waterCount = (dayData.waterCount || 0) + 1;
    saveAppData();
    renderApp();
  });

  subWaterBtn.addEventListener('click', () => {
    const dayData = getDayData(selectedDate);
    if ((dayData.waterCount || 0) > 0) {
      dayData.waterCount--;
      saveAppData();
      renderApp();
    }
  });

  // --- NOTES ---
  saveNoteBtn.addEventListener('click', () => {
    const dayData = getDayData(selectedDate);
    dayData.note = dailyNoteInput.value;
    saveAppData();
    showToast('Daily note saved!');
  });

  dailyNoteInput.addEventListener('blur', () => {
    const dayData = getDayData(selectedDate);
    if (dayData.note !== dailyNoteInput.value) {
      dayData.note = dailyNoteInput.value;
      saveAppData();
    }
  });

  // --- TARGETS / GOALS MANAGEMENT ---
  openGoalsModalBtn.addEventListener('click', () => {
    goalCaloriesInput.value = appState.settings.calorieGoal;
    goalProteinInput.value = appState.settings.proteinGoal;
    goalCarbsInput.value = appState.settings.carbsGoal;
    goalFatInput.value = appState.settings.fatGoal;
    goalWaterInput.value = appState.settings.waterGoal;
    openModal(goalsModal);
  });

  window.autoCalculateMacros = function (presetType) {
    const cals = parseInt(goalCaloriesInput.value, 10) || 2000;
    if (presetType === 'balanced') {
      // 40% carbs, 30% protein, 30% fat
      // 1g carb = 4 kcal, 1g protein = 4 kcal, 1g fat = 9 kcal
      goalCarbsInput.value = Math.round((cals * 0.40) / 4);
      goalProteinInput.value = Math.round((cals * 0.30) / 4);
      goalFatInput.value = Math.round((cals * 0.30) / 9);
    } else if (presetType === 'highProtein') {
      // 35% carbs, 40% protein, 25% fat
      goalCarbsInput.value = Math.round((cals * 0.35) / 4);
      goalProteinInput.value = Math.round((cals * 0.40) / 4);
      goalFatInput.value = Math.round((cals * 0.25) / 9);
    } else if (presetType === 'lowCarb') {
      // 20% carbs, 40% protein, 40% fat
      goalCarbsInput.value = Math.round((cals * 0.20) / 4);
      goalProteinInput.value = Math.round((cals * 0.40) / 4);
      goalFatInput.value = Math.round((cals * 0.40) / 9);
    }
  };

  goalsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    appState.settings.calorieGoal = Math.max(500, parseInt(goalCaloriesInput.value, 10) || 2000);
    appState.settings.proteinGoal = Math.max(0, parseInt(goalProteinInput.value, 10) || 140);
    appState.settings.carbsGoal = Math.max(0, parseInt(goalCarbsInput.value, 10) || 220);
    appState.settings.fatGoal = Math.max(0, parseInt(goalFatInput.value, 10) || 65);
    appState.settings.waterGoal = Math.max(1, parseInt(goalWaterInput.value, 10) || 8);

    saveAppData();
    closeModal(goalsModal);
    renderApp();
    showToast('Goals updated successfully!');
  });

  // --- DATA BACKUP & RESTORE MODAL ---
  openDataModalBtn.addEventListener('click', () => {
    openModal(dataModal);
  });

  exportJsonBtn.addEventListener('click', () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nutritrack_backup_${getTodayDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON downloaded!');
  });

  importJsonFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && typeof parsed === 'object') {
          if (parsed.settings) appState.settings = Object.assign({}, appState.settings, parsed.settings);
          if (parsed.days) appState.days = Object.assign({}, appState.days, parsed.days);
          saveAppData();
          renderApp();
          closeModal(dataModal);
          showToast('Data imported successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Could not parse JSON file. Please ensure it is a valid NutriTrack backup file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  });

  clearTodayBtn.addEventListener('click', () => {
    if (confirm(`Are you sure you want to clear all logged food, workouts and water for ${selectedDate}?`)) {
      appState.days[selectedDate] = {
        meals: [],
        exercises: [],
        waterCount: 0,
        note: ''
      };
      saveAppData();
      renderApp();
      closeModal(dataModal);
      showToast('Cleared logs for ' + selectedDate);
    }
  });

  resetAllBtn.addEventListener('click', () => {
    if (confirm('CAUTION: This will delete ALL stored data across all dates and reset all targets to default. Continue?')) {
      localStorage.removeItem(STORAGE_KEY);
      appState = JSON.parse(JSON.stringify(defaultData));
      saveAppData();
      renderApp();
      closeModal(dataModal);
      showToast('All data has been reset to defaults');
    }
  });

  // --- MODAL UTILITIES ---
  function openModal(modalEl) {
    modalEl.classList.add('open');
  }

  function closeModal(modalEl) {
    modalEl.classList.remove('open');
  }

  [closeFoodModalBtn, cancelFoodModalBtn].forEach(btn => {
    btn.addEventListener('click', () => closeModal(foodModal));
  });

  [closeExerciseModalBtn, cancelExerciseModalBtn].forEach(btn => {
    btn.addEventListener('click', () => closeModal(exerciseModal));
  });

  [closeGoalsModalBtn, cancelGoalsModalBtn].forEach(btn => {
    btn.addEventListener('click', () => closeModal(goalsModal));
  });

  [closeDataModalBtn, closeDataModalActionBtn].forEach(btn => {
    btn.addEventListener('click', () => closeModal(dataModal));
  });

  // Close when clicking modal backdrop
  [foodModal, exerciseModal, goalsModal, dataModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [foodModal, exerciseModal, goalsModal, dataModal].forEach(closeModal);
    }
  });

  // --- DATE NAVIGATION LISTENERS ---
  prevDateBtn.addEventListener('click', () => changeDate(-1));
  nextDateBtn.addEventListener('click', () => changeDate(1));
  todayQuickBtn.addEventListener('click', () => {
    selectedDate = getTodayDateString();
    renderApp();
  });

  datePickerInput.addEventListener('change', (e) => {
    if (e.target.value) {
      selectedDate = e.target.value;
      renderApp();
    }
  });

  // --- STRING UTILS ---
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // --- INITIALIZE ---
  renderPresets();
  renderApp();

})();

