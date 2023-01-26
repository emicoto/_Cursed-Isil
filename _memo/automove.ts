export function autoMoveOnMap(pos1: iPos, pos2: iPos, map: string[][]) {
	//先把所有的道路坐标存入数组，同时初始化每个道路坐标的访问状态。
	const road = [];
	const visited = [];
	for (let x = 0; x < map.length; x++) {
		for (let y = 0; y < map[x].length; y++) {
			if (map[x][y] === "road") {
				road.push({ x, y });
			}
		}
	}

	//模拟移动，记录移动过程中的坐标
	const path = [];
	let tryside: locationside[] = [];
	let side: locationside, lastSide: locationside;

	//检查四个方向是否有道路
	const checkEast = (pos: iPos) => {
		if (pos.x + 1 >= map.length) return false;
		return map[pos.x + 1][pos.y] === "road" || pos.x + 1 === pos2.x;
	};
	const checkWest = (pos: iPos) => {
		if (pos.x - 1 < 0) return false;
		return map[pos.x - 1][pos.y] === "road" || pos.x - 1 === pos2.x;
	};
	const checkSouth = (pos: iPos) => {
		if (pos.y + 1 >= map[0].length) return false;
		return map[pos.x][pos.y + 1] === "road" || pos.y + 1 === pos2.y;
	};
	const checkNorth = (pos: iPos) => {
		if (pos.y - 1 < 0) return false;
		return map[pos.x][pos.y - 1] === "road" || pos.y - 1 === pos2.y;
	};

	//移动同时记录移动方向
	const moveEast = (pos: iPos) => {
		pos.x += 1;

		path.push({ x: pos.x + 1, y: pos.y, side: "E" });
		if (lastSide !== "E") {
			lastSide = side;
		}
		side = "E";
	};
	const moveWest = (pos: iPos) => {
		pos.x -= 1;

		path.push({ x: pos.x - 1, y: pos.y, side: "W" });
		if (lastSide !== "W") {
			lastSide = side;
		}
		side = "W";
	};
	const moveSouth = (pos: iPos) => {
		pos.y += 1;

		path.push({ x: pos.x, y: pos.y + 1, side: "S" });
		if (lastSide !== "S") {
			lastSide = side;
		}
		side = "S";
	};
	const moveNorth = (pos: iPos) => {
		pos.y -= 1;

		path.push({ x: pos.x, y: pos.y - 1, side: "N" });
		if (lastSide !== "N") {
			lastSide = side;
		}
		side = "N";
	};

	//从起点开始，模拟移动，直到到达终点。
	//记录每次拐向的坐标、拐向的方向、上次拐向到现在为止的步数。如果到了死胡同，就清理这部分路径，并回退到上一个拐向点，再次尝试。
	let TurnHistory: Array<{ x: number; y: number; tryside: locationside[]; step: number }> = [];
	const recordTurn = (pos: iPos, tryside: locationside[]) => {
		TurnHistory.push({ x: pos.x, y: pos.y, tryside, step: 0 });
	};
	const addStep = () => {
		TurnHistory[TurnHistory.length - 1].step += 1;
	};
	const backToLastTurn = (times) => {
		path.splice(
			path.length - TurnHistory[TurnHistory.length - times].step,
			TurnHistory[TurnHistory.length - times].step
		);
		//回退到上一个拐向点
		pos = { x: TurnHistory[TurnHistory.length - times].x, y: TurnHistory[TurnHistory.length - 1].y };
		//获取上一个拐向点的记录
		tryside = TurnHistory[TurnHistory.length - times].tryside;
		//缓存记录然后删除
		for (let i = 0; i < times; i++) {
			lastTurn = TurnHistory.pop();
		}
	};

	let pos = pos1,
		retry = false,
		lastTurn;
	let i = 0;

	console.log(Distance(pos, pos2));

	while (Distance(pos, pos2) > 1) {
		i++;
		if (i > 3000) {
			console.log("超时");
			break;
		}

		console.log(pos, side, lastSide, tryside, TurnHistory);

		//优先往目前的前进方向走,如果前进方向没有路，就尝试其他方向
		if (side === "E" && checkEast(pos)) {
			moveEast(pos);
			addStep();
			continue;
		}
		if (side === "W" && checkWest(pos)) {
			moveWest(pos);
			addStep();
			continue;
		}
		if (side === "S" && checkSouth(pos)) {
			moveSouth(pos);
			addStep();
			continue;
		}
		if (side === "N" && checkNorth(pos)) {
			moveNorth(pos);
			addStep();
			continue;
		}

		//如果前进方向没有路，就尝试其他方向。先往目标位置的方向走，如果没有路，就尝试其他方向。
		if (pos1.x < pos2.x && checkEast(pos)) {
			side = "E";
			tryside.push("E");
			moveEast(pos);
			recordTurn(pos, tryside);
			addStep();
			continue;
		}
		if (pos1.x > pos2.x && checkWest(pos)) {
			side = "W";
			tryside.push("W");
			moveWest(pos);
			recordTurn(pos, tryside);
			addStep();
			continue;
		}
		if (pos1.y < pos2.y && checkSouth(pos)) {
			side = "S";
			tryside.push("S");
			moveSouth(pos);
			recordTurn(pos, tryside);
			addStep();
			continue;
		}
		if (pos1.y > pos2.y && checkNorth(pos)) {
			side = "N";
			tryside.push("N");
			moveNorth(pos);
			recordTurn(pos, tryside);
			addStep();
			continue;
		}

		//如果没有路，就尝试其他方向。
		if (checkEast(pos)) {
			side = "E";
			tryside.push("E");
			moveEast(pos);
			recordTurn(pos, tryside);
			addStep();
			continue;
		}
		if (checkWest(pos)) {
			side = "W";
			tryside.push("W");
			moveWest(pos);
			recordTurn(pos, tryside);
			addStep();
			continue;
		}
		if (checkSouth(pos)) {
			side = "S";
			tryside.push("S");
			moveSouth(pos);
			recordTurn(pos, tryside);
			addStep();
			continue;
		}
		if (checkNorth(pos)) {
			side = "N";
			tryside.push("N");
			moveNorth(pos);
			recordTurn(pos, tryside);
			addStep();
			continue;
		}

		//如果没有路，就回退
		if (TurnHistory.length > 0) {
			let last = TurnHistory[TurnHistory.length - 1];
			//对比缓存记录和当前记录，如果一致，先看看有没有其他方向可以走，如果没有，就回退
			if (lastTurn && lastTurn.x === last.x && lastTurn.y === last.y) {
				if (last.tryside.length === 4) {
					backToLastTurn(2);
				}
			}

			backToLastTurn(1);
		}
	}

	return path;
}
