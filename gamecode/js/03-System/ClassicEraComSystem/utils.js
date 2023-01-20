//----->> 小功能 <<---------------------------//

Com.shownext = function () {
	let html = `<<link 'Next'>><<run Com.next()>><</link>>`;
	new Wikifier("#commandzone", `<<replace #commandzone transition>>${html}<</replace>>`);
};

Com.hide = function () {
	new Wikifier(null, `<<replace #commandmenu>> <</replace>>`);
	new Wikifier(null, "<<replace #commandzone>> <</replace>>");
};

//无论指令成功与否，都会在最后执行的处理
Com.reset = function () {
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
