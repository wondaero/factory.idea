// ==================== 데이터 관리 ====================

const KEY = 'healthLog';
const today = new Date().toLocaleDateString('sv-SE');

// 프리미엄 vs 라이트 설정
let isPremium = true;

// 전체 색상 (프리미엄)
const PRESET_COLORS = [
    '#ff6b6b', '#fa5252', '#e64980', '#f06595', '#ff8787',
    '#cc5de8', '#be4bdb', '#845ef7', '#7950f2', '#9775fa',
    '#5c7cfa', '#4c6ef5', '#339af0', '#228be6', '#74c0fc',
    '#22b8cf', '#15aabf', '#3bc9db', '#66d9e8', '#99e9f2',
    '#20c997', '#12b886', '#51cf66', '#40c057', '#8ce99a',
    '#94d82d', '#82c91e', '#fab005', '#fcc419', '#ffe066',
    '#ff922b', '#fd7e14', '#f76707', '#e8590c', '#ffa94d',
    '#868e96', '#495057', '#343a40', '#adb5bd', '#dee2e6'
];

// 라이트 색상 (10개)
const LITE_COLORS = [
    '#ff6b6b', '#cc5de8', '#339af0', '#20c997', '#51cf66',
    '#fab005', '#ff922b', '#868e96', '#e64980', '#845ef7'
];

// 라이트 운동 개수 제한
const LITE_MAX_EXERCISES = 8;

function getAvailableColors() {
    return isPremium ? PRESET_COLORS : LITE_COLORS;
}

function showUpgradePrompt(featureName) {
    alert(`"${featureName}"은(는) 프리미엄 기능입니다.\n프리미엄으로 업그레이드하세요!`);
}

// 데이터 로드 및 마이그레이션
let stored = JSON.parse(localStorage.getItem(KEY) || '{}');
if (stored.isPremium !== undefined) {
    isPremium = stored.isPremium;
}

function migrateData(oldData) {
    if (!oldData.exercises || !oldData.records) {
        return { exercises: [], records: [], achievements: {} };
    }

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

    const baseTimestamp = Date.now();
    const newExercises = [];
    const exerciseIdMap = {};

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

    let newRecords = [];
    if (Array.isArray(oldData.records)) {
        newRecords = oldData.records.map(record => ({
            id: record.id,
            datetime: record.datetime,
            exerciseId: exerciseIdMap[record.exercise] || record.exercise,
            w: record.w,
            r: record.r,
            m: record.m || null
        }));
    } else {
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

function getExerciseById(id) {
    return data.exercises.find(ex => ex.id === id);
}

function getExerciseByName(name) {
    return data.exercises.find(ex => ex.name === name);
}

let data = migrateData(stored);
let exerciseSortOrder = stored.exerciseSortOrder || 'registered';

// ==================== 더미 데이터 (테스트용 - 나중에 삭제) ====================
const DUMMY_MODE = true; // false로 바꾸면 더미 데이터 비활성화

function loadDummyData() {
    const exercises = [
        { id: 'ex1', name: '벤치프레스', color: '#ff6b6b', memo: '가슴 운동' },
        { id: 'ex2', name: '스쿼트', color: '#339af0', memo: '하체 운동' },
        { id: 'ex3', name: '데드리프트', color: '#51cf66', memo: '전신 운동' },
        { id: 'ex4', name: '숄더프레스', color: '#fab005', memo: '어깨 운동' },
        { id: 'ex5', name: '바벨로우', color: '#cc5de8', memo: '등 운동' },
        { id: 'ex6', name: '랫풀다운', color: '#20c997', memo: '' },
        { id: 'ex7', name: '레그프레스', color: '#ff922b', memo: '' },
        { id: 'ex8', name: '덤벨컬', color: '#845ef7', memo: '이두 운동' },
    ];

    const records = [];
    const exerciseIds = exercises.map(e => e.id);

    // 2025년 11월 (약 15일 운동)
    const nov2025 = [1, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 28];
    for (const day of nov2025) {
        const date = `2025-11-${String(day).padStart(2, '0')}`;
        const numExercises = 2 + Math.floor(Math.random() * 3); // 2~4개 운동
        const usedEx = [];
        for (let i = 0; i < numExercises; i++) {
            let exId;
            do { exId = exerciseIds[Math.floor(Math.random() * exerciseIds.length)]; }
            while (usedEx.includes(exId));
            usedEx.push(exId);
            const numSets = 3 + Math.floor(Math.random() * 2); // 3~4세트
            for (let s = 0; s < numSets; s++) {
                const hour = 6 + Math.floor(Math.random() * 14); // 6~19시
                records.push({
                    id: `dummy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                    datetime: `${date}T${String(hour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
                    exerciseId: exId,
                    w: 20 + Math.floor(Math.random() * 60), // 20~80kg
                    r: 8 + Math.floor(Math.random() * 7), // 8~14reps
                    m: null
                });
            }
        }
    }

    // 2025년 12월 (약 18일 운동 - 좀 더 열심히)
    const dec2025 = [1, 2, 4, 6, 8, 9, 11, 13, 15, 16, 18, 20, 22, 23, 25, 27, 29, 31];
    for (const day of dec2025) {
        const date = `2025-12-${String(day).padStart(2, '0')}`;
        const numExercises = 2 + Math.floor(Math.random() * 4);
        const usedEx = [];
        for (let i = 0; i < numExercises; i++) {
            let exId;
            do { exId = exerciseIds[Math.floor(Math.random() * exerciseIds.length)]; }
            while (usedEx.includes(exId));
            usedEx.push(exId);
            const numSets = 3 + Math.floor(Math.random() * 3);
            for (let s = 0; s < numSets; s++) {
                const hour = 6 + Math.floor(Math.random() * 14);
                records.push({
                    id: `dummy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                    datetime: `${date}T${String(hour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
                    exerciseId: exId,
                    w: 25 + Math.floor(Math.random() * 65), // 25~90kg (약간 증가)
                    r: 8 + Math.floor(Math.random() * 7),
                    m: null
                });
            }
        }
    }

    // 2026년 1월 (약 12일 운동 - 새해라 약간 감소)
    const jan2026 = [2, 4, 6, 8, 10, 13, 15, 18, 20, 23, 27, 30];
    for (const day of jan2026) {
        const date = `2026-01-${String(day).padStart(2, '0')}`;
        const numExercises = 2 + Math.floor(Math.random() * 3);
        const usedEx = [];
        for (let i = 0; i < numExercises; i++) {
            let exId;
            do { exId = exerciseIds[Math.floor(Math.random() * exerciseIds.length)]; }
            while (usedEx.includes(exId));
            usedEx.push(exId);
            const numSets = 3 + Math.floor(Math.random() * 2);
            for (let s = 0; s < numSets; s++) {
                const hour = 6 + Math.floor(Math.random() * 14);
                records.push({
                    id: `dummy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                    datetime: `${date}T${String(hour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
                    exerciseId: exId,
                    w: 30 + Math.floor(Math.random() * 70), // 30~100kg
                    r: 8 + Math.floor(Math.random() * 7),
                    m: null
                });
            }
        }
    }

    // 정렬
    records.sort((a, b) => a.datetime.localeCompare(b.datetime));

    return { exercises, records, achievements: {} };
}

// 더미 데이터 로드 (DUMMY_MODE가 true일 때 강제 로드)
if (DUMMY_MODE) {
    data = loadDummyData();
    isPremium = true; // 프리미엄 강제 설정
    save();
    console.log('더미 데이터 강제 로드됨 (3개월치, 프리미엄)');
}

function save() {
    localStorage.setItem(KEY, JSON.stringify({ ...data, isPremium, exerciseSortOrder }));
}

function togglePremium() {
    isPremium = !isPremium;
    save();
    if (typeof updateTabButtons === 'function') updateTabButtons();
    if (typeof renderColorPicker === 'function') renderColorPicker();
    if (typeof updateChartPeriodButtons === 'function') updateChartPeriodButtons();
    console.log(`프리미엄 모드: ${isPremium ? 'ON' : 'OFF'}`);
    return isPremium;
}

// ==================== 유틸리티 함수 ====================

function isLightColor(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150;
}

function parseLocalDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function toDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getDateFromDatetime(datetime) {
    return datetime.split('T')[0];
}

function createDatetime(dateStr = null) {
    const now = new Date();
    if (dateStr) {
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

function generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
