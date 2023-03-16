import type {NextApiRequest, NextApiResponse} from 'next';

export default (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body
        if(login === 'admin@admin' &&
        senha === 'Admin@123'){
            res.status(200).json({msg:'Usuario autenticado'})
        } 
        return res.status(400).json({erro:'Usuario e senha invalidos'});
    }
    return res.status(405).json({error: 'Metodo informado invalido'});
};