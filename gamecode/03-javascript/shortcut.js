F.baseUp = function (chara, key, val) {
	chara.base[key][0] += val;
};

F.palamUp = function (chara, key, val) {
	chara.palam[key][1] += val;
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

F.BP = function (chara) {
	const s = chara.stats;
	return s.STR[1] * 15 + s.CON[1] * 8 + s.DEX[1] * 8 + s.INT[1] * 8 + s.WIL[1] * 10 + s.PSY[1];
};

F.setFame = function (cid, key, val) {
	C[cid].flag[`${key}fame`] = val;
};
F.fameUp = function (cid, key, val) {
	C[cid].flag[`${key}fame`] += val;
};
F.setFavo = function (cid, key, val) {
	C[cid].flag[key] = val;
};
F.favoUp = function (cid, key, val) {
	C[cid].flag[key] += val;
};

F.getState = function (cid, key) {
	C[cid].state.push(key);
};

F.lostState = function (cid, key) {
	C[cid].state.delete(key);
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

F.tentaclesNum = function () {
	return V.cursedLord.abl.num + 2;
};
