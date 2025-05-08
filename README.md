# Gerenciamento de uma mecânica - [Mecânica]

## 📝 Descrição
API para gerenciamento de oficina mecânica, incluindo cadastro de clientes, veículos, ordens de serviço, produtos e relatórios financeiros

## 🚀 Tecnologias utilizadas
- Node.js
- Express
- PostgreSQL

## 🔧 Como executar
```bash
# Clone o repositório
git clone https://github.com/usuario/nome-do-repositorio

# Instale as dependências
npm install

# Configure o banco de dados
# Crie um arquivo .env com suas variáveis de ambiente
# Exemplo:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=Sua_senha
# DB_NAME=nome_banco

# Rode o script SQL

```
CREATE TABLE T_PESSOA (
    id_pessoa SERIAL PRIMARY KEY,
    tipo_pessoa CHAR(1) NOT NULL CHECK (tipo_pessoa IN ('F', 'J')), -- F = Física, J = Jurídica
    nome VARCHAR(100) NOT NULL,
    documento VARCHAR(18) NOT NULL UNIQUE, -- Pode ser CPF ou CNPJ --REGEX NO JS
    data_nascimento DATE, -- Só usado se for pessoa física
    --razao_social VARCHAR(150), -- Só usado se for pessoa jurídica
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco VARCHAR(200),
    --cidade VARCHAR(100),
    --estado VARCHAR(2),
    cep VARCHAR(10),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE T_VEICULOS (
    id_veiculo SERIAL PRIMARY KEY,
    id_pessoa INT NOT NULL REFERENCES T_PESSOA(id_pessoa),
    placa VARCHAR(10) NOT NULL UNIQUE,
    modelo VARCHAR(50) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    ano INT NOT NULL,
    cor VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE T_PRODUTOS (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    estoque INT DEFAULT 0,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE T_ORDENS (
    id_os SERIAL PRIMARY KEY,
    id_veiculo INT NOT NULL REFERENCES T_VEICULOS(id_veiculo),
    tipo CHAR(3) NOT NULL CHECK (tipo IN ('OS', 'ORC')), -- OS = Ordem, ORC = Orçamento
    status VARCHAR(20) DEFAULT 'Aberto' CHECK (status IN ('Aberto', 'Em Andamento', 'Concluído', 'Cancelado')),
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_validade DATE GENERATED ALWAYS AS (data_emissao::date + INTERVAL '7 days') STORED,
    observacoes TEXT
);


CREATE TABLE T_SERVICOS (
    id_servico SERIAL PRIMARY KEY,
    descricao VARCHAR(200) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE L_SERVICO_VEICULO (
    id_servico_veiculo SERIAL PRIMARY KEY,
    id_os INT NOT NULL REFERENCES T_ORDENS(id_os),
    id_servico INT REFERENCES T_SERVICOS(id_servico),
    id_produto INT REFERENCES T_PRODUTOS(id_produto),
    descricao_execucao TEXT,
    quantidade INT DEFAULT 1 CHECK (quantidade > 0),
    valor_unitario NUMERIC(10, 2),
    valor_total NUMERIC(12, 2) GENERATED ALWAYS AS (quantidade * valor_unitario) STORED,
    data_execucao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (id_servico IS NOT NULL AND id_produto IS NULL)
        OR (id_servico IS NULL AND id_produto IS NOT NULL)
    )
)
```

# Inicie o servidor
npm run dev
```

# 📚 Documentação da API

## 🎯 Exemplo de Endpoints

### `GET /mecanica/veiculos/placa/:placa`
Retorna as informações do carro e do respectivo dono do veículo.

**Request:**
```
http://localhost:3000/mecanica/veiculos/placa/XYZ6F56
```

**Response:**
```json
{
  "status": "ok",
  "message": "Consulta realizada com sucesso",
  "data": [
    {
      "nome": "Ana Paula da Silva",
      "telefone": "(11) 99999-1234",
      "documento": "123.456.789-09",
      "modelo": "Jetta",
      "marca": "Volkswagen",
      "ano": 2014
    }
  ]
}
```

### `POST /mecanica/veiculos/cadastrar`
Cadastra um veiculo com base nas informações mandadas.

**Request:**
```json
{
  "placa": "FOD7S56",
  "modelo": "Astra",
  "marca": "Chevrolet",
  "ano": 2006,
  "cor": "Prata",
  "id_pessoa": 8
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "Veículo cadastrado com sucesso",
  "data": {
    "id_veiculo": 13,
    "id_pessoa": 8,
    "placa": "FOD7S56",
    "modelo": "Astra",
    "marca": "Chevrolet",
    "ano": 2006,
    "cor": "Prata",
    "data_cadastro": "2025-05-08T21:58:42.254Z"
  }
}
```

### `DELETE /mecanica/veiculos/deletar/:placa`
Exclui um veículo com base na placa passada como parâmetro.

**Request:**
```
http://localhost:3000/mecanica/veiculos/deletar/FOD7S56
```

**Response:**
```json
{
  "status": "ok",
  "message": "Veículo deletado com sucesso",
  "data": {
    "id_veiculo": 13,
    "id_pessoa": 8,
    "placa": "FOD7S56",
    "modelo": "Astra",
    "marca": "Chevrolet",
    "ano": 2006,
    "cor": "Prata",
    "data_cadastro": "2025-05-08T21:58:42.254Z"
  }
}
```
### `GET /mecanica/veiculos/cliente/documento/:documento`
Retorna informações sobre o cliente e sobre o(s) carros que o cliente tem na mecânica.

**Request:**
```
http://localhost:3000/mecanica/veiculos/cliente/documento/123.456.789-09
```

**Response:**
```json
{
  "status": "ok",
  "message": "Consulta realizada com sucesso",
  "data":
    {
      "nome": "Ana Paula da Silva",
      "documento": "123.456.789-09",
      "telefone": "(11) 99999-1234",
      "placa": "ABC1D23",
      "modelo": "Civic",
      "marca": "Honda",
      "ano": 2019
    }
}
```
### `POST /mecanica/clientes/cadastrar`
Cadastrar um cliente

**Request:**
```json
{
  "tipo_pessoa": "J",
  "nome": "Teste",
  "documento": "83.731.927/0056-00",
  "telefone": "(49) 3646-3756",
  "email": "empresa@gmail.com",
  "endereco": "ali mesmo, 123",
  "cep": "69690-000"
}
```
**Response:**
```json
{
  "status": "ok",
  "message": "Cliente cadastrado(a) com sucesso",
  "data": {
    "nome": "Teste",
    "telefone": "(49) 3646-3756",
    "endereco": "ali mesmo, 123"
  }
}
```
### `DELETE /mecanica/clientes/deletar/:id`
Exclui um cliente conforme o ID passado por parâmetro.

**Request:**
```
http://localhost:3000/mecanica/clientes/deletar/1
```

**Resquest:**
```json
{
  "status": "ok",
  "message": "Pessoa deletada com sucesso",
  "data": {
    "id_pessoa": 8,
    "tipo_pessoa": "J",
    "nome": "Teste",
    "documento": "83.731.927/0056-00",
    "data_nascimento": null,
    "telefone": "(49) 3646-3756",
    "email": "empresa@gmail.com",
    "endereco": "ali mesmo, 123",
    "cep": "69690-000",
    "data_cadastro": "2025-05-08T15:50:43.687Z"
  }
}
```

### `POST /mecanica/servicos/cadastrar`
Cadastrar um produto

**Request:**
```json
{
  "descricao": "TESTE",
  "valor": 450.00
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "Serviço cadastrado com sucesso",
  "data": {
    "id_servico": 9,
    "descricao": "TESTE",
    "valor": "450.00"
  }
}
```
### `PATCH /mecanica/servicos/atualizar/:id`
Atualiza o valor do serviço com ID passado como parâmetro.

**Request:**
```json
{
  "valor": 950.00
}
```

**Response:**

```json
{
  "status": "ok",
  "message": "Valor do serviço atualizado com sucesso",
  "data": {
    "id_servico": 4,
    "descricao": "Serviço de revisão completa",
    "valor": "950.00"
  }
}
```

### `DELETE /mecanica/servicos/deletar/:id`
Exclui um serviço com base no ID passado como parâmetro.

**Request:**
```
http://localhost:3000/mecanica/servicos/deletar/9
```

**Response:**
```json
{
  "status": "ok",
  "message": "Serviço deletado com sucesso",
  "data": {
    "id_servico": 9,
    "descricao": "TESTE",
    "valor": "450.00",
    "data_cadastro": "2025-05-08T22:35:10.865Z"
  }
}
```

### `POST /mecanica/ordens/cadastrar`
Cadastra uma ordem de serviço para um determinado veículo.

**Request:**
```json
{
  "id_veiculo": 12,
  "tipo": "OS",
  "observacoes": "Mecanica geral"
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "Ordem cadastrada com sucesso",
  "data": {
    "id_os": 25,
    "tipo": "OS ",
    "status": "Aberto",
    "data_emissao": "2025-05-08T22:42:59.619Z",
    "data_validade": "2025-05-15T03:00:00.000Z"
  }
}
```

### `PATCH /mecanica/ordens/atualizar/:id`
Atualiza o status de determinada ordem de serviço conforme o ID passado por parâmetro.

**Request:**
```json
{
    "status": "Em Andamento"
}
```

**Response:**
```json
{
  "status": "ok",
  "data": {
    "id_os": 18,
    "id_veiculo": 3,
    "tipo": "OS ",
    "status": "Em Andamento",
    "data_emissao": "2025-05-06T18:20:54.895Z",
    "data_validade": "2025-05-13T03:00:00.000Z",
    "observacoes": "Troca de óleo e filtro"
  }
}
```

### `DELETE /mecanica/ordens/deletar/:id`
Exclui uma ordem de serviço conforme o ID da ordem passado por parâmetro.

**Request:**
```
http://localhost:3000/mecanica/ordens/deletar/25
```

**Response:**
```json
{
  "status": "ok",
  "message": "Ordem deletada com sucesso",
  "data": {
    "id_os": 25,
    "id_veiculo": 12,
    "tipo": "OS ",
    "status": "Aberto",
    "data_emissao": "2025-05-08T22:42:59.619Z",
    "data_validade": "2025-05-15T03:00:00.000Z",
    "observacoes": "Mecanica geral"
  }
}
```

### `GET /mecanica/produtos/listar`
Lista todos os produtos cadastrados.

**Request:**
```
http://localhost:3000/mecanica/ordens/deletar/25
```

**Response:**
```json
{
  "status": "ok",
  "message": "Ordem deletada com sucesso",
  "data": {
    "id_os": 25,
    "id_veiculo": 12,
    "tipo": "OS ",
    "status": "Aberto",
    "data_emissao": "2025-05-08T22:42:59.619Z",
    "data_validade": "2025-05-15T03:00:00.000Z",
    "observacoes": "Mecanica geral"
  }
}
```

### `POST /mecanica/produtos/cadastrar`
Cadastra um produto.

**Request:**
```json
{
  "nome": "Teste",
  "tipo": "Testeee",
  "valor": 89.90,
  "estoque": 50
}
```

**Response:**

```json
{
  "status": "ok",
  "message": "Produto cadastrado com sucesso",
  "data": {
    "id_produto": 18,
    "nome": "Teste",
    "tipo": "Testeee",
    "valor": "89.90",
    "estoque": 50,
    "data_cadastro": "2025-05-08T22:56:09.933Z"
  }
}
```

### `PATCH /mecanica/produtos/atualizar/:id`
Atualiza o valor de um produto conforme o ID do produto passado por parâmetro.

**Request:**
```json
{
  "valor": 800.74
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "Valor do produto atualizado com sucesso",
  "data": {
    "id_produto": 4,
    "nome": "Correia Dentada",
    "tipo": "Peça",
    "valor": "800.74",
    "estoque": 30,
    "data_cadastro": "2025-04-29T22:17:47.632Z"
  }
}
```

### `DELETE /mecanica/produtos/deletar/:id`
Exclui um produto conforme o ID do produto passado como parâmetro.

**Request:**
```
http://localhost:3000/mecanica/produtos/deletar/18
```

**Response:**
```json
{
  "status": "ok",
  "message": "Produto deletado com sucesso",
  "data": {
    "id_produto": 18,
    "nome": "Teste",
    "tipo": "Testeee",
    "valor": "89.90",
    "estoque": 50,
    "data_cadastro": "2025-05-08T22:56:09.933Z"
  }
}
```

### `POST /mecanica/ordens/servicos/cadastrar`
Cadastra um serviço na tabela de ligação para um determinado carro e determinada ordem.

**Request:**
```json
{
  "id_os": 19,
  "id_servico": 4,
  "quantidade": 1
}
```

**Response:**
```json
{
  "id_servico_veiculo": 24,
  "id_os": 19,
  "id_servico": 4,
  "id_produto": null,
  "descricao_execucao": "Serviço de revisão completa",
  "quantidade": 1,
  "valor_unitario": "950.00",
  "valor_total": "950.00",
  "data_execucao": "2025-05-08T23:05:48.288Z"
}
```

### `POST /mecanica/ordens/produtos/cadastrar`
Cadastra um produto na tabela de ligação para um determinado carro e determinada ordem.

**Request:**
```json
{
  "id_os": 18,
  "id_produto": 2,
  "quantidade": 3
}
```

**Response:**
```json
{
  "id_servico_veiculo": 25,
  "id_os": 18,
  "id_servico": null,
  "id_produto": 2,
  "descricao_execucao": "Filtro de Óleo",
  "quantidade": 3,
  "valor_unitario": "25.00",
  "valor_total": "75.00",
  "data_execucao": "2025-05-08T23:08:21.051Z"
}
```

### `GET /mecanica/relatorio/financeiro`
Gera um relatório financeiro na ordens de serviço com status concluído.

**Request:**
```
http://localhost:3000/mecanica/relatorio/financeiro
```

**Response:**
```json
{
  "total": 950,
  "registros": 
    {
      "id_servico_veiculo": 24,
      "id_os": 19,
      "status": "Concluído",
      "id_servico": 4,
      "id_produto": null,
      "descricao_execucao": "Serviço de revisão completa",
      "quantidade": 1,
      "valor_unitario": "950.00",
      "valor_total": "950.00",
      "data_execucao": "2025-05-08T23:05:48.288Z"
    }
}
```

### `DELETE /mecanica/ordens/servicos/deletar/:id_servico_veiculo`
Exclui um recurso da tabela de ligação conforme o ID passado como parâmetro.

**Request:**
```
http://localhost:3000/mecanica/ordens/servicos/deletar/24
```

**Response:**
```json
{
  "message": "Deletado com sucesso",
  "data": {
    "id_servico_veiculo": 24,
    "id_os": 19,
    "id_servico": 4,
    "id_produto": null,
    "descricao_execucao": "Serviço de revisão completa",
    "quantidade": 1,
    "valor_unitario": "950.00",
    "valor_total": "950.00",
    "data_execucao": "2025-05-08T23:05:48.288Z"
  }
}
```

