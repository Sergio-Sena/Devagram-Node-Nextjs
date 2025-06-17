# Migração do Banco de Dados para "devagram"

Este documento descreve o processo de migração do banco de dados "test" para o banco de dados "devagram" no MongoDB.

## Por que migrar?

A aplicação estava usando o banco de dados padrão "test" do MongoDB, mas para melhor organização e clareza, decidimos migrar para um banco de dados dedicado chamado "devagram".

## Alterações realizadas

1. **Modificação da string de conexão**:
   - Alteramos a string de conexão no arquivo `.env` para especificar explicitamente o banco de dados "devagram":
   ```
   DB_CONEXAO_STRING=mongodb+srv://usuario:senha@cluster.mongodb.net/devagram
   ```

2. **Script de migração**:
   - Criamos um script para migrar todos os dados do banco "test" para o banco "devagram"
   - O script copia todas as coleções e documentos, mantendo a estrutura original

## Como executar a migração

1. **Preparação**:
   - Certifique-se de que o MongoDB está acessível
   - Verifique se o arquivo `.env` contém a string de conexão correta

2. **Migração**:
   - Execute o comando:
   ```
   npm run migrate-db
   ```
   - Aguarde a conclusão do processo
   - Verifique os logs para confirmar o sucesso da migração

3. **Verificação**:
   - Execute o comando:
   ```
   npm run verify-db
   ```
   - Confirme que todas as coleções e documentos foram migrados corretamente

4. **Iniciar a aplicação**:
   - Execute o script:
   ```
   scripts\iniciarComDevagram.bat
   ```
   - Ou inicie normalmente com:
   ```
   npm run dev
   ```

## Resolução de problemas

Se encontrar algum problema durante a migração:

1. Verifique se a string de conexão no arquivo `.env` está correta
2. Confirme que você tem permissões para criar um novo banco de dados
3. Verifique os logs de erro para identificar problemas específicos

## Observações

- Os dados no banco "test" não são excluídos durante a migração
- Após a migração bem-sucedida, a aplicação usará automaticamente o banco "devagram"
- Não é necessário modificar nenhum código da aplicação além da string de conexão