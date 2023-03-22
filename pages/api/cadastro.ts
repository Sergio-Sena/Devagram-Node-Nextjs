import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadrãoMsg } from '../../types/respostaPadraoMsg';
import type { cadastroRequisicao } from '../../types/cadastroRequisicao';

const endpointCadastro =
    (req: NextApiRequest, res: NextApiResponse<respostaPadrãoMsg>) => {
        if (req.method === 'POST') {

        }
        return res.status(405).json({ erro: "Metodo informado inválido" })
    }


