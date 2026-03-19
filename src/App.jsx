import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DpiChanger from './pages/DpiChanger';
import ImageCompressor from './pages/ImageCompressor';
import ImageResizer from './pages/ImageResizer';
import FormatConverter from './pages/FormatConverter';
import RotateFlipTool from './pages/RotateFlipTool';
import ImageCropper from './pages/ImageCropper';
import ImageFilters from './pages/ImageFilters';
import Base64Converter from './pages/Base64Converter';
import ColorPicker from './pages/ColorPicker';
import WatermarkTool from './pages/WatermarkTool';
import ImageRounder from './pages/ImageRounder';
import ExifViewer from './pages/ExifViewer';
import HowToUse from './pages/HowToUse';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import AllFeatures from './pages/AllFeatures';
import WhyUs from './pages/WhyUs';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dpi-changer" element={<DpiChanger />} />
          <Route path="/compressor" element={<ImageCompressor />} />
          <Route path="/resizer" element={<ImageResizer />} />
          <Route path="/converter" element={<FormatConverter />} />
          <Route path="/cropper" element={<ImageCropper />} />
          <Route path="/rotate-flip" element={<RotateFlipTool />} />
          <Route path="/filters" element={<ImageFilters />} />
          <Route path="/base64" element={<Base64Converter />} />
          <Route path="/color-picker" element={<ColorPicker />} />
          <Route path="/watermark" element={<WatermarkTool />} />
          <Route path="/rounder" element={<ImageRounder />} />
          <Route path="/exif-viewer" element={<ExifViewer />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/features" element={<AllFeatures />} />
          <Route path="/why-us" element={<WhyUs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
