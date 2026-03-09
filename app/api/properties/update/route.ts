import { NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/config";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { supabaseServer } from "@/config/supabase-server"; 
import { getAuthContext, optimizeImage } from "@/utils/server";
import { nanoid } from "nanoid";

export async function PATCH(req: NextRequest) {
  const { user, status: authStatus, error: authError } = await getAuthContext(req);
  if (!user) return NextResponse.json({ error: authError }, { status: authStatus });

  try {
    const formData = await req.formData();
    const propertyId = formData.get("id") as string;

    if (!propertyId) return NextResponse.json({ error: "ID de propiedad requerido" }, { status: 400 });

    // 1. Obtener estado actual
    const { data: currentProperty, error: fetchError } = await supabaseServer
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (fetchError || !currentProperty) throw new Error("Propiedad no encontrada");

    // 2. Preparar campos dinámicos
    const updateData: any = {};
    // AGREGAMOS 'location' a la lista de campos permitidos
    const fields = [
      "title", "description", "price", "size", "phone", "email", 
      "category_id", "development_level_id", "country_id", "country_state_id",
      "location" // <--- CAMPO CLAVE
    ];
    
    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        // Los campos con '_id', 'price' o 'size' son números. 'location' es String (WKT).
        const isNumeric = field.includes('_id') || field === 'price' || field === 'size';
        updateData[field] = isNumeric ? Number(value) : value;
      }
    });

    // 3. GESTIÓN DE IMÁGENES (Se mantiene igual, manejando File vs String)
    const imagesInput = formData.getAll("images");
    const oldUrls = currentProperty.image_urls as string[];
    const newMediaUrls: string[] = [];

    for (const item of imagesInput) {
      if (typeof item === "string") {
        newMediaUrls.push(item);
      } else if (item instanceof File) {
        const file = item;
        let currentBuffer = Buffer.from(await file.arrayBuffer());
        const contentType = file.type;

        if (contentType.startsWith("image/")) {
          try {
            const optimized = await optimizeImage(currentBuffer, contentType);
            currentBuffer = Buffer.from(optimized);
          } catch (e) { console.error("Error optimizando", e); }
        }

        const fileId = nanoid(12);
        const ext = contentType.split('/')[1] || 'jpg';
        const key = `properties/${fileId}.${ext}`;

        await s3Client.send(new PutObjectCommand({
          Bucket: 'newcuscatlan',
          Key: key,
          Body: currentBuffer,
          ContentType: contentType,
        }));

        newMediaUrls.push(key);
      }
    }

    // 4. LIMPIEZA DE S3 (Borrar imágenes descartadas)
    const imagesToDelete = oldUrls.filter(url => !newMediaUrls.includes(url));
    for (const urlToDelete of imagesToDelete) {
      try {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: 'newcuscatlan',
          Key: urlToDelete,
        }));
      } catch (delErr) {
        console.error("Error borrando de S3:", urlToDelete, delErr);
      }
    }

    // 5. Actualizar registro
    updateData.image_urls = newMediaUrls;

    const { data, error: updateError } = await supabaseServer
      .from("properties")
      .update(updateData)
      .eq("id", propertyId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, data });

  } catch (err: any) {
    console.error("Update Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}