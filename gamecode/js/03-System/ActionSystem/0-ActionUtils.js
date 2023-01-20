Action.typeFilter = function (...types) {
	return Object.values(Action.data).filter((action) => types.includes(action.type));
};

/**
 *
 * @param {'cancel' | 'stop'} mode
 */
Action.stop = function (id, mode) {
	T.stopAct = id;
	$("action").trigger(mode);
};

Action.phase = function (mode) {
	$("action").trigger(mode);
};

Action.checkOrder = function (btn) {
	if (V.system.debug) return "succeed";
	if (T.orderGoal == 0) return "succeed";

	if (T.orderGoal > 0 && T.order >= T.orderGoal) return "succeed";

	if (T.order + player.stats.LUK[1] >= T.orderGoal && (random(100) <= player.stats.LUK[1] * 1.5 || btn))
		return "luck succeed";

	if (T.order + T.forceOrder >= T.orderGoal) return "force succeed";

	return "failed";
};

Action.able = function (id, part, btn) {
	if (btn) Action.clearCheck();
	const data = Action.data[id];
	return Action.globalCheck(id) && data.check(part);
};

Action.order = function (id, part, btn) {
	if (btn) Action.clearCheck();
	const data = Action.data[id];
	T.orderGoal = Action.globalOrder(id) + data.order(part);
	return Action.checkOrder(btn);
};

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

Action.SelectableParts = function (actionId, filterMode) {
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
