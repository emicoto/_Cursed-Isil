F.initActionMode = function () {
	T.currentType = "all";
	T.actPartFilter = "all";
	T.actor = V.pc;
	T.actTg = V.pc !== V.tc ? V.tc : V.pc;

	T.actPart = "reset";

	F.initAction("m0");

	V.location.chara.forEach((cid) => {
		F.initAction(cid);
	});
};

F.initCheckFlag = function () {
	T.order = 0;
	T.reason = "";
	T.orderMsg = "";
	T.actAble = 0;
	T.orderGoal = 0;
	T.phase = "";
	T.forceOrder = 0;

	delete T.noNameTag;
	delete T.aftermovement;
	delete T.onselect;

	F.resetMsg();
};

//无论指令成功与否，都会在最后执行的处理。
F.resetAction = function () {
	T.phase = "reset";

	delete T.force;

	if (T.cancel) {
		F.initCheckFlag();
		F.setPhase("init");
		delete T.cancel;
		delete T.selectActPart;
		return 0;
	}

	//缓存最后一个动作
	V.lastAct = T.actionDetail;
	V.lastCounter = T.counterDetail;

	T.actId = "";
	T.actPart = "reset";

	delete T.selectActPart;
	delete T.actionDetail;
	delete T.counterDetail;

	F.initCheckFlag();
};
