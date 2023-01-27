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

	if (game.debug) console.log(link);
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

//事件中进行设置时
F.setActor = function (cid, tid, ...parts) {
	T.actor = cid;
	T.target = tid;

	if (parts[0]) T.selectPart = parts[0];
	else T.selectPart = "body";
	if (parts[1]) T.actPart = parts[1];
	else T.actPart = "hands";
};
DefineMacroS("setActor", F.setActor);

F.getKeyByValue = function (object, value) {
	return Object.keys(object).find(
		(key) => object[key] === value || object[key].includes(value) || object[key][0].includes(value)
	);
};
