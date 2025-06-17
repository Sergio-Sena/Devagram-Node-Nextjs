import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { respostaPadraoMsg } from '../types/respostaPadraoMsg';

export function corsMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
    // Configurar cabeçalhos CORS
    const origin = process.env.CORS_ORIGIN || 'http://localhost:3001';
    
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Responder imediatamente para requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Passar para o próximo handler
    return handler(req, res);
  };
}