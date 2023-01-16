Macro.add("com", {
	tags: null,
	handler: function () {
		let { contents, args } = this.payload[0];

		if (args.length === 0) {
			return this.error("no command text specified");
		}

		if (!T.comcount) T.comcount = 1;
		else T.comcount++;

		let comId = args[2];

		let output = `<div id='com_${T.comcount}' class='command'>
        <<button '${args[0]}'>>
        <<set $selectCom to '${comId}'>><<set $passtime to ${args[1]}>>
        ${contents}
        <</button>>
        </div>`;

		if (Config.debug) console.log(output);

		jQuery(this.output).wiki(output);
	},
});

window.comdata = {};
class Com {
	static new(id, name, tags, time) {
		comdata[id] = new Com(id, name, tags, time);
		return comdata[id];
	}
	static set(id, time) {
		if (time) {
			return comdata[id].Time(time);
		} else {
			return comdata[id];
		}
	}

	static init() {
		const raw = Story.get("ComList").text.split("\n");
		const list = [];
		raw.forEach((k) => {
			if (!k.includes("/*") && k !== "") {
				let r = k.replace(/\s/g, "").split(",");
				let info = {
					no: r[0],
					name: r[1] ? r[1] : "Com" + r[0],
					tags: r[2] ? r[2].split("|") : [],
					time: r[3] ? parseInt(r[3]) : 5,
				};
				//console.log(info)
				list.push(info);
			}
		});

		list.forEach((k) => {
			Com.new(k.no, k.name, k.tags, k.time);
		});
	}

	constructor(id, name, tags, time) {
		const typeMap = new Map(D.ComTypes);

		this.id = id;
		this.name = name;
		this.tag = [typeMap.get(id[0])];

		if (tags.length) this.tag = this.tag.concat(tags);

		this.filter = () => {
			return true;
		}; //特定的过滤器。
		this.cond = () => {
			return true;
		};
		this.source = () => {};
		this.time = time;
		this.order = () => {
			return 0;
		};
	}
	Check(callback) {
		this.cond = callback;
		return this;
	}
	Filter(callback) {
		this.filter = callback;
		return this;
	}
	Effect(callback) {
		this.source = callback;
		return this;
	}
	Tags(arr) {
		this.tag = arr;
		return this;
	}
	Time(t) {
		this.time = t;
		return this;
	}
	addTag(arg, ...args) {
		this.tag.push(arg);
		if (args) {
			this.tag = this.tag.concat(args);
		}
		return this;
	}
	ComOrder(callback) {
		this.order = callback;
		//录入reason同时返回order值
		return this;
	}
	Name(callback) {
		this.name = callback;
		return this;
	}
	ForceAble() {
		this.forceAble = true;
		return this;
	}
}
window.Com = Com;

F.ComFilters = function () {
	const general = clone(D.ComFilterGeneral);
	const train = clone(D.ComFilterTrain);
	const end = "<<=F.initComList()>><</link>>";
	const generalink = [];
	const trainlink = [];

	general.forEach((k) => {
		generalink.push(`<<link '${k}'>><<set $currentFilter to '${k}'>>${end}`);
	});

	train.forEach((k) => {
		trainlink.push(`<<link '${k}'>><<set $currentFilter to '${k}'>>${end}`);
	});

	return `<<link '全部'>><<set $currentFilter to 'all'>>${end} ｜ ${generalink.join(
		""
	)}<<if $mode is 'train'>>${trainlink.join("")}<</if>>`;
};

F.initComList = function () {
	const command = [];

	Object.values(comdata).forEach((com) => {
		const { id, time } = com;
		let name = "";

		if (typeof com.name === "function") name = com.name();
		else name = com.name;

		let txt = "";

		if (com.filter() && Com.globalFilter(id)) {
			txt = `<<com '${name}' ${time} ${id}>><<run F.ComCheck('${id}')>><</com>>`;
		} else if (V.system.showAllCommand) {
			txt = `<div class='command unable'><<button '${name}'>><</button>></div>`;
		}

		command.push(txt);
	});

	if (command.length) {
		new Wikifier(null, `<<replace #commandzone>>${command.join("")}<</replace>>`);
	} // 数量过多时启动分页显示。
};
