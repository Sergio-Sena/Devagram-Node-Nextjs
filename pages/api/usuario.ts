import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel';
import nc from 'next-connect'
import { upload } from '../../services/uploadImagensCosmic'
import { uploadImagemS3 } from '../../services/uploadImagensS3'
import { politicaCORS } from '@/middlewares/politicaCORS';


const handler = nc()
    .use(upload.single('file'))
    .put(async (req: any, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            // Para alterar usuario primeiro preciso pegar ususario
            const { userId } = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            console.log('usuario', usuario);
            // Se nao retronou nada, nao existe
            if (!usuario) {
                return res.status(400).json({ erro: 'Usuario nao encontrado' })
            }

            // Criar um objeto com apenas os campos que serão atualizados
            const dadosParaAtualizar: any = {};

            // Recuperando nome a ser alterado
            const { nome } = req?.body;
            if (nome && nome.length > 2) {
                dadosParaAtualizar.nome = nome;
            }

            // Recuperando file a ser alterado
            const { file } = req;
            console.log(file)
            if (file && file.originalname) {
                const image = await uploadImagemS3(req)
                console.log(image)
                if (image && image.media && image.media.url) {
                    dadosParaAtualizar.avatar = image.media.url;
                    console.log(dadosParaAtualizar.avatar)
                }
            }

            // Alterar dados no DB usando $set para atualizar apenas os campos fornecidos
            await UsuarioModel.findByIdAndUpdate(
                { _id: userId }, 
                { $set: dadosParaAtualizar },
                { new: true } // Retorna o documento atualizado
            );
            
            return res.status(200).json({ msg: 'Atualização feita com sucesso.' });

        } catch (e) {
            console.log(e)
            return res.status(400).json({ erro: 'Não foi possível atualizar usuário: ' + e });
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg> | any) => {
        // Pegar os dados de usuario logado
        try {
            const { userId } = req?.query
            const usuario = await UsuarioModel.findById(userId);
            
            if (!usuario) {
                return res.status(400).json({ erro: 'Usuário não encontrado' });
            }
            
            // Não retornar a senha
            const usuarioResponse = {
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                avatar: usuario.avatar,
                seguidores: usuario.seguidores,
                seguindo: usuario.seguindo,
                publicacoes: usuario.publicacoes
            };
            
            return res.status(200).json(usuarioResponse);
        } catch (e) {
            console.log(e)
            return res.status(400).json({ erro: 'Não foi possível obter dados do usuário.' });
        }
    });


// Define as configurações da API
export const config = {
    api: {
        bodyParser: false
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(handler)));