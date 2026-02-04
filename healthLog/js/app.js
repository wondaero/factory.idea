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
        const isAddMode = parts[1] === 'add';
        Object.values(tabs).forEach(t => t.classList.add('hidden'));
        tabs.settings.classList.remove('hidden');
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'settings'));

        const settingsBackBtn = document.getElementById('settingsBackBtn');
        if (isAddMode) {
            settingsBackBtn.classList.remove('hidden');
        } else {
            settingsBackBtn.classList.add('hidden');
        }

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
        if (currentViewMode === 'calendar') {
            showDayDetail(selectedDate || today);
        } else {
            renderFeedView();
        }
    }
    isNavigating = false;
}

window.addEventListener('popstate', handleRoute);

// 기존 함수들 수정 - navigate 호출 추가
switchTab = function(tabName) {
    if (tabName === 'record') {
        navigate('record');
    } else {
        navigate(tabName);
    }
    handleRoute();
};

showMain = function() {
    navigate('record');
    handleRoute();
};

showDetailById = function(id, date = null) {
    selectedDate = date || selectedDate || today;
    if (date) {
        navigate(`detail/${encodeURIComponent(id)}/${date}`);
    } else {
        navigate(`detail/${encodeURIComponent(id)}`);
    }
    handleRoute();
};

showDetail = function(name, date = null) {
    const exercise = getExerciseByName(name);
    if (exercise) showDetailById(exercise.id, date);
};

goToSettingsForAdd = function() {
    navigate('settings/add');
    handleRoute();
};

// 탭 버튼 이벤트 재설정
tabButtons.forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
});

// 뒤로가기 버튼
document.getElementById('backBtn').onclick = () => history.back();
document.getElementById('settingsBackBtn').onclick = () => history.back();

// ==================== 초기화 ====================

if (!location.hash) navigate('record', true);
handleRoute();

// 첫 로드 시 달력뷰면 오늘 패널 표시
if (getHash() === 'record' && currentViewMode === 'calendar') {
    showDayDetail(today);
}

// ==================== 이스터에그: 프리미엄 전환 ====================
// "Health Log" 타이틀을 7번 연속 탭하면 프리미엄 전환
(function initEasterEgg() {
    const title = document.querySelector('#recordTab header h1');
    if (!title) return;

    let tapCount = 0;
    let lastTap = 0;
    const TAP_THRESHOLD = 2000; // 2초 내에 7번
    const TAP_COUNT = 7;

    title.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastTap > TAP_THRESHOLD) {
            tapCount = 0;
        }
        lastTap = now;
        tapCount++;

        if (tapCount >= TAP_COUNT) {
            tapCount = 0;
            const newState = togglePremium();
            showEasterEggToast(newState ? '🎉 Premium Activated!' : '📦 Lite Mode');
        }
    });

    function showEasterEggToast(message) {
        const existing = document.querySelector('.easter-egg-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'easter-egg-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: #fff;
            padding: 20px 40px;
            border-radius: 12px;
            font-size: 18px;
            font-weight: bold;
            z-index: 9999;
            animation: easterEggPop 0.3s ease-out;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 1500);
    }

    // 애니메이션 스타일 추가
    if (!document.getElementById('easterEggStyle')) {
        const style = document.createElement('style');
        style.id = 'easterEggStyle';
        style.textContent = `
            @keyframes easterEggPop {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
})();
