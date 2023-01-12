
F.initList = function(path, menu, option){
    const rawtxt = Story.get(path).text.split('\n')

    const convert = (raw, arr)=>{
        const v = raw.split(',')
        const keys = Object.keys(obj)
        let newobj = {}

        keys.forEach( (k, i) =>{
            newobj[k] = v[i];
            if(typeof option === 'function'){
                newobj[k] = option(v[i], k)
            }
        })
        newobj.type = id
        arr.push(newobj)   
    }

    const makeObj = (line)=>{
        const keys = line.slice(3).split(',')
        obj = {}
        keys.forEach((k)=>{
            obj[k] = null;
        })
    }

    var obj, id
    const arr = {}
    if(!menu) arr.a = []

    rawtxt.forEach((raw=>{
        raw = raw.replace(/\s/g, '')
        if(raw[0] == '#') {
            makeObj(raw);
            id = raw[1]
        }
        else if(raw.match(/^\/\*(.+)\*\/|^\/(.+)/) || raw === ''){
            //注释和空行要过滤掉
        }
        else{
            if(menu){
                if(!arr[id])
                    arr[id] = [];
                convert(raw, arr[id])
            }
            else{
                convert(raw, arr['a'])                
            }
        }

    }))

    const result = [];
    Object.values(arr).forEach( array =>{
        result.push(...array)
    })

    return result
}

F.extendTags = function(raw){
    return raw.split('|')
}

F.extendsRaw = function(raw, key){
    if( key == 'locationTags' ) return F.extendTags(raw)
    if( key == 'targetPart' || key == 'usePart') return F.extendParts(raw)
    return raw
}

F.extendParts = function(raw){
    let list = 'mbpcvauehfnsrgd'
    let re = raw

    if(raw.match(/^--\S+$/)){
        raw = raw.replace('--','')
        for(let i in raw){
            list = list.replace(raw[i], '')
        }
        re = list
    }

    if(raw=='all'){
        re = list
    }

    const part = {m:'mouth', b:'breast', p:'penis', c:'critoris', v:'vagina', a:'anal', u:'urin', e:'ears', h:['handL','handR'], f:'foot', n:'neck', s:'butts', r:'nipple', g:'thighs', d:'abdomen' }

    const arr = re.split('').map(char => part[char]).flat();
    return arr   
}

const actList = {}

class Action{
    constructor(id, name, { time = 5, mode = 0, usePart, targetPart, option, defaultText, type } = {} ){

        const typeMap = new Map([['G', '常规'], ['T', '接触'], ['X', '触手'],['O','其他'],['I','道具'],['R','被动'],['C','交流']],)
        this.id = id;
        this.name = name;
        this.type = typeMap.get(type);
        this.time = parseInt(time);
        this.mode = parseInt(mode);

        if(usePart)
            this.usePart = usePart;
        if(targetPart)
            this.targetPart = targetPart;
        if(option)
            this.option = option;
        
        if(this.type == '触手')
            this.usePart = ['tentacles'];
        
        this.filter = ()=>{ return 1 };
        this.check = ()=>{ return 1 };
        this.order = ()=>{ return 0 };
        this.templet = defaultText;
    }

    static add(id, name, obj){
        Action.data[id] = new Action(id, name, obj)
    }
    static get(arg, args){
        switch(arg){
            case 'usePart':
                return Object.values(Action.data).filter(action => action.usePart && action.usePart.has(args))
            case 'targetPart':
                return Object.values(Action.data).filter(action => action.targetPart && action.targetPart.has(args))
            case 'type':
                return Object.values(Action.data).filter(action => action.type === args)
            default:
                return Object.values(Action.data).find(action => action.type === arg && action.name === args)
        }
    }

    static set(id){
        //console.log(id, Action.data[id])
        return Action.data[id]
    }
    
    static create(data, mode){
        const { name, templet } = data

        let txt = `:: Action_${data.id}_Option[script]\n/* ${name} */\nAction.set('${data.id}')\n     .Filter(()=>{\n         return 1\n      })\n     .Check(()=>{\n         return 1\n      })\n     .Order(()=>{\n         return 0\n      })\n\n`

        if(mode == 'kojo' ) txt = ''

        const ctx = (use) => {
            return data.targetPart.map(tar => {
                return `<<case '${tar}'>>\n   ${
                    templet.replace(/\{0}/g,'<<you>>')
                        .replace(/\{1}/g,'$target.name')
                        .replace(/\{2}/g, D.bodyparts[tar])
                        .replace(/\{3}/g, D.bodyparts[use])
                }<br>\n`
            }).join('')
        }

        let title = `:: ${mode=='kojo' ? 'Kojo_cid_' : ''}Action_${data.id}`

        if( mode == 'script'){
            return txt
        }
        
        if( ['接触', '被动', '触手'].includes(data.type) ){
            
            txt +=  data.usePart.map(k => {
                return `${title}\n/* ${name} */\n<<switch F.checkUse(tc, '${data.id}')>>\n${ctx(k)}<</switch>>\n\n`
            }).join('')
        }
        else if(data.type == '道具'){
            return `${title}\n/* ${name} */\n<<switch F.checkUse(tc, '${data.id}')>>\n${ctx('hand')}<</switch>>\n\n`
        }
        else{
            txt += `${title}\n/* ${name} */\n<<you>>在$location.name开始${name}。<br>\n\n`
        }

        return txt

    }
    static init(){
        let arr = F.initList('ActionList', 1 ,F.extendsRaw)
        console.log(arr)
         arr.forEach((obj)=>{
            Action.add(obj.id, obj.name, obj)
        })
    }
    static output(mode){
        const txt = Object.values(Action.data)
        .filter(action => (mode == 'kojo' && ['调教','触手','道具'].includes(action.type)) || action.type !== '' )
        .map((data) => Action.create(data, mode))
        .join('')

        download(txt, 'action', 'txt')
    }
    Check(callback){
        this.check = callback
        return this
    }
    Filter(callback){
        this.filter = callback
        return this
    }
    Order(callback){
        this.order = callback
        return this
    }
    ForceAble(){
        this.forceAble = true;
        return this
    }
    setEvent(){
        this.event = true;
        return this
    }
}

window.Action = Action;
Action.data = actList;

Action.globalCheck = function(){

}

Action.globalFilter = function(){

}

Action.globalOrder = function(){

}


Action.init()