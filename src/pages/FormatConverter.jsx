import React, { useState, useCallback } from 'react';
import { Upload, Download, X, Repeat, FileCode, Image as ImageIcon } from 'lucide-react';
import { convertFormat, formatFileSize } from '../utils/imageUtils';

const FormatConverter = () => {
  const [images, setImages] = useState([]);
  const [targetFormat, setTargetFormat] = useState('webp');
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

  const handleConvertAll = async () => {
    setIsProcessing(true);
    const updatedImages = [...images];
    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      img.status = 'processing';
      setImages([...updatedImages]);
      
      const blob = await convertFormat(img.file, targetFormat);
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Format Converter</h1>
        <p className="text-text-muted">Convert images between JPG, PNG, and WebP instantly.</p>
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
              <p className="text-sm text-text-muted font-mono mt-1">Convert to WebP, PNG, or JPG</p>
            </div>
            <input id="fileInput" type="file" multiple className="hidden" onChange={onDrop} />
          </div>
        ) : (
          <div className="space-y-8">
             <div className="bg-bg-soft rounded-xl p-6 flex flex-wrap items-center gap-6 border border-border-light">
                <div className="flex flex-col gap-2 flex-grow">
                  <label className="text-xs font-bold text-text-sub uppercase tracking-widest">Target Format</label>
                  <div className="flex gap-2">
                    {['webp', 'png', 'jpeg'].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setTargetFormat(f)}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold border transition-all uppercase tracking-tighter ${targetFormat === f ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-text-sub border-border-light hover:border-primary'}`}
                      >
                         {f === 'jpeg' ? 'JPG' : f}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleConvertAll}
                  disabled={isProcessing}
                  className="bg-primary text-white px-12 py-3 rounded-lg font-bold shadow-lg shadow-black/10 hover:bg-primary-h transition-all disabled:opacity-50 h-[52px] mt-6"
                >
                  {isProcessing ? 'Converting...' : 'Convert All ✨'}
                </button>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="border border-border-light rounded-xl p-4 flex items-center gap-6 bg-white">
                    <img src={img.preview} alt="" className="w-16 h-16 object-cover rounded-md border border-border-light" />
                    <div className="flex-grow min-w-0">
                      <div className="font-bold text-sm truncate">{img.filename}</div>
                      <div className="text-[11px] text-text-muted font-mono">{formatFileSize(img.size)}</div>
                    </div>
                    {img.status === 'done' ? (
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase tracking-widest">Ready</span>
                          <button 
                            onClick={() => {
                              const url = URL.createObjectURL(img.processedBlob);
                              const a = document.createElement('a');
                              a.href = url;
                              const currentName = img.filename.replace(/\.[^/.]+$/, '');
                              a.download = `${currentName}.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`;
                              a.click();
                            }}
                            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                          >
                            <Download size={16} />
                          </button>
                       </div>
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

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-bg-soft p-6 rounded-xl border border-border-light">
          <h3 className="flex items-center gap-2 font-bold mb-3 text-text"><Repeat size={18}/> Why WebP?</h3>
          <p className="text-sm text-text-sub leading-relaxed">
            WebP provides superior lossless and lossy compression for images on the web. It is on average 26% smaller in size compared to PNGs and 25-34% smaller compared to JPEGs.
          </p>
        </div>
        <div className="bg-bg-soft p-6 rounded-xl border border-border-light">
          <h3 className="flex items-center gap-2 font-bold mb-3 text-text"><FileCode size={18}/> Preservation</h3>
          <p className="text-sm text-text-sub leading-relaxed">
            Our converter uses the Canvas API to decode and re-encode images 100% locally. This ensures no data is sent to a server and your privacy is totally protected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormatConverter;
