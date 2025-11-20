
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SAMPLE_PROMPTS, ASPECT_RATIOS, MATTING_PROMPT, HD_SUFFIX } from '../constants';
import { AppState, AspectRatio, GenerationMode, Dimensions, PresetStyle } from '../types';
import { Wand2, Loader2, Eraser, Crop, Sparkles, PenTool, RefreshCw, Settings2, ImagePlus, X, Droplets } from 'lucide-react';

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
}

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
  setIsTransparent
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
  const generatePromptFromStyle = (style: PresetStyle) => {
    const templates = style.prompts;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const productTerm = "画面中的主体商品"; 
    return randomTemplate.replace(/\{product\}/g, productTerm);
  };

  // Handle manual typing
  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPrompt(e.target.value);
    setSelectedStyleId(null); 
    if (mode !== GenerationMode.MATTING) {
      setPrompt(e.target.value + (isHD ? HD_SUFFIX : ''));
    }
  };

  // Handle style selection
  const handleStyleClick = (style: PresetStyle) => {
    setSelectedStyleId(style.id);
    const newPrompt = generatePromptFromStyle(style);
    setCustomPrompt(newPrompt);
    setPrompt(newPrompt + (isHD ? HD_SUFFIX : ''));
    setMode(GenerationMode.SCENE);
  };

  // Handle refresh prompt
  const handleRefreshPrompt = () => {
    if (selectedStyleId) {
      const style = SAMPLE_PROMPTS.find(s => s.id === selectedStyleId);
      if (style) {
        const newPrompt = generatePromptFromStyle(style);
        setCustomPrompt(newPrompt);
        setPrompt(newPrompt + (isHD ? HD_SUFFIX : ''));
      }
    }
  };

  const handleRefFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onReferenceImageSelect(e.target.files[0]);
    }
  };

  // Effect: Update prompt based on mode/HD
  useEffect(() => {
    if (mode === GenerationMode.MATTING) {
      setPrompt(MATTING_PROMPT);
    } else if (mode === GenerationMode.SCENE) {
      if (styleSource === 'REFERENCE' && !customPrompt) {
          // Default prompt for reference mode if empty
          // Note: The detailed instruction is prepended in the service
          setPrompt("完美融合参考风格，智能补全光影与细节。" + (isHD ? HD_SUFFIX : ''));
      } else if (customPrompt) {
        setPrompt(customPrompt + (isHD ? HD_SUFFIX : ''));
      }
    } else if (mode === GenerationMode.EDIT) {
       setPrompt(customPrompt);
    }
  }, [mode, isHD, setPrompt, styleSource]); 

  // Effect: When switching to Reference mode, clear preset selection
  useEffect(() => {
    if (styleSource === 'REFERENCE') {
        setSelectedStyleId(null);
    }
  }, [styleSource]);

  return (
    <div className="space-y-6">
      
      {/* Mode Selection */}
      <div className="bg-slate-50 p-1 rounded-xl flex text-sm font-medium shadow-inner">
        <button
          onClick={() => setMode(GenerationMode.SCENE)}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${mode === GenerationMode.SCENE ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Sparkles className="w-4 h-4" /> 场景生成
        </button>
        <button
          onClick={() => setMode(GenerationMode.EDIT)}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${mode === GenerationMode.EDIT ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <PenTool className="w-4 h-4" /> 智能重绘
        </button>
        <button
          onClick={() => setMode(GenerationMode.MATTING)}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${mode === GenerationMode.MATTING ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Eraser className="w-4 h-4" /> 自动抠图
        </button>
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <Crop className="w-4 h-4 text-slate-500" /> 画幅尺寸
        </label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => setAspectRatio(ratio.value)}
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
        
        {aspectRatio === 'custom' && (
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

      {/* Style Selection / Reference Image Toggle */}
      {mode === GenerationMode.SCENE && (
        <div className="space-y-3">
           <div className="flex items-center gap-4 border-b border-slate-200 pb-1">
             <button 
                onClick={() => setStyleSource('PRESET')}
                className={`text-sm font-semibold pb-2 px-1 transition-colors ${styleSource === 'PRESET' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
             >
               预设风格库
             </button>
             <button 
                onClick={() => setStyleSource('REFERENCE')}
                className={`text-sm font-semibold pb-2 px-1 transition-colors ${styleSource === 'REFERENCE' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
             >
               参考图生成 (图生图)
             </button>
           </div>

           {styleSource === 'PRESET' ? (
              <div className="max-h-80 overflow-y-auto pr-1 custom-scrollbar space-y-5 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                {Object.entries(categories).map(([catName, styles]) => (
                  <div key={catName}>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 border-b border-slate-200 pb-1">{catName}</h4>
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
                 <label className="block text-xs font-medium text-slate-600 mb-2">上传参考海报（AI将模仿其构图与风格）</label>
                 
                 {!referenceImage ? (
                   <div 
                     onClick={() => refFileInputRef.current?.click()}
                     className="flex flex-col items-center justify-center py-6 px-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer text-center"
                   >
                     <ImagePlus className="w-6 h-6 text-indigo-400 mb-2" />
                     <span className="text-sm text-indigo-600 font-medium">点击上传参考图</span>
                     <span className="text-xs text-slate-400 mt-1">支持 JPG / PNG</span>
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
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center">
                        <span className="text-xs text-white font-medium">已加载参考风格</span>
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

      {/* Text Input Area */}
      <div className="relative">
        <label htmlFor="prompt" className="block text-sm font-semibold text-slate-900 mb-2 flex justify-between items-end">
          <span>
            {mode === GenerationMode.SCENE 
               ? (styleSource === 'REFERENCE' ? '补充描述 (AI将自动优化细节)' : '生成提示词') 
               : mode === GenerationMode.EDIT 
               ? '重绘指令' 
               : '提示词 (自动)'}
            {mode === GenerationMode.EDIT && <span className="text-xs font-normal text-slate-500 ml-2">例如：把背景换成沙滩...</span>}
          </span>
          
          {/* Refresh Button for Scene Mode */}
          {mode === GenerationMode.SCENE && selectedStyleId && styleSource === 'PRESET' && (
            <button 
              onClick={handleRefreshPrompt}
              className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md"
              title="换一组描述"
            >
              <RefreshCw className="w-3 h-3" /> 刷新描述
            </button>
          )}
        </label>
        
        <div className="relative">
          <textarea
            id="prompt"
            value={mode === GenerationMode.MATTING ? MATTING_PROMPT : customPrompt}
            onChange={handleCustomPromptChange}
            readOnly={mode === GenerationMode.MATTING}
            placeholder={
              mode === GenerationMode.EDIT ? "描述您想修改的地方..." : 
              styleSource === 'REFERENCE' ? "AI 将自动分析产品材质并匹配参考图。您也可以补充具体要求，例如：'保持金色调，但背景更亮一些'..." :
              "选择风格后自动生成，支持手动修改..."
            }
            className={`w-full p-3 rounded-lg border text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24 text-sm leading-relaxed ${mode === GenerationMode.MATTING ? 'bg-slate-100 text-slate-500' : 'bg-white border-slate-300'}`}
          />
        </div>
      </div>

      {/* Optimization Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* HD Toggle */}
        <div className="flex items-center justify-between bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
          <label className="flex items-center gap-3 cursor-pointer select-none w-full">
            <div className="relative flex-shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isHD} 
                onChange={(e) => setIsHD(e.target.checked)}
                disabled={mode === GenerationMode.MATTING}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 text-sm flex items-center gap-1">
                 高清修复 & 细节 <Settings2 className="w-3 h-3 text-indigo-500" />
              </span>
              <span className="text-xs text-slate-500">增强照片真实感与光影</span>
            </div>
          </label>
        </div>

        {/* Transparent Material Toggle */}
        <div className="flex items-center justify-between bg-cyan-50/50 p-3 rounded-lg border border-cyan-100">
          <label className="flex items-center gap-3 cursor-pointer select-none w-full">
            <div className="relative flex-shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isTransparent} 
                onChange={(e) => setIsTransparent(e.target.checked)}
                disabled={mode === GenerationMode.MATTING}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 text-sm flex items-center gap-1">
                 透明/玻璃材质 <Droplets className="w-3 h-3 text-cyan-500" />
              </span>
              <span className="text-xs text-slate-500">增强透光、折射与焦散效果</span>
            </div>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={!hasImage || (!prompt.trim() && mode !== GenerationMode.MATTING) || isLoading}
        className={`w-full py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-white shadow-lg transition-all transform active:scale-[0.98]
          ${!hasImage || isLoading 
            ? 'bg-slate-300 cursor-not-allowed shadow-none' 
            : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-200'
          }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {mode === GenerationMode.MATTING ? '正在智能抠图...' : mode === GenerationMode.EDIT ? '正在重绘中...' : '正在生成海报...'}
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            {mode === GenerationMode.MATTING ? '开始自动抠图' : mode === GenerationMode.EDIT ? '执行局部重绘' : '立即生成海报'}
          </>
        )}
      </button>
      
      {!hasImage && (
        <p className="text-center text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
          请先在左侧上传一张商品图片。
        </p>
      )}
    </div>
  );
};

export default Controls;
