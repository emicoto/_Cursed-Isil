/* 闲聊 */
Action.set("Talk").Check(() => {
	let rate = random(1, 100);
	return rate <= target.mood + 10 && F.canSpeak(target);
});

/* 观察 */
Action.set("Look")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 近况 */
Action.set("Talk2")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 兴趣 */
Action.set("Interest")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 摸头 */
Action.set("PetHead")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 调情 */
Action.set("Firm")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 送礼 */
Action.set("Gift")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});
