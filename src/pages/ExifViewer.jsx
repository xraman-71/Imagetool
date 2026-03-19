import React, { useState } from 'react';
import EXIF from 'exif-js';
import { Upload, Info, Camera, MapPin, Calendar, Image as ImageIcon, Search } from 'lucide-react';
import { formatFileSize } from '../utils/imageUtils';

const ExifViewer = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isReading, setIsReading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0] || e.dataTransfer?.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setIsReading(true);
      
      EXIF.getData(f, function() {
        const allData = EXIF.getAllTags(this);
        setMetadata(allData);
        setIsReading(false);
      });
    }
  };

  const DataRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-4 p-4 bg-bg-soft rounded-xl border border-border-light hover:border-primary transition-colors group">
      <div className="w-10 h-10 rounded-lg bg-white border border-border-light flex items-center justify-center text-text-muted group-hover:text-primary transition-colors shadow-sm">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
        <p className="font-bold text-text text-sm truncate max-w-[200px]">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">EXIF Metadata Viewer</h1>
        <p className="text-text-muted text-lg">Reveal the hidden technical details behind your photos.</p>
      </div>

      {!file ? (
        <div 
          onDragOver={e => e.preventDefault()}
          onDrop={handleFile}
          className="max-w-2xl mx-auto border-2 border-dashed border-border-light rounded-3xl p-32 flex flex-col items-center gap-6 bg-white hover:border-primary transition-all cursor-pointer shadow-sm group"
          onClick={() => document.getElementById('exifIn').click()}
        >
          <div className="w-20 h-20 bg-bg-soft rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Search size={32} className="text-text-muted" />
          </div>
          <div className="text-center">
            <p className="font-bold text-xl">Drop photo to view metadata</p>
            <p className="text-sm text-text-muted mt-2">Compatible with JPEG/TIFF from Phones & DSLRs</p>
          </div>
          <input id="exifIn" type="file" className="hidden" onChange={handleFile} accept="image/jpeg,image/tiff" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-white border-2 border-border-main rounded-2xl p-4 shadow-sm overflow-hidden">
               <img src={preview} className="w-full h-auto rounded-xl object-contain bg-bg-soft" alt="Source" />
               <div className="p-4 flex justify-between items-center bg-bg-soft rounded-xl mt-4 border border-border-light">
                  <div className="flex items-center gap-3">
                    <ImageIcon size={20} className="text-text-muted" />
                    <div>
                      <p className="text-xs font-bold text-text truncate max-w-[150px]">{file.name}</p>
                      <p className="text-[10px] text-text-muted font-mono">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">New Search</button>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border-2 border-border-main rounded-3xl p-8 shadow-sm">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
                 <Info size={14}/> Technical Profile
               </h3>

               {isReading ? (
                 <div className="space-y-4 animate-pulse">
                    {[1,2,3,4].map(i => <div key={i} className="h-16 bg-bg-soft rounded-xl" />)}
                 </div>
               ) : metadata ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DataRow label="Camera Make" value={metadata.Make} icon={Camera} />
                    <DataRow label="Model" value={metadata.Model} icon={Camera} />
                    <DataRow label="Date Taken" value={metadata.DateTimeOriginal} icon={Calendar} />
                    <DataRow label="Lens" value={metadata.LensModel} icon={Search} />
                    <DataRow label="ISO" value={metadata.ISOSpeedRatings} icon={Info} />
                    <DataRow label="F-Number" value={metadata.FNumber ? `f/ ${metadata.FNumber}` : null} icon={Info} />
                    <DataRow label="Exposure" value={metadata.ExposureTime ? `${metadata.ExposureTime}s` : null} icon={Info} />
                    <DataRow label="Location" value={metadata.GPSLatitude ? 'GPS Data Found' : 'No Location Data'} icon={MapPin} />
                 </div>
               ) : (
                 <div className="text-center py-20 bg-bg-soft rounded-2xl border-2 border-dashed border-border-light">
                    <p className="text-sm font-bold text-text-muted">No EXIF data found in this image.</p>
                 </div>
               )}
               
               {metadata && (
                 <div className="mt-10 pt-6 border-t border-border-light">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">Raw Metadata Excerpt</h4>
                   <div className="bg-bg-soft p-4 rounded-xl font-mono text-[9px] h-40 overflow-y-auto border border-border-light">
                      <pre>{JSON.stringify(metadata, null, 2)}</pre>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExifViewer;
