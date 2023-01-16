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

F.showNext = function (hide) {
	let html = hide ? "" : `<<link 'Next'>><<run F.ActNext()>><</link>>`;
	new Wikifier("#next", `<<replace #next>>${html}<</replace>>`);
};

//----->> 初始化 <<---------------------------//

F.updateMap = function () {
	const chara = [];
	let html = "";
	let change = F.switchChara();

	if (V.location.chara.length) {
		V.location.chara.forEach((k) => {
			let com = `<<set $tc to '${k}'>><<run F.charaEvent('${k}'); F.resetUI()>>`;

			let t = `<u><<link '${C[k].name}'>>${com}<</link>></u>　`;

			if (pc !== k) {
				if (tc == k) t = `<span style='color:#76FAF4'><${C[k].name}></span>　`;
				//console.log(k, C[k].name, t)
			} else {
				let name = C[k].name;
				if (tc == k) name = `< ${C[k].name} >　`;
				t = `<span style='color:#AAA'>${name}</span>　`;
			}

			chara.push(t);
		});
	}

	html = `主控　<span style='color:#fff000'>${player.name}</span> ${change}　|　所在位置　${V.location.name}　|　`;
	if (chara.length) html += "" + chara.join("") + "<br>";

	//后面加场景描述。从Db读取场景数据。角色选项也会移到场景描述后。
	//这里是……。 有 谁 、谁 、谁 在这里。
	//选择角色后会有文字补充在信息流后。 “你将目光移向谁。“

	new Wikifier(null, `<<replace #location>>${html}<</replace>>`);
};

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

F.actBtn = function (actid, data) {
	const { id, script, event, alterName } = data;
	let name = data.name;
	if (alterName) name = alterName();

	if (actid == id || (data.type == "目录" && T.actType == id)) {
		return `<div class='actions selectAct'>[ ${name} ]</div>`;
	}

	if (
		(groupmatch(data.type, "接触", "触手", "逆位") && !groupmatch(data.option, "doStraight", "reset")) ||
		(data.type == "道具" && data.targetPart)
	) {
		let usePart;
		if (data.usePart && data.usePart.length > 1) {
			if (!(F.justHands(data.usePart) && V.mode !== "reverse")) {
				usePart = 1;
			}
		}

		return `<div class='actions'><<link '${data.name}'>>
        <<run F.checkAction('${id}', 'ready'); F.initActMenu('${id}'${usePart ? ", 1" : ""});>>
        <</link>></div>`;
	}

	return `<div class='actions'><<link '${data.name}'>>
            ${script ? script : ""}
            ${event ? `<<run Action.data['${id}'].event(); F.resetUI()>>` : `<<run F.checkAction('${id}', 'do');>>`}
            <</link>></div>`;
};

F.partBtn = function (data, part, use) {
	const { id, script } = data;
	const state = data.name == "性交" ? "ready" : "do";
	let setpart = `${script ? script : ""}<<set _selectPart to '${part}'>><<run F.checkAction('${id}', '${state}')>>`;

	if (use) {
		setpart = `<<set _selectActPart to '${part}'>>`;
		if (data?.option == "noSelectPart") {
			setpart += `<<run F.checkAction('${id}', 'do')>>`;
		} else {
			setpart += `<<run F.checkAction('${id}', 'ready'); F.initActMenu('${id}', 1)>>`;
		}
	}

	if (use && T.selectActPart == part) {
		return `<div class='actions selectAct'>[ 用${D.bodyparts[part]} ]</div>`;
	}

	console.log(setpart);
	return `<div class='actions parts'><<button '${use ? "用" : ""}${D.bodyparts[part]}'>>${setpart}<</button>></div>`;
};

F.partAble = function (actid, part, chara) {
	const data = Action.data[actid];
	if (data.type == "触手") {
		return 1;
	} else {
		return Action.globalPartAble(actid, part, chara);
	}
};

function filterActions(...types) {
	return Object.values(Action.data).filter((action) => types.includes(action.type));
}

F.initActMenu = function (actid, usepart) {
	//获取当前动作数据
	const _data = Action.data[actid];

	//创建系统链接
	function createSystemLinks(data) {
		const { option, event, id, alterName } = data;
		let name = data.name;
		if (alterName) name = alterName();
		return `<div class='actions'><<link '[ ${name} ]' ${option ? `'${option}'` : ""}>>${
			event ? `<<run Action.data['${id}'].event(); F.resetUI();>>` : ""
		}<</link>></div>`;
	}

	//创建目录
	const createMenu = function (list, array, option) {
		list.forEach((type) => {
			const _list = filterActions(type);
			_list.forEach((data) => {
				if (data.filter() && Action.globalFilter(data.id)) {
					if (option && data.name == "交流") {
						array[0] = F.actBtn(actid, data);
					} else if (option && data.name == "接触") {
						array[1] = F.actBtn(actid, data);
					} else {
						array.push(F.actBtn(actid, data));
					}
				}
			});
		});
	};

	//指令排序
	const layer1 = ["交流", "常规", "目录"];
	const layer2 = ["逆位", "接触", "道具", "触手", "魔法", "战斗", "命令"];
	const options = ["体位", "其他"];
	const systems = filterActions("固有");

	//动作可选部位
	const useParts = usepart && _data?.usePart ? _data.usePart : [];
	const targetParts = _data?.targetPart ? _data.targetPart : [];

	//初始化
	const mainActionMenu = ["", ""];
	const subActionMenu = [];
	const optionMenu = [];
	const partsMenu = [];
	const systemMenu = [];

	createMenu(layer1, mainActionMenu, 1);
	createMenu(layer2, subActionMenu);
	createMenu(options, optionMenu);

	systems.forEach((data) => {
		if (data.filter()) {
			systemMenu.push(createSystemLinks(data));
		}
	});

	//有可选部位才生成
	if (useParts.length) {
		useParts.forEach((part) => {
			if (F.partAble(actid, part, pc)) partsMenu.push(F.partBtn(_data, part, 1));
		});
	}

	if (targetParts.length && _data?.option !== "noSelectPart") {
		targetParts.forEach((part) => {
			if (F.partAble(actid, part, tc)) partsMenu.push(F.partBtn(_data, part));
		});
	}

	let html = "";

	if (mainActionMenu.length) {
		html += mainActionMenu.join("");
	}

	if (systemMenu.length) {
		html += `<div class='actions'> | </div>${systemMenu.join("")}`;
	}

	new Wikifier(null, `<<replace #actionMenu_1>>${html}<</replace>>`);

	const showhtml = function (tag, menu, label = "") {
		if (menu.length) {
			$(`#${tag}`).removeClass("hidden");
			new Wikifier(null, `<<replace #${tag}>>${menu.join("")}<</replace>>`);
		} else {
			$(`#${tag}`).addClass("hidden");
		}
	};

	showhtml("actionMenu_2", subActionMenu);
	showhtml("actionOption", optionMenu);
	showhtml("actionMenu_3", partsMenu);
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

F.checkAction = function (id, phase) {
	const data = Action.data[id];

	let reText = "";

	F.initCheckFlag();

	//触手系能无视伊希露本人意志对本人强制执行，但对本人有很多负面影响。
	//这部分处理放global统一处理。
	T.orderGoal = Action.globalOrder(id) + data.order();
	T.actAble = Action.globalCheck(id) && data.check();

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

F.beforeAction = function () {
	T.phase = "before";
	let id = T.actId;
	let reText = "";

	//角色每次执行COM时的个人检测。
	//如果口上侧要进行阻止某个指令进行，也会在这里打断。
	if (Story.has(`Kojo_${target.kojo}_BeforeAction`)) {
		new Wikifier("#hidden", Story.get(`Kojo_${target.kojo}_BeforeAction`).text);
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

F.doEvent = function () {
	let id = T.actId;

	const data = Action.data[id];

	let title = `Action_${id}`;
	let txt = T.noNameTag ? "" : F.playerName();

	T.phase = "event";
	F.resetMsg();

	//确认主控有条件执行
	if (T.actAble) {
		//确认对象愿意配合执行
		if (
			T.orderGoal == 0 ||
			V.system.debug ||
			(T.orderGoal > 0 && T.order >= T.orderGoal) ||
			(T.order + player.stats.LUK[1] >= T.orderGoal && random(100) <= player.stats.LUK[1] * 1.5) ||
			T.order + T.forceOrder >= T.orderGoal
		) {
			//经过时间
			T.passtime = data.time;

			//配合度不足但强制or勉强配合
			if (T.order < T.orderGoal && !V.system.debug) {
				if (T.forceOrder) {
					S.msg.push(`< 强制 ><br>`);
					T.force = 1;
				} else {
					S.msg.push(`勉强配合: ${T.order}+LUK${player.stats.LUK[1]}/${T.orderGoal}<br>`);
				}
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
		} else {
			//对方不配合执行失败的情况
			F.setPhase("failed");
		}
	} else {
		//条件不足执行取消的情况。
		F.setPhase("cancel");
	}
};

F.actionCancel = function () {
	let id = T.actId;
	let name = T.noNameTag ? "" : F.playerName();

	if (Story.has(`Action_${id}:Cancel`)) {
		F.Msg(name + Story.get(`Action_${id}:Cancel`).text);
		F.Msg(`<<run F.resetAction(); F.setPhase('init')>><<dashline>>`, 1);
	} else {
		F.resetAction();
		F.setPhase("init");
	}
};

F.actionFailed = function () {
	let id = T.actId;
	let name = T.noNameTag ? "" : F.playerName();

	if (Story.has(`Action_${id}:Failed`)) {
		F.Msg(name + Story.get(`Action_${id}:Failed`).text);
	} else {
		F.Msg("对方不愿意配合，执行失败。");
	}
	F.Msg(`<<run F.resetAction(); F.setPhase('init')>><<dashline>>`, 1);
};

F.resetMsg = function () {
	S.msg = [];
	T.msgId = 0;
};

F.resetAction = function () {
	T.phase = "reset";

	delete T.force;

	if (T.cancel) {
		F.initCheckFlag();
		F.setPhase("init");
		delete T.cancel;
		return 0;
	}

	//缓存最后一个动作
	V.lastAct = { act: T.selectAct, actPart: T.selectActPart, targetPart: T.selectPart };

	T.actId = "";
	T.actPart = "reset";

	F.initCheckFlag();
};
