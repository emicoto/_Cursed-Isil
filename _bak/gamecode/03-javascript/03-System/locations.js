//const { Maps } = require("Code/game/map");

F.getLocationMsg = function (fullId) {
	const data = GameMap.get(fullId);
	if (!data) return `<span class="error'>Error: No spots data. ${fullId}."</span>`;

	let title = `Msg_Spots_${fullId}`;

	if (data.spotType.has("common")) {
		let id = fullId.split(".").pop();
		title = `Msg_Spots_CommonSpots_${id}`;
	}

	if (Story.has(title)) return Story.get(title).text;
	else return `<span class="error'>Error: No message found. title: ${title} id: ${fullId}. "</span>`;
};

//获取地点信息, boardId 为地图棋盘Id， path就是绝对id，
//spotId为地点在棋盘上的id。 roomId为当前棋盘格子内部的房间id
//entry是链接上级地图的入口id
//所有的棋盘都在worldMap中有个快捷访问的路径，比如worldMap.Academy。
F.iniLocation = function (path) {
	const raw = GameMap.get(path);
	let { boardId, name, entry, Home, portal, roomId, spotId } = raw;
	let parent = raw.getParent();
	let topParent = GameMap.get(raw.spotId);

	const copylist = [
		"boardId",
		"tags",
		"placement",
		"portal",
		"hasParking",
		"hasRailcar",
		"hasAirship",
		"loot",
		"openhour",
		"rooms",
		"owner",
		"entry",
		"spotId",
		"spotType",
		"roomId",
		"mapType",
		"loot",
	];

	const local = {};
	local.mapId = path;
	local.parentId = parent.id || boardId;

	copylist.forEach((item) => {
		if (raw[item]) local[item] = clone(raw[item]);
	});

	//如果没有entry，就用父地图的entry
	if (!entry) {
		local.entry = parent.staticEntry || parent.id || boardId;
	}

	//地点名字的显示。如果有|，就用|分割，第一部分是判断用的名字，后面的是补充到显示上的名字
	//这样的话，就能用比较简单的方式来判断角色所在建筑群组。比如"宿舍｜S303"，就能用"宿舍"来判断是否在宿舍内
	local.name = name[0].split("|")[0];
	local.printname = name[0].split("|").join("");
	local.chara = [];

	//如果是在家里，就更新成家里的摆设信息
	if (Home || parent?.Home || topParent?.Home) {
		local.atHome = true;
		if (V.home.placement[roomId]) local.placement = Spots.countPlacement(V.home.placement[roomId].obj);
		if (V.home.placement[spotId]) local.placement = Spots.countPlacement(V.home.placement[spotId].obj);
	}

	//传送点有可能初始时不存在，但会在后续事件中出现
	if (!portal) {
		local.portal = {
			exist: false,
			points: [],
		};
	}

	//获取地点的坐标，和在spots表中的id
	let pos = { x: 0, y: 0 },
		posId = spotId.split(".")[1] || spotId;
	if (boardId !== "CommonSpots" && boardId !== "") {
		pos = worldMap[boardId].spots.get(posId).pos[0];
	}

	local.pos = pos;
	local.posId = posId;

	return local;
};

F.createLocationLink = function () {
	const { boardId, posId } = V.location;
	const mapdata = GameMap.get(boardId);
	T.map = GameMap.getBoard(boardId);
	$("#travel").html("");

	//先把所有地点都列出来
	const list = Array.from(worldMap[boardId].spots)
		.filter((spot) => spot[0] !== posId)
		.map((spot) => [boardId + "." + spot[0], spot[1].pos[0], spot[1].spotType]);

	//再把房间和出入口加进去
	if (V.location.rooms) {
		V.location.rooms.forEach((room) => {
			list.push([V.location.mapId + "." + room, "isRoom"]);
		});
	}

	//如果是出入口，就把出入口加进去
	if (V.location.entry !== V.location.mapId) {
		list.push([V.location.entry, "isEntry"]);
	}

	//整理出新的列表。 录入顺序 [地点id, 移动时间]
	const spots = [];
	console.log(list);

	for (const item of list) {
		//console.log(item);
		const id = item[0];
		const locdata = GameMap.get(id);
		const squaredata = getByPath(V.mapdata, id);

		//在这里时进行条件筛选。如果不符合条件，就不会出现在列表中。

		//这种地点只能通过传送门到达。
		if (
			locdata.tags.has("封闭", "异空间") ||
			(typeof item[2]?.has === "function" && item[2].has("secretAre", "inaccesible"))
		) {
			continue;
		}
		//如果是锁着的私室，就不会出现在列表中。
		if (locdata.visitCond && !locdata.visitCond()) {
			continue;
		}
		if (locdata.tags.containsAll("私人", "上锁") && squaredata.locked) {
			continue;
		}

		if (item[1].has && item[1].has("isRoom", "isEntry")) {
			spots.push([item[0], 1]);
		} else {
			spots.push([item[0], Math.floor(findPath(T.map, V.location.pos, item[1]).length * 1.2 + 0.5)]);
		}
	}

	//按移动时间排序
	spots.sort((a, b) => a[1] - b[1]);

	//console.log(spots);

	//生成链接
	const link = spots
		.map((item) => {
			const fullId = item[0];
			//时间 0:00
			const time = `${Math.floor(item[1] / 60)}:${(item[1] % 60).toString().padStart(2, "0")}`;
			const name = GameMap.get(fullId).name[0].split("|").join("");

			const link = `<<link '${name}　${time}' 'MainLoop'>> <<run F.travleTo('${fullId}'); V.aftermovement = true; >><<passtime ${item[1]}>><</link>>`;
			return `<div class="travel">${link}</div>`;
		})
		.join("");

	new Wikifier(null, `<<replace #travel>>${link}<</replace>>`);
};

F.travleTo = function (fullId) {
	V.lastLocation = clone(V.location);
	V.location = F.iniLocation(fullId);
};

F.DisplayMiniMap = function () {
	//以玩家坐标为中心，在9x9的范围内显示周围地图。
	const mapdata = GameMap.get(V.location.boardId);
	const map = GameMap.getBoard(mapdata);
	const pos = V.location.pos;
	const size = 9;
	const start = { x: pos.x - Math.floor(size / 2), y: pos.y - Math.floor(size / 2) };
	const end = { x: pos.x + Math.floor(size / 2), y: pos.y + Math.floor(size / 2) };
	let output = "";
};
