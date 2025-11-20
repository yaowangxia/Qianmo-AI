import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  currentImage: string | null;
  onClear: () => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, currentImage, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  if (currentImage) {
    return (
      <div className="relative w-full aspect-square md:aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
        <img 
          src={currentImage} 
          alt="原始商品" 
          className="w-full h-full object-contain p-4"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button 
            onClick={triggerUpload}
            className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium shadow-lg hover:bg-slate-50"
          >
            更换图片
          </button>
          <button 
            onClick={onClear}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-red-600"
          >
            移除
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp"
        />
      </div>
    );
  }

  return (
    <div 
      onClick={triggerUpload}
      className="w-full aspect-square md:aspect-[4/3] border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
        <Upload className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">上传商品图</h3>
      <p className="text-sm text-slate-500 mb-4">点击选择文件</p>
      <p className="text-xs text-slate-400 max-w-xs">
        支持 PNG, JPG。建议使用白底或透明背景的图片以获得最佳效果。
      </p>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  );
};

export default UploadZone;