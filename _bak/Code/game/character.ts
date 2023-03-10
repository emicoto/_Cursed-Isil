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
	creaturetype,
	sexStats,
	appearance,
} from "./types";

declare function groupmatch(arg, ...args): boolean;

export interface Creature {
	type: creaturetype;
	id?: string;
	cid: string;
	name: string;
	gender: genderFull;
	position: "neko" | "tachi" | "both";
	race: race;
	traits: string[];
	talent: string[];
	skill: string[];

	stats: Dict<P, statskey>;
	appearance?: appearance;
	base: Dict<P, basekey>;
	palam: Dict<P, palamkey>;

	source: Dict<number>;
	state: string[];
	mood: number;

	tsv: any;
	abl: Dict<{ lv: number; exp: number }, ablkey>;
	sbl: Dict<number, sblkey>;
	sexstats: Dict<sexStats>;

	equip?: any;
}

export interface Chara extends Creature {
	name: string;
	midname?: string;
	surname?: string;
	fullname?: string;
	nickame?: string;
	callname?: string;

	title?: string;
	class?: jobclass;
	guildRank?: number;

	kojo?: string;
	birthday?: [number, number, number];
	intro?: [string?, string?];

	mark?: Dict<number, markkey>;

	expUp: Dict<number>;

	daily?: any;
	exp?: Dict<{ aware: number; total: number }, expkey>;

	pregnancy?: any;
	parasite?: any;
	scars?: any;

	wear?: any;

	reveals?: any;
	virginity?: any;

	flag: any; //好感、信赖， 学籍情报， 诅咒进展， 诅咒魔力效率等
	wallet?: number;
	debt?: number;
	inventory?: any;
	tempe?: { low: number; high: number; best: number; current: number };
}

interface iName {
	v?: string;
	m?: string; //middle
	s?: string; //surname
	n?: string; //nick
	c?: string; //call master
}

export class Creature {
	static data: Dict<Creature> = {};
	constructor(type: creaturetype, name: string, gender: genderFull, race: race) {
		this.type = type;
		this.cid = type + "_" + Object.values(Creature.data).length;

		this.name = name;
		this.gender = gender;
		this.race = race;

		this.appearance = {};

		this.traits = [];
		this.talent = [];
		this.skill = [];

		this.stats = {};
		this.base = {};
		this.palam = {};
		this.state = [];
		this.source = {};

		this.tsv = {};
		this.abl = {};
		this.sbl = {};
		this.sexstats = {};

		this.mood = 30;
	}

	init(pos) {
		this.position = pos;
		this.initBase();
		this.initStats();
		this.initAbility();
		this.initSexAbl();
		this.initSexStats();
	}

	initBase() {
		Object.keys(D.base).forEach((k) => {
			this.base[k] = [0, 1000];
		});

		Object.keys(D.palam).forEach((k) => {
			this.palam[k] = [0, 0, 1200];
			this.source[k] = 0;
		});

		D.tsv.forEach((k) => {
			this.tsv[k] = 0;
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

	maxcum() {
		const p = this.sexstats.p;
		return (p.size * 50 + 50) * (p.trait.includes("浓厚") ? 10 : 1);
	}

	setPenis(adj?) {
		let type = adj?.type ?? "阴茎",
			trait = adj?.trait ?? [],
			d = adj?.d ?? 0,
			l = adj?.l ?? 0;

		//P标准Size表. 具体会在长度与宽度 +-8/+-6
		const Psize = D.Psize;
		const P = this.sexstats.p;
		const size = Psize[P.size];
		P.type = type;
		P.trait = trait;
		P.d = d ? d : size[1] + random(-8, 8);
		P.l = l ? l : size[0] + random(-8, 8);

		P.maxcum = this.maxcum();

		return this;
	}

	setCrit() {
		this.sexstats.c.d = this.sexstats.c.size + 5;
		return this;
	}
	setVagi() {
		this.sexstats.v.d = this.fixVagiDiameter();
		this.sexstats.v.l = this.GenerateVagiDepth();

		return this;
	}
	maxHoleSize() {
		return this.bodysize() * 2 - 2.4;
	}
	fixVagiDiameter() {
		const max = this.maxHoleSize();
		return this.sexstats.v.size * max + 14 + random(-2, 4);
	}
	GenerateVagiDepth() {
		return this.bodysize() * 21 + 80 + random(-4, 8);
	}
	setAnal() {
		this.sexstats.a.d = this.fixAnalDiameter();
		this.sexstats.a.l = this.GenerateAnalDepth();
		return this;
	}
	fixAnalDiameter() {
		const max = this.maxHoleSize();
		return this.sexstats.a.size * max + 12 + random(-2, 4);
	}
	GenerateAnalDepth() {
		return this.bodysize() * 32 + 140 + random(-4, 8);
	}
	setBreast(adj?) {
		this.sexstats.b.maxmilk = adj?.maxmilk ? adj.maxmilk : 0;
		this.sexstats.b.milk = this.sexstats.b.maxmilk;
		return this;
	}
	setUrin() {
		this.sexstats.u.d = this.fixUrinDiameter();
		this.sexstats.u.l = this.GenerateUrinDepth();

		if (this.gender === "female") {
			this.sexstats.u.wet = 0;
			this.sexstats.u.cum = 0;
		}

		return this;
	}
	bodysize() {
		if (this.appearance.bodysize === undefined) this.appearance.bodysize = 2;
		const { bodysize } = this.appearance;
		return bodysize ? bodysize : 1;
	}
	MaxUrinhole() {
		const bodysize = this.bodysize();
		let max = bodysize / 2 + 0.5;
		if (this.gender !== "female") max = 1;
		return max;
	}
	fixUrinDiameter() {
		const max = this.MaxUrinhole();
		const size = this.sexstats.u.size;
		return size * max + 0.5 + random(-2, 4) / 10;
	}
	GenerateUrinDepth() {
		const penis = this.sexstats?.p?.l;
		if (penis) return penis + random(24, 40);
		return 42 + random(1, 20) + this.bodysize() * 6;
	}
	setMouth() {
		const size = [30, 40, 50, 60, 70, 80];
		this.sexstats.m.d = size[this.sexstats.m.size] + random(-2, 4);

		return this;
	}

	GenerateTall(size?) {
		const bodysize = size !== undefined ? size : this.appearance.bodysize;
		return bodysize * 150 + 1300 + random(1, 150) + bodysize >= 5 ? random(100, 200) : random(1, 20);
	}

	GenerateBodysize(_tall?) {
		const tall = _tall ? _tall : this.appearance.tall;
		return Math.floor((tall - 1350) / 150) + 1;
	}

	GenerateWeight(_tall) {
		const tall = _tall / 1000;
		return Math.floor(tall * tall * 19 + 0.5) + random(1, 20) / 10;
	}

	initEquipment() {
		this.equip = {};
		Object.keys(D.equip).forEach((k) => {
			this.equip[k] = {};
		});
		return this;
	}

	initAppearance(bodysize) {
		this.appearance.bodysize = bodysize;
		this.appearance.tall = this.GenerateTall();
		this.appearance.weight = this.GenerateWeight(this.appearance.tall);
		return this;
	}

	bp() {
		const s = this.stats;
		return s.STR[1] * 15 + s.CON[1] * 8 + s.DEX[1] * 8 + s.INT[1] * 8 + s.WIL[1] * 10 + s.PSY[1];
	}
}

export class Chara extends Creature {
	static data: Dict<Chara> = {};
	static load(chara: Chara) {
		const { cid, name, gender, race, kojo } = chara;
		const init = new Chara(cid, name, gender, race, kojo, chara);
		return init;
	}
	static new(cid: string, name: string, gender: genderFull, race: race, kojo?) {
		Chara.data[cid] = new Chara(cid, name, gender, race, kojo);
		return Chara.data[cid];
	}
	constructor(id: string, name: string, gender: genderFull, race: race, kojo?: string, chara?) {
		super("chara", name, gender, race);
		if (chara) {
			for (let i in chara) {
				this[i] = clone(chara[i]);
			}
		} else {
			this.cid = id;
			this.name = name;
			this.midname = "";
			this.surname = "";
			this.fullname = "";

			this.mood = 30;
			this.title = "";
			this.class = "";
			this.guildRank = 0;

			this.kojo = kojo ? kojo : id;

			this.mark = {};
			this.exp = {};
			this.expUp = {};
			this.flag = {};
		}
	}

	initChara(pos) {
		this.init(pos);

		this.initMark();
		this.initExp();
		this.initAppearance(2);
		this.initEquipment();
		this.initRevealDetail();
		this.initVirginity();
		this.initDaily();
		this.initScars();
		this.initFlag();
		this.wallet = 1000;
		this.inventory = [];
		this.tempe = {
			low: 16,
			high: 28,
			best: 23,
			current: 36,
		}; //最低适应温度， 最高适应温度, 最佳适应温度， 当前体温. 单位摄氏度
		return this;
	}

	initMark() {
		Object.keys(D.mark).forEach((k) => {
			this.mark[k] = 0;
		});
		return this;
	}

	initExp() {
		Object.keys(D.exp).forEach((k) => {
			this.exp[k] = { aware: 0, total: 0 };
		});
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
		const list = clone(D.virginity);

		if (this.gender === "male") list.splice(5, 2);
		if (this.gender === "female") list.splice(2, 1);

		list.forEach((k) => {
			this.virginity[k] = [];
		});

		return this;
	}

	setNames(names?: iName) {
		if (names?.v) this.name = names.v;
		if (names?.m) this.midname = names.m;
		if (names?.s) this.surname = names.s;
		if (names?.n) this.nickame = names.n;
		if (names?.c) this.callname = names.c;
		this.fullname = `${this.name}${this.midname ? "・" + this.midname : ""}${
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

	setStats(obj: Dict<number, statskey>) {
		D.stats.forEach((k) => {
			if (obj[k]) this.stats[k] = [obj[k], obj[k]];
			else if (!this.stats[k]) this.stats[k] = [10, 10];

			this.flag[`base${k}`] = this.stats[k][0];
		});
		return this;
	}

	setAbility(obj: Dict<number, ablkey>) {
		for (let i in obj) {
			this.abl[i].lv = obj[i];
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

	getExp(exp, value) {
		this.exp[exp].total += value;
		if (!this.uncons()) {
			this.exp[exp].aware += value;
		}
		this.expUp[exp] = value;
		return this;
	}

	getBase(key, value) {
		this.base[key][0] += value;
		return this;
	}

	getPalam(key, value) {
		this.palam[key][1] += value;
		return this;
	}

	uncons() {
		return this.state.has("睡眠", "晕厥");
	}

	unable() {
		return this.state.has("拘束", "石化") || !Cond.isEnergetic(this.cid, 30);
	}

	active() {
		return (
			!this.state.has("睡眠", "晕厥", "拘束", "石化", "精神崩溃") &&
			!Cond.baseLt(this.cid, "health", 0.05) &&
			!Cond.baseLt(this.cid, "sanity", 10) &&
			!Cond.baseLt(this.cid, "stamina", 10)
		);
	}

	setAppearance({
		eyecolor = "蓝色",
		haircolor = "金色",
		hairstyle = "散发",
		skincolor = "健康",
		bodysize,
		tall,
		weight = 0,
	}) {
		const appearance = {
			eyecolor: eyecolor,
			haircolor: haircolor,
			hairstyle: hairstyle,
			skincolor: skincolor,
			beauty: Fix.beauty(this),
			bodysize: bodysize !== undefined ? bodysize : tall ? this.GenerateBodysize(tall) : this.appearance.bodysize,
			tall: tall ? tall : bodysize ? this.GenerateTall() : 1704,
			weight: weight,
		};

		if (!appearance.weight) {
			appearance.weight = this.GenerateWeight(appearance.tall);
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

const modules = {
	name: "Creatures",
	version: "1.0.0",
	des: "A module for generating creatures, including characters, monsters, and NPCs.",
	classObj: {
		Creature,
		Chara,
	},
};

declare function registModule(mod): boolean;
registModule(modules);
