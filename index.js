const lapBtn = document.getElementById('lapBtn');
const stopBtn = document.getElementById('stopBtn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timer = document.getElementById('timer');
const ul = document.getElementById('timersList');

var handle = null;
var hiddenStart = 0;
var hiddenTimer = 0;
const lapTimers = [];
const timeNodes = [];

const increment = (startTime, timeCompensation = 0) => {
    const current = Date.now();
    const time = current - startTime;
    timer.textContent = Math.floor((time) / 1000) + timeCompensation;
    hiddenTimer = Math.floor((current - hiddenStart) / 1000)
}

function startTime (e) {
    e.preventDefault();
    const currentTime = parseInt(timer.textContent);
    const start = Date.now();
    if (currentTime !== 0) {
        console.log(currentTime);
        handle = setInterval(() => increment(start, currentTime), 10);
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
    } else {
        hiddenStart = start;
        handle = setInterval(() => increment(start), 10);
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
    }
}

function stopTime (e) {
    e.preventDefault();
    clearInterval(handle);
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    lapBtn.classList.add('hidden')
}

function resetTime (e) {
    e.preventDefault();
    timer.textContent = 0;
    resetBtn.classList.add('hidden');
    lapBtn.classList.remove('hidden');
    ul.innerHTML = "";
    lapTimers.length = 0;
    timeNodes.length = 0;
}

function lap (e) {
    e.preventDefault();
    const current = Date.now();

    const li = document.createElement("li");
    li.innerText = hiddenTimer;
    ul.appendChild(li);

    lapTimers.push(hiddenTimer);
    timeNodes.push(li);

    hiddenStart = current;

    if (lapTimers.length >= 3) {
        timeNodes.forEach((node) => node.className="")
        const max = Math.max(...lapTimers);
        const min = Math.min (...lapTimers);

        const maxIndex = lapTimers.indexOf(max)
        const minIndex = lapTimers.indexOf(min)

        timeNodes[maxIndex].classList.add('best');
        timeNodes[minIndex].classList.add('worst');
    }
    console.log(timeNodes);
}

startBtn.addEventListener('click', startTime);
stopBtn.addEventListener('click', stopTime);
lapBtn.addEventListener('click', lap);
resetBtn.addEventListener('click', resetTime);