Cond.hasSelectableParts = function (parts) {
	let arr = Array.from(new Set(parts));
	if (!parts || parts.length <= 1) return false;
	return (Cond.justHands(arr) && V.mode !== "reverse") === false;
};

Action.onInput = function (actionId, inputType, selection) {
	const { event, type, setting, name } = Action.data[actionId];

	//先记录玩家的输入。如果id或对象不同，就重置记录。
	//type 是体位时则无视id的变化。
	if ((type !== "体位" && T?.select?.id !== actionId) || T?.select?.target !== tc || T?.select?.actor !== pc) {
		T.select = {
			id: actionId,
			actor: pc,
			target: tc,
		};
	}

	//如果是事件，直接执行事件并刷新界面。
	if (inputType == "event") {
		event();
		Action.redraw();
		return;
	}

	//如果是一次性动作，直接准备进入下一步 。
	if (groupmatch(inputType, "oneAction", "useOneTimeItem", "command")) {
	}

	//如果是接触性动作或需等待选择动作部位，则先检测可选项。
	if (groupmatch(inputType, "touchAction", "useEquipItem", "OptionalAction")) {
		let able1 = Action.SelectableParts(actionId, 1);
		let able2 = Action.SelectableParts(actionId, 2);

		const hasOption = () => {
			if (able1.length <= 1 && able2.length <= 1) return 0;

			return Cond.hasSelectableParts(able1) || Cond.hasSelectableParts(able2);
		};

		//如果没有可选项，就自动选择部位，并准备执行。
		if (!hasOption() || groupmatch(actionId, "t8", "r1")) {
			T.select.actPart = able1[0];
			T.select.tgPart = able2[0];
		}

		//如果有可选项就先返回，并刷新界面。
		if (hasOption() || groupmatch(actionId, "t8", "r1")) {
			Action.redraw();
			return;
		}
	}

	//选择动作部位。如果存在可选的目标部位就等待玩家选择，否则自动选择。
	if (inputType == "partsOption-actor") {
		//先记录玩家的输入。
		T.select.actPart = selection;

		let able = Action.SelectableParts(actionId, 2);
		if (Cond.hasSelectableParts(able)) {
			Action.redraw();
			return;
		}

		//自动选择部位。
		T.select.tgPart = able[0];
	}

	//选择目标部位。
	if (inputType == "partsOption-target") {
		T.select.tgPart = selection;

		//如果存在体位选择，就等待玩家选择。
		if (groupmatch(name, "性交", "逆性交")) {
			Action.redraw();
			return;
		}
	}

	if (inputType == "selectPose") {
		T.select.pose = actionId;
	}

	T.actId = actionId;

	//在控制台输出执行详情
	console.log("执行动作：" + name, "\n", T.select, T.action);

	//进入执行检测阶段。
	Action.check(T.select.id);
};

//创建角色交互按钮
Ui.createCharaBtn = function (charalist) {
	if (!charalist) return;

	const html = [];

	charalist.forEach((cid, i) => {
		const com = `<<set $tc to '${cid}'>><<run Action.redraw(); F.charaEvent('${cid}');>>`;
		let name = C[cid].name;
		let link = `<u><<link '${name}'>> ${com} <</link>></u>`;

		if (tc == cid) {
			name = `< ${name} >`;
			link = `<span style='color:#76FAF4'><${name}></span>`;
		}

		html.push(link);
	});
	return html;
};

//更新场景
Action.updateScene = function () {
	const { name, id, chara, tags, setting, des } = V.location;
	const charalist = Ui.createCharaBtn(chara);
	let charaSwitch = F.switchChara();

	let html = `主控 <span style='color:#fff000'>${player.name}</span>${charaSwitch}　|　所在位置 ${name}　|　`;
	if (charalist.length) html += `${charalist.join("　")}<br>`;

	//如果当前地点有描述，则显示描述并包括角色列表。
	//例如：这里是……，有谁、谁、谁在这里。
	//选择角色后会有 "你的目光移向了……" 的提示。
	/*if (des) {
      html += `${des()}，${charalist.join("、")}在这里。`;
   }*/
	Ui.replace("location", html);
};

Action.updateMovement = function () {
	const local = V.location;

	//虽然地图系统好了，但转场这边还没弄好！
	let txt = "";
	if (local.mapId == "Academy.Dormitory.S303") {
		txt += "<<you>>回到了宿舍房间。<br>";
		if (pc == "Ayres") txt += `${C.Isil.name}`;
		else txt += `${C.Ayres.name}`;
		txt += "在房间里。";
	} else {
		const title = `Msg_Spots_${local.mapId.replace(".", "_")}`;
		if (Story.has(title)) {
			txt += Story.get(title).text;
		} else {
			txt += `<<you>>来到了${local.printname}。`;
		}
	}

	//根据角色们的日程进行召唤。
	F.summonChara();

	setTimeout(() => {
		P.flow(txt, 30, 1);
	}, 100);

	return "";
};

//---------->> 主要进程处理 <<----------//
Action.next = function () {
	//用于刷新contentMsg的内容。

	//如果有选择项，就等待玩家选择。
	if (T.msgId < S.msg.length && S.msg[T.msgId].has("<<select", "<<linkrelace") && !T.selectwait) {
		S.msg[T.msgId] += `<<unset _selectwait>><<set _onselect to 1>>`;
		T.selectwait = 1;
	}

	//控制文本进程。
	if (T.msgId < S.msg.length && !T.onselect) {
		P.flow(S.msg[T.msgId]);
		T.msgId++;
	}
};

//---------->> 执行检测 <<----------//
Action.check = function (id) {
	const data = Action.data[id];

	let reText = "";
	//总之先清除一下检测flag。
	Action.clearCheck();

	//检测是否有执行条件，以及对象配合度。
	T.orderResult = Action.order(id, T.select.tgPart);
	T.actAble = Action.able(id, T.select.tgPart);

	T.phase = "check";

	//如果设置了配合度的显示，会在这里进行提示。
	if (V.system.showOrder && T.orderMsg && T.orderGoal > 0) {
		reText += `配合度检测：${T.orderMsg} = ${T.order}/${T.orderGoal}<br><<dashline>>`;
	}

	if (!T.actAble && T.reason) {
		reText += `执行条件不足，原因：${T.reason}<br><<dashline>>`;
	}

	//确定执行前先保存当前选项。
	T.action = clone(T.select);

	//记录动作id和执行者，用在文本输出中。;
	T.actor = pc;
	T.target = tc;
	T.actId = T.select.id;

	if (reText) P.flow(reText);

	//确认无法执行的话，就在这个地方打断。
	if (!T.actAble) Action.phase("cancel");
	else Action.phase("before");
};

//---------->> 执行前事件 <<----------//
Action.before = function (id) {
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
	reText = Story.get("Msg_Action_Common:Before").text + ` <<run Action.next()>><<if !T.noMsg>><<dashline>><</if>>`;

	P.msg(reText);

	let type = "PCAction",
		dif = "Before",
		check = 1;

	//指令专属的before事件
	if (Kojo.has(pc, { type, id, dif, check })) {
		reText = Kojo.put(pc, { type, id, dif });
		P.msg(reText);
	}

	//执行口上侧before事件。
	type = "Action";
	if (Kojo.has(tc, { type, id, dif })) {
		reText = Kojo.put(tc, { type, id, dif });
		P.msg(reText);
	}

	//角色自定指令的情况。因为格式不一样，前面结果肯定为空(￣▽￣")
	if (data?.setting?.has("Kojo") && Kojo.has(pc, { type: "custom", id, dif })) {
		P.msg(Kojo.put(pc, { type: "custom", id, dif }));
	}

	//在执行文本最后追加下一步，取消的话就直接取消剩余执行事件。
	P.msg(
		`<<if !T.cancel>><<run Action.phase('event'); Action.next()>><<else>><<run Action.reset(); Action.phase('init')>><</if>>`
	);

	//检测是否存在特殊的before处理，存在就在这执行。
	//if(Action.data[id]?.before) Action.data[id].before();

	if (!Story.has(`Msg_PCAction_${id}`) && !data?.setting?.has("Kojo")) {
		P.flow("缺乏事件文本", 30, 1);
		Action.phase("init");
	}
};

//---------->> 执行事件 <<----------//
Action.event = function (id) {
	const data = Action.data[id];

	let tag = T.noNameTag;
	let reText = "";

	T.passtime = data.time;
	T.phase = "event";

	P.resetMsg();

	//强制成功时
	if (T.orderResult == "force succeed") {
		S.msg.push(`< 强制 ><br>`);
		T.force = 1;
	}

	//幸运成功时
	if (T.orderResult == "luck succeed") {
		S.msg.push(`勉强配合: ${T.order}+LUK${player.stats.LUK[1]}/${T.orderGoal}<br>`);
	}

	if (T.orderResult == "failed") {
		Action.phase("failed");
	}

	//强制时的分支。如果存在的话。
	let type = "PCAction",
		dif = "Force",
		check = 1;

	//检测内容文本是否存在。如果PC侧存在主动口上，则替换成pc的。否则显示系统默认文。
	//如果需要先显示系统文再显示pc和npc口上的情况，还是直接在系统文内设置吧(￣▽￣")
	if (T.force && Kojo.has(pc, { type, id, dif, check })) {
		reText = Kojo.put(pc, { type, id, dif, tag });
	} else if (Kojo.has(pc, { type, id, check })) {
		reText = Kojo.put(pc, { type, id, tag });
	}

	//角色自定指令的情况。因为格式不一样，前面结果肯定为空(￣▽￣")
	if (data?.setting?.has("Kojo") && Kojo.has(pc, { type: "custom", id })) {
		reText = Kojo.put(pc, { type: "custom", id });
	}

	//检测角色口上。如果系统文中就包含了口上的调用，就跳过。
	type = "Action";
	if (reText.includes("Kojo.put(tc") === false) {
		if (T.force && Kojo.has(tc, { type, id, dif })) {
			reText += Kojo.put(tc, { type, id, dif });
		}
		if (!T.force && Kojo.has(tc, { type, id })) {
			reText += Kojo.put(tc, { type, id });
		}
	}

	if (reText.includes("Kojo.put")) {
		//console.log(T.action);
		reText = F.convertKojo(reText);
	}

	P.msg(reText);
	//设置下一个环节的flag。进入counter环节。对象概率执行counter动作。之后才是result和after事件
	P.msg(`<<run Action.data['${id}'].effect(); Action.phase('counter');>>`, 1);
};

//---------->> 设置counter事件 <<----------//
Action.counter = function (id) {};

//---------->> 设置result事件 <<----------//
Action.result = function (id) {};

//---------->> 设置after事件 <<----------//
Action.after = function (id) {
	const data = Action.data[id];
	let type = "PCAction",
		dif = "After",
		check = 1;
	let c;
	T.phase = "after";

	if (Kojo.has(pc, { type, id, dif, check })) {
		P.msg(Kojo.put(pc, { type, id, dif }));
		c = 1;
	}

	type = "Action";
	if (Kojo.has(tc, { type, id, dif })) {
		P.msg(Kojo.put(tc, { type, id, dif }));
		c = 1;
	}

	//角色自定指令的情况。因为格式不一样，前面结果肯定为空(￣▽￣")
	if (data?.setting?.has("Kojo") && Kojo.has(pc, { type: "custom", id, dif })) {
		P.msg(Kojo.put(pc, { type: "custom", id, dif }));
	}

	//有事件的时候滞后处理
	if (c) {
		P.msg(`<<run Action.phase('finish')>><<dashline>>`, 1);
	} else {
		Action.phase("finish");
	}
};

Action.cancel = function (id) {
	let tag = T.noNameTag,
		type = "PCAction",
		dif = "Cancel",
		check = 1;
	T.cancel = 1;

	if (Kojo.has(pc, { type, id, dif, check, tag })) {
		P.msg(Kojo.put(pc, { type, id, dif, tag }));
		P.msg(`<<run T.cancel = 1; F.passtime(1); Action.reset(); Action.phase('reset')>>`, 1);
	} else {
		T.cancel = 1;
		Action.reset();
		Action.phase("reset");
	}
};

Action.Failed = function (id) {
	let tag = T.noNameTag,
		type = "PCAction",
		dif = "Failed",
		check = 1;

	if (Kojo.has(pc, { type, id, dif, tag, check })) {
		P.msg(Kojo.put(pc, { type, id, dif, tag }));
	} else {
		P.msg("对方不愿意配合，执行失败。");
	}

	P.msg(`<<run T.cancel = 1; F.passtime(1); Action.reset(); Action.phase('reset')>>`, 1);
};

//---------->> 设置finish事件 <<----------//
