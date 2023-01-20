cond.isClasstime = function () {
	const date = V.date;
	if (inrange(date.week, 1, 5)) {
		const select = new SelectCase();
		select.case([500, 720], true).case([800, 1020], true).else(false);
		return select.has(date.time);
	}
	return false;
};

cond.baseLt = function (chara, key, val) {
	if (val === "max") return chara.base[key][0] < chara.base[key][1];
	else {
		if (between(val, 0, 1)) {
			return chara.base[key][0] < chara.base[key][1] * val;
		}
		return chara.base[key][0] < val;
	}
};

cond.palamLt = function (chara, key, val) {
	if (val === "max") return chara.palam[key][1] < chara.palam[key][2];
	else {
		if (between(val, 0, 1)) {
			return chara.palam[key][1] < chara.palam[key][2] * val;
		}
		return chara.palam[key][1] < val;
	}
};

cond.canSpeak = function (chara) {
	return !chara.state.has("失声", "失聪", "口球", "自闭");
};

cond.canMove = function (chara) {
	return !chara.state.has("拘束", "石化");
};

cond.canActNormal = function (chara) {
	return !chara.state.has("精神崩溃", "毒瘾发作", "性瘾发作");
};

cond.isSleeping = function (chara) {
	return chara.state.includes("睡眠");
};

cond.isUncons = function (chara) {
	return chara.state.has("睡眠", "晕厥") || (cond.baseLt(chara, "stamina", 10) && cond.baseLt(chara, "sanity", 10));
};

cond.isActive = function (chara) {
	return (
		!chara.state.has("睡眠", "晕厥", "精神崩溃", "拘束", "石化") &&
		!cond.baseLt(chara, "stamina", 0.1) &&
		!cond.baseLt(chara, "sanity", 0.1)
	);
};

cond.isRape = function (chara) {
	return (V.mode == "train" || chara.tsv.woohoo) && !chara.tsv.oksign;
};

cond.candResist = function (chara) {
	return !cond.isUncons(chara) && cond.canMove(chara);
};

cond.isWeaker = function (a, b) {
	let ap = F.BP(a);
	let bp = F.BP(b);

	if (ap < bp * 0.8) {
		return true;
	} else {
		return ap / bp <= 1.25 && cond.isEnergetic(a);
	}
};

//是否有充足精力进行抵抗。a是角色档案。
cond.isEnergetic = function (a, compareValue) {
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

	if (Config.debug) console.log(hp, stamina, sanity, mana);

	return stamina + sanity + mana > compareValue;
};

cond.isFallen = function (chara) {
	if (chara.flag.fallen >= 50) return true;
	if (chara.flag.depend >= 2500) return true;
	return false;
};

cond.OnlyU = function () {
	return pc == tc;
};

cond.hasPenis = function (cid) {
	return C[cid].gender !== "female";
};

cond.hasVagina = function (cid) {
	return C[cid].gender !== "male";
};

cond.justHands = function (part) {
	return (part.containsAll("handL", "handR") && part.length == 2) || (part.has("handL", "handR") && part.length == 1);
};
