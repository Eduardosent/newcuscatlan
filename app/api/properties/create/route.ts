import { NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { supabaseServer } from "@/config/supabase-server"; 
import { getAuthContext, optimizeImage } from "@/utils/server";

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

    const titlePrefix = title.trim().substring(0, 3).toLowerCase().replace(/[^a-z]/g, 'x');
    const folderPath = `properties/${Date.now()}-${titlePrefix}`;

    const mediaUrls = await Promise.all(
      files.map(async (file, index) => {
        // Se declara con let porque el buffer DEBE ser sobreescrito
let buffer: any = Buffer.from(await file.arrayBuffer());
const contentType = file.type;

if (contentType.startsWith("image/")) {
  // Aquí la utilidad de Sharp ya devuelve un Buffer compatible
  buffer = await optimizeImage(buffer, contentType);
}

        const ext = contentType.split('/')[1] || 'jpg';
        const key = `${folderPath}/${index + 1}.${ext}`;
        
        await s3Client.send(new PutObjectCommand({
          Bucket: 'newcuscatlan',
          Key: key,
          Body: buffer,
          ContentType: contentType,
        }));

        return key; 
      })
    );

    // Inserción en Supabase
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