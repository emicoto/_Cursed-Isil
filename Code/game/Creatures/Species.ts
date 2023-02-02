import { Dict, cycleInfo, creaturetype, bodypart, existency, P, sexStats, genderFull } from "../types";
declare function groupmatch(arg, ...args): boolean;

export interface Species {
	type: "chara" | "monster";

	name: string[]; //CN, EN
	des: string[]; //CN, EN

	gender?: genderFull[];
	talent?: Array<{ name: string; rate: number }>; //species talents
	buffs?: Dict<number>; //race buffs

	body?: any; //configurations of body
	bodysize?: [number, number]; //bodysize or bodysize range
	//size: 0=tiny 137~147, 1=small 147~164, 2=normal 164~174, 3=tall 174~184, 4=verytall 184~200, 5=huge 200~220, 6=giant 220+

	//body comfotable temperature
	tempture?: {
		low: number; //the lowest comfortable temperature
		high: number; //the highest comfortable temperature
		best: number; //the best comfortable temperature
		current: number; //the current comfortable temperature
	};

	cycle?: cycleInfo; // menstrual cycle and pregnancy settings

	//avatar configuration
	avatar?: {
		headtype?: string[];
		bodytype?: string[];
		eartype?: string[];
		tailtype?: string[];
		wingtype?: string[];
		skincolor?: string[];
	};

	options?: any[]; // any other options
	initFunc?: string[]; // path to the init function
}

export class Species {
	constructor({ type, name, des, gender, talent, buffs, tempture, bodysize, bodygroup, cycle, avatar }) {
		this.type = type;
		this.name = name;
		this.des = des;
		this.gender = gender;
		this.talent = talent;
		this.buffs = buffs;
		this.tempture = tempture;
		this.bodysize = [bodysize.min, bodysize.max];

		if (cycle) this.cycle = cycle;
		if (avatar) this.avatar = avatar;

		this.initBody(bodygroup);
	}

	initBody(body) {
		this.body = {};
	}
}

const pos = {
	s: "side",
	l: "left",
	r: "right",
	f: "front",
	b: "back",
	t: "top",
	d: "bottom",
	c: "center",
};

function initBody(body) {
	const bodytype = body.type;

	//make sure the values only has number or string
	const noMoreObj = (obj) => {
		for (const [key, value] of Object.entries(body)) {
			if (typeof value === "object") return false;
		}
		return true;
	};

	//configure body from the bodygroup, when the bodygroup is object
	const configureObj = (obj, toptype) => {
		//if has type, that mean the all parts are the same type
		const grouptype = obj.type || toptype || bodytype;
		const parts = {};

		//loop through the object
		for (const [key, value] of Object.entries(obj)) {
			//if the key is pos, side, count, type, then continue
			if (groupmatch(key, "pos", "side", "count", "type")) continue;
			//
			//if no more object, then set the body
			if (noMoreObj(value)) {
				if (!value?.type) {
					value.type = grouptype;
				}
				parts[key] = setBody(value);
			}

			//if is array, then set the array
			else if (Array.isArray(value)) {
				parts[key] = configureArr(value, obj);
			}

			//if is object, then configure the object
			else if (typeof value === "object") {
				parts[key] = configureObj(value, grouptype);
			}

			//if is string, then set the body
			else if (typeof value === "string") {
				parts[key] = setBody({ pos: obj?.pos, side: obj?.side, count: obj?.count, type: grouptype, name: key });
			}
		}
		return parts;
	};

	//configure bodygroup from array, obj is the parent object
	const configureArr = (arr, obj) => {
		const parts = [];
		arr.forEach((a) => {
			if (typeof a === "string") {
				parts.push(setBody({ name: a, pos: obj.pos, side: obj.side, count: obj.count, type: obj.type }));
			}
			if (typeof a === "object" && !Array.isArray(a)) {
				parts.push(configureObj(a, obj.type));
			}
			if (Array.isArray(a)) {
				parts.push(configureArr(a, obj));
			}
		});
	};

	//set the bodygroup
	const setBody = (obj) => {
		const parts = [];
		//if has many parts
		if (obj.count && obj.count > 1) {
			let side;

			if (obj.side) side = obj.side.split("/");
			else side = new Array(obj.count).fill("c");

			side.forEach((s) => {
				parts.push(setPart(obj, s));
			});
		}
		//if has only one part
		else {
			parts.push(setPart(obj));
		}
		return parts;
	};

	//set the body part
	const setPart = (obj, side?) => {
		const part: any = { name: obj.name, pos: pos[obj.pos], type: obj.type };
		//if has side
		if (obj?.side) part.side = pos[obj.side];
		if (side) part.side = pos[side];

		//if has dp
		if (obj?.dp) part.dp = obj.dp;
		//else then set the default dp
		else part.dp = [10, 10];
		return part;
	};

	return configureObj(body, body.type);
}
