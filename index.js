const lapBtn = document.getElementById('lapBtn');
const stopBtn = document.getElementById('stopBtn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timer = document.getElementById('timer');
const timersList = document.getElementById('timersList');

let intervalId = null;
let millisecondsOffset = 0;
let millisecondsWhenStopped = 0;

let newLapStart = 0;
let lapTimer = 0;
let lapTimerInMilliseconds = 0;
let lapTimerMillisecondsOffset = 0;
let lapMillisecondsWhenStopped = 0;


const lapTimers = [];
const timeNodes = [];

const increment = (startTime, millisecondsOffset = 0) => {
    const current = Date.now();
    const time = current - startTime;
    const formattedTime = formatTime(time + millisecondsOffset);

    timer.textContent = formattedTime;

    lapTimer = timeNodes.length <= 1 ? formattedTime : millisecondsOffset !== 0 ? formatTime(time + lapTimerMillisecondsOffset) : formatTime(current - newLapStart);
    lapTimerInMilliseconds = timeNodes.length <= 1 ? time + millisecondsOffset : millisecondsOffset !== 0 ? (time + lapTimerMillisecondsOffset) : (current - newLapStart);
    timeNodes[timeNodes.length - 1].children[1].textContent = lapTimer;

    millisecondsWhenStopped = time + millisecondsOffset;
    lapMillisecondsWhenStopped = lapTimerInMilliseconds;
    console.log(lapTimerMillisecondsOffset);
}

const formatTime = (timeInMilliseconds) => {
    const seconds = Math.floor(timeInMilliseconds / 1000);
    const minutes = Math.floor(timeInMilliseconds / 60000);
    const hundredthSecond = timeInMilliseconds > 60 ? (timeInMilliseconds / 10) % 100 : timeInMilliseconds / 10;
    const flooredHundredthSecond = Math.floor(hundredthSecond)

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedHundredthSecond = flooredHundredthSecond.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}.${formattedHundredthSecond}`
}

const createLapRow = () => {
    const lapRow = document.createElement('tr');
    const lapNumber = document.createElement('td');
    const lapTime = document.createElement('td');

    const formattedTime = lapTimer;

    lapTime.innerText = formattedTime ;
    lapNumber.innerText = `Lap ${timeNodes.length + 1}`;


    lapRow.append(lapNumber, lapTime)
    timersList.appendChild(lapRow);

    return lapRow;
}

function startTime () {
    const currentTime = timer.textContent;
    const start = Date.now();
    if (currentTime !== '00:00.00') {
        intervalId = setInterval(() => increment(start, millisecondsOffset), 10);
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        resetBtn.classList.add('hidden');
        lapBtn.classList.remove('hidden')
    } else {
        intervalId = setInterval(() => increment(start), 10);
        const lapRow = createLapRow();
        timeNodes.push(lapRow);
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        lapBtn.classList.replace('lapoff', 'lap');
    }
}

function stopTime () {
    clearInterval(intervalId);
    millisecondsOffset = millisecondsWhenStopped;
    lapTimerMillisecondsOffset = lapMillisecondsWhenStopped;
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    lapBtn.classList.add('hidden')
}

function resetTime () {
    timer.textContent = '00:00.00';
    resetBtn.classList.add('hidden');
    lapBtn.classList.remove('hidden', 'lap');
    lapBtn.classList.add('lapoff')
    timersList.innerHTML = "";
    lapTimers.length = 0;
    timeNodes.length = 0;
}

function recordLap () {
    const current = Date.now();
    
    lapTimers.push(lapTimerInMilliseconds);
    lapTimerMillisecondsOffset = 0;
    const lapRow = createLapRow();
    timeNodes.push(lapRow);
    
    newLapStart = current;
    console.log(lapTimers);

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

startBtn.onclick = startTime;
stopBtn.addEventListener('click', stopTime);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetTime);