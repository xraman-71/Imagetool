import React, { useState } from 'react';
import { Upload, Copy, Image as ImageIcon, FileText, Check, ArrowRightLeft } from 'lucide-react';
import { imageToBase64, formatFileSize } from '../utils/imageUtils';

const Base64Converter = () => {
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('image-to-b64'); // 'image-to-b64' or 'b64-to-image'

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const b64 = await imageToBase64(selectedFile);
      setBase64(b64);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleB64Change = (e) => {
    setBase64(e.target.value);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Base64 Converter</h1>
        <p className="text-text-muted">Convert images to Base64 strings or decode strings back to images.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-bg-soft p-1 rounded-xl border border-border-light flex gap-1">
          <button 
            onClick={() => { setMode('image-to-b64'); setBase64(''); setFile(null); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'image-to-b64' ? 'bg-white text-text shadow-sm' : 'text-text-muted hover:text-text'}`}
          >
            Image to Base64
          </button>
          <button 
            onClick={() => { setMode('b64-to-image'); setBase64(''); setFile(null); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'b64-to-image' ? 'bg-white text-text shadow-sm' : 'text-text-muted hover:text-text'}`}
          >
            Base64 to Image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Pane */}
        <div className="bg-white border-2 border-border-main rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
            {mode === 'image-to-b64' ? <><ImageIcon size={14}/> Source Image</> : <><FileText size={14}/> Base64 String</>}
          </h3>
          
          {mode === 'image-to-b64' ? (
            <div 
              className="border-2 border-dashed border-border-light rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-bg-soft hover:border-primary transition-all cursor-pointer h-[300px]"
              onClick={() => document.getElementById('fileIn').click()}
            >
              {file ? (
                <div className="text-center">
                  <img src={URL.createObjectURL(file)} alt="" className="w-24 h-24 object-cover mx-auto rounded-lg mb-2 shadow-sm border border-border-light" />
                  <p className="text-sm font-bold truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[10px] text-text-muted uppercase mt-1">{formatFileSize(file.size)}</p>
                </div>
              ) : (
                <>
                  <Upload size={32} className="text-text-muted" />
                  <p className="text-xs font-bold text-text-muted">Click to upload image</p>
                </>
              )}
              <input id="fileIn" type="file" className="hidden" onChange={handleFileSelect} />
            </div>
          ) : (
            <textarea 
              value={base64}
              onChange={handleB64Change}
              placeholder="Paste your Data URI or Base64 string here..."
              className="w-full h-[300px] bg-bg-soft border border-border-light rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-primary resize-none"
            />
          )}
        </div>

        {/* Output Pane */}
        <div className="bg-white border-2 border-border-main rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
             {mode === 'image-to-b64' ? <><FileText size={14}/> Result String</> : <><ImageIcon size={14}/> Decoded Image</>}
          </h3>

          <div className="relative h-[300px]">
             {mode === 'image-to-b64' ? (
               <>
                <textarea 
                  readOnly 
                  value={base64}
                  className="w-full h-full bg-bg-soft border border-border-light rounded-xl p-4 text-[10px] font-mono focus:outline-none overflow-y-auto resize-none"
                />
                {base64 && (
                  <button 
                    onClick={handleCopy}
                    className="absolute top-3 right-3 bg-primary text-white p-2 rounded-lg hover:bg-primary-h transition-all shadow-lg"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
               </>
             ) : (
               <div className="w-full h-full bg-bg-soft border border-border-light rounded-xl flex items-center justify-center overflow-hidden">
                  {base64 ? (
                    <img src={base64} alt="Decoded" className="max-w-full max-h-full object-contain" onError={(e) => { e.target.src = ''; }} />
                  ) : (
                    <div className="text-center text-text-muted">
                        <ArrowRightLeft size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Valid Input</p>
                    </div>
                  )}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base64Converter;
