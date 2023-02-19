window.initCSV = function (cid) {
	const _raw = Story.get(`CharaSheet_${cid}`).text.replace(/\n/g, "#L#").replace(/\s/g, "");
	const raw = _raw.split("#L#");

	const chara = {};

	for (let i = 0; i < raw.length; i++) {
		const line = raw[i];
		if (!line.length || line[0] == "/")
			//总之先把空行喝注释行去掉。
			continue;
		//提取表格
		const arr = line.split(",");
		//总之先初始化路径
		let path = arr[0].split(".");
		3;
		//重复项目是array
		const times = _raw.split(`#L#${arr[0]},`).length - 1;
		let values = clearCommentFromArray(arr.splice(1));
		if (values.length == 1) values = values[0];

		if (times > 1) setVByPathAndType(path, chara, values, "array");
		else setVByPathAndType(path, chara, values);
	}
	return chara;
};

const clearCommentFromArray = function (arr) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].includes("/*") || arr[i][0] == ";") {
			arr.deleteAt(i);
			i--;
		} else {
			if (parseInt(arr[i])) {
				arr[i] = parseInt(arr[i]);
			} else if (arr[i].includes("random")) {
				arr[i] = eval(arr[i]);
			}
		}
	}
	return arr;
};

window.setVByPathAndType = function (path, obj, value, type) {
	const last = path.pop();
	for (let i = 0; i < path.length; i++) {
		if (!obj[path[i]]) obj[path[i]] = {};
		obj = obj[path[i]];
	}
	if (type == "array") {
		if (!obj[last]) obj[last] = [];
		obj[last].push(value);
	} else {
		obj[last] = value;
	}
	return obj;
};

Chara.initCSV = function (cid) {
	const raw = initCSV(cid);
	const chara = new Chara(raw.id, raw.name, raw.gender, raw.race);
	if (raw.position) {
		chara.initChara(raw.position);
	} else {
		chara.initChara("both");
	}

	if (raw.appearance) {
		chara.setAppearance(raw.appearance);
	}
	if (raw.stats) {
		chara.setStats(raw.stats);
	}
	if (raw.abl) {
		chara.setAbility(raw.abl);
	}
	if (raw.sbl) {
		chara.setSexAbl(raw.sbl);
	}

	if (raw.skill) {
		chara.setSkill(raw.skill);
	}

	if (raw.organ) {
		for (let i in raw.organ) {
			chara.setOrgan(i, raw.organ[i]);
		}
	}
	if (raw.exp) {
		chara.setExp(raw.exp);
	}

	const code = [];
	if (raw.virginity) {
		for (let i in raw.virginity) {
			const arr = raw.virginity[i];
			if (i.has("vagina")) {
				code.push(`if(this.gender !== 'male') this.setVirginity('${i}', '${arr[0]}', '${arr[1]}', '${arr[2]}');`);
			} else if (i == "penis") {
				code.push(`if(this.gender !== 'female') this.setVirginity('${i}', '${arr[0]}', '${arr[1]}', '${arr[2]}');`);
			} else {
				code.push(`this.setVirginity('${i}', '${arr[0]}', '${arr[1]}', '${arr[2]}');`);
			}
		}
	}

	eval(`chara.resetVirginity = function(){
         ${code.join("")}
      }`);

	const ignore = ["appearance", "stats", "abl", "sbl", "skill", "organ", "exp", "virginity", "scar"];
	for (let i in raw) {
		if (ignore.includes(i)) continue;

		if (typeof raw[i] == "object" && !Array.isArray(raw[i])) {
			if (!chara[i]) chara[i] = {};
			for (let k in raw[i]) {
				chara[i][k] = raw[i][k];
			}
		} else {
			chara[i] = raw[i];
		}
	}

	if (raw.scar) {
		const scar = Object.keys(raw.scar);
		scar.forEach((key) => {
			if (Array.isArray(raw.scar[key])) {
				raw.scar[key].forEach((type) => {
					const time = type == "scar" ? "never" : 1440;
					Chara.getScar(chara, key, type, time);
				});
			} else {
				const time = raw.scar[key] == "scar" ? "never" : 1440;
				Chara.getScar(chara, key, raw.scar[key], time);
			}
		});

		Chara.skinCounter(chara, 0);
	}

	chara.resetVirginity();

	return chara;
};
