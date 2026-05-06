// ==================== AI 루틴 ====================

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
let geminiApiKey = '';

let currentRoutineId = null;

function buildProfileSummary() {
    const p = userProfile;
    const lines = [];
    if (p.goal) lines.push(`목표: ${p.goal}`);
    if (p.level) lines.push(`운동 수준: ${p.level}`);
    if (p.frequency) lines.push(`주당 운동 빈도: ${p.frequency}`);
    if (p.equipment) lines.push(`이용 가능 기구: ${p.equipment}`);
    if (p.gender) lines.push(`성별: ${p.gender}`);
    if (p.ageGroup || p.ageExact) {
        const age = p.ageExact ? `${p.ageExact}세` : p.ageGroup;
        lines.push(`나이: ${age}`);
    }
    if (p.injuries) lines.push(`부상/주의: ${p.injuries}`);
    if (p.notes) lines.push(`추가사항: ${p.notes}`);
    return lines.join('\n') || '프로필 정보 없음';
}

function buildRecordsSummary() {
    if (!data.records || !data.records.length) return null;

    // 직전 루틴 생성일 이후 기록만 사용, 없으면 최근 8주
    const lastRoutineDate = routines.length > 0 ? routines[0].createdAt.slice(0, 10) : null;
    const fallbackDate = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 56);
        return toDateStr(d);
    })();
    const cutoff = lastRoutineDate || fallbackDate;

    const recent = data.records.filter(r => getDateFromDatetime(r.datetime) >= cutoff);
    if (!recent.length) return null;

    const byExercise = {};
    recent.forEach(r => {
        const ex = getExerciseById(r.exerciseId);
        if (!ex || !r.w) return;
        if (!byExercise[ex.name]) byExercise[ex.name] = [];
        byExercise[ex.name].push({ date: getDateFromDatetime(r.datetime), w: r.w, reps: r.r });
    });

    const lines = [];
    for (const [name, records] of Object.entries(byExercise)) {
        records.sort((a, b) => a.date.localeCompare(b.date));
        const weights = records.map(r => r.w);
        const firstW = weights[0];
        const lastW = weights[weights.length - 1];
        const maxW = Math.max(...weights);
        const sessions = new Set(records.map(r => r.date)).size;
        const unit = weightUnit === 'lb' ? 'lb' : 'kg';
        const trend = lastW > firstW ? `+${lastW - firstW}${unit} 증가` : lastW < firstW ? `${lastW - firstW}${unit}` : '변동 없음';
        lines.push(`${name}: ${sessions}회 수행 / 시작 ${firstW}${unit} → 최근 ${lastW}${unit} (최고 ${maxW}${unit}, ${trend})`);
    }

    return lines.length ? lines.join('\n') : null;
}

function buildPrompt() {
    const profileSummary = buildProfileSummary();
    const recordsSummary = buildRecordsSummary();

    let prompt = `당신은 전문 헬스 트레이너입니다. 아래 사용자 정보를 바탕으로 1개월(4주) 운동 루틴을 작성해주세요.

[사용자 정보]
${profileSummary}`;

    if (recordsSummary) {
        prompt += `

[최근 운동 기록 - 실제 무게 진행 상황]
${recordsSummary}`;
    }

    prompt += `

[작성 규칙]
1. 피트니스/운동과 관련 없는 내용은 무시하고 운동 루틴만 제공하세요.
2. Week 1 ~ Week 4 형식으로 4주 계획을 작성하세요.
3. 각 주의 운동 일정과 세트수, 반복수를 구체적으로 제시하세요.
4. 운동 기록이 있다면 현재 무게를 기준으로 주차별 목표 무게를 제안하세요.
5. 초보자면 기초 운동 위주로, 중급/고급이면 강도를 높여 구성하세요.
6. 부상 부위가 있으면 해당 운동을 제외하거나 대체 운동을 제시하세요.
7. 마크다운 없이 일반 텍스트로만 작성하세요.
8. 응답은 한국어로 작성하세요.`;

    return prompt;
}

async function generateRoutine() {
    if (!geminiApiKey) {
        const key = prompt('Gemini API 키를 입력하세요:');
        if (!key) return;
        geminiApiKey = key.trim();
        localStorage.setItem('geminiApiKey', geminiApiKey);
    }

    const btn = document.getElementById('generateRoutineBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="routine-spinner"></span>생성 중...`;
    }

    try {
        const res = await fetch(`${GEMINI_API_URL}?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: buildPrompt() }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 3000 }
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err?.error?.message || `HTTP ${res.status}`);
        }

        const json = await res.json();
        const content = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) throw new Error('응답 내용이 없습니다.');

        const recordsSummary = buildRecordsSummary();
        const routine = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            content: content,
            profile: { ...userProfile },
            hasRecords: !!recordsSummary
        };

        routines.unshift(routine);
        await save();

        navigate('my/routinedetail');
        handleRoute();
        openRoutineDetail(routine.id);
    } catch (e) {
        if (e.message.includes('API_KEY_INVALID') || e.message.includes('400')) {
            geminiApiKey = '';
            localStorage.removeItem('geminiApiKey');
        }
        if (typeof showAlert === 'function') {
            showAlert('루틴 생성 실패: ' + e.message, 'error');
        } else {
            alert('루틴 생성 실패: ' + e.message);
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>AI 루틴 생성`;
        }
    }
}

function formatRoutineDate(isoStr) {
    const d = new Date(isoStr);
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${y}.${mo}.${day} ${h}:${mi}:${s}`;
}

function renderRoutineList() {
    const container = document.getElementById('routineListContainer');
    if (!container) return;

    if (routines.length === 0) {
        container.innerHTML = `
            <div class="routine-empty">
                <p>아직 생성된 루틴이 없어요.</p>
                <p class="routine-empty-sub">프로필을 작성하고 AI 루틴을 생성해보세요!</p>
            </div>`;
        return;
    }

    container.innerHTML = routines.map(r => {
        const preview = r.content.slice(0, 80).replace(/\n/g, ' ');
        const badge = r.hasRecords
            ? `<span class="routine-badge routine-badge-records">기록 포함</span>`
            : `<span class="routine-badge routine-badge-profile">프로필만</span>`;
        return `
            <div class="routine-card" data-id="${r.id}">
                <div class="routine-card-date">${formatRoutineDate(r.createdAt)} ${badge}</div>
                <div class="routine-card-preview">${preview}${r.content.length > 80 ? '...' : ''}</div>
            </div>`;
    }).join('');
}

function openRoutineDetail(id) {
    currentRoutineId = id;
    const routine = routines.find(r => r.id === id);
    if (!routine) return;

    const container = document.getElementById('routineDetailContainer');
    if (!container) return;

    const profileLines = buildProfileSummaryFromSnapshot(routine.profile);

    const badge = routine.hasRecords
        ? `<span class="routine-badge routine-badge-records">프로필 + 운동기록 기반</span>`
        : `<span class="routine-badge routine-badge-profile">프로필 기반</span>`;

    container.innerHTML = `
        <div class="routine-detail-date">${formatRoutineDate(routine.createdAt)} ${badge}</div>
        ${profileLines ? `<div class="routine-detail-profile"><h3>프로필 정보</h3><pre class="routine-profile-pre">${profileLines}</pre></div>` : ''}
        <div class="routine-detail-content"><pre class="routine-content-pre">${escapeHtml(routine.content)}</pre></div>`;
}

function buildProfileSummaryFromSnapshot(p) {
    if (!p) return '';
    const lines = [];
    if (p.goal) lines.push(`목표: ${p.goal}`);
    if (p.level) lines.push(`수준: ${p.level}`);
    if (p.frequency) lines.push(`빈도: ${p.frequency}`);
    if (p.equipment) lines.push(`기구: ${p.equipment}`);
    if (p.gender) lines.push(`성별: ${p.gender}`);
    if (p.ageGroup || p.ageExact) {
        const age = p.ageExact ? `${p.ageExact}세` : p.ageGroup;
        lines.push(`나이: ${age}`);
    }
    if (p.injuries) lines.push(`부상: ${p.injuries}`);
    if (p.notes) lines.push(`추가: ${p.notes}`);
    return lines.join('\n');
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function deleteCurrentRoutine() {
    if (!currentRoutineId) return;
    if (!confirm('이 루틴을 삭제하시겠어요?')) return;
    routines = routines.filter(r => r.id !== currentRoutineId);
    currentRoutineId = null;
    save();
    navigate('my/routines');
    handleRoute();
}

// 초기화
(function initRoutine() {
    const savedKey = localStorage.getItem('geminiApiKey');
    if (savedKey) geminiApiKey = savedKey;

    const genBtn = document.getElementById('generateRoutineBtn');
    if (genBtn) genBtn.onclick = generateRoutine;

    const listContainer = document.getElementById('routineListContainer');
    if (listContainer) {
        listContainer.onclick = e => {
            const card = e.target.closest('.routine-card');
            if (!card) return;
            navigate('my/routinedetail');
            handleRoute();
            openRoutineDetail(card.dataset.id);
        };
    }

    const delBtn = document.getElementById('routineDeleteBtn');
    if (delBtn) delBtn.onclick = deleteCurrentRoutine;

    const detailBackBtn = document.getElementById('myRoutineDetailBackBtn');
    if (detailBackBtn) detailBackBtn.onclick = () => { navigate('my/routines'); handleRoute(); };
})();

window.renderRoutineList = renderRoutineList;
window.openRoutineDetail = openRoutineDetail;
window.deleteCurrentRoutine = deleteCurrentRoutine;
