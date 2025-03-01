document.addEventListener("DOMContentLoaded", function () {
  const timeInput = document.getElementById("time");
  const errorMessage = document.getElementById("error-message");
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");
  const resetButton = document.getElementById("reset");
  const timerDisplay = document.getElementById("timer");
  const initialMessage = document.getElementById("initial-message");

  let countdownInterval;
  let remainingTime = 0;
  let isRunning = false;

  startButton.addEventListener("click", function () {
    if (!isRunning && remainingTime > 0) {
      initialMessage.classList.add("hidden");
      timerDisplay.classList.remove("hidden");
      startCountdown();
      return;
    }

    const inputTime = parseInt(timeInput.value);

    if (isNaN(inputTime) || inputTime <= 0) {
      errorMessage.classList.remove("hidden");
      return;
    }

    errorMessage.classList.add("hidden");

    if (!isRunning) {
      initialMessage.classList.add("hidden");

      remainingTime = inputTime;
      timerDisplay.textContent = remainingTime;
      timerDisplay.classList.remove("hidden");
      timerDisplay.classList.remove("time-up");

      startCountdown();
    }
  });

  stopButton.addEventListener("click", function () {
    if (isRunning) {
      clearInterval(countdownInterval);
      isRunning = false;
      startButton.textContent = "Devam Et";
    }
  });

  resetButton.addEventListener("click", function () {
    clearInterval(countdownInterval);
    isRunning = false;
    remainingTime = 0;

    timerDisplay.classList.add("hidden");
    initialMessage.classList.remove("hidden");
    timeInput.value = "";
    startButton.textContent = "Başlat";
  });

  function startCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    isRunning = true;
    startButton.textContent = "Başlat";

    countdownInterval = setInterval(function () {
      remainingTime--;

      timerDisplay.textContent = remainingTime;

      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        isRunning = false;

        timerDisplay.textContent = "Süre doldu!";
        timerDisplay.classList.add("time-up");
        startButton.textContent = "Başlat";
      }
    }, 1000);
  }
});
