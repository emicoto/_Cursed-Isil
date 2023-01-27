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
