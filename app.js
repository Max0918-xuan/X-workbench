/* ============================================================
   X 工作台 · app.js
   纯前端 + localStorage，无后端依赖
   ============================================================ */
'use strict';

/* ---------- 存储工具 ---------- */
const K = {
  words:'xwb_words', weight:'xwb_weight', workouts:'xwb_workouts',
  board:'xwb_board', books:'xwb_books', readLog:'xwb_readlog',
  notes:'xwb_notes', biliCustom:'xwb_bilicustom', biliWatched:'xwb_biliwatched',
  active:'xwb_active', tasks:'xwb_tasks', schedule:'xwb_schedule'
};
const load = (k,def)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):def; }catch(e){ return def; } };
const save = (k,v)=>localStorage.setItem(k, JSON.stringify(v));
const today = ()=> new Date().toISOString().slice(0,10);
const uid = ()=> Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const esc = s=> String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- B站精选数据 ---------- */
const BILI = [
  // 英语
  {title:'英语兔',channel:'英语兔',cat:'english',desc:'B站英语区顶流，零基础入门首选。《英语音标大全》《语法精讲》讲得通透，语速舒服，英音美音无缝切换。'},
  {title:'瑞秋英语 Rachel',channel:'瑞秋英语Rachel',cat:'english',desc:'地道美式发音教学，嘴型、舌位讲解超细致，专治中式发音，想改掉口音跟着她准没错。'},
  {title:'Coach-Shane 每日听写',channel:'Coach-Shane',cat:'english',desc:'每日听写 D.E.E.，每句10-20秒，通勤碎片时间练一句，坚持一个月听力显著提升。'},
  {title:'罗肖尼 Shawney',channel:'罗肖尼Shawney',cat:'english',desc:'从零基础带学新概念1-4册全免费，附可下载打印笔记，适合系统补基础。'},
  {title:'口语老炮儿马思瑞',channel:'口语老炮儿马思瑞',cat:'english',desc:'逐句点评明星英语口语，从发音错误与表达尴尬点里学会避坑，专业又毒舌。'},
  {title:'Real 麦克老师',channel:'Real麦克老师',cat:'english',desc:'纯正美音+中式英语误区揭秘，常用动词短语、地道寒暄与旅游英语，一看就懂。'},
  {title:'TED 精选演讲',channel:'TED精选演讲',cat:'english',desc:'中英字幕对照，通勤听一篇，练听力的同时拓宽知识面，碎片时间高效利用。'},
  // 健身
  {title:'帕梅拉 Pamela Reif',channel:'帕梅拉PamelaReif',cat:'fitness',desc:'现象级健身博主，金曲跟练系列，新手到进阶全覆盖，"帕门永存"，B站健身跟练天花板。'},
  {title:'eleni fit',channel:'elenifit',cat:'fitness',desc:'国际热门跟练UP主，无器械站立有氧，动作清晰好跟，适合居家减脂塑形。'},
  {title:'jo 姐',channel:'jo姐',cat:'fitness',desc:'暴汗快乐燃脂跟练，动作简单友好，大基数与新手友好，越跳越上头。'},
  {title:'mizi',channel:'mizi',cat:'fitness',desc:'温和低冲击训练，生理期/新手友好，注重体态改善，不伤膝盖。'},
  {title:'小九暴汗跟练',channel:'小九暴汗跟练',cat:'fitness',desc:'安娜力量+帕梅拉有氧组合合集，7天/生理期专题已规划好，直接照着跟。'},
  {title:'安娜力量训练',channel:'安娜Anna',cat:'fitness',desc:'力量训练跟练，塑形增肌线条感拉满，居家哑铃/水瓶即可开始。'},
  // 美学
  {title:'何大爷课堂',channel:'何大爷课堂',cat:'aesthetics',desc:'清华美院+哥大建筑背景，用"小剧场"故事演绎艺术史，唤醒对美的深层思考。'},
  {title:'oooooohmygosh',channel:'oooooohmygosh',cat:'aesthetics',desc:'讲设计规则与创新权，《把所有汉字叠在一起》等视频动画极其流畅，观念有理有据。'},
  {title:'设计师 IORI',channel:'设计师IORI',cat:'aesthetics',desc:'系统拆解中国红、莫兰迪、蒂芙尼蓝等经典配色，提供可复用的配色方案。'},
  {title:'雁鸿 Aimee',channel:'雁鸿Aimee',cat:'aesthetics',desc:'用易拉罐做苗族凤冠出圈，非遗花丝镶嵌传承人，展现中国传统技艺之美。'},
  {title:'吴晓隆',channel:'吴晓隆',cat:'aesthetics',desc:'华师大设计学院教师，带你看懂玛格南、布列松"决定性瞬间"与名家画册。'},
  {title:'影视飓风',channel:'影视飓风',cat:'aesthetics',desc:'顶流制作团队，色彩搭配与版式讲解堪称审美天花板，制作水准极高。'},
  // 阅读
  {title:'小隐 Soyyo',channel:'小隐Soyyo',cat:'reading',desc:'读书/手帐区大手子，覆盖面广且有深度，风格温柔，视频质量稳定有保障。'},
  {title:'小圆脸 Paprika',channel:'小圆脸Paprika',cat:'reading',desc:'偏文学类阅读，悬疑小说爱好者，书单进阶、阅读品质有保障。'},
  {title:'罗翔说刑法',channel:'罗翔说刑法',cat:'reading',desc:'不止讲刑法，年度书单与读书分享里满是哲学与人生思考，"承认有限，追求完美"。'},
  {title:'欧麗娟',channel:'歐麗娟',cat:'reading',desc:'台大中文系教授，讲《红楼梦》的爱情与婚姻思考打动无数人，推荐《活出生命的意义》。'},
  {title:'戴建业老师',channel:'戴建业老师',cat:'reading',desc:'教你读艰深书籍的方法：先看目录、序言、后记，别被书名吓倒，读《艺术哲学》。'},
  {title:'文曰小强',channel:'文曰小强',cat:'reading',desc:'开创影视速读名著，《84分钟速读三体》用500+电影片段无缝拼接，镇站之宝级别。'},
  {title:'李乌鸦爱学习',channel:'李乌鸦爱学习',cat:'reading',desc:'深耕文学，季度读书打卡+主题共读，把书籍与社会议题相连，"短视频是阅读的引路灯塔"。'}
];
const CAT_META = {
  english:{label:'英语学习',color:'#3b82f6',ic:'🔤'},
  fitness:{label:'健身减脂',color:'#ef4444',ic:'💪'},
  aesthetics:{label:'美学培养',color:'#a855f7',ic:'🎨'},
  reading:{label:'阅读',color:'#f59e0b',ic:'📚'},
  geography:{label:'地理学习',color:'#0ea5a9',ic:'🌍'},
  photography:{label:'摄影学习',color:'#d946ef',ic:'📷'},
  xhs:{label:'小红书',color:'#ef4444',ic:'📕'},
  meditation:{label:'冥想',color:'#06b6d4',ic:'🧘'},
  divination:{label:'玄学占卜',color:'#8b5cf6',ic:'🔮'},
  other:{label:'其他',color:'#64748b',ic:'🔖'}
};
const biliUrl = name=> `https://search.bilibili.com/all?keyword=${encodeURIComponent(name)}`;
const xhsUrl = name=> `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(name)}`;

/* ---------- 默认素材 ---------- */
const DEFAULT_WORDS = [
  {w:'serendipity',m:'n. 意外发现美好事物的能力；机缘巧合',phonetic:'/ˌserənˈdɪpəti/',phrases:['serendipitous discovery','happy serendipity','pure serendipity']},
  {w:'resilience',m:'n. 韧性；恢复力；抗挫折能力',phonetic:'/rɪˈzɪliəns/',phrases:['mental resilience','build resilience','show resilience','emotional resilience']},
  {w:'meticulous',m:'adj. 一丝不苟的；极度细心的',phonetic:'/məˈtɪkjʊləs/',phrases:['meticulous attention','meticulous planning','meticulous detail','meticulous care']},
  {w:'epiphany',m:'n. 顿悟；突然的领悟',phonetic:'/ɪˈpɪfəni/',phrases:['have an epiphany','moment of epiphany','sudden epiphany']},
  {w:'quintessential',m:'adj. 典型的；精髓的；最完美的',phonetic:'/ˌkwɪntɪˈsenʃl/',phrases:['quintessential example','quintessential English','quintessential style']},
  {w:'eloquent',m:'adj. 雄辩的；有说服力的；流利的',phonetic:'/ˈeləkwənt/',phrases:['eloquent speech','eloquent speaker','eloquent silence']},
  {w:'pragmatic',m:'adj. 务实的；实用主义的',phonetic:'/præɡˈmætɪk/',phrases:['pragmatic approach','pragmatic solution','pragmatic view']},
  {w:'nostalgia',m:'n. 怀旧；乡愁；对往事的眷恋',phonetic:'/nɒˈstældʒə/',phrases:['feel nostalgia','sense of nostalgia','nostalgia for the past']},
  {w:'perseverance',m:'n. 毅力；坚持不懈',phonetic:'/ˌpɜːsɪˈvɪərəns/',phrases:['sheer perseverance','perseverance pays off','with perseverance']},
  {w:'ubiquitous',m:'adj. 无处不在的；普遍存在的',phonetic:'/juːˈbɪkwɪtəs/',phrases:['ubiquitous presence','ubiquitous technology','become ubiquitous']},
  {w:'ambiguous',m:'adj. 模棱两可的；含糊不清的',phonetic:'/æmˈbɪɡjuəs/',phrases:['ambiguous statement','deliberately ambiguous','ambiguous meaning']},
  {w:'procrastinate',m:'v. 拖延；耽搁',phonetic:'/prəˈkræstɪneɪt/',phrases:['stop procrastinating','tend to procrastinate','procrastinate on tasks']},
  {w:'phenomenon',m:'n. 现象；非凡的人或事物',phonetic:'/fɪˈnɒmɪnən/',phrases:['natural phenomenon','cultural phenomenon','global phenomenon']},
  {w:'sophisticated',m:'adj. 复杂精密的；老练的；高雅的',phonetic:'/səˈfɪstɪkeɪtɪd/',phrases:['sophisticated technology','sophisticated taste','highly sophisticated']},
  {w:'empathy',m:'n. 同理心；共情能力',phonetic:'/ˈempəθi/',phrases:['feel empathy','show empathy','lack of empathy','deep empathy']},
  {w:'inevitable',m:'adj. 不可避免的；必然发生的',phonetic:'/ɪnˈevɪtəbl/',phrases:['inevitable outcome','inevitable change','seemingly inevitable']},
  {w:'intricate',m:'adj. 错综复杂的；精细的',phonetic:'/ˈɪntrɪkət/',phrases:['intricate design','intricate detail','intricate pattern']},
  {w:'meticulously',m:'adv. 一丝不苟地；细致地',phonetic:'/məˈtɪkjʊləsli/',phrases:['meticulously planned','meticulously crafted','meticulously organized']},
  {w:'versatile',m:'adj. 多才多艺的；多功能的',phonetic:'/ˈvɜːsətaɪl/',phrases:['versatile tool','versatile performer','highly versatile']},
  {w:'conspicuous',m:'adj. 显眼的；引人注目的',phonetic:'/kənˈspɪkjuəs/',phrases:['conspicuous absence','conspicuous consumption','conspicuously absent']}
];
const SENTENCES = [
  'The secret of getting ahead is getting started. — 行动的开始，就是领先的秘诀。',
  'You don\'t have to be great to start, but you have to start to be great. — 不必伟大才能开始，但必须开始才能伟大。',
  'Small daily improvements are the key to staggering long-term results. — 每日微小的进步，是惊人长期成果的钥匙。',
  'Discipline is choosing between what you want now and what you want most. — 自律，是在"当下想要的"与"最想要的"之间做选择。'
];
const QUOTES = [
  '种一棵树最好的时间是十年前，其次是现在。',
  '你现在的气质里，藏着你走过的路、读过的书和爱过的人。',
  '自律给我自由。坚持，是最朴素的捷径。',
  '美，是看不见的竞争力。培养审美，就是拓宽生命的维度。',
  '读书不是为了炫耀，而是在追求真理的过程中，对抗内心的虚无。',
  '身体是革命的本钱，运动是最低成本的投资。',
  '不要用战术上的勤奋，掩盖战略上的懒惰。',
  '日拱一卒无有尽，功不唐捐终入海。'
];
const FIT_TIPS = [
  ['热量缺口', '减脂核心是「消耗>摄入」，建议每日制造300-500千卡缺口，别节食过头。'],
  ['力量+有氧', '力量训练保肌肉、提代谢，有氧消耗热量，二者结合减脂效率最高。'],
  ['蛋白质要够', '减脂期每公斤体重摄入1.2-1.6g蛋白质，能保住肌肉、增强饱腹感。'],
  ['睡眠是隐形的减脂药', '睡眠不足会升高皮质醇、增加食欲，睡够7小时事半功倍。'],
  ['别只看体重', '肌肉比脂肪密度大，体重不变但腰围变小同样是进步，多量围度。'],
  ['多喝水', '每天1.5-2L水能提升代谢、减少假性饥饿，饭前一杯水有助控制食量。']
];
const AES_TIPS = [
  ['留白即美', '好的设计懂得"呼吸"，别把画面填满，留白让重点更突出。'],
  ['少即是多', '限制色彩与元素数量，3-5种主色足够，克制是一种高级感。'],
  ['观察日常', '美学在生活里：街角的招牌、餐桌的摆盘、窗外的光影，都是素材。'],
  ['多看好作品', '审美靠"喂"出来，常逛美术馆、设计网站，建立自己的视觉库。'],
  ['色彩有情绪', '暖色热情、冷色理性、低饱和度显高级，配色前先想表达什么情绪。'],
  ['对比产生张力', '大小、明暗、疏密、虚实的对比，让画面有节奏感与视觉冲击。']
];

/* ---------- 推荐书单 ---------- */
const BOOK_RECS = [
  {title:'思考，快与慢',author:'丹尼尔·卡尼曼',cat:'思维',cover:'🧠',color:'#6366f1',tags:['认知心理学','决策'],desc:'诺贝尔经济学奖得主力作，揭示大脑两套思维系统的运作方式，帮你做出更理性的判断。',douban:'https://book.douban.com/subject/10785583/',weread:'https://weread.qq.com/'},
  {title:'原子习惯',author:'James Clear',cat:'成长',cover:'⚛️',color:'#10b981',tags:['习惯养成','自我管理'],desc:'1%的微小改善，复利效应带来惊人改变。不讲大道理，只讲可执行的系统。',douban:'https://book.douban.com/subject/33441738/',weread:'https://weread.qq.com/'},
  {title:'活着',author:'余华',cat:'文学',cover:'🍂',color:'#f59e0b',tags:['当代文学','苦难'],desc:'一个人和他命运之间的友情。余华用最朴素的语言写尽了生的力量。',douban:'https://book.douban.com/subject/4913064/',weread:'https://weread.qq.com/'},
  {title:'人类简史',author:'尤瓦尔·赫拉利',cat:'历史',cover:'🗿',color:'#ef4444',tags:['大历史','文明'],desc:'从认知革命到科学革命，用宏大的视角重新讲述人类10万年的故事。',douban:'https://book.douban.com/subject/25985021/',weread:'https://weread.qq.com/'},
  {title:'非暴力沟通',author:'马歇尔·卢森堡',cat:'沟通',cover:'🕊️',color:'#8b5cf6',tags:['人际关系','沟通技巧'],desc:'用观察+感受+需要+请求的框架，化解冲突，让每一次对话都成为连接。',douban:'https://book.douban.com/subject/3533223/',weread:'https://weread.qq.com/'},
  {title:'刻意练习',author:'安德斯·艾利克森',cat:'成长',cover:'🎯',color:'#06b6d4',tags:['学习方法','刻意练习'],desc:'天才不是天生的，是"刻意练习"的结果。揭示从平凡到卓越的真正路径。',douban:'https://book.douban.com/subject/26895993/',weread:'https://weread.qq.com/'},
  {title:'小王子',author:'圣埃克苏佩里',cat:'文学',cover:'🌹',color:'#f97316',tags:['童话','哲学'],desc:'所有的大人都曾经是小孩。用童话的外壳包裹最深刻的人生哲理。',douban:'https://book.douban.com/subject/1084336/',weread:'https://weread.qq.com/'},
  {title:'原则',author:'瑞·达利欧',cat:'商业',cover:'📐',color:'#3b82f6',tags:['投资','人生哲学'],desc:'桥水基金创始人毕生经验总结，500多条生活与工作的原则，极度坦诚。',douban:'https://book.douban.com/subject/27608239/',weread:'https://weread.qq.com/'},
  {title:'被讨厌的勇气',author:'岸见一郎',cat:'心理',cover:'🦁',color:'#eab308',tags:['阿德勒心理学','自我接纳'],desc:'用对话体阐释阿德勒心理学，"课题分离"的概念将改变你看待人际关系的方式。',douban:'https://book.douban.com/subject/26334599/',weread:'https://weread.qq.com/'},
  {title:'枪炮、病菌与钢铁',author:'贾雷德·戴蒙德',cat:'历史',cover:'🔫',color:'#64748b',tags:['人类学','文明史'],desc:'不同大陆的发展差异到底由什么决定？地理环境比人种差异重要得多。',douban:'https://book.douban.com/subject/26743265/',weread:'https://weread.qq.com/'},
  {title:'三体',author:'刘慈欣',cat:'科幻',cover:'🪐',color:'#1e40af',tags:['硬科幻','宇宙社会学'],desc:'中国科幻巅峰之作，黑暗森林法则颠覆宇宙观，改编影视全球现象级。',douban:'https://book.douban.com/subject/2567698/',weread:'https://weread.qq.com/'},
  {title:'影响力',author:'罗伯特·西奥迪尼',cat:'心理',cover:'🎭',color:'#ec4899',tags:['社会心理学','说服'],desc:'互惠、承诺一致、社会认同…六大原则解释为什么你会说"是"，以及如何不被操纵。',douban:'https://book.douban.com/subject/1005576/',weread:'https://weread.qq.com/'}
];
const BOOK_CATS = ['全部','思维','成长','文学','历史','沟通','商业','心理','科幻'];

/* ---------- 服装搭配 ---------- */
const FASHIONS = [
  {title:'基础色穿搭',icon:'👔',color:'#3b82f6',desc:'黑、白、灰、藏蓝、卡其——衣橱里的五大基础色，任意两两搭配都不出错。核心原则：上浅下深显高，上深下浅显瘦。',palette:['#1a1a2e','#e8e8e8','#6b7280','#1e3a5f','#c4a97d'],tip:'80%基础色 + 20%亮色点缀 = 永不出错的公式'},
  {title:'三色原则',icon:'🎨',color:'#8b5cf6',desc:'全身不超过三个主色（印花算一色），超过三个颜色容易显得杂乱。鞋子、包包与腰带同色系可以创造视觉统一感。',palette:['#2d3436','#dfe6e9','#0984e3'],tip:'主色60% + 辅色30% + 点缀色10% 是黄金比例'},
  {title:'身材穿搭法则',icon:'📏',color:'#f59e0b',desc:'梨形身材（上窄下宽）：上浅下深，A字裙/阔腿裤遮胯。苹果形身材（腹部丰满）：V领延伸颈线，高腰线下装拉长比例。H形身材（直线型）：用腰带打造腰线。',palette:[],tip:'了解自己的体型是穿对衣服的第一步，扬长避短而非遮掩'},
  {title:'场合穿搭指南',icon:'🎪',color:'#10b981',desc:'职场：西装外套+简约内搭+直筒裤，干净利落。约会：柔和色调+女性化细节（蕾丝/飘带/裙装）。休闲：牛仔+纯色T恤+运动鞋，永不过时。运动：速干面料+亮色点缀增加活力。',palette:[],tip:'先判断场合 dress code，再考虑搭配——得体比出彩更重要'},
  {title:'色彩搭配进阶',icon:'🌈',color:'#ef4444',desc:'邻近色搭配（蓝+绿）：和谐温柔。互补色搭配（蓝+橙）：活力撞色。同色系深浅搭配（深蓝+浅蓝+白）：高级感满满。莫兰迪色系：低饱和度更显温柔高级。',palette:['#6c5ce7','#fab1a0','#81ecec','#ffeaa7','#dfe6e9'],tip:'拿不准时，选中性色做底色，用一个亮色单品提亮'},
  {title:'配饰点睛法',icon:'💍',color:'#ec4899',desc:'一条围巾、一块手表、一条项链就能让普通穿搭瞬间升级。配饰要少而精：手表+戒指，或项链+耳环二选一，避免挂满全身像圣诞树。',palette:[],tip:'亮色包包/围巾是最安全又出彩的点缀方式'}
];

/* ---------- 生活美学 ---------- */
const LIFE_AES = [
  {icon:'🛋️',title:'家居布置',desc:'遵循「少即是多」。物件不超过三种材质（木+布+金属），留出呼吸空间。暖光台灯比顶灯更有氛围。绿植是最好的软装。'},
  {icon:'🍽️',title:'美食摆盘',desc:'白盘是万能画布。主菜放中间偏左，酱汁用勺背画弧度。撒少许芝麻/香草提色。记住：负空间比堆满更显高级。'},
  {icon:'☕',title:'咖啡/茶道',desc:'手冲咖啡的水流速度决定风味层次。茶道的"和敬清寂"是精神内核——仪式感本身即是美。'},
  {icon:'💐',title:'花艺入门',desc:'三枝花比一大束更有禅意。同色系渐变（白→粉→红）最安全。花器高度=花茎长度×0.6，黄金比例最佳。'},
  {icon:'📝',title:'手帐美学',desc:'字写整齐就赢了一半。留白比填满更美。用3个颜色以内做装饰。剪贴票据、票根让手帐有温度。'},
  {icon:'🎵',title:'音乐品味',desc:'不必懂乐理。从爵士（Miles Davis）入门氛围感，古典（德彪西）感受色彩，Lo-fi做背景音。音乐是最低成本的美学输入。'}
];

/* ---------- 摄影基础知识 ---------- */
const PHOTO_KNOWLEDGE = [
  {icon:'🔺',title:'曝光三角',color:'#ef4444',content:[
    '<b>光圈 (Aperture)</b>：f值越小光圈越大→进光越多+背景越虚化。大光圈(f/1.4-2.8)适合人像，小光圈(f/8-16)适合风景。',
    '<b>快门 (Shutter)</b>：分母越大越快→定格运动。1/125s手持安全线，1/500s+冻结运动，1/30s-制造动感模糊。',
    '<b>ISO (感光度)</b>：数值越高画面越亮但噪点越多。晴天100-400，室内800-1600，暗光3200+但要后期降噪。',
    '<b>互易律</b>：光圈大一档=快门快一档=ISO低一档，三者联动。先确定创作意图→再调参数。'
  ]},
  {icon:'📐',title:'构图法则',color:'#3b82f6',content:[
    '<b>三分法</b>：把画面横竖各分三等份，将主体放在交叉点上。手机相机设置中打开网格线即可。',
    '<b>引导线</b>：道路、栏杆、河流把视线引向主体。S形曲线比直线更有韵律感。',
    '<b>框架构图</b>：用窗户、拱门、树叶做天然"画框"，增加层次和窥视感。',
    '<b>留白/负空间</b>：大面积空白区域让主体更突出。极简风必备，主体的朝向留更多空间。',
    '<b>对称构图</b>：建筑摄影常用，水面倒影加倍对称。绝对对称+微小破绽=最有张力。'
  ]},
  {icon:'💡',title:'光线运用',color:'#f59e0b',content:[
    '<b>黄金时刻</b>：日出后和日落前1小时，光线柔和金黄，阴影长而有层次。这是人像和风景的最佳拍摄时间。',
    '<b>顺光</b>：太阳在你背后→色彩鲜艳但画面扁平。适合记录色彩丰富的场景。',
    '<b>侧光(45°）</b>：最能塑造立体感。人脸一侧亮一侧暗，五官最有层次。',
    '<b>逆光</b>：太阳在主体背后→拍摄剪影或发光轮廓。人脸需补光(反光板/闪光灯)。',
    '<b>阴天=天然柔光箱</b>：云层把阳光均匀散射，没有硬阴影，拍人像皮肤最柔美。'
  ]},
  {icon:'🎨',title:'色彩与后期',color:'#8b5cf6',content:[
    '<b>色温/白平衡</b>：低K值(3000-4000)偏蓝→清冷感。高K值(6000-8000)偏黄→温暖感。自动白平衡多数时候靠谱。',
    '<b>对比度与饱和度</b>：适当提高对比度让画面"通透"。饱和度别拉太高，+10~15%最自然。过饱和=廉价感。',
    '<b>裁剪二次构图</b>：拍的时候可以"松"一点，后期裁剪实现完美三分法。横平竖直最优先修正。',
    '<b>滤镜</b>：新手最容易过度依赖。选一个喜欢的风格后把强度降到50%以下，保留原片质感。'
  ]},
  {icon:'📱',title:'手机摄影技巧',color:'#10b981',content:[
    '<b>擦镜头</b>：90%的手机"画质差"是因为镜头有指纹油污。拍摄前用衣服擦一下，效果立竿见影。',
    '<b>用2x/3x焦段</b>：比主摄广角更接近人眼视角，拍人像和日常最自然。尽量不要用数码变焦。',
    '<b>点击屏幕对焦</b>→按住不放锁定AE/AF→滑动小太阳调整曝光。这个操作让你的照片质感提升一个档次。',
    '<b>拍RAW格式</b>：如果手机支持，拍RAW后期调整空间大很多，尤其是过曝/欠曝的拯救。',
    '<b>开启网格线</b>：路径：设置→相机→网格。这是能立刻用上的最实用拍摄技巧。'
  ]}
];

/* ---------- 口语实战场景 ---------- */
const ORAL_SCENES = [
  {id:'dining',label:'🍽️ 餐厅点餐',lines:[
    {role:'Waiter',en:'Good evening! Table for how many?',cn:'晚上好！几位用餐？'},
    {role:'You',en:'A table for two, please.',cn:'两位，谢谢。'},
    {role:'Waiter',en:'Right this way. Here is the menu.',cn:'这边请，这是菜单。'},
    {role:'You',en:'I\'d like to order the grilled salmon.',cn:'我想点一份烤三文鱼。'},
    {role:'Waiter',en:'Would you like anything to drink?',cn:'需要喝点什么吗？'},
    {role:'You',en:'Just water, please.',cn:'水就好，谢谢。'},
    {role:'Waiter',en:'Enjoy your meal!',cn:'祝您用餐愉快！'}
  ],tip:'用 "I\'d like to..." 比 "I want..." 更礼貌；"Just water, please" 是简洁又得体的表达。'},
  {id:'directions',label:'🗺️ 问路指路',lines:[
    {role:'You',en:'Excuse me, could you tell me how to get to the museum?',cn:'打扰一下，去博物馆怎么走？'},
    {role:'Passerby',en:'Sure! Go straight for two blocks, then turn left at the traffic light.',cn:'当然！直走两个街区，在红绿灯左转。'},
    {role:'You',en:'Is it within walking distance?',cn:'走路能到吗？'},
    {role:'Passerby',en:'Yes, about 10 minutes on foot.',cn:'可以，步行大概10分钟。'},
    {role:'You',en:'Great, thank you so much!',cn:'太好了，非常感谢！'},
    {role:'Passerby',en:'No problem. You can\'t miss it — it\'s a big white building.',cn:'不客气。很好找的，一栋白色大楼。'}
  ],tip:'问路用 "Could you tell me how to get to..." 比 "Where is..." 更礼貌自然。'},
  {id:'shopping',label:'🛍️ 商场购物',lines:[
    {role:'You',en:'Excuse me, I\'m looking for a pair of running shoes.',cn:'你好，我想找一双跑步鞋。'},
    {role:'Clerk',en:'What size do you wear?',cn:'您穿多大码？'},
    {role:'You',en:'Size 42, I think.',cn:'42码吧。'},
    {role:'Clerk',en:'Here you go. Would you like to try them on?',cn:'给您。要试穿一下吗？'},
    {role:'You',en:'Yes, please. They feel a bit tight. Do you have a half size larger?',cn:'好的。有点紧，有大半码的吗？'},
    {role:'Clerk',en:'Let me check... Here\'s the 42.5.',cn:'我看一下…这是42.5。'},
    {role:'You',en:'Perfect! I\'ll take them.',cn:'完美！我买了。'}
  ],tip:'购物时 "I\'m looking for..." 比直接问更自然；"try them on" 是试穿的常用表达。'},
  {id:'office',label:'💼 职场沟通',lines:[
    {role:'You',en:'Hi, do you have a minute? I\'d like to discuss the project timeline.',cn:'嗨，有空吗？我想讨论一下项目时间表。'},
    {role:'Colleague',en:'Of course. What\'s on your mind?',cn:'当然，怎么了？'},
    {role:'You',en:'I think we might need an extra week for the testing phase.',cn:'我觉得测试阶段可能需要多一周。'},
    {role:'Colleague',en:'I agree. The current deadline is a bit tight. Let\'s bring this up at the next meeting.',cn:'同意。目前的截止日期确实有点紧。下次会议提一下吧。'},
    {role:'You',en:'Good idea. I\'ll prepare some data to support the extension request.',cn:'好主意。我准备一些数据来支持延期申请。'},
    {role:'Colleague',en:'Sounds like a plan. Thanks for flagging this early.',cn:'就这么办。谢谢你提前提出来。'}
  ],tip:'职场中 "I think we might..." 比 "We have to..." 更委婉；"Do you have a minute?" 是常见的开场白。'},
  {id:'casual',label:'☕ 闲聊交友',lines:[
    {role:'You',en:'Hey! Long time no see. How have you been?',cn:'嘿！好久不见。最近怎么样？'},
    {role:'Friend',en:'Pretty good! I just got back from a trip to Yunnan.',cn:'挺好的！我刚从云南旅行回来。'},
    {role:'You',en:'No way! I\'ve always wanted to go there. How was it?',cn:'不是吧！我一直想去那。怎么样？'},
    {role:'Friend',en:'Amazing. The scenery was breathtaking. You should definitely go.',cn:'太棒了。风景美得令人窒息。你一定要去。'},
    {role:'You',en:'I\'d love to! We should grab coffee sometime and you can tell me all about it.',cn:'我很想去！改天一起喝咖啡，你给我好好讲讲。'},
    {role:'Friend',en:'Deal! I\'ll text you.',cn:'一言为定！我发消息给你。'}
  ],tip:'"Long time no see" 是跟熟人打招呼的经典开场；"How have you been?" 比 "How are you?" 更适合久别重逢。'},
  {id:'apology',label:'🙏 道歉表达',lines:[
    {role:'You',en:'I\'m really sorry for being late. The traffic was terrible.',cn:'真的很抱歉迟到了。交通太堵了。'},
    {role:'Friend',en:'No worries. I just got here myself.',cn:'没事，我也刚到。'},
    {role:'You',en:'Still, I should have left earlier. Let me buy you a coffee to make up for it.',cn:'还是应该早点出门的。我请你喝咖啡补偿一下吧。'},
    {role:'Friend',en:'You don\'t have to, but I won\'t say no to free coffee!',cn:'不用啦，不过免费咖啡我是不会拒绝的！'},
    {role:'You',en:'It\'s the least I can do. Thanks for being so understanding.',cn:'这是我应该做的。谢谢你这么理解。'}
  ],tip:'道歉时 "I\'m really sorry for..." 比简单的 "Sorry" 更真诚；给补偿方案能让对方感受到你的诚意。'}
];

/* ---------- 看剧学英语推荐 ---------- */
const SHOWS = [
  {title:'小猪佩奇',en:'Peppa Pig',level:'入门',seasons:'9季',why:'语速极慢，词汇简单重复，零基础友好，每集5分钟，碎片时间轻松看',cat:'animation',color:'#f472b6',eps:'5min×390+'},
  {title:'咱们裸熊',en:'We Bare Bears',level:'入门',seasons:'4季',why:'三只熊的日常冒险，对话简单幽默，发音清晰，适合初学者磨耳朵',cat:'animation',color:'#e879f9',eps:'11min×140+'},
  {title:'布鲁伊',en:'Bluey',level:'入门',seasons:'3季',why:'家庭日常英语，句子短小精悍，每集7分钟，大人小孩都爱看',cat:'animation',color:'#60a5fa',eps:'7min×150+'},
  {title:'怪诞小镇',en:'Gravity Falls',level:'入门',seasons:'2季',why:'美式青少年口语，语速友好，奇幻冒险剧情吸引人，不知不觉练听力',cat:'animation',color:'#34d399',eps:'22min×40'},
  {title:'老友记',en:'Friends',level:'中级',seasons:'10季',why:'日常对话丰富真实，是口语学习圣经，涵盖了工作/恋爱/租房等所有生活场景',cat:'sitcom',color:'#eab308',eps:'22min×236'},
  {title:'摩登家庭',en:'Modern Family',level:'中级',seasons:'11季',why:'伪纪录片风格，角色年龄跨越三代，语速中等偏慢，家庭场景词汇非常实用',cat:'sitcom',color:'#f97316',eps:'22min×250'},
  {title:'老爸老妈浪漫史',en:'How I Met Your Mother',level:'中级',seasons:'9季',why:'纽约年轻人日常，俚语和流行文化梗丰富，语感培养利器',cat:'sitcom',color:'#a3e635',eps:'22min×208'},
  {title:'生活大爆炸',en:'The Big Bang Theory',level:'进阶',seasons:'12季',why:'学术词汇+生活俚语双重训练，语速快，考验真实听力水平',cat:'sitcom',color:'#ef4444',eps:'22min×279'},
  {title:'神探夏洛克',en:'Sherlock',level:'进阶',seasons:'4季',why:'英音爱好者必看，语速极快但吐字清晰，逻辑推演的同时训练英式表达',cat:'drama',color:'#8b5cf6',eps:'90min×13'},
  {title:'黑镜',en:'Black Mirror',level:'进阶',seasons:'6季',why:'科技伦理主题，英音美音兼有，话题深刻，适合高阶练习深度讨论',cat:'drama',color:'#06b6d4',eps:'60min×27'}
];

/* ---------- 地理纪录片 ---------- */
const GEO_DOCS = [
  {title:'航拍中国',score:'9.2',desc:'空中视角俯瞰中国34个省级行政区，每一帧都是壁纸',cat:'中国地理',color:'#e74c3c',eps:'4季',dur:'50min×34+'},
  {title:'地球脉动',en:'Planet Earth',score:'9.9',desc:'BBC封神之作，从极地到雨林的壮丽生命故事',cat:'自然地理',color:'#27ae60',eps:'2季',dur:'60min×11+6'},
  {title:'蓝色星球',en:'Blue Planet',score:'9.8',desc:'深入海洋最深处，揭示不为人知的水下奇观',cat:'海洋地理',color:'#2980b9',eps:'2季',dur:'60min×8+7'},
  {title:'河西走廊',score:'9.7',desc:'以时间为轴梳理两千年丝路风云，拍出了电影级的史诗感',cat:'中国地理',color:'#e67e22',eps:'10集',dur:'50min×10'},
  {title:'第三极',score:'9.4',desc:'首部全面反映青藏高原人与自然相处的纪录片',cat:'中国地理',color:'#1abc9c',eps:'6集',dur:'45min×6'},
  {title:'极地',score:'9.4',desc:'西藏普通人的日常故事，信仰与自然的诗意共生',cat:'中国地理',color:'#9b59b6',eps:'7集',dur:'36min×7'},
  {title:'美丽中国',en:'Wild China',score:'9.3',desc:'BBC与CCTV合拍，第一次用国际视角呈现中国野性之美',cat:'中国地理',color:'#2ecc71',eps:'6集',dur:'60min×6'},
  {title:'我们的星球',en:'Our Planet',score:'9.8',desc:'Netflix倾力打造，4K画质极致震撼，气候变化视角',cat:'自然地理',color:'#3498db',eps:'8集',dur:'50min×8'},
  {title:'绿色星球',en:'The Green Planet',score:'9.7',desc:'以植物的视角看待世界，延时摄影震撼人心',cat:'自然地理',color:'#16a085',eps:'5集',dur:'60min×5'},
  {title:'七个世界一个星球',en:'Seven Worlds One Planet',score:'9.7',desc:'七大洲各自独特的地质与生态奇观',cat:'自然地理',color:'#f39c12',eps:'7集',dur:'60min×7'},
  {title:'冰冻星球',en:'Frozen Planet',score:'9.7',desc:'展现南北极的极致严寒与生命奇迹',cat:'自然地理',color:'#00bcd4',eps:'2季',dur:'60min×7+6'},
  {title:'鸟瞰中国',en:'China from Above',score:'8.8',desc:'国家地理出品，航拍视角看中国城市与自然的交融',cat:'中国地理',color:'#e91e63',eps:'2季',dur:'45min×4'}
];

/* ---------- 大洲探索 ---------- */
const CONTINENTS = [
  {name:'亚洲',en:'Asia',area:'4458万km²',pop:'47亿',highest:'珠穆朗玛峰 8848m',fact:'世界面积最大、人口最多的大洲，48个国家，孕育了四大文明古国中的三个。',color:'#f39c12'},
  {name:'非洲',en:'Africa',area:'3022万km²',pop:'14亿',highest:'乞力马扎罗山 5895m',fact:'人类起源地，54个国家，拥有世界上最长的河流——尼罗河（6650km）。',color:'#e67e22'},
  {name:'北美洲',en:'North America',area:'2471万km²',pop:'6亿',highest:'迪纳利山 6190m',fact:'23个国家，五大湖区是世界上最大的淡水湖群，占全球地表淡水21%。',color:'#2ecc71'},
  {name:'南美洲',en:'South America',area:'1784万km²',pop:'4.4亿',highest:'阿空加瓜山 6961m',fact:'拥有世界流量最大的河——亚马逊河，以及世界最长的山脉——安第斯。',color:'#27ae60'},
  {name:'南极洲',en:'Antarctica',area:'1400万km²',pop:'约4000(科考人员)',highest:'文森山 4892m',fact:'世界上最冷的大陆，最低气温-89.2°C，储存了地球70%的淡水。',color:'#3498db'},
  {name:'欧洲',en:'Europe',area:'1016万km²',pop:'7.5亿',highest:'厄尔布鲁士山 5642m',fact:'44个国家，文艺复兴发源地，拥有世界最丰富的文化遗产密度。',color:'#9b59b6'},
  {name:'大洋洲',en:'Oceania',area:'897万km²',pop:'4500万',highest:'查亚峰 4884m',fact:'14个国家，澳大利亚独占86%面积，大堡礁是地球上最大的生物结构。',color:'#1abc9c'}
];

/* ---------- 每日地理知识 ---------- */
const GEO_TIPS = [
  ['地球第三极','青藏高原被称为地球"第三极"，平均海拔4000米以上，是除南北极外冰川最集中的区域。'],
  ['最深的海沟','马里亚纳海沟最深处达11034米（挑战者深渊），把珠穆朗玛峰放进去还有2000多米才能露出水面。'],
  ['最大的沙漠','撒哈拉沙漠面积约932万km²，几乎等于中国国土面积，但它曾经是一片绿洲。'],
  ['最长的河流之争','尼罗河（6650km）与亚马逊河（6575km）谁才是最长的河流？取决于测量方式，尚存争议。'],
  ['世界最高建筑','迪拜哈利法塔高828米，共163层，相当于把3座埃菲尔铁塔叠起来。'],
  ['板块运动','地球表面由7大板块和若干小板块组成，板块每年移动1-10厘米，这正是地震和火山的主因。'],
  ['淡水之最','贝加尔湖储存了全球约20%的液态淡水，最深处1637米，是世界最深的湖泊。'],
  ['赤道不是最热','地球最热的地方在伊朗卢特荒漠，记录到的地表温度达70.7°C，而赤道因云层和湿度反而不是最热。'],
  ['时区趣事','中国横跨约5个时区（东五区到东九区），但全国统一使用北京时间（东八区）。俄罗斯有11个时区。']
];

/* ---------- 小红书资源 ---------- */
const XHS_CATEGORIES = ['全部','英语','健身','美学','阅读','摄影','地理','冥想','玄学'];
const XHS_BLOGGERS = [
  {name:'英语雪梨老师',cat:'英语',desc:'零基础英语教学，发音口型超清晰，每天一个实用短句',link:'https://www.xiaohongshu.com/search_result?keyword=英语雪梨老师'},
  {name:'帕梅拉Pamela',cat:'健身',desc:'全球现象级健身博主，无器械跟练、饮食搭配全攻略',link:'https://www.xiaohongshu.com/search_result?keyword=帕梅拉跟练'},
  {name:'设计师亚亚',cat:'美学',desc:'色彩搭配/家装改造/穿搭灵感，用设计思维提升生活品质',link:'https://www.xiaohongshu.com/search_result?keyword=服装搭配师'},
  {name:'樊登读书',cat:'阅读',desc:'深度拆解好书，5分钟了解一本书的精华',link:'https://www.xiaohongshu.com/search_result?keyword=读书推荐书单'},
  {name:'摄影笔记',cat:'摄影',desc:'手机摄影构图教程，零基础也能拍出氛围感',link:'https://www.xiaohongshu.com/search_result?keyword=手机摄影教程'},
  {name:'星球研究所',cat:'地理',desc:'中国地理科普第一号，地理冷知识可视化',link:'https://www.xiaohongshu.com/search_result?keyword=地理科普'},
  {name:'冥想星球',cat:'冥想',desc:'每日冥想打卡引导，正念生活分享',link:'https://www.xiaohongshu.com/search_result?keyword=冥想正念'},
  {name:'塔罗研习社',cat:'玄学',desc:'塔罗牌新手入门，每周运势解读',link:'https://www.xiaohongshu.com/search_result?keyword=塔罗教学'}
];
const XHS_TRENDING = [
  '每天一个英语口语技巧','零基础健身跟练','配色灵感博主推荐',
  '2025书单推荐','手机修图教程','每日冥想打卡',
  '塔罗入门教学','小六壬速查表','学习方法分享',
  '早起打卡自律','极简穿搭法则','摄影构图技巧'
];
/* ---------- 冥想练习 ---------- */
const MEDITATIONS = [
  {icon:'🧘',title:'正念呼吸',dur:'5-15分钟',desc:'将注意力完全集中在呼吸上。当思绪飘走时，不评判、不抗拒，温和地把注意力带回到呼吸。这是冥想最基础的练习，也是所有冥想方法的基石。',level:'入门',color:'#06b6d4'},
  {icon:'🌊',title:'身体扫描',dur:'10-20分钟',desc:'从脚趾开始，逐步将注意力移动到身体各个部位。感受每个部位的冷热、压力、振动。这能帮你觉察平时忽略的身体信号，释放深层紧张。',level:'入门',color:'#3b82f6'},
  {icon:'💝',title:'慈心冥想',dur:'10-15分钟',desc:'依次对自己、挚爱之人、普通熟人、难相处的人、以及一切众生发送善意的祝福："愿你快乐，愿你平安，愿你自在"。研究表明能显著提升幸福感。',level:'进阶',color:'#ec4899'},
  {icon:'🌳',title:'行走冥想',dur:'15-30分钟',desc:'不戴耳机，专注走路本身。感受脚掌接触地面的每一个细节——抬起、移动、落下。将日常行走变成一种修行，最适合坐不住的人。',level:'入门',color:'#10b981'},
  {icon:'💤',title:'睡眠冥想',dur:'10-20分钟',desc:'躺在床上，从100开始倒数，每数一个数字默念一句"放松"。想象一道温暖的光从头顶慢慢扫过全身，所到之处肌肉融化、沉入床垫。适合失眠人群。',level:'入门',color:'#8b5cf6'},
  {icon:'⛰️',title:'观想冥想',dur:'10-15分钟',desc:'闭上眼睛，想象一个宁静的场景——可以是海边、森林或山顶。用五感去填充这个场景：声音、气味、温度、质感。大脑分不清真实与想象，身体会随之放松。',level:'进阶',color:'#f59e0b'},
  {icon:'⚡',title:'动态冥想',dur:'5-10分钟',desc:'在刷牙、洗碗、洗澡等日常动作中保持完全觉知。感受水流的温度、泡沫的触感、牙刷的震动。把每个日常动作变成冥想练习。',level:'入门',color:'#ef4444'},
  {icon:'🫁',title:'盒式呼吸',dur:'4-5分钟',desc:'吸气4秒 → 屏息4秒 → 呼气4秒 → 屏息4秒。循环进行。海军陆战队使用的压力管理方法，快速稳定心率和神经系统。',level:'入门',color:'#6366f1'}
];
const MEDITATION_TIPS = [
  {title:'固定时间地点',desc:'每天同一时间、同一地点冥想，大脑会形成条件反射，更容易进入状态。'},
  {title:'不必追求"空"',desc:'冥想的重点不是清空思绪，而是觉察思绪而不被带走。走神是正常的，发现走神的那一刻就是练习。'},
  {title:'从3分钟开始',desc:'每天3分钟比每周一次30分钟有效得多。关键是建立习惯，而不是追求时长。'},
  {title:'舒适的坐姿',desc:'不需要莲花坐！椅子上、沙发上、甚至躺着都可以。保持脊柱挺直但放松，下巴微收。'},
  {title:'善用引导音频',desc:'初期跟着引导冥想APP/视频练习，熟悉后再独立冥想。耳机里一个平静的声音是最佳入门方式。'},
  {title:'呼吸是锚点',desc:'任何时候感到焦虑或思绪纷乱，回到呼吸上。三下深呼吸就足以让你重新聚焦。'}
];
/* ---------- 塔罗牌 · 大阿尔卡纳 ---------- */
const TAROT_CARDS = [
  {num:0,name:'愚者',en:'The Fool',element:'风',keyword:'开始·冒险·天真',upright:'新的开始、勇敢迈出第一步、保持好奇心、相信直觉',reversed:'鲁莽冲动、缺乏计划、过于天真、犹豫不决',color:'#f59e0b',icon:'🤹'},
  {num:1,name:'魔术师',en:'The Magician',element:'风',keyword:'创造·技能·意志',upright:'能力充分发挥、资源整合、信心满满、梦想成真',reversed:'才能被压抑、欺诈骗局、有心无力、错失良机',color:'#ef4444',icon:'🎩'},
  {num:2,name:'女祭司',en:'The High Priestess',element:'水',keyword:'直觉·智慧·潜意识',upright:'相信直觉、内在智慧觉醒、耐心等待、学习深造',reversed:'忽视直觉、秘密被揭开、情绪波动、知识匮乏',color:'#3b82f6',icon:'🌙'},
  {num:3,name:'皇后',en:'The Empress',element:'土',keyword:'丰饶·滋养·创造力',upright:'丰收繁荣、创造力旺盛、母性关怀、享受生活',reversed:'缺乏活力、奢侈浪费、情感空虚、过度依赖',color:'#10b981',icon:'👑'},
  {num:4,name:'皇帝',en:'The Emperor',element:'火',keyword:'权威·秩序·稳定',upright:'领导力、纪律严明、规则建立、稳固的基础',reversed:'独裁专制、缺乏纪律、滥用权力、不稳定',color:'#ef4444',icon:'🏰'},
  {num:5,name:'教皇',en:'The Hierophant',element:'土',keyword:'传统·信仰·教育',upright:'遵循传统、寻求导师、精神成长、正规学习',reversed:'打破常规、质疑权威、不适合的教育方式',color:'#6366f1',icon:'📿'},
  {num:6,name:'恋人',en:'The Lovers',element:'风',keyword:'选择·爱情·合一',upright:'真爱降临、重要的抉择、价值观一致、合作共赢',reversed:'错误的选择、分离、价值观冲突、犹豫不决',color:'#ec4899',icon:'💕'},
  {num:7,name:'战车',en:'The Chariot',element:'水',keyword:'意志·胜利·行动',upright:'克服困难、决心坚定、突破瓶颈、势如破竹',reversed:'失控、方向迷失、内部冲突、急于求成',color:'#f97316',icon:'⚔️'},
  {num:8,name:'力量',en:'Strength',element:'火',keyword:'勇气·耐心·内柔',upright:'以柔克刚、内心强大、耐心驯服、自信而不炫耀',reversed:'软弱无力、情绪失控、缺乏自信、被本能支配',color:'#eab308',icon:'🦁'},
  {num:9,name:'隐士',en:'The Hermit',element:'土',keyword:'内省·智慧·孤独',upright:'深度思考、寻求内在指引、独处的力量、沉淀积累',reversed:'孤僻自闭、逃避现实、过度孤立、拒绝帮助',color:'#64748b',icon:'🏔️'},
  {num:10,name:'命运之轮',en:'Wheel of Fortune',element:'火',keyword:'命运·转变·循环',upright:'好运来临、转折点、顺应变化、时来运转',reversed:'厄运连连、停滞不前、抗拒改变、恶性循环',color:'#06b6d4',icon:'🎡'},
  {num:11,name:'正义',en:'Justice',element:'风',keyword:'公平·真相·平衡',upright:'公正裁决、因果报应、做正确的事、真相大白',reversed:'不公平、逃避责任、法律纠纷、自欺欺人',color:'#334155',icon:'⚖️'},
  {num:12,name:'倒吊人',en:'The Hanged Man',element:'水',keyword:'牺牲·换位·等待',upright:'换一个角度看问题、以退为进、静待时机、自我牺牲',reversed:'固执己见、无谓的牺牲、停滞不前、不愿改变',color:'#0ea5a9',icon:'🙃'},
  {num:13,name:'死神',en:'Death',element:'水',keyword:'结束·重生·蜕变',upright:'旧阶段完结、新的开始、脱胎换骨、放手过去',reversed:'抗拒改变、停滞不前、恐惧结束、活在痛苦中',color:'#1a1a2e',icon:'💀'},
  {num:14,name:'节制',en:'Temperance',element:'火',keyword:'调和·中庸·平衡',upright:'自我调节、和谐共处、中庸之道、化繁为简',reversed:'极端失衡、放纵无度、节奏混乱、缺乏中庸',color:'#a855f7',icon:'🏺'},
  {num:15,name:'恶魔',en:'The Devil',element:'土',keyword:'欲望·束缚·物质',upright:'面对欲望、觉察沉迷、打破束缚、坦诚面对阴暗面',reversed:'挣脱束缚、看穿幻象、重获自由、戒掉上瘾',color:'#dc2626',icon:'😈'},
  {num:16,name:'高塔',en:'The Tower',element:'火',keyword:'崩塌·觉醒·真相',upright:'突然的变故、旧结构崩塌、真相揭露、置之死地而后生',reversed:'逃避改变、推迟危机、侥幸心理、不敢面对',color:'#7c2d12',icon:'🗼'},
  {num:17,name:'星星',en:'The Star',element:'风',keyword:'希望·信念·治愈',upright:'希望之光、内心平静、灵感涌现、身心治愈',reversed:'丧失信心、绝望、忽视内在需求、灵感枯竭',color:'#3b82f6',icon:'⭐'},
  {num:18,name:'月亮',en:'The Moon',element:'水',keyword:'幻觉·恐惧·潜意识',upright:'面对恐惧、探索潜意识、相信直觉穿越迷雾',reversed:'恐惧被夸大、自欺欺人、真相即将揭示',color:'#6366f1',icon:'🌙'},
  {num:19,name:'太阳',en:'The Sun',element:'火',keyword:'光明·成功·喜悦',upright:'一切顺利、幸福满满、能量巅峰、孩子般的快乐',reversed:'暂时的阴霾、快乐被遮蔽、成功稍延迟',color:'#eab308',icon:'☀️'},
  {num:20,name:'审判',en:'Judgement',element:'火',keyword:'觉醒·召唤·重估',upright:'内心的觉醒、回应召唤、重新评估人生方向、释怀',reversed:'拒绝觉醒、自我批判过度、后悔过去、不敢改变',color:'#ef4444',icon:'📯'},
  {num:21,name:'世界',en:'The World',element:'土',keyword:'完成·圆满·合一',upright:'一个周期的完成、大功告成、圆融自在、旅行成功',reversed:'功亏一篑、未完成的课题、目标延迟、缺乏闭合',color:'#10b981',icon:'🌍'}
];
/* ---------- 小六壬 · 掌诀 ---------- */
const XLR_POSITIONS = [
  {index:1,name:'大安',meaning:'身不动时，五行属木，东方青龙',interpret:'诸事安稳，求谋顺利，出行无阻，失物可寻。宜静不宜动，稳扎稳打。',symbol:'🐉',color:'#10b981'},
  {index:2,name:'留连',meaning:'卒未归时，五行属水，北方玄武',interpret:'事难成就，去者未归，求谋日下未成。宜等待时机，不可急于求成。',symbol:'🐢',color:'#3b82f6'},
  {index:3,name:'速喜',meaning:'人便至时，五行属火，南方朱雀',interpret:'喜事来临，做事迅速有成，行人立至。宜抓住机遇，快速行动。',symbol:'🐦',color:'#ef4444'},
  {index:4,name:'赤口',meaning:'官事凶时，五行属金，西方白虎',interpret:'口舌是非，官非纠纷，需谨言慎行。不宜起冲突，以和为贵。',symbol:'🐯',color:'#f97316'},
  {index:5,name:'小吉',meaning:'人来喜时，五行属木，六合',interpret:'凡事可谋，小利益至，和合美满。求财顺利，人际关系和谐。',symbol:'🦊',color:'#8b5cf6'},
  {index:6,name:'空亡',meaning:'音信稀时，五行属土，勾陈',interpret:'谋事落空，劳而无成，行人杳无音信。宜另谋出路，不宜死磕。',symbol:'🌫️',color:'#64748b'}
];
/* ---------- 玄学入门指南 ---------- */
const DIVINATION_GUIDE = [
  {icon:'🃏',title:'塔罗牌',desc:'78张牌分大阿尔卡纳(22)+小阿尔卡纳(56)。韦特塔罗是入门首选，牌面图案直观清晰。学习路径：认识牌义→练习三牌阵→每日一抽→进阶牌阵。',link:'https://search.bilibili.com/all?keyword=塔罗牌新手入门',xhs:xhsUrl('塔罗牌 新手入门')},
  {icon:'🖐️',title:'小六壬',desc:'中国传统占卜术，通过农历月日时三个数字在手掌六个位置推算吉凶。极其简单——只需一只手、三个数字。掌诀顺序：大安(1)→留连(2)→速喜(3)→赤口(4)→小吉(5)→空亡(6)。',link:'https://search.bilibili.com/all?keyword=小六壬教学',xhs:xhsUrl('小六壬 教学')},
  {icon:'☯️',title:'八字命理',desc:'根据出生年月日时排八字(四柱)，分析五行生克、十神关系，是最系统的人生分析工具。入门门槛较高，推荐从《子平真诠》开始。',link:'https://search.bilibili.com/all?keyword=八字入门教学',xhs:xhsUrl('八字 入门教学')},
  {icon:'🌠',title:'星座星盘',desc:'西方占星学，需要出生日期+时间+地点排星盘。分析行星落入的星座和宫位。12星座只是太阳星座（最基础的）。',link:'https://search.bilibili.com/all?keyword=星盘入门教学',xhs:xhsUrl('星盘 入门教学')},
  {icon:'📖',title:'周易六爻',desc:'最古老的占卜体系之一，通过三枚铜钱六次摇卦。易学界的"硬通货"——需要扎实的卦象和经文基础。推荐《周易》入门+配合《周易译注》。',link:'https://search.bilibili.com/all?keyword=周易六爻入门',xhs:xhsUrl('周易六爻 入门')},
  {icon:'🎴',title:'雷诺曼卡牌',desc:'36张牌的小巧占卜系统，比塔罗更直接务实。每张牌有具体象征（如船=旅行、信=消息），解读直接不绕弯，适合实际问题占卜。',link:'https://search.bilibili.com/all?keyword=雷诺曼新手教学',xhs:xhsUrl('雷诺曼 新手')}
];

/* ============================================================
   导航
   ============================================================ */
const TITLES = {dashboard:'首页概览',english:'英语学习',fitness:'健身减脂',aesthetics:'美学培养',reading:'阅读打卡',bilibili:'B站学习',geography:'地理学习',photography:'摄影学习',xhs:'小红书',meditation:'冥想',divination:'玄学占卜'};
let activeView='dashboard';
function switchView(v){
  activeView=v;
  $$('.nav-item').forEach(b=>b.classList.toggle('active', b.dataset.view===v));
  $$('.view').forEach(s=>s.classList.toggle('active', s.id==='view-'+v));
  $('#viewTitle').textContent=TITLES[v];
  renderView(v);
}
function renderView(v){
  ({dashboard:renderDashboard,english:renderEnglish,fitness:renderFitness,aesthetics:renderAesthetics,reading:renderReading,bilibili:renderBilibili,geography:renderGeography,photography:renderPhotography,xhs:renderXHS,meditation:renderMeditation,divination:renderDivination})[v]();
}
$('#navList').addEventListener('click',e=>{ const b=e.target.closest('.nav-item'); if(b) switchView(b.dataset.view); });

/* ---------- 通用：日期 ---------- */
function fmtDate(){
  const d=new Date();
  const wk=['周日','周一','周二','周三','周四','周五','周六'];
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 · ${wk[d.getDay()]}`;
}

/* ============================================================
   活跃天数 / 打卡连续
   ============================================================ */
function markActive(d=today()){ const s=new Set(load(K.active,[])); s.add(d); save(K.active,[...s]); }
function streakCount(){
  const set=new Set(load(K.active,[])); let n=0; let d=new Date();
  while(set.has(d.toISOString().slice(0,10))){ n++; d.setDate(d.getDate()-1); }
  return n;
}
function renderStreak(){ $('#sideStreak').textContent=`🔥 连续打卡 ${streakCount()} 天`; }

/* ============================================================
   首页概览
   ============================================================ */
let quoteIdx=0;
function renderDashboard(){
  const words=load(K.words,[]); const mastered=words.filter(w=>w.mastered).length;
  const workouts=load(K.workouts,[]); const wkDone=workouts.filter(w=>w.done && within7(w.doneDate)).length;
  const rlog=load(K.readLog,[]); const totalMin=rlog.reduce((a,b)=>a+(+b.minutes||0),0);
  const books=load(K.books,[]); const finished=books.filter(b=>b.status==='done').length;

  $('#viewDate').textContent=fmtDate();
  $('#topbarRight').innerHTML=`<span class="streak-pill" style="background:#eef0ff;color:var(--brand)">🔥 ${streakCount()} 天连续</span>`;

  $('#dashStats').innerHTML=[
    statCard('🔤',mastered,'已掌握单词',words.length,'var(--c-eng)'),
    statCard('💪',wkDone,'本周训练次数','/ 7','var(--c-fit)'),
    statCard('📚',finished,'已读书目',books.length,'var(--c-read)'),
    statCard('⏱️',totalMin,'累计阅读分钟','','var(--c-aes)')
  ].join('');

  $('#dashQuick').innerHTML=[
    quickLink('english','🔤','英语学习','单词卡片 · 每日一句'),
    quickLink('fitness','💪','健身减脂','体重 · 训练打卡'),
    quickLink('aesthetics','🎨','美学培养','配色 · 灵感'),
    quickLink('bilibili','📺','B站学习','精选资源库')
  ].join('');

  $('#dashQuote').textContent=QUOTES[quoteIdx%QUOTES.length];
  renderTasks(); renderSchedule();
}
function statCard(ic,num,label,sub,color){
  return `<div class="stat-card"><div class="s-bar" style="background:${color}"></div>
    <div class="s-num">${num}${sub?`<span style="font-size:15px;color:var(--muted)"> / ${sub}</span>`:''}</div>
    <div class="s-label">${label}</div><div class="s-ic">${ic}</div></div>`;
}
function quickLink(v,ic,t,d){ return `<button class="quick-link" data-go="${v}"><div class="q-ic">${ic}</div><div class="q-t">${t}</div><div class="q-d">${d}</div></button>`; }
$('#dashQuick')&&document.addEventListener('click',e=>{ const b=e.target.closest('[data-go]'); if(b) switchView(b.dataset.go); });
$('#quoteNext').addEventListener('click',()=>{ quoteIdx++; $('#dashQuote').textContent=QUOTES[quoteIdx%QUOTES.length]; });

/* 今日待办 */
function getTasks(){
  let t=load(K.tasks,null);
  if(!t){
    t=[{id:uid(),txt:'背 10 个单词',done:false},{id:uid(),txt:'完成一组健身跟练',done:false},
       {id:uid(),txt:'阅读 20 分钟',done:false},{id:uid(),txt:'看一个美学/学习视频',done:false}];
    save(K.tasks,t);
  }
  return t;
}
function renderTasks(){
  const t=getTasks();
  $('#dashTasks').innerHTML=t.map(x=>`
    <div class="task-item ${x.done?'done':''}">
      <div class="task-check ${x.done?'done':''}" data-tk="${x.id}">${x.done?'✓':''}</div>
      <span class="task-txt">${esc(x.txt)}</span>
    </div>`).join('') || '<p class="muted">暂无待办</p>';
}
$('#dashTasks')&&document.addEventListener('click',e=>{
  const c=e.target.closest('[data-tk]'); if(!c) return;
  const t=getTasks().map(x=>x.id===c.dataset.tk?{...x,done:!x.done}:x);
  save(K.tasks,t); markActive(); renderTasks(); renderStreak();
});

/* 每日计划 */
function getSchedule(){
  let s=load(K.schedule,null);
  if(!s){
    s=[{id:uid(),time:'07:00',txt:'起床，喝一杯温水',done:false},
       {id:uid(),time:'08:00',txt:'早餐 + 回顾今日计划',done:false},
       {id:uid(),time:'09:00',txt:'专注学习 / 工作（90分钟）',done:false},
       {id:uid(),time:'12:00',txt:'午餐 + 短暂休息',done:false},
       {id:uid(),time:'14:00',txt:'下午学习 / 工作时段',done:false},
       {id:uid(),time:'18:00',txt:'健身 / 运动时间',done:false},
       {id:uid(),time:'20:00',txt:'阅读 / 自我提升',done:false},
       {id:uid(),time:'22:00',txt:'复盘今日，计划明日',done:false}];
    save(K.schedule,s);
  }
  return s;
}
function isNowSlot(t){
  const now=new Date(); const h=now.getHours(),m=now.getMinutes();
  const [th,tm]=t.split(':').map(Number);
  const total=th*60+tm; const nowTotal=h*60+m;
  return nowTotal>=total && nowTotal<total+60;
}
function renderSchedule(){
  const s=getSchedule().filter(x=>!x.date||x.date===today());
  $('#dashSchedule').innerHTML=s.map(x=>`
    <div class="schedule-slot ${x.done?'done':''} ${isNowSlot(x.time)&&!x.done?'now':''}">
      <span class="sch-time">${x.time}</span>
      <span class="sch-dot"></span>
      <span class="sch-txt">${esc(x.txt)}</span>
      <div class="sch-actions">
        <button class="icon-btn" data-schdone="${x.id}" title="完成">${x.done?'✅':'○'}</button>
      </div>
    </div>`).join('');
}
document.addEventListener('click',e=>{
  const d=e.target.closest('[data-schdone]'); if(!d)return;
  const s=getSchedule().map(x=>x.id===d.dataset.schdone?{...x,done:!x.done}:x);
  save(K.schedule,s); markActive(); renderSchedule(); renderStreak();
});

/* ============================================================
   英语学习
   ============================================================ */
let engIdx=0; let engFlipped=false;
function getWords(){ let w=load(K.words,null); if(!w){ w=DEFAULT_WORDS.map(x=>({id:uid(),w:x.w,m:x.m,phonetic:x.phonetic||'',phrases:x.phrases||[],mastered:false})); save(K.words,w);} return w; }
function renderEnglish(){
  const words=getWords();
  $('#wordCount').textContent=`（共 ${words.length} 个，已掌握 ${words.filter(w=>w.mastered).length}）`;
  const mastered=words.filter(w=>w.mastered).length;
  const pct=words.length?Math.round(mastered/words.length*100):0;
  $('#engProgress').innerHTML=`<div class="progress-bar"><div style="width:${pct}%"></div></div>
    <p class="muted" style="margin-top:8px">掌握进度 ${mastered}/${words.length}（${pct}%）</p>
    <p style="margin-top:10px;font-size:13px"><b>每日一句：</b>${SENTENTS()}</p>`;
  renderFlashcard(); renderWordList(); renderOral(); renderShows();
}
function SENTENTS(){ return SENTENCES[new Date().getDate()%SENTENCES.length]; }
function renderFlashcard(){
  const words=getWords(); engFlipped=false;
  const fc=$('#flashcard'); fc.classList.remove('flipped');
  if(!words.length){ $('#fcWord').textContent='—'; $('#fcMeaning').textContent='点击「添加单词」开始'; $('#fcPhonetic').textContent=''; $('#fcPhrases').innerHTML=''; $('#fcIndex').textContent='0 / 0'; return; }
  if(engIdx>=words.length) engIdx=0;
  const w=words[engIdx];
  $('#fcWord').textContent=w.w;
  $('#fcPhonetic').textContent=w.phonetic||'';
  $('#fcPhrases').innerHTML=(w.phrases||[]).map(p=>`<span class="fc-phrase-tag">${esc(p)}</span>`).join('');
  $('#fcMeaning').textContent=w.m;
  $('#fcLearn').href=`https://www.ldoceonline.com/search/english/direct/?q=${encodeURIComponent(w.w)}`;
  $('#fcIndex').textContent=`${engIdx+1} / ${words.length}`;
}
$('#flashcard').addEventListener('click',(e)=>{ if(e.target.closest('#fcAudio'))return; engFlipped=!engFlipped; $('#flashcard').classList.toggle('flipped',engFlipped); });
$('#fcAudio').addEventListener('click',(e)=>{ e.stopPropagation(); const w=getWords(); if(!w.length||engIdx>=w.length)return; const u=new SpeechSynthesisUtterance(w[engIdx].w); u.lang='en-US'; u.rate=0.85; speechSynthesis.speak(u); });
$('#fcPrev').addEventListener('click',()=>{ const w=getWords(); if(!w.length)return; engIdx=(engIdx-1+w.length)%w.length; renderFlashcard(); markActive(); });
$('#fcNext').addEventListener('click',()=>{ const w=getWords(); if(!w.length)return; engIdx=(engIdx+1)%w.length; renderFlashcard(); markActive(); });
$('#fcShuffle').addEventListener('click',()=>{ let w=getWords(); w.sort(()=>Math.random()-.5); save(K.words,w); engIdx=0; renderFlashcard(); });
$('#fcMark').addEventListener('click',()=>{ const w=getWords(); if(!w.length)return; w[engIdx].mastered=!w[engIdx].mastered; save(K.words,w); renderEnglish(); });
/* 自动查词（Free Dictionary API） */
async function fetchWordData(word){
  try{
    const res=await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if(!res.ok) return null;
    const data=await res.json();
    const entry=data[0];
    const phonetic=entry.phonetic||(entry.phonetics||[]).find(p=>p.text)?.text||'';
    const meanings=entry.meanings||[];
    const defs=meanings.flatMap(m=>m.definitions.map(d=>`${m.partOfSpeech}. ${d.definition}`));
    const meaning=defs.slice(0,2).join('；')||'(未找到释义)';
    const examples=meanings.flatMap(m=>m.definitions.filter(d=>d.example).map(d=>d.example));
    const phrases=examples.slice(0,4);
    return {phonetic,meaning,phrases};
  }catch(e){ return null; }
}
$('#addWordBtn').addEventListener('click',async()=>{
  const w=$('#addWord').value.trim(); if(!w)return;
  const status=$('#wordFetchStatus');
  status.innerHTML='<span style="color:var(--c-geo)">⏳ 正在查询词典…</span>';
  const list=getWords();
  if(list.some(x=>x.w.toLowerCase()===w.toLowerCase())){
    status.innerHTML='<span style="color:#ef4444">⚠️ 该单词已在词库中</span>';
    return;
  }
  const data=await fetchWordData(w);
  if(data&&data.meaning!=='(未找到释义)'){
    status.innerHTML='<span style="color:#10b981">✅ 已自动获取音标和释义！</span>';
    list.push({id:uid(),w,m:data.meaning,phonetic:data.phonetic,phrases:data.phrases,mastered:false});
  } else {
    status.innerHTML='<span style="color:#f59e0b">⚠️ 未查到该词，请手动输入释义</span>';
    list.push({id:uid(),w,m:'(请编辑释义)',phonetic:'',phrases:[],mastered:false});
  }
  save(K.words,list); $('#addWord').value=''; engIdx=list.length-1; renderEnglish(); markActive();
  setTimeout(()=>{ status.innerHTML=''; },3000);
});
$('#wordSearch').addEventListener('input',renderWordList);
function renderWordList(){
  const q=($('#wordSearch').value||'').toLowerCase();
  const words=getWords().filter(w=>!q||w.w.toLowerCase().includes(q)||w.m.toLowerCase().includes(q)||(w.phonetic||'').toLowerCase().includes(q));
  $('#wordList').innerHTML=words.map(w=>`
    <div class="word-item ${w.mastered?'mastered':''}">
      <div style="width:120px;min-width:120px">
        <span class="w-en">${esc(w.w)}</span>
        ${w.phonetic?`<span class="w-phonetic">${esc(w.phonetic)}</span>`:''}
      </div>
      <span class="w-cn">${esc(w.m)}</span>
      <div class="w-phrases" style="width:130px;min-width:130px">${(w.phrases||[]).map(p=>`<span class="w-phrase-tag">${esc(p)}</span>`).join('')}</div>
      <span class="tag ${w.mastered?'green':''}" style="width:65px;text-align:center">${w.mastered?'已掌握':'学习中'}</span>
      <a class="wi-link" href="https://www.ldoceonline.com/search/english/direct/?q=${encodeURIComponent(w.w)}" target="_blank" rel="noopener" title="在朗文词典中查看详细用法">📖 词典</a>
      <button class="icon-btn" data-wdel="${w.id}" title="删除">🗑</button>
    </div>`).join('')||'<p class="muted">暂无单词</p>';
}
document.addEventListener('click',e=>{
  const d=e.target.closest('[data-wdel]'); if(!d)return;
  let w=getWords().filter(x=>x.id!==d.dataset.wdel); save(K.words,w); if(engIdx>=w.length)engIdx=0; renderEnglish();
});

/* 口语实战 */
let oralScene='dining';
function renderOral(){
  const scene=ORAL_SCENES.find(s=>s.id===oralScene)||ORAL_SCENES[0];
  $('#sceneTabs').innerHTML=ORAL_SCENES.map(s=>`<button class="scene-tab ${s.id===oralScene?'active':''}" data-sctab="${s.id}">${s.label}</button>`).join('');
  $('#sceneContent').innerHTML=`
    <div class="scene-card">
      <div class="scene-dialogue">${scene.lines.map((l,i)=>`
        <div class="dialogue-line ${l.role==='You'?'you':''}">
          <span class="dl-role">${l.role}</span>
          <p class="dl-en">${esc(l.en)}</p>
          <p class="dl-cn">${esc(l.cn)}</p>
        </div>`).join('')}</div>
      <div class="oral-tip">💡 <b>发音技巧：</b>${esc(scene.tip)}</div>
    </div>`;
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-sctab]'); if(!t)return;
  oralScene=t.dataset.sctab; renderOral();
});

/* 看剧学英语 */
function renderShows(){
  const levels=['入门','中级','进阶'];
  $('#showGrid').innerHTML=levels.map(lv=>{
    const items=SHOWS.filter(s=>s.level===lv);
    if(!items.length) return '';
    return `<div class="show-level"><div class="show-level-tag" style="background:var(--c-eng)">${lv}</div>
      <div class="show-group">${items.map(s=>`<div class="show-card">
        <span class="show-badge" style="background:${s.color}">${s.cat==='animation'?'动画':'sitcom'===s.cat?'情景喜剧':'drama'===s.cat?'剧情':'动画'}</span>
        <span class="show-title">${esc(s.title)} <small style="font-weight:400;color:var(--muted)">${esc(s.en)}</small></span>
        <p class="show-meta">📺 ${esc(s.seasons)} · ⏱ ${esc(s.eps)}</p>
        <p class="show-why">${esc(s.why)}</p>
        <a class="show-link" href="https://search.bilibili.com/all?keyword=${encodeURIComponent(s.title)}" target="_blank" rel="noopener">📺 B站</a> <a class="show-link" style="margin-left:6px" href="https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(s.title)}" target="_blank" rel="noopener">📕 小红书</a>
      </div>`).join('')}</div></div>`;
  }).join('');
}

/* ============================================================
   健身减脂
   ============================================================ */
function getBodyProfile(){ return load('xwb_body',null); }
function calcBMI(h, w){ if(!h||!w)return null; const hm=h/100; return +(w/(hm*hm)).toFixed(1); }

/* 生成定制健身方案 */
function generatePlan(profile){
  const {height,weight,target,goal}=profile;
  const bmi=calcBMI(height,weight);
  const plan=[];
  const days=['周一','周二','周三','周四','周五','周六','周日'];
  if(goal==='lose'){
    plan.push({day:'周一',type:'有氧燃脂',focus:'全身燃脂+核心',ex:[
      {name:'开合跳',spec:'3组×45秒 组间休息30秒',form:'双脚并拢站立，跳起时双脚打开略宽于肩，同时双手从体侧划弧到头顶击掌。落地时膝盖微屈缓冲，核心收紧，保持均匀呼吸。常见错误：膝盖内扣、落地太重。',tips:'落地轻如猫，膝盖方向与脚尖一致'},
      {name:'高抬腿',spec:'3组×30秒 组间休息30秒',form:'原地跑步姿势，膝盖抬高至髋部水平以上，前脚掌着地。手臂自然前后摆动，背部挺直不要后仰。速度越快消耗越大。',tips:'想象膝盖去顶胸口，而不是弯腰去够膝盖'},
      {name:'平板支撑',spec:'3组×30-45秒 组间休息20秒',form:'俯卧，双肘撑地与肩同宽，脚尖着地。身体从头到脚跟呈一条直线，腹部收紧、臀部不要翘起或下沉。眼睛看地面，颈部放松。',tips:'如果腰酸，说明核心没收紧——立刻停下调整'}
    ]});
    plan.push({day:'周二',type:'力量塑形',focus:'上肢+背部',ex:[
      {name:'俯卧撑（跪姿）',spec:'3组×8-12次 组间休息45秒',form:'双手略宽于肩，膝盖着地（比标准俯卧撑减50%负重）。身体从头到膝呈直线，下降时肘部向身体后方约45°展开。胸部贴近地面后推起。',tips:'手肘不要向两侧张开（伤肩），保持在身体侧后方45°'},
      {name:'弹力带划船',spec:'3组×12-15次',form:'坐姿，弹力带绕在脚底。背部挺直，双肘贴近身体向后拉，感受肩胛骨向中间挤压。慢放慢收，顶峰收缩1秒。',tips:'用背部发力而不是手臂——想象用肩胛骨去夹一支笔'},
      {name:'臀桥',spec:'3组×15次 组间休息30秒',form:'仰卧，膝盖弯曲，脚平放在地上与肩同宽。臀部发力将髋部向上推至身体呈直线，顶峰收紧臀肌2秒后缓慢放下。',tips:'推起时下巴微收、眼看天花板，不要过度挺腰'}
    ]});
    plan.push({day:'周三',type:'HIIT间歇',focus:'高效燃脂+后燃效应',ex:[
      {name:'Burpee 波比跳',spec:'4组×8次 组间休息60秒',form:'站立→蹲下→双手撑地→双脚后跳至俯卧撑位→快速收回→起身跳起。全程核心收紧，动作连贯。新手可不跳只站立。',tips:'动作质量>速度。宁可做慢标准的8个，不要做快的15个'},
      {name:'深蹲跳',spec:'3组×10次 组间休息40秒',form:'双脚与肩同宽，先做一个标准深蹲，然后爆发向上跳起。落地时屈膝缓冲直接进入下一个深蹲。',tips:'起跳时充分伸展髋、膝、踝三个关节'},
      {name:'登山者',spec:'3组×30秒 组间休息25秒',form:'俯卧撑起始位，交替将膝盖向胸部方向快速提起。保持核心稳定不扭动，臀部不要翘起。',tips:'像在水平方向上跑步，注意保持腰背平直'}
    ]});
    plan.push({day:'周四',type:'主动恢复',focus:'轻度拉伸+散步',ex:[
      {name:'全身静态拉伸',spec:'每个动作保持20-30秒',form:'依次拉伸：颈部→肩部→背部→髋屈肌→大腿前侧→小腿。每个拉伸动作缓慢进入，到有轻微牵拉感时保持，不要弹振。',tips:'拉伸时呼气有助于肌肉放松'},
      {name:'快步走',spec:'30分钟',form:'保持能交谈但不能唱歌的强度。脚跟先着地→滚动到前脚掌→蹬地。摆臂幅度大一些能多消耗15%热量。',tips:'推荐公园或绿道，自然环境让恢复更有效'}
    ]});
    plan.push({day:'周五',type:'下肢力量',focus:'臀腿塑形',ex:[
      {name:'自重深蹲',spec:'4组×12-15次 组间休息45秒',form:'双脚略宽于肩，脚尖微朝外。下蹲时先向后坐（像坐椅子），膝盖不要超过脚尖太多。大腿与地面平行即可起身。全程背部挺直。',tips:'想象身后有一把看不见的椅子，屁股先去找椅子'},
      {name:'侧卧抬腿',spec:'3组×每侧15次',form:'侧卧，下方腿微屈保持稳定。上方腿伸直，用臀部外侧发力向上抬起约45°，缓慢下放但不着地。',tips:'骨盆不要前后翻转，保持身体在一条直线上'},
      {name:'弓步蹲',spec:'3组×每侧10次',form:'双脚前后站立，前脚平放后脚前脚掌着地。垂直下蹲至双膝均约90°，前膝不超脚尖。推前脚发力起身。',tips:'身体重心在双腿中间，不要前倾'}
    ]});
    plan.push({day:'周六',type:'混合有氧',focus:'趣味消耗+坚持',ex:[
      {name:'跳绳',spec:'3组×2分钟 组间休息45秒',form:'手腕发力摇绳，前脚掌着地，膝盖微屈缓冲。高度只需离地2-3cm即可。不会连续跳可用"跳两下摇一次"过渡。',tips:'大臂贴紧身体，只用手腕摇绳——手臂大幅度会很快疲劳'},
      {name:'帕梅拉/跟练视频',spec:'任选15-20分钟跟练',form:'打开B站搜索"Pamela Reif 20min"，选中等强度的视频跟练。注意动作质量和节奏，累了就降速不要停。',tips:'选弹幕多的视频，有人在"陪练"更有动力'}
    ]});
    plan.push({day:'周日',type:'休息日',focus:'彻底恢复',ex:[
      {name:'泡沫轴放松',spec:'每个部位滚30-60秒',form:'大腿前侧→大腿外侧→小腿→背部。找到酸痛点慢慢滚压，痛感应在6-7分（10分满分）即可。',tips:'在酸痛点停住深呼吸3次，这是最有效的自我按摩方式'},
      {name:'散步+回顾',spec:'20-30分钟',form:'轻松散步，回顾这周的训练数据和身体感受。记录体重变化和围度，设定下周小目标。',tips:'休息日不是偷懒日，是身体变强的日子，认真对待'}
    ]});
  }else if(goal==='muscle'){
    // Similar structure but for muscle building - I'll use the same format with different exercises
    const ex_sets = [
      [{name:'杠铃/哑铃卧推',spec:'4组×8-10次',form:'仰卧在平凳上，肩胛骨收紧下沉。握距略宽于肩，下放至胸部上方1-2cm，推起时肘关节不锁死。全程保持手腕中立。',tips:'脚踩实地→臀收紧→背收紧→肩下沉——建立"底座"后再推'},
       {name:'上斜哑铃飞鸟',spec:'3组×10-12次',form:'上斜凳约30°。双手持哑铃在胸部上方，微屈肘，像抱大树一样向两侧打开，感受到胸肌拉伸后收回。',tips:'肘关节角度保持固定，只动肩关节'},
       {name:'双杠臂屈伸',spec:'3组×力竭',form:'双手撑双杠，身体前倾15°，屈肘下降至上臂与地面平行，推起。'}],
      [{name:'引体向上/高位下拉',spec:'4组×6-10次',form:'正手宽握，肩胛骨先下沉再发力下拉。下拉到下巴过杠或手柄至锁骨位置，顶峰收缩1秒。',tips:'先沉肩→再拉，顺序不能反。不要用爆发力借力'},
       {name:'哑铃划船',spec:'3组×每侧10次',form:'单膝跪凳，同侧手撑凳面。对侧手持哑铃，肘贴近身体向后上方拉，感受背阔肌收缩。',tips:'拉到"肘超过身体"即可，再往后手臂会代偿'},
       {name:'直臂下压',spec:'3组×12-15次',form:'站姿龙门架，双手握直杆。手臂伸直从高位压至大腿前，用背阔肌发力而非手臂下压。'}],
      [{name:'杠铃深蹲',spec:'4组×8-10次',form:'杠铃放在斜方肌上（不是脖子上）。双脚与肩同宽，下蹲时先屈髋再屈膝，膝盖与脚尖同向。',tips:'想象把地板踩下去——压力应该在脚掌中间，不是脚尖'},
       {name:'罗马尼亚硬拉',spec:'3组×10次',form:'双脚髋宽，膝盖微屈。以髋为轴上半身前倾，杠铃贴近小腿下滑至膝盖下方，臀肌发力推髋向前回正。',tips:'背绝对不能弯！如果弯了→减重量'},
       {name:'保加利亚分腿蹲',spec:'3组×每侧8-10次',form:'后脚搭在凳上，前脚大步向前。垂直下蹲至前大腿与地面平行，前膝不超脚尖。'}],
      [{name:'站姿杠铃推举',spec:'4组×8-10次',form:'杠铃放在锁骨位置，双手略宽于肩。垂直向上推至头顶，头部微前移让杠铃过脸，顶点肘关节不锁死。',tips:'核心收紧像准备挨一拳，这是保护腰椎的关键'},
       {name:'侧平举',spec:'3组×12-15-15次(递减)',form:'微屈肘，以肩关节为轴将哑铃向两侧举至与肩平，顶峰停留1秒后慢放。',tips:'小重量、高次数、控制节奏——肩膀不是用来冲大重量的'}],
      [{name:'主动拉伸+轻度有氧',spec:'30分钟',form:'全身动态拉伸→泡沫轴放松→20分钟椭圆机或自行车。心率保持120-140。'}],
      [{name:'补充训练',spec:'针对薄弱环节',form:'选1-2个你最弱的肌群做额外训练。记录本周所有训练重量和次数，下周在这个基础上+2.5kg或+1次。'}],
      [{name:'完全休息',spec:'—',form:'足够的休息=肌肉生长的关键。保证7-8小时睡眠，摄入足够的蛋白质和碳水。'}]
    ];
    for(let i=0;i<7;i++){
      plan.push({day:days[i],type:i<5?'增肌力量':i===5?'补充训练':'休息日',focus:'',ex:ex_sets[i]});
    }
  }else if(goal==='tone'){
    const ex_sets = [
      [{name:'瑜伽拜日式×5轮',spec:'—',form:'山式→前屈→平板→上犬→下犬→回到山式。每个动作配合呼吸：吸气延展，呼气深入。',tips:'不要追求柔韧性，追求呼吸与动作的同步'},
       {name:'普拉提百次拍击',spec:'3组×20次',form:'仰卧，头和肩抬离地面，双腿抬起至45°，手臂在身体两侧快速小幅拍击，吸气5次+呼气5次为一组。'}],
      [{name:'弹力带臀腿训练',spec:'3组×每侧15次',form:'弹力带套在膝盖上方。侧卧蚌式开合→站姿侧抬腿→驴踢。每个动作感受臀部发力而非大腿。',tips:'臀部"预激活"：训练前做一组臀桥让肌肉先醒过来'},
       {name:'靠墙静蹲',spec:'3组×45秒',form:'背靠墙，大腿与地面平行。膝盖与脚尖同向，膝盖不要超过脚尖。'}],
      [{name:'全身循环×3轮',spec:'每个动作40秒/休息15秒',form:'深蹲→俯卧撑→弓步(交替)→登山者→臀桥→俄罗斯转体。连续做6个动作为一轮，轮间休息90秒。',tips:'循环训练的心率保持在140-160效果最好，用手表或手指测脉搏'}],
      [{name:'体态矫正',spec:'—',form:'靠墙站立：脚后跟、臀部、肩胛骨、后脑勺贴墙，下巴微收，保持5分钟。检测是否有圆肩、探颈、骨盆前倾。',tips:'每天5分钟靠墙站，一个月体态改变肉眼可见'}],
      [{name:'有氧舞蹈/尊巴',spec:'30分钟',form:'打开B站搜索"尊巴跟练"，跟着音乐节奏动起来。关键是开心，不是在比赛。',tips:'跳得丑没关系，跳得开心才燃脂'},
       {name:'泡沫轴+拉伸',spec:'15分钟',form:'从头到脚依次滚动放松，配合深长呼吸。'}],
      [{name:'长距离慢跑/快走',spec:'40-60分钟',form:'能轻松交谈的配速。穿缓震好的跑鞋，步频保持170-180步/分钟以减小膝盖冲击。',tips:'跑后必做5分钟拉伸，否则第二天腿会抗议'}],
      [{name:'完全休息',spec:'—',form:'睡到自然醒。可以做10分钟温和拉伸。回顾本周，奖励自己一顿健康美食。'}]
    ];
    for(let i=0;i<7;i++){
      plan.push({day:days[i],type:i<6?'紧致训练':i===6?'休息日':'',focus:'',ex:ex_sets[i]});
    }
  }else{
    plan.push({day:'周一',type:'全身唤醒',ex:[{name:'快走30min+8个基础拉伸动作',spec:'约40分钟',form:'从今天开始动起来，不需要剧烈，持续性比强度重要100倍。每个拉伸动作保持15-20秒，配合深呼吸。',tips:'迈出第一步就是成功的一半'}]});
    plan.push({day:'周二',type:'轻度力量',ex:[{name:'自重训练：深蹲×15+俯卧撑(跪姿)×8+臀桥×15+平板支撑×30s',spec:'循环3轮',form:'四个动作连续做为一轮，轮间休息90秒。动作质量永远大于数量。',tips:'每周2次力量+2次有氧是最低有效剂量'}]});
    plan.push({day:'周三',type:'有氧日',ex:[{name:'慢跑或骑行30分钟',spec:'中低强度',form:'保持能与人交谈的配速。如果跑步膝盖不适，立即换成快走或椭圆机。有氧运动的目的是心肺健康，不是折磨自己。',tips:'空腹有氧燃脂比例高，但如果头晕马上停止'}]});
    plan.push({day:'周四',type:'灵活恢复',ex:[{name:'瑜伽/拉伸20分钟',spec:'—',form:'推荐B站搜索"30分钟 瑜伽 新手"，跟着做即可。瑜伽不仅拉伸身体，还训练呼吸和专注力。'}]});
    plan.push({day:'周五',type:'力量+有氧',ex:[{name:'同周二的自重训练+15分钟跳绳',spec:'约35分钟',form:'先力量后有氧，这个顺序能保留更多体力给力量训练保证动作质量。'}]});
    plan.push({day:'周六',type:'户外活动',ex:[{name:'爬山/骑行/球类',spec:'1-2小时',form:'选你最喜欢的运动。运动的最高境界是忘记自己在运动——找到你真正享受的方式。'}]});
    plan.push({day:'周日',type:'休息',ex:[{name:'完全休息',spec:'—',form:'身体需要恢复。散步和拉伸OK，其他训练免了。明天又是新的一周！'}]});
  }
  return {bmi,plan,goal,target,weight};
}

/* 渲染身体档案卡片 */
function renderBodyProfile(){
  const p=getBodyProfile();
  if(!p){ $('#bodyProfileCard').innerHTML=''; $('#planCard').style.display='none'; return; }
  const bmi=calcBMI(p.height,p.weight);
  const bmiLabel=bmi<18.5?'偏瘦':bmi<24?'标准':bmi<28?'偏胖':'肥胖';
  const goalLabel={lose:'减脂塑形',muscle:'增肌增重',tone:'线条紧致',keep:'维持健康'}[p.goal]||p.goal;
  $('#bodyProfileCard').innerHTML=`<div class="profile-card">
    <p style="margin-bottom:6px">📊 <b>BMI：${bmi}</b>（${bmiLabel}）| 当前 <b>${p.weight}kg</b> → 目标 <b>${p.target}kg</b> | 目标：<b>${goalLabel}</b></p>
    <p style="font-size:12px;color:var(--muted)">方案基于你的身体数据定制，每周可重新调整。坚持4周后评估效果。</p>
  </div>`;
}

/* 渲染健身方案 */
function renderPlan(){
  const p=getBodyProfile();
  if(!p){ $('#planCard').style.display='none'; return; }
  $('#planCard').style.display='block';
  const goalLabel={lose:'减脂塑形',muscle:'增肌增重',tone:'线条紧致',keep:'维持健康'}[p.goal]||p.goal;
  $('#planMeta').textContent=`目标：${goalLabel} · BMI ${calcBMI(p.height,p.weight)}`;
  const result=generatePlan(p);
  $('#planWeek').innerHTML=result.plan.map(d=>`
    <div class="plan-day">
      <div class="plan-day-hd">
        <span class="day-badge">${d.day}</span>
        ${d.type} ${d.focus?`· ${d.focus}`:''}
      </div>
      <div class="plan-day-body">${d.ex.map((e,i)=>`
        <div class="exercise-item">
          <span class="ex-num">${i+1}</span>
          <div class="ex-detail">
            <span class="ex-name">${esc(e.name)}</span>
            <span class="ex-spec">${esc(e.spec)}</span>
            <a class="ex-deep" href="${biliUrl(e.name+' 动作教学')}" target="_blank" rel="noopener">🎬 B站</a> <a class="ex-deep xhs-deep" href="${xhsUrl(e.name+' 动作教学')}" target="_blank" rel="noopener">📕 小红书</a>
            <div class="ex-form" data-exform="${i}">
              <div class="ex-form-body">${e.form}</div>
              ${e.tips?`<span class="ex-form-tip">💡 ${esc(e.tips)}</span>`:''}
              <span style="font-size:11px;color:var(--muted);display:block;margin-top:4px">点击展开/收起</span>
            </div>
          </div>
        </div>`).join('')}</div>
    </div>`).join('');
}

/* 动作讲解展开/收起 */
document.addEventListener('click',e=>{
  const ex=e.target.closest('[data-exform]'); if(!ex)return;
  ex.classList.toggle('expanded');
});

/* 保存身体档案事件 */
$('#bodySaveBtn').addEventListener('click',()=>{
  const h=parseFloat($('#bodyHeight').value),w=parseFloat($('#bodyWeight').value),t=parseFloat($('#bodyTarget').value),g=$('#bodyGoal').value;
  if(!h||!w){ alert('请至少填写身高和当前体重'); return; }
  save('xwb_body',{height:h,weight:w,target:t||w,goal:g,updated:today()});
  renderBodyProfile(); renderPlan(); markActive();
});
function getWeight(){ return load(K.weight,[]).sort((a,b)=>a.date<b.date?-1:1); }
function getWorkouts(){ return load(K.workouts,[]); }
function within7(d){ if(!d)return false; const t=new Date(d); const n=new Date(); return (n-t)<=7*864e5 && n>=t; }
function renderFitness(){
  renderBodyProfile(); renderPlan();
  const ws=getWeight();
  $('#weightDate').value=today();
  drawWeightChart(ws);
  $('#weightList').innerHTML=ws.slice().reverse().slice(0,12).map(w=>`
    <div class="weight-item"><span>${w.date}</span><b>${w.val} kg</b><button class="icon-btn" data-wtdel="${w.id}">🗑</button></div>`).join('')||'<p class="muted">还没有记录</p>';
  const wos=getWorkouts();
  $('#workoutList').innerHTML=wos.map(w=>`
    <div class="workout-item ${w.done?'done':''}">
      <div class="wo-check" data-wodel="${w.id}">${w.done?'✓':''}</div>
      <span class="wo-name">${esc(w.name)}</span>
      <span class="wo-stamp">${w.done&&w.doneDate?w.doneDate.slice(5):'未完成'}</span>
      <button class="icon-btn" data-worm="${w.id}">🗑</button>
    </div>`).join('')||'<p class="muted">还没有训练计划，加一个吧</p>';
  const wkDone=wos.filter(w=>w.done&&within7(w.doneDate)).length;
  $('#weekStat').innerHTML=`本周已完成 <b style="color:var(--c-fit)">${wkDone}</b> 次训练，目标 4-5 次/周。${wkDone>=4?'💪 优秀，继续保持！':'继续加油，动起来！'}`;
  $('#fitTips').innerHTML=FIT_TIPS.map(t=>`<a class="tip clickable" href="${biliUrl(t[0]+' 健身科普')}" target="_blank" rel="noopener" style="flex:0 0 auto">📺<b>${t[0]}</b>：${t[1]}<span class="tip-link">B站</span></a> <a class="tip clickable" href="${xhsUrl(t[0]+' 健身')}" target="_blank" rel="noopener" style="flex:0 0 auto"><b>${t[0]}</b>：${t[1]}<span class="tip-link">📕 小红书</span></a>`).join('');
}
function drawWeightChart(ws){
  const box=$('#weightChart'); if(!ws.length){ box.innerHTML='<p class="muted" style="padding:30px 0;text-align:center">记录体重后这里会显示趋势折线图</p>'; return; }
  const W=box.clientWidth||400,H=160,pad=28;
  const vals=ws.map(w=>+w.val),min=Math.min(...vals),max=Math.max(...vals);
  const lo=min-(max-min)*0.2-0.5,hi=max+(max-min)*0.2+0.5,span=hi-lo||1;
  const x=i=>pad+i*(W-2*pad)/Math.max(1,ws.length-1);
  const y=v=>H-pad-(v-lo)/span*(H-2*pad);
  const path=ws.map((w,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(+w.val).toFixed(1)}`).join(' ');
  const area=`${path} L${x(ws.length-1).toFixed(1)},${H-pad} L${x(0).toFixed(1)},${H-pad} Z`;
  const last=ws[ws.length-1],first=ws[0]; const diff=(+last.val-+first.val);
  box.innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}">
    <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ef4444" stop-opacity=".25"/><stop offset="1" stop-color="#ef4444" stop-opacity="0"/></linearGradient></defs>
    ${[0,.5,1].map(f=>`<line x1="${pad}" y1="${pad+f*(H-2*pad)}" x2="${W-pad}" y2="${pad+f*(H-2*pad)}" stroke="#eceef6"/>`).join('')}
    <path d="${area}" fill="url(#wg)"/><path d="${path}" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linejoin="round"/>
    ${ws.map((w,i)=>`<circle cx="${x(i).toFixed(1)}" cy="${y(+w.val).toFixed(1)}" r="3.5" fill="#fff" stroke="#ef4444" stroke-width="2"/>`).join('')}
    <text x="${pad}" y="14" font-size="11" fill="#8a8fa3">${min.toFixed(1)} - ${max.toFixed(1)} kg</text>
    <text x="${W-pad}" y="14" font-size="11" fill="#ef4444" text-anchor="end" font-weight="700">${diff>=0?'+':''}${diff.toFixed(1)} kg</text>
  </svg>`;
}
$('#addWeightBtn').addEventListener('click',()=>{ const d=$('#weightDate').value||today(),v=parseFloat($('#weightVal').value); if(!v)return; const ws=load(K.weight,[]); ws.push({id:uid(),date:d,val:v}); save(K.weight,ws); $('#weightVal').value=''; renderFitness(); markActive(); renderStreak(); });
$('#addWorkoutBtn').addEventListener('click',()=>{ const n=$('#addWorkout').value.trim(); if(!n)return; const w=getWorkouts(); w.push({id:uid(),name:n,done:false,doneDate:null}); save(K.workouts,w); $('#addWorkout').value=''; renderFitness(); });
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-wodel]'); if(c){ const w=getWorkouts().map(x=>x.id===c.dataset.wodel?{...x,done:!x.done,doneDate:!x.done?today():null}:x); save(K.workouts,w); if(w.find(x=>x.id===c.dataset.wodel)?.done)markActive(); renderFitness(); renderStreak(); return; }
  const r=e.target.closest('[data-worm]'); if(r){ save(K.workouts,getWorkouts().filter(x=>x.id!==r.dataset.worm)); renderFitness(); return; }
  const wd=e.target.closest('[data-wtdel]'); if(wd){ save(K.weight,load(K.weight,[]).filter(x=>x.id!==wd.dataset.wtdel)); renderFitness(); }
});

/* ============================================================
   美学培养
   ============================================================ */
let palMode='random', lastPalette=[];
function renderAesthetics(){
  genPalette();
  renderFashion(); renderLifeAes();
  $('#gallery').innerHTML=[
    ['何大爷课堂','艺术史故事',CAT_META.aesthetics.color,'aesthetics'],
    ['设计师IORI','经典配色解析',CAT_META.aesthetics.color,'aesthetics'],
    ['oooooohmygosh','字体设计观念',CAT_META.aesthetics.color,'aesthetics'],
    ['故宫博物院','云看展·文物之美','#c0392b','reading']
  ].map(g=>`<a class="gal-card" href="${biliUrl(g[0])}" target="_blank" rel="noopener" title="📺 B站搜「${g[0]}」">
    <div class="gal-thumb" style="background:linear-gradient(135deg,${g[2]},${shade(g[2],-25)})">${CAT_META[g[3]]?.ic||'🎨'}</div>
    <div class="gal-body"><b>${g[0]}</b><small>${g[1]}</small></div></a><a class="gal-card" href="${xhsUrl(g[0])}" target="_blank" rel="noopener" title="📕 小红书搜「${g[0]}」">
    <div class="gal-thumb" style="background:linear-gradient(135deg,#ff2442,#c01030)">📕</div>
    <div class="gal-body"><b>${g[0]}</b><small>小红书搜更多</small></div></a>`).join('');
  $('#aesTips').innerHTML=AES_TIPS.map(t=>`<a class="tip clickable" href="${biliUrl(t[0]+' 美学设计')}" target="_blank" rel="noopener" style="flex:0 0 auto">📺<b>${t[0]}</b>：${t[1]}<span class="tip-link">B站</span></a> <a class="tip clickable" href="${xhsUrl(t[0]+' 美学')}" target="_blank" rel="noopener" style="flex:0 0 auto"><b>${t[0]}</b>：${t[1]}<span class="tip-link">📕 小红书</span></a>`).join('');
  renderBoard();
}
function shade(hex,p){ const c=hex.replace('#',''); const n=parseInt(c,16); let r=(n>>16)+p,g=((n>>8)&255)+p,b=(n&255)+p; r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b)); return '#'+((r<<16)|(g<<8)|b).toString(16).padStart(6,'0'); }
function hsl2hex(h,s,l){ s/=100;l/=100; const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,9-k(n),1)); const r=Math.round(255*f(0)),g=Math.round(255*f(8)),b=Math.round(255*f(4)); return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join(''); }
function genPalette(){
  let cols=[]; const base=Math.floor(Math.random()*360);
  if(palMode==='analogous') cols=[0,30,60,-30,-60].map(d=>hsl2hex((base+d+360)%360,65,58));
  else if(palMode==='complementary') cols=[hsl2hex(base,65,58),hsl2hex(base,65,30),hsl2hex((base+180)%360,65,58),hsl2hex((base+180)%360,65,30),hsl2hex(base,20,80)];
  else if(palMode==='monochrome') cols=[25,40,55,70,85].map(l=>hsl2hex(base,55,l));
  else if(palMode==='triadic') cols=[0,120,240].map(d=>hsl2hex((base+d)%360,62,58)).concat([hsl2hex(base,20,85)]);
  else cols=Array.from({length:5},()=>hsl2hex(Math.floor(Math.random()*360),55+Math.random()*25,45+Math.random()*25));
  lastPalette=cols;
  $('#palette').innerHTML=cols.map(c=>`<div class="swatch" style="background:${c}" data-hex="${c}"><span class="hex">${c.toUpperCase()}</span></div>`).join('');
}
$('#paletteGen').addEventListener('click',genPalette);
$('#paletteMode').addEventListener('click',()=>{ const ms=['random','analogous','complementary','monochrome','triadic']; palMode=ms[(ms.indexOf(palMode)+1)%ms.length]; $('#paletteMode').textContent='模式：'+({random:'随机',analogous:'类似色',complementary:'互补色',monochrome:'单色',triadic:'三色'}[palMode]); genPalette(); });
$('#paletteCopy').addEventListener('click',()=>{ navigator.clipboard&&navigator.clipboard.writeText(lastPalette.join(', ')); flash($('#paletteCopy'),'已复制！'); });
$('#palette').addEventListener('click',e=>{ const s=e.target.closest('.swatch'); if(s){ navigator.clipboard&&navigator.clipboard.writeText(s.dataset.hex); flash(s,'已复制'); }});
function flash(el,txt){ if(!el)return; const o=el.textContent; el.textContent=txt; setTimeout(()=>{ if(el.classList.contains('swatch')){el.querySelector('.hex').textContent=(el.dataset.hex||'').toUpperCase();}else el.textContent=o; },900); }
$('#boardAddBtn').addEventListener('click',()=>{ const v=$('#boardInput').value.trim(); if(!v)return; const b=load(K.board,[]); b.unshift({id:uid(),txt:v,date:today()}); save(K.board,b); $('#boardInput').value=''; renderBoard(); markActive(); });
function renderBoard(){ const b=load(K.board,[]); $('#boardList').innerHTML=b.map(x=>`<div class="board-item"><span class="note-txt">${esc(x.txt)}</span><span class="note-date">${x.date.slice(5)}</span><button class="icon-btn" data-bdel="${x.id}">🗑</button></div>`).join('')||'<p class="muted">记下此刻的灵感吧</p>'; }
document.addEventListener('click',e=>{ const d=e.target.closest('[data-bdel]'); if(d){ save(K.board,load(K.board,[]).filter(x=>x.id!==d.dataset.bdel)); renderBoard(); }});

/* ============================================================
   阅读打卡
   ============================================================ */
function getBooks(){ return load(K.books,[]); }
function getReadLog(){ return load(K.readLog,[]); }
function readStreak(){ const set=new Set(getReadLog().map(r=>r.date)); let n=0,d=new Date(); while(set.has(d.toISOString().slice(0,10))){n++;d.setDate(d.getDate()-1);} return n; }
function renderReading(){
  const books=getBooks();
  $('#readStats').innerHTML=[
    statCard('📖',books.filter(b=>b.status==='reading').length,'在读','本','var(--c-read)'),
    statCard('✅',books.filter(b=>b.status==='done').length,'已读','本','var(--c-read)'),
    statCard('🔥',readStreak(),'连续阅读','天','var(--c-fit)'),
    statCard('⏱️',getReadLog().reduce((a,b)=>a+(+b.minutes||0),0),'累计分钟','','var(--c-aes)')
  ].join('');
  renderBookRecs();
  $('#bookList').innerHTML=books.map(b=>`
    <div class="book-item">
      <div class="book-spine" style="background:${b.status==='done'?'#1a9d52':'var(--c-read)'}"></div>
      <div class="book-info"><b>${esc(b.title)}</b><small>${esc(b.author||'佚名')}</small></div>
      <span class="book-status ${b.status==='done'?'st-done':'st-reading'}" data-bst="${b.id}">${b.status==='done'?'已读完':'在读'}</span>
      <button class="icon-btn" data-bdel="${b.id}">🗑</button>
    </div>`).join('')||'<p class="muted">书架空空如也，加一本书开始吧</p>';
  const set=new Set(getReadLog().map(r=>r.date));
  let dots=''; const d=new Date();
  for(let i=13;i>=0;i--){ const dd=new Date(d); dd.setDate(d.getDate()-i); const ds=dd.toISOString().slice(0,10); dots+=`<div class="cal-dot ${set.has(ds)?'on':''}">${dd.getDate()}</div>`; }
  $('#checkinBox').innerHTML=`<div class="ci-streak">🔥 ${readStreak()} 天</div><div class="ci-label">连续阅读打卡</div><div class="cal">${dots}</div>`;
  renderNotes();
}
function renderNotes(){ const n=load(K.notes,[]); $('#noteList').innerHTML=n.map(x=>`<div class="note-item"><span class="note-txt">${esc(x.txt)}</span><span class="note-date">${x.date.slice(5)}</span><button class="icon-btn" data-ndel="${x.id}">🗑</button></div>`).join('')||'<p class="muted">还没有笔记</p>'; }
$('#addBookBtn').addEventListener('click',()=>{ const t=$('#addBook').value.trim(),a=$('#addAuthor').value.trim(); if(!t)return; const b=getBooks(); b.push({id:uid(),title:t,author:a,status:'reading'}); save(K.books,b); $('#addBook').value='';$('#addAuthor').value=''; renderReading(); markActive(); });
$('#checkinBtn').addEventListener('click',()=>{ const m=parseInt($('#readMinutes').value)||0; const log=getReadLog(); const t=today(); const ex=log.find(r=>r.date===t); if(ex)ex.minutes+=m; else log.push({id:uid(),date:t,minutes:m}); save(K.readLog,log); $('#readMinutes').value=''; markActive(); renderReading(); renderStreak(); flash($('#checkinBtn'),'打卡成功！'); });
$('#noteAddBtn').addEventListener('click',()=>{ const v=$('#noteInput').value.trim(); if(!v)return; const n=load(K.notes,[]); n.unshift({id:uid(),txt:v,date:today()}); save(K.notes,n); $('#noteInput').value=''; renderNotes(); });
document.addEventListener('click',e=>{
  const s=e.target.closest('[data-bst]'); if(s){ const b=getBooks().map(x=>x.id===s.dataset.bst?{...x,status:x.status==='done'?'reading':'done'}:x); save(K.books,b); renderReading(); return; }
  const bd=e.target.closest('[data-bdel]'); if(bd){ save(K.books,getBooks().filter(x=>x.id!==bd.dataset.bdel)); renderReading(); return; }
  const nd=e.target.closest('[data-ndel]'); if(nd){ save(K.notes,load(K.notes,[]).filter(x=>x.id!==nd.dataset.ndel)); renderNotes(); }
});

/* ============================================================
   地理学习
   ============================================================ */
let contIdx=0, geoTipIdx=0;
function renderGeography(){
  /* 纪录片 - 不分cat，直接网格排列 */
  $('#geoDocs').innerHTML=GEO_DOCS.map(d=>`<div class="geo-doc-card">
    <div class="geo-doc-sc" style="background:${d.color}">⭐ ${d.score} · ${d.cat}</div>
    <div class="geo-doc-body">
      <b>${esc(d.title)}${d.en?` <small style="font-weight:400;color:var(--muted)">${esc(d.en)}</small>`:''}</b>
      <p class="geo-doc-meta">🎬 ${esc(d.eps)} · ⏱ ${esc(d.dur)}</p>
      <p class="geo-doc-desc">${esc(d.desc)}</p>
      <a class="geo-doc-link" href="https://search.bilibili.com/all?keyword=${encodeURIComponent(d.title)}" target="_blank" rel="noopener">📺 B站</a> <a class="geo-doc-link" href="${xhsUrl(d.title)}" target="_blank" rel="noopener">📕 小红书</a>
    </div>
  </div>`).join('');
  /* 探索大洲 */
  renderContinent();
  /* 每日地理 */
  $('#geoTip').innerHTML=`<div class="geo-tip-box">
    <b>${GEO_TIPS[geoTipIdx][0]}</b>
    <p>${GEO_TIPS[geoTipIdx][1]}</p>
    <div class="geo-tip-actions"><span>${geoTipIdx+1} / ${GEO_TIPS.length}</span><button id="geoNextTip">下一条 →</button></div>
    <a class="gt-learn" href="${biliUrl(GEO_TIPS[geoTipIdx][0]+' 地理纪录片')}" target="_blank" rel="noopener">📺 B站纪录片</a> <a class="gt-learn" href="${xhsUrl(GEO_TIPS[geoTipIdx][0]+' 地理科普')}" target="_blank" rel="noopener">📕 小红书科普</a>
  </div>`;
}
function renderContinent(){
  const c=CONTINENTS[contIdx];
  $('#contCards').innerHTML=CONTINENTS.map((co,i)=>`<button class="cont-card ${i===contIdx?'active':''}" data-cidx="${i}" style="border-color:${i===contIdx?co.color:'var(--border)'}">
    <div class="cont-card-ic" style="background:${co.color}">${co.en.slice(0,2).toUpperCase()}</div>
    <div class="cont-card-name">${co.name}</div>
  </button>`).join('');
  $('#contDetail').innerHTML=`
    <div class="cont-detail-card">
      <div class="cont-detail-hd" style="background:${c.color}"><b>${c.name} · ${c.en}</b></div>
      <div class="cont-detail-body">
        <div class="cont-stat"><span>面积</span><b>${c.area}</b></div>
        <div class="cont-stat"><span>人口</span><b>${c.pop}</b></div>
        <div class="cont-stat"><span>最高点</span><b>${c.highest}</b></div>
        <p class="cont-fact">📌 ${c.fact}</p>
        <a class="card-deep-link" href="${biliUrl(c.name+' 航拍 纪录片')}" target="_blank" rel="noopener">🎬 搜「${c.name}」纪录片</small></a> <a class="card-deep-link" href="${xhsUrl(c.name+' 旅行攻略')}" target="_blank" rel="noopener">📕 小红书攻略 <small>→</small></a>
      </div>
    </div>`;
}
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-cidx]'); if(c){ contIdx=parseInt(c.dataset.cidx); renderContinent(); return; }
  const n=e.target.closest('#geoNextTip'); if(n){ geoTipIdx=(geoTipIdx+1)%GEO_TIPS.length; renderGeography(); }
});

/* ============================================================
   美学：服装搭配 & 生活美学
   ============================================================ */
function renderFashion(){
  $('#fashionGrid').innerHTML=FASHIONS.map(f=>`<a class="clickable-card fashion-card" href="${biliUrl(f.title+' 穿搭教程')}" target="_blank" rel="noopener" title="📺 在B站学「${f.title}」">
      <div class="fashion-card-hd" style="background:${f.color}"><span>${f.icon}</span>${f.title}</div>
      <div class="fashion-card-body">
        <p>${f.desc}</p>
        ${f.palette.length?`<div class="fashion-palette">${f.palette.map(c=>`<div class="fashion-swatch" style="background:${c}" title="${c}"></div>`).join('')}</div>`:''}
        ${f.tip?`<div class="fashion-tip">💡 ${f.tip}</div>`:''}
      </div>
    </a><a class="clickable-card fashion-card" href="${xhsUrl(f.title+' 穿搭')}" target="_blank" rel="noopener" title="📕 在小红书搜「${f.title}」">
      <div class="fashion-card-hd" style="background:#ff2442"><span>📕</span>${f.title}</div>
      <div class="fashion-card-body"><p>在小红书发现更多「${f.title}」穿搭灵感和实拍</p></div>
    </a>`).join('');
}

function renderLifeAes(){
  $('#lifeAesGrid').innerHTML=LIFE_AES.map(a=>`<a class="clickable-card life-aes-card" href="${biliUrl(a.title+' 入门教程')}" target="_blank" rel="noopener" title="📺 在B站学「${a.title}」">
    <span class="la-icon">${a.icon}</span>
    <span class="la-title">${a.title}</span>
    <span class="la-desc">${a.desc}</span>
    <span class="la-learn">📺 B站探索 →</span>
  </a><a class="clickable-card life-aes-card" href="${xhsUrl(a.title+' 入门')}" target="_blank" rel="noopener" title="📕 在小红书搜「${a.title}」">
    <span class="la-icon">📕</span>
    <span class="la-title">${a.title}</span>
    <span class="la-desc">小红书发现更多「${a.title}」灵感</span>
    <span class="la-learn">📕 小红书探索 →</span>
  </a>`).join('');
}

/* ============================================================
   阅读：推荐书单 & 搜索
   ============================================================ */
let bookCat='全部';
function renderBookRecs(){
  $('#bookCatFilters').innerHTML=BOOK_CATS.map(c=>`<button class="chip ${bookCat===c?'active':''}" data-bcat="${c}">${c}</button>`).join('');
  const list=bookCat==='全部'?BOOK_RECS:BOOK_RECS.filter(b=>b.cat===bookCat);
  $('#bookRecGrid').innerHTML=list.map(b=>`
    <div class="book-rec-card">
      <div class="book-rec-top">
        <div class="book-rec-cover" style="background:${b.color}">${b.cover}</div>
        <div class="book-rec-info">
          <b>${esc(b.title)}</b>
          <span class="br-author">${esc(b.author)}</span>
          <div class="br-tags">${b.tags.map(t=>`<span class="br-tag">${t}</span>`).join('')}</div>
        </div>
      </div>
      <div class="book-rec-body">
        <p class="br-desc">${esc(b.desc)}</p>
        <div class="br-links">
          <a class="br-link weread" href="${b.weread}" target="_blank" rel="noopener">📖 微信读书</a>
          <a class="br-link douban" href="${b.douban}" target="_blank" rel="noopener">⭐ 豆瓣</a>
          <a class="br-link bilibili" href="https://search.bilibili.com/all?keyword=${encodeURIComponent(b.title+' 解读')}" target="_blank" rel="noopener">📺 B站</a> <a class="br-link xhs" href="https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(b.title+' 书评')}" target="_blank" rel="noopener">📕 小红书</a>
        </div>
      </div>
    </div>`).join('');
}
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-bcat]'); if(c){ bookCat=c.dataset.bcat; renderBookRecs(); }
});

/* 搜书 */
$('#bookSearchBtn').addEventListener('click',doBookSearch);
$('#bookSearchInput').addEventListener('keydown',e=>{ if(e.key==='Enter') doBookSearch(); });
function doBookSearch(){
  const q=$('#bookSearchInput').value.trim(); if(!q)return;
  const kw=encodeURIComponent(q);
  $('#bookSearchResults').innerHTML=`
    <a class="bsr-item" href="https://weread.qq.com/" target="_blank" rel="noopener">
      <span style="font-size:24px">📖</span>
      <div class="bsr-info"><b>打开微信读书搜索「${esc(q)}」</b><small>微信读书首页可搜索全部书籍</small></div>
      <span style="font-size:18px">→</span>
    </a>
    <a class="bsr-item" href="https://book.douban.com/subject_search?search_text=${kw}" target="_blank" rel="noopener">
      <span style="font-size:24px">⭐</span>
      <div class="bsr-info"><b>在豆瓣读书中搜索「${esc(q)}」</b><small>查看评分、书评、读书笔记</small></div>
      <span style="font-size:18px">→</span>
    </a>
    <a class="bsr-item" href="https://search.bilibili.com/all?keyword=${kw}+书评" target="_blank" rel="noopener">
      <span style="font-size:24px">📺</span>
      <div class="bsr-info"><b>B站搜「${esc(q)}」书评</b><small>视频解读</small></div>
      <span style="font-size:18px">→</span>
    </a>
    <a class="bsr-item" href="https://www.xiaohongshu.com/search_result?keyword=${kw}" target="_blank" rel="noopener">
      <span style="font-size:24px">📕</span>
      <div class="bsr-info"><b>小红书搜「${esc(q)}」书评</b><small>图文读书笔记</small></div>
      <span style="font-size:18px">→</span>
    </a>
    <div style="margin-top:10px;font-size:12px;color:var(--muted);text-align:center">💡 点击以上链接可直接跳转到对应平台阅读或了解这本书</div>`;
}

/* ============================================================
   摄影学习
   ============================================================ */
function renderPhotography(){
  /* 基础知识 */
  $('#knowledgeGrid').innerHTML=PHOTO_KNOWLEDGE.map(k=>`
    <div class="know-card">
      <div class="know-card-hd" style="background:${k.color}"><span style="font-size:20px">${k.icon}</span>${k.title}</div>
      <div class="know-card-body"><ul>${k.content.map(c=>`<li>${c}</li>`).join('')}</ul></div>
      <div class="know-link"><a href="${biliUrl(k.title+' 摄影教程')}" target="_blank" rel="noopener">📺 B站看「${k.title}」→</a> <a href="${xhsUrl(k.title+' 摄影教程')}" target="_blank" rel="noopener">📕 小红书学「${k.title}」→</a></div>
    </div>`).join('');
}

/* 照片上传 */
$('#photoUpload').addEventListener('click',()=>$('#photoInput').click());
$('#photoInput').addEventListener('change',handlePhoto);
$('#photoRemove').addEventListener('click',()=>{
  $('#photoPreview').style.display='none'; $('#photoAnalysis').style.display='none';
  $('#photoInput').value=''; $('#photoUpload').style.display='';
});

function handlePhoto(){
  const file=$('#photoInput').files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    $('#photoUpload').style.display='none';
    $('#photoPreview').style.display='block';
    $('#photoImg').src=e.target.result;
    analyzePhoto(e.target.result);
  };
  reader.readAsDataURL(file);
}

function analyzePhoto(dataUrl){
  const img=new Image();
  img.onload=function(){
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
    const w=Math.min(img.width,800),h=Math.round(img.height*w/img.width);
    canvas.width=w; canvas.height=h; ctx.drawImage(img,0,0,w,h);

    /* 分析亮度 */
    const imageData=ctx.getImageData(0,0,w,h).data;
    let totalBrightness=0; const colorBuckets={};
    for(let i=0;i<imageData.length;i+=4){
      const r=imageData[i],g=imageData[i+1],b=imageData[i+2];
      totalBrightness+=0.299*r+0.587*g+0.114*b;
      const hue=Math.round(rgbToHue(r,g,b)/30)*30;
      colorBuckets[hue]=(colorBuckets[hue]||0)+1;
    }
    const pixelCount=imageData.length/4;
    const avgBrightness=Math.round(totalBrightness/pixelCount);

    /* 分析饱和度 */
    let totalSat=0;
    for(let i=0;i<imageData.length;i+=4){
      const maxC=Math.max(imageData[i],imageData[i+1],imageData[i+2]);
      const minC=Math.min(imageData[i],imageData[i+1],imageData[i+2]);
      totalSat+=maxC===0?0:((maxC-minC)/maxC)*100;
    }
    const avgSat=Math.round(totalSat/pixelCount);

    /* 分析对比度 */
    const blocks=[[],[],[],[],[],[],[],[],[]]; /* 3x3 grid */
    const bw3=Math.floor(w/3),bh3=Math.floor(h/3);
    for(let by=0;by<3;by++){
      for(let bx=0;bx<3;bx++){
        let sum=0,cnt=0;
        for(let py=by*bh3;py<(by+1)*bh3;py++){
          for(let px=bx*bw3;px<(bx+1)*bw3;px++){
            const idx=(py*w+px)*4;
            sum+=0.299*imageData[idx]+0.587*imageData[idx+1]+0.114*imageData[idx+2];
            cnt++;
          }
        }
        blocks[by*3+bx]=cnt?sum/cnt:0;
      }
    }
    const blockVals=blocks.filter(Boolean);
    const contrastScore=blockVals.length?Math.round((Math.max(...blockVals)-Math.min(...blockVals))/2.55)/10:0;

    /* 分析颜色丰富度 */
    const colorDiversity=Object.keys(colorBuckets).length;

    /* 计算综合评分 */
    const brightScore=avgBrightness>180?90:avgBrightness>120?80:avgBrightness>70?65:45;
    const satScore=avgSat>60?80:avgSat>30?85:70;
    const contrastRating=contrastScore>40?90:contrastScore>25?80:contrastScore>15?65:45;
    const compScore=Math.round((brightScore+satScore+contrastRating)/3);
    const totalScore=Math.round(compScore*0.6+Math.min(95,colorDiversity*2.5)*0.4);

    /* 评价 */
    const advice=[];
    if(avgBrightness<70) advice.push({icon:'💡',text:'曝光偏暗。建议：拍摄时点击屏幕最亮处对焦，然后向上滑动小太阳+0.3~0.7EV。如果已经拍了，后期用Lightroom/Snapseed提高曝光和阴影。'});
    if(avgBrightness>210) advice.push({icon:'💡',text:'画面偏亮/过曝。建议：降低曝光补偿-0.3~0.7EV，或避免正午强光下拍摄。后期可降低高光、提高对比度来补救。'});
    if(avgSat<15) advice.push({icon:'🎨',text:'色彩较平淡。建议：适当提高饱和度+10~15%，或尝试VSCO/醒图的胶片滤镜增加氛围感。注意不要过度——超过20%会显得不自然。'});
    if(contrastScore<15) advice.push({icon:'📐',text:'画面偏平淡，缺乏层次。建议：利用侧光拍摄创造明暗对比；构图上可加入前景物体增加纵深感；后期适当拉S曲线。'});
    if(colorDiversity<5) advice.push({icon:'🎨',text:'色彩较为单一。建议：画面中加入一个对比色点缀（如绿色风景中的红色元素），或利用黄金时刻的金色光线丰富色调。'});
    if(contrastScore>50) advice.push({icon:'👍',text:'明暗对比强烈，画面有张力。如果阴影部分细节丢失，可以用HDR模式或多张包围曝光合成。'});
    if(avgSat>55&&avgSat<75) advice.push({icon:'👍',text:'色彩饱和度适中，看起来很舒服。这个程度的饱和度最适合人像和日常拍摄。'});
    if(avgBrightness>=100&&avgBrightness<=180) advice.push({icon:'👍',text:'整体亮度适宜，曝光控制不错。继续保持对画面中最重要的区域的曝光优先。'});
    if(advice.length===0) advice.push({icon:'🌟',text:'这张照片的整体表现不错！建议下次拍摄时注意构图上应用三分法，把主体放在画面的黄金分割点上。'});

    /* 渲染分析结果 */
    $('#photoAnalysis').style.display='block';
    $('#analysisScore').innerHTML=`<div style="font-size:14px;font-weight:600;color:var(--muted)">综合评分</div>
      <div class="as-num" style="color:${totalScore>=80?'#10b981':totalScore>=60?'#f59e0b':'#ef4444'}">${totalScore}</div>
      <div class="as-label">${totalScore>=80?'出色':totalScore>=60?'良好':totalScore>=40?'一般':'需改进'}</div>`;

    $('#analysisGrid').innerHTML=`
      <div class="analysis-card">
        <div class="an-label">曝光 (${avgBrightness<70?'偏暗':avgBrightness>210?'偏亮':'适宜'})</div>
        <div class="an-value">${avgBrightness}<span style="font-size:13px;color:var(--muted)">/255</span></div>
        <div class="an-bar-bg"><div class="an-bar-fill" style="width:${avgBrightness/2.55}%;background:linear-gradient(90deg,#ef4444,#f59e0b,#10b981)"></div></div>
      </div>
      <div class="analysis-card">
        <div class="an-label">饱和度 (${avgSat<20?'低':avgSat>65?'高':'适中'})</div>
        <div class="an-value">${avgSat}<span style="font-size:13px;color:var(--muted)">%</span></div>
        <div class="an-bar-bg"><div class="an-bar-fill" style="width:${avgSat}%;background:linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)"></div></div>
      </div>
      <div class="analysis-card">
        <div class="an-label">对比度 (${contrastScore<20?'低':contrastScore>40?'高':'适中'})</div>
        <div class="an-value">${contrastScore.toFixed(1)}<span style="font-size:13px;color:var(--muted)">/10</span></div>
        <div class="an-bar-bg"><div class="an-bar-fill" style="width:${contrastScore*10}%;background:linear-gradient(90deg,#64748b,#f59e0b,#ef4444)"></div></div>
      </div>
      <div class="analysis-card">
        <div class="an-label">色彩丰富度</div>
        <div class="an-value">${colorDiversity}<span style="font-size:13px;color:var(--muted)">色调</span></div>
        <div class="an-bar-bg"><div class="an-bar-fill" style="width:${Math.min(100,colorDiversity*8.3)}%;background:linear-gradient(90deg,#06b6d4,#8b5cf6,#f59e0b,#ef4444)"></div></div>
      </div>`;

    $('#analysisAdvice').innerHTML=`<h3 style="margin-bottom:12px">💬 评价与建议</h3>
      ${advice.map(a=>`<div class="advice-item"><span class="ad-icon">${a.icon}</span><span>${a.text}</span></div>`).join('')}`;
  };
  img.src=dataUrl;
}

function rgbToHue(r,g,b){
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  if(max===min)return 0;
  let h;
  const d=max-min;
  if(max===r)h=((g-b)/d+(g<b?6:0));
  else if(max===g)h=((b-r)/d+2);
  else h=((r-g)/d+4);
  return Math.round(h*60)%360;
}

/* ============================================================
   B站学习
   ============================================================ */
let biliFilter='all', biliQ='';
function allBili(){ return BILI.concat(load(K.biliCustom,[]).map(x=>({...x,custom:true}))); }
function renderBilibili(){
  $('#biliFilters').innerHTML=['all','english','fitness','aesthetics','reading','geography','photography','xhs','meditation','divination','other'].map(c=>
    `<button class="chip ${biliFilter===c?'active':''}" data-bf="${c}">${c==='all'?'全部':CAT_META[c].label}</button>`).join('');
  let list=allBili().filter(x=>biliFilter==='all'||x.cat===biliFilter)
    .filter(x=>!biliQ||(x.title+x.channel+x.desc).toLowerCase().includes(biliQ.toLowerCase()));
  $('#biliCount').textContent=`共 ${list.length} 个资源`;
  const watched=new Set(load(K.biliWatched,[]));
  $('#biliGrid').innerHTML=list.map(x=>{
    const meta=CAT_META[x.cat]||CAT_META.other;
    return `<div class="bili-card ${watched.has(x.title)?'watched':''}">
      <div class="bili-top" style="background:linear-gradient(135deg,${meta.color},${shade(meta.color,-30)})">${meta.ic} ${meta.label}</div>
      <div class="bili-body">
        <b>${esc(x.title)}</b>
        <p>${esc(x.desc)}</p>
        <div class="bili-tags"><span class="bili-cat" style="background:${meta.color}1a;color:${meta.color}">${esc(x.channel)}</span>${x.custom?'<span class="bili-cat" style="background:#eef0ff;color:#6d5efc">自建</span>':''}</div>
        <div class="bili-actions">
          <a class="bili-link" href="${x.custom&&x.url?esc(x.url):biliUrl(x.channel)}" target="_blank" rel="noopener">▶ 去B站观看</a>
          <button class="icon-btn" data-biliwt="${esc(x.title)}">${watched.has(x.title)?'👁 已看':'○ 标记已看'}</button>
          ${x.custom?`<button class="icon-btn" data-bilirm="${esc(x.title)}" title="删除">🗑</button>`:''}
        </div>
      </div></div>`;
  }).join('')||'<p class="muted">没有匹配的资源</p>';
}
$('#biliSearch').addEventListener('input',e=>{ biliQ=e.target.value; renderBilibili(); });
$('#biliFilters')&&document.addEventListener('click',e=>{ const c=e.target.closest('[data-bf]'); if(c){ biliFilter=c.dataset.bf; renderBilibili(); }});
document.addEventListener('click',e=>{
  const w=e.target.closest('[data-biliwt]'); if(w){ const s=new Set(load(K.biliWatched,[])); const t=w.dataset.biliwt; s.has(t)?s.delete(t):s.add(t); save(K.biliWatched,[...s]); renderBilibili(); return; }
  const r=e.target.closest('[data-bilirm]'); if(r){ save(K.biliCustom,load(K.biliCustom,[]).filter(x=>x.title!==r.dataset.bilirm)); renderBilibili(); }
});
$('#biliAddBtn').addEventListener('click',()=>{
  const t=$('#biliAddTitle').value.trim(),c=$('#biliAddCat').value,u=$('#biliAddUrl').value.trim();
  if(!t)return; const list=load(K.biliCustom,[]); list.push({title:t,channel:t,cat:c,url:u,desc:'我自己添加的学习资源。',custom:true});
  save(K.biliCustom,list); $('#biliAddTitle').value='';$('#biliAddUrl').value=''; renderBilibili();
});

/* ============================================================
   小红书
   ============================================================ */
let xhsCat='全部';
function renderXHS(){
  /* 分类筛选 */
  $('#xhsCatFilters').innerHTML=XHS_CATEGORIES.map(c=>`<button class="chip ${xhsCat===c?'active':''}" data-xhscat="${c}">${c}</button>`).join('');
  /* 博主列表 */
  const bloggers=xhsCat==='全部'?XHS_BLOGGERS:XHS_BLOGGERS.filter(b=>{
    const m={'英语':'英语','健身':'健身','美学':'美学','阅读':'阅读','摄影':'摄影','地理':'地理','冥想':'冥想','玄学':'玄学'};
    return m[xhsCat]===b.cat;
  });
  $('#xhsBloggerGrid').innerHTML=bloggers.map(b=>`<div class="xhs-blogger-card">
    <div class="xhs-blogger-hd" style="background:linear-gradient(135deg,${b.cat==='英语'?'#3b82f6':b.cat==='健身'?'#ef4444':b.cat==='美学'?'#a855f7':b.cat==='阅读'?'#f59e0b':b.cat==='摄影'?'#d946ef':b.cat==='地理'?'#0ea5a9':b.cat==='冥想'?'#06b6d4':'#8b5cf6'},${b.cat==='英语'?'#1d4ed8':b.cat==='健身'?'#dc2626':b.cat==='美学'?'#7c3aed':b.cat==='阅读'?'#d97706':b.cat==='摄影'?'#c026d3':b.cat==='地理'?'#0e7490':b.cat==='冥想'?'#0891b2':'#6d28d9'})">
      <span style="font-size:24px">${b.cat==='英语'?'🔤':b.cat==='健身'?'💪':b.cat==='美学'?'🎨':b.cat==='阅读'?'📚':b.cat==='摄影'?'📷':b.cat==='地理'?'🌍':b.cat==='冥想'?'🧘':'🔮'}</span>
      <span class="xhs-blogger-cat">${b.cat}</span>
    </div>
    <div class="xhs-blogger-body">
      <b>${esc(b.name)}</b>
      <p>${esc(b.desc)}</p>
      <a class="xhs-blogger-link" href="${b.link}" target="_blank" rel="noopener">📱 去小红书查看 →</a>
    </div>
  </div>`).join('')||'<p class="muted">该分类下暂无推荐博主</p>';
  /* 热门话题 */
  $('#xhsTrending').innerHTML=XHS_TRENDING.map(t=>{
    const catMeta=CAT_META[(xhsCat==='英语'?'english':xhsCat==='健身'?'fitness':xhsCat==='美学'?'aesthetics':xhsCat==='阅读'?'reading':CAT_META[xhsCat]?xhsCat:'other')]||CAT_META.other;
    return `<a class="xhs-trend-item" href="https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(t)}" target="_blank" rel="noopener">
      <span class="xhs-trend-icon">🔥</span>
      <span class="xhs-trend-txt">${t}</span>
      <span class="xhs-trend-arrow">→</span>
    </a>`;
  }).join('');
}
/* 小红书搜索 */
$('#xhsSearchBtn').addEventListener('click',doXHSSearch);
$('#xhsSearchInput').addEventListener('keydown',e=>{ if(e.key==='Enter') doXHSSearch(); });
function doXHSSearch(){
  const q=$('#xhsSearchInput').value.trim(); if(!q)return;
  const kw=encodeURIComponent(q);
  $('#xhsSearchResults').innerHTML=`
    <a class="bsr-item" href="https://www.xiaohongshu.com/search_result?keyword=${kw}" target="_blank" rel="noopener">
      <span style="font-size:24px">📕</span>
      <div class="bsr-info"><b>在小红书搜索「${esc(q)}」</b><small>查看笔记、图文、视频内容</small></div>
      <span style="font-size:18px">→</span>
    </a>
    <a class="bsr-item" href="https://www.xiaohongshu.com/search_result?keyword=${kw}&type=video" target="_blank" rel="noopener">
      <span style="font-size:24px">🎬</span>
      <div class="bsr-info"><b>在小红书搜索「${esc(q)}」视频</b><small>只看视频教程内容</small></div>
      <span style="font-size:18px">→</span>
    </a>
    <div style="margin-top:10px;font-size:12px;color:var(--muted);text-align:center">💡 点击以上链接可直接在小红书网页版搜索查看</div>`;
}
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-xhscat]'); if(c){ xhsCat=c.dataset.xhscat; renderXHS(); }
});

/* ============================================================
   冥想
   ============================================================ */
let breathTimer=null, breathRunning=false, breathPhase=0, breathSec=0, totalBreathMin=3;
const BREATH_PATTERNS={
  box:{name:'盒式呼吸',phases:[{label:'吸气',dur:4},{label:'屏息',dur:4},{label:'呼气',dur:4},{label:'屏息',dur:4}],desc:'吸气4秒→屏息4秒→呼气4秒→屏息4秒：平衡自律神经'},
  '478':{name:'4-7-8放松',phases:[{label:'吸气',dur:4},{label:'屏息',dur:7},{label:'呼气',dur:8}],desc:'吸4秒→屏7秒→呼8秒：快速入睡秘方'},
  simple:{name:'腹式呼吸',phases:[{label:'吸气',dur:4},{label:'呼气',dur:6}],desc:'吸4秒→呼6秒：最简单的深呼吸练习'},
  calm:{name:'平静呼吸',phases:[{label:'吸气',dur:5},{label:'呼气',dur:5}],desc:'吸5秒→呼5秒：平静身心'}
};
function renderMeditation(){
  /* 冥想练习指引 */
  $('#meditationGrid').innerHTML=MEDITATIONS.map(m=>`
    <div class="med-card" style="border-left:4px solid ${m.color}">
      <div class="med-card-icon" style="background:${m.color}1a">${m.icon}</div>
      <div class="med-card-body">
        <div class="med-card-hd">
          <b>${m.title}</b>
          <span class="med-badge" style="background:${m.color};color:#fff">${m.level}</span>
          <span class="med-dur">⏱ ${m.dur}</span>
        </div>
        <p>${m.desc}</p>
        <a class="med-learn-link" href="${biliUrl(m.title+' 冥想引导')}" target="_blank" rel="noopener">🎧 B站引导 →</a> <a class="med-learn-link" href="${xhsUrl(m.title+' 冥想')}" target="_blank" rel="noopener">📕 小红书 →</a>
      </div>
    </div>`).join('');
  /* 环境建议 */
  $('#meditationTips').innerHTML=MEDITATION_TIPS.map((t,i)=>`
    <div class="med-tip-card">
      <span class="med-tip-num">0${i+1}</span>
      <div>
        <b>${t.title}</b>
        <p>${t.desc}</p>
      </div>
    </div>`).join('');
}
/* 呼吸定时器 */
let elapsedSecRef=0;
function startBreath(){
  const pattern=$('#breathPattern').value;
  totalBreathMin=parseInt($('#breathMinutes').value)||3;
  elapsedSecRef=totalBreathMin*60;
  const bp=BREATH_PATTERNS[pattern];
  breathRunning=true; breathPhase=0; breathSec=0;
  $('#breathStartBtn').style.display='none'; $('#breathStopBtn').style.display='';
  $('#breathPattern').disabled=true; $('#breathMinutes').disabled=true;
  $('#breathCounter').textContent=formatTime(elapsedSecRef);
  updateBreathCircle('准备',1,'inhale');
  runBreathCycle(bp);
}
function runBreathCycle(bp){
  if(!breathRunning) return;
  const phase=bp.phases[breathPhase];
  $('#breathText').textContent=phase.label;
  $('#breathCounter').textContent=formatTime(elapsedSecRef);
  const isInhale=phase.label.includes('吸');
  const isExhale=phase.label.includes('呼');
  updateBreathCircle(phase.label,phase.dur-breathSec,isInhale?'inhale':isExhale?'exhale':'hold');
  breathSec++;
  if(breathSec>=phase.dur){ breathSec=0; breathPhase=(breathPhase+1)%bp.phases.length; }
  breathTimer=setTimeout(()=>{
    elapsedSecRef--;
    if(!breathRunning) return;
    if(elapsedSecRef<=0){ stopBreath(); return; }
    runBreathCycle(bp);
  },1000);
}
function stopBreath(){
  breathRunning=false; clearTimeout(breathTimer);
  $('#breathStartBtn').style.display=''; $('#breathStopBtn').style.display='none';
  $('#breathPattern').disabled=false; $('#breathMinutes').disabled=false;
  updateBreathCircle('完成',1,'done');
  $('#breathCounter').textContent='00:00';
  markActive();
}
function updateBreathCircle(label,scale,type){
  const s=type==='inhale'?1.3:type==='exhale'?0.7:1;
  const bg=type==='inhale'?'#d1fae5':type==='exhale'?'#e0f2fe':type==='done'?'#ecfdf5':'#fef3c7';
  const bc=type==='done'?'#10b981':type==='inhale'?'#10b981':'#06b6d4';
  $('#breathCircle').style.transform=`scale(${s})`;
  $('#breathCircle').style.background=bg;
  $('#breathCircle').style.borderColor=bc;
}
function formatTime(s){ const m=Math.floor(s/60),sec=s%60; return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }
/* 删除重复的 startBreath 定义 - 我用一个统一版本 */
$('#breathStartBtn').addEventListener('click',startBreath);
$('#breathStopBtn').addEventListener('click',stopBreath);

/* ============================================================
   玄学占卜
   ============================================================ */
let selectedTarot=-1;
function renderDivination(){
  /* 塔罗牌 */
  $('#tarotGrid').innerHTML=TAROT_CARDS.map((c,i)=>`
    <div class="tarot-card ${selectedTarot===i?'selected':''}" data-tarot="${i}" style="--tcolor:${c.color}">
      <div class="tarot-card-inner">
        <span class="tarot-num">${c.num}</span>
        <span class="tarot-icon">${c.icon}</span>
        <span class="tarot-name">${c.name}</span>
        <span class="tarot-en">${c.en}</span>
      </div>
    </div>`).join('');
  if(selectedTarot>=0) showTarotDetail(selectedTarot);
  /* 小六壬 */
  $('#xlrGrid').innerHTML=XLR_POSITIONS.map(x=>`
    <div class="xlr-card" style="border-left:4px solid ${x.color}">
      <div class="xlr-hd">
        <span class="xlr-symbol">${x.symbol}</span>
        <b>${x.name}</b>
        <span class="xlr-index">${x.index}</span>
      </div>
      <p class="xlr-meaning">${x.meaning}</p>
      <p class="xlr-interpret">${x.interpret}</p>
      <a class="xlr-learn" href="${biliUrl('小六壬 '+x.name)}" target="_blank" rel="noopener">📺 B站学「${x.name}」→</a> <a class="xlr-learn" href="${xhsUrl('小六壬 '+x.name)}" target="_blank" rel="noopener">📕 小红书「${x.name}」→</a>
    </div>`).join('');
  /* 入门指南 */
  $('#divinationGuide').innerHTML=DIVINATION_GUIDE.map(g=>`<div class="dg-card">
    <div class="dg-icon">${g.icon}</div>
    <div class="dg-body">
      <b>${g.title}</b>
      <p>${g.desc}</p>
      <a class="dg-link" href="${g.link}" target="_blank" rel="noopener">🎬 B站教程 →</a>
      <a class="dg-link xhs-link" href="${g.xhs}" target="_blank" rel="noopener">📕 小红书搜「${g.title}」→</a>
    </div>
  </div>`).join('');
}
function showTarotDetail(i){
  const c=TAROT_CARDS[i];
  $('#tarotDetail').style.display='block';
  $('#tarotDetail').innerHTML=`<div class="tarot-detail-card" style="border-left:5px solid ${c.color}">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
      <span style="font-size:40px">${c.icon}</span>
      <div>
        <b style="font-size:17px;display:block">${c.num}. ${c.name} <small style="color:var(--muted);font-weight:400">${c.en}</small></b>
        <span style="font-size:12px;color:var(--muted)">元素：${c.element} · 关键词：${c.keyword}</span>
      </div>
      <button class="icon-btn" id="tarotClose" style="margin-left:auto" title="关闭">✕</button>
    </div>
    <div class="tarot-meaning-columns">
      <div class="tarot-col upright">
        <span class="tarot-pos-tag">▲ 正位</span>
        <p>${c.upright}</p>
      </div>
      <div class="tarot-col reversed">
        <span class="tarot-pos-tag">▼ 逆位</span>
        <p>${c.reversed}</p>
      </div>
    </div>
    <a class="card-deep-link" href="${biliUrl('塔罗牌 '+c.name)}" target="_blank" rel="noopener" style="margin-top:10px">📺 B站学「${c.name}」<small>→</small></a> <a class="card-deep-link" href="${xhsUrl('塔罗牌 '+c.name)}" target="_blank" rel="noopener" style="margin-top:10px">📕 小红书 <small>→</small></a>
  </div>`;
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-tarot]'); if(t){ selectedTarot=parseInt(t.dataset.tarot); renderDivination(); return; }
  const tc=e.target.closest('#tarotClose'); if(tc){ selectedTarot=-1; renderDivination(); }
});
/* 每日一占 */
$('#dailyDrawBtn').addEventListener('click',()=>{
  const rnd=Math.floor(Math.random()*TAROT_CARDS.length);
  const c=TAROT_CARDS[rnd];
  const isUpright=Math.random()>0.5;
  $('#dailyDrawResult').innerHTML=`<div class="daily-draw-card" style="text-align:center;padding:20px">
    <span style="font-size:48px;display:block;margin-bottom:10px">${c.icon}</span>
    <b style="font-size:18px;display:block;color:${c.color}">${c.num}. ${c.name} ${isUpright?'正位':'逆位'}</b>
    <span style="font-size:13px;color:var(--muted);display:block;margin:6px 0">${c.en} · ${c.keyword}</span>
    <div style="background:${isUpright?'#ecfdf5':'#fef2f2'};padding:14px;border-radius:10px;margin-top:12px;font-size:14px;line-height:1.6">
      <b>${isUpright?'▲ 正位解读':'▼ 逆位解读'}</b>
      <p style="margin-top:6px">${isUpright?c.upright:c.reversed}</p>
    </div>
    <a class="card-deep-link" href="${biliUrl('塔罗 '+c.name+' '+c.en)}" target="_blank" rel="noopener" style="margin-top:10px;display:inline-flex">📺 B站学这张牌 →</a> <a class="card-deep-link" href="${xhsUrl('塔罗 '+c.name+' '+c.en)}" target="_blank" rel="noopener" style="margin-top:10px;display:inline-flex">📕 小红书看这张牌 →</a>
  </div>`;
  markActive();
});

/* ============================================================
   初始化
   ============================================================ */
function init(){
  /* PWA 注册 + 安装引导 */
  let deferredPrompt=null;
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferredPrompt=e;
    const banner=$('#installBanner'); if(banner)banner.style.display='block';
  });
  const ib=$('#installBtn'); if(ib) ib.addEventListener('click',async()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    const {outcome}=await deferredPrompt.userChoice;
    if(outcome==='accepted'){ const b=$('#installBanner'); if(b)b.style.display='none'; }
    deferredPrompt=null;
  });
  const id=$('#installDismiss'); if(id) id.addEventListener('click',()=>{
    const b=$('#installBanner'); if(b)b.style.display='none';
  });
  if(window.matchMedia('(display-mode: standalone)').matches){
    const b=$('#installBanner'); if(b)b.style.display='none';
  }
  /* iOS Safari 安装引导（beforeinstallprompt 不支持） */
  const isIOS=/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())&&!window.MSStream;
  const isStandalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone;
  if(isIOS&&!isStandalone){
    const b=$('#installBanner'); if(b){ b.style.display='block'; b.querySelector('span').textContent='📲 点击 Safari 分享按钮 → 「添加到主屏幕」'; }
    const ib=$('#installBtn'); if(ib)ib.style.display='none';
  }
  /* 恢复身体档案到表单 */
  const bp=getBodyProfile();
  if(bp){
    $('#bodyHeight').value=bp.height||'';
    $('#bodyWeight').value=bp.weight||'';
    $('#bodyTarget').value=bp.target||'';
    if(bp.goal) $('#bodyGoal').value=bp.goal;
  }
  /* PWA 模式下强制外部链接跳出到系统浏览器 */
  const isPWA=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone;
  if(isPWA){
    document.addEventListener('click',e=>{
      const a=e.target.closest('a'); if(!a) return;
      const href=a.getAttribute('href')||'';
      /* 只处理站外 http/https 链接 */
      if(!href||href.startsWith('#')||href.startsWith('javascript:')) return;
      if(href.includes(location.hostname)) return;
      e.preventDefault();
      /* 用 location.href 代替 window.open — 不会被弹窗拦截器阻止 */
      location.href=href;
    });
  }
  $('#viewDate').textContent=fmtDate();
  renderStreak();
  switchView('dashboard');
}
init();
