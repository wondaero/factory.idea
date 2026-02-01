// ==================== 타이머 ====================

let timerDuration = 60;
let timerRemaining = 60;
let timerInterval = null;
let timerRunning = false;

const timerDisplay = document.getElementById('timerDisplay');
const timerStatus = document.getElementById('timerStatus');
const timerToggle = document.getElementById('timerToggle');
const timerReset = document.getElementById('timerReset');
const timerProgressBar = document.getElementById('timerProgressBar');
const presetBtns = document.querySelectorAll('.preset-btn');
const customTimeInput = document.getElementById('customTime');
const setCustomTimeBtn = document.getElementById('setCustomTime');

function formatTime(seconds) {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timerRemaining);
    timerProgressBar.style.strokeDashoffset = 283 * (1 - timerRemaining / timerDuration);
}

function setTimerFn(seconds) {
    timerDuration = seconds;
    timerRemaining = seconds;
    timerRunning = false;
    clearInterval(timerInterval);
    timerToggle.textContent = '시작';
    timerToggle.classList.remove('pause');
    timerToggle.classList.add('start');
    timerStatus.textContent = '준비';
    updateTimerDisplay();
}

function startTimer() {
    if (timerRemaining <= 0) timerRemaining = timerDuration;
    timerRunning = true;
    timerToggle.textContent = '일시정지';
    timerToggle.classList.remove('start');
    timerToggle.classList.add('pause');
    timerStatus.textContent = '진행 중';

    timerInterval = setInterval(() => {
        timerRemaining--;
        updateTimerDisplay();
        if (timerRemaining <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            timerToggle.textContent = '시작';
            timerToggle.classList.remove('pause');
            timerToggle.classList.add('start');
            timerStatus.textContent = '완료!';

            // 진동
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);

            // 알림음
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = 800;
                gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.5);
            } catch (e) {}
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerToggle.textContent = '계속';
    timerToggle.classList.remove('pause');
    timerToggle.classList.add('start');
    timerStatus.textContent = '일시정지';
}

// 이벤트 리스너
timerToggle.addEventListener('click', () => timerRunning ? pauseTimer() : startTimer());
timerReset.addEventListener('click', () => setTimerFn(timerDuration));

presetBtns.forEach(btn => btn.addEventListener('click', () => {
    presetBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setTimerFn(parseInt(btn.dataset.time));
}));

setCustomTimeBtn.addEventListener('click', () => {
    const time = parseInt(customTimeInput.value);
    if (time > 0) {
        presetBtns.forEach(b => b.classList.remove('active'));
        setTimerFn(time);
        customTimeInput.value = '';
    }
});

customTimeInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') setCustomTimeBtn.click();
});
