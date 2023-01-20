export function lan(txt, ...txts) {
	let CN, EN;

	if (Array.isArray(txt)) {
		CN = txt[0];
		EN = txt[1] ? txt[1] : CN;
	}

	if (typeof txt === "string") {
		CN = txt;
		EN = txts[0] ? txts[0] : txt;
	}

	if (lang == "CN" && CN) return CN;
	if (lang == "EN" && EN) return EN;
	return txt;
}

var language = "CN";

Object.defineProperties(window, {
	lan: { value: lan },
	lang: {
		get: function () {
			return language;
		},
		set(v) {
			language = v;
		},
	},
});

//定义String的原型方法在ts中使用
declare global {
	interface String {
		has: Function;
	}
	interface Array<T> {
		has: Function;
	}
	var lang: string;
}

//定义String的原型方法，判断字符串中是否存在任意一个字符串
String.prototype.has = function (...str) {
	if (Array.isArray(str[0])) str = str[0];
	for (let i = 0; i < str.length; i++) if (this.indexOf(str[i]) != -1) return true;
	return false;
};

//定义Array的原型方法，判断数组中是否存在任意一个字符串
Array.prototype.has = function (...str) {
	if (Array.isArray(str[0])) str = str[0];
	for (let i = 0; i < str.length; i++) if (this.indexOf(str[i]) != -1) return true;
	return false;
};

export function percent(...num) {
	let min = num[0],
		max = num[1];
	if (num.length == 3) {
		min = num[1];
		max = num[2];
	}
	return Math.clamp(Math.trunc((min / max) * 100), 1, 100);
}

Object.defineProperties(window, {
	percent: { value: percent },
});
