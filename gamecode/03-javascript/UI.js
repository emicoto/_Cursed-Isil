Ui.replace = function (label, html) {
	new Wikifier(null, `<<replace #${label}>>${html}<</replace>>`);
};

Ui.delink = function () {
	$("#contentMsg a").remove();
	V.selectCom = 0;
	return "";
};
DefineMacroS("resetLink", Ui.delink);

Ui.showhtml = function (tag, menu) {
	if (menu.length) {
		$(`#${tag}`).removeClass("hidden");
		Ui.replace(tag, menu.join(""));
	} else {
		$(`#${tag}`).addClass("hidden");
	}
};
