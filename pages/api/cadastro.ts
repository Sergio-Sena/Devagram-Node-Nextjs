import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadrãoMsg } from '../../types/respostaPadraoMsg';
import type { CadastroRequisicao } from '../../types/CadastroRequisicao';
import { UsuarioModel } from '../../models/UsuarioModel'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import md5 from 'md5';

const endpointCadastro =
    async (req: NextApiRequest, res: NextApiResponse<respostaPadrãoMsg>) => {

        if (req.method === 'POST') {
            const usuario = req.body as CadastroRequisicao;

            if (!usuario.nome || usuario.nome.length < 2) {
                return res.status(400).json({ erro: 'Nome invalido' });
            }
            if (!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('@')
                || !usuario.email.includes('.'))
                return res.status(400).json({ erro: 'Email invalido' });
            if (!usuario.senha || usuario.senha.length < 4) {
                return res.status(400).json({ erro: 'Senha invalida' });
            }

            //validar se ja existe usuario com o mesmo email
            const usuariosComOMesmoEmail = await UsuarioModel.find({ email: usuario.email });
            if (usuariosComOMesmoEmail && usuariosComOMesmoEmail.length > 0) {
                return res.status(400).json({ erro: 'Essa email ja esta vinculado a uma conta!' });
            }

            //Salvar no banco de dados
            const usuarioASerSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha),
            }
            await UsuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({ msg: 'Usuario cadastrado com sucesso!' })
        };

        return res.status(405).json({ erro: 'Metodo invalido' });
    };
export default conectarMongoDB(endpointCadastro);