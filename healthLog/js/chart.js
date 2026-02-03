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

let currentChartPeriod = 'week';
const LITE_CHART_PERIODS = ['week', '1month'];

function updateChartSelect() {
    const opts = [`<option value="">${t('selectExercise')}</option>`];
    const exercises = data.exercises;
    for (let i = 0, len = exercises.length; i < len; i++) {
        opts.push(`<option value="${exercises[i].id}">${exercises[i].name}</option>`);
    }
    chartSelect.innerHTML = opts.join('');
}

function getDateRange(period) {
    const now = new Date();
    const end = new Date(now);
    let start = new Date(now);

    switch(period) {
        case 'week':
            start.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
            break;
        case '1month': start.setMonth(now.getMonth() - 1); break;
        case '3month': start.setMonth(now.getMonth() - 3); break;
        case '6month': start.setMonth(now.getMonth() - 6); break;
        case '1year': start.setFullYear(now.getFullYear() - 1); break;
        case 'custom':
            if (chartStartDate.value && chartEndDate.value)
                return { start: chartStartDate.value, end: chartEndDate.value };
            start.setMonth(now.getMonth() - 1);
            break;
    }
    return { start: toDateStr(start), end: toDateStr(end) };
}

function updateChartPeriodButtons() {
    chartPeriodBtns.forEach(btn => {
        btn.classList.toggle('premium-locked', !isPremium && !LITE_CHART_PERIODS.includes(btn.dataset.period));
    });
}

function renderCharts(exerciseId) {
    const exIndex = getRecordsByExerciseIndex();
    const records = exIndex[exerciseId] || [];

    if (!records.length) {
        chartContent.classList.add('hidden');
        chartEmpty.textContent = t('noRecords');
        chartEmpty.classList.remove('hidden');
        return;
    }

    const range = getDateRange(currentChartPeriod);
    const byDate = {};

    for (let i = 0, len = records.length; i < len; i++) {
        const r = records[i];
        const d = r.datetime.slice(0, 10);
        if (d >= range.start && d <= range.end) {
            (byDate[d] || (byDate[d] = [])).push(r);
        }
    }

    const dates = Object.keys(byDate).sort();
    if (!dates.length) {
        chartContent.classList.add('hidden');
        chartEmpty.textContent = t('noRecordsInPeriod');
        chartEmpty.classList.remove('hidden');
        return;
    }

    chartContent.classList.remove('hidden');
    chartEmpty.classList.add('hidden');

    const chartData = [];
    for (let i = 0, len = dates.length; i < len; i++) {
        const date = dates[i];
        const dayRecs = byDate[date];
        let maxW = 0, vol = 0;
        for (let j = 0, jlen = dayRecs.length; j < jlen; j++) {
            const r = dayRecs[j];
            if (r.w > maxW) maxW = r.w;
            vol += r.w * r.r;
        }
        chartData.push({ date, maxWeight: maxW, totalVolume: vol });
    }

    renderWeightChart(chartData);
    renderVolumeChart(chartData);
}

function formatDateShort(dateStr) {
    const d = parseLocalDate(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

function renderWeightChart(chartData) {
    if (!chartData.length) { weightChart.innerHTML = `<div class="empty">${t('noData')}</div>`; return; }

    let maxW = chartData[0].maxWeight, minW = chartData[0].maxWeight;
    for (let i = 1, len = chartData.length; i < len; i++) {
        if (chartData[i].maxWeight > maxW) maxW = chartData[i].maxWeight;
        if (chartData[i].maxWeight < minW) minW = chartData[i].maxWeight;
    }

    const range = maxW - minW || 1;
    const pad = 12;
    const len = chartData.length;
    const points = [];

    for (let i = 0; i < len; i++) {
        points.push({
            x: pad + (i / (len - 1 || 1)) * (100 - pad * 2),
            y: pad + (100 - pad * 2) - ((chartData[i].maxWeight - minW) / range) * (100 - pad * 2)
        });
    }

    function spline(pts) {
        if (pts.length < 2) return '';
        if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[Math.max(i - 1, 0)];
            const p1 = pts[i], p2 = pts[i + 1];
            const p3 = pts[Math.min(i + 2, pts.length - 1)];
            d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
        }
        return d;
    }

    const pathD = spline(points);
    const last = points[points.length - 1];
    const areaD = pathD + ` L ${last.x} ${100 - pad} L ${pad} ${100 - pad} Z`;

    // dot 겹침 여부 판단 (최소 간격 3% 미만이면 숨김)
    let showDots = true;
    for (let i = 1; i < points.length; i++) {
        if (points[i].x - points[i - 1].x < 3) {
            showDots = false;
            break;
        }
    }

    const dots = [];
    if (showDots) {
        for (let i = 0; i < points.length; i++) {
            dots.push(`<div class="line-dot" style="left:${points[i].x}%;top:${points[i].y}%"></div>`);
        }
    }

    weightChart.innerHTML = `
        <div class="line-chart-inner">
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
            </svg>
            ${dots.join('')}
        </div>
        <div class="line-labels">
            <span class="line-label">${formatDateShort(chartData[0].date)}<br><strong>${chartData[0].maxWeight}kg</strong></span>
            <span class="line-label">${formatDateShort(chartData[len - 1].date)}<br><strong>${chartData[len - 1].maxWeight}kg</strong></span>
        </div>`;
}

function renderVolumeChart(chartData) {
    if (!chartData.length) { volumeChart.innerHTML = `<div class="empty">${t('noData')}</div>`; return; }

    let maxV = chartData[0].totalVolume, minV = chartData[0].totalVolume;
    for (let i = 1, len = chartData.length; i < len; i++) {
        if (chartData[i].totalVolume > maxV) maxV = chartData[i].totalVolume;
        if (chartData[i].totalVolume < minV) minV = chartData[i].totalVolume;
    }

    const barH = 120;
    const html = [];
    for (let i = 0, len = chartData.length; i < len; i++) {
        const d = chartData[i];
        const h = Math.max(4, (d.totalVolume / maxV) * barH);
        const isMax = d.totalVolume === maxV;
        const isMin = d.totalVolume === minV && maxV !== minV;
        const valCls = isMax ? 'bar-value max' : isMin ? 'bar-value min' : 'bar-value';
        const val = d.totalVolume >= 1000 ? (d.totalVolume / 1000).toFixed(1) + 'k' : d.totalVolume;
        html.push(`<div class="bar-item"><div class="bar-wrapper"><span class="${valCls}">${val}</span><div class="bar${isMax ? ' max' : ''}${isMin ? ' min' : ''}" style="height:${h}px"></div></div><span class="bar-label">${formatDateShort(d.date)}</span></div>`);
    }

    volumeChart.innerHTML = html.join('');
    volumeChart.scrollLeft = volumeChart.scrollWidth;
}

function openCustomDateModal() {
    if (!chartStartDate.value || !chartEndDate.value) {
        const now = new Date();
        chartEndDate.value = toDateStr(now);
        now.setMonth(now.getMonth() - 1);
        chartStartDate.value = toDateStr(now);
    }
    customDateModal.classList.add('show');
}

function closeCustomDateModalFn() { customDateModal.classList.remove('show'); }

chartPeriodBtns.forEach(btn => {
    btn.onclick = () => {
        const period = btn.dataset.period;
        if (!isPremium && !LITE_CHART_PERIODS.includes(period)) {
            showUpgradePrompt(t('extendedChartPeriod'));
            return;
        }
        if (period === 'custom') { openCustomDateModal(); return; }
        chartPeriodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentChartPeriod = period;
        if (chartSelect.value) renderCharts(chartSelect.value);
    };
});

document.getElementById('closeCustomDateModal').onclick = closeCustomDateModalFn;
document.getElementById('cancelCustomDate').onclick = closeCustomDateModalFn;
customDateModal.onclick = e => { if (e.target === customDateModal) closeCustomDateModalFn(); };

document.getElementById('applyCustomDate').onclick = () => {
    if (chartStartDate.value && chartEndDate.value) {
        chartPeriodBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-period="custom"]').classList.add('active');
        currentChartPeriod = 'custom';
        closeCustomDateModalFn();
        if (chartSelect.value) renderCharts(chartSelect.value);
    }
};

chartSelect.onchange = () => {
    const id = chartSelect.value;
    if (!id) {
        chartContent.classList.add('hidden');
        chartEmpty.classList.remove('hidden');
        return;
    }
    chartContent.classList.remove('hidden');
    chartEmpty.classList.add('hidden');
    renderCharts(id);
};
