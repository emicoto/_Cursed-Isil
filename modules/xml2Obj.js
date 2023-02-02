function xml2Obj(obj) {
	const language = ["CN", "EN", "JP"];
	const isText = (obj) => obj && obj["#text"] && Object.keys(obj).length === 1;
	const isLiArr = (obj) => obj && obj.li && Object.keys(obj).length === 1 && Array.isArray(obj.li);
	const isLi = (obj) => obj && obj.li && Object.keys(obj).length === 1;

	const convertObj = function (obj, objname = "group") {
		const result = {};

		for (let key in obj) {
			//convert li to array
			//console.log("converting: ", key, obj[key]);

			if (isLiArr(obj[key])) {
				result[key] = convertArr(obj[key], key);
			}
			//convert li obj to array
			else if (isLi(obj[key])) {
				let li = obj[key].li;
				result[key] = [convertObj(li, key)];
			}

			//delect #comment
			else if (key == "#comment") {
				continue;
			}

			//convert language array
			else if (Array.isArray(obj[key]) && obj[key][0].lan) {
				const arr = [];
				obj[key].forEach((item) => {
					const lan = item.lan;
					const txt = item["#text"];
					arr[language.indexOf(lan)] = txt;
				});
				result[key] = arr;
			}

			//convert array
			else if (Array.isArray(obj[key])) {
				let _key = key;
				if (key === "li") {
					key = objname;
				}
				result[key] = convertArr(obj[_key], objname);
			}

			//convert { #text: 'xxx' } to 'xxx', ensure no other key
			else if (isText(obj[key])) {
				result[key] = txt(obj[key]);
			}

			//convert { #text: 'xxx' } to  key: 'xxx', when has other key
			else if (key == "#text") {
				result[objname] = txt(obj[key]);
			}

			//if is object, convert it
			else if (typeof obj[key] === "object") {
				result[key] = convertObj(obj[key], key);
			}

			//other case
			else {
				result[key] = txt(obj[key]);
			}
		}

		return result;
	};

	//convert xxx,xxx to array, and convert number to number
	const arr = function (arg) {
		const arr = arg.split("|");
		//if the array is number, convert it to number
		if (!isNaN(arr[0])) {
			return arr.map((item) => Number(item));
		}
		return arr;
	};

	const boolen = function (arg) {
		return arg === "true";
	};

	//convert { #text: 'xxx' } to 'xxx'
	const txt = function (obj) {
		let ctx;

		if (obj && obj["#text"]) ctx = obj["#text"];
		else if (typeof obj === "string") ctx = obj;
		else return obj;

		if (!isNaN(ctx)) return Number(ctx);
		else if (ctx.includes("|")) return arr(ctx);
		else if (groupmatch(ctx, "true", "false")) return boolen(ctx);
		return ctx;
	};

	const convertArr = function (arr, objname = "group") {
		const result = [];
		//console.log("converting array: ", arr, objname);

		arr.forEach((item) => {
			if (isText(item)) {
				result.push(txt(item));
			} else if (Array.isArray(item)) {
				result.push(convertArr(item, objname));
			} else if (typeof item === "object") {
				result.push(convertObj(item, objname));
			} else {
				result.push(item);
			}
		});

		return result;
	};

	return convertObj(obj, "root");
}
