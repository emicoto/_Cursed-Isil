F.initActions = function () {
	T.actionTypeFilter = "all";
	T.actPartFilter = "all";
	T.actor = V.pc;
	T.actTg = V.pc !== V.tc ? V.tc : V.pc;

	T.actPart = "reset";

	initAction("m0");

	V.location.chara.forEach((cid) => {
		F.initAction(cid);
	});

	F.resetUI();
};

//刷新画面
F.resetUI = function (id, option) {
	V.target = C[tc];
	V.player = C[pc];

	F.resetLink();
	F.updateScene();
	F.showActions();
	F.updateActions(id, option);
	//F.refleshSidebar();
	//F.refleshContinuosAction();

	F.showNext(1);
	F.reflesh("showtime", "<<showtime>><<showmoney>>");

	return "";
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

F.initTFlag = function () {
	const deleteList = ["actPart", "selectPart", "cancel", "force", "onSelect", "stopAct", "afterMovement"];
	deleteList.forEach((key) => {
		T[key] = null;
	});
};
//无论指令成功与否，都会在最后执行的处理。
F.resetAction = function () {
	T.phase = "reset";

	if (T.cancel) {
		F.initCheckFlag();
		F.resetTflag();
		F.setPhase("init");
		return 0;
	}

	//缓存最后一个动作
	V.lastAct = T.actionDetail;
	V.lastCounter = T.counterDetail;

	T.actId = "";

	T.actionDetail = {};
	T.counterDetail = {};

	F.initTflag();
	F.initCheckFlag();
};

D.actAbleParts = ["handR", "handL", "mouth", "penis", "vagina", "anal", "foot"];

D.selectAbleParts = ["breast", "critoris", "urin", "ears", "neck", "butts", "nipple", "thighs", "abdomen"].concat(
	actAbleParts
);

F.initCharaAction = function (cid) {
	Act[cid] = {};
	Using[cid] = {};
	if (cid == "m0") {
		const num = F.tentaclesNum();

		Act[cid].tentacles = [];
		Using[cid].tentacles = [];

		for (let i = 0; i < num; i++) {
			Act[cid].tentacles.push({ act: "", tc: "", use: "" });
			Using[cid].tentacles.push({ act: "", tc: "", use: "" });
		}
	} else {
		D.actAbleParts.forEach((k) => {
			Act[cid][k] = { tc: "", act: "", use: "" }; // 作为actor执行命令时判定点
		});
		D.selectAbleParts.forEach((k) => {
			Using[cid][k] = { act: "", actor: "", use: "" }; // 持续动作占用中部位。
		});
	}
};

F.tentaclesNum = function () {
	return V.cursedLord.abl.num + 2;
};
