import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next"
import mongoose from "mongoose"

export const dbConect = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        //Verificar se o BD esta conectado, se estiver seguir para end Point
        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }
        //ja que não esta conectado proceder para conexão
        //Obter varial do env 
        const {DB_CONEXAO_STRING}= process.env;
        //se a env estiver vazia aborta e avisa o programador
        if(!DB_CONEXAO_STRING){
            res.status(500).json({error:'Falha ao conectar o banco de Dados, env nao informada '})
        }
        mongoose.connection.on('connected', () => console.log('Banco de dados conectado'))
        mongoose.connection.on('error', error => console.log(`Erro ao concetar DB: ${error}`))
        await mongoose.connect(DB_CONEXAO_STRING);
        // agora segue para o end point pois esta conectado
        return handler(req,res);
    };