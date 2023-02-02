D.race = {
	human: ["人类", "Human"],
	elvin: ["精灵", "Elvin"],
	deamon: ["魔人", "Half Deamon"],
	wolves: ["狼人", "Wolves"],
	drawf: ["矮人", "Drawf"],
	goblin: ["地精", "Goblin"],
	catvinx: ["狐猫", "Catvinx"],
	centaur: ["马头人", "Centaur"],
	bestiary: ["兽化人", "Bestiary Human"],
	orc: ["奥克人", "Orc"],
	titan: ["巨人", "Titan"],
	dracon: ["龙人", "Dracon"],
	kijin: ["`鬼人", "Kijin"],
};

D.stats = ["ATK", "DEF", "MTK", "MDF", "STR", "CON", "DEX", "INT", "WIL", "PSY", "ALR", "LUK"];

D.basicNeeds = {
	health: ["健康", "HP."],
	stamina: ["体力", "SP."],
	sanity: ["理智", "San."],
	mana: ["魔力", "MP."],

	hydration: ["水分", "Hyd."],
	nutrition: ["营养", "Nutr."],
	clean: ["清洁", "Cln."],
};

D.basicPalam = {
	drug: ["药物", "Drg."],
	alcohol: ["酒精", "Alc."],
	stress: ["压力", "Str."],
	libido: ["性欲", "Lbd."],
};

D.base = {};
D.base = Object.assign(D.base, D.basicNeeds, D.basicPalam);

D.palam = {
	ecstacy: ["快感", "Ecs."], //快感值总条。 与射精or潮吹绑定。
	//受方palam
	lust: ["欲情", "Lust."], //欲望值，根据累积flag升级欲望lv。指令执行成功时概率获得依存值。
	surrend: ["屈从", "Srr."], //根据累积flag升级顺从Lv。屈从palamlv累计到一定值时获得刻印。指令执行成功时概率获得服从值/支配值。
	fear: ["恐惧", "Fear."], //恐惧刻印
	mortify: ["羞耻", "Mtf."], //羞耻刻印。露出类指令。
	humiliate: ["受辱", "Hml."], //耻辱刻印。 羞辱类指令
	pain: ["疼痛", "Pain."], //痛苦刻印
	depress: ["抑郁", "Dpr."], //压力值
	resist: ["抵触", "Rst."], //反抗刻印
	favo: ["好意", "Favo"], //好感转换
	uncomfort: ["不适", "Ucm."], //减少mood，根据情况转换为疼痛、抵触、压抑。影响体力与健康的消耗。可能触发生病flag

	//攻方palam
	eager: ["渴望", "Egr."], //行为时间拉长，动作变急切。依存up
	angry: ["愤怒", "Angr."], //mood down，动作会变粗暴。
	satisfy: ["满意", "Sat."], //评价up 好感up
	superior: ["优越", "Sup."], // 支配度up

	//部位palam。各种高潮判定主要看这边。高潮时获得性依存度，快乐刻印
	esM: ["快M", "ecsM."],
	esB: ["快B", "ecsB."], //同时也是喷乳判定条
	esC: ["快C", "ecsC."],
	esU: ["快U", "ecsU."],
	esV: ["快V", "ecsV."],
	esA: ["快A", "ecsA."],

	//各部位疼痛值。抖M会转化为部位快感。否则抵消部分快感。总值算入pain中。
	paM: ["痛M", "pnM."],
	paB: ["痛B", "pnB."],
	paC: ["痛C", "pnC."],
	paU: ["痛U", "pnU."],
	paV: ["痛V", "pnV."],
	paA: ["痛A", "pnA."],
};

D.basecolor = {
	health: [255, 92, 79],
	stamina: [223, 236, 15],
	sanity: [12, 163, 238],
	mana: [160, 35, 231],

	hydration: [65, 255, 233],
	nutrient: [134, 255, 79],

	ecstacy: [255, 95, 202],
	esM: [255, 95, 202],
	esB: [255, 95, 202],
	esC: [255, 95, 202],
	esU: [255, 95, 202],
	esV: [255, 95, 202],
	esA: [255, 95, 202],

	pain: [87, 29, 243],
	paM: [87, 29, 243],
	paB: [87, 29, 243],
	paC: [87, 29, 243],
	paU: [87, 29, 243],
	paV: [87, 29, 243],
	paA: [87, 29, 243],
};

D.mark = {
	hypno: ["催眠刻印", "Hypnosis Mark"],
	ecstacy: ["快乐刻印", "Ecstacy Mark"], //the ecstacy ethed on mind
	surrend: ["屈服刻印", "Surrender Mark"],
	pain: ["痛苦刻印", "Pain Mark"],
	fear: ["恐惧刻印", "Fear Mark"],
	humiliate: ["耻辱刻印", "Humiliated Mark"],
	mortify: ["羞耻刻印", "Mortify Mark"],
	resist: ["反抗刻印", "Resistance Mark"],
};

D.abl = {
	magica: ["魔法等级", "Magica"],
	lumen: ["光魔法", "Lumen Magic"],
	ark: ["暗魔法", "Ark Magic"],
	flare: ["火魔法", "Flare Magic"],
	ions: ["水魔法", "Ions Magic"],
	vitae: ["木魔法", "Vitae Magic"],
	terra: ["土魔法", "Terra Magic"],
	electron: ["电魔法", "Electron Magic"],
	//--------------------------------
	//Physical Skill
	sword: ["剑术", "Sword"],
	wrestle: ["格斗", "Wrestle"],
	running: ["跑步", "Running"],
	//--------------------------------
	//life skill
	cooking: ["料理", "Cooking"],
	plant: ["种植", "Plant"],
	medicine: ["药物", "Medicine"],
	craft: ["制作", "Craft"],
	fishing: ["钓鱼", "Fishing"],
	gather: ["采集", "Gather"],
	sing: ["歌唱", "Sing"],
	dance: ["舞蹈", "Dance"],
	instrument: ["乐器", "Instrument"],
	paint: ["绘画", "Paint"],
};

D.sbl = {
	//sexual mental ability
	//性欲心理能力, max level 12
	//basic
	technique: ["性技巧", "Technique"],
	endurance: ["性耐性", "Endurance"],
	submissive: ["顺从", "Submissive"],
	refuse: ["抗拒", "Refuse"],
	//refuse特指对性行为的抗拒度。影响指令执行与心理数值、素质、刻印的获得。

	//mental degrees
	hypnosis: ["催眠", "Hypnosis"],
	desire: ["欲望", "Desire"],
	serve: ["侍奉", "Serve"],
	exhibition: ["露出", "Exhibition"],
	promscuity: ["滥交", "Promiscuity"],
	masochism: ["受虐", "Masochism"],
	sadicism: ["虐待", "Sadicism"],

	//addiction
	bestial: ["兽奸中毒", "Bestial"],
	gangbang: ["轮奸中毒", "GangBang"],
	tentacles: ["触手中毒", "Tentacles"],
	sexaddic: ["性瘾", "Sex Addict"],
	drugaddic: ["药瘾", "Drug Addict"],

	cumaddic: ["饮精中毒", "Swallow Cum"],
	Vcumpie: ["内射中毒", "V Cumpie"],
	Acumpie: ["肛射中毒", "A Cumpie"],
};

D.initials = ["M", "B", "C", "U", "V", "A"];
