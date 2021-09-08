const lapBtn = document.getElementById('lapBtn');
const stopBtn = document.getElementById('stopBtn');
const startBtn = document.getElementById('startBtn');
const timer = document.getElementById('timer');

var handle = null;
var hiddenTimer = 0;

const increment = (startTime) => {
    const current = Date.now();
    const time = current - startTime;
    timer.textContent = Math.floor(time / 1000);
}

function startTime (e) {
    e.preventDefault();
    const start = Date.now();
    handle = setInterval(() => increment(start), 10);
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
}

function stopTime (e) {
    e.preventDefault();
    clearInterval(handle);
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
}

function lap (e) {
    e.preventDefault();
    const ul = document.getElementById('timersList');
    const li = document.createElement("li");
    li.innerText = timer.textContent;
    const lapTimers = [];
    lapTimers.push(timer.textContent);
    ul.appendChild(li)

}

startBtn.addEventListener('click', startTime);
stopBtn.addEventListener('click', stopTime);
lapBtn.addEventListener('click', lap);