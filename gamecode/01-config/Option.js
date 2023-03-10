//经典era模式下的分类设置
D.ComFilterGeneral = ["常规", "挑逗", "魔法", "其他"];
D.ComFilterTrain = ["前戏", "道具", "性交", "尿道", "SM", "鬼畜", "触手", "情景"];
D.ComTypes = D.ComFilterGeneral.concat(D.ComFilterTrain);

//scEra动作模式下的分类设置
D.ActionTypes = [
	["G", "常规"],
	["M", "目录"],
	["C", "交流"],
	["T", "接触"],
	["R", "逆位"],
	["P", "体位"],
	["I", "道具"],
	["B", "战斗"],
	["Ma", "魔法"],
	["Tx", "触手"],
	["Co", "命令"],
	["O", "其他"],
	["Ex", "固有"],
];

//palam lv的初期値, 递增规则 n*1200 + n*100, n为Lv+1， 最大10
D.palamLv = [0, 1200, 2500, 3900, 5400, 7000, 8700, 10500, 12400, 14400, 16500];

//exp lv的初期値, 最大12lv
D.expLv = [0, 10, 50, 150, 300, 600, 1000, 1800, 3000, 5000, 8000, 12000, 18000];

//abl lv的初期値, 最大20lv
D.ablLv = [
	0, 20, 50, 100, 300, 800, 1500, 3200, 4800, 6200, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000, 24000,
	26000, 28000,
];

//事件模式下默认出口
S.defaultExit = "MainLoop";

//特定情况下的配合度补正。只限经典era模式。
S.ignoreOrder = 20;

//游戏开始时的时间。 顺序为 年， 月，日。
S.date = [4062, 3, 14];
//游戏开始时的具体时间。单位是分钟。
S.time = 1120;

//游戏开始时的进程模式。
//具体值有：event（事件）,train（调教）,reverse（逆调教）,combat（战斗), history（回想)
S.defaultMode = "event";

//物品价格倍率
S.defaultPriceFactor = 2;

//动作模式下各分类的基础配合值。
S.orderConfig = {
	touch: 20,
	sextoy: 30,
	tentacles: 50,
	pose: 50,
};
