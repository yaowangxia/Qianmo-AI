
import React, { useState } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import Controls from './components/Controls';
import ResultDisplay from './components/ResultDisplay';
import { AppState, AspectRatio, GenerationMode, Dimensions, DrawingTool } from './types';
import { generateProductPoster, fileToBase64 } from './services/geminiService';

// Icon imports
import { ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceMimeType, setSourceMimeType] = useState<string>('image/png');
  const [rawBase64, setRawBase64] = useState<string | null>(null);

  // Reference Image State
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [rawReferenceBase64, setRawReferenceBase64] = useState<string | null>(null);
  
  // Editing / Mask / Visual Mark State
  const [maskBase64, setMaskBase64] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState<number>(30);
  const [toolType, setToolType] = useState<DrawingTool>('brush');
  const [drawingColor, setDrawingColor] = useState<string>('#ef4444'); // Default Red
  const [triggerClearMask, setTriggerClearMask] = useState<number>(0);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Config State
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [customDimensions, setCustomDimensions] = useState<Dimensions>({ width: 1080, height: 1080 });
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.SCENE);
  const [isHD, setIsHD] = useState<boolean>(false);
  const [isTransparent, setIsTransparent] = useState<boolean>(false);

  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handlers
  const handleFileSelect = async (file: File) => {
    try {
      const raw = await fileToBase64(file);
      setRawBase64(raw);
      setSourceMimeType(file.type);
      
      const dataUri = `data:${file.type};base64,${raw}`;
      setSourceImage(dataUri);
      
      setAppState(AppState.IDLE);
      setGeneratedImage(null);
      setErrorMessage(null);
      setMaskBase64(null);
    } catch (e) {
      console.error("File reading error", e);
      setErrorMessage("读取文件失败。");
    }
  };

  const handleReferenceSelect = async (file: File) => {
    try {
      const raw = await fileToBase64(file);
      setRawReferenceBase64(raw);
      const dataUri = `data:${file.type};base64,${raw}`;
      setReferenceImage(dataUri);
    } catch (e) {
      console.error("Reference file error", e);
    }
  };

  const handleClearReference = () => {
    setReferenceImage(null);
    setRawReferenceBase64(null);
  };

  const handleClearImage = () => {
    setSourceImage(null);
    setRawBase64(null);
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setPrompt('');
    setMode(GenerationMode.SCENE);
    setMaskBase64(null);
    handleClearReference();
  };

  const handleRefine = () => {
    if (generatedImage && generatedImage.startsWith('data:image/')) {
      setSourceImage(generatedImage);
      const base64 = generatedImage.split(',')[1];
      setRawBase64(base64);
      setSourceMimeType('image/jpeg');
      setGeneratedImage(null);
      setMode(GenerationMode.EDIT);
      setPrompt(''); 
      setAppState(AppState.IDLE);
      setMaskBase64(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGenerate = async () => {
    if (!rawBase64) return;

    setAppState(AppState.GENERATING);
    setErrorMessage(null);

    try {
      const resultBase64 = await generateProductPoster(
        rawBase64, 
        sourceMimeType, 
        prompt,
        aspectRatio,
        customDimensions,
        mode === GenerationMode.SCENE ? rawReferenceBase64 : null,
        isTransparent,
        (mode === GenerationMode.EDIT || mode === GenerationMode.REMOVE) ? maskBase64 : null, 
        mode
      );
      
      const resultDataUri = `data:image/jpeg;base64,${resultBase64}`;
      setGeneratedImage(resultDataUri);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMessage(err.message || "生成图片失败，请重试。");
    }
  };

  const handleClearMask = () => {
    setTriggerClearMask(prev => prev + 1);
    setMaskBase64(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Panel: Input & Controls */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  {(mode === GenerationMode.EDIT || mode === GenerationMode.REMOVE) ? '区域编辑' : '上传商品'}
                </div>
                {mode === GenerationMode.EDIT && (
                  <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                    视觉编辑
                  </span>
                )}
                {mode === GenerationMode.REMOVE && (
                  <span className="text-xs font-normal text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    消除模式
                  </span>
                )}
              </h2>
              <UploadZone 
                onFileSelect={handleFileSelect} 
                currentImage={sourceImage}
                onClear={handleClearImage}
                // Edit Mode Props
                mode={mode}
                brushSize={brushSize}
                toolType={toolType}
                drawingColor={drawingColor}
                onMaskChange={setMaskBase64}
                triggerClearMask={triggerClearMask}
              />
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex-grow transition-all hover:shadow-md">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                AI 创意工坊
              </h2>
              <Controls 
                prompt={prompt}
                setPrompt={setPrompt}
                appState={appState}
                onGenerate={handleGenerate}
                hasImage={!!sourceImage}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                customDimensions={customDimensions}
                setCustomDimensions={setCustomDimensions}
                mode={mode}
                setMode={setMode}
                isHD={isHD}
                setIsHD={setIsHD}
                referenceImage={referenceImage}
                onReferenceImageSelect={handleReferenceSelect}
                onClearReferenceImage={handleClearReference}
                isTransparent={isTransparent}
                setIsTransparent={setIsTransparent}
                // Brush props
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                toolType={toolType}
                setToolType={setToolType}
                drawingColor={drawingColor}
                setDrawingColor={setDrawingColor}
                onClearMask={handleClearMask}
              />
            </section>
          </div>

          {/* Mobile only arrow */}
          <div className="lg:hidden flex justify-center py-2">
             <ArrowRight className="text-slate-300 rotate-90 animate-bounce" />
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-7 flex flex-col">
             <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 h-full flex flex-col min-h-[600px] transition-all">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  设计成品
                </h2>
                <div className="flex-grow">
                  <ResultDisplay 
                    generatedImage={generatedImage} 
                    appState={appState}
                    error={errorMessage}
                    onRefine={handleRefine}
                  />
                </div>
             </div>
          </div>

        </div>
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
         <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2 text-center text-slate-400 text-sm">
           <p>&copy; {new Date().getFullYear()} 阡陌 AI. 为电商而生。</p>
           <p className="text-xs">Powered by Google Gemini 2.5 Flash Image Model</p>
         </div>
      </footer>
    </div>
  );
};

export default App;
