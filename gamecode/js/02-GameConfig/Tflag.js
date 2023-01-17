//不会被保存的临死变量。刷新页面就自动无了。
//都是即插即拔的变量。并不会批量生成。
//纯记录和检查有无冲突用。 为了方便就放这里了。

D.tflag = [
	"scarTimeMultip",

	"currentType", //actType
	"actPartFilter", // action part 过滤器

	"actor", //正在执行动作的人。
	"actTg", //action target的缩写。
	"actPart", // 进行动作的部位
	"selectpart", //选择的动作对象部位
	"actionDetail", // 确认执行时记录的动作详情
	"counterDetail", //counter详细会根据在场npc分别记录。

	"inside", // is Sex inside,
	"posId", // pose Id
	"actId", // 动作 id
	"msgId", // 信息 id

	"order",
	"reason",
	"orderMsg",
	"actAble",
	"orderGoal",
	"phase",
	"noNameTag",
	"aftermovement",
	"stopAct",
	"cancel",

	"force",

	"comPhase",
	"onselect",
	"selectwait",
	"noMsg",

	"earnMP",
	"selectcount",
	"passage",
	"title",

	"timeCheckNight",
	"timeCheckDay",

	//event mode
	"effect",
	"aftercheck",
	"exit",

	//classic command mode

	"comcount",
	"comCancel",
];
