F.initMainFlow = function () {
	//在这里初始化信息板。 插入移动后的文本。不是经由移动初始化时会有对应的flag判定。
	//V.aftermovement
	const local = V.location;
	let text = p.playerName();

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
		p.flow(text, 30, 1);
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
		p.flow(S.msg[T.msgId]);
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
	if (cond.isUncons(target)) T.orderGoal = 0;

	// 有意识但无法动弹, 追加强制flag
	if (!cond.canMove(target)) T.forceOrder += 100;

	if (V.system.showOrder && T.orderMsg && T.orderGoal > 0) {
		reText += `配合度检测：${T.orderMsg}=${T.order}/${T.orderGoal}<br><<dashline>>`;
	}

	if (!T.actAble && T.reason) {
		reText += `执行条件不足，原因：${T.reason}<br><<dashline>>`;
	}

	//如果无法进入执行环节，则在这个阶段返回提示信息。
	if (reText) {
		p.flow(reText);
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
	const data = Action.data[id];

	T.phase = "before";
	let reText = "";

	//角色每次执行COM时的个人检测。
	//如果口上侧要进行阻止某个指令进行，也会在这里打断。
	if (Story.has(`Kojo_${tc}_BeforeAction`)) {
		new Wikifier("#hidden", Story.get(`Kojo_${tc}_BeforeAction`).text);
	}

	//执行before系列事件。这些都是纯文本，只能有选项相关操作。
	//先执行通用的before事件。主要显示场景变化或持续状态。
	reText = Story.get("Msg_Action_Common:Before").text + ` <<run F.ActNext()>><<if !T.noMsg>><<dashline>><</if>>`;

	p.msg(reText);

	let type = "PCAction",
		dif = "Before",
		check = 1;

	//指令专属的before事件
	if (Kojo.has(pc, { type, id, dif, check })) {
		txt = Kojo.put(pc, { type, id, dif });
		p.msg(txt);
	}

	//执行口上侧before事件。
	type = "Action";
	if (Kojo.has(tc, { type, id, dif })) {
		txt = Kojo.put(tc, { type, id, dif });
		p.msg(txt);
	}

	//角色自定指令的情况。因为格式不一样，前面结果肯定为空(￣▽￣")
	if (data?.option?.has("Kojo") && Kojo.has(pc, { type: "custom", id, dif })) {
		p.msg(Kojo.put(pc, { type: "custom", id, dif }));
	}

	//在执行文本最后追加下一步，取消的话就直接取消剩余执行事件。
	p.msg(
		`<<if !T.cancel>><<run Action.phase('event'); F.ActNext()>><<else>><<run F.resetAction(); Action.phase('init')>><</if>>`
	);

	//检测是否存在特殊的before处理，存在就在这执行。
	//if(Action.data[id]?.before) Action.data[id].before();

	if (!Story.has(`Msg_PCAction_${id}`) && !data?.option?.has("Kojo")) {
		p.flow("缺乏事件文本", 30, 1);
		Action.phase("init");
	}
};

F.doAction = function (id) {
	const state = T.actAble ? Action.checkOrder() : "cancel";

	if (groupmatch(state, "failed", "cancel")) {
		Action.phase(state);
		return 0;
	}

	//确认执行，记录动作详细。
	T.action = {
		act: id,
		target: tc,
		actPart: T.actPart,
		targetPart: T.selectPart,
	};

	F.actionEvent(id, state);
};

F.actionEvent = function (id, state) {
	const data = Action.data[id];
	T.passtime = data.time;

	let tag = T.noNameTag,
		txt = "";

	T.phase = "event";
	p.resetMsg();

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
	let type = "PCAction",
		dif = "Force",
		check = 1;

	//检测内容文本是否存在。如果PC侧存在主动口上，则替换成pc的。否则显示系统默认文。
	//如果需要先显示系统文再显示pc和npc口上的情况，还是直接在系统文内设置吧(￣▽￣")
	if (T.force && Kojo.has(pc, { type, id, dif, check })) {
		txt = Kojo.put(pc, { type, id, dif, tag });
	} else if (Kojo.has(pc, { type, id, check })) {
		txt = Kojo.put(pc, { type, id, tag });
	}

	//角色自定指令的情况。因为格式不一样，前面结果肯定为空(￣▽￣")
	if (data?.option?.has("Kojo") && Kojo.has(pc, { type: "custom", id })) {
		txt = Kojo.put(pc, { type: "custom", id });
	}

	//检测角色口上。如果系统文中就包含了口上的调用，就跳过。
	type = "Action";
	if (txt.includes("Kojo.put") === false && Kojo.has(tc, { type, id })) {
		txt += Kojo.put(tc, { type, id });
	} else if (txt.includes("Kojo.put")) {
		txt = F.convertKojo(txt);
	}

	p.msg(txt);
	//设置下一个环节的flag。进入counter环节。对象概率执行counter动作。之后才是result和after事件
	p.msg(`<<run Action.data['${id}'].effect(); Action.phase('counter');>>`, 1);
};

F.actionAfter = function (id) {
	const data = Action.data[id];
	let type = "PCAction",
		dif = "After",
		check = 1;
	let c;
	T.phase = "after";

	if (Kojo.has(pc, { type, id, dif, check })) {
		p.msg(Kojo.put(pc, { type, id, dif }));
		c = 1;
	}

	type = "Action";
	if (Kojo.has(tc, { type, id, dif })) {
		p.msg(Kojo.put(tc, { type, id, dif }));
		c = 1;
	}

	//角色自定指令的情况。因为格式不一样，前面结果肯定为空(￣▽￣")
	if (data?.option?.has("Kojo") && Kojo.has(pc, { type: "custom", id, dif })) {
		p.msg(Kojo.put(pc, { type: "custom", id, dif }));
	}

	//有事件的时候滞后处理
	if (c) {
		p.msg(`<<run Action.phase('finish')>><<dashline>>`, 1);
	} else {
		Action.phase("finish");
	}
};

F.actionCancel = function (id) {
	let tag = T.noNameTag,
		type = "PCAction",
		dif = "Cancel",
		check = 1;

	if (Kojo.has(pc, { type, id, dif, check, tag })) {
		p.msg(Kojo.put(pc, { type, id, dif, tag }));
		p.msg(`<<run T.cancel = 1; F.passtime(1); F.resetAction(); Action.phase('init')>>`, 1);
	} else {
		T.cancel = 1;
		F.resetAction();
		Action.phase("init");
	}
};

F.actionFailed = function (id) {
	let tag = T.noNameTag,
		type = "PCAction",
		dif = "Failed",
		check = 1;

	if (Kojo.has(pc, { type, id, dif, tag, check })) {
		p.msg(Kojo.put(pc, { type, id, dif, tag }));
	} else {
		p.msg("对方不愿意配合，执行失败。");
	}

	p.msg(`<<run T.cancel = 1; F.passtime(1); F.resetAction(); Action.phase('init')>>`, 1);
};

F.actionResult = function () {
	//passtime 跑完后的处理
	T.phase = "result";
};
