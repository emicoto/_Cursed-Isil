window.EventDialog = function (chapter) {
	const e = V.event;
	const p = S.dialog[chapter][e.phase];

	if (!p) return "";

	const c = p.config;
	const txt = p.txt(p.text);

	S.history.push(txt);

	const softreset = `<<set $event.sp = 0>><<set $event.phase to $event.lastPhase>><<set $event.lastId = $selectId>><<set $selectId = 0>><<set S.dialog = {}>>`;
	const reset = c?.reset
		? c.reset
		: `<<set $event.phase = 0>><<set $event.lastId = $selectId>><<set $selectId = 0>><<set S.dialog = {}>><<set $event.sp = 0>>`;

	let link = `<br><br><div id='next'>`;
	let command = c?.com ? c.com : null;
	let exit = "$passage";

	if (V.mode == "history") command = "";

	if (c?.name) e.name = c.name;
	if (c?.eid) e.eid = c.eid;
	if (c?.ch) e.ch = c.ch;
	if (c?.ep) e.ep = c.ep;
	if (c?.sp) e.sp = c.sp;

	if (c?.type === "select" || c?.type === "noLink") {
	} else if (c?.type === "return") {
		//从选项分段中返回上一段。
		link += `<<link 'Back' $passage>>${softreset}${command}<</link>>`;
	} else if (c?.type === "jump") {
		//跳到完全不一样的事件分支系列。
		e.jump = true;
		e.backup = clone(V.event);
		link += `<<link 'Next' 'EventStart'>>${reset}${command}<</link>>`;
	} else if (c?.type === "end") {
		//一个段落读取结束时。
		if (c.exit) exit = c.exit;
		link += `<<link 'Continue' ${exit}>>${reset}${command}<</link>>`;
		V.event.lastPhase = V.event.phase;
	} else if (c?.type === "endEvent") {
		//一个事件彻底结束时。
		if (V.mode == "history") exit = "StoryMemory";
		else exit = c.exit;

		V.event.exit = exit;
		link += `<<link ${c.exitlink} 'EventEnd'>>${reset}${command}<</link>>`;
	} else {
		link += `<<link 'Next' $passage>><</link>>`;
	}

	link += "</div>";

	e.phase++;

	return txt + link;
};

window.DialogFlow = function (chapter) {
	const e = V.event;
	const p = S.dialog[chapter][e.phase];

	if (!p) return "";

	const txt = p.txt(p.text);
	S.history.push(txt);

	new Wikifier(null, `<<append #contentMsg transition>>${txt}<br><</append>>`);
	msg_end.scrollIntoView();

	V.event.config = {};
	V.event.config = p.config;

	const exit = p.config?.exitlink ? p.config.exitlink : "End";
	const select = new SelectCase();
	select.else("Next").case("return", "Back").case("endEvent", exit).case("end", "Continue");

	if (!p.config?.type) p.config.type = "";

	V.event.next = select.has(p.config.type);

	//console.log(p.config, V.event)

	if (p.config.type === "onselect") {
		V.event.selectwait = true;
	}
};

window.InitDialogFlow = function (chapter) {
	const e = V.event;
	const p = S.dialog[chapter][e.phase];

	if (!p) return "";

	const txt = p.txt(p.text);
	e.config = p.config;
	e.next = "Next";

	return txt;
};

Dialog.next = function (chapter) {
	const e = V.event;
	const c = V.event.config;
	const com = c?.com ? c.com : "";

	if (!e?.selectwait && e.phase < S.dialog[chapter].length) {
		e.phase++;
		DialogFlow(chapter);
	}

	if (e.phase == S.dialog[chapter].length) {
		if (e.config.type === "return") {
			e.sp = 0;
			e.lastId = V.selectId;
			V.selectId = 0;
			S.dialog = {};
			new Wikifier(null, `${com}<<goto 'EventLoop'>>`);
		} else if (e.config.type === "endPhase") {
			if (c?.name) e.name = c.name;
			if (c?.eid) e.eid = c.eid;
			if (c?.ch) e.ch = c.ch;
			if (c?.ep) e.ep = c.ep;
			if (c?.sp) e.sp = c.sp;

			e.phase = 0;
			e.lastId = V.selectId;
			V.selectId = 0;
			e.sp = 0;
			S.dialog = {};
			new Wikifier(null, `${com}<<goto 'EventLoop'>>`);
		} else if (e.config.type === "jump") {
			new Wikifier(null, `${com}<<goto 'EventStart'>>`);
		} else if (e.config.type === "selectEnd") {
			e.sp = V.selectId;
			S.dialog = {};
			new Wikifier(null, `${com}<<goto 'EventLoop'>>`);
		} else {
			if (!e.config?.exit) {
				e.config.exit = "MainLoop";
				e.config.exitlink = "Continue";
			}

			new Wikifier(null, `${com}<<goto 'EventEnd'>>`);
		}
	}

	if (e.afterselect) delete e.afterselect;

	if (e.selectwait) new Wikifier(null, "<<replace #next>> <</replace>>");
	else new Wikifier(null, `<<replace #next>><<eventnext>><</replace>>`);
};
