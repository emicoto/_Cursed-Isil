declare global {
	interface Number {
		fixed(a?: number): number;
	}
}

//make sure the value is an object
export function isObject(props) {
	return Object.prototype.toString.call(props) === "[object Object]";
}

//check x is in range of min and max
export function inrange(x: number, min: number, max: number) {
	return x >= min && x <= max;
}

//make sure the value is an array
export function ensureIsArray(x, check = false) {
	if (check) x = ensure(x, []);
	if (Array.isArray(x)) return x;
	return [x];
}

//ensure the value is not null or undefined
export function ensure(x, y) {
	/* lazy comparison to include null. */
	return x == undefined ? y : x;
}

//check x is between min and max
export function between(x: number, min: number, max: number) {
	return x > min && x < max;
}

//make a random number
export function random(min: number, max?: number) {
	if (!max) {
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//fix the number to any decimal places
Number.prototype.fixed = function (a) {
	if (!a) a = 2;
	return parseFloat(this.toFixed(a));
};

//return a random element from an array by rate
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

//compare two elements in an object
export function compares(key) {
	return function (m, n) {
		let a = m[key];
		let b = n[key];
		return b - a;
	};
}

//roll dice
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

//make sure the props is valid variables (not null, undefined, empty array, empty object)
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

//transfer celsius to fahrenheit
export function CtoF(c: number) {
	return c * 1.8 + 32;
}

//check if the value is in the given array
export function groupmatch(value, ...table: Array<number | string>) {
	return table.includes(value);
}

//draw a random element from an array
export function draw(array: any[]) {
	if (!Array.isArray(array) || array.length == 0) return null;
	var a = array.length - 1;
	return array[random(0, a)];
}

//sum all the values in an object
export function sum(obj) {
	let sum = 0;
	for (var el in obj) {
		if (obj.hasOwnProperty(el)) {
			sum += parseFloat(obj[el]);
		}
	}
	return sum;
}

//find the key of an object by value
export function findkey(data, value, compare = (a, b) => a === b) {
	return Object.keys(data).find((k) => compare(data[k], value));
}

//swap two elements in an array
export function swap(arr: any[], a, b) {
	let c = arr[a];
	let d = arr[b];
	arr[b] = c;
	arr[a] = d;
	return arr;
}

//shift an array by given number
export function arrShift(arr, n) {
	if (Math.abs(n) > arr.length) n = n % arr.length;
	return arr.slice(-n).concat(arr.slice(0, -n));
}

//deep clone an object
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

//create a download file by given content
export function download(content, fileName, contentType) {
	var a = document.createElement("a");
	var file = new Blob([content], { type: contentType });
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}

//count an element in a 2d array
export function countArray(arr, element) {
	return arr.reduce((count, subarr) => count + (subarr.includes(element) ? 1 : 0), 0);
}

//set value by path
export function setVByPath(obj, path, value) {
	if (typeof path === "string") path = path.split(".");
	if (path.length > 1) {
		const p = path.shift();
		if (obj[p] === undefined) obj[p] = {};
		setVByPath(obj[p], path, value);
	} else obj[path[0]] = value;
	return obj;
}

//get and init object by path
export function getByPath(obj, path) {
	const pathArray = path.split(".");
	const first = pathArray.shift();
	if (obj[first] === undefined) obj[first] = {};
	if (pathArray.length === 0) return obj[first];
	return getByPath(obj[first], pathArray.join("."));
}

//get key by value
export function getKeyByValue(object, value) {
	const findArray = (arr, val) => {
		return arr.find((item) => typeof item.includes === "function" && item.includes(val));
	};
	return Object.keys(object).find(
		(key) =>
			object[key] === value ||
			object[key].includes(value) ||
			(Array.isArray(object[key]) && (object[key].includes(value) || findArray(object[key], value)))
	);
}

//get index by value
export function getIndexByValue(array, value) {
	return array.findIndex((item) => item === value);
}

Object.defineProperties(window, {
	isObject: { value: isObject },
	inrange: { value: inrange },
	ensureIsArray: { value: ensureIsArray },
	ensure: { value: ensure },
	between: { value: between },
	random: { value: random },
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
	setVByPath: { value: setVByPath },
	getByPath: { value: getByPath },
	getKeyByValue: { value: getKeyByValue },
	getIndexByValue: { value: getIndexByValue },
});
