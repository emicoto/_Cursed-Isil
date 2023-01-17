F.initMainFlow = function () {
	//在这里初始化信息板。 插入移动后的文本。不是经由移动初始化时会有对应的flag判定。
	//V.aftermovement
	const local = V.location;
	let text = F.playerName();

	if (local.id == "A0") {
		text += `你回到了宿舍房间。<br>`;
		if (pc == "Ayres") {
			text += `${C["Isil"].name}在房间里。`;
		} else {
			text += `${C["Ayres"].name}在房间里。`;
		}
	} else {
		text += `你来到了学院广场公园。<br>你注意到了${C["Besta"].name}在这里散步。`;
	}

	F.summonChara();
	//F.resetAction(); 初始化act、using缓存，并设置默认动作

	if (V.aftermovement) delete V.aftermovement;

	setTimeout(() => {
		F.txtFlow(text, 30, 1);
		setTimeout(() => {
			F.charaEvent(tc);
		}, 500);
	}, 100);

	return "";
};

//----->> 主要进程处理 <<---------------------------//v
F.ActNext = function () {
	//用于刷新content_message区域的文本。
	if (T.msgId < S.msg.length && S.msg[T.msgId].has("<<selection", "<<linkreplace") && !T.selectwait) {
		S.msg[T.msgId] += "<<unset _selectwait>><<set _onselect to 1>>";
		T.selectwait = 1;
	}

	if (T.msgId < S.msg.length && !T.onselect) {
		F.txtFlow(S.msg[T.msgId]);
		T.msgId++;
	}
};

F.checkAction = function (id, phase) {
	const data = Action.data[id];

	let reText = "";

	F.initCheckFlag();

	//触手系能无视伊希露本人意志对本人强制执行，但对本人有很多负面影响。
	//这部分处理放global统一处理。
	T.orderGoal = Action.globalOrder(id) + data.order();
	T.actAble = Action.globalCheck(id) && data.check();

	//有可选对象部位就检测部位执行状况？
	/*	if (data.targetPart && data.targetPart.includes(T.selectPart)) {
		T.partAble = data.checkPart(T.selectPart);
	}*/

	T.phase = phase;

	// 对方处于无意识状态，强行将配合值变零
	if (F.uncons(target)) T.orderGoal = 0;

	// 有意识但无法动弹, 追加强制flag
	if (!F.canMove(target)) T.forceOrder += 100;

	if (V.system.showOrder && T.orderMsg && T.orderGoal > 0) {
		reText += `配合度检测：${T.orderMsg}=${T.order}/${T.orderGoal}<br><<dashline>>`;
	}

	if (!T.actAble && T.reason) {
		reText += `执行条件不足，原因：${T.reason}<br><<dashline>>`;
	}

	//如果无法进入执行环节，则在这个阶段返回提示信息。
	if (reText) {
		F.txtFlow(reText);
	}

	T.selectAct = id;

	//如果动作还在准备阶段，则在这里中断。
	if (phase == "ready") {
		F.initCheckFlag();
		F.resetUI();
		return 0;
	}

	T.actId = id;
	//记录动作部位。
	T.actPart = T.selectActPart ? T.selectActPart : data.usePart ? data.usePart[0] : "reset";

	$("action").trigger("before");
};

F.beforeAction = function (id) {
	T.phase = "before";
	let reText = "";

	//角色每次执行COM时的个人检测。
	//如果口上侧要进行阻止某个指令进行，也会在这里打断。
	if (Story.has(`Kojo_${tc}_BeforeAction`)) {
		new Wikifier("#hidden", Story.get(`Kojo_${tc}_BeforeAction`).text);
	}

	//执行before系列事件。这些都是纯文本，只能有选项相关操作。
	//先执行通用的before事件。主要显示场景变化或持续状态。
	reText = Story.get("Action_Common:Before").text + ` <<run F.ActNext()>><<if !T.noMsg>><<dashline>><</if>>`;

	F.Msg(reText);

	let txt = F.playerName(),
		t,
		c;

	//指令专属的before事件
	if (Story.has(`Action_${id}:Before`)) {
		txt = txt + Story.get(`Action_${id}:Before`).text + "<br>";
		F.Msg(txt);
		t = 1;
		c = 1;
	}

	//执行口上侧before事件。
	if (Kojo.has(tc, "Action", id, "Before")) {
		txt = (t ? "" : txt) + Kojo.put(tc, "Action", id, "Before");
		F.Msg(txt);
		c = 1;
	}

	//在执行文本最后追加下一步，取消的话就直接取消剩余执行事件。
	F.Msg(
		`<<if !T.cancel>><<run F.setPhase('event'); F.ActNext()>><<else>><<run F.resetAction(); F.setPhase('init')>><</if>>`
	);

	//检测是否存在特殊的before处理，存在就在这执行。
	//if(Action.data[id]?.before) Action.data[id].before();

	if (!Story.has(`Action_${id}`)) {
		F.txtFlow("缺乏事件文本", 30, 1);
		F.setPhase("init");
	}
	//已经出现过名牌的话下一步骤会略过
	else if (c) {
		T.noNameTag = 1;
	}
};

F.actionCheckOrder = function () {
	if (V.system.debug) return "debug";
	if (T.orderGoal == 0) return "succeed";

	if (T.orderGoal > 0 && T.order >= T.orderGoal) return "succeed";

	if (T.order + player.stats.LUK[1] >= T.orderGoal && random(100) <= player.stats.LUK[1] * 1.5) return "luck succeed";

	if (T.order + T.forceOrder >= T.orderGoal) return "force succeed";

	return "failed";
};

F.doAction = function (id) {
	const state = T.actAble ? F.actionCheckOrder() : "cancel";

	if (groupmatch(state, "failed", "cancel")) {
		F.setPhase(state);
		return 0;
	}

	//确认执行，记录动作详细。
	T.actionDetail = {
		act: id,
		target: tc,
		actPart: T.actPart,
		targetPart: T.selectPart,
	};

	F.actionEvent(id, state);
};

F.actionEvent = function (id, state) {
	const data = Action.data[id];

	let title = `Action_${id}`;
	let txt = T.noNameTag ? "" : F.playerName();

	T.phase = "event";
	F.resetMsg();

	//强制成功时
	if (state == "force succeed") {
		S.msg.push(`< 强制 ><br>`);
		T.force = 1;
	}

	//幸运成功时
	if (state == "luck succeed") {
		S.msg.push(`勉强配合: ${T.order}+LUK${player.stats.LUK[1]}/${T.orderGoal}<br>`);
	}

	//强制时的分支。如果存在的话。
	if (T.force && Story.has(title + ":Force")) {
		txt = txt + Story.get(title + ":Force").text;
	} else {
		txt = txt + Story.get(title).text;
	}

	//转换口上内容
	txt = F.convertKojo(txt);

	F.Msg(txt + "<br>");
	//设置下一个环节的flag。进入counter环节。对象概率执行counter动作。之后才是result和after事件
	F.Msg(`<<run Action.data['${id}'].effect(); F.setPhase('counter');>>`, 1);
};

F.actionAfter = function (id) {
	let name = T.noNameTag ? "" : F.playerName();
	let title = `Action_${id}:After`;
	let c;
	T.phase = "after";

	if (Story.has(title)) {
		let txt = `${name}${Story.get(title).text}`;
		F.Msg(txt);
		c = 1;
	}

	if (Kojo.has(tc, "Action", id, "After")) {
		F.Msg(Kojo.put(tc, "Action", id, "After"));
		c = 1;
	}

	//有事件的时候滞后处理
	if (c) {
		F.Msg(`<<run F.setPhase('finish')>><<dashline>>`, 1);
	} else {
		F.setPhase("finish");
	}
};

F.actionCancel = function (id) {
	let name = T.noNameTag ? "" : F.playerName();

	if (Story.has(`Action_${id}:Cancel`)) {
		F.Msg(name + Story.get(`Action_${id}:Cancel`).text);
		F.Msg(`<<run T.cancel = 1; F.passtime(1); F.resetAction(); F.setPhase('init')>><<dashline>>`, 1);
	} else {
		T.cancel = 1;
		F.resetAction();
		F.setPhase("init");
	}
};

F.actionFailed = function (id) {
	let name = T.noNameTag ? "" : F.playerName();

	if (Story.has(`Action_${id}:Failed`)) {
		F.Msg(name + Story.get(`Action_${id}:Failed`).text);
	} else {
		F.Msg("对方不愿意配合，执行失败。");
	}
	F.Msg(`<<run T.cancel = 1; F.passtime(1); F.resetAction(); F.setPhase('init')>><<dashline>>`, 1);
};

F.actionResult = function () {
	//passtime 跑完后的处理
	T.phase = "result";
};
