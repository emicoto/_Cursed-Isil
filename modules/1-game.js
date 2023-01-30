;(function (fs) {
	'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

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
	  static newId(type, cate) {
	    const len = Db[type].length;
	    if (cate) {
	      return `${type.toUpperCase()[0]}${cate}_${len}`;
	    } else {
	      return `${type}_${len}`;
	    }
	  }
	  static new(name, des, type, cate = "") {
	    getByPath(Db, type + cate ? `.${cate}` : "");
	  }
	  constructor(name, des = name, type = "Items", cate = "") {
	    this.id = Item.newId(type, cate);
	    this.name = name;
	    this.des = des;
	    this.type = type;
	    this.category = cate;
	  }
	  Price(num) {
	    this.price = num;
	    return this;
	  }
	  Durable(num) {
	    this.durable = [num, num];
	    return this;
	  }
	  Shop(...shops) {
	    this.shop = shops;
	    return this;
	  }
	  Tags(...tags) {
	    this.tags = tags;
	    return this;
	  }
	  Stats(...stats) {
	    stats.forEach(([key, add]) => {
	      this.stats[key] = add;
	    });
	    return this;
	  }
	  Effect(...palam) {
	    palam.forEach(([key, t, a, m]) => {
	      this.effect[key] = { t, a, m };
	    });
	    return this;
	  }
	}
	class Clothes extends Item {
	  constructor(cate, name, des, gender2 = "n") {
	    super(name, des, "Clothes", cate);
	    this.gender = gender2;
	    this.uid = "0";
	    this.tags = [];
	    this.price = 0;
	    this.color = [];
	    this.cover = [];
	    this.expose = 3;
	    this.open = 3;
	    this.allure = 0;
	    this.defence = 0;
	  }
	  UID() {
	    this.uid = random(1e5, 999999).toString();
	    return this;
	  }
	  Color(colorcode, colorname) {
	    this.color = [colorcode, colorname];
	    return this;
	  }
	  Cover(...parts) {
	    this.cover = parts;
	    return this;
	  }
	  Set(key, value) {
	    this[key] = value;
	    return this;
	  }
	}
	Object.defineProperties(window, {
	  Item: { value: Item },
	  Clothes: { value: Clothes }
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

	const moveableTile = ["road", "glass", "field", "passable", "area"];
	const directions = [
	  [-1, 0],
	  [1, 0],
	  [0, -1],
	  [0, 1]
	];
	const directions2 = [
	  [-1, -1],
	  [-1, 1],
	  [1, -1],
	  [1, 1]
	];
	function GenerateSpot(map) {
	  const board = new Array(map.mapsize.x).fill(0).map(() => new Array(map.mapsize.y).fill(""));
	  console.log(board);
	  const spots = Array.from(map.spots);
	  spots.sort((a, b) => {
	    if (a[1].pos.x === b[1].pos.x) {
	      return a[1].pos.y - b[1].pos.y;
	    }
	    return a[1].pos.x - b[1].pos.x;
	  });
	  spots.forEach((loc) => {
	    const pos = loc[1].pos;
	    pos.forEach(({ x, y }) => {
	      board[x][y] = loc[0] + loc[1].tileType;
	    });
	  });
	  const road = [];
	  const setRoad = (x, y, s) => {
	    if (x < 0 || y < 0 || x >= map.mapsize.x || y >= map.mapsize.y)
	      return;
	    if (groupmatch(board[x][y], "", ".", "blank")) {
	      board[x][y] = "road";
	      road.push({ x, y, s });
	    }
	  };
	  spots.forEach((loc) => {
	    const pos = loc[1].pos;
	    const side = loc[1].dside;
	    pos.forEach(({ x, y }) => {
	      side.split("").forEach((s) => {
	        switch (s) {
	          case "W":
	          case "w":
	            setRoad(x, y - 1, "W");
	            break;
	          case "E":
	          case "e":
	            setRoad(x, y + 1, "E");
	            break;
	          case "S":
	          case "s":
	            setRoad(x + 1, y, "S");
	            break;
	          case "N":
	          case "n":
	            setRoad(x - 1, y, "N");
	            break;
	        }
	      });
	    });
	  });
	  return [board, road];
	}
	function AutoFillRoads(map) {
	  const spots = [];
	  for (let x = 0; x < map.length; x++) {
	    for (let y = 0; y < map[x].length; y++) {
	      if (!groupmatch(map[x][y], "", ".", "blank")) {
	        spots.push({ x, y });
	      }
	    }
	  }
	  for (let i = 0; i < spots.length; i++) {
	    const start = spots[i];
	    for (let j = i + 1; j < spots.length; j++) {
	      const goal = spots[j];
	      const path = createPath(map, start, goal);
	      if (!path)
	        continue;
	      path.forEach((p) => {
	        if (groupmatch(map[p[0]][p[1]], "", ".", "blank")) {
	          map[p[0]][p[1]] = "road";
	        }
	      });
	    }
	  }
	  clearExtraRoad(map);
	  clearUnconnectRoad(map);
	  printMap(map);
	  return map;
	}
	function GenerateMap(map) {
	  const maps = GenerateSpot(map);
	  const board = maps[0];
	  const road = maps[1];
	  for (let i = 0; i < road.length; i++) {
	    const start = road[i];
	    for (let j = i + 1; j < road.length; j++) {
	      const goal = road[j];
	      const path = createPath(board, start, goal, start.s);
	      if (!path)
	        continue;
	      path.forEach((p) => {
	        if (groupmatch(board[p[0]][p[1]], "", ".", "blank")) {
	          board[p[0]][p[1]] = "road";
	        }
	      });
	    }
	  }
	  clearExtraRoad(board);
	  clearUnconnectRoad(board);
	  printMap(board);
	  return board;
	}
	function clearExtraRoad(map) {
	  for (let x = 0; x < map.length; x++) {
	    for (let y = 0; y < map[x].length; y++) {
	      if (roadAroundRoads(x, y, map) >= 7) {
	        map[x][y] = "";
	      }
	    }
	  }
	}
	function Distance(start, goal) {
	  return Math.abs(start.x - start.x) + Math.abs(goal.y - goal.y);
	}
	function outOfMap(x, y, map) {
	  return x < 0 || y < 0 || x >= map.length || y >= map[x].length;
	}
	function roadAroundRoads(x, y, map) {
	  let count = 0, edge = 0;
	  const dir = directions.concat(directions2);
	  if (map[x][y] !== "road")
	    return 0;
	  dir.forEach((d) => {
	    if (outOfMap(x + d[0], y + d[1], map)) {
	      edge++;
	    } else if (map[x + d[0]][y + d[1]] === "road")
	      count++;
	  });
	  return count + edge;
	}
	function UnconnectRoad(x, y, map) {
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
	function createPath(mapdata, startPoint, goalPoint, side) {
	  const queue = [];
	  const visited = /* @__PURE__ */ new Set();
	  let dirs;
	  switch (side) {
	    case "N":
	      dirs = [
	        [0, -1],
	        [0, 1],
	        [1, 0]
	      ];
	    case "S":
	      dirs = [
	        [0, -1],
	        [0, 1],
	        [-1, 0]
	      ];
	    case "W":
	      dirs = [
	        [-1, 0],
	        [1, 0],
	        [0, 1]
	      ];
	    case "E":
	      dirs = [
	        [-1, 0],
	        [1, 0],
	        [0, -1]
	      ];
	    default:
	      dirs = directions;
	  }
	  queue.push({ x: startPoint.x, y: startPoint.y, path: [], from: null });
	  visited.add(startPoint);
	  while (queue.length > 0) {
	    const current = queue.shift();
	    if (current.x === goalPoint.x && current.y === goalPoint.y) {
	      return current.path;
	    }
	    for (const dir of dirs) {
	      const x = current.x + dir[0];
	      const y = current.y + dir[1];
	      if (x < 0 || y < 0 || x >= mapdata.length || y >= mapdata[0].length) {
	        continue;
	      }
	      if (mapdata[x][y].has("unpassable"))
	        continue;
	      if (!groupmatch(mapdata[x][y], "", ".", "blank", "road") && x != goalPoint.x && y != goalPoint.y)
	        continue;
	      if (roadAroundRoads(x, y, mapdata) > 2)
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
	Object.defineProperties(window, {
	  GenerateMap: { value: GenerateMap },
	  GenerateSpot: { value: GenerateSpot },
	  findPath: { value: findPath },
	  printPath: { value: printPath },
	  createPath: { value: createPath },
	  AutoFillRoads: { value: AutoFillRoads }
	});

	class GameMap {
	  constructor([boardId, id, name]) {
	    this.boardId = boardId;
	    this.id = boardId !== "" ? `${boardId}.${id}` : id;
	    this.name = name;
	    this.tags = [];
	    this.events = function() {
	      return "";
	    };
	  }
	  setName(name) {
	    this.name = name;
	    return this;
	  }
	  Events(callback) {
	    this.events = callback;
	    return this;
	  }
	  Tags(...tags) {
	    this.tags = this.tags.concat(tags);
	    this.tags = [...new Set(this.tags)];
	    return this;
	  }
	  getParentId() {
	    if (!this.boardId || this.boardId === this.id) {
	      return this.boardId;
	    }
	    const path = this.id.split(".");
	    path.pop();
	    return path.join(".");
	  }
	  getParent() {
	    if (!this.boardId || this.boardId === this.id) {
	      return null;
	    }
	    const id = this.getParentId();
	    return GameMap.get(id);
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
	  static get(mapId) {
	    let path = mapId.split(".");
	    let map = worldMap;
	    for (let i = 0; i < path.length; i++) {
	      try {
	        map = map[path[i]];
	      } catch (err) {
	        console.log("\u5730\u56FE\u8DEF\u5F84\u9519\u8BEF", mapId, path, err);
	        return null;
	      }
	    }
	    return map;
	  }
	  static getBy(type, mapdId, ...args) {
	    const data = this.get(mapdId);
	    if (!data)
	      return null;
	    if (type == "pos") {
	      return data.spots.get(args[0]).pos;
	    }
	    if (type == "spots") {
	      return data.spots.get(args[0]);
	    }
	    if (type == "rooms" && data.rooms) {
	      return data.rooms;
	    }
	    if (data[type]) {
	      return data[type];
	    }
	    console.log("\u5730\u56FE\u6570\u636E\u9519\u8BEF", type, mapdId, args);
	    return null;
	  }
	  static getParentGroup(type, boardId) {
	    if (!boardId)
	      return null;
	    let parent = worldMap;
	    let path = boardId.split(".");
	    let parentlist = [];
	    for (let i = 0; i < path.length; i++) {
	      try {
	        parent = parent[path[i]];
	        if (parent.mapType === type) {
	          parentlist.push(parent);
	        }
	      } catch (err) {
	        console.log("parent not found", path, i, path[i], err);
	      }
	    }
	    if (parentlist.length === 0 && boardId !== "CommonSpots") {
	      console.log("parent not found", path, type, boardId);
	      return null;
	    } else if (boardId === "CommonSpots") {
	      console.log("CommonSpots has no parent", boardId);
	      return null;
	    }
	    return parentlist[parentlist.length - 1];
	  }
	  static getBoard(mapId) {
	    const data = this.get(mapId);
	    if (!data) {
	      console.log("\u5730\u56FE\u4E0D\u5B58\u5728:", mapId);
	      return null;
	    }
	    if (data.mapType !== "board") {
	      console.log("\u5730\u56FE\u7C7B\u578B\u9519\u8BEF:", mapId);
	      return null;
	    }
	    if (!data.mapdata) {
	      console.log("\u5730\u56FE\u6570\u636E\u672A\u8BBE\u5B9A:", mapId);
	      return null;
	    }
	    return mapdataToBoard(data.mapdata, data.mapsize.x, data.mapsize.y);
	  }
	  static convertData(mapdata) {
	    return boardToMapdata(mapdata);
	  }
	  static console(map) {
	    printMap(map);
	  }
	  static copy(map, boardId, mapId) {
	    let newMap, parent;
	    if (map.mapType === "board") {
	      newMap = new Boards(boardId, mapId, { type: map.boardType }, map);
	      parent = this.getParentGroup("board", boardId);
	    }
	    if (map.mapType === "spot" || map.mapType === "room") {
	      newMap = new Spots([boardId, mapId, map.name, map.spotType], map);
	      parent = this.getParentGroup("spot", boardId);
	    }
	    if (parent) {
	      newMap.boardId = parent.boardId;
	      newMap.spotId = parent.id;
	    } else {
	      newMap.boardId = boardId;
	    }
	    newMap.id = boardId + "." + mapId;
	    return newMap;
	  }
	}
	class Boards extends GameMap {
	  constructor(mapdId, boardId, {
	    type,
	    name,
	    entry,
	    main,
	    xy
	  }, map) {
	    super([boardId, mapdId, name]);
	    if (map) {
	      for (let key in map) {
	        this[key] = clone(map[key]);
	      }
	    } else {
	      if (!xy[0])
	        xy[0] = 13;
	      if (!xy[1])
	        xy[1] = xy[0];
	      this.mapType = "board";
	      this.boardType = type;
	      if (Array.isArray(entry)) {
	        this.entries = entry;
	        this.staticEntry = main || entry[0];
	      } else {
	        this.staticEntry = entry;
	        this.entries = [entry];
	      }
	      this.mapsize = { x: xy[0], y: xy[1] };
	      this.spots = /* @__PURE__ */ new Map();
	    }
	  }
	  Spots(...spots) {
	    spots.forEach((spot) => {
	      let x = spot[1] += Math.floor(this.mapsize.x / 2);
	      let y = spot[2] += Math.floor(this.mapsize.y / 2);
	      let info = spot[0].split("|"), tileType2;
	      if (info.length > 1) {
	        tileType2 = info.slice(1).join("|");
	      } else {
	        tileType2 = "spot";
	      }
	      let name = info[0];
	      let dside = spot[3];
	      let spotType2 = spot[4].join("|");
	      this.spots.set(name, { pos: [{ x, y }], dside, spotType: spotType2, tileType: tileType2 });
	    });
	    return this;
	  }
	  initBoard() {
	    this.mapdata = new Array(this.mapsize.x).fill(0).map(() => new Array(this.mapsize.y).fill(0).map(() => ""));
	    this.spots.forEach((spot, name) => {
	      let pos = spot.pos[0];
	      this.mapdata[pos.x][pos.y] = name;
	    });
	    return this;
	  }
	  Generate() {
	    const rawdata = GenerateMap(this);
	    this.mapdata = boardToMapdata(rawdata);
	    return this;
	  }
	  console() {
	    printMapFromData(this);
	  }
	}
	class Spots extends GameMap {
	  constructor([boardId, mapId, name, type], map) {
	    let parent, id = boardId + "." + mapId;
	    if (type.has("room")) {
	      parent = GameMap.getParentGroup("spot", boardId);
	      if (parent == null ? void 0 : parent.spotType)
	        type = parent.spotType + "|" + type;
	      boardId = (parent == null ? void 0 : parent.boardId) || boardId;
	    } else {
	      parent = GameMap.getParentGroup("board", boardId);
	    }
	    super([boardId, mapId, name]);
	    if (map) {
	      for (let key in map) {
	        this[key] = clone(map[key]);
	      }
	    } else {
	      this.boardId = boardId;
	      this.mapType = "spot";
	      this.spotType = type;
	      this.spotId = mapId;
	      this.placement = [];
	      this.tags = [];
	      if (type.has("room")) {
	        this.roomId = mapId.split(".").pop();
	        this.spotId = (parent == null ? void 0 : parent.id) || mapId;
	        this.id = id;
	        this.mapType = "room";
	      }
	      this.init();
	    }
	  }
	  init() {
	    const types = this.spotType.split("|");
	    const typeTags = {
	      building: ["\u5BA4\u5185"],
	      buildingEntry: ["\u5BA4\u5916"],
	      gate: ["\u5BA4\u5916", "\u68C0\u67E5\u70B9"],
	      mapEntry: ["\u5730\u56FE\u63A5\u53E3"],
	      transport: ["\u5BA4\u5916", "\u4EA4\u901A"],
	      portal: ["\u5BA4\u5916"],
	      shopAlley: ["\u5546\u5E97\u8857", "\u5BA4\u5916"],
	      park: ["\u5BA4\u5916", "\u4F11\u606F\u533A"],
	      field: ["\u5F00\u9614", "\u5BA4\u5916"],
	      float: ["\u5BA4\u5916", "\u60AC\u6D6E", "\u5F00\u9614"],
	      private: ["\u79C1\u4EBA", "\u4E0A\u9501"],
	      room: ["\u5BA4\u5185"],
	      secretArea: ["\u9690\u853D", "\u5C01\u95ED"],
	      ground: ["\u5BA4\u5916", "\u5F00\u9614", "\u6D3B\u52A8"],
	      house: ["\u5BA4\u5185", "\u4E2A\u4EBA", "\u4F11\u606F\u533A"]
	    };
	    types.forEach((type) => {
	      if (typeTags[type]) {
	        this.tags.push(...typeTags[type]);
	      }
	    });
	    const parent = GameMap.getParentGroup("board", this.boardId);
	    if (parent == null ? void 0 : parent.boardType) {
	      switch (parent.boardType) {
	        case "forest":
	          if (this.tags.has("\u5BA4\u5916")) {
	            this.tags.push("\u68EE\u6797");
	          }
	          break;
	        case "ocean":
	          if (this.tags.has("\u5BA4\u5916")) {
	            this.tags.push("\u6C34\u4E0B");
	          }
	          break;
	        case "mountain":
	          if (this.tags.has("\u5BA4\u5916")) {
	            this.tags.push("\u5C71\u5CB3");
	          }
	          break;
	        case "dungeon":
	          this.tags.push("\u5730\u4E0B");
	          break;
	        case "maze":
	          this.tags.push("\u5F02\u7A7A\u95F4");
	          break;
	        case "floatingIsland":
	        case "field":
	          if (this.tags.has("\u5BA4\u5916")) {
	            this.tags.push("\u5F00\u9614");
	          }
	          break;
	        case "academy":
	          if (!this.tags.has("\u5F02\u7A7A\u95F4")) {
	            this.tags.push("\u9B54\u7F51");
	          }
	      }
	    }
	    this.tags = [...new Set(this.tags)];
	    return this;
	  }
	  Rooms(...rooms) {
	    this.rooms = rooms;
	    return this;
	  }
	  OpenHour(weekday, open, close) {
	    this.openhour = {
	      weekday,
	      open,
	      close
	    };
	    return this;
	  }
	  isHome() {
	    this.Home = true;
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
	  addLoot(loot) {
	    for (const key in loot) {
	      if (!this.loot[key]) {
	        this.loot[key] = [];
	      }
	      this.loot[key].push(...loot[key]);
	      this.loot[key] = [...new Set(this.loot[key])];
	    }
	    return this;
	  }
	  Placement(...placement) {
	    this.placement = this.placement.concat(placement);
	    this.placement = [...new Set(this.placement)];
	    return this;
	  }
	  AdoptParent() {
	    const parent = this.getParent();
	    if (parent) {
	      this.tags = this.tags.concat(parent.tags);
	      this.placement = this.placement.concat(parent.placement);
	    }
	    return this;
	  }
	  AdoptLoot() {
	    const parent = this.getParent();
	    if (parent) {
	      this.addLoot(parent.loot);
	    }
	    return this;
	  }
	  MaxSlots(number) {
	    this.maxslot = number;
	    return this;
	  }
	  Visitable(callback) {
	    this.visitCond = callback;
	    return this;
	  }
	  setOwner(...owner) {
	    this.owner = owner;
	    return this;
	  }
	  Rentable(cost) {
	    this.rent = cost;
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
	  printMap: { value: printMap },
	  printMapFromData: { value: printMapFromData },
	  GameMap: { value: GameMap },
	  Boards: { value: Boards },
	  Spots: { value: Spots }
	});

	function setCommon(id) {
	  switch (id) {
	    case "PublicToilet":
	      CM[id].Tags("\u5395\u6240", "\u65E0\u7A97", "\u72ED\u7A84", "\u516C\u5171").Placement("\u6D17\u624B\u53F0", "\u955C\u5B50", "\u9A6C\u6876");
	      break;
	    case "Storage":
	      CM[id].Tags("\u72ED\u7A84", "\u9690\u853D", "\u65E0\u7A97", "\u4E0A\u9501").Placement("\u50A8\u7269\u67DC", "\u5DE5\u5177\u7BB1").Loot({
	        C: ["\u9489\u5B50", "\u5E9F\u6728\u6599", "\u7EB8\u5F20"],
	        UC: ["\u6BDB\u5DFE", "\u676F\u5B50", "\u91D1\u5C5E\u96F6\u4EF6"],
	        R: ["\u7528\u8FC7\u7684\u5957\u5957", "\u6728\u67F4", "\u9524\u5B50", "\u526A\u5200"],
	        SR: ["\u5185\u88E4", "\u80F8\u7F69", "\u94DC\u5E01"],
	        UR: ["\u94A5\u5319", "\u94F6\u5E01", "\u7EF3\u7D22"],
	        LR: ["\u94B1\u5305"]
	      });
	      break;
	    case "Bathroom":
	      CM[id].Tags("\u6C90\u6D74", "\u5395\u6240", "\u65E0\u7A97").Placement("\u6D74\u7F38", "\u6D17\u624B\u53F0", "\u955C\u5B50");
	      break;
	    case "Kitchen":
	      CM[id].Tags("\u53A8\u623F").Placement("\u7089\u7076", "\u53A8\u5177", "\u6D17\u624B\u53F0", "\u50A8\u7269\u67DC", "\u51B0\u7BB1");
	      break;
	    case "Restroom":
	      CM[id].Tags("\u5395\u6240", "\u65E0\u7A97", "\u9690\u853D").Placement("\u6D17\u624B\u53F0", "\u955C\u5B50");
	  }
	}
	function setAcademy(id) {
	  switch (id) {
	    case "MageTower":
	      FMA[id].Rooms("Inside", "Observatory", "Storage").Tags("\u9AD8\u53F0", "\u60AC\u6D6E", "\u9632\u5FA1").Placement("\u9632\u5FA1\u70AE\u53F0");
	      break;
	    case "SchoolEntrance":
	      FMA[id].Tags("\u4EA4\u901A").Placement("\u79FB\u52A8\u644A\u4F4D").Parking().Railcar();
	      break;
	    case "ActivitySquare":
	      FMA[id].Rooms("Storage").Tags("\u821E\u53F0", "\u4F11\u606F\u533A").Placement("\u65D7\u5E1C", "\u957F\u6905");
	      break;
	    case "ClassBuildingR1":
	      FMA[id].Rooms("C101", "C102", "PublicToilet");
	    case "ClassBuildingR2":
	      if (id === "ClassBuildingR2") {
	        FMA[id].Rooms("C201", "C202", "PublicToilet");
	      }
	      FMA[id].Placement("\u50A8\u7269\u67DC", "\u957F\u6905", "\u81EA\u52A8\u8D29\u552E\u673A", "\u9B54\u5076", "\u76C6\u683D");
	      break;
	    case "ResearchLabA":
	      FMA[id].Rooms("MagiPysics", "Analyzing", "Storage", "Restroom");
	    case "ResearchLabB":
	      if (id === "ResearchLabB") {
	        FMA[id].Rooms("Alchemy", "Biologic", "MagiPotion", "Storage", "Restroom");
	      }
	      FMA[id].Tags("\u7814\u7A76", "\u5BBD\u655E").Placement("\u4E66\u67B6", "\u684C\u5B50", "\u6905\u5B50", "\u50A8\u7269\u67DC", "\u7814\u7A76\u53F0", "\u7535\u8111", "\u5080\u5121\u5145\u80FD\u5668");
	      break;
	    case "Library":
	      FMA[id].Tags("\u5BBD\u655E", "\u9605\u8BFB\u533A", "\u4F11\u606F\u533A").Placement("\u4E66\u67B6", "\u684C\u5B50", "\u6905\u5B50", "\u7535\u8111");
	      break;
	    case "Arena":
	      FMA[id].Tags("\u6218\u6597\u533A", "\u666F\u70B9").Placement("\u65D7\u5E1C", "\u957F\u6905", "\u64C2\u53F0", "\u96D5\u5851");
	      break;
	    case "HistoryMuseum":
	      FMA[id].Tags("\u4F11\u606F\u533A", "\u666F\u70B9").Placement("\u5C55\u793A\u67DC", "\u957F\u6905");
	      break;
	    case "DiningHall":
	      FMA[id].Tags("\u4F11\u606F\u533A", "\u9910\u5385", "\u5BBD\u655E").Placement("\u6905\u5B50", "\u684C\u5B50", "\u81EA\u52A8\u8D29\u552E\u673A", "\u81EA\u52A9\u67DC\u53F0", "\u5080\u5121\u5145\u80FD\u5668");
	      break;
	    case "GreenGarden":
	      FMA[id].Rooms("GreenHouse", "Storage").Tags("\u666F\u70B9", "\u79CD\u690D\u533A", "\u5BBD\u655E").Placement("\u7EFF\u690D", "\u957F\u6905", "\u519C\u52A1\u8BBE\u5907");
	      break;
	    case "StudentCenter":
	      FMA[id].Tags("\u533B\u52A1").Placement("\u6905\u5B50", "\u6C99\u53D1", "\u667A\u80FD\u6C34\u6676", "\u9B54\u5076", "\u533B\u7597\u8BBE\u5907");
	      break;
	    case "Dormitory":
	      FMA[id].Rooms("Kitchen", "Storage", "A101", "A102", "A103", "A201", "A202", "A203", "S303").Tags("\u4F11\u606F\u533A", "\u5BBD\u655E").Placement("\u6C99\u53D1", "\u684C\u5B50", "\u6905\u5B50", "\u76C6\u683D", "\u5080\u5121\u5145\u80FD\u5668", "\u51B0\u7BB1");
	      break;
	    case "SecretTrainingGround":
	      FMA[id].Tags("\u5F02\u7A7A\u95F4").Placement("\u4F20\u9001\u95E8", "\u8BAD\u7EC3\u5668\u6750").setPortal("Academy.MageTower.Hall");
	      break;
	  }
	}
	function setAcademyRoom(id, roomid) {
	  switch (id) {
	    case "MageTower":
	      if (roomid == "Inside") {
	        FMA[id][roomid].Tags("\u4E0A\u9501", "\u65E0\u7A97").Placement("\u4E66\u67B6", "\u684C\u5B50", "\u6C99\u53D1", "\u9B54\u6CD5\u9635", "\u4F20\u9001\u95E8").setPortal("Orlania.OutskirtE", "Academy.SecretTrainingGround");
	      }
	      if (roomid == "Observatory") {
	        FMA[id][roomid].Tags("\u4E0A\u9501", "\u9AD8\u53F0", "\u9690\u853D", "\u5F00\u653E", "\u5F00\u9614");
	      }
	      if (roomid == "Storage") {
	        FMA[id][roomid].Tags("\u4E0A\u9501").addLoot({ SR: ["\u66FC\u9640\u7F57\u8349\u5E72"], UR: ["\u9B54\u6CD5\u5377\u8F74(\u7A7A)", "\u7B26\u77F3"], LR: ["\u5C0F\u578B\u9B54\u529B\u6C34\u6676"] });
	      }
	    case "ClassBuildingR1":
	    case "ClassBuildingR2":
	      if (FMA[id][roomid].name[0].includes("\u6559\u5BA4")) {
	        FMA[id][roomid].Tags("\u6559\u5BA4", "\u5BBD\u655E").Placement("\u684C\u5B50", "\u6905\u5B50", "\u4E66\u67B6", "\u50A8\u7269\u67DC", "\u76C6\u683D", "\u6559\u575B", "\u9ED1\u677F");
	      }
	      break;
	    case "Dormitory":
	      if (FMA[id][roomid].name[0].includes("\u5BBF\u820D")) {
	        FMA[id][roomid].Rooms("Bathroom").Tags("\u5BBF\u820D", "\u7761\u623F").Placement("\u5E8A", "\u684C\u5B50", "\u6905\u5B50", "\u4E66\u684C", "\u8863\u67DC", "\u4E66\u67B6").MaxSlots(12);
	        FMA[id][roomid].Bathroom = GameMap.copy(worldMap$1.CommonSpots["Bathroom"], FMA[id][roomid].id, "Bathroom");
	      }
	      if (roomid == "Kitchen") {
	        FMA[id][roomid].MaxSlots(16).Placement("\u6905\u5B50");
	      }
	      break;
	    case "GreenHouse":
	      if (roomid == "GreenHouse") {
	        FMA[id][roomid].AdoptParent();
	      }
	      break;
	  }
	  if (groupmatch(roomid, "MagiPysics", "Analyzing", "Alchemy", "Biologic", "MagiPotion")) {
	    FMA[id][roomid].Tags("\u4E2A\u4EBA").AdoptParent();
	  }
	  switch (roomid) {
	    case "MagiPysics":
	      FMA[id][roomid].Placement("\u5927\u578B\u9B54\u529B\u6C34\u6676", "\u7B26\u6587\u96D5\u523B\u4EEA\u5668", "\u8BB0\u5F55\u6C34\u6676", "\u7269\u8D28\u89C2\u6D4B\u4EEA", "\u6C99\u53D1");
	      break;
	    case "Analyzing":
	      FMA[id][roomid].Placement("\u9B54\u529B\u63A2\u6D4B\u4EEA", "\u5206\u89E3\u8BBE\u5907", "\u5206\u6790\u6C34\u6676", "\u6C99\u53D1", "\u5E8A");
	      break;
	    case "Alchemy":
	      FMA[id][roomid].Placement("\u70BC\u91D1\u8BBE\u5907", "\u7194\u7089", "\u50A8\u7269\u67DC", "\u4FDD\u9669\u67DC", "\u70E4\u7BB1");
	      break;
	    case "Biologic":
	      FMA[id][roomid].Placement("\u57F9\u517B\u69FD", "\u51B0\u7BB1", "\u9B54\u836F\u50A8\u5B58\u67DC", "\u5B75\u5316\u5668");
	      break;
	    case "MagiPotion":
	      FMA[id][roomid].Placement("\u9B54\u836F\u70BC\u5236\u53F0", "\u79CD\u690D\u67B6", "\u51B0\u7BB1", "\u9B54\u836F\u50A8\u5B58\u67DC");
	      break;
	  }
	}

	const worldMap$1 = {
	  Orlania: new Boards("Orlania", "", {
	    type: "town",
	    name: ["\u5965\u5170\u5C3C\u4E9A"],
	    entry: ["Orlania.GateN", "Orlania.GateS", "Orlania.GateW", "Orlania.GateE"],
	    xy: [35, 35]
	  }),
	  Academy: new Boards("Academy", "Orlania", {
	    type: "academy",
	    name: ["\u5965\u5170\u5C3C\u4E9A\u7B2C\u4E00\u9B54\u6CD5\u5B66\u9662"],
	    entry: "Academy.SchoolEntrance",
	    xy: [7, 25]
	  }),
	  CommonSpots: {
	    groupId: "CommonSpots"
	  }
	};
	Object.defineProperties(window, {
	  worldMap: { get: () => worldMap$1 }
	});
	console.log(window.worldMap);
	worldMap$1.Orlania["Academy"] = worldMap$1.Academy;
	worldMap$1.Orlania.Spots(
	  ["OutskirtN|field", -17, 0, "S", ["field", "mapEntry"]],
	  ["OutskirtS|field", 17, 0, "N", ["field", "mapEntry"]],
	  ["OutskirtW|field", 0, -17, "E", ["field", "mapEntry"]],
	  ["OutskirtE|field", 0, 17, "W", ["field", "mapEntry"]],
	  ["GateN|passable", -15, 0, "S", ["gate"]],
	  ["GateS|passable", 15, 0, "N", ["gate"]],
	  ["GateW|passable", 0, -15, "E", ["gate"]],
	  ["GateE|passable", 0, 15, "W", ["gate"]],
	  ["TownCenter|passable", 0, 0, "SNWE", ["buildingEntry"]],
	  ["CenterSquare|passable", 2, 0, "SN", ["ground"]],
	  ["Academy", -11, 8, "SW", ["buildingEntry", "mapEntry"]],
	  ["Hospital", -9, 3, "W", ["building"]],
	  ["ShopAlley|passable", 11, -4, "E", ["shopAlley", "mapEntry"]],
	  ["BathHouse", 9, -4, "EN", ["building"]],
	  ["Aquarium", 12, 13, "N", ["buildingEntry"]],
	  ["ArtGallery", -8, 8, "WNS", ["building"]],
	  ["Church", -12, 4, "E", ["buildingEntry"]],
	  ["BlackCat", -9, 8, "W", ["building"]],
	  ["OperaHouse", -6, 11, "S", ["building"]],
	  ["BairdTrading|passable", -4, -11, "SN", ["ground"]],
	  ["SliverChimes", -4, -8, "N", ["building"]],
	  ["CentaurBar", -6, -8, "N", ["building"]]
	);
	worldMap$1.Academy.Spots(
	  ["MageTower", -3, -12, "S", ["buildingEntry"]],
	  ["SchoolEntrance|passable", 0, -12, "EN", ["mapEntry", "gate"]],
	  ["ActivitySquare|passable", 0, -10, "SNWE", ["ground"]],
	  ["ClassBuildingR1|passable", 3, -8, "N", ["building"]],
	  ["ClassBuildingR2|passable", -3, -8, "S", ["building"]],
	  ["ResearchLabA", 2, -5, "WSN", ["building"]],
	  ["ResearchLabB", -2, -5, "ESN", ["building"]],
	  ["Library|passable", 2, -2, "SN", ["building"]],
	  ["Arena|passable", -2, 1, "SNWE", ["ground", "float"]],
	  ["HistoryMuseum", 2, 2, "N", ["building"]],
	  ["DiningHall", 2, 10, "N", ["building"]],
	  ["GreenGarden|passable", -2, -2, "SN", ["park"]],
	  ["StudentCenter", -2, 7, "S", ["building"]],
	  ["Dormitory", 0, 12, "W", ["building"]],
	  ["SecretTrainingGround|invisible", 3, 12, "", ["secretArea"]]
	);
	const OL = worldMap$1.Orlania;
	const FMA = worldMap$1.Academy;
	const CM = worldMap$1.CommonSpots;
	const CMConfig = [
	  ["RailcarStation", "\u8F68\u9053\u8F66\u7AD9", "stransport"],
	  ["AirShipPort", "\u98DE\u8239\u6E2F\u53E3", "transport"],
	  ["PublicToilet", "\u516C\u5171\u5395\u6240", "room"],
	  ["Storage", "\u50A8\u7269\u95F4", "room"],
	  ["Bathroom", "\u6D74\u5BA4", "room"],
	  ["Kitchen", "\u53A8\u623F", "room"],
	  ["Restroom", "\u5395\u6240", "room"]
	];
	CMConfig.forEach((config) => {
	  let id = config[0], name = [config[1], id], type = "common|" + config[2];
	  CM[id] = new Spots(["CommonSpots", id, name, type]);
	  setCommon(id);
	});
	const OLConfig = [
	  "\u57CE\u90CA(\u5317)",
	  "\u57CE\u90CA(\u5357)",
	  "\u57CE\u90CA(\u897F)",
	  "\u57CE\u90CA(\u4E1C)",
	  "\u57CE\u95E8(\u5317)",
	  "\u57CE\u95E8(\u5357)",
	  "\u57CE\u95E8(\u897F)",
	  "\u57CE\u95E8(\u4E1C)",
	  "\u57CE\u9547\u4E2D\u5FC3",
	  "\u4E2D\u5FC3\u5E7F\u573A",
	  "\u9B54\u6CD5\u5B66\u9662",
	  "\u533B\u9662",
	  "\u5546\u5E97\u8857",
	  "\u5927\u6D74\u573A",
	  "\u6C34\u65CF\u9986",
	  "\u827A\u672F\u9986",
	  "\u5143\u7075\u6559\u5802",
	  "\u9ED1\u732B\u5496\u5561",
	  "\u7EEF\u9E1F\u5267\u573A",
	  "\u767E\u5FB7\u5546\u4F1A",
	  "\u94F6\u94C3\u9910\u9986",
	  "\u725B\u9A6C\u9152\u5427"
	];
	Array.from(worldMap$1.Orlania.spots).forEach((spot, i) => {
	  const id = spot[0];
	  const name = OLConfig[i];
	  if (worldMap$1.Orlania[id] === void 0)
	    OL[id] = new Spots(["Orlania", id, [name, id], spot[1].spotType]);
	});
	const A0Config = [
	  "\u6CD5\u5E08\u5854",
	  "\u9B54\u6CD5\u5B66\u9662|\u5165\u53E3",
	  "\u9B54\u6CD5\u5B66\u9662|\u5E7F\u573A",
	  "\u6559\u5B66\u697C|R1",
	  "\u6559\u5B66\u697C|R2",
	  "\u9B54\u6CD5\u7814\u7A76\u6240",
	  "\u7EFC\u5408\u7814\u7A76\u6240",
	  "\u56FE\u4E66\u9986",
	  "\u7ADE\u6280\u573A",
	  "\u535A\u7269\u9986",
	  "\u5B66\u751F\u996D\u5802",
	  "\u690D\u7269\u56ED",
	  "\u5B66\u751F\u4E2D\u5FC3",
	  "\u5BBF\u820D|\u5927\u5385",
	  "\u79D8\u5BC6\u8BAD\u7EC3\u573A"
	];
	Array.from(worldMap$1.Academy.spots).forEach((spot, i) => {
	  const id = spot[0];
	  const name = A0Config[i];
	  if (worldMap$1.Academy[id] === void 0)
	    FMA[id] = new Spots(["Academy", id, [name, id], spot[1].spotType]);
	  setAcademy(id);
	});
	const hasroom = Object.values(FMA).filter((spot) => {
	  var _a;
	  return (_a = spot.rooms) == null ? void 0 : _a.length;
	});
	const roomName = {
	  GreenHouse: "\u6E29\u5BA4",
	  Inside: "\u6CD5\u5E08\u5854|\u5185\u90E8",
	  Observatory: "\u89C2\u6D4B\u53F0",
	  MagiPysics: "\u9B54\u6CD5\u5B9E\u9A8C\u5BA4",
	  Analyzing: "\u9B54\u6CD5\u5206\u6790\u5BA4",
	  Alchemy: "\u70BC\u91D1\u5B9E\u9A8C\u5BA4",
	  Biologic: "\u751F\u7269\u5B9E\u9A8C\u5BA4",
	  MagiPotion: "\u9B54\u836F\u5B9E\u9A8C\u5BA4"
	};
	hasroom.forEach((spot) => {
	  let id = spot.id.split(".").pop();
	  spot.rooms.forEach((room) => {
	    if (worldMap$1.CommonSpots[room]) {
	      FMA[id][room] = GameMap.copy(worldMap$1.CommonSpots[room], spot.id, room);
	    } else if (roomName[room]) {
	      FMA[id][room] = new Spots([spot.id, room, [roomName[room], room], "room"]);
	    } else {
	      switch (id) {
	        case "ClassBuildingR1":
	        case "ClassBuildingR2":
	          FMA[id][room] = new Spots([spot.id, room, ["\u6559\u5BA4|" + room, "Classroom|" + room], "room"]);
	          break;
	        case "Dormitory":
	          FMA[id][room] = new Spots([spot.id, room, ["\u5BBF\u820D|" + room, "Dormitory|" + room], "room"]);
	          break;
	      }
	    }
	    setAcademyRoom(id, room);
	  });
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
	console.log("utils loaded, the game is", window.game);
	console.log("package.json", fs__default["default"].readFileSync("./package.json", "utf8"));
	console.log("config.json", fs__default["default"].readFileSync("./public/config.json", "utf8"));
	$.getJSON("./config.json", function(data) {
	  window.config = data;
	  console.log("load config", data);
	});

})(fs);
