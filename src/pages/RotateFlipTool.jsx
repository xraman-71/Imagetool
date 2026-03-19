import React, { useState, useCallback } from 'react';
import { Upload, Download, X, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Zap } from 'lucide-react';
import { rotateFlipImage, formatFileSize } from '../utils/imageUtils';

const RotateFlipTool = () => {
  const [images, setImages] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      filename: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      processedBlob: null,
      status: 'idle'
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleProcessAll = async () => {
    setIsProcessing(true);
    const updatedImages = [...images];
    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      img.status = 'processing';
      setImages([...updatedImages]);
      
      const blob = await rotateFlipImage(img.file, rotation, flipH, flipV);
      img.processedBlob = blob;
      img.status = 'done';
      setImages([...updatedImages]);
    }
    setIsProcessing(false);
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Rotate & Flip</h1>
        <p className="text-text-muted">Fix image orientation instantly in your browser.</p>
      </div>

      <div className="bg-white border-2 border-border-main rounded-2xl p-8 shadow-sm">
        {images.length === 0 ? (
          <div 
            onDragOver={e => e.preventDefault()}
            onDrop={onDrop}
            className="border-2 border-dashed border-border-light rounded-xl p-20 flex flex-col items-center gap-4 bg-bg-soft hover:border-primary transition-colors cursor-pointer"
            onClick={() => document.getElementById('fileInput').click()}
          >
            <Upload size={48} className="text-text-muted" />
            <div className="text-center">
              <p className="font-semibold text-lg">Drop your images here</p>
              <p className="text-sm text-text-muted font-mono mt-1">Rotate 90°, 180°, 270° or Flip</p>
            </div>
            <input id="fileInput" type="file" multiple className="hidden" onChange={onDrop} />
          </div>
        ) : (
          <div className="space-y-8">
             <div className="bg-bg-soft rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border border-border-light">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-sub uppercase tracking-widest">Rotation Angle</label>
                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-1 rounded border border-border-light">{rotation}°</span>
                  </div>
                  <input 
                    type="range" min="0" max="360" value={rotation} 
                    onChange={e => setRotation(parseInt(e.target.value))}
                    className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-primary border border-border-light"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setRotation(r => (r - 90 + 360) % 360)} className="flex-1 py-2 text-[10px] font-bold bg-white border border-border-light rounded-md hover:border-primary transition-all">-90°</button>
                    <button onClick={() => setRotation(0)} className="flex-1 py-2 text-[10px] font-bold bg-white border border-border-light rounded-md hover:border-primary transition-all">Reset</button>
                    <button onClick={() => setRotation(r => (r + 90) % 360)} className="flex-1 py-2 text-[10px] font-bold bg-white border border-border-light rounded-md hover:border-primary transition-all">+90°</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-text-sub uppercase tracking-widest block">Mirroring & Actions</label>
                  <div className="flex gap-4">
                    <div className="flex gap-2">
                      <button onClick={() => setFlipH(!flipH)} title="Flip Horizontal" className={`p-3 border rounded-lg transition-all ${flipH ? 'bg-primary text-white border-primary' : 'bg-white border-border-light hover:border-primary'}`}><FlipHorizontal size={20}/></button>
                      <button onClick={() => setFlipV(!flipV)} title="Flip Vertical" className={`p-3 border rounded-lg transition-all ${flipV ? 'bg-primary text-white border-primary' : 'bg-white border-border-light hover:border-primary'}`}><FlipVertical size={20}/></button>
                    </div>
                    
                    <button 
                      onClick={handleProcessAll}
                      disabled={isProcessing}
                      className="flex-grow bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-black/10 hover:bg-primary-h transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Zap size={18} fill="currentColor"/> {isProcessing ? 'Processing...' : 'Apply to All'}
                    </button>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="border border-border-light rounded-xl p-4 flex items-center gap-6 bg-white overflow-hidden">
                    <div className="relative">
                       <img 
                        src={img.preview} 
                        alt="" 
                        className="w-16 h-16 object-cover rounded-md border border-border-light transition-transform duration-300" 
                        style={{ transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})` }}
                       />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-bold text-sm truncate">{img.filename}</div>
                      <div className="text-[11px] text-text-muted font-mono">{formatFileSize(img.size)}</div>
                    </div>
                    {img.status === 'done' ? (
                       <button 
                        onClick={() => {
                          const url = URL.createObjectURL(img.processedBlob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `rotated-${img.filename}`;
                          a.click();
                        }}
                        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                       >
                         <Download size={16} />
                       </button>
                    ) : (
                      <button onClick={() => removeImage(img.id)} className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-md">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RotateFlipTool;
