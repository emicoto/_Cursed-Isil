//:: Action_Pose_Option[script]
/* 正常位 */
Action.set("pose0")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 背后位 */
Action.set("pose1")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 正座位 */
Action.set("pose2")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 背座位 */
Action.set("pose3")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 骑乘位 */
Action.set("pose4")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 侧卧位 */
Action.set("pose5")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 趴卧位 */
Action.set("pose6")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 站立位 */
Action.set("pose7")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 背后立位 */
Action.set("pose8")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 抱立位 */
Action.set("pose9")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 反抱立位 */
Action.set("pose10")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 屈曲位 */
Action.set("pose11")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});
