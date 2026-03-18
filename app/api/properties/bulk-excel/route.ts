import { NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { supabaseServer } from "@/config/supabase-server"; 
import { getAuthContext, optimizeImage } from "@/utils/server";
import { nanoid } from "nanoid";
import { google } from "googleapis";

// Configuración de Google Drive con tu Service Account
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/"/g, '').replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

export async function POST(req: NextRequest) {
  const { user, status: authStatus, error: authError } = await getAuthContext(req);
  if (!user) return NextResponse.json({ error: authError }, { status: authStatus });

  try {
    // 1. Recibimos JSON del Excel, no FormData
    const body = await req.json();
    
    const { 
      title, description, price, size, pricing_unit, phone, email,
      category_id, development_level_id, country_id, country_state_id,
      location, drive_folder_url 
    } = body;

    // 2. Extraer ID de la carpeta de Drive
    const folderId = drive_folder_url?.split('/folders/')[1]?.split('?')[0];
    if (!folderId) throw new Error("URL de carpeta de Drive no válida");

    // 3. Listar archivos en la carpeta
    const listRes = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name, mimeType)',
    });

    const driveFiles = listRes.data.files || [];
    const mediaUrls: string[] = [];

    // 4. Bucle secuencial para procesar fotos desde Drive
    for (const file of driveFiles) {
      try {
        // Descargar imagen de Drive como Buffer
        const driveRes = await drive.files.get(
          { fileId: file.id!, alt: 'media' },
          { responseType: 'arraybuffer' }
        );

        let currentBuffer = Buffer.from(driveRes.data as ArrayBuffer);
        const contentType = file.mimeType || 'image/jpeg';

        // Optimizar
        try {
          const optimized = await optimizeImage(currentBuffer, contentType);
          currentBuffer = Buffer.from(optimized);
        } catch (optErr) {
          console.error(`Error optimizando ${file.name}:`, optErr);
        }

        // Subir a S3/R2
        const fileId = nanoid(12);
        const ext = contentType.split('/')[1] || 'jpg';
        const key = `properties/${fileId}.${ext}`;

        await s3Client.send(new PutObjectCommand({
          Bucket: 'newcuscatlan',
          Key: key,
          Body: currentBuffer,
          ContentType: contentType,
        }));

        mediaUrls.push(key);
      } catch (fileErr) {
        console.error(`Error procesando archivo ${file.name}:`, fileErr);
        // Continuamos con el siguiente archivo si uno falla
      }
    }

    // 5. Inserción final en Supabase
    const { data, error } = await supabaseServer
      .from("properties")
      .insert({
        user_id: user.id,
        title,
        description,
        price,
        size,
        pricing_unit,
        category_id: Number(category_id),
        development_level_id: Number(development_level_id),
        country_id: Number(country_id),
        country_state_id: Number(country_state_id),
        phone,
        email: email || null,
        image_urls: mediaUrls,
        location: location || null
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });

  } catch (err: any) {
    console.error("Bulk Upload Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}