# Migração de Banco de Dados

Este script migra os dados do banco de dados "test" para o banco de dados "devagram" no MongoDB.

## Instruções

1. Certifique-se de que o arquivo `.env` na raiz do projeto contém a string de conexão correta:
   ```
   DB_CONEXAO_STRING=mongodb+srv://usuario:senha@cluster.mongodb.net/devagram
   ```

2. Execute o script de migração:
   ```
   npm run migrate-db
   ```

3. Verifique os logs para confirmar que a migração foi concluída com sucesso.

## O que o script faz

1. Conecta-se ao MongoDB usando a string de conexão do arquivo `.env`
2. Lista todas as coleções no banco de dados "test"
3. Para cada coleção:
   - Verifica se a coleção já existe no banco "devagram"
   - Se não existir, copia todos os documentos da coleção "test" para a coleção "devagram"
4. Fecha a conexão com o MongoDB

## Observações

- O script não exclui os dados do banco "test"
- Se uma coleção já existir no banco "devagram", ela será ignorada para evitar duplicação de dados
- Após a migração, a aplicação usará automaticamente o banco "devagram" devido à configuração no arquivo `.env`