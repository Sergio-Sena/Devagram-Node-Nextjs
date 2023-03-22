import type { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadrãoMsg } from '../../types/respostaPadraoMsg';

const endPointLogin = (
    req: NextApiRequest,
    res: NextApiResponse<respostaPadrãoMsg>
) => {
    if (req.method === "POST") {
        const { login, senha } = req.body;
        if (login === 'admin@admin.com' &&
            senha === 'Admin@123') {
            res.status(200).json({ msg: 'Usuario autenticado com sucesso' });
        }
        return res.status(400).json({ erro: 'Usuario ou senha Invalidos' });
    }
    return res.status(405).json({ erro: 'Metodo invalido' });
}
export default conectarMongoDB(endPointLogin);