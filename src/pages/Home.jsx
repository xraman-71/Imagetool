import React, { useState } from 'react';
import { ArrowRight, Shield, Zap, Smartphone, Upload, Sliders, Download, MousePointer, Monitor, Cpu, DollarSign, Eye, Server, ChevronDown, Target, Box, Wand2, Hash, Pipette, Type, Square, Info, Crop, RotateCw, FileImage } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── TOOLS DATA ─── */
const tools = [
  { icon: Target, title: 'DPI Changer', desc: 'Update print resolution metadata (72–300 DPI) without resampling pixels.', link: '/dpi-changer', tag: 'Resolution' },
  { icon: Box, title: 'Compressor', desc: 'Binary-search algorithm for exact KB/MB targets & pixel dimensions.', link: '/compressor', tag: 'Compression' },
  { icon: FileImage, title: 'Resizer', desc: 'Scale safely with aspect-ratio locking and exact social presets.', link: '/resizer', tag: 'Dimensions' },
  { icon: ArrowRight, title: 'Converter', desc: 'Swap JPG, PNG, and WebP formats flawlessly.', link: '/converter', tag: 'Format' },
  { icon: RotateCw, title: 'Rotate & Flip', desc: '90° increments rotation and 2D horizontal/vertical mirroring.', link: '/rotate-flip', tag: 'Orientation' },
  { icon: Crop, title: 'Cropper', desc: 'Interactive visual crop with 1:1, 4:3, 16:9 preset ratios.', link: '/cropper', tag: 'Precision' },
  { icon: Wand2, title: 'Filters', desc: '14 pro effects: vignette, noisy film, tint, warmth, brightness, & more.', link: '/filters', tag: 'Effects' },
  { icon: Hash, title: 'Base64', desc: 'Convert to Data URI strings or decode flawlessly back to image.', link: '/base64', tag: 'Developer' },
  { icon: Pipette, title: 'Color Picker', desc: 'Pixel-perfect HEX picking & automated dominant palettes.', link: '/color-picker', tag: 'Colors' },
  { icon: Type, title: 'Watermark', desc: 'Add rotating repeating tiles, 9-grid text, and custom fonts.', link: '/watermark', tag: 'Branding' },
  { icon: Square, title: 'Rounder', desc: '12 designer borders (polaroid, filmstrip), shadows & custom radii.', link: '/rounder', tag: 'Styling' },
  { icon: Info, title: 'EXIF Viewer', desc: 'Read hidden camera data, lens type, exact dates, & GPS metadata.', link: '/exif-viewer', tag: 'Analysis' },
];

/* ─── HOW-TO STEPS ─── */
const steps = [
  { icon: Upload, num: '01', title: 'Upload Your Image', desc: 'Click the upload area or drag & drop. We support JPG, PNG, and WebP.', color: 'bg-blue-50 text-blue-600' },
  { icon: MousePointer, num: '02', title: 'Choose Your Tool', desc: 'Pick from 12 professional tools — resize, compress, convert, and more.', color: 'bg-purple-50 text-purple-600' },
  { icon: Sliders, num: '03', title: 'Adjust Settings', desc: 'Fine-tune parameters: dimensions, file sizes, filters, or crop ratios.', color: 'bg-amber-50 text-amber-600' },
  { icon: Download, num: '04', title: 'Download Result', desc: 'Save your processed image instantly. No account or email required.', color: 'bg-green-50 text-green-600' },
];

/* ─── WHY US REASONS ─── */
const reasons = [
  { icon: Shield, title: '100% Privacy', desc: 'Images never leave your device. No server uploads, no cloud, no tracking.', color: 'bg-green-50 text-green-600' },
  { icon: Zap, title: 'Instant Speed', desc: 'No server roundtrips. Everything runs in real-time within your browser.', color: 'bg-amber-50 text-amber-600' },
  { icon: DollarSign, title: 'Completely Free', desc: 'No premium tiers, no credits, no signup. Every tool for everyone, always.', color: 'bg-blue-50 text-blue-600' },
  { icon: Eye, title: 'No Ads or Trackers', desc: 'Zero ads, zero analytics trackers, zero data collection. Pure utility.', color: 'bg-purple-50 text-purple-600' },
  { icon: Smartphone, title: 'Works Everywhere', desc: 'Fully responsive on Chrome, Edge, Firefox, Safari — desktop and mobile.', color: 'bg-red-50 text-red-500' },
  { icon: Server, title: 'No Installation', desc: 'No downloads, no plugins. Just open the URL and start processing.', color: 'bg-cyan-50 text-cyan-600' },
];

/* ─── FAQ DATA ─── */
const faqs = [
  { q: 'Are my images uploaded to a server?', a: 'No. All processing happens 100% in your browser. Your images never leave your device.' },
  { q: 'Is PixelTools really free?', a: 'Yes, completely free with no hidden costs, no premium tiers, and no accounts required.' },
  { q: 'What file formats are supported?', a: 'Most tools support JPG, PNG, and WebP. The EXIF Viewer requires JPEG or TIFF.' },
  { q: 'Can I batch process multiple images?', a: 'Yes! Most tools support batch processing — just select multiple files at once.' },
  { q: 'Does changing DPI affect quality?', a: 'No. DPI is metadata for printers. It does not resample or alter pixel data.' },
  { q: 'Can I use it on my phone?', a: 'Absolutely. The interface is fully responsive and works on all modern mobile browsers.' },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-2 border-border-main rounded-2xl overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left gap-4">
        <span className="font-bold text-text">{q}</span>
        <ChevronDown size={20} className={`text-text-muted flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-text-muted text-sm leading-relaxed border-t border-border-light pt-4">{a}</p>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  return (
    <div className="bg-bg-soft">

      {/* ═══════════ HERO ═══════════ */}
      <section className="py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border border-border-light px-4 py-2 rounded-full mb-8 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-sub">100% Client-Side · No Uploads</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] premium-text-glow">
            PIXEL <span className="text-primary">TOOLS</span>
          </h1>
          <p className="max-w-2xl mx-auto text-text-muted text-lg mb-12 leading-relaxed">
            The ultimate free online image editor — compress, resize, crop, convert formats, apply filters, add watermarks, extract colors, and read EXIF data. No signup, no installs, no server uploads. Your photos stay on your device, always.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/features" className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary-h transition-all hover:scale-105 shadow-xl shadow-black/10 inline-flex items-center gap-2">
              Explore Tools <ArrowRight size={20} />
            </Link>
            <a href="#how-to-use" className="bg-white border-2 border-border-main px-10 py-5 rounded-2xl font-bold text-lg hover:bg-bg-soft transition-all">
              How to Use
            </a>
          </div>
        </div>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.4 }}>
          {/* Large floating gradient blobs */}
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-3xl" style={{ animation: 'float-slow 12s ease-in-out infinite' }}></div>
          <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full blur-3xl" style={{ animation: 'float-reverse 15s ease-in-out infinite' }}></div>
          <div className="absolute top-[20%] left-[50%] w-[300px] h-[300px] bg-gradient-to-br from-gray-300 to-transparent rounded-full blur-2xl" style={{ animation: 'drift 10s ease-in-out infinite' }}></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-[15%] left-[10%] w-16 h-16 border-2 border-gray-400 rounded-xl" style={{ animation: 'spin-slow 20s linear infinite' }}></div>
          <div className="absolute bottom-[25%] right-[12%] w-12 h-12 border-2 border-gray-400 rounded-full" style={{ animation: 'float-slow 8s ease-in-out infinite' }}></div>
          <div className="absolute top-[60%] left-[20%] w-8 h-8 bg-gray-400 rounded-full" style={{ animation: 'float-reverse 9s ease-in-out infinite' }}></div>
          <div className="absolute top-[10%] right-[25%] w-20 h-20 border-2 border-gray-300 rounded-2xl" style={{ animation: 'spin-slow 25s linear infinite reverse' }}></div>
          <div className="absolute bottom-[15%] left-[40%] w-6 h-6 bg-gray-300 rounded" style={{ animation: 'drift 7s ease-in-out infinite' }}></div>
          <div className="absolute top-[40%] right-[8%] w-10 h-10 border-2 border-gray-400 rounded-lg" style={{ animation: 'float-slow 11s ease-in-out infinite' }}></div>
          
          {/* Dotted circles */}
          <div className="absolute bottom-[40%] right-[30%] w-24 h-24 border-2 border-dashed border-gray-300 rounded-full" style={{ animation: 'spin-slow 30s linear infinite' }}></div>
          <div className="absolute top-[35%] left-[5%] w-32 h-32 border-2 border-dashed border-gray-300 rounded-full" style={{ animation: 'spin-slow 35s linear infinite reverse' }}></div>
        </div>
      </section>

      {/* ═══════════ ALL FEATURES ═══════════ */}
      <section id="features" className="py-20 md:py-28 px-6 bg-white rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-bg-soft px-4 py-2 rounded-full border border-border-light">Complete Suite</span>
              <h2 className="text-5xl font-black mt-4 mb-3">All Features</h2>
              <p className="text-text-muted max-w-md">12 professional-grade image utilities, all free, all running locally.</p>
            </div>
            <span className="bg-bg-soft border border-border-light px-5 py-2 rounded-xl text-xs font-bold text-text-sub h-fit">12 Tools Active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tools.map((t, i) => (
              <Link key={i} to={t.link} className="group bg-bg-soft border border-border-light rounded-2xl p-6 hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all shadow-sm">
                    <t.icon size={20} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[8px] font-bold bg-white text-text-muted px-2 py-1 rounded-full uppercase tracking-widest group-hover:bg-white/20 group-hover:text-white/80 transition-all">{t.tag}</span>
                </div>
                <h3 className="font-bold mb-1 group-hover:text-white transition-colors">{t.title}</h3>
                <p className="text-text-muted text-xs leading-relaxed group-hover:text-white/70 transition-colors">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW TO USE ═══════════ */}
      <section id="how-to-use" className="py-28 px-6 bg-bg-soft">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-white px-4 py-2 rounded-full border border-border-light">Guide</span>
            <h2 className="text-5xl font-black mt-4 mb-3">How to Use</h2>
            <p className="text-text-muted max-w-lg mx-auto">Four simple steps to process any image.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="bg-white border-2 border-border-main rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4 mb-5">
                  <div className="text-4xl font-black text-primary/10">{s.num}</div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                    <s.icon size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how-it-works" className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-bg-soft px-4 py-2 rounded-full border border-border-light">Technology</span>
            <h2 className="text-5xl font-black mt-4 mb-3">How It Works</h2>
            <p className="text-text-muted max-w-lg mx-auto">The technology powering browser-based image processing.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Monitor, title: 'Browser Canvas API', desc: 'We decode your image into raw pixels using Canvas, apply transformations, and re-encode — all in browser memory.', color: 'bg-blue-50 text-blue-600' },
              { icon: Shield, title: 'Zero Server Contact', desc: 'Your images are NEVER uploaded. The entire pipeline runs in JavaScript on your machine. Close the tab and data is gone.', color: 'bg-green-50 text-green-600' },
              { icon: Cpu, title: 'Binary Metadata Parsing', desc: 'For DPI and EXIF, we parse raw binary data (JFIF/pHYs chunks) directly using ArrayBuffer and DataView.', color: 'bg-purple-50 text-purple-600' },
              { icon: Zap, title: 'Precision Compression', desc: 'Our compressor uses a 12-step binary search to find the exact JPEG quality that matches your target file size.', color: 'bg-amber-50 text-amber-600' },
            ].map((item, i) => (
              <div key={i} className="bg-bg-soft border border-border-light rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${item.color}`}><item.icon size={28} /></div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-text-muted leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY US ═══════════ */}
      <section id="why-us" className="py-28 px-6 bg-bg-soft">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-white px-4 py-2 rounded-full border border-border-light">Why Choose Us</span>
            <h2 className="text-5xl font-black mt-4 mb-3">Why PixelTools?</h2>
            <p className="text-text-muted max-w-lg mx-auto">We built the image editor we always wanted.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((r, i) => (
              <div key={i} className="bg-white border-2 border-border-main rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${r.color}`}><r.icon size={24} /></div>
                <h3 className="font-bold text-lg mb-2">{r.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section id="faq" className="py-28 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-bg-soft px-4 py-2 rounded-full border border-border-light">Support</span>
            <h2 className="text-5xl font-black mt-4 mb-3">FAQ</h2>
            <p className="text-text-muted max-w-lg mx-auto">Quick answers to the most common questions.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => <FaqItem key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST BAR / CTA ═══════════ */}
      <section className="py-28 px-6 bg-primary text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Start processing images now.</h2>
          <p className="text-white/60 max-w-lg mx-auto mb-10 text-lg">No signup. No upload. No cost. Just open a tool and go.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <Link to="/features" className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/90 transition-all shadow-xl inline-flex items-center gap-2">
              Browse All Tools <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/10">
            <div>
              <div className="text-4xl font-black mb-2">12</div>
              <p className="text-white/50 text-sm">Professional Tools</p>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">0</div>
              <p className="text-white/50 text-sm">Server Uploads</p>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">∞</div>
              <p className="text-white/50 text-sm">Free Uses</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
