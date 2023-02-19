//traits 主要特征
//talent 能力,天赋
Trait.init();

const initials = ["M", "B", "C", "U", "V", "A"];

Trait.set("M体质").Source((cid, ...args) => {
	initials.forEach((k) => {
		if (Source[cid][`pa${k}`] > 0) {
			Source[cid][`es${k}`] += Source[cid][`pa${k}`] * 0.2;
		}
	});
});

Trait.set("M倾向").Source((cid, ...args) => {
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
	.Fix((base, ...args) => {
		base.sanity[1] *= 1.2;
	})
	.Order((id, ...args) => {
		if (Cond.isWeaker(tc, pc)) return 10;
		else if (Cond.baseLt(tc, "health", 0.3) || Cond.baseLt(tc, "stamina", 0.1)) return 15;
		else return 2;
	});
