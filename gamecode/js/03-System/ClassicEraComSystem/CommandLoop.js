//----->> 初始化 <<---------------------------//

//刷新指令目录
Com.updateMenu = function () {
	const list = [[V.location.id == "A0", "下沉", "Basement", ""]];
	let menu = [];
	list.forEach((a) => {
		if (a[0]) menu.push(`<<link '[ ${a[1]} ]' '${a[2]}'>>${a[3]}<</link>>`);
	});

	const html = `<span class='filter'>Filter: ${Com.filters()}</span>　｜　${menu.join("")}`;

	new Wikifier(null, `<<replace #commandmenu>>${html}<</replace>>`);
};

//刷新界面
Com.resetScene = function () {
	V.target = C[tc];
	V.player = C[pc];
	Com.updateScene();
	Com.initList();
	Com.updateMenu();
	return "";
};
DefineMacroS("resetScene", Com.resetScene);

//刷新场景
Com.updateScene = function () {
	const chara = [];
	let html = "";
	let change = F.switchChara();

	if (V.location.chara.length) {
		V.location.chara.forEach((k) => {
			let com = `<<set $tc to '${k}'>><<run F.charaEvent('${k}'); Com.resetScene()>>`;

			let t = `<u><<link '${C[k].name}'>>${com}<</link>></u>　`;

			if (pc !== k) {
				if (tc == k) t = `<span style='color:#76FAF4'><${C[k].name}></span>　`;
				//console.log(k, C[k].name, t)
			} else {
				let name = C[k].name;
				if (tc == k) name = `< ${C[k].name} >　`;
				t = `<span style='color:#AAA'>${name}</span>　`;
			}

			chara.push(t);
		});
	}

	html = `主控　<span style='color:#fff000'>${player.name}</span> ${change}　|　所在位置　${V.location.name}　|　`;
	if (chara.length) html += "" + chara.join("") + "<br>";

	//后面加场景描述。从Db读取场景数据。角色选项也会移到场景描述后。
	//这里是……。 有 谁 、谁 、谁 在这里。
	//选择角色后会有文字补充在信息流后。 “你将目光移向谁。“

	new Wikifier(null, `<<replace #location>>${html}<</replace>>`);
};

//----->> 主要进程处理 <<---------------------------//

//下一步
Com.next = function () {
	//用于刷新content_message区域的文本。
	if (T.msgId < S.msg.length && S.msg[T.msgId].has("<<selection", "<<linkreplace") && !T.selectwait) {
		S.msg[T.msgId] += "<<unset _selectwait>><<set _onselect to 1>>";
		T.selectwait = 1;
	}

	if (T.comPhase == "before" && T.msgId >= S.msg.length && !T.onselect && !T.selectwait) {
		Com.Event(V.selectCom, 1);
	} else {
		if (T.msgId < S.msg.length && !T.onselect) {
			p.flow(S.msg[T.msgId]);
			T.msgId++;
		}
	}
};

//执行检测
Com.Check = function (id) {
	const com = comdata[id];

	T.comorder = 0;
	T.reason = "";
	T.order = "";
	T.orderGoal = Com.globalOrder(id) + com.order();
	T.comAble = Com.globalCond(id) && com.cond();
	T.msgId = 0;

	//如果对方无反抗之力，目标值强行变零。
	if (cond.isUncons(target) || !cond.canMove(target)) T.orderGoal = 0;

	T.comPhase = "before";
	let txt = "";

	let t, c;

	//角色每次执行COM时的个人检测。
	//如果口上侧要进行阻止某个指令进行，也会在这里打断。
	if (Story.has(`Kojo_${tc}_Com`)) {
		new Wikifier("#hidden", Story.get(`Kojo_${tc}_Com`).text);
	}

	//指令执行时暂时去掉指令栏
	Com.hide();
	Com.shownext();

	if (V.system.showOrder && T.order) {
		p.msg(`配合度检测：${T.order}＝${T.comorder}/${T.orderGoal}<br><<dashline>>`);
	}

	//执行before事件。这些都是纯文本。只能有选项相关操作。
	//先执行通用的 before事件。基本用在场景变化中。
	p.msg(`${Story.get("Command::Before").text}<<run Com.next()>><<dashline>>`);

	//指令专属的before事件
	let type = "Com",
		dif = "Before";
	if (Kojo.has(pc, { type, id, dif, check: 1 })) {
		txt = Kojo.put(pc, { type, id, dif });
		p.msg(txt);
		c = 1;
	}

	//执行口上侧Before事件。
	if (Kojo.has(tc, { type, id, dif })) {
		txt = Kojo.put(tc, { type, id, dif });
		p.msg(txt);
		c = 1;
	}

	//检测是否存在com.before(), 存在就在这里执行。
	if (com?.before) com.before();

	if (!Story.has(`Com_${id}`)) {
		p.flow("缺乏事件文本", 30, 1);
		Com.resetScene();
	}
	//存在待执行文本就直接出现Next按钮。
	else if (c) {
		Com.shownext();
		Com.next();
	} else {
		Com.Event(id);
	}
};

//执行事件
Com.Event = function (id, next) {
	const com = comdata[id];
	const resetHtml = `<<run Com.reset()>><<dashline>>`;
	let txt = "",
		type = "Com";
	S.msg = [];
	T.msgId = 0;
	T.comPhase = "event";

	//总之先清除多余链接
	$("#contentMsg a").remove();

	if (T.comCancel) {
		p.msg(resetHtml);
	} else if (com.name == "移动") {
		//移动直接跳转到移动界面
		p.msg(Story.get(`Com_G0`).text);
	}
	//确认主控有能力执行
	else if (T.comAble) {
		//确认对象愿意配合执行
		if (
			T.orderGoal === 0 ||
			V.system.debug ||
			(T.orderGoal > 0 && T.comorder >= T.orderGoal) ||
			(com?.forceAble && T.comorder + S.ignoreOrder >= T.orderGoal)
		) {
			T.passtime = com.time;

			if (T.comorder < T.orderGoal && !V.system.debug) {
				S.msg.push(
					`配合度不足：${T.order}＝${T.comorder}/${T.orderGoal}<br>${
						com?.forceAble ? "<<run Com.next()>>" : ""
					}<br>`
				);

				if (Kojo.has(pc, { type, id, dif: "Force", check: 1 })) {
					txt = Kojo.put(pc, { type, id, dif: "Force" });
				}
				if (txt.includes("Kojo.put") === false && Kojo.has(tc, { type, id, dif: "Force" })) {
					txt += Kojo.put(tc, { type, id, dif: "Force" });
				}

				T.force = true;
			} else {
				txt = Kojo.put(pc, { type, id });

				if (txt.includes("Kojo.put") === false && Kojo.has(tc, { type, id })) {
					txt += Kojo.put(tc, { type, id });
				}
			}

			if (txt.includes("Kojo.put")) txt = F.convertKojo(txt);

			p.msg(txt);

			p.msg(`<<run comdata['${id}'].source(); F.passtime(T.passtime); Com.After()>>`, 1);

			//确认After事件。如果有就添加到 Msg中。
			if (Kojo.has(pc, { type, id, dif: "After", check: 1 })) {
				txt = `<br><<set _comPhase to 'after'>>` + Kojo.put(pc, { type, id, dif: "After" });
				if (txt.includes("Kojo.put")) txt = F.convertKojo(txt);
				p.msg(txt);
			}

			if (txt.includes("Kojo.put") === false && Kojo.has(tc, { type, id, dif: "After" })) {
				p.msg(Kojo.put(tc, { type, id, dif: "After" }));
			}

			//最后加ComEnd()
			p.msg("<<run Com.endEvent()>>", 1);
		} else {
			p.msg(`配合度不足：${T.order}＝${T.comorder}/${T.orderGoal}<br><<run F.passtime(1); >>`);
			p.msg(resetHtml, 1);
		}
	}
	//取消执行
	else {
		if (Kojo.has(pc, { type, id, dif: "Cancel", check: 1 })) {
			txt = Kojo.put(pc, { type, id, dif: "Cancel" });
			p.msg(txt);
		} else
			p.msg(
				`》条件不足无法执行指令：${typeof com.name === "function" ? com.name() : com.name}<br>原因：${T.reason}<br>`
			);

		p.msg("<<run F.passtime(1)>>", 1);
		p.msg(resetHtml, 1);
	}

	Com.shownext();
	Com.next();
};

//高潮、射精、刻印获得、素质变动事件的处理
//数据处理已经打包扔 timeprocess中了。
Com.After = function () {
	let text = "";
	return text;
};

//事件结束时的处理
Com.endEvent = function () {
	T.comPhase = "end";
	const resetHtml = `<<run Com.reset()>><<dashline>>`;

	let text = "";

	p.msg(resetHtml);
	Com.next();
};
