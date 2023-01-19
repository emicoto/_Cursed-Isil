import "./function";
import { lan } from "./function";
import "./Items";
import "./character";

declare global {
	interface Window {
		gameutils;
		database;
		gamedata;
		languagedata;
		game;
		Db; //物品数据
		V;
		L;
		D; //游戏资料
		G;
		F;
		lan;
		lang;
		Act;
		Using;
		ui; // ui control
		p; // text/ img/ buttons printer
		cond; //condition short cut
	}
}

window.database = {};
window.gameutils = {
	game: {},
	condition: {},
	UI: {},
	printer: {},
	fun: {},
	charafix: {},
};
window.gamedata = {}; //游戏资料
window.languagedata = {};

Object.defineProperties(window, {
	D: {
		get: function () {
			return window.gamedata;
		},
	},

	Db: {
		get: function () {
			return window.database;
		},
	},

	L: {
		get: function () {
			return window.languagedata;
		},
	},

	F: {
		get: function () {
			return window.gameutils.fun;
		},
	},
	ui: {
		get: function () {
			return window.gameutils.ui;
		},
	},
	P: {
		get: function () {
			return window.gameutils.printer;
		},
	},
	cond: {
		get: function () {
			return window.gameutils.condition;
		},
	},
	G: {
		get: function () {
			return window.gameutils.game;
		},
	},
	charafix: {
		get: function () {
			return window.gameutils.chara;
		},
	},
});

console.log(lan("游戏开始", "game start"));
