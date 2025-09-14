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
            backToMenuBtn: document.getElementById('backToMenuBtn'),
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
        
        // Canvas相关
        this.canvas = null;
        this.ctx = null;
        this.initCanvasLater();
        
        // 道路系统
        this.roadSystem = {
            lanes: [
                { y: 180, width: 40, color: '#3498db' }, // 上车道
                { y: 220, width: 40, color: '#e74c3c' }  // 下车道
            ],
            boundaries: {
                top: 160,
                bottom: 280,
                left: 0,
                right: 800
            },
            finishLine: { x: 720, width: 10 }
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
            accuracy: 100,
            // 2D坐标系统
            runner: { x: 100, y: 200, speed: 0, lane: 0, baseSpeed: 1 },
            chaser: { x: 50, y: 200, speed: 0, lane: 1, baseSpeed: 0.8 },
            // 实时打字相关
            typingStartTime: null,
            gameStarted: false,  // 游戏是否正式开始（玩家开始打字时）
            // 错误惩罚系统
            errorCount: 0,  // 错误次数
            backspaceCount: 0,  // 退格键使用次数
            accuracyMultiplier: 1.0,  // 准确率倍数 (0.5-1.0)
            speedPenalty: 0,  // 当前速度惩罚 (0-0.5)
            penaltyDecayRate: 0.02,  // 惩罚衰减速率
            // AI逃跑者状态
            aiEscapeStrategy: 'cautious',  // 当前逃跑策略
            aiStrategyChangeTime: 0,  // 策略变化时间
            aiUnpredictability: 0.1,  // 不可预测性因子
            // 难度相关AI参数
            aiDifficultySettings: {
                easy: {
                    speedMultiplier: 0.7,     // AI速度倍数
                    unpredictability: 0.05,    // 不可预测性
                    reactionTime: 1.2,        // 反应时间倍数
                    strategyCoolDown: 3000,   // 策略冷却时间(ms)
                    errorForgiveness: 0.8     // 错误宽容度
                },
                medium: {
                    speedMultiplier: 0.85,    // AI速度倍数
                    unpredictability: 0.1,     // 不可预测性
                    reactionTime: 1.0,        // 反应时间倍数
                    strategyCoolDown: 2000,   // 策略冷却时间(ms)
                    errorForgiveness: 0.6     // 错误宽容度
                },
                hard: {
                    speedMultiplier: 1.0,      // AI速度倍数
                    unpredictability: 0.15,    // 不可预测性
                    reactionTime: 0.8,        // 反应时间倍数
                    strategyCoolDown: 1500,   // 策略冷却时间(ms)
                    errorForgiveness: 0.4     // 错误宽容度
                }
            },
            lastTypedTime: null,
            currentSentenceIndex: 0,
            sentences: [],
            currentSentence: '',
            completedWords: 0,
            totalWords: 0,
            isMoving: false
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
    
    // Canvas渲染方法
    initCanvasLater() {
        // 延迟初始化Canvas，确保DOM已完全加载
        setTimeout(() => {
            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            
            if (this.ctx) {
                console.log('Canvas 2D上下文初始化成功');
                this.initCanvas();
            } else {
                console.warn('Canvas 2D上下文获取失败，将使用备用渲染方式');
            }
        }, 100);
    }
    
    initCanvas() {
        if (!this.ctx) return;
        
        // 设置Canvas尺寸
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // 初始化游戏场景
        this.drawGameScene();
    }
    
    drawGameScene() {
        if (!this.ctx) {
            // 如果Canvas不可用，跳过渲染
            return;
        }
        
        try {
            // 清空画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 绘制背景
            this.drawBackground();
            
            // 绘制道路
            this.drawRoad();
            
            // 绘制角色
            this.drawCharacters();
            
            // 绘制终点
            this.drawFinishLine();
        } catch (error) {
            console.error('Canvas渲染错误:', error);
        }
    }
    
    drawBackground() {
        // 绘制草地背景
        this.ctx.fillStyle = '#27ae60';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制一些装饰性的树木
        this.drawTrees();
    }
    
    drawRoad() {
        const road = this.roadSystem;
        
        // 绘制道路背景
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(0, road.boundaries.top, this.canvas.width, 
                        road.boundaries.bottom - road.boundaries.top);
        
        // 绘制车道分隔线
        this.ctx.strokeStyle = '#f1c40f';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([15, 10]);
        
        // 绘制车道线
        const laneY = road.boundaries.top + (road.boundaries.bottom - road.boundaries.top) / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, laneY);
        this.ctx.lineTo(this.canvas.width, laneY);
        this.ctx.stroke();
        
        // 绘制车道边界
        this.ctx.setLineDash([]);
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 4;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, road.boundaries.top);
        this.ctx.lineTo(this.canvas.width, road.boundaries.top);
        this.ctx.moveTo(0, road.boundaries.bottom);
        this.ctx.lineTo(this.canvas.width, road.boundaries.bottom);
        this.ctx.stroke();
        
        // 绘制车道编号
        this.ctx.fillStyle = '#7f8c8d';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('车道 1', 10, road.boundaries.top + 15);
        this.ctx.fillText('车道 2', 10, road.boundaries.bottom - 5);
        
        // 绘制起点线
        this.ctx.strokeStyle = '#27ae60';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(80, road.boundaries.top);
        this.ctx.lineTo(80, road.boundaries.bottom);
        this.ctx.stroke();
        
        // 起点标识
        this.ctx.fillStyle = '#27ae60';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('START', 40, road.boundaries.top - 10);
    }
    
    drawTrees() {
        const treePositions = [50, 150, 250, 350, 450, 550, 650, 750];
        
        treePositions.forEach(x => {
            // 绘制树
            this.ctx.fillStyle = '#27ae60';
            this.ctx.beginPath();
            this.ctx.arc(x, 100, 20, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(x, 300, 20, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawCharacters() {
        // 根据车道位置绘制车辆
        const runnerLaneY = this.roadSystem.lanes[this.gameState.runner.lane].y;
        const chaserLaneY = this.roadSystem.lanes[this.gameState.chaser.lane].y;
        
        // 更新车辆Y坐标到对应车道
        this.gameState.runner.y = runnerLaneY;
        this.gameState.chaser.y = chaserLaneY;
        
        // 绘制逃跑者车辆
        this.drawCar(this.gameState.runner.x, runnerLaneY, '#3498db', '🏃');
        
        // 绘制追逐者车辆
        this.drawCar(this.gameState.chaser.x, chaserLaneY, '#e74c3c', '👮');
    }
    
    drawCar(x, y, color, emoji) {
        // 绘制车辆主体
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - 20, y - 10, 40, 20);
        
        // 绘制车辆窗户
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(x - 15, y - 8, 30, 8);
        
        // 绘制车辆轮子
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.beginPath();
        this.ctx.arc(x - 12, y + 10, 4, 0, Math.PI * 2);
        this.ctx.arc(x + 12, y + 10, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制角色emoji
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(emoji, x, y + 5);
    }
    
    drawFinishLine() {
        const road = this.roadSystem;
        const finishX = road.finishLine.x;
        
        // 绘制终点线（方格旗效果）
        this.ctx.strokeStyle = '#f1c40f';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(finishX, road.boundaries.top);
        this.ctx.lineTo(finishX, road.boundaries.bottom);
        this.ctx.stroke();
        
        // 绘制方格旗效果
        const flagSize = 8;
        for (let y = road.boundaries.top; y < road.boundaries.bottom; y += flagSize * 2) {
            for (let x = finishX - 20; x < finishX; x += flagSize) {
                this.ctx.fillStyle = ((x + y) / flagSize) % 2 === 0 ? '#000' : '#fff';
                this.ctx.fillRect(x, y, flagSize, flagSize);
            }
        }
        
        // 绘制终点旗帜
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.fillRect(finishX + 5, road.boundaries.top - 30, 3, 25);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(finishX + 8, road.boundaries.top - 30, 25, 15);
        
        // 绘制终点文字
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('FINISH', finishX + 20, road.boundaries.top - 35);
        
        // 绘制距离提示
        this.ctx.fillStyle = '#7f8c8d';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('终点线', finishX, road.boundaries.bottom + 15);
    }
    
    init() {
        // 初始化Canvas
        this.initCanvas();
        
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
        this.elements.backToMenuBtn.addEventListener('click', () => this.backToMenu());
        
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
        
        // 重置2D坐标（使用车道系统）- 根据角色设置合理位置
        if (this.gameState.selectedRole === 'runner') {
            // 玩家是逃跑者，应该在前面
            this.gameState.runner = { 
                x: 200,  // 逃跑者起始位置靠前
                y: this.roadSystem.lanes[0].y, 
                speed: 0, 
                lane: 0,
                baseSpeed: 1
            };
            this.gameState.chaser = { 
                x: 100,  // 追逐者起始位置靠后
                y: this.roadSystem.lanes[1].y, 
                speed: 0, 
                lane: 1,
                baseSpeed: 0.8
            };
        } else {
            // 玩家是追逐者，应该在后面
            this.gameState.runner = { 
                x: 200,  // 逃跑者NPC起始位置靠前
                y: this.roadSystem.lanes[0].y, 
                speed: 0, 
                lane: 0,
                baseSpeed: 1
            };
            this.gameState.chaser = { 
                x: 100,  // 追逐者玩家起始位置靠后
                y: this.roadSystem.lanes[1].y, 
                speed: 0, 
                lane: 1,
                baseSpeed: 0.8
            };
        }
        
        // 重置实时打字状态
        this.gameState.typingStartTime = null;
        this.gameState.lastTypedTime = null;
        this.gameState.currentSentenceIndex = 0;
        this.gameState.sentences = [];
        this.gameState.currentSentence = '';
        this.gameState.completedWords = 0;
        this.gameState.totalWords = 0;
        this.gameState.isMoving = false;
        this.gameState.gameStarted = false;  // 重置游戏开始标志
        
        // 重置错误惩罚系统
        this.gameState.errorCount = 0;
        this.gameState.backspaceCount = 0;
        this.gameState.accuracyMultiplier = 1.0;
        this.gameState.speedPenalty = 0;
        
        // 重置AI逃跑者状态
        this.gameState.aiEscapeStrategy = 'cautious';
        this.gameState.aiStrategyChangeTime = 0;
        this.gameState.aiUnpredictability = 0.1;
        
        this.showScreen('game');
        this.elements.playerRole.textContent = this.gameState.selectedRole === 'runner' ? '逃跑者' : '追逐者';
        this.elements.currentLibrary.textContent = TextLibraries[this.gameState.selectedLibrary].name;
        this.elements.gameStatus.textContent = '游戏进行中';
        
        // 显示返回菜单按钮
        this.elements.backToMenuBtn.style.display = 'inline-block';
        
        // 启用输入框
        this.elements.typingInput.disabled = false;
        this.elements.typingInput.value = '';
        
        // 初始化句子列表
        this.initializeSentences();
        this.loadNextSentence();
        this.updatePositions();
        this.updateStats();
        
        // 开始游戏循环
        this.startGameLoop();
        
        // 开始实时移动循环
        this.startMovementLoop();
        
        // 确保输入框获得焦点，添加延迟以兼容不同浏览器
        setTimeout(() => {
            this.elements.typingInput.focus();
            this.elements.typingInput.select();
        }, 100);
    }
    
    startGameLoop() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        
        const gameLoop = () => {
            if (this.gameState.isPlaying) {
                this.drawGameScene();
                this.gameLoop = requestAnimationFrame(gameLoop);
            }
        };
        
        this.gameLoop = requestAnimationFrame(gameLoop);
    }
    
    startMovementLoop() {
        if (this.movementLoop) {
            cancelAnimationFrame(this.movementLoop);
        }
        
        const movementLoop = () => {
            if (this.gameState.isPlaying) {
                this.updateMovement();
                this.movementLoop = requestAnimationFrame(movementLoop);
            }
        };
        
        this.movementLoop = requestAnimationFrame(movementLoop);
    }
    
    initializeSentences() {
        if (!TextLibraries || !TextLibraries[this.gameState.selectedLibrary]) {
            this.gameState.sentences = ["测试句子，请开始打字"];
            return;
        }
        
        const library = TextLibraries[this.gameState.selectedLibrary];
        const filteredTexts = this.getTextsByDifficulty(library.texts, this.gameState.selectedDifficulty);
        
        if (filteredTexts.length === 0) {
            this.gameState.sentences = library.texts.slice(0, 10);
        } else {
            this.gameState.sentences = filteredTexts.slice(0, 10);
        }
        
        // 随机打乱句子顺序，确保每次都有不同的开始
        this.gameState.sentences = this.shuffleArray(this.gameState.sentences);
        
        // 计算总词数
        this.gameState.totalWords = this.gameState.sentences.reduce((total, sentence) => {
            return total + sentence.split(/\s+/).length;
        }, 0);
    }
    
    loadNextSentence() {
        if (this.gameState.currentSentenceIndex < this.gameState.sentences.length) {
            this.gameState.currentSentence = this.gameState.sentences[this.gameState.currentSentenceIndex];
            this.gameState.currentSentenceIndex++;
        } else {
            // 重新开始句子列表
            this.gameState.currentSentenceIndex = 0;
            this.gameState.currentSentence = this.gameState.sentences[0];
        }
        
        this.gameState.typedText = '';
        this.gameState.currentText = this.gameState.currentSentence;
        this.elements.targetText.textContent = this.gameState.currentSentence;
        this.elements.typingInput.value = '';
        
        // 重置打字计时
        this.gameState.typingStartTime = Date.now();
        this.gameState.lastTypedTime = Date.now();
    }
    
    // 实时移动更新
    updateMovement() {
        if (!this.gameState.isPlaying) return;
        
        const currentTime = Date.now();
        
        // 计算实时WPM
        this.calculateRealTimeWPM();
        
        // 生死时速模式：玩家开始打字时游戏正式开始
        if (this.gameState.typedText.length > 0 && !this.gameState.gameStarted) {
            // 游戏正式开始！
            this.gameState.gameStarted = true;
            this.gameState.isMoving = true;
            this.elements.gameStatus.textContent = '游戏开始！追逐进行中';
        }
        
        // 如果游戏已经开始，持续移动
        if (this.gameState.gameStarted) {
            this.gameState.isMoving = true;
            
            // 更新速度惩罚（随时间恢复）
            this.updateSpeedPenalty();
            
            // 实时速度匹配：WPM直接转换为移动速度
            // WPM 0-60 对应速度 0-6 像素/帧
            const baseSpeed = Math.max(0, this.gameState.wpm / 10); // 基础速度
            
            // 应用惩罚系统
            const penaltyMultiplier = 1.0 - this.gameState.speedPenalty;
            const finalSpeed = baseSpeed * this.gameState.accuracyMultiplier * penaltyMultiplier;
            
            // 更新玩家速度（包含惩罚效果）
            if (this.gameState.selectedRole === 'runner') {
                this.gameState.runner.speed = finalSpeed;
            } else {
                this.gameState.chaser.speed = finalSpeed;
            }
            
            // 移动玩家车辆
            if (this.gameState.selectedRole === 'runner') {
                this.gameState.runner.x += this.gameState.runner.speed;
            } else {
                this.gameState.chaser.x += this.gameState.chaser.speed;
            }
            
            // NPC移动（游戏开始后NPC会持续追逐）
            this.moveNPC();
        } else {
            // 游戏未开始，保持静止
            this.gameState.isMoving = false;
            this.gameState.runner.speed = 0;
            this.gameState.chaser.speed = 0;
        }
        
        // 检查边界
        this.checkRoadBoundaries();
        
        // 更新位置
        this.updatePositions();
        this.checkGameEnd();
    }
    
    // 实时WPM计算
    calculateRealTimeWPM() {
        if (!this.gameState.typingStartTime) return;
        
        const currentTime = Date.now();
        const timeElapsed = (currentTime - this.gameState.typingStartTime) / 1000 / 60; // 分钟
        
        if (timeElapsed > 0) {
            const wordsTyped = this.gameState.correctChars / 5; // 假设每个单词5个字符
            this.gameState.wpm = Math.round(wordsTyped / timeElapsed);
        } else {
            this.gameState.wpm = 0;
        }
        
        // 更新显示
        this.elements.wpm.textContent = this.gameState.wpm;
    }
    
    // 道路边界检查
    checkRoadBoundaries() {
        const road = this.roadSystem;
        
        // 检查逃跑者边界
        if (this.gameState.runner.x < road.boundaries.left + 20) {
            this.gameState.runner.x = road.boundaries.left + 20;
        }
        if (this.gameState.runner.x > road.boundaries.right - 20) {
            this.gameState.runner.x = road.boundaries.right - 20;
        }
        
        // 检查追逐者边界
        if (this.gameState.chaser.x < road.boundaries.left + 20) {
            this.gameState.chaser.x = road.boundaries.left + 20;
        }
        if (this.gameState.chaser.x > road.boundaries.right - 20) {
            this.gameState.chaser.x = road.boundaries.right - 20;
        }
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
        const currentTime = Date.now();
        
        // 更新打字时间
        this.gameState.lastTypedTime = currentTime;
        if (!this.gameState.typingStartTime) {
            this.gameState.typingStartTime = currentTime;
        }
        
        // 计算输入变化
        const previousLength = this.gameState.typedText.length;
        this.gameState.typedText = typed;
        
        // 错误惩罚系统
        if (typed.length > previousLength) {
            // 新输入字符
            this.gameState.totalChars++;
            
            // 检查是否正确输入
            if (typed === this.gameState.currentText.substring(0, typed.length)) {
                this.gameState.correctChars++;
                e.target.style.borderColor = '#28a745';
            } else {
                // 错误输入惩罚
                this.gameState.errorCount++;
                this.applyErrorPenalty();
                e.target.style.borderColor = '#dc3545';
            }
        } else if (typed.length < previousLength) {
            // 删除字符（退格键）
            this.applyBackspacePenalty();
            e.target.style.borderColor = '#ffc107';
        }
        
        // 实时检查是否完成当前句子
        if (typed === this.gameState.currentText) {
            this.onSentenceComplete();
        }
        
        // 实时更新状态
        this.updateRealTimeStats();
    }
    
    updateRealTimeStats() {
        // 更新准确率
        if (this.gameState.totalChars > 0) {
            this.gameState.accuracy = Math.round((this.gameState.correctChars / this.gameState.totalChars) * 100);
        } else {
            this.gameState.accuracy = 100;
        }
        
        this.elements.accuracy.textContent = this.gameState.accuracy;
    }
    
    onSentenceComplete() {
        // 完成一个句子，增加完成词数
        const words = this.gameState.currentSentence.split(/\s+/).length;
        this.gameState.completedWords += words;
        
        // 生死时速模式：完成句子给予短暂的速度加成，但不影响实时WPM计算
        // 给予临时的"冲刺"效果
        const boostDuration = 2000; // 2秒冲刺
        const currentSpeed = this.gameState.selectedRole === 'runner' ? 
            this.gameState.runner.speed : this.gameState.chaser.speed;
        
        if (this.gameState.selectedRole === 'runner') {
            this.gameState.runner.speed = currentSpeed + 1.5;
        } else {
            this.gameState.chaser.speed = currentSpeed + 1.5;
        }
        
        // 加载下一个句子
        this.loadNextSentence();
        
        // 显示完成提示
        this.showCompletionEffect();
        
        // 2秒后恢复正常速度（由WPM计算控制）
        setTimeout(() => {
            if (this.gameState.isPlaying) {
                // 速度会由updateMovement()中的WPM计算重新设置
            }
        }, boostDuration);
    }
    
    // 错误惩罚系统方法
    applyErrorPenalty() {
        // 错误输入惩罚：增加速度惩罚
        this.gameState.speedPenalty = Math.min(0.5, this.gameState.speedPenalty + 0.1);
        this.updateAccuracyMultiplier();
        
        // 显示惩罚反馈
        this.showPenaltyEffect('错误输入！速度减慢', '#dc3545');
    }
    
    applyBackspacePenalty() {
        // 退格键使用惩罚：较轻的速度惩罚
        this.gameState.backspaceCount++;
        this.gameState.speedPenalty = Math.min(0.5, this.gameState.speedPenalty + 0.05);
        this.updateAccuracyMultiplier();
        
        // 显示惩罚反馈
        this.showPenaltyEffect('退格删除！轻微减速', '#ffc107');
    }
    
    updateAccuracyMultiplier() {
        // 基于准确率计算倍数
        const accuracy = this.gameState.totalChars > 0 ? 
            (this.gameState.correctChars / this.gameState.totalChars) : 1.0;
        
        // 准确率倍数：准确率越高，倍数越接近1.0
        this.gameState.accuracyMultiplier = Math.max(0.5, accuracy);
    }
    
    updateSpeedPenalty() {
        // 速度惩罚随时间逐渐恢复
        if (this.gameState.speedPenalty > 0) {
            this.gameState.speedPenalty = Math.max(0, this.gameState.speedPenalty - this.gameState.penaltyDecayRate);
        }
    }
    
    // 智能逃跑策略判定（支持难度设置）
    determineEscapeStrategyWithDifficulty(distance, finishDistance, playerSpeed, aiSettings) {
        const currentTime = Date.now();
        
        // 距离判定
        const isImmediateDanger = distance < 50;   // 立即危险
        const isCloseDanger = distance < 100;     // 接近危险
        const isSafeDistance = distance >= 150;  // 安全距离
        
        // 终点距离判定
        const isNearFinish = finishDistance < 200;  // 接近终点
        const isVeryNearFinish = finishDistance < 100;  // 非常接近终点
        
        // 玩家速度判定
        const isPlayerFast = playerSpeed > 3;      // 玩家速度快
        const isPlayerVeryFast = playerSpeed > 5;  // 玩家速度很快
        
        // 根据难度调整危险阈值
        const adjustedThresholds = {
            immediateDanger: aiSettings.reactionTime < 1.0 ? 60 : 50,
            closeDanger: aiSettings.reactionTime < 1.0 ? 120 : 100,
            safeDistance: aiSettings.reactionTime < 1.0 ? 180 : 150
        };
        
        // 基础策略判定
        let baseStrategy;
        if (distance < adjustedThresholds.immediateDanger) {
            baseStrategy = 'panic';
        } else if (distance < adjustedThresholds.closeDanger && isPlayerFast) {
            baseStrategy = 'urgent';
        } else if (finishDistance < adjustedThresholds.immediateDanger) {
            baseStrategy = 'panic';
        } else if (finishDistance < adjustedThresholds.closeDanger) {
            baseStrategy = 'strategic';
        } else if (distance >= adjustedThresholds.safeDistance && !isPlayerVeryFast) {
            baseStrategy = 'cautious';
        } else {
            baseStrategy = 'strategic';
        }
        
        // 添加难度相关的不可预测性
        const shouldRandomize = Math.random() < aiSettings.unpredictability;
        if (shouldRandomize && distance >= adjustedThresholds.immediateDanger && finishDistance >= adjustedThresholds.closeDanger) {
            const strategies = ['panic', 'urgent', 'strategic', 'cautious'];
            const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)];
            
            if (this.getStrategyDifference(baseStrategy, randomStrategy) <= 1) {
                baseStrategy = randomStrategy;
            }
        }
        
        // 策略变化冷却时间（根据难度调整）
        if (baseStrategy !== this.gameState.aiEscapeStrategy) {
            const timeSinceLastChange = currentTime - this.gameState.aiStrategyChangeTime;
            if (timeSinceLastChange < aiSettings.strategyCoolDown) {
                baseStrategy = this.gameState.aiEscapeStrategy;
            } else {
                this.gameState.aiStrategyChangeTime = currentTime;
                this.gameState.aiEscapeStrategy = baseStrategy;
                
                // 显示策略变化（仅当玩家是追逐者时）
                if (this.gameState.selectedRole === 'chaser') {
                    this.showAIStrategyChange(baseStrategy);
                }
            }
        }
        
        return baseStrategy;
    }
    
    // 智能逃跑策略判定（保持向后兼容）
    determineEscapeStrategy(distance, finishDistance, playerSpeed) {
        const defaultSettings = {
            unpredictability: 0.1,
            reactionTime: 1.0,
            strategyCoolDown: 2000
        };
        return this.determineEscapeStrategyWithDifficulty(distance, finishDistance, playerSpeed, defaultSettings);
    }
    
    // 获取策略差异等级
    getStrategyDifference(strategy1, strategy2) {
        const strategyLevels = {
            'cautious': 1,
            'strategic': 2,
            'urgent': 3,
            'panic': 4
        };
        
        return Math.abs(strategyLevels[strategy1] - strategyLevels[strategy2]);
    }
    
    // 显示AI策略变化
    showAIStrategyChange(strategy) {
        const strategyNames = {
            'panic': 'AI恐慌逃跑！',
            'urgent': 'AI紧急加速！',
            'strategic': 'AI策略调整！',
            'cautious': 'AI谨慎移动！'
        };
        
        const colors = {
            'panic': '#dc3545',
            'urgent': '#fd7e14',
            'strategic': '#ffc107',
            'cautious': '#17a2b8'
        };
        
        this.showPenaltyEffect(strategyNames[strategy], colors[strategy]);
    }
    
    showPenaltyEffect(message, color) {
        // 显示惩罚效果
        const statusElement = this.elements.gameStatus;
        const originalText = statusElement.textContent;
        
        statusElement.textContent = message;
        statusElement.style.color = color;
        statusElement.style.fontWeight = 'bold';
        
        setTimeout(() => {
            statusElement.textContent = originalText;
            statusElement.style.color = '';
            statusElement.style.fontWeight = '';
        }, 1000);
    }
    
    // 随机打乱数组
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    showCompletionEffect() {
        // 简单的完成效果
        const originalBorder = this.elements.typingInput.style.borderColor;
        this.elements.typingInput.style.borderColor = '#28a745';
        this.elements.typingInput.style.boxShadow = '0 0 10px rgba(40, 167, 69, 0.5)';
        
        setTimeout(() => {
            this.elements.typingInput.style.borderColor = originalBorder;
            this.elements.typingInput.style.boxShadow = '';
        }, 500);
    }
    
    onTextComplete() {
        // 这个方法现在主要用于NPC的移动逻辑
        // 玩家移动已在updateMovement()中实时处理
        
        // NPC移动（自动追逐/逃跑机制）
        this.moveNPC();
        
        this.updatePositions();
        this.checkGameEnd();
    }
    
    moveNPC() {
        // 获取当前难度的AI设置
        const difficulty = this.gameState.selectedDifficulty || 'medium';
        const aiSettings = this.gameState.aiDifficultySettings[difficulty];
        
        // 生死时速模式：NPC速度与玩家WPM相关
        const playerWPM = this.gameState.wpm;
        const baseNpcSpeed = Math.max(0.5, playerWPM / 10);
        const npcSpeed = baseNpcSpeed * aiSettings.speedMultiplier;
        
        if (this.gameState.selectedRole === 'runner') {
            // 玩家是逃跑者，NPC是追逐者
            const distance = this.gameState.runner.x - this.gameState.chaser.x;
            
            if (distance > 100) {
                // 距离远时，NPC以计算速度追赶
                this.gameState.chaser.speed = npcSpeed;
                this.gameState.chaser.x += this.gameState.chaser.speed;
            } else if (distance < 50) {
                // 距离很近时，NPC稍微加速
                this.gameState.chaser.speed = npcSpeed * 1.2;
                this.gameState.chaser.x += this.gameState.chaser.speed;
            } else {
                // 正常距离，标准速度
                this.gameState.chaser.speed = npcSpeed;
                this.gameState.chaser.x += this.gameState.chaser.speed;
            }
        } else {
            // 玩家是追逐者，NPC是逃跑者 - 智能逃跑系统
            const distance = this.gameState.runner.x - this.gameState.chaser.x;
            const finishDistance = this.roadSystem.finishLine.x - this.gameState.runner.x;
            const playerSpeed = this.gameState.chaser.speed;
            
            // 智能逃跑策略（使用难度设置）
            let escapeStrategy = this.determineEscapeStrategyWithDifficulty(distance, finishDistance, playerSpeed, aiSettings);
            
            // 根据难度调整速度倍数
            const strategyMultipliers = {
                'panic': aiSettings.speedMultiplier * 1.5,
                'urgent': aiSettings.speedMultiplier * 1.3,
                'strategic': aiSettings.speedMultiplier * (finishDistance < 200 ? 1.4 : 1.1),
                'cautious': aiSettings.speedMultiplier * 1.0
            };
            
            this.gameState.runner.speed = npcSpeed * (strategyMultipliers[escapeStrategy] || aiSettings.speedMultiplier);
            
            // 应用策略速度
            this.gameState.runner.x += this.gameState.runner.speed;
        }
        
        // 确保NPC不超出边界
        if (this.gameState.selectedRole === 'runner') {
            this.gameState.chaser.x = Math.max(50, Math.min(720, this.gameState.chaser.x));
        } else {
            this.gameState.runner.x = Math.max(50, Math.min(720, this.gameState.runner.x));
        }
    }
    
    updatePositions() {
        // 更新角色位置（保留原有的DOM更新以兼容其他功能）
        this.elements.runner.style.left = `${this.gameState.runnerPosition}%`;
        this.elements.chaser.style.left = `${this.gameState.chaserPosition}%`;
        
        // 更新进度条
        this.elements.runnerProgress.style.width = `${(this.gameState.runnerPosition / this.gameState.targetPosition) * 100}%`;
        this.elements.chaserProgress.style.width = `${(this.gameState.chaserPosition / this.gameState.targetPosition) * 100}%`;
        
        // 更新距离（使用Canvas坐标）
        const canvasDistance = Math.abs(this.gameState.runner.x - this.gameState.chaser.x);
        this.elements.distanceValue.textContent = `${Math.round(canvasDistance)}m`;
        
        // 检查追逐状态
        if (canvasDistance < 50) {
            this.elements.chaser.classList.add('danger');
        } else {
            this.elements.chaser.classList.remove('danger');
        }
        
        // 更新游戏状态显示
        let statusText;
        if (!this.gameState.gameStarted) {
            statusText = '等待开始打字...';
        } else {
            statusText = this.gameState.isMoving ? '追逐进行中' : '移动中';
            
            // 添加惩罚状态提示
            if (this.gameState.speedPenalty > 0) {
                const penaltyPercent = Math.round(this.gameState.speedPenalty * 100);
                statusText += ` (惩罚-${penaltyPercent}%)`;
            }
            
            if (this.gameState.accuracyMultiplier < 1.0) {
                const accuracyPercent = Math.round(this.gameState.accuracyMultiplier * 100);
                statusText += ` (准确率${accuracyPercent}%)`;
            }
        }
        
        const speedText = this.gameState.selectedRole === 'runner' ? 
            `${this.gameState.runner.speed.toFixed(1)}` : 
            `${this.gameState.chaser.speed.toFixed(1)}`;
        
        this.elements.gameStatus.textContent = `${statusText} - 速度: ${speedText}`;
        
        // 检查道路边界
        this.checkRoadBoundaries();
        
        // Canvas位置由drawGameScene()处理
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
        const finishX = this.roadSystem.finishLine.x;
        
        // 防止位置超出边界
        this.gameState.runnerPosition = Math.min(this.gameState.runnerPosition, 100);
        this.gameState.chaserPosition = Math.min(this.gameState.chaserPosition, 100);
        
        // 检查是否到达终点（使用Canvas坐标）
        if (this.gameState.runner.x >= finishX) {
            this.endGame(this.gameState.selectedRole === 'runner' ? 'win' : 'lose');
            return;
        }
        
        // 检查是否被抓住（使用Canvas坐标）
        const distance = Math.abs(this.gameState.runner.x - this.gameState.chaser.x);
        if (distance < 30) { // 距离小于30像素算作抓住
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
        
        // 停止游戏循环
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        if (this.movementLoop) {
            cancelAnimationFrame(this.movementLoop);
        }
        
        // 禁用输入框
        this.elements.typingInput.disabled = true;
        
        const gameTime = Math.round((Date.now() - this.gameState.startTime) / 1000);
        
        this.elements.finalWpm.textContent = this.gameState.wpm;
        this.elements.finalAccuracy.textContent = this.gameState.accuracy;
        this.elements.gameTime.textContent = gameTime;
        
        // 计算完成的句子数量
        const completedSentences = this.gameState.completedWords > 0 ? 
            Math.floor(this.gameState.completedWords / 3) : 0; // 假设平均每句3个词
        
        if (result === 'win') {
            this.elements.resultTitle.textContent = '恭喜你赢了！';
            this.elements.resultMessage.textContent = this.gameState.selectedRole === 'runner' ? 
                `你成功到达了终点！完成了 ${completedSentences} 个句子` : 
                `你成功抓住了逃跑者！完成了 ${completedSentences} 个句子`;
        } else if (result === 'timeout') {
            this.elements.resultTitle.textContent = '时间到！';
            this.elements.resultMessage.textContent = `游戏时间已结束，完成了 ${completedSentences} 个句子`;
        } else {
            this.elements.resultTitle.textContent = '游戏结束';
            this.elements.resultMessage.textContent = this.gameState.selectedRole === 'runner' ? 
                `你被抓住了！完成了 ${completedSentences} 个句子` : 
                `逃跑者到达了终点！完成了 ${completedSentences} 个句子`;
        }
        
        this.showScreen('end');
    }
    
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => screen.classList.add('hidden'));
        this.screens[screenName].classList.remove('hidden');
    }
    
    backToMenu() {
        // 停止当前游戏
        if (this.gameState.isPlaying) {
            this.gameState.isPlaying = false;
        }
        
        // 显示确认对话框
        const confirmBack = confirm('确定要返回主菜单吗？当前游戏进度将会丢失。');
        if (confirmBack) {
            // 重置游戏状态
            this.gameState.isPlaying = false;
            this.gameState.gameStarted = false;
            this.elements.typingInput.value = '';
            this.elements.typingInput.disabled = true;
            
            // 隐藏返回菜单按钮
            this.elements.backToMenuBtn.style.display = 'none';
            
            // 返回主菜单
            this.showScreen('start');
        }
    }
}

// 游戏初始化
document.addEventListener('DOMContentLoaded', () => {
    // 防止重复初始化
    if (!window.typingGame) {
        window.typingGame = new TypingChaseGame();
    }
});