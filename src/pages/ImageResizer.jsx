import React, { useState, useCallback } from 'react';
import { Upload, Download, X, Maximize, Smartphone, Monitor } from 'lucide-react';
import { resizeImage, formatFileSize } from '../utils/imageUtils';

const ImageResizer = () => {
  const [images, setImages] = useState([]);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target.files);
    const newImages = await Promise.all(
      files.map(async (file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              resolve({
                id: Math.random().toString(36).substr(2, 9),
                file,
                filename: file.name,
                width: img.width,
                height: img.height,
                size: file.size,
                preview: e.target.result,
                processedBlob: null,
                status: 'idle'
              });
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        });
      })
    );
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleResizeAll = async () => {
    setIsProcessing(true);
    const updatedImages = [...images];
    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      img.status = 'processing';
      setImages([...updatedImages]);
      
      const blob = await resizeImage(
        img.file, 
        width ? parseInt(width) : null, 
        height ? parseInt(height) : null, 
        maintainAspectRatio
      );
      
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Image Resizer</h1>
        <p className="text-text-muted">Change dimensions while maintaining perfect quality.</p>
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
              <p className="text-sm text-text-muted font-mono mt-1">JPG, PNG, WebP supported</p>
            </div>
            <input id="fileInput" type="file" multiple className="hidden" onChange={onDrop} />
          </div>
        ) : (
          <div className="space-y-8">
             <div className="bg-bg-soft rounded-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 border border-border-light items-end">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-sub uppercase tracking-widest">Width (PX)</label>
                  <input 
                    type="number" 
                    value={width} 
                    onChange={e => setWidth(e.target.value)}
                    placeholder="Auto"
                    className="bg-white border border-border-light rounded-md px-4 py-2 focus:outline-none focus:border-primary font-bold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-sub uppercase tracking-widest">Height (PX)</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={e => setHeight(e.target.value)}
                    placeholder="Auto"
                    className="bg-white border border-border-light rounded-md px-4 py-2 focus:outline-none focus:border-primary font-bold"
                  />
                </div>
                <div className="flex items-center gap-2 pb-3">
                  <input 
                    type="checkbox" 
                    id="aspect"
                    checked={maintainAspectRatio} 
                    onChange={e => setMaintainAspectRatio(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="aspect" className="text-xs font-bold text-text-sub uppercase tracking-widest cursor-pointer">Lock Aspect Ratio</label>
                </div>
                <button 
                  onClick={handleResizeAll}
                  disabled={isProcessing}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-black/10 hover:bg-primary-h transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Resizing...' : 'Resize All'}
                </button>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="border border-border-light rounded-xl p-4 flex items-center gap-6 bg-white">
                    <img src={img.preview} alt="" className="w-16 h-16 object-cover rounded-md border border-border-light" />
                    <div className="flex-grow">
                      <div className="font-bold text-sm truncate">{img.filename}</div>
                      <div className="text-[11px] text-text-muted font-mono">{img.width}×{img.height} · {formatFileSize(img.size)}</div>
                    </div>
                    {img.status === 'done' && (
                      <button 
                        onClick={() => {
                          const url = URL.createObjectURL(img.processedBlob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `resized-${img.filename}`;
                          a.click();
                        }}
                        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        <Download size={16} />
                      </button>
                    )}
                    {img.status === 'idle' && (
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

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-soft p-6 rounded-xl border border-border-light text-center">
           <Monitor className="mx-auto mb-3 text-text-muted" />
           <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Social Presets</h4>
           <div className="flex justify-center gap-2 mt-3">
              <button onClick={() => { setWidth(1080); setHeight(1080); }} className="text-[10px] font-bold border border-border-light px-2 py-1 rounded bg-white hover:border-primary">Instagram</button>
              <button onClick={() => { setWidth(1920); setHeight(1080); }} className="text-[10px] font-bold border border-border-light px-2 py-1 rounded bg-white hover:border-primary">YouTube</button>
           </div>
        </div>
        <div className="bg-bg-soft p-6 rounded-xl border border-border-light text-center">
           <Smartphone className="mx-auto mb-3 text-text-muted" />
           <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Device Presets</h4>
           <div className="flex justify-center gap-2 mt-3">
              <button onClick={() => { setWidth(1170); setHeight(2532); }} className="text-[10px] font-bold border border-border-light px-2 py-1 rounded bg-white hover:border-primary">iPhone 13</button>
              <button onClick={() => { setWidth(1080); setHeight(2400); }} className="text-[10px] font-bold border border-border-light px-2 py-1 rounded bg-white hover:border-primary">Android</button>
           </div>
        </div>
        <div className="bg-bg-soft p-6 rounded-xl border border-border-light text-center">
           <Maximize className="mx-auto mb-3 text-text-muted" />
           <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Standard</h4>
           <div className="flex justify-center gap-2 mt-3">
              <button onClick={() => { setWidth(1920); setHeight(1080); }} className="text-[10px] font-bold border border-border-light px-2 py-1 rounded bg-white hover:border-primary">1080p</button>
              <button onClick={() => { setWidth(1280); setHeight(720); }} className="text-[10px] font-bold border border-border-light px-2 py-1 rounded bg-white hover:border-primary">720p</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;
