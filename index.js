const lapBtn = document.getElementById('lapBtn');
const stopBtn = document.getElementById('stopBtn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timer = document.getElementById('timer');
const ul = document.getElementById('timersList');

let handle = null;
let hiddenTimer = 0;
let compensation = 0;
let hiddentime = 0;
let hiddenStart = 0;
const lapTimers = [];
const timeNodes = [];

const increment = (startTime, timeCompensation = 0) => {
    const current = Date.now();
    const time = current - startTime;
    const formattedTime = formatter(time + timeCompensation);
    timer.textContent = formattedTime;
    hiddenTimer = formattedTime;
    hiddentime = time + timeCompensation;
}

const formatter = (difference) => {
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(difference / 60000);
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const hundredthSecond = difference > 60 ? (difference / 10) % 100 : difference / 10;
    const flooredMilliseconds = Math.floor(hundredthSecond)
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return `${formattedMinutes}:${formattedSeconds}.${flooredMilliseconds}`
}

function startTime (e) {
    e.preventDefault();
    const currentTime = timer.textContent;
    const start = Date.now();
    if (currentTime !== '00:00.00') {
        handle = setInterval(() => increment(start, compensation), 10);
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        resetBtn.classList.add('hidden');
        lapBtn.classList.remove('hidden')
    } else {
        hiddenStart = start;
        handle = setInterval(() => increment(start), 10);
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        lapBtn.classList.remove('lapoff');
        lapBtn.classList.add('lap');
    }
}

function stopTime (e) {
    e.preventDefault();
    clearInterval(handle);
    compensation = hiddentime;
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    lapBtn.classList.add('hidden')
}

function resetTime (e) {
    e.preventDefault();
    timer.textContent = '00:00.00';
    resetBtn.classList.add('hidden');
    lapBtn.classList.remove('hidden', 'lap');
    lapBtn.classList.add('lapoff')
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
}

startBtn.addEventListener('click', startTime);
stopBtn.addEventListener('click', stopTime);
lapBtn.addEventListener('click', lap);
resetBtn.addEventListener('click', resetTime);