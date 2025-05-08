const mecanicaRoute = require('../controllers/mecanica');

module.exports = (app) => {
  app.get('/mecanica/veiculos/placa/:placa', mecanicaRoute.getVeiculoPorPlaca); 
  app.delete('/mecanica/veiculos/deletar/:placa', mecanicaRoute.deletarVeiculo); 
  app.get('/mecanica/veiculos/cliente/documento/:documento', mecanicaRoute.getPorDocumentoCliente);  
  app.post('/mecanica/veiculos/cadastrar', mecanicaRoute.cadastrarVeiculo); 
  app.post('/mecanica/clientes/cadastrar', mecanicaRoute.cadastrarPessoa); 
  app.delete('/mecanica/clientes/deletar/:id', mecanicaRoute.deletarPessoaPorId); 
  app.post('/mecanica/servicos/cadastrar', mecanicaRoute.cadastrarServico); 
  app.patch('/mecanica/servicos/atualizar/:id', mecanicaRoute.atualizarValorServico); 
  app.delete('/mecanica/servicos/deletar/:id', mecanicaRoute.deletarServico); 
  app.post('/mecanica/ordens/cadastrar', mecanicaRoute.cadastrarOrdem); 
  app.patch('/mecanica/ordens/atualizar/:id', mecanicaRoute.atualizarStatusOrdem); 
  app.delete('/mecanica/ordens/deletar/:id', mecanicaRoute.deletarOrdem); 
  app.get('/mecanica/produtos/listar', mecanicaRoute.listarProdutos); 
  app.post('/mecanica/produtos/cadastrar', mecanicaRoute.cadastrarProduto); o
  app.patch('/mecanica/produtos/atualizar/:id', mecanicaRoute.atualizarValorProduto); 
  app.delete('/mecanica/produtos/deletar/:id', mecanicaRoute.deletarProduto); 
  app.post('/mecanica/ordens/servicos/cadastrar', mecanicaRoute.adicionarServicoNaOrdem); 
  app.post('/mecanica/ordens/produtos/cadastrar', mecanicaRoute.adicionarProdutoNaOrdem); 
  app.get('/mecanica/relatorio/financeiro', mecanicaRoute.relatorioFinanceiro); 
  app.delete('/mecanica/ordens/servicos/deletar/:id_servico_veiculo', mecanicaRoute.deletarLigacao); 
}