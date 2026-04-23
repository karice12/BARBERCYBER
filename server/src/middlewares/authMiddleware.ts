import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Formato do payload JWT gerado pelo Supabase Auth.
 * O campo "sub" contém o UUID do usuário (auth.users.id).
 */
interface SupabaseJwtPayload {
  sub: string;        // UUID do usuário no Supabase (auth.users.id)
  email?: string;
  role?: string;
  aud?: string;
  exp?: number;
  iat?: number;
}

export interface AuthenticatedRequest extends Request {
  userId?: string;   // auth.users.id do Supabase
  userEmail?: string;
}

/**
 * Middleware que valida o JWT emitido pelo Supabase Auth.
 *
 * Como usar no frontend:
 *   Authorization: Bearer <token_do_supabase_auth>
 *
 * Onde encontrar o SUPABASE_JWT_SECRET:
 *   Supabase Dashboard → Settings (engrenagem) → API → "JWT Settings" → clique em "Reveal"
 */
export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.SUPABASE_JWT_SECRET;

  if (!secret) {
    console.error('[authMiddleware] SUPABASE_JWT_SECRET não configurado.');
    res.status(500).json({ error: 'Configuração interna inválida.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as SupabaseJwtPayload;

    if (!decoded.sub) {
      res.status(401).json({ error: 'Token inválido: campo "sub" ausente.' });
      return;
    }

    req.userId    = decoded.sub;
    req.userEmail = decoded.email;

    next();
  } catch (err) {
    const isExpired = err instanceof jwt.TokenExpiredError;
    res
      .status(401)
      .json({ error: isExpired ? 'Token expirado.' : 'Token inválido.' });
  }
}
