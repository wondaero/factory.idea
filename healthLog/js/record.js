// ==================== 기록 UI ====================

// 상태 변수
let currentExercise = null;
let selectedColor = '#007aff';
let selectedDate = today;
let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth();
let currentViewMode = 'calendar';
let isFromCalendar = false;
let pickerYear = calendarYear;
let recordsPage = 0;
const RECORDS_PER_PAGE = 20;
let allSortedDates = [];
let recordsByDate = {};
let isHistoryVisible = false;

// DOM 요소
const tabs = {
    record: document.getElementById('recordTab'),
    chart: document.getElementById('chartTab'),
    timer: document.getElementById('timerTab'),
    achievement: document.getElementById('achievementTab'),
    settings: document.getElementById('settingsTab')
};
const tabButtons = document.querySelectorAll('.tab-item');

// 탭 전환
function switchTab(tabName) {
    if (tabName === 'timer' && !isPremium) {
        showUpgradePrompt('타이머');
        return;
    }

    Object.values(tabs).forEach(t => t.classList.add('hidden'));
    tabs[tabName].classList.remove('hidden');
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));

    if (tabName === 'chart') {
        updateChartSelect();
        updateChartPeriodButtons();
    }
    if (tabName === 'record') currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
    if (tabName === 'settings') renderMain();
    if (tabName === 'achievement') renderAchievements();
}

function updateTabButtons() {
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === 'timer' && !isPremium) {
            btn.classList.add('premium-locked');
        } else {
            btn.classList.remove('premium-locked');
        }
    });
}
updateTabButtons();

tabButtons.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

// View Mode Toggle
const calendarViewBtn = document.getElementById('calendarViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const calendarView = document.getElementById('calendarView');
const listView = document.getElementById('listView');

function setViewMode(mode) {
    currentViewMode = mode;
    calendarViewBtn.classList.toggle('active', mode === 'calendar');
    listViewBtn.classList.toggle('active', mode === 'list');
    calendarView.classList.toggle('hidden', mode !== 'calendar');
    listView.classList.toggle('hidden', mode !== 'list');
    mode === 'calendar' ? renderCalendar() : renderFeedView();
}

calendarViewBtn.addEventListener('click', () => setViewMode('calendar'));
listViewBtn.addEventListener('click', () => setViewMode('list'));

// Calendar Touch Gesture
const calendarContainer = document.getElementById('calendarContainer');
let touchStartX = 0, touchEndX = 0;

calendarContainer.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchEndX = touchStartX;
}, { passive: true });

calendarContainer.addEventListener('touchmove', e => {
    touchEndX = e.touches[0].clientX;
}, { passive: true });

calendarContainer.addEventListener('touchend', () => {
    const diff = touchEndX - touchStartX;
    if (diff > 50) {
        calendarMonth--;
        if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
        selectFirstDayOfMonth();
    } else if (diff < -50) {
        calendarMonth++;
        if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
        selectFirstDayOfMonth();
    }
});

function selectFirstDayOfMonth() {
    selectedDate = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-01`;
    dayDetail.classList.add('hidden');
    renderCalendar();
}

// Month Picker
const monthPickerModal = document.getElementById('monthPickerModal');
const calendarTitleBtn = document.getElementById('calendarTitleBtn');
const yearGrid = document.getElementById('yearGrid');
const yearScrollContainer = document.getElementById('yearScrollContainer');
const monthGrid = document.getElementById('monthGrid');

let yearRangeStart = new Date().getFullYear() - 11;
let yearRangeEnd = new Date().getFullYear();

calendarTitleBtn.addEventListener('click', () => {
    pickerYear = calendarYear;
    yearRangeStart = Math.min(yearRangeStart, pickerYear - 2);
    yearRangeEnd = Math.max(yearRangeEnd, pickerYear);
    renderYearGrid();
    renderMonthPicker();
    monthPickerModal.classList.add('show');
    setTimeout(() => {
        const selectedYear = yearGrid.querySelector('.year-btn.current');
        if (selectedYear) selectedYear.scrollIntoView({ block: 'center' });
    }, 50);
});

document.getElementById('closeMonthPicker').addEventListener('click', () => monthPickerModal.classList.remove('show'));
monthPickerModal.addEventListener('click', e => { if (e.target === monthPickerModal) monthPickerModal.classList.remove('show'); });

function renderYearGrid() {
    const years = [];
    for (let y = yearRangeEnd; y >= yearRangeStart; y--) {
        years.push(y);
    }
    yearGrid.innerHTML = years.map(y => {
        const isCurrent = y === pickerYear;
        return `<button class="year-btn ${isCurrent ? 'current' : ''}" data-year="${y}">${y}년</button>`;
    }).join('');
}

yearScrollContainer.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = yearScrollContainer;
    if (scrollTop < 20) {
        const currentYear = new Date().getFullYear();
        if (yearRangeEnd < currentYear) {
            yearRangeEnd = Math.min(yearRangeEnd + 3, currentYear);
            renderYearGrid();
        }
    }
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        yearRangeStart -= 3;
        renderYearGrid();
    }
});

yearGrid.addEventListener('click', e => {
    if (e.target.classList.contains('year-btn')) {
        pickerYear = parseInt(e.target.dataset.year);
        renderYearGrid();
        renderMonthPicker();
    }
});

function renderMonthPicker() {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    monthGrid.innerHTML = months.map((m, i) => {
        const isCurrent = pickerYear === calendarYear && i === calendarMonth;
        return `<button class="month-btn ${isCurrent ? 'current' : ''}" data-month="${i}">${m}</button>`;
    }).join('');
}

monthGrid.addEventListener('click', e => {
    if (e.target.classList.contains('month-btn')) {
        calendarYear = pickerYear;
        calendarMonth = parseInt(e.target.dataset.month);
        monthPickerModal.classList.remove('show');
        selectFirstDayOfMonth();
    }
});

// Calendar Rendering
const calendarDays = document.getElementById('calendarDays');
const dayDetail = document.getElementById('dayDetail');
const dayDetailTitle = document.getElementById('dayDetailTitle');
const dayExercises = document.getElementById('dayExercises');

function getExercisesForDate(dateStr) {
    const result = [];
    const exerciseMap = {};

    const dayRecords = data.records.filter(r => getDateFromDatetime(r.datetime) === dateStr);

    for (const record of dayRecords) {
        if (!exerciseMap[record.exerciseId]) {
            exerciseMap[record.exerciseId] = [];
        }
        exerciseMap[record.exerciseId].push(record);
    }

    for (const exercise of data.exercises) {
        if (exerciseMap[exercise.id] && exerciseMap[exercise.id].length > 0) {
            result.push({
                id: exercise.id,
                name: exercise.name,
                color: exercise.color || '#007aff',
                memo: exercise.memo || '',
                sets: exerciseMap[exercise.id].length,
                records: exerciseMap[exercise.id]
            });
        }
    }
    return result;
}

function getExerciseColorsForDate(dateStr) {
    const colors = [];
    const seen = new Set();

    for (const record of data.records) {
        if (getDateFromDatetime(record.datetime) === dateStr && !seen.has(record.exerciseId)) {
            seen.add(record.exerciseId);
            const exercise = getExerciseById(record.exerciseId);
            colors.push(exercise?.color || '#007aff');
            if (colors.length >= 4) break;
        }
    }
    return colors;
}

function renderMonthDays(year, month, container) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const prevLastDay = new Date(year, month, 0).getDate();

    let html = '';
    for (let i = startDay - 1; i >= 0; i--) {
        const day = prevLastDay - i;
        const date = new Date(year, month - 1, day);
        const dateStr = date.toLocaleDateString('sv-SE');
        const colors = getExerciseColorsForDate(dateStr);
        const dayOfWeek = (startDay - 1 - i) % 7;
        let classes = 'calendar-day other-month';
        if (dayOfWeek === 0) classes += ' sunday';
        if (dayOfWeek === 6) classes += ' saturday';
        html += `<button class="${classes}" data-date="${dateStr}"><span class="day-number">${day}</span><div class="exercise-dots">${colors.map(c => `<span class="exercise-dot" style="background:${c}"></span>`).join('')}</div></button>`;
    }

    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toLocaleDateString('sv-SE');
        const colors = getExerciseColorsForDate(dateStr);
        const dayOfWeek = date.getDay();
        let classes = 'calendar-day';
        if (dateStr === today) classes += ' today';
        if (dateStr === selectedDate) classes += ' selected';
        if (dayOfWeek === 0) classes += ' sunday';
        if (dayOfWeek === 6) classes += ' saturday';
        html += `<button class="${classes}" data-date="${dateStr}"><span class="day-number">${day}</span><div class="exercise-dots">${colors.map(c => `<span class="exercise-dot" style="background:${c}"></span>`).join('')}</div></button>`;
    }

    const totalCells = startDay + totalDays;
    const neededRows = Math.ceil(totalCells / 7);
    const remaining = (neededRows * 7) - totalCells;
    for (let day = 1; day <= remaining; day++) {
        const date = new Date(year, month + 1, day);
        const dateStr = date.toLocaleDateString('sv-SE');
        const colors = getExerciseColorsForDate(dateStr);
        const dayOfWeek = (startDay + totalDays + day - 1) % 7;
        let classes = 'calendar-day other-month';
        if (dayOfWeek === 0) classes += ' sunday';
        if (dayOfWeek === 6) classes += ' saturday';
        html += `<button class="${classes}" data-date="${dateStr}"><span class="day-number">${day}</span><div class="exercise-dots">${colors.map(c => `<span class="exercise-dot" style="background:${c}"></span>`).join('')}</div></button>`;
    }

    container.innerHTML = html;
}

function renderCalendar() {
    calendarTitleBtn.textContent = `${calendarYear}년 ${calendarMonth + 1}월`;
    renderMonthDays(calendarYear, calendarMonth, calendarDays);
}

function showDayDetail(dateStr) {
    selectedDate = dateStr;
    const date = parseLocalDate(dateStr);
    dayDetailTitle.textContent = dateStr === today ? '오늘 기록' : `${date.getMonth() + 1}월 ${date.getDate()}일 기록`;

    const exercises = getExercisesForDate(dateStr);
    if (exercises.length === 0) {
        dayExercises.innerHTML = '<div class="empty" style="padding:20px">기록이 없습니다</div>';
    } else {
        dayExercises.innerHTML = exercises.map(ex => `
            <div class="day-exercise-item" data-exercise-id="${ex.id}">
                <span class="color-dot" style="background:${ex.color}"></span>
                <div class="exercise-info">
                    <div class="exercise-name">${ex.name}</div>
                    <div class="exercise-sets">${ex.sets}세트</div>
                    ${ex.memo ? `<div class="exercise-memo">${ex.memo}</div>` : ''}
                </div>
                <button class="delete-btn" data-delete-id="${ex.id}">×</button>
            </div>
        `).join('');
    }
    dayDetail.classList.remove('hidden');
    renderCalendar();
}

document.getElementById('prevMonth').addEventListener('click', () => {
    calendarMonth--;
    if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
    selectFirstDayOfMonth();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    calendarMonth++;
    if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
    selectFirstDayOfMonth();
});

document.getElementById('todayBtn').addEventListener('click', () => {
    const now = new Date();
    calendarYear = now.getFullYear();
    calendarMonth = now.getMonth();
    selectedDate = today;
    dayDetail.classList.add('hidden');
    renderCalendar();
});

calendarDays.addEventListener('click', e => {
    const dayBtn = e.target.closest('.calendar-day');
    if (dayBtn) showDayDetail(dayBtn.dataset.date);
});

document.getElementById('closeDayDetail').addEventListener('click', () => {
    clearAllForDate(selectedDate);
});

document.getElementById('dayAddBtn').addEventListener('click', () => switchTab('settings'));

function deleteExerciseForDate(exerciseId, dateStr) {
    const exercise = getExerciseById(exerciseId);
    const exerciseName = exercise?.name || '운동';
    const date = parseLocalDate(dateStr);
    const dateLabel = `${date.getMonth() + 1}월 ${date.getDate()}일`;
    if (!confirm(`"${exerciseName}" ${dateLabel} 기록을 삭제할까요?`)) return;
    data.records = data.records.filter(r => !(r.exerciseId === exerciseId && getDateFromDatetime(r.datetime) === dateStr));
    save();
    showDayDetail(dateStr);
}

function clearAllForDate(dateStr) {
    const exercises = getExercisesForDate(dateStr);
    // 기록이 없으면 그냥 닫기
    if (exercises.length === 0) {
        dayDetail.classList.add('hidden');
        return;
    }
    const date = parseLocalDate(dateStr);
    const dateLabel = dateStr === today ? '오늘' : `${date.getMonth() + 1}월 ${date.getDate()}일`;
    if (!confirm(`${dateLabel}의 모든 운동 기록을 삭제할까요?\n(${exercises.map(e => e.name).join(', ')})`)) return;
    data.records = data.records.filter(r => getDateFromDatetime(r.datetime) !== dateStr);
    save();
    showDayDetail(dateStr);
}

dayExercises.addEventListener('click', e => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        e.stopPropagation();
        deleteExerciseForDate(deleteBtn.dataset.deleteId, selectedDate);
        return;
    }
    const item = e.target.closest('.day-exercise-item');
    if (item) showDetailById(item.dataset.exerciseId, selectedDate);
});

// Feed View
const feedView = document.getElementById('feedView');

function getAllRecordDates() {
    const dates = new Set();
    for (const record of data.records) {
        dates.add(getDateFromDatetime(record.datetime));
    }
    return Array.from(dates).sort().reverse();
}

function formatDateKorean(dateStr) {
    const d = parseLocalDate(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

function renderFeedView() {
    const dates = getAllRecordDates();
    const addTodayBtn = `
        <div class="feed-add-today">
            <button class="feed-add-today-btn" data-date="${today}">+ 기록 추가</button>
        </div>
    `;
    if (dates.length === 0) {
        feedView.innerHTML = addTodayBtn + '<div class="empty">기록이 없습니다</div>';
        return;
    }
    feedView.innerHTML = addTodayBtn + dates.map(dateStr => {
        const exercises = getExercisesForDate(dateStr);
        const isToday = dateStr === today;
        return `
            <div class="feed-day">
                <div class="feed-day-header">
                    <span class="feed-day-date ${isToday ? 'today' : ''}">${isToday ? '오늘' : formatDateKorean(dateStr)}</span>
                    <button class="feed-day-add" data-date="${dateStr}">+</button>
                </div>
                <div class="feed-exercises">
                    ${exercises.map(ex => `
                        <div class="feed-exercise" style="border-left-color: ${ex.color}" data-exercise-id="${ex.id}" data-date="${dateStr}">
                            <div class="feed-exercise-header">
                                <span class="feed-exercise-color" style="background: ${ex.color}"></span>
                                <span class="feed-exercise-name">${ex.name}</span>
                            </div>
                            ${ex.memo ? `<div class="feed-exercise-memo">${ex.memo}</div>` : ''}
                            <div class="feed-sets">
                                ${ex.records.map(r => `<span class="feed-set"><strong>${r.w}kg</strong> × ${r.r}${r.m ? ` (${r.m})` : ''}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

feedView.addEventListener('click', e => {
    const addTodayBtn = e.target.closest('.feed-add-today-btn');
    if (addTodayBtn) {
        selectedDate = addTodayBtn.dataset.date;
        switchTab('settings');
        return;
    }
    const addBtn = e.target.closest('.feed-day-add');
    if (addBtn) {
        selectedDate = addBtn.dataset.date;
        switchTab('settings');
        return;
    }
    const exerciseEl = e.target.closest('.feed-exercise');
    if (exerciseEl) showDetailById(exerciseEl.dataset.exerciseId, exerciseEl.dataset.date);
});

// Exercise List & Detail
const mainPage = document.getElementById('mainPage');
const detailPage = document.getElementById('detailPage');
const addExercisePage = document.getElementById('addExercisePage');
const exerciseList = document.getElementById('exerciseList');
const exerciseSearchInput = document.getElementById('exerciseSearch');
const detailTitle = document.getElementById('detailTitle');
const setList = document.getElementById('setList');
const dateInput = document.getElementById('dateInput');
const weightInput = document.getElementById('weightInput');
const repsInput = document.getElementById('repsInput');
const exerciseMemo = document.getElementById('exerciseMemo');
const exerciseMemoDisplay = document.getElementById('exerciseMemoDisplay');
const setMemoInput = document.getElementById('setMemo');
const colorPickerGrid = document.getElementById('colorPickerGrid');
const colorPreviewBtn = document.getElementById('colorPreviewBtn');
const colorPickerDropdown = document.getElementById('colorPickerDropdown');
const newExerciseNameInput = document.getElementById('newExerciseName');
const newExerciseMemoInput = document.getElementById('newExerciseMemo');

function renderColorPicker() {
    const colors = getAvailableColors();
    colorPickerGrid.innerHTML = colors.map(c =>
        `<div class="color-option" data-color="${c}" style="background:${c}"></div>`
    ).join('');

    if (!isPremium) {
        colorPickerGrid.innerHTML += `<div class="color-option premium-more" data-premium="true">+${PRESET_COLORS.length - LITE_COLORS.length}</div>`;
    }
}

renderColorPicker();
let newExerciseColor = '#007aff';

function selectNewExerciseColor(color) {
    newExerciseColor = color;
    colorPreviewBtn.style.background = color;
    document.querySelectorAll('#colorPickerGrid .color-option').forEach(el => el.classList.toggle('selected', el.dataset.color === color));
}

colorPreviewBtn.addEventListener('click', () => {
    colorPickerDropdown.classList.toggle('hidden');
});

colorPickerGrid.addEventListener('click', e => {
    if (e.target.classList.contains('color-option')) {
        if (e.target.dataset.premium === 'true') {
            showUpgradePrompt('더 많은 색상');
            return;
        }
        selectNewExerciseColor(e.target.dataset.color);
        colorPickerDropdown.classList.add('hidden');
    }
});

function renderMain(searchQuery = '') {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === exerciseSortOrder);
    });

    if (data.exercises.length === 0) {
        exerciseList.innerHTML = '<div class="empty">운동을 추가하세요</div>';
        return;
    }

    let filteredExercises = data.exercises;
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredExercises = data.exercises.filter(ex => ex.name.toLowerCase().includes(query));
    }

    let sortedExercises = [...filteredExercises];
    if (exerciseSortOrder === 'name') {
        sortedExercises.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    }

    if (sortedExercises.length === 0) {
        exerciseList.innerHTML = '<div class="empty">검색 결과가 없습니다</div>';
        return;
    }

    exerciseList.innerHTML = sortedExercises.map(ex => {
        const todayCount = data.records.filter(r => r.exerciseId === ex.id && getDateFromDatetime(r.datetime) === today).length;
        return `
            <div class="list-item" data-id="${ex.id}" style="border-left-color:${ex.color}">
                <div style="display:flex;align-items:center">
                    <div class="color-dot" style="background:${ex.color}"></div>
                    <div>
                        <h3>${ex.name}</h3>
                        <span class="count">오늘 ${todayCount}세트</span>
                        ${ex.memo ? `<div class="item-memo">${ex.memo}</div>` : ''}
                    </div>
                </div>
                <button class="delete-btn" data-id="${ex.id}">×</button>
            </div>
        `;
    }).join('');
}

document.getElementById('sortToggle').addEventListener('click', e => {
    const btn = e.target.closest('.sort-btn');
    if (btn && btn.dataset.sort !== exerciseSortOrder) {
        exerciseSortOrder = btn.dataset.sort;
        save();
        renderMain();
    }
});

function renderDetail(filterDate = null) {
    const exerciseRecords = data.records.filter(r => r.exerciseId === currentExercise);
    recordsByDate = {};

    exerciseRecords.forEach(r => {
        const dateStr = getDateFromDatetime(r.datetime);
        if (filterDate && dateStr !== filterDate) return;
        if (!recordsByDate[dateStr]) recordsByDate[dateStr] = [];
        recordsByDate[dateStr].push({ ...r });
    });

    allSortedDates = Object.keys(recordsByDate).sort().reverse();
    recordsPage = 0;

    const totalRecords = exerciseRecords.length;
    const historyToggleText = document.getElementById('historyToggleText');
    if (historyToggleText) {
        historyToggleText.textContent = isHistoryVisible ? `숨기기 (${totalRecords})` : `보기 (${totalRecords})`;
    }

    if (allSortedDates.length === 0) {
        setList.innerHTML = '<div class="empty">기록이 없습니다</div>';
        document.getElementById('loadMoreIndicator').classList.add('hidden');
        return;
    }

    setList.innerHTML = '';
    loadMoreRecords();
}

function loadMoreRecords() {
    const startIdx = isFromCalendar ? 0 : recordsPage * RECORDS_PER_PAGE;
    const endIdx = isFromCalendar ? allSortedDates.length : startIdx + RECORDS_PER_PAGE;
    const datesToRender = allSortedDates.slice(startIdx, endIdx);

    if (datesToRender.length === 0) {
        document.getElementById('loadMoreIndicator').classList.add('hidden');
        return;
    }

    const html = datesToRender.map(date => {
        const sets = recordsByDate[date];
        sets.sort((a, b) => a.datetime.localeCompare(b.datetime));
        const dateLabel = date === today ? '오늘' : date;
        return `
            <div class="date-label">${dateLabel}</div>
            ${sets.map((s, i) => `
                <div class="set-item" data-id="${s.id}">
                    <div>
                        <span class="info"><strong>${s.w}kg</strong> x ${s.r}reps</span>
                        ${s.m ? `<div class="set-memo">${s.m}</div>` : ''}
                    </div>
                    <div>
                        <span class="meta">Set ${i + 1}</span>
                        <button class="edit-btn" data-id="${s.id}">✏️</button>
                        <button class="delete-btn" data-id="${s.id}">×</button>
                    </div>
                </div>
            `).join('')}
        `;
    }).join('');

    if (isFromCalendar) {
        setList.innerHTML = html;
    } else {
        setList.insertAdjacentHTML('beforeend', html);
        recordsPage++;
    }

    const hasMore = !isFromCalendar && endIdx < allSortedDates.length;
    document.getElementById('loadMoreIndicator').classList.toggle('hidden', !hasMore);
}

function showMain() {
    mainPage.classList.remove('hidden');
    detailPage.classList.add('hidden');
    addExercisePage.classList.add('hidden');
    currentExercise = null;
    renderMain();
    currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
}

function showDetailById(id, date = null) {
    const exercise = getExerciseById(id);
    if (!exercise) return;

    currentExercise = id;
    detailTitle.textContent = exercise.name;
    mainPage.classList.add('hidden');
    detailPage.classList.remove('hidden');
    addExercisePage.classList.add('hidden');
    dayDetail.classList.add('hidden');

    exerciseMemo.value = exercise.memo || '';
    if (exercise.memo) {
        exerciseMemoDisplay.textContent = exercise.memo;
        exerciseMemoDisplay.classList.remove('hidden');
    } else {
        exerciseMemoDisplay.classList.add('hidden');
    }

    dateInput.value = date || selectedDate || today;
    weightInput.value = '';
    repsInput.value = '';
    setMemoInput.value = '';

    if (date) {
        isHistoryVisible = true;
        isFromCalendar = true;
        document.getElementById('inputFormArea').classList.add('hidden');
        document.getElementById('addRecordToggleBtn').classList.remove('hidden');
        document.getElementById('historyToggleBtn').classList.add('hidden');
        document.getElementById('setListContainer').classList.remove('hidden');
        document.getElementById('setListContainer').style.maxHeight = 'none';
    } else {
        isHistoryVisible = false;
        isFromCalendar = false;
        document.getElementById('inputFormArea').classList.remove('hidden');
        document.getElementById('addRecordToggleBtn').classList.add('hidden');
        document.getElementById('historyToggleBtn').classList.remove('hidden');
        document.getElementById('historyToggleBtn').classList.remove('active');
        document.getElementById('setListContainer').classList.add('hidden');
        document.getElementById('setListContainer').style.maxHeight = '';
    }

    renderDetail(date);
    updateAddSetBtnColor();
}

function showDetail(name, date = null) {
    const exercise = getExerciseByName(name);
    if (exercise) showDetailById(exercise.id, date);
}

exerciseMemo.addEventListener('blur', () => {
    if (currentExercise) {
        const exercise = getExerciseById(currentExercise);
        if (exercise) {
            exercise.memo = exerciseMemo.value.trim();
            save();
            if (exercise.memo) {
                exerciseMemoDisplay.textContent = exercise.memo;
                exerciseMemoDisplay.classList.remove('hidden');
            } else {
                exerciseMemoDisplay.classList.add('hidden');
            }
        }
    }
});

function openAddExercisePage() {
    newExerciseNameInput.value = '';
    newExerciseMemoInput.value = '';
    newExerciseColor = '#007aff';
    selectNewExerciseColor(newExerciseColor);
    colorPickerDropdown.classList.add('hidden');
    tabs.settings.classList.add('hidden');
    addExercisePage.classList.remove('hidden');
}

function closeAddExercisePage() {
    addExercisePage.classList.add('hidden');
    tabs.settings.classList.remove('hidden');
}

function addExercise() {
    const name = newExerciseNameInput.value.trim();
    if (!name) {
        alert('운동 이름을 입력하세요');
        return;
    }
    if (data.exercises.some(ex => ex.name === name)) {
        alert('이미 존재하는 운동입니다');
        return;
    }
    data.exercises.push({
        id: String(Date.now()),
        name: name,
        color: newExerciseColor,
        memo: newExerciseMemoInput.value.trim()
    });
    save();
    renderMain();
    currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
    closeAddExercisePage();
}

document.getElementById('openAddExercise').addEventListener('click', openAddExercisePage);
document.getElementById('closeAddExercise').addEventListener('click', closeAddExercisePage);
document.getElementById('submitAddExercise').addEventListener('click', addExercise);
newExerciseNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') addExercise(); });

exerciseSearchInput.addEventListener('input', e => {
    renderMain(e.target.value);
});

exerciseList.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        const exercise = getExerciseById(id);
        if (!confirm(`"${exercise?.name}" 운동을 삭제할까요?`)) return;
        data.exercises = data.exercises.filter(ex => ex.id !== id);
        data.records = data.records.filter(r => r.exerciseId !== id);
        save();
        renderMain();
        currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
        return;
    }
    const item = e.target.closest('.list-item');
    if (item) showDetailById(item.dataset.id);
});

document.getElementById('backBtn').addEventListener('click', showMain);

// Title Edit
const editTitleBtn = document.getElementById('editTitleBtn');
let editContainer = null;

function startEditTitle() {
    if (editContainer) return;

    const exercise = getExerciseById(currentExercise);
    if (!exercise) return;
    const currentName = exercise.name;
    const header = detailTitle.parentElement;

    editContainer = document.createElement('div');
    editContainer.className = 'title-edit-container';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'title-input';
    input.value = currentName;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'title-edit-btns';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'title-save-btn';
    saveBtn.textContent = '수정';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'title-cancel-btn';
    cancelBtn.textContent = '취소';

    btnGroup.appendChild(saveBtn);
    btnGroup.appendChild(cancelBtn);
    editContainer.appendChild(input);
    editContainer.appendChild(btnGroup);

    detailTitle.style.display = 'none';
    editTitleBtn.style.display = 'none';
    header.insertBefore(editContainer, detailTitle);
    input.focus();
    input.select();

    function finishEdit(shouldSave) {
        const newName = input.value.trim();
        editContainer.remove();
        editContainer = null;
        detailTitle.style.display = '';
        editTitleBtn.style.display = '';

        if (!shouldSave || !newName || newName === currentName) return;

        const existingExercise = data.exercises.find(ex => ex.name === newName && ex.id !== currentExercise);
        if (existingExercise) {
            if (confirm(`"${newName}" 이미 존재합니다. 합칠까요?`)) {
                data.records.forEach(r => {
                    if (r.exerciseId === currentExercise) r.exerciseId = existingExercise.id;
                });
                data.exercises = data.exercises.filter(ex => ex.id !== currentExercise);
                currentExercise = existingExercise.id;
                detailTitle.textContent = newName;
                exerciseMemo.value = existingExercise.memo || '';
                save();
                renderDetail();
                updateAddSetBtnColor();
            }
        } else {
            exercise.name = newName;
            detailTitle.textContent = newName;
            save();
        }
    }

    saveBtn.addEventListener('click', () => finishEdit(true));
    cancelBtn.addEventListener('click', () => finishEdit(false));
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') finishEdit(true);
        if (e.key === 'Escape') finishEdit(false);
    });
}

editTitleBtn.addEventListener('click', startEditTitle);
detailTitle.addEventListener('click', startEditTitle);

function updateAddSetBtnColor() {
    if (!currentExercise) return;
    const exercise = getExerciseById(currentExercise);
    const color = exercise?.color || '#34c759';
    const addSetBtn = document.getElementById('addSetBtn');
    addSetBtn.style.background = color;
    addSetBtn.style.color = isLightColor(color) ? '#1d1d1f' : '#fff';
}

// Input Validation
function sanitizeNumber(value, allowDecimal = false) {
    if (value === '' || value === null || value === undefined) return '';
    let str = String(value).replace(/[^0-9.,-]/g, '').replace(',', '.');
    if (!allowDecimal) str = str.replace(/\./g, '');
    const parts = str.split('.');
    if (parts.length > 2) str = parts[0] + '.' + parts.slice(1).join('');
    str = str.replace(/-/g, '');
    return str;
}

function validateInput(input, allowDecimal = false) {
    input.addEventListener('input', () => {
        const pos = input.selectionStart;
        const before = input.value;
        input.value = sanitizeNumber(input.value, allowDecimal);
        if (before !== input.value) {
            input.selectionStart = input.selectionEnd = Math.max(0, pos - (before.length - input.value.length));
        }
    });
    input.addEventListener('paste', e => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        input.value = sanitizeNumber(text, allowDecimal);
    });
}

validateInput(weightInput, true);
validateInput(repsInput, false);

function addSet() {
    const d = dateInput.value || today;
    const wRaw = sanitizeNumber(weightInput.value, true);
    const rRaw = sanitizeNumber(repsInput.value, false);
    const w = wRaw === '' ? 0 : parseFloat(wRaw);
    const r = rRaw === '' ? 0 : parseInt(rRaw);
    const m = setMemoInput.value.trim();

    if (isNaN(w) || w < 0) { weightInput.focus(); return; }
    if (isNaN(r) || r <= 0) { repsInput.focus(); return; }

    const record = {
        id: generateId(),
        datetime: createDatetime(d),
        exerciseId: currentExercise,
        w: w,
        r: r,
        m: m || null
    };
    data.records.push(record);
    save();
    renderDetail();
    currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
    weightInput.value = '';
    repsInput.value = '';
    setMemoInput.value = '';
    weightInput.focus();
}

document.getElementById('addSetBtn').addEventListener('click', addSet);
[weightInput, repsInput].forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') addSet(); }));

document.getElementById('addRecordToggleBtn').addEventListener('click', () => {
    document.getElementById('inputFormArea').classList.remove('hidden');
    document.getElementById('addRecordToggleBtn').classList.add('hidden');
    weightInput.focus();
});

const historyToggleBtn = document.getElementById('historyToggleBtn');
const setListContainer = document.getElementById('setListContainer');

historyToggleBtn.addEventListener('click', () => {
    isHistoryVisible = !isHistoryVisible;
    historyToggleBtn.classList.toggle('active', isHistoryVisible);
    setListContainer.classList.toggle('hidden', !isHistoryVisible);
    const historyToggleText = document.getElementById('historyToggleText');
    const totalRecords = data.records.filter(r => r.exerciseId === currentExercise).length;
    historyToggleText.textContent = isHistoryVisible ? `숨기기 (${totalRecords})` : `보기 (${totalRecords})`;
});

setListContainer.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = setListContainer;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
        loadMoreRecords();
    }
});

setList.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        const idx = data.records.findIndex(r => r.id === id);
        if (idx !== -1) {
            data.records.splice(idx, 1);
            save();
            renderDetail();
            currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
        }
        return;
    }
    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        openEditSetModal(id);
        return;
    }
});

// Set Edit Modal
const setEditModal = document.getElementById('setEditModal');
const editWeightInput = document.getElementById('editWeight');
const editRepsInput = document.getElementById('editReps');
const editSetMemoInput = document.getElementById('editSetMemo');
let editingSetId = null;

function openEditSetModal(id) {
    const record = data.records.find(r => r.id === id);
    if (!record) return;

    editingSetId = id;
    editWeightInput.value = record.w;
    editRepsInput.value = record.r;
    editSetMemoInput.value = record.m || '';
    setEditModal.classList.add('show');
}

function closeEditSetModal() {
    setEditModal.classList.remove('show');
    editingSetId = null;
}

function saveEditSet() {
    if (!editingSetId) return;

    const w = parseFloat(editWeightInput.value) || 0;
    const r = parseInt(editRepsInput.value) || 0;
    const m = editSetMemoInput.value.trim();

    if (r <= 0) {
        editRepsInput.focus();
        return;
    }

    const record = data.records.find(r => r.id === editingSetId);
    if (record) {
        record.w = w;
        record.r = r;
        record.m = m || null;
        save();
        renderDetail();
        currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
    }
    closeEditSetModal();
}

document.getElementById('closeSetEdit').addEventListener('click', closeEditSetModal);
document.getElementById('cancelSetEdit').addEventListener('click', closeEditSetModal);
document.getElementById('saveSetEdit').addEventListener('click', saveEditSet);
setEditModal.addEventListener('click', e => { if (e.target === setEditModal) closeEditSetModal(); });
validateInput(editWeightInput, true);
validateInput(editRepsInput, false);
