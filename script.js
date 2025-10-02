// 从图片中识别的奖品列表（忽略价格）
const prizes = [
    '三等奖',
    '谢谢惠顾',
    '感恩奖',
    '特等奖',
    '二等奖',
    '再来一次',
    '纸巾',
    '咖啡糖'
];

// 奖品详细信息
const prizeDetails = {
    '特等奖': '深蹲10次，蛙跳10次',
    '一等奖': '笔袋2个',
    '二等奖': '涂改带3个',
    '三等奖': '本子4本，便签2个'
};

// 配置颜色数组
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 240;

let currentRotation = 0;
let isSpinning = false;

// 音效播放函数（使用 Web Audio API 生成音效）
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playWinSound() {
    // 创建欢快的中奖音效
    const now = audioContext.currentTime;

    // 主音符序列
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = now + i * 0.15;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
    });

    // 添加闪光音效
    setTimeout(() => {
        const sparkle = audioContext.createOscillator();
        const sparkleGain = audioContext.createGain();

        sparkle.connect(sparkleGain);
        sparkleGain.connect(audioContext.destination);

        sparkle.type = 'sine';
        sparkle.frequency.setValueAtTime(2000, audioContext.currentTime);
        sparkle.frequency.exponentialRampToValueAtTime(3000, audioContext.currentTime + 0.1);

        sparkleGain.gain.setValueAtTime(0.2, audioContext.currentTime);
        sparkleGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        sparkle.start();
        sparkle.stop(audioContext.currentTime + 0.3);
    }, 400);
}

function playSpinSound() {
    // 旋转持续音效 - 使用更长的音效模拟转盘旋转
    const duration = 4; // 4秒，匹配旋转动画
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sawtooth';
    filter.type = 'lowpass';

    const now = audioContext.currentTime;

    // 音调从低到高再到低，模拟加速减速
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.linearRampToValueAtTime(400, now + 0.5);
    oscillator.frequency.linearRampToValueAtTime(500, now + 2);
    oscillator.frequency.linearRampToValueAtTime(300, now + duration);

    // 音量渐入渐出
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gainNode.gain.setValueAtTime(0.15, now + duration - 0.5);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    // 滤波器变化
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.linearRampToValueAtTime(3000, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
}

// 创建彩纸效果
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e2', '#ffd700', '#ff69b4'];
    const confettiCount = 80;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-20px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.animationDelay = Math.random() * 0.2 + 's';
            confetti.style.animationDuration = (Math.random() * 1.5 + 2.5) + 's';
            confetti.style.width = (Math.random() * 8 + 8) + 'px';
            confetti.style.height = (Math.random() * 8 + 8) + 'px';

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4500);
        }, i * 25);
    }
}

// 创建烟花效果
function createFireworks() {
    const colors = ['#ff0844', '#ffb199', '#ffd23f', '#44e5e7', '#7676ff', '#ff6bff', '#00ff88', '#ff3366'];

    function launchFirework() {
        // 随机位置发射烟花
        const x = Math.random() * 70 + 15; // 15% - 85% 位置
        const y = Math.random() * 30 + 15; // 15% - 45% 位置

        // 创建爆炸粒子 - 增加数量
        const particleCount = 80;
        const baseColor = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.position = 'fixed';
            particle.style.left = x + '%';
            particle.style.top = y + '%';
            particle.style.width = '10px';  // 增大粒子
            particle.style.height = '10px';
            particle.style.borderRadius = '50%';
            particle.style.background = baseColor;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1001';

            // 随机角度和速度 - 增加速度范围
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 150 + 100; // 增加速度
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            // 增强光晕效果
            particle.style.boxShadow = `
                0 0 15px ${baseColor},
                0 0 30px ${baseColor},
                0 0 45px ${baseColor}
            `;

            document.body.appendChild(particle);

            // 动画
            let posX = 0;
            let posY = 0;
            let opacity = 1;
            let startTime = Date.now();

            function animateParticle() {
                const elapsed = (Date.now() - startTime) / 1000;

                if (elapsed > 2 || opacity <= 0) {  // 延长持续时间
                    particle.remove();
                    return;
                }

                // 物理运动（带重力）
                posX = vx * elapsed;
                posY = vy * elapsed + 80 * elapsed * elapsed; // 增加重力
                opacity = 1 - elapsed / 2;

                particle.style.transform = `translate(${posX}px, ${posY}px) scale(${1 - elapsed / 4})`;
                particle.style.opacity = opacity;

                requestAnimationFrame(animateParticle);
            }

            animateParticle();
        }

        // 添加中心闪光
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.left = x + '%';
        flash.style.top = y + '%';
        flash.style.width = '100px';
        flash.style.height = '100px';
        flash.style.borderRadius = '50%';
        flash.style.background = `radial-gradient(circle, ${baseColor}, transparent)`;
        flash.style.transform = 'translate(-50%, -50%)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '1000';
        flash.style.opacity = '1';
        flash.style.boxShadow = `0 0 60px 30px ${baseColor}`;
        document.body.appendChild(flash);

        let flashOpacity = 1;
        let flashScale = 0;
        function animateFlash() {
            flashOpacity -= 0.03;
            flashScale += 0.1;
            flash.style.opacity = flashOpacity;
            flash.style.transform = `translate(-50%, -50%) scale(${flashScale})`;

            if (flashOpacity > 0) {
                requestAnimationFrame(animateFlash);
            } else {
                flash.remove();
            }
        }
        animateFlash();
    }

    // 连续发射更多烟花
    for (let i = 0; i < 12; i++) {
        setTimeout(() => launchFirework(), i * 250);
    }
}

// 创建星星闪烁效果
function createStars() {
    const starCount = 50;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // 随机创建大星星
        if (Math.random() > 0.7) {
            star.classList.add('large');
        }

        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
        document.body.appendChild(star);
    }
}

// 创建流星效果
function createShootingStar() {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';

    // 从右上角随机位置出现
    shootingStar.style.left = (Math.random() * 30 + 70) + '%';
    shootingStar.style.top = (Math.random() * 20) + '%';

    // 随机持续时间，让流星有快有慢
    const duration = Math.random() * 0.5 + 1.2; // 1.2-1.7秒
    shootingStar.style.animation = `shootingStar ${duration}s ease-out forwards`;

    document.body.appendChild(shootingStar);

    setTimeout(() => shootingStar.remove(), duration * 1000);
}

// 定期创建流星
function startShootingStars() {
    // 立即创建一颗流星
    setTimeout(() => createShootingStar(), 1000);

    setInterval(() => {
        if (Math.random() > 0.3) { // 70%概率出现流星，更频繁
            createShootingStar();
        }
    }, 4000); // 每4秒检查一次
}

// 创建标题粒子效果
function createTitleParticles() {
    const particlesContainer = document.getElementById('titleParticles');
    const title = document.getElementById('title');

    if (!particlesContainer || !title) return;

    function generateParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // 随机大小
        if (Math.random() > 0.7) {
            particle.classList.add('large');
        }

        // 随机位置（从标题底部）
        const randomX = Math.random() * 100;
        particle.style.left = randomX + '%';
        particle.style.bottom = '0';

        // 随机水平偏移
        const randomTx = (Math.random() - 0.5) * 60;
        particle.style.setProperty('--tx', randomTx + 'px');

        // 随机动画延迟
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';

        particlesContainer.appendChild(particle);

        // 动画结束后移除
        setTimeout(() => {
            particle.remove();
        }, parseFloat(particle.style.animationDuration) * 1000 + 2000);
    }

    // 持续生成粒子
    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => generateParticle(), i * 200);
        }
    }, 800);

    // 初始生成一批
    for (let i = 0; i < 10; i++) {
        setTimeout(() => generateParticle(), i * 100);
    }
}

// 页面加载时创建星星和启动流星
window.addEventListener('load', () => {
    createStars();
    startShootingStars();
    createTitleParticles();
});

// 绘制转盘
function drawWheel() {
    const anglePerSlice = (2 * Math.PI) / prizes.length;

    prizes.forEach((prize, index) => {
        const startAngle = currentRotation + index * anglePerSlice;
        const endAngle = startAngle + anglePerSlice;

        // 绘制扇形
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        // 绘制边框
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 绘制刻度线
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle);
        ctx.beginPath();
        ctx.moveTo(radius - 20, 0);
        ctx.lineTo(radius, 0);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // 绘制小刻度点
        ctx.beginPath();
        ctx.arc(radius - 10, 0, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();

        // 绘制文字
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSlice / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Microsoft YaHei';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(prize, radius * 0.65, 10);
        ctx.restore();
    });

    // 绘制中心装饰圆环
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
    const outerGradient = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 60);
    outerGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
    outerGradient.addColorStop(1, 'rgba(255, 215, 0, 0.8)');
    ctx.fillStyle = outerGradient;
    ctx.fill();
    ctx.restore();

    // 绘制中心主圆
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    const centerGradient = ctx.createRadialGradient(centerX, centerY - 10, 5, centerX, centerY, 50);
    centerGradient.addColorStop(0, '#FFD700');
    centerGradient.addColorStop(0.5, '#FFA500');
    centerGradient.addColorStop(1, '#FF8C00');
    ctx.fillStyle = centerGradient;
    ctx.fill();

    // 中心圆边框
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // 内圈装饰
    ctx.beginPath();
    ctx.arc(centerX, centerY, 42, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 绘制中心文字
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText('抽奖', centerX, centerY);
    ctx.restore();
}

// 计算获奖结果
function getWinningPrize(finalRotation) {
    const normalizedRotation = (finalRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const anglePerSlice = (2 * Math.PI) / prizes.length;

    // 指针在顶部（-90度位置），计算指向的扇区
    // 加上偏移量来对齐指针位置
    const pointerAngle = (3 * Math.PI / 2 - normalizedRotation) % (2 * Math.PI);
    const adjustedAngle = (pointerAngle + 2 * Math.PI) % (2 * Math.PI);
    const winningIndex = Math.floor(adjustedAngle / anglePerSlice);

    return prizes[winningIndex];
}

// 旋转动画
function spin() {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;
    resultDiv.innerHTML = '';

    // 播放开始旋转音效
    playSpinSound();

    // 添加旋转视觉效果
    const wheelContainer = document.querySelector('.wheel-container');
    wheelContainer.classList.add('spinning');
    canvas.classList.add('spinning');

    // 随机旋转角度（至少5圈）
    const minSpins = 5;
    const maxSpins = 8;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const randomAngle = Math.random() * 2 * Math.PI;
    const totalRotation = spins * 2 * Math.PI + randomAngle;

    const duration = 4000; // 4秒
    const startTime = Date.now();
    const startRotation = currentRotation;

    function animate() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数（ease-out）
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentRotation = startRotation + totalRotation * easeOut;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // 旋转结束
            isSpinning = false;
            spinBtn.disabled = false;
            wheelContainer.classList.remove('spinning');
            canvas.classList.remove('spinning');

            const winningPrize = getWinningPrize(currentRotation);
            const prizeDetail = prizeDetails[winningPrize];
            let resultText = `恭喜你获得: ${winningPrize}!`;
            if (prizeDetail) {
                resultText += `<br><span style="font-size: 0.8em; color: #666;">${prizeDetail}</span>`;
            }
            resultDiv.innerHTML = `<div class="result-text">${resultText}</div>`;

            // 特等奖触发烟花效果
            if (winningPrize === '特等奖') {
                playWinSound();
                createFireworks();
            }
            // 其他中奖触发彩纸效果
            else if (winningPrize !== '谢谢惠顾' && winningPrize !== '再来一次') {
                playWinSound();
                createConfetti();
            }
        }
    }

    animate();
}

// 初始化
drawWheel();

// 绑定按钮事件
spinBtn.addEventListener('click', spin);

// 响应式canvas大小调整
function resizeCanvas() {
    const container = document.querySelector('.wheel-container');
    const containerWidth = Math.min(window.innerWidth * 0.9, 500);

    if (window.innerWidth <= 600) {
        canvas.width = containerWidth;
        canvas.height = containerWidth;

        // 重新计算中心点和半径
        const newCenterX = canvas.width / 2;
        const newCenterY = canvas.height / 2;
        const scale = canvas.width / 500;

        ctx.setTransform(scale, 0, 0, scale, 0, 0);
    }

    drawWheel();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
