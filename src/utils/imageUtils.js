/**
 * Extracted DPI manipulation logic from PixelTools legacy
 */

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const extractDPI = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const view = new DataView(arrayBuffer);
      try {
        if (file.type === 'image/jpeg') {
          resolve(extractJPEGDPI(view));
        } else if (file.type === 'image/png') {
          resolve(extractPNGDPI(view));
        } else {
          resolve(72);
        }
      } catch (err) {
        resolve(72);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

function extractJPEGDPI(view) {
  let offset = 2;
  while (offset < view.byteLength) {
    if (view.getUint8(offset) === 0xFF && view.getUint8(offset + 1) === 0xE0) {
      const length = view.getUint16(offset + 2);
      if (view.getUint8(offset + 4) === 0x4A && view.getUint8(offset + 5) === 0x46 && 
          view.getUint8(offset + 6) === 0x49 && view.getUint8(offset + 7) === 0x46) {
        const units = view.getUint8(offset + 9);
        const xDensity = view.getUint16(offset + 10);
        if (units === 1) return xDensity;
        if (units === 2) return Math.round(xDensity * 2.54);
      }
      offset += 2 + length;
    } else {
      offset++;
    }
  }
  return 72;
}

function extractPNGDPI(view) {
  let offset = 8;
  while (offset < view.byteLength) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(view.getUint8(offset+4), view.getUint8(offset+5), view.getUint8(offset+6), view.getUint8(offset+7));
    if (type === 'pHYs') {
      const pixelsPerUnitX = view.getUint32(offset + 8);
      const unit = view.getUint8(offset + 16);
      if (unit === 1) return Math.round(pixelsPerUnitX / 39.3701);
    }
    offset += 12 + length;
  }
  return 72;
}

export const setDPIMetadata = async (blob, dpi, mimeType) => {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  if (mimeType === 'image/jpeg') {
    return setJPEGDPI(uint8Array, dpi);
  } else if (mimeType === 'image/png') {
    return setPNGDPI(uint8Array, dpi);
  }
  return blob;
};

function setJPEGDPI(uint8Array, dpi) {
  const newArray = new Uint8Array(uint8Array.length + 18);
  newArray[0] = 0xFF; newArray[1] = 0xD8;
  newArray[2] = 0xFF; newArray[3] = 0xE0;
  newArray[4] = 0x00; newArray[5] = 0x10;
  newArray[6] = 0x4A; newArray[7] = 0x46; newArray[8] = 0x49; newArray[9] = 0x46; newArray[10] = 0x00;
  newArray[11] = 0x01; newArray[12] = 0x01; newArray[13] = 0x01;
  newArray[14] = (dpi >> 8) & 0xFF; newArray[15] = dpi & 0xFF;
  newArray[16] = (dpi >> 8) & 0xFF; newArray[17] = dpi & 0xFF;
  newArray[18] = 0x00; newArray[19] = 0x00;
  newArray.set(uint8Array.slice(2), 20);
  return new Blob([newArray], { type: 'image/jpeg' });
}

function setPNGDPI(uint8Array, dpi) {
  const pixelsPerMeter = Math.round(dpi * 39.3701);
  const pHYsChunk = new Uint8Array(21);
  pHYsChunk[0] = 0x00; pHYsChunk[1] = 0x00; pHYsChunk[2] = 0x00; pHYsChunk[3] = 0x09;
  pHYsChunk[4] = 0x70; pHYsChunk[5] = 0x48; pHYsChunk[6] = 0x59; pHYsChunk[7] = 0x73;
  pHYsChunk[8] = (pixelsPerMeter >> 24) & 0xFF; pHYsChunk[9] = (pixelsPerMeter >> 16) & 0xFF;
  pHYsChunk[10] = (pixelsPerMeter >> 8) & 0xFF; pHYsChunk[11] = pixelsPerMeter & 0xFF;
  pHYsChunk[12] = (pixelsPerMeter >> 24) & 0xFF; pHYsChunk[13] = (pixelsPerMeter >> 16) & 0xFF;
  pHYsChunk[14] = (pixelsPerMeter >> 8) & 0xFF; pHYsChunk[15] = pixelsPerMeter & 0xFF;
  pHYsChunk[16] = 0x01;
  const crc = calculateCRC(pHYsChunk.slice(4, 17));
  pHYsChunk[17] = (crc >> 24) & 0xFF; pHYsChunk[18] = (crc >> 16) & 0xFF;
  pHYsChunk[19] = (crc >> 8) & 0xFF; pHYsChunk[20] = crc & 0xFF;
  const newArray = new Uint8Array(uint8Array.length + 21);
  newArray.set(uint8Array.slice(0, 33), 0);
  newArray.set(pHYsChunk, 33);
  newArray.set(uint8Array.slice(33), 54);
  return new Blob([newArray], { type: 'image/png' });
}

function calculateCRC(data) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
    }
  }
  return crc ^ 0xFFFFFFFF;
}

// Compression Logic
export const compressImage = async (file, targetKB, maxWidth, maxHeight) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        let { width, height } = img;
        if (maxWidth && width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        if (maxHeight && height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Binary search for quality
        let min = 0.01, max = 0.99, bestBlob = null;
        for (let i = 0; i < 12; i++) {
          const mid = (min + max) / 2;
          const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', mid));
          if (blob.size / 1024 <= targetKB) {
            bestBlob = blob;
            min = mid;
          } else {
            max = mid;
          }
        }
        if (!bestBlob) {
           bestBlob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.01));
        }
        resolve(bestBlob);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const resizeImage = async (file, newWidth, newHeight, maintainAspectRatio) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = newWidth;
        let height = newHeight;
        
        if (maintainAspectRatio) {
          if (width && !height) {
            height = (width / img.width) * img.height;
          } else if (!width && height) {
            width = (height / img.height) * img.width;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width || img.width;
        canvas.height = height || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => resolve(blob), file.type, 0.95);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const rotateFlipImage = async (file, angle, flipH, flipV) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const rad = (angle * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width * cos + img.height * sin;
        canvas.height = img.width * sin + img.height * cos;
        
        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        canvas.toBlob((blob) => resolve(blob), file.type, 0.95);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const convertFormat = async (file, targetFormat) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const mimeType = `image/${targetFormat}`;
        canvas.toBlob((blob) => resolve(blob), mimeType, 0.95);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
};

export const applyFilters = async (file, filters) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        ctx.filter = `
          brightness(${filters.brightness || 100}%) 
          contrast(${filters.contrast || 100}%) 
          grayscale(${filters.grayscale || 0}%) 
          sepia(${filters.sepia || 0}%) 
          blur(${filters.blur || 0}px)
          hue-rotate(${filters.hue || 0}deg)
          saturate(${filters.saturate === undefined ? 100 : filters.saturate}%)
          invert(${filters.invert || 0}%)
          opacity(${filters.opacity === undefined ? 100 : filters.opacity}%)
        `;
        
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none'; // reset for custom layers

        if (filters.posterize && filters.posterize > 0) {
           ctx.save();
           ctx.globalAlpha = filters.posterize / 20;
           ctx.filter = `blur(2px) contrast(150%) saturate(150%)`;
           ctx.drawImage(img, 0, 0);
           ctx.restore();
        }

        if (filters.sharpen && filters.sharpen > 0) {
           ctx.save();
           ctx.globalAlpha = filters.sharpen / 100;
           ctx.filter = `contrast(125%) brightness(110%)`;
           ctx.drawImage(img, 0, 0);
           ctx.restore();
        }

        if (filters.warmth && filters.warmth !== 0) {
           ctx.fillStyle = filters.warmth > 0 ? `rgba(255, 150, 0, ${filters.warmth/100 * 0.3})` : `rgba(0, 150, 255, ${Math.abs(filters.warmth)/100 * 0.3})`;
           ctx.globalCompositeOperation = 'overlay';
           ctx.fillRect(0, 0, canvas.width, canvas.height);
           ctx.globalCompositeOperation = 'source-over';
        }

        if (filters.fade && filters.fade > 0) {
           ctx.fillStyle = `rgba(255, 255, 255, ${filters.fade / 100 * 0.5})`;
           ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        if (filters.vignette && filters.vignette > 0) {
           const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height) * 0.4, canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height));
           grad.addColorStop(0, 'rgba(0,0,0,0)');
           grad.addColorStop(1, `rgba(0,0,0,${filters.vignette / 100})`);
           ctx.fillStyle = grad;
           ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        if (filters.tint && filters.tint > 0) {
           ctx.fillStyle = `rgba(255, 0, 128, ${filters.tint / 100})`;
           ctx.globalCompositeOperation = 'color';
           ctx.fillRect(0, 0, canvas.width, canvas.height);
           ctx.globalCompositeOperation = 'source-over';
        }

        if (filters.noise && filters.noise > 0) {
           const noiseCanvas = document.createElement('canvas');
           noiseCanvas.width = 100; noiseCanvas.height = 100;
           const nCtx = noiseCanvas.getContext('2d');
           const imgData = nCtx.createImageData(100, 100);
           const data = imgData.data;
           for(let i = 0; i < data.length; i += 4) {
               const val = Math.random() * 255;
               data[i] = val; data[i+1] = val; data[i+2] = val; data[i+3] = 255;
           }
           nCtx.putImageData(imgData, 0, 0);
           ctx.save();
           ctx.globalAlpha = (filters.noise / 100) * 0.15; // lower alpha so it doesn't completely destroy the image
           ctx.globalCompositeOperation = 'overlay';
           const pattern = ctx.createPattern(noiseCanvas, 'repeat');
           ctx.fillStyle = pattern;
           ctx.fillRect(0, 0, canvas.width, canvas.height);
           ctx.restore();
        }

        canvas.toBlob((blob) => resolve(blob), file.type, 0.95);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const base64ToImage = (base64) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = base64;
  });
};

export const addWatermark = async (file, text, options = {}, subText = '') => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0);
        
        const fontSize = options.fontSize || (canvas.width / 20);
        const fontFamily = options.fontFamily || 'sans-serif';
        const fontWeight = options.fontWeight || 'bold';
        const fontStyle = options.fontStyle || 'normal';
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = options.color || 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = options.align || 'center';
        
        // 9-Grid Position Logic
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        const pad = 60;
        
        const pos = options.position || 'center';
        if (pos.includes('top')) y = fontSize + pad;
        if (pos.includes('bottom')) y = canvas.height - pad;
        if (pos.includes('left')) { x = pad; ctx.textAlign = 'left'; }
        if (pos.includes('right')) { x = canvas.width - pad; ctx.textAlign = 'right'; }
        if (pos === 'center') { x = canvas.width / 2; y = canvas.height / 2; ctx.textAlign = 'center'; }
        
        // Custom x, y override if provided
        if (options.x !== undefined) x = options.x;
        if (options.y !== undefined) y = options.y;
        
        const drawText = (txt, tx, ty, rot) => {
          if (rot) {
            ctx.save();
            ctx.translate(tx, ty);
            ctx.rotate((rot * Math.PI) / 180);
            ctx.fillText(txt, 0, 0);
            if (subText) {
               ctx.font = `${fontStyle} ${fontWeight} ${fontSize * 0.6}px ${fontFamily}`;
               ctx.fillText(subText, 0, fontSize * 0.8);
            }
            ctx.restore();
          } else {
            ctx.fillText(txt, tx, ty);
            if (subText) {
               ctx.font = `${fontStyle} ${fontWeight} ${fontSize * 0.6}px ${fontFamily}`;
               ctx.fillText(subText, tx, ty + fontSize * 0.8);
            }
          }
        };

        if (pos === 'tile') {
           ctx.textAlign = 'center';
           const stepX = canvas.width / 3;
           const stepY = canvas.height / 3;
           for(let tx = -canvas.width; tx <= canvas.width*2; tx += stepX) {
              for(let ty = -canvas.height; ty <= canvas.height*2; ty += stepY) {
                  drawText(text, tx, ty, options.rotate);
              }
           }
        } else {
           drawText(text, x, y, options.rotate);
        }
        
        canvas.toBlob((blob) => resolve(blob), file.type, 0.95);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const addBorderAndRound = async (file, config) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const radius = config.radius || 0;
        let borderWidth = config.borderWidth || 0;
        const borderColor = config.borderColor || '#000000';
        const shadow = config.shadow || 'none';
        const style = config.borderStyle || 'solid';
        const intensity = config.styleIntensity || 50;
        const iMult = intensity / 50; // default 1.0
        
        let padTop = borderWidth, padBottom = borderWidth, padLeft = borderWidth, padRight = borderWidth;
        
        if (style === 'polaroid') {
           padTop = Math.max(borderWidth, 20); padLeft = Math.max(borderWidth, 20); padRight = Math.max(borderWidth, 20);
           padBottom = Math.max(borderWidth * 4, 80) * iMult;
        } else if (style === 'filmstrip') {
           padTop = Math.max(borderWidth, 40); padBottom = Math.max(borderWidth, 40);
           padLeft = borderWidth; padRight = borderWidth;
        }

        let pad = 0;
        let shadowOffsetX = 0; let shadowOffsetY = 0; let shadowBlur = 0;
        
        if (shadow === 'soft') { pad = 40; shadowBlur = 20; shadowOffsetY = 10; }
        else if (shadow === 'hard') { pad = 30; shadowBlur = 0; shadowOffsetY = 15; shadowOffsetX = 15; }
        else if (shadow === 'glow') { pad = 40; shadowBlur = 30; }

        const canvas = document.createElement('canvas');
        canvas.width = img.width + padLeft + padRight + (pad * 2);
        canvas.height = img.height + padTop + padBottom + (pad * 2);
        const ctx = canvas.getContext('2d');
        
        const contentX = pad;
        const contentY = pad;
        const contentW = img.width + padLeft + padRight;
        const contentH = img.height + padTop + padBottom;

        const imgX = contentX + padLeft;
        const imgY = contentY + padTop;
        
        const isStrokeStyle = ['dashed', 'dotted', 'double'].includes(style);

        // Shadow processing
        ctx.save();
        if (shadow !== 'none') {
          ctx.shadowColor = shadow === 'glow' ? borderColor : 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = shadowBlur;
          ctx.shadowOffsetX = shadowOffsetX;
          ctx.shadowOffsetY = shadowOffsetY;
        }

        // Base Background / Border Fill
        if (!isStrokeStyle) {
           if (style === 'gradient') {
             const grad = ctx.createLinearGradient(contentX, contentY, contentX + contentW, contentY + contentH);
             grad.addColorStop(0, borderColor);
             // Create a complementary lighter/darker color or just fade to white/black
             grad.addColorStop(1, '#ffffff');
             ctx.fillStyle = grad;
           } else if (style === 'filmstrip') {
             ctx.fillStyle = borderColor === '#ffffff' ? '#111111' : borderColor;
           } else if (style === 'polaroid') {
             ctx.fillStyle = borderColor === '#000000' ? '#f9fafb' : borderColor;
           } else if (style === 'neon') {
             ctx.fillStyle = '#111111'; // Neon needs dark bg
           } else {
             ctx.fillStyle = borderColor;
           }

           ctx.beginPath();
           if (radius > 0 && style !== 'filmstrip' && style !== 'polaroid') {
             ctx.roundRect(contentX, contentY, contentW, contentH, radius + padTop);
           } else {
             ctx.rect(contentX, contentY, contentW, contentH);
           }
           ctx.fill();
        } else {
           // For stroke styles, fill inner area or frame
           // Let's stroke the outer rect
           ctx.lineWidth = borderWidth;
           ctx.strokeStyle = borderColor;
           const halfB = borderWidth / 2;
           ctx.beginPath();
           
           if (style === 'dashed') {
             ctx.setLineDash([borderWidth * 2 * iMult, borderWidth * 1.5 * iMult]);
           } else if (style === 'dotted') {
             ctx.setLineDash([borderWidth, borderWidth * 1.5 * iMult]);
             ctx.lineCap = 'round';
           }
           
           if (style === 'double') {
             ctx.lineWidth = Math.max(borderWidth / 3 * iMult, 1);
             if (radius > 0) {
                ctx.roundRect(contentX + halfB, contentY + halfB, contentW - borderWidth, contentH - borderWidth, radius);
                ctx.stroke();
                ctx.beginPath();
                ctx.roundRect(contentX + halfB + ctx.lineWidth*2, contentY + halfB + ctx.lineWidth*2, contentW - borderWidth - ctx.lineWidth*4, contentH - borderWidth - ctx.lineWidth*4, Math.max(0, radius - ctx.lineWidth*2));
                ctx.stroke();
             } else {
                ctx.strokeRect(contentX + halfB, contentY + halfB, contentW - borderWidth, contentH - borderWidth);
                ctx.strokeRect(contentX + halfB + ctx.lineWidth*2, contentY + halfB + ctx.lineWidth*2, contentW - borderWidth - ctx.lineWidth*4, contentH - borderWidth - ctx.lineWidth*4);
             }
           } else {
             if (radius > 0) {
               ctx.roundRect(contentX + halfB, contentY + halfB, contentW - borderWidth, contentH - borderWidth, radius);
             } else {
               ctx.rect(contentX + halfB, contentY + halfB, contentW - borderWidth, contentH - borderWidth);
             }
             ctx.stroke();
           }
        }
        ctx.restore(); // remove shadow state

        // Special border decorations
        ctx.save();
        if (style === 'stamp') {
           ctx.globalCompositeOperation = 'destination-out';
           const holeRadius = Math.max(padTop / 3, 5) * iMult;
           const spacing = holeRadius * 3;
           ctx.beginPath();
           for(let x = contentX; x <= contentX + contentW; x += spacing) {
              ctx.moveTo(x, contentY); ctx.arc(x, contentY, holeRadius, 0, Math.PI * 2);
              ctx.moveTo(x, contentY + contentH); ctx.arc(x, contentY + contentH, holeRadius, 0, Math.PI * 2);
           }
           for(let y = contentY; y <= contentY + contentH; y += spacing) {
              ctx.moveTo(contentX, y); ctx.arc(contentX, y, holeRadius, 0, Math.PI * 2);
              ctx.moveTo(contentX + contentW, y); ctx.arc(contentX + contentW, y, holeRadius, 0, Math.PI * 2);
           }
           ctx.fill();
        } else if (style === 'filmstrip') {
           ctx.fillStyle = '#ffffff';
           const holeW = 15 * Math.max(iMult, 0.5); const holeH = 20 * Math.max(iMult, 0.5);
           for(let x = contentX + 20; x < contentX + contentW - 20; x += holeW * 2) {
              ctx.fillRect(x, contentY + 10, holeW, holeH);
              ctx.fillRect(x, contentY + contentH - 30, holeW, holeH);
           }
        } else if (style === 'polaroid') {
           ctx.strokeStyle = '#e5e7eb';
           ctx.lineWidth = 1;
           ctx.strokeRect(contentX, contentY, contentW, contentH);
        } else if (style === 'neon') {
           ctx.globalCompositeOperation = 'screen';
           ctx.lineWidth = Math.max(borderWidth / 4, 2);
           const drawNeon = (color, blur) => {
             ctx.strokeStyle = color; ctx.shadowColor = color; ctx.shadowBlur = blur * iMult;
             ctx.beginPath();
             if (radius > 0) ctx.roundRect(imgX, imgY, img.width, img.height, radius);
             else ctx.rect(imgX, imgY, img.width, img.height);
             ctx.stroke();
           };
           drawNeon(borderColor, 20); drawNeon(borderColor, 10); drawNeon('#ffffff', 2);
        } else if (['zigzag', 'wave', 'scalloped', 'parchment'].includes(style)) {
           ctx.beginPath();
           ctx.strokeStyle = borderColor;
           ctx.lineWidth = 2;
           ctx.fillStyle = borderColor;
           const step = 20 / iMult;
           const amp = (borderWidth / 2) * iMult;
           
           const drawEdge = (x1, y1, x2, y2, isVert) => {
             ctx.moveTo(x1, y1);
             for (let i = 0; i <= 100; i++) {
               const t = i / 100;
               let x = x1 + (x2 - x1) * t;
               let y = y1 + (y2 - y1) * t;
               let offset = 0;
               if (style === 'zigzag') offset = (i % 10 < 5 ? amp : -amp);
               else if (style === 'wave') offset = Math.sin(t * Math.PI * 10) * amp;
               else if (style === 'scalloped') offset = -Math.abs(Math.sin(t * Math.PI * 10)) * amp * 2;
               else if (style === 'parchment') offset = (Math.random() - 0.5) * amp;
               
               if (isVert) x += offset; else y += offset;
               ctx.lineTo(x, y);
             }
           };
           drawEdge(contentX, contentY, contentX + contentW, contentY, false);
           drawEdge(contentX + contentW, contentY, contentX + contentW, contentY + contentH, true);
           drawEdge(contentX + contentW, contentY + contentH, contentX, contentY + contentH, false);
           drawEdge(contentX, contentY + contentH, contentX, contentY, true);
           ctx.fill();
        } else if (style === 'pixel') {
           ctx.fillStyle = borderColor;
           const pSize = Math.max(borderWidth / 2, 4);
           for(let x = contentX; x < contentX + contentW; x += pSize) {
             ctx.fillRect(x, contentY, pSize, pSize);
             ctx.fillRect(x, contentY + contentH - pSize, pSize, pSize);
           }
           for(let y = contentY; y < contentY + contentH; y += pSize) {
             ctx.fillRect(contentX, y, pSize, pSize);
             ctx.fillRect(contentX + contentW - pSize, y, pSize, pSize);
           }
        } else if (style === 'brutalist') {
           ctx.fillStyle = '#000000';
           ctx.fillRect(contentX + 10, contentY + 10, contentW, contentH);
           ctx.strokeStyle = '#000000';
           ctx.lineWidth = 4;
           ctx.strokeRect(contentX, contentY, contentW, contentH);
           ctx.fillStyle = borderColor;
           ctx.fillRect(contentX, contentY, contentW, contentH);
        } else if (style === 'artdeco') {
           ctx.strokeStyle = borderColor;
           ctx.lineWidth = 2;
           for(let i=0; i<3; i++) {
             ctx.strokeRect(contentX + i*5, contentY + i*5, contentW - i*10, contentH - i*10);
           }
           const s = 40;
           ctx.fillRect(contentX, contentY, s, s); ctx.fillRect(contentX+contentW-s, contentY, s, s);
           ctx.fillRect(contentX, contentY+contentH-s, s, s); ctx.fillRect(contentX+contentW-s, contentY+contentH-s, s, s);
        } else if (style === 'ornate') {
           ctx.fillStyle = borderColor;
           const r = 25 * iMult;
           ctx.beginPath();
           ctx.arc(contentX, contentY, r, 0, Math.PI * 2);
           ctx.arc(contentX + contentW, contentY, r, 0, Math.PI * 2);
           ctx.arc(contentX, contentY + contentH, r, 0, Math.PI * 2);
           ctx.arc(contentX + contentW, contentY + contentH, r, 0, Math.PI * 2);
           ctx.fill();
           ctx.strokeStyle = borderColor; ctx.lineWidth = 4;
           ctx.strokeRect(contentX, contentY, contentW, contentH);
        }
        
        // 3D Inset / Outset
        if (style === 'inset' || style === 'outset') {
           ctx.lineWidth = Math.max(padTop / 2, 2);
           const light = style === 'inset' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)';
           const dark = style === 'inset' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
           const halfW = padTop / 2;
           ctx.strokeStyle = light;
           ctx.beginPath(); ctx.moveTo(contentX, contentY + contentH); ctx.lineTo(contentX, contentY); ctx.lineTo(contentX + contentW, contentY); ctx.stroke();
           ctx.strokeStyle = dark;
           ctx.beginPath(); ctx.moveTo(contentX + contentW, contentY); ctx.lineTo(contentX + contentW, contentY + contentH); ctx.lineTo(contentX, contentY + contentH); ctx.stroke();
        }
        ctx.restore();

        // Clip Inner Image Area
        ctx.save();
        ctx.beginPath();
        if (radius > 0 && !['filmstrip', 'polaroid', 'zigzag', 'wave', 'scalloped', 'parchment'].includes(style)) {
           ctx.roundRect(imgX, imgY, img.width, img.height, radius);
        } else {
           ctx.rect(imgX, imgY, img.width, img.height);
        }
        ctx.clip();
        ctx.drawImage(img, imgX, imgY);
        
        // Effects (CRT, Glass, Vintage)
        if (style === 'crt') {
           ctx.fillStyle = 'rgba(18, 16, 16, 0.1)';
           ctx.fillRect(imgX, imgY, img.width, img.height);
           ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
           ctx.lineWidth = 1;
           for(let y = imgY; y < imgY + img.height; y += 4) {
             ctx.beginPath(); ctx.moveTo(imgX, y); ctx.lineTo(imgX + img.width, y); ctx.stroke();
           }
        } else if (style === 'glass') {
           ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
           ctx.fillRect(imgX, imgY, img.width, img.height);
           // Simulation of blur is hard here without secondary canvas, 
           // but we can do a highlight
           const grad = ctx.createLinearGradient(imgX, imgY, imgX + img.width, imgY + img.height);
           grad.addColorStop(0, 'rgba(255,255,255,0.3)');
           grad.addColorStop(0.5, 'rgba(255,255,255,0)');
           grad.addColorStop(1, 'rgba(255,255,255,0.2)');
           ctx.fillStyle = grad;
           ctx.fillRect(imgX, imgY, img.width, img.height);
        } else if (style === 'vintage') {
           const grad = ctx.createRadialGradient(imgX + img.width/2, imgY + img.height/2, Math.min(img.width, img.height)*0.3, imgX + img.width/2, imgY + img.height/2, Math.min(img.width, img.height));
           grad.addColorStop(0, 'rgba(0,0,0,0)');
           grad.addColorStop(1, `rgba(0,0,0,${Math.min(0.9, 0.6 * iMult)})`);
           ctx.fillStyle = grad;
           ctx.fillRect(imgX, imgY, img.width, img.height);
        }
        
        ctx.restore();
        
        canvas.toBlob((blob) => resolve(blob), file.type, 0.95);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};
