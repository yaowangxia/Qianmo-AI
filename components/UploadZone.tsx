
import React, { useRef, useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { GenerationMode, DrawingTool } from '../types';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  currentImage: string | null;
  onClear: () => void;
  // Editing props
  mode: GenerationMode;
  brushSize: number;
  toolType: DrawingTool;
  drawingColor: string;
  onMaskChange: (base64Mask: string | null) => void;
  triggerClearMask: number; // Signal to clear mask
}

const UploadZone: React.FC<UploadZoneProps> = ({ 
  onFileSelect, 
  currentImage, 
  onClear,
  mode,
  brushSize,
  toolType,
  drawingColor,
  onMaskChange,
  triggerClearMask
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const isEditing = mode === GenerationMode.EDIT || mode === GenerationMode.REMOVE;
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Initialize Canvas size to match Image natural size
  useEffect(() => {
    if (currentImage && isEditing && imageRef.current && canvasRef.current) {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      
      const initCanvas = () => {
         canvas.width = img.naturalWidth;
         canvas.height = img.naturalHeight;
         clearCanvas();
      };

      if (img.complete) {
        initCanvas();
      } else {
        img.onload = initCanvas;
      }
    }
  }, [currentImage, isEditing]);

  // Clear mask signal listener
  useEffect(() => {
    if (isEditing) {
      clearCanvas();
    }
  }, [triggerClearMask]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onMaskChange(null); // Clear mask in parent
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, width: number) => {
    const headLen = width * 3; 
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(toX, toY);
    ctx.fill();
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditing || !canvasRef.current) return;
    
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    const scaledBrushSize = brushSize * (canvasRef.current.width / 1000 * 3);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Logic Split: 
    // REMOVE mode -> Always Red (Visual) -> Exported as Mask later
    // EDIT mode -> User Selected Color -> Exported as is later
    const visualColor = mode === GenerationMode.REMOVE ? 'rgba(255, 50, 50, 0.6)' : drawingColor;

    ctx.strokeStyle = visualColor;
    ctx.fillStyle = visualColor;
    ctx.lineWidth = scaledBrushSize;

    if (toolType === 'brush') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else {
      // Shapes and Arrows need start pos
      setStartPos(coords);
      setSnapshot(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !isEditing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);

    if (toolType === 'brush') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (startPos && snapshot) {
      ctx.putImageData(snapshot, 0, 0);
      
      const width = coords.x - startPos.x;
      const height = coords.y - startPos.y;
      
      if (toolType === 'rect') {
        ctx.fillRect(startPos.x, startPos.y, width, height);
      } else if (toolType === 'circle') {
         ctx.beginPath();
         const radius = Math.sqrt(width * width + height * height);
         ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
         ctx.fill();
      } else if (toolType === 'arrow') {
        const scaledBrushSize = brushSize * (canvasRef.current.width / 1000 * 3);
        drawArrow(ctx, startPos.x, startPos.y, coords.x, coords.y, scaledBrushSize);
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStartPos(null);
    setSnapshot(null);
    exportLayer();
  };

  const exportLayer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Logic Split:
    // REMOVE mode: Export Binary Mask (Black Background, White Shape)
    // EDIT mode: Export Visual Layer (Transparent Background, Colored Shape)
    
    if (mode === GenerationMode.REMOVE) {
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const mCtx = maskCanvas.getContext('2d');
      if (!mCtx) return;

      // 1. Fill black
      mCtx.fillStyle = '#000000';
      mCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      // 2. Draw shapes from source
      mCtx.globalCompositeOperation = 'source-over';
      mCtx.drawImage(canvas, 0, 0);
      
      // 3. Turn shapes white
      mCtx.globalCompositeOperation = 'source-in';
      mCtx.fillStyle = '#FFFFFF';
      mCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
      
      // 4. Restore black bg
      mCtx.globalCompositeOperation = 'destination-over';
      mCtx.fillStyle = '#000000';
      mCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      const base64 = maskCanvas.toDataURL('image/png').split(',')[1];
      onMaskChange(base64);
    } else {
      // EDIT Mode: Just export the transparent canvas content
      const base64 = canvas.toDataURL('image/png').split(',')[1];
      onMaskChange(base64);
    }
  };

  if (currentImage) {
    return (
      <div className="flex flex-col gap-2">
        {isEditing && (
          <div className={`text-xs py-1 px-2 rounded flex justify-between items-center ${mode === GenerationMode.REMOVE ? 'bg-red-50 text-red-700' : 'bg-indigo-50 text-indigo-700'}`}>
             <span>
               {mode === GenerationMode.REMOVE ? '🖍️ 涂抹需要消除的区域' : '🖌️ 使用工具在图片上进行视觉标记'}
             </span>
             <span className="text-[10px] opacity-70">{canvasRef.current ? `${canvasRef.current.width}x${canvasRef.current.height}px` : ''}</span>
          </div>
        )}
        
        <div 
          ref={containerRef}
          className={`relative w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group select-none ${isEditing ? 'cursor-crosshair' : ''}`}
          style={{ 
            minHeight: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
            {/* Base Image */}
            <img 
              ref={imageRef}
              src={currentImage} 
              alt="原始商品" 
              className="max-w-full max-h-[500px] object-contain pointer-events-none"
              style={{ userSelect: 'none' }}
              onLoad={() => {
                if(canvasRef.current && imageRef.current) {
                   canvasRef.current.width = imageRef.current.naturalWidth;
                   canvasRef.current.height = imageRef.current.naturalHeight;
                }
              }}
            />
            
            {/* Drawing Canvas */}
            {isEditing && (
               <canvas
                 ref={canvasRef}
                 onMouseDown={startDrawing}
                 onMouseMove={draw}
                 onMouseUp={stopDrawing}
                 onMouseLeave={stopDrawing}
                 onTouchStart={startDrawing}
                 onTouchMove={draw}
                 onTouchEnd={stopDrawing}
                 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 touch-none"
                 style={{
                   width: imageRef.current ? imageRef.current.clientWidth : 'auto',
                   height: imageRef.current ? imageRef.current.clientHeight : 'auto',
                 }}
               />
            )}

            {/* Default Hover Actions */}
            {!isEditing && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
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
            )}
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
        支持 PNG, JPG。
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
