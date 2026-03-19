import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Box, ArrowRight, Wand2, Hash, Pipette, Type, Square, Info, Crop, RotateCw, FileImage } from 'lucide-react';

const tools = [
  { icon: Target, title: 'DPI Changer', desc: 'Update print resolution metadata (72–300 DPI) without resampling pixels.', link: '/dpi-changer', tag: 'Resolution' },
  { icon: Box, title: 'Image Compressor', desc: 'Binary-search algorithm for exact KB/MB targets & precise pixel dimensions.', link: '/compressor', tag: 'Compression' },
  { icon: FileImage, title: 'Image Resizer', desc: 'Scale dimensions safely with aspect-ratio locking and social media presets.', link: '/resizer', tag: 'Dimensions' },
  { icon: ArrowRight, title: 'Format Converter', desc: 'Instantly swap between JPG, PNG, and WebP, perfectly optimized.', link: '/converter', tag: 'Format' },
  { icon: RotateCw, title: 'Rotate & Flip', desc: 'Lossless 90° increments rotation and horizontal/vertical mirroring.', link: '/rotate-flip', tag: 'Orientation' },
  { icon: Crop, title: 'Image Cropper', desc: 'Interactive visual cropping with smart 1:1, 4:3, 16:9, and 9:16 presets.', link: '/cropper', tag: 'Precision' },
  { icon: Wand2, title: 'Image Filters', desc: '14 pro effects including vignette, film noise, posterize, warmth, and tint.', link: '/filters', tag: 'Effects' },
  { icon: Hash, title: 'Base64 Converter', desc: 'Convert images to raw Data URI strings, or perfectly decode them back.', link: '/base64', tag: 'Developer' },
  { icon: Pipette, title: 'Color Picker', desc: 'Pixel-perfect UI picking, fast dominant palette generation, & 1-click bulk copy.', link: '/color-picker', tag: 'Colors' },
  { icon: Type, title: 'Watermark Tool', desc: 'Add 9-grid text, custom repeating tiles, unique fonts, and precision rotation.', link: '/watermark', tag: 'Branding' },
  { icon: Square, title: 'Border & Rounder', desc: '12 designer borders (filmstrip, polaroid, neon), 3D shadows, and custom radii.', link: '/rounder', tag: 'Styling' },
  { icon: Info, title: 'EXIF Viewer', desc: 'Read hidden camera data, lens type, ISO, raw dates, and precise GPS mapping.', link: '/exif-viewer', tag: 'Analysis' },
];

const AllFeatures = () => (
  <div className="max-w-6xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-bg-soft px-4 py-2 rounded-full border border-border-light">Complete Suite</span>
      <h1 className="text-5xl font-black tracking-tight mt-6 mb-4">All Features</h1>
      <p className="text-text-muted text-lg max-w-xl mx-auto">12 professional tools, all free, all running locally in your browser.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((t, i) => (
        <Link key={i} to={t.link} className="group bg-white border-2 border-border-main rounded-2xl p-6 hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-1 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-bg-soft rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
              <t.icon size={24} className="text-primary group-hover:text-white transition-colors" />
            </div>
            <span className="text-[9px] font-bold bg-bg-soft text-primary px-2 py-1 rounded-full uppercase tracking-widest group-hover:bg-white/20 group-hover:text-white transition-all">{t.tag}</span>
          </div>
          <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors">{t.title}</h3>
          <p className="text-text-muted text-sm leading-relaxed group-hover:text-white/70 transition-colors">{t.desc}</p>
        </Link>
      ))}
    </div>
  </div>
);

export default AllFeatures;
