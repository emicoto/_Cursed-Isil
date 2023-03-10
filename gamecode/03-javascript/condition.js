Cond.isClasstime = function () {
	const date = V.date;
	if (inrange(date.week, 1, 5)) {
		const select = new SelectCase();
		select.case([500, 720], true).case([800, 1020], true).else(false);
		return select.has(date.time);
	}
	return false;
};

Cond.baseLt = function (cid, key, val) {
	if (val === "max") return C[cid].base[key][0] < C[cid].base[key][1];
	else {
		if (between(val, 0, 1)) {
			return C[cid].base[key][0] < C[cid].base[key][1] * val;
		}
		return C[cid].base[key][0] < val;
	}
};

Cond.baseIs = function (cid, key) {
	return C[cid].base[key][0] / C[cid].base[key][1];
};

Cond.palamLt = function (cid, key, val) {
	if (val === "max") return C[cid].palam[key][1] < C[cid].palam[key][2];
	else {
		if (between(val, 0, 1)) {
			return C[cid].palam[key][1] < C[cid].palam[key][2] * val;
		}
		return C[cid].palam[key][1] < val;
	}
};

Cond.flagLt = function (cid, key, val) {
	return C[cid].flag[key] < val;
};

Cond.favoLt = function (cid, val) {
	return C[cid].flag.favo < val;
};

Cond.trustLt = function (cid, val) {
	return C[cid].flag.trust < val;
};

Cond.dependLt = function (cid, val) {
	return C[cid].flag.depend < val;
};

Cond.isVirgin = function (cid) {
	if (C[cid].gender === "male") return C[cid].virginity.analsex.length > 1;
	else return C[cid].virginity.vaginasex.length > 1;
};

Cond.isCockVirgin = function (cid) {
	if (C[cid].gender === "female") return false;
	return C[cid].virginity.penis.length > 1;
};

Cond.canSpeak = function (cid) {
	return !C[cid].state.has("失声", "失聪", "口球", "自闭");
};

Cond.canMove = function (cid) {
	return !C[cid].state.has("拘束", "石化");
};

Cond.canActNormal = function (cid) {
	return !C[cid].state.has("精神崩溃", "毒瘾发作", "性瘾发作");
};

Cond.isSleeping = function (cid) {
	return C[cid].state.includes("睡眠");
};

Cond.isUncons = function (cid) {
	return C[cid].state.has("睡眠", "晕厥") || (Cond.baseLt(cid, "stamina", 10) && Cond.baseLt(cid, "sanity", 10));
};

Cond.isActive = function (cid) {
	return (
		!C[cid].state.has("睡眠", "晕厥", "精神崩溃", "拘束", "石化") &&
		!Cond.baseLt(cid, "stamina", 0.1) &&
		!Cond.baseLt(cid, "sanity", 0.1)
	);
};

Cond.isRape = function (cid) {
	return (V.mode == "train" || C[cid].tsv.woohoo) && !C[cid].tsv.oksign;
};

Cond.candResist = function (cid) {
	return !Cond.isUncons(cid) && Cond.canMove(cid);
};

Cond.isWeaker = function (a, b) {
	const charaA = C[a],
		charaB = C[b];
	let ap = charaA.bp();
	let bp = charaB.bp();

	if (ap < bp * 0.8) {
		return true;
	} else {
		return ap / bp <= 1.25 && Cond.isEnergetic(a);
	}
};

//是否有充足精力进行抵抗。a是角色档案。
Cond.isEnergetic = function (cid, compareValue) {
	const a = C[cid];
	//首先获取HP的影响值。HP影响抵御上限。公式：HP*2/HP上限
	const hp = (a.base.health[0] * 2) / a.base.health[1];

	//体力的比重值换算。公式：体力/体力上限*100*HP影响值
	const stamina = Math.floor((a.base.stamina[0] / a.base.stamina[1]) * 100 * hp);

	//理智的比重值换算。公式：理智/理智上限*100*HP影响值*0.75
	const sanity = Math.floor((a.base.sanity[0] / a.base.sanity[1]) * 100 * (hp * 0.75));

	//魔力的比重值换算。公式：魔力/魔力上限*50
	const mana = Math.floor((a.base.mana[0] / a.base.mana[1]) * 50);

	//当health, stamina, sanity, mana的处于满值时，总值估算为：200+150+50=400
	//理想情况下，总值低于160时，角色无法进行有效的抵抗。
	if (!compareValue) compareValue = 160;

	if (game.debug) console.log(hp, stamina, sanity, mana);

	return stamina + sanity + mana > compareValue;
};

Cond.isFallen = function (cid) {
	if (C[cid].flag.fallen >= 50) return true;
	if (C[cid].flag.depend >= 2500) return true;
	return false;
};

Cond.OnlyU = function () {
	return pc == tc && V.location.chara.length === 1;
};

Cond.OnlyU2 = function () {
	return V.location.chara.length === 2 && pc !== tc;
};

Cond.hasTarget = function () {
	return pc !== tc;
};

Cond.bothIs = function (cid) {
	return cid === pc && cid === tc;
};

Cond.pcIs = function (cid) {
	return cid === pc;
};

Cond.hasPenis = function (cid) {
	return C[cid].gender !== "female";
};

Cond.hasVagina = function (cid) {
	return C[cid].gender !== "male";
};

Cond.justHands = function (part) {
	return (part.containsAll("handL", "handR") && part.length == 2) || (part.has("handL", "handR") && part.length == 1);
};

Cond.cursedLvGt = function (abl, value) {
	return V.cursedLord.abl[abl] > value;
};

Cond.betweenTime = function (start, end) {
	return V.date.time >= start * 60 && V.date.time < end * 60;
};

//检测各个部位中的占用状态 。 如果为空或与当前id一致则返回true，否则返回false
Cond.partIsEmpty = function (cid, id, part) {
	return Using[cid][part].action == id || !Using[cid][part].action;
};

//检查触手有无空余，有返回空余部位id，没有返回 -1
Cond.hasUnuseTentacle = function () {
	const tentacle = Using.m0.tentacles;
	for (let i = 0; i < tentacle.length; i++) {
		const info = tentacle[i];
		if (!info.action) return i;
	}
	return -1;
};

Cond.markLv = function (cid, key) {
	return C[cid].mark[key];
};

Cond.markIs = function (cid, key, val) {
	const markkey = getKeyByValue(D.mark, key);
	return C[cid].mark[markkey] === val;
};

Cond.StallBusinessTime = function () {
	if (groupmatch(V.date.week, 0, 6)) return Cond.betweenTime(5.5, 20);
	if (V.date.week == 1) return Cond.betweenTime(5.5, 16);
	else return Cond.betweenTime(13, 17);
};
