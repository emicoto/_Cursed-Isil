
const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

F.timeZone = function(h){
	const select = new SelectCase()

	select.case([2,4],'凌晨')
		.case([5,7],'黎明')
		.case([8,10],'上午')
		.case([11,13],'中午')
		.case([14,16],'下午')
		.case([17,19],'傍晚')
		.case([20,22],'晚上')
		.else('深夜')

	return select.has(h)

}

F.showtime = function() {
	const date = V.date;

	let timeString = `${date.year}年${date.month}月${date.day}日 ${weeks[date.week]}`;
	let hours = Math.floor(date.time / 60);
	let minutes = date.time % 60;
	let timezone = F.timeZone(hours)

	if (V.timemode === 12) {
		let ampm = 'AM';
		if (hours >= 12) {
			ampm = 'PM';
			hours -= 12;
		}
		if (hours === 0) {
			hours = 12;
		}
		timeString += ` ${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
	}
	
	else {
		timeString += ` ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
	}

	return timeString + ` (${timezone})`;
}


F.passtime = function(time){
	V.time.total += time;

	//时间变化时的处理
	F.timeEffects(time)	
	F.timeProcess(time)

	return ''
}

DefineMacroS('passtime', F.passtime)


F.timeProcess = function(t){
	const date = V.date

	date.time += t
	
	const days = Math.floor((date.time) / 1440);
	const weeks = (date.week + days) % 7;

	const months = Math.floor(days / 30);
	const years = Math.floor(months / 12);

	if(days) {
		date.day += days;
		date.time -= 1440*days;
	}

	date.week = weeks;

	if(months){
		date.month += months;
		date.day -= days;
	}

	if(years){
		date.year += years;
		date.month -= months;
	}

}

F.timeEffects = function(t, mode){

	const {pc, date, flag, time} = V

	if(date.time + t >= 1380) flag.daychange = true; //先不加到现在时间，瞅瞅过23点没。

	//根据在场角色进行source处理
	let charas = V.location.chara
	charas.forEach((cid)=>{
		const chara = C[cid]

		//衣服穿着和持续行动带来的source变动
		//F.trackCheck(chara, cid)

		F.sourceCheck(chara, cid)
		F.sourceUp(chara, cid)
	})

	//对不在场的角色进行时间经过处理。
	//charas = F.getNoActiveChara()
}

F.timePhase = function(){
	const h = Math.floor(V.date.time/60)
	const select = new SelectCase()

	select.case([8,10],1)
		.case([11,13],2)
		.case([14,16],3)
		.case([17,19],4)
		.case([20,22],5)
		.else(0)
	
	return select.has(h)
}

F.sourceCheck = function(chara, cid){
	//source的处理。根据条件对source的获得值进行加减。

	//根据特定条件进行数值处理


	//根据素质进行数值处理. 数值buff最后处理
	F.traitSource(chara, cid)

}

F.traitSource = function(chara, cid){

chara.traits.forEach((t)=>{
	const data =  Trait.get(t)
	for(let i in data.get){
		if(chara.source[i]){
			chara.source[i] *= data.get[i]
		}
	}

	if(typeof data.onSource == 'function'){ // 执行素质的例外处理。
		data.onSource(cid)
	}
})
	
}


F.sourceUp = function(chara){
//根据处理结果进行反馈。并输出结果文字到 S.sourceResult下。当启用显示结果数值时，会显示在COM after之后。
const base = Object.keys(D.base)
const palam = Object.keys(D.palam)

let palamlv = {}
let retext = ''

for(let i in chara.source){
	chara.sup[i] = chara.source[i]; //处理结果暂存到sup中用作显示

	if(chara.sup[i] !== 0){
		//将变动记录作为文本记录到 S.msg ?
	}

	if(base.includes(i)  &&  chara.source[i]){
		chara.base[i][0] = Math.clamp(chara.base[i][0
		] + chara.source[i], -100, chara.base[i][1] * 1.5 )
	}

	if(palam.includes(i) && chara.source[i]){
		const lv = chara.palam[i][0]

		chara.palam[i][1] += chara.source[i]

		//palam lv的处理， 顺便在这里记录变动文本？
		if(chara.palam[i][1] >= D.palamLv[lv] ){
			chara.palam[i][i] -= D.palamLv[lv];
			chara.palam[i][0] = Math.clamp(chara.palam[i][0] + 1 , 0, D.palamLv.length)
		}
	}
}

}

F.trackCheck = function(chara, cid){

}