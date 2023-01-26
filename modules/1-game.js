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

	const _Creature = class {
	  constructor(type, name, gender, race2) {
	    this.type = type;
	    this.cid = type + "_" + Object.values(_Creature.data).length;
	    this.name = name;
	    this.gender = gender;
	    this.race = race2;
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
	      this.base[k] = [0, 1e3];
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
	    const Psize = D.Psize;
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
	};
	let Creature = _Creature;
	Creature.data = {};
	const _Chara = class extends Creature {
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
	    super("chara", name, gender, race2);
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
	    this.wallet = 1e3;
	    this.invetory = [];
	    this.tempture = {
	      low: 16,
	      high: 28,
	      best: 23,
	      current: 36
	    };
	    return this;
	  }
	  initMark() {
	    Object.keys(D.mark).forEach((k) => {
	      this.mark[k] = 0;
	    });
	    return this;
	  }
	  initExp() {
	    D.exp.forEach((k) => {
	      this.exp[k] = { aware: 0, total: 0 };
	    });
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
	      this.midname = names.m;
	    if (names == null ? void 0 : names.s)
	      this.surname = names.s;
	    if (names == null ? void 0 : names.n)
	      this.nickame = names.n;
	    if (names == null ? void 0 : names.c)
	      this.callname = names.c;
	    this.fullname = `${this.name}${this.midname ? "\u30FB" + this.midname : ""}${this.surname ? "\u30FB" + this.surname : ""}`;
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
	    return this.state.has("\u62D8\u675F", "\u77F3\u5316") || !cond.isEnergetic(this.cid, 30);
	  }
	  active() {
	    return !this.state.has("\u7761\u7720", "\u6655\u53A5", "\u62D8\u675F", "\u77F3\u5316", "\u7CBE\u795E\u5D29\u6E83") && !cond.baseLt(this.cid, "health", 0.05) && !cond.baseLt(this.cid, "sanity", 10) && !cond.baseLt(this.cid, "stamina", 10);
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
	      bodysize: bodysize !== void 0 ? bodysize : tall ? this.GenerateBodysize(tall) : this.appearance.bodysize,
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
	Object.defineProperties(window, {
	  Creature: { value: Creature },
	  Chara: { value: Chara }
	});

	const moveableTile = ["road", "glass", "field", "TRoad", "LRoad", "crossRoad", "passable"];
	function GenerateSpot(map) {
	  const townmap = new Array(map.mapsize.x).fill(0).map(() => new Array(map.mapsize.y).fill(""));
	  const spots = Array.from(map.spots);
	  spots.sort((a, b) => {
	    if (a[1][0].x === b[1][0].x) {
	      return a[1][0].y - b[1][0].y;
	    }
	    return a[1][0].x - b[1][0].x;
	  });
	  spots.forEach((location) => {
	    const pos = location[1][0];
	    townmap[pos.x][pos.y] = location[0];
	  });
	  const road = [];
	  const setRoad = (x, y, side) => {
	    if (x < 0 || y < 0 || x >= map.mapsize.x || y >= map.mapsize.y)
	      return;
	    if (townmap[x][y] === "") {
	      townmap[x][y] = "road";
	      road.push([side, x, y]);
	    }
	  };
	  spots.forEach((location) => {
	    const pos = location[1][0];
	    const side = location[1][1];
	    side.split("").forEach((s) => {
	      switch (s) {
	        case "W":
	        case "w":
	          setRoad(pos.x, pos.y - 1, "W");
	          break;
	        case "E":
	        case "e":
	          setRoad(pos.x, pos.y + 1, "E");
	          break;
	        case "S":
	        case "s":
	          setRoad(pos.x + 1, pos.y, "S");
	          break;
	        case "N":
	        case "n":
	          setRoad(pos.x - 1, pos.y, "N");
	          break;
	      }
	    });
	  });
	  return [townmap, road];
	}
	function GenerateMap(map) {
	  const maps = GenerateSpot(map);
	  const townmap = maps[0];
	  const road = maps[1];
	  const directions = [
	    [0, -1],
	    [0, 1],
	    [1, 0],
	    [-1, 0]
	  ];
	  const directions2 = [
	    [1, -1],
	    [1, 1],
	    [-1, 1],
	    [-1, -1]
	  ];
	  const checkRoad = (side, x, y, start, end) => {
	    if (x < 0 || y < 0 || x >= townmap.length || y >= townmap[x].length)
	      return false;
	    if (side == "x") {
	      for (let i = start; i <= end; i++) {
	        if (townmap[i][y] !== "" && townmap[i][y] !== "road")
	          return false;
	      }
	    }
	    if (side == "y") {
	      for (let i = start; i <= end; i++) {
	        if (townmap[x][i] !== "" && townmap[x][i] !== "road")
	          return false;
	      }
	    }
	    return true;
	  };
	  const isRoad = (x, y) => {
	    if (x < 0 || y < 0 || x >= townmap.length || y >= townmap[x].length)
	      return false;
	    return townmap[x][y] === "road";
	  };
	  const hasRoadAround = (side, x, y) => {
	    if (x < 0 || y < 0 || x >= townmap.length || y >= townmap[x].length)
	      return false;
	    let count = 0;
	    directions.concat(directions2).forEach((dir) => {
	      if (side == "x" && dir[0] == 0) ; else if (side == "y" && dir[1] == 0) ; else if (isRoad(x + dir[0], y + dir[1]))
	        count++;
	    });
	    return count > 4;
	  };
	  const connectRoad = (side, x, y, start, end) => {
	    if (side == "x") {
	      for (let i = start; i <= end; i++) {
	        if (townmap[i][y] === "") {
	          if (hasRoadAround(side, i, y))
	            continue;
	          townmap[i][y] = "road";
	        }
	      }
	    }
	    if (side == "y") {
	      for (let i = start; i <= end; i++) {
	        if (townmap[x][i] === "") {
	          if (hasRoadAround(side, x, i))
	            continue;
	          townmap[x][i] = "road";
	        }
	      }
	    }
	  };
	  road.forEach((road2) => {
	    const x = road2[1];
	    const y = road2[2];
	    const side = road2[0];
	    if (side == "N" || side == "S") {
	      for (let i = x - 1; i >= 0; i--) {
	        if (townmap[i][y] === "road") {
	          if (checkRoad("x", x, y, i + 1, x - 1)) {
	            connectRoad("x", x, y, i + 1, x - 1);
	          }
	        }
	      }
	      for (let i = x + 1; i < map.mapsize.x; i++) {
	        if (townmap[i][y] === "road") {
	          if (checkRoad("x", x, y, x + 1, i - 1)) {
	            connectRoad("x", x, y, x + 1, i - 1);
	          }
	        }
	      }
	    }
	    for (let i = y - 1; i >= 0; i--) {
	      if (townmap[x][i] === "road") {
	        if (checkRoad("y", x, y, i + 1, y - 1)) {
	          connectRoad("y", x, y, i + 1, y - 1);
	        }
	      }
	    }
	    for (let i = y + 1; i < map.mapsize.y; i++) {
	      if (townmap[x][i] === "road") {
	        if (checkRoad("y", x, y, y + 1, i - 1)) {
	          connectRoad("y", x, y, y + 1, i - 1);
	        }
	      }
	    }
	  });
	  clearUnconnectRoad(townmap);
	  printMap(townmap);
	  return townmap;
	}
	function Distance(start, goal) {
	  return Math.abs(start.x - start.x) + Math.abs(goal.y - goal.y);
	}
	function outOfMap(x, y, map) {
	  return x < 0 || y < 0 || x >= map.length || y >= map[x].length;
	}
	function UnconnectRoad(x, y, map) {
	  const directions = [
	    [-1, 0],
	    [1, 0],
	    [0, -1],
	    [0, 1]
	  ];
	  let i = 0;
	  directions.forEach((dir) => {
	    if (outOfMap(x + dir[0], y + dir[1], map)) ; else if (!groupmatch(map[x + dir[0]][y + dir[1]], "", "."))
	      i++;
	  });
	  return i === 0;
	}
	function clearUnconnectRoad(map) {
	  for (let x = 0; x < map.length; x++) {
	    for (let y = 0; y < map[x].length; y++) {
	      if (map[x][y] === "road") {
	        if (UnconnectRoad(x, y, map)) {
	          map[x][y] = "";
	        }
	      }
	    }
	  }
	  return map;
	}
	function isConnected(pos1, pos2, map) {
	  const x1 = pos1.x, y1 = pos1.y, x2 = pos2.x, y2 = pos2.y;
	  if (x1 === x2 && y1 === y2)
	    return true;
	  if (x1 === x2) {
	    if (y1 > y2) {
	      for (let i = y2; i <= y1; i++) {
	        if (groupmatch(map[x1][i], "", ".") || map[x1][i].has("unpassable"))
	          return false;
	      }
	    } else {
	      for (let i = y1; i <= y2; i++) {
	        if (groupmatch(map[x1][i], "", ".") || map[x1][i].has("unpassable"))
	          return false;
	      }
	    }
	  } else if (y1 === y2) {
	    if (x1 > x2) {
	      for (let i = x2; i <= x1; i++) {
	        if (groupmatch(map[i][y1], "", ".") || map[x1][i].has("unpassable"))
	          return false;
	      }
	    } else {
	      for (let i = x1; i <= x2; i++) {
	        if (groupmatch(map[i][y1], "", ".") || map[x1][i].has("unpassable"))
	          return false;
	      }
	    }
	  } else {
	    return Distance(pos1, pos2) === 1;
	  }
	  return true;
	}
	function findPath(mapdata, startPoint, goalPoint) {
	  const queue = [];
	  const visited = /* @__PURE__ */ new Set();
	  const directions = [
	    [-1, 0],
	    [1, 0],
	    [0, -1],
	    [0, 1]
	  ];
	  queue.push({ x: startPoint.x, y: startPoint.y, path: [], from: null });
	  visited.add(startPoint);
	  while (queue.length > 0) {
	    const current = queue.shift();
	    if (current.x === goalPoint.x && current.y === goalPoint.y) {
	      return current.path;
	    }
	    for (const dir of directions) {
	      const x = current.x + dir[0];
	      const y = current.y + dir[1];
	      if (x < 0 || y < 0 || x >= mapdata.length || y >= mapdata[0].length) {
	        continue;
	      }
	      if (mapdata[x][y].has("unpassable"))
	        continue;
	      if (!mapdata[x][y].has(moveableTile) && x != goalPoint.x && y != goalPoint.y)
	        continue;
	      if (!isConnected({ x: current.x, y: current.y }, { x, y }, mapdata))
	        continue;
	      if (visited.has(`${x},${y}`)) {
	        continue;
	      }
	      if (current.from !== null && current.from[0] === -dir[0] && current.from[1] === -dir[1])
	        continue;
	      visited.add(`${x},${y}`);
	      queue.push({ x, y, path: current.path.concat([[x, y]]), from: dir });
	    }
	  }
	  return null;
	}
	function printPath(mapdata, path) {
	  const map = mapdata.map((row) => row.map((cell) => " "));
	  path.forEach((point) => {
	    map[point[0]][point[1]] = "x";
	  });
	  map.forEach((row) => console.log(row.join("")));
	}
	Object.defineProperties(window, {
	  GenerateMap: { value: GenerateMap },
	  GenerateSpot: { value: GenerateSpot },
	  findPath: { value: findPath },
	  printPath: { value: printPath }
	});

	class Maps {
	  static get(type, mapId, ...args) {
	    const data = worldMap[mapId];
	    if (type == "pos") {
	      return data.spots.get(args[0])[0];
	    }
	    if (type == "spots") {
	      return data.spots.get(args[0]);
	    }
	    if (data[type]) {
	      return data[type];
	    }
	  }
	  static getBoard(mapId) {
	    const data = worldMap[mapId];
	    return mapdataToBoard(data.mapdata, data.mapsize.x, data.mapsize.y);
	  }
	  static convertData(mapdata) {
	    return boardToMapdata(mapdata);
	  }
	  static print(map) {
	    printMap(map);
	  }
	  constructor(name, type) {
	    this.name = name;
	    this.type = type;
	    this.tags = [];
	    this.description = function() {
	      return "";
	    };
	    this.events = function() {
	      return "";
	    };
	  }
	  Description(callback) {
	    this.description = callback;
	    return this;
	  }
	  Events(callback) {
	    this.events = callback;
	    return this;
	  }
	  Tags(...tags) {
	    this.tags = tags;
	    return this;
	  }
	  setPortal(...points) {
	    this.portal = {
	      exist: true,
	      points
	    };
	    return this;
	  }
	  addPortal(...points) {
	    this.portal.points.push(...points);
	    return this;
	  }
	  Gerenate() {
	    const rawdata = GenerateMap(this);
	    this.mapdata = boardToMapdata(rawdata);
	    return this;
	  }
	  Console() {
	    printMapFromData(this);
	  }
	}
	class townMap extends Maps {
	  constructor(mapid, groupid, name, entry, mapsizeX = 33, mapsizeY = 33) {
	    super(name, "town");
	    this.mapId = mapid;
	    this.groupId = groupid;
	    this.entry = entry;
	    this.spots = /* @__PURE__ */ new Map();
	    this.mapsize = { x: mapsizeX, y: mapsizeY };
	  }
	  Spots(...spots) {
	    spots.forEach((spot) => {
	      spot[1] += Math.floor(this.mapsize.x / 2);
	      spot[2] += Math.floor(this.mapsize.y / 2);
	      this.spots.set(spot[0], [{ x: spot[1], y: spot[2] }, spot[3]]);
	    });
	    return this;
	  }
	}
	class location extends Maps {
	  constructor(mapid, name, group, side) {
	    super(name, "location");
	    this.mapId = mapid;
	    this.groupId = group;
	    this.tags.push(side);
	  }
	  Rooms(...rooms) {
	    this.rooms = rooms;
	    return this;
	  }
	  Business(weekday, open, close) {
	    this.business = {
	      weekday,
	      open,
	      close
	    };
	    return this;
	  }
	  YourHome() {
	    this.yourHome = true;
	    return this;
	  }
	  Parking() {
	    this.hasParking = true;
	    return this;
	  }
	  Railcar() {
	    this.hasRailcar = true;
	    return this;
	  }
	  Airship() {
	    this.hasAirship = true;
	    return this;
	  }
	  Loot(loot) {
	    this.loot = loot;
	    return this;
	  }
	  Placement(...placement) {
	    this.placement = placement;
	    return this;
	  }
	  static countPlacement(placement) {
	    const objects = [];
	    placement.forEach((object) => {
	      objects.push(object[0]);
	    });
	    return Array.from(new Set(objects));
	  }
	}
	function boardToMapdata(mapData) {
	  var map = {};
	  for (var x = 0; x < mapData.length; x++) {
	    for (var y = 0; y < mapData[x].length; y++) {
	      if (mapData[x][y] != "") {
	        if (map[mapData[x][y]] == void 0) {
	          map[mapData[x][y]] = [];
	        }
	        map[mapData[x][y]].push([x, y]);
	      }
	    }
	  }
	  return map;
	}
	function mapdataToBoard(map, xsize, ysize) {
	  var mapData = [];
	  for (var i = 0; i < xsize; i++) {
	    mapData[i] = [];
	    for (var j = 0; j < ysize; j++) {
	      mapData[i][j] = "";
	    }
	  }
	  for (var key in map) {
	    map[key].forEach((value) => {
	      mapData[value[0]][value[1]] = key;
	    });
	  }
	  return mapData;
	}
	function printMap(map) {
	  const printmap = [];
	  for (let i = 0; i < map.length; i++) {
	    let line = "";
	    for (let j = 0; j < map[i].length; j++) {
	      if (map[i][j] === "" || map[i][j] === ".")
	        line += " ";
	      else if (map[i][j] === "road")
	        line += ".";
	      else
	        line += map[i][j][0];
	    }
	    printmap.push(line);
	  }
	  console.log(printmap.join("\n"));
	}
	function printMapFromData(map) {
	  const mapdata = mapdataToBoard(map, map.mapsize.x, map.mapsize.y);
	  printMap(mapdata);
	}
	Object.defineProperties(window, {
	  Maps: {
	    get() {
	      return Maps;
	    }
	  },
	  TownMap: {
	    get() {
	      return townMap;
	    }
	  },
	  Locations: {
	    get() {
	      return Location;
	    }
	  }
	});

	const worldMap$1 = {
	  Orlania: new townMap("Orlania", "", ["\u5965\u5170\u5C3C\u4E9A"], ["GateNorth", "GateSouth", "GateWest", "GateEast"], 35, 35),
	  MagicaAcademy: new townMap("MagicaAcademy", "Orlania", ["\u7B2C\u4E00\u9B54\u6CD5\u5B66\u9662"], ["SchoolGate"], 7, 25)
	};
	worldMap$1.Orlania.Spots(
	  ["OutskirtsNorth|field", -17, 0, "S"],
	  ["OutskirtsSouth|field", 17, 0, "N"],
	  ["OutskirtsWest|field", 0, -17, "E"],
	  ["OutskirtsEast|field", 0, 17, "W"],
	  ["GateNorth|passable", -15, 0, "S"],
	  ["GateSouth|passable", 15, 0, "N"],
	  ["GateWest|passable", 0, -15, "E"],
	  ["GateEast|passable", 0, 15, "W"],
	  ["TownCenter|passable", 0, 0, "SNWE"],
	  ["CenterSquare|passable", 2, 0, "SN"],
	  ["MagicaAcademy", -11, 8, "SW"],
	  ["Hospital", -9, 3, "W"],
	  ["ShopAlley|passable", 11, -4, "E"],
	  ["BathHouse", 9, -4, "EN"],
	  ["Aquarium", 12, 13, "N"],
	  ["ArtGallery", -8, 8, "WNS"],
	  ["Church", -12, 4, "E"],
	  ["BlackCat", -10, 8, "W"],
	  ["OperaHouse", -6, 11, "S"],
	  ["BairdTrading|passable", -4, -11, "SN"],
	  ["SliverChimes", -4, -8, "N"],
	  ["CentaurBar", -6, -8, "N"]
	);
	worldMap$1.MagicaAcademy.Spots(
	  ["MageTower", -3, -12, "S"],
	  ["SchoolEntrance|passable", 0, -12, "EN"],
	  ["ActivitySquare|passable", 0, -10, "SNWE"],
	  ["ClassBuildingR1|passable", 3, -8, "N"],
	  ["ClassBuildingR2|passable", -3, -8, "S"],
	  ["ResearchLabA", 2, -5, "WSN"],
	  ["ResearchLabB", -2, -5, "WSN"],
	  ["Library|passable", 2, -2, "SN"],
	  ["Arena|passable", -2, 1, "SNWE"],
	  ["HistoryMuseum", 2, 2, "N"],
	  ["DiningHall", 2, 10, "N"],
	  ["GreenGarden|passable", -2, -2, "SN"],
	  ["StudentCenter", -2, 7, "S"],
	  ["Dormitory", 0, 12, "W"]
	);
	Object.defineProperties(window, {
	  worldMap: { get: () => worldMap$1 }
	});
	worldMap$1.Orlania.mapdata = {
	  OutskirtsNorth: [[0, 17]],
	  road: [
	    [1, 17],
	    [3, 17],
	    [4, 17],
	    [5, 17],
	    [5, 22],
	    [6, 17],
	    [6, 18],
	    [6, 19],
	    [6, 20],
	    [6, 21],
	    [6, 22],
	    [6, 23],
	    [6, 24],
	    [7, 17],
	    [7, 24],
	    [8, 17],
	    [8, 24],
	    [8, 25],
	    [9, 17],
	    [9, 20],
	    [9, 21],
	    [9, 22],
	    [9, 23],
	    [9, 24],
	    [10, 10],
	    [10, 11],
	    [10, 12],
	    [10, 13],
	    [10, 14],
	    [10, 15],
	    [10, 16],
	    [10, 17],
	    [10, 18],
	    [10, 19],
	    [10, 20],
	    [10, 21],
	    [10, 24],
	    [10, 25],
	    [11, 10],
	    [11, 17],
	    [11, 25],
	    [12, 5],
	    [12, 6],
	    [12, 7],
	    [12, 9],
	    [12, 10],
	    [12, 17],
	    [12, 18],
	    [12, 19],
	    [12, 20],
	    [12, 21],
	    [12, 22],
	    [12, 23],
	    [12, 24],
	    [12, 25],
	    [12, 26],
	    [12, 27],
	    [12, 28],
	    [13, 5],
	    [13, 7],
	    [13, 10],
	    [13, 17],
	    [14, 5],
	    [14, 6],
	    [14, 7],
	    [14, 8],
	    [14, 9],
	    [14, 10],
	    [14, 11],
	    [14, 12],
	    [14, 13],
	    [14, 14],
	    [14, 15],
	    [14, 16],
	    [14, 17],
	    [15, 8],
	    [15, 17],
	    [16, 8],
	    [16, 16],
	    [16, 17],
	    [16, 18],
	    [17, 1],
	    [17, 3],
	    [17, 4],
	    [17, 5],
	    [17, 6],
	    [17, 7],
	    [17, 8],
	    [17, 9],
	    [17, 10],
	    [17, 11],
	    [17, 12],
	    [17, 13],
	    [17, 14],
	    [17, 15],
	    [17, 16],
	    [17, 18],
	    [17, 19],
	    [17, 20],
	    [17, 21],
	    [17, 22],
	    [17, 23],
	    [17, 24],
	    [17, 25],
	    [17, 26],
	    [17, 27],
	    [17, 28],
	    [17, 29],
	    [17, 30],
	    [17, 31],
	    [17, 33],
	    [18, 12],
	    [18, 16],
	    [18, 17],
	    [18, 18],
	    [18, 30],
	    [19, 12],
	    [19, 16],
	    [19, 18],
	    [19, 30],
	    [20, 12],
	    [20, 16],
	    [20, 17],
	    [20, 18],
	    [20, 30],
	    [21, 12],
	    [21, 17],
	    [21, 30],
	    [22, 12],
	    [22, 17],
	    [22, 30],
	    [23, 12],
	    [23, 17],
	    [23, 30],
	    [24, 12],
	    [24, 17],
	    [24, 30],
	    [25, 12],
	    [25, 17],
	    [25, 30],
	    [26, 12],
	    [26, 14],
	    [26, 17],
	    [26, 30],
	    [27, 12],
	    [27, 13],
	    [27, 14],
	    [27, 17],
	    [27, 30],
	    [28, 12],
	    [28, 14],
	    [28, 15],
	    [28, 16],
	    [28, 17],
	    [28, 18],
	    [28, 19],
	    [28, 20],
	    [28, 21],
	    [28, 22],
	    [28, 23],
	    [28, 24],
	    [28, 25],
	    [28, 26],
	    [28, 27],
	    [28, 28],
	    [28, 29],
	    [28, 30],
	    [29, 17],
	    [30, 17],
	    [31, 17],
	    [33, 17]
	  ],
	  GateNorth: [[2, 17]],
	  Church: [[5, 21]],
	  MagicaAcademy: [[6, 25]],
	  BlackCat: [[7, 25]],
	  Hospital: [[8, 20]],
	  ArtGallery: [[9, 25]],
	  CentaurBar: [[11, 9]],
	  OperaHouse: [[11, 28]],
	  BairdTrading: [[13, 6]],
	  SliverChimes: [[13, 9]],
	  OutskirtsWest: [[17, 0]],
	  GateWest: [[17, 2]],
	  TownCenter: [[17, 17]],
	  GateEast: [[17, 32]],
	  OutskirtsEast: [[17, 34]],
	  CenterSquare: [[19, 17]],
	  BathHouse: [[26, 13]],
	  ShopAlley: [[28, 13]],
	  Aquarium: [[29, 30]],
	  GateSouth: [[32, 17]],
	  OutskirtsSouth: [[34, 17]]
	};
	worldMap$1.MagicaAcademy.mapdata = {
	  MageTower: [[0, 0]],
	  "ClassBuildingR2|passable": [[0, 4]],
	  road: [
	    [0, 7],
	    [0, 8],
	    [0, 9],
	    [0, 10],
	    [0, 12],
	    [0, 13],
	    [0, 14],
	    [1, 0],
	    [1, 4],
	    [1, 5],
	    [1, 6],
	    [1, 12],
	    [1, 14],
	    [2, 0],
	    [2, 2],
	    [2, 3],
	    [2, 6],
	    [2, 7],
	    [2, 10],
	    [2, 12],
	    [2, 13],
	    [2, 14],
	    [2, 19],
	    [3, 1],
	    [3, 3],
	    [3, 4],
	    [3, 5],
	    [3, 6],
	    [3, 10],
	    [3, 13],
	    [3, 18],
	    [3, 19],
	    [3, 20],
	    [3, 21],
	    [3, 22],
	    [3, 23],
	    [4, 2],
	    [4, 3],
	    [4, 6],
	    [4, 7],
	    [4, 10],
	    [4, 11],
	    [4, 12],
	    [4, 13],
	    [4, 14],
	    [4, 15],
	    [4, 16],
	    [4, 17],
	    [4, 18],
	    [4, 22],
	    [5, 4],
	    [5, 5],
	    [5, 6],
	    [6, 7],
	    [6, 8],
	    [6, 9],
	    [6, 10]
	  ],
	  ResearchLabB: [[1, 7]],
	  "GreenGarden|passable": [[1, 10]],
	  "Arena|passable": [[1, 13]],
	  StudentCenter: [[1, 19]],
	  "SchoolEntrance|passable": [[3, 0]],
	  "ActivitySquare|passable": [[3, 2]],
	  Dormitory: [[3, 24]],
	  ResearchLabA: [[5, 7]],
	  "Library|passable": [[5, 10]],
	  HistoryMuseum: [[5, 14]],
	  DiningHall: [[5, 22]],
	  "ClassBuildingR1|passable": [[6, 4]]
	};
	new location("SchoolEntrance", ["\u5B66\u9662\u5165\u53E3"], "MagicaAcademy", "\u5BA4\u5916").Railcar().Tags("\u516C\u5171\u573A\u6240", "\u4EA4\u901A", "\u5149\u4EAE\u5904", "\u5F00\u9614").Placement("\u79FB\u52A8\u644A\u4F4D");

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
