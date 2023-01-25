

D.category = {
    head:'hat', neck:'neck', facial:'face',
    earing:'ears', hands:'hands',

    coat:'cover', upper:'outfitUp', bottom:'outfitBt',
    innerUp:'innerUp', innerBt:'innderBt', 
    legging:'legs', shoes:'shoes', 

    onepiece:'outfitUp', suits:'cover',
    none:'',

   /* nipplace:'',
    sexplugin:'',  虽然会在worn下面，但是不在服饰的类别中    */
}

//商店种类，限定地点。
D.shop = [
    'general', 
    'event', 
    'adluts',  
    'unique', 
    'special',
    'ordermade', 
    'academy',
    'guildshop',
    ]


//物品tag。影响事件、互动条件判定。
D.tags = [
    'transparent',
    'skirt', 
    'highheel', 

    'swinming',
    'raincoat',
    'dive',
    'waterproof',

    'formal', 
    'stage', 
    'business', 
    'COSPLAY', 
    'sexy', 
    'sports', 
    'fashion', 
    'magical', 
    'shine', 
    'servant', 

    'combat', 
    'pajamas',
    'daily', 
    'school', 
    'special', 
    ]

D.clothesheet = {
    id:'clothes_upper_1',
    uid:0,//购买时生成的绝对id，9位数字

    category:'upper',
    name:['校服上衣','school shirt'],
    des:['魔法学院制服的上衣。','a school shirt for magica academy school.',],
    shop:'academy',

    gender:'n',
    tags:['school'],

    cost:50,
    durable:50,
    maxdurable:50,
    
    cover:['top'], //覆盖部位

    expose:0, //暴露度。0=无，1=若隐若现 2=看的清除但有阻隔 3=完全暴露
    open:1, //开口。 0=必须脱下，1=敏感区附近有纽扣or纽带可解开，2=敏感区附近有开口 3=完全暴露

    length:0, //裙子用，判定走光风险。单位mm

    beauty:0.05, //外貌加值，乘数
    DEF:0.5, //防御加值，加数
    ALR:0, //魅力加值，加数，加到ALR中

    cursed:0, //是否诅咒物品。如果是则无法脱下
    effect:[],//衣服特殊效果。functionname, source
}