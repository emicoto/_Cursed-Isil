//----->> 小功能 <<---------------------------//

//每次移动后的target复位
F.resetTarget = function(){
    const local = clone(V.location.chara)

    if(local.length > 1){
        local.delete(V.pc,1)
        V.tc = local[0]
    }
    else{
        V.tc = V.pc
    }
}


F.hideCommands = function(){
    new Wikifier(null,`<<replace #commandmenu>> <</replace>>`)
    new Wikifier(null, '<<replace #commandzone>> <</replace>>')
}

//刷新界面
F.resetScene = function(){
	V.target = C[tc]
	V.player = C[pc]
    F.initLocation()
    F.initComList()
    F.initComMenu()

    return ''
}
DefineMacroS('resetScene',F.resetScene)

F.resetLink = function(){
    $('#content_message a').remove();
    V.selectCom = 0;
    return ""
}
DefineMacroS('resetLink',F.resetLink)

F.shownext = function(){
    let html = `<<link 'Next'>><<run F.ComNext()>><</link>>`
    new Wikifier('#commandzone', `<<replace #commandzone transition>>${html}<</replace>>`)
}

//----->> 初始化 <<---------------------------//
F.initComMenu = function(){
    const list = [
        [(V.location.id == 'A0'), '下沉', 'Basement',''],
    ]
    let menu = []
    list.forEach((a)=>{
        if(a[0]) menu.push(`<<link '[ ${a[1]} ]' '${a[2]}'>>${a[3]}<</link>>`)
    })

    const html = `<span class='filter'>Filter: ${F.ComFilters()}</span>　｜　${menu.join('')}`

    new Wikifier(null, `<<replace #commandmenu>>${html}<</replace>>`)
}

F.initLocation = function(){
    const chara = []
    let html = ''
    let change = F.switchChara()

    if(V.location.chara.length){
        
    V.location.chara.forEach((k)=>{
            let com = `<<set $tc to '${k}'>><<run F.charaEvent('${k}'); F.resetScene()>>`
            
            let t = `<u><<link '${C[k].name}'>>${com}<</link>></u>　`

            if( pc !== k){
                if(tc == k) t = `<span style='color:#76FAF4'><${C[k].name}></span>　`
                //console.log(k, C[k].name, t)
            }
            else{
                let name = C[k].name
                if(tc == k) name = `< ${C[k].name} >　`
                t = `<span style='color:#AAA'>${name}</span>　`
            }

            chara.push(t)
        })

    }

    html = `主控　<span style='color:#fff000'>${player.name}</span> ${change}　|　所在位置　${V.location.name}　|　`
    if(chara.length) html += ''+chara.join('')+'<br>'

    //后面加场景描述。从Db读取场景数据。角色选项也会移到场景描述后。
    //这里是……。 有 谁 、谁 、谁 在这里。
    //选择角色后会有文字补充在信息流后。 “你将目光移向谁。“

    new Wikifier(null, `<<replace #location>>${html}<</replace>>`)

}

//----->> 主要进程处理 <<---------------------------//
F.ComNext = function(){
    //用于刷新content_message区域的文本。
    if(T.msgid < S.msg.length && S.msg[T.msgid].has('<<selection','<<linkreplace') && !T.selectwait ){
        S.msg[T.msgid] += '<<unset _selectwait>><<set _onselect to 1>>'
        T.selectwait = 1
    };

    if(T.comPhase == 'before' && T.msgid >= S.msg.length && !T.onselect && !T.selectwait ){
        F.ComEvent(V.selectCom, 1)
    }
    else{
        if(T.msgid < S.msg.length && !T.onselect){
            F.txtFlow(S.msg[T.msgid])
            T.msgid ++
        }
    }
}

F.ComMsg = function(msg, add){    
    if(!S.msg) S.msg = [];
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


F.ComCheck = function(id){
    const com = comdata[id]

    T.comorder = 0;
    T.reason = '';
    T.order = ''
    T.orderGoal = Com.globalOrder(id) + com.order();
    T.comAble = Com.globalCond(id) && com.cond();
    T.msgid = 0

    //如果对方无反抗之力，目标值强行变零。
    if(F.uncons(target) || !F.canMove(target))
        T.orderGoal = 0

    T.comPhase = 'before'

    let txt = F.playerName()
    let t, c

    //角色每次执行COM时的个人检测。
    //如果口上侧要进行阻止某个指令进行，也会在这里打断。
    if(Story.has(`Kojo_${target.kojo}_Com`)){
        new Wikifier('#hidden', Story.get(`Kojo_${target.kojo}_COM`))
    }

    //指令执行时暂时去掉指令栏
    F.hideCommands()
    F.shownext()

    if( V.system.showOrder && T.order ){
        F.ComMsg(`配合度检测：${T.order}＝${T.comorder}/${T.orderGoal}<br><<dashline>>`)
    }

    //执行before事件。这些都是纯文本。只能有选项相关操作。
    //先执行通用的 before事件。基本用在场景变化中。
    F.ComMsg(`${Story.get('Command::Before').text}<<run F.ComNext()>><<dashline>>`)

    //指令专属的before事件
    if(Story.has(`Com_${id}::Before`)){
        txt = txt + Story.get(`Com_{id}::Before`).text + '<br>'
        F.ComMsg(txt)
        console.log('combefore?')
        c = 1
        t = 1
    }

    //执行口上侧Before事件。
    if(F.Kojo(target.kojo, 'Com', id, 'Before')){
        txt = (t ? '' : txt ) + F.Kojo(target.kojo, 'Com', id, 'Before') + '<br>'
        F.ComMsg(txt)
        console.log('kojobefore?')
        c = 1
    }

    //检测是否存在com.before(), 存在就在这里执行。
    if(com?.before) com.before();


    if(!Story.has(`Com_${id}`)){
        F.txtFlow('缺乏事件文本',30,1)
        F.resetScene()
    }
    //存在待执行文本就直接出现Next按钮。    
    else if(c){
        F.shownext()
        F.ComNext()        
    }
    else{
        F.ComEvent(id)
    }

}

F.ComEvent = function(id, next){
    const com = comdata[id];
    const resetHtml = `<<run F.resetCom()>><<dashline>>`

    let title = `Com_${id}`;
    let txt = next ? '' : F.playerName()
    S.msg = [];
    T.msgid = 0
    T.comPhase = 'event';

    //总之先清除多余链接
    $('#content_message a').remove()

    if(T.comCancel){
        F.ComMsg(resetHtml)
    }
    else if( id === 0){
        //移动直接跳转到移动界面
        F.ComMsg(Story.get(title).text)
    }
    //确认主控有能力执行
    else if(T.comAble){

        //确认对象愿意配合执行
        if( 
            T.orderGoal === 0
            || V.system.debug 
            || ( T.orderGoal > 0 && T.comorder >= T.orderGoal )
            || (com?.forceAble && T.comorder + D.ignoreOrder >= T.orderGoal )
        ){
            V.passtime = com.time;
            txt = txt + Story.get(title).text

            if( T.comorder < T.orderGoal && !V.system.debug ){
                S.msg.push(`配合度不足：${T.order}＝${T.comorder}/${T.orderGoal}<br>${com?.forceAble ? '<<run F.ComNext()>>' : ''}<br>`)

                if(Story.has(title+':Force'))
                    txt = txt + Story.get(title+':Force').text

                T.force = true
            }
            txt = F.convertKojo(txt)
            F.ComMsg(txt)

            F.ComMsg(`<<run comdata['${id}'].source(); F.passtime(V.passtime); F.ComResult()>>`, 1)

            //确认After事件。如果有就添加到 Msg中。
            if(Story.has(title+':After')){
                txt = `<br><<set _comPhase to 'after'` + Story.get(title+':After').text;

                txt = F.convertKojo(txt)
                F.ComMsg(txt);
            }

            //最后加ComEnd()
            F.ComMsg('<<run F.ComEnd()>>', 1)

        }
        else{   
            F.ComMsg(`配合度不足：${T.order}＝${T.comorder}/${T.orderGoal}<br><<run F.passtime(1); >>`)
            F.ComMsg(resetHtml,1)
        }
    }
    //取消执行
    else{
        if(Story.has(title+':Cancel')){
            txt = txt + Story.get(title+':Cancel').text;
            F.ComMsg(txt)
        }
        else F.ComMsg(`》条件不足无法执行指令：${ typeof com.name === 'function' ? com.name() : com.name }<br>原因：${ T.reason }<br>`)

        F.ComMsg('<<run F.passtime(1)>>',1)
        F.ComMsg(resetHtml,1)
    }  

    F.shownext()
    F.ComNext() 
}

//显示数据处理结果。包括高潮、射精、刻印获得、素质变动的处理
F.ComResult = function(){

    let text = ''
    return text;
}

//指令结束后的处理。主要看有无后续事件。 例如高潮后、射精后、刻印获得后、素质变动后等相关事件。
F.ComEnd = function(){
    T.comPhase = 'end';
    const resetHtml = `<<run F.resetCom()>><<dashline>>`    

    let text = ''

    F.ComMsg(resetHtml)
    F.ComNext()
}

//无论指令成功与否，都会在最后执行的处理
F.resetCom = function(){
//更新事件状态    
T.comPhase = 'reset'

// 检测在场角色的事件
V.location.chara.forEach( cid =>{
    F.charaEvent(cid)
})

//缓存指令
V.lastCom = V.selectCom;

//清除临时flag和缓存信息
    delete T.comCancel;
    delete T.onselect;
    delete T.beforeNext;
    delete T.comAble;
    delete T.orderGoal;
    delete T.force;
    
    delete S.msg;

    T.msgid = 0;
    T.comorder = 0;
    T.reason = '';
    T.order = ''
    V.selectCom = 0;

//更新角色位置、场景信息等处理。
// F.LoopFirst()

//刷新画面
    F.resetScene()
}

//----->> 角色处理 <<---------------------------//

//角色事件处理。
F.charaEvent = function( cid ){
    if(cid === pc) return;

    const chara = C[cid]

    if( cid == tc && !Cflag[cid][`firstMet${pc}`] ){
        Cflag[cid][`firstMet${pc}`] = 1;
        
        if (F.Kojo(chara.kojo, 'Event', 'First')){
            F.setEvent('Kojo','Event_First', chara.kojo)
            return new Wikifier(null, '<<goto EventStart>>')
            
        }
    }

    console.log(cid, pc, !Tsv[tc][`metToday${pc}`])
    
    //检测是否今天首次见面
    if (cid === tc && !Tsv[tc][`metToday${pc}`]){
        let p1 = pc, p2 = (pc == 'Isil' ? 'Ayres' : 'Isil');
        let setter = `<<set Tsv.${cid}.metToday${pc} to 1>>`

        if(V.location.chara.containsAll(p1,p2) && !Tsv[tc][`metToday${p2}`]){
            setter += `<<set Tsv.${cid}.metToday${p2} to 1>>`
        }

        if( F.Kojo(chara.kojo, 'Daily', 'First')){
            return F.txtFlow(`${F.charaName(cid)}${F.Kojo(chara.kojo, 'Daily', 'First')}${setter}`,0,1)
        }
        
    }

   const cevent = Kojo.get(chara.kojo, 'event')
   if(!cevent) return;

    cevent.forEach( obj =>{
        const title = `Kojo_${chara.kojo}_Event_${obj.name}`

        if(Story.has(title) && obj.cond() && V.location.chara.includes(cid)){
            F.setEvent('Kojo',`Event_${obj.name}`, chara.kojo)
            return new Wikifier(null, '<<goto EventStart>>')
            
        }
    })
}

F.summonChara = function(){
    const local = V.location

    //根据时间和地点召唤可能存在的角色。
    //暂时只有两场景，迟些再整。
    if(local.id == 'A0'){
        local.chara = ['Ayres','Isil']
    }
    else{
        local.chara = ['Besta',pc,'Nanaly']
    }

}

//切换主控角色
F.switchChara = function(){
    let change = ''

    if(V.location.chara.containsAll('Ayres','Isil')){
        let p, t;
        if( V.pc === 'Isil' || V.pc === 'm0' ){
            p = 'Ayres';
            t = 'Isil';
        }
        else if( V.pc == 'Ayres' && F.uncons(C['Isil'])){
            p = 'm0';
            t = 'Isil';
        }
        else{
            p = 'Isil'
            t = 'Ayres'
        }
        
        change = `<<link '[ 切换角色 ]'>><<set $pc to '${p}'>><<set $tc to '${t}'>><<run F.resetScene();>><</link>>`
    }

    if(Config.debug)
        console.log(change);

    return change
}