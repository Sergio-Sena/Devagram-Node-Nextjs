import type { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import { loginResposta } from '../../types/LoginResposta';
import md5 from 'md5';
import { UsuarioModel } from '@/models/UsuarioModel';
import jwt from 'jsonwebtoken';

const endPointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<respostaPadraoMsg | loginResposta>
) => {

    const { MINHA_CHAVE_JWT } = process.env;
    if (!MINHA_CHAVE_JWT) {
        res.status(500).json({ erro: 'ENV jwt nao informada' });
    }
    if (req.method === "POST") {
        const { login, senha } = req.body;

        const usuariosEncontrados = await UsuarioModel.find({ email: login, senha: md5(senha) });
        if (usuariosEncontrados && usuariosEncontrados.length > 0) {
            const usuarioEncontrado = usuariosEncontrados[0];

            const token = jwt.sign({ id: usuarioEncontrado.id }, MINHA_CHAVE_JWT as string);
            return res.status(200).json({
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                token
            });
        }

        return res.status(400).json({ erro: 'Usuario ou senha Invalidos' });
    }
    return res.status(405).json({ erro: 'Metodo invalido' });
}
export default conectarMongoDB(endPointLogin);