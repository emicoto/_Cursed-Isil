F.hideActions = function () {
	$("#actionMenu_1").addClass("hidden");
	$("#actionMenu_2").addClass("hidden");
	$("#actionMenu_3").addClass("hidden");
	$("#actionOption").addClass("hidden");
	new Wikifier(null, "<<replace #actionMenu_1>> <</replace>>");
	new Wikifier(null, "<<replace #actionMenu_2>> <</replace>>");
	new Wikifier(null, "<<replace #actionMenu_3>> <</replace>>");
	new Wikifier(null, "<<replace #actionOption>> <</replace>>");
};

F.showActions = function () {
	$("#actionMenu_1").removeClass("hidden");
	$("#actionMenu_2").removeClass("hidden");
	$("#actionMenu_3").removeClass("hidden");
	$("#actionOption").removeClass("hidden");
};

F.showNext = function (hide) {
	let html = hide ? "" : `<<link 'Next'>><<run F.ActNext()>><</link>>`;
	new Wikifier("#next", `<<replace #next>>${html}<</replace>>`);
};

F.partAble = function (actid, part, chara) {
	const data = Action.data[actid];
	if (data.type == "触手") {
		return 1;
	} else {
		return Action.globalPartAble(actid, part, chara);
	}
};

F.filterActions = function (...types) {
	return Object.values(Action.data).filter((action) => types.includes(action.type));
};

F.Msg = function (msg, add) {
	if (add) {
		if (!S.msg.length) S.msg[0] = "";
		S.msg[S.msg.length - 1] += msg;
	} else if (msg.includes("<fr>")) {
		S.msg = S.msg.concat(msg.split("<fr>"));
	} else {
		S.msg.push(msg);
	}
};

/**
 *
 * @param {'cancel' | 'stop'} mode
 */
F.stopAction = function (id, mode) {
	T.stopAct = id;
	$("action").trigger(mode);
};

F.setPhase = function (mode) {
	$("action").trigger(mode);
};

F.resetMsg = function () {
	S.msg = [];
	T.msgId = 0;
};

F.actionCheckOrder = function (btn) {
	if (V.system.debug) return "succeed";
	if (T.orderGoal == 0) return "succeed";

	if (T.orderGoal > 0 && T.order >= T.orderGoal) return "succeed";

	if (T.order + player.stats.LUK[1] >= T.orderGoal && (random(100) <= player.stats.LUK[1] * 1.5 || btn))
		return "luck succeed";

	if (T.order + T.forceOrder >= T.orderGoal) return "force succeed";

	return "failed";
};

F.checkAble = function (id, btn) {
	if (btn) F.initCheckFlag();
	const data = Action.data[id];
	return Action.globalCheck(id) && data.check();
};

F.checkOrder = function (id, btn) {
	if (btn) F.initCheckFlag();
	const data = Action.data[id];
	T.orderGoal = Action.globalOrder(id) + data.order();
	return F.actionCheckOrder(btn);
};
