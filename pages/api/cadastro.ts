import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadrãoMsg } from '../../types/respostaPadraoMsg';
import type { cadastroRequisicao } from '../../types/cadastroRequisicao';
import { UsuarioModels } from '../../models/UsuarioModels'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';

const endpointCadastro =
    async (req: NextApiRequest, res: NextApiResponse<respostaPadrãoMsg>) => {

        if (req.method === 'POST') {
            const usuario = req.body as cadastroRequisicao;
            if (!usuario.nome || usuario.nome.length < 2) {
                return res.status(400).json({ erro: 'Nome invalido' });
            }
            if (!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('@')
                || !usuario.email.includes('.'))
                return res.status(400).json({ erro: 'E-mail invalido' });
            if (!usuario.senha || usuario.senha.length < 4) {
                return res.status(400).json({ erro: 'Senha invalida' });
            }

            //Salvar no banco de dados
            await UsuarioModels.create(usuario);
            return res.status(200).json({ msg: 'Usuario cadastrado com sucesso!' })
        };

        return res.status(405).json({ erro: 'Metodo invalido' });
    };
export default conectarMongoDB(endpointCadastro);