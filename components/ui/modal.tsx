import { AlertTriangle, X } from "lucide-react";

// MODAL REUTILIZABLE BASE
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// MODAL ESPECÍFICO DE ELIMINACIÓN
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  propertyTitle: string;
}

export function DeletePropertyModal({ isOpen, onClose, onConfirm, propertyTitle, isLoading }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; propertyTitle: string; isLoading: boolean }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar propiedad">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        <p className="text-gray-600 text-lg mb-8">
          ¿Estás seguro de eliminar <span className="font-bold text-gray-900">"{propertyTitle}"</span>? 
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-4 w-full">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 disabled:opacity-50 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 disabled:opacity-50 transition-all"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}