//:: Action_Event[script]
Action.set("reset")
	.Filter(() => {
		return T.actPart !== "reset";
	})
	.Event(() => {
		T.actPart = "reset";
	});

Action.set("resetAct")
	.Filter(() => {
		for (let i in Using.pc) {
			if (Using.pc[i].act) return 1;
		}

		for (let i in Using.tc) {
			if (Using.tc[i].act) return 1;
		}
		return 0;
	})
	.Effect(() => {
		F.initAction();
	});

Action.set("resetAll")
	.Filter(() => {
		return T.actionTypeFilter !== "all" || T.actPartFilter !== "all";
	})
	.Event(() => {
		T.actionTypeFilter = "all";
		T.actPartFilter = "all";
	});

Action.set("move").Filter(() => {
	return V.mode == "normal";
});

Action.set("fall")
	.Filter(() => {
		return !Flag.master;
	})
	.Event(() => {
		new Wikifier(null, `<<run p.flow(Story.get('FallToDeep').text, 60, 1)>>`);
	});

Action.set("sleep").Filter(() => {
	return V.location.id == "A0" && (V.date.time >= 1200 || cond.baseLt(player, "stamina", 0.5)) && pc !== "m0";
});

Action.set("rise")
	.Filter(() => {
		return Flag.master;
	})
	.Event(() => {
		Flag.master = 0;
		new Wikifier(null, `<<run p.flow(Story.get('RiseToSurface').text, 60, 1)>>`);
	});

Action.set("resetMode")
	.Filter(() => {
		return Flag.mode > 0 && !groupmatch(V.mode, "reverse", "combat");
	})
	.Event(() => {
		Flag.mode = 0;
		V.mode = "normal";
		new Wikifier(null, `<<run p.flow(p.playerName()+'<<you>>从$target.name身边走开了。',30,1)>>`);
	});

Action.set("stopTouch")
	.Filter(() => {
		return Flag.mode > 1 && !groupmatch(V.mode, "reverse", "combat");
	})
	.Event(() => {
		Flag.mode = 1;
		//new Wikifier(null, `<<run p.flow(p.playerName()+'<<you>>把手从$target.name身上挪开了。',30,1)>>`)
	});
