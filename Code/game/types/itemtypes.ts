export type ItemGroup =
	| "weapon" //武器
	| "shield" //盾牌或护盾
	| "armor" //盔甲
	| "clothes" //衣服
	| "accessory" //饰品
	| "items" //道具物品
	| "material"; //纯素材

export type ItemCategory = "foods" | "potion" | "drink" | "drug" | "misc" | "";

export type materialType = "metal" | "wood" | "stone" | "leather" | "cloth" | "herb" | "gem" | "other";

export type accesoryType = "facemask" | "glasses" | "earring" | "chest" | "sextoy";

export type potionType = "heal" | "restore" | "buff" | "debuff" | "misc";

export type weaponType = "sword" | "gun" | "bow" | "staff" | "hammer" | "spear";

export type shieldType = "shield" | "guard";

export type ItemTags = "consumable" | "craftable" | "wrapable" | "sweet" | "";
