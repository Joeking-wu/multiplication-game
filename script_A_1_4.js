const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const playerNameInput = document.getElementById('player-name-input');
const splitModeButton = document.getElementById('split-mode-button');
const combineModeButton = document.getElementById('combine-mode-button');
const playerNameDisplay = document.getElementById('player-name');
const scoreDisplay = document.getElementById('score');
const correctCountDisplay = document.getElementById('correct-count');
const timerDisplay = document.getElementById('timer');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const questionText = document.getElementById('question-text');

// 圖片容器
const part1ImagesContainer = document.getElementById('part1-images');
const part2ImagesContainer = document.getElementById('part2-images');

const boxTotal = document.getElementById('box-total');
const boxPart1 = document.getElementById('box-part1');
const boxPart2 = document.getElementById('box-part2');
const submitButton = document.getElementById('submit-button');

const leaderboardList = document.getElementById('leaderboard-list');

const treeDiagramContainer = document.querySelector('.tree-diagram-container');
const connectorLinesSVG = document.querySelector('.connector-lines');

let playerName = '';
let score = 0;
let correctCount = 0;
let timer = 0;
let timerInterval;
let currentQuestion = {};
let isGameOver = false;
let gameMode = ''; // 'split' or 'combine'

let Png_cnt = 10;

// 定義每個數字有多少張圖片可以選擇，假設從 1 到 10 都有 10 張圖片
const imageCounts = {};
for (let i = 1; i <= Png_cnt; i++) {
    imageCounts[`P1_${i}`] = Png_cnt;
    imageCounts[`P2_${i}`] = Png_cnt;
}

function startGame(mode) {
    playerName = playerNameInput.value.trim();
    if (playerName === '') {
        alert('請輸入你的名字！');
        return;
    }

    gameMode = mode;
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    endScreen.classList.add('hidden');

    playerNameDisplay.textContent = playerName;
    score = 0;
    correctCount = 0;
    timer = 0;
    isGameOver = false;
    updateScoreDisplay();
    startTimer();
    generateQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isGameOver) {
            timer++;
            timerDisplay.textContent = timer;
        }
    }, 1000);
}

// 核心變更：動態生成題目邏輯與圖片顯示
function generateQuestion() {
    let total, part1, part2;

    // 隨機生成題目
    if (gameMode === 'split') {
        // 隨機選取一個總數，從 1 到 10
        total = Math.floor(Math.random() * 10) + 1;
        // 隨機選擇第一個部分，確保它在 0 到總數之間
        part1 = Math.floor(Math.random() * (total + 1));
        part2 = total - part1;
    } else { // combine mode
        // 隨機選擇兩個部分，確保它們的總和在 1 到 10 之間
        part1 = Math.floor(Math.random() * 10);
        part2 = Math.floor(Math.random() * 10);
        total = part1 + part2;
        // 如果總數超出範圍，重新生成
        if (total > 10 || total < 1) {
            generateQuestion();
            return;
        }
    }

    currentQuestion = { total, part1, part2 };

    // 清空舊圖片
    part1ImagesContainer.innerHTML = '';
    part2ImagesContainer.innerHTML = '';

    // 根據遊戲模式顯示圖片
    if (gameMode === 'split') {
        // 分模式：只顯示總數
        questionText.textContent = `請將 ${total} 分成兩個數字。`;
        displayImages(part1ImagesContainer, part1, part2ImagesContainer, part2);
        //displayImages(part2ImagesContainer, part2);
        // 不顯示圖片
    } else { // combine mode
        // 合模式：顯示 part1 和 part2
        questionText.textContent = `請將 ${part1} 和 ${part2} 合起來。`;
        displayImages(part1ImagesContainer, part1, part2ImagesContainer, part2);
        //displayImages(part2ImagesContainer, part2);
    }

    // 樹狀圖邏輯不變，保持動態切換
    boxTotal.value = '';
    boxPart1.value = '';
    boxPart2.value = '';
    boxTotal.disabled = true;
    boxPart1.disabled = true;
    boxPart2.disabled = true;
    boxTotal.classList.remove('active-input', 'disabled-input');
    boxPart1.classList.remove('active-input', 'disabled-input');
    boxPart2.classList.remove('active-input', 'disabled-input');

    if (gameMode === 'split') {
        treeDiagramContainer.classList.remove('combine-mode');
        treeDiagramContainer.classList.add('split-mode');
        boxTotal.value = total;
        boxTotal.classList.add('disabled-input');

        if (Math.random() > 0.5) {
            boxPart1.value = part1;
            boxPart1.classList.add('disabled-input');
            boxPart2.disabled = false;
            boxPart2.classList.add('active-input');
            boxPart2.focus();
            currentQuestion.missingPart = 'part2';
        } else {
            boxPart2.value = part2;
            boxPart2.classList.add('disabled-input');
            boxPart1.disabled = false;
            boxPart1.classList.add('active-input');
            boxPart1.focus();
            currentQuestion.missingPart = 'part1';
        }
    } else { // combine mode
        treeDiagramContainer.classList.remove('split-mode');
        treeDiagramContainer.classList.add('combine-mode');
        boxPart1.value = part1;
        boxPart2.value = part2;
        boxPart1.classList.add('disabled-input');
        boxPart2.classList.add('disabled-input');

        boxTotal.disabled = false;
        boxTotal.classList.add('active-input');
        boxTotal.focus();
        currentQuestion.missingPart = 'total';
    }

    drawConnectorLines();
}

function displayImages(container, count, container2, count2) {
    // 隨機選擇圖片索引，從 1 到 10
    const randomImageIndex = Math.floor(Math.random() * Png_cnt) + 1;
    const formattedIndex = String(randomImageIndex).padStart(2, '0');
    for (let i = 0; i < count; i++) {
        

        let imagePath;
        if (container.id === 'part1-images') {
            imagePath = `images/P1_${formattedIndex}.png`;
        } else {
            imagePath = `images/P2_${formattedIndex}.png`;
        }

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `圖片 ${i + 1}`;
        container.appendChild(img);
    }

    for (let i = 0; i < count2; i++) {


        let imagePath;
        if (container2.id === 'part2-images') {
            imagePath = `images/P2_${formattedIndex}.png`;
        } else {
            imagePath = `images/P1_${formattedIndex}.png`;
        }

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `圖片 ${i + 1}`;
        container2.appendChild(img);
    }
}

function checkAnswer() {
    let userAnswer;
    let correctAnswer;

    if (gameMode === 'combine') {
        userAnswer = parseInt(boxTotal.value, 10);
        correctAnswer = currentQuestion.total;
    } else { // split mode
        if (currentQuestion.missingPart === 'part1') {
            userAnswer = parseInt(boxPart1.value, 10);
            correctAnswer = currentQuestion.part1;
        } else {
            userAnswer = parseInt(boxPart2.value, 10);
            correctAnswer = currentQuestion.part2;
        }
    }

    if (isNaN(userAnswer)) {
        alert('請輸入一個數字！');
        return;
    }

    if (userAnswer === correctAnswer) {
        correctCount++;
        score += 100;
        //alert('答對了！');
    } else {
        score = Math.max(0, score - 50);
        alert(`答錯了，正確答案是 ${correctAnswer}，再試試看！`);
    }

    updateScoreDisplay();
    if (correctCount >= 10) {
        endGame();
    } else {
        generateQuestion();
    }
}

function updateScoreDisplay() {
    scoreDisplay.textContent = score;
    correctCountDisplay.textContent = correctCount;
}

function endGame() {
    isGameOver = true;
    clearInterval(timerInterval);
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = score;

    saveScore();
    renderLeaderboard();
}

function saveScore() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const date = new Date().toLocaleDateString('zh-TW');
    leaderboard.push({ name: playerName, score: score, date: date, mode: gameMode });

    leaderboard.sort((a, b) => b.score - a.score);

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

function renderLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardList.innerHTML = '';

    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<li>目前沒有任何紀錄。</li>';
        return;
    }

    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        const modeText = entry.mode === 'split' ? '分' : '合';
        li.textContent = `${index + 1}. ${entry.name} (${modeText}) - 分數: ${entry.score} (日期: ${entry.date})`;
        leaderboardList.appendChild(li);
    });
}

function drawConnectorLines() {
    const totalBox = document.querySelector('.total-box .answer-box');
    const part1Box = document.querySelector('.part-box-1 .answer-box');
    const part2Box = document.querySelector('.part-box-2 .answer-box');
    const diagramContainer = document.querySelector('.tree-diagram-container');

    if (!totalBox || !part1Box || !part2Box || !diagramContainer) return;

    const totalRect = totalBox.getBoundingClientRect();
    const part1Rect = part1Box.getBoundingClientRect();
    const part2Rect = part2Box.getBoundingClientRect();
    const containerRect = diagramContainer.getBoundingClientRect();

    if (gameMode === 'split') {
        const totalBottomCenter = {
            x: totalRect.left + totalRect.width / 2 - containerRect.left,
            y: totalRect.bottom - containerRect.top
        };
        const part1TopCenter = {
            x: part1Rect.left + part1Rect.width / 2 - containerRect.left,
            y: part1Rect.top - containerRect.top
        };
        const part2TopCenter = {
            x: part2Rect.left + part2Rect.width / 2 - containerRect.left,
            y: part2Rect.top - containerRect.top
        };

        connectorLinesSVG.innerHTML = `
            <line x1="${totalBottomCenter.x}" y1="${totalBottomCenter.y}" x2="${part1TopCenter.x}" y2="${part1TopCenter.y}" stroke="#d81b60" stroke-width="4" />
            <line x1="${totalBottomCenter.x}" y1="${totalBottomCenter.y}" x2="${part2TopCenter.x}" y2="${part2TopCenter.y}" stroke="#d81b60" stroke-width="4" />
        `;
    } else { // combine mode
        const part1BottomCenter = {
            x: part1Rect.left + part1Rect.width / 2 - containerRect.left,
            y: part1Rect.bottom - containerRect.top
        };
        const part2BottomCenter = {
            x: part2Rect.left + part2Rect.width / 2 - containerRect.left,
            y: part2Rect.bottom - containerRect.top
        };
        const totalTopCenter = {
            x: totalRect.left + totalRect.width / 2 - containerRect.left,
            y: totalRect.top - containerRect.top
        };

        connectorLinesSVG.innerHTML = `
            <line x1="${part1BottomCenter.x}" y1="${part1BottomCenter.y}" x2="${totalTopCenter.x}" y2="${totalTopCenter.y}" stroke="#d81b60" stroke-width="4" />
            <line x1="${part2BottomCenter.x}" y1="${part2BottomCenter.y}" x2="${totalTopCenter.x}" y2="${totalTopCenter.y}" stroke="#d81b60" stroke-width="4" />
        `;
    }
}

// 事件監聽
splitModeButton.addEventListener('click', () => startGame('split'));
combineModeButton.addEventListener('click', () => startGame('combine'));
submitButton.addEventListener('click', checkAnswer);
restartButton.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    playerNameInput.value = '';
});

// 頁面尺寸改變時重新繪製連線
window.addEventListener('resize', drawConnectorLines);

// 確保DOM載入後執行
document.addEventListener('DOMContentLoaded', () => {
    renderLeaderboard();
});

// 允許按 Enter 鍵提交答案
boxTotal.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !boxTotal.disabled) {
        submitButton.click();
    }
});
boxPart1.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !boxPart1.disabled) {
        submitButton.click();
    }
});
boxPart2.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !boxPart2.disabled) {
        submitButton.click();
    }
});