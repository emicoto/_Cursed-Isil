const { SelectCase } = require("Code/utils/selectcase");

//选择中的按钮
selectedActionBtn = function (name, option) {
	return `<div class='actioins selectAct'>[ ${option ? "用" : ""}${name} ]</div>`;
};

//还不能立刻执行的动作按钮
readyActionBtn = function (name, id, option) {
	return `<div class='actions'>
   <<link '${name}>>
      <<run F.inputAction('${id}', 'ready', ${option ? "1" : "0"}); >>'
   <</link>>
   </div>`;
};

//按钮的颜色
getBtnStyle = function (id) {
	const able = Action.able(id);
	const order = Action.order(id);
	let style = "gray";
	if (able) {
		const select = new SelectCase();
		select.case("succeed", "gold").case("luck succeed", "orange").case("force succeed", "blue").else("red");
		style = select.has(order);
	}
	return style;
};

//确认执行的按钮
doActionBtn = function (name, { id, script = "", event }) {
	const style = getBtnStyle(id);
	const run = event ? `<<run Action.data['${id}'].event(); F.resetUI()>>` : `<<run F.inputAction('${id}', 'do')>>`;

	return `<div class='actions ${style}'>
      <<link "${name}">>
         ${script}${run}
      <</link>>
      </div>`;
};

//判定是否有可选项目
optionalAction = function (actionData) {
	const { type, option, targetPart } = actionData;
	if (groupmatch(type, "接触", "触手", "逆位") && option.has("doStraight") === false) return 1;

	if (type == "道具" && targetPart) return 1;

	return 0;
};

//存在多个可动作的部位
hasActionalPart = function (parts) {
	if (!parts || parts.length <= 1) return false;

	return (justHands(parts) && V.mode !== "reverse") === false;
};

//创建动作指令按钮
createActionButton = function (currentAction, outPutData) {
	//缩短一下。
	const ca = currentAction,
		data = outPutData;

	const { id, alterName, type } = data;

	let name = data.name;
	if (alterName) name = alterName();

	if (ca == id || (type == "目录" && T.actPartFilter == id)) {
		return selectedActionBtn(name);
	}

	if (optionalAction(data)) {
		let _option = hasActionalPart(usePart);
		return readyActionBtn(name, id, _option);
	}

	return doActionBtn(name, data);
};

//创建部位选项按钮
createPartsButton = function ({ id, script = "", name, option } = data, currentPart, onUse) {
	let state = name == "性交" ? "ready" : "do";
	if (onUse && option.includes("noSelectPart")) state = "do";

	let setter = `${script}<<set _${
		onUse ? "actPart" : "selectPart"
	} to '${currentPart}'>><<run F.inputAction('${id}', '${state}')`;

	if (onUse && T.actPart == currentPart) return selectedActionBtn(name, 1);

	const style = getBtnStyle(id);

	return `<div class='actions parts ${style}'>
   <<button '${onUse ? "用" : ""}${D.bodyparts[currentPart]}'>>${setter}<</button>></div>`;
};

//创建系统链接
createSystemLinks = function (data) {
	const { option, event, id, alterName } = data;
	let name = data.name;
	if (alterName) name = alterName();
	return `<div class='actions'><<link '[ ${name} ]' ${option ? `'${option}'` : ""}>>${
		event ? `<<run Action.data['${id}'].event(); F.resetUI();>>` : ""
	}<</link>></div>`;
};

//筛选动作档案
filterActions = function (...types) {
	return Object.values(Action.data).filter((action) => types.includes(action.type));
};
//创建目录
createMenu = function (list, array, option) {
	list.forEach((type) => {
		const _list = filterActions(type);
		_list.forEach((data) => {
			if (data.filter() && Action.globalFilter(data.id)) {
				if (option && data.name == "交流") {
					array[0] = createActionButton(actid, data);
				} else if (option && data.name == "接触") {
					array[1] = createActionButton(actid, data);
				} else {
					array.push(createActionButton(actid, data));
				}
			}
		});
	});
};

//初始化以及更新整个动作选项栏
updateActionMenu = function (currentAction, waitInput) {
	const data = Action.data[currentAction];
	const { usePart, targetPart } = data;

	//指令排序
	const layer1 = ["交流", "常规", "目录"];
	const layer2 = ["逆位", "接触", "道具", "触手", "魔法", "战斗", "命令"];
	const options = ["体位", "其他"];
	const systems = filterActions("固有");

	//可选部位
	const selectableParts1 = waitInput == 1 && usePart ? usePart : [];
	const selectableParts2 = targetPart ? targetPart : [];

	//初始化目录表
	const mainActionMenu = ["", ""];
	const subActionMenu = [];
	const optionMenu = [];
	const partsMenu = [];
	const systemMenu = [];

	//开始创建
	createMenu(layer1, mainActionMenu, 1);
	createMenu(layer2, subActionMenu);
	createMenu(options, optionMenu);

	//系统指令
	systems.forEach((data) => {
		if (data.filter()) {
			systemMenu.push(createSystemLinks(data));
		}
	});

	//有可选部位才生成
	if (selectableParts1.length) {
		selectableParts1.forEach((part) => {
			if (Action.partAble(currentAction, part, pc) && data.check(part))
				partsMenu.push(createPartsButton(data, part, 1));
		});
	}

	if (selectableParts2.length && data?.option !== "noSelectPart") {
		selectableParts2.forEach((part) => {
			if (Action.partAble(currentAction, part, tc) && data.check(part))
				partsMenu.push(createPartsButton(data, part));
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

	const showhtml = function (tag, menu) {
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

makeCharalist = function (charalist) {
	if (!charalist.length) return "";

	charalist.forEach((cid) => {
		const com = `<<set $tc to '${cid}'>><<run F.charaEvent('${cid}'); F.resetUI()>>`;
	});
};

//更新场景
updateScene = function () {
	const { name, id, chara, tags } = V.location;
	const charalist = makeCharaList(chara);
};

inputAction = function (id, phase, wait) {
	const data = Action.data[id];
	const select = T.select;
	if (!select.id || select.id !== id) {
		F.initActionInput(id);
	}
	//如果输入的部位为空，且data中有候选
	//则根据check part自动填充
	if (T.actPart) {
		T.select.ap = T.actPart;
	} else if (data?.usePart?.length) {
		T.select.ap = data.usePart[0];
	}

	if (T.selectPart) {
		T.select.tp = T.selectPart;
	} else if (data?.targetPart?.length) {
		T.select.tp = data.targetPart[0];
	}

	//输入流程还没结束的话，就直接返回并刷新界面
	if (phase == "ready") {
		F.initCheckFlag();
		F.resetUI(id, wait);
		return 0;
	}

	F.checkAction(id);
};
