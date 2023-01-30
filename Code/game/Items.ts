import {
	clothcategory,
	ItemCategory,
	Dict,
	shop,
	clothlineup,
	clothtags,
	coverparts,
	diff,
	gender,
	basekey,
	statskey,
	palamkey,
	effectpalam,
} from "./types";

declare var Db: typeof window.Db;
declare var V: typeof window.V;
declare function getByPath(obj: any, path: string): any;

//各物品对个属性的影响。正数为加，负数为减，0为不变
//a为加数，m为乘数, t为方法，add为加，mul为乘，fix为固定值，set为设置
export type ItemStats = Dict<number, statskey>;
export type ItemPalam = Dict<itemEffect, basekey | palamkey>;

export type itemEffect = { a?: number; m?: number; t?: itemMethod };
export type itemMethod = "add" | "mul" | "set" | "fix";

export interface Item {
	id: string; //在库中所登记的id
	name: [string, string?]; //中文名，英文名。英文名可选，若无则为中文名
	des: [string, string?]; //中文描述，英文描述。英文描述可选，若无则为中文描述
	type: ItemCategory; //物品类型

	category?: string; //物品子类型
	group?: string; //物品组
	tags?: string[]; //物品标签
	shop?: shop[]; //入手途径或商店种类

	price?: number; //物品价格
	durable?: [number, number]; //耐久度，最大耐久度

	stats?: ItemStats; //物品对个属性的影响
	effect?: ItemPalam; //物品各个状态条的影响
}
export class Item {
	public static newId(type: string, cate?: string) {
		const len = Db[type].length;
		if (cate) {
			return `${type.toUpperCase()[0]}${cate}_${len}`;
		} else {
			return `${type}_${len}`;
		}
	}
	public static new(name: [string, string?], des: [string, string?], type: ItemCategory, cate: string = "") {
		let data = getByPath(Db, type + cate ? `.${cate}` : "");
	}
	constructor(
		name: [string, string?],
		des: [string, string?] = name,
		type: ItemCategory = "Items",
		cate: string = ""
	) {
		this.id = Item.newId(type, cate);
		this.name = name;
		this.des = des;
		this.type = type;
		this.category = cate;
	}
	Price(num: number) {
		this.price = num;
		return this;
	}
	Durable(num: number) {
		this.durable = [num, num];
		return this;
	}
	Shop(...shops: shop[]) {
		this.shop = shops;
		return this;
	}
	Tags(...tags: string[]) {
		this.tags = tags;
		return this;
	}

	Stats(...stats: Array<[statskey, number]>) {
		stats.forEach(([key, add]) => {
			this.stats[key] = add;
		});
		return this;
	}
	Effect(...palam: Array<[palamkey | basekey, itemMethod, number, number?]>) {
		palam.forEach(([key, t, a, m]) => {
			this.effect[key] = { t, a, m };
		});
		return this;
	}
}

export interface Clothes extends Item {
	id: string; //在库中所登记的id,
	uid?: string; //购买时生成的绝对id，6位数字

	type: ItemCategory;
	category: clothcategory;

	name: [string, string?];
	des: [string, string?];
	shop: shop[];

	gender: gender;
	tags: clothtags[];

	price: number;

	color: [string?, string?]; //默认色,颜色名字
	cover: coverparts[]; //覆盖部位

	expose: 0 | 1 | 2 | 3; //暴露度。0=无，1=若隐若现 2=看的清除但有阻隔 3=完全暴露
	open: 0 | 1 | 2 | 3; //开口。 0=必须脱下，1=敏感区附近有纽扣or纽带可解开，2=敏感区附近有开口 3=完全暴露

	allure: number; //魅力加值，乘数, 范围在 +0.05-0.5 之间
	defence: number; //防御加值，加数, 范围在 0-6 之间

	cursed?: 0 | 1; //是否诅咒物品。如果是则无法脱下
}

export class Clothes extends Item {
	constructor(cate: clothcategory, name: [string, string?], des: [string, string?], gender: gender = "n") {
		super(name, des, "Clothes", cate);
		this.gender = gender;
		this.uid = "0";

		this.tags = [];
		this.price = 0;
		this.color = [];
		this.cover = [];

		this.expose = 3;
		this.open = 3;

		this.allure = 0;
		this.defence = 0;
	}
	UID() {
		this.uid = random(100000, 999999).toString();
		return this;
	}
	Color(colorcode: string, colorname: string) {
		this.color = [colorcode, colorname];
		return this;
	}
	Cover(...parts: coverparts[]) {
		this.cover = parts;
		return this;
	}
	Set(key, value) {
		this[key] = value;
		return this;
	}
}

Object.defineProperties(window, {
	Item: { value: Item },
	Clothes: { value: Clothes },
});
