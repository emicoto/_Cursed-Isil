export function isObject(props) {
	return Object.prototype.toString.call(props) === "[object Object]";
}

export function inrange(x: number, min: number, max: number) {
	return x >= min && x <= max;
}

export function ensureIsArray(x, check = false) {
	if (check) x = ensure(x, []);
	if (Array.isArray(x)) return x;
	return [x];
}

export function ensure(x, y) {
	/* lazy comparison to include null. */
	return x == undefined ? y : x;
}

export function between(x: number, min: number, max: number) {
	return x > min && x < max;
}

export function random(min: number, max?: number) {
	if (!max) {
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function fixed(int, a?) {
	if (!a) a = 2;
	return parseFloat(int.toFixed(a));
}

export function maybe(arr: Array<[string, number]>) {
	let txt;
	arr.forEach((v, i) => {
		if (random(100) < v[1]) txt = v[0];
	});

	if (!txt) {
		return arr[0][0];
	}
	return txt;
}

export function compares(key) {
	return function (m, n) {
		let a = m[key];
		let b = n[key];
		return b - a;
	};
}

export function roll(times?: number, max?: number) {
	if (!times) times = 1;
	if (!max) max = 6;

	let re;

	re = {
		roll: [],
		result: 0,
		bonus: 0,
	};

	for (let i = 0; i < times; i++) {
		let r = random(1, max);
		re.roll[i] = r;
		re.result += r;
		if (r == max) re.bonus++;
	}

	re.roll = re.roll.join();

	return re;
}

export function isValid(props) {
	const type = typeof props;
	const isArray = Array.isArray(props);

	if (props === undefined || props === null) return false;

	if (isArray) {
		return props.length > 0;
	}

	if (type == "object") {
		return JSON.stringify(props) !== "{}";
	}

	return true;
}

export function CtoF(c: number) {
	return c * 1.8 + 32;
}

export function groupmatch(value, table: Array<number | string>) {
	return table.includes(value);
}

export function draw(array: any[]) {
	var a = array.length;
	return array[random(0, a)];
}

export function sum(obj) {
	let sum = 0;
	for (var el in obj) {
		if (obj.hasOwnProperty(el)) {
			sum += parseFloat(obj[el]);
		}
	}
	return sum;
}

export function findkey(data, value, compare = (a, b) => a === b) {
	return Object.keys(data).find((k) => compare(data[k], value));
}

export function swap(arr: any[], a, b) {
	let c = arr[a];
	let d = arr[b];
	arr[b] = c;
	arr[a] = d;
	return arr;
}

export function arrShift(arr, n) {
	if (Math.abs(n) > arr.length) n = n % arr.length;
	return arr.slice(-n).concat(arr.slice(0, -n));
}

export function clone(obj) {
	var copy;

	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;

	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle export Function
	if (obj instanceof Function) {
		copy = function () {
			return obj.apply(this, arguments);
		};
		return copy;
	}

	// Handle Object
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj as type isn't supported " + obj.constructor.name);
}

export function download(content, fileName, contentType) {
	var a = document.createElement("a");
	var file = new Blob([content], { type: contentType });
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}

export function countArray(arr, element) {
	return arr.reduce((count, subarr) => count + (subarr.includes(element) ? 1 : 0), 0);
}

Object.defineProperties(window, {
	isObject: { value: isObject },
	inrange: { value: inrange },
	ensureIsArray: { value: ensureIsArray },
	ensure: { value: ensure },
	between: { value: between },
	random: { value: random },
	fixed: { value: fixed },
	maybe: { value: maybe },
	compares: { value: compares },
	roll: { value: roll },
	isValid: { value: isValid },
	groupmatch: { value: groupmatch },
	draw: { value: draw },
	sum: { value: sum },
	findkey: { value: findkey },
	swap: { value: swap },
	arrshift: { value: arrShift },
	clone: { value: clone },
	CtoF: { value: CtoF },
	download: { value: download },
	countArray: { value: countArray },
});
