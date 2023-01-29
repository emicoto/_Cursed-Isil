game.init = function () {
	//-------->> 记录类变量 <<-----------//
	S.dialog = {};
	S.history = [];

	V.memory = {};
	V.tips = {
		total: 0,
		record: [],
	};

	V.record = {}; //各种游戏记录
	V.archivement = {}; //达成成就
	V.IsilRecord = {}; //伊希露的各种行为记录
	V.AyresRecord = {}; //艾瑞斯的各种行为记录

	//-------->> 事件类变量 <<-----------//
	V.event = {
		type: "",
		eid: "",
		name: "",
		ch: "",
		ep: 0,
		phase: 0,
		sp: 0,
		lastId: 0,
		lastPhase: 0,
	};
	V.selectId = null;
	V.exit = "MainLoop";

	//-------->> 系统变量 <<-----------//
	V.system = S.SystemConfig;
	V.ui = {
		sidebarpalam: false,
		overlayer: "",
		currentlayer: "",
	};

	V.gametime = { s: 0, m: 0, h: 0, d: 0 };

	//-------->> 指令相关 <<-------------//
	S.comFilter = {};
	V.currentFilter = "all";
	V.selectCom = 0;
	V.lastCom = 0;
	V.lastAct = {};

	//-------->> 游戏控制 <<------------//
	V.gamePhase = 0;
	V.turn = 0;

	V.pricefactor = D.defaultPriceFactor;

	V.mode = S.defaultMode; // 用于整体模式的控制

	V.flag = {
		activePC: "Isil/m0/",
	};

	D.gameFlag.forEach((key) => {
		V.flag[key] = 0;
	});

	V.weather = {
		current: "clear",
		next: [],
	};

	V.date = {
		year: S.date[0],
		month: S.date[1],
		day: S.date[2],
		time: S.time,
		week: 1,
	};

	/* total=以4062-3-14 0:00为基准的绝对时间, 与Date()同理, 每月固定30天。*/
	/* wakeup time 转移到 cflag.wokeup, cflag.lastslept */
	V.time = {
		passed: 0,
		total: D.time,
	};

	V.home = {
		path: "Academy.Domitory.S303",
		name: ["宿舍S303"],
		room: ["Bathroom"],
		tags: ["私人", "宿舍"],
		placement: {
			S303: {
				max: 12,
				obj: [
					["床", "单人床"],
					["床", "单人床"],
					["衣柜", "小的木衣柜"],
					["衣柜", "小的木衣柜"],
					["桌子", "木书桌"],
					["桌子", "木书桌"],
					["椅子", "木椅"],
					["椅子", "木椅"],
					["书柜", "木书柜"],
					["镜子", "全身镜"],
					["衣架", "木衣架"],
					["植物", "小型盆栽"],
				],
			},
			Bathroom: {
				max: 5,
				obj: [
					["马桶", "陶瓷马桶"],
					["沐浴间", "莲蓬花洒"],
					["洗手盆", "洗手盆"],
				],
			},
		},
		storage: {},
	};

	V.lastLocation = null;

	//当前地点详情
	V.location = F.iniLocation("Academy.Dormitory.S303");
	V.location.chara = ["Isil", "Ayres"];

	F.initSquareData();
};

game.start = function (skip) {
	player.setNames();
	target.setNames();

	if (!skip) {
		F.setEvent("Story", "Opening");
	} else {
		F.setMemory("SE_0", "序章 - 故事开头");
		V.mode = "normal";
	}
	if (T.futa == 2) {
		for (let i in V.chara) {
			V.chara[i].gender = "inter";
			V.chara[i].initSexOrgan("v");
			if (V.chara[i].resetVirginity) {
				V.chara[i].resetVirginity();
			}
		}
	}

	if (T.lesCP) {
		V.chara["Isil"].gender = "female";
		V.chara["Isil"].initVirginity();
		delete V.chara["Isil"].sexstats.p;

		V.chara["Ayres"].gender = "female";
		V.chara["Ayres"].initVirginity();
		V.chara["Ayres"].resetVirginity();
		delete V.chara["Ayres"].sexstats.p;
	}

	if (T.newbie) {
		for (let i in V.chara) {
			V.chara[i].initExp().initVirginity();
		}
	}
};

F.initSquareData = function () {
	V.mapdata = {};
	let square;

	const initBoards = (path) => {
		const data = GameMap.get(path);
		for (const [key, values] of Object.entries(data)) {
			if (values instanceof Boards) {
				let id = values.id.split(".").pop();
				V.mapdata[id] = {};
				square = setByPath(V.mapdata, values.id);
				square.visited = 0;
				square.explore = 0;

				if (values.tags.has("上锁", "封闭", "异次元")) {
					square.locked = 1;
				}

				initBoards(values.id);
			}
			if (values instanceof Spots) {
				initSpots(values.id);
			}
		}
	};
	const initSpots = (path) => {
		const data = GameMap.get(path);
		for (const [key, values] of Object.entries(data)) {
			if (values instanceof Spots) {
				const spot = setByPath(V.mapdata, values.id);
				spot.visited = 0;
				spot.explore = 0;

				if (values.tags.has("上锁", "私人", "封闭", "异次元")) {
					spot.locked = 1;
				}

				initSpots(values.id);
			}
		}
	};

	for (const [boardkey, boards] of Object.entries(worldMap)) {
		if (boards instanceof Boards) {
			V.mapdata[boardkey] = {};
			initBoards(boards.id);
		}
	}
};
