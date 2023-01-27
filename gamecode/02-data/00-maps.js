const worldMap = {
	Orlania: new townMap("Orlania", "", {
		name: ["奥兰尼亚"],
		entry: ["GateNorth", "GateSouth", "GateWest", "GateEast"],
		xy: [35],
	}),
	Academy: new townMap("Academy", "Orlania", { name: ["第一魔法学院"], entry: ["SchoolGate"], xy: [7, 25] }),
	CommonSpots: {},
};

// x,y坐标，可通过的方向
//     北 x-
// y-西 东 y+
//  南 x+
//  例如：["GateSouth", 16, 0, "NWE"] 表示南门的坐标为(16,0)，可通过的方向为北、西、东
//用Spots登记目录。地点id后可以用|添加属性，例如passable表示可通过，invisible表示不可见
worldMap.Orlania.Spots(
	//城郊
	["OutskirtsNorth|field", -17, 0, "S"],
	["OutskirtsSouth|field", 17, 0, "N"],
	["OutskirtsWest|field", 0, -17, "E"],
	["OutskirtsEast|field", 0, 17, "W"],

	//城镇出入口，东南西北门
	["GateNorth|passable", -15, 0, "S"],
	["GateSouth|passable", 15, 0, "N"],
	["GateWest|passable", 0, -15, "E"],
	["GateEast|passable", 0, 15, "W"],

	//中心区域，城镇中心，中心广场
	["TownCenter|passable", 0, 0, "SNWE"],
	["CenterSquare|passable", 2, 0, "SN"],

	//魔法学院，位于城镇东北方
	["Academy", -11, 8, "SW"],
	["Hospital", -9, 3, "W"],

	//城南的商业街、大浴场、水族馆
	["ShopAlley|passable", 11, -4, "E"],
	["BathHouse", 9, -4, "EN"],
	["Aquarium", 12, 13, "N"],

	//城北的美术馆、元灵教会、黑猫咖啡馆，距离魔法学院较近
	["ArtGallery", -8, 8, "WNS"],
	["Church", -12, 4, "E"],
	["BlackCat", -10, 8, "W"],
	["OperaHouse", -6, 11, "S"],

	//城西一带
	["BairdTrading|passable", -4, -11, "SN"],
	["SliverChimes", -4, -8, "N"],
	["CentaurBar", -6, -8, "N"]
);

worldMap.Academy.Spots(
	["MageTower", -3, -12, "S"],
	["SchoolEntrance|passable", 0, -12, "EN"],
	["ActivitySquare|passable", 0, -10, "SNWE"],

	["ClassBuildingR1|passable", 3, -8, "N"],
	["ClassBuildingR2|passable", -3, -8, "S"],
	["ResearchLabA", 2, -5, "WSN"],
	["ResearchLabB", -2, -5, "WSN"],
	["Library|passable", 2, -2, "SN"],
	["Arena|passable", -2, 1, "SNWE"],
	["HistoryMuseum", 2, 2, "N"],
	["DiningHall", 2, 10, "N"],
	["GreenGarden|passable", -2, -2, "SN"],
	["StudentCenter", -2, 7, "S"],
	["Dormitory", 0, 12, "W"],

	["SecretTrianingGround|invisible", 3, 12, ""]
);

Object.defineProperties(window, {
	worldMap: { get: () => worldMap },
});
