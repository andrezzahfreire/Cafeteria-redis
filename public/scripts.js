async function carregarPedidos() {
    const lista = document.getElementById("pedidos-list");
    lista.innerHTML = "";

    const res = await fetch("/pedidos");
    const pedidos = await res.json();

    if (pedidos.length === 0) {
        lista.innerHTML = "<p>Nenhum pedido registrado.</p>";
        return;
    }

    pedidos.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("pedido");
        div.innerHTML = `
            <h3>Pedido ID: ${p.id}</h3>
            <p>Status: <span class="status">${p.status}</span></p>
            <ul>
                ${p.itens.map(item => `<li>${item.nome} - ${item.quantidade}x - R$${item.preco.toFixed(2)}</li>`).join("")}
            </ul>
            <button class="confirmar">Confirmar Pedido</button>
            <button class="deletar">Deletar Pedido</button>
        `;
        lista.appendChild(div);

        div.querySelector(".confirmar").addEventListener("click", async () => {
            await fetch(`/pedido/${p.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "confirmado" })
            });
            carregarPedidos();
        });

        div.querySelector(".deletar").addEventListener("click", async () => {
            await fetch(`/pedido/${p.id}`, { method: "DELETE" });
            carregarPedidos();
        });
    });
}

window.onload = carregarPedidos;
