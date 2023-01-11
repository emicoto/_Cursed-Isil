
class Kojo{
	static data = {}
	static set(id, color){
		Kojo.data[id] = new Kojo(id, color)
		return Kojo.data[id]
		
	}

	static get(id, type){
		if(!Kojo.data[id]) return;
		
		if(!type)
			return Kojo.data[id];
		else
			return Kojo.data[id][type];
	}

	constructor(id, color){
		this.id = id;
		this.color = color ? color : '#22A0FC';
		this.intro = [];
		this.schedule = [];
		this.preset = [];
		this.comFilter = ()=>{ return 1};
		this.customCommand = {};
		this.event = [];
		this.home = 'void';
		this.relation = {};
	}
	Intro(str){
		this.intro = str;
		return this;
	}
	Schedule(id, list){
		if(id)
			this.schedule[id] = list;
		else
			this.schedule.push(list);
		return this;
	}
	setComFilter(cond){
		this.comFilter = cond;
		return this
	}
	setCommand(id, name, func){
		if(id)
			this.customCommand[id] = {name:name, do:func};
		else
			this.customCommand.push({ name: name, do:func });
		return this;
	}
	Event(id, name, config, cond){
		if(id)
			this.event[id] = { name, config, cond };
		else
			this.event.push({name, config, cond});
		
		return this;
	}
	Home(str){
		this.home = str;
		return this;
	}
	Relation(id, des, val){
		this.relation[id] = [val, des]
		return this;
	}
}

window.Kojo = Kojo
/**
 * 
 * @param {string} cid 
 * @param {string} type 
 * @param {string | number} id 
 * @param {string} branch 
 * @returns 
 */
F.Kojo = function(cid, type, id, branch){

	if(branch && branch.has('Before','After','Cancel','Failed'))
		branch = ':'+branch;
	else if(branch)
		branch = '_'+branch;
	else
		branch = ''

	if(C[cid].kojo) cid = C[cid].kojo // 如果使用口上与id不一致，则覆盖


    let title = `Kojo_${cid}_${type}${id ? '_' + id : ''}${branch}`
    let text = ''
    
    if(Story.has(title))
        text = Story.get(title).text;
	else{
		title = `Message_${type}${id ? '_'+id : ''}${branch}`
		if(Story.has(title))
			text = Story.get(title).text;
	}

	return text 		

}

/**
 * 
 * @param {string} txt 
 * @returns 
 */
F.convertKojo = function(txt){
	if(!txt.includes('<<=F.Kojo')) return txt;

	console.log('find kojo?')

	const match = txt.match(/<<=F.Kojo(.+?)>>/g)
	match.forEach( p =>{
		const t = p.match(/<<=F.Kojo\((.+?)\)>>/)
		const args = t[1].replace(/\s+/g,'').replace(/'|"/g,'').split(',')

		//cid的转换。 暂时都是target。有组队功能后再整(￣▽￣")
		const cid = args[0].has('target','tc') ? target.kojo : args[0]
			//args[0].has('party','pt') ? party[V.cp] : args[0]
		txt = txt.replace(p, F.Kojo(target.kojo, args[1], args[2], args[3]))
	})

	return txt

}