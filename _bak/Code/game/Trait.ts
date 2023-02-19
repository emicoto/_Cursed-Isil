import { Dict } from "./types";

export interface Talent {
	name: [string, string?];
	des: [string, string?];

	effect?: Function;
}

export interface Trait extends Talent {
	order: number;
	group: string;
	conflict: string[];
	get: any;
	lose: any;

	onOrder?: Function;
	onSource?: Function;
	onFix?: Function;
}

export interface setTrait {
	name: string | string[];
	des: string | string[];
	order: number;
	group: string;
	conflict: string[];
	sourceEffect: Array<[string, number, string?]>;
}

export class Talent {
	public static data: Dict<Talent> = {};
	constructor(name: [string, string?], des: [string, string?]) {
		this.name = name;
		this.des = des;
		this.effect = function () {};
	}
	Effects(callback) {
		this.effect = callback;
		return this;
	}
}

export class Trait extends Talent {
	public static data: Dict<Trait> = {};
	public static init() {
		D.traits.forEach((obj) => {
			Trait.data[obj.name] = new Trait(obj as setTrait);
		});
		console.log(Trait.data);
	}
	public static set(name) {
		const traitdata = Object.values(Trait.data).filter((trait) => {
			return trait.name.includes(name);
		});

		if (traitdata) {
			return traitdata[0];
		} else {
			console.log("trait has not found:", name);
			return null;
		}
	}
	public static get(name: string, key: string = "", event?: string) {
		const traitdata = this.set(name);
		if (traitdata) {
			if (key == "") {
				return traitdata;
			}
			if (traitdata[key] && event) {
				return traitdata[key](event);
			}
			if (traitdata[key]) return traitdata[key];
			else {
				console.log("key has not found:", name, key);
				return null;
			}
		} else {
			return null;
		}
	}
	public static list(type) {
		return Object.values(Trait.data).filter((trait) => {
			return trait.group == type;
		});
	}
	constructor({ name, des, order, group, conflict, sourceEffect } = <setTrait>{}) {
		if (typeof name == "string") {
			name = [name, name];
		}
		if (typeof des == "string") {
			des = [des, des];
		}
		super(name as [string, string?], des as [string, string?]);
		this.order = order;
		this.group = group;
		this.conflict = conflict;
		this.get = {};
		this.lose = {};

		this.init(sourceEffect);
	}
	init(source) {
		if (source?.length) {
			source.forEach(([key, value, option]) => {
				if (option) {
					this.lose[key] = value;
				} else {
					this.get[key] = value;
				}
			});
		}
	}

	Order(callback) {
		this.onOrder = callback;
		return this;
	}
	Source(callback) {
		this.onSource = callback;
		return this;
	}
	Fix(callback) {
		this.onFix = callback;
		return this;
	}
}

function findConflic(source, conflicGroup) {
	let conflicArr = source.filter((val) => conflicGroup.includes(val));
	if (conflicArr.length < 2) {
		return source;
	} else {
		let index = random(conflicArr.length - 1);
		source.delete(conflicGroup);
		source.push(conflicArr[index]);
		return source;
	}
}

const modules = {
	name: "Trait",
	version: "1.0.0",
	des: "A module for managing and building traits and talents.",
	data: {
		trait: Trait.data,
		talent: Talent.data,
	},
	classObj: {
		Trait,
		Talent,
	},
	functions: {
		findConflic,
	},
	config: {
		globalfunction: true,
	},
};

declare function registModule(modules: any): boolean;
registModule(modules);
