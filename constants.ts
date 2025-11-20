
import { PresetStyle, AspectRatio } from './types';

export const ASPECT_RATIOS: { value: AspectRatio; label: string; width: number; height: number }[] = [
  { value: '1:1', label: '正方形 (1:1)', width: 1024, height: 1024 },
  { value: '3:4', label: '电商竖图 (3:4)', width: 960, height: 1280 },
  { value: '9:16', label: '手机全屏 (9:16)', width: 720, height: 1280 },
  { value: '4:3', label: '常规横图 (4:3)', width: 1280, height: 960 },
  { value: '16:9', label: '宽屏海报 (16:9)', width: 1280, height: 720 },
  { value: 'custom', label: '自定义尺寸', width: 1024, height: 1024 },
];

export const MATTING_PROMPT = "Professional product photography, pure white background, no shadows, clean cutout style, isolated subject, studio lighting.";
export const REMOVE_PROMPT = "【任务：智能消除】请移除画面中被红色遮罩覆盖的物体。根据周围的背景纹理、光影和透视关系，自动填充被移除的区域。保持背景的一致性和自然感，不要添加任何新物体，严禁改变遮罩区域以外的任何像素。";

export const HD_SUFFIX = ", 8k resolution, hyper-detailed, photorealistic, sharp focus, professional photography, masterpiece, commercial ad level, ray tracing, top-tier CGI render, Hasselblad X2D 100C.";

// Updated Logic: Stronger instruction to ignore reference composition and follow input aspect ratio
export const REF_IMAGE_PROMPT_PREFIX = `
【Task: Adaptive Style Transfer & Scene Generation】
1. Inputs Analysis:
   - Image 1 (Base): The [Main Product] positioned on a canvas. **This canvas defines the OUTPUT ASPECT RATIO.**
   - Image 2 (Reference): The [Style Source]. Use this ONLY for lighting, color palette, mood, and texture.
2. Goal:
   - Create a NEW scene for the [Main Product] that mimics the *vibe* of the [Style Source].
   - **CRITICAL**: Do NOT copy the composition or aspect ratio of the Reference Image exactly.
   - **CRITICAL**: Extend or crop the background to perfectly fit the aspect ratio of Image 1.
   - If the Reference is horizontal but Output is vertical, generate more sky/ground naturally.
   - Analyze the product's perspective and blend it realistically into this new, similar environment.
`;

export const AUTO_DETAIL_ENHANCEMENT = ", commercial advertising photography, delicate product texture, natural lighting transitions, clean and premium look, flawless, cinematic lighting.";

export const TRANSPARENT_MATERIAL_PROMPT = ", the subject is transparent or semi-transparent material (glass, water, acrylic, perfume bottle), focus on light penetration, refraction, physical caustics, crystal clear premium texture, liquid translucency.";

// Helper to create standard style objects
const createStyle = (id: string, name: string, cat: string, prompts: string[], color: string): PresetStyle => ({
  id, name, category: cat, prompts, color
});

export const SAMPLE_PROMPTS: PresetStyle[] = [
  // ============================================================
  // 1. 模特穿戴 (Model & Wearable) - 40 styles [NEW & REPLACED ART]
  // ============================================================
  // 头戴 (Head)
  createStyle('mod-hat-cap', '模特·棒球帽佩戴', '模特穿戴', ['时尚模特佩戴{product}棒球帽，侧脸特写，街头潮流背景，自然光。'], 'bg-stone-100 text-stone-800'),
  createStyle('mod-hat-beanie', '模特·冷帽佩戴', '模特穿戴', ['模特佩戴{product}针织冷帽，冬季雪景背景，温暖氛围，面部特写。'], 'bg-blue-50 text-blue-800'),
  createStyle('mod-headphone', '模特·头戴耳机', '模特穿戴', ['模特头戴{product}耳机，闭眼享受音乐，侧逆光，现代简约背景。'], 'bg-gray-100 text-gray-800'),
  createStyle('mod-hair-acc', '模特·发饰发夹', '模特穿戴', ['模特佩戴{product}发夹，背面或侧面发型展示，柔顺发丝，温柔光线。'], 'bg-pink-50 text-pink-700'),
  
  // 面部 (Face)
  createStyle('mod-glasses-sun', '模特·墨镜酷飒', '模特穿戴', ['模特佩戴{product}墨镜，酷飒表情，城市建筑反光，时尚大片感。'], 'bg-neutral-800 text-neutral-100'),
  createStyle('mod-glasses-opt', '模特·近视眼镜', '模特穿戴', ['模特佩戴{product}光学眼镜，知性职场风，办公室背景，清晰透亮。'], 'bg-slate-100 text-slate-700'),
  createStyle('mod-face-mask', '模特·美妆面膜', '模特穿戴', ['模特脸部敷着{product}面膜，水润肌肤质感，白色纯净背景，特写。'], 'bg-teal-50 text-teal-700'),
  
  // 耳部 (Ears)
  createStyle('mod-ear-stud', '模特·耳钉特写', '模特穿戴', ['模特佩戴{product}耳钉，耳部极致特写，皮肤纹理清晰，珠宝光泽。'], 'bg-yellow-50 text-yellow-800'),
  createStyle('mod-ear-hoop', '模特·大耳环', '模特穿戴', ['模特佩戴{product}大耳环，回眸一笑，长发飘动，晚宴氛围。'], 'bg-purple-50 text-purple-800'),
  
  // 颈部 (Neck)
  createStyle('mod-neck-pendant', '模特·项链吊坠', '模特穿戴', ['模特佩戴{product}项链，锁骨特写，黑色丝绒衣服衬托，高贵典雅。'], 'bg-rose-50 text-rose-800'),
  createStyle('mod-neck-choker', '模特·项圈Choker', '模特穿戴', ['模特佩戴{product}项圈，朋克或复古风，颈部特写，冷调光。'], 'bg-gray-800 text-gray-100'),
  createStyle('mod-scarf', '模特·围巾穿搭', '模特穿戴', ['模特围着{product}围巾，秋季落叶背景，温暖舒适，半身像。'], 'bg-orange-50 text-orange-800'),
  
  // 手部/手腕 (Hands/Wrist)
  createStyle('mod-watch-biz', '模特·商务腕表', '模特穿戴', ['男模佩戴{product}手表，整理袖口，西装革履，商务精英范。'], 'bg-slate-200 text-slate-800'),
  createStyle('mod-watch-sport', '模特·运动手表', '模特穿戴', ['模特佩戴{product}运动手表，正在跑步或健身，汗水，动态模糊背景。'], 'bg-lime-50 text-lime-800'),
  createStyle('mod-ring-couple', '模特·对戒情侣', '模特穿戴', ['情侣手牵手展示{product}戒指，温馨浪漫光影，虚化背景。'], 'bg-red-50 text-red-700'),
  createStyle('mod-ring-dia', '模特·钻戒求婚', '模特穿戴', ['模特手上佩戴{product}钻戒，手部特写，鲜花背景，璀璨火彩。'], 'bg-indigo-50 text-indigo-800'),
  createStyle('mod-bracelet', '模特·手链手镯', '模特穿戴', ['模特手腕佩戴{product}手链，纤细手腕，丝绸背景，柔美风格。'], 'bg-amber-50 text-amber-800'),
  createStyle('mod-nail', '模特·美甲展示', '模特穿戴', ['模特展示{product}美甲/穿戴甲，手部姿势优雅，同色系道具背景。'], 'bg-fuchsia-50 text-fuchsia-800'),

  // 手持展示 (Hand Held)
  createStyle('mod-hold-cos', '模特·手持化妆品', '模特穿戴', ['模特手持{product}化妆品靠近脸部，精致妆容，商业美妆摄影。'], 'bg-pink-100 text-pink-800'),
  createStyle('mod-hold-phone', '模特·手持手机', '模特穿戴', ['模特手持{product}手机，自拍或操作姿态，屏幕发光，科技生活。'], 'bg-blue-100 text-blue-800'),
  createStyle('mod-hold-drink', '模特·手持饮料', '模特穿戴', ['模特手持{product}饮料，吸管饮用动作，夏日阳光，清爽笑容。'], 'bg-yellow-100 text-yellow-800'),
  createStyle('mod-hold-generic', '模特·双手捧托', '模特穿戴', ['模特双手捧着{product}，视若珍宝，柔光，纯净背景，突出产品。'], 'bg-stone-100 text-stone-700'),
  createStyle('mod-finger-pinch', '模特·手指捏持', '模特穿戴', ['模特手指捏着{product}（小物品），极简背景，指尖特写，细节展示。'], 'bg-gray-50 text-gray-600'),

  // 身体/衣物 (Body/Clothing)
  createStyle('mod-tshirt', '模特·T恤上身', '模特穿戴', ['模特穿着{product}T恤，街头随性站姿，纯色墙背景，自然褶皱质感。'], 'bg-white text-gray-800 border-gray-200'),
  createStyle('mod-hoodie', '模特·卫衣穿搭', '模特穿戴', ['模特穿着{product}卫衣，戴上帽子，嘻哈风格，夜景霓虹背景。'], 'bg-violet-100 text-violet-800'),
  createStyle('mod-dress', '模特·连衣裙', '模特穿戴', ['模特穿着{product}连衣裙，旋转裙摆飞扬，花园或宴会厅背景。'], 'bg-rose-100 text-rose-800'),
  createStyle('mod-suit', '模特·西装定制', '模特穿戴', ['模特穿着{product}西装，系扣动作，高级灰背景，裁缝质感。'], 'bg-slate-300 text-slate-900'),
  createStyle('mod-yoga', '模特·瑜伽服', '模特穿戴', ['模特穿着{product}瑜伽服，做瑜伽体式，晨光，木质地板，健康曲线。'], 'bg-emerald-50 text-emerald-700'),

  // 箱包 (Bags)
  createStyle('mod-bag-hand', '模特·手提包', '模特穿戴', ['模特挽着{product}手提包，漫步街头，优雅职场女性风格，抓拍感。'], 'bg-orange-100 text-orange-800'),
  createStyle('mod-bag-shoulder', '模特·单肩背包', '模特穿戴', ['模特背着{product}单肩包，侧身回眸，学院风或休闲风。'], 'bg-sky-50 text-sky-700'),
  createStyle('mod-bag-cross', '模特·斜挎包', '模特穿戴', ['模特背着{product}斜挎包，骑行或行走，活力动态。'], 'bg-green-50 text-green-700'),
  createStyle('mod-bag-clutch', '模特·手拿包', '模特穿戴', ['模特拿着{product}手拿包，晚礼服搭配，聚光灯，派对焦点。'], 'bg-red-100 text-red-800'),
  
  // 鞋履 (Shoes)
  createStyle('mod-shoe-run', '模特·运动鞋跑动', '模特穿戴', ['模特穿着{product}运动鞋，奔跑瞬间，脚部特写，路面纹理，动态模糊。'], 'bg-cyan-50 text-cyan-800'),
  createStyle('mod-shoe-high', '模特·高跟鞋', '模特穿戴', ['模特穿着{product}高跟鞋，腿部线条，红毯或大理石地面，性感优雅。'], 'bg-fuchsia-100 text-fuchsia-800'),
  createStyle('mod-shoe-street', '模特·潮鞋街拍', '模特穿戴', ['模特穿着{product}潮鞋，坐在台阶上，裤脚堆叠，街头潮流Vibe。'], 'bg-zinc-100 text-zinc-800'),

  // 全身 (Full Body)
  createStyle('mod-full-studio', '模特·影棚全身', '模特穿戴', ['模特全身展示{product}，专业影棚无缝背景，时尚杂志Pose，硬光。'], 'bg-gray-100 text-gray-900'),
  createStyle('mod-full-street', '模特·街拍全身', '模特穿戴', ['模特全身展示{product}，斑马线行走，自然抓拍，城市生活感。'], 'bg-stone-200 text-stone-800'),
  createStyle('mod-full-nature', '模特·户外全身', '模特穿戴', ['模特全身展示{product}，置身大自然草地或海边，风吹发丝，自由感。'], 'bg-green-100 text-green-800'),

  // ============================================================
  // 2. 节日庆典 (Festivals & Celebrations) - 35 styles
  // ============================================================
  createStyle('fest-d11-cyber', '双11·赛博狂欢', '节日庆典', ['双11狂欢，{product}悬浮在红蓝霓虹空间，立体“11.11”字样，漂浮礼盒，强视觉冲击，C4D风格。'], 'bg-red-600 text-white border-red-700'),
  createStyle('fest-d11-red', '双11·红金盛典', '节日庆典', ['双11大促，{product}在红色天鹅绒舞台，金色聚光灯，金箔飘落，高端大气红色背景。'], 'bg-red-500 text-white border-red-600'),
  createStyle('fest-d12-gold', '双12·年终回馈', '节日庆典', ['双12盛典，{product}旁有金色奖杯，深蓝星空与金色丝带背景，荣誉感，高品质。'], 'bg-blue-700 text-white border-blue-800'),
  createStyle('fest-618-summer', '618·清凉夏日', '节日庆典', ['618大促，{product}漂浮在泳池水面，立体“618”水雕，阳光明媚，清凉蓝色。'], 'bg-cyan-500 text-white border-cyan-600'),
  createStyle('fest-618-party', '618·狂欢派对', '节日庆典', ['618年中大促，{product}在彩色气球和彩带中，明亮背景，派对狂欢氛围。'], 'bg-purple-500 text-white border-purple-600'),
  createStyle('fest-newyear-cn', '春节·龙年国潮', '节日庆典', ['新春大吉，{product}与舞狮头互动，红色窗花灯笼背景，中国红，热闹非凡。'], 'bg-red-100 text-red-800 border-red-200'),
  createStyle('fest-newyear-fire', '春节·烟花璀璨', '节日庆典', ['除夕夜，{product}背景是漫天绽放的烟花，红灯笼，喜庆祥和。'], 'bg-red-900 text-yellow-100 border-red-800'),
  createStyle('fest-lantern', '元宵·花灯初上', '节日庆典', ['元宵节，{product}周围悬挂各式花灯，深蓝夜空圆月背景，梦幻光影。'], 'bg-orange-100 text-orange-800 border-orange-200'),
  createStyle('fest-dragon', '端午·龙舟粽香', '节日庆典', ['端午节，{product}在龙舟旁，粽叶飘香，江水波涛，绿色调。'], 'bg-green-200 text-green-800'),
  createStyle('fest-moon', '中秋·月满团圆', '节日庆典', ['中秋赏月，{product}背景巨大超级月亮，桂花飘香，深蓝静谧。'], 'bg-indigo-900 text-yellow-100 border-indigo-700'),
  createStyle('fest-moon-jade', '中秋·玉兔呈祥', '节日庆典', ['中秋节，{product}旁有可爱的玉兔，云雾缭绕，广寒宫风格，白色金色。'], 'bg-slate-800 text-white'),
  createStyle('fest-qixi', '七夕·鹊桥相会', '节日庆典', ['七夕情人节，{product}在鹊桥之上，星河璀璨，牛郎织女剪影，浪漫。'], 'bg-violet-200 text-violet-900'),
  createStyle('fest-national', '国庆·盛世华诞', '节日庆典', ['盛世中国红，{product}背景飘扬红旗（虚化）金色五星，大气磅礴。'], 'bg-red-600 text-yellow-100 border-red-700'),
  
  createStyle('fest-val-pink', '情人节·粉色浪漫', '节日庆典', ['粉色告白，{product}被粉色玫瑰花瓣包围，柔光滤镜，爱心光斑背景。'], 'bg-pink-100 text-pink-600 border-pink-200'),
  createStyle('fest-val-red', '情人节·炽热真爱', '节日庆典', ['炽热的爱，{product}在深红丝绒背景，红玫瑰与红酒，光影浓郁。'], 'bg-rose-700 text-white border-rose-800'),
  createStyle('fest-women-queen', '女神节·女王加冕', '节日庆典', ['女王节，{product}置于皇冠旁，紫色金色光影，展现女性力量与优雅。'], 'bg-purple-100 text-purple-700 border-purple-200'),
  createStyle('fest-mother', '母亲节·温馨康乃馨', '节日庆典', ['温馨母爱，{product}周围摆满粉色康乃馨，暖米色调，柔和光线。'], 'bg-orange-50 text-orange-600 border-orange-200'),
  createStyle('fest-father', '父亲节·深沉父爱', '节日庆典', ['父爱如山，{product}搭配烟斗报纸，深蓝或胡桃木背景，稳重高级。'], 'bg-slate-700 text-slate-100 border-slate-600'),
  createStyle('fest-kids-fun', '儿童节·童趣乐园', '节日庆典', ['六一快乐，{product}在积木城堡中，彩虹气球背景，高饱和度活泼。'], 'bg-yellow-100 text-yellow-700 border-yellow-200'),
  createStyle('fest-school', '开学季·青春校园', '节日庆典', ['重返校园，{product}在课桌上，书本堆叠，阳光透过窗户，青春气息。'], 'bg-emerald-50 text-emerald-700 border-emerald-200'),
  createStyle('fest-teacher', '教师节·桃李满园', '节日庆典', ['教师节，{product}在黑板前，粉笔字，讲台鲜花，感恩氛围。'], 'bg-green-700 text-white'),
  
  createStyle('fest-halloween', '万圣节·奇妙夜', '节日庆典', ['万圣夜，{product}在南瓜灯旁，紫色幽灵城堡背景，奇幻哥特风。'], 'bg-purple-900 text-orange-300 border-purple-800'),
  createStyle('fest-hallow-spooky', '万圣节·恐怖古堡', '节日庆典', ['万圣节，{product}在古堡台阶，枯树乌鸦，迷雾，暗黑风格。'], 'bg-neutral-900 text-neutral-300'),
  createStyle('fest-thanks', '感恩节·丰收盛宴', '节日庆典', ['感恩节，{product}在丰盛餐桌上，火鸡南瓜玉米，秋季暖色调。'], 'bg-amber-700 text-amber-100'),
  createStyle('fest-xmas-cozy', '圣诞·暖冬礼遇', '节日庆典', ['圣诞奇妙夜，{product}在圣诞树下，礼物盒堆积，暖黄串灯虚化。'], 'bg-green-800 text-green-100 border-green-900'),
  createStyle('fest-xmas-snow', '圣诞·北欧雪国', '节日庆典', ['北欧雪景，{product}在铺满白雪的窗台，窗外松林驯鹿，静谧唯美。'], 'bg-slate-100 text-slate-600 border-slate-200'),
  createStyle('fest-xmas-gold', '圣诞·黑金奢华', '节日庆典', ['奢华圣诞，{product}搭配黑金配色圣诞装饰，金色麋鹿，高级感。'], 'bg-black text-yellow-400'),
  
  createStyle('fest-blackfri', '黑五·暗夜霓虹', '节日庆典', ['Black Friday，纯黑背景，{product}被强白光勾勒，SALE霓虹灯，神秘高级。'], 'bg-black text-white border-gray-700'),
  createStyle('fest-cyber-mon', '网一·赛博促销', '节日庆典', ['Cyber Monday，{product}在电路板或数据流背景中，科技蓝，促销感。'], 'bg-blue-900 text-cyan-300'),
  
  createStyle('fest-newyear-party', '跨年·香槟派对', '节日庆典', ['跨年派对，{product}在香槟塔旁，金色气球彩带，城市烟花夜景。'], 'bg-amber-400 text-amber-900 border-amber-500'),
  createStyle('fest-easter', '复活节·彩蛋草地', '节日庆典', ['复活节，{product}在嫩绿草地，周围是彩色复活节彩蛋和兔子，清新春日。'], 'bg-lime-200 text-lime-800'),
  createStyle('fest-ramadan', '斋月·金月清真', '节日庆典', ['斋月Ramadan，{product}在阿拉伯风格窗格前，新月灯，枣椰树，金色深蓝。'], 'bg-sky-900 text-yellow-200'),
  createStyle('fest-summer-sale', '夏促·热带风情', '节日庆典', ['夏季大促，{product}在沙滩冲浪板旁，椰子树，高饱和热带色彩。'], 'bg-orange-400 text-white'),
  createStyle('fest-winter-sale', '冬促·冰雪奇缘', '节日庆典', ['冬季清仓，{product}破冰而出，雪花飞舞，极寒蓝色调。'], 'bg-cyan-700 text-white'),

  // ============================================================
  // 3. 材质艺术 (Materials & Texture) - 40 styles
  // ============================================================
  createStyle('mat-water', '材质·深海涌动', '材质艺术', ['深海悬浮，{product}在深蓝海水中，气泡上升，光线折射，清爽通透。'], 'bg-blue-200 text-blue-800'),
  createStyle('mat-water-splash', '材质·水花飞溅', '材质艺术', ['动态水花，{product}冲击水面，水珠四溅，高速摄影定格，清凉感。'], 'bg-blue-400 text-white'),
  createStyle('mat-water-drop', '材质·露珠微距', '材质艺术', ['雨后露珠，{product}表面覆盖细密水珠，荷叶背景，清新微距。'], 'bg-emerald-200 text-emerald-800'),
  
  createStyle('mat-ice', '材质·极寒冰封', '材质艺术', ['极寒冰封，{product}被封在透明冰块中，或置于碎冰之上，冷酷清爽。'], 'bg-cyan-100 text-cyan-700'),
  createStyle('mat-ice-cave', '材质·蓝冰洞穴', '材质艺术', ['冰岛蓝冰洞，{product}在通透的蓝色冰层中，神秘冷冽。'], 'bg-cyan-800 text-white'),
  
  createStyle('mat-fire', '材质·烈火淬炼', '材质艺术', ['烈火淬炼，{product}周围燃烧火焰飞溅火星，黑色背景，极致酷炫。'], 'bg-red-900 text-orange-200'),
  createStyle('mat-lava', '材质·熔岩流动', '材质艺术', ['滚烫熔岩，{product}悬浮在黑色冷却岩石与红色熔岩缝隙之上，炽热。'], 'bg-orange-900 text-yellow-200'),
  
  createStyle('mat-smoke', '材质·彩烟缭绕', '材质艺术', ['彩烟缭绕，{product}被彩色烟雾（粉蓝紫）环绕，神秘梦幻。'], 'bg-purple-100 text-purple-700'),
  createStyle('mat-smoke-ink', '材质·水墨烟云', '材质艺术', ['水墨烟云，{product}在黑白水墨扩散的烟雾中，中国风雅致。'], 'bg-gray-200 text-gray-800'),
  
  createStyle('mat-silk', '材质·丝绸流动', '材质艺术', ['飘逸红绸，{product}被舞动红丝绸包裹，动态感强，背景干净。'], 'bg-red-50 text-red-600'),
  createStyle('mat-satin', '材质·香槟缎面', '材质艺术', ['香槟色缎面，{product}在褶皱自然的丝绸背景上，柔滑高贵。'], 'bg-orange-50 text-orange-700'),
  
  createStyle('mat-milk', '材质·牛奶丝滑', '材质艺术', ['牛奶浴，{product}周围是丝滑流动的白色牛奶液体，柔顺细腻。'], 'bg-stone-50 text-stone-600'),
  createStyle('mat-chocolate', '材质·浓郁巧克力', '材质艺术', ['丝滑巧克力，{product}被流动的热巧克力包裹，可可粉飞扬，诱人。'], 'bg-amber-900 text-amber-100'),
  
  createStyle('mat-gold-liquid', '材质·流金岁月', '材质艺术', ['液态黄金，{product}被熔化的金色液体环绕，奢华流动感。'], 'bg-yellow-200 text-yellow-800'),
  createStyle('mat-gold-foil', '材质·金箔纹理', '材质艺术', ['金箔背景，{product}在褶皱的金箔纸前，富丽堂皇。'], 'bg-yellow-500 text-yellow-900'),
  createStyle('mat-silver', '材质·液态金属', '材质艺术', ['液态水银，{product}周围漂浮银色液态金属球，未来科技感。'], 'bg-slate-300 text-slate-800'),
  
  createStyle('mat-stone-black', '材质·黑火山岩', '材质艺术', ['暗黑火山岩，{product}在粗糙黑色玄武岩上，硬朗质感，极简高级。'], 'bg-neutral-900 text-neutral-400'),
  createStyle('mat-stone-white', '材质·汉白玉石', '材质艺术', ['洁白玉石，{product}在光滑汉白玉底座上，纹理细腻，纯净典雅。'], 'bg-stone-100 text-stone-500'),
  createStyle('mat-concrete', '材质·清水混凝土', '材质艺术', ['清水混凝土，{product}在灰色水泥几何空间，建筑光影，工业冷淡风。'], 'bg-gray-400 text-gray-100'),
  createStyle('mat-terrazzo', '材质·水磨石', '材质艺术', ['彩色水磨石，{product}在水磨石台面上，斑点纹理，INS风。'], 'bg-orange-50 text-orange-600'),
  
  createStyle('mat-glass', '材质·全息玻璃', '材质艺术', ['全息玻璃，{product}周围是炫彩玻璃碎片，光影折射，现代艺术。'], 'bg-indigo-50 text-indigo-600'),
  createStyle('mat-glass-frosted', '材质·磨砂玻璃', '材质艺术', ['磨砂玻璃，{product}透过半透明磨砂介质，朦胧美，柔和漫反射。'], 'bg-slate-50 text-slate-400'),
  
  createStyle('mat-neon', '材质·霓虹灯管', '材质艺术', ['霓虹光影，{product}被复杂的霓虹灯管包围，赛博朋克夜景。'], 'bg-fuchsia-900 text-fuchsia-200'),
  createStyle('mat-laser', '材质·镭射幻彩', '材质艺术', ['镭射表面，{product}背景是流动的CD光盘镭射光泽，Y2K风格。'], 'bg-pink-300 text-pink-900'),
  
  createStyle('mat-plant', '材质·热带植物', '材质艺术', ['热带雨林，{product}掩映在巨大的龟背竹和棕榈叶中，深绿色调。'], 'bg-green-700 text-green-100'),
  createStyle('mat-moss', '材质·苔藓微观', '材质艺术', ['微观苔藓，{product}置于绿意盎然的苔藓石上，微距生态缸感觉。'], 'bg-emerald-800 text-emerald-100'),
  createStyle('mat-flower', '材质·繁花似锦', '材质艺术', ['繁花盛开，{product}被无数鲜花簇拥，色彩缤纷，油画质感。'], 'bg-pink-200 text-pink-800'),
  createStyle('mat-dry-flower', '材质·干花复古', '材质艺术', ['复古干花，{product}搭配尤加利叶、棉花，大地色系，文艺怀旧。'], 'bg-amber-100 text-amber-800'),
  
  createStyle('mat-feather', '材质·轻盈羽毛', '材质艺术', ['轻盈羽毛，{product}漂浮在白色羽毛雨中，柔软纯洁。'], 'bg-slate-50 text-slate-400'),
  createStyle('mat-sand', '材质·流沙金影', '材质艺术', ['金色流沙，{product}半埋在细腻金沙中，沙脊线清晰，光影分明。'], 'bg-amber-100 text-amber-700'),
  createStyle('mat-wood', '材质·原木年轮', '材质艺术', ['原木切面，{product}在带有年轮的木桩上，自然粗犷。'], 'bg-amber-800 text-amber-100'),
  createStyle('mat-bamboo', '材质·青竹雅韵', '材质艺术', ['青竹林，{product}在翠竹之间，光影斑驳，清新东方韵味。'], 'bg-green-100 text-green-700'),
  
  createStyle('mat-bubble', '材质·梦幻气泡', '材质艺术', ['梦幻肥皂泡，{product}周围漂浮彩虹色透明气泡，轻盈透亮。'], 'bg-sky-100 text-sky-600'),
  createStyle('mat-crystal', '材质·璀璨水晶', '材质艺术', ['水晶簇拥，{product}在发光的水晶矿石丛中，晶莹剔透。'], 'bg-purple-200 text-purple-800'),
  createStyle('mat-diamond', '材质·钻石碎屑', '材质艺术', ['钻石碎屑，{product}撒在黑色天鹅绒上的碎钻中，星光熠熠。'], 'bg-slate-900 text-white'),
  
  createStyle('mat-fur', '材质·柔软皮草', '材质艺术', ['奢华皮草，{product}在柔软的长毛皮草上，温暖贵气。'], 'bg-stone-200 text-stone-600'),
  createStyle('mat-leather', '材质·真皮质感', '材质艺术', ['荔枝纹真皮，{product}背景是高档棕色皮革，缝线细节，复古绅士。'], 'bg-orange-900 text-orange-200'),
  createStyle('mat-velvet', '材质·丝绒帷幕', '材质艺术', ['红色帷幕，{product}在重垂的红色天鹅绒帷幕前，剧院舞台感。'], 'bg-red-800 text-red-100'),
  createStyle('mat-latex', '材质·光亮乳胶', '材质艺术', ['黑色乳胶，{product}背景是光滑反光的黑色乳胶/漆皮，前卫性感。'], 'bg-neutral-800 text-neutral-300'),

  // ============================================================
  // 4. 场景氛围 (Scenes & Environment) - 45 styles
  // ============================================================
  createStyle('scene-living', '场景·北欧客厅', '场景氛围', ['北欧客厅，{product}在米色布艺沙发，地毯绿植，温馨家居。'], 'bg-stone-100 text-stone-600'),
  createStyle('scene-kitchen', '场景·现代厨房', '场景氛围', ['开放式厨房，{product}在白色岩板岛台，整洁橱柜，现代生活。'], 'bg-gray-100 text-gray-700'),
  createStyle('scene-bedroom', '场景·慵懒卧室', '场景氛围', ['清晨床头，{product}在床头柜，白色床单，阳光透过百叶窗。'], 'bg-indigo-50 text-indigo-600'),
  createStyle('scene-bath', '场景·浴室SPA', '场景氛围', ['大理石浴室，{product}在洗手台，镜子香薰水雾，SPA享受。'], 'bg-cyan-50 text-cyan-700'),
  createStyle('scene-balcony', '场景·午后阳台', '场景氛围', ['城市阳台，{product}在户外桌椅，背景是蓝天和城市天际线，悠闲。'], 'bg-sky-100 text-sky-700'),
  createStyle('scene-closet', '场景·衣帽间', '场景氛围', ['步入式衣帽间，{product}在首饰中岛台，背景是挂满衣物的柜子，奢华。'], 'bg-rose-50 text-rose-600'),
  
  createStyle('scene-desk', '场景·极客桌面', '场景氛围', ['极客桌面，{product}在胡桃木桌，屏幕挂灯，机械键盘，科技感。'], 'bg-slate-800 text-slate-200'),
  createStyle('scene-gaming', '场景·电竞房', '场景氛围', ['RGB电竞房，{product}在发光电脑桌上，墙面六边形灯板，酷炫游戏氛围。'], 'bg-purple-800 text-purple-100'),
  createStyle('scene-office', '场景·商务办公', '场景氛围', ['CBD办公室，{product}在会议桌上，背景落地窗外高楼大厦，精英感。'], 'bg-slate-200 text-slate-800'),
  
  createStyle('scene-cafe', '场景·午后咖啡', '场景氛围', ['咖啡馆，{product}在木桌，冰美式杂志，窗外街道，悠闲。'], 'bg-orange-100 text-orange-900'),
  createStyle('scene-bar', '场景·爵士酒吧', '场景氛围', ['昏暗酒吧，{product}在吧台，威士忌酒杯，背景酒架虚化，情调。'], 'bg-amber-900 text-amber-200'),
  createStyle('scene-gallery', '场景·艺术展馆', '场景氛围', ['白色画廊，{product}在展台上，周围是抽象画作，安静冷淡。'], 'bg-white text-gray-500 border-gray-200'),
  
  createStyle('scene-pool', '场景·奢华泳池', '场景氛围', ['无边泳池，{product}在池畔，连接大海，漂浮早餐，度假风。'], 'bg-cyan-200 text-cyan-800'),
  createStyle('scene-beach', '场景·阳光沙滩', '场景氛围', ['阳光沙滩，{product}在白沙上，湛蓝海水椰树投影，夏日。'], 'bg-blue-300 text-blue-900'),
  createStyle('scene-sunset', '场景·海边夕阳', '场景氛围', ['金色夕阳，{product}在海边礁石，海面波光粼粼，逆光剪影，唯美。'], 'bg-orange-300 text-orange-900'),
  
  createStyle('scene-forest', '场景·迷雾森林', '场景氛围', ['暮光森林，{product}在苔藓地面，高耸杉树，丁达尔光，神秘。'], 'bg-green-800 text-green-100'),
  createStyle('scene-jungle', '场景·热带丛林', '场景氛围', ['亚马逊丛林，{product}在藤蔓和蕨类植物中，潮湿，探险感。'], 'bg-green-600 text-green-200'),
  createStyle('scene-waterfall', '场景·秘境瀑布', '场景氛围', ['山间瀑布，{product}在湿润岩石上，背景瀑布飞流直下，清新空气。'], 'bg-cyan-700 text-white'),
  createStyle('scene-camping', '场景·山系露营', '场景氛围', ['露营Glamping，{product}在蛋卷桌，天幕篝火，松林环绕。'], 'bg-green-700 text-green-100'),
  createStyle('scene-desert', '场景·广袤沙漠', '场景氛围', ['撒哈拉沙漠，{product}在沙丘脊线上，蓝天烈日，干燥纯净。'], 'bg-orange-200 text-orange-800'),
  createStyle('scene-snowmt', '场景·雪山之巅', '场景氛围', ['珠峰大本营，{product}在雪地岩石，日照金山，极致纯净。'], 'bg-sky-100 text-sky-700'),
  createStyle('scene-canyon', '场景·红土峡谷', '场景氛围', ['羚羊峡谷，{product}在红色岩石间，光束射入，地质纹理，壮观。'], 'bg-orange-700 text-orange-100'),
  
  createStyle('scene-street', '场景·城市街头', '场景氛围', ['繁忙街头，{product}前景清晰，背景虚化车流建筑，都市节奏。'], 'bg-gray-600 text-gray-100'),
  createStyle('scene-cyber-city', '场景·赛博都市', '场景氛围', ['未来都市，{product}背景是高耸入云的全息广告牌大楼，雨夜霓虹。'], 'bg-violet-900 text-violet-200'),
  createStyle('scene-rooftop', '场景·天台夜景', '场景氛围', ['城市天台，{product}背景是绚烂城市夜景灯光，繁华都市。'], 'bg-indigo-900 text-indigo-100'),
  createStyle('scene-subway', '场景·地铁车站', '场景氛围', ['地铁站台，{product}背景是飞驰而过的列车拖影，冷白光，现代通勤。'], 'bg-slate-500 text-white'),
  
  createStyle('scene-gym', '场景·硬核健身', '场景氛围', ['健身房，{product}在哑铃架旁，工业风水泥墙，力量感。'], 'bg-neutral-700 text-neutral-200'),
  createStyle('scene-court', '场景·篮球场', '场景氛围', ['街头球场，{product}在地面，篮网，涂鸦地面，阳光活力。'], 'bg-orange-500 text-white'),
  createStyle('scene-track', '场景·塑胶跑道', '场景氛围', ['红色跑道，{product}在起跑线，白色线条，运动竞技感。'], 'bg-red-500 text-white'),
  
  createStyle('scene-studio', '场景·极简影棚', '场景氛围', ['专业影棚，{product}在无缝背景纸前，柔光箱，极简构图。'], 'bg-gray-50 text-gray-600'),
  createStyle('scene-podium', '场景·几何展台', '场景氛围', ['几何展台，{product}在圆形/方形展台，聚光灯，艺术馆陈列。'], 'bg-rose-50 text-rose-700'),
  createStyle('scene-arch', '场景·罗马拱门', '场景氛围', ['建筑美学，{product}在罗马柱或拱门前，光影切割，古典建筑。'], 'bg-stone-300 text-stone-800'),
  
  createStyle('scene-window', '场景·窗边雨声', '场景氛围', ['雨天窗边，{product}在窗台，玻璃上雨滴，窗外模糊城市灯光，忧郁美。'], 'bg-blue-100 text-blue-800'),
  createStyle('scene-garden', '场景·法式花园', '场景氛围', ['莫奈花园，{product}在鲜花拱门下，睡莲池塘，油画自然光。'], 'bg-green-100 text-green-800'),
  createStyle('scene-picnic', '场景·草地野餐', '场景氛围', ['草地野餐，{product}在红白格纹布上，草坪蓝天，惬意。'], 'bg-lime-100 text-lime-700'),
  createStyle('scene-space', '场景·浩瀚太空', '场景氛围', ['外太空，{product}悬浮在地球轨道，星空银河，未来宏大。'], 'bg-slate-900 text-slate-100'),
  createStyle('scene-mars', '场景·火星表面', '场景氛围', ['火星基地，{product}在红色土壤上，未来探测器背景，科幻探索。'], 'bg-orange-600 text-white'),
  
  createStyle('scene-garage', '场景·复古车库', '场景氛围', ['美式车库，{product}在工具台上，背景复古汽车，机油味，工业风。'], 'bg-zinc-700 text-zinc-200'),
  createStyle('scene-factory', '场景·废弃工厂', '场景氛围', ['废土风，{product}在生锈管道旁，阳光透过破窗，硬核颓废。'], 'bg-stone-600 text-stone-200'),
  createStyle('scene-lab', '场景·未来实验室', '场景氛围', ['洁净室，{product}在白色实验台，显微镜玻璃器皿，科技研发感。'], 'bg-cyan-50 text-cyan-600'),

  createStyle('scene-library', '场景·古典图书馆', '场景氛围', ['哈利波特式图书馆，{product}在厚重木桌，绿台灯，满墙书架。'], 'bg-amber-900 text-amber-200'),
  createStyle('scene-classroom', '场景·明亮教室', '场景氛围', ['午后教室，{product}在课桌，黑板，飞舞的粉笔尘，校园回忆。'], 'bg-green-50 text-green-700'),
  createStyle('scene-cinema', '场景·电影院', '场景氛围', ['电影院，{product}在红色座椅扶手，背景虚化的大银幕光影。'], 'bg-red-900 text-white'),
  createStyle('scene-casino', '场景·拉斯维加斯', '场景氛围', ['赌场筹码，{product}在绿绒桌面上，扑克牌筹码堆积，纸醉金迷。'], 'bg-green-900 text-yellow-200'),

  // ============================================================
  // 5. 摄影技法 (Photography Techniques) - 30 styles
  // ============================================================
  createStyle('photo-macro', '摄影·极致微距', '摄影技法', ['超微距，{product}细节充满画面，材质纹理清晰可见，极浅景深。'], 'bg-slate-200 text-slate-800'),
  createStyle('photo-bokeh', '摄影·唯美光斑', '摄影技法', ['梦幻光斑，{product}背景是五颜六色的失焦光斑（Bokeh），浪漫朦胧。'], 'bg-pink-50 text-pink-600'),
  createStyle('photo-shadow', '摄影·树影斑驳', '摄影技法', ['树影婆娑，{product}被植物阴影覆盖，阳光透过叶片，自然光影游戏。'], 'bg-green-50 text-green-700'),
  createStyle('photo-prism', '摄影·棱镜折射', '摄影技法', ['棱镜光效，{product}画面边缘有彩虹色棱镜折射，梦幻艺术感。'], 'bg-cyan-50 text-cyan-600'),
  createStyle('photo-dark', '摄影·暗调奢华', '摄影技法', ['Low-key暗调，{product}隐藏在阴影中，只有轮廓光勾勒，神秘高级。'], 'bg-black text-gray-300'),
  createStyle('photo-high', '摄影·高调纯净', '摄影技法', ['High-key高调，{product}在过曝的纯白环境中，画面极其明亮干净。'], 'bg-white text-gray-400 border-gray-200'),
  createStyle('photo-split', '摄影·冷暖对比', '摄影技法', ['冷暖双色灯，{product}一边是橙光一边是蓝光，强对比，电影感。'], 'bg-gradient-to-r from-orange-200 to-blue-200 text-slate-700'),
  createStyle('photo-rim', '摄影·轮廓勾勒', '摄影技法', ['边缘光Rim Light，{product}逆光拍摄，边缘发光，与背景分离。'], 'bg-gray-800 text-gray-200'),
  createStyle('photo-flat', '摄影·平铺俯拍', '摄影技法', ['Knolling平铺，{product}与相关道具整齐排列，90度垂直俯拍，强迫症福音。'], 'bg-blue-50 text-blue-600'),
  createStyle('photo-motion', '摄影·动态模糊', '摄影技法', ['动态模糊，{product}清晰，背景呈现放射状或直线模糊，速度感。'], 'bg-red-50 text-red-600'),
  createStyle('photo-under', '摄影·水下摄影', '摄影技法', ['水下视角，{product}在水面之下，波光粼粼，光线透射。'], 'bg-cyan-600 text-cyan-100'),
  createStyle('photo-film', '摄影·胶片质感', '摄影技法', ['复古胶片，{product}画面有颗粒感，色彩偏色，怀旧柯达/富士风。'], 'bg-yellow-50 text-yellow-700'),
  createStyle('photo-smoke', '摄影·烟雾弥漫', '摄影技法', ['丁达尔烟雾，{product}在光束中，空气中有尘埃粒子，氛围感。'], 'bg-gray-400 text-white'),
  createStyle('photo-reflection', '摄影·倒影镜像', '摄影技法', ['镜面倒影，{product}置于黑色镜面上，清晰的对称倒影。'], 'bg-slate-900 text-slate-300'),
  createStyle('photo-levitation', '摄影·失重悬浮', '摄影技法', ['悬浮摄影，{product}和配件漂浮在空中，无视重力，奇幻。'], 'bg-indigo-100 text-indigo-700'),
  
  createStyle('photo-gobo', '摄影·百叶窗光', '摄影技法', ['Gobo光影，{product}被百叶窗的条纹阴影覆盖，黑色电影风格。'], 'bg-gray-700 text-gray-200'),
  createStyle('photo-long-exp', '摄影·长曝光流光', '摄影技法', ['长曝光，{product}静止，背景是流动的车灯光轨，时光流逝。'], 'bg-purple-900 text-purple-200'),
  createStyle('photo-fisheye', '摄影·趣味鱼眼', '摄影技法', ['鱼眼镜头，{product}居中夸张变形，大头狗视角，趣味性。'], 'bg-yellow-100 text-yellow-800'),
  createStyle('photo-tilt', '摄影·移轴微缩', '摄影技法', ['移轴摄影，{product}看起来像微缩模型，背景强烈虚化，玩具感。'], 'bg-emerald-100 text-emerald-800'),
  createStyle('photo-polaroid', '摄影·宝丽来', '摄影技法', ['宝丽来相纸，{product}在白色相框内，高对比度，褪色感。'], 'bg-white text-black border-gray-300'),
  
  createStyle('photo-silhouette', '摄影·唯美剪影', '摄影技法', ['剪影，{product}黑色轮廓，背景是绚烂的晚霞或强逆光。'], 'bg-orange-400 text-black'),
  createStyle('photo-double', '摄影·双重曝光', '摄影技法', ['双重曝光，{product}轮廓内叠加了自然风景或城市纹理，艺术融合。'], 'bg-indigo-200 text-indigo-900'),
  createStyle('photo-rembrandt', '摄影·伦勃朗光', '摄影技法', ['伦勃朗光，{product}处于暗部，经典的倒三角光斑，古典肖像质感。'], 'bg-stone-800 text-stone-200'),
  createStyle('photo-butterfly', '摄影·蝴蝶光', '摄影技法', ['蝴蝶光，{product}正面受光，下方有蝴蝶状阴影，突出立体感。'], 'bg-pink-50 text-pink-700'),
  createStyle('photo-topdown', '摄影·上帝视角', '摄影技法', ['无人机航拍视角，{product}在地面纹理之上，宏大构图。'], 'bg-sky-200 text-sky-800'),

  // ============================================================
  // 6. 特殊品类 (Special Categories) - 30 styles
  // ============================================================
  createStyle('cat-sneaker', '品类·潮鞋浮空', '特殊品类', ['潮鞋，{product}踏碎岩石或水面，动态瞬间，爆炸碎片，酷炫。'], 'bg-orange-600 text-white'),
  createStyle('cat-sneaker-box', '品类·鞋盒开箱', '特殊品类', ['潮鞋开箱，{product}在打开的鞋盒旁，防潮纸，配件，收藏感。'], 'bg-orange-200 text-orange-900'),
  
  createStyle('cat-perfume', '品类·香水花艺', '特殊品类', ['香水，{product}在花丛和水雾中，瓶身透光，优雅芬芳。'], 'bg-rose-100 text-rose-700'),
  createStyle('cat-perfume-sea', '品类·男士香水', '特殊品类', ['男士香水，{product}在海浪拍打的礁石上，清新海洋调，冷色。'], 'bg-blue-700 text-blue-100'),
  
  createStyle('cat-watch', '品类·腕表机械', '特殊品类', ['腕表，{product}背景是巨大的齿轮机械结构，精密金属质感。'], 'bg-slate-400 text-white'),
  createStyle('cat-jewelry', '品类·珠宝丝绒', '特殊品类', ['珠宝，{product}在黑色丝绒首饰盒中，闪光灯星芒，璀璨。'], 'bg-stone-800 text-yellow-200'),
  
  createStyle('cat-food-fresh', '品类·生鲜飞溅', '特殊品类', ['生鲜，{product}带着水珠，背景是飞溅的水花和冰块，新鲜欲滴。'], 'bg-green-500 text-white'),
  createStyle('cat-food-warm', '品类·热食烟火', '特殊品类', ['热食，{product}冒着热气，暖光，木桌餐具，食欲大开。'], 'bg-orange-500 text-white'),
  createStyle('cat-food-picnic', '品类·零食野餐', '特殊品类', ['零食包装，{product}在野餐布上，周围是水果饮料，阳光户外。'], 'bg-lime-100 text-lime-800'),
  
  createStyle('cat-drink', '品类·饮料冰爽', '特殊品类', ['冷饮，{product}杯壁挂着水珠，冰块撞击，柠檬片飞舞，夏日解渴。'], 'bg-yellow-300 text-yellow-900'),
  createStyle('cat-coffee', '品类·咖啡豆香', '特殊品类', ['咖啡产品，{product}周围撒满烘焙咖啡豆，麻袋纹理，香气四溢。'], 'bg-amber-900 text-amber-100'),
  createStyle('cat-tea', '品类·茶道禅意', '特殊品类', ['茶叶/茶具，{product}在竹席上，紫砂壶，青烟，东方禅意。'], 'bg-green-100 text-green-800'),
  createStyle('cat-wine', '品类·红酒庄园', '特殊品类', ['红酒，{product}背景是葡萄庄园或橡木桶，夕阳余晖，醇厚。'], 'bg-red-900 text-red-200'),
  
  createStyle('cat-digital', '品类·数码爆炸', '特殊品类', ['数码产品，{product}零件爆炸拆解图，科技蓝背景，硬核。'], 'bg-blue-600 text-white'),
  createStyle('cat-laptop', '品类·办公设备', '特殊品类', ['笔记本/外设，{product}在极简办公桌，咖啡绿植，高效工作流。'], 'bg-gray-100 text-gray-800'),
  createStyle('cat-camera', '品类·摄影器材', '特殊品类', ['相机镜头，{product}在岩石上，户外风光背景，探索世界。'], 'bg-zinc-800 text-white'),
  
  createStyle('cat-car', '品类·汽车公路', '特殊品类', ['汽车用品，{product}在沿海公路上，动态模糊路面，夕阳。'], 'bg-slate-600 text-white'),
  createStyle('cat-oil', '品类·机油机械', '特殊品类', ['工业机油，{product}背景是金属齿轮引擎，冷峻工业风。'], 'bg-slate-800 text-yellow-400'),
  
  createStyle('cat-pet', '品类·宠物萌宠', '特殊品类', ['宠物用品，{product}旁有可爱的猫/狗探头，毛茸茸，温馨互动。'], 'bg-orange-100 text-orange-600'),
  createStyle('cat-baby', '品类·母婴云朵', '特殊品类', ['母婴用品，{product}在云朵和星星中，柔和蓝粉色，安全呵护。'], 'bg-blue-50 text-blue-600'),
  createStyle('cat-toy', '品类·玩具乐园', '特殊品类', ['玩具，{product}在乐高积木城或色彩斑斓的游乐场，童真。'], 'bg-yellow-200 text-yellow-900'),
  
  createStyle('cat-makeup', '品类·美妆涂抹', '特殊品类', ['美妆，{product}旁有涂抹开的质地纹理，细腻色彩，艺术摆盘。'], 'bg-pink-400 text-white'),
  createStyle('cat-skincare', '品类·护肤成分', '特殊品类', ['护肤品，{product}旁有芦荟/鲜花等天然成分道具，水润纯净。'], 'bg-cyan-100 text-cyan-800'),
  
  createStyle('cat-furniture', '品类·家具实景', '特殊品类', ['家具，{product}在装修精致的样板间，阳光射入，生活气息。'], 'bg-stone-200 text-stone-700'),
  createStyle('cat-lamp', '品类·灯具照明', '特殊品类', ['灯具，{product}在黑暗房间中发光，照亮温馨角落，光影效果。'], 'bg-yellow-900 text-yellow-100'),
  
  createStyle('cat-book', '品类·书籍文具', '特殊品类', ['文具，{product}在书桌上，手账本、钢笔，文艺书香。'], 'bg-amber-50 text-amber-700'),
  createStyle('cat-sport', '品类·运动活力', '特殊品类', ['运动装备，{product}在跑道或健身房，汗水，动态线条，能量。'], 'bg-lime-500 text-white'),
  createStyle('cat-supplement', '品类·保健活力', '特殊品类', ['保健品，{product}背景是清晨阳光和水果，活力健康。'], 'bg-green-200 text-green-800'),
];
