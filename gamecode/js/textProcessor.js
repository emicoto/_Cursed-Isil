/**
 *
 * @param {string} text
 */
P.convertSelection = function (text) {
	let replace = text.includes("@replace");
	let txt, html;

	if (replace) {
		txt = text.match(/#:select@replace:(.+):#/);
	} else {
		txt = text.match(/#:select:(.+):#/);
	}

	let pick = txt[1].split("|");
	let selection = "";
	pick.forEach((v) => {
		let t = `<<pick`;
		let content = "";
		let check = v.split(",");

		check.forEach((k) => {
			if (k == "auto") t += ` auto`;
			else if (k.match(/%(.+)%/)) content = k.match(/%(.+)%/)[1];
			else if (parseInt(k)) t += ` ${k}`;
			else t += ` '${k}'`;
		});
		t += ">>" + content;
		selection += t;
	});

	if (replace) {
		html = `<br><<selection replace>>${selection}<</selection>>`;
	} else {
		html = `<br><<selection>>${selection}<</selection>>`;
	}
	return text.replace(txt[0], html);
};

P.convertTips = function (text) {
	let txt = text.match(/:tips:(.+)\|(.+):/);
	return text.replace(txt[0], `<<tips '${txt[1]}' '${txt[2]}'>>`);
};

/**
 *
 * @param {string | string[]} text
 */
P.txt = function (text) {
	const trans = function (t) {
		if (t.includes(":tips:")) t = P.convertTips(t);
		if (t.includes(":select:")) t = P.convertSelection(t);
		if (t.includes("/L")) t = t.replace("/L", "<br>");

		if (t.includes("<fr>")) {
			t = t.replace("<fr>", "<br>");
		} else if (t.includes("/* */")) {
			t = t.replace("/* */", "");
		} else {
			if (
				t.has(
					"if",
					"switch",
					"case",
					"<</",
					"select",
					"<br>",
					"replace",
					"div",
					"<<pick",
					"<<event",
					"<<run",
					"<<set"
				) === false
			) {
				t += "<br>";
			}
		}

		return t;
	};

	if (typeof text === "string") return trans(text);

	const txt = [];

	for (let i = 0; i < text.length; i++) {
		txt[i] = trans(text[i]);
	}

	return txt.join("");
};

P.splitSex = function (chara, male, female, inter) {
	if (chara.gender === "male") return male;
	else {
		if (inter && chara.gender === "inter") {
			return inter;
		}
		return female;
	}
};

P.mutants = function (level) {
	let txt = "";
	for (let i = 0; i < level; i++) {
		txt += `【${D.mutant[i]}】`;
	}
	return txt;
};

P.msg = function (msg, add) {
	if (!S.msg) S.msg = [];

	if (add) {
		if (!S.msg.length) S.msg[0] = "";
		S.msg[S.msg.length - 1] += msg;
	} else if (msg.includes("<fr>")) {
		S.msg = S.msg.concat(msg.split("<fr>"));
	} else {
		S.msg.push(msg);
	}
};

P.resetMsg = function () {
	S.msg = [];
	T.msgId = 0;
	T.noMsg = 0;
};
