import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Are my images uploaded to a server?', a: 'No. All processing happens 100% in your browser using the Canvas API. Your images never leave your device. We have zero server-side storage.' },
  { q: 'Is PixelTools really free?', a: 'Yes, completely free with no hidden costs, no premium tiers, and no account required. Every tool is available to everyone.' },
  { q: 'What file formats are supported?', a: 'Most tools support JPG, PNG, and WebP. The DPI Changer specifically works with JPG and PNG files. The EXIF Viewer requires JPEG or TIFF images.' },
  { q: 'Is there a file size limit?', a: 'There is no hard limit, but very large files (100MB+) may be slow to process depending on your device\'s RAM and CPU. We recommend files under 50MB for the best experience.' },
  { q: 'Can I batch process multiple images?', a: 'Yes! Most tools (Compressor, DPI Changer, Resizer, Rotate/Flip, Format Converter, and Filters) support batch processing — just select multiple files.' },
  { q: 'How does the compression algorithm work?', a: 'We use a 12-step binary search to find the exact JPEG quality parameter that produces a file size closest to your target. This is far more precise than a simple quality slider.' },
  { q: 'Does changing DPI affect image quality?', a: 'No. DPI is metadata that tells printers how large to print the image. Changing DPI does not resample, resize, or alter the pixel data in any way.' },
  { q: 'Can I use PixelTools on my phone?', a: 'Yes! The interface is fully responsive and works on modern mobile browsers (Chrome, Safari, Firefox). All processing runs locally on your device.' },
  { q: 'What browser do you recommend?', a: 'We recommend the latest version of Google Chrome or Microsoft Edge for the best performance. Firefox and Safari are also fully supported.' },
  { q: 'How do I report a bug?', a: 'Please reach out to us via the contact information in the footer. We actively maintain and improve PixelTools based on user feedback.' },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-2 border-border-main rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left gap-4">
        <span className="font-bold text-text">{q}</span>
        <ChevronDown size={20} className={`text-text-muted flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-6 px-6' : 'max-h-0'}`}>
        <p className="text-text-muted text-sm leading-relaxed border-t border-border-light pt-4">{a}</p>
      </div>
    </div>
  );
};

const FAQ = () => (
  <div className="max-w-3xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-bg-soft px-4 py-2 rounded-full border border-border-light">Support</span>
      <h1 className="text-5xl font-black tracking-tight mt-6 mb-4">FAQ</h1>
      <p className="text-text-muted text-lg max-w-xl mx-auto">Answers to the most common questions about PixelTools.</p>
    </div>
    <div className="space-y-4">
      {faqs.map((f, i) => <FaqItem key={i} {...f} />)}
    </div>
  </div>
);

export default FAQ;
