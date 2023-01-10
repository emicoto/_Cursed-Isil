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
	}
}

window.database = {};
window.gameutils = {};
window.gamedata = {};
window.languagedata = {};

Object.defineProperties(window, {
	G: {
		get: function () {
			return window.game;
		},
	},

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
			return window.gameutils;
		},
	},
});

console.log(lan("游戏开始", "game start"));
