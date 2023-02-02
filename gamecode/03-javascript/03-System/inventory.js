F.getItems = function (cid, itemId) {
	const item = Items.get(itemId);
	if (!item) return false;

	const inv = C[cid].inventory;
	inv.find((i) => i.id === itemId) ? inv.find((i) => i.id === itemId).amount++ : inv.push({ id: itemId, amount: 1 });
};

F.useItem = function (cid, itemId) {
	const item = Items.get(itemId);
	if (!item) return false;

	const inv = C[cid].inventory;
	const index = inv.findIndex((i) => i.id === itemId);
	if (index === -1) return false;

	inv[index].amount--;
	if (inv[index].amount === 0) inv.splice(index, 1);

	return item;
};

F.listupItem = function (cid) {
	const inv = C[cid].inventory;
	const list = inv.map((i) => Items.get(i.id).name[0] + " x " + i.amount).join("");
	return list;
};
