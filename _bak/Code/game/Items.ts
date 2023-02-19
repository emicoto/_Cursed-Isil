import {
	clothcategory,
	ItemGroup,
	Dict,
	shop,
	clothtags,
	coverparts,
	gender,
	basekey,
	statskey,
	palamkey,
	potionType,
	ItemCategory,
	weaponType,
	materialType,
	accesoryType,
} from "./types";

declare var Db: typeof window.Db;
declare function random(min: number, max: number): number;

//各物品对个属性的影响。正数为加，负数为减，0为不变
//v为影响值，m为影响方法。add为加，mul为乘，fix为固定值
export type ItemStats = Dict<number, statskey>;
export type ItemPalam = Dict<itemEffect, basekey | palamkey>;

export type itemEffect = { v: number; m: itemMethod };
export type itemMethod = "add" | "mul" | "fix";
export type itemEffectType = "recover" | "sustain" | "onetime" | "change" | "fix" | "permanent";
export interface Items {
	id: string; //在库中所登记的id

	name: [string, string?]; //中文名，英文名。英文名可选，若无则为中文名
	des: [string, string?]; //中文描述，英文描述。英文描述可选，若无则为中文描述
	group: ItemGroup; //物品组

	category?: ItemCategory | materialType | accesoryType | potionType | weaponType | clothcategory; //物品类型
	type?: string; //物品分类
	tags?: string[]; //物品标签
	shop?: shop[]; //入手途径或商店种类

	price?: number; //物品价格
	durable?: [number, number]; //耐久度，最大耐久度

	stats?: ItemStats; //物品对个属性的影响
	source?: ItemPalam; //物品对各个状态条的影响
	method?: itemEffectType; //影响方法
}

export interface Potion extends Items {
	group: "items";
	category: "potion";
	type: potionType;

	daily?: number; //每日有效使用次数
	lifetime?: number; //终生有效使用次数
	effectsDecrease?: number; //每次使用后效果减少的百分比
	specialEffects?: string; //特殊效果
}

export interface SexToy extends Items {
	group: "accessory";
	category: "sextoy";

	switch?: boolean; //开关状态
	switchable?: boolean; //是否可开关
	specialEffects?: string; //特殊效果
}

export interface Recipies {
	//合成配方
	id: string; //合成配方id
	resultItemId: string; //合成结果物品id
	result: number; //合成结果数量

	requireLv: number; //需求最低技能等级
	require: string[]; //合成所需物品

	byproduct?: Array<[string, number]>; //副产物
	byproductChance?: number; //副产物出现几率

	failProduct?: Array<[string, number]>; //失败产物

	rate: number; //合成成功率
}

export class Recipies {
	public static new(id, { resultItemId, result, require, rate }) {
		Db[id].set(id, new Recipies(resultItemId, result, require, rate));
	}
	public static getByName(itemname: string) {
		const itemId = Items.getByName("items", itemname).id;
		return Array.from(Db.Recipies).find((recipie: Recipies) => recipie.resultItemId === itemId);
	}
	public static getBySrcName(itemname: string) {
		const itemId = Items.getByName("items", itemname).id;
		return Array.from(Db.Recipies).find((recipie: Recipies) => recipie.require.includes(itemId));
	}
	constructor(itemId: string, result: number, requires: string[], rate: number) {
		this.id = Db.Recipies.length;
		this.resultItemId = itemId;
		this.result = result;
		this.require = requires;
		this.rate = rate;
	}
}

export class Items {
	public static newId(group: string, name: string, cate?: string) {
		if (cate) {
			return `${group}_${cate[0]}.${name[1].replace(/\s/g, "")}`;
		} else {
			return `${group}_${name[1]}`;
		}
	}
	public static getByName(group: ItemGroup, name: string): Items | undefined {
		return Array.from(Db[group]).find((item: Items) => item[1].name[0] === name || item[1].name[1] === name) as Items;
	}
	public static getTypelist(
		group: ItemGroup,
		cate: ItemCategory | materialType | accesoryType | potionType | weaponType | clothcategory
	): Items[] | undefined {
		return Array.from(Db[group]).filter((item: Items) => item[1].category === cate) as Items[];
	}
	public static get(Itemid): Items | undefined {
		const itemGroup = Itemid.split("_")[0];
		return Array.from(Db[itemGroup]).find((item: Items) => item[0] === Itemid) as Items;
	}
	public static init() {
		D.itemGroup.forEach((group) => {
			Db[group] = new Map();
		});
	}
	constructor(
		name: [string, string?],
		des: [string, string?] = name,
		group: ItemGroup = "items",
		cate: ItemCategory | materialType | accesoryType | potionType | weaponType | clothcategory = ""
	) {
		this.id = Items.newId(group, cate);
		this.name = name;
		this.des = des;
		this.group = group;
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
	Source(...palam: Array<[palamkey | basekey, itemMethod, number]>) {
		palam.forEach(([key, m, v]) => {
			this.source[key] = { m, v };
		});
		return this;
	}
	Method(method: itemEffectType) {
		this.method = method;
		return this;
	}
}

export class Potion extends Items {
	constructor(name: [string, string?], des: [string, string?], type: potionType) {
		super(name, des, "items", "potion");
		this.type = type;
	}
	Daily(num: number) {
		this.daily = num;
		return this;
	}
	Lifetime(num: number) {
		this.lifetime = num;
		return this;
	}
	EffectsDecrease(num: number) {
		this.effectsDecrease = num;
		return this;
	}
	SpecialEffects(str: string) {
		this.specialEffects = str;
		return this;
	}
}

export class SexToy extends Items {
	constructor(name: [string, string?], des: [string, string?]) {
		super(name, des, "accessory", "sextoy");
	}
	Switchable() {
		this.switchable = true;
		return this;
	}
	SpecialEffects(str: string) {
		this.specialEffects = str;
		return this;
	}
}

export interface Clothes extends Items {
	id: string; //在库中所登记的id,
	uid?: string; //购买时生成的绝对id，6位数字
	group: "clothes"; //物品组
	category: clothcategory;

	name: [string, string?];
	des: [string, string?];
	shop: shop[];

	gender: gender;
	tags: clothtags[];

	color: [string?, string?]; //默认色,颜色名字
	cover: coverparts[]; //覆盖部位

	expose: 0 | 1 | 2 | 3; //暴露度。0=无，1=若隐若现 2=看的清除但有阻隔 3=完全暴露
	open: 0 | 1 | 2 | 3; //开口。 0=必须脱下，1=敏感区附近有纽扣or纽带可解开，2=敏感区附近有开口 3=完全暴露

	allure: number; //魅力加值，乘数, 范围在 +0.05-0.5 之间
	defence: number; //防御加值，加数, 范围在 0-6 之间

	cursed?: 0 | 1; //是否诅咒物品。如果是则无法脱下

	img?: string[]; //图片路径。如果有多个图片，第一个为默认图片，后面的为变化差分
}

export class Clothes extends Items {
	constructor(cate: clothcategory, name: [string, string?], des: [string, string?], gender: gender = "n") {
		super(name, des, "clothes", cate);
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

const modules = {
	name: "Items",
	version: "1.0.0",
	des: "A module for items.",
	classObj: {
		Items,
		Clothes,
		Potion,
		SexToy,
	},
};

declare function registModule(modules: any): boolean;
registModule(modules);
