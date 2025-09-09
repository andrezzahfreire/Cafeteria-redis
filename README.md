# ☕ Projeto Cafeteria com Redis e Node.js

## **Descrição do Projeto**

Este projeto implementa um **CRUD de pedidos de cafeteria** usando **Node.js** e **Redis**, com frontend em HTML e CSS.

Funcionalidades principais:

* **Criar pedidos**: selecionar produtos e quantidade no frontend e enviar ao backend.
* **Armazenamento no Redis**: cada pedido é salvo como um **hash**, com campos `itens` e `status`.
* **Gerenciamento de pedidos**: listar, atualizar status e deletar pedidos (CRUD completo).
* **Frontend interativo**: interface simples para realizar pedidos e visualizar pedidos salvos.

---

## **Configuração no Docker Playground**

### **1️⃣ Instância Redis**

1. Abra uma instância Alpine Linux no Docker Playground.
2. Instale o Redis:

```bash
apk update
apk add redis
```

3. Inicie o servidor Redis:

```bash
redis-server --protected-mode no &
```

4. Teste a conexão:

```bash
redis-cli ping
```

> Deve retornar `PONG` ✅

---

### **2️⃣ Instância Node.js**

1. Abra uma nova instância Alpine Linux.
2. Instale Node.js e npm:

```bash
apk update
apk add nodejs npm git
```

3. Clone o projeto (supondo que esteja hospedado no GitHub):

```bash
git clone <URL_DO_REPOSITORIO>
cd cafeteria-redis
```

4. Instale as dependências do Node.js:

```bash
npm install
```

5. Ajuste o `server.js` para usar o IP do Redis na sua instância:

```javascript
host: '<IP_DA_INSTANCIA_REDIS>',
port: 6379
```

6. Inicie o servidor Node.js:

```bash
node server.js
```

7. Abra a porta 3000 no Playground e acesse:

```
http://<IP_NODEJS>:3000
```

---

### **3️⃣ Testar pedidos**

* No frontend (`index.html`), selecione os produtos e clique em **Confirmar Compra**.
* No Redis, verifique os pedidos:

```bash
redis-cli
keys *
hgetall pedido:<timestamp>
```

> Cada pedido será armazenado como um **hash** com `itens` (JSON) e `status`.

---

### **Resumo das Funções**

* **Frontend**: criar e visualizar pedidos.
* **Backend Node.js**: receber pedidos e gerenciar CRUD via Redis.
* **Redis**: armazenar cada pedido como hash com status e itens.


