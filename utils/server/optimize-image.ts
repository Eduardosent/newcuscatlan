import sharp from "sharp";

export async function optimizeImage(buffer: Buffer, contentType: string): Promise<Buffer> {
  const image = sharp(buffer);

  if (contentType.includes("jpeg") || contentType.includes("jpg")) {
    return await image
      .rotate()
      .jpeg({ quality: 75, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
  }

  if (contentType.includes("png")) {
    return await image
      .rotate()
      .png({ palette: true, compressionLevel: 9 })
      .toBuffer();
  }

  if (contentType.includes("webp")) {
    return await image
      .rotate()
      .webp({ quality: 75, effort: 6 })
      .toBuffer();
  }

  // Si es un formato que no manejamos (o un video), devolvemos el original
  return buffer;
}