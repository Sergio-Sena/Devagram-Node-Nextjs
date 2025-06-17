const fs = require('fs');
const path = require('path');

function limparConfiguracoes() {
  console.log('Limpando arquivos de configuração e testes...');
  
  // Lista de diretórios a serem verificados e limpos
  const diretoriosParaLimpar = [
    path.join(__dirname, '..', 'tests'),
    path.join(__dirname, '..', 'tmp')
  ];
  
  // Lista de arquivos específicos para limpar
  const arquivosParaLimpar = [
    path.join(__dirname, '..', 'jest.config.js'),
    path.join(__dirname, '..', '.env.test'),
    path.join(__dirname, '..', '.env.local'),
    path.join(__dirname, '..', '.env.development'),
    path.join(__dirname, '..', 'cypress.json')
  ];
  
  // Limpar diretórios
  diretoriosParaLimpar.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`Limpando diretório: ${dir}`);
      try {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`Diretório removido: ${dir}`);
      } catch (err) {
        console.error(`Erro ao remover diretório ${dir}:`, err);
      }
    } else {
      console.log(`Diretório não encontrado: ${dir}`);
    }
  });
  
  // Limpar arquivos específicos
  arquivosParaLimpar.forEach(arquivo => {
    if (fs.existsSync(arquivo)) {
      console.log(`Removendo arquivo: ${arquivo}`);
      try {
        fs.unlinkSync(arquivo);
        console.log(`Arquivo removido: ${arquivo}`);
      } catch (err) {
        console.error(`Erro ao remover arquivo ${arquivo}:`, err);
      }
    } else {
      console.log(`Arquivo não encontrado: ${arquivo}`);
    }
  });
  
  console.log('Limpeza de arquivos de configuração e testes concluída!');
}

limparConfiguracoes();