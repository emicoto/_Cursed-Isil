修改文件后，运行packgame.bat可以将文件夹gamecode,modules里的代码打包为html文件。
打包后的文件再public中.

如果没修改过文件就不用运行packgame！！！
只是玩游戏就直接打开public里面的html文件！！

.bat的启动器是直接用默认浏览器启动。
如果默认浏览器是360一类的国产垃圾浏览器，有可能会无法正确运行游戏。
请用谷歌浏览器或edge或safari打开public里面的index.html游玩！！

编辑游戏文件的话,推荐用 Visual Studio Code打开整个文件夹.
如果懂得用terminal, 可以打开terminal并执行yarn dev(需要先安装node.js环境)

关于文件系统:
主要文本文件都在gamecode/twee里面。
主要脚本文件都在gamecode/js里面。
js插件脚本与纯数据设定在module里面

游戏文件的加载与运行顺序：
文件夹优先顺序：modules=>gamecode
js脚本执行时会根据文件夹层数（从最底层开始一直到最上层）=》然后按照文件名排序运行
这个顺序很重要不要随便修改文件夹的名字！

游戏本体在public里面
CSS文件也在public里面
图片文件也在public里面
游戏界面的CSS文件在public/CSS/game里

除了实在无法分开的情况，
所有数据、功能执行都应该用js写
所有文本内容与界面设计都应该用twee写

数据设定主要放gamecode/js/02-GameInit中
角色卡注册文件 initChara.js
各种参数设定(素质什么的) 在modules/initdata.js里

系统初始化
GameSetup.twee

开始界面与开始事件
GameStart.twee

事件文本可以直接当txt文本写。
但指令文本要带格式。
详细看对应的文件：command.twee、kojo.twee、Message.twee

角色口上每个角色对应一个twee，虽然随便放都行。不过最好统一放twee/kojo文件夹里面
指令相关文件：command.twee, command.js

era流程系统
main.twee
mainloop.js


关于一些自制macro的说明：

<<com '指令名' 123 101>> 内容 <</com>>
其中123是经过时间，101是指令id。
执行结果就是会运行被框住的内容。并将经过时间记录到$passtime，指令id记录到$selectCom中。

这个已经打包进 显示指令按钮一览中了。

<<selection>>
<<pick '选项A'>>
选择选项A后的内容
<<pick '选项B'>>
选择选项B后的内容
<</selection>>

在selection后加replace
就是这样<<selection replace>>
就能改成replace的形式显示选项后的内容。

pick可以在选项名后添加 选项id（数字）或者 event。
添加了event后会自动将选项id记录到$event.sp中。
如果存在{eventTitle}:s{id}，就会读取这个段落中的代码。并且在执行后将文本跳转到{eventTitle}:sp{id}中。
在历史回顾模式下，不会执行 {eventTitle}:s{id}中的代码。

selection比较泛用。
唯一缺点是不能配合<<if>><<else>>来隐藏或开放选项。


<<selects '选项名'>>选择后的内容<</selects>>

selection的独立版。一样有replace/event的追加tag。
可以配合<<if>><<else>>来使用。

<<eventSelect>>
<<select '选项A'>>
选择选项A后的内容
<<select '选项B'>>
选择选项B后的内容
<</eventSelect>>

串流型事件模式专用的简化版。选了后会自动展开。（单选模式）
没有额外的tag。内部已经自动进行各种相关处理。

<<returnPhase>>
返回上一个小段落
搭配选项使用，可以以简单的操作一直执行相同选项/指令。

<<resetLink>>
清除content内的所有链接。
指令事件中制作分支文本时用。
……不清除链接的话，原来的分支选项还是会在的。

era经典指令模式用法：
主文件：
Command.twee
  · ComList内登记指令id和指令名。 可以追加填写过滤分类的tag， 经过时间
  · Com.globalFilter 里可以设置全局的指令过滤条件
  · Com.globalOrder  里可以设置全局的配合度检测条件
  · Com.globalCond   里可以设置全局的指令检测条件

  指令的登录与文本模板看文件内的说明.

  指令具体设置模板。id替换为指令id。
  :: Com_id::Script[script]
     这个文本块中只能是代码。用于登记独立的执行条件检测、执行配合值检测、成功执行时的数据处理效果。

     Com.set('id')
        .Check(()=>{
             这个方法中可以写执行条件的检测。
             如果只有一个条件。可以直接return条件式
             如：return F.baseCheck(player, 'stamina', 'max')

             F.bascCheck是一个检测base数值的快捷方式。代入参数顺序为：player或target， 需要检测的变量名称， 百分比数值。
             数值输入 max 的话，会自动解析为 上限值的 100%
             就是当 stamina低于 上限值的100%时，会返回 true。
             输入 0.8 的话，则是当stamina低于 上限值80%时，会返回true。
             输入具体数值 如 800， 则是当stamina低于 800时会返回true。
        })
        .Filter(()=>{
          这个方法中可以写指令单独的过滤条件。
        })
        .ComOrder(()=>{
          这个方法可以写指令单独的配合值检测。
          最后返回的值是 需求的配合值。
        })
        .Name(()=>{
          这个方法中可以写指令名的显示切换。
        })
        .ForceAble() // 这个方法用于设置指令可以无视一定程度的配合值（可以进行设置），只看执行条件结果强制执行。主要用于制作情景差分。
        .Effect(()=>{
            这里可以对Source或Cflag、Tsv等进行操作。
            Source[pc].stamina += 30  // 玩家角色的stamina 将会增加 30
            Tsv[pc].rest = 1 // 这是一个自定义的flag。 输入 1 则代表开。
           
            if(!Tsv[pc].restToday) Tsv[pc].restToday = 1 ;
            else Tsv[pc].restToday += 1 ;

            这段代码是指当玩家角色的临时flag restToday不存在时，则直接给予赋值 1.
            如果已经存在，则 +1.
        })

  script可以整合到一个文本区中。
  例如：
  :: Com_AbleAll[script]
   在这里整合所有指令的Check部分。
  Com.set('G1').Check(()=>{ 
    return 1 
  })
  Com.set('G2').Check(()=>{ 
    return 1 
  })
  Com.set('G3').Check(()=>{ 
    return 1 
  })
  Com.set('G4').Check(()=>{ 
    return 1 
  })

  :: Com_id
    执行成功时显示的文本。 <br>  <br>是分行符。com模式可能有很多琐碎的分支。为了避免出现多余空白，需要用分行符进行控制。
    <<=F.Kojo($tc, 'Com', 'id')>> 这一段用于读取目标对象的角色口上. 括号内的参数顺序为: 角色id, 事件类别, 事件id. 后面还可以追加 分支id. $tc是一个全局变量, 用于储存target的id.
  
  :: Com_id:Before
    如果存在就会进行召唤。
    指令执行前的确认文本。可以在这个环节取消指令的执行。
    <<=F.Kojo($tc, 'Com', 'id', 'Before')>>召唤角色口上.最后一个参数是分支id
    
  :: Com_id:After
    如果存在就会进行召唤。
    数据执行处理完毕后的事件文本。主要用于高潮或刻印或素质变动时的特殊事件或分支。
    <<=F.Kojo($tc, 'Com', 'id', 'After')>>

  :: Com_id:Fail
    如果存在就会进行召唤。
    指令执行失败时显示的事件文本。
    <<=F.Kojo($tc, 'Com', 'id', 'Fail')>>
    <fr> 这是一个分页符. 会将前后两段文本隔开.分页符要单独一行.
    翻页!
    <fr>
    已经是最后一页了.

  :: Com_id:Force
    如果存在就会进行召唤。
    强行执行指令时的分支。一般用于整个事件脉络都不一样时。
    只是少数差分，建议直接在Com_id中根据是否存在 T.force 这个flag来判定进行分支。
  
CommandLoop.twee
  指令主界面的设计文件。
  <div id='location'> 这里会显示地点信息. </div>
  <div id='content class='content' onClick='if(S.
  msg) F.ComNext()'> 
     <div id='contentMsg'> 这里会显示主要文本. 点击文本面板会自动刷新下一段文本.方便连打跳过. </div>
     <div id='msg_end' style='height:0px ;overflow:hidden'> 这里是文本底部, 用于自动滚动.不要动.</div>
  </div>

  <div id='commandmenu'> 这里会显示指令过滤目录和重要菜单目录</div>
  <div id='comandzone'> 这里会显示指令列表 </div>
  <div id='nex'> 一个稳定固定的Next按钮召唤区. </div>

command.js
  指令class与功能api

CommandLoop.js
  era经典模式指令系统的执行流程与处理系统。
  相关设置地址：
  initData.js中的 D.ComTypes 可以设置指令主分类 
  D.ComFilterGeneral 可以设置常规模式下的过滤分类
  D.ComFilterTrain 可以设置调教/推倒模式下的过滤分类

  D.defaultExit 可以设置角色事件/剧情事件执行结束时的默认出口. 出口就是 :: passageName 这里的 passageName,  也就是标题.

  D.ignoreOrder 可以设置能无视的配合值

  角色口上系统:
  Kojo.js
  class Kojo和功能api

  经典模式下的指令相关口上格式

  :: Kojo_cid_Com_id
  cid 替换为角色id
  id 替换为指令id

  :: Kojo_cid_Com_id:Before
  :: Kojo_cid_Com_id:After
  :: Kojo_cid_Com_id:Fail
  :: Kojo_cid_Com_id:Force
  指令事件中的各分支，角色口上也有对应的。
  即使指令本身没有进行分支设置，如果角色口上这边设置了分支，也是会执行并显示。
  也可以利用此机制，

  时间经过与数值处理：
  timeprocess.js

  F.timezone 获取时间带名称
  F.showtime 根据设置显示当前游戏内日期和时间

  F.passtime 时间经过处理总控制。 代入参数是经过的时间

  F.timeProcess 日期与时钟的处理。
  
  F.timeEffects 时间经过的各种数值处理与效果、flag变动处理。调教数值的变动也在这里。

  便利技巧：
  使用浏览器控制台输入
  Action.output('kojo')
  的话，能全自动制作一个填好格式与内容的全新的动作指令口上模板。

  口上模板内的内容可能不太全，版本更新时推荐用这个技巧获得一个新模板来复制黏贴。