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
		html = `<br><<selection event>>${selection}<</selection>>`;
	}
	return text.replace(txt[0], html);
};

P.convertTips = function (text) {
	let txt = text.match(/:tips:(.+)\|(.+):/);
	return text.replace(txt[0], `<<tips '${txt[1]}' '${txt[2]}'>>`);
};

P.clearComment = function (text) {
	return text.replace(/\s/g, "").replace(/\/\*(.+)\*\//g, "");
};

//清理掉注释和条件式等内容，计算有效文字长度
P.countText = function (text) {
	const regExpList = [
		/<<if(.+)>>/g,
		/<<else(.+)>>/g,
		/<<\/(.+)>>/g,
		/<<switch(.+)>>/g,
		/<<case(.+)>>/g,
		/<<select(.+)>>/g,
		/<<replace(.+)>>/g,
		/<<set(.+)>>/g,
		/<br>/g,
		/<<pick(.+)>>/g,
		/<<else>>/g,
		/<<default>>/g,
		/<fr>/g,
	];

	for (let i = 0; i < regExpList.length; i++) {
		text = text.replace(regExpList[i], "");
	}
	text = text.replace(/\s/g, "").replace(/\/\*(.+)\*\//g, "");

	return text;
};

//将sugarcube的条件式转换为js后，再根据条件检查有效文本长度
P.checkTxtWithCode = function (text) {
	//清理注释并按行分割
	const raw = text.replace(/\/\*(.+)\*\//g, "").split(/\n/);
	const condition = [];
	const retext = [];
	let count = 0;

	raw.forEach((txt) => {
		if (
			txt.match(/<<if(.+)>>/) ||
			txt.match(/<<else(.+)>>/) ||
			txt.match(/<<case(.+)>>/) ||
			txt.match(/switch/) ||
			txt.match(/<<else>>/) ||
			txt.match(/<<default>>/)
		) {
			let code = txt.match(/<<(.+)>>/)[1];
			count++;
			condition[count] = code;
		} else if (!count) {
			retext[1000] += txt;
		} else {
			if (retext[count] === undefined) retext[count] = "";
			retext[count] += txt;
		}
	});

	if (condition.length === 0) return P.countText(text);

	let isSwitch,
		switchcond,
		code,
		result = "";

	//console.log(condition, retext);

	condition.forEach((con, i) => {
		if (con.includes("switch")) {
			isSwitch = true;
			switchcond = `${con.replace(/switch/g, "")} ===`;
		}
		if (con.includes("if")) isSwitch = false;

		if (isSwitch && con.includes("case")) {
			code = `${switchcond} ${con.replace(/case/g, "")}`;
			if (eval(code)) {
				result += P.countText(retext[i]);
			}
			retext[i] = "";
		} else if (!isSwitch && con.includes("if")) {
			code = con.replace(/elseif/g, "").replace(/if/g, "");
			if (eval(code)) {
				result += P.countText(retext[i]);
			}
			retext[i] = "";
		}
	});

	let txt = P.countText(retext.join(""));
	return result + txt;
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
		}
		//清理注释
		else if (t.match(/\/\*(.+)\*\//)) {
			t = t.replace(/\/\*(.+)\*\//, "");
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

//根据数组中0位值的条件，返回对应的文本。
window.condP = function (array) {
	for (let i = 0; i < array.length; i++) {
		if (array[i][0] === true) return array[i][1];
		if (array[i][0] === "else") return array[i][1];
	}
};

P.inTime = function (...args) {
	let retxt = "";

	for (let i = 0; i < args.length; i++) {
		if (args[i][0] === "else") {
			retxt = args[i][1];
		} else {
			const t1 = args[i][0];
			const t2 = args[i][1];
			const txt = args[i][2];

			if (cond.betweenTime(t1, t2)) {
				retxt = txt;
				break;
			}
		}
	}
	return retxt;
};
