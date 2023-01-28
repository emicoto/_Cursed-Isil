import { GenerateMap } from "./MapPath";
import { Dict, maptype, maptags, rarity, dirside, spotType, tileType } from "./types";

export interface iPos {
	x: number;
	y: number;
}

export interface iSpotsInfo {
	pos: iPos[];
	dside?: dirside | string;
	tileType?: tileType | string;
	spotType?: spotType | string;
}
//地图基类
export interface GameMap {
	GroupId: string; //父级id
	MapId: string; //绝对id
	spotId: string; //相对id

	type: maptype;
	tags: maptags[];

	name?: string[];
	events?: Function;
	staticNPC?: Function;
	portal?: {
		exist: boolean;
		spots: Array<string>;
		points: Array<iPos>;
	};

	spots?: Map<string, iSpotsInfo>;
	mapsize?: iPos;
	mapdata?: any;
}

//地图格子数据
export interface squareData {
	p: string; //显示的图片or文字
	t: tileType | string; //地形类型
	npc: string[]; //在这个点上的npc
	enemy: string[]; //在这个点上的敌人
	loot: string[]; //在这个点上的物品
	visit: number; //被访问的次数
	able: 0 | 1; //是否可以通过
}

export interface Boards extends GameMap {
	staticEntry: string; //固定入口
	entries: string[]; //其他入口
	[key: string]: Spots | any; //地图上可访问的地点
}

export interface Spots extends GameMap {
	rooms?: string[];

	locked?: boolean;
	opentime?: {
		weekday: number[] | "allday";
		open: number;
		close: number;
	};
}
