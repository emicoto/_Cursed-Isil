// 信息流控制
P.flow = function (txt, time, dashline) {
	if (!time) time = 60;

	new Wikifier(
		null,
		`<<append #contentMsg transition>><<timed ${time}ms>>${txt}${dashline ? "<<dashline>>" : ""}<</timed>><</append>>`
	);

	setTimeout(() => {
		msg_end.scrollIntoView();
	}, time);

	msg_end.scrollIntoView();
};

//下一步按钮
Ui.next = function () {
	let next = V.event.next;
	if (!next) next = "Next";
	return `<<link '${next}'>><<run Dlog.next()>><</link>>`;
};
DefineMacroS("eventnext", Ui.next);

//-----------------事件系统-----------------

class Dlog {
	logs = [];
	option = {};
	constructor(title) {
		//获取事件完整文本，并进行解析转化
		const raw = Story.get(title).text.split("\n");
		this.logs = [];
		this.option = {
			title,
			phase: 0,
			next: "Next",
			end: "End",
		};
		this.init(raw);

		if (game.debug) console.log(this.logs);
	}
	init(raw) {
		let config,
			text = [];
		//解析事件文本，并清除注释
		raw.forEach((line) => {
			if (line[0] === "#") {
				config = JSON.parse(line.replace("#:", "")) || {};
			} else if (line.match(/^\/\*(.+)\*\/$/)) {
				//注释要扣掉
			} else {
				text.push(line);
			}

			if (line === "<fr>" || raw[raw.length - 1] === line) {
				this.logs.push({ text, config });
				config = {};
				text = [];
			}
		});
	}
}

window.Dlog = Dlog;

//初始化事件标题
Dlog.initTitle = function () {
	const e = V.event;
	let title = `${e.type}_${e.name}`;

	if (e.eid) {
		title = `${e.type}_${e.eid}_${e.name}`;
	}

	if (e.ch) {
		title += `_${e.ch}`;
	}

	e.fullname = title;

	if (Story.has(title + "::Before")) {
		T.beforecheck = title + "::Before";
	}

	if (game.debug) {
		console.log("check", e, title, T.beforecheck);
	}
};

//当前dialog内容的初始化，同时记录回想节点。
Dlog.init = function () {
	const e = V.event;
	let title = e.fullname;

	if (e.ep) {
		title += `_ep${e.ep}`;
		Dlog.record("ep");
	}

	if (e.sp) {
		title += `:sp${e.sp}`;
		Dlog.record("sp");
	}

	S.dialog = new Dlog(title);
	T.eventTitle = title;
	const p = S.dialog.logs[0];
	if (!p) return "";

	const txt = P.txt(p.text);
	e.config = p.config;
	e.next = "Next";

	setTimeout(() => {
		P.flow(txt);
		e.phase = 0;
	}, 80);
};

//记录回想节点
Dlog.record = function (c) {
	const { type, id } = V.event;
	const p = V.event[c];
	let point;

	if (c == "sp" && V.event.ep) {
		point = `ep${V.event.ep}:sp${p}`;
	} else {
		point = `${c}${p}`;
	}

	let memory = getByPath(V, `memory.${type}.${id}`);
	if (!memory[c]) memory[c] = [];

	if (!memory[c].includes(point)) {
		memory[c].push(point);
	}
};

//显示文本，并进行控制处理。
Dlog.flow = function () {
	const e = V.event;
	const pa = S.dialog.logs[e.phase];
	console.log(e, pa);

	if (!pa) return "";

	const txt = P.txt(pa.text);
	S.history.push(txt);

	P.flow(txt);

	e.config = {};
	e.config = pa.config;

	const exit = pa.config?.exitlink ? pa.config.exitlink : "Next";
	const select = new SelectCase();

	select.else(exit).case("return", "Back").case("jump", "End").case("endEvent", "Continue");

	if (!pa.config?.type) pa.config.type = "";

	e.next = select.has(pa.config.type);

	if (pa.config.type == "onselect") {
		e.selectwait = true;
	}
};

Dlog.return = function () {
	const e = V.event;
	let { phase, com, ep } = V.event.config;
	if (!com) com = "";

	if (phase) {
		e.phase = phase;
	}

	e.sp = 0;
	e.lastId = V.selectId;
	V.selectId = 0;
	if (com) new Wikifier("#hidden", com);
	Dlog.init();
};

Dlog.endPhase = function () {
	const e = V.event;
	const c = e.config;
	const com = c?.com ? c.com : "";
	const list = ["name", "eid", "ch", "ep"];
	let set;
	list.forEach((key) => {
		if (c?.[key]) {
			e[key] = c[key];
			set = 1;
		}
	});

	if (!set) e.ep++;

	e.phase = 0;
	e.lastId = V.selectId;
	V.selectId = 0;

	if (!c.sp) e.sp = 0;

	if (com) new Wikifier("#hidden", com);
	Dlog.init();
};

Dlog.jump = function () {
	const e = V.event;
	const c = e.config;
	const com = c?.com ? c.com : "";
	const list = ["name", "eid", "ch", "ep", "sp"];
	list.forEach((key) => {
		if (c?.[key]) e[key] = c[key];
	});

	new Wikifier(null, `${com}<<timed 80ms>><<goto 'EventStart'>><</timed>>`);
};

Dlog.selectEnd = function () {
	e.sp = V.selectId;
	e.lastId = V.selectId;
	if (com) new Wikifier(null, com);
	Dlog.init();
};

//按下一步按钮或点击文本框时所进行的处理。
Dlog.next = function () {
	const e = V.event;
	const c = V.event.config;
	const com = c?.com ? c.com : "";

	if (!e.selectwait && e.phase < S.dialog.logs.length) {
		e.phase++;
		Dlog.flow();
	}

	if (e.selectwait) Ui.replace("next", "");
	else Ui.replace("next", "<<eventnext>>");

	if (e.phase === S.dialog.logs.length) {
		if (e.config?.type == "return") {
			Dlog.return();
		} else if (e.config?.type == "endPhase") {
			Dlog.endPhase();
		} else if (e.config?.type == "jump") {
			Dlog.jump();
		} else if (e.config?.type == "selectEnd") {
			Dlog.selectEnd();
		} else {
			if (!e.config?.exit) {
				if (!e.config) e.config = {};
				e.config.exit = S.defaultExit;
				e.config.exitlink = "Continue";
			}

			V.mode = "normal";
			new Wikifier(null, `${com}<<goto 'EventEnd'>>`);
		}

		if (e.afterselect) delete e.afterselect;
	}
};
