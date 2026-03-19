import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border-light relative overflow-hidden">
      {/* Wave decoration at top */}
      <div className="absolute top-0 left-0 w-full flex pointer-events-none" style={{ opacity: 0.8 }}>
        <svg className="w-full h-16 md:h-20 rotate-180 -mt-1" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use href="#gentle-wave" x="48" y="0" fill="#d4d4d4" opacity="0.3" />
            <use href="#gentle-wave" x="48" y="3" fill="#e5e5e5" opacity="0.5" />
            <use href="#gentle-wave" x="48" y="5" fill="#f0f0f0" opacity="0.7" />
            <use href="#gentle-wave" x="48" y="7" fill="#e5e5e5" opacity="0.4" />
          </g>
        </svg>
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 w-full flex pointer-events-none" style={{ opacity: 0.8 }}>
        <svg className="w-full h-16 md:h-24 mb-[-5px]" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <g className="parallax">
            <use href="#gentle-wave" x="48" y="0" fill="#d4d4d4" opacity="0.3" />
            <use href="#gentle-wave" x="48" y="3" fill="#e5e5e5" opacity="0.5" />
            <use href="#gentle-wave" x="48" y="5" fill="#f0f0f0" opacity="0.7" />
            <use href="#gentle-wave" x="48" y="7" fill="#e5e5e5" opacity="0.4" />
          </g>
        </svg>
      </div>
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white">
                <Box size={20} />
              </div>
              <span className="font-black text-lg tracking-tighter uppercase italic text-text">PixelTools</span>
            </Link>
            <p className="text-text-muted text-xs leading-relaxed max-w-[200px]">
              Compress, resize, crop, convert, and edit images online for free — no signup, no uploads, no installs. Your photos never leave your browser.
            </p>
          </div>

          {/* Basic Tools */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-sub mb-5">Basic Tools</h4>
            <ul className="space-y-3">
              <li><Link to="/dpi-changer" className="text-xs text-text-muted hover:text-text transition-colors">DPI Changer</Link></li>
              <li><Link to="/compressor" className="text-xs text-text-muted hover:text-text transition-colors">Image Compressor</Link></li>
              <li><Link to="/resizer" className="text-xs text-text-muted hover:text-text transition-colors">Image Resizer</Link></li>
              <li><Link to="/converter" className="text-xs text-text-muted hover:text-text transition-colors">Format Converter</Link></li>
              <li><Link to="/rotate-flip" className="text-xs text-text-muted hover:text-text transition-colors">Rotate & Flip</Link></li>
              <li><Link to="/cropper" className="text-xs text-text-muted hover:text-text transition-colors">Image Cropper</Link></li>
            </ul>
          </div>

          {/* Advanced Tools */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-sub mb-5">Advanced Tools</h4>
            <ul className="space-y-3">
              <li><Link to="/filters" className="text-xs text-text-muted hover:text-text transition-colors">Image Filters</Link></li>
              <li><Link to="/base64" className="text-xs text-text-muted hover:text-text transition-colors">Base64 Converter</Link></li>
              <li><Link to="/color-picker" className="text-xs text-text-muted hover:text-text transition-colors">Color Picker</Link></li>
              <li><Link to="/watermark" className="text-xs text-text-muted hover:text-text transition-colors">Watermark Tool</Link></li>
              <li><Link to="/rounder" className="text-xs text-text-muted hover:text-text transition-colors">Border & Rounder</Link></li>
              <li><Link to="/exif-viewer" className="text-xs text-text-muted hover:text-text transition-colors">EXIF Viewer</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-sub mb-5">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/how-to-use" className="text-xs text-text-muted hover:text-text transition-colors">How to Use</Link></li>
              <li><Link to="/how-it-works" className="text-xs text-text-muted hover:text-text transition-colors">How It Works</Link></li>
              <li><Link to="/features" className="text-xs text-text-muted hover:text-text transition-colors">All Features</Link></li>
              <li><Link to="/faq" className="text-xs text-text-muted hover:text-text transition-colors">FAQ</Link></li>
              <li><Link to="/why-us" className="text-xs text-text-muted hover:text-text transition-colors">Why PixelTools</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider">
            © 2026 PIXELTOOLS. ALL RIGHTS RESERVED. MADE WITH ❤ BY AMANXR.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-text-muted font-mono uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            100% BROWSER-BASED · ZERO SERVER UPLOADS · ALWAYS FREE
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
