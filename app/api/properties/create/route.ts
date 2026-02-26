import { NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { supabaseServer } from "@/config/supabase-server"; 
import { getAuthContext, optimizeImage } from "@/utils/server";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const { user, status: authStatus, error: authError } = await getAuthContext(req);
  if (!user) return NextResponse.json({ error: authError }, { status: authStatus });

  try {
    const formData = await req.formData();
    
    // Extracción de campos
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const size = Number(formData.get("size"));
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    const category_id = Number(formData.get("category_id"));
    const development_level_id = Number(formData.get("development_level_id"));
    const country_id = Number(formData.get("country_id"));
    const country_state_id = Number(formData.get("country_state_id"));

    const files = formData.getAll("images") as File[];

    const mediaUrls: string[] = [];

    // Bucle secuencial para no reventar la RAM de la función
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Se usa Buffer sin el genérico <ArrayBuffer> para evitar el error de SharedArrayBuffer
      let currentBuffer: Buffer = Buffer.from(await file.arrayBuffer());
      const contentType = file.type;

      if (contentType.startsWith("image/")) {
        try {
          // La utilidad devuelve el buffer optimizado
          const optimized = await optimizeImage(currentBuffer, contentType);
          currentBuffer = Buffer.from(optimized);
        } catch (optErr) {
          console.error(`Error optimizando imagen ${i}:`, optErr);
          // Si falla, se queda con el original para no interrumpir el flujo
        }
      }

      const fileId = nanoid(12); 
      const ext = file.type.split('/')[1] || 'jpg';
          
      // Ruta plana: properties/nanoid.ext
      const key = `properties/${fileId}.${ext}`;
      
      // Subida a S3/R2
      await s3Client.send(new PutObjectCommand({
        Bucket: 'newcuscatlan',
        Key: key,
        Body: currentBuffer,
        ContentType: contentType,
      }));

      mediaUrls.push(key);
    }

    // Inserción final en Supabase
    const { data, error } = await supabaseServer
      .from("properties")
      .insert({
        user_id: user.id,
        title,
        description,
        price,
        size,
        category_id,
        development_level_id,
        country_id,
        country_state_id,
        phone,
        email: email || null,
        image_urls: mediaUrls
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });

  } catch (err: any) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}