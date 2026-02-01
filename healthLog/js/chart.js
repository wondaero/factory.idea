// ==================== 차트 ====================

const chartSelect = document.getElementById('chartExerciseSelect');
const chartContent = document.getElementById('chartContent');
const chartEmpty = document.getElementById('chartEmpty');
const weightChart = document.getElementById('weightChart');
const volumeChart = document.getElementById('volumeChart');
const chartPeriodBtns = document.querySelectorAll('.chart-period-btn');
const customDateModal = document.getElementById('customDateModal');
const chartStartDate = document.getElementById('chartStartDate');
const chartEndDate = document.getElementById('chartEndDate');
const closeCustomDateModal = document.getElementById('closeCustomDateModal');
const cancelCustomDate = document.getElementById('cancelCustomDate');
const applyCustomDate = document.getElementById('applyCustomDate');

let currentChartPeriod = 'week';
const LITE_CHART_PERIODS = ['week', '1month'];

function updateChartSelect() {
    chartSelect.innerHTML = '<option value="">운동을 선택하세요</option>' + data.exercises.map(ex => `<option value="${ex.id}">${ex.name}</option>`).join('');
}

function getDateRange(period) {
    const now = new Date();
    const endDate = new Date(now);
    let startDate = new Date(now);

    switch(period) {
        case 'week':
            const day = now.getDay();
            const diff = day === 0 ? 6 : day - 1;
            startDate.setDate(now.getDate() - diff);
            break;
        case '1month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        case '3month':
            startDate.setMonth(now.getMonth() - 3);
            break;
        case '6month':
            startDate.setMonth(now.getMonth() - 6);
            break;
        case '1year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        case 'custom':
            if (chartStartDate.value && chartEndDate.value) {
                return { start: chartStartDate.value, end: chartEndDate.value };
            }
            startDate.setMonth(now.getMonth() - 1);
            break;
    }

    return {
        start: startDate.toLocaleDateString('sv-SE'),
        end: endDate.toLocaleDateString('sv-SE')
    };
}

function updateChartPeriodButtons() {
    chartPeriodBtns.forEach(btn => {
        const period = btn.dataset.period;
        if (!isPremium && !LITE_CHART_PERIODS.includes(period)) {
            btn.classList.add('premium-locked');
        } else {
            btn.classList.remove('premium-locked');
        }
    });
}

function renderCharts(exerciseId) {
    const records = data.records.filter(r => r.exerciseId === exerciseId);
    if (records.length === 0) {
        chartContent.classList.add('hidden');
        chartEmpty.textContent = '기록이 없습니다';
        chartEmpty.classList.remove('hidden');
        return;
    }

    const range = getDateRange(currentChartPeriod);

    const byDate = {};
    records.forEach(r => {
        const dateStr = getDateFromDatetime(r.datetime);
        if (dateStr >= range.start && dateStr <= range.end) {
            if (!byDate[dateStr]) byDate[dateStr] = [];
            byDate[dateStr].push(r);
        }
    });
    const dates = Object.keys(byDate).sort();

    if (dates.length === 0) {
        chartContent.classList.add('hidden');
        chartEmpty.textContent = '선택한 기간에 기록이 없습니다';
        chartEmpty.classList.remove('hidden');
        return;
    }

    chartContent.classList.remove('hidden');
    chartEmpty.classList.add('hidden');

    const chartData = dates.map(date => {
        const dayRecords = byDate[date];
        return {
            date,
            maxWeight: Math.max(...dayRecords.map(r => r.w)),
            totalVolume: dayRecords.reduce((sum, r) => sum + (r.w * r.r), 0)
        };
    });

    renderWeightChart(chartData);
    renderVolumeChart(chartData);
}

function formatDateShort(dateStr) {
    const d = parseLocalDate(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

function renderWeightChart(chartData) {
    if (chartData.length === 0) {
        weightChart.innerHTML = '<div class="empty">데이터 없음</div>';
        return;
    }

    const maxWeight = Math.max(...chartData.map(d => d.maxWeight));
    const minWeight = Math.min(...chartData.map(d => d.maxWeight));
    const range = maxWeight - minWeight || 1;
    const padding = 12;

    const points = chartData.map((d, i) => ({
        x: padding + (i / (chartData.length - 1 || 1)) * (100 - padding * 2),
        y: padding + (100 - padding * 2) - ((d.maxWeight - minWeight) / range) * (100 - padding * 2)
    }));

    function catmullRomSpline(points) {
        if (points.length < 2) return '';
        if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[Math.max(i - 1, 0)];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[Math.min(i + 2, points.length - 1)];

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    }

    const pathD = catmullRomSpline(points);
    const areaD = pathD + ` L ${points[points.length - 1].x} ${100 - padding} L ${padding} ${100 - padding} Z`;

    weightChart.innerHTML = `
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#007aff;stop-opacity:0.25"/>
                    <stop offset="100%" style="stop-color:#007aff;stop-opacity:0.02"/>
                </linearGradient>
                <linearGradient id="lineStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#5ac8fa"/>
                    <stop offset="50%" style="stop-color:#007aff"/>
                    <stop offset="100%" style="stop-color:#5856d6"/>
                </linearGradient>
            </defs>
            <path class="line-area" d="${areaD}"/>
            <path class="line-path" d="${pathD}"/>
            ${points.map((p, i) => `<circle class="line-dot" cx="${p.x}" cy="${p.y}" r="3.5" data-value="${chartData[i].maxWeight}kg"/>`).join('')}
        </svg>
        <div class="line-labels">
            <span class="line-label">${formatDateShort(chartData[0].date)}<br><strong>${chartData[0].maxWeight}kg</strong></span>
            <span class="line-label">${formatDateShort(chartData[chartData.length - 1].date)}<br><strong>${chartData[chartData.length - 1].maxWeight}kg</strong></span>
        </div>
    `;
}

function renderVolumeChart(chartData) {
    if (chartData.length === 0) {
        volumeChart.innerHTML = '<div class="empty">데이터 없음</div>';
        return;
    }

    const maxVolume = Math.max(...chartData.map(d => d.totalVolume));
    const minVolume = Math.min(...chartData.map(d => d.totalVolume));
    const barHeight = 120;

    volumeChart.innerHTML = chartData.map((d, i) => {
        const heightPx = Math.max(4, (d.totalVolume / maxVolume) * barHeight);
        const isMax = d.totalVolume === maxVolume;
        const isMin = d.totalVolume === minVolume && maxVolume !== minVolume;
        const valueClass = isMax ? 'bar-value max' : (isMin ? 'bar-value min' : 'bar-value');
        return `
            <div class="bar-item" data-index="${i}">
                <div class="bar-wrapper">
                    <span class="${valueClass}">${d.totalVolume >= 1000 ? (d.totalVolume / 1000).toFixed(1) + 'k' : d.totalVolume}</span>
                    <div class="bar${isMax ? ' max' : ''}${isMin ? ' min' : ''}" style="height: ${heightPx}px"></div>
                </div>
                <span class="bar-label">${formatDateShort(d.date)}</span>
            </div>
        `;
    }).join('');

    volumeChart.scrollLeft = volumeChart.scrollWidth;
}

// 모달 열기/닫기
function openCustomDateModal() {
    if (!chartStartDate.value || !chartEndDate.value) {
        const now = new Date();
        chartEndDate.value = now.toLocaleDateString('sv-SE');
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        chartStartDate.value = monthAgo.toLocaleDateString('sv-SE');
    }
    customDateModal.classList.add('show');
}

function closeCustomDateModalFn() {
    customDateModal.classList.remove('show');
}

// 이벤트 리스너
chartPeriodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const period = btn.dataset.period;

        if (!isPremium && !LITE_CHART_PERIODS.includes(period)) {
            showUpgradePrompt('확장 차트 기간');
            return;
        }

        if (period === 'custom') {
            openCustomDateModal();
            return;
        }

        chartPeriodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentChartPeriod = period;

        if (chartSelect.value) {
            renderCharts(chartSelect.value);
        }
    });
});

closeCustomDateModal.addEventListener('click', closeCustomDateModalFn);
cancelCustomDate.addEventListener('click', closeCustomDateModalFn);
customDateModal.addEventListener('click', (e) => {
    if (e.target === customDateModal) closeCustomDateModalFn();
});

applyCustomDate.addEventListener('click', () => {
    if (chartStartDate.value && chartEndDate.value) {
        chartPeriodBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-period="custom"]').classList.add('active');
        currentChartPeriod = 'custom';
        closeCustomDateModalFn();
        if (chartSelect.value) {
            renderCharts(chartSelect.value);
        }
    }
});

chartSelect.addEventListener('change', () => {
    const exerciseId = chartSelect.value;
    if (!exerciseId) {
        chartContent.classList.add('hidden');
        chartEmpty.classList.remove('hidden');
        return;
    }
    chartContent.classList.remove('hidden');
    chartEmpty.classList.add('hidden');
    renderCharts(exerciseId);
});
