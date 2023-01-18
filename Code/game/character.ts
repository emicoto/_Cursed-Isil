import {
	Dict,
	P,
	ablkey,
	basekey,
	expkey,
	genderFull,
	jobclass,
	markkey,
	palamkey,
	race,
	sblkey,
	statskey,
} from "./types";

export interface sexStats {
	lv: number;
	type?: string;
	trait?: string[];

	size?: number;
	d?: number;
	l?: number;

	wet?: number;
	cum?: number;
	maxcum?: number;
	milk?: number;
	maxmilk?: number;
}

export interface appearance {
	eyecolor: string;

	haircolor: string;
	hairstlye: string;

	skincolor: string;
	beauty: number;
	bodysize: number; //0=tiny 137~147, 1=small 147~164, 2=normal 164~174, 3=tall 174~184, 4=huge 184~200, 5=giant 200+
	tall: number; //mm
	weight: number; //kg
}

export interface Chara {
	cid: string;
	name: string;
	middlename?: string;
	surname?: string;
	fullname?: string;
	nickame?: string;
	callname?: string;

	gender: genderFull;
	type: "neko" | "tachi" | "both";
	race: race;

	title?: string;
	class?: jobclass;
	guildRank?: number;

	kojo?: string;
	birthday?: [number, number, number];
	intro?: [string?, string?];

	traits?: string[];
	talent?: string[];

	skill?: string[];

	stats: Dict<P, statskey>;
	appearance?: any;
	base: Dict<P, basekey>;
	palam: Dict<P, palamkey>;
	mark?: Dict<number, markkey>;
	state?: string[];
	mood?: number;

	source: Dict<number>;
	sup: Dict<number>;
	juel: Dict<number>;
	expUp: Dict<number>;
	tsv: any;

	daily?: any;
	exp?: Dict<{ aware: number; total: number }, expkey>;

	abl: Dict<{ lv: number; exp: number }, ablkey>;
	sbl: Dict<number, sblkey>;

	sexstats: Dict<sexStats>;

	pregnancy?: any;
	parasite?: any;
	scars?: any;

	wear?: any;
	equip?: any;

	reveals?: any;
	virginity?: any;

	flag: any; //好感、信赖， 学籍情报， 诅咒进展， 诅咒魔力效率等
}

interface iName {
	v?: string;
	m?: string; //middle
	s?: string; //surname
	n?: string; //nick
	c?: string; //call master
}

export class Chara {
	static load(chara: Chara) {
		const { cid, name, gender, race, kojo } = chara;
		const init = new Chara(cid, name, gender, race, kojo, chara);
		return init;
	}
	constructor(id: string, name: string, gender: genderFull, race: race, kojo?: string, chara?) {
		if (chara) {
			for (let i in chara) {
				this[i] = clone(chara[i]);
			}
		} else {
			this.cid = id;
			this.name = name;
			this.middlename = "";
			this.surname = "";
			this.fullname = "";

			this.gender = gender;
			this.race = race;

			this.mood = 30;
			this.title = "";
			this.class = "";
			this.guildRank = 0;

			this.kojo = kojo ? kojo : id;

			this.appearance = {};
			this.traits = [];
			this.talent = [];
			this.skill = [];

			this.stats = {};
			this.base = {};
			this.palam = {};

			this.state = [];
			this.source = {};
			this.juel = {};
			this.sup = {};
			this.tsv = {};
			this.abl = {};
			this.sbl = {};
			this.mark = {};
			this.sexstats = {};
			this.exp = {};
			this.expUp = {};
			this.flag = {};
		}
	}

	initChara(type: "neko" | "tachi" | "both") {
		this.type = type;
		this.initBase(type);
		this.initStats();
		this.initAbility();
		this.initSexAbl();
		this.initExp();
		this.initSexStats();
		this.initEquipment();
		this.initRevealDetail();
		this.initVirginity();
		this.initDaily();
		this.initScars();
		this.initFlag();

		return this;
	}

	initBase(type) {
		Object.keys(D.base).forEach((k) => {
			this.base[k] = [0, 1000];
		});

		Object.keys(D.palam).forEach((k) => {
			this.palam[k] = [0, 0, 1200];
			this.source[k] = 0;
			this.sup[k] = 0;
			this.juel[k] = 0;
		});

		D.tsv.forEach((k) => {
			this.tsv[k] = 0;
		});

		Object.keys(D.mark).forEach((k) => {
			this.mark[k] = 0;
		});

		return this;
	}

	initStats() {
		D.stats.forEach((k) => {
			this.stats[k] = [10, 10];
		});
		return this;
	}

	initAbility() {
		Object.keys(D.abl).forEach((k, i) => {
			this.abl[k] = {
				lv: 0,
				exp: 0,
			};
		});
		return this;
	}

	initSexAbl() {
		Object.keys(D.sbl).forEach((k, i) => {
			this.sbl[k] = 0;
		});

		return this;
	}

	initExp() {
		D.exp.forEach((k) => {
			this.exp[k] = { aware: 0, total: 0 };
		});
		return this;
	}

	initSexStats() {
		if (this.gender === "female") {
			this.setOrgan("v");
			this.setOrgan("c");
		} else if (this.gender === "male") {
			this.setOrgan("p");
		} else {
			this.setOrgan("p");
			this.setOrgan("v");
		}

		this.setOrgan("a");
		this.setOrgan("m");
		this.setOrgan("b");
		this.setOrgan("u");
		return this;
	}

	setOrgan(part, adj?) {
		this.sexstats[part] = {
			lv: adj?.lv ? adj.lv : 0,
			size: adj?.size ? adj.size : 0,
		};
		if (groupmatch(part, "p", "a", "v")) {
			this.sexstats[part].wet = 0;
			this.sexstats[part].cum = 0;
			if (part == "p") this.sexstats[part].maxcum = this.sexstats[part].size * 50 + 50;
		}

		if (part == "p") this.setPenis(adj);
		if (part == "c") this.setCrit();
		if (part == "v") this.setVagi();
		if (part == "a") this.setAnal();
		if (part == "b") this.setBreast(adj);
		if (part == "u") this.setUrin();
		if (part == "m") this.setMouth();

		return this;
	}

	setPenis(adj?) {
		//P标准Size表. 具体会在长度与宽度 +-8/+-6
		const Psize = [
			[60, 15], //0，微型
			[90, 22], //1, 迷你
			[120, 32], //2, 短小
			[140, 42], //3, 普通
			[160, 52], //4, 大
			[180, 62], //5, 巨大
			[210, 74], //6, 马屌
			[250, 86], //7, 深渊
		];

		const P = this.sexstats.p;
		const size = Psize[P.size];
		P.type = adj?.type ? adj.type : "阴茎";
		P.trait = adj?.trait ? adj.trait : [];
		P.d = adj?.d ? adj.d : size[1] + random(-8, 8);
		P.l = adj?.l ? adj.l : size[0] + random(-8, 8);

		if (P.trait.includes("浓厚")) P.maxcum *= 10;

		return this;
	}

	setCrit() {
		this.sexstats.c.d = this.sexstats.c.size + 5;
		return this;
	}
	setVagi() {
		const bodysize = this.appearance.bodysize ? this.appearance.bodysize : 1;
		const max = bodysize * 2 - 2.4;

		this.sexstats.v.d = this.sexstats.v.size * max + 14 + random(-4, 4);
		this.sexstats.v.l = bodysize * 21 + 80 + random(-2, 8);

		return this;
	}
	setAnal() {
		const bodysize = this.appearance.bodysize ? this.appearance.bodysize : 1;
		const max = bodysize * 2 - 2.4;

		this.sexstats.a.d = this.sexstats.a.size * max + 12 + random(-4, 4);
		this.sexstats.a.l = bodysize * 32 + 140 + random(-2, 8);

		return this;
	}
	setBreast(adj?) {
		this.sexstats.b.maxmilk = adj?.maxmilk ? adj.maxmilk : 0;
		this.sexstats.b.milk = this.sexstats.b.maxmilk;
		return this;
	}
	setUrin() {
		const size = this.sexstats.u.size;
		const bodysize = this.appearance.bodysize ? this.appearance.bodysize : 1;
		let up = bodysize / 2 + 0.5;
		if (this.gender == "male") up = 1;

		this.sexstats.u.d = size * up + 0.5 + random(-2, 4) / 10;
		this.sexstats.u.l = this.sexstats?.p?.l ? this.sexstats.p.l + random(24, 40) : 42 + random(1, 20) + bodysize * 6;

		if (this.gender === "female") {
			this.sexstats.u.wet = 0;
			this.sexstats.u.cum = 0;
		}

		return this;
	}
	setMouth() {
		const size = [30, 40, 50, 60, 70, 80];
		this.sexstats.m.d = size[this.sexstats.m.size] + random(-2, 4);

		return this;
	}

	initScars() {
		this.scars = {};

		D.skinlayer.forEach((k) => {
			this.scars[k] = [];
		});

		if (this.gender === "male") delete this.scars.vagina;
		if (this.gender === "female") delete this.scars.penis;

		this.scars.total = {};

		return this;
	}

	initEquipment() {
		this.equip = {};
		Object.keys(D.equip).forEach((k) => {
			this.equip[k] = {};
		});
		return this;
	}

	initRevealDetail() {
		this.reveals = {};

		const ignore = ["vagina", "penis", "buttL", "buttR"];
		this.reveals.expose = 3;
		this.reveals.reveal = 1500;

		this.reveals.detail = {};

		D.skinlayer.forEach((k) => {
			if (ignore.includes(k) === false) this.reveals.detail[k] = { expose: 3, block: 3 };
		});
		//额外处理
		this.reveals.detail.genital = { expose: 3, block: 3 };
		this.reveals.detail.butts = { expose: 3, block: 3 };
		this.reveals.parts = Object.keys(this.reveals.detail);

		return this;
	}

	initVirginity() {
		this.virginity = {};

		// [丧失对象，丧失时间，丧失情景]

		const list = ["kiss", "oral", "penis", "anal", "analsex", "vigina", "viginasex", "handholding", "footjob"];

		if (this.gender === "male") list.splice(5, 2);
		if (this.gender === "female") list.splice(2, 1);

		list.forEach((k) => {
			this.virginity[k] = [];
		});

		return this;
	}

	setNames(names: iName) {
		if (names.v) this.name = names.v;
		if (names.m) this.middlename = names.m;
		if (names.s) this.surname = names.s;
		if (names.n) this.nickame = names.n;
		if (names.c) this.callname = names.c;
		this.fullname = `${this.name}${this.middlename ? "・" + this.middlename : ""}${
			this.surname ? "・" + this.surname : ""
		}`;
		return this;
	}

	setTitle(str) {
		this.title = str;
		return this;
	}

	setJob(str: jobclass) {
		this.class = str;
		return this;
	}

	setBirth(arr: [number, number, number]) {
		this.birthday = arr;
		return this;
	}

	setIntro(arr: [string, string?]) {
		this.intro = arr;
		return this;
	}

	setTraits(arr: string[]) {
		this.traits = arr;
		return this;
	}

	setTalent(arr: string[]) {
		this.talent = arr;
		return this;
	}

	setSkill(arr: string[]) {
		this.skill = arr;
		return this;
	}

	setStats(arr: Dict<number, statskey>) {
		D.stats.forEach((k) => {
			if (arr[k]) this.stats[k] = [arr[k], arr[k]];
			else if (!this.stats[k]) this.stats[k] = [10, 10];

			this.flag[`base${k}`] = this.stats[k][0];
		});
		return this;
	}

	setAbility(arr: Dict<number, ablkey>) {
		for (let i in arr) {
			this.abl[i].lv = arr[i];
		}
		return this;
	}

	setSexAbl(arr: Dict<number, sblkey>) {
		for (let i in arr) {
			this.sbl[i] = arr[i];
		}
		return this;
	}

	setExp(arr: Dict<number, expkey>) {
		for (let i in arr) {
			this.exp[i].total = arr[i];
			this.exp[i].aware = arr[i];
		}
		return this;
	}

	setAppearance(set: {
		eyecolr?: string;
		haircolor?: string;
		hairstyle?: string;
		skincolor?: string;
		bodysize?: number;
		tall?: number;
		weight?: number;
	}) {
		const appearance = {
			eyecolor: set["eyecolr"] ? set["eyecolr"] : "蓝色",

			haircolor: set["haircolor"] ? set["haircolor"] : "金色",
			hairstyle: set["hairstyle"] ? set["hairstyle"] : "散发",
			skincolor: set["skincolor"] ? set["skincolor"] : "健康",
			beauty: F.setBeauty(this),
			bodysize: set["bodysize"] ? set["bodysize"] : set["tall"] ? Math.floor((set["tall"] - 1350) / 150) : 2,
			tall: set["tall"] ? set["tall"] : set["bodysize"] ? set["bodysize"] * 150 + 1300 + random(1, 148) : 1704,
			weight: set["weight"] ? set["weight"] : 0,
		};

		if (!appearance.weight) {
			let tall = appearance.tall / 1000;
			appearance.weight = Math.floor(tall * tall * 19 + 0.5) + random(1, 20) / 10;
		}

		for (let i in appearance) {
			this.appearance[i] = appearance[i];
		}

		return this;
	}

	setVirginity(part, target, time, situation) {
		this.virginity[part] = [target, time, situation];
		return this;
	}

	initDaily() {
		this.daily = {
			cum: 0,
			swallowed: 0,
			cumA: 0,
			cumV: 0,

			origasm: 0,
			onM: 0,
			onB: 0,
			onC: 0,
			onU: 0,
			onV: 0,
			onA: 0,
		};

		if (this.gender === "female") delete this.daily.cum;
		if (this.gender === "male") {
			delete this.daily.cumV;
			delete this.daily.onV;
		}

		return this;
	}

	initFlag() {
		D.cflag.forEach((k) => {
			this.flag[k] = 0;
		});
		return this;
	}

	setFame(key, val) {
		this.flag[`${key}fame`] = val;
		return this;
	}
	resetPalam() {
		for (let i in this.palam) {
			this.palam[i][0] = 0;
			this.palam[i][1] = 0;
		}
		return this;
	}
	resetBase() {
		const list = ["dirty", "drug", "alcohol", "stress"];
		for (let i in this.base) {
			if (list.includes(i)) this.base[i][0] = 0;
			else this.base[i][0] = this.base[i][1];
		}
		return this;
	}
}

Object.defineProperties(window, {
	Chara: { value: Object.freeze(Chara) },
});
