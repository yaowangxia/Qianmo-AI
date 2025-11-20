import React from 'react';
import { Download, XCircle, Brush } from 'lucide-react';
import { AppState } from '../types';

interface ResultDisplayProps {
  generatedImage: string | null; // Base64 URL
  appState: AppState;
  error: string | null;
  onRefine: () => void; // Callback to refine/edit result
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, appState, error, onRefine }) => {
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `product-poster-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (appState === AppState.ERROR) {
     return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-red-50 rounded-2xl border border-red-100 p-6">
        <XCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">生成失败</h3>
        <p className="text-sm text-red-600 text-center max-w-md">
          {error || "与 Gemini 通信时发生未知错误。"}
        </p>
      </div>
    );
  }

  if (appState === AppState.GENERATING) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 animate-pulse opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center">
           <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
           <h3 className="text-lg font-medium text-slate-700">正在设计您的海报...</h3>
           <p className="text-sm text-slate-500 mt-2">AI 正在构思创意细节 (Gemini 2.5)</p>
        </div>
      </div>
    );
  }

  if (!generatedImage) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6">
        <div className="opacity-20 mb-4">
          <svg className="w-24 h-24 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
             <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
             <circle cx="8.5" cy="8.5" r="1.5"></circle>
             <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-400">尚未生成海报</h3>
        <p className="text-sm text-slate-400 text-center mt-1 max-w-xs">
          在左侧上传图片并选择风格，AI 将为您创造惊艳的视觉效果。
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow bg-slate-800 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 group flex items-center justify-center">
        <img 
          src={generatedImage} 
          alt="生成的海报" 
          className="max-w-full max-h-full object-contain shadow-2xl"
        />
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
           <button 
            onClick={onRefine}
            className="flex items-center gap-2 px-5 py-3 bg-white text-indigo-900 rounded-full hover:bg-indigo-50 transition-all shadow-xl font-semibold transform hover:scale-105"
           >
             <Brush className="w-4 h-4" /> 局部重绘 / 精修
           </button>
           <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-xl font-semibold transform hover:scale-105"
           >
             <Download className="w-4 h-4" /> 下载图片
           </button>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center px-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
           <span className="w-2 h-2 rounded-full bg-green-400"></span>
           生成完成
        </div>
        <p className="text-xs text-slate-400">Gemini 2.5 Flash Image</p>
      </div>
    </div>
  );
};

export default ResultDisplay;
