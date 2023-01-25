//根据角色的动作状态，判断能否执行某些动作。
//例如对方被捆绑中时，可选体位根据捆绑姿势受限。
//:: Action_Pose_Option[script]
/* 正常位 */
Action.set("pose0").Filter(() => {
	return 1;
});

/* 背后位 */
Action.set("pose1").Filter(() => {
	return 1;
});

/* 正座位 */
Action.set("pose2").Filter(() => {
	return 1;
});

/* 背座位 */
Action.set("pose3").Filter(() => {
	return 1;
});

/* 骑乘位 */
Action.set("pose4").Filter(() => {
	return 1;
});

/* 侧卧位 */
Action.set("pose5").Filter(() => {
	return 1;
});

/* 趴卧位 */
Action.set("pose6").Filter(() => {
	return 1;
});

/* 站立位 */
Action.set("pose7").Filter(() => {
	return 1;
});

/* 背后立位 */
Action.set("pose8").Filter(() => {
	return 1;
});

/* 抱立位 */
Action.set("pose9").Filter(() => {
	//逆位时不可选
	if (T.select.id == "r1") return 0;

	return 1;
});

/* 反抱立位 */
Action.set("pose10").Filter(() => {
	//逆位时不可选
	if (T.select.id == "r1") return 0;

	return 1;
});

/* 屈曲位 */
Action.set("pose11").Filter(() => {
	//逆位时不可选
	if (T.select.id == "r1") return 0;

	return 1;
});
