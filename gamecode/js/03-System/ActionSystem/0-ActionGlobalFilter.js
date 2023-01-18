Action.globalFilter = function (id) {
	const data = Action.data[id];

	//只有你！
	const onlyU = pc === tc;

	//不需要对象的单独指令id
	const noTarget = [];
	//不需要对象的分类，如果有例外处理就在指令内部设置。
	const noTargetType = ["常规", "魔法", "道具", "自慰", "其他", "固有"];

	//总之先按照分类过滤
	if (
		!groupmatch(data.type, "目录", "常规", "固有") &&
		T.actionTypeFilter !== "all" &&
		T.actionTypeFilter !== data.type
	)
		return 0;

	//pc切换为触手时只能选择触手以及系统指令
	if (pc == "m0" && !groupmatch(data.type, "触手", "固有", "目录", "其他")) return 0;

	//使用部位过滤器只会在接触以上模式出现
	if (id.match(/^use\S+/) && Flag.mode < 2) return 0;

	//占用中。解除倒是没问题。
	if (T.selectActPart && Using[pc][T.selectActPart]?.act == id) return 1;
	if (T.selectActPart && Using[pc][T.selectActPart]?.act !== "") return 0;

	//选择过滤器中、
	if (T.actPartFilter !== "all" && data.usePart && !data.usePart.has(T.actPartFilter)) return 0;

	//角色侧的控制。
	const kojo = Kojo.get(tc, "filter");
	if (kojo && !kojo()) return 0;

	//特定分类批处理
	switch (data.type) {
		case "触手":
			if (!Flag.master || (data.mode > 2 && V.date.time < 1200)) return 0;
			break;

		case "接触":
			if (Flag.mode < 2) return 0;
			if (!F.uncons(target) && data.mode > Cflag[tc].touchLv + 0.5) return 0;
			break;

		case "逆位":
			if (V.mode !== "reverse") return 0;
			break;

		case "常规":
			if (!V.location.tags.has(data.tags)) return 0;
			if (Flag.mode > 0 && !data?.option?.has("canTrain")) return 0;
			break;

		case "交流":
			if (Flag.mode < 1) return 0;
			if (Flag.mode > 1 && !data?.option?.has("canTrain")) return 0;
			break;

		case "体位":
			if (groupmatch(T.selectAct, "t8", "r1") === false) return 0;
			break;

		//要有对应道具才行
		case "道具":
		//if(!F.iventory('find', id))
		//   return 0
		case "魔法":
		case "命令":
			if (data.type !== T.actionTypeFilter) return 0;
			break;
	}

	return 1;
};

Action.globalCheck = function (id) {
	const data = Action.data[id];

	switch (data.type) {
		case "触手":
			if (!F.isFallen(target) && !F.uncons(target) && !Flag.aware) {
				T.reason += "【未堕落的对象】";
				return 0;
			}
	}

	return 1;
};

Action.globalOrder = function (id) {
	const data = Action.data[id];

	switch (data.type) {
		case "触手":
			if (!F.isFallen(target)) {
				T.orderMsg += "【未堕落(-30)】";
				T.order -= 30;
			}
			if (pc == "Isil" && tc == pc && Flag.aware) {
				T.orderMsg += "【对宿主的强制调教(+50)】";
				T.forceOrde += 50;
			}
			break;
	}

	return 0;
};

Action.globalPartAble = function (id, part, cid) {
	const data = Action.data[id];
	const chara = C[cid];

	if (chara.gender == "female" && part == "penis") return 0;

	if (chara.gender == "male" && part == "vagina") return 0;

	return Using[cid][part].act == "" || Using[cid][part].act == id;
};
