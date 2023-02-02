Items.init();

$.getJSON("./json/items.json", function (data) {
	let items = data;
	console.log(items); // {name: "item1", value:

	items.forEach((item) => {
		const { name, group, category, type, des, tags, source, method } = item;
		const id = Items.newId(group, name, category);
		Db[group].set(id, new Items(name, des, group, category));

		const idata = Db[group].get(id);
		idata.type = type;
		idata.tags = tags;
		idata.source = {};
		if (source) {
			for (let i in source) {
				if (typeof source[i] === "number") {
					idata.source[i] = { v: source[i], m: method };
				} else {
					idata.source[i] = source[i];
				}
			}
		}
	});

	console.log(Db); // Map(2) {1 => Items, 2 => Items}
});
