F.initKojoEditor = function () {
	const data = Object.values(Action.data).filter((action) => !groupmatch(action.type, "常规", "目录", "其他", "固有"));
	const list = data.map((action) => action.id + "|" + action.name);
	T.templetOption = list;
	const condlist = {
		无条件: "",
		"基础值低于 n": 'Cond.baseLt( cid, "baseName", n ) == true',
		"基础值比例为 n%": 'Cond.baseIs( cid, "baseName" ) == n',
		"状态值低于 n": 'Cond.palamLt( cid, "palamName", n ) == true',
		"Cflag值低于 n": 'Cond.flagLt( cid, "flagName", n ) == true',
		"好感度低于 n": "Cond.favorLt( cid, n ) == true",
		"信赖度低于 n": "Cond.trustLt( cid, n ) == true",
		"依赖度低于 n": "Cond.dependLt( cid, n ) == true",
		是处女: "Cond.isVirgin( cid ) == true",
		是童贞: "Cond.isCockVirgin( cid ) == true",
		能说话: "Cond.caSpeak( cid ) == true ",
		可行动的: "Cond.canMove( cid ) == true",
		有思考能力: "Cond.canActNormal( cid ) == true",
		正在睡觉: "Cond.isSleeping( cid ) == true",
		无意识: "Cond.isUncons( cid ) == true",
		可互动的: "Cond.isActive( cid ) == true",
		被强奸中: "Cond.isRape( cid ) == true",
		有抵抗能力: "Cond.canResist( cid ) == true",
		A比B弱: 'Cond.isWeaker( cid, "charaB" ) == true',
		精力充沛: "Cond.isEnergetic( cid ) == true",
		已堕落: "Cond.isFallen( cid ) == true",
		只有你们两人在场: "Cond.OnlyU2() == true",
		有丁: "Cond.hasPenis( cid ) == true",
		有批: "Cond.hasVagina( cid ) == true",
		时间介于a和b之间: "Cond.betweenTime( a, b ) == true",
		"刻印等级为 n": 'Cond.markLv( cid, "markName" ) == true',
	};
	T.condOption = condlist;
	T.baseNamelist = [];
	let i = 0;
	for (const [key, val] of Object.entries(D.base)) {
		T.baseNamelist[i] = `${key}|${val}`;
		i++;
	}
	T.palamNamelist = [];
	i = 0;
	for (const [key, val] of Object.entries(D.palam)) {
		T.palamNamelist[i] = `${key}|${val}`;
		i++;
	}
	T.flagNamelist = D.cflag;
	T.markNamelist = [];
	i = 0;
	for (const [key, val] of Object.entries(D.mark)) {
		T.markNamelist[i] = `${key}|${val[0]}`;
		i++;
	}
	const eventList = [
		"Daily|First|每日第一次见面",
		"Daily|Location|在不同地点首次接触时",
		"Daily|Dinner|约饭",
		"Daily|Plant|一起种植",
		"Daily|Walk|一起散步",
		"Daily|Gathering|一起采集",
		"Daily|Fishing|一起钓鱼",
		"Daily|Reading|一起阅读",
		"Daily|Homework|一起写论文",
		"Daily|Intro|场景中与玩家打招呼时",
		"Daily|GoodBye|场景中与玩家告别时",
		"Event|First|初次登场",
		"Event|FirstParty|初次组队",
		"Event|FirstDungeon|初次探索遗迹",
		"GetMark|Hypnosis|获得催眠刻印",
		"GetMark|Ecstacy|获得快乐刻印",
		"GetMark|Pain|获得痛苦刻印",
		"GetMark|Surrender|获得屈服刻印",
		"GetMark|Fear|获得恐惧刻印",
		"GetMark|Humiliation|获得耻辱刻印",
		"GetMark|Mortify|获得羞耻刻印",
		"GetMark|Resistance|获得抵抗刻印",
		"LoseMark|Resistance|失去抵抗刻印",
		"LoseMark|Hypnosis|失去催眠刻印",
	];
	T.eventOption = eventList;
	T.npcId = "NPCID";
};

F.getEventTemplet = function () {
	let info = T.eventID.split("|");
	let id = info[1];
	let type = info[0];
	let txt = `:: Kojo_${$("#input-npcid").val()}_${type}_${id}\n`;

	if (type == "Event") {
		txt =
			`:: Kojo_${$("#input-npcid").val()}_${id}::Before\n
        <<set $evnt.id = "CE_1">>/* 设置事件id。数字可自行更换。 */\n<<run F.setMemory("CE_1", "事件回想标题", "${$(
				"#input-npcid"
			).val()}")/* 登记回想 */\n\n` + txt;
	}

	if (type.includes("Mark")) {
		txt += `<<switch Tsv["${$("#input-npcid").val()}"].${
			type.includes("Get") ? "get" : "lose"
		}${id}>>\n<<case 1>>\n到达1级时\n<<case 2>>\n<<case 3>>\n`;
		txt += `<</` + "switch>>\n";
	}

	$("#kojotext").val(txt);
};

F.makeSelectionEvent = function () {
	const insertTxt = `\n\n#:{ "type":"selectEnd" }\n<<eventSelect>>\n<<select '分支选项1'>>\n<<set $event.sp = 1>>\n<<select '分支选项2'>>\n<<set $event.sp = 2>>\n<</eventSelect>>\n\n\n :: Kojo_${$(
		"#input-npcid"
	).val()}_Event_${
		T.eventID.split("|")[1]
	}:s1\n<<set Cflag['NPCID'].any = 1>>  /* 这个区域可以进行flag或数值操作。any替换成任意变量名。回想模式时能回避数值或flag变动。 */\n\n :: Kojo_${$(
		"#input-npcid"
	).val()}_Event_${
		T.eventID.split("|")[1]
	}:s2\n<<set Cflag['NPCID'].any = 2>>  /* 这个区域可以进行flag或数值操作。any替换成任意变量名。回想模式时能回避数值或flag变动。 */\n\n:: Kojo_${$(
		"#input-npcid"
	).val()}_Event_${
		T.eventID.split("|")[1]
	}:sp1\n 选了分支A后显示的文本。\n\n#:{ "type":"endPhase", ep:1 }\n最后一段记得加上'endPhase'的设置。并指定下一个章节。\n\n:: Kojo_${$(
		"#input-npcid"
	).val()}_Event_${
		T.eventID.split("|")[1]
	}:sp2\n 选了分支B后显示的文本。\n\n#:{ "type":"endPhase", ep:1 }\n最后一段记得加上'endPhase'的设置。并指定下一个章节。\n\n`;

	F.insertTxt(insertTxt);
};

F.loadCharaKojoFile = function () {
	let txt = fs.readFileSync(`./_workspace/gamecode/Kojo/${T.npcId}/${T.file}.twee`, "utf8");
	$("#kojotext").val(txt);
};

F.saveCharaKojoFile = function () {
	let txt = $("#kojotext").val();
	fs.writeFileSync(`./_workspace/gamecode/Kojo/${T.npcId}/${T.file}.twee`, txt, "utf8");
};

F.npcIdOnChange = async function () {
	let html = `角色ID: <input id='input-npcid' type='text' @value='_npcId'>`;
	const id = $("#input-npcid").val();
	let txt = $("#kojotext").val();
	let match = txt.match(/Kojo_(\S+)_/);
	if (match) {
		txt = txt.replace(match[1], id);
	}
	if (T.npcId !== id) T.npcId = id;

	$("#kojotext").val(txt);

	if (fs) console.log("has fs");
	else console.log("fs not found");

	if (fs && Kojo.get(T.npcId)) {
		//遍历角色对应的文件夹。
		let files = await fs.readdirSync(`./_workspace/gamecode/Kojo/${T.npcId}`);
		T.fileList = [];
		let i = 0;
		for (const file of files) {
			if (file.includes("twee")) T.fileList[i] = file.split(".")[0];
			i++;
		}

		html += ` 文件列表：<<listbox '_file'>><<optionsfrom _fileList>><</listbox>> <<button '读取文件'>><<run F.loadCharaKojoFile()>><</button>> <<button '保存文件'>><<run F.saveCharaKojoFile()>><</button>>`;

		new Wikifier(null, `<<replace #charaId>>${html}<</replace>>`);
	}
};

F.insertSwitch = function () {
	const insert = `\n<<switch Cflag["${$(
		"#input-npcid"
	).val()}"].flagname >>\n<<case "差分A">>\n差分A显示的文本。\n<<case "差分B">>\n差分B显示的文本。<</switch>>`;

	//获取当前输入光标位置，插入文本
	F.insertTxt(insert);
};

F.insertRandomTxt = function () {
	const insert = `\n<<=either([\n    "随机文本A。",\n    "随机文本B。",\n    "随机文本C。",\n])>>`;

	//获取当前输入光标位置，插入文本
	F.insertTxt(insert);
};

F.insertSelection = function () {
	const insert = `\n<<selection replace>>\n<<pick "选项A">>\n选择A之后显示的文本。\n<<pick "选项B">>\n选择B之后显示的文本。\n<</selection>>`;

	//获取当前输入光标位置，插入文本
	F.insertTxt(insert);
};

F.insertTxt = function (insert) {
	//获取当前输入光标位置，插入文本
	let cursorPos = $("#kojotext").prop("selectionStart");
	let v = $("#kojotext").val();
	let textBefore = v.substring(0, cursorPos);
	let textAfter = v.substring(cursorPos, v.length);
	$("#kojotext").val(textBefore + insert + textAfter);
};

//检测用户的输入，如果连续按两次回车，则自动插入<br>
F.checkEnter = function () {
	if (T.lastEnter === true) {
		F.insertBR();
		T.lastEnter = false;
	} else {
		F.insertTxt("\n");
		T.lastEnter = true;
	}
};

F.insertBR = function () {
	let cursorPos = $("#kojotext").prop("selectionStart");
	let v = $("#kojotext").val();
	let textBefore = v.substring(0, cursorPos);
	let textAfter = v.substring(cursorPos, v.length);

	//先删除最后一个换行符
	textBefore = textBefore.replace(/\n$/, "");
	//再插入br
	$("#kojotext").val(textBefore + "<br>\n" + textAfter);
	//光标的位置也要挪一下，跟在br后面
	$("#kojotext").prop("selectionEnd", cursorPos + 3);
};
