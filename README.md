# Cliente LowDB

Projeto simples de CRUD para clientes usando Node.js, Express e LowDB (banco JSON leve).

## Funcionalidades

- Listar clientes
- Buscar cliente por CNPJ
- Criar, atualizar e deletar clientes
- Persistência simples usando LowDB

## Como rodar

```bash
npm install
node server.mjs
A API roda na porta 3003 por padrão.

Endpoints principais
GET /clientes - Lista todos os clientes

GET /clientes/:cnpj - Busca cliente pelo CNPJ

POST /clientes - Adiciona cliente (JSON no body)

PUT /clientes/:cnpj - Atualiza cliente pelo CNPJ

DELETE /clientes/:cnpj - Remove cliente pelo CNPJ

Criado por Pedro Lucas


3. Salve o arquivo.
