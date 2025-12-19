// 烟花效果类
class Fireworks {
    constructor() {
        this.canvas = document.getElementById('fireworks-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.fireworks = [];
        this.hue = 120;
        this.timerTotal = 70;
        this.timerTick = 0;
        this.mouse = { x: 0, y: 0 };
        this.isActive = false;
        this.animationId = null;
        this.fireworkStyles = ['classic', 'rainbow', 'sparkle', 'heart'];
        this.currentStyle = 'classic';
        this.init();
    }

    // 初始化
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // 鼠标互动
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.canvas.addEventListener('click', (e) => {
            this.createFirework(e.clientX, e.clientY);
        });
    }

    // 调整画布大小
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // 开始烟花表演
    start() {
        if (this.isActive) return;

        this.isActive = true;
        this.canvas.style.display = 'block';
        this.animate();

        // 自动生成烟花
        this.autoFireworksInterval = setInterval(() => {
            if (this.isActive) {
                this.createRandomFirework();
            }
        }, 300);
    }

    // 停止烟花表演
    stop() {
        this.isActive = false;
        clearInterval(this.autoFireworksInterval);
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.canvas.style.display = 'none';
        this.clear();
    }

    // 切换烟花表演
    toggle() {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
    }

    // 更改烟花样式
    changeStyle() {
        const styles = this.fireworkStyles;
        const currentIndex = styles.indexOf(this.currentStyle);
        this.currentStyle = styles[(currentIndex + 1) % styles.length];

        // 播放一个示例烟花
        this.createRandomFirework();
    }

    // 密集烟花
    intensive() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createRandomFirework();
            }, i * 100);
        }
    }

    // 创建随机烟花
    createRandomFirework() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height / 2;
        this.createFirework(x, y);
    }

    // 创建烟花
    createFirework(sx, sy, tx = null, ty = null) {
        tx = tx || sx;
        ty = ty || Math.random() * this.canvas.height / 3;

        this.fireworks.push({
            x: sx,
            y: sy,
            tx: tx,
            ty: ty,
            speed: 2 + Math.random() * 2,
            acceleration: 1.05,
            brightness: 70 + Math.random() * 30,
            hue: this.getHueByStyle(),
            targetRadius: 1,
            radius: 3
        });
    }

    // 根据样式获取色调
    getHueByStyle() {
        switch (this.currentStyle) {
            case 'rainbow':
                return Math.random() * 360;
            case 'sparkle':
                return 60; // 金色
            case 'heart':
                return 0; // 红色
            case 'classic':
            default:
                return this.hue;
        }
    }

    // 创建粒子
    createParticles(x, y, hue) {
        const particleCount = 100;
        const isHeart = this.currentStyle === 'heart';

        for (let i = 0; i < particleCount; i++) {
            const angle = isHeart ?
                this.getHeartAngle(i / particleCount) :
                Math.PI * 2 * Math.random();

            const speed = isHeart ?
                2 + Math.random() * 2 :
                2 + Math.random() * 4;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 2 + Math.random() * 3,
                hue: hue,
                brightness: 50 + Math.random() * 50,
                alpha: 1,
                decay: 0.01 + Math.random() * 0.02,
                gravity: 0.05,
                friction: 0.97
            });
        }
    }

    // 获取心形角度
    getHeartAngle(t) {
        const pi = Math.PI;
        const angle = 2 * pi * t;
        const x = 16 * Math.pow(Math.sin(angle), 3);
        const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
        return Math.atan2(-y, x);
    }

    // 动画循环
    animate() {
        if (!this.isActive) return;

        this.animationId = requestAnimationFrame(() => this.animate());
        this.update();
        this.draw();
    }

    // 更新状态
    update() {
        this.hue += 0.5;

        // 更新烟花
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const firework = this.fireworks[i];
            const dx = firework.tx - firework.x;
            const dy = firework.ty - firework.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 移动烟花
            firework.x += dx / distance * firework.speed;
            firework.y += dy / distance * firework.speed;
            firework.speed *= firework.acceleration;

            // 如果到达目标位置，爆炸
            if (distance < 5) {
                this.createParticles(firework.x, firework.y, firework.hue);
                this.fireworks.splice(i, 1);
            }
        }

        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // 应用物理
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            particle.vy += particle.gravity;

            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 衰减
            particle.alpha -= particle.decay;
            particle.radius -= particle.decay * 10;

            // 移除消失的粒子
            if (particle.alpha <= 0 || particle.radius <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // 自动创建新烟花
        this.timerTick++;
        if (this.timerTick >= this.timerTotal) {
            this.timerTick = 0;
            this.createRandomFirework();
        }
    }

    // 绘制
    draw() {
        // 半透明背景创建拖尾效果
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.globalCompositeOperation = 'lighter';

        // 绘制烟花
        this.fireworks.forEach(firework => {
            this.ctx.beginPath();
            this.ctx.arc(firework.x, firework.y, firework.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsl(${firework.hue}, 100%, ${firework.brightness}%)`;
            this.ctx.fill();

            // 绘制轨迹
            this.ctx.beginPath();
            this.ctx.moveTo(firework.x, firework.y);
            this.ctx.lineTo(firework.x - firework.vx, firework.y - firework.vy);
            this.ctx.strokeStyle = `hsl(${firework.hue}, 100%, ${firework.brightness}%)`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });

        // 绘制粒子
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

            if (this.currentStyle === 'sparkle' && Math.random() > 0.7) {
                // 闪烁效果
                this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
            } else {
                this.ctx.fillStyle = `hsla(${particle.hue}, 100%, ${particle.brightness}%, ${particle.alpha})`;
            }

            this.ctx.fill();
        });
    }

    // 清空画布
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.fireworks = [];
        this.particles = [];
    }
}

// 初始化烟花
const fireworks = new Fireworks();

// 导出到全局作用域
window.startFireworks = () => fireworks.start();
window.stopFireworks = () => fireworks.stop();
window.toggleFireworks = () => fireworks.toggle();
window.changeFireworksStyle = () => fireworks.changeStyle();
window.intensiveFireworks = () => fireworks.intensive();

// 添加烟花控制
document.addEventListener('DOMContentLoaded', function() {
    // 添加烟花控制CSS
    const style = document.createElement('style');
    style.textContent = `
        #fireworks-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
            display: none;
        }
        
        .fireworks-controls {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin: 15px 0;
        }
        
        .fireworks-info {
            text-align: center;
            margin-top: 10px;
            font-size: 0.9rem;
            color: var(--text-secondary);
        }
    `;
    document.head.appendChild(style);
});