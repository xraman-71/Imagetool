import React, { useState, useEffect } from 'react';
import { Upload, Download, Square, CornerUpRight, Palette, Sliders, Box } from 'lucide-react';
import { addBorderAndRound, formatFileSize } from '../utils/imageUtils';

const ImageRounder = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processedBlob, setProcessedBlob] = useState(null);
  const [config, setConfig] = useState({
    radius: 40,
    borderWidth: 10,
    borderColor: '#ffffff',
    shadow: 'none',
    borderStyle: 'solid',
    styleIntensity: 50
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setProcessedBlob(null);
    }
  };

  const processImage = async () => {
    if (!file) return;
    setIsProcessing(true);
    const blob = await addBorderAndRound(file, config);
    setProcessedBlob(blob);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (file) {
      const timer = setTimeout(processImage, 100);
      return () => clearTimeout(timer);
    }
  }, [file, config]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Border & Rounder</h1>
        <p className="text-text-muted">Add stylish rounded corners and borders to your images.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border-2 border-border-main rounded-2xl p-6 shadow-sm lg:sticky lg:top-24">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
              <Sliders size={14}/> Frame Style
            </h3>

            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold text-text-sub flex items-center gap-2"><CornerUpRight size={14}/> Corner Radius</label>
                    <span className="text-[10px] font-mono font-bold">{config.radius}px</span>
                  </div>
                  <input 
                    type="range" min="0" max="200" value={config.radius} 
                    onChange={e => setConfig({...config, radius: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-bg-soft rounded-lg appearance-none cursor-pointer accent-primary border border-border-light"
                  />
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold text-text-sub flex items-center gap-2"><Box size={14}/> Border Width</label>
                    <span className="text-[10px] font-mono font-bold">{config.borderWidth}px</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={config.borderWidth} 
                    onChange={e => setConfig({...config, borderWidth: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-bg-soft rounded-lg appearance-none cursor-pointer accent-primary border border-border-light"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-text-sub flex items-center gap-2"><Square size={14}/> Border Style</label>
                  <select 
                    value={config.borderStyle || 'solid'}
                    onChange={e => setConfig({...config, borderStyle: e.target.value})}
                    className="w-full bg-bg-soft border border-border-light rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary font-bold"
                  >
                    <optgroup label="Classic Borders">
                      <option value="solid">Standard Solid</option>
                      <option value="dashed">Dashed Line</option>
                      <option value="dotted">Dotted Line</option>
                      <option value="double">Double Line</option>
                      <option value="gradient">Gradient Frame</option>
                    </optgroup>
                    <optgroup label="Designer Frames">
                      <option value="polaroid">Classic Polaroid</option>
                      <option value="filmstrip">35mm Filmstrip</option>
                      <option value="stamp">Postage Stamp</option>
                      <option value="neon">Neon Wireframe</option>
                      <option value="vintage">Vintage Vignette</option>
                    </optgroup>
                    <optgroup label="Creative Edges">
                      <option value="zigzag">Jagged Zigzag</option>
                      <option value="wave">Curvy Wave</option>
                      <option value="scalloped">Rounded Scallop</option>
                      <option value="pixel">Blocky Pixelated</option>
                      <option value="parchment">Rough Parchment</option>
                    </optgroup>
                    <optgroup label="Artistic & UI">
                      <option value="brutalist">Bold Brutalist</option>
                      <option value="artdeco">Art Deco Geometric</option>
                      <option value="glass">Frosted Glass</option>
                      <option value="crt">Retro CRT Scan</option>
                      <option value="ornate">Corner Ornaments</option>
                    </optgroup>
                  </select>
               </div>

               {config.borderStyle !== 'solid' && config.borderStyle !== 'gradient' && config.borderStyle !== 'inset' && config.borderStyle !== 'outset' && (
                 <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-text-sub flex items-center gap-2"><Sliders size={14}/> Style Adjustment</label>
                      <span className="text-[10px] font-mono font-bold">{config.styleIntensity}%</span>
                    </div>
                    <input 
                      type="range" min="1" max="100" value={config.styleIntensity} 
                      onChange={e => setConfig({...config, styleIntensity: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-bg-soft rounded-lg appearance-none cursor-pointer accent-primary border border-border-light"
                    />
                 </div>
               )}

               <div className="space-y-2">
                  <label className="text-xs font-bold text-text-sub flex items-center gap-2"><Palette size={14}/> Border Color (if applicable)</label>
                  <div className="flex flex-wrap gap-2">
                    {['#ffffff', '#000000', '#f3f4f6', '#3b82f6', '#ef4444', '#10b981'].map(color => (
                      <button 
                        key={color}
                        onClick={() => setConfig({...config, borderColor: color})}
                        className={`w-8 h-8 rounded-md border-2 transition-all ${config.borderColor === color ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input 
                      type="color" 
                      value={config.borderColor} 
                      onChange={e => setConfig({...config, borderColor: e.target.value})}
                      className="w-8 h-8 p-0 border-none rounded-md cursor-pointer"
                    />
                  </div>
                 <div className="pt-2">
                   <label className="text-xs font-bold text-text-sub flex items-center gap-2 mb-2"><Box size={14}/> Shadow Style</label>
                   <select 
                     value={config.shadow}
                     onChange={e => setConfig({...config, shadow: e.target.value})}
                     className="w-full bg-bg-soft border border-border-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-bold"
                   >
                     <option value="none">No Shadow</option>
                     <option value="soft">Soft Drop Shadow</option>
                     <option value="hard">Hard Drop Shadow</option>
                     <option value="glow">Neon Glow</option>
                   </select>
                 </div>
               </div>

               <div className="pt-4">
                  <button 
                    onClick={() => {
                      const url = URL.createObjectURL(processedBlob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `rounded-${file.name}`;
                      a.click();
                    }}
                    disabled={!processedBlob}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-black/20 hover:bg-primary-h transition-all hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Download size={18}/> Download Image
                  </button>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
           {!preview ? (
            <div 
              className="border-2 border-dashed border-border-light rounded-2xl p-32 flex flex-col items-center gap-4 bg-white hover:border-primary transition-all cursor-pointer h-[500px] justify-center shadow-sm"
              onClick={() => document.getElementById('roundIn').click()}
            >
              <Square size={48} className="text-text-muted" />
              <p className="font-bold text-lg text-text">Select image to style</p>
              <input id="roundIn" type="file" className="hidden" onChange={handleFile} accept="image/*" />
            </div>
           ) : (
            <div className="space-y-4">
               <div className="bg-bg-soft border-2 border-border-main rounded-2xl p-8 shadow-inner overflow-hidden min-h-[400px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                   {processedBlob ? (
                      <img src={URL.createObjectURL(processedBlob)} className="max-w-full max-h-[600px] object-contain shadow-2xl" alt="Preview"/>
                   ) : (
                      <div className="animate-pulse text-xs font-bold uppercase tracking-widest text-text-muted">Styling...</div>
                   )}
               </div>
               <div className="flex justify-between items-center px-2">
                  <p className="text-xs font-bold text-text-muted tracking-tight">{file?.name}</p>
                  <button onClick={() => setPreview(null)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline">Change Image</button>
               </div>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ImageRounder;
