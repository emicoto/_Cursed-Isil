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
			eyecolor: "琥珀色",
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
			cooking: 10,
			craft: 8,
			gathering: 9,
			dance: 10,
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
	chara.flag.sleeptime = 1400;
	chara.flag.wakeuptime = 420;

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
		.setAppearance({ eyecolor: "柠檬绿", haircolor: "浅金", hairstyle: "精灵长发", skincolor: "白皙", tall: 1704 })
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
			sing: 10,
		})
		.setSexAbl({ knowledge: 1, endurance: 2, refuse: 8 })
		.setOrgan("p", { size: 2, d: 28, l: 136 })
		.setOrgan("m", { size: 2 })
		.setFame("job", 120)
		.setFame("school", 200)
		.setFame("public", 80);

	return chara;
};

Chara.data.m0 = function () {
	const chara = new Chara("m0", "诅咒之触", "male", "tentacles")
		.initChara("tachi")
		.setStats({ STR: 16, CON: 15, DEX: 17, INT: 15, WIL: 17, PSY: 17 })
		.setOrgan("p", { type: "触手", trait: ["光滑"], size: 1, d: 6, l: 160 });

	return chara;
};
