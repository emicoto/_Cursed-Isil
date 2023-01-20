//添加macro com
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

//era经典指令系统
class Com {
	//新建指令
	static new(id, obj) {
		comdata[id] = new Com(obj);
		return comdata[id];
	}
	//获取指令设置
	static set(id, time) {
		if (time) {
			return comdata[id].Time(time);
		} else {
			return comdata[id];
		}
	}
	//初始化指令列表
	static init() {
		const list = F.makeList("ComList");
		list.forEach((obj) => {
			Com.new(obj.id, obj);
		});
		console.log(comdata);
	}
	//构建指令
	constructor({ id, name, tags = [], type, time = 5 }) {
		this.id = id;
		this.name = name;
		this.tag = [type];

		if (tags.length) this.tag = this.tag.concat(tags);

		//过滤器
		this.filter = () => {
			return true;
		};
		//条件
		this.cond = () => {
			return true;
		};
		//效果
		this.source = () => {};

		//默认经历时间
		this.time = time;

		//配合值需求
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
	//添加标签
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
	//动态设置指令名
	Name(callback) {
		this.name = callback;
		return this;
	}
	//即使配合度不足也可能强行执行。
	ForceAble() {
		this.forceAble = true;
		return this;
	}
}
window.Com = Com;

//生成指令过滤目录
Com.filters = function () {
	const general = clone(D.ComFilterGeneral);
	const train = clone(D.ComFilterTrain);
	const end = "<<=Com.initList()>><</link>>";
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

//生成指令列表
Com.initList = function () {
	const command = [];

	Object.values(comdata).forEach((com) => {
		const { id, time } = com;
		let name = "";

		if (typeof com.name === "function") name = com.name();
		else name = com.name;

		let txt = "";

		if (com.filter() && Com.globalFilter(id)) {
			txt = `<<com '${name}' ${time} ${id}>><<run Com.Check('${id}')>><</com>>`;
		} else if (V.system.showAllCommand) {
			txt = `<div class='command unable'><<button '${name}'>><</button>></div>`;
		}

		command.push(txt);
	});

	if (command.length) {
		new Wikifier(null, `<<replace #commandzone>>${command.join("")}<</replace>>`);
	} // 数量过多时启动分页显示。
};
