/* 闲聊 */
Action.set("Talk").Check(() => {
	let rate = random(1, 100);
	return rate <= target.mood + 10 && cond.canSpeak(tc);
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

/* 借钱 */
Action.set("AskMoney")
	.Filter(() => {
		return pc == "Ayres" && player.wallet < 100 && target.flag.debt < 100;
	})
	.Check(() => {
		if (Cflag[tc].trust < 200) {
			T.reason += "【信任度不足】";
			return 0;
		}
		return 1;
	});

/* 还钱 */
Action.set("Payback").Filter(() => {
	return pc == "Ayres" && player.wallet > target.flag.debt;
});
