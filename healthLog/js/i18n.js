// ==================== i18n (다국어 지원) ====================

const TRANSLATIONS = {
    ko: {
        // 공통
        today: '오늘',
        cancel: '취소',
        save: '저장',
        apply: '적용',
        delete: '삭제',
        edit: '수정',
        add: '추가',
        close: '닫기',
        loading: '불러오는 중...',
        noData: '데이터 없음',
        noRecords: '기록이 없습니다',
        noResults: '검색 결과가 없습니다',

        // 탭
        tabChart: '차트',
        tabAchievement: '업적',
        tabRecord: '기록',
        tabSettings: '운동 설정',

        // 캘린더
        weekdays: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        yearMonth: (y, m) => `${y}년 ${m}월`,
        monthDay: (m, d) => `${m}월 ${d}일`,
        monthDayRecord: (m, d) => `${m}월 ${d}일 기록`,
        todayRecord: '오늘 기록',

        // 기록
        addRecord: '기록 추가',
        exerciseName: '운동명',
        weight: '무게',
        weightKg: '무게 (kg)',
        reps: '횟수',
        memo: '메모',
        setMemo: '세트 메모 (선택)',
        memoOptional: '메모 (선택)',
        record: '기록',
        show: '보기',
        hide: '숨기기',
        sets: '세트',
        todaySets: (n) => `오늘 ${n}세트`,
        nSets: (n) => `${n}세트`,

        // 운동 설정
        exerciseSettings: '운동 설정',
        searchExercise: '운동 검색',
        sortByRegistered: '등록순',
        sortByName: '가나다순',
        addExercise: '운동 추가',
        enterExerciseName: '운동 이름을 입력하세요',
        enterExerciseDesc: '운동에 대한 설명을 입력하세요',
        addExerciseBtn: '추가하기',
        noExercises: '운동을 추가하세요',
        exerciseExists: '이미 존재하는 운동입니다',
        deleteExerciseConfirm: (name) => `"${name}" 운동을 삭제할까요?`,
        deleteRecordConfirm: (name, m, d) => `"${name}" ${m}월 ${d}일 기록을 삭제할까요?`,
        deleteAllRecordsConfirm: (label, names) => `${label}의 모든 운동 기록을 삭제할까요?\n(${names})`,
        mergeExerciseConfirm: (name) => `"${name}" 이미 존재합니다. 합칠까요?`,

        // 모달
        editSet: '세트 수정',
        selectColor: '색상 선택',
        selectDate: '날짜 선택',
        selectPeriod: '기간 선택',
        startDate: '시작일',
        endDate: '종료일',

        // 차트
        chart: '차트',
        selectExercise: '운동을 선택하세요',
        chartEmpty: '운동을 선택하면 차트가 표시됩니다',
        weightTrend: '무게 변화 추이',
        dailyVolume: '일별 볼륨 (kg × reps)',
        thisWeek: '금주',
        oneMonth: '1개월',
        threeMonths: '3개월',
        sixMonths: '6개월',
        oneYear: '1년',
        custom: '커스텀',
        noRecordsInPeriod: '선택한 기간에 기록이 없습니다',
        extendedChartPeriod: '확장 차트 기간',

        // 업적
        achievement: '업적',
        achievedCount: '달성 업적',
        totalAchievements: '총 달성 횟수',
        totalRecordDays: '총 기록일',
        challenge: '도전',
        premiumAchievements: '프리미엄 업적',
        moreAchievements: (n) => `+${n}개 더 보기`,
        moreColors: '더 많은 색상',
        premiumFeature: '프리미엄 기능입니다.\n프리미엄으로 업그레이드하세요!',
        maxExercises: (n) => `운동 ${n}개 이상 등록`,

        // 업적 목록
        achievements: {
            // 누적 기록일
            firstRecord: { title: '시작이 반', desc: '첫 운동 기록' },
            total10: { title: '열흘의 기적', desc: '총 10일 기록' },
            total30: { title: '한 달 전사', desc: '총 30일 기록' },
            total50: { title: '오십보백보', desc: '총 50일 기록' },
            total100: { title: '백전백승', desc: '총 100일 기록' },
            total200: { title: '이백승', desc: '총 200일 기록' },
            total365: { title: '1년 개근', desc: '총 365일 기록' },
            total500: { title: '오백승', desc: '총 500일 기록' },
            total730: { title: '2년 누적', desc: '총 730일 기록' },
            total1000: { title: '천일의 약속', desc: '총 1000일 기록' },

            // 연속 기록
            first3days: { title: '작심삼일극복', desc: '3일 연속 기록' },
            streak7: { title: '일주일 불꽃', desc: '7일 연속 기록' },
            streak14: { title: '2주 마라톤', desc: '14일 연속 기록' },
            streak30: { title: '한 달 철인', desc: '30일 연속 기록' },
            streak60: { title: '60일 전설', desc: '60일 연속 기록' },
            streak90: { title: '분기의 왕', desc: '90일 연속 기록' },
            streak120: { title: '4개월 괴물', desc: '120일 연속 기록' },
            streak180: { title: '반년 괴물', desc: '180일 연속 기록' },
            streak270: { title: '9개월 전사', desc: '270일 연속 기록' },
            streak365: { title: '1년 무결석', desc: '365일 연속 기록' },

            // 주간 빈도
            week3: { title: '주 3회', desc: '한 주에 3일 이상 (4주 연속)' },
            week5: { title: '주5일제', desc: '한 주에 5일 운동' },
            week7: { title: '체육관관장님?', desc: '한 주에 7일 운동' },
            week3for8: { title: '꾸준함의 정석', desc: '8주 연속 주 3일 이상' },
            week4for12: { title: '분기 정복자', desc: '12주 연속 주 4일 이상' },
            week5for8: { title: '아이언맨', desc: '8주 연속 주 5일 이상' },

            // 세트 수 마일스톤
            sets100: { title: '백 세트 돌파', desc: '총 100세트 달성' },
            sets500: { title: '오백 세트', desc: '총 500세트 달성' },
            sets1000: { title: '천 세트 클럽', desc: '총 1000세트 달성' },
            sets2500: { title: '이천오백 세트', desc: '총 2500세트 달성' },
            sets5000: { title: '세트 마스터', desc: '총 5000세트 달성' },
            sets10000: { title: '만 세트 레전드', desc: '총 10000세트 달성' },
            daySet10: { title: '오늘 좀 치네', desc: '하루 10세트 이상' },
            daySet20: { title: '하루종일 운동', desc: '하루 20세트 이상' },
            daySet30: { title: '세트 폭격기', desc: '하루 30세트 이상' },
            daySet50: { title: '세트 괴물', desc: '하루 50세트 이상' },

            // 볼륨 마일스톤
            volume1ton: { title: '1톤 클럽', desc: '하루 총 볼륨 1,000kg' },
            volume5ton: { title: '5톤 괴물', desc: '하루 총 볼륨 5,000kg' },
            volume10ton: { title: '10톤 트럭', desc: '하루 총 볼륨 10,000kg' },
            volume20ton: { title: '20톤 괴력', desc: '하루 총 볼륨 20,000kg' },
            totalVol100ton: { title: '100톤 누적', desc: '누적 볼륨 100,000kg' },
            totalVol500ton: { title: '500톤 누적', desc: '누적 볼륨 500,000kg' },
            totalVol1000ton: { title: '천톤 클럽', desc: '누적 볼륨 1,000,000kg' },
            totalVol5000ton: { title: '오천톤 레전드', desc: '누적 볼륨 5,000,000kg' },

            // 무게 기록
            weight60: { title: '60kg 돌파', desc: '60kg 이상 기록' },
            weight80: { title: '80kg 돌파', desc: '80kg 이상 기록' },
            weight100: { title: '100kg 클럽', desc: '100kg 이상 기록' },
            weight120: { title: '120kg 괴력', desc: '120kg 이상 기록' },
            weight140: { title: '140kg 전설', desc: '140kg 이상 기록' },
            weight160: { title: '160kg 신화', desc: '160kg 이상 기록' },

            // 볼륨/무게 증가 - 주간
            volumeUpWeek1: { title: '볼륨업 (3등급)', desc: '전주 대비 볼륨 1% 증가' },
            volumeUpWeek3: { title: '볼륨업 (2등급)', desc: '전주 대비 볼륨 3% 증가' },
            volumeUpWeek5: { title: '볼륨업 (1등급)', desc: '전주 대비 볼륨 5% 증가' },
            volumeUpWeek10: { title: '볼륨업 (0등급)', desc: '전주 대비 볼륨 10% 증가' },
            heavyWeek1: { title: '웨이팅 (3등급)', desc: '전주 대비 무게 1% 증가' },
            heavyWeek3: { title: '웨이팅 (2등급)', desc: '전주 대비 무게 3% 증가' },
            heavyWeek5: { title: '웨이팅 (1등급)', desc: '전주 대비 무게 5% 증가' },
            heavyWeek10: { title: '웨이팅 (0등급)', desc: '전주 대비 무게 10% 증가' },

            // 볼륨/무게 증가 - 월간
            volumeUpMonth1: { title: '메가볼륨 (3등급)', desc: '전월 대비 볼륨 1% 증가' },
            volumeUpMonth3: { title: '메가볼륨 (2등급)', desc: '전월 대비 볼륨 3% 증가' },
            volumeUpMonth5: { title: '메가볼륨 (1등급)', desc: '전월 대비 볼륨 5% 증가' },
            volumeUpMonth10: { title: '메가볼륨 (0등급)', desc: '전월 대비 볼륨 10% 증가' },
            heavyMonth1: { title: '슈퍼웨이팅 (3등급)', desc: '전월 대비 무게 1% 증가' },
            heavyMonth3: { title: '슈퍼웨이팅 (2등급)', desc: '전월 대비 무게 3% 증가' },
            heavyMonth5: { title: '슈퍼웨이팅 (1등급)', desc: '전월 대비 무게 5% 증가' },
            heavyMonth10: { title: '슈퍼웨이팅 (0등급)', desc: '전월 대비 무게 10% 증가' },

            // 렙수 마일스톤
            reps1000: { title: '천 렙', desc: '총 1,000렙 달성' },
            reps5000: { title: '오천 렙', desc: '총 5,000렙 달성' },
            reps10000: { title: '만 렙 달성', desc: '총 10,000렙 달성' },
            reps50000: { title: '오만 렙', desc: '총 50,000렙 달성' },
            dayReps100: { title: '백렙 데이', desc: '하루 100렙 이상' },
            dayReps200: { title: '이백렙 데이', desc: '하루 200렙 이상' },

            // 운동 다양성
            exercise5: { title: '초보 탈출', desc: '운동 5개 등록' },
            exercise10: { title: '다재다능', desc: '운동 10개 등록' },
            exercise20: { title: '운동 백과사전', desc: '운동 20개 등록' },
            dayEx3: { title: '트리플 콤보', desc: '하루 3종류 운동' },
            dayEx5: { title: '펜타킬', desc: '하루 5종류 운동' },
            dayEx7: { title: '럭키 세븐', desc: '하루 7종류 운동' },

            // 시간대/요일
            earlyBird: { title: '얼리버드', desc: '오전 6시 이전 기록' },
            nightOwl: { title: '올빼미', desc: '밤 10시 이후 기록' },
            earlyBird10: { title: '아침형 인간', desc: '오전 운동 10회 누적' },
            nightOwl10: { title: '야행성', desc: '밤 운동 10회 누적' },
            weekend: { title: '주말 전사', desc: '토,일 둘 다 운동' },
            mondayKiller: { title: '월요병 극복', desc: '월요일 4주 연속 운동' },
            fridayFighter: { title: '불금도 운동', desc: '금요일 4주 연속 운동' },

            // 특별 이벤트
            newYear: { title: '새해 결심', desc: '1월 1일 운동' },
            valentine: { title: '발렌타인 운동', desc: '2월 14일 운동' },
            leapDay: { title: '윤년 운동', desc: '2월 29일 운동' },
            christmas: { title: '크리스마스 머슬', desc: '12월 25일 운동' },
            summer: { title: '썸머 바디', desc: '7,8월 총 20일 이상' },
            winter: { title: '겨울 전사', desc: '12,1,2월 총 30일 이상' },
            yearEnd: { title: '연말 스퍼트', desc: '12월 27~31일 중 3일 운동' },
            newYearWeek: { title: '새해 첫 주', desc: '1월 첫 주 3일 이상' },

            // 복귀/회복
            rest1week: { title: '언제까지 회복?', desc: '1주일 기록 없음' },
            rest1month: { title: '지금은 휴가중', desc: '한 달 기록 없음' },
            rest3month: { title: '동면시간?', desc: '3달 기록 없음' },
            comeback: { title: '다시 시작', desc: '7일+ 휴식 후 복귀' },
            phoenix: { title: '불사조', desc: '30일+ 휴식 후 복귀 3회' },

            // 성장/PR
            prFirst: { title: '첫 자기 기록', desc: '운동별 최고 무게 경신' },
            pr10: { title: 'PR 헌터', desc: '자기 기록 10회 경신' },
            pr25: { title: 'PR 마니아', desc: '자기 기록 25회 경신' },
            pr50: { title: 'PR 마스터', desc: '자기 기록 50회 경신' },
            pr100: { title: 'PR 레전드', desc: '자기 기록 100회 경신' },
            doubleUp: { title: '더블업', desc: '첫 기록 대비 무게 2배' },

            // 하드코어 도전
            perfectWeek: { title: '완벽한 한 주', desc: '7일 연속 운동' },
            perfectMonth: { title: '완벽한 한 달', desc: '한 달간 매일 운동' },
            spartan: { title: '스파르탄', desc: '12주 연속 주 4일 이상' },
            marathon: { title: '마라토너', desc: '6개월간 주 3일 이상' },
            ultraMarathon: { title: '울트라 마라톤', desc: '1년간 주 3일 이상' },
            noExcuse: { title: '핑계는 없다', desc: '3개월간 주 5일 이상' }
        }
    },

    en: {
        // Common
        today: 'Today',
        cancel: 'Cancel',
        save: 'Save',
        apply: 'Apply',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        close: 'Close',
        loading: 'Loading...',
        noData: 'No data',
        noRecords: 'No records',
        noResults: 'No results found',

        // Tabs
        tabChart: 'Chart',
        tabAchievement: 'Achievements',
        tabRecord: 'Record',
        tabSettings: 'Exercises',

        // Calendar
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        yearMonth: (y, m) => `${m} ${y}`,
        monthDay: (m, d) => `${m} ${d}`,
        monthDayRecord: (m, d) => `${m} ${d} Records`,
        todayRecord: "Today's Records",

        // Records
        addRecord: 'Add Record',
        exerciseName: 'Exercise',
        weight: 'Weight',
        weightKg: 'Weight (kg)',
        reps: 'Reps',
        memo: 'Memo',
        setMemo: 'Set memo (optional)',
        memoOptional: 'Memo (optional)',
        record: 'Record',
        show: 'Show',
        hide: 'Hide',
        sets: 'sets',
        todaySets: (n) => `${n} sets today`,
        nSets: (n) => `${n} sets`,

        // Exercise Settings
        exerciseSettings: 'Exercises',
        searchExercise: 'Search exercises',
        sortByRegistered: 'By date',
        sortByName: 'A-Z',
        addExercise: 'Add Exercise',
        enterExerciseName: 'Enter exercise name',
        enterExerciseDesc: 'Enter exercise description',
        addExerciseBtn: 'Add',
        noExercises: 'Add an exercise',
        exerciseExists: 'Exercise already exists',
        deleteExerciseConfirm: (name) => `Delete "${name}"?`,
        deleteRecordConfirm: (name, m, d) => `Delete "${name}" records on ${m} ${d}?`,
        deleteAllRecordsConfirm: (label, names) => `Delete all records on ${label}?\n(${names})`,
        mergeExerciseConfirm: (name) => `"${name}" already exists. Merge?`,

        // Modals
        editSet: 'Edit Set',
        selectColor: 'Select Color',
        selectDate: 'Select Date',
        selectPeriod: 'Select Period',
        startDate: 'Start date',
        endDate: 'End date',

        // Chart
        chart: 'Chart',
        selectExercise: 'Select an exercise',
        chartEmpty: 'Select an exercise to view chart',
        weightTrend: 'Weight Trend',
        dailyVolume: 'Daily Volume (kg × reps)',
        thisWeek: 'Week',
        oneMonth: '1M',
        threeMonths: '3M',
        sixMonths: '6M',
        oneYear: '1Y',
        custom: 'Custom',
        noRecordsInPeriod: 'No records in selected period',
        extendedChartPeriod: 'Extended chart periods',

        // Achievements
        achievement: 'Achievements',
        achievedCount: 'Achieved',
        totalAchievements: 'Total Count',
        totalRecordDays: 'Record Days',
        challenge: 'Challenge',
        premiumAchievements: 'Premium Achievements',
        moreAchievements: (n) => `+${n} more`,
        moreColors: 'More colors',
        premiumFeature: 'Premium feature.\nUpgrade to Premium!',
        maxExercises: (n) => `Register ${n}+ exercises`,

        // Achievement list
        achievements: {
            // Cumulative days
            firstRecord: { title: 'First Step', desc: 'First workout record' },
            total10: { title: '10 Day Miracle', desc: '10 days total' },
            total30: { title: 'Month Warrior', desc: '30 days total' },
            total50: { title: 'Halfway There', desc: '50 days total' },
            total100: { title: 'Century Club', desc: '100 days total' },
            total200: { title: 'Double Century', desc: '200 days total' },
            total365: { title: 'Year Round', desc: '365 days total' },
            total500: { title: '500 Club', desc: '500 days total' },
            total730: { title: 'Two Years', desc: '730 days total' },
            total1000: { title: 'Thousand Days', desc: '1000 days total' },

            // Consecutive days
            first3days: { title: 'Beat Excuses', desc: '3 days streak' },
            streak7: { title: 'Week Flame', desc: '7 days streak' },
            streak14: { title: '2 Week Marathon', desc: '14 days streak' },
            streak30: { title: 'Iron Month', desc: '30 days streak' },
            streak60: { title: '60 Day Legend', desc: '60 days streak' },
            streak90: { title: 'Quarter King', desc: '90 days streak' },
            streak120: { title: '4 Month Beast', desc: '120 days streak' },
            streak180: { title: 'Half Year Beast', desc: '180 days streak' },
            streak270: { title: '9 Month Warrior', desc: '270 days streak' },
            streak365: { title: 'Perfect Year', desc: '365 days streak' },

            // Weekly frequency
            week3: { title: '3x Week', desc: '3+ days/week (4 weeks)' },
            week5: { title: '5x Week', desc: '5 days in a week' },
            week7: { title: 'Gym Owner?', desc: '7 days in a week' },
            week3for8: { title: 'Consistency', desc: '8 weeks of 3+ days' },
            week4for12: { title: 'Quarter Master', desc: '12 weeks of 4+ days' },
            week5for8: { title: 'Iron Man', desc: '8 weeks of 5+ days' },

            // Set milestones
            sets100: { title: '100 Sets', desc: '100 total sets' },
            sets500: { title: '500 Sets', desc: '500 total sets' },
            sets1000: { title: '1K Sets Club', desc: '1000 total sets' },
            sets2500: { title: '2.5K Sets', desc: '2500 total sets' },
            sets5000: { title: 'Set Master', desc: '5000 total sets' },
            sets10000: { title: '10K Legend', desc: '10000 total sets' },
            daySet10: { title: 'Crushing It', desc: '10+ sets in a day' },
            daySet20: { title: 'All Day Gym', desc: '20+ sets in a day' },
            daySet30: { title: 'Set Bomber', desc: '30+ sets in a day' },
            daySet50: { title: 'Set Monster', desc: '50+ sets in a day' },

            // Volume milestones
            volume1ton: { title: '1 Ton Club', desc: '1,000kg daily volume' },
            volume5ton: { title: '5 Ton Beast', desc: '5,000kg daily volume' },
            volume10ton: { title: '10 Ton Truck', desc: '10,000kg daily volume' },
            volume20ton: { title: '20 Ton Power', desc: '20,000kg daily volume' },
            totalVol100ton: { title: '100 Ton Total', desc: '100,000kg total volume' },
            totalVol500ton: { title: '500 Ton Total', desc: '500,000kg total volume' },
            totalVol1000ton: { title: '1000 Ton Club', desc: '1,000,000kg total volume' },
            totalVol5000ton: { title: '5000 Ton Legend', desc: '5,000,000kg total volume' },

            // Weight records
            weight60: { title: '60kg Lift', desc: 'Lifted 60kg+' },
            weight80: { title: '80kg Lift', desc: 'Lifted 80kg+' },
            weight100: { title: '100kg Club', desc: 'Lifted 100kg+' },
            weight120: { title: '120kg Power', desc: 'Lifted 120kg+' },
            weight140: { title: '140kg Legend', desc: 'Lifted 140kg+' },
            weight160: { title: '160kg Myth', desc: 'Lifted 160kg+' },

            // Weekly volume/weight increase
            volumeUpWeek1: { title: 'Volume Up (Lv3)', desc: '1% weekly volume increase' },
            volumeUpWeek3: { title: 'Volume Up (Lv2)', desc: '3% weekly volume increase' },
            volumeUpWeek5: { title: 'Volume Up (Lv1)', desc: '5% weekly volume increase' },
            volumeUpWeek10: { title: 'Volume Up (Lv0)', desc: '10% weekly volume increase' },
            heavyWeek1: { title: 'Heavier (Lv3)', desc: '1% weekly weight increase' },
            heavyWeek3: { title: 'Heavier (Lv2)', desc: '3% weekly weight increase' },
            heavyWeek5: { title: 'Heavier (Lv1)', desc: '5% weekly weight increase' },
            heavyWeek10: { title: 'Heavier (Lv0)', desc: '10% weekly weight increase' },

            // Monthly volume/weight increase
            volumeUpMonth1: { title: 'Mega Volume (Lv3)', desc: '1% monthly volume increase' },
            volumeUpMonth3: { title: 'Mega Volume (Lv2)', desc: '3% monthly volume increase' },
            volumeUpMonth5: { title: 'Mega Volume (Lv1)', desc: '5% monthly volume increase' },
            volumeUpMonth10: { title: 'Mega Volume (Lv0)', desc: '10% monthly volume increase' },
            heavyMonth1: { title: 'Super Heavy (Lv3)', desc: '1% monthly weight increase' },
            heavyMonth3: { title: 'Super Heavy (Lv2)', desc: '3% monthly weight increase' },
            heavyMonth5: { title: 'Super Heavy (Lv1)', desc: '5% monthly weight increase' },
            heavyMonth10: { title: 'Super Heavy (Lv0)', desc: '10% monthly weight increase' },

            // Reps milestones
            reps1000: { title: '1K Reps', desc: '1,000 total reps' },
            reps5000: { title: '5K Reps', desc: '5,000 total reps' },
            reps10000: { title: '10K Reps', desc: '10,000 total reps' },
            reps50000: { title: '50K Reps', desc: '50,000 total reps' },
            dayReps100: { title: '100 Rep Day', desc: '100+ reps in a day' },
            dayReps200: { title: '200 Rep Day', desc: '200+ reps in a day' },

            // Exercise variety
            exercise5: { title: 'Getting Started', desc: '5 exercises registered' },
            exercise10: { title: 'Versatile', desc: '10 exercises registered' },
            exercise20: { title: 'Encyclopedia', desc: '20 exercises registered' },
            dayEx3: { title: 'Triple Combo', desc: '3 exercises in a day' },
            dayEx5: { title: 'Penta Kill', desc: '5 exercises in a day' },
            dayEx7: { title: 'Lucky Seven', desc: '7 exercises in a day' },

            // Time/Day
            earlyBird: { title: 'Early Bird', desc: 'Record before 6 AM' },
            nightOwl: { title: 'Night Owl', desc: 'Record after 10 PM' },
            earlyBird10: { title: 'Morning Person', desc: '10 morning workouts' },
            nightOwl10: { title: 'Nocturnal', desc: '10 night workouts' },
            weekend: { title: 'Weekend Warrior', desc: 'Both Sat & Sun workout' },
            mondayKiller: { title: 'Monday Killer', desc: '4 consecutive Mondays' },
            fridayFighter: { title: 'Friday Fighter', desc: '4 consecutive Fridays' },

            // Special events
            newYear: { title: 'New Year Goal', desc: 'Workout on Jan 1' },
            valentine: { title: 'Valentine Workout', desc: 'Workout on Feb 14' },
            leapDay: { title: 'Leap Day', desc: 'Workout on Feb 29' },
            christmas: { title: 'Christmas Muscle', desc: 'Workout on Dec 25' },
            summer: { title: 'Summer Body', desc: '20+ days in Jul-Aug' },
            winter: { title: 'Winter Warrior', desc: '30+ days in Dec-Feb' },
            yearEnd: { title: 'Year End Sprint', desc: '3 days in Dec 27-31' },
            newYearWeek: { title: 'New Year Week', desc: '3+ days in first week' },

            // Rest/Recovery
            rest1week: { title: 'Recovery Time?', desc: 'No records for 1 week' },
            rest1month: { title: 'On Vacation', desc: 'No records for 1 month' },
            rest3month: { title: 'Hibernation?', desc: 'No records for 3 months' },
            comeback: { title: 'Comeback', desc: 'Return after 7+ days' },
            phoenix: { title: 'Phoenix', desc: '3 comebacks after 30+ days' },

            // Growth/PR
            prFirst: { title: 'First PR', desc: 'Beat your personal record' },
            pr10: { title: 'PR Hunter', desc: '10 personal records' },
            pr25: { title: 'PR Fanatic', desc: '25 personal records' },
            pr50: { title: 'PR Master', desc: '50 personal records' },
            pr100: { title: 'PR Legend', desc: '100 personal records' },
            doubleUp: { title: 'Double Up', desc: '2x your first weight' },

            // Hardcore challenges
            perfectWeek: { title: 'Perfect Week', desc: '7 consecutive days' },
            perfectMonth: { title: 'Perfect Month', desc: 'Every day for a month' },
            spartan: { title: 'Spartan', desc: '12 weeks of 4+ days' },
            marathon: { title: 'Marathoner', desc: '6 months of 3+ days/week' },
            ultraMarathon: { title: 'Ultra Marathon', desc: '1 year of 3+ days/week' },
            noExcuse: { title: 'No Excuses', desc: '3 months of 5+ days/week' }
        }
    }
};

// 현재 언어 (localStorage에서 가져오거나 브라우저 언어 감지)
let currentLang = localStorage.getItem('healthlog_lang') ||
    (navigator.language.startsWith('ko') ? 'ko' : 'en');

// 번역 함수
function t(key, ...args) {
    const keys = key.split('.');
    let value = TRANSLATIONS[currentLang];

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            // fallback to Korean if key not found
            value = TRANSLATIONS.ko;
            for (const k2 of keys) {
                if (value && typeof value === 'object' && k2 in value) {
                    value = value[k2];
                } else {
                    return key; // key not found
                }
            }
            break;
        }
    }

    if (typeof value === 'function') {
        return value(...args);
    }
    return value;
}

// 업적 텍스트 가져오기
function getAchievementText(id) {
    const ach = TRANSLATIONS[currentLang].achievements[id];
    if (ach) return ach;
    // fallback
    return TRANSLATIONS.ko.achievements[id] || { title: id, desc: '' };
}

// 언어 변경
function setLanguage(lang) {
    if (lang !== 'ko' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('healthlog_lang', lang);
    applyTranslations();
}

// 언어 토글
function toggleLanguage() {
    setLanguage(currentLang === 'ko' ? 'en' : 'ko');
}

// DOM에 번역 적용
function applyTranslations() {
    // data-i18n 속성이 있는 요소들 번역
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const text = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });

    // 요일 번역
    const weekdaysEl = document.querySelector('.calendar-weekdays');
    if (weekdaysEl) {
        weekdaysEl.innerHTML = t('weekdays').map(d => `<span>${d}</span>`).join('');
    }

    // html lang 속성 업데이트
    document.documentElement.lang = currentLang;

    // 언어 전환 버튼 텍스트 업데이트
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.textContent = currentLang === 'ko' ? 'EN' : '한국어';
    }

    // 각 탭/뷰 다시 렌더링 (있는 경우)
    if (typeof renderCalendar === 'function') renderCalendar();
    if (typeof renderMain === 'function') renderMain();
    if (typeof updateChartSelect === 'function') updateChartSelect();
    if (typeof renderAchievements === 'function' && document.getElementById('achievementTab') && !document.getElementById('achievementTab').classList.contains('hidden')) {
        renderAchievements();
    }
}

// 날짜 포맷 헬퍼
function formatMonthDay(date) {
    const d = typeof date === 'string' ? parseLocalDate(date) : date;
    const m = d.getMonth() + 1;
    const day = d.getDate();

    if (currentLang === 'ko') {
        return `${m}월 ${day}일`;
    }
    return `${t('months')[d.getMonth()]} ${day}`;
}

function formatMonthDayWithWeekday(date) {
    const d = typeof date === 'string' ? parseLocalDate(date) : date;
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const dow = d.getDay();

    if (currentLang === 'ko') {
        return `${m}월 ${day}일 (${t('weekdays')[dow]})`;
    }
    return `${t('months')[d.getMonth()]} ${day} (${t('weekdays')[dow]})`;
}

function formatYearMonth(year, month) {
    if (currentLang === 'ko') {
        return `${year}년 ${month + 1}월`;
    }
    return `${t('months')[month]} ${year}`;
}
