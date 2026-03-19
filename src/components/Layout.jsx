import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Advanced Dynamic SEO
    const routeData = {
      '/': {
        title: 'PixelTools - Free Online Image Editor',
        desc: 'Compress, resize, crop, and edit images 100% locally in your browser. No uploads, no signup, total privacy.',
        key: 'image editor, online photo editor, batch compressor'
      },
      '/dpi-changer': {
        title: 'DPI Changer - Change Image Resolution Online',
        desc: 'Update image resolution (DPI) metadata for high-quality printing without changing pixel dimensions.',
        key: 'change dpi, image resolution, 300 dpi converter'
      },
      '/compressor': {
        title: 'Image Compressor - Reduce Batch Size 100% Locally',
        desc: 'Batch compress JPG, PNG, and WebP images to specific KB/MB targets. Privacy-first local processing.',
        key: 'image compressor, reduce image size, kb compressor'
      },
      '/resizer': {
        title: 'Image Resizer - Scale Batch Images in Browser',
        desc: 'Resize images to exact pixel dimensions or percentages with aspect ratio locking. Fast and private.',
        key: 'image resizer, scale images, resize px'
      },
      '/converter': {
        title: 'Format Converter - JPG, PNG, WebP Batch Conversion',
        desc: 'Instantly convert images between JPG, PNG, and WebP formats. Batch processing with 100% privacy.',
        key: 'image converter, webp to jpg, png to webp'
      },
      '/cropper': {
        title: 'Image Cropper - Precise Image Trimming Online',
        desc: 'Crop your images with precision using preset aspect ratios or free-form selection. Entirely in-browser.',
        key: 'image cropper, crop photo, aspect ratio crop'
      },
      '/rotate-flip': {
        title: 'Rotate & Flip - Precise 360° Image Orientation',
        desc: 'Rotate images by any angle or flip them horizontally/vertically with instant local updates.',
        key: 'rotate image, flip photo, 360 rotation'
      },
      '/filters': {
        title: 'Image Filters - 14+ Professional Photo Effects',
        desc: 'Apply cinematic, vintage, and modern filters to your photos instantly with professional-grade local processing.',
        key: 'photo filters, image effects, vintage filter'
      },
      '/base64': {
        title: 'Base64 Converter - Encode/Decode Images Locally',
        desc: 'Convert images to Base64 strings or decode strings back to images. Perfect for web developers.',
        key: 'base64 converter, image to string, b64 decoder'
      },
      '/color-picker': {
        title: 'Color Picker - Extract Palettes & HEX Codes',
        desc: 'Identity colors from any image, generate beautiful palettes, and extract HEX/RGB codes instantly.',
        key: 'color picker, palette generator, image hex code'
      },
      '/watermark': {
        title: 'Watermark Tool - Batch Brand Your Images',
        desc: 'Protect your work with custom text watermarks. Multi-line support and precision 9-grid positioning.',
        key: 'add watermark, brand images, text overlay'
      },
      '/rounder': {
        title: 'Border & Rounder - 20+ Designer Frame Styles',
        desc: 'Add professional borders and rounded corners with 20+ designer styles including Brutalist and Art Deco.',
        key: 'rounded corners, image borders, photo frames'
      },
      '/exif-viewer': {
        title: 'EXIF Viewer - Reveal Camera & Metadata',
        desc: 'Extract hidden EXIF metadata from your photos, including camera make, lens, and GPS location.',
        key: 'exif viewer, photo metadata, camera info'
      }
    };
    
    const current = routeData[pathname] || routeData['/'];
    document.title = current.title;
    
    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', current.desc);

    // Update Meta Keywords
    let metaKey = document.querySelector('meta[name="keywords"]');
    if (metaKey) metaKey.setAttribute('content', current.key + ', pixeltools');

    // Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', current.title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', current.desc);
    
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col font-body bg-bg-soft/30">
      <Header />
      <main className="flex-grow animate-in fade-in duration-500">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
