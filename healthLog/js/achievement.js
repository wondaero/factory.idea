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
    // 반복형 업적 - 볼륨 (주)
    { id: 'volumeUpWeek1', title: '볼륨업 (3등급)', desc: '전주 대비 볼륨 1% 증가', icon: '📈', type: 'repeat' },
    { id: 'volumeUpWeek3', title: '볼륨업 (2등급)', desc: '전주 대비 볼륨 3% 증가', icon: '📈', type: 'repeat' },
    { id: 'volumeUpWeek5', title: '볼륨업 (1등급)', desc: '전주 대비 볼륨 5% 증가', icon: '📈', type: 'repeat' },
    { id: 'volumeUpWeek10', title: '볼륨업 (0등급)', desc: '전주 대비 볼륨 10% 증가', icon: '📈', type: 'repeat' },
    // 반복형 업적 - 볼륨 (월)
    { id: 'volumeUpMonth1', title: '메가볼륨 (3등급)', desc: '전월 대비 볼륨 1% 증가', icon: '🚀', type: 'repeat' },
    { id: 'volumeUpMonth3', title: '메가볼륨 (2등급)', desc: '전월 대비 볼륨 3% 증가', icon: '🚀', type: 'repeat' },
    { id: 'volumeUpMonth5', title: '메가볼륨 (1등급)', desc: '전월 대비 볼륨 5% 증가', icon: '🚀', type: 'repeat' },
    { id: 'volumeUpMonth10', title: '메가볼륨 (0등급)', desc: '전월 대비 볼륨 10% 증가', icon: '🚀', type: 'repeat' },
    // 반복형 업적 - 무게 (주)
    { id: 'heavyWeek1', title: '웨이팅 (3등급)', desc: '전주 대비 무게 1% 증가', icon: '🏋️', type: 'repeat' },
    { id: 'heavyWeek3', title: '웨이팅 (2등급)', desc: '전주 대비 무게 3% 증가', icon: '🏋️', type: 'repeat' },
    { id: 'heavyWeek5', title: '웨이팅 (1등급)', desc: '전주 대비 무게 5% 증가', icon: '🏋️', type: 'repeat' },
    { id: 'heavyWeek10', title: '웨이팅 (0등급)', desc: '전주 대비 무게 10% 증가', icon: '🏋️', type: 'repeat' },
    // 반복형 업적 - 무게 (월)
    { id: 'heavyMonth1', title: '슈퍼웨이팅 (3등급)', desc: '전월 대비 무게 1% 증가', icon: '💪', type: 'repeat' },
    { id: 'heavyMonth3', title: '슈퍼웨이팅 (2등급)', desc: '전월 대비 무게 3% 증가', icon: '💪', type: 'repeat' },
    { id: 'heavyMonth5', title: '슈퍼웨이팅 (1등급)', desc: '전월 대비 무게 5% 증가', icon: '💪', type: 'repeat' },
    { id: 'heavyMonth10', title: '슈퍼웨이팅 (0등급)', desc: '전월 대비 무게 10% 증가', icon: '💪', type: 'repeat' },
    // 휴식 업적
    { id: 'rest1week', title: '언제까지 회복기간?', desc: '1주일 기록 없음', icon: '😴', type: 'repeat' },
    { id: 'rest1month', title: '지금은 휴가중', desc: '한 달 기록 없음', icon: '🏖️', type: 'repeat' },
    { id: 'rest3month', title: '동면시간?', desc: '3달 기록 없음', icon: '🐻', type: 'repeat' },
];

// 업적 데이터 초기화
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

    function addRepeatAchievement(id, key, keyType = 'weeks') {
        if (!data.achievements[id]) data.achievements[id] = { count: 0, [keyType]: [] };
        if (!data.achievements[id][keyType].includes(key)) {
            data.achievements[id].count++;
            data.achievements[id][keyType].push(key);
        }
    }

    // 시작이 반
    if (!data.achievements.firstRecord && totalDays >= 1) {
        data.achievements.firstRecord = { count: 1, date: allDates[0] };
    }

    // 작심삼일극복
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

    // 오십보백보
    if (!data.achievements.total50 && totalDays >= 50) {
        data.achievements.total50 = { count: 1, date: today };
    }

    // 백전백승
    if (!data.achievements.total100 && totalDays >= 100) {
        data.achievements.total100 = { count: 1, date: today };
    }

    // 주간 업적
    const thisWeek = getWeekDates(today);
    const lastWeekStart = new Date(parseLocalDate(today));
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeek = getWeekDates(toDateStr(lastWeekStart));

    const thisWeekDays = allDates.filter(d => thisWeek.includes(d)).length;
    const weekKey = thisWeek[0];

    // 주 3회 (4주 연속)
    let week3Consecutive = 0;
    for (let w = 0; w < 4; w++) {
        const checkWeekStart = new Date(parseLocalDate(today));
        checkWeekStart.setDate(checkWeekStart.getDate() - (w * 7));
        const checkWeek = getWeekDates(toDateStr(checkWeekStart));
        const checkWeekDays = allDates.filter(d => checkWeek.includes(d)).length;
        if (checkWeekDays >= 3) week3Consecutive++;
        else break;
    }
    if (week3Consecutive >= 4) addRepeatAchievement('week3', weekKey);

    if (thisWeekDays >= 5) addRepeatAchievement('week5', weekKey);
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

    // 월간 업적
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

    // 휴식 업적
    if (allDates.length > 0) {
        const lastRecordDate = parseLocalDate(allDates[allDates.length - 1]);
        const todayDate = parseLocalDate(today);
        const daysSinceLastRecord = Math.floor((todayDate - lastRecordDate) / (1000 * 60 * 60 * 24));
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
