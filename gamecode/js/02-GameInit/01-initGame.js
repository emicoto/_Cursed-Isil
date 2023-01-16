F.initGame = function () {
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
	V.system = {
		alwaysShowPCName: false,
		showOrder: true,
		defaultPC: "Isil",
	};

	V.ui = {
		sidebarpalam: false,
		overlayer: "",
		currentlayer: "",
	};

	V.gametime = { s: 0, m: 0, h: 0, d: 0 };

	//-------->> 指令相关 <<-------------//
	S.comFilter = new Array(300).fill(0);
	V.currentFilter = "all";
	V.selectCom = 0;
	V.lastCom = 0;
	V.lastAct = {};

	//-------->> 游戏控制 <<------------//
	V.passtime = 0;
	V.gamePhase = 1;
	V.turn = 0;

	V.pricefactor = 2;

	V.mode = "event"; // 用于整体模式的控制

	V.flag = {
		activePC: "Isil/m0/",
		master: 0, // 触手开关
		mode: 0, // 交流深度。0=无对象，1=交流 2=允许肢体接触 3=允许轻度调教 4=允许性交 5=完全解禁。
	};

	V.weather = {
		current: "clear",
		next: [],
	};

	D.date = [4062, 3, 14];
	V.date = {
		year: 4062,
		month: 3,
		day: 14,
		time: 1120,
	};

	/* total=以4062-3-14 0:00为基准的绝对时间, 与Date()同理, 每月固定30天。*/
	/* wakeup time 转移到 cflag.wokeup, cflag.lastslept */
	V.time = {
		passed: 0,
		total: 1120,
	};
};
