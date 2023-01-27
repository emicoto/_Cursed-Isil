export type P = [number, number];

export type Dict<T = any, K extends string = any> = {
	[key in K]?: T;
};

export type race =
	| "human"
	| "elvin"
	| "wolves"
	| "drawf"
	| "goblin"
	| "catvinx"
	| "centaur"
	| "deamon"
	| "orc"
	| "titan";

export type jobclass = "scholar" | "mage" | "ranger" | "medics" | "warrior" | "alchemist" | "";

export type statskey = "ATK" | "DEF" | "MTK" | "MDF" | "STR" | "CON" | "DEX" | "INT" | "WIL" | "PSY" | "ALR" | "LUK";

export type basekey =
	| "health"
	| "stamina"
	| "sanity"
	| "mana"
	| "drug"
	| "alcohol"
	| "dirty"
	| "stress"
	| "hydration"
	| "nutrient";

export type palamkey =
	| "ecstacy"
	| "arousal"
	| "surrend"
	| "fear"
	| "mortify"
	| "pain"
	| "depress"
	| "resist"
	| "favo"
	| "eager"
	| "angry"
	| "satisfy"
	| "ecM"
	| "ecB"
	| "ecC"
	| "ecU"
	| "ecV"
	| "ecA"
	| "paM"
	| "paB"
	| "paC"
	| "paU"
	| "paV"
	| "paA";

export type ablkey =
	| "magica"
	| "lumen"
	| "ark"
	| "flare"
	| "ions"
	| "vitae"
	| "terra"
	| "electron"
	| "sword"
	| "wrestle"
	| "cooking"
	| "plant"
	| "medicine"
	| "craft"
	| "fishing"
	| "gathering";

export type sblkey =
	| "knowledge"
	| "technique"
	| "endurance"
	| "submissive"
	| "refuse"
	| "hypnosis"
	| "desire"
	| "service"
	| "Asens"
	| "Bsens"
	| "Csens"
	| "Msens"
	| "Usens"
	| "Vsens"
	| "Astrech"
	| "Ustrech"
	| "Vstrech"
	| "exhibition"
	| "promscuity"
	| "sexaddic"
	| "drugaddic"
	| "masochist"
	| "semenaddic"
	| "analejac"
	| "vagiejac"
	| "deviancy"
	| "gangbang"
	| "tentacles";

export type expkey =
	| "M"
	| "B"
	| "C"
	| "U"
	| "V"
	| "A"
	| "M高潮"
	| "B高潮"
	| "C高潮"
	| "U高潮"
	| "V高潮"
	| "A高潮"
	| "高潮"
	| "强烈高潮"
	| "深度强烈高潮"
	| "多重高潮"
	| "接吻"
	| "射精"
	| "喷乳"
	| "放尿"
	| "饮精"
	| "肛交"
	| "性交"
	| "乳交"
	| "口交"
	| "内射"
	| "肛射"
	| "乳头开发"
	| "后穴开发"
	| "尿道开发"
	| "子宫开发"
	| "插入"
	| "道具"
	| "受虐"
	| "露出"
	| "被拍摄"
	| "怀孕"
	| "产卵"
	| "轮奸"
	| "兽奸"
	| "触手奸"
	| "眠奸"
	| "强奸"
	| "迷奸"
	| "性转"
	| "同性"
	| "爱情"
	| "侍奉"
	| "自慰"
	| "嗑药"
	| "服从"
	| "催眠"
	| "调教"
	| "施虐";

export type markkey = "hypno" | "ecstacy" | "surrend" | "pain" | "fear" | "humil" | "resit";

export type maptype = "town" | "field" | "dungeon" | "location" | "room" | "spot";

export type rarity = "C" | "UC" | "R" | "SP" | "ER" | "LR";

export type maptags =
	//地点区域
	| "休息区"
	| "种植区"
	| "采集区"
	| "挖矿区"
	| "钓鱼区"
	| "阅读区"
	| "探索区"
	| "地下"
	| "森林"
	| "平原"
	| "水下"
	| "天上"
	| "山岳"
	| "严寒"
	| "炎热"
	| "室内" //室外户外都属于外部开放空间。但室外指建筑物外，附近可能存在建造物和围墙。
	| "室外" //户外自带开阔属性。
	| "户外"
	| "露天" //这个露天是室内用的
	| "交通"
	| "水源"
	| "战斗区"
	| "景点"

	//房间类型
	| "私人"
	| "个人"
	| "睡房"
	| "厕所"
	| "浴厕"
	| "沐浴"
	| "澡堂"
	| "厨房"
	| "教室"
	| "商店"
	| "活动"
	| "舞台"
	| "餐厅"
	| "酒馆"
	| "旅馆"
	| "会所"
	| "娼馆"
	| "遗迹"
	| "地下城"
	| "迷宫"
	| "下水道"
	| "家"
	| "防御"
	| "研究"
	| "宿舍"

	//特征
	| "阴影处" //只用在室外
	| "隐蔽"
	| "开阔"
	| "封闭" //没有窗没有门的全封闭空间，只能通过特殊途径进入
	| "狭窄"
	| "宽敞"
	| "高台"
	| "悬浮"
	| "无窗"
	| "上锁"
	| "遮顶"
	| "异空间";

//特征
export type maptrait = "光亮处" | "阴影处" | "隐蔽" | "辽阔" | "封闭" | "狭窄" | "宽敞" | "高台";

//设施、家具
export type placement =
	| "衣柜"
	| "床"
	| "椅子"
	| "沙发"
	| "书架"
	| "桌子"
	| "乐器"
	| "落地窗"
	| "镜子"
	| "魔网"
	| "移动摊位"
	| "防御炮台"
	| "传送门"
	| "长椅"
	| "旗帜";

export type locationside = "E" | "W" | "N" | "S";
