//beauty=ALR*100+wearbuff+traitbuff
F.LoadCharacters = function(){
	for(let i in V.chara){
		let data = V.chara[i]
		V.chara[i] = Chara.load(data)
	}
}

F.setBeauty = function(chara){

    const traitbuff = function(chara){
        let buff = 1

        if(chara.talent.includes('破相')) buff = 0.1;        
        if(chara.talent.includes('雌雄莫辨')) buff *= 1.5;

		if(chara.race === 'elvin' && chara.talent.has('高等精灵')) buff *= 1.5;
		else if(chara.race === 'elvin') buff *= 1.1;

        if(chara.race === 'catvinx') buff *= 1.2
        if(chara.race === 'drawf') buff *= 0.5;
        if(chara.race === 'goblin') buff *= 0.3;
        if(chara.race === 'orc') buff *= 0.2;

        console.log(chara.name,'beautybuff',buff)

        return buff
    }

    const basic = function(chara){
        return chara.stats.ALR[1] * 100 * traitbuff(chara)
    }

    const factor = function(v, chara){
        let allure = 0

        for(const[k, c] of Object.entries(chara.equip)){
            if(c?.allure) allure += c.allure
        }

        return Math.floor(v*allure+0.5)
    }

    const v = Math.floor(basic(chara)+0.5)
    return v + factor(v, chara)
}

F.setScar = function(chara, part, type, count, times){
	const skin = chara.scars
	if(!times) times = 1;
	for(let i=0; i<times; i++){
		skin[part].push([type, count])
	}
	return ''
}

F.countSkin = function(chara, t){

	//对各皮肤图层上各伤痕计数器进行计算。
	const dolayer = function(layer, t){		
		for(let i =0; i < layer.length; i++){
			let k = layer[i];
			if(typeof k[1] == 'number'){
				k[1] -= t;
				if(k[1]<=0 && k[0] !== 'wound'){
					layer.splice(i,1);
					i--
				}
				else if(k[1]<= 0){
					k[0] = 'scar'
					k[1] = 'never';
				}
			}
		}
	}
	
	//记录结果
	const total = {}

	//统计伤痕, whip鞭痕, scar伤疤, wound创伤, pen笔迹, bruise淤痕
	const collect = (skin)=>{
		for(let i in skin){
			if(i == 'total' || i == 'detail') continue;

			let layer = skin[i]
			dolayer(layer, t)
			total[i] = {
				kiss: countArray(layer, 'kissmark'),
				scars: countArray(layer, 'scar'),
				whips: countArray(layer, 'whip'),
				wounds: countArray(layer, 'wound'),
				pen: countArray(layer, 'pen'),
				bruise: countArray(layer, 'bruise'),
			}
		}
		return total
	}

	const count = ()=>{
		const result = {
			kiss:[0,[]],
			scars: [0,[]],
			whips: [0,[]],
			wounds: [0,[]],
			pen: [0,[]],
			bruise: [0,[]],
		}
		for(let i in total){
			for(let k in total[i]){
				if(total[i][k] > 0 ){
					result[k][0] += total[i][k];
					
					const detail = [i, total[i][k]]
					result[k][1].push(detail)
				}

			}
		}
		return result
	}

	const skinlayer = chara.scars
	collect(skinlayer)
	chara.scars.total = count()

	return total
}

F.setWomb = function(chara){
    if(chara.pregnancy === undefined){
        chara.pregnancy = {}
    }

    chara.pregnancy = {
        circle:{
            type:'heat',
            basedays:random(6,9),
            rng:random(1,3),
            current:0,
            state:'normal',
            running:true,
            stages:[],
            ovulate:1,
            frng:random(1,3),
            lastCircleDays:0,
        },
        womb:{
            maxslot:4,
            state:'normal',
            awareOf:false,
            fetus:[],
        },
        bellysize:0,
        sperm:[],
    }

    const { circle } = chara.pregnancy
    const days = circle.basedays

    circle.lastCircleDays = circle.basedays
    circle.stages = [0, Math.floor(days/3+0.5), days+0.5]

    console.log(chara.pregnancy)
}

F.setParasite = function(chara){
    chara.parasite = {
        maxslot:6,
        type:'',
        eggs:[],
        active:false
    }
}


F.setRevealDetail = function(reveal, equip) {
		const { detail } = reveal;

		//--- 每次穿脱衣服时会初始化一次然后重新记录每个部位的裸露值。
		//--- 目前层次的装备低于现有值才更新。
		const set = function (key, wear) {
			if (detail[key] == undefined) return;

			if (wear.expose < detail[key].expose) {
				detail[key].expose = wear.expose;
			}
			if (wear.open < detail[key].block) {
				detail[key].block = wear.open;
			}
		};

		//--- 逐层解构
		const setReveal = function (wear) {
			const list = wear.cover;

			if (isValid(list) === false) return;

			list.forEach((k) => {
				if (D.coverlistB.includes(k)) {
					setReveal(D.covergroupB[k]);
				}
				if (D.coverlistA.includes(k)) {
					setReveal(D.covergroupA[k]);
				}
				if (D.skinlayer.includes(k)) {
					set(k, wear);
				}
			});
		};

		setReveal(equip.innerBt);
		setReveal(equip.innerUp);

		setReveal(equip.outfitBt);
		setReveal(equip.outfitUp);

		setReveal(equip.cover);

		reveal.parts = [];
		reveal.expose = 0;
		reveal.reveal = 0;

		for (const [k, c] of Object.entries(detail)) {
			if (c?.expose >= 2) reveal.parts.push(k);
		}

		reveal.parts.forEach((v) => {
			if (["face", "neck"].includes(v) === false) reveal.reveal += Math.floor(100 * (detail[v].expose / 3));
		});

		const risk = {
			genital: 2,
			anus: 1,
			breast: 1,
			private: 0.2,
			buttL: 0.2,
			buttR: 0.2,
		};

		Object.keys(risk).forEach((k) => {
			if (reveal.parts.includes(k)) {
				reveal.expose += risk[k] / (detail[k].expose == 3 ? 1 : 2);
			}
		});

		reveal.expose = Math.floor(reveal.expose);

		return reveal;
	}


F.initCharacters = function(){

V.chara = {}

for(let i in F.initChara){
	V.chara[i] = F.initChara[i]()
}

F.initCharaV()

for(let i in V.chara){
	if(i == 'm0') continue;

	F.fixBase(V.chara[i], 1)
	F.resetBase(V.chara[i])
}

V.master = 'm0';
V.pc = 'Ayres';
V.tc = 'Isil';

}

F.fixBase = function(chara,mode){
    const { base, stats, race, traits} = chara

    base.health[1] = Math.floor(stats.CON[1] * 50 * F.raceBonus(race, 'health') + 0.5)
    base.stamina[1] = Math.floor(stats.STR[1] * 50 * F.raceBonus(race, 'stamina') + 0.5)
    base.sanity[1] = stats.WIL[1] * 10
    base.mana[1] = stats.INT[1] * 25 * F.raceBonus(race, 'mana')

	traits.forEach( key =>{
		const trait = Trait.get(key);
		if(trait.onFix) trait.onFix(base);
	})

    if(mode){
        base.health[0] = base.health[1] 
        base.stamina[0] = base.stamina[1]
        base.sanity[0] = base.sanity[1]
        base.mana[0] = base.mana[1]

		F.fixStats(chara)
    }

}

F.fixStats = function(chara){
	const { stats, equip, race } = chara;

	stats.ATK[0] = Math.floor(stats.STR[1] * 2 * F.raceBonus(race, 'ATK') +0.5)
	stats.DEF[0] = Math.floor(stats.CON[1] * 2 * F.raceBonus(race, 'DEF')+0.5)
	stats.MTK[0] = Math.floor(stats.INT[1] * 2 * F.raceBonus(race, 'MTK')+0.5)
	stats.MDF[0] = Math.floor(stats.WIL[1] * 2 * F.raceBonus(race, 'MDF') +0.5)

}

F.raceBonus = function(race, type){
	const races = [
		'human','elvin','deamon','wolves',
		'drawf','goblin','catvinx','centaur',
		'orc','titan','dracon']
	const P = {
	//health+stamina+mana = 3.3
	//atk+def+mtk+mdf=4.4
	health:[
		1.1, 0.7, 1, 1.3,
		1, 0.8, 1, 1.3,
		1.6, 1.4, 1,
	],
	stamina:[
		1.1, 0.6, 1, 1.3,
		1.5, 2, 1, 2,
		1.6, 1.4, 1,
	],
	mana:[
		1.1, 2, 1.3, 0.5,
		0.8, 0.5, 1.3, 0.7,
		0.1, 0.5, 1.3,
	],
	ATK:[
		1.1, 0.5, 1, 1.4,
		1.2, 1, 1, 1.4,
		2, 1.4, 1,
	],
	DEF:[
		1.1, 0.6, 1, 1,
		1.6, 1, 0.8, 1.2,
		1.8, 1.5, 1,
	],
	MTK:[
		1.1, 1.8, 1.2, 0.8,
		0.6, 1, 1.4, 0.8,
		0.1, 0.5, 1,
	],
	MDF:[
		1.1, 1.5, 1.2, 1.2,
		1, 2, 1.2, 1,
		0.5, 0.6, 1.4,
	]
	}

	return P[type][races.indexOf(race)]
}

F.initCharaV = function(){
    for(let i in V.chara){
		if(i=='m0') continue;

		Object.defineProperty(Base, i, { get: function(){
			return V.chara[i].base
		}})

		Object.defineProperty(Stats, i, { get: function(){
			return V.chara[i].Stats
		}})
		
		Object.defineProperty(Palam, i, { get: function(){
			return V.chara[i].palam
		}})
		
		Object.defineProperty(Source, i, { get: function(){
			return V.chara[i].source
		}})
		
		Object.defineProperty(Sup, i, { get: function(){
			return V.chara[i].sup
		}})
		
		Object.defineProperty(Cflag, i, { get: function(){
			return V.chara[i].flag
		}})
		
		Object.defineProperty(Tsv, i, { get: function(){
			return V.chara[i].tsv
		}})

		Object.defineProperty(Exp, i, { get:function(){
			return V.chara[i].exp
		}})
		
    }
}


F.initAction = function(cid){
    Act[cid] = {}
	Using[cid] = {}
    if(cid == 'm0' ){
        Act[cid].tentacles = [];
		Using[cid].tentacles = [];
		for(let i=0; i < V.cursedLord.abl.num + 2; i++){
			Act[cid].tentacles.push({act:'', tc:'', use:''})
			Using[cid].tentacles.push({act:'', tc:'', use:'' })
		}
    }
    else{
        let list = ['handR', 'handL' ,'mouth', 'penis', 'vagina', 'anal', 'foot']
		let listb = ['breast', 'critoris', 'urin', 'ears', 'neck', 'butts', 'nipple', 'thighs', 'abdomen'].concat(list)

        list.forEach((k)=>{
            Act[cid][k] = { tc:'', act:'', use:'' }; // 作为actor执行命令时判定点
        })
		listb.forEach((k)=>{
			Using[cid][k] = { act:'', ac:'' }; // 作为目标对象进行部位占用检测，同时也是持续动作的判定点？
		})
    }
}