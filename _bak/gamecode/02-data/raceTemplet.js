const racesheet = {
	name: "high-elf",

	// 0=tiny(120~140), 1=small(140~160), 2=normal(160~172), 3=tall(172~182),4=supertall(182~192),5=extratall(192~210),6=giant(210~230),7=supergaint(230~300)
	avatarinfo: {
		head: "human",
		headtype: ["round", "square", "pointy"],
		ears: "elf",
		body: "human",
		skincolor: ["health", "white", "pale", "pink"],
		leg: "human",
		/*
        tail:'',
        wing:'',
        */
		/*
        hairstyle:[front,back],
        hairlength:[front,back],
        haircolor:colorcode,

         */
	},

	bodyshape: {
		size: [1, 4],
		breast: [0, 8],
		hips: [0, 6],
	},

	body: {
		//type:natural/artifact/chimera/parasite/slime/fog/hideable;
		/*  adj对指定部位进行微调， 有hideable才添加到指定的部位设置里
        其他种族部位：tailbody, tail ,wings,horns, tentacles,
     */
		type: "natural",
		group: {
			head: ["face", "eyeL", "eyeR", "nose", "mouth", "earL", "earR"],
			torso: ["shoulder", "breast", "abdomen", "armL", "armR", "legL", "legR"],
			organ: ["penis", "vagina", "womb", "anus", "urin"],
		},
		/*adj:{
            organ:'slime',
            penis:'natural/hideable',
        },*/
	},

	bodyadjusment: function (newbody) {
		const bodygroup = Object.keys(this.body.group);
		const obj = this.body.adj;

		for (let i in obj) {
			if (bodygroup.includes(i)) {
				const list = this.body.group[i];
				list.forEach((v) => {
					newbody[v] = obj[i];
				});
			} else {
				newbody[i] = obj[i];
			}
		}
	},

	genitals: {
		//normal, horse, deamonic, tentacle, knot, barbs, bumps, sharp, drill
		pshape: "normal",
		//normal, cute, suji, pretty, raffle, deamonic, monster,
		vshape: "normal",

		psize: [0, 4],
		//长度: 0=micro,1=tiny,2=small,3=average, 4=big,5=large, 6=huge, 7=deamonic, 8=horse, 9=giant
		//实际计算：长度=(bit+1)*4.6 +rng, 直径=长度/4.28 +rng

		bsize: [1, 4],
		//大小: 0=mini, 1=tiny, 2=small, 3=average, 4=big, 5=large, 6=massive, 7=huge, 8:gigantic, 9:enormous

		vsize: [0, 4],
		//实际计算：(bit+1)*1.46 +rng

		teste: true,
		clitoris: true,

		futaHasTeste: false, //双性人是否有阴囊/阴蒂
		futaHasclitoris: false,
	},

	warmth: [16, 25],

	pregnancy: {
		type: "menst",
		basedays: 28,
		rng: 4,

		//月经周期/安全期= stages[1]-stages[0], 排卵/危险期=stages[last]-stages[last-1]， 中间是准备期。
		stages: [0, 5, 14, 28],

		ovulate: 1, //单次排卵数
		frng: 1, //排卵乱数
		//wormslot=bodysize*2, parasiteslot=bodysize*3。
	},

	adjust: {
		STR: 0,
		CON: 0,
		DEX: 0,
		SPD: 0,
		WIL: 0,
		INT: 0,
		PSY: 0,
		ALR: 0,
	},

	traits: ["快速适应", "快速学习"],
	traitpoints: 1, //种族特征可用点
};

const PlayerSpecies = ["human", "high-elf"];

const NPCSpecies = [
	"human",
	"elvins",
	"high-elf",
	"drawf",
	"goblin",
	"orc",
	"wolves",
	"deamon",
	"centra",
	"titan",
	"kijin", //'slimen','jellish','dracon','linlog','lepios
];
