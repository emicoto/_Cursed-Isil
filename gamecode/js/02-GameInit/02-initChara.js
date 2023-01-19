Chara.data = {};

Chara.data.Ayres = function () {
	const chara = new Chara("Ayres", "艾瑞斯", "male", "deamon")
		.initChara("tachi")
		.setNames({ s: "修格斯" })
		.setTitle("魔战士")
		.setJob("warrior")
		.setBirth([3980, 8, 8])
		.setTraits(["强壮", "耐疼", "理智", "性开放", "强欲", "变态", "鬼畜", "低调", "无节操", "厚脸皮"])
		.setTalent(["暗属性", "火属性", "电属性", "迷之知识", "虐待狂", "长舌", "多段变化", "半魔"])
		.setSkill(["lightning", "fire_sword", "dark_cage"])
		.setStats({ STR: 16, CON: 15, DEX: 17, INT: 15, WIL: 17, PSY: 17, ALR: 15 })
		.setAppearance({
			eyecolr: "琥珀色",
			haircolor: "白色",
			hairstyle: "短发",
			skincolor: "灰色",
			tall: 1976,
			weight: 93.7,
		})
		.setAbility({
			magica: 7,
			ark: 7,
			flare: 6,
			electron: 4,
			sword: 14,
			wrestle: 12,
			cooking: 3,
			craft: 8,
			gathering: 9,
		})
		.setSexAbl({ knowledge: 10, technique: 10, endurance: 8, desire: 8 })
		.setOrgan("p", { type: "魔鬼阴茎", trait: ["隆起", "浓厚"], size: 4, d: 48, l: 182 })
		.setOrgan("m", { size: 3 })
		.setExp({ 调教: random(100, 300), 插入: random(50, 120), 施虐: random(50, 120) })
		.setFame("job", 30)
		.setFame("school", 50)
		.setFame("public", 20);

	chara.resetVirginity = function () {
		this.setVirginity("kiss", "不明", "不明", "不明");
		this.setVirginity("anal", "奴隶的舌头", "不明", "在奴隶的侍奉下了解了后穴的快乐");
		this.setVirginity("handholding", "奴隶的阴茎", "不明", "为了奖励奴隶，用手帮对方释放了");

		if (this.gender !== "female") {
			this.setVirginity("penis", "奴隶的肉穴", "不明", "在奴隶的侍奉下扔掉了童贞");
		}
		if (this.gender !== "male") {
			this.setVirginity("vagina", "奴隶的舌头", "不明", "在奴隶的侍奉下了解了女性的快乐");
		}
		return this;
	};

	chara.resetVirginity();

	return chara;
};

Chara.data.Isil = function () {
	const chara = new Chara("Isil", "伊希露", "male", "elvin")
		.initChara("neko")
		.setNames({ m: "梅尔", s: "艾西利特" })
		.setBirth([3998, 6, 17])
		.setTitle("学者")
		.setJob("scholar")
		.setTraits([
			"纤弱",
			"不耐疼",
			"M体质",
			"A名器",
			"易伤体质",
			"淡漠",
			"冷静",
			"理智",
			"不过线",
			"性保守",
			"高傲",
			"低调",
			"高自尊",
			"坚韧",
			"贞洁",
		])
		.setTalent(["天才", "光属性", "水属性", "木属性", "雌雄莫辩", "人气", "探究心", "高等精灵"])
		.setSkill([
			"light_shower",
			"magica_shield",
			"green_grow",
			"clear_mind",
			"water_bubble",
			"ice_arrow",
			"clean_body",
			"object_control",
		])
		.setStats({ STR: 7, CON: 8, DEX: 14, INT: 19, WIL: 18, PSY: 16, ALR: 20 })
		.setAppearance({ eyecolr: "柠檬绿", haircolor: "浅金", hairstyle: "精灵长发", skincolor: "白皙", tall: 1704 })
		.setAbility({
			magica: 8,
			lumen: 6,
			flare: 2,
			ions: 6,
			vitae: 8,
			terra: 6,
			electron: 3,
			plant: 4,
			medicine: 14,
			craft: 8,
			gathering: 12,
		})
		.setSexAbl({ knowledge: 1, endurance: 2, refuse: 8 })
		.setOrgan("p", { size: 2, d: 28, l: 136 })
		.setOrgan("m", { size: 2 })
		.setFame("job", 120)
		.setFame("school", 200)
		.setFame("public", 80);

	return chara;
};

Chara.data.Besta = function () {
	const chara = new Chara("Besta", "贝斯特", "male", "wolves")
		.initChara("both")
		.setNames({ s: "巴尔顿" })
		.setTitle("魔战士")
		.setJob("warrior")
		.setBirth([4028, 10, 29])
		.setTraits(["强壮", "胆大", "厚脸皮", "冲动", "不服输", "忠诚", "乐观"])
		.setTalent(["毛茸茸", "恢复快", "雷属性", "火属性"])
		.setSkill(["lightning"])
		.setStats({ STR: 20, CON: 18, DEX: 18, INT: 8, WIL: 12, PSY: 8, ALR: 10 })
		.setAppearance({
			eyecolr: "蓝色",
			haircolor: "灰蓝色",
			hairstyle: "短发马尾",
			skincolor: "麦色",
			tall: 1873,
			weight: 76.8,
		})
		.setAbility({
			magica: 4,
			flare: 2,
			electron: 4,
			sword: 12,
			wrestle: 16,
			cooking: 10,
			craft: 12,
			fishing: 12,
			gathering: 12,
		})
		.setSexAbl({ knowledge: 5, endurance: 2, desire: 6 })
		.setOrgan("p", { type: "狼阴茎", trait: ["结", "茎骨"], size: 4, d: 42, l: 174 })
		.setOrgan("m", { size: 4 })
		.setFame("job", 40);

	const scar = ["face", "back", "back", "waistback", "abdomen", "breast", "arms"];
	scar.forEach((p) => {
		Chara.getScar(chara, p, "scar", "never");
	});

	Chara.skinCounter(chara, 0);

	chara.resetVirginity = function () {
		this.setVirginity("kiss", "姐姐", "不明", "在姐姐的引导下学会了接吻");

		this.setVirginity("anal", "不明", "不明", "在一次酒吧派对上，醉酒后与伙伴发生了关系");
		this.setVirginity("analsex", "不明", "不明", "在一次酒吧派对上，醉酒后与伙伴发生了关系");

		if (this.gender !== "female") {
			this.setVirginity("penis", "不明", "不明", "在一次酒吧派对上，醉酒后与伙伴发生了关系");
		}
		if (this.gender !== "male") {
			this.setVirginity("vagina", "不明", "不明", "在一次酒吧派对上，醉酒后与伙伴发生了关系");
			this.setVirginity("vaginasex", "不明", "不明", "在一次酒吧派对上，醉酒后与伙伴发生了关系");
		}
	};

	chara.resetVirginity();

	return chara;
};

Chara.data.Nanaly = function () {
	const chara = new Chara("Nanaly", "娜娜莉", "female", "dracon")
		.initChara("both")
		.setNames({ s: "艾索斯" })
		.setTitle("研究生")
		.setJob("scholar")
		.setBirth([4016, 5, 28])
		.setTraits(["性开放", "M倾向", "胆大", "乐观", "忠诚"])
		.setTalent(["水属性", "发光", "天才", "探究心", "谜之知识"])
		.setSkill(["water_bubble", "clear_mind"])
		.setStats({ STR: 8, CON: 10, DEX: 14, INT: 16, WIL: 12, PSY: 14, ALR: 14 })
		.setAppearance({
			eyecolr: "水色",
			haircolor: "金色",
			hairstyle: "披肩中长发",
			skincolor: "白皙",
			tall: 1620,
			weight: 45.5,
		})
		.setAbility({
			magica: 6,
			craft: 10,
			medicine: 12,
			ions: 6,
		})
		.setSexAbl({
			knowledge: 6,
			technique: 6,
			endurance: 2,
			desire: 2,
		});

	chara.resetVirginity = function () {
		if (this.gender !== "male") this.setVirginity(["anal", "不明", "以某人为幻想对象，用震动棒自行破处"]);
	};

	chara.resetVirginity();

	return chara;
};

Chara.data.m0 = function () {
	const chara = new Chara("m0", "诅咒之触", "male", "tentacles")
		.initChara("tachi")
		.setStats({ STR: 16, CON: 15, DEX: 17, INT: 15, WIL: 17, PSY: 17 })
		.setOrgan("p", { type: "触手", trait: ["光滑"], size: 1, d: 6, l: 160 });

	return chara;
};
