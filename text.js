class Atest{//我这里想的是状态设计，进行一个重复状态运用，每次切换地图其实就是刷新地图状态
updateMap(mapid) { //更新地图状态，传入地图id
    //这里是最上层，一切判断的开始，对现有的玩家状态进行初始化

    //一、
    //初始化场景，这个场景里可以干什么
    //利用mapid，也就是场景id来获取当前场景主角可以进行的动作action（放松 散步 交流 学习 购物……这样。）
    //记住要将当前的action状态进行一个保存，用于默认值，如果玩家动作刷新没有，那么就用地图动作作为默认值
    var action = this.initMap(mapid);

    //二、
    //刷新npc列表，这个地图里面可能存在的npc，如果npc有自己的行为逻辑，那么可能需要先处理行为逻辑判断之后，再判断这个地图上会不会出现npc
    //处理完毕之后，地图上就刷出固定再地图上的npc和随机出现的npc
    this.updateNPCLIst(mapid);

    //三、
    //接下来处理角色动作了
    //利用该地图允许的动作action对玩家状态进行一个刷新
    this.updatePlayerAction(action)


    //好了该地图状态已经刷新完毕，剩下的逻辑再其他地方处理，面向对象思维
};


//只做玩家的交流指令处理，传入什么交流指令，就处理什么，不管是地图事件，npc交流，还是涩涩交互，都可以用一个
//作为单一的操作反馈，越简单越不容易出错
updatePlayerAction(action) {
    //处理处理处理
    //显示显示显示
};


//————————————————————————————————————————
//接下来是对玩家点击反馈的一个操作处理
//————————————————————————————————————————


//这里是对其中一个NPC进行一个点击后的反馈，npcid记得临时缓存
btnClickNpc(npcid) {
    //这里先获取NPC独有的显示状态交流指令，例如商人，或者剧情角色等等，将独有的状态挑拣出来
    var npcAciton = this.getNpcShowAction(npcid)

    //这里将获取通用的交流指令(闲聊  观察  询问近况  谈论兴趣  摸头 调情 送礼 接触)
    var normalAciton = this.getShowAction()

    //接着处理这个npc会出现的交流指令，并且将他们的数据处理打包，我就简单写个相加，你理解就成
    var action = npcAciton + normalAciton;

    //将处理的之后的npc交流指令丢到玩家的状态处理中，对玩家的下方交流指令进行一个刷新
    this.updatePlayerAction(action);
};

//这里是取消npc对话，类似地图交互处理
btnReturn(npcid) {
    //直接对玩家交流指令进行一个刷新，动作用初始化地图后保存的action数据即可
    this.updatePlayerAction();
};

//这里是接触NPC，之后的 闲聊  观察  询问近况  谈论兴趣  摸头 调情 送礼 这些都可以抽象出来，只不过接触需要抽象之后继续抽象
btnContact(npcid) {
    //一样的思路，先获取npc接触状态下的特殊涩涩选项
    var npcContactAction = this.getNpcContactAction(npcid)

    //再获取npc的通用涩涩选项
    var normalContactAction = this.getContactAction()

    //接着继续处理，相加，你理解就成
    var action = npcContactAction + normalContactAction;

    //直接对玩家交流指令进行一个刷新，动作用初始化地图后保存的action数据即可
    this.updatePlayerAction(action);
};

//这里是动作一，玩家用手进行一个XXX处理，因为是按钮触发，所以当点进来之后你就要知道这个事件处理的是什么
btnAction1() {

};
//这里是动作二，玩家用手进行一个XXX处理，因为是按钮触发，所以当点进来之后你就要知道这个事件处理的是什么
btnAction2() {

};
//这里是动作三，玩家用手进行一个XXX处理，因为是按钮触发，所以当点进来之后你就要知道这个事件处理的是什么
btnAction3() {

};
//接下来以此推类进行一个分化处理
}