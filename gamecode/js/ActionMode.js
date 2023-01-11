F.hideActions = function(){
    new Wikifier(null, '<<replace #actionMenu_1>> <</replace>>')
    new Wikifier(null, '<<replace #actionMenu_2>> <</replace>>')
    new Wikifier(null, '<<replace #actionMenu_3>> <</replace>>')
}

F.resetActScene = function(){
    V.target = C[tc]
    V.player = C[pc]

    F.initLocation()
    //F.initActionMenu()
    //F.initActionselect()

    return ''
}

F.DoNext = function(){
    let html = `<<link 'Do'>><<run F.NextAction()>><</link>>`
    new Wikifier('#next', `<<replace #next>>${html}<</replace>>`)
}


//----->> 初始化 <<---------------------------//

F.initMainFlow = function(){
    //在这里初始化信息板。 插入移动后的文本。不是经由移动初始化时会有对应的flag判定。
    //V.aftermovement
    const local = V.location
    let text = F.playerName()

    if(local.id == 'A0'){

        text +=  `你回到了宿舍房间。<br>`
        if(pc == 'Ayres'){
            text += `${C['Isil'].name}在房间里。`
        }
        else{
            text += `${C['Ayres'].name}在房间里。`
        }
    }
    else{
        text += `你来到了学院广场公园。<br>你注意到了${C['Besta'].name}在这里散步。`

    }

    F.summonChara();
    F.resetTarget();

    if(V.aftermovement)
        delete V.aftermovement

    setTimeout(()=>{
        F.txtFlow(text,30,1)
        setTimeout(()=>{
            F.charaEvent(tc)
        },500)
    },100)

    return ''
}

F.initActMenu = function(){
    const list = [
        [(V.mode == 'normal'), '移动', 'Map', ''],
        [(V.location.id == 'A0'), '下沉', 'Basement', ''],
        [(V.location.id == 'A0' && (V.date.time >= 1200 || F.baseCheck(player, 'stamina', 50))), '睡觉', 'Sleep', ''],
    ]

    const local = Action.get('type', '场所')
    const general = Action.get('type', '常规')
    

}