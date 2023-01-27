import { GenerateMap } from "./MapPath";
import { Dict, maptype, maptags, rarity, locationside } from "./types";
export interface iPos {
	x: number;
	y: number;
}

export interface Maps {
	mapId: string; //绝对id
	groupId?: string; //父级id
	type: maptype;
	tags: maptags[];

	name?: string[];
	description?: Function;
	events?: Function;
	portal?: {
		exist: boolean;
		points: Array<string | iPos>;
	};

	spots?: Map<string, { pos: iPos; side?: string; tags?: string[] }>;
	mapsize?: iPos;
	mapdata?: any;
	maptag?: string[];
}

export interface townMap extends Maps {
	entry: string[];
	locations?: Dict<Locations>;
}

export interface Locations extends Maps {
	rooms?: string[];
	business?: {
		weekday: number[] | "allday";
		open: number;
		close: number;
	};
	side?: "室内" | "室外" | "户外";
	yourHome?: boolean;
	hasParking?: boolean;
	hasRailcar?: boolean;
	hasAirship?: boolean;
	loot?: Dict<string[], rarity>;
	placement?: string[];
	maxslot?: number;
	[key: string]: any;
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

declare const worldMap: typeof window.worldMap;

// 地图基类
export class Maps {
	public static get(type, mapId, ...args) {
		const data = worldMap[mapId];
		if (type == "pos") {
			return data.spots.get(args[0]).pos;
		}
		if (type == "spots") {
			return data.spots.get(args[0]);
		}
		if (data[type]) {
			return data[type];
		}
	}
	public static getBoard(mapId) {
		const data = worldMap[mapId];
		return mapdataToBoard(data.mapdata, data.mapsize.x, data.mapsize.y);
	}
	public static convertData(mapdata) {
		return boardToMapdata(mapdata);
	}
	public static print(map: string[][]) {
		printMap(map);
	}
	public static copy(map, groupId, mapId) {
		let newMap;
		if (map.type == "town") {
			newMap = new townMap(map.mapId, map.groupId, { name: map.name, entry: map.entry, xy: map.mapsize }, map);
		}

		if (map.type == "location" || map.type == "room") {
			newMap = new Locations(map.mapId, map.name, map.groupId, map.side, map);
		}
		newMap.groupId = groupId;
		newMap.mapId = mapId;
		return newMap;
	}

	constructor(name: string[], type: maptype, map?: Maps) {
		if (map) {
			for (let key in map) {
				this[key] = map[key];
			}
		} else {
			this.name = name;
			this.type = type;
			this.tags = [];
			this.events = function () {
				return "";
			};
		}
	}
	setName(name) {
		this.name = name;
		return this;
	}

	Events(callback) {
		this.events = callback;
		return this;
	}
	Tags(...tags: maptags[]) {
		this.tags = tags;
		if (tags.includes("户外")) {
			this.tags.push("开阔");
		}
		if (tags.has("室外", "户外") && !tags.includes("遮顶")) {
			this.tags.push("露天");
		}
		return this;
	}
	getParent() {
		if (!this.groupId) return null;
		const path = this.mapId.split(".");
		path.pop();
		let parent = worldMap;
		for (let i = 0; i < path.length; i++) {
			parent = parent[path[i]];
		}
		if (parent) return parent;

		return null;
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
		this.mapdata = boardToMapdata(rawdata);
		return this;
	}
	Console() {
		printMapFromData(this);
	}
}

// 城镇地图
export class townMap extends Maps {
	constructor(mapid: string, groupid: string, { name, entry, xy }, map?: townMap) {
		super(name, "town");
		if (map) {
			for (let key in map) {
				this[key] = map[key];
			}
		} else {
			if (!xy[0]) xy[0] = 13;
			if (!xy[1]) xy[1] = xy[0];

			this.mapId = mapid; //城镇的id
			this.groupId = groupid; //上级地图的id
			this.entry = entry;
			this.spots = new Map();
			this.mapsize = { x: xy[0], y: xy[1] };
		}
	}
	Spots(...spots: Array<[string, number, number, string?]>) {
		spots.forEach((spot) => {
			// x,y坐标的修正。录入时以中心为原点，但是实际上是以左上角为原点。加上0,0的坐标，mapsize应该是单数。
			spot[1] += Math.floor(this.mapsize.x / 2);
			spot[2] += Math.floor(this.mapsize.y / 2);

			let tags = spot[0].split("|");
			let name = tags[0];
			tags.splice(0, 1);

			this.spots.set(name, { pos: { x: spot[1], y: spot[2] }, side: spot[3], tags: tags });
		});
		return this;
	}
}

// 具体地点
export class Locations extends Maps {
	constructor(mapid, name: string[], group: string, side: "室内" | "室外" | "户外", map?: Locations) {
		super(name, "location");
		if (map) {
			for (let key in map) {
				this[key] = map[key];
			}
		} else {
			this.mapId = group + "." + mapid; //地点的绝对id
			this.groupId = group; //目录的id
			this.side = side;
			this.tags.push(side);
			this.placement = [];
		}
	}
	isRoom() {
		this.type = "room";
		const path = this.mapId.split(".");
		this.entry = path[path.length - 2];
		return this;
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
	AdoptParent() {
		const parent = this.getParent();
		if (parent) {
			this.tags = this.tags.concat(parent.tags);
			this.placement = this.placement.concat(parent.placement);
		}
		return this;
	}
	MaxSlots(number: number) {
		this.maxSlots = number;
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

//将地图数组（棋盘）转换为地图对象
function boardToMapdata(mapData) {
	var map = {};
	for (var x = 0; x < mapData.length; x++) {
		for (var y = 0; y < mapData[x].length; y++) {
			if (mapData[x][y] != "") {
				if (map[mapData[x][y]] == undefined) {
					map[mapData[x][y]] = [];
				}
				map[mapData[x][y]].push([x, y]);
			}
		}
	}
	return map;
}

//将地图对象转换为地图数组（棋盘）
function mapdataToBoard(map, xsize, ysize) {
	var mapData = [];
	for (var i = 0; i < xsize; i++) {
		mapData[i] = [];
		for (var j = 0; j < ysize; j++) {
			mapData[i][j] = "";
		}
	}
	for (var key in map) {
		map[key].forEach((value) => {
			mapData[value[0]][value[1]] = key;
		});
	}
	return mapData;
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

function printMapFromData(map: Maps) {
	const mapdata = mapdataToBoard(map, map.mapsize.x, map.mapsize.y);
	printMap(mapdata);
}

Object.defineProperties(window, {
	Maps: {
		get() {
			return Maps;
		},
	},
	townMap: {
		get() {
			return townMap;
		},
	},
	Locations: {
		get() {
			return Locations;
		},
	},
});
