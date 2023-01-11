
function statsRank(v){
	const select = new SelectCase()
	select
		.case([19,20],'Ex')
		.case([16,18],'SS')
		.case([13,15],'S')
		.case([10,12],'A')
		.case([8,9],'B')
		.case([6,7],'C')
		.case([4,5],'D')
		.case([2,3],'E')
		.else('F')
	
	return select.has(v)
}
DefineMacroS('statsRank',statsRank)

function skillRank(v){
	const select = new SelectCase()
	select.case(3600,'Ex')
		.case(2800,'SS')
		.case(2100,'S')
		.case(1500,'A')
		.case(1000,'B')
		.case(600,'C')
		.case(300,'D')
		.case(100,'E')
		.else('F')

	return select.isGTE(v)
}
DefineMacroS('skillRank',skillRank)


F.yourName = function(){
	if(V.system.AlwaysShowPCName){
		return player.name
	}
	return '你'
}
DefineMacroS('you', F.yourName)

F.partnerName = function(){
	if(pc == 'Isil') return C.Ayres.name;
	else return C.Isil.name;
}
DefineMacroS('partner', F.partnerName)

/**
 * 
 * @param {string} text 
 * @param {string} path 
 * @returns {string}
 */
function tips(text, path){
		if(!V.tips.record.includes(path)){
				V.tips.record.push(path);
		}
		//console.log('tips',D.tips,path)		
		const title = lan(D.tips[path].title)
		const content = lan(D.tips[path].content)

		const html = `<<Hover 300 '${text}' '${title}：${content}'>>`
		return html
}
window.tips = tips
DefineMacroS('tips',tips)


F.getClass = function(){
	if(groupmatch(date.week,1,3) && date.time <= 720) return '魔法理论'

	if(groupmatch(date.week,1,3) && date.time <= 1020)
	return '概念魔法'

	if(groupmatch(date.week,2,4) && date.time <= 720)
	return '魔法物理'

	if(groupmatch(date.week,2,4) && date.time <= 1020)
	return '应用魔法'

	if(date.week == 5 && date.time <= 720)
	return '世界史'

	if(date.week == 5 && date.time <= 1020)
	return '魔药学'

	return ''

}

F.Exp = function(chara,exp){
	return C[chara].exp[exp].total
}


F.charaName = function(cid){
    const chara = C[cid]
	let color = Kojo.get(chara.kojo, 'color')
	if(!color) color = '#22A0FC'

    const html = `<span style="color:${color}">[ ${chara.name} ]</span><br>`
    return html
}

F.playerName = function(){
	let color = Kojo.get(player.kojo, 'color')
	if(!color) color = '#22A0FC'

	const html = `<span style='color:${color}'>[ ${player.name} ]</span><br>`
	return html
}
DefineMacroS('pcnameTag', F.playerName)
DefineMacroS('nameTag', F.charaName)

F.actChara = function(){
	if(T.ac == V.pc) return F.yourName();
	else return C[T.ac].name
}

DefineMacroS('actChara', F.actChara)

F.targetChara = function(){
	if(T.tc == V.pc) return F.yourName();
	else return C[T.tc].name
}

DefineMacroS('targetChara', F.targetChara)

F.targetPart = function(){
	const p = F.checkUse(T.tc, T.actId)
	//之后根据特定部位弄点差分。主要是胸部、秘穴、菊穴、阴茎这几个部位。
	return D.bodyparts[p]
}
F.actPart = function(){
	//阴茎会有特殊描述处理？
	return D.bodyparts[T.acp]
}

DefineMacroS('targetPart', F.targetPart)
DefineMacroS('actPart', F.actPart)

F.checkUse = function(cid, act){
	T.actId = act
	for(let i in Using[cid]){
		const info = Using[cid][i]
		if(info.act == act) return i;
	}
	return 'hands'
}

F.Actor = function(pc, tc, act, acp){
	T.ac = pc;
	T.tc = tc;
	T.actId = act;
	T.acp = acp;
return ''
}
DefineMacroS('setActor', F.Actor)

//在执行文本时以print的方式加在文本前面。
//<<setActor '${T.ac}' '${T.tc}' '${actId}'>>