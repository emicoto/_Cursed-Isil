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
	if (btn) F.initCheckFlag();
	const data = Action.data[id];
	return Action.globalCheck(id) && data.check(part);
};

Action.order = function (id, part, btn) {
	if (btn) F.initCheckFlag();
	const data = Action.data[id];
	T.orderGoal = Action.globalOrder(id) + data.order(part);
	return Action.checkOrder(btn);
};
