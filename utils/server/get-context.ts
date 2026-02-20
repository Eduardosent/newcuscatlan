import { supabaseServer } from '@/config/supabase-server';
import { Keypair } from '@solana/web3.js';
import { User } from '@supabase/supabase-js';

// --- Tipos ---
interface AuthContext {
  user: User | null;
  error: string | null;
  status: number;
}

interface WalletContext extends AuthContext {
  userKeypair: Keypair | null;
  preBalance: number | null;
}

// 1. SOLO AUTH (Para propuestas, perfil, etc.)
export async function getAuthContext(req: Request): Promise<AuthContext> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return { user: null, error: 'Unauthorized', status: 401 };

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

    if (authError || !user) return { user: null, error: 'Invalid session', status: 401 };

    console.log("hola")
    return { user, error: null, status: 200 };
  } catch (e: any) {
    return { user: null, error: e.message || 'Internal Server Error', status: 500 };
  }
}