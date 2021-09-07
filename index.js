const lapBtn = document.getElementById('lapBtn');
const startBtn = document.getElementById('startBtn');
const timer = document.getElementById('timer');

const startTime = (e) => {
    e.preventDefault();
    timer.innerHTML = 'Hello';
}

const stopTime = (e) => {
    e.preventDefault();
}

startBtn.addEventListener('click', startTime);
