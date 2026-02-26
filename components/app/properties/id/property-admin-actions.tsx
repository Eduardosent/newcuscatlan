"use client"

import { DeletePropertyModal } from "@/components/ui/modal";
import { useDeleteProperty } from "@/hooks/queries";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function PropertyAdminActions({ id, title }: { id: string; title: string }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate:deleteProperty, isPending } = useDeleteProperty();

  return (
    <>
    <div className="flex">
    <Link 
      href={`/properties/${id}/edit`} 
      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      title="Editar propiedad"
    >
      <Pencil className="w-5 h-5" />
    </Link>

    <button 
      onClick={() => setIsDeleteOpen(true)}
      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
      title="Eliminar propiedad"
      // Aquí podrías agregar el onClick para manejar la lógica de borrado
    >
      <Trash2 className="w-5 h-5" />
    </button>
    </div>
          <DeletePropertyModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteProperty(id)}
        propertyTitle={title}
        isLoading={isPending}
      />
    </>
  );
}