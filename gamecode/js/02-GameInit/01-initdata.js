D.base = {
    health:'健康',
    stamina:'体力',
    sanity:'理智',
    mana:'魔力',

    hydration:'水分',
    nutrient:'营养',
    dirty:'污迹',

    drug:'药物',
    alcohol:'酒精',
    stress:'压力',
}

D.palam = {
    ecstacy:'快感', //判定射精or普通高潮， 高潮时获得性依存度，快乐刻印

    //受方palam
    arousal:'欲情', //转换为欲情珠，升级欲望lv, 角色进入休息状态时就会进行转换。
    surrend:'屈从', //转换为服从珠，升级顺从。屈从lv累计到一定值时获得刻印。指令执行成功时获得服从度
    fear:'恐惧', //恐惧刻印
    mortify:'羞耻', //羞耻刻印。露出类指令。
    humiliate:'受辱', //耻辱刻印。 羞辱类指令
    pain:'疼痛', //痛苦刻印
    depress:'抑郁', //压力值
    resist:'抵触', //反抗刻印
    favo:'好意', //好感转换
    uncomfort:'不适', //减少mood，根据情况转换为疼痛、抵触、压抑。影响体力与健康的消耗。可能触发生病flag

    //攻方palam
    eager:'渴望', //行为时间拉长，动作变急切。依存up
    angry:'愤怒',//mood down，动作会变粗暴。
    satisfy:'满意',//评价up 好感up
    superior:'优越', // 支配度up

    //部位palam
    esM:'快M',
    esB:'快B', //同时也是喷乳判定条
    esC:'快C',
    esU:'快U',
    esV:'快V',
    esA:'快A',

    paM:'痛M',
    paB:"痛B",
    paC:'痛C',
    paU:'痛U',
    paV:'痛V', 
    paA:"痛A",
}

D.basecolor = {
    health:[255, 92, 79],
    stamina:[223, 236, 15],
    sanity:[12, 163, 238],
    mana:[160, 35, 231],

    hydration:[65, 255, 233],
    nutrient:[134,255,79],

    esstacy:[255,95,202],
    esM:[255,95,202],
    esB:[255,95,202],
    esC:[255,95,202],
    esU:[255,95,202],
    esV:[255,95,202],
    esA:[255,95,202],

    pain:[87, 29, 243],
    paM:[87, 29, 243],
    paB:[87, 29, 243],
    paC:[87, 29, 243],
    paU:[87, 29, 243],
    paV:[87, 29, 243],
    paA:[87, 29, 243],

}

D.mark = {
    hypno:['催眠刻印','Hypnosis Mark'],
    ecstacy:['快乐刻印','Ecstacy Mark'],//the ecstacy ethed on mind
    surrend:['屈服刻印','Surrender Mark'],
    pain:['痛苦刻印','Pain Mark'],
    fear:['恐惧刻印','Fear Mark'],
    humiliate:['耻辱刻印','Humiliated Mark'],
    mortify:['羞耻刻印', 'Mortify Mark'],
    resist:['反抗刻印','Resistance Mark'],
}

D.stats = ["ATK", "DEF", "MTK", "MDF", "STR", "CON", "DEX", "INT", "WIL", "PSY", "ALR", "LUK"]

D.abl = {
    magica:'魔法等级',//影响魔法技能上限
    lumen:'光魔法',
    ark:'暗魔法',
    flare:'火魔法',
    ions:'水魔法',
    vitae:'木魔法',
    terra:'土魔法',
    electron:'电魔法',
    //----- 
    sword:'剑术',
    wrestle:'格斗',
    //-----
    cooking:'料理',     
    plant:'种植',
    medicine:'药物',
    craft:'制作',
    fishing:'钓鱼',
    gathering:'采集',
}

D.sbl = {
    // max 12, sens max 20
    knowledge:'性知识',
    technique:'性技巧',
    endurance:'性耐性',
    submissive:'顺从',
    refuse:'抗拒', //影响指令执行与心理数值、素质的获得
    hypnosis:'催眠',
    desire:'欲望',
    service:'侍奉',
    exhibition:'露出',
    promscuity:'滥交',
    sexaddic:'性瘾',
    drugaddic:'药瘾',
    masochist:'受虐',
    semenaddic:'饮精中毒',
    vagiejac:'内射中毒',
    analejac:'肛射中毒',
    deviancy:'兽奸中毒',
    gangbang:'轮奸中毒',
    tentacles:'触手中毒',
}

D.exp = [
    'M','B','C','U','V','A',
    'M高潮','B高潮','C高潮','U高潮','V高潮','A高潮',
    '高潮','强烈高潮','深度强烈高潮','多重高潮',
    '接吻','射精','喷乳','放尿','饮精',
    '肛交','性交','乳交','口交','内射','肛射',
    '乳头开发', '后穴开发', '尿道开发', '子宫开发',

    '插入', '道具', '受虐', '露出', '被拍摄', 
    '怀孕','产卵', '轮奸', '兽奸', '触手奸',

    '眠奸', '强奸', '迷奸', '性转',
    '同性', '爱情', '侍奉', '自慰',
    '嗑药', '服从', '催眠', '调教', '施虐',
]

D.equip = {
    weapon:'武器',
    shield:'护盾',

    head:'头饰',
    cover:'外套',
    outfitUp:'上衣',
    outfitBt:'下衣',
    innerUp:'内衣',
    innerBt:'内裤',
    hands:'手套',
    legs:'袜子',

    face:'面具',
    ears:'耳饰',
    chest:'乳饰',//乳环、跳弹
    bottom:'插件',//跳弹、肛塞、震动棒
}

D.covergroupA = {
    //覆盖度。 决定肌肤暴露部位。
    shoulder:['shoulder'],
    arms:['arms'],    

    chest:['breast','back'],
    waist:['abdomen','waistback'], 
    topB:['back','waistback'],

    chestF:['breast'],
    belly:['abdomen','private'],

    crotch:['genital','anus'],

    thighs:['thighs'],
    legs:['thighs','feet'],
    butts:['butts']
}

D.covergroupB = {
    fullhead:['face','neck'],
    fullbody:Object.keys(D.covergroupA).concat(['face','neck']),

    torso:['chest','waist','genital','butts'],

    top:['shoulder','chest','waist','arms'],
    bottom:['crotch','butts','thighs'],

    topF:['chestF','belly'],
    hips:['private','butts'],

}

D.coverlistA = Object.keys(D.covergroupA)
D.coverlistB = Object.keys(D.covergroupB)


D.skinlayer = [
    'face','neck',
    'shoulder','arms',
    'breast', 'abdomen', 'back', 'waistback','private',
    'buttL','buttR','thighs',
    'penis', 'vagina', 'anus',]


D.tips = {
    mage:{title:['法师'],content:['对魔法有所了解，能灵活运用各种攻击魔法进行战斗的职业。']},
    scholar:{ title:['学者'], content:['了解魔法理论，对各种魔法术式与魔法物品进行研究，擅长分析的职业。']},
    warrior:{ title:['魔战士'], content:['善于运用魔力强化自身，通过格斗或使用近程武器进行战斗的战士。']},
    ranger:{ title:['魔枪手'], content:['善于运用魔力强化武器，使用远程武器进行战斗的枪手。']},
    medics:{ title:['治疗师'], content:['对药物、人体、生物有所了解，擅长用魔法给人或生物进行治疗的职业。'] },
    paladin:{ title:['圣骑士'], content:['信仰圣灵，擅长圣灵魔法与防御术法，使用盾牌与魔法屏障在前排抵御伤害的职业。']},
    alchemist:{ title:['炼金术师'], content:['对魔法物理与化学有所了解，能合成、改造物品的职业。']},

    curse: { title:['魔咒'], content:['被施加在伊希尔（精灵主角）身上的诅咒。诅咒的本体是？']},
    arus: { title:['艾瑞斯'], content:['作为半魔人的主角。默认性别为男性，男性时外貌是灰皮白色短发帅哥，扶她以及女性时外貌是灰皮白色长发大胸美女。诅咒之主的化身。游戏主控角色，剧情主角，调教时的第一执行者。']},
    isil: { title:['伊希露'], content:['作为光精灵的主角。默认性别为男性，男性是外貌是白肤淡金长发美少年，扶她以及女性时外貌是白肤淡金长发平胸美少女。被诅咒寄生的人。游戏主控角色，剧情主角，主要调教对象。']},
}

D.virginity = ["kiss", "oral", "penis", "anal", "analsex", "vigina", "viginasex", "handholding", "footjob"];

//战斗技能。 战斗中使用。
D.skill = {
    fire_ball:'火球术',
    light_shower:'光雨',
    magica_shield:'魔力屏障',
    green_grow:'生长术',
    lightning:'闪电',
    fire_sowrd:'火焰剑',
    dark_cage:'黑暗牢笼',
    clear_mind:'清心咒',
    water_bubble:'水球术',
    ice_arrow:'冰箭术',
    clean_body:'净身咒',
    object_control:'念动术',
}

D.liquidtype = ['juice','cum','rub','slime','nectar']

//string[]管理，用has检测。方便对应多个状态。
//事件判定用, 临时计时器在tsv. 长期计时器在flag
D.state = [
    '睡眠', //睡觉时，受到一定刺激可能会醒来。
    '疲劳', //体力低于5% 并持续 3小时
    '生病', //健康低于80% 并持续 5天
    '缺魔', //魔力低于10% 并持续 3天
    '失眠', //连续三天不睡觉
    '欲求不满', //欲求(flag值) 大于80%
    '营养不良', //营养低于30% 并持续 2天
    '缺水',  //水分低于 10%并持续 2小时
    '晕厥', //体力与理智低于5% 持续五小时，或双双归零后会晕厥过去。受强烈刺激可能醒来。
    '昏睡', //药物效果。药效散之前绝对不会醒来。虽然无知觉但身体依然有反应。

    '发情', //周期 or 药物
    '自闭', //压力到达上限 100%
    '精神崩溃', // 压力达到上限 200%
    '梦魇', // 高压力状态睡觉概率触发
    '毒瘾发作', // 药隐Lv2后, 断药计时器到达阈值
    '性瘾发作', // 性瘾Lv2后, 禁断计时器到达阈值
    '寸止', // 允许快感超过上限, 解除时获得强高潮
    '性兴奋', // 欲情超过上限时
    
    '失明', //看不到, 长久状态, 影响指令
    '失聪', //听不到
    '失声', //不能说
    '石化', //全身无法动弹
    '口球', //装备效果, 不能说
    '眼罩', //不能看
    '束缚', //动弹不得
    '怀孕', 
    '肠内受孕', 
    '寄生', 
    '中毒', //中毒计时器作用期间,健康持续减少
]

D.tsv = [
    'oksign', //合意。没有就是强奸。
    'sleepDepth', //睡眠深度。低于500时随时可能醒来。
    'sleepCurse', //昏睡剂or昏睡咒效果
]

D.mutant = [
    '光滑', '吸盘', '口器', '隆起', '针', '软刺', '阴茎' 
]

