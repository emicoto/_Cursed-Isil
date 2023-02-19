//declare game.lan
declare global {
	interface config {
		lan: string;
	}
}
declare var config;

//根据语言设定返回对应的文本
export function lan(txt, ...txts) {
	let CN, EN;

	//如果是数组，第一个是中文，第二个是英文
	if (Array.isArray(txt)) {
		CN = txt[0];
		EN = txt[1] ? txt[1] : CN;
	}

	//如果是字符串，第一个是中文，第二个是英文
	if (typeof txt === "string") {
		CN = txt;
		EN = txts[0] ? txts[0] : txt;
	}

	if (config.lan == "CN" && CN) return CN;
	if (config.lan == "EN" && EN) return EN;
	return txt;
}

config.lan = "CN";

//定义String的原型方法在ts中使用
declare global {
	interface String {
		has: Function;
	}
	interface Array<T> {
		has: Function;
	}
}

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
	lan: { value: lan },
});
