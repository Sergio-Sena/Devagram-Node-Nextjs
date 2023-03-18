import type { NextApiRequest, NextApiResponse } from 'next';
import {conectarMongoDb} from '../../middlewares/conectarMongoDb';
import type { respostaPadrao } from '../../types/respostaPadrao'

const endpontLogin = (
    req: NextApiRequest,
    res: NextApiResponse<respostaPadrao>
) => {
    if (req.method === 'POST') {
        const { login, senha } = req.body
        if (login === 'admin@admin.com' &&
            senha === 'Admin@123') {
            return res.status(200).json({ msg: 'Usuario autenticado' })
        }
        return res.status(400).json({ erro: 'Usuario e senha invalidos' });
    }
    return res.status(405).json({ erro: 'Metodo informado invalido' });
};
export default conectarMongoDb(endpontLogin)