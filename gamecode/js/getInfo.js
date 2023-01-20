function statsRank(v) {
	const select = new SelectCase();
	select
		.case([19, 20], "Ex")
		.case([16, 18], "SS")
		.case([13, 15], "S")
		.case([10, 12], "A")
		.case([8, 9], "B")
		.case([6, 7], "C")
		.case([4, 5], "D")
		.case([2, 3], "E")
		.else("F");

	return select.has(v);
}
DefineMacroS("statsRank", statsRank);

function skillRank(v) {
	const select = new SelectCase();
	select
		.case(3600, "Ex")
		.case(2800, "SS")
		.case(2100, "S")
		.case(1500, "A")
		.case(1000, "B")
		.case(600, "C")
		.case(300, "D")
		.case(100, "E")
		.else("F");

	return select.isGTE(v);
}
DefineMacroS("skillRank", skillRank);

p.you = function () {
	if (V.system.AlwaysShowPCName) {
		return player.name;
	}
	return "你";
};
DefineMacroS("you", p.you);

p.partner = function () {
	if (pc == "Isil") return C.Ayres.name;
	else return C.Isil.name;
};
DefineMacroS("partner", p.partner);

/**
 *
 * @param {string} text
 * @param {string} path
 * @returns {string}
 */
function tips(text, path) {
	if (!V.tips.record.includes(path)) {
		V.tips.record.push(path);
	}
	//console.log('tips',D.tips,path)
	const title = lan(D.tips[path].title);
	const content = lan(D.tips[path].content);

	const html = `<<Hover 300 '${text}' '${title}：${content}'>>`;
	return html;
}
window.tips = tips;
DefineMacroS("tips", tips);

F.getClass = function () {
	if (groupmatch(date.week, 1, 3) && date.time <= 720) return "魔法理论";

	if (groupmatch(date.week, 1, 3) && date.time <= 1020) return "概念魔法";

	if (groupmatch(date.week, 2, 4) && date.time <= 720) return "魔法物理";

	if (groupmatch(date.week, 2, 4) && date.time <= 1020) return "应用魔法";

	if (date.week == 5 && date.time <= 720) return "世界史";

	if (date.week == 5 && date.time <= 1020) return "魔药学";

	return "";
};

p.exp = function (chara, exp) {
	return C[chara].exp[exp].total;
};

p.charaName = function (cid) {
	const chara = C[cid];
	let color = Kojo.get(cid, "color");
	if (!color) color = "#22A0FC";

	const html = `<span style="color:${color}">[ ${chara.name} ]</span><br>`;
	return html;
};

p.playerName = function () {
	let color = Kojo.get(pc, "color");
	if (!color) color = "#22A0FC";

	const html = `<span style='color:${color}'>[ ${player.name} ]</span><br>`;
	return html;
};
DefineMacroS("pcnameTag", p.playerName);
DefineMacroS("nameTag", p.charaName);

p.actor = function () {
	if (T.actor == V.pc) return p.you();
	else return C[T.actor].name;
};

DefineMacroS("actor", p.actor);

p.target = function () {
	if (T.actTg == V.pc) return p.you();
	else return C[T.actTg].name;
};

DefineMacroS("target", p.target);

p.targetPart = function () {
	//const p = F.checkUse(T.actTg, T.actId);
	//之后根据特定部位弄点差分。主要是胸部、秘穴、菊穴、阴茎这几个部位。
	return D.bodyparts[T.selectPart];
};
p.actPart = function () {
	//阴茎会有特殊描述处理？
	return D.bodyparts[T.actPart];
};

DefineMacroS("targetPart", p.targetPart);
DefineMacroS("actPart", p.actPart);

//检测各个部位中的占用状态 。 如果为空或与当前id一致则返回true，否则返回false
cond.partIsEmpty = function (cid, id, part) {
	return Using[cid][part] == id || !Using[cid][part];
};

//检查触手有无空余，有返回空余部位id，没有返回 -1
cond.hasUnuseTentacle = function () {
	const tentacle = Using.m0.tentacles;
	for (let i = 0; i < tentacle.length; i++) {
		const info = tentacle[i];
		if (!info.act) return i;
	}
	return -1;
};

//事件中进行设置时
F.setActor = function (cid, tid, ...parts) {
	T.actor = cid;
	T.actTg = tid;

	if (parts[0]) T.selectPart = parts[0];
	else T.selectPart = "body";
	if (parts[1]) T.actPart = parts[1];
	else T.actPart = "hands";
};
DefineMacroS("setActor", F.setActor);
