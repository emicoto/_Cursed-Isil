;(function () {
	'use strict';

	function lan(txt, DEF) {
	  let CN, EN;
	  if (Array.isArray(txt)) {
	    CN = txt[0];
	    EN = txt[1] ? txt[1] : CN;
	  }
	  if (typeof txt === "string" && DEF) {
	    CN = txt;
	    EN = DEF;
	  }
	  if (lang == "CN" && isValid(CN))
	    return CN;
	  if (lang == "EN" && isValid(EN))
	    return EN;
	  return DEF;
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

	class Chara {
	  static load(chara) {
	    const { cid, name, gender, race: race2, kojo } = chara;
	    const init = new Chara(cid, name, gender, race2, kojo, chara);
	    return init;
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
	      if (part == "p")
	        this.sexstats[part].maxcum = this.sexstats[part].size * 50 + 50;
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
	  setPenis(adj) {
	    const Psize = [
	      [60, 15],
	      [90, 22],
	      [120, 32],
	      [140, 42],
	      [160, 52],
	      [180, 62],
	      [210, 74],
	      [250, 86]
	    ];
	    const P2 = this.sexstats.p;
	    const size = Psize[P2.size];
	    P2.type = (adj == null ? void 0 : adj.type) ? adj.type : "\u9634\u830E";
	    P2.trait = (adj == null ? void 0 : adj.trait) ? adj.trait : [];
	    P2.d = (adj == null ? void 0 : adj.d) ? adj.d : size[1] + random(-8, 8);
	    P2.l = (adj == null ? void 0 : adj.l) ? adj.l : size[0] + random(-8, 8);
	    if (P2.trait.includes("\u6D53\u539A"))
	      P2.maxcum *= 10;
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
	  setBreast(adj) {
	    this.sexstats.b.maxmilk = (adj == null ? void 0 : adj.maxmilk) ? adj.maxmilk : 0;
	    this.sexstats.b.milk = this.sexstats.b.maxmilk;
	    return this;
	  }
	  setUrin() {
	    var _a, _b;
	    const size = this.sexstats.u.size;
	    const bodysize = this.appearance.bodysize ? this.appearance.bodysize : 1;
	    let up = bodysize / 2 + 0.5;
	    if (this.gender == "male")
	      up = 1;
	    this.sexstats.u.d = size * up + 0.5 + random(-2, 4) / 10;
	    this.sexstats.u.l = ((_b = (_a = this.sexstats) == null ? void 0 : _a.p) == null ? void 0 : _b.l) ? this.sexstats.p.l + random(24, 40) : 42 + random(1, 20) + bodysize * 6;
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
	    this.virginiy = {};
	    const list = ["kiss", "oral", "penis", "anal", "analsex", "vigina", "viginasex", "handholding", "footjob"];
	    if (this.gender === "male")
	      list.splice(5, 2);
	    if (this.gender === "female")
	      list.splice(2, 1);
	    list.forEach((k) => {
	      this.virginiy[k] = [];
	    });
	    return this;
	  }
	  setNames(names) {
	    if (names.v)
	      this.name = names.v;
	    if (names.m)
	      this.middlename = names.m;
	    if (names.s)
	      this.surname = names.s;
	    if (names.n)
	      this.nickame = names.n;
	    if (names.c)
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
	  setStats(arr) {
	    D.stats.forEach((k) => {
	      if (arr[k])
	        this.stats[k] = [arr[k], arr[k]];
	      else if (!this.stats[k])
	        this.stats[k] = [10, 10];
	      this.flag[`base${k}`] = this.stats[k][0];
	    });
	    return this;
	  }
	  setAbility(arr) {
	    for (let i in arr) {
	      this.abl[i].lv = arr[i];
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
	      this.exp[i] = arr[i];
	    }
	    return this;
	  }
	  setAppearance(set) {
	    const appearance = {
	      eyecolor: set["eyecolr"] ? set["eyecolr"] : "\u84DD\u8272",
	      haircolor: set["haircolor"] ? set["haircolor"] : "\u91D1\u8272",
	      hairstyle: set["hairstyle"] ? set["hairstyle"] : "\u6563\u53D1",
	      skincolor: set["skincolor"] ? set["skincolor"] : "\u5065\u5EB7",
	      beauty: F.setBeauty(this),
	      bodysize: set["bodysize"] ? set["bodysize"] : set["tall"] ? Math.floor((set["tall"] - 1350) / 150) : 2,
	      tall: set["tall"] ? set["tall"] : set["bodysize"] ? set["bodysize"] * 150 + 1300 + random(1, 148) : 1704,
	      weight: set["weight"] ? set["weight"] : 0
	    };
	    if (!appearance.weight) {
	      let tall = appearance.tall / 1e3;
	      appearance.weight = Math.floor(tall * tall * 19 + 0.5) + random(1, 20) / 10;
	    }
	    for (let i in appearance) {
	      this.appearance[i] = appearance[i];
	    }
	    return this;
	  }
	  setVirginity(part, target, time, situation) {
	    this.virginiy[part] = [target, time, situation];
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
	    const list = [
	      "cursedLv",
	      "cursedMP",
	      "cursed",
	      "favo",
	      "trust",
	      "sub",
	      "depend",
	      "desire",
	      "fallen",
	      "schoolfame",
	      "jobfame",
	      "publicfame",
	      "lewdfame",
	      "crimefame",
	      "wakeuptime",
	      "sleeptime",
	      "wokeup",
	      "lastslept"
	    ];
	    list.forEach((k) => {
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
	}
	Object.defineProperties(window, {
	  Chara: { value: Object.freeze(Chara) }
	});

	window.database = {};
	window.gameutils = {};
	window.gamedata = {};
	window.languagedata = {};
	Object.defineProperties(window, {
	  G: {
	    get: function() {
	      return window.game;
	    }
	  },
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
	      return window.gameutils;
	    }
	  }
	});
	console.log(lan("\u6E38\u620F\u5F00\u59CB", "game start"));

})();
