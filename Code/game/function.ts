
export function lan(txt, ...txts) {
	let CN, EN;

	if (Array.isArray(txt)) {
		CN = txt[0];
		EN = txt[1] ? txt[1] : CN
	}

	if (typeof txt === "string") {
		CN = txt;
		EN = txts[0] ? txts[0] : txt
	}

	if (lang == "CN" && CN) return CN;
	if (lang == "EN" && EN) return EN;
	return txt
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
