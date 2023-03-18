import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next"
import mongoose from 'mongoose';
import type { respostaPadrao } from '../types/respostaPadrao';

export const conectarMongoDb = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<respostaPadrao>) => {
        //Verificar se o BD esta conectado, se estiver seguir 
        //para end Point ou prox. middler
        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }

        //ja que não esta conectado proceder para conexão
        //Obter variavel do env 
        const { DB_CONEXAO_STRING } = process.env;
        //se a env estiver vazia aborta e avisa o programador
        if (!DB_CONEXAO_STRING) {
            res.status(500).json({ erro: 'Env de configuração do DB nao informada, contate o adm do sistema.' });
        }
        mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
        mongoose.connection.on('error', error => console.log(`Ocorreu erro ao conectar no banco: ${error}`));
        await mongoose.connect('DB_CONEXAO_STRING');
        // agora segue para o end point pois esta conectado
        return handler(req, res);
    }; 