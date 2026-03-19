import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, DollarSign, Eye, Smartphone, Server, ArrowRight } from 'lucide-react';

const reasons = [
  { icon: Shield, title: '100% Privacy', desc: 'Your images never leave your device. There is no server upload, no cloud storage, and no tracking. When you close the tab, the data is gone forever.', color: 'bg-green-50 text-green-600' },
  { icon: Zap, title: 'Instant Processing', desc: 'No waiting for server responses. Everything processes in real-time using your browser\'s Canvas API. Batch 10+ images in seconds.', color: 'bg-amber-50 text-amber-600' },
  { icon: DollarSign, title: 'Completely Free', desc: 'No premium tier, no credits system, no "sign up for more". Every tool is available to everyone, always. Zero hidden costs.', color: 'bg-blue-50 text-blue-600' },
  { icon: Eye, title: 'No Ads or Trackers', desc: 'We don\'t run ads, inject trackers, or sell data. PixelTools is built as a utility, not an ad platform.', color: 'bg-purple-50 text-purple-600' },
  { icon: Smartphone, title: 'Works Everywhere', desc: 'Fully responsive and tested on Chrome, Edge, Firefox, and Safari — on desktops, tablets, and smartphones.', color: 'bg-red-50 text-red-600' },
  { icon: Server, title: 'No Installation', desc: 'No software to download, no plugins to install. Just open the URL in any modern browser and start processing images immediately.', color: 'bg-cyan-50 text-cyan-600' },
];

const WhyUs = () => (
  <div className="max-w-5xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-bg-soft px-4 py-2 rounded-full border border-border-light">Why Choose Us</span>
      <h1 className="text-5xl font-black tracking-tight mt-6 mb-4">Why PixelTools?</h1>
      <p className="text-text-muted text-lg max-w-xl mx-auto">We built the image editor we always wanted — fast, private, and free.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      {reasons.map((r, i) => (
        <div key={i} className="bg-white border-2 border-border-main rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${r.color}`}>
            <r.icon size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">{r.title}</h3>
          <p className="text-text-muted leading-relaxed">{r.desc}</p>
        </div>
      ))}
    </div>

    <div className="bg-primary text-white rounded-3xl p-12 text-center">
      <h3 className="text-3xl font-black mb-4">Ready to try?</h3>
      <p className="text-white/60 max-w-md mx-auto mb-8">Join thousands of students, developers, and designers who use PixelTools every day.</p>
      <Link to="/" className="bg-white text-primary px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/90 transition-all inline-flex items-center gap-2 shadow-xl">
        Browse All Tools <ArrowRight size={20} />
      </Link>
    </div>
  </div>
);

export default WhyUs;
