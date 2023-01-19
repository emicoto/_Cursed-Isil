F.makeList = function (path, option) {
	const rawtxt = Story.get(path).text.split("\n");

	const convert = (raw, arr) => {
		const v = raw.split(",");
		const keys = Object.keys(obj);
		let newobj = {};

		keys.forEach((k, i) => {
			newobj[k] = v[i];
			if (typeof option === "function") {
				newobj[k] = option(v[i], k);
			}
		});
		newobj.type = id;
		arr.push(newobj);
	};

	const makeObj = (line) => {
		const keys = line.split(",");
		id = keys[0].replace("#", "");
		obj = {};
		keys.deleteAt(0);
		keys.forEach((k) => {
			obj[k] = null;
		});
	};

	var obj, id;
	const arr = {};

	rawtxt.forEach((raw) => {
		raw = raw.replace(/\s/g, "");
		if (raw[0] == "#") {
			makeObj(raw);
		} else if (raw.match(/^\/\*(.+)\*\/|^\/(.+)/) || raw === "") {
			//注释和空行要过滤掉
		} else {
			if (!arr[id]) arr[id] = [];
			convert(raw, arr[id]);
		}
	});

	const result = [];
	Object.values(arr).forEach((array) => {
		result.push(...array);
	});

	return result;
};

Chara.setWomb = function (chara) {
	if (chara.pregnancy === undefined) {
		chara.pregnancy = {};
	}

	chara.pregnancy = {
		circle: {
			type: "heat",
			basedays: random(6, 9),
			rng: random(1, 3),
			current: 0,
			state: "normal",
			running: true,
			stages: [],
			ovulate: 1,
			frng: random(1, 3),
			lastCircleDays: 0,
		},
		womb: {
			maxslot: 4,
			state: "normal",
			awareOf: false,
			fetus: [],
		},
		bellysize: 0,
		sperm: [],
	};

	const { circle } = chara.pregnancy;
	const days = circle.basedays;

	circle.lastCircleDays = circle.basedays;
	circle.stages = [0, Math.floor(days / 3 + 0.5), days + 0.5];

	console.log(chara.pregnancy);
};

Chara.setParasite = function (chara) {
	chara.parasite = {
		maxslot: 6,
		type: "",
		eggs: [],
		active: false,
	};
};

charafix.reveals = function (reveal, equip) {
	const { detail } = reveal;

	//--- 每次穿脱衣服时会初始化一次然后重新记录每个部位的裸露值。
	//--- 目前层次的装备低于现有值才更新。
	const set = function (key, wear) {
		if (detail[key] == undefined) return;

		if (wear.expose < detail[key].expose) {
			detail[key].expose = wear.expose;
		}
		if (wear.open < detail[key].block) {
			detail[key].block = wear.open;
		}
	};

	//--- 逐层解构
	const setReveal = function (wear) {
		const list = wear.cover;

		if (isValid(list) === false) return;

		list.forEach((k) => {
			if (D.coverlistB.includes(k)) {
				setReveal(D.covergroupB[k]);
			}
			if (D.coverlistA.includes(k)) {
				setReveal(D.covergroupA[k]);
			}
			if (D.skinlayer.includes(k)) {
				set(k, wear);
			}
		});
	};

	setReveal(equip.innerBt);
	setReveal(equip.innerUp);

	setReveal(equip.outfitBt);
	setReveal(equip.outfitUp);

	setReveal(equip.cover);

	reveal.parts = [];
	reveal.expose = 0;
	reveal.reveal = 0;

	for (const [k, c] of Object.entries(detail)) {
		if (c?.expose >= 2) reveal.parts.push(k);
	}

	reveal.parts.forEach((v) => {
		if (["face", "neck"].includes(v) === false) reveal.reveal += Math.floor(100 * (detail[v].expose / 3));
	});

	const risk = {
		genital: 2,
		anus: 1,
		breast: 1,
		private: 0.2,
		buttL: 0.2,
		buttR: 0.2,
	};

	Object.keys(risk).forEach((k) => {
		if (reveal.parts.includes(k)) {
			reveal.expose += risk[k] / (detail[k].expose == 3 ? 1 : 2);
		}
	});

	reveal.expose = Math.floor(reveal.expose);

	return reveal;
};
