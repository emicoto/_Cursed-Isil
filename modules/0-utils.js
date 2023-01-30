;(function (os, fs, path) {
	'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
	var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
	var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

	function isObject(props) {
	  return Object.prototype.toString.call(props) === "[object Object]";
	}
	function inrange(x, min, max) {
	  return x >= min && x <= max;
	}
	function ensureIsArray(x, check = false) {
	  if (check)
	    x = ensure(x, []);
	  if (Array.isArray(x))
	    return x;
	  return [x];
	}
	function ensure(x, y) {
	  return x == void 0 ? y : x;
	}
	function between(x, min, max) {
	  return x > min && x < max;
	}
	function random(min, max) {
	  if (!max) {
	    max = min;
	    min = 0;
	  }
	  return Math.floor(Math.random() * (max - min + 1) + min);
	}
	function fixed(int, a) {
	  if (!a)
	    a = 2;
	  return parseFloat(int.toFixed(a));
	}
	function maybe(arr) {
	  let txt;
	  arr.forEach((v, i) => {
	    if (random(100) < v[1])
	      txt = v[0];
	  });
	  if (!txt) {
	    return arr[0][0];
	  }
	  return txt;
	}
	function compares(key) {
	  return function(m, n) {
	    let a = m[key];
	    let b = n[key];
	    return b - a;
	  };
	}
	function roll(times, max) {
	  if (!times)
	    times = 1;
	  if (!max)
	    max = 6;
	  let re;
	  re = {
	    roll: [],
	    result: 0,
	    bonus: 0
	  };
	  for (let i = 0; i < times; i++) {
	    let r = random(1, max);
	    re.roll[i] = r;
	    re.result += r;
	    if (r == max)
	      re.bonus++;
	  }
	  re.roll = re.roll.join();
	  return re;
	}
	function isValid(props) {
	  const type = typeof props;
	  const isArray = Array.isArray(props);
	  if (props === void 0 || props === null)
	    return false;
	  if (isArray) {
	    return props.length > 0;
	  }
	  if (type == "object") {
	    return JSON.stringify(props) !== "{}";
	  }
	  return true;
	}
	function CtoF(c) {
	  return c * 1.8 + 32;
	}
	function groupmatch(value, ...table) {
	  return table.includes(value);
	}
	function draw(array) {
	  var a = array.length;
	  return array[random(0, a)];
	}
	function sum(obj) {
	  let sum2 = 0;
	  for (var el in obj) {
	    if (obj.hasOwnProperty(el)) {
	      sum2 += parseFloat(obj[el]);
	    }
	  }
	  return sum2;
	}
	function findkey(data, value, compare = (a, b) => a === b) {
	  return Object.keys(data).find((k) => compare(data[k], value));
	}
	function swap(arr, a, b) {
	  let c = arr[a];
	  let d = arr[b];
	  arr[b] = c;
	  arr[a] = d;
	  return arr;
	}
	function arrShift(arr, n) {
	  if (Math.abs(n) > arr.length)
	    n = n % arr.length;
	  return arr.slice(-n).concat(arr.slice(0, -n));
	}
	function clone(obj) {
	  var copy;
	  if (null == obj || "object" != typeof obj)
	    return obj;
	  if (obj instanceof Date) {
	    copy = new Date();
	    copy.setTime(obj.getTime());
	    return copy;
	  }
	  if (obj instanceof Array) {
	    copy = [];
	    for (var i = 0, len = obj.length; i < len; i++) {
	      copy[i] = clone(obj[i]);
	    }
	    return copy;
	  }
	  if (obj instanceof Function) {
	    copy = function() {
	      return obj.apply(this, arguments);
	    };
	    return copy;
	  }
	  if (obj instanceof Object) {
	    copy = {};
	    for (var attr in obj) {
	      if (obj.hasOwnProperty(attr))
	        copy[attr] = clone(obj[attr]);
	    }
	    return copy;
	  }
	  throw new Error("Unable to copy obj as type isn't supported " + obj.constructor.name);
	}
	function download(content, fileName, contentType) {
	  var a = document.createElement("a");
	  var file = new Blob([content], { type: contentType });
	  a.href = URL.createObjectURL(file);
	  a.download = fileName;
	  a.click();
	}
	function countArray(arr, element) {
	  return arr.reduce((count, subarr) => count + (subarr.includes(element) ? 1 : 0), 0);
	}
	function setVByPath(obj, path, value) {
	  if (typeof path === "string")
	    path = path.split(".");
	  if (path.length > 1) {
	    const p = path.shift();
	    if (obj[p] === void 0)
	      obj[p] = {};
	    setVByPath(obj[p], path, value);
	  } else
	    obj[path[0]] = value;
	  return obj;
	}
	function getByPath(obj, path) {
	  const pathArray = path.split(".");
	  const first = pathArray.shift();
	  if (obj[first] === void 0)
	    obj[first] = {};
	  if (pathArray.length === 0)
	    return obj[first];
	  return getByPath(obj[first], pathArray.join("."));
	}
	function getKeyByValue(object, value) {
	  const findArray = (arr, val) => {
	    return arr.find((item) => typeof item.includes === "function" && item.includes(val));
	  };
	  return Object.keys(object).find(
	    (key) => object[key] === value || object[key].includes(value) || Array.isArray(object[key]) && (object[key].includes(value) || findArray(object[key], value))
	  );
	}
	function setByPath(obj, path) {
	  const pathArray = path.split(".");
	  const last = pathArray.pop();
	  for (let i = 0; i < pathArray.length; i++) {
	    if (!obj[pathArray[i]])
	      obj[pathArray[i]] = {};
	    obj = obj[pathArray[i]];
	  }
	  if (!obj[last]) {
	    obj[last] = {};
	  }
	  return obj[last];
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
	  setVByPath: { value: setVByPath },
	  getByPath: { value: getByPath },
	  getKeyByValue: { value: getKeyByValue },
	  setByPath: { value: setByPath }
	});

	class SelectCase {
	  constructor() {
	    this.arr = [];
	    this.defaultresult = "";
	    this.condtype = "";
	  }
	  case(cond, result) {
	    this.check(cond);
	    this.arr.push({ cond, result });
	    return this;
	  }
	  else(result) {
	    this.defaultresult = result;
	    return this;
	  }
	  caseMatch(cond, result) {
	    const Cond = {
	      c: cond,
	      isMatch: true
	    };
	    this.arr.push({ Cond, result });
	    return this;
	  }
	  has(pick) {
	    for (const element of this.arr) {
	      const { cond, result } = element;
	      const type = this.type(cond);
	      if (type == "number[]") {
	        if (pick >= cond[0] && pick <= cond[1])
	          return result;
	      }
	      if (type == "string[]") {
	        if (cond.includes(pick))
	          return result;
	      }
	      if (type == "string" || type == "number") {
	        if (pick === cond)
	          return result;
	      }
	      if (type == "matchmode") {
	        if (cond.c.includes(pick))
	          return result;
	      }
	    }
	    return this.defaultresult;
	  }
	  isLT(pick) {
	    for (const element of this.arr) {
	      const { cond, result } = element;
	      const type = this.type(cond);
	      if (type !== "number")
	        throw new Error("cannot compare types other than numbers");
	      if (pick < cond)
	        return result;
	    }
	    return this.defaultresult;
	  }
	  isGT(pick) {
	    for (const element of this.arr) {
	      const { cond, result } = element;
	      const type = this.type(cond);
	      if (type !== "number")
	        throw new Error("cannot compare types other than numbers");
	      if (pick > cond)
	        return result;
	    }
	    return this.defaultresult;
	  }
	  isLTE(pick) {
	    for (const element of this.arr) {
	      const { cond, result } = element;
	      const type = this.type(cond);
	      if (type !== "number")
	        throw new Error("cannot compare types other than numbers");
	      if (pick <= cond)
	        return result;
	    }
	    return this.defaultresult;
	  }
	  isGTE(pick) {
	    for (const element of this.arr) {
	      const { cond, result } = element;
	      const type = this.type(cond);
	      if (type !== "number")
	        throw new Error("cannot compare types other than numbers");
	      if (pick >= cond)
	        return result;
	    }
	    return this.defaultresult;
	  }
	  check(cond) {
	    const check = this.type(cond).replace("[]", "");
	    if (!this.condtype)
	      this.condtype = check;
	    else if (this.condtype !== check)
	      throw new Error("number and string cannot be compare at same time");
	  }
	  type(cond) {
	    if (Array.isArray(cond)) {
	      switch (typeof cond[0]) {
	        case "number":
	          if (cond.length !== 2)
	            throw new Error("number case must be [number, number]");
	          return "number[]";
	        case "string":
	          return "string[]";
	        case "object":
	          if (cond == null ? void 0 : cond.isMatch)
	            return "matchmode";
	        default:
	          throw new Error("selectcase only accept string or number");
	      }
	    }
	    if (typeof cond === "string")
	      return "string";
	    if (typeof cond === "number")
	      return "number";
	    throw new Error("selectcase only accept string or number");
	  }
	}
	Object.defineProperties(window, {
	  SelectCase: { value: Object.freeze(SelectCase) }
	});

	console.log(`It's running on ${os__default["default"].platform()} ${os__default["default"].arch()} ${os__default["default"].release()}`);
	console.log("the user is", os__default["default"].userInfo().username, "and the home directory is", os__default["default"].homedir());
	console.log("fs, path, child_process are loaded: ", fs__default["default"], path__default["default"]);
	console.log("running utils");

})(os, fs, path);
