@echo off
echo Iniciando a aplicação com o banco de dados "devagram"...
echo.

echo 1. Verificando a configuração do banco de dados...
call npm run verify-db

echo.
echo 2. Iniciando a aplicação...
call npm run dev