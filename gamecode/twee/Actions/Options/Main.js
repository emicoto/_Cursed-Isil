/* 交流 */
Action.set("Interaction")
	.Filter(() => {
		if (pc === tc) return 0;
		return Flag.mode < 1;
	})
	.Event(() => {
		if (!Cflag[tc].touchLv) Cflag[tc].touchLv = 1;

		if (Flag.mode < 1) Flag.mode = 1;

		new Wikifier(null, `<<run P.flow(P.playerName()+'<<you>>和$target.name打了个招呼并走近对方。',30,1)>>`);
	});

/* 接触 */
//接触成功时Cflag的交流等级才会有变化。
Action.set("Touch")
	.Filter(() => {
		if (pc === tc) return 0;
		return Flag.mode < 2;
	})
	.Event(() => {
		if (Flag.mode < 2) Flag.mode = 2;
	});

/* 推倒 */
Action.set("TrySex")
	.Filter(() => {
		if (pc === tc) return 0;
		return 1;
	})
	.Check(() => {
		//debug模式以及推倒中随时可点。
		if (V.system.debug || V.mode == "train") return 1;

		//对方失去意识+没有其他人
		if (cond.isUncons(target) && V.location.chara.length <= 2) return 1;

		//暂且这样……之后导入TW的理性之壁和好感之壁进行判断(￣▽￣")
		if (Cflag[tc].favo < 1000) {
			T.reason += "【好感不足】";
			return 0;
		}

		return 1;
	})
	.Order(() => {
		return 100;
	})
	.Name(() => {
		if (V.mode == "train") {
			return "结束";
		}
		if (cond.isUncons(target)) {
			return "眠奸";
		}
		return "推倒";
	})
	.Effect(() => {
		if (Flag.mode < 3) Flag.mode = 3;

		if (V.mode !== "train") {
			V.mode = "train";
			Tsv[tc].woohoo = 1;
			Tsv[pc].woohoo = 1;
		} else {
			V.mode = "normal";
			for (let i in Tsv) {
				Tsv[i].woohoo = 0;
			}
		}
	});

/* 用手 */
Action.set("useHands")
	.Filter(() => {
		return 0;
	})
	.Event(() => {
		T.actPartFilter = ["handL", "handR"];
	});

/* 用口 */
Action.set("useMouth")
	.Filter(() => {
		return 0;
	})
	.Event(() => {
		T.actPartFilter = "mouth";
	});

/* 用阴茎 */
Action.set("usePenis")
	.Filter(() => {
		return 0; //player.gender !== 'female'
	})
	.Event(() => {
		T.actPartFilter = "penis";
	});

/* 用阴道 */
Action.set("useVagina")
	.Filter(() => {
		return 0; //player.gender !== 'male'
	})
	.Event(() => {
		T.actPartFilter = "vagina";
	});

/* 用肛门 */
Action.set("useAnal")
	.Filter(() => {
		return 0;
	})
	.Event(() => {
		T.actPartFilter = "anal";
	});

/* 用脚 */
Action.set("useFoot")
	.Filter(() => {
		return 0;
	})
	.Event(() => {
		T.actPartFilter = "foot";
	});

/* 保持动作 */
Action.set("Keep")
	.Filter(() => {
		return Flag.mode >= 2;
	})
	.Name(() => {
		if (T.keepAction) return "单发";
		else return "持续";
	})
	.Event(() => {
		if (!T.keepAction) T.keepAction = 1;
		else T.keepAction = 0;
	});

/* 自动配合 */
Action.set("Coop")
	.Filter(() => {
		return Flag.mode >= 2 && V.mode == "reverse";
	})
	.Check(() => {
		return 1;
	});

/* 自动抵抗 */
Action.set("Resit")
	.Filter(() => {
		return Flag.mode >= 2 && V.mode == "reverse";
	})
	.Check(() => {
		return 1;
	});

/* 战斗 */
Action.set("Combat").Filter(() => {
	return V.mode == "combat";
});

/* 魔法 */
Action.set("Magic").Filter(() => {
	return cond.canSpeak(player);
});

/* 道具 */
Action.set("Items").Filter(() => {
	return 1;
});

/* 触手 */
Action.set("Tentacles")
	.Filter(() => {
		return Flag.master;
	})
	.Event(() => {
		T.actionTypeFilter = "触手";
	});

/* 命令 */
Action.set("Order")
	.Filter(() => {
		return 1;
	})
	.Check(() => {
		return 1;
	})
	.Order(() => {
		return 0;
	});

/* 自慰 */
Action.set("Self")
	.Filter(() => {
		return (pc === tc && V.location.chara.length <= 1) || T.commandMode;
	})
	.Check(() => {
		return 1;
	});

/* 其他 */
Action.set("Other")
	.Filter(() => {
		return 1;
	})
	.Event(() => {
		T.actionTypeFilter = "其他";
	});
