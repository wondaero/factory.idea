// ==================== Custom Modal System ====================

const customModal = document.getElementById('customModal');
const customModalIcon = document.getElementById('customModalIcon');
const customModalMessage = document.getElementById('customModalMessage');
const customModalActions = document.getElementById('customModalActions');

const MODAL_ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
    confirm: '?',
    exit: '👋'
};

function showModal(options) {
    return new Promise((resolve) => {
        const { type = 'info', message, buttons = [{ text: t('confirm') || '확인', primary: true }] } = options;

        customModalIcon.textContent = MODAL_ICONS[type] || MODAL_ICONS.info;
        customModalIcon.className = 'custom-modal-icon ' + type;
        customModalMessage.textContent = message;

        customModalActions.innerHTML = '';
        buttons.forEach((btn, idx) => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            if (btn.danger) {
                button.className = 'modal-btn-danger';
            } else if (btn.primary) {
                button.className = 'modal-btn-primary';
            } else {
                button.className = 'modal-btn-secondary';
            }
            button.onclick = () => {
                customModal.classList.remove('show');
                resolve(btn.value !== undefined ? btn.value : idx === 0);
            };
            customModalActions.appendChild(button);
        });

        customModal.classList.add('show');
    });
}

function showAlert(message, type = 'info') {
    return showModal({
        type,
        message,
        buttons: [{ text: t('confirm') || '확인', primary: true, value: true }]
    });
}

function showConfirm(message, type = 'confirm') {
    return showModal({
        type,
        message,
        buttons: [
            { text: t('cancel') || '취소', value: false },
            { text: t('confirm') || '확인', primary: true, value: true }
        ]
    });
}

function showExitConfirm() {
    return showModal({
        type: 'exit',
        message: t('exitConfirm') || '앱을 종료하시겠습니까?',
        buttons: [
            { text: t('cancel') || '취소', value: false },
            { text: t('exit') || '종료', danger: true, value: true }
        ]
    });
}

// Close modal on overlay click
customModal.onclick = (e) => {
    if (e.target === customModal) {
        customModal.classList.remove('show');
    }
};

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
    document.getElementById('addTemplatePage').classList.add('hidden');

    // 제목/메모 수정 중이면 취소
    if (typeof cancelTitleEdit === 'function') {
        cancelTitleEdit();
    }
    if (typeof cancelMemoEdit === 'function') {
        cancelMemoEdit();
    }

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
            updateFab(false);
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
        updateFab(false);
    } else if (route === 'my') {
        const subroute = parts[1];
        Object.values(tabs).forEach(t => t.classList.add('hidden'));
        tabs.my.classList.remove('hidden');
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'my'));
        showMySubpage(subroute || null);
    } else if (route === 'settings') {
        Object.values(tabs).forEach(t => t.classList.add('hidden'));
        tabs.settings.classList.remove('hidden');
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'settings'));
        document.getElementById('settingsBackBtn').classList.add('hidden');
        renderMain();
        updateFab(true);
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
        updateFab(false);
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

// ==================== 탭바 높이 측정 ====================

function updateTabBarHeight() {
    const tabBar = document.querySelector('.tab-bar');
    if (tabBar) {
        document.documentElement.style.setProperty('--tab-bar-h', tabBar.offsetHeight + 'px');
    }
}
window.addEventListener('resize', updateTabBarHeight);

// ==================== MY 서브페이지 ====================

const mySubpages = {
    profile: document.getElementById('myProfilePage'),
    achievement: document.getElementById('myAchievementPage'),
    appsettings: document.getElementById('myAppSettingsPage'),
    routines: document.getElementById('myRoutinesPage'),
    routinedetail: document.getElementById('myRoutineDetailPage')
};

function showMySubpage(name) {
    const hub = document.getElementById('myHub');
    Object.values(mySubpages).forEach(p => p.classList.add('hidden'));

    if (name && mySubpages[name]) {
        hub.classList.add('hidden');
        mySubpages[name].classList.remove('hidden');
        if (name === 'achievement') renderAchievements();
        if (name === 'profile') renderProfile();
        if (name === 'routines' && typeof renderRoutineList === 'function') renderRoutineList();
    } else {
        hub.classList.remove('hidden');
    }
    updateFab(false);
}

document.querySelectorAll('.my-hub-item').forEach(btn => {
    btn.onclick = () => { navigate('my/' + btn.dataset.subroute); handleRoute(); };
});

['mySubBackBtn', 'myAchBackBtn', 'mySettingsSubBackBtn', 'myRoutinesBackBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.onclick = () => { navigate('my'); handleRoute(); };
});

// ==================== FAB ====================

const fabAddExercise = document.getElementById('fabAddExercise');

function updateFab(show) {
    fabAddExercise.classList.toggle('hidden', !show);
}

fabAddExercise.onclick = () => {
    const activeSubTab = document.querySelector('.sub-tab.active');
    if (activeSubTab?.dataset.subtab === 'templates') {
        openAddTemplatePage();
    } else {
        openAddExercisePage();
    }
};

// ==================== 운동|템플릿 서브탭 ====================

document.querySelectorAll('.sub-tab').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const pane = btn.dataset.subtab;
        document.getElementById('exercisesPane').classList.toggle('hidden', pane !== 'exercises');
        document.getElementById('templatesPane').classList.toggle('hidden', pane !== 'templates');
        if (pane === 'templates') renderTemplateList();
        updateFab(true);
    };
});

// ==================== 초기화 ====================

// 앱 초기화 (데이터 로드 후 실행)
async function initApp() {
    // 네이티브 앱 감지 (CSS 분기용)
    if (window.Capacitor?.isNativePlatform?.()) {
        document.body.classList.add('is-native');
    }

    // 데이터 로드 대기
    await initData();

    // 초기 라우팅
    if (!location.hash) navigate('record', true);
    handleRoute();

    // 첫 로드 시 달력뷰면 오늘 패널 표시
    if (getHash() === 'record' && currentViewMode === 'calendar') {
        showDayDetail(today);
    }

    // UI 초기화
    updateLangButtons();
    updateUnitButtons();
    updateTabBarHeight();

    // 뒤로가기 핸들러 등록 (Capacitor 플러그인 로드 후)
    initBackButtonHandler();

    console.log('App initialized');
}

// 앱 시작
initApp();

// ==================== 이스터에그: 프리미엄 전환 ====================
// "GYMemo" 타이틀을 7번 연속 탭하면 프리미엄 전환
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

// ==================== 데이터 내보내기/불러오기 (.hlog + gzip) ====================

const fileInput = document.getElementById('fileInput');
const loadDataBtn = document.getElementById('loadDataBtn');
const exportDataBtn = document.getElementById('exportDataBtn');

// gzip 압축
async function compressData(jsonStr) {
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonStr);
    const cs = new CompressionStream('gzip');
    const writer = cs.writable.getWriter();
    writer.write(data);
    writer.close();
    const compressedChunks = [];
    const reader = cs.readable.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        compressedChunks.push(value);
    }
    const totalLength = compressedChunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of compressedChunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }
    return result;
}

// gzip 해제
async function decompressData(compressedData) {
    const ds = new DecompressionStream('gzip');
    const writer = ds.writable.getWriter();
    writer.write(compressedData);
    writer.close();
    const decompressedChunks = [];
    const reader = ds.readable.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        decompressedChunks.push(value);
    }
    const totalLength = decompressedChunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of decompressedChunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }
    const decoder = new TextDecoder();
    return decoder.decode(result);
}

// 데이터 내보내기 (.hlog)
async function exportData() {
    try {
        const exportObj = {
            ...data,
            isPremium,
            exerciseSortOrder,
            weightUnit,
            exportedAt: new Date().toISOString()
        };
        const jsonStr = JSON.stringify(exportObj);
        const compressed = await compressData(jsonStr);
        const fileName = `gymemo_${today}.hlog`;

        // 네이티브 앱에서는 Share 사용 (경로 선택 가능)
        if (window.Capacitor?.isNativePlatform?.() && window.Capacitor?.Plugins?.Filesystem) {
            const Filesystem = window.Capacitor.Plugins.Filesystem;
            const Share = window.Capacitor.Plugins.Share;

            // base64로 변환
            const base64 = btoa(String.fromCharCode(...compressed));

            // 캐시 폴더에 임시 저장 후 공유
            await Filesystem.writeFile({
                path: fileName,
                data: base64,
                directory: 'CACHE'
            });

            // 파일 URI 가져오기
            const fileUri = await Filesystem.getUri({
                path: fileName,
                directory: 'CACHE'
            });

            // Share 플러그인으로 공유 (사용자가 저장 위치 선택 가능)
            if (Share) {
                await Share.share({
                    title: t('exportData') || '데이터 내보내기',
                    text: t('exportShareText') || 'GYMemo 백업 파일',
                    url: fileUri.uri,
                    dialogTitle: t('exportChooseLocation') || '저장 위치 선택'
                });
            } else {
                // Share 플러그인 없으면 Documents에 저장
                await Filesystem.writeFile({
                    path: fileName,
                    data: base64,
                    directory: 'DOCUMENTS'
                });
                await showAlert(
                    (t('exportSuccessPath') || '파일이 저장되었습니다:\n{path}').replace('{path}', `Documents/${fileName}`),
                    'success'
                );
            }
        } else {
            // 웹에서는 기존 다운로드 방식
            const blob = new Blob([compressed], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            await showAlert(t('exportSuccess') || '데이터를 내보냈습니다.', 'success');
        }
    } catch (err) {
        console.error('내보내기 오류:', err);
        await showAlert(t('exportError') || '내보내기 중 오류가 발생했습니다.', 'error');
    }
}

// 데이터 불러오기 (.hlog 또는 .json)
async function loadData(file) {
    try {
        let jsonStr;

        if (file.name.endsWith('.hlog')) {
            // gzip 압축 해제
            const arrayBuffer = await file.arrayBuffer();
            const compressedData = new Uint8Array(arrayBuffer);
            jsonStr = await decompressData(compressedData);
        } else {
            // 일반 JSON
            jsonStr = await file.text();
        }

        const loaded = JSON.parse(jsonStr);

        // 유효성 검사
        if (!loaded.exercises || !loaded.records) {
            await showAlert(t('invalidFileFormat') || '올바른 데이터 파일이 아닙니다.', 'error');
            return;
        }

        // 데이터 마이그레이션
        const migrated = migrateData(loaded);

        // 확인 메시지
        const exerciseCount = migrated.exercises.length;
        const recordCount = migrated.records.length;
        const confirmMsg = (t('confirmLoad') || '운동 {exercises}개, 기록 {records}개를 불러옵니다.\n기존 데이터가 덮어씌워집니다. 계속하시겠습니까?')
            .replace('{exercises}', exerciseCount)
            .replace('{records}', recordCount);

        const confirmed = await showConfirm(confirmMsg, 'warning');
        if (!confirmed) return;

        // 데이터 적용
        data.exercises = migrated.exercises;
        data.records = migrated.records;
        data.achievements = migrated.achievements || {};
        if (loaded.isPremium !== undefined) isPremium = loaded.isPremium;
        if (loaded.exerciseSortOrder) exerciseSortOrder = loaded.exerciseSortOrder;
        if (loaded.weightUnit) weightUnit = loaded.weightUnit;

        save();
        invalidateRecordsCache();

        // UI 새로고침
        await showAlert(t('loadSuccess') || '데이터를 불러왔습니다.', 'success');
        location.reload();
    } catch (err) {
        console.error('파일 로드 오류:', err);
        await showAlert(t('loadError') || '파일을 읽는 중 오류가 발생했습니다.', 'error');
    }
}

// 이벤트 리스너
if (loadDataBtn) {
    loadDataBtn.onclick = () => fileInput.click();
}

if (exportDataBtn) {
    exportDataBtn.onclick = exportData;
}

if (fileInput) {
    fileInput.onchange = (e) => {
        if (e.target.files[0]) {
            loadData(e.target.files[0]);
            e.target.value = ''; // 같은 파일 다시 선택 가능하도록
        }
    };
}

// 데이터 초기화
const resetDataBtn = document.getElementById('resetDataBtn');
if (resetDataBtn) {
    resetDataBtn.onclick = async () => {
        const confirmed = await showConfirm(t('resetDataConfirm'));
        if (confirmed) {
            resetAllData();
            renderExerciseList();
            renderCalendar();
            showDayDetail(today);
            showAlert(t('resetDataSuccess'), 'success');
        }
    };
}

// ==================== 언어 선택 ====================

function updateLangButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.onclick = () => {
        setLanguage(btn.dataset.lang);
        updateLangButtons();
    };
});

// ==================== 무게 단위 선택 ====================

function updateUnitButtons() {
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === weightUnit);
    });
}

document.querySelectorAll('.unit-btn').forEach(btn => {
    btn.onclick = () => {
        setWeightUnit(btn.dataset.unit);
        updateUnitButtons();
        // Refresh displays
        if (currentViewMode === 'calendar') {
            renderCalendar();
            if (selectedDate) showDayDetail(selectedDate);
        } else {
            renderFeedView();
        }
        if (currentExercise) renderDetail(isFromCalendar ? dateInput.value : null);
    };
});

// ==================== 뒤로가기 종료 확인 ====================

let isExitConfirmShowing = false;
let backButtonHandlerRegistered = false;

// 뒤로가기 버튼 핸들러 등록
function registerBackButtonListener() {
    if (backButtonHandlerRegistered) return;

    const App = window.Capacitor?.Plugins?.App;
    if (!App) {
        console.log('App plugin not available');
        return false;
    }

    App.addListener('backButton', async ({ canGoBack }) => {
        console.log('Back button pressed, canGoBack:', canGoBack);

        // 이미 종료 확인창이 떠있으면 무시
        if (isExitConfirmShowing) return;

        const currentHash = location.hash || '#record';

        // 모달이 열려있으면 모달 닫기
        if (customModal.classList.contains('show')) {
            customModal.classList.remove('show');
            return;
        }
        if (monthPickerModal.classList.contains('show')) {
            monthPickerModal.classList.remove('show');
            return;
        }
        if (colorPickerModal.classList.contains('show')) {
            colorPickerModal.classList.remove('show');
            return;
        }
        if (setEditModal.classList.contains('show')) {
            setEditModal.classList.remove('show');
            return;
        }

        // 메인 화면이 아니면 뒤로가기
        if (currentHash !== '#record' && currentHash !== '') {
            history.back();
            return;
        }

        // 메인 화면에서 뒤로가기 = 종료 확인
        isExitConfirmShowing = true;
        const shouldExit = await showExitConfirm();
        isExitConfirmShowing = false;

        if (shouldExit) {
            App.exitApp();
        }
    });

    backButtonHandlerRegistered = true;
    console.log('Back button handler registered successfully');
    return true;
}

// Capacitor 네이티브 뒤로가기 버튼 처리 (Android)
function initBackButtonHandler() {
    // 바로 등록 시도
    if (registerBackButtonListener()) return;

    // Capacitor가 아직 준비되지 않았으면 대기
    let attempts = 0;
    const maxAttempts = 20; // 2초 동안 시도

    const checkInterval = setInterval(() => {
        attempts++;
        console.log('Waiting for Capacitor App plugin... attempt', attempts);

        if (registerBackButtonListener() || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            if (attempts >= maxAttempts) {
                console.log('App plugin not available after waiting');
            }
        }
    }, 100);
}

// 뒤로가기 핸들러는 initApp()에서 등록
