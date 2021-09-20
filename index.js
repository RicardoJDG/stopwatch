const lapBtn = document.getElementById("lapBtn");
const stopBtn = document.getElementById("stopBtn");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const timer = document.getElementById("timer");
const timersList = document.getElementById("timersList").children[0];
const startingHtml = timersList.innerHTML;
const initialTimerlistLength = timersList.rows.length;

let mainTimerInterval = null;
let lapsInterval = null;

let stopTimeStamp = 0;
let millisecondsWhenStopped = 0;

let newLapStart = 0;
let lapTimer = 0;
let lapTimerWhenStopped = 0;
let lapTimerMillisecondsOffset = 0;

const lapTimers = [];
const timeNodes = [];

const formatTime = (timeInMilliseconds) => {
  const seconds = Math.floor(timeInMilliseconds / 1000);
  const formattedSeconds = seconds < 60 ? seconds : seconds % 60;
  const minutes = Math.floor(timeInMilliseconds / 60000);
  const formattedMinutes = minutes < 60 ? minutes : minutes % 60;
  const hundredthSecond =
    timeInMilliseconds > 60
      ? (timeInMilliseconds / 10) % 100
      : timeInMilliseconds / 10;
  const flooredHundredthSecond = Math.floor(hundredthSecond);
  const hours = minutes >= 60 ? Math.floor(minutes / 60) : 0;

  return hours > 0
    ? `${padTime(hours)}:${padTime(formattedMinutes)}:${padTime(
        formattedSeconds
      )}.${padTime(flooredHundredthSecond)}`
    : `${padTime(formattedMinutes)}:${padTime(formattedSeconds)}.${padTime(
        flooredHundredthSecond
      )}`;
};

const createLapRow = () => {
  const lapRow = document.createElement("tr");
  const lapNumber = document.createElement("td");
  const lapTime = document.createElement("td");

  lapNumber.innerText = `Lap ${timeNodes.length + 1}`;

  lapRow.append(lapNumber, lapTime);
  timersList.prepend(lapRow);

  return lapRow;
};

const padTime = (time) => {
  return `${time.toString().padStart(2, "0")}`;
};

const beginTimer = (displayNode, startTime, stopTimeStamp = 0) => {
  const currentTime = Date.now();
  const time = currentTime - startTime;
  const formattedTime = formatTime(time + stopTimeStamp);

  if (displayNode.id === "timer") {
    displayNode.textContent = formattedTime;
  } else {
    displayNode.children[0].textContent = `Lap ${lapTimers.length + 1}`;
    displayNode.children[1].textContent = formattedTime;
  }

  return time + stopTimeStamp;
};

const colorBestAndWorst = () => {
  timeNodes.forEach((node) => (node.className = ""));
  const max = Math.max(...lapTimers);
  const min = Math.min(...lapTimers);

  const maxIndex = lapTimers.indexOf(max);
  const minIndex = lapTimers.indexOf(min);

  timeNodes[maxIndex].classList.add("worst");
  timeNodes[minIndex].classList.add("best");
};

const startTime = () => {
  const currentDisplayedTime = timer.textContent;
  const start = Date.now();
  if (currentDisplayedTime !== "00:00.00") {
    const currentLap = timersList.firstElementChild;
    mainTimerInterval = setInterval(
      () => (millisecondsWhenStopped = beginTimer(timer, start, stopTimeStamp)),
      1000 / 60
    );
    lapsInterval = setInterval(
      () =>
        (lapTimerWhenStopped = beginTimer(
          currentLap,
          start,
          lapTimerMillisecondsOffset
        )),
      1000 / 60
    );
    startBtn.classList.add("hidden");
    stopBtn.classList.remove("hidden");
    resetBtn.classList.add("hidden");
    lapBtn.classList.remove("hidden");
  } else {
    const currentLap = timersList.firstElementChild;
    mainTimerInterval = setInterval(
      () => (millisecondsWhenStopped = beginTimer(timer, start)),
      1000 / 60
    );
    lapsInterval = setInterval(
      () => (lapTimerWhenStopped = beginTimer(currentLap, start)),
      1000 / 60
    );
    startBtn.classList.add("hidden");
    stopBtn.classList.remove("hidden");
    lapBtn.classList.replace("lapoff", "lap");
  }
};

const stopTime = () => {
  clearInterval(mainTimerInterval);
  clearInterval(lapsInterval);
  stopTimeStamp = millisecondsWhenStopped;
  lapTimerMillisecondsOffset = lapTimerWhenStopped;
  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");
  resetBtn.classList.remove("hidden");
  lapBtn.classList.add("hidden");
};

const resetTime = () => {
  timer.textContent = "00:00.00";
  resetBtn.classList.add("hidden");
  lapBtn.classList.remove("hidden", "lap");
  lapBtn.classList.add("lapoff");
  timersList.innerHTML = startingHtml;
  lapTimers.length = 0;
  timeNodes.length = 0;
};

const recordLap = () => {
  const current = Date.now();
  clearInterval(lapsInterval);
  lapTimers.unshift(lapTimerWhenStopped);

  const currentLap = timersList.firstElementChild;
  const nextLap = createLapRow();
  timeNodes.unshift(currentLap);

  if (timeNodes.length < initialTimerlistLength) {
    timersList.removeChild(timersList.lastElementChild);
  }

  lapsInterval = setInterval(
    () => (lapTimerWhenStopped = beginTimer(nextLap, current)),
    1000 / 60
  );

  if (lapTimers.length >= 2) {
    colorBestAndWorst();
  }
};

startBtn.addEventListener("click", startTime);
stopBtn.addEventListener("click", stopTime);
lapBtn.addEventListener("click", recordLap);
resetBtn.addEventListener("click", resetTime);
