import { GameMap } from "./Map";
declare function groupmatch(arg, ...args): boolean;
declare var worldMap: typeof window.worldMap;

//declare worldMap as a global variable
declare global {
	interface Window {
		worldMap;
	}
}

export function setCommon(id) {
	const CM = worldMap.CommonSpots;
	switch (id) {
		case "PublicToilet":
			CM[id].Tags("厕所", "无窗", "狭窄", "公共").Placement("洗手台", "镜子", "马桶");
			break;
		case "Storage":
			CM[id]
				.Tags("狭窄", "隐蔽", "无窗", "上锁")
				.Placement("储物柜", "工具箱")
				.Loot({
					C: ["钉子", "废木料", "纸张"],
					UC: ["毛巾", "杯子", "金属零件"],
					R: ["用过的套套", "木柴", "锤子", "剪刀"],
					SR: ["内裤", "胸罩", "铜币"],
					UR: ["钥匙", "银币", "绳索"],
					LR: ["钱包"],
				});
			break;
		case "Bathroom":
			CM[id].Tags("沐浴", "厕所", "无窗").Placement("浴缸", "洗手台", "镜子");
			break;
		case "Kitchen":
			CM[id].Tags("厨房").Placement("炉灶", "厨具", "洗手台", "储物柜", "冰箱");
			break;
		case "Restroom":
			CM[id].Tags("厕所", "无窗", "隐蔽").Placement("洗手台", "镜子");
	}
}

export function setAcademy(id) {
	const FMA = worldMap.Academy;
	switch (id) {
		case "MageTower":
			FMA[id].Rooms("Inside", "Observatory", "Storage").Tags("高台", "悬浮", "防御").Placement("防御炮台");
			break;

		case "SchoolEntrance":
			FMA[id].Tags("交通").Placement("移动摊位").Parking().Railcar();
			break;

		case "ActivitySquare":
			FMA[id].Rooms("Storage").Tags("舞台", "休息区").Placement("旗帜", "长椅");
			break;

		case "ClassBuildingR1":
			FMA[id].Rooms("C101", "C102", "PublicToilet");
		case "ClassBuildingR2":
			if (id === "ClassBuildingR2") {
				FMA[id].Rooms("C201", "C202", "PublicToilet");
			}
			FMA[id].Placement("储物柜", "长椅", "自动贩售机", "魔偶", "盆栽");
			break;

		case "ResearchLabA":
			FMA[id].Rooms("MagiPysics", "Analyzing", "Storage", "Restroom");
		case "ResearchLabB":
			if (id === "ResearchLabB") {
				FMA[id].Rooms("Alchemy", "Biologic", "MagiPotion", "Storage", "Restroom");
			}
			FMA[id].Tags("研究", "宽敞").Placement("书架", "桌子", "椅子", "储物柜", "研究台", "电脑", "傀儡充能器");
			break;

		case "Library":
			FMA[id].Tags("宽敞", "阅读区", "休息区").Placement("书架", "桌子", "椅子", "电脑");
			break;

		case "Arena":
			FMA[id].Tags("战斗区", "景点").Placement("旗帜", "长椅", "擂台", "雕塑");
			break;

		case "HistoryMuseum":
			FMA[id].Tags("休息区", "景点").Placement("展示柜", "长椅");
			break;

		case "DiningHall":
			FMA[id].Tags("休息区", "餐厅", "宽敞").Placement("椅子", "桌子", "自动贩售机", "自助柜台", "傀儡充能器");
			break;

		case "GreenGarden":
			FMA[id].Rooms("GreenHouse", "Storage").Tags("景点", "种植区", "宽敞").Placement("绿植", "长椅", "农务设备");
			break;

		case "StudentCenter":
			FMA[id].Tags("医务").Placement("椅子", "沙发", "智能水晶", "魔偶", "医疗设备");
			break;

		case "Dormitory":
			FMA[id]
				.Rooms("Kitchen", "Storage", "A101", "A102", "A103", "A201", "A202", "A203", "S303")
				.Tags("休息区", "宽敞")
				.Placement("沙发", "桌子", "椅子", "盆栽", "傀儡充能器", "冰箱");
			break;

		case "SecretTrainingGround":
			FMA[id].Tags("异空间").Placement("传送门", "训练器材").setPortal("Academy.MageTower.Hall");
			break;
	}
}

export function setAcademyRoom(id, roomid) {
	const FMA = worldMap.Academy;
	switch (id) {
		case "MageTower":
			if (roomid == "Inside") {
				FMA[id][roomid]
					.Tags("上锁", "无窗")
					.Placement("书架", "桌子", "沙发", "魔法阵", "传送门")
					.setPortal("Orlania.OutskirtE", "Academy.SecretTrainingGround");
			}
			if (roomid == "Observatory") {
				FMA[id][roomid].Tags("上锁", "高台", "隐蔽", "开放", "开阔");
			}

			if (roomid == "Storage") {
				FMA[id][roomid]
					.Tags("上锁")
					.addLoot({ SR: ["曼陀罗草干"], UR: ["魔法卷轴(空)", "符石"], LR: ["小型魔力水晶"] });
			}

		case "ClassBuildingR1":
		case "ClassBuildingR2":
			if (FMA[id][roomid].name[0].includes("教室")) {
				FMA[id][roomid].Tags("教室", "宽敞").Placement("桌子", "椅子", "书架", "储物柜", "盆栽", "教坛", "黑板");
			}
			break;
		case "Dormitory":
			if (FMA[id][roomid].name[0].includes("宿舍")) {
				FMA[id][roomid]
					.Rooms("Bathroom")
					.Tags("宿舍", "睡房")
					.Placement("床", "桌子", "椅子", "书桌", "衣柜", "书架")
					.MaxSlots(12);
				FMA[id][roomid].Bathroom = GameMap.copy(worldMap.CommonSpots["Bathroom"], FMA[id][roomid].id, "Bathroom");
			}
			if (roomid == "Kitchen") {
				FMA[id][roomid].MaxSlots(16).Placement("椅子");
			}
			break;
		case "GreenHouse":
			if (roomid == "GreenHouse") {
				FMA[id][roomid].AdoptParent();
			}
			break;
	}

	if (groupmatch(roomid, "MagiPysics", "Analyzing", "Alchemy", "Biologic", "MagiPotion")) {
		FMA[id][roomid].Tags("个人").AdoptParent();
	}

	switch (roomid) {
		case "MagiPysics":
			FMA[id][roomid].Placement("大型魔力水晶", "符文雕刻仪器", "记录水晶", "物质观测仪", "沙发");
			break;
		case "Analyzing":
			FMA[id][roomid].Placement("魔力探测仪", "分解设备", "分析水晶", "沙发", "床");
			break;
		case "Alchemy":
			FMA[id][roomid].Placement("炼金设备", "熔炉", "储物柜", "保险柜", "烤箱");
			break;
		case "Biologic":
			FMA[id][roomid].Placement("培养槽", "冰箱", "魔药储存柜", "孵化器");
			break;
		case "MagiPotion":
			FMA[id][roomid].Placement("魔药炼制台", "种植架", "冰箱", "魔药储存柜");

			break;
	}
}
