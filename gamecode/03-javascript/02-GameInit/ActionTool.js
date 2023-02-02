Action.create = function (data, mode) {
	const { name, templet, targetPart, actPart, type } = data;

	let isCounter = mode.includes("counter");
	let isKojo = mode.includes("kojo");

	let groupTitle = `:: Action_${type}_Options[script]\n`;

	let txt = `/* ${name} */\nAction.set('${data.id}')\n     .Filter(()=>{\n         return 1\n      })\n     .Check(()=>{\n         return 1\n      })\n     .Order(()=>{\n         return 0\n      })\n\n`;

	if (groupmatch(mode, "kojo", "msg") || isKojo) txt = "";

	const convertTemplet = (templet, ...args) => {
		if (!args[0]) args[0] = "{0}";
		if (!args[1]) args[1] = "{1}";

		const charaA = isCounter ? "<<target>>" : "<<you>>";
		const charaB = isCounter ? "<<you>>" : "<<target>>";
		const replace2 = isCounter ? args[1] : args[0];
		const replace3 = isCounter ? args[0] : args[1];

		return templet
			.replace(/\{0}/g, charaA)
			.replace(/\{1}/g, charaB)
			.replace(/\{2}/g, replace2)
			.replace(/\{3}/g, replace3);
	};

	const ctx = (use, parts, reverse) => {
		if (!templet) {
			return "";
		}
		return parts
			.map((tar) => {
				const m2 = reverse ? D.bodyparts[use] : D.bodyparts[tar];
				const m3 = reverse ? D.bodyparts[tar] : use ? D.bodyparts[use] : "{actPart}";

				return `<<case '${tar}'>>\n${isKojo ? "/* " : ""}${convertTemplet(templet, m2, m3)}<br>${
					isKojo ? " */" : ""
				}\n`;
			})
			.join("");
	};

	let titlehead = isKojo ? "Kojo_NPCID_" : "";
	let titleend = isKojo ? "[noMsg]" : "";
	let titlemain = isCounter ? "Counter" : "Action";
	let title = `:: ${titlehead}${titlemain}_${data.id}${titleend}`;

	if (mode == "script") {
		if (Action.makeGroup !== type) {
			Action.makeGroup = type;
			return groupTitle + txt;
		} else {
			return txt;
		}
	} else if (!groupmatch(mode, "kojo", "msg") && !isKojo) {
		txt = `:: Action_${data.id}_Options[script]\n` + txt;
	}

	const head = `${title}\n/* ${name} */\n`;
	const makeTxt = function (part, use, parts, reverse) {
		const main = `<<switch T.${part ? "actPart" : "selectPart"}>>\n${ctx(use, parts, reverse)}<</switch>>\n\n\n`;

		return head + main;
	};

	switch (type) {
		case "接触":
		case "触手":
			txt += makeTxt(0, actPart[0], targetPart);
			break;
		case "道具":
			txt += makeTxt(0, "hands", targetPart);
			break;
		case "体位":
			txt += makeTxt(0, "penis", targetPart);
			break;
		case "逆位":
			txt += makeTxt(1, "penis", actPart, 1);
			break;
		default:
			if (templet) {
				txt += convertTemplet(templet);
			} else {
				txt += `${head}<<you>>在$location.name${name}。<br>\n\n\n`;
			}
	}

	return txt;
};

Action.output = function (mode, type) {
	//如果存在具体id，直接返回指定id的模板。
	if (mode.has("id")) {
		mode.replace("-id", "");
		const data = Action.data[type];
		return Action.create(data, mode);
	}
	const txt = Object.values(Action.data)
		.filter(
			(action) =>
				(mode == "kojo" && !groupmatch(action.type, "常规", "目录", "其他", "固有")) ||
				(type && action.type == type) ||
				(!type && action.type !== "固有")
		)
		.map((data) => Action.create(data, mode))
		.join("");

	download(txt, "ActionTemplet" + (type ? `_${type}` : ""), "twee");
};
