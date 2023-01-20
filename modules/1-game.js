;(function () {
	'use strict';

	function lan(txt, ...txts) {
	  let CN, EN;
	  if (Array.isArray(txt)) {
	    CN = txt[0];
	    EN = txt[1] ? txt[1] : CN;
	  }
	  if (typeof txt === "string") {
	    CN = txt;
	    EN = txts[0] ? txts[0] : txt;
	  }
	  if (lang == "CN" && CN)
	    return CN;
	  if (lang == "EN" && EN)
	    return EN;
	  return txt;
	}
	var language = "CN";
	Object.defineProperties(window, {
	  lan: { value: lan },
	  lang: {
	    get: function() {
	      return language;
	    },
	    set(v) {
	      language = v;
	    }
	  }
	});
	String.prototype.has = function(...str) {
	  if (Array.isArray(str[0]))
	    str = str[0];
	  for (let i = 0; i < str.length; i++)
	    if (this.indexOf(str[i]) != -1)
	      return true;
	  return false;
	};
	Array.prototype.has = function(...str) {
	  if (Array.isArray(str[0]))
	    str = str[0];
	  for (let i = 0; i < str.length; i++)
	    if (this.indexOf(str[i]) != -1)
	      return true;
	  return false;
	};
	function percent(...num) {
	  let min = num[0], max = num[1];
	  if (num.length == 3) {
	    min = num[1];
	    max = num[2];
	  }
	  return Math.clamp(Math.trunc(min / max * 100), 1, 100);
	}
	Object.defineProperties(window, {
	  percent: { value: percent }
	});

	class Item {
	  static newId(categ) {
	    const len = Db[categ].length;
	    return `${categ}_${len}`;
	  }
	  static new() {
	  }
	  constructor(name, des, type) {
	    this.id = Item.newId(type);
	    this.name = name;
	    this.des = des;
	    this.type = type;
	  }
	}
	Object.defineProperties(window, {
	  Item: { value: Item }
	});

	const _Chara = class {
	  static load(chara) {
	    const { cid, name, gender, race: race2, kojo } = chara;
	    const init = new _Chara(cid, name, gender, race2, kojo, chara);
	    return init;
	  }
	  static new(cid, name, gender, race2, kojo) {
	    _Chara.data[cid] = new _Chara(cid, name, gender, race2, kojo);
	    return _Chara.data[cid];
	  }
	  constructor(id, name, gender, race2, kojo, chara) {
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
	      this.race = race2;
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
	  initChara(type) {
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
	      this.base[k] = [0, 1e3];
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
	        exp: 0
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
	  setOrgan(part, adj) {
	    this.sexstats[part] = {
	      lv: (adj == null ? void 0 : adj.lv) ? adj.lv : 0,
	      size: (adj == null ? void 0 : adj.size) ? adj.size : 0
	    };
	    if (groupmatch(part, "p", "a", "v")) {
	      this.sexstats[part].wet = 0;
	      this.sexstats[part].cum = 0;
	    }
	    if (part == "p")
	      this.setPenis(adj);
	    if (part == "c")
	      this.setCrit();
	    if (part == "v")
	      this.setVagi();
	    if (part == "a")
	      this.setAnal();
	    if (part == "b")
	      this.setBreast(adj);
	    if (part == "u")
	      this.setUrin();
	    if (part == "m")
	      this.setMouth();
	    return this;
	  }
	  maxcum() {
	    const p = this.sexstats.p;
	    return (p.size * 50 + 50) * (p.trait.includes("\u6D53\u539A") ? 10 : 1);
	  }
	  setPenis(adj) {
	    var _a, _b, _c, _d;
	    let type = (_a = adj == null ? void 0 : adj.type) != null ? _a : "\u9634\u830E", trait = (_b = adj == null ? void 0 : adj.trait) != null ? _b : [], d = (_c = adj == null ? void 0 : adj.d) != null ? _c : 0, l = (_d = adj == null ? void 0 : adj.l) != null ? _d : 0;
	    const Psize = _Chara.Psize;
	    const P2 = this.sexstats.p;
	    const size = Psize[P2.size];
	    P2.type = type;
	    P2.trait = trait;
	    P2.d = d ? d : size[1] + random(-8, 8);
	    P2.l = l ? l : size[0] + random(-8, 8);
	    P2.maxcum = this.maxcum();
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
	  setBreast(adj) {
	    this.sexstats.b.maxmilk = (adj == null ? void 0 : adj.maxmilk) ? adj.maxmilk : 0;
	    this.sexstats.b.milk = this.sexstats.b.maxmilk;
	    return this;
	  }
	  setUrin() {
	    this.sexstats.u.size;
	    this.sexstats.u.d = this.fixUrinDiameter();
	    this.sexstats.u.l = this.GenerateUrinDepth();
	    if (this.gender === "female") {
	      this.sexstats.u.wet = 0;
	      this.sexstats.u.cum = 0;
	    }
	    return this;
	  }
	  bodysize() {
	    if (this.appearance.bodysize === void 0)
	      this.appearance.bodysize = 2;
	    const { bodysize } = this.appearance;
	    return bodysize ? bodysize : 1;
	  }
	  MaxUrinhole() {
	    const bodysize = this.bodysize();
	    let max = bodysize / 2 + 0.5;
	    if (this.gender !== "female")
	      max = 1;
	    return max;
	  }
	  fixUrinDiameter() {
	    const max = this.MaxUrinhole();
	    const size = this.sexstats.u.size;
	    return size * max + 0.5 + random(-2, 4) / 10;
	  }
	  GenerateUrinDepth() {
	    var _a, _b;
	    const penis = (_b = (_a = this.sexstats) == null ? void 0 : _a.p) == null ? void 0 : _b.l;
	    if (penis)
	      return penis + random(24, 40);
	    return 42 + random(1, 20) + this.bodysize() * 6;
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
	    if (this.gender === "male")
	      delete this.scars.vagina;
	    if (this.gender === "female")
	      delete this.scars.penis;
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
	      if (ignore.includes(k) === false)
	        this.reveals.detail[k] = { expose: 3, block: 3 };
	    });
	    this.reveals.detail.genital = { expose: 3, block: 3 };
	    this.reveals.detail.butts = { expose: 3, block: 3 };
	    this.reveals.parts = Object.keys(this.reveals.detail);
	    return this;
	  }
	  initVirginity() {
	    this.virginity = {};
	    const list = clone(D.virginity);
	    if (this.gender === "male")
	      list.splice(5, 2);
	    if (this.gender === "female")
	      list.splice(2, 1);
	    list.forEach((k) => {
	      this.virginity[k] = [];
	    });
	    return this;
	  }
	  setNames(names) {
	    if (names == null ? void 0 : names.v)
	      this.name = names.v;
	    if (names == null ? void 0 : names.m)
	      this.middlename = names.m;
	    if (names == null ? void 0 : names.s)
	      this.surname = names.s;
	    if (names == null ? void 0 : names.n)
	      this.nickame = names.n;
	    if (names == null ? void 0 : names.c)
	      this.callname = names.c;
	    this.fullname = `${this.name}${this.middlename ? "\u30FB" + this.middlename : ""}${this.surname ? "\u30FB" + this.surname : ""}`;
	    return this;
	  }
	  setTitle(str) {
	    this.title = str;
	    return this;
	  }
	  setJob(str) {
	    this.class = str;
	    return this;
	  }
	  setBirth(arr) {
	    this.birthday = arr;
	    return this;
	  }
	  setIntro(arr) {
	    this.intro = arr;
	    return this;
	  }
	  setTraits(arr) {
	    this.traits = arr;
	    return this;
	  }
	  setTalent(arr) {
	    this.talent = arr;
	    return this;
	  }
	  setSkill(arr) {
	    this.skill = arr;
	    return this;
	  }
	  setStats(obj) {
	    D.stats.forEach((k) => {
	      if (obj[k])
	        this.stats[k] = [obj[k], obj[k]];
	      else if (!this.stats[k])
	        this.stats[k] = [10, 10];
	      this.flag[`base${k}`] = this.stats[k][0];
	    });
	    return this;
	  }
	  setAbility(obj) {
	    for (let i in obj) {
	      this.abl[i].lv = obj[i];
	    }
	    return this;
	  }
	  setSexAbl(arr) {
	    for (let i in arr) {
	      this.sbl[i] = arr[i];
	    }
	    return this;
	  }
	  setExp(arr) {
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
	    return this.state.has("\u7761\u7720", "\u6655\u53A5");
	  }
	  unable() {
	    return this.state.has("\u62D8\u675F", "\u77F3\u5316") || !cond.isEnergetic(this, 30);
	  }
	  active() {
	    return !this.state.has("\u7761\u7720", "\u6655\u53A5", "\u62D8\u675F", "\u77F3\u5316", "\u7CBE\u795E\u5D29\u6E83") && !cond.baseLt(this, "health", 0.05) && !cond.baseLt(this, "sanity", 10) && !cond.baseLt(this, "stamina", 10);
	  }
	  bp() {
	    const s = this.stats;
	    return s.STR[1] * 15 + s.CON[1] * 8 + s.DEX[1] * 8 + s.INT[1] * 8 + s.WIL[1] * 10 + s.PSY[1];
	  }
	  setAppearance({
	    eyecolor = "\u84DD\u8272",
	    haircolor = "\u91D1\u8272",
	    hairstyle = "\u6563\u53D1",
	    skincolor = "\u5065\u5EB7",
	    bodysize,
	    tall,
	    weight = 0
	  }) {
	    const appearance = {
	      eyecolor,
	      haircolor,
	      hairstyle,
	      skincolor,
	      beauty: fix.beauty(this),
	      bodysize: bodysize !== void 0 ? bodysize : tall ? this.GenerateBodysize(tall) : 2,
	      tall: tall ? tall : bodysize ? this.GenerateTall() : 1704,
	      weight
	    };
	    if (!appearance.weight) {
	      appearance.weight = this.GenerateWeight(appearance.tall);
	    }
	    for (let i in appearance) {
	      this.appearance[i] = appearance[i];
	    }
	    return this;
	  }
	  GenerateTall(size) {
	    const bodysize = size !== void 0 ? size : this.appearance.bodysize;
	    return bodysize * 150 + 1300 + random(1, 148);
	  }
	  GenerateBodysize(_tall) {
	    const tall = _tall ? _tall : this.appearance.tall;
	    return Math.floor((tall - 1350) / 150);
	  }
	  GenerateWeight(_tall) {
	    const tall = _tall / 1e3;
	    return Math.floor(tall * tall * 19 + 0.5) + random(1, 20) / 10;
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
	      onA: 0
	    };
	    if (this.gender === "female")
	      delete this.daily.cum;
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
	      if (list.includes(i))
	        this.base[i][0] = 0;
	      else
	        this.base[i][0] = this.base[i][1];
	    }
	    return this;
	  }
	};
	let Chara = _Chara;
	Chara.data = {};
	Chara.Psize = [
	  [60, 15],
	  [90, 22],
	  [120, 32],
	  [140, 42],
	  [160, 52],
	  [180, 62],
	  [210, 74],
	  [250, 86]
	];
	Object.defineProperties(window, {
	  Chara: { value: Chara }
	});

	window.database = {};
	window.gameutils = {
	  condition: {},
	  UI: {},
	  printer: {},
	  utils: {},
	  fix: {}
	};
	window.gamedata = {};
	window.languagedata = {};
	Object.defineProperties(window, {
	  D: {
	    get: function() {
	      return window.gamedata;
	    }
	  },
	  Db: {
	    get: function() {
	      return window.database;
	    }
	  },
	  L: {
	    get: function() {
	      return window.languagedata;
	    }
	  },
	  F: {
	    get: function() {
	      return window.gameutils.utils;
	    }
	  },
	  ui: {
	    get: function() {
	      return window.gameutils.UI;
	    }
	  },
	  P: {
	    get: function() {
	      return window.gameutils.printer;
	    }
	  },
	  cond: {
	    get: function() {
	      return window.gameutils.condition;
	    }
	  },
	  fix: {
	    get: function() {
	      return window.gameutils.fix;
	    }
	  }
	});
	console.log(lan("\u6E38\u620F\u5F00\u59CB", "game start"));

})();
