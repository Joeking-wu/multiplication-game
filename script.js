const soundCorrect = document.getElementById("audioCorrect");
const soundWrong = document.getElementById("audioWrong");
const soundClick = document.getElementById("audioClick");

let questions = [];
let current = 0;
let score = 0;
let timer;
let duration = 20;

function playCorrectSound() { soundCorrect.currentTime = 0; soundCorrect.play(); }
function playWrongSound() { soundWrong.currentTime = 0; soundWrong.play(); }
function playClickSound() { soundClick.currentTime = 0; soundClick.play(); }

function startGame() {
  playClickSound();
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
  duration = parseInt(document.getElementById("timeSelect").value);
  generateQuestions();
  showQuestion();
}

function generateQuestions() {
  questions = [];
  for (let i = 0; i < 10; i++) {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const answer = a * b;
    const options = [answer];
    while (options.length < 4) {
      const wrong = (Math.floor(Math.random() * 81) + 1);
      if (!options.includes(wrong)) options.push(wrong);
    }
    options.sort(() => Math.random() - 0.5);
    questions.push({ a, b, answer, options });
  }
}

function showQuestion() {
  if (current >= questions.length) {
    alert(`挑戰結束！得分 ${score} / ${questions.length}`);
    location.reload();
    return;
  }
  const q = questions[current];
  document.getElementById("question").textContent = `${q.a} × ${q.b} = ?`;
  document.getElementById("options").innerHTML = "";
  document.getElementById("scoreDisplay").textContent = `分數：${score} / ${current}`;
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      playClickSound();
      clearInterval(timer);
      if (opt === q.answer) {
        score++;
        playCorrectSound();
      } else {
        playWrongSound();
      }
      current++;
      showQuestion();
    };
    document.getElementById("options").appendChild(btn);
  });
  startTimer(duration);
}

function startTimer(seconds) {
  let remaining = seconds;
  const bar = document.getElementById("timerBar");
  bar.style.width = "100%";
  timer = setInterval(() => {
    remaining--;
    bar.style.width = `${(remaining / seconds) * 100}%`;
    if (remaining <= 0) {
      clearInterval(timer);
      playWrongSound();
      current++;
      showQuestion();
    }
  }, 1000);
}
