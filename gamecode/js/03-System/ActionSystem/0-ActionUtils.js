Action.hideMenu = function () {
	const label = "#actionMenu_";

	$(label + 1).addClass("hidden");
	$(label + 2).addClass("hidden");
	$(label + 3).addClass("hidden");
	$("#actionOption").addClass("hidden");

	F.reflesh(label + 1, " ");
	F.reflesh(label + 2, " ");
	F.reflesh(label + 3, " ");
	F.reflesh("#actionOpton", " ");
};

Action.showMenu = function () {
	$("#actionMenu_1").removeClass("hidden");
	$("#actionMenu_2").removeClass("hidden");
	$("#actionMenu_3").removeClass("hidden");
	$("#actionOption").removeClass("hidden");
};

Action.shownext = function (hide) {
	let html = hide ? "" : `<<link 'Next'>><<run F.ActNext()>><</link>>`;
	new Wikifier("#next", `<<replace #next>>${html}<</replace>>`);
};

Action.partAble = function (actid, part, chara) {
	const data = Action.data[actid];
	if (data.type == "触手") {
		return Flag.master;
	} else {
		return Action.globalPartAble(actid, part, chara);
	}
};

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

P.resetMsg = function () {
	S.msg = [];
	T.msgId = 0;
	T.noMsg = 0;
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

Action.able = function (id, btn) {
	if (btn) F.initCheckFlag();
	const data = Action.data[id];
	return Action.globalCheck(id) && data.check();
};

Action.order = function (id, btn) {
	if (btn) F.initCheckFlag();
	const data = Action.data[id];
	T.orderGoal = Action.globalOrder(id) + data.order();
	return Action.checkOrder(btn);
};
