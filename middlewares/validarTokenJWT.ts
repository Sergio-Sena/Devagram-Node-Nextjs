import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { respostaPadraoMsg } from '../types/respostaPadraoMsg'
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validarTokenJWT = (handler: NextApiHandler) =>
    (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            const { JWT_SECRET } = process.env;

            if (!JWT_SECRET) {
                return res.status(500).json({ erro: 'Chave JWT não configurada no servidor' });
            }

            // Permitir requisições OPTIONS para CORS
            if (req.method === 'OPTIONS') {
                return handler(req, res);
            }

            if (!req || !req.headers) {
                return res.status(401).json({ erro: 'Não foi possível validar o token de acesso' });
            }

            const authorization = req.headers['authorization'];
            if (!authorization) {
                return res.status(401).json({ erro: 'Token de autorização não fornecido' });
            }

            const token = authorization.substring(7); // Remove 'Bearer ' do início
            if (!token) {
                return res.status(401).json({ erro: 'Token de autorização inválido' });
            }
            
            try {
                // Verifica o token com a chave JWT
                const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
                
                if (!req.query) {
                    req.query = {};
                }
                
                // Extrai o ID do usuário do token e adiciona ao objeto de consulta
                if (decoded && typeof decoded === 'object') {
                    if (decoded._id) {
                        req.query.userId = decoded._id;
                    } else if (decoded.usuario_id) {
                        req.query.userId = decoded.usuario_id;
                    }
                }

                // Log para debug
                console.log('Token validado com sucesso. ID do usuário:', req.query.userId);
                
                return handler(req, res);
            } catch (err) {
                console.log('Erro ao verificar token JWT:', err);
                return res.status(401).json({ erro: 'Token inválido ou expirado' });
            }
        } catch (e) {
            console.log('Erro ao validar token JWT:', e);
            return res.status(500).json({ erro: 'Ocorreu erro ao validar o token de acesso' });
        }
    }
