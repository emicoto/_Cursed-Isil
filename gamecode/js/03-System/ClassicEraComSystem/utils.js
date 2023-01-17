//----->> 小功能 <<---------------------------//

F.shownext = function () {
	let html = `<<link 'Next'>><<run F.ComNext()>><</link>>`;
	new Wikifier("#commandzone", `<<replace #commandzone transition>>${html}<</replace>>`);
};

//每次移动后的target复位
F.resetTarget = function () {
	const local = clone(V.location.chara);

	if (local.length > 1) {
		local.delete(V.pc, 1);
		V.tc = local[0];
	} else {
		V.tc = V.pc;
	}
};

F.hideCommands = function () {
	new Wikifier(null, `<<replace #commandmenu>> <</replace>>`);
	new Wikifier(null, "<<replace #commandzone>> <</replace>>");
};

//刷新界面
F.resetScene = function () {
	V.target = C[tc];
	V.player = C[pc];
	F.initLocation();
	F.initComList();
	F.initComMenu();

	return "";
};
DefineMacroS("resetScene", F.resetScene);

//信息处理
F.ComMsg = function (msg, add) {
	if (!S.msg) S.msg = [];
	if (add) {
		if (!S.msg.length) S.msg[0] = "";
		S.msg[S.msg.length - 1] += msg;
	} else if (msg.includes("<fr>")) {
		S.msg = S.msg.concat(msg.split("<fr>"));
	} else {
		S.msg.push(msg);
	}
};

//无论指令成功与否，都会在最后执行的处理
F.resetCom = function () {
	//更新事件状态
	T.comPhase = "reset";

	// 检测在场角色的事件
	V.location.chara.forEach((cid) => {
		F.charaEvent(cid);
	});

	//缓存指令
	V.lastCom = V.selectCom;

	//清除临时flag和缓存信息
	delete T.comCancel;
	delete T.onselect;
	delete T.comAble;
	delete T.orderGoal;
	delete T.force;

	delete S.msg;

	T.msgId = 0;
	T.comorder = 0;
	T.reason = "";
	T.order = "";
	V.selectCom = 0;

	//刷新画面
	F.resetScene();
};
