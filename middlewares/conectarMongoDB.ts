import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import mongoose from 'mongoose'
import type { respostaPadraoMsg } from '../types/respostaPadraoMsg';

export const conectarMongoDB = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {

        //verificar se o banco esta conectado. Se estiver seguir para endPoint
        // ou proximo middleware
        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }

        // ja que não está conectado seguir para conexão
        //Obter a variavel preenchida do ENV
        const { DB_CONEXAO_STRING } = process.env
        //Se a env estiver vazia aborta o uso do sistema e informa o Desenvolvedor
        if (!DB_CONEXAO_STRING) {
            return res.status(500).json({ erro: "Erro interno de sistema, informa o DBA" })
        }
        mongoose.connection.on('connected', () => console.log("Banco de dados conectado!"));
        mongoose.connection.on('erro', error => console.log(`Ocorreu erro ao conectar o Banco de dados: ${error}`));
        await mongoose.connect(DB_CONEXAO_STRING);
        //Agora pode seguir para endPoint, pois DB esta conectado 
        return handler(req, res);
    }