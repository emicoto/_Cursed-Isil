import {
	creaturetype,
	genderFull,
	race,
	Dict,
	P,
	statskey,
	appearance,
	basekey,
	palamkey,
	ablkey,
	sblkey,
	sexStats,
} from "../types";

export interface Creature {
	type: creaturetype;
	id?: string;
	cid?: string;
	name: string;
	gender: genderFull;
	race: race;
	traits: string[];
	talent: string[];
	skill: string[];

	stats: Dict<P, statskey>;
	appearance?: appearance;
	base: Dict<P, basekey>;
	palam: Dict<P, palamkey>;

	source: Dict<number>;
	state: string[];
	mood: number;

	tsv: any;
	abl: Dict<{ lv: number; exp: number }, ablkey>;
	sbl: Dict<number, sblkey>;
	sexstats: Dict<sexStats>;

	equip?: any;
}
