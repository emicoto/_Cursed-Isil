const selectedActionBtn = function (name) {
	return `<div class='actioins selectAct'>[ ${name} ]</div>`;
};

const getBtnStyle = function (id, part) {
	const able = Action.able(id, part, 1);
	const order = Action.order(id, part, 1);
	let style = "gray";
	if (able) {
		const select = new SelectCase();
		select.case("succeed", "gold").case("luck succeed", "orange").case("force succeed", "blue").else("red");
		style = select.has(order);
	}
	return style;
};

const createActionBtn = function (currentSelect, actionData, layer) {
	const { id, alterName, type, onReady } = actionData;

	//如果有自定义名称，就用自定义名称。
	let name = outputData.name;
	if (alterName) name = alterName();

	//如果是当前选中的，就清除链接并加上选中标记。
	if (currentSelect == id || (type == "目录" && T.actionTypeFilter == id)) {
		return selectedActionBtn(name);
	}

	const inputType = Action.getInputType(id);
	const ready = onReady ? `<<run Action.data['${id}'].onReady() >>` : "";

	const style = getBtnStyle(id);
	const link = layer == 1 ? "link" : "button";

	return `<div class='actions ${style}'><<${link} '${name}'>><<run Action.onInput('${id}', '${inputType}')>>${ready}<</${link}>></div>`;
};

const createOptionBtn = function (actionData, option, selectType) {
	const { id } = actionData;

	let name = option;
	if (selectType == "actor") {
		name = `用${option}`;
	}

	//如果是当前选中的，就清除链接并加上选中标记。
	if (selectType == "actor" && T.select.actPart == option) {
		return selectedActionBtn(name);
	}

	const inputType = selectType == "actor" ? "partsOption-actor" : "partsOption-target";
	const style = getBtnStyle(id, option);

	return `<div class='actions ${style}'><<button '${name}'>><<run Action.onInput('${id}', '${inputType}', '${option}')>><</button>></div>`;
};

const createSystemLinks = function (data) {
	let { name, option, event, id, alterName } = data;
	if (alterName) name = alterName();
	if (option) option = `'${option}'`;
	else option = "''";

	return `<div class='actions'><<link '[ ${name} ]' ${option}>>${
		event ? `<<run Action.data['${id}'].event(); Action.redraw();>>` : ""
	}<</link>></div>`;
};

//创建目录
const createMenu = function (typelist, outputArray, currentSelect, layer) {
	typelist.forEach((type) => {
		//获取当前类型的所有指令
		const actions = Action.typeFilter(type);
		//遍历指令
		actions.forEach((data) => {
			const { id } = data;
			if (data.filter() && Action.globalFilter(id)) {
				if (id == "Interaction") {
					outputArray[0] = createActionBtn(currentSelect, data, layer);
				} else if (id == "Touch") {
					outputArray[1] = createActionBtn(currentSelect, data, layer);
				} else {
					outputArray.push(createActionBtn(currentSelect, data, layer));
				}
			}
		});
		//
	});
};

ui.showhtml = function (tag, menu) {
	if (menu.length) {
		$(`#${tag}`).removeClass("hidden");
		ui.replace(tag, menu.join(""));
	} else {
		$(`#${tag}`).addClass("hidden");
	}
};

Action.hide = function () {
	const label = "#actionMenu_";

	$(label + 1).addClass("hidden");
	$(label + 2).addClass("hidden");
	$(label + 3).addClass("hidden");
	$("#actionOption").addClass("hidden");

	ui.replace(label + 1, " ");
	ui.replace(label + 2, " ");
	ui.replace(label + 3, " ");
	ui.replace("#actionOpton", " ");
};

Action.show = function () {
	const label = "#actionMenu_";

	$(label + 1).removeClass("hidden");
	$(label + 2).removeClass("hidden");
	$(label + 3).removeClass("hidden");
	$("#actionOption").removeClass("hidden");
};

Action.shownext = function (hide) {
	let html = hide ? "" : `<<link 'Next'>><<run Action.next()>><</link>>`;
	new Wikifier("#next", `<<replace #next>>${html}<</replace>>`);
};

Action.updateMenu = function (selectId, option) {
	//获取当前动作数据。
	const data = Action.data[selectId];
	const { actPart, targetPart, filter } = data;

	//指令排序
	const layer1 = ["交流", "常规", "目录"];
	const layer2 = ["逆位", "接触", "道具", "触手", "魔法", "战斗", "命令"];
	const options = ["体位", "其他"];
	const systems = Action.typeFilter("固有");

	//可选部位
	const actorOption = Action.SelectableParts(selectId, 1);
	const targetOption = Action.SelectableParts(selectId, 2);

	//目录一览
	const mainActionMenu = ["", ""];
	const subActionMenu = [];
	const optionMenu = [];
	const partsMenu = [];
	const systemMenu = [];

	//创建目录
	createMenu(layer1, mainActionMenu, selectId, 1);
	createMenu(layer2, subActionMenu, selectId, 2);
	createMenu(options, optionMenu, selectId, 3);

	//系统目录
	systems.forEach((data) => {
		if (data.filter()) {
			systemMenu.push(createSystemLinks(data));
		}
	});

	//可选部位
	if (actorOption.length > 1) {
		actorOption.forEach((part) => {
			partsMenu.push(createPartsBtn(selectId, part, "actor"));
		});
	}

	if (targetOption.length > 1) {
		targetOption.forEach((part) => {
			partsMenu.push(createPartsBtn(selectId, part, "target"));
		});
	}

	let html = "";

	if (mainActionMenu.length) {
		html += mainActionMenu.join("");
	}

	if (systemMenu.length) {
		html += `<div class='actions'> | </div> ${systemMenu.join("")}`;
	}

	ui.replace("actionMenu_1", html);

	ui.showhtml("actionMenu_2", subActionMenu);
	ui.showhtml("actionOption", optionMenu);
	ui.showhtml("actionMenu_3", partsMenu);
};

const createKeepingLinks = function (cid, actId, part) {
	const data = Action.data[actId];
	const { name } = data;

	const html = `<div class='actions keep'><<link '[ ${name} ]'>><<run Action.unset('${cid}', '${part}')>><</link>></div>`;
	return html;
};

//检测并显示持续中的动作状态。点击对应动作可以取消。
Action.onGoing = function () {
	const charalist = V.location.chara;
	const charaHtml = [];

	charalist.forEach((cid) => {
		const html = [
			`<div class='namelabel'><span style='color:#${Kojo.get(cid, "color")}'>${C[cid].name}</span>  ：</div>`,
		];
		for (let part in Using[cid]) {
			const info = Using[cid][part];
			if (info.act) {
				html.push(createKeepingLinks(cid, info.act, part));
			}
		}
		if (html.length > 1) {
			charaHtml.push(html.join(""));
		}
	});

	ui.showhtml("keeping", charaHtml);
};

//刷新界面和对象
Action.redraw = function () {
	V.target = C[tc];
	V.player = C[pc];

	ui.delink();
	Action.updateScene();
	Action.show();
	Action.updateMenu(id, option);
	Action.shownext(1);
	Action.onGoing();
	//ui.sidebar()

	ui.replace("showtime", "<<showtime>><<showmoney>>");
	return "";
};
