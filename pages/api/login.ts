import type { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadrãoMsg } from '../../types/respostaPadraoMsg';
import md5 from 'md5';
import { UsuarioModel } from '@/models/UsuarioModel';

const endPointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<respostaPadrãoMsg>
) => {
    if (req.method === "POST") {
        const { login, senha } = req.body;

        const usuariosEncontrados = await UsuarioModel.find({ email: login, senha: md5(senha) });
        if (usuariosEncontrados && usuariosEncontrados.length > 0) {
            const usuarioEncontrado = usuariosEncontrados[0];
            return res.status(200).json({ msg: `Usuario ${usuarioEncontrado.nome} autenticado com sucesso` });
        }

        return res.status(400).json({ erro: 'Usuario ou senha Invalidos' });
    }
    return res.status(405).json({ erro: 'Metodo invalido' });
}
export default conectarMongoDB(endPointLogin);