D.traits = [
    //体质类
    {
        name: '纤弱',
        des: '风一吹就倒体的样子。',
        order: 1,
        sourceEffect: [
			['stamina',1.2,'lose']
        ]
    },
    {
        name: '强壮',
        des: '身强力壮肌肉发达。',
        order: 0,
        sourceEffect: [
			['stamina',0.8,'lose']
        ]
    },
    {
        name: '耐疼',
        des: '皮糙肉厚，些许磕碰也不觉得疼。',
        order: 0,
        sourceEffect: [
			['paAll',0.8]
        ]
    },
    {
        name: '不耐疼',
        des: '细皮嫩肉，些许磕碰也会很痛。',
        order: 0,
        sourceEffect: [
			['paAll',1.2]
        ]
    },
    {
        name: 'M体质', //无自觉M倾向, 疼痛的 0.1 转换为快感
        des: '明明很痛，但莫名的有点酸爽。',
        order: 0
    },
    {
        name: 'M倾向', //有自觉M倾向,疼痛的 0.15 转换为快感
        des: '战斗时倾向往前排跑承受伤害。',
        order: 10
    },

    //名器系列, 增加攻方的快乐度
    {
        name: 'A名器',  
        des: '这个菊穴用起来会很爽。',
        order: 0
    },
    {
        name: 'V名器',
        des: '这个秘穴用起来会很爽。',
        order: 0
    },
    {
        name: 'M名器',
        des: '这个嘴用起来会很爽。',
        order: 0
    },
    {
        name: '易伤体质', // 获得吻痕, 鞭痕等获得概率增加, 消退时间翻倍
        des: '身上很容易留下痕迹，还不容易消退。',
        order: 0
    },

    //情绪表达类
    {
        name: '冷静', 
        des: '无论什么情况都能维持冷静。',
        order: 0,
        sourceEffect: [
			['fear',0.8],['angry',0.8],['depress',0.8]
        ]
    },
    {
        name: '理智', //理智上限up, 各负面精神数值恢复量up
        des: '无论什么时候都能做出理智的判断。从负面状态中更容易恢复。',
        order: 5
    },
    {
        name: '不过线', //陷落需求数值翻倍
        des: '对什么是都分得很清楚，不会轻易过线。',
        order: -10
    },
    {
        name: '淡漠',
        des: '没有世俗的欲望。',
        order: 0,
        sourceEffect: [
			['arousal',0.8],['eager',0.8],['satisfy',1.2]
        ]
    },
    {
        name: '强欲',
        des: '小孩才做选择，我全都要！',
        order: 0,
        sourceEffect: [
			['arousal',1.2],['eager',1.2],['satisfy',0.8]
        ]
    },
    {
        name: '胆大',
        des: '无法被恐惧打倒。',
        order: 5,
        sourceEffect: [
			['fear',0.8]
        ]
    },
    {
        name: '胆小',
        des: '容易受到惊吓。',
        order: -5,
        sourceEffect: [
			['fear',0.8]
        ]
    },
    {
        name: '乐观',
        des: '每天都是晴天。',
        order: 2,
        sourceEffect: [
			['depress',0.8],['resist',0.8]
        ]
    },
    {
        name: '悲观',
        des: '每天都是阴天。',
        order: -2,
        sourceEffect: [
			['depress',1.2],['resist',1.2]
        ]
    },
    {
        name: '傲娇', //陷落前好感类down, 陷落后反转
        des: '才不是为了你呢！',
        order: 0
    },
    {
        name: '乖顺', //特定指令更容易执行
        des: '哦，好的。',
        order: 5,
        sourceEffect: [
			['surrend',1.4],['resist',0.6]
        ]
    },
    {
        name: '叛逆', //特定指令屈服up, 且更容易执行(非要反着来?)
        des: '滚！',
        order: -10,
        sourceEffect: [
			['surrend',0.6],['resist',1.5]
        ]
    },

    //对性的态度。只能存在一个
    {
        name: '性保守', //清醒时快感全面down
        des: '繁衍是神圣的，不该以享乐而为之。',
        order: 0
    },
    {
        name: '性开放', //清醒时快感全面up
        des: '性就是娱乐行为，怎么开心怎么来。',
        order: 0
    },
    {
        name: '禁欲',
        des: '神啊，请原谅我的罪恶！',
        order: -2,
        sourceEffect: [
			['arousal',0.2],['esAll',1.2]
        ]
    },
    {
        name: '放纵',
        des: '性自由今天就要实现！',
        order: 2,
        sourceEffect: [
			['arousal',1.8],['esAll',0.5]
        ]
    },
    {
        name: '洁癖',
        des: '脏死了，别碰我！',
        order: 0,
        sourceEffect: [
			['arousal',0.2],['resist',2],['esAll',0.9]
        ]
    },
    {
        name: '性瘾', // 免疫性行为的负面心理影响, 高潮条翻倍, 性欲获得翻倍, 欲求不满时高概率暴走
        des: '快，正面上我！！',
        order: 10,
		sourceEffect: [
            ['arousal',2.5]
        ]
    },

    // 行为模式
    {
        name: '变态', //解锁特定行动
        des: '喜好变态的性行为。',
        order: 0
    },
    {
        name: '鬼畜', //解锁特定行动
        des: '喜好鬼畜的性行为。',
        order: 0
    },
    {
        name: '高傲', //特定指令需求更多配合值
        des: '像我这么高贵的血统，只有别人配合我，凭啥让我配合别人？',
        order: -5
    },
    {
        name: '高调', //特定指令需求更少配合值
        des: '还有谁不知道我？',
        order: 2
    },
    {
        name: '低调',//特定指令需求更多或更少配合值
        des: '应该没人知道我吧……？',
        order: 0
    },
    {
        name: '高自尊',
        des: '我是有尊严的人，钱也不能收买我。',
        order: -10
    },
    {
        name: '无节操',
        des: '尊严又不能吃，只要给我钱，什么都能满足你。',
        order: 10
    },
    {
        name: '厚脸皮', // 交涉效果up
        des: '只要我不尴尬，尴尬的就是别人',
        order: 2,
        sourceEffect: [
			['mortify',0.8],['favo',1.1]
        ]
    },
    {
        name: '冲动',
        des: '别拦我，我就要去！',
        order: 5,
        sourceEffect: [
			['sanity',1.2,'lose']
        ]
    },
    {
        name: '忍耐',
        des: '忍忍，就过去了。',
        order: 0,
        sourceEffect: [
			['paAll',0.9],['fear',0.9],['arousal',0.9],['esAll',0.9]
        ]
    },
    {
        name: '坚韧',
        des: '没有什么可以打倒我的。',
        order: 0,
        sourceEffect: [
			['sanity',0.8,'lose'],['paAll',0.9],['fear',0.9],['arousal',0.9],['esAll',0.9]
        ]
    },
    {
        name: '不服输',
        des: '再来一局！',
        order: 5,
        sourceEffect: [
			['surrend',0.8]
        ]
    },
    {
        name: '忠诚', //合意时屈从++,好意++, 非合意时反转
        des: '绝对不会主动背叛你。',
        order: 0
    },
    {
        name: '贞洁', //欲情down, 非合意时抵触大幅up, 好意大幅down, 非正常play需求值++
        des: '性行为只能跟结婚对象做，而且必须得婚后。',
        order: 0,
        sourceEffect: [
			['arousal',0.9]
        ]
    },
    {
        name: '放荡', //欲情up，好意很容易提升，非正常play需求值--
        des: '想做就做，没人可以约束我。',
        order: 5,
        sourceEffect: [
			['arousal',1.5],['favo',1.5]
        ]
    },

    //陷落系
    {
        name: '恋慕',
        des: '喜欢但说不出口。',
        order: 10
    },
    {
        name: '依恋',
        des: '你不在身边会感到寂寞。',
        order: 20
    },
    {
        name: '深爱',
        des: '深爱着你。',
        order: 50
    },
    {
        name: '三人行',
        des: '同时与你们两人一起交往。',
        order: 30
    },
    {
        name: '服从',
        des: '是你忠实的下属。',
        order: 10
    },
    {
        name: '隶属',
        des: '是你忠诚的奴仆。',
        order: 20
    },
    {
        name: '烙印',
        des: '放弃自我，完全属于你。',
        order: 50
    },
    {
        name: '淫娃',
        des: '在你面前变得淫乱。',
        order: 10
    },
    {
        name: '淫奴',
        des: '你的淫乱奴隶。',
        order: 20
    },
    {
        name: '淫魔',
        des: '独属于你的淫魔。',
        order: 50
    },
    
    {
        name: '淫乱',
        des: '很轻易的就能张开双腿。',
        order: 10
    },
    {
        name: '淫荡',
        des: '不禁淫乱还放荡',
        order: 20
    },
    {
        name: '淫娼',
        des: '以性为生以精液为食物，淫魔的性奴',
        order: 50
    },
]