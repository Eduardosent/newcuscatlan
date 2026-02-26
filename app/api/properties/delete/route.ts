import { NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/config";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { supabaseServer } from "@/config/supabase-server"; 
import { getAuthContext } from "@/utils/server";

export async function DELETE(req: NextRequest) {
  const { user, status: authStatus, error: authError } = await getAuthContext(req);
  if (!user) return NextResponse.json({ error: authError }, { status: authStatus });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    // 1. Obtener la lista de keys de la BD
    const { data: property, error: fetchError } = await supabaseServer
      .from("properties")
      .select("image_urls, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !property) return NextResponse.json({ error: "No existe" }, { status: 404 });
    if (property.user_id !== user.id) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    // 2. Borrado físico en R2 usando la Key directa
    const keys = property.image_urls as string[] || [];
    
    for (const key of keys) {
      try {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: 'newcuscatlan',
          Key: key, // Mandamos la key tal cual viene de la base de datos
        }));
      } catch (err) {
        console.error(`Error borrando ${key}:`, err);
      }
    }

    // 3. Borrar el registro de la BD
    const { error: deleteError } = await supabaseServer
      .from("properties")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}