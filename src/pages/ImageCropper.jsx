import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Upload, Download, X, Crop as CropIcon, Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { getCroppedImg } from '../utils/imageUtils';

const ImageCropper = () => {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      const url = URL.createObjectURL(croppedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cropped-pixeltools.jpg';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Image Cropper</h1>
        <p className="text-text-muted">Crop your images with precision and ease.</p>
      </div>

      <div className="bg-white border-2 border-border-main rounded-2xl p-8 shadow-sm">
        {!image ? (
          <div 
            className="border-2 border-dashed border-border-light rounded-xl p-20 flex flex-col items-center gap-4 bg-bg-soft hover:border-primary transition-colors cursor-pointer"
            onClick={() => document.getElementById('fileInput').click()}
          >
            <Upload size={48} className="text-text-muted" />
            <div className="text-center">
              <p className="font-semibold text-lg">Select image to crop</p>
              <p className="text-sm text-text-muted font-mono mt-1">Free-form and preset aspect ratios</p>
            </div>
            <input id="fileInput" type="file" className="hidden" onChange={onSelectFile} accept="image/*" />
          </div>
        ) : (
          <div className="space-y-8">
             <div className="relative h-[450px] w-full bg-black rounded-xl overflow-hidden shadow-inner border border-border-light">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
             </div>

             <div className="bg-bg-soft rounded-xl p-6 flex flex-wrap items-center justify-between gap-6 border border-border-light">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-text-sub uppercase tracking-widest">Aspect Ratio</label>
                  <div className="flex gap-2">
                    <button onClick={() => setAspect(1)} className={`p-2 border rounded-md flex items-center gap-2 text-xs font-bold transition-all ${aspect === 1 ? 'bg-primary text-white border-primary' : 'bg-white text-text-sub border-border-light hover:border-primary'}`}><Square size={14}/> 1:1</button>
                    <button onClick={() => setAspect(4/3)} className={`p-2 border rounded-md flex items-center gap-2 text-xs font-bold transition-all ${aspect === 4/3 ? 'bg-primary text-white border-primary' : 'bg-white text-text-sub border-border-light hover:border-primary'}`}><RectangleHorizontal size={14}/> 4:3</button>
                    <button onClick={() => setAspect(16/9)} className={`p-2 border rounded-md flex items-center gap-2 text-xs font-bold transition-all ${aspect === 16/9 ? 'bg-primary text-white border-primary' : 'bg-white text-text-sub border-border-light hover:border-primary'}`}><RectangleHorizontal size={14}/> 16:9</button>
                    <button onClick={() => setAspect(9/16)} className={`p-2 border rounded-md flex items-center gap-2 text-xs font-bold transition-all ${aspect === 9/16 ? 'bg-primary text-white border-primary' : 'bg-white text-text-sub border-border-light hover:border-primary'}`}><RectangleVertical size={14}/> 9:16</button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 flex-grow max-w-[200px]">
                  <label className="text-[10px] font-bold text-text-sub uppercase tracking-widest">Zoom Level</label>
                  <input 
                    type="range" 
                    min={1} 
                    max={3} 
                    step={0.1} 
                    value={zoom} 
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full h-1.5 bg-border-light rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="flex gap-3">
                   <button 
                    onClick={() => setImage(null)}
                    className="px-6 py-3 border-2 border-border-light rounded-lg font-bold text-text-sub hover:bg-white transition-all flex items-center gap-2"
                   >
                     <X size={18}/> Cancel
                   </button>
                   <button 
                    onClick={handleDownload}
                    disabled={isProcessing}
                    className="px-10 py-3 bg-primary text-white rounded-lg font-bold shadow-lg shadow-black/10 hover:bg-primary-h transition-all flex items-center gap-2"
                   >
                     {isProcessing ? 'Processing...' : <><CropIcon size={18}/> Download Crop</>}
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCropper;
