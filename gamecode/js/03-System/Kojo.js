class Kojo {
	static data = {};
	static set(id, color) {
		let data = Kojo.data;
		if (!data[id]) data[id] = new Kojo(id, color);
		return data[id];
	}

	static get(id, type) {
		//当角色口上与角色id不一致时
		if (C[id].kojo !== id) id = C[id].kojo;

		let data = Kojo.data[id];
		if (!data) return;
		return type ? data[type] : data;
	}

	static title(cid, type, id, dif) {
		if (dif && ["Before", "After", "Cancel", "Keep", "Failed", "Force"].includes(dif)) {
			dif = ":" + dif;
		} else if (dif) {
			dif = "_" + dif;
		} else {
			dif = "";
		}

		//如果使用口上与id不一致，则覆盖。大概是随机NPC会不一样吧。
		if (C[cid].kojo !== cid) {
			cid = C[cid].kojo;
		}

		return `Kojo_${cid}_${type}${id ? "_" + id : ""}${dif}`;
	}

	static has(cid, { type, id, dif, check } = {}) {
		let title = Kojo.title(cid, type, id, dif);

		if (type == "custom") {
			title = `Msg_${id}${dif ? `:${dif}` : ""}`;
		}

		if (check && !Story.has(title)) {
			title = `Msg_${type}${id ? `_${id}` : ""}${dif ? `:${dif}` : ""}`;
			return Story.has(title);
		}
		return Story.has(title);
	}
	/**
	 *
	 * @param {string} cid
	 * @param {string} type
	 * @param {string | number} id
	 * @param {string} branch
	 * @returns
	 */
	static put(cid, { type, id, dif, tag } = {}) {
		let title = Kojo.title(cid, type, id, dif);

		if (type == "custom") {
			title = `Msg_${id}${dif ? `:${dif}` : ""}`;
		}

		let retext = "";

		T.noMsg = 0;

		if (Story.has(title)) {
			retext = Story.get(title).text;
		}

		if (cid == pc && type == "PCAction" && !V.system.showPCKojo) {
			retext = "";
		}

		if (!retext) {
			title = `${type?.has("Action") ? "Msg_" : ""}${type}${id ? `_${id}` : ""}${dif ? `:${dif}` : ""}`;
			if (Story.has(title)) {
				retext = Story.get(title).text;
			}
		}
		if (Config.debug) console.log(title, retext);

		if (retext) {
			let matcher = [`<<nameTag '${cid}'>>`, `<<nameTag "${cid}">>`];
			if (!retext.has(matcher) && !tag) {
				retext = `<<nameTag '${cid}'>>` + retext;

				if (cid == pc) T.noNameTag = 1;
				else T.noNameTag = 0;
			}
			retext += "<<dashline>>";

			return retext;
		}

		T.noMsg = 1;

		return "";
	}

	constructor(id, color) {
		this.id = id;
		this.color = color ? color : "#22A0FC";
		this.intro = [];
		this.schedule = [];
		this.preset = [];
		this.filter = () => {
			return 1;
		};
		this.action = [];
		this.event = [];
		this.home = "void";
		this.relation = {};
		this.counter = [];
	}
	Intro(str) {
		this.intro = str;
		return this;
	}
	Schedule(id, list) {
		if (id) this.schedule[id] = list;
		else this.schedule.push(list);
		return this;
	}
	Filter(cond) {
		this.filter = cond;
		return this;
	}
	Action(id, obj) {
		if (id) this.action[id] = obj;
		else this.action.push(obj);
		return this;
	}
	Event(id, obj) {
		if (id) this.event[id] = obj;
		else this.event.push(obj);

		return this;
	}
	Home(str) {
		this.home = str;
		return this;
	}
	Relation(id, des, val) {
		this.relation[id] = [val, des];
		return this;
	}
	Counter(id, obj) {
		if (id) this.counter[id] = obj;
		else this.counter.push(obj);
		return this;
	}
}

window.Kojo = Kojo;

/**
 *
 * @param {string} txt
 * @returns
 */
F.convertKojo = function (txt) {
	if (!txt.includes("<<=Kojo.put")) return txt;

	console.log("find kojo?");

	const match = txt.match(/<<=Kojo.put(.+?)>>/g);
	match.forEach((p) => {
		const t = p.match(/<<=Kojo.put\((.+?)\)>>/);
		const args = t[1].replace(/\s+/g, "").replace(/'|"/g, "").split(",");

		//cid的转换。还是直接eval吧。
		if (args[0].includes("$")) {
			args[0] = args[0].replace("$", "V.");
		}
		let cid = eval(args[0]);

		if (Config.debug) console.log("args", args, "cid", cid);

		txt = txt.replace(p, Kojo.put(cid, args[1], args[2], args[3]));
	});

	return txt;
};