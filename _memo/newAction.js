ui.createActionBtn = function (currentSelect, outputData) {
	const { id, alterName, type } = outputData;

	//如果有自定义名称，就用自定义名称。
	let name = outputData.name;
	if (alterName) name = alterName();

	//如果是当前选中的，就清除链接并加上选中标记。
	if (currentSelect == id || (type == "目录" && T.actionTypeFilter == id)) {
		return `<div class='actions selectAct'>[ ${name} ]</div>`;
	}

	const inputType = Action.getInputType(id);

	return `<<link '${name}'>><<run Action.onInput('${id}', '${inputType}')>><</link>>`;
};

Action.checkSelectableParts = function (actionId, filterMode) {
	const { usePart, targetPart, filter } = Acion.data[actionId];

	//检测是否存在可选部位，以及是否在Using占用中。
	const selectAbleParts = [];
	if (usePart && (!filterMode || filterMode == 1)) {
		usePart.forEach((part) => {
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

Action.getInputType = function (actionId, selection) {
	//判定指令属于什么类型。如果type为体位直接返回pose。接触、触手、逆位则返回touchAction。
	//穿戴型道具返回useEquipItem
	//有作用部位的道具、魔法、命令则返回OptionalAction
	//其他根据指令option进行判断

	const { type, usePart, targetPart, option, event } = Acion.data[actionId];

	switch (selection) {
		case "usePart":
			return "partsOption-actor";
		case "targetPart":
			return "partsOption-target";
	}

	switch (type) {
		case "体位":
			return "pose";
		case "接触":
		case "触手":
		case "逆位":
			return "touchAction";
		case "道具":
			if (usePart || targetPart) return "useEquipItem";
			else return "useOneTimeItems";
		default:
			if (event) return "event";

			if ((usePart || targetPart) && !option.has("doStraight")) return "OptionalAction";

			if (groupmatch(type, "常规", "交流") || option.has("doStraight")) return "oneAction";
	}

	return "command";
};

Action.onInput = function (actionId, inputType, selection) {
	const { event, type, usePart, targetPart, option, name } = Acion.data[actionId];

	//先记录玩家的输入。
	if (!T.select || T.select.id !== actionId || T.select.tc !== tc) {
		T.select = {
			id: actionId,
			tc: tc,
			inputType,
		};
	}
};
