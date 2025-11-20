
import { PresetStyle, AspectRatio } from './types';

// 提升分辨率以确保比例生效，并提供更高清的输出
export const ASPECT_RATIOS: { value: AspectRatio; label: string; width: number; height: number }[] = [
  { value: '1:1', label: '正方形 (1:1)', width: 1024, height: 1024 },
  { value: '3:4', label: '电商竖图 (3:4)', width: 960, height: 1280 }, // 升级分辨率
  { value: '9:16', label: '手机全屏 (9:16)', width: 720, height: 1280 }, // 升级 HD
  { value: '4:3', label: '常规横图 (4:3)', width: 1280, height: 960 }, // 升级分辨率
  { value: '16:9', label: '宽屏海报 (16:9)', width: 1280, height: 720 }, // 升级 HD
  { value: 'custom', label: '自定义尺寸', width: 1024, height: 1024 },
];

export const MATTING_PROMPT = "专业产品摄影，纯白背景，无阴影，干净的抠图风格，独立主体。";
export const HD_SUFFIX = "，8k分辨率，超高清细节，照片级真实感，对焦锐利，专业摄影，杰作，商业广告级别。";

// 优化后的参考图前缀
export const REF_IMAGE_PROMPT_PREFIX = `
【任务指令：风格化海报生成】
1. 输入识别：
   - 第一张图片是【主体商品】：请保持其主体完整，轮廓清晰。
   - 第二张图片是【风格参考】：请提取其背景环境、构图方式、光影氛围和色彩基调。
2. 生成目标：
   - 将【主体商品】自然地融合到【风格参考】定义的场景中。
   - 自动分析商品的材质，并根据参考图的光源调整商品的高光和阴影。
   - 忽略参考图中的原商品，仅保留风格。
`;

export const AUTO_DETAIL_ENHANCEMENT = "，商业级广告摄影，产品质感细腻，光影过渡自然，画面干净高级，无瑕疵。";

export const TRANSPARENT_MATERIAL_PROMPT = "，画面中的主体商品为透明或半透明材质（如玻璃、水、亚克力、香水瓶），请重点渲染光线穿透、折射、物理焦散(caustics)效果，展现晶莹剔透的高级质感，液体通透。";

export const SAMPLE_PROMPTS: PresetStyle[] = [
  // ========================
  // 1. 节日与大促 (Festivals)
  // ========================
  {
    id: 'festival-double11',
    name: '双11狂欢',
    category: '节日大促',
    prompts: [`{product}置于立体“11.11”霓虹字样前，红蓝撞色背景，漂浮的礼盒与优惠券，电商大促狂欢氛围，C4D风格，热闹非凡。`],
    color: 'bg-blue-600 text-white border-blue-700',
  },
  {
    id: 'festival-double12',
    name: '双12盛典',
    category: '节日大促',
    prompts: [`{product}周围环绕着金色丝带和红色礼花，背景是“12.12”字样，年终盛典氛围，暖金色调，奢华促销。`],
    color: 'bg-red-600 text-white border-red-700',
  },
  {
    id: 'festival-newyear',
    name: '元旦跨年',
    category: '节日大促',
    prompts: [`{product}背景是绚烂的跨年烟花和发光的“2025”数字，黑金配色，香槟气泡，庆祝新的一年。`],
    color: 'bg-purple-800 text-purple-100 border-purple-600',
  },
  {
    id: 'festival-cny',
    name: '新春国潮',
    category: '节日大促',
    prompts: [`{product}周围环绕着红灯笼和金元宝，喜庆的中国新年氛围，红色背景，好运氛围，国潮插画风格。`],
    color: 'bg-red-50 text-red-800 border-red-200',
  },
  {
    id: 'festival-618',
    name: '618大促',
    category: '节日大促',
    prompts: [`电商大促风格，{product}背景是立体的618数字，彩带飞舞，动感模糊，明亮的橙红配色，热闹促销感。`],
    color: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  {
    id: 'festival-mothers',
    name: '母亲节',
    category: '节日大促',
    prompts: [`{product}被粉色康乃馨花束簇拥，柔和的粉色背景，丝带飘扬，温馨感恩，母亲节礼物风格。`],
    color: 'bg-pink-200 text-pink-900 border-pink-400',
  },
  {
    id: 'festival-fathers',
    name: '父亲节',
    category: '节日大促',
    prompts: [`{product}搭配深蓝色领带、手表和钢笔，商务深沉背景，金色几何线条，父亲节感恩主题。`],
    color: 'bg-slate-700 text-slate-100 border-slate-500',
  },
  {
    id: 'festival-love',
    name: '情人节',
    category: '节日大促',
    prompts: [`{product}周围有撒落的红色玫瑰花瓣，浪漫的烛光晚餐氛围，深红色背景，爱意浓浓。`],
    color: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    id: 'festival-xmas',
    name: '圣诞节',
    category: '节日大促',
    prompts: [`{product}周围环绕着松果、礼盒和圣诞彩灯，雪景背景，温暖的节日感觉。`],
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },

  // ========================
  // 2. 季节限定 (Seasons) - NEW
  // ========================
  {
    id: 'season-spring-sakura',
    name: '春日樱花',
    category: '季节限定',
    prompts: [
      `{product}在盛开的樱花树下，粉色花瓣飘落，柔和的春日阳光，梦幻唯美，日系清新风格。`,
      `{product}放置在公园长椅上，背景是模糊的粉色樱花林，明亮通透。`
    ],
    color: 'bg-pink-50 text-pink-600 border-pink-200',
  },
  {
    id: 'season-spring-garden',
    name: '春意花园',
    category: '季节限定',
    prompts: [
      `{product}在嫩绿的草地上，周围有雏菊和郁金香，清晨露珠，生机勃勃的春天。`,
      `春日野餐风格，{product}在格纹野餐布上，阳光斑驳，草编篮子，轻松惬意。`
    ],
    color: 'bg-green-50 text-green-600 border-green-200',
  },
  {
    id: 'season-summer-beach',
    name: '夏日海滩',
    category: '季节限定',
    prompts: [
      `{product}放置在金色的沙滩上，背景是碧蓝的大海和蓝天，明媚阳光，椰树投影，度假感十足。`,
      `{product}在海边礁石上，浪花拍打，清爽的夏日氛围，高亮度摄影。`
    ],
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    id: 'season-summer-pool',
    name: '清凉泳池',
    category: '季节限定',
    prompts: [
      `{product}漂浮在湛蓝的泳池水面上，波光粼粼，阳光折射，清爽透心，夏日派对风格。`,
      `泳池边瓷砖背景，{product}旁有冰镇饮料，高饱和度蓝色，清凉感。`
    ],
    color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  },
  {
    id: 'season-autumn-maple',
    name: '深秋红叶',
    category: '季节限定',
    prompts: [
      `{product}在铺满红枫叶的地面上，温暖的金色夕阳，秋意浓浓，色彩丰富。`,
      `秋季森林背景，{product}在树桩上，周围是落叶和松果，温暖怀旧。`
    ],
    color: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  {
    id: 'season-autumn-wheat',
    name: '金黄麦田',
    category: '季节限定',
    prompts: [
      `{product}置于金色的麦田中，随风摇曳的麦穗，柔和的逆光，自然有机，丰收的感觉。`,
      `秋日田园风格，米色和金色调，{product}搭配干花装饰，温柔静谧。`
    ],
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  {
    id: 'season-winter-snow',
    name: '冬日雪景',
    category: '季节限定',
    prompts: [
      `{product}放置在洁白的厚雪地上，晶莹剔透的冰块，寒冷的蓝色调，纯净清爽。`,
      `户外雪山背景，{product}在岩石上，雪花飘落，冬季极限运动氛围。`
    ],
    color: 'bg-slate-50 text-slate-600 border-slate-200',
  },
  {
    id: 'season-winter-cozy',
    name: '冬日暖炉',
    category: '季节限定',
    prompts: [
      `{product}在温暖的壁炉旁，跳动的火焰，毛毯和热可可，室内温馨冬日氛围，暖橙色光。`,
      `木屋室内风格，{product}在木桌上，窗外是雪景，室内温暖舒适。`
    ],
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },

  // ========================
  // 3. 空间场景 (Indoor/Outdoor) - NEW
  // ========================
  {
    id: 'scene-livingroom',
    name: '现代客厅',
    category: '空间场景',
    prompts: [
      `{product}在现代极简风格的客厅茶几上，背景是米色沙发和落地灯，柔和的室内光，居家生活美学。`,
      `高级公寓内景，{product}在边柜上，背景是落地窗和城市景观，优雅大气。`
    ],
    color: 'bg-stone-100 text-stone-700 border-stone-300',
  },
  {
    id: 'scene-kitchen',
    name: '明亮厨房',
    category: '空间场景',
    prompts: [
      `{product}在白色大理石岛台上，背景是模糊的现代化厨房橱柜，明亮的晨光，干净整洁。`,
      `生活气息厨房，{product}旁有新鲜水果和玻璃器皿，温馨的家庭氛围。`
    ],
    color: 'bg-gray-50 text-gray-700 border-gray-200',
  },
  {
    id: 'scene-bathroom',
    name: '卫浴空间',
    category: '空间场景',
    prompts: [
      `{product}在浴室洗手台上，镜面反射，白色瓷砖背景，清爽的水汽，SPA级的放松感。`,
      `浴缸边缘场景，{product}旁有香薰蜡烛，柔和的灯光，精致护肤氛围。`
    ],
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  {
    id: 'scene-bedroom',
    name: '慵懒卧室',
    category: '空间场景',
    prompts: [
      `{product}在柔软的白色床单上，阳光透过窗帘洒下，慵懒的周末早晨，舒适温馨。`,
      `床头柜场景，{product}在台灯下，背景是模糊的床铺，静谧的夜晚阅读时光。`
    ],
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'scene-office',
    name: '商务办公',
    category: '空间场景',
    prompts: [
      `{product}在高端办公桌上，旁边有Macbook和咖啡，背景是模糊的办公室玻璃墙，精英商务风。`,
      `创意工作空间，{product}周围有设计草图和文具，明亮的桌面摄影。`
    ],
    color: 'bg-slate-100 text-slate-700 border-slate-300',
  },
  {
    id: 'scene-street',
    name: '城市街头',
    category: '空间场景',
    prompts: [
      `{product}在繁忙的城市街头背景前，模糊的车辆和行人，散景效果（Bokeh），时尚街拍风格。`,
      `咖啡馆户外桌椅，{product}在桌上，背景是欧洲街道建筑，悠闲的午后。`
    ],
    color: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  },
  {
    id: 'scene-park',
    name: '公园绿地',
    category: '空间场景',
    prompts: [
      `{product}在公园的长椅上，背景是绿树和草坪，斑驳阳光，自然休闲风格。`,
      `城市公园台阶，{product}放置其上，背景是模糊的喷泉或雕塑，户外运动感。`
    ],
    color: 'bg-green-100 text-green-800 border-green-300',
  },
  {
    id: 'scene-rooftop',
    name: '天台视野',
    category: '空间场景',
    prompts: [
      `{product}在建筑天台边缘，背景是广阔的城市天际线和蓝天，开阔视野，自由的感觉。`,
      `夕阳下的天台，{product}逆光拍摄，城市剪影，充满都市故事感。`
    ],
    color: 'bg-sky-100 text-sky-800 border-sky-300',
  },

  // ========================
  // 4. 人物与手模 (Human & Hand) - NEW
  // ========================
  {
    id: 'human-hand-holding',
    name: '手持展示',
    category: '人物与手模',
    prompts: [
      `特写镜头，一只手自然地拿着{product}，皮肤质感真实，背景是模糊的生活场景，第一人称视角(POV)。`,
      `女性手部特写，涂着指甲油的手优雅地托着{product}，柔和光线，展示产品大小和质感。`
    ],
    color: 'bg-rose-50 text-rose-900 border-rose-200',
  },
  {
    id: 'human-model-fashion',
    name: '时尚模特',
    category: '人物与手模',
    prompts: [
      `时尚大片风格，模糊的模特身影在后方，{product}在前景清晰聚焦，高级杂志排版感，冷艳风格。`,
      `半身像构图，模特穿着时尚服装展示{product}，专业影棚布光，面部虚化或不露脸，强调产品。`
    ],
    color: 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200',
  },
  {
    id: 'human-model-lifestyle',
    name: '生活方式',
    category: '人物与手模',
    prompts: [
      `生活方式摄影，背景中有人物在模糊地活动（如喝咖啡、看书），{product}在前景桌面上，自然的生活气息。`,
      `运动场景，模糊的跑步者背景，{product}在前景地面或器械上，充满活力。`
    ],
    color: 'bg-orange-50 text-orange-900 border-orange-200',
  },
  {
    id: 'human-hand-apply',
    name: '使用场景',
    category: '人物与手模',
    prompts: [
      `护肤品广告风格，手部正在使用{product}的姿态（如按压泵头或涂抹），质地特写，干净卫生的背景。`,
      `手握{product}的操作演示，背景虚化，聚焦于产品交互部分，科技评测风格。`
    ],
    color: 'bg-teal-50 text-teal-900 border-teal-200',
  },

  // ========================
  // 5. 极简与几何 (Minimal)
  // ========================
  {
    id: 'minimal-studio',
    name: '纯净影棚',
    category: '极简与几何',
    prompts: [`{product}的专业摄影棚拍摄，柔和的白色弧形背景，柔和的漫射光，极简干净。`],
    color: 'bg-gray-50 text-gray-800 border-gray-200',
  },
  {
    id: 'minimal-color-block',
    name: '撞色几何',
    category: '极简与几何',
    prompts: [`{product}置于大胆的色彩几何体之间，红与蓝的撞色，硬边阴影，孟菲斯设计风格，现代艺术感。`],
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  {
    id: 'minimal-pastel',
    name: '马卡龙色',
    category: '极简与几何',
    prompts: [`{product}背景是柔和的粉彩粉色，极简构图，柔光，梦幻氛围。`],
    color: 'bg-pink-50 text-pink-800 border-pink-200',
  },
  {
    id: 'minimal-concrete',
    name: '工业水泥',
    category: '极简与几何',
    prompts: [`{product}放置在极简的混凝土基座上，灰色水泥墙背景，自然侧光，工业风，高冷质感。`],
    color: 'bg-stone-200 text-stone-800 border-stone-300',
  },
  {
    id: 'minimal-podium',
    name: '3D展台',
    category: '极简与几何',
    prompts: [`{product}立于圆柱形3D展台上，柔和的渐变背景，C4D渲染风格，干净、立体、高级。`],
    color: 'bg-violet-50 text-violet-800 border-violet-200',
  },
  {
    id: 'minimal-shadow',
    name: '植物光影',
    category: '极简与几何',
    prompts: [`{product}在纯色墙面前，植物的影子投射在产品和墙上，午后慵懒阳光，自然极简。`],
    color: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  },
  {
    id: 'minimal-morandi',
    name: '莫兰迪色',
    category: '极简与几何',
    prompts: [`{product}配合莫兰迪色系背景，低饱和度灰调，静物写生风格，高级灰，优雅宁静。`],
    color: 'bg-slate-100 text-slate-600 border-slate-300',
  },
  {
    id: 'minimal-acrylic',
    name: '亚克力板',
    category: '极简与几何',
    prompts: [`{product}搭配彩色透明亚克力板，光线穿透产生漂亮的光斑，现代材质感，清透。`],
    color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },

  // ========================
  // 6. 自然与植物 (Nature)
  // ========================
  {
    id: 'nature-forest',
    name: '迷雾森林',
    category: '自然与植物',
    prompts: [`{product}置身于郁郁葱葱的森林深处，苔藓地面，晨雾缭绕，丁达尔光效，神秘自然。`],
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  {
    id: 'nature-water-splash',
    name: '激爽水花',
    category: '自然与植物',
    prompts: [`{product}的动态拍摄，周围溅起清澈的蓝色水花，产品上有新鲜水珠，高速摄影，清爽无比。`],
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'nature-flowers',
    name: '繁花簇拥',
    category: '自然与植物',
    prompts: [`{product}被簇拥在盛开的鲜花丛中，牡丹、玫瑰，浪漫唯美，柔焦镜头，香氛感。`],
    color: 'bg-pink-100 text-pink-700 border-pink-200',
  },
  {
    id: 'nature-tropical',
    name: '热带雨林',
    category: '自然与植物',
    prompts: [`{product}周围环绕着巨大的龟背竹和芭蕉叶，热带雨林气息，鲜艳的绿色，湿润感。`],
    color: 'bg-green-50 text-green-800 border-green-200',
  },
  {
    id: 'nature-desert',
    name: '旷野沙漠',
    category: '自然与植物',
    prompts: [`{product}置于起伏的沙丘之上，金色的夕阳，长长的阴影，干燥的纹理，粗犷之美。`],
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  {
    id: 'nature-rocks',
    name: '溪流岩石',
    category: '自然与植物',
    prompts: [`{product}平衡在溪流中的光滑岩石上，流动的水流，自然禅意，清冷色调。`],
    color: 'bg-stone-100 text-stone-800 border-stone-300',
  },
  {
    id: 'nature-sky',
    name: '云端之上',
    category: '自然与植物',
    prompts: [`{product}漂浮在柔软的白云之间，蓝天背景，梦幻空灵，轻盈的感觉。`],
    color: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    id: 'nature-camping',
    name: '户外露营',
    category: '自然与植物',
    prompts: [`{product}放置在露营折叠桌上，背景是模糊的森林和帐篷，户外探险风格，自然光，机能风。`],
    color: 'bg-lime-50 text-lime-800 border-lime-200',
  },

  // ========================
  // 7. 奢华与质感 (Luxury)
  // ========================
  {
    id: 'luxury-marble',
    name: '白金大理石',
    category: '奢华与质感',
    prompts: [`{product}放置在奢华的白色卡拉拉大理石台面上，金色纹理，柔和电影布光，高端产品展示。`],
    color: 'bg-slate-50 text-slate-800 border-slate-200',
  },
  {
    id: 'luxury-black-gold',
    name: '黑金流光',
    category: '奢华与质感',
    prompts: [`{product}在深色反光表面上，背景有金色粒子点缀，聚光灯照射，黑暗神秘氛围，尊贵奢华。`],
    color: 'bg-yellow-50 text-yellow-900 border-yellow-200',
  },
  {
    id: 'luxury-silk',
    name: '丝绸柔光',
    category: '奢华与质感',
    prompts: [`{product}静置在流动的香槟色丝绸面料上，柔和褶皱，优雅摄影棚布光，高级时尚风格，柔滑细腻。`],
    color: 'bg-orange-50 text-orange-800 border-orange-100',
  },
  {
    id: 'luxury-velvet',
    name: '红丝绒',
    category: '奢华与质感',
    prompts: [`{product}在深红色天鹅绒布背景前，质感厚重，戏剧性布光，复古歌剧院风格，高贵典雅。`],
    color: 'bg-red-50 text-red-900 border-red-200',
  },
  {
    id: 'luxury-glass',
    name: '水晶玻璃',
    category: '奢华与质感',
    prompts: [`{product}在玻璃砖或水晶器皿旁，折射出彩虹般的光芒，晶莹剔透，干净的淡蓝光，医疗或护肤品氛围。`],
    color: 'bg-cyan-50 text-cyan-900 border-cyan-200',
  },
  {
    id: 'luxury-wood',
    name: '黑胡桃木',
    category: '奢华与质感',
    prompts: [`{product}放置在深色黑胡桃木桌面上，复古质感，温暖的室内灯光，经典稳重，绅士品格。`],
    color: 'bg-amber-100 text-amber-900 border-amber-200',
  },
  {
    id: 'luxury-leather',
    name: '经典皮革',
    category: '奢华与质感',
    prompts: [`{product}放置在棕色真皮沙发纹理上，背景模糊的复古书房，商务精英风，质感细腻。`],
    color: 'bg-orange-900 text-orange-100 border-orange-700',
  },
  {
    id: 'luxury-perfume',
    name: '香水展台',
    category: '奢华与质感',
    prompts: [`{product}在镜面上，倒影清晰，背景是虚化的金色光斑，香水广告大片风格，唯美。`],
    color: 'bg-purple-50 text-purple-900 border-purple-200',
  },

  // ========================
  // 8. 潮流与艺术 (Art & Trend)
  // ========================
  {
    id: 'art-acid',
    name: '酸性设计',
    category: '潮流与艺术',
    prompts: [`酸性设计风格，{product}周围环绕液态金属流体，全息镭射反光，扭曲的网格背景，Y2K美学，前卫酷炫。`],
    color: 'bg-violet-100 text-violet-900 border-violet-300',
  },
  {
    id: 'art-cyberpunk',
    name: '赛博朋克',
    category: '潮流与艺术',
    prompts: [`{product}在未来主义赛博朋克城市场景中，霓虹粉蓝灯光，湿润路面反射，夜间，科技感爆棚。`],
    color: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300',
  },
  {
    id: 'art-vaporwave',
    name: '蒸汽波',
    category: '潮流与艺术',
    prompts: [`蒸汽波风格，{product}搭配粉色和青色渐变背景，希腊雕塑半身像，棕榈树，复古电脑窗口，低保真美学。`],
    color: 'bg-pink-100 text-pink-800 border-pink-300',
  },
  {
    id: 'art-new-chinese',
    name: '新中式',
    category: '潮流与艺术',
    prompts: [`新中式风格，{product}放置在宣纸纹理背景前，搭配枯山水、松枝，淡雅水墨色调，禅意宁静，东方美学。`],
    color: 'bg-stone-50 text-stone-600 border-stone-300',
  },
  {
    id: 'art-pop',
    name: '波普艺术',
    category: '潮流与艺术',
    prompts: [`波普艺术风格，{product}背景是重复的波点图案，高对比度色彩，漫画风格，安迪·沃霍尔式，鲜艳活泼。`],
    color: 'bg-yellow-100 text-yellow-900 border-yellow-400',
  },
  {
    id: 'art-surreal',
    name: '超现实',
    category: '潮流与艺术',
    prompts: [`超现实主义场景，{product}漂浮在空中，周围是融化的时钟和云梯，达利风格，梦境般的荒原，奇异独特。`],
    color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  },
  {
    id: 'art-tech',
    name: '硬核科技',
    category: '潮流与艺术',
    prompts: [`{product}悬浮在发光的电路板之上，蓝色数据流，芯片纹理，高科技电子产品风格，未来感。`],
    color: 'bg-blue-900 text-blue-100 border-blue-700',
  },
  {
    id: 'art-origami',
    name: '折纸艺术',
    category: '潮流与艺术',
    prompts: [`{product}置身于层层叠叠的纸艺场景中，几何折纸风格的云朵和山峦，柔和的纸张阴影，童话感。`],
    color: 'bg-orange-50 text-orange-600 border-orange-200',
  },

  // ========================
  // 9. 光影与氛围 (Atmosphere)
  // ========================
  {
    id: 'light-golden',
    name: '日落金光',
    category: '光影与氛围',
    prompts: [`{product}在日落时的黄金光线下，温暖的橙色光晕，逆光拍摄，轮廓发光，唯美感性。`],
    color: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    id: 'light-neon',
    name: '霓虹夜色',
    category: '光影与氛围',
    prompts: [`{product}沐浴在粉色和蓝色的霓虹灯管光线下，黑暗背景，夜店风，高反差，潮流酷炫。`],
    color: 'bg-purple-900 text-purple-100 border-purple-700',
  },
  {
    id: 'light-shadows',
    name: '斑驳树影',
    category: '光影与氛围',
    prompts: [`{product}上有百叶窗或树叶投下的斑驳阴影，午后慵懒阳光，极简墙面背景，叙事感强。`],
    color: 'bg-gray-100 text-gray-600 border-gray-300',
  },
  {
    id: 'light-underwater',
    name: '深海光束',
    category: '光影与氛围',
    prompts: [`{product}沉入水底，光线透过水面折射下来（丁达尔效应），深蓝背景，气泡，宁静致远。`],
    color: 'bg-blue-900 text-blue-100 border-blue-700',
  },
  {
    id: 'light-studio-high',
    name: '高调白底',
    category: '光影与氛围',
    prompts: [`{product}在纯白无缝背景中，明亮的均匀布光，无阴影，高调商业摄影，极致清晰，强调细节。`],
    color: 'bg-white text-gray-400 border-gray-200',
  },
  {
    id: 'light-candle',
    name: '烛光晚餐',
    category: '光影与氛围',
    prompts: [`{product}在黑暗环境中被烛光照亮，暖黄色调，模糊的红酒杯背景，浪漫私密。`],
    color: 'bg-orange-900 text-orange-100 border-orange-800',
  },
  {
    id: 'light-bokeh',
    name: '梦幻光斑',
    category: '光影与氛围',
    prompts: [`{product}背景是五彩斑斓的失焦光斑（Bokeh），夜晚城市灯光，梦幻迷离，突出主体。`],
    color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  },
  {
    id: 'light-rim',
    name: '边缘轮廓',
    category: '光影与氛围',
    prompts: [`全黑背景，仅用轮廓光勾勒{product}的边缘，神秘，高级，强调线条美感。`],
    color: 'bg-black text-gray-300 border-gray-700',
  }
];
