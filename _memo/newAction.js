Action.getInputType = function (actionId, selection) {
	//判定指令属于什么类型，以便后续处理。
	const { type, actPart, targetPart, option, event } = Action.data[actionId];

	if (event) return "event";

	switch (type) {
		case "体位":
			return "selectPose";
		case "接触":
		case "触手":
		case "逆位":
			return "touchAction";
		case "道具":
			if (actPart || targetPart) return "useEquipItem";
			else return "useOneTimeItem";
		default:
			if ((actPart || targetPart) && !option.has("doStraight")) return "OptionalAction";

			if (groupmatch(type, "常规", "交流") || option.has("doStraight")) return "oneAction";
	}

	return "command";
};

const checkSelectableParts = function (actionId, filterMode) {
	const { actPart, targetPart, filter } = Acion.data[actionId];

	//检测是否存在可选部位，以及是否在Using占用中。
	const selectAbleParts = [];
	if (actPart && (!filterMode || filterMode == 1)) {
		actPart.forEach((part) => {
			if (Action.globalPartAble(actionId, part, pc) && filter(part)) selectAbleParts.push(part);
		});
	}

	if (targetPart && (!filterMode || filterMode == 2)) {
		targetPart.forEach((part) => {
			if (Action.globalPartAble(actionId, part, tc) && filter(part)) {
				selectAbleParts.push(part);
			}
		});
	}

	return selectAbleParts;
};

Action.onInput = function (actionId, inputType, selection) {
	const { event, type, option, name } = Action.data[actionId];

	//先记录玩家的输入。如果id或对象不同，就重置记录。
	//type 是体位时则无视id的变化。
	if ((type !== "体位" && T?.select?.id !== actionId) || T?.select?.target !== tc || T?.select?.actor !== pc) {
		T.select = {
			id: actionId,
			actor: pc,
			target: tc,
		};
	}

	//如果是事件，直接执行事件并刷新界面。
	if (inputType == "event") {
		event();
		Action.redraw();
		return;
	}

	//如果是一次性动作，直接准备进入下一步 。
	if (groupmatch(inputType, "oneAction", "useOneTimeItem", "command")) {
	}

	//如果是接触性动作或需等待选择动作部位，则先检测可选项。
	if (groupmatch(inputType, "touchAction", "useEquipItem", "OptionalAction")) {
		let able1 = checkSelectableParts(actionId, 1);
		let able2 = checkSelectableParts(actionId, 2);
		const hasOption = () => {
			let actOption = able1.length > 1 && !cond.justHands(able1);
			let tarOption = able2.length > 1 && !cond.justHands(able2);

			if (able1.length <= 1 && able2.length <= 1) return 0;
			return actOption || tarOption;
		};

		//如果有可选项就先返回，并刷新界面。
		if (hasOption()) {
			Action.redraw();
			return;
		}

		//如果没有可选项，就自动选择部位，并准备执行。
		T.select.actPart = able1[0];
		T.select.tgPart = able2[0];
	}

	//选择动作部位。如果存在可选的目标部位就等待玩家选择，否则自动选择。
	if (inputType == "partsOption-actor") {
		//先记录玩家的输入。
		T.select.actPart = selection;

		let able = checkSelectableParts(actionId, 2);
		if (able.length > 1 && !cond.justHands(able)) {
			Action.redraw();
			return;
		}

		//自动选择部位。
		T.select.tgPart = able[0];
	}

	//选择目标部位。
	if (inputType == "partsOption-target") {
		T.select.tgPart = selection;

		//如果存在体位选择，就等待玩家选择。
		if (groupmatch(name, "性交", "逆性交")) {
			Action.redraw();
			return;
		}
	}

	if (inputType == "selectPose") {
		T.select.pose = actionId;
	}

	//确定执行前先保存当前选项。
	T.action = clone(T.select);

	//在控制台输出执行详情
	console.log("执行动作：" + name, "\n", T.select, T.action);

	//进入执行检测阶段。
	Action.check(actionId);
};

Action.initMode = function () {
	T.actionTypeFilter = "all";
};

Action.initChara = function () {
	Using[cid] = {};

	if (cid == "m0") {
		const num = F.tentaclesNum();
		Using[cid].tentacles = [];

		for (let i = 0; i < num; i++) {
			Using[cid].tentacles.push({ action: "", target: "", onPart: "" });
		}
	}
};

//清除持续中的动作状态
Action.unset = function (cid, part, id) {
	if (part == "tentacles") {
		Using[cid][part][id] = { action: "", target: "", onPart: "" };
		return;
	}

	Using[cid][part] = { action: "", target: "", onPart: "", actor: "" };
};
