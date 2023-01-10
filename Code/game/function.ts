declare var lang: typeof window.lang;

export function lan(txt: string[] | string, DEF?: string) {
	let CN, EN;

	if (Array.isArray(txt)) {
		CN = txt[0];
		EN = txt[1] ? txt[1] : CN;
	}

	if (typeof txt === "string" && DEF) {
		CN = txt;
		EN = DEF;
	}

	if (lang == "CN" && isValid(CN)) return CN;
	if (lang == "EN" && isValid(EN)) return EN;
	return DEF;
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
