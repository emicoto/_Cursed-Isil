import { Maps, iPos, printMap } from "./map";
import { locationside } from "./types/base";

declare function groupmatch(arg, ...args): boolean;
const moveableTile = ["road", "glass", "field", "TRoad", "LRoad", "crossRoad", "passable"];

export function GenerateSpot(map: Maps) {
	//初始化地图
	const townmap = new Array(map.mapsize.x).fill(0).map(() => new Array(map.mapsize.y).fill(""));

	//根据x,y坐标，整理个地点的坐标。首先按x坐标排序，从小到大。
	//接着检查排序，如果y坐标相同，则按y坐标排序，从小到大。
	const spots = Array.from(map.spots);

	spots.sort((a, b) => {
		if (a[1].pos.x === b[1].pos.x) {
			return a[1].pos.y - b[1].pos.y;
		}
		return a[1].pos.x - b[1].pos.x;
	});

	//放置地点
	spots.forEach((location) => {
		const pos = location[1].pos;
		townmap[pos.x][pos.y] = location[0] + location[1].tags.join("|");
	});

	//先可通过方向，在地点前方放置道路。
	//并且缓存道路的位置，以便后续的道路连接。
	const road = [];
	const setRoad = (x, y, side) => {
		if (x < 0 || y < 0 || x >= map.mapsize.x || y >= map.mapsize.y) return;
		if (townmap[x][y] === "") {
			townmap[x][y] = "road";
			road.push([side, x, y]);
		}
	};

	spots.forEach((location) => {
		const pos = location[1].pos;
		const side = location[1].side;

		side.split("").forEach((s) => {
			switch (s) {
				case "W": //west
				case "w":
					setRoad(pos.x, pos.y - 1, "W");
					break;
				case "E": //east
				case "e":
					setRoad(pos.x, pos.y + 1, "E");
					break;
				case "S": //south
				case "s":
					setRoad(pos.x + 1, pos.y, "S");
					break;
				case "N": //north
				case "n":
					setRoad(pos.x - 1, pos.y, "N");
					break;
			}
		});
	});

	return [townmap, road];
}

export function AutoFillRoads(map: string[][]) {
	//先获取已经放置好的地点与道路的位置。
	const road = map
		.map((row, x) => row.map((col, y) => (col === "road" ? [x, y] : col !== "" && col !== "." ? [x, y] : "")))
		.flat()
		.filter((x) => x !== "");
}

//根据各个地点的坐标，自动生成连接各地点之间的道路。
export function GenerateMap(map: Maps) {
	//初始化地图
	const maps = GenerateSpot(map);
	const townmap = maps[0];
	const road = maps[1];
	const directions = [
		[0, -1], //west
		[0, 1], //east
		[1, 0], //south
		[-1, 0], //north
	];

	const directions2 = [
		[1, -1], //south west
		[1, 1], //south east
		[-1, 1], //north east
		[-1, -1], //north west
	];

	//检查两条路之间是否有障碍物，如果有，则不连通。
	const checkRoad = (side, x, y, start, end) => {
		if (x < 0 || y < 0 || x >= townmap.length || y >= townmap[x].length) return false;

		if (side == "x") {
			for (let i = start; i <= end; i++) {
				if (townmap[i][y] !== "" && townmap[i][y] !== "road") return false;
			}
		}
		if (side == "y") {
			for (let i = start; i <= end; i++) {
				if (townmap[x][i] !== "" && townmap[x][i] !== "road") return false;
			}
		}
		return true;
	};

	const isRoad = (x, y) => {
		if (x < 0 || y < 0 || x >= townmap.length || y >= townmap[x].length) return false;
		return townmap[x][y] === "road";
	};

	//检查周围是否已经有路
	const hasRoadAround = (side, x, y) => {
		if (x < 0 || y < 0 || x >= townmap.length || y >= townmap[x].length) return false;
		let count = 0;
		directions.concat(directions2).forEach((dir) => {
			//如果是前进中的方向，则跳过
			if (side == "x" && dir[0] == 0) {
			} else if (side == "y" && dir[1] == 0) {
			} else if (isRoad(x + dir[0], y + dir[1])) count++;
		});
		return count > 4;
	};

	//连通道路
	const connectRoad = (side, x, y, start, end) => {
		if (side == "x") {
			for (let i = start; i <= end; i++) {
				if (townmap[i][y] === "") {
					//检查周围是否已经有道路，如果有，则不连通。
					if (hasRoadAround(side, i, y)) continue;

					townmap[i][y] = "road";
				}
			}
		}
		if (side == "y") {
			for (let i = start; i <= end; i++) {
				if (townmap[x][i] === "") {
					//检查周围是否已经有道路，如果有，则不连通。
					if (hasRoadAround(side, x, i)) continue;
					townmap[x][i] = "road";
				}
			}
		}
	};

	//按照缓存的道路，连通道路
	road.forEach((road) => {
		const x = road[1];
		const y = road[2];
		const side = road[0];

		if (side == "N" || side == "S") {
			for (let i = x - 1; i >= 0; i--) {
				if (townmap[i][y] === "road") {
					if (checkRoad("x", x, y, i + 1, x - 1)) {
						connectRoad("x", x, y, i + 1, x - 1);
					}
				}
			}

			for (let i = x + 1; i < map.mapsize.x; i++) {
				if (townmap[i][y] === "road") {
					if (checkRoad("x", x, y, x + 1, i - 1)) {
						connectRoad("x", x, y, x + 1, i - 1);
					}
				}
			}
		}

		for (let i = y - 1; i >= 0; i--) {
			if (townmap[x][i] === "road") {
				if (checkRoad("y", x, y, i + 1, y - 1)) {
					connectRoad("y", x, y, i + 1, y - 1);
				}
			}
		}
		for (let i = y + 1; i < map.mapsize.y; i++) {
			if (townmap[x][i] === "road") {
				if (checkRoad("y", x, y, y + 1, i - 1)) {
					connectRoad("y", x, y, y + 1, i - 1);
				}
			}
		}
	});

	clearUnconnectRoad(townmap);

	//打印地图
	printMap(townmap);

	return townmap;
}

//计算两个地点之间的绝对距离
function Distance(start: iPos, goal: iPos) {
	return Math.abs(start.x - start.x) + Math.abs(goal.y - goal.y);
}

function outOfMap(x, y, map: string[][]) {
	return x < 0 || y < 0 || x >= map.length || y >= map[x].length;
}

function deadEndRoad(x, y, map: string[][]) {
	//检查是否是死胡同
	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];

	//检查周围四个方向是否有路，如果只有一个，且周围没有可移动的建筑，则是死胡同
	let count = 0;
	directions.forEach((dir) => {
		if (outOfMap(x + dir[0], y + dir[1], map)) {
		} else if (map[x + dir[0]][y + dir[1]] === "road" || !groupmatch(map[x + dir[0]][y + dir[1]], ".", "")) count++;
	});

	return count === 1 && (map[x][y] === "road" || !groupmatch(map[x][y], ".", ""));
}

function UnconnectRoad(x, y, map: string[][]) {
	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];

	let i = 0;
	directions.forEach((dir) => {
		if (outOfMap(x + dir[0], y + dir[1], map)) {
		} else if (!groupmatch(map[x + dir[0]][y + dir[1]], "", ".")) i++;
	});

	return i === 0;
}

function clearUnconnectRoad(map: string[][]) {
	for (let x = 0; x < map.length; x++) {
		for (let y = 0; y < map[x].length; y++) {
			if (map[x][y] === "road") {
				if (UnconnectRoad(x, y, map)) {
					map[x][y] = "";
				}
			}
		}
	}
	return map;
}

//检查两点之间是否有道路或可移动点相连
function isConnected(pos1: iPos, pos2: iPos, map: string[][]) {
	const x1 = pos1.x,
		y1 = pos1.y,
		x2 = pos2.x,
		y2 = pos2.y;
	if (x1 === x2 && y1 === y2) return true;
	if (x1 === x2) {
		if (y1 > y2) {
			for (let i = y2; i <= y1; i++) {
				if (groupmatch(map[x1][i], "", ".") || map[x1][i].has("unpassable")) return false;
			}
		} else {
			for (let i = y1; i <= y2; i++) {
				if (groupmatch(map[x1][i], "", ".") || map[x1][i].has("unpassable")) return false;
			}
		}
	} else if (y1 === y2) {
		if (x1 > x2) {
			for (let i = x2; i <= x1; i++) {
				if (groupmatch(map[i][y1], "", ".") || map[x1][i].has("unpassable")) return false;
			}
		} else {
			for (let i = x1; i <= x2; i++) {
				if (groupmatch(map[i][y1], "", ".") || map[x1][i].has("unpassable")) return false;
			}
		}
	} else {
		return Distance(pos1, pos2) === 1;
	}
	return true;
}

//检查是否十字路口
function isCrossRoad(x, y, map: string[][]) {
	if (map[x][y] !== "road") return false;
	const direction = [
		[0, -1],
		[0, 1],
		[-1, 0],
		[1, 0],
	];
	let count = 0;
	direction.forEach(([dx, dy]) => {
		if (outOfMap(x + dx, y + dy, map)) {
		} else if (map[x + dx][y + dy] === "road") count++;
	});
	return count === 4;
}

//检查是不是T字路口
function isTcrossRoad(x, y, map: string[][]) {
	if (map[x][y] !== "road") return false;
	const direction = [
		[0, -1],
		[0, 1],
		[-1, 0],
		[1, 0],
	];
	let count = 0;
	direction.forEach(([dx, dy]) => {
		if (outOfMap(x + dx, y + dy, map)) {
		} else if (map[x + dx][y + dy] === "road") count++;
	});
	return count === 3;
}

//检查是不是L字路口
function isLcrossRoad(x, y, map: string[][]) {
	if (map[x][y] !== "road") return false;
	const direction = [
		[0, -1],
		[0, 1],
		[-1, 0],
		[1, 0],
	];
	let count = 0;
	direction.forEach(([dx, dy]) => {
		if (outOfMap(x + dx, y + dy, map)) {
		} else if (map[x + dx][y + dy] === "road") count++;
	});
	return count === 2;
}

//根据两个地点的坐标，以及道路连接情况，获取两个地点之间的最短路径
function findPath(mapdata, startPoint, goalPoint) {
	const queue = [];
	const visited = new Set();
	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	]; // possible movements (up, down, left, right)

	queue.push({ x: startPoint.x, y: startPoint.y, path: [], from: null });
	visited.add(startPoint);

	while (queue.length > 0) {
		const current = queue.shift();

		if (current.x === goalPoint.x && current.y === goalPoint.y) {
			// goalPoint found, return the path
			return current.path;
		}

		for (const dir of directions) {
			const x = current.x + dir[0];
			const y = current.y + dir[1];

			if (x < 0 || y < 0 || x >= mapdata.length || y >= mapdata[0].length) {
				// out of bounds
				continue;
			}

			//unpassable
			if (mapdata[x][y].has("unpassable")) continue;

			//not a road or not goalPoint
			if (!mapdata[x][y].has(moveableTile) && x != goalPoint.x && y != goalPoint.y) continue;

			//not connect
			if (!isConnected({ x: current.x, y: current.y }, { x, y }, mapdata)) continue;

			if (visited.has(`${x},${y}`)) {
				// cell already visited or not a road
				continue;
			}
			if (current.from !== null && current.from[0] === -dir[0] && current.from[1] === -dir[1]) continue;
			visited.add(`${x},${y}`);
			queue.push({ x, y, path: current.path.concat([[x, y]]), from: dir });
		}
	}

	// goalPoint not found
	return null;
}

//根据移动路线，打印路线图
function printPath(mapdata, path) {
	//先根据地图数据创建一个空白的地图
	const map = mapdata.map((row) => row.map((cell) => " "));
	//将路线上的点标记为路线
	path.forEach((point) => {
		map[point[0]][point[1]] = "x";
	});
	//打印地图
	map.forEach((row) => console.log(row.join("")));
}

Object.defineProperties(window, {
	GenerateMap: { value: GenerateMap },
	GenerateSpot: { value: GenerateSpot },
	findPath: { value: findPath },
	printPath: { value: printPath },
});
