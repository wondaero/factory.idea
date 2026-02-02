// ==================== 업적 시스템 ====================

const ACHIEVEMENTS = [
    { id: 'firstRecord', title: '시작이 반', desc: '첫 운동 기록', icon: '🎯', type: 'once' },
    { id: 'first3days', title: '작심삼일극복', desc: '앱 등록 후 연속 3일 기록', icon: '🔥', type: 'once' },
    { id: 'total50', title: '오십보백보', desc: '총 50일 기록 달성', icon: '👟', type: 'once' },
    { id: 'total100', title: '백전백승', desc: '총 100일 기록 달성', icon: '💯', type: 'once' },
    { id: 'week3', title: '주 3회', desc: '한 주에 3일 이상 운동 (4주 연속)', icon: '📅', type: 'repeat' },
    { id: 'week5', title: '주5일제', desc: '한 주에 5일 운동', icon: '📆', type: 'repeat' },
    { id: 'week7', title: '체육관관장님?', desc: '한 주에 7일 운동', icon: '🏆', type: 'repeat' },
    { id: 'volumeUpWeek1', title: '볼륨업 (3등급)', desc: '전주 대비 볼륨 1% 증가', icon: '📈', type: 'repeat' },
    { id: 'volumeUpWeek3', title: '볼륨업 (2등급)', desc: '전주 대비 볼륨 3% 증가', icon: '📈', type: 'repeat' },
    { id: 'volumeUpWeek5', title: '볼륨업 (1등급)', desc: '전주 대비 볼륨 5% 증가', icon: '📈', type: 'repeat' },
    { id: 'volumeUpWeek10', title: '볼륨업 (0등급)', desc: '전주 대비 볼륨 10% 증가', icon: '📈', type: 'repeat' },
    { id: 'volumeUpMonth1', title: '메가볼륨 (3등급)', desc: '전월 대비 볼륨 1% 증가', icon: '🚀', type: 'repeat' },
    { id: 'volumeUpMonth3', title: '메가볼륨 (2등급)', desc: '전월 대비 볼륨 3% 증가', icon: '🚀', type: 'repeat' },
    { id: 'volumeUpMonth5', title: '메가볼륨 (1등급)', desc: '전월 대비 볼륨 5% 증가', icon: '🚀', type: 'repeat' },
    { id: 'volumeUpMonth10', title: '메가볼륨 (0등급)', desc: '전월 대비 볼륨 10% 증가', icon: '🚀', type: 'repeat' },
    { id: 'heavyWeek1', title: '웨이팅 (3등급)', desc: '전주 대비 무게 1% 증가', icon: '🏋️', type: 'repeat' },
    { id: 'heavyWeek3', title: '웨이팅 (2등급)', desc: '전주 대비 무게 3% 증가', icon: '🏋️', type: 'repeat' },
    { id: 'heavyWeek5', title: '웨이팅 (1등급)', desc: '전주 대비 무게 5% 증가', icon: '🏋️', type: 'repeat' },
    { id: 'heavyWeek10', title: '웨이팅 (0등급)', desc: '전주 대비 무게 10% 증가', icon: '🏋️', type: 'repeat' },
    { id: 'heavyMonth1', title: '슈퍼웨이팅 (3등급)', desc: '전월 대비 무게 1% 증가', icon: '💪', type: 'repeat' },
    { id: 'heavyMonth3', title: '슈퍼웨이팅 (2등급)', desc: '전월 대비 무게 3% 증가', icon: '💪', type: 'repeat' },
    { id: 'heavyMonth5', title: '슈퍼웨이팅 (1등급)', desc: '전월 대비 무게 5% 증가', icon: '💪', type: 'repeat' },
    { id: 'heavyMonth10', title: '슈퍼웨이팅 (0등급)', desc: '전월 대비 무게 10% 증가', icon: '💪', type: 'repeat' },
    { id: 'rest1week', title: '언제까지 회복기간?', desc: '1주일 기록 없음', icon: '😴', type: 'repeat' },
    { id: 'rest1month', title: '지금은 휴가중', desc: '한 달 기록 없음', icon: '🏖️', type: 'repeat' },
    { id: 'rest3month', title: '동면시간?', desc: '3달 기록 없음', icon: '🐻', type: 'repeat' },
];

if (!data.achievements) data.achievements = {};

// 캐시된 인덱스 활용
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

// Set 사용으로 O(1) lookup
function getWeekVolume(weekDates) {
    const dateSet = new Set(weekDates);
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

function checkAchievements() {
    if (!data.achievements) data.achievements = {};
    const allDates = getAllRecordDatesForAchievements();
    const totalDays = allDates.length;
    const dateIndex = getRecordsByDateIndex();

    function addRepeat(id, key, keyType = 'weeks') {
        if (!data.achievements[id]) data.achievements[id] = { count: 0, [keyType]: [] };
        if (!data.achievements[id][keyType].includes(key)) {
            data.achievements[id].count++;
            data.achievements[id][keyType].push(key);
        }
    }

    // 일회성 업적
    if (!data.achievements.firstRecord && totalDays >= 1)
        data.achievements.firstRecord = { count: 1, date: allDates[0] };

    if (!data.achievements.first3days && allDates.length >= 3) {
        let consecutive = true;
        for (let i = 1; i < 3; i++) {
            const prev = parseLocalDate(allDates[i-1]);
            const curr = parseLocalDate(allDates[i]);
            if ((curr - prev) / 86400000 !== 1) { consecutive = false; break; }
        }
        if (consecutive) data.achievements.first3days = { count: 1, date: today };
    }

    if (!data.achievements.total50 && totalDays >= 50)
        data.achievements.total50 = { count: 1, date: today };
    if (!data.achievements.total100 && totalDays >= 100)
        data.achievements.total100 = { count: 1, date: today };

    // 주간 업적
    const thisWeek = getWeekDates(today);
    const lastWeekStart = new Date(parseLocalDate(today));
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeek = getWeekDates(toDateStr(lastWeekStart));

    const dateSet = new Set(allDates);
    const thisWeekDays = thisWeek.filter(d => dateSet.has(d)).length;
    const weekKey = thisWeek[0];

    // 주 3회 (4주 연속)
    let week3Count = 0;
    for (let w = 0; w < 4; w++) {
        const checkStart = new Date(parseLocalDate(today));
        checkStart.setDate(checkStart.getDate() - (w * 7));
        const checkWeek = getWeekDates(toDateStr(checkStart));
        if (checkWeek.filter(d => dateSet.has(d)).length >= 3) week3Count++;
        else break;
    }
    if (week3Count >= 4) addRepeat('week3', weekKey);
    if (thisWeekDays >= 5) addRepeat('week5', weekKey);
    if (thisWeekDays >= 7) addRepeat('week7', weekKey);

    // 볼륨/무게 (주)
    const thisWeekVol = getWeekVolume(thisWeek);
    const lastWeekVol = getWeekVolume(lastWeek);
    if (lastWeekVol > 0) {
        const ratio = thisWeekVol / lastWeekVol;
        if (ratio >= 1.01) addRepeat('volumeUpWeek1', weekKey);
        if (ratio >= 1.03) addRepeat('volumeUpWeek3', weekKey);
        if (ratio >= 1.05) addRepeat('volumeUpWeek5', weekKey);
        if (ratio >= 1.10) addRepeat('volumeUpWeek10', weekKey);
    }

    const thisWeekWt = getWeekWeight(thisWeek);
    const lastWeekWt = getWeekWeight(lastWeek);
    if (lastWeekWt > 0) {
        const ratio = thisWeekWt / lastWeekWt;
        if (ratio >= 1.01) addRepeat('heavyWeek1', weekKey);
        if (ratio >= 1.03) addRepeat('heavyWeek3', weekKey);
        if (ratio >= 1.05) addRepeat('heavyWeek5', weekKey);
        if (ratio >= 1.10) addRepeat('heavyWeek10', weekKey);
    }

    // 월간 업적
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    const monthKey = `${thisYear}-${thisMonth}`;

    const thisMonthVol = getMonthVolume(thisYear, thisMonth);
    const lastMonthVol = getMonthVolume(lastMonthYear, lastMonth);
    if (lastMonthVol > 0) {
        const ratio = thisMonthVol / lastMonthVol;
        if (ratio >= 1.01) addRepeat('volumeUpMonth1', monthKey, 'months');
        if (ratio >= 1.03) addRepeat('volumeUpMonth3', monthKey, 'months');
        if (ratio >= 1.05) addRepeat('volumeUpMonth5', monthKey, 'months');
        if (ratio >= 1.10) addRepeat('volumeUpMonth10', monthKey, 'months');
    }

    const thisMonthWt = getMonthWeight(thisYear, thisMonth);
    const lastMonthWt = getMonthWeight(lastMonthYear, lastMonth);
    if (lastMonthWt > 0) {
        const ratio = thisMonthWt / lastMonthWt;
        if (ratio >= 1.01) addRepeat('heavyMonth1', monthKey, 'months');
        if (ratio >= 1.03) addRepeat('heavyMonth3', monthKey, 'months');
        if (ratio >= 1.05) addRepeat('heavyMonth5', monthKey, 'months');
        if (ratio >= 1.10) addRepeat('heavyMonth10', monthKey, 'months');
    }

    // 휴식 업적
    if (allDates.length > 0) {
        const lastRecord = parseLocalDate(allDates[allDates.length - 1]);
        const daysSince = Math.floor((parseLocalDate(today) - lastRecord) / 86400000);
        const restKey = allDates[allDates.length - 1];
        if (daysSince >= 7) addRepeat('rest1week', restKey, 'periods');
        if (daysSince >= 30) addRepeat('rest1month', restKey, 'periods');
        if (daysSince >= 90) addRepeat('rest3month', restKey, 'periods');
    }

    save();
}

function renderAchievements() {
    checkAchievements();

    const achieved = [];
    const locked = [];
    let totalCount = 0;

    for (let i = 0, len = ACHIEVEMENTS.length; i < len; i++) {
        const a = ACHIEVEMENTS[i];
        if (data.achievements[a.id]) {
            achieved.push(a);
            totalCount += data.achievements[a.id].count || 0;
        } else locked.push(a);
    }

    const allDates = getAllRecordDatesForAchievements();

    document.getElementById('achievementSummary').innerHTML = `
        <div class="achievement-stat"><div class="achievement-stat-value">${achieved.length}</div><div class="achievement-stat-label">달성 업적</div></div>
        <div class="achievement-stat"><div class="achievement-stat-value">${totalCount}</div><div class="achievement-stat-label">총 달성 횟수</div></div>
        <div class="achievement-stat"><div class="achievement-stat-value">${allDates.length}</div><div class="achievement-stat-label">총 기록일</div></div>
    `;

    const all = achieved.concat(locked);
    const html = [];
    for (let i = 0, len = all.length; i < len; i++) {
        const a = all[i];
        const d = data.achievements[a.id];
        const isLocked = !d;
        html.push(`<div class="achievement-item${isLocked ? ' locked' : ''}">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-info"><div class="achievement-title">${a.title}</div><div class="achievement-desc">${a.desc}</div></div>
            ${!isLocked && a.type === 'repeat' ? `<div class="achievement-count">×${d.count}</div>` : ''}
            ${!isLocked && a.type === 'once' ? '<span class="achievement-check">✓</span>' : ''}
        </div>`);
    }
    document.getElementById('achievementList').innerHTML = html.join('');
}
