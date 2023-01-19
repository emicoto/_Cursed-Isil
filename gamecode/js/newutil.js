function percent(arr) {
	let min = arr[0],
		max = arr[1];

	if (arr.length == 3) {
		min = arr[1];
		max = arr[2];
	}
	return Math.clamp(Math.trunc((min / max) * 100), 1, 100);
}
window.percent = percent;
DefineMacroS("percent", percent);

F.setBase = function (name, value) {
	pc.base[name][0] += value;
	return "";
};

F.setPalam = function (name, value) {
	pc.palam[name][1] += value;
	return "";
};

DefineMacroS("setBase", F.setBase);
DefineMacroS("setPalam", F.setPalam);

F.isClasstime = function () {
	const date = V.date;
	if (inrange(date.week, 1, 5)) {
		const select = new SelectCase();
		select.case([500, 720], true).case([800, 1020], true).else(false);
		return select.has(date.time);
	}
	return false;
};

F.splitSex = function (chara, male, female, inter) {
	if (chara.gender === "male") return male;
	else {
		if (inter && chara.gender === "inter") {
			return inter;
		}
		return female;
	}
};

F.gametime = function () {
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

F.levelMP = function (lv) {
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
	const mp = F.levelMP(m.abl[type]) * per;

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

F.getMP = function (ecstacy, type) {
	// 每120点快感 +1p。 达到普通高潮需1200快感，强高潮需3000快感，超强高潮需要6000快感
	// 每次指令结束会将获得魔力暂存在earnMP里。调教结束时，当earnMP大于一才添加到魔力中。
	// M的程度不足的话，疼痛会抵消掉快感
	//局部高潮 +20p， 强高潮 +300P， 深度强高潮 +1000P
	T.earnMP = ecstacy / 120 + Tsv[`${type}Ex`] * 20;
};

F.getExp = function (chara, exp, val) {
	chara.exp[exp].total += val;

	if (!F.uncons(chara)) chara.exp[exp].aware += val;

	if (!chara.expUp[exp]) chara.expUp[exp] = 0;

	chara.expUp[exp] += val;
};

F.getForms = function (level) {
	let txt = "";
	for (let i = 0; i < level; i++) {
		txt += `【${D.mutant[i]}】`;
	}
	return txt;
};

F.resetLink = function () {
	$("#contentMsg a").remove();
	V.selectCom = 0;
	return "";
};
DefineMacroS("resetLink", F.resetLink);

P.Msg = function (msg, add) {
	if (!S.msg) S.msg = [];

	if (add) {
		if (!S.msg.length) S.msg[0] = "";
		S.msg[S.msg.length - 1] += msg;
	} else if (msg.includes("<fr>")) {
		S.msg = S.msg.concat(msg.split("<fr>"));
	} else {
		S.msg.push(msg);
	}
};

F.reflesh = function (label, html) {
	new Wikifier(null, `<<replace #${label}>>${html}<</replace>>`);
};
