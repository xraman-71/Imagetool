import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Box, Wand2, BookOpen, ChevronDown, ArrowRight } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-light">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
            <Box size={24} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">PixelTools</span>
        </Link>

        {/* Desktop Nav - Centered */}
        <div className="hidden lg:flex items-center gap-5 absolute left-1/2 -translate-x-1/2">
          {/* Tools Dropdown - Basic */}
          <div className="relative group">
            <button className="text-sm font-bold text-text-sub hover:text-primary transition-colors flex items-center gap-1">
              Basic Tools <ChevronDown size={14} />
            </button>
            <div className="absolute top-full -left-4 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all">
              <div className="bg-white border-2 border-border-main rounded-2xl shadow-2xl p-4 w-64 grid grid-cols-1 gap-1">
                <Link to="/dpi-changer" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">📐 DPI Changer</Link>
                <Link to="/compressor" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">🗜 Image Compressor</Link>
                <Link to="/resizer" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">📏 Image Resizer</Link>
                <Link to="/converter" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">🔄 Format Converter</Link>
                <Link to="/rotate-flip" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">🔃 Rotate & Flip</Link>
                <Link to="/cropper" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">✂️ Image Cropper</Link>
              </div>
            </div>
          </div>

          {/* Tools Dropdown - Advanced */}
          <div className="relative group">
            <button className="text-sm font-bold text-text-sub hover:text-primary transition-colors flex items-center gap-1">
              Advanced <Wand2 size={14} />
            </button>
            <div className="absolute top-full -left-4 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all">
              <div className="bg-white border-2 border-border-main rounded-2xl shadow-2xl p-4 w-64 grid grid-cols-1 gap-1">
                <Link to="/filters" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">✨ Image Filters</Link>
                <Link to="/base64" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">🔗 Base64 Converter</Link>
                <Link to="/color-picker" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">🎨 Color Palette</Link>
                <Link to="/watermark" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">🏷️ Watermark Tool</Link>
                <Link to="/rounder" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">🖼️ Border & Rounder</Link>
                <Link to="/exif-viewer" className="p-3 hover:bg-bg-soft rounded-xl text-xs font-bold transition-colors">🕵️ EXIF Viewer</Link>
              </div>
            </div>
          </div>

          {/* Info Pages - Direct Links */}
          <Link to="/how-to-use" className="text-sm font-bold text-text-sub hover:text-primary transition-colors">How to Use</Link>
          <Link to="/features" className="text-sm font-bold text-text-sub hover:text-primary transition-colors">Features</Link>
          <Link to="/faq" className="text-sm font-bold text-text-sub hover:text-primary transition-colors">FAQ</Link>
          <Link to="/why-us" className="text-sm font-bold text-text-sub hover:text-primary transition-colors">Why Us</Link>
        </div>

        {/* Right side - Explore Tools button */}
        <div className="hidden lg:flex items-center flex-shrink-0">
          <Link to="/features" className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-black/10 hover:bg-primary-h transition-all">
            Explore Tools
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-border-light fixed inset-x-0 top-20 bottom-0 overflow-y-auto z-40 animate-in slide-in-from-top duration-300">
          <div className="p-6 space-y-8">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1">Professional Tools</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link to="/dpi-changer" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl hover:bg-primary hover:text-white transition-all group">
                  <span className="text-xl">📐</span>
                  <div>
                    <div className="text-xs font-bold leading-none mb-1">DPI Changer</div>
                    <div className="text-[9px] opacity-60 font-medium">Resolution metadata</div>
                  </div>
                </Link>
                <Link to="/compressor" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl hover:bg-primary hover:text-white transition-all group">
                  <span className="text-xl">🗜</span>
                  <div>
                    <div className="text-xs font-bold leading-none mb-1">Compressor</div>
                    <div className="text-[9px] opacity-60 font-medium">Batch size optimization</div>
                  </div>
                </Link>
                <Link to="/resizer" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl hover:bg-primary hover:text-white transition-all group">
                  <span className="text-xl">📏</span>
                  <div>
                    <div className="text-xs font-bold leading-none mb-1">Resizer</div>
                    <div className="text-[9px] opacity-60 font-medium">Manual & Preset scales</div>
                  </div>
                </Link>
                <Link to="/converter" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl hover:bg-primary hover:text-white transition-all group">
                  <span className="text-xl">🔄</span>
                  <div>
                    <div className="text-xs font-bold leading-none mb-1">Converter</div>
                    <div className="text-[9px] opacity-60 font-medium">JPG, PNG, WebP</div>
                  </div>
                </Link>
                <Link to="/rotate-flip" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl hover:bg-primary hover:text-white transition-all group">
                  <span className="text-xl">🔃</span>
                  <div>
                    <div className="text-xs font-bold leading-none mb-1">Rotate & Flip</div>
                    <div className="text-[9px] opacity-60 font-medium">Precision orientation</div>
                  </div>
                </Link>
                <Link to="/cropper" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl hover:bg-primary hover:text-white transition-all group">
                  <span className="text-xl">✂️</span>
                  <div>
                    <div className="text-xs font-bold leading-none mb-1">Cropper</div>
                    <div className="text-[9px] opacity-60 font-medium">Ratio & Custom crop</div>
                  </div>
                </Link>
                <Link to="/filters" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl hover:bg-primary hover:text-white transition-all group">
                  <span className="text-xl">✨</span>
                  <div>
                    <div className="text-xs font-bold leading-none mb-1">Filters</div>
                    <div className="text-[9px] opacity-60 font-medium">14+ Pro adjustments</div>
                  </div>
                </Link>
                <Link to="/color-picker" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl hover:bg-primary hover:text-white transition-all group">
                  <span className="text-xl">🎨</span>
                  <div>
                    <div className="text-xs font-bold leading-none mb-1">Color Palette</div>
                    <div className="text-[9px] opacity-60 font-medium">HEX & Palette extraction</div>
                  </div>
                </Link>
                <Link to="/watermark" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl hover:bg-primary hover:text-white transition-all group">
                  <span className="text-xl">🏷️</span>
                  <div>
                    <div className="text-xs font-bold leading-none mb-1">Watermark</div>
                    <div className="text-[9px] opacity-60 font-medium">Branding & Protection</div>
                  </div>
                </Link>
                <Link to="/rounder" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-bg-soft rounded-2xl hover:bg-primary hover:text-white transition-all group">
                  <span className="text-xl">🖼️</span>
                  <div>
                    <div className="text-xs font-bold leading-none mb-1">Border Tool</div>
                    <div className="text-[9px] opacity-60 font-medium">Designer frames</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border-light">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1">Resources</p>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/how-to-use" onClick={() => setIsOpen(false)} className="p-4 bg-bg-soft rounded-2xl text-[10px] font-bold text-center">HOW TO USE</Link>
                <Link to="/features" onClick={() => setIsOpen(false)} className="p-4 bg-bg-soft rounded-2xl text-[10px] font-bold text-center">ALL FEATURES</Link>
                <Link to="/faq" onClick={() => setIsOpen(false)} className="p-4 bg-bg-soft rounded-2xl text-[10px] font-bold text-center">FAQ</Link>
                <Link to="/why-us" onClick={() => setIsOpen(false)} className="p-4 bg-bg-soft rounded-2xl text-[10px] font-bold text-center">WHY US</Link>
              </div>
            </div>
            
            <div className="pt-4">
              <Link 
                to="/features" 
                onClick={() => setIsOpen(false)}
                className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-black/10"
              >
                Start Editing Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
