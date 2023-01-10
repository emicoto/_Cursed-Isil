
D.bodyparts = {
    head:'头部',
    mouth:'嘴巴',
    torso:'胴体',
    body:'身体',
    top:'上身',
    bottom:'下身',
    genital:'生殖器',
    organ:'器官',
    private:'私处',
    groin:'腹股沟',
    slimebody:'史莱姆身',
    snakebody:'蛇身',
    tailbody:'尾身',
    nipple:'乳头',
    wings:'翅膀',
    wingL:'左翼',
    wingR:'右翼',
    horns:'角',
    tails:'尾巴',
    tentacles:'触手',
    face:'面部',
    eyes:'双眼',
    eyeL:'左眼',
    eyeR:'右眼',
    nose:'鼻子',
    ears:'耳朵',
    earL:'左耳',
    earR:'右耳',
    shoulder:'肩部',
    breast:'胸部',
    abdomen:'腹部',
    arms:'手臂',
    armL:'左臂',
    armR:'右臂',
    legs:'腿部',
    legL:'左腿',
    legR:'右腿',
    thighs:'大腿',
    hips:'臀部',
    buttL:'左臀',
    buttR:'右臀',
    butts:'屁股',
    thighL:'左大腿',
    thighR:'右大腿',
    ankles:'脚踝',
    wrists:'手腕',
    ankleL:'左脚踝',
    ankleR:'右脚踝',
    feet:'双脚',
    hands:'双手',
    footL:'左脚',
    footR:'右脚',
    handL:'左手',
    handR:'右手',
    critoris:'阴蒂',
    anal:'肛门',
    penis:'阴茎',
    vagina:'阴道',
    womb:'子宫',
    anus:'肛门',
    urin:'尿道',
    foot:'脚',
    hairs:'头发',
    neck:'脖子'
}

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
        arr.push(newobj)   
    }

    const makeObj = (line)=>{
        const keys = line.replace('#|','').split(',')
        obj = {}
        keys.forEach((k)=>{
            obj[k] = null;
        })
    }

    var obj
    const arr = {}
    if(!menu) arr.a = []

    rawtxt.forEach((raw=>{
        raw = raw.replace(/\s/g, '')
        if(raw[0] == '#') {
            makeObj(raw);
        }
        else if(raw.match(/^\/\*(.+)\*\/|^\/(.+)/) || raw === ''){
            //注释和空行要过滤掉
        }
        else{
            if(menu){
                if(!arr[raw[0]])
                    arr[raw[0]] = [];
                convert(raw, arr[raw[0]])
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

F.extendParts = function(raw, key){
    if( key !== 'targetPart' && key !== 'usePart') return raw
    if( !raw ) return raw

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

    const part = {m:'mouth', b:'breast', p:'penis', c:'critoris', v:'vagina', a:'anal', u:'urin', e:'ears', h:'hands', f:'foot', n:'neck', s:'butts', r:'nipple', g:'thighs', d:'abdomen' }

    const arr = re.split('').map(char => part[char]);
    return arr   
}

const actList = {}

class Action{
    constructor(id, name, { time = 5, mode = 0, usePart, targetPart, option, defaultText } = {} ){

        const typeMap = new Map([['g', '常规'], ['d', '场所'], ['t', '调教'], ['x', '触手'],['a','其他'],['o','道具']])
        this.id = id;
        this.name = name;
        this.type = typeMap.get(id[0]);
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
        return Action.data[id]
    }
    
    static create(data, mode){
        const { name, templet } = data

        let txt = `:: Action_${data.id}_Option[script]\nAction.set('${data.id}')\n     .Filter(()=>{\n         return 1\n      })\n     .Check(()=>{\n         return 1\n      })\n     .Order(()=>{\n         return 0\n      })\n\n`

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

        if( ['调教', '触手'].includes(data.type) ){
            txt +=  data.usePart.map(k => {
                return `${title}_${k}\n/* ${name} */\n<<switch Act[pc].use>>\n${ctx(k)}<</switch>>\n\n`
            }).join('')
        }
        else if(data.type == '道具'){
            return `${title}\n/* ${name} */\n<<switch Act[pc].use>>\n${ctx('hands')}<</switch>>\n\n`
        }
        else{
            txt += `${title}\n/* ${name} */\n<<you>>在$location.name开始${name}。<br>\n\n`
        }

        return txt

    }
    static init(){
        let arr = F.initList('ActionList', 1 ,F.extendParts)
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
}

window.Action = Action;
Action.data = actList;

Action.init()

Action.globalCheck = function(){

}

Action.globalFilter = function(){

}