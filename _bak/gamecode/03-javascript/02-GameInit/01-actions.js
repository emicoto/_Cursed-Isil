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
		c: "clitoris",
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
