let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let currentQuestion = 0;
let questions = [];
let timer;
let timerDuration = 20;
let remainingTime = 20;

document.getElementById("highScore").textContent = highScore;

function startGame() {
  document.getElementById("audioClick").play();
  timerDuration = parseInt(document.getElementById("timerSelect").value);
  generateQuestions();
  score = 0;
  currentQuestion = 0;
  document.getElementById("scoreValue").textContent = score;
  document.getElementById("questionArea").style.display = "block";
  document.getElementById("startBtn").style.display = "none";
  showQuestion();
}

function generateQuestions() {
  questions = [];
  const exclude1 = document.getElementById("exclude1").checked;
  const exclude2 = document.getElementById("exclude2").checked;
  for (let i = 1; i <= 9; i++) {
    for (let j = 1; j <= 9; j++) {
      if ((i === 1 || j === 1) && exclude1) continue;
      if ((i === 2 || j === 2) && exclude2) continue;
      questions.push({ x: i, y: j });
    }
  }
  questions = shuffle(questions).slice(0, 10);
}

function showQuestion() {
  if (currentQuestion >= 10) return endGame();
  document.getElementById("currentQuestion").textContent = currentQuestion + 1;
  const q = questions[currentQuestion];
  document.getElementById("question").textContent = `${q.x} × ${q.y} = ?`;
  const correct = q.x * q.y;
  const options = shuffle([
    correct,
    correct + 1,
    correct - 1,
    correct + 10 - Math.floor(Math.random() * 20)
  ]);
  document.getElementById("options").innerHTML = options.map(o => `<button onclick="checkAnswer(${o}, ${correct})">${o}</button>`).join("");  
  startTimer();
}

function checkAnswer(selected, correct) {
  document.getElementById("audioClick").play();
  if (selected === correct) {
    score++;
    document.getElementById("audioCorrect").play();
  } else {
    document.getElementById("audioWrong").play();
  }
  document.getElementById("scoreValue").textContent = score;
  currentQuestion++;
  showQuestion();
}

function startTimer() {
  clearInterval(timer);
  remainingTime = timerDuration;
  updateTimerBar();
  timer = setInterval(() => {
    remainingTime--;
    updateTimerBar();
    if (remainingTime <= 0) {
      clearInterval(timer);
      currentQuestion++;
      showQuestion();
    }
  }, 1000);
}

function updateTimerBar() {
  const bar = document.getElementById("timerBar");
  bar.style.width = `${(remainingTime / timerDuration) * 100}%`;
}

function endGame() {
  clearInterval(timer);
  document.getElementById("startBtn").style.display = "block";
  document.getElementById("questionArea").style.display = "none";
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  document.getElementById("highScore").textContent = highScore;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", startGame);
