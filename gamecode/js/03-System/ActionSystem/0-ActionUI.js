F.actBtn = function (actid, data) {
	const { id, script, event, alterName, option, type } = data;
	let name = data.name;
	if (alterName) name = alterName();

	if (actid == id || (data.type == "目录" && T.actType == id)) {
		return `<div class='actions selectAct'>[ ${name} ]</div>`;
	}

	if ((groupmatch(type, "接触", "触手", "逆位") && option !== "doStraight") || (type == "道具" && data.targetPart)) {
		let use;
		if (data.usePart && data.usePart.length > 1) {
			if (!(F.justHands(data.usePart) && V.mode !== "reverse")) {
				use = 1;
			}
		}

		return `<div class='actions'><<link '${data.name}'>>
        <<run F.checkAction('${id}', 'ready'); F.initActMenu('${id}'${use ? ", 1" : ""});>>
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

	return `<div class='actions parts'><<button '${use ? "用" : ""}${D.bodyparts[part]}'>>${setpart}<</button>></div>`;
};

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
			const _list = F.filterActions(type);
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
	const systems = F.filterActions("固有");

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
