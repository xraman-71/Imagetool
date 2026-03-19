import React, { useState, useCallback } from 'react';
import { Upload, Download, X, Sun, Contrast, Ghost, Palette, Wind, Droplet, Thermometer, Cloud, Circle, RefreshCw } from 'lucide-react';
import { applyFilters, formatFileSize } from '../utils/imageUtils';

const ImageFilters = () => {
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hue: 0,
    saturate: 100,
    invert: 0,
    warmth: 0,
    fade: 0,
    vignette: 0,
    opacity: 100,
    tint: 0,
    noise: 0,
    posterize: 0,
    sharpen: 0
  });
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

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      sepia: 0,
      blur: 0,
      hue: 0,
      saturate: 100,
      invert: 0,
      warmth: 0,
      fade: 0,
      vignette: 0,
      opacity: 100,
      tint: 0,
      noise: 0,
      posterize: 0,
      sharpen: 0
    });
  };

  const handleApplyAll = async () => {
    setIsProcessing(true);
    const updatedImages = [...images];
    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      img.status = 'processing';
      setImages([...updatedImages]);
      
      const blob = await applyFilters(img.file, filters);
      img.processedBlob = blob;
      img.status = 'done';
      setImages([...updatedImages]);
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">AI-Free Image Filters</h1>
        <p className="text-text-muted text-lg">Enhance your photos with instant, browser-based visual effects.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border-2 border-border-main rounded-2xl p-6 shadow-sm lg:sticky lg:top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-text uppercase tracking-widest text-xs flex items-center gap-2">
                <Palette size={16}/> Adjustments
              </h3>
              <button onClick={resetFilters} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">Reset All</button>
            </div>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { label: 'Brightness', name: 'brightness', icon: Sun, min: 0, max: 200, unit: '%' },
                { label: 'Contrast', name: 'contrast', icon: Contrast, min: 0, max: 200, unit: '%' },
                { label: 'Saturation', name: 'saturate', icon: Droplet, min: 0, max: 200, unit: '%' },
                { label: 'Temperature', name: 'warmth', icon: Thermometer, min: -100, max: 100, unit: '' },
                { label: 'Grayscale', name: 'grayscale', icon: Ghost, min: 0, max: 100, unit: '%' },
                { label: 'Sepia', name: 'sepia', icon: Wind, min: 0, max: 100, unit: '%' },
                { label: 'Invert Colors', name: 'invert', icon: RefreshCw, min: 0, max: 100, unit: '%' },
                { label: 'Fade Effect', name: 'fade', icon: Cloud, min: 0, max: 100, unit: '%' },
                { label: 'Vignette', name: 'vignette', icon: Circle, min: 0, max: 100, unit: '%' },
                { label: 'Opacity', name: 'opacity', icon: Ghost, min: 0, max: 100, unit: '%' },
                { label: 'Color Tint', name: 'tint', icon: Palette, min: 0, max: 100, unit: '%' },
                { label: 'Film Noise', name: 'noise', icon: Cloud, min: 0, max: 100, unit: '%' },
                { label: 'Posterize', name: 'posterize', icon: Palette, min: 0, max: 20, unit: '' },
                { label: 'Sharpen', name: 'sharpen', icon: Sun, min: 0, max: 100, unit: '%' },
              ].map(f => (
                <div key={f.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-sub flex items-center gap-2"><f.icon size={14}/> {f.label}</label>
                    <span className="text-[10px] font-mono font-bold bg-bg-soft px-2 py-0.5 rounded border border-border-light">{filters[f.name]}{f.unit}</span>
                  </div>
                  <input 
                    type="range" min={f.min} max={f.max} value={filters[f.name]} 
                    onChange={e => handleFilterChange(f.name, e.target.value)}
                    className="w-full h-1.5 bg-bg-soft rounded-lg appearance-none cursor-pointer accent-primary border border-border-light"
                  />
                </div>
              ))}
              
              <div className="space-y-2 pt-2 border-t border-border-light">
                 <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-sub">Blur Intensity</label>
                    <span className="text-[10px] font-mono font-bold bg-bg-soft px-2 py-0.5 rounded border border-border-light">{filters.blur}px</span>
                  </div>
                  <input 
                    type="range" min="0" max="20" value={filters.blur} 
                    onChange={e => handleFilterChange('blur', e.target.value)}
                    className="w-full h-1.5 bg-bg-soft rounded-lg appearance-none cursor-pointer accent-primary border border-border-light"
                  />
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleApplyAll}
                  disabled={images.length === 0 || isProcessing}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-black/20 hover:bg-primary-h transition-all hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Processing...' : 'Apply Filters To All'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {images.length === 0 ? (
            <div 
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
              className="border-2 border-dashed border-border-light rounded-2xl p-32 flex flex-col items-center gap-4 bg-white hover:border-primary transition-all cursor-pointer group shadow-sm"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div className="w-20 h-20 bg-bg-soft rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload size={32} className="text-text-muted" />
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-text">Select images to edit</p>
                <p className="text-sm text-text-muted font-mono mt-1">Browser-based processing · No uploads</p>
              </div>
              <input id="fileInput" type="file" multiple className="hidden" onChange={onDrop} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {images.map((img) => (
                 <div key={img.id} className="bg-white border border-border-light rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:border-border-main transition-colors overflow-hidden">
                    <div className="relative aspect-video bg-bg-soft rounded-xl overflow-hidden border border-border-light">
                       <img 
                        src={img.preview} 
                        alt="" 
                        className="w-full h-full object-contain transition-all duration-300 z-0" 
                        style={{ 
                          filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) blur(${filters.blur}px) hue-rotate(${filters.hue}deg) saturate(${filters.saturate}%) invert(${filters.invert}%) opacity(${filters.opacity}%)` 
                        }}
                       />
                       {(filters.warmth !== 0) && (
                         <div className="absolute inset-0 mix-blend-overlay pointer-events-none transition-all duration-300 z-10" style={{ backgroundColor: filters.warmth > 0 ? `rgba(255, 150, 0, ${filters.warmth/100 * 0.3})` : `rgba(0, 150, 255, ${Math.abs(filters.warmth)/100 * 0.3})` }} />
                       )}
                       {(filters.fade > 0) && (
                         <div className="absolute inset-0 pointer-events-none transition-all duration-300 z-20" style={{ backgroundColor: `rgba(255, 255, 255, ${filters.fade / 100 * 0.5})` }} />
                       )}
                       {(filters.vignette > 0) && (
                         <div className="absolute inset-0 pointer-events-none transition-all duration-300 z-30" style={{ background: `radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,${filters.vignette/100}))` }} />
                       )}
                       {(filters.tint > 0) && (
                         <div className="absolute inset-0 mix-blend-color pointer-events-none transition-all duration-300 z-30" style={{ backgroundColor: `rgba(255, 0, 128, ${filters.tint / 100})` }} />
                       )}
                       {(filters.noise > 0) && (
                         <div className="absolute inset-0 pointer-events-none transition-all duration-300 z-30 opacity-50" style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')`, opacity: filters.noise / 100 }} />
                       )}
                       {(filters.posterize > 0) && (
                          <div className="absolute inset-0 pointer-events-none transition-all duration-300 z-30 backdrop-blur-[2px] backdrop-contrast-150 backdrop-saturate-150" style={{ opacity: filters.posterize / 20 }} />
                       )}
                       {(filters.sharpen > 0) && (
                          <div className="absolute inset-0 pointer-events-none transition-all duration-300 z-30 backdrop-contrast-125 backdrop-brightness-110" style={{ opacity: filters.sharpen / 100 }} />
                       )}
                       {img.status === 'processing' && (
                         <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest animate-pulse">
                           Processing...
                         </div>
                       )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <div className="min-w-0">
                          <div className="font-bold text-sm truncate max-w-[150px]">{img.filename}</div>
                          <div className="text-[10px] text-text-muted font-mono">{formatFileSize(img.size)}</div>
                       </div>
                       
                       <div className="flex gap-2">
                          {img.status === 'done' ? (
                            <button 
                              onClick={() => {
                                const url = URL.createObjectURL(img.processedBlob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `filtered-${img.filename}`;
                                a.click();
                              }}
                              className="p-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                            >
                              <Download size={16} />
                            </button>
                          ) : (
                            <button onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))} className="p-2.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <X size={18} />
                            </button>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
               
               <button 
                onClick={() => document.getElementById('fileInput').click()}
                className="bg-bg-soft border-2 border-dashed border-border-light rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-white transition-all group"
               >
                  <PlusCircle size={24} className="text-text-muted group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold text-text-muted group-hover:text-text">Add More</span>
                  <input id="fileInput" type="file" multiple className="hidden" onChange={onDrop} />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simplified PlusCircle if Lucide doesn't have it in scope
const PlusCircle = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

export default ImageFilters;
