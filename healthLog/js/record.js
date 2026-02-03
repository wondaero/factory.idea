// ==================== 기록 UI ====================

// 상태 변수
let currentExercise = null;
let selectedColor = '#339af0';
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

// ==================== Records 인덱스 캐시 (성능 최적화) ====================
let _recordsByDateCache = null;
let _recordsByExerciseCache = null;
let _cacheVersion = 0;

function invalidateRecordsCache() {
    _recordsByDateCache = null;
    _recordsByExerciseCache = null;
    _cacheVersion++;
}

function getRecordsByDateIndex() {
    if (_recordsByDateCache) return _recordsByDateCache;
    _recordsByDateCache = {};
    const records = data.records;
    for (let i = 0, len = records.length; i < len; i++) {
        const r = records[i];
        const d = r.datetime.slice(0, 10);
        (_recordsByDateCache[d] || (_recordsByDateCache[d] = [])).push(r);
    }
    return _recordsByDateCache;
}

function getRecordsByExerciseIndex() {
    if (_recordsByExerciseCache) return _recordsByExerciseCache;
    _recordsByExerciseCache = {};
    const records = data.records;
    for (let i = 0, len = records.length; i < len; i++) {
        const r = records[i];
        (_recordsByExerciseCache[r.exerciseId] || (_recordsByExerciseCache[r.exerciseId] = [])).push(r);
    }
    return _recordsByExerciseCache;
}

// save 함수 래핑하여 캐시 무효화
const _originalSave = save;
save = function() {
    invalidateRecordsCache();
    _originalSave();
};

// ==================== DOM 요소 캐싱 ====================
const $ = id => document.getElementById(id);
const tabs = {
    record: $('recordTab'),
    chart: $('chartTab'),
    achievement: $('achievementTab'),
    settings: $('settingsTab')
};
const tabButtons = document.querySelectorAll('.tab-item');
const calendarViewBtn = $('calendarViewBtn');
const listViewBtn = $('listViewBtn');
const calendarView = $('calendarView');
const listView = $('listView');
const calendarContainer = $('calendarContainer');
const monthPickerModal = $('monthPickerModal');
const calendarTitleBtn = $('calendarTitleBtn');
const yearGrid = $('yearGrid');
const yearScrollContainer = $('yearScrollContainer');
const monthGrid = $('monthGrid');
const calendarDays = $('calendarDays');
const dayDetail = $('dayDetail');
const dayDetailTitle = $('dayDetailTitle');
const dayExercises = $('dayExercises');
const feedView = $('feedView');
const mainPage = $('mainPage');
const detailPage = $('detailPage');
const addExercisePage = $('addExercisePage');
const exerciseList = $('exerciseList');
const exerciseSearchInput = $('exerciseSearch');
const detailTitle = $('detailTitle');
const setList = $('setList');
const dateInput = $('dateInput');
const weightInput = $('weightInput');
const repsInput = $('repsInput');
const exerciseMemoDisplay = $('exerciseMemoDisplay');
const setMemoInput = $('setMemo');
const colorPickerGrid = $('colorPickerGrid');
const colorPreviewBtn = $('colorPreviewBtn');
const colorPickerModal = $('colorPickerModal');
const newExerciseNameInput = $('newExerciseName');
const newExerciseMemoInput = $('newExerciseMemo');
const setEditModal = $('setEditModal');
const editWeightInput = $('editWeight');
const editRepsInput = $('editReps');
const editSetMemoInput = $('editSetMemo');
const inputFormArea = $('inputFormArea');
const addRecordToggleBtn = $('addRecordToggleBtn');
const historyToggleBtn = $('historyToggleBtn');
const historyToggleText = $('historyToggleText');
const setListContainer = $('setListContainer');
const loadMoreIndicator = $('loadMoreIndicator');
const addSetBtn = $('addSetBtn');
const editTitleBtn = $('editTitleBtn');

// ==================== 탭 전환 ====================
function switchTab(tabName) {
    for (const k in tabs) tabs[k].classList.add('hidden');
    tabs[tabName].classList.remove('hidden');
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
    if (tabName === 'chart') { updateChartSelect(); updateChartPeriodButtons(); }
    else if (tabName === 'record') currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
    else if (tabName === 'settings') renderMain();
    else if (tabName === 'achievement') renderAchievements();
}
tabButtons.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

// ==================== View Mode ====================
function setViewMode(mode) {
    currentViewMode = mode;
    calendarViewBtn.classList.toggle('active', mode === 'calendar');
    listViewBtn.classList.toggle('active', mode === 'list');
    calendarView.classList.toggle('hidden', mode !== 'calendar');
    listView.classList.toggle('hidden', mode !== 'list');
    mode === 'calendar' ? renderCalendar() : renderFeedView();
}
calendarViewBtn.onclick = () => setViewMode('calendar');
listViewBtn.onclick = () => setViewMode('list');

// ==================== Calendar Touch ====================
let touchStartX = 0, touchEndX = 0;
calendarContainer.addEventListener('touchstart', e => { touchStartX = touchEndX = e.touches[0].clientX; }, { passive: true });
calendarContainer.addEventListener('touchmove', e => { touchEndX = e.touches[0].clientX; }, { passive: true });
calendarContainer.addEventListener('touchend', () => {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
        calendarMonth += diff < 0 ? 1 : -1;
        if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
        else if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
        selectFirstDayOfMonth();
    }
});

function selectFirstDayOfMonth() {
    selectedDate = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-01`;
    dayDetail.classList.add('hidden');
    renderCalendar();
}

// ==================== Month Picker ====================
let yearRangeStart = new Date().getFullYear() - 11;
let yearRangeEnd = new Date().getFullYear();

calendarTitleBtn.onclick = () => {
    pickerYear = calendarYear;
    yearRangeStart = Math.min(yearRangeStart, pickerYear - 2);
    yearRangeEnd = Math.max(yearRangeEnd, pickerYear);
    renderYearGrid();
    renderMonthPicker();
    monthPickerModal.classList.add('show');
    requestAnimationFrame(() => {
        const sel = yearGrid.querySelector('.year-btn.current');
        sel?.scrollIntoView({ block: 'center' });
    });
};

$('closeMonthPicker').onclick = () => monthPickerModal.classList.remove('show');
monthPickerModal.onclick = e => { if (e.target === monthPickerModal) monthPickerModal.classList.remove('show'); };

function renderYearGrid() {
    const html = [];
    for (let y = yearRangeEnd; y >= yearRangeStart; y--) {
        html.push(`<button class="year-btn${y === pickerYear ? ' current' : ''}" data-year="${y}">${y}년</button>`);
    }
    yearGrid.innerHTML = html.join('');
}

yearScrollContainer.onscroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = yearScrollContainer;
    const currentYear = new Date().getFullYear();
    if (scrollTop < 20 && yearRangeEnd < currentYear) {
        yearRangeEnd = Math.min(yearRangeEnd + 3, currentYear);
        renderYearGrid();
    }
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        yearRangeStart -= 3;
        renderYearGrid();
    }
};

yearGrid.onclick = e => {
    if (e.target.classList.contains('year-btn')) {
        pickerYear = +e.target.dataset.year;
        renderYearGrid();
        renderMonthPicker();
    }
};

function renderMonthPicker() {
    const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
    monthGrid.innerHTML = months.map((m, i) =>
        `<button class="month-btn${pickerYear === calendarYear && i === calendarMonth ? ' current' : ''}" data-month="${i}">${m}</button>`
    ).join('');
}

monthGrid.onclick = e => {
    if (e.target.classList.contains('month-btn')) {
        calendarYear = pickerYear;
        calendarMonth = +e.target.dataset.month;
        monthPickerModal.classList.remove('show');
        selectFirstDayOfMonth();
    }
};

// ==================== Calendar Rendering (최적화) ====================
function getExercisesForDate(dateStr) {
    const index = getRecordsByDateIndex();
    const dayRecords = index[dateStr];
    if (!dayRecords || !dayRecords.length) return [];

    const exerciseMap = {};
    for (let i = 0, len = dayRecords.length; i < len; i++) {
        const r = dayRecords[i];
        (exerciseMap[r.exerciseId] || (exerciseMap[r.exerciseId] = [])).push(r);
    }

    const result = [];
    const exercises = data.exercises;
    for (let i = 0, len = exercises.length; i < len; i++) {
        const ex = exercises[i];
        const recs = exerciseMap[ex.id];
        if (recs?.length) {
            result.push({
                id: ex.id,
                name: ex.name,
                color: ex.color || '#339af0',
                memo: ex.memo || '',
                sets: recs.length,
                records: recs
            });
        }
    }
    return result;
}

function getExerciseColorsForDate(dateStr) {
    const index = getRecordsByDateIndex();
    const dayRecords = index[dateStr];
    if (!dayRecords || !dayRecords.length) return [];

    const colors = [];
    const seen = new Set();
    for (let i = 0, len = dayRecords.length; i < len && colors.length < 4; i++) {
        const exId = dayRecords[i].exerciseId;
        if (!seen.has(exId)) {
            seen.add(exId);
            const ex = getExerciseById(exId);
            colors.push(ex?.color || '#339af0');
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

    const html = [];

    // 이전 달
    for (let i = startDay - 1; i >= 0; i--) {
        const day = prevLastDay - i;
        const date = new Date(year, month - 1, day);
        const dateStr = toDateStr(date);
        const colors = getExerciseColorsForDate(dateStr);
        const dow = (startDay - 1 - i) % 7;
        html.push(`<button class="calendar-day other-month${dow === 0 ? ' sunday' : dow === 6 ? ' saturday' : ''}" data-date="${dateStr}"><span class="day-number">${day}</span><div class="exercise-dots">${colors.map(c => `<span class="exercise-dot" style="background:${c}"></span>`).join('')}</div></button>`);
    }

    // 현재 달
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        const dateStr = toDateStr(date);
        const colors = getExerciseColorsForDate(dateStr);
        const dow = date.getDay();
        let cls = 'calendar-day';
        if (dateStr === today) cls += ' today';
        if (dateStr === selectedDate) cls += ' selected';
        if (dow === 0) cls += ' sunday';
        else if (dow === 6) cls += ' saturday';
        html.push(`<button class="${cls}" data-date="${dateStr}"><span class="day-number">${day}</span><div class="exercise-dots">${colors.map(c => `<span class="exercise-dot" style="background:${c}"></span>`).join('')}</div></button>`);
    }

    // 다음 달
    const totalCells = startDay + totalDays;
    const remaining = (Math.ceil(totalCells / 7) * 7) - totalCells;
    for (let day = 1; day <= remaining; day++) {
        const date = new Date(year, month + 1, day);
        const dateStr = toDateStr(date);
        const colors = getExerciseColorsForDate(dateStr);
        const dow = (startDay + totalDays + day - 1) % 7;
        html.push(`<button class="calendar-day other-month${dow === 0 ? ' sunday' : dow === 6 ? ' saturday' : ''}" data-date="${dateStr}"><span class="day-number">${day}</span><div class="exercise-dots">${colors.map(c => `<span class="exercise-dot" style="background:${c}"></span>`).join('')}</div></button>`);
    }

    container.innerHTML = html.join('');
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
    const hasRecords = exercises.length > 0;

    // 기록이 없으면 닫기 버튼 숨김
    $('closeDayDetail').classList.toggle('hidden', !hasRecords);

    dayExercises.innerHTML = hasRecords
        ? exercises.map(ex => `
            <div class="day-exercise-item" data-exercise-id="${ex.id}">
                <span class="color-dot" style="background:${ex.color}"></span>
                <div class="exercise-info">
                    <div class="exercise-name">${ex.name}</div>
                    <div class="exercise-sets">${ex.sets}세트</div>
                    ${ex.memo ? `<div class="exercise-memo">${ex.memo}</div>` : ''}
                </div>
                <button class="delete-btn" data-delete-id="${ex.id}">×</button>
            </div>
        `).join('')
        : '<div class="empty" style="padding:20px">기록이 없습니다</div>';

    dayDetail.classList.remove('hidden');
    renderCalendar();
}

$('prevMonth').onclick = () => {
    if (--calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
    selectFirstDayOfMonth();
};

$('nextMonth').onclick = () => {
    if (++calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
    selectFirstDayOfMonth();
};

$('todayBtn').onclick = () => {
    const now = new Date();
    calendarYear = now.getFullYear();
    calendarMonth = now.getMonth();
    showDayDetail(today);
};

calendarDays.onclick = e => {
    const btn = e.target.closest('.calendar-day');
    if (btn) showDayDetail(btn.dataset.date);
};

$('closeDayDetail').onclick = () => clearAllForDate(selectedDate);

function goToSettingsForAdd() {
    switchTab('settings');
}

$('dayAddBtn').onclick = () => goToSettingsForAdd();

function deleteExerciseForDate(exerciseId, dateStr) {
    const exercise = getExerciseById(exerciseId);
    const date = parseLocalDate(dateStr);
    if (!confirm(`"${exercise?.name || '운동'}" ${date.getMonth() + 1}월 ${date.getDate()}일 기록을 삭제할까요?`)) return;
    data.records = data.records.filter(r => !(r.exerciseId === exerciseId && r.datetime.slice(0, 10) === dateStr));
    save();
    showDayDetail(dateStr);
}

function clearAllForDate(dateStr) {
    const exercises = getExercisesForDate(dateStr);
    if (!exercises.length) { dayDetail.classList.add('hidden'); return; }
    const date = parseLocalDate(dateStr);
    const label = dateStr === today ? '오늘' : `${date.getMonth() + 1}월 ${date.getDate()}일`;
    if (!confirm(`${label}의 모든 운동 기록을 삭제할까요?\n(${exercises.map(e => e.name).join(', ')})`)) return;
    data.records = data.records.filter(r => r.datetime.slice(0, 10) !== dateStr);
    save();
    showDayDetail(dateStr);
}

dayExercises.onclick = e => {
    const del = e.target.closest('.delete-btn');
    if (del) { e.stopPropagation(); deleteExerciseForDate(del.dataset.deleteId, selectedDate); return; }
    const item = e.target.closest('.day-exercise-item');
    if (item) showDetailById(item.dataset.exerciseId, selectedDate);
};

// ==================== Feed View (최적화) ====================
function getAllRecordDates() {
    const index = getRecordsByDateIndex();
    return Object.keys(index).sort().reverse();
}

function formatDateKorean(dateStr) {
    const d = parseLocalDate(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${'일월화수목금토'[d.getDay()]})`;
}

function renderFeedView() {
    const dates = getAllRecordDates();
    const addBtn = `<div class="feed-add-today"><button class="feed-add-today-btn" data-date="${today}">+ 기록 추가</button></div>`;

    if (!dates.length) {
        feedView.innerHTML = addBtn + '<div class="empty">기록이 없습니다</div>';
        return;
    }

    const html = [addBtn];
    for (let i = 0, len = dates.length; i < len; i++) {
        const dateStr = dates[i];
        const exercises = getExercisesForDate(dateStr);
        const isToday = dateStr === today;
        html.push(`<div class="feed-day">
            <div class="feed-day-header">
                <span class="feed-day-date${isToday ? ' today' : ''}">${isToday ? '오늘' : formatDateKorean(dateStr)}</span>
                <button class="feed-day-add" data-date="${dateStr}">+</button>
            </div>
            <div class="feed-exercises">${exercises.map(ex => `
                <div class="feed-exercise" style="border-left-color:${ex.color}" data-exercise-id="${ex.id}" data-date="${dateStr}">
                    <div class="feed-exercise-header">
                        <span class="feed-exercise-color" style="background:${ex.color}"></span>
                        <span class="feed-exercise-name">${ex.name}</span>
                    </div>
                    ${ex.memo ? `<div class="feed-exercise-memo">${ex.memo}</div>` : ''}
                    <div class="feed-sets">${ex.records.map(r => `<span class="feed-set"><strong>${r.w}kg</strong> × ${r.r}${r.m ? ` (${r.m})` : ''}</span>`).join('')}</div>
                </div>`).join('')}
            </div>
        </div>`);
    }
    feedView.innerHTML = html.join('');
}

feedView.onclick = e => {
    const addToday = e.target.closest('.feed-add-today-btn');
    if (addToday) { selectedDate = addToday.dataset.date; goToSettingsForAdd(); return; }
    const add = e.target.closest('.feed-day-add');
    if (add) { selectedDate = add.dataset.date; goToSettingsForAdd(); return; }
    const ex = e.target.closest('.feed-exercise');
    if (ex) showDetailById(ex.dataset.exerciseId, ex.dataset.date);
};

// ==================== Exercise List ====================
function renderMain(searchQuery = '') {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === exerciseSortOrder);
    });

    if (!data.exercises.length) {
        exerciseList.innerHTML = '<div class="empty">운동을 추가하세요</div>';
        return;
    }

    let filtered = data.exercises;
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = data.exercises.filter(ex => ex.name.toLowerCase().includes(q));
    }

    let sorted = [...filtered];
    if (exerciseSortOrder === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko'));

    if (!sorted.length) {
        exerciseList.innerHTML = '<div class="empty">검색 결과가 없습니다</div>';
        return;
    }

    const index = getRecordsByDateIndex();
    const todayRecords = index[today] || [];
    const todayCounts = {};
    for (let i = 0, len = todayRecords.length; i < len; i++) {
        const exId = todayRecords[i].exerciseId;
        todayCounts[exId] = (todayCounts[exId] || 0) + 1;
    }

    exerciseList.innerHTML = sorted.map(ex => `
        <div class="list-item" data-id="${ex.id}" style="border-left-color:${ex.color}">
            <div style="display:flex;align-items:center">
                <div class="color-dot" style="background:${ex.color}"></div>
                <div>
                    <h3>${ex.name}</h3>
                    <span class="count">오늘 ${todayCounts[ex.id] || 0}세트</span>
                    ${ex.memo ? `<div class="item-memo">${ex.memo}</div>` : ''}
                </div>
            </div>
            <button class="delete-btn" data-id="${ex.id}">×</button>
        </div>
    `).join('');
}

$('sortToggle').onclick = e => {
    const btn = e.target.closest('.sort-btn');
    if (btn && btn.dataset.sort !== exerciseSortOrder) {
        exerciseSortOrder = btn.dataset.sort;
        save();
        renderMain();
    }
};

function renderDetail(filterDate = null) {
    const exIndex = getRecordsByExerciseIndex();
    const exerciseRecords = exIndex[currentExercise] || [];
    recordsByDate = {};

    for (let i = 0, len = exerciseRecords.length; i < len; i++) {
        const r = exerciseRecords[i];
        const d = r.datetime.slice(0, 10);
        if (filterDate && d !== filterDate) continue;
        (recordsByDate[d] || (recordsByDate[d] = [])).push({ ...r });
    }

    allSortedDates = Object.keys(recordsByDate).sort().reverse();
    recordsPage = 0;

    if (historyToggleText) {
        historyToggleText.textContent = isHistoryVisible ? `숨기기 (${exerciseRecords.length})` : `보기 (${exerciseRecords.length})`;
    }

    if (!allSortedDates.length) {
        setList.innerHTML = '<div class="empty">기록이 없습니다</div>';
        loadMoreIndicator.classList.add('hidden');
        return;
    }

    setList.innerHTML = '';
    loadMoreRecords();
}

function loadMoreRecords() {
    const startIdx = isFromCalendar ? 0 : recordsPage * RECORDS_PER_PAGE;
    const endIdx = isFromCalendar ? allSortedDates.length : startIdx + RECORDS_PER_PAGE;
    const dates = allSortedDates.slice(startIdx, endIdx);

    if (!dates.length) { loadMoreIndicator.classList.add('hidden'); return; }

    const html = [];
    for (let i = 0, len = dates.length; i < len; i++) {
        const date = dates[i];
        const sets = recordsByDate[date].sort((a, b) => a.datetime.localeCompare(b.datetime));
        html.push(`<div class="date-label">${date === today ? '오늘' : date}</div>`);
        for (let j = 0, slen = sets.length; j < slen; j++) {
            const s = sets[j];
            html.push(`<div class="set-item" data-id="${s.id}">
                <div class="set-item-row">
                    <span class="meta">[Set ${j + 1}]</span>
                    <span class="info"><strong>${s.w}kg</strong> x ${s.r}reps</span>
                    <button class="delete-btn" data-id="${s.id}">×</button>
                </div>
                ${s.m ? `<div class="set-memo">${s.m}</div>` : ''}
            </div>`);
        }
    }

    if (isFromCalendar) setList.innerHTML = html.join('');
    else { setList.insertAdjacentHTML('beforeend', html.join('')); recordsPage++; }

    loadMoreIndicator.classList.toggle('hidden', isFromCalendar || endIdx >= allSortedDates.length);
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

    if (exercise.memo) {
        exerciseMemoDisplay.textContent = exercise.memo;
        exerciseMemoDisplay.classList.remove('hidden');
    } else exerciseMemoDisplay.classList.add('hidden');

    dateInput.value = date || selectedDate || today;
    weightInput.value = repsInput.value = setMemoInput.value = '';

    if (date) {
        isHistoryVisible = true;
        isFromCalendar = true;
        inputFormArea.classList.add('hidden');
        addRecordToggleBtn.classList.remove('hidden');
        historyToggleBtn.classList.add('hidden');
        setListContainer.classList.remove('hidden');
        setListContainer.style.maxHeight = 'none';
    } else {
        isHistoryVisible = false;
        isFromCalendar = false;
        inputFormArea.classList.remove('hidden');
        addRecordToggleBtn.classList.add('hidden');
        historyToggleBtn.classList.remove('hidden');
        historyToggleBtn.classList.remove('active');
        setListContainer.classList.add('hidden');
        setListContainer.style.maxHeight = '';
    }

    renderDetail(date);
    updateAddSetBtnColor();
}

function showDetail(name, date = null) {
    const ex = getExerciseByName(name);
    if (ex) showDetailById(ex.id, date);
}

// ==================== Add Exercise ====================
function renderColorPicker() {
    const colors = getAvailableColors();
    colorPickerGrid.innerHTML = colors.map(c =>
        `<div class="color-option" data-color="${c}" style="background:${c}"></div>`
    ).join('') + (!isPremium ? `<div class="color-option premium-more" data-premium="true">+${PRESET_COLORS.length - LITE_COLORS.length}</div>` : '');
}
renderColorPicker();

let newExerciseColor = '#339af0';

function selectNewExerciseColor(color) {
    newExerciseColor = color;
    colorPreviewBtn.style.background = color;
    colorPickerGrid.querySelectorAll('.color-option').forEach(el =>
        el.classList.toggle('selected', el.dataset.color === color)
    );
}

colorPreviewBtn.onclick = () => colorPickerModal.classList.add('show');
$('closeColorPicker').onclick = () => colorPickerModal.classList.remove('show');
colorPickerModal.onclick = e => { if (e.target === colorPickerModal) colorPickerModal.classList.remove('show'); };

colorPickerGrid.onclick = e => {
    if (!e.target.classList.contains('color-option')) return;
    if (e.target.dataset.premium === 'true') { showUpgradePrompt('더 많은 색상'); return; }
    selectNewExerciseColor(e.target.dataset.color);
    colorPickerModal.classList.remove('show');
};

function openAddExercisePage() {
    if (!isPremium && data.exercises.length >= LITE_MAX_EXERCISES) {
        showUpgradePrompt(`운동 ${LITE_MAX_EXERCISES}개 이상 등록`);
        return;
    }
    newExerciseNameInput.value = newExerciseMemoInput.value = '';
    newExerciseColor = '#339af0';
    selectNewExerciseColor(newExerciseColor);
    colorPickerModal.classList.remove('show');
    tabs.settings.classList.add('hidden');
    addExercisePage.classList.remove('hidden');
}

function closeAddExercisePage() {
    addExercisePage.classList.add('hidden');
    tabs.settings.classList.remove('hidden');
}

function addExercise() {
    const name = newExerciseNameInput.value.trim();
    if (!name) { alert('운동 이름을 입력하세요'); return; }
    if (data.exercises.some(ex => ex.name === name)) { alert('이미 존재하는 운동입니다'); return; }
    if (!isPremium && data.exercises.length >= LITE_MAX_EXERCISES) {
        showUpgradePrompt(`운동 ${LITE_MAX_EXERCISES}개 이상 등록`);
        return;
    }
    data.exercises.push({
        id: String(Date.now()),
        name,
        color: newExerciseColor,
        memo: newExerciseMemoInput.value.trim()
    });
    save();
    renderMain();
    currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
    closeAddExercisePage();
}

$('openAddExercise').onclick = openAddExercisePage;
$('closeAddExercise').onclick = closeAddExercisePage;
$('submitAddExercise').onclick = addExercise;
newExerciseNameInput.onkeydown = e => { if (e.key === 'Enter') addExercise(); };
exerciseSearchInput.oninput = e => renderMain(e.target.value);

exerciseList.onclick = e => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        const ex = getExerciseById(id);
        if (!confirm(`"${ex?.name}" 운동을 삭제할까요?`)) return;
        data.exercises = data.exercises.filter(ex => ex.id !== id);
        data.records = data.records.filter(r => r.exerciseId !== id);
        save();
        renderMain();
        currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
        return;
    }
    const item = e.target.closest('.list-item');
    if (item) showDetailById(item.dataset.id);
};

$('backBtn').onclick = showMain;

// ==================== Title Edit ====================
let editContainer = null;

function startEditTitle() {
    if (editContainer) return;
    const exercise = getExerciseById(currentExercise);
    if (!exercise) return;
    const currentName = exercise.name;
    const header = detailTitle.parentElement;

    editContainer = document.createElement('div');
    editContainer.className = 'title-edit-container';
    editContainer.innerHTML = `
        <input type="text" class="title-input" value="${currentName}">
        <div class="title-edit-btns">
            <button class="title-save-btn">수정</button>
            <button class="title-cancel-btn">취소</button>
        </div>
    `;

    detailTitle.style.display = 'none';
    editTitleBtn.style.display = 'none';
    header.insertBefore(editContainer, detailTitle);

    const input = editContainer.querySelector('.title-input');
    input.focus();
    input.select();

    function finishEdit(shouldSave) {
        const newName = input.value.trim();
        editContainer.remove();
        editContainer = null;
        detailTitle.style.display = '';
        editTitleBtn.style.display = '';

        if (!shouldSave || !newName || newName === currentName) return;

        const existing = data.exercises.find(ex => ex.name === newName && ex.id !== currentExercise);
        if (existing) {
            if (confirm(`"${newName}" 이미 존재합니다. 합칠까요?`)) {
                data.records.forEach(r => { if (r.exerciseId === currentExercise) r.exerciseId = existing.id; });
                data.exercises = data.exercises.filter(ex => ex.id !== currentExercise);
                currentExercise = existing.id;
                detailTitle.textContent = newName;
                if (existing.memo) {
                    exerciseMemoDisplay.textContent = existing.memo;
                    exerciseMemoDisplay.classList.remove('hidden');
                } else {
                    exerciseMemoDisplay.classList.add('hidden');
                }
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

    editContainer.querySelector('.title-save-btn').onclick = () => finishEdit(true);
    editContainer.querySelector('.title-cancel-btn').onclick = () => finishEdit(false);
    input.onkeydown = e => {
        if (e.key === 'Enter') finishEdit(true);
        else if (e.key === 'Escape') finishEdit(false);
    };
}

editTitleBtn.onclick = startEditTitle;
detailTitle.onclick = startEditTitle;

function updateAddSetBtnColor() {
    if (!currentExercise) return;
    const ex = getExerciseById(currentExercise);
    const color = ex?.color || '#34c759';
    addSetBtn.style.background = color;
    addSetBtn.style.color = isLightColor(color) ? '#1d1d1f' : '#fff';
}

// ==================== Input Validation ====================
function sanitizeNumber(value, allowDecimal = false) {
    if (value == null || value === '') return '';
    let str = String(value).replace(/[^0-9.,-]/g, '').replace(',', '.');
    if (!allowDecimal) str = str.replace(/\./g, '');
    const parts = str.split('.');
    if (parts.length > 2) str = parts[0] + '.' + parts.slice(1).join('');
    return str.replace(/-/g, '');
}

function validateInput(input, allowDecimal = false) {
    input.oninput = () => {
        const pos = input.selectionStart;
        const before = input.value;
        input.value = sanitizeNumber(input.value, allowDecimal);
        if (before !== input.value) {
            input.selectionStart = input.selectionEnd = Math.max(0, pos - (before.length - input.value.length));
        }
    };
    input.onpaste = e => {
        e.preventDefault();
        input.value = sanitizeNumber((e.clipboardData || window.clipboardData).getData('text'), allowDecimal);
    };
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

    data.records.push({
        id: generateId(),
        datetime: createDatetime(d),
        exerciseId: currentExercise,
        w, r,
        m: m || null
    });
    save();
    renderDetail(isFromCalendar ? dateInput.value : null);
    currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
    weightInput.value = repsInput.value = setMemoInput.value = '';
    weightInput.focus();
}

addSetBtn.onclick = addSet;
weightInput.onkeydown = repsInput.onkeydown = e => { if (e.key === 'Enter') addSet(); };

addRecordToggleBtn.onclick = () => {
    inputFormArea.classList.remove('hidden');
    addRecordToggleBtn.classList.add('hidden');
    weightInput.focus();
};

historyToggleBtn.onclick = () => {
    isHistoryVisible = !isHistoryVisible;
    historyToggleBtn.classList.toggle('active', isHistoryVisible);
    setListContainer.classList.toggle('hidden', !isHistoryVisible);
    const total = (getRecordsByExerciseIndex()[currentExercise] || []).length;
    historyToggleText.textContent = isHistoryVisible ? `숨기기 (${total})` : `보기 (${total})`;
};

setListContainer.onscroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = setListContainer;
    if (scrollTop + clientHeight >= scrollHeight - 50) loadMoreRecords();
};

setList.onclick = e => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        const idx = data.records.findIndex(r => r.id === id);
        if (idx !== -1) {
            data.records.splice(idx, 1);
            save();
            renderDetail(isFromCalendar ? dateInput.value : null);
            currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
        }
        return;
    }
    const item = e.target.closest('.set-item');
    if (item) openEditSetModal(item.dataset.id);
};

// ==================== Set Edit Modal ====================
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
    if (r <= 0) { editRepsInput.focus(); return; }

    const record = data.records.find(r => r.id === editingSetId);
    if (record) {
        record.w = w;
        record.r = r;
        record.m = m || null;
        save();
        renderDetail(isFromCalendar ? dateInput.value : null);
        currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
    }
    closeEditSetModal();
}

$('closeSetEdit').onclick = closeEditSetModal;
$('cancelSetEdit').onclick = closeEditSetModal;
$('saveSetEdit').onclick = saveEditSet;
setEditModal.onclick = e => { if (e.target === setEditModal) closeEditSetModal(); };
validateInput(editWeightInput, true);
validateInput(editRepsInput, false);
