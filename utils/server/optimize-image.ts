import sharp from "sharp";

export async function optimizeImage(buffer: Buffer, contentType: string): Promise<Buffer> {
  const image = sharp(buffer);
  
  // Obtenemos metadatos para decidir la agresividad de la compresión
  const metadata = await image.metadata();
  const isLarge = (metadata.width || 0) > 2000 || (metadata.height || 0) > 2000;
  
  // Si es grande, bajamos a 60. Si no, mantenemos tu 75.
  const targetQuality = isLarge ? 60 : 75;

  // Corregimos orientación
  image.rotate();

  // Límite de seguridad: Solo actúa si sobrepasa los 2500px
  image.resize({
    width: 2000,
    height: 2000,
    fit: 'inside',
    withoutEnlargement: true 
  });

  if (contentType.includes("jpeg") || contentType.includes("jpg")) {
    return await image
      .jpeg({ 
        quality: targetQuality, // Dinámico: 60 o 75
        mozjpeg: true,
        chromaSubsampling: '4:2:0',
        trellisQuantisation: true,
        overshootDeringing: true
      })
      .toBuffer();
  }

  if (contentType.includes("png")) {
    return await image
      .png({ 
        palette: true,
        compressionLevel: 9,
        quality: targetQuality, // Dinámico: 60 o 75
        dither: 1.0
      })
      .toBuffer();
  }

  if (contentType.includes("webp")) {
    return await image
      .webp({ 
        quality: targetQuality, // Dinámico: 60 o 75
        effort: 6, 
        lossless: false
      })
      .toBuffer();
  }

  return buffer;
}