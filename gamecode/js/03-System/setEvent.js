window.Dlog = function (text, config) {
	const ch = T.passage;
	S.dialog[ch].push({ txt: text, config: config });
	return "";
};

F.resetEvent = function () {
	V.event = {
		type: "",
		eid: "",
		name: "",
		ch: "",
		ep: 0,
		phase: 0,
		sp: 0,
		lastId: 0,
		lastPhase: 0,
	};
	return "";
};

F.setEvent = function (type, name, eid, ch, ep) {
	V.event.type = type ? type : "Event";
	V.event.name = name ? name : "";
	V.event.eid = eid ? eid : "";
	V.event.ch = ch ? ch : "";
	V.event.ep = ep ? ep : 0;
	V.mode = "event";
	return "";
};

F.setMemory = function (id, title, chara) {
	const e = V.event;

	if (!V.memory[e.type]) {
		V.memory[e.type] = {};
	}

	if (e.type !== "Kojo") {
		V.memory[e.type][id] = {
			name: e.type.name,
			title: title,
			ep: [],
			sp: [],
		};
	} else {
		if (!V.memory[chara]) V.memory[chara] = {};
		V.memory[chara][id] = {
			name: e.type.name,
			title: title,
			ep: [],
			sp: [],
		};
	}
};
