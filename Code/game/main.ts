import "./function";
import { lan } from "./function";
import "./Items";
import "./character";
import "./Map";
import "./mapdata";
import "./Trait";

declare global {
	interface Window {
		loadOrder; //加载顺序
		settings; //设置
		data; //数据
		database; //数据库
		utils; //工具
		documentGenerator; //文档生成器
		modules; //模块
		config; //配置
		UIControl; //UI控制
		conditions; //条件
		fixers; //修复器
		language; //语言
		initializations; //初始化

		D; // data;
		Db; // database;
		F; // utils;
		L; // language;
		M; // modules;
		P; // documentGenerator;
		Cond; // conditions;
		Fix; // fixers;
		Init; // initializations;
		Ui; // UIControl;
		scEra;
	}
}
declare var fs: typeof import("fs");
declare function defineGlobalShortcuts(modules);

console.log(lan("游戏开始", "game start"));

console.log("utils loaded, the game is", window.game);
console.log("package.json", fs.readFileSync("./package.json", "utf8"));
console.log("config.json", fs.readFileSync("./public/config.json", "utf8"));

$.getJSON("./config.json", function (data) {
	console.log("load config", data);
});
