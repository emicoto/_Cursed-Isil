window.confirmNewmap = function () {
	T.mapsizeX = parseInt(T.mapsizeX);
	T.mapsizeY = parseInt(T.mapsizeY);

	if (T.mapsizeX < 5 || T.mapsizeY < 5) {
		alert("地图尺寸必须大于等于5");
	} else if (T.mapsizeX > 42 || T.mapsizeY > 42) {
		alert("地图尺寸必须小于42");
	} else {
		if (T.mapsizeX % 2 === 0) {
			T.mapsizeX += 1;
		}
		if (T.mapsizeY % 2 === 0) {
			T.mapsizeY += 1;
		}
		T.mapdata = newMap(T.mapsizeX, T.mapsizeY);
		generateMapField(T.mapdata);
		console.log(T.mapdata);
	}
};

window.newMap = function (x, y) {
	const grid = [];
	for (let i = 0; i < x; i++) {
		grid[i] = [];
		for (let j = 0; j < y; j++) {
			grid[i][j] = ".";
		}
	}
	return grid;
};
//监控地图选择框，选择地图后，更新地图数据
window.generateMapField = function (grid) {
	$("#mapfield").html("");

	for (let x = 0; x < grid.length; x++) {
		for (let y = 0; y < grid[x].length; y++) {
			if (!grid[x][y]) {
				grid[x][y] = ".";
			}
			let ctx = grid[x][y];

			$("#mapfield").append(
				`<div class='mapcell${ctx !== "." ? " fillcell" : ""}' data-row='${x}' data-col='${y}'>${ctx}</div>`
			);
		}
		$("#mapfield").append("<br>");
	}

	$(".mapcell").on("click", function () {
		const grid = T.mapdata;

		const row = $(this).data("row");
		const col = $(this).data("col");

		T.xpos = row;
		T.ypos = col;

		if (T.destroymode) {
			grid[row][col] = ".";
		} else if (T.placemode) {
			grid[row][col] = T.building;
		} else if (grid[row][col] === ".") {
			grid[row][col] = "road";
		} else if (grid[row][col] === "road") {
			grid[row][col] = ".";
		}

		$(this).html(grid[row][col]);
		$(this).removeClass("fillcell");

		$("#currentpos").html(
			`当前位置： X${row - Math.floor(T.mapsizeX / 2)}, Y${
				col - Math.floor(T.mapsizeY / 2)
			} 绝对坐标： X${row}, Y${col}`
		);

		if (grid[row][col] !== ".") {
			$(this).addClass("fillcell");
		}
	});
};

window.saveMapConfig = function () {
	const direction = [
		[0, 1, "E"],
		[0, -1, "W"],
		[1, 0, "S"],
		[-1, 0, "N"],
	];
	let raw = Maps.convertData(T.mapdata);
	delete raw["."]; // remove empty space
	delete raw["road"]; // remove road
	let arr = [];

	const checkRoad = (key, x, y) => {
		let result = "";
		direction.forEach(([dx, dy, dir]) => {
			if (x + dx < 0 || y + dy < 0 || x + dx >= T.mapsizeX || y + dy >= T.mapsizeY) {
			} else if (T.mapdata[x + dx][y + dy] == "road") {
				result += dir;
			}
			console.log(key, "x", x + dx, "y", y + dy, dir);
		});
		return result;
	};

	//先排个序，保证从左到右，从上到下
	let sorted = Object.keys(raw).sort((a, b) => {
		let [ax, ay] = raw[a][0];
		let [bx, by] = raw[b][0];
		if (ay == by) {
			return ax - bx;
		} else {
			return ay - by;
		}
	});

	sorted.forEach((key) => {
		let side = "",
			x,
			y;
		if (raw[key].length == 1) {
			x = raw[key][0][0];
			y = raw[key][0][1];
			side = checkRoad(key, x, y);

			x = x - Math.floor(T.mapsizeX / 2);
			y = y - Math.floor(T.mapsizeY / 2);
			arr.push([key, x, y, side]);
		} else {
			raw[key].forEach(([x, y], i) => {
				side = checkRoad(key, x, y);
				x = x - Math.floor(T.mapsizeX / 2);
				y = y - Math.floor(T.mapsizeY / 2);
				arr.push([key, x, y, side]);
			});
		}
	});

	arr = JSON.stringify(arr);
	//去掉开头和结尾的中括号
	arr = arr.slice(1, -1);
	//换行
	arr = arr.split("],").join("],\n");

	let data = `worldMap['${T.selectMap}'].Spots(\n${arr}\n)`;

	download(data, T.selectMap, "txt");
};
