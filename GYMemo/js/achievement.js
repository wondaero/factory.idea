// ==================== 업적 시스템 ====================

// 업적 정의 (아이콘, 타입, 프리미엄 여부만 - 텍스트는 i18n에서)
const ACHIEVEMENTS = [
    // 1. 누적 기록일 (10개)
    { id: 'firstRecord', icon: '🎯', type: 'once', premium: false },
    { id: 'total10', icon: '🔟', type: 'once', premium: false },
    { id: 'total30', icon: '📅', type: 'once', premium: false },
    { id: 'total50', icon: '👟', type: 'once', premium: false },
    { id: 'total100', icon: '💯', type: 'once', premium: false },
    { id: 'total200', icon: '🏅', type: 'once', premium: true },
    { id: 'total365', icon: '🎖️', type: 'once', premium: true },
    { id: 'total500', icon: '🏆', type: 'once', premium: true },
    { id: 'total730', icon: '👑', type: 'once', premium: true },
    { id: 'total1000', icon: '💎', type: 'once', premium: true },

    // 2. 연속 기록 (10개)
    { id: 'first3days', icon: '🔥', type: 'once', premium: false },
    { id: 'streak7', icon: '🔥', type: 'once', premium: false },
    { id: 'streak14', icon: '🏃', type: 'once', premium: false },
    { id: 'streak30', icon: '🦾', type: 'once', premium: false },
    { id: 'streak60', icon: '⭐', type: 'once', premium: true },
    { id: 'streak90', icon: '🌟', type: 'once', premium: true },
    { id: 'streak120', icon: '💫', type: 'once', premium: true },
    { id: 'streak180', icon: '🔱', type: 'once', premium: true },
    { id: 'streak270', icon: '⚔️', type: 'once', premium: true },
    { id: 'streak365', icon: '👑', type: 'once', premium: true },

    // 3. 주간 빈도 (6개)
    { id: 'week3', icon: '📅', type: 'repeat', premium: false },
    { id: 'week5', icon: '📆', type: 'repeat', premium: false },
    { id: 'week7', icon: '🏆', type: 'repeat', premium: true },
    { id: 'week3for8', icon: '🎯', type: 'repeat', premium: true },
    { id: 'week4for12', icon: '🏅', type: 'repeat', premium: true },
    { id: 'week5for8', icon: '🦸', type: 'repeat', premium: true },

    // 4. 세트 수 마일스톤 (10개)
    { id: 'sets100', icon: '💪', type: 'once', premium: false },
    { id: 'sets500', icon: '🏋️', type: 'once', premium: false },
    { id: 'sets1000', icon: '🎯', type: 'once', premium: false },
    { id: 'sets2500', icon: '⚡', type: 'once', premium: true },
    { id: 'sets5000', icon: '🔥', type: 'once', premium: true },
    { id: 'sets10000', icon: '💎', type: 'once', premium: true },
    { id: 'daySet10', icon: '💥', type: 'repeat', premium: false },
    { id: 'daySet20', icon: '🔥', type: 'repeat', premium: true },
    { id: 'daySet30', icon: '💣', type: 'repeat', premium: true },
    { id: 'daySet50', icon: '👹', type: 'repeat', premium: true },

    // 5. 볼륨 마일스톤 (8개) - 전부 프리미엄
    { id: 'volume1ton', icon: '🏋️', type: 'repeat', premium: true },
    { id: 'volume5ton', icon: '💪', type: 'repeat', premium: true },
    { id: 'volume10ton', icon: '🚛', type: 'repeat', premium: true },
    { id: 'volume20ton', icon: '🦍', type: 'repeat', premium: true },
    { id: 'totalVol100ton', icon: '🏅', type: 'once', premium: true },
    { id: 'totalVol500ton', icon: '🏆', type: 'once', premium: true },
    { id: 'totalVol1000ton', icon: '💎', type: 'once', premium: true },
    { id: 'totalVol5000ton', icon: '👑', type: 'once', premium: true },

    // 6. 무게 기록 (6개) - 전부 프리미엄
    { id: 'weight60', icon: '🏋️', type: 'once', premium: true },
    { id: 'weight80', icon: '💪', type: 'once', premium: true },
    { id: 'weight100', icon: '🔥', type: 'once', premium: true },
    { id: 'weight120', icon: '⚡', type: 'once', premium: true },
    { id: 'weight140', icon: '💎', type: 'once', premium: true },
    { id: 'weight160', icon: '👑', type: 'once', premium: true },

    // 7. 볼륨/무게 증가 - 주간 (8개) - 전부 프리미엄
    { id: 'volumeUpWeek1', icon: '📈', type: 'repeat', premium: true },
    { id: 'volumeUpWeek3', icon: '📈', type: 'repeat', premium: true },
    { id: 'volumeUpWeek5', icon: '📈', type: 'repeat', premium: true },
    { id: 'volumeUpWeek10', icon: '📈', type: 'repeat', premium: true },
    { id: 'heavyWeek1', icon: '🏋️', type: 'repeat', premium: true },
    { id: 'heavyWeek3', icon: '🏋️', type: 'repeat', premium: true },
    { id: 'heavyWeek5', icon: '🏋️', type: 'repeat', premium: true },
    { id: 'heavyWeek10', icon: '🏋️', type: 'repeat', premium: true },

    // 8. 볼륨/무게 증가 - 월간 (8개) - 전부 프리미엄
    { id: 'volumeUpMonth1', icon: '🚀', type: 'repeat', premium: true },
    { id: 'volumeUpMonth3', icon: '🚀', type: 'repeat', premium: true },
    { id: 'volumeUpMonth5', icon: '🚀', type: 'repeat', premium: true },
    { id: 'volumeUpMonth10', icon: '🚀', type: 'repeat', premium: true },
    { id: 'heavyMonth1', icon: '💪', type: 'repeat', premium: true },
    { id: 'heavyMonth3', icon: '💪', type: 'repeat', premium: true },
    { id: 'heavyMonth5', icon: '💪', type: 'repeat', premium: true },
    { id: 'heavyMonth10', icon: '💪', type: 'repeat', premium: true },

    // 9. 렙수 마일스톤 (6개)
    { id: 'reps1000', icon: '🔢', type: 'once', premium: false },
    { id: 'reps5000', icon: '🔢', type: 'once', premium: false },
    { id: 'reps10000', icon: '🔢', type: 'once', premium: true },
    { id: 'reps50000', icon: '🔢', type: 'once', premium: true },
    { id: 'dayReps100', icon: '💯', type: 'repeat', premium: true },
    { id: 'dayReps200', icon: '🔥', type: 'repeat', premium: true },

    // 10. 운동 다양성 (6개)
    { id: 'exercise5', icon: '📚', type: 'once', premium: false },
    { id: 'exercise10', icon: '📚', type: 'once', premium: false },
    { id: 'exercise20', icon: '📖', type: 'once', premium: true },
    { id: 'dayEx3', icon: '🎯', type: 'repeat', premium: false },
    { id: 'dayEx5', icon: '⚔️', type: 'repeat', premium: true },
    { id: 'dayEx7', icon: '🍀', type: 'repeat', premium: true },

    // 11. 시간대/요일 (7개) - 전부 프리미엄
    { id: 'earlyBird', icon: '🌅', type: 'repeat', premium: true },
    { id: 'nightOwl', icon: '🦉', type: 'repeat', premium: true },
    { id: 'earlyBird10', icon: '☀️', type: 'once', premium: true },
    { id: 'nightOwl10', icon: '🌙', type: 'once', premium: true },
    { id: 'weekend', icon: '🎉', type: 'repeat', premium: true },
    { id: 'mondayKiller', icon: '💪', type: 'repeat', premium: true },
    { id: 'fridayFighter', icon: '🔥', type: 'repeat', premium: true },

    // 12. 특별 이벤트 (8개) - 전부 프리미엄
    { id: 'newYear', icon: '🎆', type: 'repeat', premium: true },
    { id: 'valentine', icon: '💝', type: 'repeat', premium: true },
    { id: 'leapDay', icon: '🐸', type: 'repeat', premium: true },
    { id: 'christmas', icon: '🎄', type: 'repeat', premium: true },
    { id: 'summer', icon: '🏖️', type: 'repeat', premium: true },
    { id: 'winter', icon: '❄️', type: 'repeat', premium: true },
    { id: 'yearEnd', icon: '🎇', type: 'repeat', premium: true },
    { id: 'newYearWeek', icon: '🌟', type: 'repeat', premium: true },

    // 13. 복귀/회복 (5개)
    { id: 'rest1week', icon: '😴', type: 'repeat', premium: false },
    { id: 'rest1month', icon: '🏖️', type: 'repeat', premium: false },
    { id: 'rest3month', icon: '🐻', type: 'repeat', premium: true },
    { id: 'comeback', icon: '🔄', type: 'repeat', premium: true },
    { id: 'phoenix', icon: '🔥', type: 'once', premium: true },

    // 14. 성장/PR (6개) - 전부 프리미엄
    { id: 'prFirst', icon: '🎯', type: 'once', premium: true },
    { id: 'pr10', icon: '🏹', type: 'once', premium: true },
    { id: 'pr25', icon: '🎯', type: 'once', premium: true },
    { id: 'pr50', icon: '⭐', type: 'once', premium: true },
    { id: 'pr100', icon: '💎', type: 'once', premium: true },
    { id: 'doubleUp', icon: '🔥', type: 'repeat', premium: true },

    // 15. 하드코어 도전 (6개) - 전부 프리미엄
    { id: 'perfectWeek', icon: '⭐', type: 'repeat', premium: true },
    { id: 'perfectMonth', icon: '🌟', type: 'repeat', premium: true },
    { id: 'spartan', icon: '⚔️', type: 'repeat', premium: true },
    { id: 'marathon', icon: '🏃', type: 'once', premium: true },
    { id: 'ultraMarathon', icon: '🏅', type: 'once', premium: true },
    { id: 'noExcuse', icon: '🦁', type: 'once', premium: true },
];

if (!data.achievements) data.achievements = {};
if (!data.prHistory) data.prHistory = {};

// ==================== 유틸리티 함수 ====================

function getAllRecordDatesForAchievements() {
    return Object.keys(getRecordsByDateIndex()).sort();
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
    const index = getRecordsByDateIndex();
    let total = 0;
    for (let i = 0; i < weekDates.length; i++) {
        const recs = index[weekDates[i]];
        if (recs) {
            for (let j = 0, len = recs.length; j < len; j++) {
                total += (recs[j].w || 0) * (recs[j].r || 0);
            }
        }
    }
    return total;
}

function getWeekWeight(weekDates) {
    const index = getRecordsByDateIndex();
    let total = 0, count = 0;
    for (let i = 0; i < weekDates.length; i++) {
        const recs = index[weekDates[i]];
        if (recs) {
            for (let j = 0, len = recs.length; j < len; j++) {
                if (recs[j].w > 0) { total += recs[j].w; count++; }
            }
        }
    }
    return count > 0 ? total / count : 0;
}

function getMonthVolume(year, month) {
    const index = getRecordsByDateIndex();
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    let total = 0;
    for (const dateStr in index) {
        if (dateStr.startsWith(prefix)) {
            const recs = index[dateStr];
            for (let i = 0, len = recs.length; i < len; i++) {
                total += (recs[i].w || 0) * (recs[i].r || 0);
            }
        }
    }
    return total;
}

function getMonthWeight(year, month) {
    const index = getRecordsByDateIndex();
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    let total = 0, count = 0;
    for (const dateStr in index) {
        if (dateStr.startsWith(prefix)) {
            const recs = index[dateStr];
            for (let i = 0, len = recs.length; i < len; i++) {
                if (recs[i].w > 0) { total += recs[i].w; count++; }
            }
        }
    }
    return count > 0 ? total / count : 0;
}

function getDayVolume(dateStr) {
    const index = getRecordsByDateIndex();
    const recs = index[dateStr];
    if (!recs) return 0;
    let total = 0;
    for (let i = 0, len = recs.length; i < len; i++) {
        total += (recs[i].w || 0) * (recs[i].r || 0);
    }
    return total;
}

function getDayReps(dateStr) {
    const index = getRecordsByDateIndex();
    const recs = index[dateStr];
    if (!recs) return 0;
    let total = 0;
    for (let i = 0, len = recs.length; i < len; i++) {
        total += recs[i].r || 0;
    }
    return total;
}

function getDayExerciseCount(dateStr) {
    const index = getRecordsByDateIndex();
    const recs = index[dateStr];
    if (!recs) return 0;
    const exIds = new Set();
    for (let i = 0, len = recs.length; i < len; i++) {
        exIds.add(recs[i].exerciseId);
    }
    return exIds.size;
}

function getMaxStreak(allDates) {
    if (!allDates.length) return 0;
    let maxStreak = 1, currentStreak = 1;
    for (let i = 1; i < allDates.length; i++) {
        const prev = parseLocalDate(allDates[i - 1]);
        const curr = parseLocalDate(allDates[i]);
        const diff = (curr - prev) / 86400000;
        if (diff === 1) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }
    return maxStreak;
}

function getHourFromDatetime(datetime) {
    const timePart = datetime.split('T')[1];
    if (!timePart) return 12;
    return parseInt(timePart.split(':')[0]) || 12;
}

function getWeeksWithMinDays(allDates, minDays, weeksNeeded) {
    if (allDates.length === 0) return 0;
    const dateSet = new Set(allDates);
    let consecutiveWeeks = 0;
    let maxConsecutive = 0;

    const lastDate = parseLocalDate(allDates[allDates.length - 1]);
    for (let w = 0; w < 52; w++) {
        const checkDate = new Date(lastDate);
        checkDate.setDate(checkDate.getDate() - (w * 7));
        const weekDates = getWeekDates(toDateStr(checkDate));
        const daysInWeek = weekDates.filter(d => dateSet.has(d)).length;

        if (daysInWeek >= minDays) {
            consecutiveWeeks++;
            maxConsecutive = Math.max(maxConsecutive, consecutiveWeeks);
        } else {
            consecutiveWeeks = 0;
        }
    }
    return maxConsecutive;
}

// ==================== 업적 체크 ====================

function checkAchievements() {
    if (!data.achievements) data.achievements = {};
    if (!data.prHistory) data.prHistory = {};

    const allDates = getAllRecordDatesForAchievements();
    const totalDays = allDates.length;
    const dateIndex = getRecordsByDateIndex();
    const dateSet = new Set(allDates);
    const totalSets = data.records.length;
    const totalReps = data.records.reduce((sum, r) => sum + (r.r || 0), 0);
    const totalVolume = data.records.reduce((sum, r) => sum + ((r.w || 0) * (r.r || 0)), 0);
    const maxWeight = data.records.reduce((max, r) => Math.max(max, r.w || 0), 0);
    const maxStreak = getMaxStreak(allDates);

    function addOnce(id) {
        if (!data.achievements[id]) {
            data.achievements[id] = { count: 1, date: today };
        }
    }

    function addRepeat(id, key, keyType = 'dates') {
        if (!data.achievements[id]) data.achievements[id] = { count: 0, [keyType]: [] };
        if (!data.achievements[id][keyType]) data.achievements[id][keyType] = [];
        if (!data.achievements[id][keyType].includes(key)) {
            data.achievements[id].count++;
            data.achievements[id][keyType].push(key);
        }
    }

    // 1. 누적 기록일
    if (totalDays >= 1) addOnce('firstRecord');
    if (totalDays >= 10) addOnce('total10');
    if (totalDays >= 30) addOnce('total30');
    if (totalDays >= 50) addOnce('total50');
    if (totalDays >= 100) addOnce('total100');
    if (totalDays >= 200) addOnce('total200');
    if (totalDays >= 365) addOnce('total365');
    if (totalDays >= 500) addOnce('total500');
    if (totalDays >= 730) addOnce('total730');
    if (totalDays >= 1000) addOnce('total1000');

    // 2. 연속 기록
    if (maxStreak >= 3) addOnce('first3days');
    if (maxStreak >= 7) addOnce('streak7');
    if (maxStreak >= 14) addOnce('streak14');
    if (maxStreak >= 30) addOnce('streak30');
    if (maxStreak >= 60) addOnce('streak60');
    if (maxStreak >= 90) addOnce('streak90');
    if (maxStreak >= 120) addOnce('streak120');
    if (maxStreak >= 180) addOnce('streak180');
    if (maxStreak >= 270) addOnce('streak270');
    if (maxStreak >= 365) addOnce('streak365');

    // 3. 주간 빈도
    const thisWeek = getWeekDates(today);
    const weekKey = thisWeek[0];
    const thisWeekDays = thisWeek.filter(d => dateSet.has(d)).length;

    if (getWeeksWithMinDays(allDates, 3, 4) >= 4) addRepeat('week3', weekKey, 'weeks');
    if (thisWeekDays >= 5) addRepeat('week5', weekKey, 'weeks');
    if (thisWeekDays >= 7) addRepeat('week7', weekKey, 'weeks');
    if (getWeeksWithMinDays(allDates, 3, 8) >= 8) addRepeat('week3for8', weekKey, 'weeks');
    if (getWeeksWithMinDays(allDates, 4, 12) >= 12) addRepeat('week4for12', weekKey, 'weeks');
    if (getWeeksWithMinDays(allDates, 5, 8) >= 8) addRepeat('week5for8', weekKey, 'weeks');

    // 4. 세트 수 마일스톤
    if (totalSets >= 100) addOnce('sets100');
    if (totalSets >= 500) addOnce('sets500');
    if (totalSets >= 1000) addOnce('sets1000');
    if (totalSets >= 2500) addOnce('sets2500');
    if (totalSets >= 5000) addOnce('sets5000');
    if (totalSets >= 10000) addOnce('sets10000');

    for (const dateStr of allDates) {
        const daySets = (dateIndex[dateStr] || []).length;
        if (daySets >= 10) addRepeat('daySet10', dateStr);
        if (daySets >= 20) addRepeat('daySet20', dateStr);
        if (daySets >= 30) addRepeat('daySet30', dateStr);
        if (daySets >= 50) addRepeat('daySet50', dateStr);
    }

    // 5. 볼륨 마일스톤
    if (totalVolume >= 100000) addOnce('totalVol100ton');
    if (totalVolume >= 500000) addOnce('totalVol500ton');
    if (totalVolume >= 1000000) addOnce('totalVol1000ton');
    if (totalVolume >= 5000000) addOnce('totalVol5000ton');

    for (const dateStr of allDates) {
        const dayVol = getDayVolume(dateStr);
        if (dayVol >= 1000) addRepeat('volume1ton', dateStr);
        if (dayVol >= 5000) addRepeat('volume5ton', dateStr);
        if (dayVol >= 10000) addRepeat('volume10ton', dateStr);
        if (dayVol >= 20000) addRepeat('volume20ton', dateStr);
    }

    // 6. 무게 기록
    if (maxWeight >= 60) addOnce('weight60');
    if (maxWeight >= 80) addOnce('weight80');
    if (maxWeight >= 100) addOnce('weight100');
    if (maxWeight >= 120) addOnce('weight120');
    if (maxWeight >= 140) addOnce('weight140');
    if (maxWeight >= 160) addOnce('weight160');

    // 7. 볼륨/무게 증가 - 주간
    const lastWeekStart = new Date(parseLocalDate(today));
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeek = getWeekDates(toDateStr(lastWeekStart));
    const thisWeekVol = getWeekVolume(thisWeek);
    const lastWeekVol = getWeekVolume(lastWeek);
    const thisWeekWt = getWeekWeight(thisWeek);
    const lastWeekWt = getWeekWeight(lastWeek);

    if (lastWeekVol > 0) {
        const ratio = thisWeekVol / lastWeekVol;
        if (ratio >= 1.01) addRepeat('volumeUpWeek1', weekKey, 'weeks');
        if (ratio >= 1.03) addRepeat('volumeUpWeek3', weekKey, 'weeks');
        if (ratio >= 1.05) addRepeat('volumeUpWeek5', weekKey, 'weeks');
        if (ratio >= 1.10) addRepeat('volumeUpWeek10', weekKey, 'weeks');
    }

    if (lastWeekWt > 0) {
        const ratio = thisWeekWt / lastWeekWt;
        if (ratio >= 1.01) addRepeat('heavyWeek1', weekKey, 'weeks');
        if (ratio >= 1.03) addRepeat('heavyWeek3', weekKey, 'weeks');
        if (ratio >= 1.05) addRepeat('heavyWeek5', weekKey, 'weeks');
        if (ratio >= 1.10) addRepeat('heavyWeek10', weekKey, 'weeks');
    }

    // 8. 볼륨/무게 증가 - 월간
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    const monthKey = `${thisYear}-${thisMonth}`;
    const thisMonthVol = getMonthVolume(thisYear, thisMonth);
    const lastMonthVol = getMonthVolume(lastMonthYear, lastMonth);
    const thisMonthWt = getMonthWeight(thisYear, thisMonth);
    const lastMonthWt = getMonthWeight(lastMonthYear, lastMonth);

    if (lastMonthVol > 0) {
        const ratio = thisMonthVol / lastMonthVol;
        if (ratio >= 1.01) addRepeat('volumeUpMonth1', monthKey, 'months');
        if (ratio >= 1.03) addRepeat('volumeUpMonth3', monthKey, 'months');
        if (ratio >= 1.05) addRepeat('volumeUpMonth5', monthKey, 'months');
        if (ratio >= 1.10) addRepeat('volumeUpMonth10', monthKey, 'months');
    }

    if (lastMonthWt > 0) {
        const ratio = thisMonthWt / lastMonthWt;
        if (ratio >= 1.01) addRepeat('heavyMonth1', monthKey, 'months');
        if (ratio >= 1.03) addRepeat('heavyMonth3', monthKey, 'months');
        if (ratio >= 1.05) addRepeat('heavyMonth5', monthKey, 'months');
        if (ratio >= 1.10) addRepeat('heavyMonth10', monthKey, 'months');
    }

    // 9. 렙수 마일스톤
    if (totalReps >= 1000) addOnce('reps1000');
    if (totalReps >= 5000) addOnce('reps5000');
    if (totalReps >= 10000) addOnce('reps10000');
    if (totalReps >= 50000) addOnce('reps50000');

    for (const dateStr of allDates) {
        const dayReps = getDayReps(dateStr);
        if (dayReps >= 100) addRepeat('dayReps100', dateStr);
        if (dayReps >= 200) addRepeat('dayReps200', dateStr);
    }

    // 10. 운동 다양성
    const exerciseCount = data.exercises.length;
    if (exerciseCount >= 5) addOnce('exercise5');
    if (exerciseCount >= 10) addOnce('exercise10');
    if (exerciseCount >= 20) addOnce('exercise20');

    for (const dateStr of allDates) {
        const exCount = getDayExerciseCount(dateStr);
        if (exCount >= 3) addRepeat('dayEx3', dateStr);
        if (exCount >= 5) addRepeat('dayEx5', dateStr);
        if (exCount >= 7) addRepeat('dayEx7', dateStr);
    }

    // 11. 시간대/요일
    let earlyCount = 0, nightCount = 0;
    for (const r of data.records) {
        const hour = getHourFromDatetime(r.datetime);
        if (hour < 6) earlyCount++;
        if (hour >= 22) nightCount++;
    }

    for (const r of data.records) {
        const hour = getHourFromDatetime(r.datetime);
        const dateStr = r.datetime.split('T')[0];
        if (hour < 6) addRepeat('earlyBird', dateStr);
        if (hour >= 22) addRepeat('nightOwl', dateStr);
    }

    if (earlyCount >= 10) addOnce('earlyBird10');
    if (nightCount >= 10) addOnce('nightOwl10');

    // 주말 전사 (토,일 둘 다)
    for (const dateStr of allDates) {
        const d = parseLocalDate(dateStr);
        if (d.getDay() === 6) { // 토요일
            const sundayStr = toDateStr(new Date(d.getTime() + 86400000));
            if (dateSet.has(sundayStr)) {
                addRepeat('weekend', dateStr, 'weeks');
            }
        }
    }

    // 월/금 연속 4주
    const mondayDates = allDates.filter(d => parseLocalDate(d).getDay() === 1);
    const fridayDates = allDates.filter(d => parseLocalDate(d).getDay() === 5);

    if (getConsecutiveWeekdayWeeks(mondayDates) >= 4) addRepeat('mondayKiller', weekKey, 'weeks');
    if (getConsecutiveWeekdayWeeks(fridayDates) >= 4) addRepeat('fridayFighter', weekKey, 'weeks');

    // 12. 특별 이벤트
    for (const dateStr of allDates) {
        const [y, m, d] = dateStr.split('-');
        if (m === '01' && d === '01') addRepeat('newYear', dateStr);
        if (m === '02' && d === '14') addRepeat('valentine', dateStr);
        if (m === '02' && d === '29') addRepeat('leapDay', dateStr);
        if (m === '12' && d === '25') addRepeat('christmas', dateStr);
        if (parseInt(d) >= 27 && m === '12') addRepeat('yearEnd', y, 'years');
    }

    // 썸머 바디 (7,8월 20일)
    const summerMonths = allDates.filter(d => {
        const m = d.split('-')[1];
        return m === '07' || m === '08';
    });
    const summerByYear = {};
    for (const d of summerMonths) {
        const y = d.split('-')[0];
        summerByYear[y] = (summerByYear[y] || 0) + 1;
    }
    for (const y in summerByYear) {
        if (summerByYear[y] >= 20) addRepeat('summer', y, 'years');
    }

    // 겨울 전사 (12,1,2월 30일)
    const winterMonths = allDates.filter(d => {
        const m = d.split('-')[1];
        return m === '12' || m === '01' || m === '02';
    });
    if (winterMonths.length >= 30) addRepeat('winter', thisYear.toString(), 'years');

    // 새해 첫 주 (1월 1-7일 중 3일)
    const janFirstWeek = allDates.filter(d => {
        const [y, m, day] = d.split('-');
        return m === '01' && parseInt(day) <= 7;
    });
    const janByYear = {};
    for (const d of janFirstWeek) {
        const y = d.split('-')[0];
        janByYear[y] = (janByYear[y] || 0) + 1;
    }
    for (const y in janByYear) {
        if (janByYear[y] >= 3) addRepeat('newYearWeek', y, 'years');
    }

    // 13. 복귀/회복
    if (allDates.length > 0) {
        const lastRecord = parseLocalDate(allDates[allDates.length - 1]);
        const daysSince = Math.floor((parseLocalDate(today) - lastRecord) / 86400000);
        const restKey = allDates[allDates.length - 1];
        if (daysSince >= 7) addRepeat('rest1week', restKey, 'periods');
        if (daysSince >= 30) addRepeat('rest1month', restKey, 'periods');
        if (daysSince >= 90) addRepeat('rest3month', restKey, 'periods');
    }

    // comeback 체크 (7일 휴식 후 복귀)
    let comebackCount = 0;
    for (let i = 1; i < allDates.length; i++) {
        const prev = parseLocalDate(allDates[i - 1]);
        const curr = parseLocalDate(allDates[i]);
        const gap = (curr - prev) / 86400000;
        if (gap >= 7) {
            addRepeat('comeback', allDates[i]);
            if (gap >= 30) comebackCount++;
        }
    }
    if (comebackCount >= 3) addOnce('phoenix');

    // 14. 성장/PR
    let prCount = 0;
    const exercisePRs = {};
    for (const r of data.records) {
        const exId = r.exerciseId;
        const w = r.w || 0;
        if (!exercisePRs[exId] || w > exercisePRs[exId]) {
            if (exercisePRs[exId]) prCount++;
            exercisePRs[exId] = w;
        }
    }
    data.prHistory = exercisePRs;

    if (prCount >= 1) addOnce('prFirst');
    if (prCount >= 10) addOnce('pr10');
    if (prCount >= 25) addOnce('pr25');
    if (prCount >= 50) addOnce('pr50');
    if (prCount >= 100) addOnce('pr100');

    // doubleUp 체크
    const firstWeights = {};
    for (const r of data.records) {
        if (!firstWeights[r.exerciseId] && r.w > 0) {
            firstWeights[r.exerciseId] = r.w;
        }
    }
    for (const exId in exercisePRs) {
        if (firstWeights[exId] && exercisePRs[exId] >= firstWeights[exId] * 2) {
            addRepeat('doubleUp', exId, 'exercises');
        }
    }

    // 15. 하드코어 도전
    if (maxStreak >= 7) addRepeat('perfectWeek', weekKey, 'weeks');

    // perfectMonth 체크 (한 달 매일)
    const monthDays = {};
    for (const d of allDates) {
        const ym = d.substring(0, 7);
        monthDays[ym] = (monthDays[ym] || 0) + 1;
    }
    for (const ym in monthDays) {
        const [y, m] = ym.split('-').map(Number);
        const daysInMonth = new Date(y, m, 0).getDate();
        if (monthDays[ym] >= daysInMonth) {
            addRepeat('perfectMonth', ym, 'months');
        }
    }

    if (getWeeksWithMinDays(allDates, 4, 12) >= 12) addRepeat('spartan', weekKey, 'weeks');
    if (getWeeksWithMinDays(allDates, 3, 26) >= 26) addOnce('marathon');
    if (getWeeksWithMinDays(allDates, 3, 52) >= 52) addOnce('ultraMarathon');
    if (getWeeksWithMinDays(allDates, 5, 12) >= 12) addOnce('noExcuse');

    save();
}

function getConsecutiveWeekdayWeeks(dates) {
    if (dates.length === 0) return 0;
    let max = 1, current = 1;
    for (let i = 1; i < dates.length; i++) {
        const prev = parseLocalDate(dates[i - 1]);
        const curr = parseLocalDate(dates[i]);
        const diff = (curr - prev) / 86400000;
        if (diff === 7) {
            current++;
            max = Math.max(max, current);
        } else if (diff > 7) {
            current = 1;
        }
    }
    return max;
}

// ==================== 렌더링 ====================

function renderAchievements() {
    checkAchievements();

    const liteAchievements = ACHIEVEMENTS.filter(a => !a.premium);
    const premiumAchievements = ACHIEVEMENTS.filter(a => a.premium);

    const achievedLite = liteAchievements.filter(a => data.achievements[a.id]);
    const lockedLite = liteAchievements.filter(a => !data.achievements[a.id]);
    const achievedPremium = premiumAchievements.filter(a => data.achievements[a.id]);
    const lockedPremium = premiumAchievements.filter(a => !data.achievements[a.id]);

    let totalCount = 0;
    for (const a of ACHIEVEMENTS) {
        if (data.achievements[a.id]) {
            totalCount += data.achievements[a.id].count || 0;
        }
    }

    const allDates = getAllRecordDatesForAchievements();
    const achievedCount = isPremium
        ? achievedLite.length + achievedPremium.length
        : achievedLite.length;
    const totalAchievements = isPremium
        ? ACHIEVEMENTS.length
        : liteAchievements.length;

    document.getElementById('achievementSummary').innerHTML = `
        <div class="achievement-stat">
            <div class="achievement-stat-value">${achievedCount}/${totalAchievements}</div>
            <div class="achievement-stat-label">${t('achievedCount')}</div>
        </div>
        <div class="achievement-stat">
            <div class="achievement-stat-value">${totalCount}</div>
            <div class="achievement-stat-label">${t('totalAchievements')}</div>
        </div>
        <div class="achievement-stat">
            <div class="achievement-stat-value">${allDates.length}</div>
            <div class="achievement-stat-label">${t('totalRecordDays')}</div>
        </div>
    `;

    function renderItem(a, isLocked) {
        const d = data.achievements[a.id];
        const premiumLock = !isPremium && a.premium;
        const locked = isLocked || premiumLock;
        const achText = getAchievementText(a.id);

        // 상태 표시: 달성 / 미달성 / 프리미엄 잠금
        let statusHtml = '';
        if (!locked) {
            // 달성
            statusHtml = a.type === 'repeat'
                ? `<div class="achievement-count">×${d.count}</div>`
                : '<span class="achievement-check">✓</span>';
        } else if (premiumLock) {
            // 프리미엄 잠금
            statusHtml = '<span class="achievement-lock">🔒</span>';
        } else {
            // 미달성 (라이트)
            statusHtml = `<span class="achievement-pending">${t('challenge')}</span>`;
        }

        return `<div class="achievement-item${locked ? ' locked' : ''}${premiumLock ? ' premium-locked' : ''}">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">${achText.title}${premiumLock ? ' <span class="premium-badge">PRO</span>' : ''}</div>
                <div class="achievement-desc">${achText.desc}</div>
            </div>
            ${statusHtml}
        </div>`;
    }

    let html = '';

    // 달성한 업적
    const achieved = isPremium
        ? [...achievedLite, ...achievedPremium]
        : achievedLite;

    if (achieved.length > 0) {
        html += achieved.map(a => renderItem(a, false)).join('');
    }

    // 미달성 라이트
    html += lockedLite.map(a => renderItem(a, true)).join('');

    // 프리미엄 섹션
    if (isPremium) {
        html += lockedPremium.map(a => renderItem(a, true)).join('');
    } else {
        // 프리미엄 미션 미리보기 (잠금 상태)
        html += `<div class="premium-section-header" onclick="showUpgradePrompt('${t('premiumAchievements')}')">
            <span>${t('premiumAchievements')}</span>
            <span class="premium-count">${premiumAchievements.length}</span>
        </div>`;
        html += premiumAchievements.slice(0, 5).map(a => renderItem(a, true)).join('');
        if (premiumAchievements.length > 5) {
            html += `<div class="premium-more" onclick="showUpgradePrompt('${t('premiumAchievements')}')">
                ${t('moreAchievements', premiumAchievements.length - 5)}
            </div>`;
        }
    }

    document.getElementById('achievementList').innerHTML = html;
}
