// 主要交互逻辑
class NewYear2026App {
    constructor() {
        this.generatedBlessings = [];
        this.currentCarouselIndex = 0;
        this.isFireworksActive = false;
        this.init();
    }

    // 初始化应用
    init() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.updateDateTime();
        this.loadCarousel();
        this.updateMiniCountdown();
        this.setupServiceWorker();
        this.setupOfflineDetection();
    }

    // 隐藏加载屏幕
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
    }

    // 设置事件监听器
    setupEventListeners() {
        // 输入框回车键支持
        document.getElementById('blessing-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateBlessing();
            }
        });

        // 愿望选择器点击事件
        document.querySelectorAll('.wish-option input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateWishSelection();
            });
        });

        // 窗口调整大小时重新布局
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateDateTime();
            }
        });
    }

    // 更新日期时间
    updateDateTime() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };

        const dateString = now.toLocaleDateString('zh-CN', options);
        document.getElementById('current-date').textContent = dateString;
    }

    // 更新迷你倒计时
    updateMiniCountdown() {
        const update = () => {
            const now = new Date();
            const newYear2026 = new Date('2026-01-01T00:00:00');
            const diff = newYear2026 - now;

            if (diff <= 0) {
                document.getElementById('mini-days').textContent = '000';
                document.getElementById('mini-hours').textContent = '00';
                document.getElementById('mini-minutes').textContent = '00';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            document.getElementById('mini-days').textContent = days.toString().padStart(3, '0');
            document.getElementById('mini-hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('mini-minutes').textContent = minutes.toString().padStart(2, '0');
        };

        update();
        setInterval(update, 60000); // 每分钟更新一次
    }

    // 加载轮播祝福语
    loadCarousel() {
        const carouselContainer = document.getElementById('blessings-carousel');
        if (!carouselContainer) return;

        const featuredBlessings = blessingsData.featured;

        featuredBlessings.forEach((blessing, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            carouselItem.innerHTML = `
                <div class="carousel-item-content">
                    <i class="fas fa-quote-left"></i>
                    <p>${blessing.content}</p >
                    <div class="carousel-author">
                        <span>—— ${blessing.author}</span>
                        <span class="carousel-emoji">${blessing.emoji}</span>
                    </div>
                </div>
            `;
            carouselContainer.appendChild(carouselItem);
        });
    }

    // 轮播控制
    nextBlessing() {
        const items = document.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        items[this.currentCarouselIndex].classList.remove('active');
        this.currentCarouselIndex = (this.currentCarouselIndex + 1) % items.length;
        items[this.currentCarouselIndex].classList.add('active');
    }

    prevBlessing() {
        const items = document.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        items[this.currentCarouselIndex].classList.remove('active');
        this.currentCarouselIndex = (this.currentCarouselIndex - 1 + items.length) % items.length;
        items[this.currentCarouselIndex].classList.add('active');
    }

    // 自动轮播
    startAutoCarousel() {
        setInterval(() => {
            this.nextBlessing();
        }, 5000);
    }

    // 生成祝福语
    generateBlessing() {
        const name = document.getElementById('blessing-name').value.trim() || '朋友';
        const type = document.getElementById('blessing-type').value;

        const blessing = blessingsData.getRandomBlessing(type);
        if (!blessing) return;

        // 替换名字占位符
        let content = blessing.content;
        if (name !== '朋友') {
            content = content.replace('朋友', name);
        }

        this.addBlessingToOutput({
            id: Date.now(),
            content: content,
            emoji: blessing.emoji,
            category: blessing.category,
            name: name,
            type: type
        });

        // 显示成功消息
        this.showNotification('祝福语生成成功！', 'success');
    }

    // 生成自定义祝福语
    generateCustomBlessing() {
        const name = document.getElementById('blessing-name').value.trim() || '朋友';
        const selectedWishes = Array.from(document.querySelectorAll('.wish-option input:checked'))
            .map(checkbox => checkbox.value);

        if (selectedWishes.length === 0) {
            this.showNotification('请至少选择一个愿望！', 'warning');
            return;
        }

        const blessing = blessingsData.generateCustomBlessing(name, selectedWishes);
        this.addBlessingToOutput(blessing);

        // 显示成功消息
        this.showNotification('专属祝福生成成功！', 'success');
    }

    // 添加祝福语到输出区域
    addBlessingToOutput(blessing) {
        const outputContainer = document.getElementById('generated-blessings');

        // 移除空状态
        const emptyState = outputContainer.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        // 创建祝福语卡片
        const blessingCard = document.createElement('div');
        blessingCard.className = 'blessing-card';
        blessingCard.innerHTML = `
            <div class="blessing-card-header">
                <h3 class="blessing-card-title">
                    <span class="blessing-emoji">${blessing.emoji}</span>
                    ${blessing.name}的新年祝福
                </h3>
                <div class="blessing-card-actions">
                    <button class="btn-icon" onclick="app.copyBlessing(${blessing.id})" title="复制">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn-icon" onclick="app.shareBlessing(${blessing.id})" title="分享">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="btn-icon" onclick="app.deleteBlessing(${blessing.id})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="blessing-card-content">
                ${blessing.content}
            </div>
            <div class="blessing-card-footer">
                <span>${this.formatCategory(blessing.category)} • ${new Date().toLocaleTimeString('zh-CN')}</span>
                <span class="blessing-id">#${blessing.id.toString().slice(-6)}</span>
            </div>
        `;

        // 添加到列表顶部
        outputContainer.insertBefore(blessingCard, outputContainer.firstChild);

        // 保存到数组
        this.generatedBlessings.unshift(blessing);

        // 滚动到顶部
        outputContainer.scrollTop = 0;

        // 保存到本地存储
        this.saveToLocalStorage();
    }

    // 格式化分类名称
    formatCategory(category) {
        const categories = {
            'general': '通用祝福',
            'friend': '朋友祝福',
            'family': '家人祝福',
            'lover': '恋人祝福',
            'work': '工作祝福',
            'health': '健康祝福',
            'creative': '创意祝福',
            'custom': '专属祝福'
        };

        return categories[category] || '祝福';
    }

    // 复制祝福语
    copyBlessing(id) {
        const blessing = this.generatedBlessings.find(b => b.id === id);
        if (!blessing) return;

        const textToCopy = `${blessing.content}\n\n—— 来自2026新年祝福生成器`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            this.showNotification('祝福语已复制到剪贴板！', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            this.showNotification('复制失败，请手动复制', 'error');
        });
    }

    // 分享祝福语
    shareBlessing(id) {
        const blessing = this.generatedBlessings.find(b => b.id === id);
        if (!blessing) return;

        if (navigator.share) {
            navigator.share({
                title: `${blessing.name}的2026新年祝福`,
                text: blessing.content,
                url: window.location.href
            }).then(() => {
                this.showNotification('分享成功！', 'success');
            }).catch(err => {
                console.error('分享失败:', err);
                this.showManualShare(blessing);
            });
        } else {
            this.showManualShare(blessing);
        }
    }

    // 手动分享
    showManualShare(blessing) {
        const modalContent = `
            <div class="modal-header">
                <h2><i class="fas fa-share-alt"></i> 分享祝福语</h2>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="share-content">
                    <p>${blessing.content}</p >
                    <div class="share-options">
                        <button class="btn btn-secondary" onclick="app.copyPageLink()">
                            <i class="fas fa-link"></i> 复制链接
                        </button>
                        <button class="btn btn-secondary" onclick="app.generateBlessingImage(${blessing.id})">
                            <i class="fas fa-image"></i> 生成图片
                        </button>
                    </div>
                    <p class="share-note">您也可以截图保存后分享给朋友</p >
                </div>
            </div>
        `;

        this.showModal(modalContent);
    }

    // 删除祝福语
    deleteBlessing(id) {
        if (!confirm('确定要删除这条祝福语吗？')) return;

        this.generatedBlessings = this.generatedBlessings.filter(b => b.id !== id);
        const card = document.querySelector(`.blessing-card .blessing-id:contains("#${id.toString().slice(-6)}")`)?.closest('.blessing-card');
        if (card) {
            card.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => card.remove(), 300);
        }

        this.saveToLocalStorage();
        this.showNotification('祝福语已删除', 'info');
    }

    // 复制所有祝福语
    copyAllBlessings() {
        if (this.generatedBlessings.length === 0) {
            this.showNotification('还没有生成祝福语哦！', 'warning');
            return;
        }

        let textToCopy = "=== 2026新年祝福语 ===\n\n";
        this.generatedBlessings.forEach((blessing, index) => {
            textToCopy += `${index + 1}. ${blessing.content}\n\n`;
        });
        textToCopy += "—— 来自2026新年祝福生成器\n";
        textToCopy += window.location.href;

        navigator.clipboard.writeText(textToCopy).then(() => {
            this.showNotification('所有祝福语已复制！', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            this.showNotification('复制失败，请手动复制', 'error');
        });
    }

    // 清空祝福语
    clearBlessings() {
        if (this.generatedBlessings.length === 0) {
            this.showNotification('已经清空了哦！', 'info');
            return;
        }

        if (!confirm(`确定要清空${this.generatedBlessings.length}条祝福语吗？`)) return;

        this.generatedBlessings = [];
        const outputContainer = document.getElementById('generated-blessings');
        outputContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sparkles"></i>
                <p>生成的祝福语将在这里显示</p >
                <small>点击上方按钮生成祝福语</small>
            </div>
        `;

        localStorage.removeItem('newYear2026Blessings');
        this.showNotification('已清空所有祝福语', 'info');
    }

    // 分享祝福语到微信
    shareToWeChat() {
        this.showNotification('请使用微信扫描二维码分享给朋友', 'info');
        // 这里可以集成微信分享SDK
    }

    // 分享祝福语到微博
    shareToWeibo() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('2026新年祝福生成器 - 送上你的新年祝福！');
        window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank');
    }

    // 分享祝福语到QQ
    shareToQQ() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('2026新年祝福生成器');
        window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}`, '_blank');
    }

    // 复制页面链接
    copyPageLink() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            this.showNotification('链接已复制到剪贴板！', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            this.showNotification('复制失败，请手动复制', 'error');
        });
    }

    // 生成祝福语图片
    generateBlessingImage(blessingId = null) {
        this.showNotification('图片生成功能正在开发中...', 'info');
        // 这里可以集成html2canvas等库来生成图片
    }

    // 显示新年决心
    showResolutions() {
        const resolutions = blessingsData.resolutions;
        let resolutionsHTML = '<div class="resolutions-grid">';

        resolutions.forEach(resolution => {
            resolutionsHTML += `
                <div class="resolution-card">
                    <div class="resolution-checkbox">
                        <input type="checkbox" id="resolution-${resolution.id}">
                        <label for="resolution-${resolution.id}"></label>
                    </div>
                    <div class="resolution-content">
                        <h4>${resolution.content}</h4>
                        <span class="resolution-category">${resolution.category}</span>
                    </div>
                </div>
            `;
        });

        resolutionsHTML += '</div>';

        const modalContent = `
            <div class="modal-header">
                <h2><i class="fas fa-bullseye"></i> 2026新年决心</h2>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p class="modal-intro">选择你2026年想要实现的目标和计划：</p >
                ${resolutionsHTML}
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="app.saveResolutions()">
                        <i class="fas fa-save"></i> 保存我的决心
                    </button>
                    <button class="btn btn-secondary" onclick="app.closeModal()">
                        取消
                    </button>
                </div>
            </div>
        `;

        this.showModal(modalContent);
    }

    // 保存新年决心
    saveResolutions() {
        const selectedResolutions = Array.from(document.querySelectorAll('.resolution-card input:checked'))
            .map(checkbox => {
                const id = checkbox.id.replace('resolution-', '');
                return blessingsData.resolutions.find(r => r.id == id);
            })
            .filter(Boolean);

        if (selectedResolutions.length === 0) {
            this.showNotification('请至少选择一个新年决心！', 'warning');
            return;
        }

        localStorage.setItem('newYear2026Resolutions', JSON.stringify(selectedResolutions));
        this.closeModal();
        this.showNotification(`已保存${selectedResolutions.length}个新年决心！`, 'success');
    }

    // 显示祝福语库
    showBlessingsLibrary() {
        const modalContent = `
            <div class="modal-header">
                <h2><i class="fas fa-book-open"></i> 2026祝福语库</h2>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="blessings-library">
                    ${this.generateBlessingsLibraryHTML()}
                </div>
            </div>
        `;

        this.showModal(modalContent);
    }

    // 生成祝福语库HTML
    generateBlessingsLibraryHTML() {
        let html = '<div class="library-categories">';

        const categories = [
            { key: 'general', name: '通用祝福', icon: 'fas fa-star' },
            { key: 'friend', name: '朋友祝福', icon: 'fas fa-user-friends' },
            { key: 'family', name: '家人祝福', icon: 'fas fa-home' },
            { key: 'lover', name: '恋人祝福', icon: 'fas fa-heart' },
            { key: 'work', name: '工作祝福', icon: 'fas fa-briefcase' },
            { key: 'health', name: '健康祝福', icon: 'fas fa-heartbeat' },
            { key: 'creative', name: '创意祝福', icon: 'fas fa-lightbulb' }
        ];

        categories.forEach(category => {
            const blessings = blessingsData[category.key];
            if (!blessings) return;

            html += `
                <div class="library-category">
                    <h3><i class="${category.icon}"></i> ${category.name}</h3>
                    <div class="category-blessings">
                        ${blessings.map(blessing => `
                            <div class="library-blessing" onclick="app.useLibraryBlessing('${blessing.id}')">
                                <span class="blessing-emoji">${blessing.emoji}</span>
                                <p>${blessing.content}</p >
                                <button class="btn-icon">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    // 使用祝福语库中的祝福语
    useLibraryBlessing(id) {
        // 在所有祝福语中查找
        for (const category in blessingsData) {
            if (Array.isArray(blessingsData[category])) {
                const blessing = blessingsData[category].find(b => b.id == id);
                if (blessing) {
                    this.addBlessingToOutput({
                        ...blessing,
                        id: Date.now() // 生成新ID
                    });
                    this.showNotification('已添加祝福语到列表', 'success');
                    break;
                }
            }
        }
    }

    // 开始交互式倒计时
    startInteractiveCountdown() {
        const modalContent = `
            <div class="modal-header">
                <h2><i class="fas fa-rocket"></i> 2026年倒计时</h2>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="interactive-countdown">
                    <div class="countdown-display-large">
                        <div class="time-block-large">
                            <div class="time-value-large" id="modal-days">10</div>
                            <div class="time-label-large">天</div>
                        </div>
                        <div class="time-separator-large">:</div>
                        <div class="time-block-large">
                            <div class="time-value-large" id="modal-hours">00</div>
                            <div class="time-label-large">时</div>
                        </div>
                        <div class="time-separator-large">:</div>
                        <div class="time-block-large">
                            <div class="time-value-large" id="modal-minutes">00</div>
                            <div class="time-label-large">分</div>
                        </div>
                        <div class="time-separator-large">:</div>
                        <div class="time-block-large">
                            <div class="time-value-large" id="modal-seconds">00</div>
                            <div class="time-label-large">秒</div>
                        </div>
                    </div>
                    <div class="countdown-controls">
                        <button class="btn btn-primary" onclick="app.startCountdownAnimation()">
                            <i class="fas fa-play"></i> 开始10秒倒计时
                        </button>
                        <button class="btn btn-secondary" onclick="app.playCelebrationSound()">
                            <i class="fas fa-volume-up"></i> 播放庆祝音效
                        </button>
                    </div>
                    <div class="countdown-note">
                        <p><i class="fas fa-info-circle"></i> 倒计时结束后将自动播放烟花表演</p >
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalContent);
        this.updateModalCountdown();
    }

    // 开始倒计时动画
    startCountdownAnimation() {
        let count = 10;
        const countdownElement = document.getElementById('modal-seconds');
        const countdownSound = document.getElementById('countdown-sound');

        const countdownInterval = setInterval(() => {
            count--;
            if (countdownElement) {
                countdownElement.textContent = count.toString().padStart(2, '0');
            }

            // 播放倒计声音效
            if (countdownSound && count <= 3 && count > 0) {
                countdownSound.currentTime = 0;
                countdownSound.play().catch(e => console.log('音频播放失败:', e));
            }

            if (count === 0) {
                clearInterval(countdownInterval);
                this.playCelebration();
                setTimeout(() => {
                    this.closeModal();
                    window.startFireworksShow();
                }, 2000);
            }
        }, 1000);
    }

    // 播放庆祝效果
    playCelebration() {
        const celebrationSound = document.getElementById('celebration-sound');
        if (celebrationSound) {
            celebrationSound.play().catch(e => console.log('庆祝音效播放失败:', e));
        }

        this.showNotification('🎉 新年快乐！欢迎来到2026年！', 'success');
    }

    // 播放庆祝音效
    playCelebrationSound() {
        const celebrationSound = document.getElementById('celebration-sound');
        if (celebrationSound) {
            celebrationSound.currentTime = 0;
            celebrationSound.play().catch(e => console.log('庆祝音效播放失败:', e));
        }
    }

    // 开始烟花秀
    startFireworksShow() {
        if (typeof window.startFireworks === 'function') {
            window.startFireworks();
            this.showNotification('🎆 烟花表演开始！', 'info');
        } else {
            this.showNotification('烟花功能加载失败', 'error');
        }
    }

    // 切换烟花
    toggleFireworks() {
        if (typeof window.toggleFireworks === 'function') {
            window.toggleFireworks();
            const icon = document.getElementById('fireworks-toggle-icon');
            if (icon) {
                icon.classList.toggle('fa-play');
                icon.classList.toggle('fa-pause');
            }
        }
    }

    // 更改烟花样式
    changeFireworksStyle() {
        if (typeof window.changeFireworksStyle === 'function') {
            window.changeFireworksStyle();
            this.showNotification('已更换烟花样式', 'info');
        }
    }

    // 密集烟花
    intensiveFireworks() {
        if (typeof window.intensiveFireworks === 'function') {
            window.intensiveFireworks();
            this.showNotification('🎇 密集烟花发射！', 'info');
        }
    }

    // 显示模态框
    showModal(content) {
        let modalContainer = document.getElementById('modal-container');
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'modal-container';
            document.body.appendChild(modalContainer);
        }

        modalContainer.innerHTML = `
            <div class="modal active">
                <div class="modal-content">
                    ${content}
                </div>
            </div>
        `;

        document.body.style.overflow = 'hidden';
    }

    // 关闭模态框
    closeModal() {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = '';
        }
        document.body.style.overflow = '';
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        // 添加到页面
        document.body.appendChild(notification);

        // 添加样式
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 15px 20px;
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 9999;
                    animation: slideInRight 0.3s ease;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .notification-success {
                    border-left: 4px solid var(--success-color);
                }
                
                .notification-error {
                    border-left: 4px solid var(--danger-color);
                }
                
                .notification-warning {
                    border-left: 4px solid var(--warning-color);
                }
                
                .notification-info {
                    border-left: 4px solid var(--info-color);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .notification-content i {
                    font-size: 1.2rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0 5px;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // 自动移除
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // 获取通知图标
    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // 更新愿望选择
    updateWishSelection() {
        const selectedCount = document.querySelectorAll('.wish-option input:checked').length;
        const button = document.querySelector('.feature-card .btn-secondary');

        if (button) {
            if (selectedCount === 0) {
                button.innerHTML = '<i class="fas fa-star"></i> 生成专属祝福';
            } else {
                button.innerHTML = `<i class="fas fa-star"></i> 生成专属祝福 (${selectedCount})`;
            }
        }
    }

    // 滚动到功能
    scrollToFeature(featureId) {
        const element = document.getElementById(featureId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 处理窗口调整大小
    handleResize() {
        // 可以在这里添加响应式调整逻辑
    }

    // 设置Service Worker
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('service-worker.js')
                    .then(registration => {
                        console.log('ServiceWorker 注册成功:', registration.scope);
                    })
                    .catch(error => {
                        console.log('ServiceWorker 注册失败:', error);
                    });
            });
        }
    }

    // 设置离线检测
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showNotification('网络连接已恢复', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('网络连接已断开，部分功能可能不可用', 'warning');
        });
    }

    // 保存到本地存储
    saveToLocalStorage() {
        try {
            localStorage.setItem('newYear2026Blessings', JSON.stringify(this.generatedBlessings));
        } catch (error) {
            console.error('保存到本地存储失败:', error);
        }
    }

    // 从本地存储加载
    loadFromLocalStorage() {
        try {
            const savedBlessings = localStorage.getItem('newYear2026Blessings');
            if (savedBlessings) {
                this.generatedBlessings = JSON.parse(savedBlessings);
                this.renderSavedBlessings();
            }
        } catch (error) {
            console.error('从本地存储加载失败:', error);
        }
    }

    // 渲染保存的祝福语
    renderSavedBlessings() {
        if (this.generatedBlessings.length === 0) return;

        const outputContainer = document.getElementById('generated-blessings');
        const emptyState = outputContainer.querySelector('.empty-state');

        if (emptyState) {
            emptyState.remove();
        }

        // 清空容器
        outputContainer.innerHTML = '';

        // 添加所有保存的祝福语
        this.generatedBlessings.forEach(blessing => {
            this.addBlessingToOutput(blessing);
        });
    }

    // 更新模态框倒计时
    updateModalCountdown() {
        const now = new Date();
        const newYear2026 = new Date('2026-01-01T00:00:00');
        const diff = newYear2026 - now;

        if (diff <= 0) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysElement = document.getElementById('modal-days');
        const hoursElement = document.getElementById('modal-hours');
        const minutesElement = document.getElementById('modal-minutes');
        const secondsElement = document.getElementById('modal-seconds');

        if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new NewYear2026App();
    app.loadFromLocalStorage();
    app.startAutoCarousel();
});

// 导出到全局作用域
window.app = app;

// 为按钮添加全局函数
window.generateBlessing = () => app.generateBlessing();
window.generateCustomBlessing = () => app.generateCustomBlessing();
window.showResolutions = () => app.showResolutions();
window.showBlessingsLibrary = () => app.showBlessingsLibrary();
window.startInteractiveCountdown = () => app.startInteractiveCountdown();
window.startFireworksShow = () => app.startFireworksShow();
window.toggleFireworks = () => app.toggleFireworks();
window.changeFireworksStyle = () => app.changeFireworksStyle();
window.intensiveFireworks = () => app.intensiveFireworks();
window.copyAllBlessings = () => app.copyAllBlessings();
window.clearBlessings = () => app.clearBlessings();
window.shareBlessings = () => app.shareBlessings();
window.shareToWeChat = () => app.shareToWeChat();
window.shareToWeibo = () => app.shareToWeibo();
window.shareToQQ = () => app.shareToQQ();
window.copyPageLink = () => app.copyPageLink();
window.generateBlessingImage = () => app.generateBlessingImage();
window.prevBlessing = () => app.prevBlessing();
window.nextBlessing = () => app.nextBlessing();
window.scrollToFeature = (id) => app.scrollToFeature(id);
window.showAbout = () => app.showNotification('关于我们：这是一个为2026年新年创建的祝福语生成器网站', 'info');
window.showPrivacy = () => app.showNotification('隐私政策：我们不会收集您的任何个人信息', 'info');
window.showContact = () => app.showNotification('联系我们：newyear2026@example.com', 'info');
window.shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};