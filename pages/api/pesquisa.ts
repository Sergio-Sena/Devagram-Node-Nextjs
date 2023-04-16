import { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { UsuarioModel } from '@/models/UsuarioModel';


const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any[]>) => {
    try {
        if (req.method === 'GET') {
            const { filtro } = req.query;
            if (!filtro || filtro.length < 2) {
                return res.status(400).json({ erro: 'Favor informar um filtro valido!' })
            }
            const usuarioEncontrados = await UsuarioModel.find({
                $or: [{ nome: { $regex: filtro, $options: 'i' } },
                { email: { $regex: filtro, $options: 'i' } }]
            })
            return res.status(200).json(usuarioEncontrados);

        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({ erro: 'Nao foi possivel encontrar usuarios' })

    }
};

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint))