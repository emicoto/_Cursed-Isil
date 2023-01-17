//角色别暂存变量。退出调教模式or每日结算时会初始化
D.tsv = [
	//事件
	"sleepDepth", //睡眠深度。低于500时随时可能醒来。
	"sleepCurse", //昏睡剂or昏睡咒效果
	"metTodayIsil",
	"metTodayAyres",

	//调教相关
	"woohoo", //调教参与flag
	"oksign", //合意。没有就是强奸。

	//高潮判定系列
	"MEx",
	"BEx",
	"CEx",
	"UEx",
	"VEx",
	"AEx",

	//刻印变化系列。
	"getHypnosis",
	"getecstacy",
	"getSurrender",
	"getPain",
	"getFear",
	"getHumiliated",
	"getMortify",
	"getResistance",
	"loseResistance",
	"loseHypnosis",

	//
];

D.cflag = [
	//诅咒相关
	"cursedLv",
	"cursedMP",
	"cursed",

	//关系性
	"favo",
	"trust",
	"sub",
	"depend",
	"desire",

	//心理值
	"fallen", //堕落度
	"erosion", //侵蚀率

	//名气
	"schoolfame",
	"jobfame",
	"publicfame",
	"lewdfame",
	"crimefame",

	//时间管理
	"wakeuptime",
	"sleeptime",
	"wokeup",
	"lastslept",

	//交流深度
	"touchLv",
	//反抗刻印最大等级记录
	"getResistance",
];
