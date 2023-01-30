import { GenerateMap } from "./MapPath";
import { Dict, maptype, maptags, rarity, dirside, spotType, tileType, boardtype } from "./types";
export interface iPos {
	x: number;
	y: number;
}

//地图点信息
export interface iSpotsInfo {
	pos: iPos[]; //地点位置
	dside?: dirside | string; //可通行方向
	tileType?: tileType | string; //地形类型
	spotType?: spotType | string; //地点类型
}
//地图基类
export interface GameMap {
	boardId: string; //所属棋盘的id
	id: string; //绝对id

	mapType: maptype; //地图类型
	tags: maptags[]; //地图标签

	name?: string[]; //地图中英文名字
	events?: Function; //地图事件
	staticNPC?: Function; //固有NPC
	portal?: {
		//传送点
		exist: boolean;
		points: Array<iPos | string>;
	};
}

//地图格子数据
export interface squareData {
	p: string; //显示的图片or文字
	t: tileType | string; //地形类型
	enemy: string[]; //在这个点上的敌人
	loot: string[]; //在这个点上的物品
	visit: number; //被访问的次数
	able: 0 | 1; //是否可以通过
}

export interface Boards extends GameMap {
	boardType?: boardtype; //地图板块类型
	staticEntry: string; //固定入口
	entries?: string[]; //其他入口

	loot?: Dict<string[], rarity>; //地图掉落
	hunt?: string[]; //狩猎
	enemy?: string[]; //敌人群组

	spots?: Map<string, iSpotsInfo>; //各个地点信息
	mapsize?: iPos; //地图大小
	mapdata?: any; //地图数据
}

export interface FieldMap extends Boards {
	minlevel?: number; //怪物最低等级
	maxLevel?: number; //怪物最高等级

	boss?: string[]; //boss
	floor?: number; //层数
	floors?: Map<number, FieldMap>; //各层地图
	master?: string; //领域之主
}
export interface Spots extends GameMap {
	spotId: string; //所属地点格子的id

	rooms?: string[]; //房间id
	locked?: boolean; //是否上锁
	openhour?: {
		//开放时间
		weekday: number[] | "allday";
		open: number;
		close: number;
	};
	Home?: boolean; //你的家？
	hasParking?: boolean; //有无停靠区
	hasRailcar?: boolean; //有无轨道车
	hasAirship?: boolean; //有无飞艇
	placement?: string[]; //放置物
	roomId: string; //房间id
	owner?: string[]; //房主
	rent?: number; //租金
	visitCond?: Function; //访问条件
	maxslot?: number; //最大容量

	loot?: Dict<string[], rarity>; //地点掉落
	spotType?: spotType; //地点类型
}

export interface DungeonRooms extends Spots {
	roomtype?: string; //房间类型

	enemy?: string[]; //敌人群组
	hunt?: string[]; //狩猎
	treasure?: string[]; //宝箱
	puzzle?: string[]; //谜题
}

declare var worldMap: typeof window.worldMap;

//-------------------->>地图基类<<--------------------
export class GameMap {
	constructor([boardId, id, name]: [string, string, string[]]) {
		this.boardId = boardId;
		this.id = boardId !== "" ? `${boardId}.${id}` : id;
		this.name = name;
		this.tags = [];

		this.events = function () {
			return "";
		};
	}
	//连chain中需要修正名字时用
	setName(name) {
		this.name = name;
		return this;
	}
	//设置地图事件
	Events(callback) {
		this.events = callback;
		return this;
	}
	//设置地图标签
	Tags(...tags: maptags[]) {
		this.tags = this.tags.concat(tags);
		//去重复
		this.tags = [...new Set(this.tags)];
		return this;
	}
	//获取父级id
	getParentId() {
		if (!this.boardId || this.boardId === this.id) {
			return this.boardId;
		}
		const path = this.id.split(".");
		path.pop();
		return path.join(".");
	}
	//获取父级地图数据
	getParent() {
		if (!this.boardId || this.boardId === this.id) {
			return null;
		}
		const id = this.getParentId();
		return GameMap.get(id); //返回父级
	}
	//设置传送点
	setPortal(...points: Array<iPos>) {
		this.portal = {
			exist: true,
			points: points,
		};
		return this;
	}
	//添加传送点
	addPortal(...points: Array<string | iPos>) {
		this.portal.points.push(...points);
		return this;
	}

	//通过路径获取地图数据
	public static get(mapId: string) {
		let path = mapId.split(".");
		let map = worldMap;
		for (let i = 0; i < path.length; i++) {
			try {
				map = map[path[i]];
			} catch (err) {
				console.log("地图路径错误", mapId, path, err);
				return null;
			}
		}
		return map;
	}

	//通过类型获取地图数据
	public static getBy(type, mapdId, ...args) {
		const data = this.get(mapdId);
		if (!data) return null;
		if (type == "pos") {
			return data.spots.get(args[0]).pos;
		}
		if (type == "spots") {
			return data.spots.get(args[0]);
		}
		if (type == "rooms" && data.rooms) {
			return data.rooms;
		}
		if (data[type]) {
			return data[type];
		}
		console.log("地图数据错误", type, mapdId, args);
		return null;
	}

	//获取父级组
	public static getParentGroup(type, boardId) {
		if (!boardId) return null;

		let parent = worldMap;
		let path = boardId.split(".");
		//记录符合条件的父级，返回最后一个
		let parentlist = [];

		for (let i = 0; i < path.length; i++) {
			try {
				parent = parent[path[i]];
				if (parent.mapType === type) {
					parentlist.push(parent);
				}
			} catch (err) {
				console.log("parent not found", path, i, path[i], err);
			}
		}

		if (parentlist.length === 0 && boardId !== "CommonSpots") {
			console.log("parent not found", path, type, boardId);
			return null;
		} else if (boardId === "CommonSpots") {
			console.log("CommonSpots has no parent", boardId);
			return null;
		}
		return parentlist[parentlist.length - 1];
	}

	//获取地图棋盘数据
	public static getBoard(mapId) {
		const data = this.get(mapId);
		if (!data) {
			console.log("地图不存在:", mapId);
			return null;
		}
		if (data.mapType !== "board") {
			console.log("地图类型错误:", mapId);
			return null;
		}
		if (!data.mapdata) {
			console.log("地图数据未设定:", mapId);
			return null;
		}
		return mapdataToBoard(data.mapdata, data.mapsize.x, data.mapsize.y);
	}

	//将棋盘数据转换为地图数据
	public static convertData(mapdata: string[][]) {
		return boardToMapdata(mapdata);
	}

	//在控制台打印地图数据
	public static console(map: string[][]) {
		printMap(map);
	}

	//复制地图数据
	public static copy(map, boardId, mapId) {
		let newMap, parent;
		if (map.mapType === "board") {
			newMap = new Boards(boardId, mapId, { type: map.boardType }, map);
			parent = this.getParentGroup("board", boardId);
		}
		if (map.mapType === "spot" || map.mapType === "room") {
			newMap = new Spots([boardId, mapId, map.name, map.spotType], map);
			parent = this.getParentGroup("spot", boardId);
		}
		if (parent) {
			newMap.boardId = parent.boardId;
			newMap.spotId = parent.id;
		} else {
			newMap.boardId = boardId;
		}
		newMap.id = boardId + "." + mapId;

		return newMap;
	}
}

//创建格子数据模板
export function Square(p: string = "", t: string = "blank", able: number = 0) {
	this.p = p;
	this.t = t;
	this.visit = 0;
	this.able = able;

	this.set = function (key, values) {
		this[key] = values;
	};
}

//-------------------->> 地图棋盘类 <<--------------------
export class Boards extends GameMap {
	constructor(
		mapdId: string,
		boardId: string,
		{
			type,
			name,
			entry,
			main,
			xy,
		}: { type: boardtype; name?: string[]; entry?: string | string[]; main?: string; xy?: [number, number?] },
		map?: Boards
	) {
		super([boardId, mapdId, name]);
		if (map) {
			for (let key in map) {
				this[key] = clone(map[key]);
			}
		} else {
			if (!xy[0]) xy[0] = 13;
			if (!xy[1]) xy[1] = xy[0];

			this.mapType = "board";
			this.boardType = type;

			if (Array.isArray(entry)) {
				this.entries = entry;
				this.staticEntry = main || entry[0];
			} else {
				this.staticEntry = entry;
				this.entries = [entry];
			}

			this.mapsize = { x: xy[0], y: xy[1] };
			this.spots = new Map();
		}
	}

	//设置地点
	Spots(...spots: Array<[string, number, number, string?, spotType[]?]>) {
		spots.forEach((spot) => {
			let x = (spot[1] += Math.floor(this.mapsize.x / 2));
			let y = (spot[2] += Math.floor(this.mapsize.y / 2));

			let info = spot[0].split("|"),
				tileType;
			if (info.length > 1) {
				tileType = info.slice(1).join("|");
			} else {
				tileType = "spot";
			}

			let name = info[0];
			let dside = spot[3];
			let spotType = spot[4].join("|");

			this.spots.set(name, { pos: [{ x, y }], dside, spotType, tileType });
		});
		return this;
	}

	//初始化棋盘
	initBoard() {
		this.mapdata = new Array(this.mapsize.x).fill(0).map(() => new Array(this.mapsize.y).fill(0).map(() => ""));
		this.spots.forEach((spot, name) => {
			let pos = spot.pos[0];
			this.mapdata[pos.x][pos.y] = name;
		});
		return this;
	}

	//生成地图数据
	Generate() {
		const rawdata = GenerateMap(this);
		this.mapdata = boardToMapdata(rawdata);
		return this;
	}

	//在控制台打印地图数据
	console() {
		printMapFromData(this);
	}
}

//---------------------->> 地点类 <<----------------------//
export class Spots extends GameMap {
	constructor([boardId, mapId, name, type]: [string, string, string[], spotType], map?: Spots) {
		// 预处理，获取父级
		let parent,
			id = boardId + "." + mapId;
		if (type.has("room")) {
			parent = GameMap.getParentGroup("spot", boardId);
			if (parent?.spotType) type = (parent.spotType + "|" + type) as spotType;
			boardId = parent?.boardId || boardId;
		} else {
			parent = GameMap.getParentGroup("board", boardId);
		}

		//创建
		super([boardId, mapId, name]);
		if (map) {
			for (let key in map) {
				this[key] = clone(map[key]);
			}
		} else {
			this.boardId = boardId;
			this.mapType = "spot";
			this.spotType = type;
			this.spotId = mapId;
			this.placement = [];
			this.tags = [];

			//如果是房间，修正分类
			if (type.has("room")) {
				this.roomId = mapId.split(".").pop();
				this.spotId = parent?.id || mapId;
				this.id = id;
				this.mapType = "room";
			}

			this.init();
		}
	}

	//初始化标签
	init() {
		const types = this.spotType.split("|");
		const typeTags = {
			building: ["室内"],
			buildingEntry: ["室外"],
			gate: ["室外", "检查点"],
			mapEntry: ["地图接口"],
			transport: ["室外", "交通"],
			portal: ["室外"],
			shopAlley: ["商店街", "室外"],
			park: ["室外", "休息区"],
			field: ["开阔", "室外"],
			float: ["室外", "悬浮", "开阔"],
			private: ["私人", "上锁"],
			room: ["室内"],
			secretArea: ["隐蔽", "封闭"],
			ground: ["室外", "开阔", "活动"],
			house: ["室内", "个人", "休息区"],
		};
		types.forEach((type) => {
			if (typeTags[type]) {
				this.tags.push(...typeTags[type]);
			}
		});

		const parent = GameMap.getParentGroup("board", this.boardId);
		if (parent?.boardType) {
			switch (parent.boardType) {
				case "forest":
					if (this.tags.has("室外")) {
						this.tags.push("森林");
					}
					break;
				case "ocean":
					if (this.tags.has("室外")) {
						this.tags.push("水下");
					}
					break;
				case "mountain":
					if (this.tags.has("室外")) {
						this.tags.push("山岳");
					}
					break;
				case "dungeon":
					this.tags.push("地下");
					break;
				case "maze":
					this.tags.push("异空间");
					break;
				case "floatingIsland":
				case "field":
					if (this.tags.has("室外")) {
						this.tags.push("开阔");
					}
					break;
				case "academy":
					if (!this.tags.has("异空间")) {
						this.tags.push("魔网");
					}
			}
		}
		//最后去一下重复的tag
		this.tags = [...new Set(this.tags)];

		return this;
	}
	//设置房间
	Rooms(...rooms: string[]) {
		this.rooms = rooms;
		return this;
	}
	//设置开放时间
	OpenHour(weekday: number[] | "allday", open: number, close: number) {
		this.openhour = {
			weekday: weekday,
			open: open,
			close: close,
		};
		return this;
	}
	//设置家flag
	isHome() {
		this.Home = true;
		return this;
	}
	//设置停靠点
	Parking() {
		this.hasParking = true;
		return this;
	}
	//设置轨道车
	Railcar() {
		this.hasRailcar = true;
		return this;
	}
	//设置飞艇
	Airship() {
		this.hasAirship = true;
		return this;
	}
	//设置搜刮品
	Loot(loot: Dict<string[], rarity>) {
		this.loot = loot;
		return this;
	}
	addLoot(loot: Dict<string[], rarity>) {
		for (const key in loot) {
			if (!this.loot[key]) {
				this.loot[key] = [];
			}
			this.loot[key].push(...loot[key]);
			//去重
			this.loot[key] = [...new Set(this.loot[key])];
		}
		return this;
	}
	//设置放置品
	Placement(...placement: string[]) {
		this.placement = this.placement.concat(placement);
		//去重
		this.placement = [...new Set(this.placement)];
		return this;
	}
	//继承父类的标签
	AdoptParent() {
		const parent = this.getParent();
		if (parent) {
			this.tags = this.tags.concat(parent.tags);
			this.placement = this.placement.concat(parent.placement);
		}
		return this;
	}
	//继承父类的搜刮品
	AdoptLoot() {
		const parent = this.getParent();
		if (parent) {
			this.addLoot(parent.loot);
		}
		return this;
	}
	//设置最大容量
	MaxSlots(number: number) {
		this.maxslot = number;
		return this;
	}
	//设置可访问条件
	Visitable(callback) {
		this.visitCond = callback;
		return this;
	}
	//设置房主
	setOwner(...owner: string[]) {
		this.owner = owner;
		return this;
	}
	//设置租金就代表可以租用
	Rentable(cost: number) {
		this.rent = cost;
		return this;
	}

	//计算房间放置品
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

function printMapFromData(map) {
	const mapdata = mapdataToBoard(map, map.mapsize.x, map.mapsize.y);
	printMap(mapdata);
}

Object.defineProperties(window, {
	printMap: { value: printMap },
	printMapFromData: { value: printMapFromData },
	GameMap: { value: GameMap },
	Boards: { value: Boards },
	Spots: { value: Spots },
});
