// 信息流控制
p.flow = function (txt, time, dashline) {
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
ui.next = function () {
	let next = V.event.next;
	if (!next) next = "Next";
	return `<<link '${next}'>><<run Dialog.next()>><</link>>`;
};
DefineMacroS("eventnext", ui.next);

//-----------------事件系统-----------------

class Dialog {
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

		if (Config.debug) console.log(this.logs);
	}
	init(raw) {
		let config;
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

window.Dialog = Dialog;

//初始化事件标题
Dialog.initTitle = function () {
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

	if (Config.debug) {
		console.log("check", e, title, T.beforecheck);
	}
};

//当前dialog内容的初始化，同时记录回想节点。
Dialog.init = function () {
	const e = V.event;
	let title = e.fullname;

	if (e.ep) {
		title += `_ep${e.ep}`;
		Dialog.record("ep");
	}

	if (e.sp) {
		title += `:sp${e.sp}`;
		Dialog.record("sp");
	}

	S.dialog = new Dialog(title);
	T.eventTitle = title;
	const p = S.dialog.logs[0];

	if (!p) return "";

	const txt = txtp(p.text);
	e.config = p.config;
	e.next = "Next";

	setTimeout(() => {
		Dialog.flow(txt);
		e.phase = 0;
	}, 80);
};

//记录回想节点
Dialog.record = function (c) {
	const { type, id } = V.event;
	const p = V.event[c];
	let point;

	if (c == "sp" && V.event.ep) {
		point = `ep${V.event.ep}:sp${p}`;
	} else {
		point = `${c}${p}`;
	}

	if (!V.memory[type][id][c].includes(point)) {
		V.memory[type][id][c].push(point);
	}
};

//显示文本，并进行控制处理。
Dialog.flow = function () {
	const e = V.event;
	const p = S.dialog[e.phase];

	if (!p) return "";

	const txt = txtp(p.text);
	S.history.push(txt);

	p.flow(txt);

	e.config = {};
	e.config = p.config;

	const exit = p.config?.exitlink ? p.config.exitlink : "End";
	const select = new SelectCase();

	select.else("Next").case("return", "Back").case("endEvent", exit).case("end", "Continue");

	if (!p.config?.type) p.config.type = "";

	e.next = select.has(p.config.type);

	if (p.config.type == "onselect") {
		e.selectwait = true;
	}
};

Dialog.return = function () {
	const e = V.event;
	let { phase, com } = V.event.config;
	if (!com) com = "";

	if (phase) {
		e.phase = phase;
	}

	e.sp = 0;
	e.lastId = V.selectId;
	V.selectId = 0;
	if (com) new Wikifier("#hidden", com);
	Dialog.init();
};

Dialog.endPhase = function () {
	const e = V.event;
	const c = e.config;
	const com = c?.com ? c.com : "";
	const list = ["name", "eid", "ch", "ep", "sp"];
	list.forEach((key) => {
		if (c?.[key]) e[key] = c[key];
	});
	e.phase = 0;
	e.lastId = V.selectId;
	V.selectId = 0;
	e.sp = 0;

	if (com) new Wikifier("#hidden", com);
	Dialog.init();
};

Dialog.selectEnd = function () {
	e.sp = V.selectId;
	e.lastId = V.selectId;
	if (com) new Wikifier(null, com);
	Dialog.init();
};

//按下一步按钮或点击文本框时所进行的处理。
Dialog.next = function () {
	const e = V.event;
	const c = V.event.config;
	const com = c?.com ? c.com : "";
	const ch = T.eventTitle;

	if (!e.selectwait && e.phase < S.dialog[ch].length) {
		e.phase++;
		Dialog.flow(ch);
	}

	if (e.selectwait) ui.replace("next", "");
	else ui.replace("next", "<<eventnext>>");

	if (e.phase === S.dialog.length) {
		if (e.config.type == "return") {
			Dialog.return();
		} else if (e.config.type == "endPhase") {
			Dialog.endPhase();
		} else if (e.config.type == "jump") {
			new Wikifier(null, `${com}<<timed 80ms>><<goto 'EventStart'>><</timed>>`);
		} else if (e.config.type == "selectEnd") {
			Dialog.selectEnd();
		} else {
			if (!e.config?.exit) {
				e.config.exit = S.defaultExit;
				e.config.exitlink = "Continue";
			}

			V.mode = "normal";
			new Wikifier(null, `${com}<<goto 'EventEnd'>>`);
		}

		if (e.afterselect) delete e.afterselect;
	}
};
