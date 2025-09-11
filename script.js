class TypingChaseGame {
    constructor() {
        this.screens = {
            start: document.getElementById('startScreen'),
            game: document.getElementById('gameScreen'),
            end: document.getElementById('endScreen')
        };
        
        this.elements = {
            startBtn: document.getElementById('startBtn'),
            restartBtn: document.getElementById('restartBtn'),
            menuBtn: document.getElementById('menuBtn'),
            typingInput: document.getElementById('typingInput'),
            targetText: document.getElementById('targetText'),
            runner: document.getElementById('runner'),
            chaser: document.getElementById('chaser'),
            runnerProgress: document.getElementById('runnerProgress'),
            chaserProgress: document.getElementById('chaserProgress'),
            distanceValue: document.getElementById('distanceValue'),
            playerRole: document.getElementById('playerRole'),
            currentLibrary: document.getElementById('currentLibrary'),
            gameStatus: document.getElementById('gameStatus'),
            resultTitle: document.getElementById('resultTitle'),
            resultMessage: document.getElementById('resultMessage'),
            finalWpm: document.getElementById('finalWpm'),
            finalAccuracy: document.getElementById('finalAccuracy'),
            gameTime: document.getElementById('gameTime'),
            wpm: document.getElementById('wpm'),
            accuracy: document.getElementById('accuracy')
        };
        
        this.gameState = {
            selectedRole: null,
            selectedDifficulty: null,
            selectedLibrary: null,
            isPlaying: false,
            isComposing: false,
            runnerPosition: 10,
            chaserPosition: 5,
            targetPosition: 85,
            currentText: '',
            typedText: '',
            startTime: null,
            correctChars: 0,
            totalChars: 0,
            wpm: 0,
            accuracy: 100
        };
        
        // 等待词库加载
        this.waitForTextLibraries();
    }
    
    waitForTextLibraries() {
        if (typeof TextLibraries !== 'undefined') {
            this.init();
        } else {
            // 等待词库加载
            setTimeout(() => this.waitForTextLibraries(), 100);
        }
    }
    
    init() {
        // 词库选择
        document.querySelectorAll('.library-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.library-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.gameState.selectedLibrary = btn.dataset.library;
                this.checkStartButton();
            });
        });
        
        // 难度选择
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.gameState.selectedDifficulty = btn.dataset.difficulty;
                this.checkStartButton();
            });
        });
        
        // 角色选择
        document.querySelectorAll('.character-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.character-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.gameState.selectedRole = btn.dataset.role;
                this.checkStartButton();
            });
        });
        
        // 游戏控制按钮
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.restartBtn.addEventListener('click', () => this.startGame());
        this.elements.menuBtn.addEventListener('click', () => this.showScreen('start'));
        
        // 打字输入
        this.elements.typingInput.addEventListener('input', (e) => this.handleTyping(e));
        this.elements.typingInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.checkTextCompletion();
            }
        });
        this.elements.typingInput.addEventListener('compositionstart', (e) => {
            this.gameState.isComposing = true;
        });
        this.elements.typingInput.addEventListener('compositionend', (e) => {
            this.gameState.isComposing = false;
            this.handleTyping(e);
        });
    }
    
    checkStartButton() {
        if (this.gameState.selectedRole && this.gameState.selectedDifficulty && this.gameState.selectedLibrary) {
            this.elements.startBtn.disabled = false;
        }
    }
    
    startGame() {
        this.gameState.isPlaying = true;
        this.gameState.isComposing = false;
        this.gameState.runnerPosition = 10;
        this.gameState.chaserPosition = 5;
        this.gameState.startTime = Date.now();
        this.gameState.correctChars = 0;
        this.gameState.totalChars = 0;
        this.gameState.wpm = 0;
        this.gameState.accuracy = 100;
        
        this.showScreen('game');
        this.elements.playerRole.textContent = this.gameState.selectedRole === 'runner' ? '逃跑者' : '追逐者';
        this.elements.currentLibrary.textContent = TextLibraries[this.gameState.selectedLibrary].name;
        this.elements.gameStatus.textContent = '游戏进行中';
        
        // 启用输入框
        this.elements.typingInput.disabled = false;
        this.elements.typingInput.value = '';
        
        this.generateNewText();
        this.updatePositions();
        this.updateStats();
        
        // 确保输入框获得焦点，添加延迟以兼容不同浏览器
        setTimeout(() => {
            this.elements.typingInput.focus();
            this.elements.typingInput.select();
        }, 100);
    }
    
    generateNewText() {
        if (!TextLibraries || !TextLibraries[this.gameState.selectedLibrary]) {
            console.error('词库未正确加载');
            this.gameState.currentText = '测试文本';
        } else {
            const library = TextLibraries[this.gameState.selectedLibrary];
            const filteredTexts = this.getTextsByDifficulty(library.texts, this.gameState.selectedDifficulty);
            
            if (filteredTexts.length === 0) {
                // 如果没有找到符合难度的文本，使用所有文本
                this.gameState.currentText = library.texts[Math.floor(Math.random() * library.texts.length)];
            } else {
                this.gameState.currentText = filteredTexts[Math.floor(Math.random() * filteredTexts.length)];
            }
        }
        
        this.gameState.typedText = '';
        this.elements.targetText.textContent = this.gameState.currentText;
        this.elements.typingInput.value = '';
    }
    
    getTextsByDifficulty(texts, difficulty) {
        if (!texts || texts.length === 0) return [];
        
        if (difficulty === 'easy') {
            return texts.filter(text => text.length <= 15);
        } else if (difficulty === 'medium') {
            return texts.filter(text => text.length > 15 && text.length <= 30);
        } else if (difficulty === 'hard') {
            return texts.filter(text => text.length > 30);
        }
        
        return texts;
    }
    
    handleTyping(e) {
        if (!this.gameState.isPlaying || this.gameState.isComposing) return;
        
        const typed = e.target.value;
        this.gameState.typedText = typed;
        this.gameState.totalChars++;
        
        if (typed === this.gameState.currentText.substring(0, typed.length)) {
            this.gameState.correctChars++;
            e.target.style.borderColor = '#28a745';
        } else {
            e.target.style.borderColor = '#dc3545';
        }
        
        this.updateStats();
    }
    
    checkTextCompletion() {
        if (this.gameState.typedText === this.gameState.currentText) {
            this.onTextComplete();
        }
    }
    
    onTextComplete() {
        // 确保WPM有有效值
        const playerSpeed = Math.max(1, (this.gameState.wpm || 0) / 20);
        
        // 玩家移动
        if (this.gameState.selectedRole === 'runner') {
            this.gameState.runnerPosition += playerSpeed * 5;
        } else {
            this.gameState.chaserPosition += playerSpeed * 5;
        }
        
        // NPC移动（自动追逐/逃跑机制）
        this.moveNPC();
        
        // 重置输入统计
        this.gameState.correctChars = 0;
        this.gameState.totalChars = 0;
        
        this.updatePositions();
        this.checkGameEnd();
        
        if (this.gameState.isPlaying) {
            this.generateNewText();
        }
    }
    
    moveNPC() {
        // NPC基础速度（比玩家稍慢，让游戏有挑战性）
        const npcBaseSpeed = 1.5;
        
        if (this.gameState.selectedRole === 'runner') {
            // 玩家是逃跑者，NPC是追逐者，自动追逐
            const distance = this.gameState.runnerPosition - this.gameState.chaserPosition;
            if (distance > 0) {
                // 追逐者向逃跑者移动
                const chaseSpeed = Math.min(npcBaseSpeed, distance * 0.3);
                this.gameState.chaserPosition += chaseSpeed;
            }
        } else {
            // 玩家是追逐者，NPC是逃跑者，自动逃跑
            const distance = this.gameState.runnerPosition - this.gameState.chaserPosition;
            if (distance < 20) { // 如果距离太近，逃跑者加速逃跑
                const escapeSpeed = npcBaseSpeed * 1.2;
                this.gameState.runnerPosition += escapeSpeed;
            } else {
                // 保持一定距离逃跑
                this.gameState.runnerPosition += npcBaseSpeed * 0.8;
            }
        }
        
        // 确保NPC不超出边界
        if (this.gameState.selectedRole === 'runner') {
            this.gameState.chaserPosition = Math.max(5, Math.min(95, this.gameState.chaserPosition));
        } else {
            this.gameState.runnerPosition = Math.max(5, Math.min(95, this.gameState.runnerPosition));
        }
    }
    
    updatePositions() {
        // 更新角色位置
        this.elements.runner.style.left = `${this.gameState.runnerPosition}%`;
        this.elements.chaser.style.left = `${this.gameState.chaserPosition}%`;
        
        // 更新进度条
        this.elements.runnerProgress.style.width = `${(this.gameState.runnerPosition / this.gameState.targetPosition) * 100}%`;
        this.elements.chaserProgress.style.width = `${(this.gameState.chaserPosition / this.gameState.targetPosition) * 100}%`;
        
        // 更新距离
        const distance = Math.abs(this.gameState.runnerPosition - this.gameState.chaserPosition);
        this.elements.distanceValue.textContent = `${Math.round(distance * 10)}m`;
        
        // 检查追逐状态
        if (distance < 5) {
            this.elements.chaser.classList.add('danger');
        } else {
            this.elements.chaser.classList.remove('danger');
        }
    }
    
    updateStats() {
        const timeElapsed = (Date.now() - this.gameState.startTime) / 1000 / 60; // 分钟
        const wordsTyped = this.gameState.correctChars / 5; // 假设每个单词5个字符
        
        // 避免除零错误
        if (timeElapsed > 0) {
            this.gameState.wpm = Math.round(wordsTyped / timeElapsed);
        } else {
            this.gameState.wpm = 0;
        }
        
        // 避免除零错误
        if (this.gameState.totalChars > 0) {
            this.gameState.accuracy = Math.round((this.gameState.correctChars / this.gameState.totalChars) * 100);
        } else {
            this.gameState.accuracy = 100;
        }
        
        this.elements.wpm.textContent = this.gameState.wpm;
        this.elements.accuracy.textContent = this.gameState.accuracy;
    }
    
    checkGameEnd() {
        // 防止位置超出边界
        this.gameState.runnerPosition = Math.min(this.gameState.runnerPosition, 100);
        this.gameState.chaserPosition = Math.min(this.gameState.chaserPosition, 100);
        
        // 检查是否到达终点
        if (this.gameState.runnerPosition >= this.gameState.targetPosition) {
            this.endGame(this.gameState.selectedRole === 'runner' ? 'win' : 'lose');
            return;
        }
        
        // 检查是否被抓住（追逐者追上逃跑者）
        const distance = Math.abs(this.gameState.runnerPosition - this.gameState.chaserPosition);
        if (distance < 3) { // 距离小于3%算作抓住
            this.endGame(this.gameState.selectedRole === 'chaser' ? 'win' : 'lose');
            return;
        }
        
        // 检查是否超出时间限制（可选的安全机制）
        const gameTime = (Date.now() - this.gameState.startTime) / 1000;
        if (gameTime > 300) { // 5分钟时间限制
            this.endGame('timeout');
        }
    }
    
    endGame(result) {
        this.gameState.isPlaying = false;
        
        // 禁用输入框
        this.elements.typingInput.disabled = true;
        
        const gameTime = Math.round((Date.now() - this.gameState.startTime) / 1000);
        
        this.elements.finalWpm.textContent = this.gameState.wpm;
        this.elements.finalAccuracy.textContent = this.gameState.accuracy;
        this.elements.gameTime.textContent = gameTime;
        
        if (result === 'win') {
            this.elements.resultTitle.textContent = '恭喜你赢了！';
            this.elements.resultMessage.textContent = this.gameState.selectedRole === 'runner' ? '你成功到达了终点！' : '你成功抓住了逃跑者！';
        } else if (result === 'timeout') {
            this.elements.resultTitle.textContent = '时间到！';
            this.elements.resultMessage.textContent = '游戏时间已结束，平局！';
        } else {
            this.elements.resultTitle.textContent = '游戏结束';
            this.elements.resultMessage.textContent = this.gameState.selectedRole === 'runner' ? '你被抓住了！' : '逃跑者到达了终点！';
        }
        
        this.showScreen('end');
    }
    
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => screen.classList.add('hidden'));
        this.screens[screenName].classList.remove('hidden');
    }
}

// 游戏初始化
document.addEventListener('DOMContentLoaded', () => {
    // 防止重复初始化
    if (!window.typingGame) {
        window.typingGame = new TypingChaseGame();
    }
});