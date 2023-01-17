createActionBton = function (currentSelect, outputData) {
	const html = `<<link 'name'>>
   <<run F.inputAction(id, type)>>
   <</link>>`;
};

checkSelectableParts = function (actionId, filterMode) {
	const { type, usePart, targetPart, option } = Acion.data[actionId];
	//检测是否存在可选部位，以及是否在Using占用中。
	const selectAbleParts = [];
	if (usePart && (!filterMode || filterMode == 1)) {
		usePart.forEach((part) => {
			if (Action.globalPartAble(actionId, part, pc)) selectAbleParts.push(part);
		});
	}

	if (targetPart && (!filterMode || filterMode == 2)) {
		targetPart.forEach((part) => {
			if (Action.globalPartAble(actionId, part, tc)) {
				selectAbleParts.push(part);
			}
		});
	}

	return selectAbleParts;
};

justHands = function (part) {
	return (part.containsAll("handL", "handR") && part.length == 2) || (part.has("handL", "handR") && part.length == 1);
};

getInputType = function (actionId, selection) {
	//判定指令属于什么类型。
	//体位直接返回pose。 接触、触手、逆位直接返回touchAction
	//其他看指令本身设定返回。
	//穿戴型道具返回useEquipsItems
	//有作用部位的道具和魔法、命令返回OptionalAction
};

inputAction = function (actionId, inputType, selection) {
	const { event, type, usePart, targetPart, option, name } = Action.data[actionId];

	//记录玩家的输入
	//如果为空，初始化。如果id与现在选择的动作不一致，也初始化。如果对象不是同一个角色，也初始化。
	if (!T.select || T.select.id !== actionId || T.select.tc !== tc) {
		T.select = {
			id: actionId,
			tc: tc,
		};
	}

	//一次性动作就立刻进入执行下一步。
	if (groupmatch(inputType, "oneAction", "event", "command", "useOneTimeItems")) {
		T.actId = actionId; //把动作id和动作对象记录到文本显示用的变量上。
		T.actTg = tc; //target chara

		if (event) {
			event();
			F.initCheckFlag();
			F.resetUI();
			return 0;
		}
	}

	if (groupmatch(inputType, "touchAction", "useEquipItems", "OptionalAction")) {
		//还不能立刻执行。先检查下有无可选项。
		//如果可选项目只有一个，就立刻执行。否则就等待输入部位选项。
		//如果数据设置有多个选项但全部都执行检测失败时，就会返回0。 动作档案内本来就没有可选项的话……压根不会传递到这个位置啊！！
		//如果左右手都空着，就默认用右手执行。
		let able1 = checkSelectableParts(actionId, 1)
		let able2 = checkSelectableParts(actionId, 2)
		
		const hasOption = ()=>{
			let actOption = (able1.length > 1 && !justHands(able1))
			let tarOption = (able2.length > 1 && !justHands(able2))
			let total = able1.length + able2.length
			
			if(able1.length <= 1 && able2.length <= 1) return 0
			return actOption || tarOption
		}
		
		if ( hasOption() ) {
			//需等待执行就返回，并刷新界面。
			F.initCheckFlag();
			F.resetUI();
			return 0
		}
		
		//自动选择部位。
		T.select.ap = able1[0]
		T.select.tp = able2[0]
		
	}

	if (inputType == "partsOption-actor") {
		//选择动作部位。如果目标部位只有一个，或者只有手，就在这个阶段执行。
		T.select.ap = selection; //记录输入的选择
		let able = checkSelectableParts(actionId, 2);
		if (able.length > 1 && !justHands(able)) {
			F.initCheckFlag();
			F.resetUI();
			return 0
		}
	}

	if (inputType == "partsOption-target") {
		//选择目标部位。如果存在体位选择，则等待下一个输入。
		T.select.tp = selection;
		const data = Action.data[T.select.id]
		if( groupmatch(data.name, '性交', '逆性交')){
			F.initCheckFlag();
			F.resetUI();
			return 0
		}
	}

	if (inputType == "pose") {
		//体位的筛选在召唤按钮时就完成了……
		//复位是任何时候都可以选的。
		if (event) {
			event();
			F.resetUI();
			return 0;
		}
		T.select.pos = selection;
	}

	//确定进入执行环节就将动作选择记录到T.action
	//执行判定时还是靠select(；￣д￣)。确认执行就清除select只保留action做剩余处理？姑且这样……
	T.action = {
		id: T.select.id,
		tc: T.select.tc, //target chara
		ap: T.select.ap,
		tp: T.select.tp,
		pos: T.select.pos,
	};

	F.checkAction(actionId, "do");
};
