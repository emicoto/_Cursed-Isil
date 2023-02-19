D.itemGroup = ["weapon", "shield", "clothes", "accesory", "items", "material", "recipies", "books"];

D.equip = {
	weapon: "武器",
	shield: "护盾",

	head: "头饰",
	cover: "外套",
	outfitUp: "上衣",
	outfitBt: "下衣",
	innerUp: "内衣",
	innerBt: "内裤",
	hands: "手套",
	legs: "袜子",

	face: "面具",
	ears: "耳饰",
	chest: "乳饰", //乳环、跳弹
	bottom: "插件", //跳弹、肛塞、震动棒
};

D.virginity = ["kiss", "oral", "penis", "anal", "analsex", "vigina", "viginasex", "handholding", "footjob"];

//战斗技能。 战斗中使用。
D.skill = {
	fire_ball: "火球术",
	light_shower: "光雨",
	magica_shield: "魔力屏障",
	green_grow: "生长术",
	lightning: "闪电",
	fire_sowrd: "火焰剑",
	dark_cage: "黑暗牢笼",
	clear_mind: "清心咒",
	water_bubble: "水球术",
	ice_arrow: "冰箭术",
	clean_body: "净身咒",
	object_control: "念动术",
};

D.liquidtype = ["juice", "cum", "rub", "slime", "nectar"];

//string[]管理，用has检测。方便对应多个状态。
//事件判定用, 临时计时器在tsv. 长期计时器在flag
D.state = [
	"睡眠", //睡觉时，受到一定刺激可能会醒来。
	"疲劳", //体力低于5% 并持续 3小时
	"生病", //健康低于80% 并持续 5天
	"缺魔", //魔力低于10% 并持续 3天
	"失眠", //连续三天不睡觉
	"欲求不满", //欲求(flag值) 大于80%
	"营养不良", //营养低于30% 并持续 2天
	"缺水", //水分低于 10%并持续 2小时
	"晕厥", //体力与理智低于5% 持续五小时，或双双归零后会晕厥过去。受强烈刺激可能醒来。
	"昏睡", //药物效果。药效散之前绝对不会醒来。虽然无知觉但身体依然有反应。

	"发情", //周期 or 药物
	"自闭", //压力到达上限 100%
	"精神崩溃", // 压力达到上限 200%
	"梦魇", // 高压力状态睡觉概率触发
	"毒瘾发作", // 药隐Lv2后, 断药计时器到达阈值
	"性瘾发作", // 性瘾Lv2后, 禁断计时器到达阈值
	"寸止", // 允许快感超过上限, 解除时获得强高潮
	"性兴奋", // 欲情超过上限时

	"失明", //看不到, 长久状态, 影响指令
	"失聪", //听不到
	"失声", //不能说
	"石化", //全身无法动弹
	"口球", //装备效果, 不能说
	"眼罩", //不能看
	"束缚", //动弹不得
	"怀孕",
	"肠内受孕",
	"寄生",
	"中毒", //中毒计时器作用期间,健康持续减少
];

D.Psize = [
	[60, 15], //0，微型
	[90, 22], //1, 迷你
	[120, 32], //2, 短小
	[140, 42], //3, 普通
	[160, 52], //4, 大
	[180, 62], //5, 巨大
	[210, 74], //6, 马屌
	[250, 86], //7, 深渊
];

D.mutant = ["光滑", "吸盘", "口器", "隆起", "针", "软刺", "阴茎"];

D.actAbleParts = ["handR", "handL", "mouth", "penis", "vagina", "anal", "foot"];

D.selectAbleParts = ["breast", "clitoris", "urin", "ears", "neck", "butts", "nipple", "thighs", "abdomen"].concat(
	D.actAbleParts
);

D.scarType = ["kissmark", "scar", "whip", "wound", "pen", "bruise", "tattoo", "band"];
