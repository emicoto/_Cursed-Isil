// 信息流控制
F.txtFlow = function (txt, time, dashline) {
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
F.nextLink = function () {
	let next = V.event.next;
	console.log(V.event.next);
	if (!next) next = "Next";
	return `<<link '${next}'>><<run F.nextDialog()>><</link>>`;
};
DefineMacroS("eventnext", F.nextLink);

//获取事件完整文本，并进行解析转化
F.initText = function (title) {
	const input = Story.get(title).text.split("\n");

	S.dialog[title] = [];
	let text = [];
	let config = {};

	input.forEach((t) => {
		if (t.includes("#:{")) {
			t = t.replace("#:", "");
			config = JSON.parse(t);
		} else if (t.match(/^\/\*(.+)\*\/$/)) {
			//注释要扣掉
		} else {
			text.push(t);
		}

		if (t === "<fr>" || input[input.length - 1] === t) {
			S.dialog[title].push({ text, config });
			config = {};
			text = [];
		}
	});

	if (Config.debug) console.log("dialog", title, S.dialog[title]);
};

//事件进程初始化
F.initEvent = function () {
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
F.initDialog = function () {
	const e = V.event;
	let title = e.fullname;

	if (e.ep) {
		title += `_ep${e.ep}`;
		F.recEventPoint("ep");
	}

	if (e.sp) {
		title += `:sp${e.sp}`;
		F.recEventPoint("sp");
	}

	F.initText(title);
	T.eventTitle = title;
	const p = S.dialog[title][0];

	if (!p) return "";

	const txt = txtp(p.text);
	e.config = p.config;
	e.next = "Next";

	setTimeout(() => {
		F.dialogFlow(txt);
		e.phase = 0;
	}, 80);
};

//显示文本，并进行控制处理。
F.dialogFlow = function () {
	const e = V.event;
	const p = S.dialog[T.eventTitle][e.phase];

	if (!p) return "";

	const txt = txtp(p.text);
	S.history.push(txt);

	F.txtFlow(txt);

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

//按下一步按钮或点击文本框时所进行的处理。
F.nextDialog = function () {
	const e = V.event;
	const c = V.event.config;
	const com = c?.com ? c.com : "";
	const ch = T.eventTitle;

	if (!e.selectwait && e.phase < S.dialog[ch].length) {
		e.phase++;
		F.dialogFlow(ch);
	}

	if (e.selectwait) new Wikifier(null, "<<replace #next>> <</replace>>");
	else new Wikifier(null, `<<replace #next>><<eventnext>><</replace>>`);

	if (e.phase === S.dialog[ch].length) {
		if (e.config.type == "return") {
			if (c?.phase) e.phase = c.phase;
			e.sp = 0;
			e.lastId = V.selectId;
			V.selectId = 0;

			if (com) new Wikifier(null, com);
			F.initDialog();
		} else if (e.config.type == "endPhase") {
			if (c?.name) e.name = c.name;
			if (c?.eid) e.eid = c.eid;
			if (c?.ch) e.ch = c.ch;
			if (c?.ep) e.ep = c.ep;
			if (c?.sp) e.sp = c.sp;

			e.phase = 0;
			e.lastId = V.selectId;
			V.selectId = 0;
			e.sp = 0;

			if (com) new Wikifier(null, com);
			F.initDialog();
		} else if (e.config.type == "jump") {
			new Wikifier(null, `${com}<<timed 80ms>><<goto 'EventStart'>><</timed>>`);
		} else if (e.config.type == "selectEnd") {
			e.sp = V.selectId;
			S.dialog = {};

			if (com) new Wikifier(null, com);
			F.initDialog();
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
