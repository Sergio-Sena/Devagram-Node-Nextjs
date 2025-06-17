# Devagram API

API para o projeto Devagram, uma rede social inspirada no Instagram.

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   DB_CONEXAO_STRING=mongodb+srv://usuario:senha@cluster.mongodb.net/devagram
   JWT_SECRET=sua_chave_secreta
   CORS_ORIGIN=http://localhost:3001
   ```

3. Inicie o servidor:
   ```
   npm run dev
   ```

## Scripts Úteis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento
- `npm run build`: Compila o projeto
- `npm run start`: Inicia o servidor em modo de produção
- `npm run limpar-db`: Limpa o banco de dados e cria 3 usuários de teste
- `npm run corrigir-contadores`: Corrige os contadores de seguidores, seguindo e publicações
- `npm run verificar`: Verifica o estado atual do sistema

## Usuários de Teste

| Nome  | Email               | Senha |
|-------|---------------------|-------|
| user1 | user1@devagram.com  | 2700  |
| user2 | user2@devagram.com  | 2700  |
| user3 | user3@devagram.com  | 2700  |

## Endpoints

### Autenticação
- `POST /api/login`: Autentica um usuário
- `POST /api/cadastro`: Cadastra um novo usuário

### Usuários
- `GET /api/usuario`: Obtém informações do usuário logado
- `PUT /api/usuario`: Atualiza informações do usuário logado
- `GET /api/pesquisa?filtro=termo`: Pesquisa usuários por nome ou email
- `GET /api/pesquisa?id=userId`: Obtém informações de um usuário específico

### Seguidores
- `PUT /api/seguir?id=userId`: Segue ou deixa de seguir um usuário
- `GET /api/seguidor?id=userId`: Verifica se o usuário logado segue um usuário específico

### Feed
- `GET /api/feed`: Obtém o feed do usuário logado
- `GET /api/feed?id=userId`: Obtém as publicações de um usuário específico

### Publicações
- `POST /api/publicacao`: Cria uma nova publicação
- `PUT /api/like?id=postId`: Curte ou descurte uma publicação
- `PUT /api/comentario?id=postId`: Adiciona um comentário a uma publicação

## Solução de Problemas

Se encontrar problemas com os contadores de seguidores, seguindo ou publicações, execute:
```
npm run corrigir-contadores
```

Para limpar o banco de dados e criar novos usuários de teste:
```
npm run limpar-db
```

Para verificar o estado atual do sistema:
```
npm run verificar
```