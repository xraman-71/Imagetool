import React, { useState, useCallback } from 'react';
import { Upload, Download, X, Eye, CheckCircle2, Info } from 'lucide-react';
import { extractDPI, setDPIMetadata, formatFileSize } from '../utils/imageUtils';

const DpiChanger = () => {
  const [images, setImages] = useState([]);
  const [targetDpi, setTargetDpi] = useState(300);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target.files);
    const newImages = await Promise.all(
      files.filter(f => f.type === 'image/jpeg' || f.type === 'image/png').map(async (file) => {
        const originalDpi = await extractDPI(file);
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              resolve({
                id: Math.random().toString(36).substr(2, 9),
                file,
                filename: file.name,
                originalDpi,
                newDpi: originalDpi,
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

  const handleApplyAll = async () => {
    setIsProcessing(true);
    const updatedImages = [...images];
    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      img.status = 'processing';
      setImages([...updatedImages]);
      
      const blob = await setDPIMetadata(img.file, targetDpi, img.file.type);
      img.processedBlob = blob;
      img.newDpi = targetDpi;
      img.status = 'done';
      setImages([...updatedImages]);
    }
    setIsProcessing(false);
  };

  const handleDownload = (img) => {
    const url = URL.createObjectURL(img.processedBlob || img.file);
    const a = document.createElement('a');
    a.href = url;
    const nameWithoutExt = img.filename.replace(/\.[^/.]+$/, '');
    const ext = img.filename.split('.').pop();
    a.download = `${nameWithoutExt}-${img.newDpi}dpi.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">DPI Changer</h1>
        <p className="text-text-muted">Update image resolution metadata without losing quality.</p>
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
              <p className="font-semibold text-lg">Drop your images here or click to browse</p>
              <p className="text-sm text-text-muted font-mono mt-1">JPG, PNG · Max 100 MB per file</p>
            </div>
            <input id="fileInput" type="file" multiple accept="image/jpeg,image/png" className="hidden" onChange={onDrop} />
          </div>
        ) : (
          <div className="space-y-8">
             <div className="bg-bg-soft rounded-xl p-6 flex flex-wrap items-center gap-6 border border-border-light">
                <div className="flex flex-col gap-2 flex-grow min-w-[200px]">
                  <label className="text-sm font-bold text-text-sub uppercase tracking-wider">Target DPI</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={targetDpi} 
                      onChange={e => setTargetDpi(parseInt(e.target.value))}
                      className="flex-grow bg-white border border-border-light rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                    />
                    <div className="flex gap-1">
                      {[72, 96, 150, 300].map(val => (
                        <button 
                          key={val} 
                          onClick={() => setTargetDpi(val)}
                          className={`px-3 py-1 text-xs font-bold rounded-md border transition-colors ${targetDpi === val ? 'bg-primary text-white border-primary' : 'bg-white text-text-sub border-border-light hover:border-primary'}`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleApplyAll}
                  disabled={isProcessing}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-black/10 hover:bg-primary-h transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Apply to All'}
                </button>
             </div>

             <div className="overflow-x-auto border border-border-main rounded-xl">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-bg-soft border-b border-border-main">
                   <tr>
                     <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-text-sub">Preview</th>
                     <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-text-sub">Info</th>
                     <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-text-sub">Current</th>
                     <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-text-sub">New</th>
                     <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-text-sub">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border-light">
                    {images.map((img) => (
                      <tr key={img.id} className="hover:bg-bg-soft/50 transition-colors">
                        <td className="p-4">
                          <img src={img.preview} alt="" className="w-16 h-16 object-cover rounded-md border border-border-light" />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-sm truncate max-w-[150px]">{img.filename}</div>
                          <div className="text-[11px] text-text-muted font-mono">{img.width}×{img.height} · {formatFileSize(img.size)}</div>
                        </td>
                        <td className="p-4 font-mono text-sm">{img.originalDpi} DPI</td>
                        <td className="p-4 font-mono text-sm text-primary font-bold">{img.status === 'done' ? img.newDpi : (isProcessing ? '...' : '—')} DPI</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                             {img.status === 'done' ? (
                               <button 
                                onClick={() => handleDownload(img)}
                                className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                title="Download"
                               >
                                 <Download size={16} />
                               </button>
                             ) : (
                               <button 
                                onClick={() => removeImage(img.id)}
                                className="p-2 bg-red-50 text-red-500 border border-red-100 rounded-md hover:bg-red-500 hover:text-white transition-all"
                                title="Remove"
                               >
                                 <X size={16} />
                               </button>
                             )}
                          </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
             
             {images.length > 0 && (
               <div className="flex justify-between items-center">
                 <button onClick={() => setImages([])} className="text-sm font-bold text-red-500 hover:underline">Clear all</button>
                 <p className="text-xs text-text-muted italic">Images are processed 100% locally in your browser.</p>
               </div>
             )}
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-bg-soft p-6 rounded-xl border border-border-light">
          <h3 className="flex items-center gap-2 font-bold mb-3 text-text"><Info size={18}/> What is DPI?</h3>
          <p className="text-sm text-text-sub leading-relaxed">
            DPI (Dots Per Inch) is metadata that tells printers how to size your image. Changing DPI doesn't change pixel dimensions or visual quality — it only affects the physical size of the print.
          </p>
        </div>
        <div className="bg-bg-soft p-6 rounded-xl border border-border-light">
          <h3 className="flex items-center gap-2 font-bold mb-3 text-text"><CheckCircle2 size={18}/> Why focus on privacy?</h3>
          <p className="text-sm text-text-sub leading-relaxed">
            Standard online tools upload your files to a server. PixelTools processes everything on your device, meaning your sensitive images never leave your computer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DpiChanger;
