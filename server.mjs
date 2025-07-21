import express from 'express';
import {Low} from 'lowdb';
import path from 'path';
import { JSONFile } from 'lowdb/node'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3003;

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, { clientes: [] });

app.use(express.json());

async function initDB() {
    await db.read();
    db.data ||= {clientes: []}
    await db.write();
}

app.get('/clientes', async (req, res) => {
    await db.read();
    res.json(db.data.clientes);
});

app.get('/clientes/:cnpj', async (req, res) => {
    await db.read();
    const cliente = db.data.clientes.find(c => c.CNPJ === req.params.cnpj);
    if (!cliente) return res.status(404).json({error: 'Cliente não encontrado'});
    res.json(cliente)
});

app.post('/clientes', async (req, res) => {
    const novoCliente = req.body;
    if (!novoCliente.CNPJ || !novoCliente.razaoSocial){
        return res.status(400).json({error: 'CNPJ e razao social são obrigatórios'});
    }
    await db.read();
    const existe = db.data.clientes.some(c => c.CNPJ === novoCliente.CNPJ);
    if (existe) {
        return res.status(400).json({error: 'Cliente já cadastrado'});
    }   
    db.data.clientes.push(novoCliente);
    await db.write();
    res.status(201).json(novoCliente);
});

app.put('/clientes/:cnpj', async (req, res) => {
    await db.read();
    const cliente = db.data.clientes.find(c => c.CNPJ === req.params.cnpj);
    if (!cliente) {
        return res.status(404).json({error: 'Cliente não encontrado'});
    }
        Object.assign(cliente, req.body);
        await db.write();
        res.json({mensagem: 'Cliente atualizado com sucesso', cliente});
    
    });

   app.delete('/clientes/:cnpj', async (req, res) => {
  await db.read();

  const index = db.data.clientes.findIndex(c => c.CNPJ === req.params.cnpj);
  if (index === -1) {
    return res.status(404).json({ error: 'Cliente não encontrado' });
  }

  db.data.clientes.splice(index, 1);

  await db.write();
  res.json({ mensagem: 'Cliente removido com sucesso' });
});

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
});
