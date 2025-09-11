// 词库数据
const TextLibraries = {
    chinese: {
        name: "中文词库",
        description: "现代诗词和英文诗歌中文翻译练习",
        texts: [
            // 现代实用句子
            "快速的棕色狐狸跳过懒狗",
            "编程是一门艺术也是一门科学",
            "天空中飘着朵朵白云",
            "学习打字可以提高工作效率",
            "春天来了花儿都开了",
            "技术改变世界创新引领未来",
            "千里之行始于足下",
            "海纳百川有容乃大",
            "书山有路勤为径学海无涯苦作舟",
            "少壮不努力老大徒伤悲",
            "一寸光阴一寸金寸金难买寸光阴",
            "宝剑锋从磨砺出梅花香自苦寒来",
            "山重水复疑无路柳暗花明又一村",
            
            // 海子作品
            "面朝大海春暖花开",
            "从明天起做一个幸福的人",
            "喂马劈柴周游世界",
            "我有一所房子面朝大海春暖花开",
            "陌生人我也为你祝福",
            "愿你有一个灿烂的前程",
            "愿你有情人终成眷属",
            "愿你在尘世获得幸福",
            "我只愿面朝大海春暖花开",
            "黑夜给了我黑色的眼睛",
            "我却用它寻找光明",
            
            // 徐志摩作品
            "轻轻的我走了正如我轻轻的来",
            "我轻轻的招手作别西天的云彩",
            "那河畔的金柳是夕阳中的新娘",
            "波光里的艳影在我的心头荡漾",
            "软泥上的青荇油油的在水底招摇",
            "在康河的柔波里我甘心做一条水草",
            "撑一支长蒿向青草更青处漫溯",
            "满载一船星辉在星辉斑斓里放歌",
            "但我不能放歌悄悄是别离的笙箫",
            "夏虫也为我沉默沉默是今晚的康桥",
            
            // 林徽因作品
            "你是人间的四月天笑响点亮了四面风",
            "轻灵在春的光艳中交舞着变",
            "你是四月早天里的云烟",
            "黄昏吹着风的软星子在无意中闪",
            "细雨点洒在花前",
            "我说你是人间的四月天",
            "你是雪化后那片鹅黄",
            "你是新鲜初放芽的绿",
            "你是柔嫩喜悦水光浮动着你梦期待中白莲",
            "你是爱是暖是希望你是人间的四月天",
            
            // 舒婷作品
            "我如果爱你绝不像攀援的凌霄花",
            "借你的高枝炫耀自己",
            "我如果爱你绝不学痴情的鸟儿",
            "为绿荫重复单调的歌曲",
            "我必须是你近旁的一株木棉",
            "作为树的形象和你站在一起",
            "根紧握在地下叶相触在云里",
            "你有你的铜枝铁干像刀像剑也像戟",
            "我有我红硕的花朵像沉重的叹息又像英勇的火炬",
            "我们分担寒潮风雷霹雳我们共享雾霭流岚虹霓",
            "仿佛永远分离却又终身相依",
            
            // 艾青作品
            "为什么我的眼里常含泪水",
            "因为我对这土地爱得深沉",
            "我爱这土地爱得深沉",
            "我爱这悲伤的土地",
            "我爱这苦难的土地",
            "我爱这抗争的土地",
            "我爱这希望的土地",
            "我爱这永远不屈的土地",
            
            // 北岛作品
            "卑鄙是卑鄙者的通行证",
            "高尚是高尚者的墓志铭",
            "看吧在那镀金的天空中",
            "飘满了死者弯曲的倒影",
            "冰川纪过去了为什么到处都是冰凌",
            "好望角发现了为什么死海里千帆相竞",
            "我来到这个世界上只带着纸绳索和身影",
            "为了在审判之前宣读那些被判决的声音",
            
            // 英文诗歌中文翻译
            "我是否可以把你比作夏日",
            "你比夏日更可爱更温婉",
            "狂风摇撼着五月娇蕊",
            "夏天的租期又未免太短暂",
            "有时天空之眼照得太灼热",
            "他金色的脸庞又常被遮暗",
            "一切美艳终将美艳不再",
            "偶然或是随自然变化而流转",
            "但你永恒的夏日不会消逝",
            "你也不会失去你拥有的美质",
            "死神不能夸口你在他影中徘徊",
            "你将在不朽的诗行里与时间同在",
            "只要人类能呼吸眼睛能看见",
            "这诗就将长存并赐你生命",
            
            "我像一片云孤独地漫游",
            "高高地飘在山谷和山丘之上",
            "忽然我看见一群金色的水仙",
            "在湖畔在树下在微风中舞蹈",
            "连绵不绝像繁星密布在银河里",
            "它们沿着湖湾的边缘伸展",
            "一望无际的花海在眼前铺开",
            "一万朵花在欢快地舞动",
            "旁边的波浪也在舞蹈但水仙",
            "胜过闪烁的波浪充满欢乐",
            "一个诗人怎能不感到快乐",
            "在这样欢乐的同伴中间",
            "我凝视着凝视着却很少想到",
            "这景象给我带来了怎样的财富",
            
            "不要温和地走进那个良夜",
            "老年应当在日暮时燃烧咆哮",
            "怒斥怒斥光明的消逝",
            "虽然智慧的人临终时懂得黑暗有理",
            "因为他们的话没有迸发出闪电他们",
            "不要温和地走进那个良夜",
            "善良的人最后一浪过高声呼唤",
            "他们脆弱的善行本可以在绿色海湾舞动",
            "怒斥怒斥光明的消逝",
            "狂暴的人抓住并歌唱过翱翔的太阳",
            "懂得但为时太晚他们使太阳在途中悲伤",
            "不要温和地走进那个良夜",
            "严肃的人临近死亡用失明的视觉目睹",
            "失明的眼可以像流星一样闪耀而充满喜悦",
            "怒斥怒斥光明的消逝",
            "而您啊我的父亲在那悲哀的高处",
            "现在用您的热泪诅咒我祝福我吧",
            "不要温和地走进那个良夜",
            "怒斥怒斥光明的消逝",
            
            "两条路在黄色树林中分叉",
            "可惜我不能同时走两条路",
            "我作为一个旅行者久久伫立",
            "顺着一条路远远望去直到它消失在丛林深处",
            "然后我选了另一条同样公平的路",
            "或许还有更好的理由因为它长满青草需要人踩",
            "不过说到这点两条路经过的行人大概都差不多",
            "那天早晨两条路都铺满落叶",
            "还没有脚步把它们踩脏",
            "哦我把第一条路留给了另一天",
            "可知道路连着路我怀疑我还能不能回来",
            "我将在叹息中诉说这一切",
            "在某个很远很远的地方",
            "两条路在树林中分叉而我",
            "我选择了人迹更少的一条路",
            "这便造成了所有的不同",
            
            "希望是长着翅膀的东西",
            "栖息在灵魂的深处",
            "唱着没有歌词的曲调",
            "永远不会停止",
            "在狂风中歌声最甜美",
            "风暴必定会很猛烈",
            "它能让那只小鸟感到不安",
            "它却为许多人保暖",
            "我听见它在最寒冷的土地上",
            "在最陌生的海洋上",
            "然而在绝境中它从未索取过",
            "哪怕是我的一点点",
            
            // 当代诗歌
            "岁月静好现世安稳",
            "愿时光能缓愿故人不散",
            "愿你惦念的人能和你道晚安",
            "愿你独闯的日子里不觉得孤单",
            "愿你走过的崎岖都变成坦途",
            "愿你眼里的星星永远明亮",
            "你是天上的一颗星我是地上的一粒沙",
            "我们相遇在茫茫人海从此不再孤单"
        ]
    },
    
    english: {
        name: "English Library",
        description: "English sentences, phrases, and poetry practice",
        texts: [
            // 经典句子和谚语
            "The quick brown fox jumps over the lazy dog",
            "Practice makes perfect in typing skills",
            "Technology is changing the world rapidly",
            "Coding is both an art and a science",
            "Learn to type faster and more accurately",
            "The future belongs to those who believe in dreams",
            "Success is not final failure is not fatal",
            "The only way to do great work is to love what you do",
            "Innovation distinguishes between a leader and a follower",
            "Life is what happens when you are busy making other plans",
            "The journey of a thousand miles begins with one step",
            "To be or not to be that is the question",
            "All that glitters is not gold",
            "Rome was not built in a day",
            "The early bird catches the worm",
            "Actions speak louder than words",
            "Where there is a will there is a way",
            "Practice is the key to mastery",
            "Time and tide wait for no man",
            "Knowledge is power",
            "The pen is mightier than the sword",
            "A picture is worth a thousand words",
            "Better late than never",
            "Every cloud has a silver lining",
            "The grass is always greener on the other side",
            "What doesn't kill you makes you stronger",
            "Life is like a box of chocolates",
            "Tomorrow is another day",
            "The best is yet to come",
            "Dream big and dare to fail",
            
            // 莎士比亚经典
            "Shall I compare thee to a summer's day",
            "Thou art more lovely and more temperate",
            "Rough winds do shake the darling buds of May",
            "And summer's lease hath all too short a date",
            "Sometime too hot the eye of heaven shines",
            "And often is his gold complexion dimmed",
            "And every fair from fair sometime declines",
            "By chance or nature's changing course untrimmed",
            "But thy eternal summer shall not fade",
            "Nor lose possession of that fair thou ow'st",
            "Nor shall death brag thou wand'rest in his shade",
            "When in eternal lines to time thou grow'st",
            "So long as men can breathe or eyes can see",
            "So long lives this and this gives life to thee",
            
            // 浪漫派诗歌
            "I wandered lonely as a cloud",
            "That floats on high o'er vales and hills",
            "When all at once I saw a crowd",
            "A host of golden daffodils",
            "Beside the lake beneath the trees",
            "Fluttering and dancing in the breeze",
            "Continuous as the stars that shine",
            "And twinkle on the milky way",
            "They stretched in never-ending line",
            "Along the margin of a bay",
            "Ten thousand saw I at a glance",
            "Tossing their heads in sprightly dance",
            "The waves beside them danced but they",
            "Out-did the sparkling waves in glee",
            "A poet could not but be gay",
            "In such a jocund company",
            "I gazed and gazed but little thought",
            "What wealth the show to me had brought",
            
            // 现代诗歌
            "Do not go gentle into that good night",
            "Old age should burn and rave at close of day",
            "Rage rage against the dying of the light",
            "Though wise men at their end know dark is right",
            "Because their words had forked no lightning they",
            "Do not go gentle into that good night",
            "Good men the last wave by crying how bright",
            "Their frail deeds might have danced in a green bay",
            "Rage rage against the dying of the light",
            "Wild men who caught and sang the sun in flight",
            "And learn too late they grieved it on its way",
            "Do not go gentle into that good night",
            "Grave men near death who see with blinding sight",
            "Blind eyes could blaze like meteors and be gay",
            "Rage rage against the dying of the light",
            "And you my father there on the sad height",
            "Curse bless me now with your fierce tears I pray",
            "Do not go gentle into that good night",
            "Rage rage against the dying of the light",
            
            // 惠特曼
            "I celebrate myself and sing myself",
            "And what I assume you shall assume",
            "For every atom belonging to me as good belongs to you",
            "I loafe and invite my soul",
            "I lean and loafe at my ease observing a spear of summer grass",
            "My tongue every atom of my blood form'd from this soil",
            "This air this soil born here of parents born here",
            "From parents the same and their parents the same",
            "I now thirty-seven years old in perfect health begin",
            "Hoping to cease not till death",
            "Creeds and schools in abeyance",
            "Retiring back a while sufficed at what they are but never forgotten",
            "I harbor for good or bad I permit to speak at every hazard",
            "Nature without check with original energy",
            "The paths to happiness I have discovered are these",
            "First is to be honest with yourself",
            "Second is to be honest with others",
            "Third is to work hard at what you love",
            "Fourth is to be grateful for what you have",
            "Fifth is to give back to the world",
            "Sixth is to be kind to all living things",
            "Seventh is to keep learning and growing",
            "Eighth is to find joy in the journey",
            "Ninth is to be present in the moment",
            "Tenth is to love with all your heart",
            
            // 艾米莉·狄金森
            "Hope is the thing with feathers",
            "That perches in the soul",
            "And sings the tune without the words",
            "And never stops at all",
            "And sweetest in the gale is heard",
            "And sore must be the storm",
            "That could abash the little bird",
            "That kept so many warm",
            "I've heard it in the chillest land",
            "And on the strangest sea",
            "Yet never in extremity",
            "It asked a crumb of me",
            
            // 罗伯特·弗罗斯特
            "Two roads diverged in a yellow wood",
            "And sorry I could not travel both",
            "And be one traveler long I stood",
            "And looked down one as far as I could",
            "To where it bent in the undergrowth",
            "Then took the other as just as fair",
            "And having perhaps the better claim",
            "Because it was grassy and wanted wear",
            "Though as for that the passing there",
            "Had worn them really about the same",
            "And both that morning equally lay",
            "In leaves no step had trodden black",
            "Oh I kept the first for another day",
            "Yet knowing how way leads on to way",
            "I doubted if I should ever come back",
            "I shall be telling this with a sigh",
            "Somewhere ages and ages hence",
            "Two roads diverged in a wood and I",
            "I took the one less traveled by",
            "And that has made all the difference"
        ]
    },
    
    modern_poetry: {
        name: "现代诗词",
        description: "现当代经典诗歌选段",
        texts: [
            "面朝大海春暖花开",
            "从明天起做一个幸福的人",
            "喂马劈柴周游世界",
            "我有一所房子面朝大海春暖花开",
            "你是人间的四月天笑响点亮了四面风",
            "轻灵在春的光艳中交舞着变",
            "你是四月早天里的云烟",
            "黄昏吹着风的软星子在无意中闪",
            "细雨点洒在花前",
            "我说你是人间的四月天",
            "轻轻的我走了正如我轻轻的来",
            "我轻轻的招手作别西天的云彩",
            "那河畔的金柳是夕阳中的新娘",
            "波光里的艳影在我的心头荡漾",
            "软泥上的青荇油油的在水底招摇",
            "在康河的柔波里我甘心做一条水草",
            "撑一支长蒿向青草更青处漫溯",
            "满载一船星辉在星辉斑斓里放歌",
            "为什么我的眼里常含泪水",
            "因为我对这土地爱得深沉",
            "我如果爱你绝不像攀援的凌霄花",
            "借你的高枝炫耀自己",
            "我如果爱你绝不学痴情的鸟儿",
            "为绿荫重复单调的歌曲",
            "我必须是你近旁的一株木棉",
            "作为树的形象和你站在一起",
            "根紧握在地下叶相触在云里",
            "每一阵风过我们都互相致意",
            "但没有人听懂我们的言语",
            "你有你的铜枝铁干",
            "像刀像剑也像戟",
            "我有我红硕的花朵",
            "像沉重的叹息又像英勇的火炬",
            "我们分担寒潮风雷霹雳",
            "我们共享雾霭流岚虹霓",
            "仿佛永远分离却又终身相依",
            "伟大的祖国我为你歌唱",
            "你的山川河流如此壮丽",
            "你的文化历史如此辉煌",
            "在你的怀抱里我感到温暖",
            "在你的指引下我奋勇向前",
            "黑夜给了我黑色的眼睛",
            "我却用它寻找光明",
            "卑鄙是卑鄙者的通行证",
            "高尚是高尚者的墓志铭",
            "我看不清远方的风景",
            "却能听见内心的声音",
            "岁月静好现世安稳",
            "愿时光能缓愿故人不散",
            "愿你惦念的人能和你道晚安",
            "愿你独闯的日子里不觉得孤单",
            "愿你走过的崎岖都变成坦途",
            "愿你眼里的星星永远明亮"
        ]
    },
    
    programming: {
        name: "编程代码",
        description: "编程相关语句和代码片段",
        texts: [
            "function helloWorld() { console.log('Hello, World!'); }",
            "const greeting = 'Welcome to programming';",
            "let numbers = [1, 2, 3, 4, 5];",
            "if (condition) { doSomething(); }",
            "for (let i = 0; i < 10; i++) { console.log(i); }",
            "while (running) { process(); }",
            "class Person { constructor(name) { this.name = name; } }",
            "import React from 'react';",
            "const express = require('express');",
            "def calculate_sum(a, b): return a + b",
            "public static void main(String[] args) {}",
            "SELECT * FROM users WHERE active = 1;",
            "CREATE TABLE products (id INT PRIMARY KEY);",
            "git commit -m 'Initial commit'",
            "npm install -save react",
            "docker build -t myapp .",
            "console.log('Debugging the code');",
            "throw new Error('Something went wrong');",
            "try { riskyOperation(); } catch (e) { handleError(e); }",
            "setTimeout(() => { callback(); }, 1000);",
            "Promise.resolve().then(result => { console.log(result); });",
            "async function fetchData() { const response = await fetch(url); }",
            "const [state, setState] = useState(initialValue);",
            "useEffect(() => { document.title = 'New Title'; }, []);",
            "export default function Component() { return <div>Hello</div>; }",
            "@app.route('/home') def home(): return 'Hello World'",
            "print('Hello, Python!')",
            "for item in iterable: process(item)",
            "if __name__ == '__main__': main()",
            "vector<int> numbers = {1, 2, 3, 4, 5};",
            "std::cout << 'Hello, C++!' << std::endl;",
            "template<typename T> void swap(T& a, T& b) { T temp = a; a = b; b = temp; }"
        ]
    },
    
    classic: {
        name: "经典文学",
        description: "中外经典文学作品选段",
        texts: [
            "滚滚长江东逝水浪花淘尽英雄",
            "是非成败转头空青山依旧在几度夕阳红",
            "白发渔樵江渚上惯看秋月春风",
            "一壶浊酒喜相逢古今多少事都付笑谈中",
            "满纸荒唐言一把辛酸泪",
            "都云作者痴谁解其中味",
            "开辟鸿蒙谁为情种",
            "都只为风月情浓",
            "一个是阆苑仙葩一个是美玉无瑕",
            "若说没奇缘今生偏又遇着他",
            "若说有奇缘如何心事终虚化",
            "枉自嗟呀空劳牵挂",
            "一个是水中月一个是镜中花",
            "想眼中能有多少泪珠儿",
            "怎经得秋流到冬尽春流到夏",
            "花谢花飞花满天红消香断有谁怜",
            "游丝软系飘春榭落絮轻沾扑绣帘",
            "闺中女儿惜春暮愁绪满怀无释处",
            "手把花锄出绣闺忍踏落花来复去",
            "质本洁来还洁去强于污淖陷渠沟",
            "未若锦囊收艳骨一抔净土掩风流",
            "天尽头何处有香丘",
            "侬今葬花人笑痴他年葬侬知是谁",
            "试看春残花渐落便是红颜老死时",
            "一朝春尽红颜老花落人亡两不知",
            "话说天下大势分久必合合久必分",
            "周末七国分争并入于秦",
            "及秦灭之后楚汉分争",
            "又并入于汉",
            "汉朝自高祖斩白蛇而起义",
            "一统天下后来光武中兴",
            "传至献帝遂分为三国",
            "话说东汉末年",
            "宦官专权朝政腐败",
            "黄巾起义天下大乱",
            "曹操刘备孙权各路英雄并起",
            "演绎了一场波澜壮阔的历史剧",
            "滚滚长江东逝水浪花淘尽英雄",
            "是非成败转头空青山依旧在几度夕阳红",
            "白发渔樵江渚上惯看秋月春风",
            "一壶浊酒喜相逢古今多少事都付笑谈中"
        ]
    }
};

// 获取所有词库信息
function getAllLibraries() {
    return Object.keys(TextLibraries).map(key => ({
        id: key,
        name: TextLibraries[key].name,
        description: TextLibraries[key].description,
        count: TextLibraries[key].texts.length
    }));
}

// 获取指定词库
function getLibrary(id) {
    return TextLibraries[id] || TextLibraries.chinese;
}

// 获取随机文本
function getRandomText(libraryId) {
    const library = getLibrary(libraryId);
    return library.texts[Math.floor(Math.random() * library.texts.length)];
}

// 根据难度筛选文本
function getTextsByDifficulty(libraryId, difficulty) {
    const library = getLibrary(libraryId);
    let texts = library.texts;
    
    if (difficulty === 'easy') {
        return texts.filter(text => text.length <= 15);
    } else if (difficulty === 'medium') {
        return texts.filter(text => text.length > 15 && text.length <= 30);
    } else if (difficulty === 'hard') {
        return texts.filter(text => text.length > 30);
    }
    
    return texts;
}

// 导出词库数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TextLibraries, getAllLibraries, getLibrary, getRandomText, getTextsByDifficulty };
} else if (typeof window !== 'undefined') {
    window.TextLibraries = TextLibraries;
    window.getAllLibraries = getAllLibraries;
    window.getLibrary = getLibrary;
    window.getRandomText = getRandomText;
    window.getTextsByDifficulty = getTextsByDifficulty;
}