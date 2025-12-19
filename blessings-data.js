// 2026新年祝福语数据
const blessingsData = {
    // 通用祝福语
    general: [
        {
            id: 1,
            content: "✨ 告别2025，拥抱2026！愿你新的一年心想事成，万事如意！",
            emoji: "✨",
            category: "general"
        },
        {
            id: 2,
            content: "🎉 2026新年快乐！愿你的每一天都充满阳光和欢笑！",
            emoji: "🎉",
            category: "general"
        },
        {
            id: 3,
            content: "🌟 新年新气象，2026年愿你事业腾飞，健康平安！",
            emoji: "🌟",
            category: "general"
        },
        {
            id: 4,
            content: "❤️ 跨年之际，感谢有你陪伴。2026年，愿我们继续同行！",
            emoji: "❤️",
            category: "general"
        },
        {
            id: 5,
            content: "🎊 2026年来临，祝你财源滚滚，幸福满满，好运连连！",
            emoji: "🎊",
            category: "general"
        },
        {
            id: 6,
            content: "🚀 踏上2026的新征程，愿你勇往直前，梦想成真！",
            emoji: "🚀",
            category: "general"
        },
        {
            id: 7,
            content: "🎇 烟花绽放时，许下2026年的心愿，愿所有美好如期而至！",
            emoji: "🎇",
            category: "general"
        },
        {
            id: 8,
            content: "🍀 2026年，愿你拥有绿码般的顺遂，生活安康，心想事成！",
            emoji: "🍀",
            category: "general"
        }
    ],

    // 朋友祝福语
    friend: [
        {
            id: 101,
            content: "👫 亲爱的朋友，2026年愿我们的友谊更加深厚，一起创造更多美好回忆！",
            emoji: "👫",
            category: "friend"
        },
        {
            id: 102,
            content: "🎮 2026年，愿我们继续一起笑、一起闹、一起闯荡江湖！朋友，新年快乐！",
            emoji: "🎮",
            category: "friend"
        },
        {
            id: 103,
            content: "🍻 为我们的友谊干杯！2026年，愿你事事顺心，我们友谊长存！",
            emoji: "🍻",
            category: "friend"
        },
        {
            id: 104,
            content: "🤝 真正的朋友就像星星，2026年愿我们继续互相照亮彼此的人生！",
            emoji: "🤝",
            category: "friend"
        }
    ],

    // 家人祝福语
    family: [
        {
            id: 201,
            content: "🏠 亲爱的家人，2026年愿我们家更加温馨和睦，每个人都健康快乐！",
            emoji: "🏠",
            category: "family"
        },
        {
            id: 202,
            content: "👨‍👩‍👧‍👦 家是永远的港湾，2026年愿我们一家人平安顺遂，幸福美满！",
            emoji: "👨‍👩‍👧‍👦",
            category: "family"
        },
        {
            id: 203,
            content: "🍲 一屋两人，三餐四季，便是人间最美浪漫。2026，家庭幸福！",
            emoji: "🍲",
            category: "family"
        },
        {
            id: 204,
            content: "💕 最温暖的幸福，是和家人在一起的每一天。2026，愿家更温馨！",
            emoji: "💕",
            category: "family"
        }
    ],

    // 恋人祝福语
    lover: [
        {
            id: 301,
            content: "💖 亲爱的，2026年愿我们的爱情更加甜蜜，一起走向更美好的未来！",
            emoji: "💖",
            category: "lover"
        },
        {
            id: 302,
            content: "🌹 新的一年，继续爱你、宠你、陪你。2026，我们还要一起！",
            emoji: "🌹",
            category: "lover"
        },
        {
            id: 303,
            content: "💑 执子之手，与子偕老。2026年，愿我们的爱如初见般美好！",
            emoji: "💑",
            category: "lover"
        },
        {
            id: 304,
            content: "💌 你是我2026年最想见的人，也是我最想陪伴一生的人。新年快乐！",
            emoji: "💌",
            category: "lover"
        }
    ],

    // 工作祝福语
    work: [
        {
            id: 401,
            content: "💼 2026年，愿你事业蒸蒸日上，工作顺心如意，升职加薪！",
            emoji: "💼",
            category: "work"
        },
        {
            id: 402,
            content: "📈 新的一年，新的开始。2026年愿你在职场大展宏图，成就非凡！",
            emoji: "📈",
            category: "work"
        },
        {
            id: 403,
            content: "💻 致奋斗的我们：2026年，愿代码无bug，需求不改，准时下班！",
            emoji: "💻",
            category: "work"
        },
        {
            id: 404,
            content: "🏆 2026年，愿你在工作中收获成长与成就，实现自我价值！",
            emoji: "🏆",
            category: "work"
        }
    ],

    // 健康祝福语
    health: [
        {
            id: 501,
            content: "💪 2026年，愿你身体健健康康，吃嘛嘛香，精神饱满每一天！",
            emoji: "💪",
            category: "health"
        },
        {
            id: 502,
            content: "🍎 健康是最大的财富。2026年，愿你无病无痛，快乐无忧！",
            emoji: "🍎",
            category: "health"
        },
        {
            id: 503,
            content: "🧘‍♀️ 新的一年，记得好好照顾自己。2026，愿你身心健康！",
            emoji: "🧘‍♀️",
            category: "health"
        },
        {
            id: 504,
            content: "🏃‍♂️ 2026年，愿你有健康的体魄，去追逐所有的梦想！",
            emoji: "🏃‍♂️",
            category: "health"
        }
    ],

    // 创意祝福语
    creative: [
        {
            id: 601,
            content: "🎄🎅 圣诞的余温还未散去，新年的钟声已然敲响。2026，双倍快乐！",
            emoji: "🎄🎅",
            category: "creative"
        },
        {
            id: 602,
            content: "💰📈 2026，祝你股票长红，钱包鼓鼓，财富自由！",
            emoji: "💰📈",
            category: "creative"
        },
        {
            id: 603,
            content: "🌏✈️ 新的一年，愿你踏遍山河，看尽世间繁华，2026旅途愉快！",
            emoji: "🌏✈️",
            category: "creative"
        },
        {
            id: 604,
            content: "📚🎓 学子们，2026年金榜题名，学业有成，前程似锦！",
            emoji: "📚🎓",
            category: "creative"
        }
    ],

    // 特色祝福语（用于轮播）
    featured: [
        {
            id: 701,
            content: "2026年，愿你拥有星辰大海的梦想，也拥有柴米油盐的踏实。",
            author: "新年祝福",
            emoji: "🌌"
        },
        {
            id: 702,
            content: "最好的跨年礼物，是和你一起从2025走到2026的每一刻。",
            author: "浪漫寄语",
            emoji: "🎁"
        },
        {
            id: 703,
            content: "2026，愿你既有前程可奔赴，也有岁月可回首。",
            author: "经典祝福",
            emoji: "✨"
        },
        {
            id: 704,
            content: "新年不是时间的更迭，而是我们又一次成长的机会。2026，加油！",
            author: "励志寄语",
            emoji: "🚀"
        },
        {
            id: 705,
            content: "愿2026年的你，比2025年更接近自己想要的生活。",
            author: "美好祝愿",
            emoji: "💫"
        }
    ],

    // 新年决心建议
    resolutions: [
        {
            id: 801,
            content: "学习一项新技能或语言",
            category: "self-improvement"
        },
        {
            id: 802,
            content: "坚持每周锻炼3-4次",
            category: "health"
        },
        {
            id: 803,
            content: "每月读2本书",
            category: "learning"
        },
        {
            id: 804,
            content: "每天早睡早起",
            category: "routine"
        },
        {
            id: 805,
            content: "存钱实现一个小目标",
            category: "finance"
        },
        {
            id: 806,
            content: "去3个新地方旅行",
            category: "travel"
        },
        {
            id: 807,
            content: "减少屏幕使用时间",
            category: "digital-wellness"
        },
        {
            id: 808,
            content: "学会做5道新菜",
            category: "cooking"
        },
        {
            id: 809,
            content: "每天写感恩日记",
            category: "mindfulness"
        },
        {
            id: 810,
            content: "每月做一次志愿者",
            category: "community"
        }
    ],

    // 愿望选项
    wishes: [
        { id: 1, name: "健康平安", emoji: "💪", value: "health" },
        { id: 2, name: "财源广进", emoji: "💰", value: "wealth" },
        { id: 3, name: "事业有成", emoji: "💼", value: "career" },
        { id: 4, name: "爱情甜蜜", emoji: "❤️", value: "love" },
        { id: 5, name: "学业进步", emoji: "📚", value: "study" },
        { id: 6, name: "家庭幸福", emoji: "🏠", value: "family" },
        { id: 7, name: "旅行愉快", emoji: "✈️", value: "travel" },
        { id: 8, name: "梦想成真", emoji: "✨", value: "dreams" }
    ],

    // 获取随机祝福语
    getRandomBlessing: function(category = null) {
        if (category && this[category]) {
            const blessings = this[category];
            return blessings[Math.floor(Math.random() * blessings.length)];
        }

        // 如果没有指定类别或类别不存在，从所有祝福语中随机选择
        const allCategories = ['general', 'friend', 'family', 'lover', 'work', 'health', 'creative'];
        const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
        const randomBlessings = this[randomCategory];
        return randomBlessings[Math.floor(Math.random() * randomBlessings.length)];
    },

    // 获取多个随机祝福语
    getRandomBlessings: function(count = 5, category = null) {
        const result = [];
        const usedIds = new Set();

        while (result.length < count && result.length < this.getTotalCount()) {
            const blessing = this.getRandomBlessing(category);
            if (!usedIds.has(blessing.id)) {
                result.push(blessing);
                usedIds.add(blessing.id);
            }
        }

        return result;
    },

    // 获取祝福语总数
    getTotalCount: function() {
        return Object.values(this).reduce((total, category) => {
            return Array.isArray(category) ? total + category.length : total;
        }, 0);
    },

    // 根据愿望生成个性化祝福语
    generateCustomBlessing: function(name = "朋友", wishes = []) {
        const wishNames = wishes.map(wish => {
            const wishObj = this.wishes.find(w => w.value === wish);
            return wishObj ? wishObj.name : wish;
        });

        let blessingText = "";
        const emojis = ["✨", "🎉", "🌟", "💫", "🎊"];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        if (wishNames.length === 0) {
            blessingText = `${name}，祝你2026年新年快乐，万事如意！`;
        } else if (wishNames.length === 1) {
            blessingText = `${name}，祝你2026年${wishNames[0]}！`;
        } else {
            const lastWish = wishNames.pop();
            blessingText = `${name}，祝你2026年${wishNames.join('、')}和${lastWish}！`;
        }

        return {
            id: Date.now(),
            content: `${randomEmoji} ${blessingText}`,
            emoji: randomEmoji,
            category: "custom",
            name: name,
            wishes: wishNames
        };
    }
};

// 导出到全局作用域
window.blessingsData = blessingsData;