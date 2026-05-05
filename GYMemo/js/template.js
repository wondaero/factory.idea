// ==================== 템플릿 ====================

const addTemplatePage = document.getElementById('addTemplatePage');
const newTemplateName = document.getElementById('newTemplateName');
const newTemplateMemo = document.getElementById('newTemplateMemo');
const templateOrderList = document.getElementById('templateOrderList');
const templateExercisePicker = document.getElementById('templateExercisePicker');
const templateList = document.getElementById('templateList');

let templateSortOrder = 'registered';
let templateSearchQuery = '';
let editingTemplateId = null;
let selectedExerciseIds = [];

// ==================== 렌더링 ====================

function renderTemplateList() {
    if (!templates.length) {
        templateList.innerHTML = `<div class="empty">${t('noTemplates')}</div>`;
        return;
    }

    let list = [...templates];
    if (templateSearchQuery) {
        const q = templateSearchQuery.toLowerCase();
        list = list.filter(tmpl => tmpl.name.toLowerCase().includes(q));
    }
    if (templateSortOrder === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name));
    }

    const html = list.map(tmpl => {
        const exercises = (tmpl.exercises || [])
            .map(id => getExerciseById(id))
            .filter(Boolean);
        const tags = exercises.map(ex =>
            `<span class="template-ex-tag" style="background:${ex.color}22;color:${ex.color};border-color:${ex.color}44">
                <span class="template-ex-dot" style="background:${ex.color}"></span>${ex.name}
            </span>`
        ).join('');
        return `
        <div class="template-card" data-id="${tmpl.id}">
            <div class="template-card-top">
                <div class="template-card-left">
                    <div class="template-card-name">${tmpl.name}</div>
                    ${tmpl.memo ? `<div class="template-card-memo">${tmpl.memo}</div>` : ''}
                </div>
                <div class="template-card-right">
                    <span class="template-card-count">${exercises.length}개</span>
                    <button class="template-delete-btn" data-id="${tmpl.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
            ${exercises.length ? `<div class="template-card-tags">${tags}</div>` : '<div class="template-card-empty">운동 없음</div>'}
        </div>`;
    }).join('');

    templateList.innerHTML = html;

    templateList.querySelectorAll('.template-card').forEach(card => {
        card.onclick = () => {
            const tmpl = templates.find(tmpl => tmpl.id === card.dataset.id);
            if (tmpl) openEditTemplatePage(tmpl);
        };
    });

    templateList.querySelectorAll('.template-delete-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const tmpl = templates.find(tmpl => tmpl.id === id);
            if (!tmpl) return;
            if (!confirm(t('deleteTemplateConfirm')(tmpl.name))) return;
            templates = templates.filter(tmpl => tmpl.id !== id);
            save();
            renderTemplateList();
        };
    });
}

// ==================== 추가 페이지 ====================

function openAddTemplatePage() {
    editingTemplateId = null;
    selectedExerciseIds = [];
    newTemplateName.value = '';
    newTemplateMemo.value = '';
    document.querySelector('#addTemplatePage h1').textContent = '템플릿 추가';
    renderTemplatePicker();
    renderTemplateOrder();
    addTemplatePage.classList.remove('hidden');
    updateFab(false);
}

function openEditTemplatePage(tmpl) {
    editingTemplateId = tmpl.id;
    selectedExerciseIds = [...(tmpl.exercises || [])];
    newTemplateName.value = tmpl.name;
    newTemplateMemo.value = tmpl.memo || '';
    document.querySelector('#addTemplatePage h1').textContent = '템플릿 수정';
    renderTemplatePicker();
    renderTemplateOrder();
    addTemplatePage.classList.remove('hidden');
    updateFab(false);
}

function closeAddTemplatePage() {
    editingTemplateId = null;
    document.querySelector('#addTemplatePage h1').textContent = '템플릿 추가';
    addTemplatePage.classList.add('hidden');
    updateFab(true);
}

function renderTemplatePicker() {
    const exercises = data.exercises;
    if (!exercises.length) {
        templateExercisePicker.innerHTML = `<div class="empty">${t('noExercises')}</div>`;
        return;
    }
    templateExercisePicker.innerHTML = exercises.map(ex => {
        const selected = selectedExerciseIds.includes(ex.id);
        return `
        <button class="template-picker-item ${selected ? 'selected' : ''}" data-id="${ex.id}">
            <span class="template-picker-dot" style="background:${ex.color}"></span>
            <span class="template-picker-name">${ex.name}</span>
            ${selected ? '<svg class="template-picker-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </button>`;
    }).join('');

    templateExercisePicker.querySelectorAll('.template-picker-item').forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            if (selectedExerciseIds.includes(id)) {
                selectedExerciseIds = selectedExerciseIds.filter(i => i !== id);
            } else {
                selectedExerciseIds.push(id);
            }
            renderTemplatePicker();
            renderTemplateOrder();
        };
    });
}

function renderTemplateOrder() {
    if (!selectedExerciseIds.length) {
        templateOrderList.innerHTML = `<div class="template-order-empty">${t('tapToAddExercise')}</div>`;
        return;
    }

    templateOrderList.innerHTML = selectedExerciseIds.map((id, idx) => {
        const ex = getExerciseById(id);
        if (!ex) return '';
        return `
        <div class="template-order-item" data-id="${id}" draggable="true">
            <svg class="drag-handle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/>
            </svg>
            <span class="template-picker-dot" style="background:${ex.color}"></span>
            <span class="template-order-name">${ex.name}</span>
            <button class="template-order-remove" data-id="${id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>`;
    }).join('');

    templateOrderList.querySelectorAll('.template-order-remove').forEach(btn => {
        btn.onclick = () => {
            selectedExerciseIds = selectedExerciseIds.filter(i => i !== btn.dataset.id);
            renderTemplatePicker();
            renderTemplateOrder();
        };
    });

    initDragOrder();
}

// ==================== 드래그 & 드롭 ====================

function initDragOrder() {
    let dragging = null;
    let placeholder = null;

    templateOrderList.querySelectorAll('.template-order-item').forEach(item => {
        const handle = item.querySelector('.drag-handle');

        handle.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            dragging = item;
            item.classList.add('dragging');

            placeholder = document.createElement('div');
            placeholder.className = 'drag-placeholder';
            placeholder.style.height = item.offsetHeight + 'px';
            item.after(placeholder);

            handle.setPointerCapture(e.pointerId);
        });

        handle.addEventListener('pointermove', (e) => {
            if (dragging !== item) return;

            const y = e.clientY;
            const siblings = [...templateOrderList.querySelectorAll('.template-order-item:not(.dragging)')];
            let insertBefore = null;
            for (const sib of siblings) {
                const r = sib.getBoundingClientRect();
                if (y < r.top + r.height / 2) { insertBefore = sib; break; }
            }
            if (insertBefore) {
                templateOrderList.insertBefore(placeholder, insertBefore);
            } else {
                templateOrderList.appendChild(placeholder);
            }
        });

        handle.addEventListener('pointerup', () => {
            if (dragging !== item) return;
            item.classList.remove('dragging');
            placeholder.replaceWith(item);
            dragging = null;
            placeholder = null;

            selectedExerciseIds = [...templateOrderList.querySelectorAll('.template-order-item')]
                .map(el => el.dataset.id);
        });
    });
}

// ==================== 저장 ====================

document.getElementById('submitAddTemplate').onclick = () => {
    const name = newTemplateName.value.trim();
    const memo = newTemplateMemo.value.trim();
    if (!name) {
        alert(t('enterTemplateName') || '템플릿 이름을 입력하세요');
        return;
    }
    if (!selectedExerciseIds.length) {
        alert(t('tapToAddExercise') || '운동을 선택하세요');
        return;
    }

    if (editingTemplateId) {
        const tmpl = templates.find(tmpl => tmpl.id === editingTemplateId);
        if (tmpl) { tmpl.name = name; tmpl.memo = memo; tmpl.exercises = [...selectedExerciseIds]; }
    } else {
        templates.push({ id: generateId(), name, memo, exercises: [...selectedExerciseIds] });
    }

    save();
    closeAddTemplatePage();
    renderTemplateList();
};

document.getElementById('closeAddTemplate').onclick = closeAddTemplatePage;

// ==================== 검색/소트 ====================

document.getElementById('templateSearch').oninput = (e) => {
    templateSearchQuery = e.target.value;
    renderTemplateList();
};

document.getElementById('templateSortToggle').querySelectorAll('.sort-btn').forEach(btn => {
    btn.onclick = () => {
        document.getElementById('templateSortToggle').querySelectorAll('.sort-btn')
            .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        templateSortOrder = btn.dataset.sort;
        renderTemplateList();
    };
});
