
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SAMPLE_PROMPTS, ASPECT_RATIOS, MATTING_PROMPT, HD_SUFFIX, REMOVE_PROMPT } from '../constants';
import { AppState, AspectRatio, GenerationMode, Dimensions, PresetStyle, DrawingTool } from '../types';
import { Wand2, Loader2, Eraser, Crop, Sparkles, PenTool, RefreshCw, Settings2, ImagePlus, X, Droplets, Brush, Square, Trash2, Circle, Scissors, MoveRight, Palette } from 'lucide-react';

interface ControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  appState: AppState;
  onGenerate: () => void;
  hasImage: boolean;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  customDimensions: Dimensions;
  setCustomDimensions: (dims: Dimensions) => void;
  mode: GenerationMode;
  setMode: (mode: GenerationMode) => void;
  isHD: boolean;
  setIsHD: (isHD: boolean) => void;
  // Reference Image Props
  referenceImage: string | null;
  onReferenceImageSelect: (file: File) => void;
  onClearReferenceImage: () => void;
  // Transparent Material
  isTransparent: boolean;
  setIsTransparent: (val: boolean) => void;
  // Brush Props
  brushSize: number;
  setBrushSize: (size: number) => void;
  toolType: DrawingTool;
  setToolType: (t: DrawingTool) => void;
  drawingColor: string;
  setDrawingColor: (color: string) => void;
  onClearMask: () => void;
}

const COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#000000', // Black
  '#ffffff', // White
];

const Controls: React.FC<ControlsProps> = ({ 
  prompt, 
  setPrompt, 
  appState, 
  onGenerate,
  hasImage,
  aspectRatio,
  setAspectRatio,
  customDimensions,
  setCustomDimensions,
  mode,
  setMode,
  isHD,
  setIsHD,
  referenceImage,
  onReferenceImageSelect,
  onClearReferenceImage,
  isTransparent,
  setIsTransparent,
  brushSize,
  setBrushSize,
  toolType,
  setToolType,
  drawingColor,
  setDrawingColor,
  onClearMask
}) => {
  const isLoading = appState === AppState.GENERATING;
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  
  // Style Source Mode: 'PRESET' | 'REFERENCE'
  const [styleSource, setStyleSource] = useState<'PRESET' | 'REFERENCE'>('PRESET');
  const refFileInputRef = useRef<HTMLInputElement>(null);

  // Group styles by category
  const categories = useMemo(() => {
    const cats: Record<string, PresetStyle[]> = {};
    SAMPLE_PROMPTS.forEach(style => {
      if (!cats[style.category]) {
        cats[style.category] = [];
      }
      cats[style.category].push(style);
    });
    return cats;
  }, []);

  // Helper to generate prompt from template
  const generatePromptFromStyle = (style: PresetStyle, currentPromptRaw: string = '') => {
    const templates = style.prompts;
    if (!templates || templates.length === 0) return "";
    if (templates.length === 1) {
        return templates[0].replace(/\{product\}/g, "画面中的主体商品");
    }

    let newPrompt = "";
    let attempts = 0;
    const currentClean = currentPromptRaw.replace(HD_SUFFIX, '');

    do {
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        newPrompt = randomTemplate.replace(/\{product\}/g, "画面中的主体商品");
        attempts++;
    } while (newPrompt === currentClean && attempts < 10); 

    return newPrompt;
  };

  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPrompt(e.target.value);
    setSelectedStyleId(null); 
    if (mode !== GenerationMode.MATTING && mode !== GenerationMode.REMOVE) {
      setPrompt(e.target.value + (isHD ? HD_SUFFIX : ''));
    }
  };

  const handleStyleClick = (style: PresetStyle) => {
    setSelectedStyleId(style.id);
    const newPrompt = generatePromptFromStyle(style);
    setCustomPrompt(newPrompt);
    setPrompt(newPrompt + (isHD ? HD_SUFFIX : ''));
    setMode(GenerationMode.SCENE);
  };

  const handleRefreshPrompt = () => {
    if (selectedStyleId) {
      const style = SAMPLE_PROMPTS.find(s => s.id === selectedStyleId);
      if (style) {
        const newPrompt = generatePromptFromStyle(style, customPrompt);
        setCustomPrompt(newPrompt);
        setPrompt(newPrompt + (isHD ? HD_SUFFIX : ''));
      }
    }
  };

  const handleRefFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onReferenceImageSelect(e.target.files[0]);
      // Auto-fill prompt for reference style transfer
      const autoPrompt = "Visual Style Transfer: Analyze the lighting, mood, and background texture of the reference image. Generate a NEW scene for the main product that mimics this style. Do not copy the reference composition exactly; adapt it to create a balanced commercial poster.";
      setCustomPrompt(autoPrompt);
      setPrompt(autoPrompt + (isHD ? HD_SUFFIX : ''));
    }
  };

  useEffect(() => {
    if (mode === GenerationMode.MATTING) {
      setPrompt(MATTING_PROMPT);
    } else if (mode === GenerationMode.REMOVE) {
      setPrompt(REMOVE_PROMPT);
    } else if (mode === GenerationMode.SCENE) {
      // If user switched to Reference mode but hasn't typed anything, give them a hint in prompt
      if (styleSource === 'REFERENCE' && !customPrompt) {
          // This is handled by handleRefFileChange mostly, but as a fallback
          const fallback = "Visual Style Transfer: Create a similar environment to the reference image but adapt the composition to fit the product naturally.";
          setPrompt(fallback + (isHD ? HD_SUFFIX : ''));
      } else if (customPrompt) {
        setPrompt(customPrompt + (isHD ? HD_SUFFIX : ''));
      }
    } else if (mode === GenerationMode.EDIT) {
       setPrompt(customPrompt);
    }
  }, [mode, isHD, setPrompt, styleSource, customPrompt]); 

  useEffect(() => {
    if (styleSource === 'REFERENCE') {
        setSelectedStyleId(null);
    }
  }, [styleSource]);

  return (
    <div className="space-y-6">
      
      {/* Mode Selection */}
      <div className="bg-slate-50 p-1 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-1 text-sm font-medium shadow-inner">
        <button
          onClick={() => setMode(GenerationMode.SCENE)}
          className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${mode === GenerationMode.SCENE ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Sparkles className="w-4 h-4" /> 场景生成
        </button>
        <button
          onClick={() => setMode(GenerationMode.EDIT)}
          className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${mode === GenerationMode.EDIT ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <PenTool className="w-4 h-4" /> 视觉编辑
        </button>
        <button
          onClick={() => setMode(GenerationMode.REMOVE)}
          className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${mode === GenerationMode.REMOVE ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Eraser className="w-4 h-4" /> 智能消除
        </button>
        <button
          onClick={() => setMode(GenerationMode.MATTING)}
          className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${mode === GenerationMode.MATTING ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Scissors className="w-4 h-4" /> 自动抠图
        </button>
      </div>

      {/* Tools Panel (For EDIT or REMOVE) */}
      {(mode === GenerationMode.EDIT || mode === GenerationMode.REMOVE) && (
        <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3 animate-in fade-in duration-300">
           <div className="flex items-center justify-between">
             <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-2">
                {mode === GenerationMode.REMOVE ? <Eraser className="w-3 h-3" /> : <PenTool className="w-3 h-3" />}
                {mode === GenerationMode.REMOVE ? '涂抹要消除的区域' : '在图片上绘制修改指令'}
             </label>
             <button 
               onClick={onClearMask}
               className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
             >
               <Trash2 className="w-3 h-3" /> 清除标记
             </button>
           </div>
           
           {/* Tool Selection */}
           <div className="flex items-center gap-2 flex-wrap">
             <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                <button 
                  onClick={() => setToolType('brush')}
                  className={`p-2 rounded-md transition-all ${toolType === 'brush' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="自由画笔"
                >
                  <Brush className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setToolType('arrow')}
                  className={`p-2 rounded-md transition-all ${toolType === 'arrow' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="箭头标记"
                >
                  <MoveRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setToolType('rect')}
                  className={`p-2 rounded-md transition-all ${toolType === 'rect' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="矩形框选"
                >
                  <Square className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setToolType('circle')}
                  className={`p-2 rounded-md transition-all ${toolType === 'circle' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="圆形框选"
                >
                  <Circle className="w-4 h-4" />
                </button>
             </div>
             
             <div className="flex-1 flex items-center gap-2 px-2 min-w-[100px]">
                <input 
                  type="range" 
                  min="5" 
                  max="80" 
                  value={brushSize} 
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  title="线条粗细"
                />
             </div>
           </div>

           {/* Color Picker (Only for Edit Mode) */}
           {mode === GenerationMode.EDIT && (
             <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
               <Palette className="w-3 h-3 text-slate-400" />
               <div className="flex gap-1 flex-wrap">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setDrawingColor(c)}
                      className={`w-6 h-6 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110 ${drawingColor === c ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <div className="relative flex items-center justify-center w-6 h-6 rounded-full border border-slate-200 overflow-hidden">
                     <input 
                       type="color" 
                       value={drawingColor}
                       onChange={(e) => setDrawingColor(e.target.value)}
                       className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                     />
                  </div>
               </div>
             </div>
           )}

           <p className="text-[10px] text-amber-600 bg-amber-50 p-1.5 rounded">
              提示：在【视觉编辑】模式下，您的标记会合成到原图上一起发给AI。请在下方提示词中引用您的标记，例如"把红色箭头指向的区域变成..."
           </p>
        </div>
      )}

      {/* Aspect Ratio - NOW ENABLED FOR REFERENCE MODE TOO */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2 justify-between">
          <span className="flex items-center gap-2"><Crop className="w-4 h-4 text-slate-500" /> 画幅尺寸</span>
          {(mode === GenerationMode.EDIT || mode === GenerationMode.REMOVE) ? (
            <span className="text-[10px] text-slate-400 font-normal bg-slate-100 px-2 py-0.5 rounded">
              已锁定为原图比例
            </span>
          ) : (
             styleSource === 'REFERENCE' && (
              <span className="text-[10px] text-indigo-500 font-normal bg-indigo-50 px-2 py-0.5 rounded">
                AI 将自动适配此比例
              </span>
             )
          )}
        </label>
        
        <div className={`grid grid-cols-3 gap-2 mb-3 ${(mode === GenerationMode.EDIT || mode === GenerationMode.REMOVE) ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => setAspectRatio(ratio.value)}
              disabled={mode === GenerationMode.EDIT || mode === GenerationMode.REMOVE}
              className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                aspectRatio === ratio.value 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>{ratio.label.split(' ')[0]}</span>
              <span className="opacity-60 scale-90">{ratio.label.split(' ')[1] || 'Custom'}</span>
            </button>
          ))}
        </div>
        
        {aspectRatio === 'custom' && mode !== GenerationMode.EDIT && mode !== GenerationMode.REMOVE && (
           <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">宽度 (px)</label>
                <input 
                  type="number" 
                  value={customDimensions.width}
                  onChange={(e) => setCustomDimensions({...customDimensions, width: Number(e.target.value)})}
                  className="w-full p-2 text-sm border border-slate-300 rounded"
                />
              </div>
              <span className="text-slate-400 pt-5">×</span>
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">高度 (px)</label>
                <input 
                  type="number" 
                  value={customDimensions.height}
                  onChange={(e) => setCustomDimensions({...customDimensions, height: Number(e.target.value)})}
                  className="w-full p-2 text-sm border border-slate-300 rounded"
                />
              </div>
           </div>
        )}
      </div>

      {/* Style Selection */}
      {mode === GenerationMode.SCENE && (
        <div className="space-y-3">
           <div className="flex items-center gap-4 border-b border-slate-200 pb-1">
             <button 
                onClick={() => setStyleSource('PRESET')}
                className={`text-sm font-semibold pb-2 px-1 transition-colors ${styleSource === 'PRESET' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
             >
               风格库 (200+)
             </button>
             <button 
                onClick={() => setStyleSource('REFERENCE')}
                className={`text-sm font-semibold pb-2 px-1 transition-colors ${styleSource === 'REFERENCE' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
             >
               参考图 (图生图)
             </button>
           </div>

           {styleSource === 'PRESET' ? (
              <div className="max-h-80 overflow-y-auto pr-1 custom-scrollbar space-y-5 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                {Object.entries(categories).map(([catName, styles]) => (
                  <div key={catName}>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 border-b border-slate-200 pb-1 sticky top-0 bg-slate-50/95 backdrop-blur-sm py-1 z-10">{catName}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(styles as PresetStyle[]).map((style) => (
                        <button
                          key={style.id}
                          onClick={() => handleStyleClick(style)}
                          className={`text-left p-2.5 rounded-lg border text-xs transition-all hover:shadow-sm ${style.color} ${selectedStyleId === style.id ? 'ring-2 ring-indigo-500 ring-offset-1 shadow-md transform scale-[1.02]' : 'opacity-90 hover:opacity-100'}`}
                        >
                          <div className="font-semibold truncate">{style.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
           ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50">
                 <label className="block text-xs font-medium text-slate-600 mb-2">上传参考海报 (复刻风格与光影)</label>
                 {!referenceImage ? (
                   <div 
                     onClick={() => refFileInputRef.current?.click()}
                     className="flex flex-col items-center justify-center py-6 px-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer text-center"
                   >
                     <ImagePlus className="w-6 h-6 text-indigo-400 mb-2" />
                     <span className="text-sm text-indigo-600 font-medium">点击上传</span>
                     <span className="text-xs text-slate-400 mt-1">AI 将模仿此图的光影和质感，但会自动适配您的尺寸</span>
                   </div>
                 ) : (
                   <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <img src={referenceImage} alt="参考风格" className="w-full h-32 object-contain bg-slate-100" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                           onClick={onClearReferenceImage}
                           className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                         >
                           <X className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                 )}
                 <input 
                    type="file" 
                    ref={refFileInputRef} 
                    onChange={handleRefFileChange} 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/webp"
                  />
              </div>
           )}
        </div>
      )}

      {/* Text Input */}
      <div className="relative">
        <label htmlFor="prompt" className="block text-sm font-semibold text-slate-900 mb-2 flex justify-between items-end">
          <span>
            {mode === GenerationMode.SCENE 
               ? '生成提示词' 
               : mode === GenerationMode.EDIT 
               ? '编辑指令' 
               : mode === GenerationMode.REMOVE
               ? '操作指令'
               : '提示词 (自动)'}
            
            {mode === GenerationMode.EDIT && <span className="text-xs font-normal text-slate-500 ml-2">描述如何处理标记区域...</span>}
          </span>
          
          {mode === GenerationMode.SCENE && selectedStyleId && styleSource === 'PRESET' && (
            <button 
              onClick={handleRefreshPrompt}
              className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md active:scale-95"
              title="换一组描述"
            >
              <RefreshCw className="w-3 h-3" /> 换个描述
            </button>
          )}
        </label>
        
        <div className="relative">
          {mode === GenerationMode.REMOVE ? (
            <div className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 h-24 flex items-center justify-center text-slate-500 text-sm italic">
              <Eraser className="w-4 h-4 mr-2" /> 已启用智能消除，请在图片上涂抹红色区域。
            </div>
          ) : (
            <textarea
              id="prompt"
              value={mode === GenerationMode.MATTING ? MATTING_PROMPT : customPrompt}
              onChange={handleCustomPromptChange}
              readOnly={mode === GenerationMode.MATTING}
              placeholder={
                mode === GenerationMode.EDIT ? "例如：把红色圆圈里的背景换成沙滩... 或者：在蓝色箭头指向的地方添加一个Logo..." : 
                "描述您想要的效果..."
              }
              className={`w-full p-3 rounded-lg border text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24 text-sm leading-relaxed ${mode === GenerationMode.MATTING ? 'bg-slate-100 text-slate-500' : 'bg-white border-slate-300'}`}
            />
          )}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={!hasImage || (!prompt.trim() && mode !== GenerationMode.MATTING && mode !== GenerationMode.REMOVE) || isLoading}
        className={`w-full py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-white shadow-lg transition-all transform active:scale-[0.98]
          ${!hasImage || isLoading 
            ? 'bg-slate-300 cursor-not-allowed shadow-none' 
            : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-200'
          }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            处理中...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            {mode === GenerationMode.MATTING ? '开始自动抠图' : mode === GenerationMode.EDIT ? '执行视觉编辑' : mode === GenerationMode.REMOVE ? '一键智能消除' : '立即生成海报'}
          </>
        )}
      </button>
    </div>
  );
};

export default Controls;
