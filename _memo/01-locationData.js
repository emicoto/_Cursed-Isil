//没有个人、私人tag的地点，都是公共的，可以随意进入
//个人指个人所有，但是可以让其他人进入的地点。私人指只有主人可以进入的地点
//上锁的地方无法正常进入，但是可以通过其他方式进入
//室外地点默认都是光亮处
//户外与室外相等，但户外纯露天周围没有墙或大型建造物，自带开阔属性。
//室外则指建筑物外部活动空间（花园广场什么的）， 室内指建筑物内

//const { Spots } = require("Code/game/map");
//这边做登记。

var CM = worldMap.CommonSpots;

const CMConfig = [
	["RailcarStation", ["轨道车站"], "stransport"],
	["AirShipPort", ["飞船港口"], "transport"],
	["PublicToilet", ["公共厕所"], "room"],
	["Storage", ["储物间"], "room"],
	["Bathroom", ["浴室"], "room"],
];

CMConfig.forEach(([id, name, side]) => {
	CM[id] = new Spots(id, name, "CommonSpots", "common/" + side);
});

CM.PublicToilet.Tags("厕所", "隐蔽", "无窗");
CM.Storage.Tags("狭窄", "隐蔽", "无窗", "上锁").Placement("储物柜", "工具箱");
CM.Bathroom.Tags("沐浴", "厕所", "无窗");

//Orlania First Magica Academy
var FMA = worldMap.Academy;

const A0Config = [
	["SchoolEntrance", ["魔法学院|入口"], "户外"],
	["MageTower", ["法师塔"], "室外"],
	["SecretTrainingGround", ["秘密训练场"], "室内"],
	["ActivitySquare", ["魔法学院"], "户外"],
	["ClassBuildingR1", ["教学楼|R1"], "室内"],
	["ClassBuildingR2", ["教学楼|R2"], "室内"],
	["ResearchLabA", ["魔法研究所"], "室内"],
	["ResearchLabB", ["综合研究所"], "室内"],
	["Library", ["图书馆"], "室内"],
	["Arena", ["竞技场"], "室外"],
	["HistoryMuseum", ["博物馆"], "室内"],
	["DiningHall", ["学生饭堂"], "室内"],
	["GreenGarden", ["植物园"], "室外"],
	["StudentCenter", ["学生中心"], "室内"],
	["Dormitory", ["宿舍大厅"], "室内"],
];

A0Config.forEach(([id, name, side]) => {
	FMA[id] = new Spots(id, name, "Academy", side);
});

FMA.MageTower.Rooms("Inside", "Observatory").Tags("高台", "悬浮", "防御").Placement("魔网", "防御炮台");

FMA.SchoolEntrance.Tags("交通").Placement("移动摊位").Parking().Railcar();

FMA.ActivitySquare.Rooms("PublicToilet", "Storage").Tags("活动", "舞台", "休息区").Placement("旗帜", "长椅");

FMA.ClassBuildingR1.Tags("教室", "宽敞").Placement("魔网", "书架", "桌子", "椅子", "储物柜");

FMA.ResearchLabA.Rooms("MagiPysics", "Analyzing")
	.Tags("研究", "宽敞")
	.Placement("魔网", "书架", "桌子", "椅子", "储物柜", "研究台", "电脑", "傀儡充能器");

FMA.Library.Tags("宽敞", "阅读区", "休息区").Placement("书架", "桌子", "椅子", "魔网", "电脑");

FMA.Arena.Tags("战斗区", "活动", "开阔", "悬浮", "景点").Placement("旗帜", "长椅");

FMA.HistoryMuseum.Tags("休息区", "景点").Placement("展示柜", "长椅");

FMA.DiningHall.Tags("休息区", "餐厅", "宽敞").Placement("椅子", "桌子", "自动贩售机", "魔法柜台", "魔网", "傀儡充能器");

FMA.GreenGarden.Rooms("GreenHouse", "Storage")
	.Tags("休息区", "景点", "种植区", "宽敞")
	.Placement("绿植", "长椅", "农务设备");

FMA.StudentCenter.Placement("椅子", "沙发", "魔网", "智能水晶", "魔偶");

FMA.SecretTrainingGround.Tags("隐蔽", "封闭", "异空间")
	.Placement("传送门", "训练器材")
	.setPortal("Academy.MageTower.Inside");
//----------------------- copy map -----------------------//

FMA.ClassBuildingR2 = Maps.copy(FMA.ClassBuildingR1, "Academy", "Academy.ClassBuildingR2").setName(["教学楼|R2"]);

FMA.ResearchLabB = Maps.copy(FMA.ResearchLabA, "Academy", "Academy.ResearchLabB").setName(["综合研究所"]);

//------------------------ Dormitory ------------------------//

FMA.Dormitory.Rooms("Kitchen", "Storage", "A101", "A102", "A103", "A201", "A202", "A203", "S303")
	.Tags("休息区", "宽敞")
	.Placement("沙发", "桌子", "椅子", "盆栽", "魔网", "傀儡充能器", "冰箱");

FMA.Dormitory.rooms.forEach(function (room) {
	if (groupmatch(room, "Kitchen", "Storage")) {
	} else {
		FMA.Dormitory[room] = new Spots("Dormitory." + room, ["宿舍|" + room], "Academy", "室内")
			.isRoom()
			.Rooms("Bathroom")
			.Tags("私人", "睡房")
			.Placement("床", "书桌", "椅子", "衣柜", "书架")
			.MaxSlots(12);
		FMA.Dormitory[room].Bathroom = Maps.copy(
			CM.Bathroom,
			"Academy",
			"Academy.Dormitory." + room + ".Bathroom"
		).isRoom();
	}
});

FMA.Dormitory.S303.YourHome().MaxSlots(12);
FMA.Dormitory.Kitchen = new Spots("Dormitory.Kitchen", ["宿舍厨房"], "Academy", "室内")
	.isRoom()
	.Tags("厨房")
	.Placement("烤炉", "冰箱", "炉灶", "储物柜");

//----------------------- copy map -----------------------//

FMA.Dormitory.Storage = Maps.copy(CM.Storage, "Academy", "Academy.Dormitory.Storage").isRoom();

FMA.ActivitySquare.PublicToilet = Maps.copy(CM.PublicToilet, "Academy", "Academy.ActivitySquare.PublicToilet").isRoom();

FMA.ActivitySquare.Storage = Maps.copy(CM.Storage, "Academy", "Academy.ActivitySquare.Storage").isRoom();

FMA.GreenGarden.Storage = Maps.copy(CM.Storage, "Academy", "Academy.GreenGarden.Storage").isRoom();

//------------------------ room list  ------------------------//

const A1Config = [
	["GreenGarden", "GreenHouse", ["温室"], "室内"],
	["MageTower", "Inside", ["法师塔|内部"], "室内"],
	["MageTower", "Observatory", ["观测台"], "室外"],
	["ResearchLabA", "MagiPysics", ["魔法实验室"], "室内"],
	["ResearchLabA", "Analyzing", ["魔法分析室"], "室内"],
	["ResearchLabB", "Alchemy", ["炼金实验室"], "室内"],
	["ResearchLabB", "Biologic", ["生物实验室"], "室内"],
];

A1Config.forEach(([group, id, name, side]) => {
	FMA[group][id] = new Spots(group + "." + id, name, "Academy", side).isRoom();
});

FMA.GreenGarden.GreenHouse.AdoptParent();

FMA.MageTower.Inside.Tags("上锁", "无窗")
	.Placement("书架", "桌子", "沙发", "传送门")
	.setPortal("Orlania.OutskirtsEast", "Academy.SecretTrainingGround");

FMA.MageTower.Observatory.Tags("高台", "悬浮", "狭窄", "隐蔽", "遮顶");

FMA.ResearchLabA.MagiPysics.Tags("个人").Placement("大型魔法阵", "记录水晶", "观测设备", "沙发").AdoptParent();

FMA.ResearchLabA.Analyzing.Tags("个人").Placement("分析水晶", "分解设备", "魔力探测仪", "沙发", "床").AdoptParent();

FMA.ResearchLabB.Alchemy.Tags("个人").Placement("炼金设备", "熔炉", "药物储存柜", "冰箱").AdoptParent();

FMA.ResearchLabB.Biologic.Tags("个人").Placement("生物设备", "冰箱", "药物储存柜").AdoptParent();
