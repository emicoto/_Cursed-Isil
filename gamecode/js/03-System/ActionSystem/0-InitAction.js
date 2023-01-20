Action.initMode = function () {
	T.actionTypeFilter = "all";
	T.select = {};
	T.actor = V.pc;
	T.target = V.tc;
	T.actId = "";

	Action.initChara("m0");
	V.location.chara.forEach((cid) => {
		Action.initChara(cid);
	});

	Action.redraw();
};

Action.initChara = function (cid) {
	Using[cid] = {};

	if (cid == "m0") {
		const num = F.tentaclesNum();
		Using[cid].tentacles = [];

		for (let i = 0; i < num; i++) {
			Using[cid].tentacles.push({ action: "", target: "", onPart: "" });
		}
		return;
	}

	D.selectAbleParts.forEach((part) => {
		Using[cid][part] = { action: "", actor: "", target: "", onPart: "" };
	});
};

Action.clearCheck = function () {
	T.order = 0;
	T.reason = "";
	T.orderMsg = "";
	T.actAble = 0;
	T.orderGoal = 0;
	T.phase = "";
	T.forceOrder = 0;

	P.resetMsg();
};

Action.initFlag = function () {
	const deleteList = ["actPart", "selectPart", "cancel", "force", "onSelect", "stopAct", "afterMovement"];
	deleteList.forEach((key) => {
		T[key] = null;
	});
};

//清除所有动作flag
Action.reset = function () {
	T.phase = "reset";

	if (T.cancel) {
		Action.clearCheck();
		Action.initFlag();
		Action.phase("reset");
		return 0;
	}

	//缓存最后一个动作。
	V.lastAction = clone(T.action);
	V.lastCounter = clone(T.counter);

	if (T.action.id !== Tsv[pc].lastAction) {
		Tsv[pc].lastAction = T.action.id;
	}
	if (T.counter.id !== Tsv[tc].lastAction) {
		Tsv[tc].lastAction = T.counter.id;
	}

	//清除当前动作。只保留T.select中的选择
	T.actId = "";
	T.action = {};
	T.counter = {};

	Action.clearCheck();
	Action.initFlag();
};

//清除持续中的动作状态
Action.unset = function (cid, part, id) {
	if (part == "tentacles") {
		Using[cid][part][id] = { action: "", target: "", onPart: "" };
		return;
	}

	Using[cid][part] = { action: "", target: "", onPart: "", actor: "" };
};
