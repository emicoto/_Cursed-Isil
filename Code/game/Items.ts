import { clothcategory, ItemCategory, Dict, shop, clothlineup, clothtags, coverparts, diff, gender } from "./types";

declare var Db: typeof window.Db;
declare var V: typeof window.V;

export interface Item {
	id: string;
	name: [string, string?];
	des: [string, string?];
	type: ItemCategory;
	price?: number;
	durable?: number;
	maxdurable?: number;
}

export class Item {
	public static newId(categ) {
		const len = Db[categ].length;
		return `${categ}_${len}`;
	}
	public static new() {}
	constructor(name: [string, string?], des: [string, string?], type: ItemCategory) {
		this.id = Item.newId(type);
		this.name = name;
		this.des = des;
		this.type = type;
	}
}

export interface Clothes extends Item {
	id: string; //在库中所登记的id,
	uid?: 0; //购买时生成的绝对id，9位数字

	type: ItemCategory;
	category: clothcategory;

	name: [string, string?];
	des: [string, string?];
	shop: shop[];

	gender: gender;
	tags: clothtags[];

	price: number;

	color: [string?, string?]; //默认色,颜色名字
	durable: number;
	maxdurable: number;

	cover: coverparts[]; //覆盖部位

	expose: 0 | 1 | 2 | 3; //暴露度。0=无，1=若隐若现 2=看的清除但有阻隔 3=完全暴露
	open: 0 | 1 | 2 | 3; //开口。 0=必须脱下，1=敏感区附近有纽扣or纽带可解开，2=敏感区附近有开口 3=完全暴露

	allure: number; //魅力加值，乘数
	defence: number; //防御加值，加数

	cursed?: 0 | 1; //是否诅咒物品。如果是则无法脱下
	effect?: Array<any>; //衣服特殊效果。['functionname',args...]
}

export class Clothes extends Item {
	constructor(type: clothcategory, name: [string, string?], des: [string, string?], gender: gender = "n") {
		super(name, des, "Clothes");
	}
}

Object.defineProperties(window, {
	Item: { value: Item },
});
