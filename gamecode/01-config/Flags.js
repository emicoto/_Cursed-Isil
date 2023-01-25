//保存到存档中的变量设置。

//系统变量设置。 GameInit的时候会批量注册到 $system下。
//左边是变量名，右边是默认值。
// D开头的都是数据表
// S开头的则是具体设置

S.SystemConfig = {
	alwaysShowPCName: 0,
	showOrder: 1,
	defaultPC: "Isil",
	showPCKojo: 1,
};

//游戏变量设置。GameInit的时候会批量注册到 $flag下。默认值为0。
D.gameFlag = [
	"mode",
	// 交流深度。0=无对象，1=交流 2=允许肢体接触 3=允许轻度调教 4=允许性交 5=完全解禁。

	"master",
	//触手开关

	"phase",
	//游戏进行阶段,

	"chapter",
	//当前剧情所处章节,

	"law",
	//秩序值，影响路线选择
	"chaos",
	//混沌值，影响路线选择

	"Isil",
	//Isil的可用状态，0=不可用，1=可用

	"Ayres",
	//Ayres的可用状态，0=不可用，1=可用
];

//角色类变量看modules的flags.js
