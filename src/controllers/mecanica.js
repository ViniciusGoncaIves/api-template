const service = require("../services/mecanica");
const db = require("../configs/index");

async function getVeiculoPorPlaca(req, res) {
    try {
        const placa = req.params;
        const sql = service.getPorPlaca(placa);
        const result = await db.query(sql.text, sql.values).then(response => response.rows);

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Nenhum registro encontrado'
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Consulta realizada com sucesso',
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao realizar consulta',
            error: error.message
        });
    }
}

async function deletarVeiculo(req, res) {
    try {
        const { placa } = req.params;
        const sql = service.deletarVeiculoPorPlaca(placa);
        const result = await db.query(sql.text, sql.values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Veículo não encontrado'
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Veículo deletado com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao deletar veículo',
            error: error.message
        });
    }
}


async function getPorDocumentoCliente(req, res) {
    try {
        const documento = req.params;
        const sql = service.getPorDocumentoCliente(documento);
        const result = await db.query(sql.text, sql.values).then(response => response.rows);

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Nenhum registro encontrado'
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Consulta realizada com sucesso',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao realizar consulta',
            error: error.message
        });
    }
}

async function cadastrarVeiculo(req, res) {
    try {
        const { placa, modelo, marca, ano, cor, id_pessoa } = req.body;
        const sql = service.cadastrarVeiculo({ placa, modelo, marca, ano, cor, id_pessoa });
        const result = await db.query(sql.text, sql.values).then(response => response.rows[0]);

        if (!result) {
            return res.status(400).json({
                status: 'error',
                message: 'Erro ao cadastrar veículo'
            });
        }

        return res.status(201).json({
            status: 'ok',
            message: 'Veículo cadastrado com sucesso',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao cadastrar veículo',
            error: error.message
        });
    }
}

async function cadastrarPessoa(req, res) {
    try {
        const {
            tipo_pessoa,
            nome,
            documento,
            data_nascimento,
            telefone,
            email,
            endereco,
            cep
        } = req.body;

        const sql = service.cadastrarPessoa({
            tipo_pessoa,
            nome,
            documento,
            data_nascimento,
            telefone,
            email,
            endereco,
            cep
        });

        const result = await db.query(sql.text, sql.values).then(response => response.rows[0]);

        return res.status(201).json({
            status: 'ok',
            message: 'Cliente cadastrado(a) com sucesso',
            data: {
                nome: result.nome,
                telefone: result.telefone,
                endereco: result.endereco
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao cadastrar pessoa',
            error: error.message
        });
    }
}


async function deletarPessoaPorId(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID inválido'
            });
        }

        const sql = service.deletarPessoaPorId(id);
        const result = await db.query(sql.text, sql.values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Pessoa não encontrada'
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Pessoa deletada com sucesso',
            data: result.rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao deletar pessoa',
            error: error.message
        });
    }
}

async function cadastrarServico(req, res) {
    try {
        const { descricao, valor } = req.body;
        const sql = service.cadastrarServico({ descricao, valor });
        const result = await db.query(sql.text, sql.values);
        return res.status(201).json({
            status: 'ok',
            message: 'Serviço cadastrado com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao cadastrar serviço',
            error: error.message
        });
    }
}

async function atualizarValorServico(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { valor } = req.body;
        const sql = service.atualizarValorServico(id, valor);
        const result = await db.query(sql.text, sql.values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Serviço não encontrado'
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Valor do serviço atualizado com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao atualizar serviço',
            error: error.message
        });
    }
}

async function deletarServico(req, res) {
    try {
        const id = parseInt(req.params.id);
        const sql = service.deletarServico(id);
        const result = await db.query(sql.text, sql.values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Serviço não encontrado'
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Serviço deletado com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao deletar serviço',
            error: error.message
        });
    }
}


async function cadastrarOrdem(req, res) {
    try {
      const { id_veiculo, tipo, observacoes } = req.body;
  
      if (!id_veiculo || !tipo) {
        return res.status(400).json({
          status: 'error',
          message: 'Campos obrigatórios: id_veiculo, tipo'
        });
      }
  
      const sql = service.cadastrarOrdem({ id_veiculo, tipo, observacoes });
      const result = await db.query(sql.text, sql.values);
  
      return res.status(201).json({
        status: 'ok',
        message: 'Ordem cadastrada com sucesso',
        data: result.rows[0]
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao cadastrar ordem',
        error: error.message
      });
    }
  }

  async function atualizarStatusOrdem(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const { status } = req.body;

        const statusPermitidos = ['Aberto', 'Em Andamento', 'Concluído', 'Cancelado'];
        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({ 
                error: 'Status inválido',
                status_validos: statusPermitidos 
            });
        }

        const sql = service.atualizarStatusOrdem(id, status);
        const result = await db.query(sql.text, sql.values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
        }

        return res.status(200).json({
            status: 'ok',
            data: result.rows[0]
        });

    } catch (error) {
        return res.status(500).json({ 
            error: 'Erro ao atualizar status',
            details: error.message 
        });
    }
}

  async function deletarOrdem(req, res) {
    try {
        const id = parseInt(req.params.id);
        const sql = service.deletarOrdem(id);
        const result = await db.query(sql.text, sql.values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Ordem não encontrada'
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Ordem deletada com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao deletar ordem',
            error: error.message
        });
    }
}

async function cadastrarProduto(req, res) {
    try {
        const {nome, tipo, valor, estoque} = req.body;
        const sql = service.cadastrarProduto({nome, tipo, valor, estoque});
        const result = await db.query(sql.text, sql.values);

        return res.status(201).json({
            status: 'ok',
            message: 'Produto cadastrado com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao cadastrar produto',
            error: error.message
        });
    }
}

async function listarProdutos(req, res) {
    try {
        const sql = service.listarProdutos();
        const result = await db.query(sql.text, sql.values);

        return res.status(200).json({
            status: 'ok',
            message: 'Lista de produtos',
            data: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao listar produtos',
            error: error.message
        });
    }
}

async function atualizarValorProduto(req, res) {
    try {
        const id = parseInt(req.params.id);
        const {valor} = req.body;

        if (valor === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'Campo valor é obrigatório'
            });
        }

        const sql = service.atualizarValorProduto(id, valor);
        const result = await db.query(sql.text, sql.values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Produto não encontrado'
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Valor do produto atualizado com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao atualizar valor do produto',
            error: error.message
        });
    }
}

async function deletarProduto(req, res) {
    try {
        const id = parseInt(req.params.id);
        const sql = service.deletarProduto(id);
        const result = await db.query(sql.text, sql.values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Produto não encontrado'
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Produto deletado com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao deletar produto',
            error: error.message
        });
    }
}

async function adicionarProdutoNaOrdem(req, res) {
    try {
        const { id_os, id_produto, quantidade } = req.body;

        const produto = await db.query(
            'SELECT nome, valor FROM T_PRODUTOS WHERE id_produto = $1',
            [id_produto]
        );

        if (produto.rowCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const { nome, valor } = produto.rows[0];

        const sql = service.adicionarProdutoNaOrdem({
            id_os,
            id_produto,
            valor_unitario: valor,
            quantidade,
            descricao_execucao: nome
        });

        const result = await db.query(sql.text, sql.values);
        return res.status(201).json(result.rows[0]);

    } catch (error) {
        return res.status(500).json({ 
            status: 'error',
            message: 'Erro ao adicionar produto', 
            error: error.message });
    }
}

async function adicionarServicoNaOrdem(req, res) {
    try {
        const { id_os, id_servico, quantidade } = req.body;

        // Buscar valor e descrição do serviço
        const servico = await db.query(
            'SELECT descricao, valor FROM T_SERVICOS WHERE id_servico = $1',
            [id_servico]
        );

        if (servico.rowCount === 0) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }

        const { descricao, valor } = servico.rows[0];

        const sql = service.adicionarServicoNaOrdem({
            id_os,
            id_servico,
            valor_unitario: valor,
            quantidade,
            descricao_execucao: descricao
        });

        const result = await db.query(sql.text, sql.values);
        return res.status(201).json(result.rows[0]);

    } catch (error) {
        return res.status(500).json({ 
            status: 'error',
            message: 'Erro ao adicionar serviço', 
            error: error.message });
    }
}

async function relatorioFinanceiro(req, res) {
    try {
        const sql = service.relatorioFinanceiro();
        const result = await db.query(sql.text, sql.values);

        return res.status(200).json({
            total: result.rows.reduce((acc, row) => acc + Number(row.valor_total), 0),
            registros: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao gerar relatório financeiro',
            error: error.message
        });
    }
}

async function deletarLigacao(req, res) {
    try {
        const id = parseInt(req.params.id_servico_veiculo);

        const sql = service.deletarLigacaoPorId(id); 
        const result = await db.query(sql.text, sql.values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Não encontrado' });
        }

        return res.status(200).json({
            message: 'Deletado com sucesso',
            data: result.rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao deletar',
            error: error.message
        });
    }
}

module.exports = {
    getVeiculoPorPlaca,
    deletarVeiculo,
    getPorDocumentoCliente,
    cadastrarVeiculo,
    cadastrarPessoa,
    deletarPessoaPorId,
    cadastrarServico,
    atualizarValorServico,
    deletarServico,
    cadastrarOrdem,
    atualizarStatusOrdem,
    deletarOrdem,
    cadastrarProduto,
    listarProdutos,
    atualizarValorProduto,
    deletarProduto,
    adicionarProdutoNaOrdem,
    adicionarServicoNaOrdem,
    relatorioFinanceiro,
    deletarLigacao
};