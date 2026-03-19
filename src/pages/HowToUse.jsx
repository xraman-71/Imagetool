import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Sliders, Download, MousePointer, ArrowRight } from 'lucide-react';

const steps = [
  { icon: Upload, title: 'Upload Your Image', desc: 'Click the upload area or drag & drop your image file. We support JPG, PNG, and WebP formats up to 100MB.', color: 'bg-blue-50 text-blue-600' },
  { icon: MousePointer, title: 'Choose Your Tool', desc: 'Pick from 12 professional tools — resize, compress, convert, add filters, watermarks, and more.', color: 'bg-purple-50 text-purple-600' },
  { icon: Sliders, title: 'Adjust Settings', desc: 'Fine-tune your parameters. Set exact dimensions, target file sizes, filter intensities, or crop ratios.', color: 'bg-amber-50 text-amber-600' },
  { icon: Download, title: 'Download Result', desc: 'Hit the download button and your processed image is saved instantly. No account or email required.', color: 'bg-green-50 text-green-600' },
];

const HowToUse = () => (
  <div className="max-w-4xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-bg-soft px-4 py-2 rounded-full border border-border-light">Guide</span>
      <h1 className="text-5xl font-black tracking-tight mt-6 mb-4">How to Use</h1>
      <p className="text-text-muted text-lg max-w-xl mx-auto">Four simple steps to process any image — no signup, no uploads to servers.</p>
    </div>

    <div className="space-y-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-8 bg-white border-2 border-border-main rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div className="text-3xl font-black text-primary/20">0{i + 1}</div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.color}`}>
              <s.icon size={28} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{s.title}</h3>
            <p className="text-text-muted leading-relaxed">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="text-center mt-16">
      <Link to="/" className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-h transition-all shadow-xl shadow-black/10 inline-flex items-center gap-2">
        Start Using Tools <ArrowRight size={20} />
      </Link>
    </div>
  </div>
);

export default HowToUse;
