Macro.add('com',{
    tags:null,
    handler: function(){
        let { contents, args } = this.payload[0]

        if(args.length === 0){
            return this.error('no command text specified')
        }
        
        if(!T.comcount) T.comcount = 1
        else T.comcount ++

        let comId = args[2]

        let output = `<div id='com_${T.comcount}' class='command'>
        <<button '${args[0]}'>>
        <<set $selectCom to ${comId}>><<set $passtime to ${args[1]}>>
        ${contents}
        <</button>>
        </div>`

        if(Config.debug)
            console.log(output);
            
        jQuery(this.output).wiki(output)
    }
})


window.comdata = new Array(200)
class Com {
	static new(id, name, tags, time){
		comdata[id] = new Com(id, name, tags, time)
		return comdata[id]
	}
    static set(id, time){
        if(time){
            return comdata[id].Time(time)
        }
        else{
            return comdata[id]
        }
    }

    static init(){
        const raw = Story.get('ComList').text.split('\n')
        const list = []
        raw.forEach((k)=>{
            if( !k.includes('/*') && k !== '' ){
                let r = k.split(',')
                let info = {
                    no: parseInt(r[0]),
                    name: r[1] ? r[1] : 'Com' + r[0],
                    tags:r[2] ? r[2].split('|') : [],
                    time: r[3] ? parseInt(r[3]) : 5,
                }

                const select = new SelectCase()

                select.case(20, '日常')
                      .case(50, '前戏')
                      .case(80, '触手')
                      .case(160, '性交')
                      .case(200, '肛交')
                
                let tag = select.isLT(info.no)
                info.tags.push(tag)

                if(inrange(info.no,20,200))
                    info.tags.push('调教')

                //console.log(info)
                list.push(info)
            }
        })

        list.forEach((k)=>{
            Com.new(k.no, k.name, k.tags, k.time)
        })
    }

	constructor(id, name, tags, time){
		this.id = id
		this.name = name
		this.tag = tags
        this.filter = ()=>{ return true } //特定的过滤器。
        this.cond = ()=>{ return true }
        this.source = ()=>{}
        this.time = time
        this.order = ()=>{ return 0}
	}
	Check(callback){
		this.cond = callback
		return this
	}
	Filter(callback){
		this.filter = callback
		return this
	}
	Effect(callback){
		this.source = callback
		return this
	}
	Tags(arr){
		this.tag = arr
		return this
	}
	Time(t){
		this.time = t
		return this
	}
    addTag(arg, ...args){
        this.tag.push(arg)
        if(args){
           this.tag =  this.tag.concat(args)
        }
        return this
    }
    ComOrder(callback){
        this.order = callback;
        //录入reason同时返回order值
        return this
    }
    Name(callback){
        this.name = callback;
        return this;
    }
    ForceAble(){
        this.forceAble = true;
        return this;
    }

}
window.Com = Com

F.ComFilters = function(){
    const general = ['日常','挑逗','魔法']
    const train = ['前戏','道具','性交', '尿道', 'SM', '鬼畜', '触手']
    const end = '<<=F.initComList()>><</link>>'
    const generalink = []
    const trainlink = []

    general.forEach((k)=>{
        generalink.push(`<<link '${k}'>><<set $currentFilter to '${k}'>>${end}`)
    })

    train.forEach((k)=>{
        trainlink.push(`<<link '${k}'>><<set $currentFilter to '${k}'>>${end}`)
    })

    return `<<link '全部'>><<set $currentFilter to 'all'>>${end} ｜ ${generalink.join('')}<<if $mode is 'train'>>${trainlink.join('')}<</if>>`
}

F.initComList = function(){

    const command = []

    comdata.forEach( (com, i) =>{
        let name = ''

        if(typeof com.name === 'function') name = com.name();
        else name = com.name;

        let txt = ''

        if( com.filter() && Com.globalFilter(i)){
            txt = `<<com '${name}' ${com.time} ${i}>><<run F.ComCheck(${i})>><</com>>`
        }
        else if( V.system.showAllCommand ){
           txt = `<div class='command unable'><<button '${name}'>><</button>></div>`
        }

        command.push(txt)
    })

    if(command.length){
        new Wikifier(null,`<<replace #commandzone>>${command.join('')}<</replace>>`)
    }// 数量过多时启动分页显示。
}