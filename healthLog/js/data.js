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

// 테스트용 더미 데이터 생성
function generateTestData() {
    const exercises = [
        { id: 'test_1', name: '윗몸일으키기', color: '#ff6b6b', memo: '' },
        { id: 'test_2', name: '팔굽혀펴기', color: '#cc5de8', memo: '' },
        { id: 'test_3', name: '벤치프레스', color: '#339af0', memo: '' },
        { id: 'test_4', name: '스쿼트', color: '#51cf66', memo: '' },
        { id: 'test_5', name: '런지', color: '#fab005', memo: '' }
    ];

    const records = [];

    // 2024년 12월 1일 ~ 2025년 1월 31일
    const startDate = new Date(2024, 11, 1); // 12월 1일
    const endDate = new Date(2025, 1, 0); // 1월 31일
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < totalDays; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toLocaleDateString('sv-SE');

        // 70% 확률로 그 날 운동함
        if (Math.random() > 0.3) {
            exercises.forEach(ex => {
                // 각 운동 50% 확률
                if (Math.random() > 0.5) {
                    const sets = 2 + Math.floor(Math.random() * 3); // 2~4세트
                    for (let s = 0; s < sets; s++) {
                        let weight;
                        if (ex.name === '윗몸일으키기' || ex.name === '팔굽혀펴기') {
                            weight = 1; // 맨몸 운동
                        } else {
                            // 점점 증가
                            const baseWeight = ex.name === '벤치프레스' ? 40 : ex.name === '스쿼트' ? 60 : 30;
                            const progress = i * 0.2; // 날마다 조금씩 증가
                            weight = baseWeight + progress + (Math.random() * 5 - 2.5);
                            weight = Math.round(weight * 2) / 2; // 0.5kg 단위
                        }

                        records.push({
                            id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                            datetime: `${dateStr}T${10 + s}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
                            exerciseId: ex.id,
                            w: weight,
                            r: 8 + Math.floor(Math.random() * 5), // 8~12회
                            m: null
                        });
                    }
                }
            });
        }
    }

    data.exercises = exercises;
    data.records = records;
    save();
    location.reload();
}

// 더미 데이터 삭제
function clearTestData() {
    data.exercises = [];
    data.records = [];
    data.achievements = {};
    save();
    location.reload();
}

// 데이터 없으면 테스트 데이터 자동 생성
if (data.exercises.length === 0) {
    generateTestData();
}
