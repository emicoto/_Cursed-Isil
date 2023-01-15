F.hideActions = function(){
    $('#actionMenu_1').addClass('hidden')
    $('#actionMenu_2').addClass('hidden')
    $('#actionMenu_3').addClass('hidden')
    $('#actionOption').addClass('hidden')
    new Wikifier(null, '<<replace #actionMenu_1>> <</replace>>')
    new Wikifier(null, '<<replace #actionMenu_2>> <</replace>>')
    new Wikifier(null, '<<replace #actionMenu_3>> <</replace>>')
    new Wikifier(null, '<<replace #actionOption>> <</replace>>')
}

F.showActions = function(){
    $('#actionMenu_1').removeClass('hidden')
    $('#actionMenu_2').removeClass('hidden')
    $('#actionMenu_3').removeClass('hidden')
    $('#actionOption').removeClass('hidden')    
}

F.resetUI = function(){
    V.target = C[tc]
    V.player = C[pc]

    F.initLocation()
    F.showActions();
    F.initActMenu()
    //F.initActionselect()
    
    F.showNext(1);

    return ''
}

F.initActionMode = function(){
    T.currentType = 'all'
    T.actPartFilter = 'all'
    T.actor = V.pc
    T.actTg = V.pc !== V.tc ? V.tc : V.pc;

    T.actPart = 'reset'

    F.initAction('m0')

    V.location.chara.forEach((cid)=>{
        F.initAction(cid)
    })

}

F.showNext = function(hide){
    let html = hide ? '' :`<<link 'Next'>><<run F.ActNext()>><</link>>`
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
    //F.resetAction(); 初始化act、using缓存，并设置默认动作

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

F.actBtn = function(actid, data){
    const { id, script, event, alterName } = data;
    let name = data.name;
    if( alterName ) name = alterName();

    if(actid == id || (data.type == '目录' && T.actType == id )){
        return `<div class='actions selectAct'>[ ${name} ]</div>`
    }

    if((groupmatch(data.type, '接触','触手','逆位') && !groupmatch(data.option, 'doStraight', 'reset')) || (data.type == '道具' && data.targetPart) ){
        let usePart
        if(data.usePart && data.usePart.length > 1){
            usePart = 1
        }
        
        return `<div class='actions'><<link '${data.name}'>>
        <<run F.checkAction('${id}', 'ready'); F.initActMenu('${id}'${usePart ? ', 1':''});>>
        <</link>></div>`

    }

    return `<div class='actions'><<link '${data.name}'>>
            ${script? script : ''}
            ${ event ? `<<run Action.data['${id}'].event(); F.resetUI()>>` 
            : `<<run F.checkAction('${id}', 'do');>>` }
            <</link>></div>`
}

F.partBtn = function(data, part, use){
    const { id } = data;
    let setpart = `<<set _selectPart to '${part}'>><<run F.checkAction('${id}', 'do')>>`
    //console.log(data)

    if(use){
        setpart = `<<set _selectActPart to '${part}'>>`
        if(data?.option == 'noSelectPart'){
            setpart += `<<run F.checkAction('${id}', 'do')>>`
        }
        else{
            setpart += `<<run F.checkAction('${id}', 'ready'); F.initActMenu('${id}', 1)>>`
        }
    }

    if (use && T.actPart == part){
        return `<div class='actions selectAct'>[ 用${D.bodyparts[part]} ]</div>`
    }
    return `<div class='actions parts'><<button '${use ? '用' : ''}${D.bodyparts[part]}'>>${setpart}<</button>></div>`
}

F.partAble = function(actid, part, mode){
    const data = Action.data[actid]
    let p = mode == 'use' ? V.pc : V.tc;

    if(data.type == '触手'){

    }
    else{
        return Using[p][part] === '' || Using[p][part].act === actid
    }

}

F.initActMenu = function(actid, usepart){
    const ignore1 = ['常规','目录','交流','其他']
    const ignore2 = ['体位','固有'].concat(ignore1)

    let adata = Action.data[actid]

    const list = Object.values(Action.data).filter(action => action.type == '固有')

    const level1 = Object.values(Action.data).filter(action => ignore1.includes(action.type))

    const level2 = Object.values(Action.data).filter(action => ignore2.includes(action.type) === false)
    
    const level3 = adata?.targetPart ? adata.targetPart : []
    const level3ex = usepart && adata?.usePart ? adata.usePart : []

    const pose = Object.values(Action.data).filter(action => action.type == '体位')


    const main = ['',''], action = [], selection = [], option = [], extra = []

    level1.forEach( (data)=>{
        if(data.filter() && Action.globalFilter(data.id) ){
            if(data.name === '交流') main[0] = F.actBtn(actid, data);
            else if(data.name === '接触') main[1] = F.actBtn(actid, data);
            else main.push(F.actBtn(actid, data));
        }
    })

    list.forEach((data)=>{
        if(data.filter()){
            const { name, option, event, id } = data
            extra.push(`<div class='actions'><<link '[ ${name} ]' ${option ? `'${option}'` : ''}>>${event ? `<<run Action.data['${id}'].event(); F.resetUI();>>` : '' }<</link>></div>`)
            console.log()
        }
    })

    level2.forEach( (data)=>{
        if(data.filter() && Action.globalFilter(data.id)){
            action.push(F.actBtn(actid, data))
        }
    })

    if(T.inside){
        pose.forEach( pos => {
            if(pos.filter() && Action.globalFilter(pos.id)){
                option.push(F.actBtn(T.posId, pos))
            }
        });
    }

    if(level3ex.length){
        level3ex.forEach((part)=>{
            //console.log('use part:', part)
            if(F.partAble(actid, part, 'use') )
                selection.push(F.partBtn(adata, part, 1));
        })
    }

    if(level3.length && adata?.option !== 'noSelectPart'){
        level3.forEach((part)=>{
            //console.log('target part:',part)
            if(F.partAble(actid, part, 'tar'))
                selection.push(F.partBtn(adata, part));
        })
    }

    let html  = ''

    if(main.length){
        html += main.join('')
    }

    if(extra.length){
     html += `<div class='actionMenu'><div class='actions'> | </div>${extra.join('')}</div>`
    }
    

    new Wikifier(null, `<<replace #actionMenu_1>>${html}<</replace>>`)

    if(action.length){
        $('actionMenu_2').removeClass('hidden')
        new Wikifier(null, `<<replace #actionMenu_2>>${action.join('')}<</replace>>`)
    }
    else{
        $('#actionMenu_2').addClass('hidden')
    }

    if(option.length){
        $('#actionOption').removeClass('hidden')
        new Wikifier(null, `<<replace #actionOption>>${option.join('')}<</replace>>`)
    }
    else{
        $('#actionOption').addClass('hidden')
    }

    if(selection.length){
        $('#actionMenu_3').removeClass('hidden')
        new Wikifier(null, `<<replace #actionMenu_3>>${selection.join('')}<</replace>>`)
    }
    else{
        $('#actionMenu_3').addClass('hidden')
    }
}

//----->> 主要进程处理 <<---------------------------//v
F.ActNext = function(){
    //用于刷新content_message区域的文本。
    if(T.msgid < S.msg.length && S.msg[T.msgid].has('<<selection','<<linkreplace') && !T.selectwait ){
        S.msg[T.msgid] += '<<unset _selectwait>><<set _onselect to 1>>'
        T.selectwait = 1
    };

    if(T.phase == 'before' && T.msgid >= S.msg.length && !T.onselect && !T.selectwait ){
       // F.ComEvent(V.selectCom, 1)
    }
    else{
        if(T.msgid < S.msg.length && !T.onselect){
            F.txtFlow(S.msg[T.msgid])
            T.msgid ++
        }
    }
}


F.Msg = function(msg, add){    
    if(!S.msg) F.resetMsg();
    if(add){
        if(!S.msg.length)
            S.msg[0] = '';
        S.msg[S.msg.length-1] += msg;
    }
    else if(msg.includes('<fr>')){
        S.msg = S.msg.concat(msg.split('<fr>'))
    }
    else{
        S.msg.push(msg)
    }
}

F.initCheckFlag = function(){
    T.order = 0;
    T.reason = '';
    T.orderMsg = '';
    T.actAble = 0;
    T.orderGoal = 0;
    T.phase = ''
    delete T.noNameTag
    delete T.aftermovement
}

F.checkAction = function(id, phase){
    const data = Action.data[id]

    let reText = ''

    F.initCheckFlag()

    T.orderGoal = Action.globalOrder(id) + data.order();
    T.actAble = Action.globalCheck(id) && data.check();

    T.phase = phase;

    // 对昂处于无意识状态，强行将配合值变零
    if(F.uncons(target))
        T.orderGoal = 0
    
    // 有意识但无法动弹, 追加强制flag
    if(!F.canMove(target))
        T.forceOrder = 100

    if( V.system.showOrder && T.orderMsg && T.orderGoal > 0 ){
        reText += `配合度检测：${T.orderMsg}=${T.order}/${T.orderGoal}<br><<dashline>>`
    }

    if(!T.actAble && T.reason ){
        reText += `执行条件不足，原因：${T.reason}<br><<dashline>>`
    }

    //如果无法进入执行环节，则在这个阶段返回提示信息。
    if(reText){
        F.txtFlow(reText)
    }

    //如果动作还在准备阶段，则在这里中断。
    if(phase == 'ready'){
        F.initCheckFlag();
        return 0
    }

    T.actId = id;
    T.selectAct = id;
    T.actPart = T.selectActPart;

    if(!T.actPart && data.usePart){
        T.actPart = data.usePart[0]
    }

    $('action').trigger('before')
}

/**
 * 
 * @param {'cancel' | 'stop'} mode 
 */
F.stopAction = function(id, mode){
    T.stopAct = id
    $('action').trigger(mode)
}

F.setPhase = function(mode){
    $('action').trigger(mode)
}

F.beforeAction = function(){
    T.phase = 'before'
    let id = T.actId
    let reText = ''

    //角色每次执行COM时的个人检测。
    //如果口上侧要进行阻止某个指令进行，也会在这里打断。
    if(Story.has(`Kojo_${target.kojo}_BeforeAction`)){
        new Wikifier('#hidden', Story.get(`Kojo_${target.kojo}_BeforeAction`).text )
    }

    //执行before系列事件。这些都是纯文本，只能有选项相关操作。
    //先执行通用的before事件。主要显示场景变化或持续状态。
    reText = Story.get('Action_Common:Before').text + ` <<if !T.noMsg>><<dashline>><</if>> <<run F.ActNext()>>`

    F.Msg(reText);

    let txt = F.playerName(), t, c

    //指令专属的before事件
    if(Story.has(`Action_${id}:Before`)){
        txt = txt + Story.get(`Action_${id}:Before`).text + '<br>'
        F.Msg(txt)
        t = 1
        c = 1
    }

    //执行口上侧before事件。
    if(Kojo.has(tc, 'Action', id, 'Before')){
        txt = (t? '' : txt ) + Kojo.put(tc, 'Action', id, 'Before')
        F.Msg(txt);
        c = 1
    }

    //在执行文本最后追加下一步
    F.Msg(`<<if !T.cancel>>F.setPhase('event'); F.ActNext()>><<else>><<run F.setPhase('cancel')>><</if>>`) 

    //检测是否存在特殊的before处理，存在就在这执行。
    //if(Action.data[id]?.before) Action.data[id].before();

    if(!Story.has(`Action_${id}`)){
        F.txtFlow('缺乏事件文本', 30, 1)
        F.setPhase('init')
        F.resetUI()
    }
    //存在待执行文本就出现Next按钮并出现
    else if(c){
        T.noNameTag = 1
        F.showNext()
        F.ActNext()
    }
 
}

F.doEvent = function(id){
    const data = Action.data[id]
    const resetHtml = `<<run F.resetAction()>><<dashline>>`

    let title = `Action_${id}`
    let txt = T.noNameTag ? '' : F.playerName();

    T.phase = 'event'
    F.resetMsg()

    //确认主控有条件执行
    if(T.actAble){

        //确认对象愿意配合执行
        if(
            T.orderGoal == 0
            || V.system.debug
            ||( T.orderGoal > 0 && T.order >= T.orderGoal )
            ||( data?.forceAble && T.order + player.stats.LUK[1] >= T.orderGoal && random(100) <= player.stats.LUK[1]*2 )
            ||( T.order + T.forceOrder >= T.orderGoal )
        ){
           
           T.passtime = data.time;
           txt = txt + Story.get(title).text;

           //配合度不足但勉强能配合
           if( T.order < T.orderGoal && !V.syystem.debug ){
                if(T.forceOrder){
                    S.msg.push(`< 强制 ><br>`)
                    T.force = 1
                }
                else{
                    S.msg.push(`勉强配合: ${T.order}+LUK${player.stats.LUK[1]}/${T.orderGoal}<br>`)
                }

           }

        }


    }
    else{


    }

}

F.resetMsg = function(){
    S.msg = [];
    T.msgid = 0;
}

F.resetAction = function(){
    T.phase = 'reset'

    if(T.cancel){
        F.initCheckFlag()
        delete S.msg;
        delete T.cancel;
        delete T.force;
        F.setPhase('init')
        return 0
    }

    //缓存最后一个动作
    T.lastAct = { act: T.selectAct, actPart: T.selectActPart, targetPart: T.selectPart }
    
    delete T.cancel;
    delete T.onselect;
    delete T.force;

    delete S.msg;
    F.initCheckFlag()

    //更新角色位置、场景信息等处理。
    //F.LoopFirst()

    //刷新画面
    F.resetUI()

}