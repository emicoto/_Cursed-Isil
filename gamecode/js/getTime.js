const weeks = ["暗", "光", "火", "水", "木", "雷", "土"];
const weekcolor = ["C770FF", "F9FEA8", "FF7447", "8FE1F9", "BFE83F", "E4FCFE", "E1C57A"];

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

F.season = function () {
	const select = new SelectCase();
	select.case([3, 5], '<span style="color:#FF84AF">春</span>');
	select.case([6, 8], '<span style="color:#84E7FF">夏</span>');
	select.case([9, 11], '<span style="color:#F0BE42">秋</span>');
	select.else('<span style="color:#D4DEE0">冬</span>');
	return select.has(V.date.month);
};

F.showtime = function () {
	const date = V.date;

	let timeString = `${F.season()} · ${date.month}/${date.day} (<span style='color:#${weekcolor[date.week]}'>${
		weeks[date.week]
	}</span>)`;
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

	return timeString + ` <span style='color:#eee'>[${timezone}]</span>`;
};

F.timePhase = function () {
	const h = Math.floor(V.date.time / 60);
	const select = new SelectCase();

	select.case([8, 10], 1).case([11, 13], 2).case([14, 16], 3).case([17, 19], 4).case([20, 22], 5).else(0);

	return select.has(h);
};
