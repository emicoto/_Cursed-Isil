cond.isClasstime = function () {
	const date = V.date;
	if (inrange(date.week, 1, 5)) {
		const select = new SelectCase();
		select.case([500, 720], true).case([800, 1020], true).else(false);
		return select.has(date.time);
	}
	return false;
};

cond.baseLt = function (cid, key, val) {
	if (val === "max") return C[cid].base[key][0] < C[cid].base[key][1];
	else {
		if (between(val, 0, 1)) {
			return C[cid].base[key][0] < C[cid].base[key][1] * val;
		}
		return C[cid].base[key][0] < val;
	}
};

cond.baseIs = function (cid, key) {
	return C[cid].base[key][0] / C[cid].base[key][1];
};

cond.palamLt = function (cid, key, val) {
	if (val === "max") return C[cid].palam[key][1] < C[cid].palam[key][2];
	else {
		if (between(val, 0, 1)) {
			return C[cid].palam[key][1] < C[cid].palam[key][2] * val;
		}
		return C[cid].palam[key][1] < val;
	}
};

cond.flagLt = function (cid, key, val) {
	return C[cid].flag[key] < val;
};

cond.favoLt = function (cid, val) {
	return C[cid].flag.favo < val;
};

cond.trustLt = function (cid, val) {
	return C[cid].flag.trust < val;
};

cond.dependLt = function (cid, val) {
	return C[cid].flag.depend < val;
};

cond.isVirgin = function (cid) {
	if (C[cid].gender === "male") return C[cid].virginity.analsex.length > 1;
	else return C[cid].virginity.vaginasex.length > 1;
};

cond.isCockVirgin = function (cid) {
	if (C[cid].gender === "female") return false;
	return C[cid].virginity.penis.length > 1;
};

cond.canSpeak = function (cid) {
	return !C[cid].state.has("失声", "失聪", "口球", "自闭");
};

cond.canMove = function (cid) {
	return !C[cid].state.has("拘束", "石化");
};

cond.canActNormal = function (cid) {
	return !C[cid].state.has("精神崩溃", "毒瘾发作", "性瘾发作");
};

cond.isSleeping = function (cid) {
	return C[cid].state.includes("睡眠");
};

cond.isUncons = function (cid) {
	return C[cid].state.has("睡眠", "晕厥") || (cond.baseLt(cid, "stamina", 10) && cond.baseLt(cid, "sanity", 10));
};

cond.isActive = function (cid) {
	return (
		!C[cid].state.has("睡眠", "晕厥", "精神崩溃", "拘束", "石化") &&
		!cond.baseLt(cid, "stamina", 0.1) &&
		!cond.baseLt(cid, "sanity", 0.1)
	);
};

cond.isRape = function (cid) {
	return (V.mode == "train" || C[cid].tsv.woohoo) && !C[cid].tsv.oksign;
};

cond.candResist = function (cid) {
	return !cond.isUncons(cid) && cond.canMove(cid);
};

cond.isWeaker = function (a, b) {
	const charaA = C[a],
		charaB = C[b];
	let ap = charaA.bp();
	let bp = charaB.bp();

	if (ap < bp * 0.8) {
		return true;
	} else {
		return ap / bp <= 1.25 && cond.isEnergetic(a);
	}
};

//是否有充足精力进行抵抗。a是角色档案。
cond.isEnergetic = function (cid, compareValue) {
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

cond.isFallen = function (cid) {
	if (C[cid].flag.fallen >= 50) return true;
	if (C[cid].flag.depend >= 2500) return true;
	return false;
};

cond.OnlyU = function () {
	return pc == tc && V.location.chara.length === 1;
};

cond.OnlyU2 = function () {
	return V.location.chara.length === 2 && pc !== tc;
};

cond.hasTarget = function () {
	return pc !== tc;
};

cond.bothIs = function (cid) {
	return cid === pc && cid === tc;
};

cond.pcIs = function (cid) {
	return cid === pc;
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

cond.cursedLvGt = function (abl, value) {
	return V.cursedLord.abl[abl] > value;
};

cond.betweenTime = function (start, end) {
	return V.date.time >= start * 60 && V.date.time < end * 60;
};

//是否处于某个不健康状态，并返回健康值的影响值
cond.healthWarn = function (cid) {
	const { flag } = C[cid];

	let multip = 0;
	let cond = ["stamina", "sanity", "mana", "hydration", "nutrient"];
	let evalcond = "";
	cond.forEach((key) => {
		evalcond += `cond.baseLt(cid, "${key}", 0.05) && `;
	});

	if (eval(evalcond)) {
		multip += 0.1;
	}

	if (!cond.baseLt(cid, "drug", 0.9) || !cond.baseLt(cid, "alcohol", 0.9)) {
		multip += 0.1;
	}

	const list = {
		tired: [5, 0.01],
		nutrient: [3, 0.1],
		stressful: [7, 0.05],
		sleepless: [3, 0.02],
		losingmana: [5, 0.02],
	};

	for (const [key, [max, value]] of Object.entries(list)) {
		if (flag[key] > max) multip += value;
	}

	return multip;
};
