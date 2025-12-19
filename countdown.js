// 倒计时功能
class NewYearCountdown {
    constructor() {
        this.targetDate = new Date('2026-01-01T00:00:00');
        this.updateInterval = null;
        this.init();
    }

    init() {
        this.updateAllCountdowns();
        this.startAutoUpdate();
    }

    // 更新所有倒计时显示
    updateAllCountdowns() {
        const now = new Date();
        const diff = this.targetDate - now;

        if (diff <= 0) {
            this.displayNewYear();
            return;
        }

        this.updateMainCountdown(diff);
        this.updateMiniCountdown(diff);
    }

    // 更新主倒计时
    updateMainCountdown(diff) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        this.updateElement('cd-days', days);
        this.updateElement('cd-hours', hours);
        this.updateElement('cd-minutes', minutes);
        this.updateElement('cd-seconds', seconds);

        // 添加动画效果
        this.animateCountdown('cd-seconds', seconds);
    }

    // 更新迷你倒计时
    updateMiniCountdown(diff) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        this.updateElement('mini-days', days.toString().padStart(3, '0'));
        this.updateElement('mini-hours', hours.toString().padStart(2, '0'));
        this.updateElement('mini-minutes', minutes.toString().padStart(2, '0'));
    }

    // 更新元素内容
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // 倒计时动画
    animateCountdown(id, newValue) {
        const element = document.getElementById(id);
        if (!element) return;

        if (element.dataset.lastValue !== newValue.toString()) {
            element.classList.add('counting');

            setTimeout(() => {
                element.classList.remove('counting');
            }, 300);

            element.dataset.lastValue = newValue.toString();
        }
    }

    // 开始自动更新
    startAutoUpdate() {
        this.updateInterval = setInterval(() => {
            this.updateAllCountdowns();
        }, 1000);
    }

    // 显示新年到来
    displayNewYear() {
        clearInterval(this.updateInterval);

        // 更新主倒计时显示
        this.updateElement('cd-days', '0');
        this.updateElement('cd-hours', '0');
        this.updateElement('cd-minutes', '0');
        this.updateElement('cd-seconds', '0');

        // 更新迷你倒计时显示
        this.updateElement('mini-days', '000');
        this.updateElement('mini-hours', '00');
        this.updateElement('mini-minutes', '00');

        // 显示庆祝消息
        if (!document.getElementById('new-year-message')) {
            const message = document.createElement('div');
            message.id = 'new-year-message';
            message.className = 'new-year-message';
            message.innerHTML = `
                <div class="message-content">
                    <h3>🎉 2026年已到来！</h3>
                    <p>新年快乐！愿2026年带给你无限的幸福与成功！</p >
                </div>
            `;

            document.querySelector('.header').appendChild(message);

            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .new-year-message {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: linear-gradient(135deg, rgba(255, 51, 102, 0.2), rgba(51, 102, 255, 0.2));
                    backdrop-filter: blur(10px);
                    border-radius: 0 0 20px 20px;
                    padding: 20px;
                    margin-top: 20px;
                    text-align: center;
                    animation: slideDown 0.5s ease;
                    z-index: 10;
                }
                
                .new-year-message h3 {
                    color: var(--primary-color);
                    margin-bottom: 10px;
                }
                
                .new-year-message p {
                    color: var(--text-secondary);
                }
                
                @keyframes slideDown {
                    from {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `;

            document.head.appendChild(style);
        }
    }

    // 获取倒计时数据
    getCountdownData() {
        const now = new Date();
        const diff = this.targetDate - now;

        if (diff <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                totalSeconds: 0,
                isNewYear: true
            };
        }

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
            totalSeconds: Math.floor(diff / 1000),
            isNewYear: false
        };
    }

    // 格式化倒计时文本
    formatCountdownText(format = 'full') {
        const data = this.getCountdownData();

        if (data.isNewYear) {
            return '2026年已到来！';
        }

        switch (format) {
            case 'short':
                return `${data.days}天${data.hours}时${data.minutes}分`;
            case 'compact':
                return `${data.days}d ${data.hours}h ${data.minutes}m`;
            case 'full':
            default:
                return `${data.days}天 ${data.hours}小时 ${data.minutes}分钟 ${data.seconds}秒`;
        }
    }
}

// 初始化倒计时
const countdown = new NewYearCountdown();

// 导出到全局作用域
window.countdown = countdown;

// 添加倒计时的CSS动画
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .counting {
            animation: countPulse 0.3s ease;
            color: var(--warning-color) !important;
            text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
        }
        
        @keyframes countPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .time-value-large {
            font-family: 'ZCOOL QingKe HuangYou', monospace;
            font-size: 4rem;
            font-weight: bold;
            color: var(--warning-color);
            background: rgba(0, 0, 0, 0.3);
            padding: 20px;
            border-radius: 15px;
            min-width: 120px;
            text-align: center;
        }
        
        .time-label-large {
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-top: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .countdown-display-large {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin: 30px 0;
        }
        
        .time-separator-large {
            font-size: 3rem;
            color: var(--primary-color);
            margin-top: -20px;
        }
        
        .time-block-large {
            text-align: center;
        }
        
        .interactive-countdown {
            text-align: center;
        }
        
        .countdown-controls {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin: 30px 0;
        }
        
        .countdown-note {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 15px;
            margin-top: 20px;
            border-left: 4px solid var(--info-color);
        }
        
        .countdown-note i {
            color: var(--info-color);
            margin-right: 10px;
        }
    `;
    document.head.appendChild(style);
});