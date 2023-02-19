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

P.you = function () {
	if (V.system.AlwaysShowPCName) {
		return player.name;
	}
	return "你";
};
DefineMacroS("you", P.you);

P.partner = function () {
	if (pc == "Isil") return C.Ayres.name;
	else return C.Isil.name;
};
DefineMacroS("partner", P.partner);

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

P.exp = function (cid, exp) {
	return C[cid].exp[exp].total;
};

P.charaName = function (cid) {
	const chara = C[cid];
	let color = Kojo.get(cid, "color");
	if (!color) color = "#22A0FC";

	const html = `<span style="color:${color}">[ ${chara.name} ]</span><br>`;
	return html;
};

P.playerName = function () {
	let color = Kojo.get(pc, "color");
	if (!color) color = "#22A0FC";

	const html = `<span style='color:${color}'>[ ${player.name} ]</span><br>`;
	return html;
};
DefineMacroS("pcnameTag", P.playerName);
DefineMacroS("nameTag", P.charaName);

P.actor = function () {
	if (T.actor == V.pc) return P.you();
	else return C[T.actor].name;
};

DefineMacroS("actor", P.actor);

P.target = function () {
	if (T.target == V.pc) return P.you();
	else return C[T.target].name;
};

DefineMacroS("target", P.target);

P.targetPart = function () {
	const p = T.action.tgPart;
	//之后根据特定部位弄点差分。主要是胸部、秘穴、菊穴、阴茎这几个部位。
	return D.bodyparts[p];
};
P.actpart = function () {
	//阴茎会有特殊描述处理？
	const p = T.action.actPart;

	return D.bodyparts[p];
};

DefineMacroS("targetPart", P.targetPart);
DefineMacroS("actPart", P.actpart);

P.mutants = function (level) {
	let txt = "";
	for (let i = 0; i < level; i++) {
		txt += `【${D.mutant[i]}】`;
	}
	return txt;
};
