function getPorPlaca(params) {
    return {
        text: `
            SELECT 
                p.nome,
                p.telefone,
                p.documento,
                v.modelo,
                v.marca,
                v.ano
            FROM T_VEICULOS v
            JOIN T_PESSOA p ON v.id_pessoa = p.id_pessoa
            WHERE v.placa = $1
        `,
        values: [params.placa],
    };
}

function deletarVeiculoPorPlaca(placa) {
    return {
        text: `DELETE FROM T_VEICULOS WHERE placa = $1 RETURNING *`,
        values: [placa.toUpperCase()]
    };
}

function getPorDocumentoCliente(params) {
    return {
        text: `SELECT
    p.nome,
    p.documento,
    p.telefone,
    v.placa,
    v.modelo,
    v.marca,
    v.ano
FROM
    T_VEICULOS v
JOIN
    T_PESSOA p ON v.id_pessoa = p.id_pessoa
WHERE
    p.documento =  $1`,
        values: [params.documento],
    };
}


function cadastrarVeiculo(params) {
    return {
        text: `
            INSERT INTO T_VEICULOS (
                placa,
                modelo,
                marca,
                ano,
                cor,
                id_pessoa
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `,
        values: [
            params.placa?.toUpperCase(),
            params.modelo,
            params.marca,
            params.ano,
            params.cor,
            params.id_pessoa
        ],
    };
}

function cadastrarPessoa(params) {
    return {
        text: `INSERT INTO T_PESSOA (
                    tipo_pessoa, nome, documento, data_nascimento,
                    telefone, email, endereco, cep
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`,
        values: [
            params.tipo_pessoa,
            params.nome,
            params.documento,
            params.data_nascimento,
            params.telefone,
            params.email,
            params.endereco,
            params.cep
        ],
    };
}

function deletarPessoaPorId(id) {
    return {
        text: `DELETE FROM T_PESSOA WHERE id_pessoa = $1 RETURNING *`,
        values: [id]
    };
}

function cadastrarServico(params) {
    return {
        text: `INSERT INTO T_SERVICOS (descricao, valor) VALUES ($1, $2) RETURNING id_servico, descricao, valor`,
        values: [params.descricao, params.valor]
    };
}

function atualizarValorServico(id, valor) {
    return {
        text: `UPDATE T_SERVICOS SET valor = $1 WHERE id_servico = $2 RETURNING id_servico, descricao, valor`,
        values: [valor, id]
    };
}

function deletarServico(id) {
    return {
        text: `DELETE FROM T_SERVICOS WHERE id_servico = $1 RETURNING *`,
        values: [id]
    };
}

function cadastrarOrdem(params) {
    return {
      text: `
        INSERT INTO T_ORDENS (id_veiculo, tipo, observacoes)
        VALUES ($1, $2, $3)
        RETURNING id_os, tipo, status, data_emissao, data_validade
      `,
      values: [params.id_veiculo, params.tipo, params.observacoes]
    };
  }

  function atualizarStatusOrdem(id_os, novoStatus) {
    return {
        text: `
            UPDATE T_ORDENS 
            SET status = $1
            WHERE id_os = $2
            RETURNING *
        `,
        values: [novoStatus, id_os]
    };
}

  function deletarOrdem(id) {
    return {
        text: `DELETE FROM T_ORDENS WHERE id_os = $1 RETURNING *`,
        values: [id]
    };
}

function cadastrarProduto(params) {
    return {
        text: `INSERT INTO T_PRODUTOS (nome, tipo, valor, estoque) 
               VALUES ($1, $2, $3, $4) 
               RETURNING *`,
        values: [params.nome, params.tipo, params.valor, params.estoque]
    };
}

function listarProdutos() {
    return {
        text: `SELECT * FROM T_PRODUTOS ORDER BY id_produto`,
        values: []
    };
}

function atualizarValorProduto(id, valor) {
    return {
        text: `
            UPDATE T_PRODUTOS 
            SET valor = $1 
            WHERE id_produto = $2 
            RETURNING *;
        `,
        values: [valor, id],
    };
}


function deletarProduto(id) {
    return {
        text: `DELETE FROM T_PRODUTOS 
               WHERE id_produto = $1 
               RETURNING *`,
        values: [id]
    };
}

function adicionarProdutoNaOrdem(params) {
    return {
        text: `
            INSERT INTO L_SERVICO_VEICULO (
                id_os, id_produto, descricao_execucao, quantidade, valor_unitario
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        values: [params.id_os, params.id_produto, params.descricao_execucao, params.quantidade, params.valor_unitario]
    };
}

function adicionarServicoNaOrdem(params) {
    return {
        text: `
            INSERT INTO L_SERVICO_VEICULO (
                id_os, id_servico, descricao_execucao, quantidade, valor_unitario
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        values: [params.id_os, params.id_servico, params.descricao_execucao, params.quantidade, params.valor_unitario]
    };
}

function relatorioFinanceiro() {
    return {
        text: `
            SELECT
                lsv.id_servico_veiculo,
                lsv.id_os,
                o.status,
                lsv.id_servico,
                lsv.id_produto,
                lsv.descricao_execucao,
                lsv.quantidade,
                lsv.valor_unitario,
                lsv.valor_total,
                lsv.data_execucao
            FROM L_SERVICO_VEICULO lsv
            INNER JOIN T_ORDENS o ON o.id_os = lsv.id_os
            WHERE o.status = 'Concluído'
            ORDER BY lsv.data_execucao DESC
        `,
        values: []
    };
}

function deletarLigacaoPorId(id) {
    return {
        text: `
            DELETE FROM L_SERVICO_VEICULO
            WHERE id_servico_veiculo = $1
            RETURNING *
        `,
        values: [id]
    };
}


  
module.exports = {
    getPorPlaca,
    deletarVeiculoPorPlaca,
    getPorDocumentoCliente,
    cadastrarVeiculo,
    cadastrarPessoa,
    deletarPessoaPorId,
    cadastrarServico,
    deletarServico,
    atualizarValorServico,
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
    deletarLigacaoPorId
};