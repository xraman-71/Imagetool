import React, { useState, useRef, useEffect } from 'react';
import { Upload, Copy, Pipette, Palette, Check, RefreshCw } from 'lucide-react';
import { formatFileSize } from '../utils/imageUtils';

const ColorPicker = () => {
  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState('');
  const [selectedColor, setSelectedColor] = useState('#1a1a1a');
  const [palette, setPalette] = useState([]);
  const [copied, setCopied] = useState(null);
  const canvasRef = useRef(null);

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target.result);
        extractPalette(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractPalette = (imgSrc) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgSrc;
    img.onload = () => {
      const cvs = document.createElement('canvas');
      const ctx = cvs.getContext('2d');
      cvs.width = 50;
      cvs.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      const data = ctx.getImageData(0, 0, 50, 50).data;
      const colors = {};
      for (let i = 0; i < data.length; i += 4) {
        const rgb = `${data[i]},${data[i+1]},${data[i+2]}`;
        colors[rgb] = (colors[rgb] || 0) + 1;
      }
      const sorted = Object.keys(colors).sort((a, b) => colors[b] - colors[a]).slice(0, 8);
      setPalette(sorted.map(rgb => {
         const [r, g, b] = rgb.split(',').map(Number);
         return rgbToHex(r, g, b);
      }));
    };
  };

  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

  const handleMouseMove = (e) => {
    if (!image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    setSelectedColor(rgbToHex(r, g, b));
  };

  const handleCopy = (color) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyAll = () => {
    if (palette.length === 0) return;
    navigator.clipboard.writeText(palette.join(', '));
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [image]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Color Picker & Palette</h1>
        <p className="text-text-muted text-lg">Extract colors and generate palettes from any image.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Color Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border-2 border-border-main rounded-2xl p-6 shadow-sm lg:sticky lg:top-24">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-6">Active Color</h3>
            
            <div className="space-y-6">
              <div 
                className="w-full aspect-square rounded-2xl border-4 border-white shadow-xl transition-colors duration-200 flex items-end p-4" 
                style={{ backgroundColor: selectedColor }}
              >
                <div className="bg-black/20 backdrop-blur-md rounded-lg px-3 py-1 text-white font-mono text-sm border border-white/20">
                  {selectedColor.toUpperCase()}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleCopy(selectedColor)}
                  className="w-full flex items-center justify-between bg-bg-soft border border-border-light px-4 py-3 rounded-xl hover:border-primary transition-all group"
                >
                  <span className="text-xs font-bold text-text-sub font-mono uppercase tracking-tighter">HEX: {selectedColor}</span>
                  {copied === selectedColor ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-text-muted group-hover:text-primary" />}
                </button>
              </div>

              <div className="pt-6 border-t border-border-light">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                    <Palette size={14}/> Dominant Palette
                  </h4>
                  {palette.length > 0 && (
                    <button 
                      onClick={handleCopyAll}
                      className="text-[10px] font-bold text-text-sub flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                    >
                      {copied === 'all' ? <span className="text-green-500 flex items-center gap-1"><Check size={12} /> Copied</span> : <span className="flex items-center gap-1"><Copy size={12} /> Copy All</span>}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {palette.map((c, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleCopy(c)}
                      className="aspect-square rounded-md border border-white shadow-sm hover:scale-110 transition-transform flex items-center justify-center group"
                      style={{ backgroundColor: c }}
                      title={c}
                    >
                      {copied === c && <div className="bg-black/40 p-1 rounded-full text-white"><Check size={8}/></div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Picker Workspace */}
        <div className="lg:col-span-3">
           {!image ? (
            <div 
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
              className="border-2 border-dashed border-border-light rounded-2xl p-32 flex flex-col items-center gap-4 bg-white hover:border-primary transition-all cursor-pointer h-[500px] justify-center"
              onClick={() => document.getElementById('pickIn').click()}
            >
              <Pipette size={48} className="text-text-muted" />
              <p className="font-bold text-lg">Upload image to pick colors</p>
              <input id="pickIn" type="file" className="hidden" onChange={onDrop} accept="image/*" />
            </div>
          ) : (
            <div className="space-y-4">
               <div className="bg-white border-2 border-border-main rounded-2xl p-2 shadow-inner overflow-hidden relative group cursor-crosshair">
                  <canvas 
                    ref={canvasRef} 
                    onMouseMove={handleMouseMove}
                    onClick={handleMouseMove}
                    className="max-w-full h-auto mx-auto rounded-xl block"
                  />
                  <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white border border-white/20 pointer-events-none uppercase tracking-widest flex items-center gap-2">
                    <Pipette size={12}/> Move cursor to pick
                  </div>
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 transition-colors p-2 rounded-full text-white border border-white/20 backdrop-blur-md"
                  >
                    <RefreshCw size={16} />
                  </button>
               </div>
               <div className="flex justify-between items-center px-2">
                  <p className="text-xs font-bold text-text-muted tracking-tight">{filename}</p>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Pixel-perfect color extraction</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
