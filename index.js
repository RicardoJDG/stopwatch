const lapBtn = document.getElementById('lapBtn');
const stopBtn = document.getElementById('stopBtn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timer = document.getElementById('timer');
const timersList = document.getElementById('timersList');

let mainTimerInterval = null;
let lapsInterval = null;

let millisecondsOffset = 0;
let millisecondsWhenStopped = 0;

let newLapStart = 0;
let lapTimer = 0;
let lapTimerWhenStopped = 0;
let lapTimerMillisecondsOffset = 0;


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
}

const formatTime = (timeInMilliseconds) => {
    const seconds = Math.floor(timeInMilliseconds / 1000);
    const minutes = Math.floor(timeInMilliseconds / 60000);
    const hundredthSecond = timeInMilliseconds > 60 ? (timeInMilliseconds / 10) % 100 : timeInMilliseconds / 10;
    const flooredHundredthSecond = Math.floor(hundredthSecond)

    return `${padTime(minutes)}:${padTime(seconds)}.${padTime(flooredHundredthSecond)}`
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

const padTime = (time) => {
    return `${time.toString().padStart(2, '0')}`
}

const beginTimer = (displayNode, startTime, millisecondsOffset = 0) => {
    const current = Date.now();
    const time = current - startTime;
    const formattedTime = formatTime(time + millisecondsOffset)

    displayNode.textContent = formattedTime;

    return time + millisecondsOffset;
}

function startTime () {
    const currentTime = timer.textContent;
    const start = Date.now();
    if (currentTime !== '00:00.00') {
        console.log(`Starting when different than 0: ${millisecondsOffset} and ${lapTimerMillisecondsOffset}`);
        const currentLap = timeNodes[timeNodes.length - 1].children[1]
        mainTimerInterval = setInterval(() => millisecondsWhenStopped = beginTimer(timer, start, millisecondsOffset), 1000 / 60);
        lapsInterval = setInterval(() => lapTimerWhenStopped = beginTimer(currentLap, start, lapTimerMillisecondsOffset), 1000 / 60);
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        resetBtn.classList.add('hidden');
        lapBtn.classList.remove('hidden')
    } else {
        const lapRow = createLapRow();
        timeNodes.push(lapRow);
        const currentLap = lapRow.children[1];
        mainTimerInterval = setInterval(() => millisecondsWhenStopped = beginTimer(timer, start), 1000 / 60);
        lapsInterval = setInterval(() => lapTimerWhenStopped = beginTimer(currentLap, start), 1000 / 60);
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        lapBtn.classList.replace('lapoff', 'lap');
    }
}

function stopTime () {
    const current = Date.now();
    clearInterval(mainTimerInterval);
    clearInterval(lapsInterval);
    millisecondsOffset = millisecondsWhenStopped;
    lapTimerMillisecondsOffset = lapTimerWhenStopped;
    console.log(millisecondsWhenStopped);
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
    clearInterval(lapsInterval);
    lapTimers.push(lapTimerWhenStopped);
    const lapRow = createLapRow();
    timeNodes.push(lapRow);
    const currentLap = timeNodes[timeNodes.length - 1].children[1];
    lapsInterval = setInterval(() => lapTimerWhenStopped = beginTimer(currentLap, current), 1000 / 60);
    
    console.log(lapTimers);

    if (lapTimers.length >= 3) {
        timeNodes.forEach((node) => node.className="")
        const max = Math.max(...lapTimers);
        const min = Math.min (...lapTimers);

        const maxIndex = lapTimers.indexOf(max)
        const minIndex = lapTimers.indexOf(min)

        timeNodes[maxIndex].classList.add('worst');
        timeNodes[minIndex].classList.add('best');
    }
}

startBtn.onclick = startTime;
stopBtn.addEventListener('click', stopTime);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetTime);