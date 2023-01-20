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
	return !chara.state.has("束缚", "石化");
};

cond.canActNormal = function (chara) {
	return !chara.state.has("精神崩溃", "毒瘾发作", "性瘾发作");
};

cond.isSleeping = function (chara) {
	return chara.state.includes("睡眠");
};

cond.isUncons = function (chara) {
	return chara.state.has("睡眠", "晕厥") || (chara.base.sanity[0] < 10 && chara.base.stamina[0] < 10);
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

//是否有充足精力进行抵抗。
cond.isEnergetic = function (a) {
	const hp = (a.base.health[0] * 2) / a.base.health[1]; //影响抵御上限
	const stamina = Math.floor((a.base.stamina[0] / a.base.stamina[1]) * 100 * hp);
	const sanity = Math.floor((a.base.sanity[0] / a.base.sanity[1]) * 100 * ((hp / 2) * 1.5));
	const mana = Math.floor((a.base.mana[0] / a.base.mana[1]) * 50);

	if (Config.debug) console.log(hp, stamina, sanity, mana);
	//2, 200, 150, 50
	return stamina + sanity + mana > 160;
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
