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
            isPlaying: false,
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
        
        this.texts = [
            "快速的棕色狐狸跳过懒狗",
            "编程是一门艺术也是一门科学",
            "天空中飘着朵朵白云",
            "学习打字可以提高工作效率",
            "春天来了花儿都开了",
            "技术改变世界创新引领未来"
        ];
        
        this.init();
    }
    
    init() {
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
                this.checkTextCompletion();
            }
        });
    }
    
    checkStartButton() {
        if (this.gameState.selectedRole && this.gameState.selectedDifficulty) {
            this.elements.startBtn.disabled = false;
        }
    }
    
    startGame() {
        this.gameState.isPlaying = true;
        this.gameState.runnerPosition = 10;
        this.gameState.chaserPosition = 5;
        this.gameState.startTime = Date.now();
        this.gameState.correctChars = 0;
        this.gameState.totalChars = 0;
        
        this.showScreen('game');
        this.elements.playerRole.textContent = this.gameState.selectedRole === 'runner' ? '逃跑者' : '追逐者';
        this.elements.gameStatus.textContent = '游戏进行中';
        
        this.generateNewText();
        this.updatePositions();
        this.elements.typingInput.focus();
    }
    
    generateNewText() {
        this.gameState.currentText = this.texts[Math.floor(Math.random() * this.texts.length)];
        this.gameState.typedText = '';
        this.elements.targetText.textContent = this.gameState.currentText;
        this.elements.typingInput.value = '';
    }
    
    handleTyping(e) {
        if (!this.gameState.isPlaying) return;
        
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
        const speed = Math.max(1, this.gameState.wpm / 20);
        
        if (this.gameState.selectedRole === 'runner') {
            this.gameState.runnerPosition += speed * 5;
        } else {
            this.gameState.chaserPosition += speed * 5;
        }
        
        this.updatePositions();
        this.checkGameEnd();
        
        if (this.gameState.isPlaying) {
            this.generateNewText();
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
        this.gameState.wpm = Math.round(wordsTyped / timeElapsed) || 0;
        this.gameState.accuracy = Math.round((this.gameState.correctChars / this.gameState.totalChars) * 100) || 100;
        
        this.elements.wpm.textContent = this.gameState.wpm;
        this.elements.accuracy.textContent = this.gameState.accuracy;
    }
    
    checkGameEnd() {
        if (this.gameState.runnerPosition >= this.gameState.targetPosition) {
            this.endGame(this.gameState.selectedRole === 'runner' ? 'win' : 'lose');
        } else if (this.gameState.chaserPosition >= this.gameState.runnerPosition) {
            this.endGame(this.gameState.selectedRole === 'chaser' ? 'win' : 'lose');
        }
    }
    
    endGame(result) {
        this.gameState.isPlaying = false;
        const gameTime = Math.round((Date.now() - this.gameState.startTime) / 1000);
        
        this.elements.finalWpm.textContent = this.gameState.wpm;
        this.elements.finalAccuracy.textContent = this.gameState.accuracy;
        this.elements.gameTime.textContent = gameTime;
        
        if (result === 'win') {
            this.elements.resultTitle.textContent = '恭喜你赢了！';
            this.elements.resultMessage.textContent = this.gameState.selectedRole === 'runner' ? '你成功到达了终点！' : '你成功抓住了逃跑者！';
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
    new TypingChaseGame();
});