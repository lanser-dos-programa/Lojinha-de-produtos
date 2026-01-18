import { initDB, getProdutos, updateProduto } from "./db.js";

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", async () => {
    await initDB();
    carregarProdutos();
});

/* =========================
   ELEMENTOS
========================= */
const carrossel = document.getElementById("carrosselProdutos");
const listaPedidos = document.getElementById("listaPedidos");
const totalPedido = document.getElementById("totalPedido");
const inputQuantidade = document.getElementById("quantidade");

/* =========================
   ESTADO
========================= */
let produtos = [];
let produtoSelecionado = null;
let total = 0;

/* =========================
   CARREGAR PRODUTOS
========================= */
function carregarProdutos() {
    getProdutos(lista => {
        produtos = lista;
        renderizarProdutos();
    });
}

/* =========================
   RENDERIZAR LOJA
========================= */
function renderizarProdutos() {
    carrossel.innerHTML = "";

    if (produtos.length === 0) {
        carrossel.innerText = "Nenhum produto cadastrado";
        return;
    }

    produtos.forEach((produto, index) => {
        const card = document.createElement("div");
        card.classList.add("produto");

        if (produto.quantidade === 0) {
            card.classList.add("esgotado");
        }

        const imgURL = URL.createObjectURL(produto.imagem);

        card.innerHTML = `
            <img src="${imgURL}">
            <h4>${produto.nome}</h4>
            <p>Estoque: ${produto.quantidade}</p>
            <span class="preco">R$ ${produto.preco.toFixed(2)}</span>
        `;

        if (produto.quantidade > 0) {
            card.onclick = () => {
                produtoSelecionado = index;

                document
                    .querySelectorAll(".produto")
                    .forEach(p => p.classList.remove("ativo"));

                card.classList.add("ativo");
            };
        }

        carrossel.appendChild(card);
    });
}

/* =========================
   ADICIONAR PEDIDO
========================= */
window.adicionarPedido = function () {
    if (produtoSelecionado === null) {
        alert("Selecione um produto");
        return;
    }

    const qtd = Number(inputQuantidade.value);
    const produto = produtos[produtoSelecionado];

    if (!qtd || qtd <= 0 || qtd > produto.quantidade) {
        alert("Quantidade inválida");
        return;
    }

    const subtotal = qtd * produto.preco;
    total += subtotal;

    // atualiza estoque
    produto.quantidade -= qtd;
    updateProduto(produto);

    // cria item do pedido
    const li = document.createElement("li");

    li.dataset.indexProduto = produtoSelecionado;
    li.dataset.quantidade = qtd;
    li.dataset.subtotal = subtotal;

    li.innerHTML = `
        ${produto.nome} x${qtd} — R$ ${subtotal.toFixed(2)}
        <button class="remover" onclick="removerPedido(this)">✖</button>
    `;

    listaPedidos.appendChild(li);

    totalPedido.innerText = total.toFixed(2);

    // reset
    produtoSelecionado = null;
    inputQuantidade.value = "";

    carregarProdutos();
};

/* =========================
   REMOVER PEDIDO
   (VOLTA PRO ESTOQUE)
========================= */
window.removerPedido = function (botao) {
    const li = botao.parentElement;

    const indexProduto = Number(li.dataset.indexProduto);
    const qtd = Number(li.dataset.quantidade);
    const subtotal = Number(li.dataset.subtotal);

    const produto = produtos[indexProduto];

    // devolve estoque
    produto.quantidade += qtd;
    updateProduto(produto);

    // atualiza total
    total -= subtotal;
    totalPedido.innerText = total.toFixed(2);

    // remove item
    li.remove();

    carregarProdutos();
};
