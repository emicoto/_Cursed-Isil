//const { Maps } = require("Code/game/map");

F.getLocationMsg = function (fullId) {
	let title = `Msg_Spots_${fullId}`;
	if (Story.has(title)) return Story.get(title).text;
	else return `<span class="error'>Error: No message for ${fullId}."</span>`;
};

worldMap.get = function (path) {
	const _path = path.split(".");
	let _map = worldMap;
	for (let i = 0; i < _path.length; i++) {
		if (_map[_path[i]] == undefined) {
			console.log(`Error: No such path ${path} in worldMap.`);
			return;
		}
		_map = _map[_path[i]];
	}
	return _map;
};

//获取地点信息
F.iniLocation = function (path) {
	const raw = worldMap.get(path);
	let { groupId, name, entry, yourHome, portal } = raw;

	const copylist = [
		"groupId",
		"mapId",
		"tags",
		"placement",
		"portal",
		"yourHome",
		"hasParking",
		"hasRailcar",
		"hasAirship",
		"loot",
		"busiess",
		"rooms",
		"entry",
	];

	const local = {};

	copylist.forEach((item) => {
		if (raw[item]) local[item] = clone(raw[item]);
	});

	if (!entry) {
		local.entry = groupId;
	}
	local.name = name[0].split("|")[0];
	local.printname = name[0].split("|").join("");
	local.chara = [];

	if (yourHome) {
		local.placement = Locations.countPlacement(V.home.placement);
	}

	//传送点有可能初始时不存在，但会在后续事件中出现
	if (!portal) {
		local.portal = {
			exist: false,
			points: [],
		};
	}

	let pos = { x: 0, y: 0 },
		posId = path.split(".")[1];
	if (groupId !== "CommonSpots" && groupId !== "") {
		pos = worldMap[groupId].spots.get(posId).pos;
	}

	local.pos = pos;
	local.posId = posId;

	return local;
};

F.createLocationLink = function () {
	T.map = Maps.getBoard(V.location.groupId);
	$("#travel").html("");
	//先把所有地点都列出来
	const list = Array.from(worldMap[V.location.groupId].spots)
		.filter((spot) => spot[0] !== V.location.posId)
		.map((spot) => [V.location.groupId + "." + spot[0], spot[1].pos, spot[1].tags]);

	//再把房间和出入口加进去
	if (V.location.rooms) {
		V.location.rooms.forEach((room) => {
			list.push([V.location.mapId + "." + room, "isRoom"]);
		});
	}

	if (V.location.entry !== V.location.groupId) {
		let fullId = V.location.groupId + "." + V.location.entry;
		list.push([fullId, "isEntry"]);
	}

	//整理出新的列表。 录入顺序 [地点id, 移动时间]
	const spots = [];

	list.forEach((item) => {
		if (item[1].has && item[1].has("isRoom", "isEntry")) {
			spots.push([item[0], 1]);
		} else if (item[2].has("invisible", "inaccessible")) {
		} else {
			spots.push([item[0], Math.floor(findPath(T.map, V.location.pos, item[1]).length * 1.2 + 0.5)]);
		}
	});

	//按移动时间排序
	spots.sort((a, b) => a[1] - b[1]);

	//生成链接
	const link = spots
		.map((item) => {
			const fullId = item[0];
			const locdata = worldMap.get(fullId);
			if (locdata.tags.has("上锁")) return;
			//时间 0:00
			const time = `${Math.floor(item[1] / 60)}:${(item[1] % 60).toString().padStart(2, "0")}`;
			const name = worldMap.get(fullId).name[0].split("|").join("");

			const link = `<<link '${name}　${time}' 'MainLoop'>> <<run F.travleTo('${fullId}'); V.aftermovement = true; >><<passtime ${item[1]}>><</link>>`;
			return `<div class="travel">${link}</div>`;
		})
		.join("");

	new Wikifier(null, `<<replace #travel>>${link}<</replace>>`);
};

F.travleTo = function (fullId) {
	V.location = F.iniLocation(fullId);
};
