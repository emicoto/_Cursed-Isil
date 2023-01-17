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

F.resetUI = function () {
	V.target = C[tc];
	V.player = C[pc];

	F.resetLink();
	F.updateMap();
	F.showActions();
	F.initActMenu();
	//F.initActionselect()

	F.showNext(1);

	return "";
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
