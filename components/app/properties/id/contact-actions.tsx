'use client';

import { useState } from 'react';
import { MessageCircle, Copy, Mail, Check } from 'lucide-react';

interface Props {
  phone?: string;
  email?: string;
  whatsappUrl: string;
}

export function ContactActions({ phone, email, whatsappUrl }: Props) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* WhatsApp */}
      {phone ? (
        <div className="space-y-2">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold hover:bg-[#20ba5a] transition-all shadow-lg shadow-green-100"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
          <button 
            onClick={() => handleCopy(phone, 'phone')}
            className="w-full text-[10px] text-gray-400 font-bold uppercase hover:text-blue-600 transition-colors flex items-center justify-center gap-1"
          >
            {copiedLabel === 'phone' ? (
              <span className="text-green-600 flex items-center gap-1 normal-case"><Check className="w-3 h-3" /> ¡Copiado!</span>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copiar número: {phone}
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-2xl text-center text-sm text-gray-400 italic">No hay teléfono</div>
      )}

      {/* Email */}
      {email ? (
        <div className="space-y-2">
          <a 
            href={`mailto:${email}`}
            className="flex items-center justify-center gap-3 w-full border-2 border-blue-600 text-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all"
          >
            <Mail className="w-5 h-5" />
            Enviar correo
          </a>
          <button 
            onClick={() => handleCopy(email, 'email')}
            className="w-full text-[10px] text-gray-400 font-bold uppercase hover:text-blue-600 transition-colors flex items-center justify-center gap-1"
          >
            {copiedLabel === 'email' ? (
              <span className="text-green-600 flex items-center gap-1 normal-case"><Check className="w-3 h-3" /> ¡Copiado!</span>
            ) : (
              <>
                <Copy className="w-3 h-3" /> <span className="normal-case text-[11px]">Copiar correo: {email}</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-2xl text-center text-sm text-gray-400 italic">No hay email</div>
      )}
    </div>
  );
}