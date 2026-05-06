// ==================== 프로필 ====================

function renderProfile() {
    document.querySelectorAll('.profile-input').forEach(input => {
        const field = input.dataset.field;
        const val = userProfile[field];
        input.value = (val !== null && val !== undefined) ? val : '';
        if (field === 'notes') {
            const count = document.getElementById('profileNotesCount');
            if (count) count.textContent = (val || '').length;
        }
    });

    // 칩 active 표시
    document.querySelectorAll('.profile-chip').forEach(chip => {
        const field = chip.dataset.field;
        const value = chip.dataset.value;
        if (field === 'age') {
            chip.classList.toggle('active', userProfile.ageGroup === value);
        } else {
            chip.classList.toggle('active', userProfile[field] === value);
        }
    });
}

// 칩 클릭 → 저장
document.querySelectorAll('.profile-chip').forEach(chip => {
    chip.onclick = () => {
        const field = chip.dataset.field;
        const value = chip.dataset.value;
        const input = document.querySelector(`.profile-input[data-field="${field}"]`);

        if (field === 'age') {
            // 나이: 칩은 ageGroup, input은 ageExact로 분리
            userProfile.ageGroup = userProfile.ageGroup === value ? null : value;
        } else if (field === 'gender') {
            userProfile[field] = userProfile[field] === value ? null : value;
        } else {
            const isSame = userProfile[field] === value;
            userProfile[field] = isSame ? '' : value;
            if (input) input.value = isSame ? '' : value;
        }

        save();
        renderProfile();
    };
});

// input/textarea 직접 입력 → 저장
document.querySelectorAll('.profile-input').forEach(input => {
    input.addEventListener('input', () => {
        const field = input.dataset.field;
        let value = input.value;
        if (field === 'ageExact' && value) {
            const n = parseInt(value);
            if (n < 10) { value = '10'; input.value = value; }
            if (n > 100) { value = '100'; input.value = value; }
        }
        if (field === 'notes') {
            const count = document.getElementById('profileNotesCount');
            if (count) count.textContent = value.length;
        }
        userProfile[field] = value;
        save();
        renderProfile();
    });
});
