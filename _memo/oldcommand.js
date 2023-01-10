
F.CommandCheck = function(i){
    let title = `Com_${i}::Before`
    let text = F.playerName()

    if(Story.has(title)){

        text += Story.get(title).text
        text += `
            <<timed 1s>>
                <<linkreplace 'Next'>>
                    <<run F.doCommand(${i},1)>>
                <</linkreplace>>
            <</timed>>`

        new Wikifier(null, `<<append #content_message transtition>>${text}<</append>>`)
        msg_end.scrollIntoView()

    }
    else{

        F.doCommand(i)

    }
    F.initComList()

}

F.doCommand = function(i, next){

    let com = comdata[i]
    let title = `Com_${i}`

    let txt = '' //每次动作结束后重新载入场景描写？
    let text = next ? '' : F.playerName()

    if(!Story.has(title)) return;

    $('#content_message a').remove()

    T.comorder = 0
    T.reason = ''

    //const order = Com.globalOrder() +  com.Order()
    //T.comorder >= order
    
    //cond Check作为第一道关卡。判定主控能否执行该指令
    //cond order作为第二道关卡。判定对象是否配合指令执行

    if(Com.globalCond(i) && com.cond()){

        V.passtime = com.time

        text += Story.get(title).text+`<br><<run comdata[${i}].source(); F.passtime(V.passtime)>>`


        if(Story.has(title+'::After')){

            let t = Story.get(title+'::After').text
            //添加属性变动显示。

            text += `<<timed 1s transtition>>${t}<</timed>>`

        }
        
    }
    else{
        V.passtime = 1

        if(Story.has(title+'::Cancel')) text += Story.get(title+'::Cancel').text;
        else  text += `》条件不足无法执行指令：${com.name}<br>
        》原因：${T.reason }`;

        text += '<<run F.passtime(V.passtime)>>'
    }

    new Wikifier(null, `<<append #content_message transition>>${text}<<dashline>><</append>>`)

	new Wikifier(null, `<<replace .headbar-container>><<showtime>><<showmoney>><</replace>>`)
    msg_end.scrollIntoView()
	Save.autosave.save(com.name)

    T.reason = ''
    T.comorder = 0
}
