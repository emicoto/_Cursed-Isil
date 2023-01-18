window.initCSV = function (cid) {
	const raw = Story.get(`CharaSheet_${cid}`).text.split("\n");
	const chara = {};

	console.log(raw);

	for (let i = 0; i < raw.length; i++) {
		const line = raw[i];
		if (!line.length || line[0] == "/")
			//总之先把空行喝注释行去掉。
			continue;
		//提取表格
		const arr = line.replace(/\s/g, "").split(",");

		//总之先初始化路径
		let path;
		if (arr[0].includes(".")) {
			path = arr[0].split(".");
		} else {
			path = [arr[0]];
		}

		const times = raw.split(path[0]).length;
		if (times > 1 && !chara[path[0]]) chara[path[0]] = [];
		else if (!chaa[path[0]]) chara[path[0]] = {};

		if (path.length == 3 && !chara[path[0]][path[1]]) chara[path[0]][path[1]] = {};

		if (path.length == 1 && times > 1) chara[path[0]] = chara[path[0]].push(arr[1]);
      else if(path.length == 1) chara[path[0]] = arr[1]
      
		if (path.length == 2) chara[path[0]][path[1]] = arr[1];
		if (path.length == 3) chara[path[0]][path[1]][path[2]] = arr[1];
	}

	console.log(chara);
};
