import React from 'react';
import { Monitor, Shield, Cpu, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => (
  <div className="max-w-5xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-bg-soft px-4 py-2 rounded-full border border-border-light">Technology</span>
      <h1 className="text-5xl font-black tracking-tight mt-6 mb-4">How It Works</h1>
      <p className="text-text-muted text-lg max-w-xl mx-auto">Understanding the technology behind PixelTools' browser-based processing.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <div className="bg-white border-2 border-border-main rounded-2xl p-8 shadow-sm">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6"><Monitor size={28} className="text-blue-600" /></div>
        <h3 className="text-xl font-bold mb-3">Browser Canvas API</h3>
        <p className="text-text-muted leading-relaxed">We use the HTML5 Canvas API to decode your image into raw pixel data, apply transformations (resize, rotate, filter), and re-encode it — all within your browser's memory.</p>
      </div>
      <div className="bg-white border-2 border-border-main rounded-2xl p-8 shadow-sm">
        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6"><Shield size={28} className="text-green-600" /></div>
        <h3 className="text-xl font-bold mb-3">Zero Server Contact</h3>
        <p className="text-text-muted leading-relaxed">Your images are NEVER uploaded to any server. The entire processing pipeline runs in JavaScript on your local machine. When you close the tab, the data is gone.</p>
      </div>
      <div className="bg-white border-2 border-border-main rounded-2xl p-8 shadow-sm">
        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6"><Cpu size={28} className="text-purple-600" /></div>
        <h3 className="text-xl font-bold mb-3">Binary Metadata Parsing</h3>
        <p className="text-text-muted leading-relaxed">For tools like DPI Changer and EXIF Viewer, we parse the raw binary data (JFIF/pHYs chunks) directly using ArrayBuffer and DataView — no external libraries needed for core operations.</p>
      </div>
      <div className="bg-white border-2 border-border-main rounded-2xl p-8 shadow-sm">
        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6"><Zap size={28} className="text-amber-600" /></div>
        <h3 className="text-xl font-bold mb-3">Precision Compression</h3>
        <p className="text-text-muted leading-relaxed">Our compressor uses a 12-step binary search algorithm to find the exact JPEG quality value that matches your target file size — far more accurate than a simple quality slider.</p>
      </div>
    </div>

    <div className="bg-primary text-white rounded-3xl p-12 text-center">
      <h3 className="text-2xl font-bold mb-3">The Bottom Line</h3>
      <p className="text-white/70 max-w-lg mx-auto mb-8">Your images stay on your device. We don't see them, store them, or profit from them. It's image editing the way it should be.</p>
      <Link to="/" className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-all inline-flex items-center gap-2">
        Try It Now <ArrowRight size={18} />
      </Link>
    </div>
  </div>
);

export default HowItWorks;
