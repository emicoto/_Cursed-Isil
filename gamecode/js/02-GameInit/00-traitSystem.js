
const traitdata = {};

class Trait {
	static get(name, key = null, event) {
		if (!Trait.data[name]) return
		if (!key || !Trait.data[name][key]) return Trait.data[name]
		if (event) return Trait.data[name][key](event)
		else return Trait.data[name][key]
	}

	static set(name) {
		return Trait.data[name];
	}

	static init() {
		D.traits.forEach(({name, des, order, sourceEffect}) => {
			Trait.data[name] = new Trait(name, des, order, sourceEffect)
		})
		console.log(Trait.data)
	}

	constructor(name, des = '', order = 0, source = []) {
		this.name = name;
		this.des = des;
		this.order = order;

		this.get = {};
		this.lose = {};

		if(source){
			source.forEach( set=>{
				if(set[2]){
					this.lose[set[0]] = set[1]
				}
				else{
					this.get[set[0]] = set[1]
				}
			})
		}

		this.onSource = (arg, ...args)=>{};
		this.onRest = (arg, ...args)=>{};
		this.onFix = (arg, ...args)=>{};
		this.onOrder = (arg, ...args)=>{};
		this.effect = (arg, ...args)=>{};

	}

	Effect(callback){
		this.effect = callback;
		return this;
	}
	setFix(callback){
		this.onFix = callback;
		return this
	}
	setOrder(callback){
		this.onOrder = callback;
		return this
	}
	setSource(callback){
		this.onSource = callback;
		return this
	}
	setRest(callback){
		this.onRest = callback;
		return this
	}
}


window.Trait = Trait
Object.defineProperties(Trait,{
	data:{
		get:function(){
			return traitdata
		}
	}
})

//traits 主要特征
//talent 能力,天赋
Trait.init()

D.talent = [
    '天才', //学习效果up
    '光属性','暗属性','火属性','水属性','木属性','土属性','电属性', //对应属性的技能效果up
    '迷之知识', //可以解锁特殊指令
    '虐待狂', //类似称号成就
    '被虐狂', //类似称号成就
    '雌雄莫辩', //对beauty有加成
    '人气', //收入buff
    '影薄', //隐匿up
    '探究心', //探索buff
    '长舌', //可以执行特定动作
    '毛茸茸', //可解锁特定互动
    '恢复快', //体力与健康恢复up
    '多段变化', //身形外貌会变化。包括阴茎大小（原尺寸与变化进度在cflag）
    '发光', //自带发光特效。不怕黑暗了呢！
]

const initials = ['M', 'B', 'C', 'U', 'V', 'A']

Trait.set('M体质')
.setSource((cid, ...args)=>{
	initials.forEach(k=>{
		if( Source[cid][`pa${k}`] > 0 ){
			Source[cid][`es${k}`] += Source[cid][`pa${k}`] * 0.2
		}
	})
})

Trait.set('M倾向')
.setSource((cid, ...args)=>{
	initials.forEach(k=>{
		if( Source[cid][`pa${k}`] > 0 ){
			Source[cid][`es${k}`] += Source[cid][`pa${k}`] * 0.3
		}
	})
})

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

Trait.set('理智')
.setFix((base, ...args)=>{
	base.sanity[1] *= 1.2
})
.setRest((cid, ...args)=>{
	const list = ['fear', 'mortify', 'humilate', 'depress', 'resist', 'uncomfort', 'angry']
	
})
.setOrder((cid, ...args)=>{
	if(F.weaker(target, player)) return 10;
	else if (F.baseCheck(target, 'health', 30) || F.baseCheck(target, 'stamina', 10)) return 15;
	else return 2
})
