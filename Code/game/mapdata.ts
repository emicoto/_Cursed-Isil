import { Boards, GameMap, Spots } from "./Map";
import { spotType } from "./types";
import { setCommon, setAcademy, setAcademyRoom } from "./setMap";

declare global {
	interface Window {
		game: {
			worldMap: GameMap;
		};
	}
}

export function initWorldMap() {
	const worldMap = {
		Orlania: new Boards("Orlania", "", {
			type: "town",
			name: ["奥兰尼亚"],
			entry: ["Orlania.GateN", "Orlania.GateS", "Orlania.GateW", "Orlania.GateE"],
			xy: [35, 35],
		}),
		Academy: new Boards("Academy", "Orlania", {
			type: "academy",
			name: ["奥兰尼亚第一魔法学院"],
			entry: "Academy.SchoolEntrance",
			xy: [7, 25],
		}),
		CommonSpots: {
			groupId: "CommonSpots",
		},
	};

	Object.defineProperties(window.game, {
		worldMap: { value: worldMap },
	});
	Object.defineProperties(window, {
		worldMap: {
			get() {
				return window.game.worldMap;
			},
		},
	});

	console.log(window.worldMap);

	worldMap.Orlania["Academy"] = worldMap.Academy;

	//录入顺序：地点名|格子属性，地点坐标x，地点坐标y，可通行方向，[地点属性]
	worldMap.Orlania.Spots(
		["OutskirtN|field", -17, 0, "S", ["field", "mapEntry"]],
		["OutskirtS|field", 17, 0, "N", ["field", "mapEntry"]],
		["OutskirtW|field", 0, -17, "E", ["field", "mapEntry"]],
		["OutskirtE|field", 0, 17, "W", ["field", "mapEntry"]],

		["GateN|passable", -15, 0, "S", ["gate"]],
		["GateS|passable", 15, 0, "N", ["gate"]],
		["GateW|passable", 0, -15, "E", ["gate"]],
		["GateE|passable", 0, 15, "W", ["gate"]],

		["TownCenter|passable", 0, 0, "SNWE", ["buildingEntry"]],
		["CenterSquare|passable", 2, 0, "SN", ["ground"]],

		["Academy", -11, 8, "SW", ["buildingEntry", "mapEntry"]],
		["Hospital", -9, 3, "W", ["building"]],

		["ShopAlley|passable", 11, -4, "E", ["shopAlley", "mapEntry"]],
		["BathHouse", 9, -4, "EN", ["building"]],
		["Aquarium", 12, 13, "N", ["buildingEntry"]],

		["ArtGallery", -8, 8, "WNS", ["building"]],
		["Church", -12, 4, "E", ["buildingEntry"]],
		["BlackCat", -9, 8, "W", ["building"]],
		["OperaHouse", -6, 11, "S", ["building"]],

		["BairdTrading|passable", -4, -11, "SN", ["ground"]],
		["SliverChimes", -4, -8, "N", ["building"]],
		["CentaurBar", -6, -8, "N", ["building"]]
	);

	worldMap.Academy.Spots(
		["MageTower", -3, -12, "S", ["buildingEntry"]],
		["SchoolEntrance|passable", 0, -12, "EN", ["mapEntry", "gate"]],
		["ActivitySquare|passable", 0, -10, "SNWE", ["ground"]],

		["ClassBuildingR1|passable", 3, -8, "N", ["building"]],
		["ClassBuildingR2|passable", -3, -8, "S", ["building"]],

		["ResearchLabA", 2, -5, "WSN", ["building"]],
		["ResearchLabB", -2, -5, "ESN", ["building"]],

		["Library|passable", 2, -2, "SN", ["building"]],
		["Arena|passable", -2, 1, "SNWE", ["ground", "float"]],
		["HistoryMuseum", 2, 2, "N", ["building"]],
		["DiningHall", 2, 10, "N", ["building"]],

		["GreenGarden|passable", -2, -2, "SN", ["park"]],

		["StudentCenter", -2, 7, "S", ["building"]],
		["Dormitory", 0, 12, "W", ["building"]],

		["SecretTrainingGround|invisible", 3, 12, "", ["secretArea"]]
	);

	const OL = worldMap.Orlania;
	const FMA = worldMap.Academy;

	//-------------------- 通用地点 --------------------
	const CM = worldMap.CommonSpots;
	const CMConfig = [
		["RailcarStation", "轨道车站", "stransport"],
		["AirShipPort", "飞船港口", "transport"],
		["PublicToilet", "公共厕所", "room"],
		["Storage", "储物间", "room"],
		["Bathroom", "浴室", "room"],
		["Kitchen", "厨房", "room"],
		["Restroom", "厕所", "room"],
	];

	CMConfig.forEach((config) => {
		let id = config[0],
			name = [config[1], id],
			type = ("common|" + config[2]) as spotType;

		CM[id] = new Spots(["CommonSpots", id, name, type]);
		setCommon(id);
	});

	//-------------------- 奥兰尼亚地点 --------------------
	const OLConfig = [
		"城郊(北)",
		"城郊(南)",
		"城郊(西)",
		"城郊(东)",
		"城门(北)",
		"城门(南)",
		"城门(西)",
		"城门(东)",
		"城镇中心",
		"中心广场",
		"魔法学院",
		"医院",
		"商店街",
		"大浴场",
		"水族馆",
		"艺术馆",
		"元灵教堂",
		"黑猫咖啡",
		"绯鸟剧场",
		"百德商会",
		"银铃餐馆",
		"牛马酒吧",
	];

	Array.from(worldMap.Orlania.spots).forEach((spot, i) => {
		const id = spot[0];
		const name = OLConfig[i];

		if (worldMap.Orlania[id] === undefined)
			OL[id] = new Spots(["Orlania", id, [name, id], spot[1].spotType as spotType]);
	});

	//-------------------- 魔法学院地点 --------------------
	const A0Config = [
		"法师塔",
		"魔法学院|入口",
		"魔法学院|广场",
		"教学楼|R1",
		"教学楼|R2",
		"魔法研究所",
		"综合研究所",
		"图书馆",
		"竞技场",
		"博物馆",
		"学生饭堂",
		"植物园",
		"学生中心",
		"宿舍|大厅",
		"秘密训练场",
	];

	Array.from(worldMap.Academy.spots).forEach((spot, i) => {
		const id = spot[0];
		const name = A0Config[i];

		if (worldMap.Academy[id] === undefined)
			FMA[id] = new Spots(["Academy", id, [name, id], spot[1].spotType as spotType]);
		setAcademy(id);
	});

	//-------------------- 魔法学院地点内部房间 --------------------
	const hasroom = Object.values(FMA).filter((spot) => spot.rooms?.length);
	const roomName = {
		GreenHouse: "温室",
		Inside: "法师塔|内部",
		Observatory: "观测台",
		MagiPysics: "魔法实验室",
		Analyzing: "魔法分析室",
		Alchemy: "炼金实验室",
		Biologic: "生物实验室",
		MagiPotion: "魔药实验室",
	};

	hasroom.forEach((spot) => {
		let id = spot.id.split(".").pop();

		spot.rooms.forEach((room) => {
			//先复制共通房间
			if (worldMap.CommonSpots[room]) {
				FMA[id][room] = GameMap.copy(worldMap.CommonSpots[room], spot.id, room);
			}

			//创建有名字的房间
			else if (roomName[room]) {
				FMA[id][room] = new Spots([spot.id, room, [roomName[room], room], "room"]);
			}

			//创建剩余房间
			else {
				switch (id) {
					case "ClassBuildingR1":
					case "ClassBuildingR2":
						FMA[id][room] = new Spots([spot.id, room, ["教室|" + room, "Classroom|" + room], "room"]);
						break;

					case "Dormitory":
						FMA[id][room] = new Spots([spot.id, room, ["宿舍|" + room, "Dormitory|" + room], "room"]);
						break;
				}
			}

			//设置房间内部的物品
			setAcademyRoom(id, room);
		});
	});
}

Object.defineProperties(window.scEra.initialization, {
	WorldMap: { value: initWorldMap },
});
