const traitdata = {};

window.findConflic = function (source, conflicGroup) {
	let conflicArr = source.filter((val) => conflicGroup.includes(val));
	if (conflicArr.length < 2) {
		return source;
	} else {
		let index = random(conflicArr.length - 1);
		source.delete(conflicGroup);
		source.push(conflicArr[index]);
		return source;
	}
};

class Trait {
	static get(name, key = null, event) {
		if (!key) return Trait.data[name];
		if (event) return Trait.data[name][key](event);
		else if (key && Trait.data[name][key]) return Trait.data[name][key];
		else return;
	}
	static list(type) {
		const grouplist = [];

		if (type == "group") {
			Object.values(Trait.data).forEach((data) => {
				if (grouplist.includes(data.group) == false) grouplist.push(data.group);
			});
			return grouplist;
		}

		return Object.values(Trait.data).filter((data) => data.group == type);
	}
	static set(name) {
		return Trait.data[name];
	}

	static init() {
		D.traits.forEach((obj) => {
			Trait.data[obj.name] = new Trait(obj);
		});
		console.log(Trait.data);
	}

	constructor({ name, des = "", order = 0, sourceEffect = [], group = "全部" } = {}) {
		this.name = name;
		this.des = des;
		this.order = order;
		this.group = group;

		this.get = {};
		this.lose = {};

		if (sourceEffect.length) {
			sourceEffect.forEach((set) => {
				if (set[2]) {
					this.lose[set[0]] = set[1];
				} else {
					this.get[set[0]] = set[1];
				}
			});
		}
	}

	Effect(callback) {
		this.effect = callback;
		return this;
	}
	setFix(callback) {
		this.onFix = callback;
		return this;
	}
	setOrder(callback) {
		this.onOrder = callback;
		return this;
	}
	setSource(callback) {
		this.onSource = callback;
		return this;
	}
	setRest(callback) {
		this.onRest = callback;
		return this;
	}
}

window.Trait = Trait;
Object.defineProperties(Trait, {
	data: {
		get: function () {
			return traitdata;
		},
	},
});

//traits 主要特征
//talent 能力,天赋
Trait.init();

const initials = ["M", "B", "C", "U", "V", "A"];

Trait.set("M体质").setSource((cid, ...args) => {
	initials.forEach((k) => {
		if (Source[cid][`pa${k}`] > 0) {
			Source[cid][`es${k}`] += Source[cid][`pa${k}`] * 0.2;
		}
	});
});

Trait.set("M倾向").setSource((cid, ...args) => {
	initials.forEach((k) => {
		if (Source[cid][`pa${k}`] > 0) {
			Source[cid][`es${k}`] += Source[cid][`pa${k}`] * 0.3;
		}
	});
	return 1;
});

/* 
Trait.set('A名器')
.onSource = (cid, ...args)=>{
	if(action[pc].penis.tc == cid && action[pc].penis.use == 'anal'){
		Source[pc].esC *= 1.5
	}
}
*/

/*
Trait.set('易伤体质')
.effect = (event, ...args)=>{
	if(event == 'getScar'){
		T.scarTimeMultip = 2
	}
}
*/

Trait.set("理智")
	.setFix((base, ...args) => {
		base.sanity[1] *= 1.2;
	})
	.setRest((cid, ...args) => {
		const list = ["fear", "mortify", "humilate", "depress", "resist", "uncomfort", "angry"];
	})
	.setOrder((cid, ...args) => {
		if (F.weaker(target, player)) return 10;
		else if (F.baseCheck(target, "health", 0.3) || F.baseCheck(target, "stamina", 0.1)) return 15;
		else return 2;
	});
