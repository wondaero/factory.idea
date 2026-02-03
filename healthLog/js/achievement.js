// ==================== 업적 시스템 ====================

const ACHIEVEMENTS = [
    // 1. 누적 기록일 (10개)
    { id: 'firstRecord', title: '시작이 반', desc: '첫 운동 기록', icon: '🎯', type: 'once', premium: false },
    { id: 'total10', title: '열흘의 기적', desc: '총 10일 기록', icon: '🔟', type: 'once', premium: false },
    { id: 'total30', title: '한 달 전사', desc: '총 30일 기록', icon: '📅', type: 'once', premium: false },
    { id: 'total50', title: '오십보백보', desc: '총 50일 기록', icon: '👟', type: 'once', premium: false },
    { id: 'total100', title: '백전백승', desc: '총 100일 기록', icon: '💯', type: 'once', premium: false },
    { id: 'total200', title: '이백승', desc: '총 200일 기록', icon: '🏅', type: 'once', premium: true },
    { id: 'total365', title: '1년 개근', desc: '총 365일 기록', icon: '🎖️', type: 'once', premium: true },
    { id: 'total500', title: '오백승', desc: '총 500일 기록', icon: '🏆', type: 'once', premium: true },
    { id: 'total730', title: '2년 누적', desc: '총 730일 기록', icon: '👑', type: 'once', premium: true },
    { id: 'total1000', title: '천일의 약속', desc: '총 1000일 기록', icon: '💎', type: 'once', premium: true },

    // 2. 연속 기록 (10개)
    { id: 'first3days', title: '작심삼일극복', desc: '3일 연속 기록', icon: '🔥', type: 'once', premium: false },
    { id: 'streak7', title: '일주일 불꽃', desc: '7일 연속 기록', icon: '🔥', type: 'once', premium: false },
    { id: 'streak14', title: '2주 마라톤', desc: '14일 연속 기록', icon: '🏃', type: 'once', premium: false },
    { id: 'streak30', title: '한 달 철인', desc: '30일 연속 기록', icon: '🦾', type: 'once', premium: false },
    { id: 'streak60', title: '60일 전설', desc: '60일 연속 기록', icon: '⭐', type: 'once', premium: true },
    { id: 'streak90', title: '분기의 왕', desc: '90일 연속 기록', icon: '🌟', type: 'once', premium: true },
    { id: 'streak120', title: '4개월 괴물', desc: '120일 연속 기록', icon: '💫', type: 'once', premium: true },
    { id: 'streak180', title: '반년 괴물', desc: '180일 연속 기록', icon: '🔱', type: 'once', premium: true },
    { id: 'streak270', title: '9개월 전사', desc: '270일 연속 기록', icon: '⚔️', type: 'once', premium: true },
    { id: 'streak365', title: '1년 무결석', desc: '365일 연속 기록', icon: '👑', type: 'once', premium: true },

    // 3. 주간 빈도 (6개)
    { id: 'week3', title: '주 3회', desc: '한 주에 3일 이상 (4주 연속)', icon: '📅', type: 'repeat', premium: false },
    { id: 'week5', title: '주5일제', desc: '한 주에 5일 운동', icon: '📆', type: 'repeat', premium: false },
    { id: 'week7', title: '체육관관장님?', desc: '한 주에 7일 운동', icon: '🏆', type: 'repeat', premium: true },
    { id: 'week3for8', title: '꾸준함의 정석', desc: '8주 연속 주 3일 이상', icon: '🎯', type: 'repeat', premium: true },
    { id: 'week4for12', title: '분기 정복자', desc: '12주 연속 주 4일 이상', icon: '🏅', type: 'repeat', premium: true },
    { id: 'week5for8', title: '아이언맨', desc: '8주 연속 주 5일 이상', icon: '🦸', type: 'repeat', premium: true },

    // 4. 세트 수 마일스톤 (10개)
    { id: 'sets100', title: '백 세트 돌파', desc: '총 100세트 달성', icon: '💪', type: 'once', premium: false },
    { id: 'sets500', title: '오백 세트', desc: '총 500세트 달성', icon: '🏋️', type: 'once', premium: false },
    { id: 'sets1000', title: '천 세트 클럽', desc: '총 1000세트 달성', icon: '🎯', type: 'once', premium: false },
    { id: 'sets2500', title: '이천오백 세트', desc: '총 2500세트 달성', icon: '⚡', type: 'once', premium: true },
    { id: 'sets5000', title: '세트 마스터', desc: '총 5000세트 달성', icon: '🔥', type: 'once', premium: true },
    { id: 'sets10000', title: '만 세트 레전드', desc: '총 10000세트 달성', icon: '💎', type: 'once', premium: true },
    { id: 'daySet10', title: '오늘 좀 치네', desc: '하루 10세트 이상', icon: '💥', type: 'repeat', premium: false },
    { id: 'daySet20', title: '하루종일 운동', desc: '하루 20세트 이상', icon: '🔥', type: 'repeat', premium: true },
    { id: 'daySet30', title: '세트 폭격기', desc: '하루 30세트 이상', icon: '💣', type: 'repeat', premium: true },
    { id: 'daySet50', title: '세트 괴물', desc: '하루 50세트 이상', icon: '👹', type: 'repeat', premium: true },

    // 5. 볼륨 마일스톤 (8개) - 전부 프리미엄
    { id: 'volume1ton', title: '1톤 클럽', desc: '하루 총 볼륨 1,000kg', icon: '🏋️', type: 'repeat', premium: true },
    { id: 'volume5ton', title: '5톤 괴물', desc: '하루 총 볼륨 5,000kg', icon: '💪', type: 'repeat', premium: true },
    { id: 'volume10ton', title: '10톤 트럭', desc: '하루 총 볼륨 10,000kg', icon: '🚛', type: 'repeat', premium: true },
    { id: 'volume20ton', title: '20톤 괴력', desc: '하루 총 볼륨 20,000kg', icon: '🦍', type: 'repeat', premium: true },
    { id: 'totalVol100ton', title: '100톤 누적', desc: '누적 볼륨 100,000kg', icon: '🏅', type: 'once', premium: true },
    { id: 'totalVol500ton', title: '500톤 누적', desc: '누적 볼륨 500,000kg', icon: '🏆', type: 'once', premium: true },
    { id: 'totalVol1000ton', title: '천톤 클럽', desc: '누적 볼륨 1,000,000kg', icon: '💎', type: 'once', premium: true },
    { id: 'totalVol5000ton', title: '오천톤 레전드', desc: '누적 볼륨 5,000,000kg', icon: '👑', type: 'once', premium: true },

    // 6. 무게 기록 (6개) - 전부 프리미엄
    { id: 'weight60', title: '60kg 돌파', desc: '60kg 이상 기록', icon: '🏋️', type: 'once', premium: true },
    { id: 'weight80', title: '80kg 돌파', desc: '80kg 이상 기록', icon: '💪', type: 'once', premium: true },
    { id: 'weight100', title: '100kg 클럽', desc: '100kg 이상 기록', icon: '🔥', type: 'once', premium: true },
    { id: 'weight120', title: '120kg 괴력', desc: '120kg 이상 기록', icon: '⚡', type: 'once', premium: true },
    { id: 'weight140', title: '140kg 전설', desc: '140kg 이상 기록', icon: '💎', type: 'once', premium: true },
    { id: 'weight160', title: '160kg 신화', desc: '160kg 이상 기록', icon: '👑', type: 'once', premium: true },

    // 7. 볼륨/무게 증가 - 주간 (8개) - 전부 프리미엄
    { id: 'volumeUpWeek1', title: '볼륨업 (3등급)', desc: '전주 대비 볼륨 1% 증가', icon: '📈', type: 'repeat', premium: true },
    { id: 'volumeUpWeek3', title: '볼륨업 (2등급)', desc: '전주 대비 볼륨 3% 증가', icon: '📈', type: 'repeat', premium: true },
    { id: 'volumeUpWeek5', title: '볼륨업 (1등급)', desc: '전주 대비 볼륨 5% 증가', icon: '📈', type: 'repeat', premium: true },
    { id: 'volumeUpWeek10', title: '볼륨업 (0등급)', desc: '전주 대비 볼륨 10% 증가', icon: '📈', type: 'repeat', premium: true },
    { id: 'heavyWeek1', title: '웨이팅 (3등급)', desc: '전주 대비 무게 1% 증가', icon: '🏋️', type: 'repeat', premium: true },
    { id: 'heavyWeek3', title: '웨이팅 (2등급)', desc: '전주 대비 무게 3% 증가', icon: '🏋️', type: 'repeat', premium: true },
    { id: 'heavyWeek5', title: '웨이팅 (1등급)', desc: '전주 대비 무게 5% 증가', icon: '🏋️', type: 'repeat', premium: true },
    { id: 'heavyWeek10', title: '웨이팅 (0등급)', desc: '전주 대비 무게 10% 증가', icon: '🏋️', type: 'repeat', premium: true },

    // 8. 볼륨/무게 증가 - 월간 (8개) - 전부 프리미엄
    { id: 'volumeUpMonth1', title: '메가볼륨 (3등급)', desc: '전월 대비 볼륨 1% 증가', icon: '🚀', type: 'repeat', premium: true },
    { id: 'volumeUpMonth3', title: '메가볼륨 (2등급)', desc: '전월 대비 볼륨 3% 증가', icon: '🚀', type: 'repeat', premium: true },
    { id: 'volumeUpMonth5', title: '메가볼륨 (1등급)', desc: '전월 대비 볼륨 5% 증가', icon: '🚀', type: 'repeat', premium: true },
    { id: 'volumeUpMonth10', title: '메가볼륨 (0등급)', desc: '전월 대비 볼륨 10% 증가', icon: '🚀', type: 'repeat', premium: true },
    { id: 'heavyMonth1', title: '슈퍼웨이팅 (3등급)', desc: '전월 대비 무게 1% 증가', icon: '💪', type: 'repeat', premium: true },
    { id: 'heavyMonth3', title: '슈퍼웨이팅 (2등급)', desc: '전월 대비 무게 3% 증가', icon: '💪', type: 'repeat', premium: true },
    { id: 'heavyMonth5', title: '슈퍼웨이팅 (1등급)', desc: '전월 대비 무게 5% 증가', icon: '💪', type: 'repeat', premium: true },
    { id: 'heavyMonth10', title: '슈퍼웨이팅 (0등급)', desc: '전월 대비 무게 10% 증가', icon: '💪', type: 'repeat', premium: true },

    // 9. 렙수 마일스톤 (6개)
    { id: 'reps1000', title: '천 렙', desc: '총 1,000렙 달성', icon: '🔢', type: 'once', premium: false },
    { id: 'reps5000', title: '오천 렙', desc: '총 5,000렙 달성', icon: '🔢', type: 'once', premium: false },
    { id: 'reps10000', title: '만 렙 달성', desc: '총 10,000렙 달성', icon: '🔢', type: 'once', premium: true },
    { id: 'reps50000', title: '오만 렙', desc: '총 50,000렙 달성', icon: '🔢', type: 'once', premium: true },
    { id: 'dayReps100', title: '백렙 데이', desc: '하루 100렙 이상', icon: '💯', type: 'repeat', premium: true },
    { id: 'dayReps200', title: '이백렙 데이', desc: '하루 200렙 이상', icon: '🔥', type: 'repeat', premium: true },

    // 10. 운동 다양성 (6개)
    { id: 'exercise5', title: '초보 탈출', desc: '운동 5개 등록', icon: '📚', type: 'once', premium: false },
    { id: 'exercise10', title: '다재다능', desc: '운동 10개 등록', icon: '📚', type: 'once', premium: false },
    { id: 'exercise20', title: '운동 백과사전', desc: '운동 20개 등록', icon: '📖', type: 'once', premium: true },
    { id: 'dayEx3', title: '트리플 콤보', desc: '하루 3종류 운동', icon: '🎯', type: 'repeat', premium: false },
    { id: 'dayEx5', title: '펜타킬', desc: '하루 5종류 운동', icon: '⚔️', type: 'repeat', premium: true },
    { id: 'dayEx7', title: '럭키 세븐', desc: '하루 7종류 운동', icon: '🍀', type: 'repeat', premium: true },

    // 11. 시간대/요일 (7개) - 전부 프리미엄
    { id: 'earlyBird', title: '얼리버드', desc: '오전 6시 이전 기록', icon: '🌅', type: 'repeat', premium: true },
    { id: 'nightOwl', title: '올빼미', desc: '밤 10시 이후 기록', icon: '🦉', type: 'repeat', premium: true },
    { id: 'earlyBird10', title: '아침형 인간', desc: '오전 운동 10회 누적', icon: '☀️', type: 'once', premium: true },
    { id: 'nightOwl10', title: '야행성', desc: '밤 운동 10회 누적', icon: '🌙', type: 'once', premium: true },
    { id: 'weekend', title: '주말 전사', desc: '토,일 둘 다 운동', icon: '🎉', type: 'repeat', premium: true },
    { id: 'mondayKiller', title: '월요병 극복', desc: '월요일 4주 연속 운동', icon: '💪', type: 'repeat', premium: true },
    { id: 'fridayFighter', title: '불금도 운동', desc: '금요일 4주 연속 운동', icon: '🔥', type: 'repeat', premium: true },

    // 12. 특별 이벤트 (8개) - 전부 프리미엄
    { id: 'newYear', title: '새해 결심', desc: '1월 1일 운동', icon: '🎆', type: 'repeat', premium: true },
    { id: 'valentine', title: '발렌타인 운동', desc: '2월 14일 운동', icon: '💝', type: 'repeat', premium: true },
    { id: 'leapDay', title: '윤년 운동', desc: '2월 29일 운동', icon: '🐸', type: 'repeat', premium: true },
    { id: 'christmas', title: '크리스마스 머슬', desc: '12월 25일 운동', icon: '🎄', type: 'repeat', premium: true },
    { id: 'summer', title: '썸머 바디', desc: '7,8월 총 20일 이상', icon: '🏖️', type: 'repeat', premium: true },
    { id: 'winter', title: '겨울 전사', desc: '12,1,2월 총 30일 이상', icon: '❄️', type: 'repeat', premium: true },
    { id: 'yearEnd', title: '연말 스퍼트', desc: '12월 27~31일 중 3일 운동', icon: '🎇', type: 'repeat', premium: true },
    { id: 'newYearWeek', title: '새해 첫 주', desc: '1월 첫 주 3일 이상', icon: '🌟', type: 'repeat', premium: true },

    // 13. 복귀/회복 (5개)
    { id: 'rest1week', title: '언제까지 회복?', desc: '1주일 기록 없음', icon: '😴', type: 'repeat', premium: false },
    { id: 'rest1month', title: '지금은 휴가중', desc: '한 달 기록 없음', icon: '🏖️', type: 'repeat', premium: false },
    { id: 'rest3month', title: '동면시간?', desc: '3달 기록 없음', icon: '🐻', type: 'repeat', premium: true },
    { id: 'comeback', title: '다시 시작', desc: '7일+ 휴식 후 복귀', icon: '🔄', type: 'repeat', premium: true },
    { id: 'phoenix', title: '불사조', desc: '30일+ 휴식 후 복귀 3회', icon: '🔥', type: 'once', premium: true },

    // 14. 성장/PR (6개) - 전부 프리미엄
    { id: 'prFirst', title: '첫 자기 기록', desc: '운동별 최고 무게 경신', icon: '🎯', type: 'once', premium: true },
    { id: 'pr10', title: 'PR 헌터', desc: '자기 기록 10회 경신', icon: '🏹', type: 'once', premium: true },
    { id: 'pr25', title: 'PR 마니아', desc: '자기 기록 25회 경신', icon: '🎯', type: 'once', premium: true },
    { id: 'pr50', title: 'PR 마스터', desc: '자기 기록 50회 경신', icon: '⭐', type: 'once', premium: true },
    { id: 'pr100', title: 'PR 레전드', desc: '자기 기록 100회 경신', icon: '💎', type: 'once', premium: true },
    { id: 'doubleUp', title: '더블업', desc: '첫 기록 대비 무게 2배', icon: '🔥', type: 'repeat', premium: true },

    // 15. 하드코어 도전 (6개) - 전부 프리미엄
    { id: 'perfectWeek', title: '완벽한 한 주', desc: '7일 연속 운동', icon: '⭐', type: 'repeat', premium: true },
    { id: 'perfectMonth', title: '완벽한 한 달', desc: '한 달간 매일 운동', icon: '🌟', type: 'repeat', premium: true },
    { id: 'spartan', title: '스파르탄', desc: '12주 연속 주 4일 이상', icon: '⚔️', type: 'repeat', premium: true },
    { id: 'marathon', title: '마라토너', desc: '6개월간 주 3일 이상', icon: '🏃', type: 'once', premium: true },
    { id: 'ultraMarathon', title: '울트라 마라톤', desc: '1년간 주 3일 이상', icon: '🏅', type: 'once', premium: true },
    { id: 'noExcuse', title: '핑계는 없다', desc: '3개월간 주 5일 이상', icon: '🦁', type: 'once', premium: true },
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
            <div class="achievement-stat-label">달성 업적</div>
        </div>
        <div class="achievement-stat">
            <div class="achievement-stat-value">${totalCount}</div>
            <div class="achievement-stat-label">총 달성 횟수</div>
        </div>
        <div class="achievement-stat">
            <div class="achievement-stat-value">${allDates.length}</div>
            <div class="achievement-stat-label">총 기록일</div>
        </div>
    `;

    function renderItem(a, isLocked) {
        const d = data.achievements[a.id];
        const premiumLock = !isPremium && a.premium;
        const locked = isLocked || premiumLock;

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
            statusHtml = '<span class="achievement-pending">도전</span>';
        }

        return `<div class="achievement-item${locked ? ' locked' : ''}${premiumLock ? ' premium-locked' : ''}">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">${a.title}${premiumLock ? ' <span class="premium-badge">PRO</span>' : ''}</div>
                <div class="achievement-desc">${a.desc}</div>
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
        html += `<div class="premium-section-header" onclick="showUpgradePrompt('프리미엄 업적')">
            <span>프리미엄 업적</span>
            <span class="premium-count">${premiumAchievements.length}개</span>
        </div>`;
        html += premiumAchievements.slice(0, 5).map(a => renderItem(a, true)).join('');
        if (premiumAchievements.length > 5) {
            html += `<div class="premium-more" onclick="showUpgradePrompt('프리미엄 업적')">
                +${premiumAchievements.length - 5}개 더 보기
            </div>`;
        }
    }

    document.getElementById('achievementList').innerHTML = html;
}
