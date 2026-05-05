// ==================== 프로필 ====================

const SINGLE_SELECT_FIELDS = ['goal', 'level', 'frequency', 'equipment', 'gender', 'age'];
const OTHER_FIELDS = ['goal', 'frequency', 'equipment']; // 기타 입력 가능한 필드

function renderProfile() {
    document.querySelectorAll('.profile-btn').forEach(btn => {
        const field = btn.dataset.field;
        const value = btn.dataset.value;
        const isMulti = btn.classList.contains('multi');

        if (isMulti) {
            btn.classList.toggle('active', (userProfile.injuries || []).includes(value));
        } else if (value === 'other') {
            const saved = userProfile[field];
            const isOther = saved && !getPresetValues(field).includes(saved);
            btn.classList.toggle('active', isOther);
        } else {
            btn.classList.toggle('active', userProfile[field] === value);
        }
    });

    // 기타 input 표시/값 복원
    document.querySelectorAll('.profile-other-input[data-field]').forEach(input => {
        const field = input.dataset.field;
        if (field === 'injuries-other') {
            input.value = userProfile.injuriesOther || '';
            return;
        }
        const saved = userProfile[field];
        const isOther = saved && !getPresetValues(field).includes(saved);
        input.classList.toggle('hidden', !isOther);
        if (isOther) input.value = saved;
    });
}

function getPresetValues(field) {
    const presets = {
        goal: ['diet', 'muscle', 'fitness'],
        frequency: ['2-3', '4-5', '6-7'],
        equipment: ['gym', 'home', 'bodyweight'],
    };
    return presets[field] || [];
}

document.querySelectorAll('.profile-btn').forEach(btn => {
    btn.onclick = () => {
        const field = btn.dataset.field;
        const value = btn.dataset.value;
        const isMulti = btn.classList.contains('multi');

        if (isMulti) {
            const arr = userProfile.injuries || [];
            if (value === 'none') {
                userProfile.injuries = arr.includes('none') ? [] : ['none'];
            } else {
                const filtered = arr.filter(v => v !== 'none');
                const idx = filtered.indexOf(value);
                if (idx >= 0) filtered.splice(idx, 1);
                else filtered.push(value);
                userProfile.injuries = filtered;
            }
        } else if (value === 'other') {
            // 기타 선택 → input 표시
            const input = document.querySelector(`.profile-other-input[data-field="${field}"]`);
            if (input) {
                const isOther = userProfile[field] && !getPresetValues(field).includes(userProfile[field]);
                if (isOther) {
                    // 이미 기타 선택 중 → 해제
                    userProfile[field] = null;
                    input.value = '';
                    input.classList.add('hidden');
                } else {
                    userProfile[field] = '';
                    input.classList.remove('hidden');
                    input.focus();
                }
            }
        } else {
            userProfile[field] = userProfile[field] === value ? null : value;
            // 기타 input 숨기기
            const input = document.querySelector(`.profile-other-input[data-field="${field}"]`);
            if (input) { input.classList.add('hidden'); input.value = ''; }
        }

        save();
        renderProfile();
    };
});

// 기타 input 실시간 저장
document.querySelectorAll('.profile-other-input').forEach(input => {
    input.addEventListener('input', () => {
        const field = input.dataset.field;
        if (field === 'injuries-other') {
            userProfile.injuriesOther = input.value.trim();
        } else {
            userProfile[field] = input.value.trim();
        }
        save();
        renderProfile();
    });
});
