import React, { useState, useEffect } from 'react';
import { Upload, Download, Type, Move, RotateCcw, Palette, Sliders, Check } from 'lucide-react';
import { addWatermark, formatFileSize } from '../utils/imageUtils';

const WatermarkTool = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState('PixelTools');
  const [subText, setSubText] = useState('');
  const [options, setOptions] = useState({
    fontSize: 40,
    color: 'rgba(255, 255, 255, 0.5)',
    rotate: -45,
    fontWeight: 'bold',
    fontStyle: 'normal',
    align: 'center',
    position: 'center'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedBlob, setProcessedBlob] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setProcessedBlob(null);
    }
  };

  const handleUpdate = async () => {
    if (!file) return;
    setIsProcessing(true);
    const blob = await addWatermark(file, text, options, subText);
    setProcessedBlob(blob);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (file) handleUpdate();
  }, [text, subText, options, file]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Image Watermark Tool</h1>
        <p className="text-text-muted">Prorect your images with custom text watermarks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border-2 border-border-main rounded-2xl p-6 shadow-sm lg:sticky lg:top-24">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
              <Sliders size={14}/> Watermark Settings
            </h3>
            
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-text-sub flex items-center gap-2"><Type size={14}/> Main Text</label>
                    <input 
                      type="text" 
                      value={text} 
                      onChange={e => setText(e.target.value)}
                      placeholder="Line 1"
                      className="w-full bg-bg-soft border border-border-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-bold"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-text-sub flex items-center gap-2"><Type size={14}/> Sub Text</label>
                    <input 
                      type="text" 
                      value={subText} 
                      onChange={e => setSubText(e.target.value)}
                      placeholder="Line 2 (Optional)"
                      className="w-full bg-bg-soft border border-border-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-bold"
                    />
                 </div>
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold text-text-sub flex items-center gap-2"><Move size={14}/> Font Size</label>
                    <span className="text-[10px] font-mono font-bold">{options.fontSize}px</span>
                  </div>
                  <input 
                    type="range" min="10" max="200" value={options.fontSize} 
                    onChange={e => setOptions({...options, fontSize: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-bg-soft rounded-lg appearance-none cursor-pointer accent-primary border border-border-light"
                  />
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-sub flex items-center gap-2"><RotateCcw size={14}/> Rotation</label>
                    <div className="flex items-center gap-1 bg-white border border-border-light rounded-md px-2 py-1 focus-within:border-primary transition-colors">
                      <input 
                        type="number" 
                        value={options.rotate} 
                        onChange={e => setOptions({...options, rotate: parseInt(e.target.value) || 0})}
                        className="w-10 bg-transparent text-right text-[10px] font-mono font-bold focus:outline-none"
                      />
                      <span className="text-[10px] font-mono font-bold text-text-muted">°</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="-180" max="180" value={options.rotate} 
                    onChange={e => setOptions({...options, rotate: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-bg-soft rounded-lg appearance-none cursor-pointer accent-primary border border-border-light"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-text-sub flex items-center gap-2"><Type size={14}/> Font Style</label>
                    <select 
                      value={options.fontFamily || 'sans-serif'}
                      onChange={e => setOptions({...options, fontFamily: e.target.value})}
                      className="w-full bg-bg-soft border border-border-light rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary font-bold"
                    >
                      <option value="sans-serif">Sans Serif</option>
                      <option value="serif">Serif</option>
                      <option value="monospace">Monospace</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Impact">Impact</option>
                      <option value="Comic Sans MS">Comic Sans</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-text-sub flex items-center gap-2"><Move size={14}/> Position</label>
                    <select 
                      value={options.position || 'center'}
                      onChange={e => setOptions({...options, position: e.target.value})}
                      className="w-full bg-bg-soft border border-border-light rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary font-bold"
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="top-left">Top Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="tile">Tile (Repeated)</option>
                    </select>
                 </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-text-sub flex items-center gap-2"><Palette size={14}/> Color & Opacity</label>
                  <div className="flex gap-2">
                     {['rgba(255,255,255,0.5)', 'rgba(0,0,0,0.5)', 'rgba(255,0,0,0.5)', 'rgba(255,255,0,0.5)'].map(c => (
                       <button 
                        key={c} 
                        onClick={() => setOptions({...options, color: c})}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${options.color === c ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent opacity-60'}`}
                        style={{ backgroundColor: c }}
                       />
                     ))}
                  </div>
               </div>

               <div className="pt-4">
                  <button 
                    onClick={() => {
                      const url = URL.createObjectURL(processedBlob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `watermarked-${file.name}`;
                      a.click();
                    }}
                    disabled={!processedBlob}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-black/20 hover:bg-primary-h transition-all hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Download size={18}/> Download Watermarked
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
           {!preview ? (
            <div 
              className="border-2 border-dashed border-border-light rounded-2xl p-32 flex flex-col items-center gap-4 bg-white hover:border-primary transition-all cursor-pointer h-[500px] justify-center"
              onClick={() => document.getElementById('waterIn').click()}
            >
              <Upload size={48} className="text-text-muted" />
              <p className="font-bold text-lg text-text">Select image to watermark</p>
              <input id="waterIn" type="file" className="hidden" onChange={handleFile} accept="image/*" />
            </div>
           ) : (
            <div className="space-y-4">
               <div className="bg-white border-2 border-border-main rounded-2xl p-2 shadow-inner overflow-hidden relative min-h-[400px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
                   {processedBlob ? (
                      <img src={URL.createObjectURL(processedBlob)} className="max-w-full max-h-[600px] object-contain rounded-xl shadow-2xl" alt="Preview"/>
                   ) : (
                      <div className="animate-pulse text-xs font-bold uppercase tracking-widest text-text-muted">Generating Preview...</div>
                   )}
               </div>
               <div className="flex justify-between items-center px-2">
                  <p className="text-xs font-bold text-text-muted tracking-tight">{file?.name} • {formatFileSize(file?.size)}</p>
                  <button onClick={() => setPreview(null)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline">Remove Image</button>
               </div>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default WatermarkTool;
