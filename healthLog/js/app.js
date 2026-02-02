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
    } else if (route === 'timer') {
        if (!isPremium) {
            isNavigating = false;
            navigate('record', true);
            handleRoute();
            return;
        }
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

// ==================== 테스트 데이터 생성 ====================

function generateTestData() {
    const baseTimestamp = Date.now();
    const exerciseData = [
        { id: String(baseTimestamp), name: '팔굽혀펴기', color: '#ff6b6b', memo: '가슴과 삼두를 단련하는 기본 운동' },
        { id: String(baseTimestamp + 1), name: '윗몸일으키기', color: '#51cf66', memo: '' },
        { id: String(baseTimestamp + 2), name: '벤치프레스', color: '#339af0', memo: '가슴 운동의 왕, 바벨 벤치프레스' },
        { id: String(baseTimestamp + 3), name: '스쿼트', color: '#cc5de8', memo: '' }
    ];

    data = { exercises: exerciseData, records: [], achievements: {} };

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

// ==================== 초기화 ====================

// 테스트 데이터 생성 (필요시 주석 해제)
// generateTestData();

// 타이머 초기화
updateTimerDisplay();

// 타이머 입력 유효성 검사
validateInput(customTimeInput, false);

// 초기 라우팅
if (!location.hash) {
    navigate('record', true);
}
handleRoute();
