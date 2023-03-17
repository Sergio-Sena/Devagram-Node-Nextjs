import type { NextApiRequest, NextApiResponse } from 'next';
import {BdConect} from '../../middleware/BdConect';
import type {respostapadrao} from '../../types/respostapadrao'

const endpontLogin = (
    req: NextApiRequest,
    res: NextApiResponse<respostapadrao>
) => {
    if (req.method === 'POST') {
        const { login, senha } = req.body
        if (login === 'admin@admin' &&
            senha === 'Admin@123') {
            return res.status(200).json({ msg: 'Usuario autenticado' })
        }
        return res.status(400).json({ erro: 'Usuario e senha invalidos' });
    }
    return res.status(405).json({ erro: 'Metodo informado invalido' });
};
export default BdConect(endpontLogin)