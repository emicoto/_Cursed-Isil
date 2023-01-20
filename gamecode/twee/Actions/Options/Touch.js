//:: Action_Touch_Option[script]

/* 接吻 */
Action.set("t0")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 亲吻 */
Action.set("t1")
	//过滤器自带可选部位的判断
	.Filter((part) => {
		switch (part) {
			case "breast":
			case "foot":
			case "butts":
			case "thighs":
			case "abdomen":
				if (!Tsv[tc].nude) return 0;
			default:
				return 1;
		}
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 抚摸 */
Action.set("t2")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 揉捏 */
Action.set("t3")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 吸舔 */
Action.set("t4")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 吸咬 */
Action.set("t5")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 逗弄 */
Action.set("t6")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 指交 */
Action.set("t7")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 性交 */
Action.set("t8")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 抽插 */
Action.set("t9")
	.Filter(() => {
		return T.inside;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 撸动 */
Action.set("t10")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 拳交 */
Action.set("t11")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 深入 */
Action.set("t12")
	.Filter(() => {
		return T.inside;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 口交 */
Action.set("t13")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});
