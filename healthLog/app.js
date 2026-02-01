const KEY = 'healthLog';
const today = new Date().toLocaleDateString('sv-SE');

// 프리미엄 vs 라이트 설정
let isPremium = true; // 기본값: 라이트

// 전체 색상 (프리미엄)
const PRESET_COLORS = [
    // 레드/핑크
    '#ff6b6b', '#fa5252', '#e64980', '#f06595', '#ff8787',
    // 퍼플/바이올렛
    '#cc5de8', '#be4bdb', '#845ef7', '#7950f2', '#9775fa',
    // 블루
    '#5c7cfa', '#4c6ef5', '#339af0', '#228be6', '#74c0fc',
    // 시안/틸
    '#22b8cf', '#15aabf', '#3bc9db', '#66d9e8', '#99e9f2',
    // 그린
    '#20c997', '#12b886', '#51cf66', '#40c057', '#8ce99a',
    // 라임/옐로우
    '#94d82d', '#82c91e', '#fab005', '#fcc419', '#ffe066',
    // 오렌지
    '#ff922b', '#fd7e14', '#f76707', '#e8590c', '#ffa94d',
    // 그레이
    '#868e96', '#495057', '#343a40', '#adb5bd', '#dee2e6'
];

// 라이트 색상 (10개 - 각 계열 대표)
const LITE_COLORS = [
    '#ff6b6b', // 레드
    '#cc5de8', // 퍼플
    '#339af0', // 블루
    '#20c997', // 시안/그린
    '#51cf66', // 그린
    '#fab005', // 옐로우
    '#ff922b', // 오렌지
    '#868e96', // 그레이
    '#e64980', // 핑크
    '#845ef7'  // 바이올렛
];

// 현재 사용 가능한 색상 반환
function getAvailableColors() {
    return isPremium ? PRESET_COLORS : LITE_COLORS;
}

// 프리미엄 기능 접근 시 업그레이드 안내
function showUpgradePrompt(featureName) {
    alert(`"${featureName}"은(는) 프리미엄 기능입니다.\n프리미엄으로 업그레이드하세요!`);
}

let stored = JSON.parse(localStorage.getItem(KEY) || '{}');
// stored에 isPremium이 명시적으로 있으면 그 값 사용, 없으면 기본값 유지
if (stored.isPremium !== undefined) {
    isPremium = stored.isPremium;
}

// 데이터 마이그레이션: 기존 구조 → 새 구조 (운동 ID 기반)
function migrateData(oldData) {
    if (!oldData.exercises || !oldData.records) {
        return { exercises: [], records: [], achievements: {} };
    }

    // 이미 새 구조인지 확인 (exercises가 객체 배열인지)
    const isNewStructure = Array.isArray(oldData.exercises) &&
                          oldData.exercises.length > 0 &&
                          typeof oldData.exercises[0] === 'object' &&
                          oldData.exercises[0].id;

    if (isNewStructure) {
        return {
            exercises: oldData.exercises,
            records: oldData.records,
            achievements: oldData.achievements || {}
        };
    }

    // 기존 구조 → 새 구조로 마이그레이션
    const baseTimestamp = Date.now();
    const newExercises = [];
    const exerciseIdMap = {}; // 운동 이름 → ID 매핑

    // 운동 목록을 객체 배열로 변환
    if (Array.isArray(oldData.exercises)) {
        oldData.exercises.forEach((name, idx) => {
            const id = String(baseTimestamp + idx);
            exerciseIdMap[name] = id;
            newExercises.push({
                id: id,
                name: name,
                color: (oldData.colors && oldData.colors[name]) || '#007aff',
                memo: (oldData.memos && oldData.memos[name]) || ''
            });
        });
    }

    // 기록 마이그레이션
    let newRecords = [];

    if (Array.isArray(oldData.records)) {
        // records가 이미 플랫 배열인 경우 (exercise → exerciseId 변환)
        newRecords = oldData.records.map(record => ({
            id: record.id,
            datetime: record.datetime,
            exerciseId: exerciseIdMap[record.exercise] || record.exercise,
            w: record.w,
            r: record.r,
            m: record.m || null
        }));
    } else {
        // records가 객체인 경우 (구 구조)
        let idCounter = 0;
        for (const exercise of (oldData.exercises || [])) {
            const exerciseRecords = oldData.records[exercise] || [];
            for (const record of exerciseRecords) {
                const datetime = `${record.d}T12:00:${String(idCounter % 60).padStart(2, '0')}`;
                newRecords.push({
                    id: `migrated_${idCounter++}`,
                    datetime: datetime,
                    exerciseId: exerciseIdMap[exercise],
                    w: record.w,
                    r: record.r,
                    m: record.m || null
                });
            }
        }
        newRecords.sort((a, b) => a.datetime.localeCompare(b.datetime));
    }

    return {
        exercises: newExercises,
        records: newRecords,
        achievements: oldData.achievements || {}
    };
}

// 헬퍼 함수: ID로 운동 조회
function getExerciseById(id) {
    return data.exercises.find(ex => ex.id === id);
}

// 헬퍼 함수: 이름으로 운동 조회
function getExerciseByName(name) {
    return data.exercises.find(ex => ex.name === name);
}

let data = migrateData(stored);
let currentExercise = null;
let selectedColor = '#007aff';
let selectedDate = today;
let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth();
let currentViewMode = 'calendar';
let isFromCalendar = false;
let pickerYear = calendarYear;
let exerciseSortOrder = stored.exerciseSortOrder || 'registered';

function save() {
    localStorage.setItem(KEY, JSON.stringify({ ...data, isPremium }));
}

// 프리미엄 토글 (테스트용 - 콘솔에서 togglePremium() 호출)
function togglePremium() {
    isPremium = !isPremium;
    save();
    updateTabButtons();
    renderColorPicker();
    if (typeof updateChartPeriodButtons === 'function') updateChartPeriodButtons();
    console.log(`프리미엄 모드: ${isPremium ? 'ON' : 'OFF'}`);
    return isPremium;
}

// 색상 밝기 계산 (밝으면 true)
function isLightColor(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150;
}

// 로컬 시간대로 날짜 파싱 (UTC 오프셋 문제 해결)
function parseLocalDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
}

// 로컬 날짜를 YYYY-MM-DD 문자열로 변환 (UTC 문제 방지)
function toDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// datetime에서 날짜만 추출
function getDateFromDatetime(datetime) {
    return datetime.split('T')[0];
}

// 현재 시간으로 datetime 생성
function createDatetime(dateStr = null) {
    const now = new Date();
    if (dateStr) {
        // 지정된 날짜 + 현재 시간
        const [y, m, d] = dateStr.split('-').map(Number);
        now.setFullYear(y, m - 1, d);
    }
    const y = now.getFullYear();
    const mo = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return `${y}-${mo}-${d}T${h}:${mi}:${s}`;
}

// 고유 ID 생성
function generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Tab Navigation
const tabs = { record: document.getElementById('recordTab'), chart: document.getElementById('chartTab'), timer: document.getElementById('timerTab'), achievement: document.getElementById('achievementTab'), settings: document.getElementById('settingsTab') };
const tabButtons = document.querySelectorAll('.tab-item');

function switchTab(tabName) {
    // 타이머 탭은 프리미엄 전용
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

// 타이머 탭 버튼 비활성화 표시
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
        // 오른쪽 스와이프 → 이전 월
        calendarMonth--;
        if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
        renderCalendar();
    } else if (diff < -50) {
        // 왼쪽 스와이프 → 다음 월
        calendarMonth++;
        if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
        renderCalendar();
    }
});

// Month Picker
const monthPickerModal = document.getElementById('monthPickerModal');
const calendarTitleBtn = document.getElementById('calendarTitleBtn');
const yearGrid = document.getElementById('yearGrid');
const yearScrollContainer = document.getElementById('yearScrollContainer');
const monthGrid = document.getElementById('monthGrid');

// 연도 범위 (현재 연도 기준 12개 표시, 9개 보이고 3개는 스크롤)
let yearRangeStart = new Date().getFullYear() - 11;
let yearRangeEnd = new Date().getFullYear();

calendarTitleBtn.addEventListener('click', () => {
    pickerYear = calendarYear;
    // 연도 범위 초기화 (현재 선택 연도 포함하도록)
    yearRangeStart = Math.min(yearRangeStart, pickerYear - 2);
    yearRangeEnd = Math.max(yearRangeEnd, pickerYear);
    renderYearGrid();
    renderMonthPicker();
    monthPickerModal.classList.add('show');
    // 선택된 연도로 스크롤
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

// 연도 스크롤 시 추가 로드 (무한 스크롤)
yearScrollContainer.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = yearScrollContainer;
    // 상단 끝 도달 시 미래 연도 추가 (현재 연도까지만)
    if (scrollTop < 20) {
        const currentYear = new Date().getFullYear();
        if (yearRangeEnd < currentYear) {
            yearRangeEnd = Math.min(yearRangeEnd + 3, currentYear);
            renderYearGrid();
        }
    }
    // 하단 끝 도달 시 과거 연도 추가
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
        renderCalendar();
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

    // 해당 날짜의 모든 기록 필터링
    const dayRecords = data.records.filter(r => getDateFromDatetime(r.datetime) === dateStr);

    for (const record of dayRecords) {
        if (!exerciseMap[record.exerciseId]) {
            exerciseMap[record.exerciseId] = [];
        }
        exerciseMap[record.exerciseId].push(record);
    }

    // exercises 순서대로 결과 구성
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

    // 필요한 줄 수만큼만 렌더링 (4~6줄)
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
    renderCalendar();
});
document.getElementById('nextMonth').addEventListener('click', () => {
    calendarMonth++;
    if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
    renderCalendar();
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

// 해당 날짜의 특정 운동 기록 삭제
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

// 해당 날짜의 모든 운동 기록 삭제
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
    // 삭제 버튼 클릭
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

// 색상 선택 그리드 렌더링
function renderColorPicker() {
    const colors = getAvailableColors();
    colorPickerGrid.innerHTML = colors.map(c =>
        `<div class="color-option" data-color="${c}" style="background:${c}"></div>`
    ).join('');

    // 프리미엄이 아니면 "더 많은 색상" 버튼 추가
    if (!isPremium) {
        colorPickerGrid.innerHTML += `<div class="color-option premium-more" data-premium="true">+${PRESET_COLORS.length - LITE_COLORS.length}</div>`;
    }
}

// 색상 선택 그리드 초기화
renderColorPicker();
let newExerciseColor = '#007aff';

function selectNewExerciseColor(color) {
    newExerciseColor = color;
    colorPreviewBtn.style.background = color;
    document.querySelectorAll('#colorPickerGrid .color-option').forEach(el => el.classList.toggle('selected', el.dataset.color === color));
}

// 색상 미리보기 버튼 클릭 시 팔레트 토글
colorPreviewBtn.addEventListener('click', () => {
    colorPickerDropdown.classList.toggle('hidden');
});

colorPickerGrid.addEventListener('click', e => {
    if (e.target.classList.contains('color-option')) {
        // 프리미엄 업그레이드 버튼 클릭
        if (e.target.dataset.premium === 'true') {
            showUpgradePrompt('더 많은 색상');
            return;
        }
        selectNewExerciseColor(e.target.dataset.color);
        colorPickerDropdown.classList.add('hidden');
    }
});

function renderMain(searchQuery = '') {
    // 정렬 토글 UI 업데이트
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === exerciseSortOrder);
    });

    if (data.exercises.length === 0) {
        exerciseList.innerHTML = '<div class="empty">운동을 추가하세요</div>';
        return;
    }

    // 검색 필터 적용
    let filteredExercises = data.exercises;
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredExercises = data.exercises.filter(ex => ex.name.toLowerCase().includes(query));
    }

    // 정렬 적용
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

// 정렬 토글 이벤트
document.getElementById('sortToggle').addEventListener('click', e => {
    const btn = e.target.closest('.sort-btn');
    if (btn && btn.dataset.sort !== exerciseSortOrder) {
        exerciseSortOrder = btn.dataset.sort;
        stored.exerciseSortOrder = exerciseSortOrder;
        localStorage.setItem(KEY, JSON.stringify({ ...data, exerciseSortOrder }));
        renderMain();
    }
});

// 기록 페이지네이션 상태
let recordsPage = 0;
const RECORDS_PER_PAGE = 20;
let allSortedDates = [];
let recordsByDate = {};
let isHistoryVisible = false;

function renderDetail(filterDate = null) {
    // 현재 운동의 기록만 필터링 (currentExercise는 이제 ID)
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

    // 기록 개수 표시
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

    // 첫 페이지 렌더링
    setList.innerHTML = '';
    loadMoreRecords();
}

function loadMoreRecords() {
    // 캘린더에서 접근 시 전체 표시, 아니면 페이지네이션
    const startIdx = isFromCalendar ? 0 : recordsPage * RECORDS_PER_PAGE;
    const endIdx = isFromCalendar ? allSortedDates.length : startIdx + RECORDS_PER_PAGE;
    const datesToRender = allSortedDates.slice(startIdx, endIdx);

    if (datesToRender.length === 0) {
        document.getElementById('loadMoreIndicator').classList.add('hidden');
        return;
    }

    const html = datesToRender.map(date => {
        const sets = recordsByDate[date];
        // 시간순 정렬
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

    // 캘린더에서는 더보기 항상 숨김
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

// ID 기반 상세 보기
function showDetailById(id, date = null) {
    const exercise = getExerciseById(id);
    if (!exercise) return;

    currentExercise = id; // 이제 ID를 저장
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

    // 캘린더에서 접근 시: 입력 폼 숨김, 기록 바로 표시
    // 운동관리에서 접근 시: 입력 폼 보임, 기록 숨김
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

// 이름 기반 상세 보기 (호환성)
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

// 운동 추가 페이지 열기
function openAddExercisePage() {
    newExerciseNameInput.value = '';
    newExerciseMemoInput.value = '';
    newExerciseColor = '#007aff';
    selectNewExerciseColor(newExerciseColor);
    colorPickerDropdown.classList.add('hidden');
    tabs.settings.classList.add('hidden');
    addExercisePage.classList.remove('hidden');
}

// 운동 추가 페이지 닫기
function closeAddExercisePage() {
    addExercisePage.classList.add('hidden');
    tabs.settings.classList.remove('hidden');
}

// 운동 추가 실행
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

// 검색 기능
exerciseSearchInput.addEventListener('input', e => {
    renderMain(e.target.value);
});

exerciseList.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        const exercise = getExerciseById(id);
        if (!confirm(`"${exercise?.name}" 운동을 삭제할까요?`)) return;
        data.exercises = data.exercises.filter(ex => ex.id !== id);
        // 해당 운동의 모든 기록 삭제
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

const editTitleBtn = document.getElementById('editTitleBtn');
let editContainer = null;

function startEditTitle() {
    if (editContainer) return; // 이미 편집 중

    const exercise = getExerciseById(currentExercise);
    if (!exercise) return;
    const currentName = exercise.name;
    const header = detailTitle.parentElement;

    // 편집 컨테이너 생성
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
                // 현재 운동의 기록을 기존 운동으로 이동
                data.records.forEach(r => {
                    if (r.exerciseId === currentExercise) r.exerciseId = existingExercise.id;
                });
                // 현재 운동 삭제
                data.exercises = data.exercises.filter(ex => ex.id !== currentExercise);
                currentExercise = existingExercise.id;
                detailTitle.textContent = newName;
                exerciseMemo.value = existingExercise.memo || '';
                save();
                renderDetail();
                updateAddSetBtnColor();
            }
        } else {
            // 이름만 변경 (ID는 유지)
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

// Add Set 버튼 색상을 운동 색상으로 변경
function updateAddSetBtnColor() {
    if (!currentExercise) return;
    const exercise = getExerciseById(currentExercise);
    const color = exercise?.color || '#34c759';
    const addSetBtn = document.getElementById('addSetBtn');
    addSetBtn.style.background = color;
    addSetBtn.style.color = isLightColor(color) ? '#1d1d1f' : '#fff';
}

// Validation 헬퍼
function sanitizeNumber(value, allowDecimal = false) {
    if (value === '' || value === null || value === undefined) return '';
    let str = String(value).replace(/[^0-9.,-]/g, '').replace(',', '.');
    if (!allowDecimal) str = str.replace(/\./g, '');
    // 첫 번째 점만 유지
    const parts = str.split('.');
    if (parts.length > 2) str = parts[0] + '.' + parts.slice(1).join('');
    // 음수 제거 (맨 앞 - 제거)
    str = str.replace(/-/g, '');
    return str;
}

function validateInput(input, allowDecimal = false) {
    input.addEventListener('input', () => {
        const pos = input.selectionStart;
        const before = input.value;
        input.value = sanitizeNumber(input.value, allowDecimal);
        // 커서 위치 유지
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

// 무게: 소수점 허용, 횟수: 정수만
validateInput(weightInput, true);
validateInput(repsInput, false);

function addSet() {
    const d = dateInput.value || today;
    const wRaw = sanitizeNumber(weightInput.value, true);
    const rRaw = sanitizeNumber(repsInput.value, false);
    const w = wRaw === '' ? 0 : parseFloat(wRaw);
    const r = rRaw === '' ? 0 : parseInt(rRaw);
    const m = setMemoInput.value.trim();

    // validation
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

// 캘린더에서 접근 시 "기록 추가" 버튼 클릭 → 입력 폼 표시
document.getElementById('addRecordToggleBtn').addEventListener('click', () => {
    document.getElementById('inputFormArea').classList.remove('hidden');
    document.getElementById('addRecordToggleBtn').classList.add('hidden');
    weightInput.focus();
});

// 기록 토글 버튼
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

// 기록 무한 스크롤
setListContainer.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = setListContainer;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
        loadMoreRecords();
    }
});

setList.addEventListener('click', e => {
    // 삭제 버튼
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
    // 편집 버튼
    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        openEditSetModal(id);
        return;
    }
});

// 세트 편집 모달
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

// Chart
const chartSelect = document.getElementById('chartExerciseSelect');
const chartContent = document.getElementById('chartContent');
const chartEmpty = document.getElementById('chartEmpty');
const weightChart = document.getElementById('weightChart');
const volumeChart = document.getElementById('volumeChart');
const chartPeriodBtns = document.querySelectorAll('.chart-period-btn');
const chartCustomDate = document.getElementById('chartCustomDate');
const chartStartDate = document.getElementById('chartStartDate');
const chartEndDate = document.getElementById('chartEndDate');

let currentChartPeriod = 'week';

function updateChartSelect() {
    chartSelect.innerHTML = '<option value="">운동을 선택하세요</option>' + data.exercises.map(ex => `<option value="${ex.id}">${ex.name}</option>`).join('');
}

function getDateRange(period) {
    const now = new Date();
    const endDate = new Date(now);
    let startDate = new Date(now);

    switch(period) {
        case 'week':
            // 이번 주 월요일부터
            const day = now.getDay();
            const diff = day === 0 ? 6 : day - 1;
            startDate.setDate(now.getDate() - diff);
            break;
        case '1month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        case '3month':
            startDate.setMonth(now.getMonth() - 3);
            break;
        case '6month':
            startDate.setMonth(now.getMonth() - 6);
            break;
        case '1year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        case 'custom':
            if (chartStartDate.value && chartEndDate.value) {
                return {
                    start: chartStartDate.value,
                    end: chartEndDate.value
                };
            }
            // 커스텀이지만 날짜 미선택시 최근 1개월
            startDate.setMonth(now.getMonth() - 1);
            break;
    }

    return {
        start: startDate.toLocaleDateString('sv-SE'),
        end: endDate.toLocaleDateString('sv-SE')
    };
}

// 라이트 유저가 사용 가능한 차트 기간
const LITE_CHART_PERIODS = ['week', '1month'];

chartPeriodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const period = btn.dataset.period;

        // 라이트 유저는 week, 1month만 허용
        if (!isPremium && !LITE_CHART_PERIODS.includes(period)) {
            showUpgradePrompt('확장 차트 기간');
            return;
        }

        chartPeriodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentChartPeriod = period;

        if (currentChartPeriod === 'custom') {
            chartCustomDate.classList.add('show');
            // 기본값 설정 (최근 1개월)
            if (!chartStartDate.value || !chartEndDate.value) {
                const now = new Date();
                chartEndDate.value = now.toLocaleDateString('sv-SE');
                const monthAgo = new Date(now);
                monthAgo.setMonth(now.getMonth() - 1);
                chartStartDate.value = monthAgo.toLocaleDateString('sv-SE');
            }
        } else {
            chartCustomDate.classList.remove('show');
        }

        if (chartSelect.value) {
            renderCharts(chartSelect.value);
        }
    });
});

// 차트 탭 진입 시 프리미엄 전용 버튼 비활성화 표시
function updateChartPeriodButtons() {
    chartPeriodBtns.forEach(btn => {
        const period = btn.dataset.period;
        if (!isPremium && !LITE_CHART_PERIODS.includes(period)) {
            btn.classList.add('premium-locked');
        } else {
            btn.classList.remove('premium-locked');
        }
    });
}

chartStartDate.addEventListener('change', () => {
    if (chartSelect.value && currentChartPeriod === 'custom') {
        renderCharts(chartSelect.value);
    }
});

chartEndDate.addEventListener('change', () => {
    if (chartSelect.value && currentChartPeriod === 'custom') {
        renderCharts(chartSelect.value);
    }
});

chartSelect.addEventListener('change', () => {
    const exerciseId = chartSelect.value;
    if (!exerciseId) { chartContent.classList.add('hidden'); chartEmpty.classList.remove('hidden'); return; }
    chartContent.classList.remove('hidden');
    chartEmpty.classList.add('hidden');
    renderCharts(exerciseId);
});

function renderCharts(exerciseId) {
    const records = data.records.filter(r => r.exerciseId === exerciseId);
    if (records.length === 0) { chartContent.classList.add('hidden'); chartEmpty.textContent = '기록이 없습니다'; chartEmpty.classList.remove('hidden'); return; }

    const range = getDateRange(currentChartPeriod);

    const byDate = {};
    records.forEach(r => {
        const dateStr = getDateFromDatetime(r.datetime);
        if (dateStr >= range.start && dateStr <= range.end) {
            if (!byDate[dateStr]) byDate[dateStr] = [];
            byDate[dateStr].push(r);
        }
    });
    const dates = Object.keys(byDate).sort();

    if (dates.length === 0) {
        chartContent.classList.add('hidden');
        chartEmpty.textContent = '선택한 기간에 기록이 없습니다';
        chartEmpty.classList.remove('hidden');
        return;
    }

    chartContent.classList.remove('hidden');
    chartEmpty.classList.add('hidden');

    const chartData = dates.map(date => {
        const dayRecords = byDate[date];
        return {
            date,
            maxWeight: Math.max(...dayRecords.map(r => r.w)),
            totalVolume: dayRecords.reduce((sum, r) => sum + (r.w * r.r), 0)
        };
    });

    renderWeightChart(chartData);
    renderVolumeChart(chartData);
}

function formatDateShort(dateStr) { const d = parseLocalDate(dateStr); return `${d.getMonth() + 1}/${d.getDate()}`; }

function renderWeightChart(chartData) {
    if (chartData.length === 0) { weightChart.innerHTML = '<div class="empty">데이터 없음</div>'; return; }
    const maxWeight = Math.max(...chartData.map(d => d.maxWeight));
    const minWeight = Math.min(...chartData.map(d => d.maxWeight));
    const range = maxWeight - minWeight || 1;
    const padding = 12;
    const points = chartData.map((d, i) => ({
        x: padding + (i / (chartData.length - 1 || 1)) * (100 - padding * 2),
        y: padding + (100 - padding * 2) - ((d.maxWeight - minWeight) / range) * (100 - padding * 2)
    }));

    // 부드러운 곡선 생성 (Catmull-Rom spline)
    function catmullRomSpline(points) {
        if (points.length < 2) return '';
        if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[Math.max(i - 1, 0)];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[Math.min(i + 2, points.length - 1)];

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    }

    const pathD = catmullRomSpline(points);
    const areaD = pathD + ` L ${points[points.length - 1].x} ${100 - padding} L ${padding} ${100 - padding} Z`;

    weightChart.innerHTML = `
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#007aff;stop-opacity:0.25"/>
                    <stop offset="100%" style="stop-color:#007aff;stop-opacity:0.02"/>
                </linearGradient>
                <linearGradient id="lineStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#5ac8fa"/>
                    <stop offset="50%" style="stop-color:#007aff"/>
                    <stop offset="100%" style="stop-color:#5856d6"/>
                </linearGradient>
            </defs>
            <path class="line-area" d="${areaD}"/>
            <path class="line-path" d="${pathD}"/>
            ${points.map((p, i) => `<circle class="line-dot" cx="${p.x}" cy="${p.y}" r="3.5" data-value="${chartData[i].maxWeight}kg"/>`).join('')}
        </svg>
        <div class="line-labels">
            <span class="line-label">${formatDateShort(chartData[0].date)}<br><strong>${chartData[0].maxWeight}kg</strong></span>
            <span class="line-label">${formatDateShort(chartData[chartData.length - 1].date)}<br><strong>${chartData[chartData.length - 1].maxWeight}kg</strong></span>
        </div>
    `;
}

function renderVolumeChart(chartData) {
    if (chartData.length === 0) { volumeChart.innerHTML = '<div class="empty">데이터 없음</div>'; return; }
    const maxVolume = Math.max(...chartData.map(d => d.totalVolume));
    const barHeight = 120;

    volumeChart.innerHTML = chartData.map((d, i) => {
        const heightPx = Math.max(4, (d.totalVolume / maxVolume) * barHeight);
        return `
            <div class="bar-item" data-index="${i}">
                <div class="bar-wrapper">
                    <span class="bar-value">${d.totalVolume >= 1000 ? (d.totalVolume / 1000).toFixed(1) + 'k' : d.totalVolume}</span>
                    <div class="bar" style="height: ${heightPx}px"></div>
                </div>
                <span class="bar-label">${formatDateShort(d.date)}</span>
            </div>
        `;
    }).join('');

    // 최신 날짜가 보이도록 오른쪽 끝으로 스크롤
    volumeChart.scrollLeft = volumeChart.scrollWidth;
}

// Timer
let timerDuration = 60, timerRemaining = 60, timerInterval = null, timerRunning = false;
const timerDisplay = document.getElementById('timerDisplay');
const timerStatus = document.getElementById('timerStatus');
const timerToggle = document.getElementById('timerToggle');
const timerReset = document.getElementById('timerReset');
const timerProgressBar = document.getElementById('timerProgressBar');
const presetBtns = document.querySelectorAll('.preset-btn');
const customTimeInput = document.getElementById('customTime');
const setCustomTimeBtn = document.getElementById('setCustomTime');

function formatTime(seconds) { return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`; }
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timerRemaining);
    timerProgressBar.style.strokeDashoffset = 283 * (1 - timerRemaining / timerDuration);
}

function setTimerFn(seconds) {
    timerDuration = seconds;
    timerRemaining = seconds;
    timerRunning = false;
    clearInterval(timerInterval);
    timerToggle.textContent = '시작';
    timerToggle.classList.remove('pause');
    timerToggle.classList.add('start');
    timerStatus.textContent = '준비';
    updateTimerDisplay();
}

function startTimer() {
    if (timerRemaining <= 0) timerRemaining = timerDuration;
    timerRunning = true;
    timerToggle.textContent = '일시정지';
    timerToggle.classList.remove('start');
    timerToggle.classList.add('pause');
    timerStatus.textContent = '진행 중';

    timerInterval = setInterval(() => {
        timerRemaining--;
        updateTimerDisplay();
        if (timerRemaining <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            timerToggle.textContent = '시작';
            timerToggle.classList.remove('pause');
            timerToggle.classList.add('start');
            timerStatus.textContent = '완료!';
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = 800;
                gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.5);
            } catch (e) {}
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerToggle.textContent = '계속';
    timerToggle.classList.remove('pause');
    timerToggle.classList.add('start');
    timerStatus.textContent = '일시정지';
}

timerToggle.addEventListener('click', () => timerRunning ? pauseTimer() : startTimer());
timerReset.addEventListener('click', () => setTimerFn(timerDuration));
presetBtns.forEach(btn => btn.addEventListener('click', () => {
    presetBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setTimerFn(parseInt(btn.dataset.time));
}));
setCustomTimeBtn.addEventListener('click', () => {
    const time = parseInt(customTimeInput.value);
    if (time > 0) { presetBtns.forEach(b => b.classList.remove('active')); setTimerFn(time); customTimeInput.value = ''; }
});
customTimeInput.addEventListener('keydown', e => { if (e.key === 'Enter') setCustomTimeBtn.click(); });
validateInput(customTimeInput, false);

// 해시 기반 라우팅
let isNavigating = false;

function getHash() {
    return location.hash.slice(1) || 'record';
}

function navigate(path, replace = false) {
    if (isNavigating) return;
    const newHash = '#' + path;
    if (location.hash === newHash) return;
    if (replace) {
        history.replaceState(null, '', newHash);
    } else {
        history.pushState(null, '', newHash);
    }
}

function handleRoute() {
    isNavigating = true;
    const hash = getHash();
    const parts = hash.split('/');
    const route = parts[0];

    // 모달/패널 닫기
    dayDetail.classList.add('hidden');
    monthPickerModal.classList.remove('show');
    addExercisePage.classList.add('hidden');

    if (route === 'detail' && parts[1]) {
        const exerciseIdOrName = decodeURIComponent(parts[1]);
        const date = parts[2] || null;
        // ID 또는 이름으로 운동 찾기
        let exercise = getExerciseById(exerciseIdOrName) || getExerciseByName(exerciseIdOrName);
        if (exercise) {
            // 탭은 record로
            Object.values(tabs).forEach(t => t.classList.add('hidden'));
            tabs.record.classList.remove('hidden');
            tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'record'));
            // 상세 페이지 표시
            currentExercise = exercise.id;
            detailTitle.textContent = exercise.name;
            mainPage.classList.add('hidden');
            detailPage.classList.remove('hidden');
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

            // 캘린더에서 접근 시: 입력 폼 숨김, 기록 바로 표시
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
        } else {
            navigate('record', true);
            isNavigating = false;
            handleRoute();
            return;
        }
    } else if (route === 'chart') {
        Object.values(tabs).forEach(t => t.classList.add('hidden'));
        tabs.chart.classList.remove('hidden');
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'chart'));
        updateChartSelect();
    } else if (route === 'timer') {
        Object.values(tabs).forEach(t => t.classList.add('hidden'));
        tabs.timer.classList.remove('hidden');
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'timer'));
    } else if (route === 'achievement') {
        Object.values(tabs).forEach(t => t.classList.add('hidden'));
        tabs.achievement.classList.remove('hidden');
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'achievement'));
        renderAchievements();
    } else if (route === 'settings') {
        Object.values(tabs).forEach(t => t.classList.add('hidden'));
        tabs.settings.classList.remove('hidden');
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'settings'));
        renderMain();
    } else {
        // record (기본)
        Object.values(tabs).forEach(t => t.classList.add('hidden'));
        tabs.record.classList.remove('hidden');
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'record'));
        mainPage.classList.remove('hidden');
        detailPage.classList.add('hidden');
        currentExercise = null;
        renderMain();
        currentViewMode === 'calendar' ? renderCalendar() : renderFeedView();
    }
    isNavigating = false;
}

window.addEventListener('popstate', handleRoute);

// 기존 함수들 수정 - navigate 호출 추가
const originalSwitchTab = switchTab;
switchTab = function(tabName) {
    if (tabName === 'record') {
        navigate('record');
    } else {
        navigate(tabName);
    }
    handleRoute();
};

const originalShowMain = showMain;
showMain = function() {
    navigate('record');
    handleRoute();
};

const originalShowDetailById = showDetailById;
showDetailById = function(id, date = null) {
    selectedDate = date || selectedDate || today;
    if (date) {
        navigate(`detail/${encodeURIComponent(id)}/${date}`);
    } else {
        navigate(`detail/${encodeURIComponent(id)}`);
    }
    handleRoute();
};

// showDetail은 이름으로 ID를 찾아서 showDetailById 호출
const originalShowDetail = showDetail;
showDetail = function(name, date = null) {
    const exercise = getExerciseByName(name);
    if (exercise) showDetailById(exercise.id, date);
};

// 탭 버튼 이벤트 재설정
tabButtons.forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
});

// 뒤로가기 버튼
document.getElementById('backBtn').onclick = () => {
    history.back();
};

// ==================== 업적 시스템 ====================
const ACHIEVEMENTS = [
    // 일회성 업적
    { id: 'firstRecord', title: '시작이 반', desc: '첫 운동 기록', icon: '🎯', type: 'once' },
    { id: 'first3days', title: '작심삼일극복', desc: '앱 등록 후 연속 3일 기록', icon: '🔥', type: 'once' },
    { id: 'total50', title: '오십보백보', desc: '총 50일 기록 달성', icon: '👟', type: 'once' },
    { id: 'total100', title: '백전백승', desc: '총 100일 기록 달성', icon: '💯', type: 'once' },
    // 반복형 업적 - 출석
    { id: 'week3', title: '주 3회', desc: '한 주에 3일 이상 운동 (4주 연속)', icon: '📅', type: 'repeat' },
    { id: 'week5', title: '주5일제', desc: '한 주에 5일 운동', icon: '📆', type: 'repeat' },
    { id: 'week7', title: '체육관관장님?', desc: '한 주에 7일 운동', icon: '🏆', type: 'repeat' },
    // 반복형 업적 - 볼륨 (주) - 등급별
    { id: 'volumeUpWeek1', title: '볼륨업 (3등급)', desc: '전주 대비 볼륨 1% 증가', icon: '📈', type: 'repeat' },
    { id: 'volumeUpWeek3', title: '볼륨업 (2등급)', desc: '전주 대비 볼륨 3% 증가', icon: '📈', type: 'repeat' },
    { id: 'volumeUpWeek5', title: '볼륨업 (1등급)', desc: '전주 대비 볼륨 5% 증가', icon: '📈', type: 'repeat' },
    { id: 'volumeUpWeek10', title: '볼륨업 (0등급)', desc: '전주 대비 볼륨 10% 증가', icon: '📈', type: 'repeat' },
    // 반복형 업적 - 볼륨 (월) - 등급별
    { id: 'volumeUpMonth1', title: '메가볼륨 (3등급)', desc: '전월 대비 볼륨 1% 증가', icon: '🚀', type: 'repeat' },
    { id: 'volumeUpMonth3', title: '메가볼륨 (2등급)', desc: '전월 대비 볼륨 3% 증가', icon: '🚀', type: 'repeat' },
    { id: 'volumeUpMonth5', title: '메가볼륨 (1등급)', desc: '전월 대비 볼륨 5% 증가', icon: '🚀', type: 'repeat' },
    { id: 'volumeUpMonth10', title: '메가볼륨 (0등급)', desc: '전월 대비 볼륨 10% 증가', icon: '🚀', type: 'repeat' },
    // 반복형 업적 - 무게 (주) - 등급별
    { id: 'heavyWeek1', title: '웨이팅 (3등급)', desc: '전주 대비 무게 1% 증가', icon: '🏋️', type: 'repeat' },
    { id: 'heavyWeek3', title: '웨이팅 (2등급)', desc: '전주 대비 무게 3% 증가', icon: '🏋️', type: 'repeat' },
    { id: 'heavyWeek5', title: '웨이팅 (1등급)', desc: '전주 대비 무게 5% 증가', icon: '🏋️', type: 'repeat' },
    { id: 'heavyWeek10', title: '웨이팅 (0등급)', desc: '전주 대비 무게 10% 증가', icon: '🏋️', type: 'repeat' },
    // 반복형 업적 - 무게 (월) - 등급별
    { id: 'heavyMonth1', title: '슈퍼웨이팅 (3등급)', desc: '전월 대비 무게 1% 증가', icon: '💪', type: 'repeat' },
    { id: 'heavyMonth3', title: '슈퍼웨이팅 (2등급)', desc: '전월 대비 무게 3% 증가', icon: '💪', type: 'repeat' },
    { id: 'heavyMonth5', title: '슈퍼웨이팅 (1등급)', desc: '전월 대비 무게 5% 증가', icon: '💪', type: 'repeat' },
    { id: 'heavyMonth10', title: '슈퍼웨이팅 (0등급)', desc: '전월 대비 무게 10% 증가', icon: '💪', type: 'repeat' },
    // 반대 미션 - 휴식
    { id: 'rest1week', title: '언제까지 회복기간?', desc: '1주일 기록 없음', icon: '😴', type: 'repeat' },
    { id: 'rest1month', title: '지금은 휴가중', desc: '한 달 기록 없음', icon: '🏖️', type: 'repeat' },
    { id: 'rest3month', title: '동면시간?', desc: '3달 기록 없음', icon: '🐻', type: 'repeat' },
];

// 업적 달성 데이터 초기화
if (!data.achievements) data.achievements = {};

function getAllRecordDatesForAchievements() {
    const dates = new Set();
    for (const record of data.records) {
        dates.add(getDateFromDatetime(record.datetime));
    }
    return [...dates].sort();
}

function getWeekDates(date) {
    const d = parseLocalDate(date);
    const day = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const curr = new Date(start);
        curr.setDate(start.getDate() + i);
        dates.push(toDateStr(curr));
    }
    return dates;
}

function getWeekVolume(weekDates) {
    let total = 0;
    for (const record of data.records) {
        const dateStr = getDateFromDatetime(record.datetime);
        if (weekDates.includes(dateStr)) {
            total += (record.w || 0) * (record.r || 0);
        }
    }
    return total;
}

function getWeekWeight(weekDates) {
    let total = 0, count = 0;
    for (const record of data.records) {
        const dateStr = getDateFromDatetime(record.datetime);
        if (weekDates.includes(dateStr) && record.w > 0) {
            total += record.w;
            count++;
        }
    }
    return count > 0 ? total / count : 0;
}

function getMonthVolume(year, month) {
    let total = 0;
    for (const record of data.records) {
        const d = parseLocalDate(getDateFromDatetime(record.datetime));
        if (d.getFullYear() === year && d.getMonth() === month) {
            total += (record.w || 0) * (record.r || 0);
        }
    }
    return total;
}

function getMonthWeight(year, month) {
    let total = 0, count = 0;
    for (const record of data.records) {
        const d = parseLocalDate(getDateFromDatetime(record.datetime));
        if (d.getFullYear() === year && d.getMonth() === month && record.w > 0) {
            total += record.w;
            count++;
        }
    }
    return count > 0 ? total / count : 0;
}

function checkAchievements() {
    if (!data.achievements) data.achievements = {};
    const allDates = getAllRecordDatesForAchievements();
    const totalDays = allDates.length;

    // 헬퍼: 반복 업적 추가
    function addRepeatAchievement(id, key, keyType = 'weeks') {
        if (!data.achievements[id]) data.achievements[id] = { count: 0, [keyType]: [] };
        if (!data.achievements[id][keyType].includes(key)) {
            data.achievements[id].count++;
            data.achievements[id][keyType].push(key);
        }
    }

    // 시작이 반: 첫 기록
    if (!data.achievements.firstRecord && totalDays >= 1) {
        data.achievements.firstRecord = { count: 1, date: allDates[0] };
    }

    // 작심삼일극복: 처음 3일 연속
    if (!data.achievements.first3days && allDates.length >= 3) {
        let consecutive = true;
        for (let i = 1; i < 3; i++) {
            const prev = parseLocalDate(allDates[i-1]);
            const curr = parseLocalDate(allDates[i]);
            const diff = (curr - prev) / (1000 * 60 * 60 * 24);
            if (diff !== 1) { consecutive = false; break; }
        }
        if (consecutive) data.achievements.first3days = { count: 1, date: today };
    }

    // 오십보백보: 50일 기록
    if (!data.achievements.total50 && totalDays >= 50) {
        data.achievements.total50 = { count: 1, date: today };
    }

    // 백전백승: 100일 기록
    if (!data.achievements.total100 && totalDays >= 100) {
        data.achievements.total100 = { count: 1, date: today };
    }

    // 주간 업적 체크 (현재 주 기준)
    const thisWeek = getWeekDates(today);
    const lastWeekStart = new Date(parseLocalDate(today));
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeek = getWeekDates(toDateStr(lastWeekStart));

    const thisWeekDays = allDates.filter(d => thisWeek.includes(d)).length;
    const weekKey = thisWeek[0];

    // 주 3회 (4주 연속 체크)
    let week3Consecutive = 0;
    for (let w = 0; w < 4; w++) {
        const checkWeekStart = new Date(parseLocalDate(today));
        checkWeekStart.setDate(checkWeekStart.getDate() - (w * 7));
        const checkWeek = getWeekDates(toDateStr(checkWeekStart));
        const checkWeekDays = allDates.filter(d => checkWeek.includes(d)).length;
        if (checkWeekDays >= 3) week3Consecutive++;
        else break;
    }
    if (week3Consecutive >= 4) {
        addRepeatAchievement('week3', weekKey);
    }

    // 주5일제
    if (thisWeekDays >= 5) addRepeatAchievement('week5', weekKey);

    // 체육관관장님?
    if (thisWeekDays >= 7) addRepeatAchievement('week7', weekKey);

    // 볼륨 (주)
    const thisWeekVol = getWeekVolume(thisWeek);
    const lastWeekVol = getWeekVolume(lastWeek);
    if (lastWeekVol > 0) {
        const volRatio = thisWeekVol / lastWeekVol;
        if (volRatio >= 1.01) addRepeatAchievement('volumeUpWeek1', weekKey);
        if (volRatio >= 1.03) addRepeatAchievement('volumeUpWeek3', weekKey);
        if (volRatio >= 1.05) addRepeatAchievement('volumeUpWeek5', weekKey);
        if (volRatio >= 1.10) addRepeatAchievement('volumeUpWeek10', weekKey);
    }

    // 무게 (주)
    const thisWeekWt = getWeekWeight(thisWeek);
    const lastWeekWt = getWeekWeight(lastWeek);
    if (lastWeekWt > 0) {
        const wtRatio = thisWeekWt / lastWeekWt;
        if (wtRatio >= 1.01) addRepeatAchievement('heavyWeek1', weekKey);
        if (wtRatio >= 1.03) addRepeatAchievement('heavyWeek3', weekKey);
        if (wtRatio >= 1.05) addRepeatAchievement('heavyWeek5', weekKey);
        if (wtRatio >= 1.10) addRepeatAchievement('heavyWeek10', weekKey);
    }

    // 월간 업적 체크
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    const monthKey = `${thisYear}-${thisMonth}`;

    // 볼륨 (월)
    const thisMonthVol = getMonthVolume(thisYear, thisMonth);
    const lastMonthVol = getMonthVolume(lastMonthYear, lastMonth);
    if (lastMonthVol > 0) {
        const volRatio = thisMonthVol / lastMonthVol;
        if (volRatio >= 1.01) addRepeatAchievement('volumeUpMonth1', monthKey, 'months');
        if (volRatio >= 1.03) addRepeatAchievement('volumeUpMonth3', monthKey, 'months');
        if (volRatio >= 1.05) addRepeatAchievement('volumeUpMonth5', monthKey, 'months');
        if (volRatio >= 1.10) addRepeatAchievement('volumeUpMonth10', monthKey, 'months');
    }

    // 무게 (월)
    const thisMonthWt = getMonthWeight(thisYear, thisMonth);
    const lastMonthWt = getMonthWeight(lastMonthYear, lastMonth);
    if (lastMonthWt > 0) {
        const wtRatio = thisMonthWt / lastMonthWt;
        if (wtRatio >= 1.01) addRepeatAchievement('heavyMonth1', monthKey, 'months');
        if (wtRatio >= 1.03) addRepeatAchievement('heavyMonth3', monthKey, 'months');
        if (wtRatio >= 1.05) addRepeatAchievement('heavyMonth5', monthKey, 'months');
        if (wtRatio >= 1.10) addRepeatAchievement('heavyMonth10', monthKey, 'months');
    }

    // 휴식 업적 체크
    if (allDates.length > 0) {
        const lastRecordDate = parseLocalDate(allDates[allDates.length - 1]);
        const todayDate = parseLocalDate(today);
        const daysSinceLastRecord = Math.floor((todayDate - lastRecordDate) / (1000 * 60 * 60 * 24));

        // 마지막 기록과 휴식 시작점의 키 (중복 방지)
        const restKey = allDates[allDates.length - 1];

        if (daysSinceLastRecord >= 7) addRepeatAchievement('rest1week', restKey, 'periods');
        if (daysSinceLastRecord >= 30) addRepeatAchievement('rest1month', restKey, 'periods');
        if (daysSinceLastRecord >= 90) addRepeatAchievement('rest3month', restKey, 'periods');
    }

    save();
}

function renderAchievements() {
    checkAchievements();

    const achieved = ACHIEVEMENTS.filter(a => data.achievements[a.id]);
    const locked = ACHIEVEMENTS.filter(a => !data.achievements[a.id]);
    const totalCount = achieved.reduce((sum, a) => sum + (data.achievements[a.id]?.count || 0), 0);

    document.getElementById('achievementSummary').innerHTML = `
        <div class="achievement-stat">
            <div class="achievement-stat-value">${achieved.length}</div>
            <div class="achievement-stat-label">달성 업적</div>
        </div>
        <div class="achievement-stat">
            <div class="achievement-stat-value">${totalCount}</div>
            <div class="achievement-stat-label">총 달성 횟수</div>
        </div>
        <div class="achievement-stat">
            <div class="achievement-stat-value">${getAllRecordDatesForAchievements().length}</div>
            <div class="achievement-stat-label">총 기록일</div>
        </div>
    `;

    const list = document.getElementById('achievementList');
    list.innerHTML = [...achieved, ...locked].map(a => {
        const data_a = data.achievements[a.id];
        const isLocked = !data_a;
        const count = data_a?.count || 0;
        return `
            <div class="achievement-item ${isLocked ? 'locked' : ''}">
                <div class="achievement-icon">${a.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${a.title}</div>
                    <div class="achievement-desc">${a.desc}</div>
                </div>
                ${!isLocked && a.type === 'repeat' ? `<div class="achievement-count">×${count}</div>` : ''}
                ${!isLocked && a.type === 'once' ? '<span class="achievement-check">✓</span>' : ''}
            </div>
        `;
    }).join('');
}

// ==================== 업적 시스템 끝 ====================

// INIT - 테스트 데이터 강제 생성
function generateTestData() {
    const baseTimestamp = Date.now();
    const exerciseData = [
        { id: String(baseTimestamp), name: '팔굽혀펴기', color: '#ff6b6b', memo: '가슴과 삼두를 단련하는 기본 운동' },
        { id: String(baseTimestamp + 1), name: '윗몸일으키기', color: '#51cf66', memo: '' },
        { id: String(baseTimestamp + 2), name: '벤치프레스', color: '#339af0', memo: '가슴 운동의 왕, 바벨 벤치프레스' },
        { id: String(baseTimestamp + 3), name: '스쿼트', color: '#cc5de8', memo: '' }
    ];

    data = { exercises: exerciseData, records: [], achievements: {} };

    // 운동 ID 맵 생성
    const exerciseIds = {
        '팔굽혀펴기': exerciseData[0].id,
        '윗몸일으키기': exerciseData[1].id,
        '벤치프레스': exerciseData[2].id,
        '스쿼트': exerciseData[3].id
    };

    let idCounter = 0;
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('sv-SE');

        if (Math.random() > 0.3) {
            if (Math.random() > 0.3) {
                const sets = 3 + Math.floor(Math.random() * 3);
                for (let s = 0; s < sets; s++) {
                    data.records.push({
                        id: `test_${idCounter++}`,
                        datetime: `${dateStr}T${String(10 + s).padStart(2, '0')}:00:00`,
                        exerciseId: exerciseIds['팔굽혀펴기'],
                        w: 1,
                        r: 15 + Math.floor(Math.random() * 20),
                        m: null
                    });
                }
            }
            if (Math.random() > 0.4) {
                const sets = 3 + Math.floor(Math.random() * 2);
                for (let s = 0; s < sets; s++) {
                    data.records.push({
                        id: `test_${idCounter++}`,
                        datetime: `${dateStr}T${String(11 + s).padStart(2, '0')}:00:00`,
                        exerciseId: exerciseIds['윗몸일으키기'],
                        w: 1,
                        r: 20 + Math.floor(Math.random() * 15),
                        m: null
                    });
                }
            }
            if (Math.random() > 0.4) {
                const baseWeight = 40 + Math.floor((30 - i) / 5) * 2.5;
                const sets = 4 + Math.floor(Math.random() * 2);
                for (let s = 0; s < sets; s++) {
                    data.records.push({
                        id: `test_${idCounter++}`,
                        datetime: `${dateStr}T${String(14 + s).padStart(2, '0')}:00:00`,
                        exerciseId: exerciseIds['벤치프레스'],
                        w: baseWeight + (s < 2 ? 0 : 5),
                        r: 8 + Math.floor(Math.random() * 5),
                        m: Math.random() > 0.7 ? '컨디션 좋음' : null
                    });
                }
            }
            if (Math.random() > 0.4) {
                const sets = 3 + Math.floor(Math.random() * 2);
                for (let s = 0; s < sets; s++) {
                    data.records.push({
                        id: `test_${idCounter++}`,
                        datetime: `${dateStr}T${String(16 + s).padStart(2, '0')}:00:00`,
                        exerciseId: exerciseIds['스쿼트'],
                        w: 1,
                        r: 15 + Math.floor(Math.random() * 10),
                        m: null
                    });
                }
            }
        }
    }
    save();
}

generateTestData();
updateTimerDisplay();

// 초기 라우팅
if (!location.hash) {
    navigate('record', true);
}
handleRoute();
