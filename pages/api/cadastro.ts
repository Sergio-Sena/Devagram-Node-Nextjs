import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadrao } from '../../types/respostaPadrao';
import type { CadastroUsuario } from '../../types/CadastroUsuario';
import { UsuarioModel } from '../../models/UsuarioModel';

const endpointCadastro = (
    async (req: NextApiRequest, res: NextApiResponse<respostaPadrao>) => {
    if (req.method === 'POST') {
        const Usuario = req.body as CadastroUsuario;
        if (!Usuario.nome || Usuario.nome.length < 2) {
            return res.status(400).json({ erro: "Informe um nome valido" });
        }
        if (!Usuario.email || Usuario.email.length < 5 ||
            !Usuario.email.includes('@') ||
            !Usuario.email.includes('.')) {
            return res.status(400).json({ erro: "Informe um e-mail valido" });
        }
        if (!Usuario.senha || Usuario.senha.length < 4) {
            return res.status(400).json({ erro: "Senha invalida" });
        }
        //Salvar no banco de dados
        await UsuarioModel.create(Usuario)
        return res.status(200).json({ msg: "Usuario criado com sucesso" });

    }
    return res.status(405).json({ erro: 'Metodo informado invalido' });
}
export default endpointCadastro(UsuarioModel);

