//:: Action_Command_Option[script]
/* 直播 */
Action.set("Stream")
	.Filter(() => {
		return 0;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 举行派对 */
Action.set("Party")
	.Filter(() => {
		return 0;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

//::Action_Other_Options[script];
/* 衣服管理 */
Action.set("Clothes")
	.Filter(() => {
		return (V.location.tags.has("衣柜", "私室") && pc == tc) || V.mode == "train";
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 行为管理 */
Action.set("Behavior")
	.Filter(() => {
		return V.mode == "train";
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 一键脱光 */
Action.set("GetNude")
	.Filter(() => {
		return V.mode == "train";
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});
