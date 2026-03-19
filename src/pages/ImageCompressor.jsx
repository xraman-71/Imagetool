import React, { useState, useCallback } from 'react';
import { Upload, Download, X, Sliders, CheckCircle2, Info, Maximize, Zap, Shield, Target } from 'lucide-react';
import { compressImage, formatFileSize } from '../utils/imageUtils';

const ImageCompressor = () => {
  const [images, setImages] = useState([]);
  const [targetSize, setTargetSize] = useState(500);
  const [sizeUnit, setSizeUnit] = useState('KB');
  const [maxWidth, setMaxWidth] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target.files);
    const newImages = await Promise.all(
      files.filter(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)).map(async (file) => {
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
                processedSize: null,
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

  const handleCompressAll = async () => {
    setIsProcessing(true);
    const updatedImages = [...images];
    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      img.status = 'processing';
      setImages([...updatedImages]);
      
      const targetKB = sizeUnit === 'MB' ? targetSize * 1024 : targetSize;
      
      const blob = await compressImage(
        img.file, 
        targetKB, 
        maxWidth ? parseInt(maxWidth) : null, 
        maxHeight ? parseInt(maxHeight) : null
      );
      
      img.processedBlob = blob;
      img.processedSize = blob.size;
      img.status = 'done';
      setImages([...updatedImages]);
    }
    setIsProcessing(false);
  };

  const handleDownload = (img) => {
    const url = URL.createObjectURL(img.processedBlob);
    const a = document.createElement('a');
    a.href = url;
    const nameWithoutExt = img.filename.replace(/\.[^/.]+$/, '');
    a.download = `${nameWithoutExt}-pixeltools.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Image Compressor</h1>
        <p className="text-text-muted">Compress images to a specific size without losing visual clarity.</p>
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
              <p className="font-semibold text-lg">Drop your JPG/PNG/WebP images here</p>
              <p className="text-sm text-text-muted font-mono mt-1">Up to 50 images at once · Max 100 MB each</p>
            </div>
            <input id="fileInput" type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onDrop} />
          </div>
        ) : (
          <div className="space-y-8">
              <div className="bg-white border-2 border-border-main rounded-3xl p-8 shadow-sm">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                        <Box size={14}/> Target File Size
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={targetSize} 
                          onChange={e => setTargetSize(parseFloat(e.target.value) || 0)}
                          className="w-full bg-bg-soft border border-border-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-bold shadow-inner"
                        />
                        <select 
                          value={sizeUnit} 
                          onChange={e => setSizeUnit(e.target.value)}
                          className="bg-bg-soft border border-border-light rounded-xl px-3 py-3 focus:outline-none focus:border-primary font-bold text-xs shadow-inner cursor-pointer"
                        >
                          <option value="KB">KB</option>
                          <option value="MB">MB</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                        <Maximize2 size={14}/> Max Width (PX)
                      </label>
                      <input 
                        type="number" 
                        value={maxWidth} 
                        onChange={e => setMaxWidth(e.target.value)}
                        placeholder="Automatic"
                        className="w-full bg-bg-soft border border-border-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-bold shadow-inner"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                        <Maximize2 size={14}/> Max Height (PX)
                      </label>
                      <input 
                        type="number" 
                        value={maxHeight} 
                        onChange={e => setMaxHeight(e.target.value)}
                        placeholder="Automatic"
                        className="w-full bg-bg-soft border border-border-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-bold shadow-inner"
                      />
                    </div>
                 </div>

                 <div className="pt-6 border-t border-border-light">
                   <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Quick Presets</p>
                   <div className="flex flex-wrap gap-2">
                     {[
                       { label: 'Web (500KB)', size: 500, unit: 'KB', w: 1920 },
                       { label: 'Email (2MB)', size: 2, unit: 'MB', w: 1200 },
                       { label: 'Discord (8MB)', size: 8, unit: 'MB', w: '' },
                       { label: 'Thumbnail (50KB)', size: 50, unit: 'KB', w: 400 },
                     ].map((p, idx) => (
                       <button 
                         key={idx}
                         onClick={() => {
                           setTargetSize(p.size);
                           setSizeUnit(p.unit);
                           if (p.w) setMaxWidth(p.w);
                         }}
                         className="px-4 py-2 bg-bg-soft border border-border-light rounded-full text-[10px] font-bold hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95"
                       >
                         {p.label}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="flex justify-center pt-10">
                   <button 
                     onClick={handleCompressAll}
                     disabled={isProcessing}
                     className="w-full md:w-auto bg-primary text-white px-16 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20 hover:bg-primary-h transition-all hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-3"
                   >
                     {isProcessing ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     ) : <Zap size={22} fill="currentColor"/>}
                     {isProcessing ? 'Processing...' : 'Start Batch Compression'}
                   </button>
                 </div>
              </div>

             <div className="grid grid-cols-1 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="border border-border-light rounded-xl p-4 flex items-center gap-6 hover:border-border-main transition-colors bg-white">
                    <img src={img.preview} alt="" className="w-20 h-20 object-cover rounded-lg border border-border-light shadow-sm" />
                    
                    <div className="flex-grow min-w-0">
                      <div className="font-bold text-sm truncate">{img.filename}</div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="text-[11px] text-text-muted border-r pr-4 border-border-light">
                          Original: <span className="font-bold text-text-sub">{formatFileSize(img.size)}</span>
                        </div>
                        {img.status === 'done' && (
                          <div className="text-[11px] text-green-600 font-bold">
                            Compressed: {formatFileSize(img.processedSize)} ({Math.round((1 - img.processedSize/img.size) * 100)}% smaller)
                          </div>
                        )}
                        {img.status === 'processing' && (
                          <div className="text-[11px] text-primary animate-pulse font-bold italic">Processing...</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {img.status === 'done' ? (
                        <button 
                          onClick={() => handleDownload(img)}
                          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-bold shadow-sm"
                        >
                          <Download size={16} /> Download
                        </button>
                      ) : (
                        <button 
                          onClick={() => removeImage(img.id)}
                          className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="flex justify-between items-center pt-4 border-t border-border-light">
                <button onClick={() => setImages([])} className="text-sm font-bold text-red-500 hover:underline">Clear all images</button>
                <div className="flex items-center gap-4 text-[11px] text-text-muted">
                   <div className="flex items-center gap-1"><Shield size={12}/> 100% Private</div>
                   <div className="flex items-center gap-1"><Maximize size={12}/> Resize Support</div>
                   <div className="flex items-center gap-1"><Target size={12}/> Precision Logic</div>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-bg-soft p-6 rounded-xl border border-border-light">
          <h3 className="flex items-center gap-2 font-bold mb-3 text-text"><Sliders size={18}/> Precision Compression</h3>
          <p className="text-sm text-text-sub leading-relaxed">
            Our algorithm uses a 12-step binary search to find the perfect JPEG quality for your target file size. It's more than a slider — it's math working for you.
          </p>
        </div>
        <div className="bg-bg-soft p-6 rounded-xl border border-border-light">
          <h3 className="flex items-center gap-2 font-bold mb-3 text-text"><CheckCircle2 size={18}/> Perfect for Web</h3>
          <p className="text-sm text-text-sub leading-relaxed">
            Automatically convert large PNGs to optimized JPEGs to significantly reduce load times without sacrificing perceivable image details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;
