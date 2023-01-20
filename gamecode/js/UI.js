ui.replace = function (label, html) {
	new Wikifier(null, `<<replace #${label}>>${html}<</replace>>`);
};

ui.delink = function () {
	$("#contentMsg a").remove();
	V.selectCom = 0;
	return "";
};
DefineMacroS("resetLink", ui.delink);
