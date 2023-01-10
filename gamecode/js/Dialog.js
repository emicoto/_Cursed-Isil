/**
 * 
 * @param {string} text 
 */
F.tranSelect = function(text){
    let replace = text.includes('@replace')
    let txt, html

    if(replace){
        txt = text.match(/#:select@replace:(.+):#/)
    }
    else{
        txt = text.match(/#:select:(.+):#/)
    }
    
    let pick = txt[1].split('|')
    let selection = ''
    pick.forEach(v=>{
        let t = `<<pick`
        let content = ''
        let check = v.split(',')

        check.forEach(k=>{
            if(k=='auto')
                t+= ` auto`;
            else if(k.match(/%(.+)%/))
                content = k.match(/%(.+)%/)[1]
            else if(parseInt(k))
                t+= ` ${k}`;
            else
                t += ` '${k}'`;
        })
        t += '>>'+content
        selection += t
    })
    
    if(replace){
        html = `<br><<selection replace>>${selection}<</selection>>`
    }
    else{
        html = `<br><<selection>>${selection}<</selection>>`
    }
    return text.replace(txt[0],html)
}

F.transTips = function(text){
    let txt = text.match(/:tips:(.+)\|(.+):/)
    return text.replace(txt[0],`<<tips '${txt[1]}' '${txt[2]}'>>`)
}

/**
 * 
 * @param {string | string[]} text 
 */
window.txtp = function(text){

    const trans = function(t){
        if(t.includes(':tips:'))
            t = F.transTips(t);
        if(t.includes(':select:'))
            t = F.tranSelect(t);
        if(t.includes('/L'))
            t = t.replace('/L','<br>');

        if(t.includes('<fr>')){
            t = t.replace('<fr>','<br>')
        }
        else if(t.includes('/* */')){
            t = t.replace('/* */','')
        }
        else{
            if(t.has('if','switch','case','<</','select','<br>','replace','div','<<pick','<<event','<<run','<<set') === false){
                t += '<br>'
            };
        }

        return t
    }

    if(typeof text === 'string') return trans(text);

    const txt = []

    for(let i=0; i<text.length; i++){
        txt[i] = trans(text[i])
    }

  return txt.join('')
}


window.Dlog = function(text, config){
    const ch = T.passage
    S.dialog[ch].push({ txt:text, config:config })
    return ''
}

F.resetEvent = function(){
    V.event = {
        type:'', eid:'', name:'', ch:'', ep:0, phase:0, sp:0, lastId:0, lastPhase:0,
    }
    return ''
}

F.setEvent = function(type, name, eid, ch, ep){
    V.event.type = type ? type : 'Event';
    V.event.name = name ? name : '';
    V.event.eid = eid ? eid : '';    
    V.event.ch = ch? ch : '';
    V.event.ep = ep? ep : 0;
    V.system.mode = 'event';
    return ''
}

F.setMemory = function(id, title, chara){
    const e = V.event

    if(!V.memory[e.type]){
        V.memory[e.type] = {}
    }

    if(e.type !== 'Kojo'){
        V.memory[e.type][id] = {
            name: e.type.name,
            title: title,
            ep:[],
            sp:[],
        }        
    }
    else{
        if(!V.memory[chara]) V.memory[chara] = {};
            V.memory[chara][id] = {
                name: e.type.name,
                title: title,
                ep:[],
                sp:[],
        }
    }
}

F.recEventPoint = function(t){
    const c = V.event.type
    const v = V.event[t]
    const id = V.event.id
    let k

    if(t=='sp' && V.event.ep){
        k = `ep${V.event.ep}:sp${v}`
    }
    else{
        k = t+v
    }

    if(V.memory[c][id] && V.memory[c][id][t].includes(k) === false )
       V.memory[c][id][t].push(k);
}

F.recKojoCom = function(){
    
}
