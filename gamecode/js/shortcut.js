F.baseUp = function (chara, key, val) {
	chara.base[key][0] += val;
};

F.baseCheck = function (chara, key, val) {
	if (val === "max") return chara.base[key][0] < chara.base[key][1];
	else {
		if (between(val, 0, 1)) {
			return chara.base[key][0] < chara.base[key][1] * val;
		}
		return chara.base[key][0] < val;
	}
};

F.palamUp = function (chara, key, val) {
	chara.palam[key][1] += val;
};

F.palamCheck = function (chara, key, val) {
	if (val === "max") return chara.palam[key][1] < chara.palam[key][2];
	else {
		if (between(val, 0, 1)) {
			return chara.palam[key][1] < chara.palam[key][2] * val;
		}
		return chara.palam[key][1] < val;
	}
};

F.resetPalam = function (chara) {
	for (let i in chara.palam) {
		chara.palam[i][0] = 0;
		chara.palam[i][1] = 0;
	}
};

F.resetBase = function (chara) {
	const list = ["dirty", "drug", "alcohol", "stress"];
	for (let i in chara.base) {
		if (list.includes(i)) chara.base[i][0] = 0;
		else chara.base[i][0] = chara.base[i][1];
	}
};

F.canSpeak = function (chara) {
	return !chara.state.has("失声", "失聪", "口球", "自闭");
};

F.canMove = function (chara) {
	return !chara.state.has("束缚", "石化");
};

F.canActNormal = function (chara) {
	return !chara.state.has("精神崩溃", "毒瘾发作", "性瘾发作");
};

F.sleep = function (chara) {
	return chara.state.includes("睡眠");
};

F.uncons = function (chara) {
	return chara.state.has("睡眠", "晕厥") || (chara.base.sanity[0] < 10 && chara.base.stamina[0] < 10);
};

F.BP = function (chara) {
	const s = chara.stats;
	return s.STR[1] * 15 + s.CON[1] * 8 + s.DEX[1] * 8 + s.INT[1] * 8 + s.WIL[1] * 10 + s.PSY[1];
};

F.setFame = function (chara, key, val) {
	chara.flag[`${key}fame`] = val;
};
F.fameUp = function (chara, key, val) {
	chara.flag[`${key}fame`] += val;
};
F.setFavo = function (chara, key, val) {
	chara.flag[key] = val;
};
F.favoUp = function (chara, key, val) {
	chara.flag[key] += val;
};

F.isRape = function (chara) {
	return (V.mode == "train" || chara.tsv?.woohoo) && !chara.tsv.oksign;
};

F.canResist = function (chara) {
	return !F.uncons(chara) && F.canMove(chara);
};

F.weaker = function (a, b) {
	let ap = F.BP(a);
	let bp = F.BP(b);

	if (ap < bp * 0.8) {
		return true;
	} else {
		return ap / bp <= 1.25 && F.isEnergetic(a);
	}
};

//是否有充足精力进行抵抗。
F.isEnergetic = function (a) {
	const hp = (a.base.health[0] * 2) / a.base.health[1]; //影响抵御上限
	const stamina = Math.floor((a.base.stamina[0] / a.base.stamina[1]) * 100 * hp);
	const sanity = Math.floor((a.base.sanity[0] / a.base.sanity[1]) * 100 * ((hp / 2) * 1.5));
	const mana = Math.floor((a.base.mana[0] / a.base.mana[1]) * 50);

	if (Config.debug) console.log(hp, stamina, sanity, mana);
	//2, 200, 150, 50
	return stamina + sanity + mana > 160;
};

F.isFallen = function (chara) {
	if (chara.flag.fallen) return true;
	if (chara.flag.depend >= 2500) return true;

	return false;
};

F.getState = function (chara, key) {
	chara.state.push(key);
};

F.lostState = function (chara, key) {
	chara.state.delete(key);
};

F.liqUp = function (liq, key, val) {
	const i = D.liquidtype.findIndex(key);
	liq[i] = Math.clamp(liq[i] + val, 0, 99);
	return liq;
};

F.cleanLiq = function (liq, key) {
	const i = D.liquidtype.findIndex(key);
	liq[i] = 0;
	return liq;
};

F.metToday = function (cid) {
	if (!V.location.chara.containsAll("Isil", "Ayres")) {
		if (!Tsv[cid][`metToday${pc}`]) return pc;
	}

	if (!Tsv[cid].metTodayIsil && !Tsv[cid].metTodayAyres) return "both";
	if (!Tsv[cid][`metToday${pc}`]) return pc;

	return "met";
};

F.hasPenis = function (cid) {
	return C[cid].gender !== "female";
};

F.hasVagina = function (cid) {
	return C[cid].gender !== "male";
};

F.justHands = function (useParts) {
	return useParts.length == 2 && useParts.containsAll("handR", "handL");
};

Object.defineProperty(window, OnlyU, {
   get:function(){
      return pc === tc
   }
})