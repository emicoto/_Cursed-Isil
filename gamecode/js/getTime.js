const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

F.timeZone = function (h) {
	const select = new SelectCase();

	select
		.case([2, 4], "凌晨")
		.case([5, 7], "黎明")
		.case([8, 10], "上午")
		.case([11, 13], "中午")
		.case([14, 16], "下午")
		.case([17, 19], "傍晚")
		.case([20, 22], "晚上")
		.else("深夜");

	return select.has(h);
};

F.showtime = function () {
	const date = V.date;

	let timeString = `${date.year}年${date.month}月${date.day}日 ${weeks[date.week]}`;
	let hours = Math.floor(date.time / 60);
	let minutes = date.time % 60;
	let timezone = F.timeZone(hours);

	if (V.timemode === 12) {
		let ampm = "AM";
		if (hours >= 12) {
			ampm = "PM";
			hours -= 12;
		}
		if (hours === 0) {
			hours = 12;
		}
		timeString += ` ${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
	} else {
		timeString += ` ${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
	}

	return timeString + ` (${timezone})`;
};

F.timePhase = function () {
	const h = Math.floor(V.date.time / 60);
	const select = new SelectCase();

	select.case([8, 10], 1).case([11, 13], 2).case([14, 16], 3).case([17, 19], 4).case([20, 22], 5).else(0);

	return select.has(h);
};
