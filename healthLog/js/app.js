// ==================== 라우팅 & 초기화 ====================

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
        let exercise = getExerciseById(exerciseIdOrName) || getExerciseByName(exerciseIdOrName);
        if (exercise) {
            Object.values(tabs).forEach(t => t.classList.add('hidden'));
            tabs.record.classList.remove('hidden');
            tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'record'));

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
            isNavigating = false;
            navigate('record', true);
            handleRoute();
            return;
        }
    } else if (route === 'chart') {
        Object.values(tabs).forEach(t => t.classList.add('hidden'));
        tabs.chart.classList.remove('hidden');
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'chart'));
        updateChartSelect();
        updateChartPeriodButtons();
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
document.getElementById('backBtn').onclick = () => history.back();

// ==================== 초기화 ====================

if (!location.hash) navigate('record', true);
handleRoute();

// 첫 로드 시 달력뷰면 오늘 패널 표시
if (getHash() === 'record' && currentViewMode === 'calendar') {
    showDayDetail(today);
}
