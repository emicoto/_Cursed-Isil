F.initActionMode = function () {
	T.actionTypeFilter = "all";
	T.actPartFilter = "all";
	T.actor = V.pc;
	T.actTg = V.pc !== V.tc ? V.tc : V.pc;

	T.actPart = "reset";

	F.initAction("m0");

	V.location.chara.forEach((cid) => {
		F.initAction(cid);
	});
};

//刷新画面
F.resetUI = function (id, option) {
	V.target = C[tc];
	V.player = C[pc];

	F.resetLink();
	F.updateMap();
	F.showActions();
	F.initActMenu(id, option);
	//F.refleshSidebar();
	//F.refleshContinuosAction();

	F.showNext(1);

	return "";
};

F.initActionInput = function (id = "") {
	T.select = {
		id: id,
		tc: id ? tc : "",
		ap: "",
		tp: "",
	};
};

F.initActionDetail = function (id = "") {
	T.action = {
		id: id,
		tc: id ? tc : "",
		ap: "",
		tp: "",
	};
};

F.initCheckFlag = function () {
	T.order = 0;
	T.reason = "";
	T.orderMsg = "";
	T.actAble = 0;
	T.orderGoal = 0;
	T.phase = "";
	T.forceOrder = 0;

	F.resetMsg();
};

//无论指令成功与否，都会在最后执行的处理。
F.resetAction = function () {
	T.phase = "reset";

	delete T.force;
	delete T.noNameTag;
	delete T.aftermovement;
	delete T.onselect;

	if (T.cancel) {
		F.initCheckFlag();
		F.setPhase("init");
		delete T.cancel;
		delete T.actPart;
		delete T.selectPart;
		delete T.selectActPart;
		return 0;
	}

	//缓存最后一个动作
	V.lastAct = T.actionDetail;
	V.lastCounter = T.counterDetail;

	T.actId = "";

	delete T.actPart;
	delete T.selectPart;
	delete T.selectActPart;
	delete T.actionDetail;
	delete T.counterDetail;

	F.initCheckFlag();
};
