F.summonChara = function () {
	const local = V.location;

	//根据时间和地点召唤可能存在的角色。
	//暂时只有两场景，迟些再整。
	if (local.id == "A0") {
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
	let change = "";

	if (V.location.chara.containsAll("Ayres", "Isil")) {
		let p, t;
		if (V.pc === "Isil" || V.pc === "m0") {
			p = "Ayres";
			t = "Isil";
		} else if (V.pc == "Ayres" && F.uncons(C["Isil"])) {
			p = "m0";
			t = "Isil";
		} else {
			p = "Isil";
			t = "Ayres";
		}

		let reflesh = "F.resetUI()";
		if (V.passage == "CommandLoop") reflesh = "F.resetScene()";

		change = `<<link '[ 切换角色 ]'>><<set $pc to '${p}'>><<set $tc to '${t}'>><<run ${reflesh};>><</link>>`;
	}

	if (Config.debug) console.log(change);

	return change;
};

//----->> 角色处理 <<---------------------------//

//角色事件处理。
F.charaEvent = function (cid) {
	if (cid === pc) return;

	const chara = C[cid];

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
			return F.txtFlow(`${Kojo.put(cid, { type: "Daily", id: "First" })}${setter}`);
		}
	}

	const cevent = Kojo.get(cid, "event");
	if (!cevent) return;

	cevent.forEach((obj) => {
		const title = `Kojo_${cid}_Event_${obj.name}`;

		if (Story.has(title) && obj.cond() && V.location.chara.includes(cid)) {
			F.setEvent("Kojo", `Event_${obj.name}`, cid);
			return new Wikifier(null, "<<goto EventStart>>");
		}
	});
};
