// 分析传输进来的文字是否存在多余空格，如果存在空格则清除多余空格。
function removeExtraSpaces(text: string): string {
	return text.replace(/\s+/g, " ").trim();
}
