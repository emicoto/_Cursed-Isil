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
js插件脚本在module里面

游戏本体在public里面
CSS文件也在public里面
图片文件也在public里面
游戏界面的CSS文件在public/CSS/game里

除了实在无法分开的情况，
所有数据、功能执行都应该用js写
所有文本内容与界面设计都应该用twee写

数据设定主要放gamecode/js/02-GameInit中
角色卡注册文件 initChara.js
各种参数设定(素质什么的) initdata.js

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
