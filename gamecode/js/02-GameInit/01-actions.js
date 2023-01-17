F.extendTags = function (raw) {
	return raw.split("|");
};

F.extendsRaw = function (raw, key) {
	if (key == "locationTags") return F.extendTags(raw);
	if (key == "targetPart" || key == "usePart") return F.extendParts(raw);
	return raw;
};

F.extendParts = function (raw) {
	let list = "mbpcvauehfnsrgd";
	let re = raw;

	if (raw.match(/^--\S+$/)) {
		raw = raw.replace("--", "");
		for (let i in raw) {
			list = list.replace(raw[i], "");
		}
		re = list;
	}

	if (raw == "all") {
		re = list;
	}

	const part = {
		m: "mouth",
		b: "breast",
		p: "penis",
		c: "critoris",
		v: "vagina",
		a: "anal",
		u: "urin",
		e: "ears",
		h: ["handL", "handR"],
		f: "foot",
		n: "neck",
		s: "butts",
		r: "nipple",
		g: "thighs",
		d: "abdomen",
	};

	const arr = re
		.split("")
		.map((char) => part[char])
		.flat();
	return arr;
};

const actList = {};

class Action {
	constructor({
		id,
		name,
		time = 5,
		mode = 0,
		usePart,
		targetPart,
		option,
		defaultText,
		type,
		autokeep = "n",
		locationTags,
	} = {}) {
		const typeMap = new Map(D.ActionTypes);
		this.id = id;
		this.name = name;
		this.type = typeMap.get(type);
		this.time = this.type == "固有" ? 0 : parseInt(time);
		this.mode = parseInt(mode);

		if (usePart) this.usePart = usePart;
		if (targetPart) this.targetPart = targetPart;
		if (option) this.option = option;

		if (this.type == "触手") this.usePart = ["tentacles"];

		this.filter = () => {
			return 1;
		};
		this.check = () => {
			return 1;
		};
		this.order = () => {
			return 0;
		};

		this.effect = (arg, ...args) => {
			return "";
		};

		this.checkPart = (arg, ...args) => {
			return 1;
		};

		if (locationTags) this.tags = locationTags;

		if (defaultText) this.templet = defaultText;

		if (autokeep == "y" || this.type == "体位");
		this.autokeep = 1;
	}
	static makeGroup = "";
	static add(id, obj) {
		Action.data[id] = new Action(obj);
	}
	static get(arg, args) {
		switch (arg) {
			case "usePart":
				return Object.values(Action.data).filter((action) => action.usePart && action.usePart.has(args));
			case "targetPart":
				return Object.values(Action.data).filter((action) => action.targetPart && action.targetPart.has(args));
			case "type":
				return Object.values(Action.data).filter((action) => action.type === args);
			default:
				return Object.values(Action.data).find((action) => action.type === arg && action.name === args);
		}
	}

	static set(id) {
		return Action.data[id];
	}

	static create(data, mode) {
		const { name, templet, targetPart, usePart, type } = data;

		let groupTitle = `:: Action_${type}_Options[script]\n`;

		let txt = `/* ${name} */\nAction.set('${data.id}')\n     .Filter(()=>{\n         return 1\n      })\n     .Check(()=>{\n         return 1\n      })\n     .Order(()=>{\n         return 0\n      })\n\n`;

		if (groupmatch(mode, "kojo", "msg")) txt = "";

		const convertTemplet = (templet, ...args) => {
			return templet
				.replace(/\{0}/g, "<<you>>")
				.replace(/\{1}/g, "$target.name")
				.replace(/\{2}/g, args[0] ? args[0] : "{0}")
				.replace(/\{3}/g, args[1] ? args[1] : "{1}");
		};

		const ctx = (use, parts, reverse) => {
			if (!templet) {
				return "";
			}
			return parts
				.map((tar) => {
					const m2 = reverse ? D.bodyparts[use] : D.bodyparts[tar];
					const m3 = reverse ? D.bodyparts[tar] : use ? D.bodyparts[use] : "{usePart}";

					return `<<case '${tar}'>>\n${convertTemplet(templet, m2, m3)}<br>\n`;
				})
				.join("");
		};

		let title = `:: ${mode == "kojo" ? "Kojo_cid_" : ""}Action_${data.id}`;

		if (mode == "script") {
			if (Action.makeGroup !== type) {
				Action.makeGroup = type;
				return groupTitle + txt;
			} else {
				return txt;
			}
		} else if (!groupmatch(mode, "kojo", "msg")) {
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
				txt += makeTxt(0, usePart[0], targetPart);
				break;
			case "道具":
				txt += makeTxt(0, "hands", targetPart);
				break;
			case "体位":
				txt += makeTxt(0, "penis", targetPart);
				break;
			case "逆位":
				txt += makeTxt(1, "penis", usePart, 1);
				break;
			default:
				if (templet) {
					txt += convertTemplet(templet);
				} else {
					txt += `${head}<<you>>在$location.name开始${name}。<br>\n\n\n`;
				}
		}

		return txt;
	}
	static init() {
		let arr = F.initList("ActionList", F.extendsRaw);
		arr.forEach((obj) => {
			Action.add(obj.id, obj);
		});
		console.log(Action.data);
	}
	static output(mode, type) {
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
	}
	Check(callback) {
		this.check = callback;
		return this;
	}
	Filter(callback) {
		this.filter = callback;
		return this;
	}
	Order(callback) {
		this.order = callback;
		return this;
	}
	ForceAble() {
		this.forceAble = true;
		return this;
	}
	Event(callback) {
		this.event = callback;
		return this;
	}
	Script(str) {
		this.script = str;
		return this;
	}
	Effect(callback) {
		this.effect = callback;
		return this;
	}
	Name(callback) {
		this.alterName = callback;
		return this;
	}
	Ready(callback) {
		this.onReady = callback;
		return this;
	}
}

window.Action = Action;
Action.data = actList;

Action.init();
