//根据温度变化，调整水分消耗速度。
//设人体最佳适应温度为24℃，当温度高于最佳适应温度时，每3℃ 增加10%的水分消耗速度。
F.hydrationLoseMult = function (currentTemp, bestTemp) {
	let temp = currentTemp - bestTemp;
	let mult = 1;
	if (temp > 0) {
		mult = Math.pow(1.1, temp / 3);
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

//是否处于某个不健康状态，并返回健康值的影响值
F.healthWarn = function (cid) {
	const { flag } = C[cid];

	let multip = 0;
	let conds = ["stamina", "sanity", "mana", "hydration", "nutrient"];
	let evalcond = "";
	conds.forEach((key) => {
		evalcond += `Cond.baseLt(cid, "${key}", 0.05) && `;
	});

	if (eval(evalcond)) {
		multip += 0.1;
	}

	if (!Cond.baseLt(cid, "drug", 0.9) || !Cond.baseLt(cid, "alcohol", 0.9)) {
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
	if (F.healthWarn(cid) > 0) {
		multip += F.healthWarn(cid);
	}

	return multip;
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
	if (Cond.baseLt(cid, "health", 0.2)) {
		mult *= 1.2;
	}
	if (Cond.baseLt(cid, "sanity", 0.5)) {
		mult *= 2 - Cond.baseIs("sanity", cid);
	}
	if (!Cond.baseLt(cid, "stress", 0.3)) {
		mult *= 1 - Cond.baseIs(cid, "stress") + Cond.baseIs(cid, "stress") > 0.1 ? 0 : 1.1;
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

F.levelMp = function (lv) {
	lv = Math.clamp(lv + 1, 1, 25);
	let a = lv * lv * 10 + Math.pow(lv, 3);
	return Math.floor(a / 10 + 0.5) * 10;
};
