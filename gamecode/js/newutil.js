F.playtime = function () {
	let time = V.gametime;

	time.s++;
	if (time.s >= 60) {
		time.m++;
		time.s = 0;
	}
	if (time.m >= 60) {
		time.h++;
		time.m = 0;
	}
	if (time.h >= 24) {
		time.d++;
		time.h = 0;
	}
};

F.levelMp = function (lv) {
	lv = Math.clamp(lv + 1, 1, 25);
	let a = lv * lv * 10 + Math.pow(lv, 3);
	return Math.floor(a / 10 + 0.5) * 10;
};

F.Evole = function (type) {
	const m = V.cursedLord;
	const p = {
		len: [1, "变长"],
		thick: [2, "变粗"],
		num: [8, "变多"],
		form: [5, "突变"],
		drug: [3],
		hypnos: [16],
		cum: [1],
		scale: [500, "进化"],
	};
	const max = type == "scale" ? 10 : 25;
	const per = type !== "scale" && m.abl[type] == 0 ? Math.max(p[type][0] / 2, 1) : p[type][0];
	const mp = F.levelMp(m.abl[type]) * per;

	let link = "";

	if (m.MP >= mp && m.abl[type] < max) {
		link = `　<<link '${
			p[type][1] ? p[type][1] : "升级"
		}  ${mp}P' $passage>><<set $cursedLord.abl['${type}'] += 1>><<set $cursedLord.MP -= ${mp}>><</link>>`;
	} else if (m.abl >= max) {
		link = `　<span style='color:#EE3131'>MaxLevel</span>`;
	} else {
		link = `　<span style='color:#EE3131'>${p[type][1] ? p[type][1] : "升级"}  ${mp}P</span>`;
	}

	if (Config.debug) console.log(link);
	return link;
};

F.getMp = function (ecstacy, type) {
	// 每120点快感 +1p。 达到普通高潮需1200快感，强高潮需3000快感，超强高潮需要6000快感
	// 每次指令结束会将获得魔力暂存在earnMP里。调教结束时，当earnMP大于一才添加到魔力中。
	// M的程度不足的话，疼痛会抵消掉快感
	//局部高潮 +20p， 强高潮 +300P， 深度强高潮 +1000P
	T.earnMP = ecstacy / 120 + Tsv[`${type}Ex`] * 20;
};

Chara.getexp = function (chara, exp, val) {
	chara.exp[exp].total += val;

	if (!cond.isUncons(chara)) chara.exp[exp].aware += val;

	if (!chara.expUp[exp]) chara.expUp[exp] = 0;

	chara.expUp[exp] += val;
};

F.RER = function () {
	V.RER = random(1000);
	return "";
};
DefineMacroS("setRER", F.RER);

//根据温度变化，调整水分消耗速度。
//设人体最佳适应温度为24℃，当温度高于最佳适应温度时，每3℃ 增加10%的水分消耗速度。
F.hydrationLoseMult = function (currentTemp, bestTemp) {
	let temp = currentTemp - bestTemp;
	let mult = 1;
	if (temp > 0) {
		mult += (temp / 3) * 0.1;
	}
	return fixed(mult, 4);
};

//根据体型，调整营养消耗速度。 比2小的体型，营养消耗速度减半，比2大的体型，每增加1，营养消耗速度增加30%。
F.nutrientLoseMult = function (bodysize) {
	let mult = 1;
	if (bodysize < 2) {
		mult = 0.5;
	} else if (bodysize > 2) {
		mult += (bodysize - 2) * 0.3;
	}
	return fixed(mult, 4);
};

//根据温度（出汗率）调整污迹获得速度。当温度高于最佳适应温度时，每3℃ 增加20%的污迹获得速度。
F.dirtyGetMult = function (currentTemp, bestTemp) {
	let temp = currentTemp - bestTemp;
	let mult = 1;
	if (temp > 0) {
		mult += (temp / 3) * 0.2;
	}
	return fixed(mult, 4);
};

//健康值的自然减少
F.healthNaturalLose = function (cid, currentTemp) {
	const chara = C[cid];
	const { low, high } = chara.tempture;

	let multip = 1;
	let diff = 0,
		type = "hot";

	//室外温度低于最低温度时，健康值减少速度增加
	if (V.location.tags.includes("室外")) {
		if (currentTemp < low) {
			diff = low - currentTemp;
			type = "cold";
		} else if (currentTemp > high) {
			diff = currentTemp - high;
		}

		if (diff > 1) {
			multip = Math.pow(1.233, type === "hot" ? hight - 3 : low - 3);
			multip = fixed(multip, 4);
		}
	}

	//根据健康状态，调整健康值减少速
	if (cond.healthWarn(cid) > 0) {
		multip += cond.healthWarn(cid);
	}

	return multip;
};

//意志对各项数值的影响因数。小于11时，每减少1点，各项数值减少8%。大于11时小于30时，每增加1点，各项数值增加5%。但大于30时，只有24-11的部分增加5%，剩余部分增加1%。
F.willMult = function (will) {
	let mult = 1;
	if (will < 11) {
		mult -= (11 - will) * 0.07;
	} else if (will > 30) {
		mult += 13 * 0.05 + (will - 24) * 0.01;
	} else if (will > 11) {
		mult += (will - 11) * 0.05;
	}

	return Math.clamp(mult, 0.1, 2);
};

//根据超时活动的时长，计算疲劳因数。
F.tiredMult = function (overTime) {
	let mult = 1;
	if (overTime > 0) {
		mult += (overTime / 180) * 0.25;
	}
	return fixed(mult, 4);
};

//欲望影响因数。欲望等级越高，影响因数越大。
F.desireMult = function (desire, gender) {
	let mult = 0.4;
	if (desire > 1) {
		mult += (desire - 2) * 0.2 + 2 * 0.4;
	}
	if (!desire) mult = 0.2;
	if (gender === "female") mult *= 0.6;
	return mult;
};

//根据性别与阴茎大小，计算性欲获得率。
//女性欲望获得速度为男性的60%。
//阴茎大小越大，性欲获得速度越快。数值为0时，获得速度为30%，每增加1，获得速度增加40%
F.desireGain = function (cid) {
	const chara = C[cid];
	const { gender, sexstats, sbl } = chara;
	const psize = sexstats.p.size;

	let mult = 0.3;
	if (gender == "female") {
		mult = 0.6;
	} else if (psize > 0) {
		mult += psize * 0.4;
	}

	//欲望 等级的影响
	mult *= 1 + sbl.desire * 0.08;

	//根据 身体状态调整
	if (cond.baseLt(cid, "health", 0.2)) {
		mult *= 1.2;
	}
	if (cond.baseLt(cid, "sanity", 0.5)) {
		mult *= 2 - cond.baseIs("sanity", cid);
	}
	if (!cond.baseLt(cid, "stress", 0.3)) {
		mult *= 1 - cond.baseIs(cid, "stress") + cond.baseIs(cid, "stress") > 0.1 ? 0 : 1.1;
	}
	return fixed(mult, 4);
};

F.getDesire = function (time, cid) {
	const chara = C[cid];
	const { sbl } = chara;
	const mult = F.desireMult(chara);

	let baseValue = (random(10, 20) / 100) * time * mult;

	//根据知识等级，调整性欲获得量
	if (sbl.knowledge < 4) baseValue *= 0.5;
	//性瘾等级越高，性欲获得量越大
	if (sbl.sexaddic > 0) baseValue *= 1 + sbl.sexaddic * 0.25;

	return fixed(baseValue, 4);
};
