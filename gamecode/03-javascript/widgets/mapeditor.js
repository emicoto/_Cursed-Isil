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

		$("#currentpos").html(`当前位置： X${row - Math.floor(T.mapsizeX / 2)}, Y${col - Math.floor(T.mapsizeY / 2)}`);

		if (grid[row][col] !== ".") {
			$(this).addClass("fillcell");
		}
	});
};
