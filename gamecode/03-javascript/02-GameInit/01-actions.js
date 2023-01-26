const extendTags = function (raw) {
	if (!raw) return [];
	return raw.split("|");
};

const extendsRaw = function (raw, key) {
	if (key == "locationTags" || key == "placement") return extendTags(raw);
	if (key == "targetPart" || key == "actPart") return extendParts(raw);
	return raw;
};

const extendParts = function (raw) {
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

//动作class
class Action {
	//对动作的各设置项目进行初始化
	constructor({
		id,
		name,
		time = 5,
		mode = 0,
		actPart,
		targetPart,
		setting,
		defaultText,
		type,
		autokeep = "n",
		locationTags,
		placement,
	} = {}) {
		const typeMap = new Map(D.ActionTypes);
		this.id = id;
		this.name = name;
		this.type = typeMap.get(type);
		this.time = this.type == "固有" ? 0 : parseInt(time);
		this.mode = parseInt(mode);

		if (actPart) this.actPart = actPart;
		if (targetPart) this.targetPart = targetPart;
		if (setting) this.setting = setting;

		if (this.type == "触手") this.actPart = ["tentacles"];

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
		if (placement) this.placement = placement;

		if (defaultText) this.templet = defaultText;

		if (autokeep == "y" || this.type == "体位");
		this.autokeep = 1;
	}
	static makeGroup = "";
	//追加到动作列表中
	static add(id, obj) {
		Action.data[id] = new Action(obj);
	}
	//从动作列表中获取动作
	static get(arg, args) {
		switch (arg) {
			case "actPart":
				return Object.values(Action.data).filter((action) => action.actPart && action.actPart.has(args));
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

	//创建动作文字模板
	static create(data, mode) {
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
	}
	//从设置列表中初始化
	static initdata() {
		let arr = F.makeList("ActionList", extendsRaw);
		arr.forEach((obj) => {
			Action.add(obj.id, obj);
		});
		console.log(Action.data);
	}
	//从角色口上中初始化
	static initKojo() {
		let data = Object.values(Kojo.data).filter((obj) => obj.action.length);
		data.forEach((kojo) => {
			kojo.action.forEach((obj) => {
				if (!obj?.type) obj.type = "C";
				if (!obj?.setting) obj.setting = "Kojo";
				else obj.setting += "/Kojo";
				Action.add(obj.id, obj);
			});
		});
	}
	//打印模板
	static output(mode, type) {
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
	DefaultText(str) {
		this.defaultText = str;
		return this;
	}
	Options(str) {
		this.options = str;
		return this;
	}
}

window.Action = Action;
Action.data = actList;
Action.kojo = {};

Action.initdata();