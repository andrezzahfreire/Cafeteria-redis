const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const redis = require('redis');

const app = express();
let cli = null;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// CREATE - registrar pedido
app.post('/pedido', async (req, res) => {
    try {
        const pedido = req.body.itens;
        if (!pedido || pedido.length === 0) {
            return res.status(400).json({ error: "Carrinho vazio!" });
        }

        const id = Date.now().toString();
        await cli.hSet(`pedido:${id}`, {
            itens: JSON.stringify(pedido),
            status: "pendente"
        });

        res.json({ status: "Pedido registrado!", id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao salvar pedido." });
    }
});

// READ - listar todos os pedidos
app.get('/pedidos', async (req, res) => {
    try {
        const keys = await cli.keys('pedido:*');
        const pedidos = [];
        for (const key of keys) {
            const pedido = await cli.hGetAll(key);
            pedido.itens = JSON.parse(pedido.itens);
            pedido.id = key.split(':')[1];
            pedidos.push(pedido);
        }
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar pedidos." });
    }
});

// READ - pedido por ID
app.get('/pedido/:id', async (req, res) => {
    try {
        const pedido = await cli.hGetAll(`pedido:${req.params.id}`);
        if (!pedido || Object.keys(pedido).length === 0) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }
        pedido.itens = JSON.parse(pedido.itens);
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar pedido." });
    }
});

// UPDATE - atualizar pedido
app.put('/pedido/:id', async (req, res) => {
    try {
        const { itens, status } = req.body;
        const key = `pedido:${req.params.id}`;

        const exists = await cli.exists(key);
        if (!exists) return res.status(404).json({ error: "Pedido não encontrado" });

        const updated = {};
        if (itens) updated.itens = JSON.stringify(itens);
        if (status) updated.status = status;

        await cli.hSet(key, updated);
        res.json({ message: "Pedido atualizado!" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar pedido." });
    }
});

// DELETE - deletar pedido
app.delete('/pedido/:id', async (req, res) => {
    try {
        const deleted = await cli.del(`pedido:${req.params.id}`);
        if (deleted === 0) return res.status(404).json({ error: "Pedido não encontrado" });
        res.json({ message: "Pedido deletado!" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar pedido." });
    }
});

// Conectar Redis e iniciar servidor
app.listen(3000, async () => {
    cli = redis.createClient({
        socket: {
            host: '<IP_SERVIDOR_REDIS>', // troque pelo IP do Redis
            port: 6379
        }
    });

    cli.on("error", (err) => console.error("Erro Redis:", err));
    await cli.connect();

    console.log("Servidor Node rodando na porta 3000 🚀");
});
