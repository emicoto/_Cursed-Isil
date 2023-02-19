F.summonChara = function () {
	const local = V.location;

	//根据时间和地点召唤可能存在的角色。
	//暂时只有两场景，迟些再整。
	if (local.mapId == "Academy.Dormitory.S303") {
		local.chara = ["Ayres", "Isil"];
	} else {
		const charalist = Object.keys(V.chara);

		charalist.delete("Ayres", "Isil", "m0");
		local.chara = charalist;
		local.chara.push(pc);
	}
};

//切换主控角色
F.switchChara = function () {
	//确认当前地点中是否存在可切换的角色。
	if (!V.location.chara.containsAll("Ayres", "Isil")) return "";
	//如果其中一人处于不可用状态，则不显示切换按钮。
	if (!Flag.Ayres || !Flag.Isil) return "";

	//如果当前地点中存在可切换的角色，则根据当前角色的状态和当前地点的情况，生成切换按钮。
	let charaA = pc,
		charaB;

	//如果当前角色时Ayres，且Isil处于可活动状态，则切换到Isil。反之亦然。
	if (pc == "Ayres" && C.Isil.active()) {
		charaB = "Isil";
	} else if (pc == "Isil" && C.Ayres.active()) {
		charaB = "Ayres";
	}

	let com = `<<set $pc to '${charaB}'>>`;

	let event = `if (
      Kojo.has('${charaB}', { type: 'Daily', id:'onSwitch' })
      ){
      P.flow(
         Kojo.put('${charaB}', { type: 'Daily', id: 'onSwitch'})
      )
   }`;

	if (pc !== tc && tc == charaB) {
		com += `<<set $tc to '${charaA}'>>`;
	}

	let html = `<<link '[ 切换角色 ]'>> ${com}<<run Action.redraw(); ${event}>><</link>`;

	if (game.debug) console.log(html);

	return html;
};
//----->> 角色处理 <<---------------------------//

//角色事件处理。
F.charaEvent = function (cid) {
	if (cid === pc) return;

	const chara = C[cid];

	//检测是否首次见面
	if (cid == tc && !Cflag[cid][`firstMet${pc}`]) {
		Cflag[cid][`firstMet${pc}`] = 1;

		if (Kojo.put(cid, { type: "Event", id: "First" })) {
			F.setEvent("Kojo", "Event_First", cid);
			return new Wikifier(null, "<<goto EventStart>>");
		}
	}

	//检测是否今天首次见面
	if (cid === tc && !Tsv[tc][`metToday${pc}`]) {
		let p2 = pc == "Isil" ? "Ayres" : "Isil";
		let setter = `<<set Tsv.${cid}.metToday${pc} to 1>>`;

		if (V.location.chara.has(p2) && !Tsv[tc][`metToday${p2}`]) {
			setter += `<<set Tsv.${cid}.metToday${p2} to 1>>`;
		}

		if (Kojo.has(cid, { type: "Daily", id: "First" })) {
			return P.flow(`${Kojo.put(cid, { type: "Daily", id: "First" })}${setter}`);
		}
	}

	//检测是否有角色事件
	const cevent = Kojo.get(cid, "event");
	if (!cevent) return;

	cevent.forEach((obj) => {
		const { id, cond } = obj;
		if (Kojo.has(cid, { type: "Event", id }) && cond()) {
			F.setEvent("Kojo", `Event_${id}`, cid);
			return new Wikifier(null, "<<goto EventStart>>");
		}
	});
};
