//没有个人、私人tag的地点，都是公共的，可以随意进入
//个人指个人所有，但是可以让其他人进入的地点。私人指只有主人可以进入的地点
//上锁的地方无法正常进入，但是可以通过其他方式进入
//室外地点默认都是光亮处
//户外与室外相等，但户外纯露天周围没有墙或大型建造物，自带开阔属性。
//室外则指建筑物外部活动空间（花园广场什么的）， 室内指建筑物内

//const { Locations } = require("Code/game/map");
//这边做登记。

const CM = worldMap.CommonSpots;
CM.PublicToilet = new Locations("PublicToilet", ["公共厕所"], "CommonSpots", "室内").Tags("厕所", "隐蔽", "无窗");
CM.Storage = new Locations("Storage", ["储物间"], "ComonSpots", "室内")
	.Tags("狭窄", "隐蔽", "无窗", "上锁")
	.Placement("储物柜", "工具箱");
CM.Bathroom = new Locations("Bathroom", ["浴室"], "CommonSpots", "室内").Tags("沐浴", "厕所", "无窗");

const FMA = worldMap.Academy;
FMA.SchoolEntrance = new Locations("SchoolEntrance", ["魔法学院|入口"], "Academy", "户外")
	.Parking()
	.Railcar()
	.Tags("交通")
	.Placement("移动摊位");

FMA.MageTower = new Locations("MageTower", ["法师塔"], "Academy", "室外")
	.Rooms("Inside", "Observatory")
	.Tags("高台", "悬浮", "防御")
	.Placement("魔网", "防御炮台");

FMA.MageTower.Inside = new Locations("MageTower.Inside", ["法师塔|内部"], "Academy", "室内")
	.isRoom()
	.Tags("上锁", "无窗")
	.Placement("书架", "桌子", "沙发", "传送门")
	.setPortal("Orlania.OutskirtsEast", "Academy.SecrectTrainingGround");

FMA.SecretTrainingGround = new Locations("SecrectTrainingGround", ["秘密训练场"], "Academy", "室内")
	.Tags("隐蔽", "封闭", "异空间")
	.Placement("传送门", "训练器材")
	.setPortal("Academy.MageTower.Inside");

FMA.MageTower.Observatory = new Locations("MageTower.Observatory", ["观测台"], "Academy", "室外")
	.Tags("高台", "悬浮", "狭窄", "隐蔽", "遮顶")
	.isRoom();

FMA.ActivitySquare = new Locations("ActivitySquare", ["魔法学院"], "Academy", "户外")
	.Rooms("PublicToilet", "Storage")
	.Tags("活动", "舞台", "休息区")
	.Placement("旗帜", "长椅");

FMA.ActivitySquare.PublicToilet = Maps.copy(CM.PublicToilet, "Academy", "Academy.ActivitySquare.PublicToilet").isRoom();
FMA.ActivitySquare.Storage = Maps.copy(CM.Storage, "Academy", "Academy.ActivitySquare.Storage").isRoom();

FMA.ClassBuildingR1 = new Locations("ClassBuildingR1", ["教学楼|R1"], "Academy", "室内")
	.Tags("教室", "宽敞")
	.Placement("魔网", "书架", "桌子", "椅子", "储物柜");

FMA.ClassBuildingR2 = Maps.copy(FMA.ClassBuildingR1, "Academy", "Academy.ClassBuildingR2").setName(["教学楼|R2"]);

FMA.ResearchLabA = new Locations("ResearchLabA", ["魔法研究所"], "Academy", "室内")
	.Rooms("MagiPysics", "Analyzing")
	.Tags("研究", "宽敞")
	.Placement("魔网", "书架", "桌子", "椅子", "储物柜", "研究台", "电脑", "傀儡充能器");

FMA.ResearchLabA.MagiPysics = new Locations("ResearchLabA.MagiPysics", ["魔法实验室"], "Academy", "室内")
	.isRoom()
	.Tags("个人")
	.Placement("大型魔法阵", "记录水晶", "观测设备", "沙发")
	.AdoptParent();

FMA.ResearchLabA.Analyzing = new Locations("ResearchLabA.Analyzing", ["魔法分析室"], "Academy", "室内")
	.isRoom()
	.Tags("个人")
	.Placement("分析水晶", "分解设备", "魔力探测仪", "沙发", "床")
	.AdoptParent();

FMA.ResearchLabB = Maps.copy(FMA.ResearchLabA, "Academy", "Academy.ResearchLabB").setName(["综合研究所"]);

FMA.ResearchLabB.Alchemy = new Locations("ResearchLabB.Alchemy", ["炼金实验室"], "Academy", "室内")
	.isRoom()
	.Tags("个人")
	.Placement("炼金设备", "熔炉", "药物储存柜", "冰箱")
	.AdoptParent();

FMA.ResearchLabB.Biologic = new Locations("ResearchLabB.Biologic", ["生物实验室"], "Academy", "室内")
	.isRoom()
	.Tags("个人")
	.Placement("生物设备", "冰箱", "药物储存柜")
	.AdoptParent();

FMA.Library = new Locations("Library", ["图书馆"], "Academy", "室内")
	.Tags("宽敞", "阅读区", "休息区")
	.Placement("书架", "桌子", "椅子", "魔网", "电脑");

FMA.Arena = new Locations("Arena", ["竞技场"], "Academy", "室外")
	.Tags("战斗区", "活动", "开阔", "悬浮", "景点")
	.Placement("旗帜", "长椅");

FMA.HistoryMuseum = new Locations("HistoryMuseum", ["博物馆"], "Academy", "室内")
	.Tags("休息区", "景点")
	.Placement("展示柜", "长椅");

FMA.DiningHall = new Locations("DiningHall", ["学生饭堂"], "Academy", "室内")
	.Tags("休息区", "餐厅", "宽敞")
	.Placement("椅子", "桌子", "自动贩售机", "魔法柜台", "魔网", "傀儡充能器");

FMA.GreenGarden = new Locations("GreenGarden", ["植物园"], "Academy", "室外")
	.Rooms("GreenHouse", "Storage")
	.Tags("休息区", "景点", "种植区", "宽敞")
	.Placement("绿植", "长椅", "农务设备");

FMA.StudentCenter = new Locations("StudentCenter", ["学生中心"], "Academy", "室内").Placement(
	"椅子",
	"沙发",
	"魔网",
	"智能水晶",
	"魔偶"
);

FMA.Dormitory = new Locations("Dormitory", ["宿舍大厅"], "Academy", "室内")
	.Rooms("Kitchen", "Storage", "A101", "A102", "A103", "A201", "A202", "A203", "S303")
	.Tags("休息区", "宽敞")
	.Placement("沙发", "桌子", "椅子", "盆栽", "魔网", "傀儡充能器", "冰箱");

FMA.Dormitory.Kitchen = new Locations("Kitchen", ["宿舍厨房"], "Academy.Dormitory", "室内")
	.isRoom()
	.Tags("厨房")
	.Placement("烤炉", "冰箱", "炉灶", "储物柜");

FMA.Dormitory.Storage = Maps.copy(CM.Storage, "Academy", "Academy.Dormitory.Storage").isRoom();

FMA.Dormitory.rooms.forEach(function (room) {
	if (groupmatch(room, "Kitchen", "Storage")) {
	} else {
		FMA.Dormitory[room] = new Locations("Dormitory." + room, ["宿舍|" + room], "Academy", "室内")
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

FMA.GreenGarden.GreenHouse = new Locations("GreenHouse", ["温室"], "Academy.GreenGarden", "室内").AdoptParent();
FMA.GreenGarden.Storage = Maps.copy(CM.Storage, "Academy", "Academy.GreenGarden.Storage").isRoom();

FMA.Dormitory.S303.YourHome().MaxSlots(12);
