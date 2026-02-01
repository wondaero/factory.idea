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
