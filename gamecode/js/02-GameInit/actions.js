F.initList = function (path, menu, option) {
	const rawtxt = Story.get(path).text.split("\n");

	const convert = (raw, arr) => {
		const v = raw.split(",");
		const keys = Object.keys(obj);
		let newobj = {};

		keys.forEach((k, i) => {
			newobj[k] = v[i];
			if (typeof option === "function") {
				newobj[k] = option(v[i], k);
			}
		});
		newobj.type = id;
		arr.push(newobj);
	};

	const makeObj = (line) => {
		const keys = line.slice(3).split(",");
		obj = {};
		keys.forEach((k) => {
			obj[k] = null;
		});
	};

	var obj, id;
	const arr = {};
	if (!menu) arr.a = [];

	rawtxt.forEach((raw) => {
		raw = raw.replace(/\s/g, "");
		if (raw[0] == "#") {
			makeObj(raw);
			id = raw[1];
		} else if (raw.match(/^\/\*(.+)\*\/|^\/(.+)/) || raw === "") {
			//注释和空行要过滤掉
		} else {
			if (menu) {
				if (!arr[id]) arr[id] = [];
				convert(raw, arr[id]);
			} else {
				convert(raw, arr["a"]);
			}
		}
	});

	const result = [];
	Object.values(arr).forEach((array) => {
		result.push(...array);
	});

	return result;
};

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
	constructor(
		id,
		name,
		{ time = 5, mode = 0, usePart, targetPart, option, defaultText, type, autokeep = "n", locationTags } = {}
	) {
		const typeMap = new Map(D.ActionTypes);
		this.id = id;
		this.name = name;
		this.type = typeMap.get(type);
		this.time = type == "E" ? 0 : parseInt(time);
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
			return 0;
		};

		if (locationTags) this.tags = locationTags;

		if (defaultText) this.templet = defaultText;

		if (autokeep == "y" || this.type == "体位");
		this.autokeep = 1;
	}

	static add(id, name, obj) {
		Action.data[id] = new Action(id, name, obj);
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
		//console.log(id, Action.data[id])
		return Action.data[id];
	}

	static create(data, mode) {
		const { name, templet } = data;

		let txt = `/* ${name} */\nAction.set('${data.id}')\n     .Filter(()=>{\n         return 1\n      })\n     .Check(()=>{\n         return 1\n      })\n     .Order(()=>{\n         return 0\n      })\n\n`;

		if (mode == "kojo") txt = "";

		const ctx = (use) => {
			if (!data.templet) {
				console.log(use, data);
				return "";
			}
			return data.targetPart
				.map((tar) => {
					return `<<case '${tar}'>>\n   ${data.templet
						.replace(/\{0}/g, "<<you>>")
						.replace(/\{1}/g, "$target.name")
						.replace(/\{2}/g, D.bodyparts[tar])
						.replace(/\{3}/g, use ? D.bodyparts[use] : "{usePart}")}<br>\n`;
				})
				.join("");
		};

		let title = `:: ${mode == "kojo" ? "Kojo_cid_" : ""}Action_${data.id}`;

		if (mode == "script") {
			return txt;
		}

		if (groupmatch(data.type, "接触", "逆位", "触手")) {
			txt += data.usePart
				.map((k) => {
					return `${title}\n/* ${name} */\n<<switch T.selectPart)>>\n${ctx(k)}<</switch>>\n\n`;
				})
				.join("");
		} else if (groupmatch(data.type, "道具", "体位")) {
			return `${title}\n/* ${name} */\n<<switch T.selectPart>>\n${ctx("")}<</switch>>\n\n`;
		} else {
			txt += `${title}\n/* ${name} */\n<<you>>在$location.name开始${name}。<br>\n\n`;
		}

		return txt;
	}
	static init() {
		let arr = F.initList("ActionList", 1, F.extendsRaw);
		console.log(arr);
		arr.forEach((obj) => {
			Action.add(obj.id, obj.name, obj);
		});
	}
	static output(mode, type) {
		const txt = Object.values(Action.data)
			.filter(
				(action) =>
					(mode == "kojo" && groupmatch(action.type, "调教", "触手", "道具", "体位", "交流", "")) ||
					(type && action.type == type) ||
					(!type && action.type !== "固有")
			)
			.map((data) => Action.create(data, mode))
			.join("");

		download(txt, "action", "txt");
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

Action.globalFilter = function (id) {
	const data = Action.data[id];

	const hasTg = pc !== tc;
	const noTg = ["Magic", "Items", "Self", "Other"];
	const noTgType = ["常规", "魔法", "道具", "自慰", "其他", "固有"];

	//总之先按照分类过滤
	if (!groupmatch(data.type, "目录", "常规", "固有") && T.currentType !== "all" && T.currentType !== data.type)
		return 0;

	//触手模式只能控制触手
	if (pc == "m0" && data.type !== "触手") return 0;

	//使用部位过滤器只会在接触以上模式出现
	if (id.match(/^use\S+/) && Flag.mode < 2) return 0;

	//占用中。解除倒是没问题。
	if (T.actPart !== "reset" && Using[pc][T.actPart] == id) return 1;
	if (T.actPart !== "reset" && Using[pc][T.actPart]?.act !== "") return 0;

	//选择过滤器中、
	if (T.actPartFilter !== "all" && data.usePart && !data.usePart.includes(T.actPartFilter)) return 0;

	//特定分类批处理
	switch (data.type) {
		case "触手":
			if (!Flag.master || (data.mode > 2 && V.date.time < 1200)) return 0;
			break;

		case "接触":
			if (Flag.mode < 2) return 0;
			if (!F.uncons(target) && data.mode > Cflag[tc].touchLv + 0.5) return 0;
			break;

		case "逆位":
			if (V.mode !== "reverse") return 0;
			break;

		case "常规":
			if (!V.location.tag.has(data.tags)) return 0;
			if (Flag.mode > 0 && !data?.option?.has("canTrain")) return 0;
			break;

		case "交流":
			if (Flag.mode < 1) return 0;
			if (Flag.mode > 1 && !data?.option?.has("canTrain")) return 0;
			break;

		case "体位":
			if (T.selectAct == "t8" && !groupmatch(T.selectPart, "vagina", "anal")) return 0;
			if (T.selectAct !== "t8") return 0;
			break;

		//要有对应道具才行
		case "道具":
		//if(!F.iventory('find', id))
		//   return 0
		case "魔法":
		case "命令":
			if (data.type !== T.currentType) return 0;
			break;
	}

	return 1;
};

Action.globalCheck = function (id) {
	const data = Action.data[id];

	switch (data.type) {
		case "触手":
			if (!F.isFallen(target) && !F.uncons(target) && !Flag.aware) {
				T.reason += "【未堕落的对象】";
				return 0;
			}
	}

	return 1;
};

Action.globalOrder = function (id) {
	const data = Action.data[id];

	switch (data.type) {
		case "触手":
			if (!F.isFallen(target)) {
				T.orderMsg += "【未堕落(-30)】";
				T.order -= 30;
			}
			if (pc == "Isil" && tc == pc && Flag.aware) {
				T.orderMsg += "【对宿主的强制调教(+50)】";
				T.forceOrde += 50;
			}
			break;
	}

	return 0;
};

Action.globalPartAble = function (id, part, cid) {
	const data = Action.data[id];
	const chara = C[cid];

	if (chara.gender == "female" && part == "penis") return 0;

	if (chara.gender == "male" && part == "vagina") return 0;

	return Using[cid][part].act == "" || Using[cid][part].act == id;
};
