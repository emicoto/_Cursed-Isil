//全局过滤器
Action.globalFilter = function (id) {
	const data = Action.data[id];
	//缩略一下
	const s = T.select;

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
	if (id.match(/^use\S+/) && Flag.mode < 3) return 0;

	//占用中。解除不在这里。不过可以切换部位
	if (s.tgPart && Using[pc][s.tgPart]?.action == id) return 1;
	if (s.tgPart && Using[pc][s.tgPart]?.action !== "") return 0;

	//角色侧的控制。
	const kojo = Kojo.get(tc, "filter");
	if (kojo && !kojo()) return 0;

	//特定分类批处理
	switch (data.type) {
		case "触手":
			//不是触手模式，或时间段不对，就不显示
			if (!Flag.master || (data.mode > 2 && V.date.time < 1200)) return 0;

			//如果没有空余触手，就不显示
			if (cond.hasUnuseTentacle() == -1) return 0;
			break;

		case "接触":
			//交流深度不足
			if (Flag.mode < 2) return 0;

			//对象npc清醒，同时解禁等级不足
			if (!cond.isUncons(target) && data.mode > Cflag[tc].touchLv + 0.5) return 0;
			break;

		case "逆位":
			//不是逆位模式，或者pc不是受
			if (V.mode !== "reverse" && player.type == "tachi") return 0;
			break;

		case "常规":
			//当前地点不符合
			if (!V.location.tags.has(data.tags)) return 0;
			//不是常规模式，同时指令不允许在train模式下使用
			if (Flag.mode > 0 && !data?.option?.has("canTrain")) return 0;
			break;

		case "交流":
			//模式不对
			if (Flag.mode < 1) return 0;
			//不是交流模式，同时指令不允许在train模式下使用
			if (Flag.mode > 1 && !data?.option?.has("canTrain")) return 0;
			break;

		case "体位":
			//只会在选择插入的时候出现
			if (groupmatch(T.selectAct, "t8", "r1") === false) return 0;
			break;

		//要有对应道具才行
		case "道具":
		//if(!F.iventory('find', id))
		//   return 0
		case "魔法":
		case "命令":
			//选了过滤器时才显示
			if (data.type !== T.actionTypeFilter) return 0;
			break;
	}

	return 1;
};

Action.globalCheck = function (id) {
	const data = Action.data[id];

	switch (data.type) {
		case "触手":
			if (!cond.isFallen(target) && !cond.isUncons(target) && !Flag.aware) {
				T.reason += "【未堕落的对象】";
				return 0;
			}
	}

	return 1;
};

Action.globalOrder = function (id) {
	const data = Action.data[id];
	let order = 0;

	switch (data.type) {
		case "接触":
			order = S.orderConfig.touch;
			break;
		case "体位":
			order = S.orderConfig.pose;
			break;
		case "道具":
			if (data?.option?.has("toy")) {
				order = S.orderConfig.sextoy;
			}
			break;
		case "触手":
			if (!cond.isFallen(target)) {
				T.orderMsg += "【未堕落(-30)】";
				T.order -= 30;
			}
			if (pc == "Isil" && tc == pc && Flag.aware) {
				T.orderMsg += "【对宿主的强制调教(+50)】";
				T.forceOrde += 50;
			}
			order = S.orderConfig.tentacles;
			break;
	}

	return order;
};

Action.globalPartAble = function (id, part, cid) {
	const data = Action.data[id];
	const chara = C[cid];

	//初始化中
	if (!Using[cid][part]) return 1;

	switch (part) {
		case "critoris":
			if (chara.gender !== "female") return 0;
		case "penis":
			if (chara.gender == "female") return 0;
		case "vagina":
			if (chara.gender == "male") return 0;
		case "anal":
		case "urin":
		case "nipple":
			//隐私区需要更高的接触等级
			if (Flag.mode < 3) return 0;
	}

	return Using[cid][part].action == "" || Using[cid][part].action == id;
};
