import { Dict, maptype, maptags, rarity, locationside } from "./types";

export interface iPos {
	x: number;
	y: number;
}

export interface Maps {
	mapId: string;
	groupId?: string;
	type: maptype;
	tags: maptags[];

	name?: string[];
	description?: Function;
	events?: Function;
	portal?: {
		exist: boolean;
		points: Array<string | iPos>;
	};

	spots?: Map<string, [iPos, string?]>;
	mapsize?: iPos;
	mapdata?: any;
}

export interface townMap extends Maps {
	entry: string[];
	locations?: Dict<number>;
}

export interface location extends Maps {
	roomId?: string;
	rooms?: string[];
	business?: {
		weekday: number[] | "allday";
		open: number;
		close: number;
	};
	side?: locationside;
	yourHome?: boolean;
	hasParking?: boolean;
	hasRailcar?: boolean;
	hasAirship?: boolean;
	loot?: Dict<string[], rarity>;
	placement?: string[];
}

export interface fieldMap extends Maps {
	minlevel?: number;
	maxLevel?: number;
	loot?: Dict<string[], rarity>;
	enemy?: string[];
	hunt?: string[];
	boss?: string[];

	fieldmaster?: string;
	mapsize?: iPos;
	mapdata?: any;
}

export interface dungeonMap extends fieldMap {
	floor?: number;
	floorMaster?: string;
	dungeonMaster?: string;

	unlockCondition?: Function;
	puzzle?: Function;
}

// 地图基类
export class Maps {
	public static data: Dict<Maps> = {};
	constructor(name: string[], type: maptype) {
		this.name = name;
		this.type = type;
		this.tags = [];
		this.description = function () {
			return "";
		};
		this.events = function () {
			return "";
		};
	}
	Description(callback) {
		this.description = callback;
		return this;
	}
	Events(callback) {
		this.events = callback;
		return this;
	}
	Tags(...tags: maptags[]) {
		this.tags = tags;
		return this;
	}
	setPortal(...points: Array<string | iPos>) {
		this.portal = {
			exist: true,
			points: points,
		};
		return this;
	}
	addPortal(...points: Array<string | iPos>) {
		this.portal.points.push(...points);
		return this;
	}
	Gerenate() {
		const rawdata = GenerateMap(this);
		this.mapdata = compressMapData(rawdata);
		return this;
	}
}

// 城镇地图
export class townMap extends Maps {
	constructor(
		mapid: string,
		groupid: string,
		name: string[],
		entry: string[],
		mapsizeX: number = 33,
		mapsizeY: number = 33
	) {
		super(name, "town");
		this.mapId = mapid; //城镇的id
		this.groupId = groupid; //上级地图的id
		this.entry = entry;
		this.spots = new Map();
		this.mapsize = { x: mapsizeX, y: mapsizeY };
	}
	Spots(...spots: Array<[string, number, number, string?]>) {
		spots.forEach((spot) => {
			// x,y坐标的修正。录入时以中心为原点，但是实际上是以左上角为原点。加上0,0的坐标，mapsize应该是单数。
			spot[1] += Math.floor(this.mapsize.x / 2);
			spot[2] += Math.floor(this.mapsize.y / 2);

			this.spots.set(spot[0], [{ x: spot[1], y: spot[2] }, spot[3]]);
		});
		return this;
	}
}

// 具体地点
export class location extends Maps {
	constructor(mapid, name: string[], group: string, side: "室内" | "室外") {
		super(name, "location");
		this.mapId = mapid; //地点的id
		this.groupId = group; //上级地图的id
		this.tags.push(side);
	}
	Rooms(...rooms: string[]) {
		this.rooms = rooms;
		return this;
	}
	Business(weekday: number[] | "allday", open: number, close: number) {
		this.business = {
			weekday: weekday,
			open: open,
			close: close,
		};
		return this;
	}
	YourHome() {
		this.yourHome = true;
		return this;
	}
	Parking() {
		this.hasParking = true;
		return this;
	}
	Railcar() {
		this.hasRailcar = true;
		return this;
	}
	Airship() {
		this.hasAirship = true;
		return this;
	}
	Loot(loot: Dict<string[], rarity>) {
		this.loot = loot;
		return this;
	}
	Placement(...placement: string[]) {
		this.placement = placement;
		return this;
	}
	static countPlacement(placement: Array<string[]>) {
		const objects = [];
		placement.forEach((object) => {
			objects.push(object[0]);
		});

		//去重复后返回数组
		return Array.from(new Set(objects));
	}
}

//根据各个地点的坐标，自动生成连接各地点之间的道路。
export function GenerateMap(map: Maps) {
	//初始化地图
	const townmap = new Array(map.mapsize.x).fill(0).map(() => new Array(map.mapsize.y).fill(""));

	//根据x,y坐标，整理个地点的坐标。首先按x坐标排序，从小到大。
	//接着检查排序，如果y坐标相同，则按y坐标排序，从小到大。
	const spots = Array.from(map.spots);

	spots.sort((a, b) => {
		if (a[1][0].x === b[1][0].x) {
			return a[1][0].y - b[1][0].y;
		}
		return a[1][0].x - b[1][0].x;
	});

	//放置地点
	spots.forEach((location) => {
		const pos = location[1][0];
		townmap[pos.x][pos.y] = location[0];
	});

	//先可通过方向，在地点前方放置道路。
	//并且缓存道路的位置，以便后续的道路连接。
	const road = [];
	const setRoad = (x, y, side) => {
		if (x < 0 || y < 0 || x >= map.mapsize.x || y >= map.mapsize.y) return;
		if (townmap[x][y] === "") {
			townmap[x][y] = "road";
			road.push([side, x, y]);
		}
	};

	spots.forEach((location) => {
		const pos = location[1][0];
		const side = location[1][1];

		side.split("").forEach((s) => {
			switch (s) {
				case "W": //west
				case "w":
					setRoad(pos.x, pos.y - 1, "W");
					break;
				case "E": //east
				case "e":
					setRoad(pos.x, pos.y + 1, "E");
					break;
				case "S": //south
				case "s":
					setRoad(pos.x + 1, pos.y, "S");
					break;
				case "N": //north
				case "n":
					setRoad(pos.x - 1, pos.y, "N");
					break;
			}
		});
	});

	//检查两条路之间是否有障碍物，如果有，则不连通。
	const checkRoad = (side, x, y, start, end) => {
		if (x < 0 || y < 0 || x >= map.mapsize.x || y >= map.mapsize.y) return false;

		if (side == "x") {
			for (let i = start; i <= end; i++) {
				if (townmap[i][y] !== "" && townmap[i][y] !== "road") return false;
			}
		}
		if (side == "y") {
			for (let i = start; i <= end; i++) {
				if (townmap[x][i] !== "" && townmap[x][i] !== "road") return false;
			}
		}
		return true;
	};

	const isRoad = (x, y) => {
		if (x < 0 || y < 0 || x >= map.mapsize.x || y >= map.mapsize.y) return false;
		return townmap[x][y] === "road";
	};

	//检查周围是否已经有路
	const hasRoadAround = (side, x, y) => {
		if (x < 0 || y < 0 || x >= map.mapsize.x || y >= map.mapsize.y) return false;

		if (side == "x" && isRoad(x, y - 1) && isRoad(x - 1, y - 1) && isRoad(x - 2, y - 1)) return true;
		if (side == "x" && isRoad(x, y + 1) && isRoad(x - 1, y + 1) && isRoad(x - 2, y + 1)) return true;
		if (side == "y" && isRoad(x - 1, y) && isRoad(x - 1, y - 1) && isRoad(x - 1, y - 2)) return true;
		if (side == "y" && isRoad(x + 1, y) && isRoad(x + 1, y - 1) && isRoad(x + 1, y - 2)) return true;
		return false;
	};

	//连通道路
	const connectRoad = (side, x, y, start, end) => {
		if (side == "x") {
			for (let i = start; i <= end; i++) {
				if (townmap[i][y] === "") {
					//检查周围是否已经有道路，如果有，则不连通。
					if (hasRoadAround(side, i, y)) continue;

					townmap[i][y] = "road";
				}
			}
		}
		if (side == "y") {
			for (let i = start; i <= end; i++) {
				if (townmap[x][i] === "") {
					//检查周围是否已经有道路，如果有，则不连通。
					if (hasRoadAround(side, x, i)) continue;
					townmap[x][i] = "road";
				}
			}
		}
	};

	//按照缓存的道路，连通道路
	road.forEach((road) => {
		const x = road[1];
		const y = road[2];
		const side = road[0];

		if (side == "N" || side == "S") {
			for (let i = x - 1; i >= 0; i--) {
				if (townmap[i][y] === "road") {
					if (checkRoad("x", x, y, i + 1, x - 1)) {
						connectRoad("x", x, y, i + 1, x - 1);
					}
				}
			}

			for (let i = x + 1; i < map.mapsize.x; i++) {
				if (townmap[i][y] === "road") {
					if (checkRoad("x", x, y, x + 1, i - 1)) {
						connectRoad("x", x, y, x + 1, i - 1);
					}
				}
			}
		}

		for (let i = y - 1; i >= 0; i--) {
			if (townmap[x][i] === "road") {
				if (checkRoad("y", x, y, i + 1, y - 1)) {
					connectRoad("y", x, y, i + 1, y - 1);
				}
			}
		}
		for (let i = y + 1; i < map.mapsize.y; i++) {
			if (townmap[x][i] === "road") {
				if (checkRoad("y", x, y, y + 1, i - 1)) {
					connectRoad("y", x, y, y + 1, i - 1);
				}
			}
		}
	});

	//打印地图
	printMap(townmap);

	return townmap;
}

export function printMap(map: string[][]) {
	const printmap = [];
	for (let i = 0; i < map.length; i++) {
		let line = "";
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j] === "" || map[i][j] === ".") line += " ";
			else if (map[i][j] === "road") line += ".";
			else line += map[i][j][0];
		}
		printmap.push(line);
	}

	console.log(printmap.join("\n"));
}

export function printMapFromData(map) {
	const mapdata = mapToMapData(map.mapdata, map.mapsize.x, map.mapsize.y);
	printMap(mapdata);
}

//计算两个地点之间的移动距离
export function Distance(pos1: iPos, pos2: iPos) {
	return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

//根据两个地点的坐标，以及道路连接情况，计算两个地点之间的移动距离
export function DistanceByMap(pos1: iPos, pos2: iPos, map: string[][]) {
	const road = [];
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j] === "road") road.push({ x: i, y: j });
		}
	}
	const roadDistance = road.map((road) => {
		return Distance(pos1, road) + Distance(pos2, road);
	});
	return Math.min(...roadDistance);
}

//将地图数据转换为地图对象
export function compressMapData(mapData) {
	var map = {};
	for (var i = 0; i < mapData.length; i++) {
		for (var j = 0; j < mapData[i].length; j++) {
			if (mapData[i][j] != "") {
				if (map[mapData[i][j]] == undefined) {
					map[mapData[i][j]] = [];
				}
				map[mapData[i][j]].push([j, i]);
			}
		}
	}
	return map;
}

//将地图对象转换为地图数据
export function mapToMapData(map, xsize, ysize) {
	var mapData = [];
	for (var i = 0; i < xsize; i++) {
		mapData[i] = [];
		for (var j = 0; j < ysize; j++) {
			mapData[i][j] = "";
		}
	}
	for (var key in map) {
		for (var i = 0; i < map[key].length; i++) {
			mapData[map[key][i][1]][map[key][i][0]] = key;
		}
	}
	return mapData;
}

Object.defineProperties(window, {
	Maps: { value: Maps },
	Distance: { value: Distance },
	TownMap: { value: townMap },
	Locations: { value: location },
	GenerateMap: { value: GenerateMap },
	DistanceByMap: { value: DistanceByMap },
	printMap: { value: printMap },
	compressMapData: { value: compressMapData },
	mapToMapData: { value: mapToMapData },
	printMapFromData: { value: printMapFromData },
});
