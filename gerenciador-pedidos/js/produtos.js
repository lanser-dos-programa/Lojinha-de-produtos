import { initDB, addProduto, getProdutos, deleteProduto } from "./db.js";

document.addEventListener("DOMContentLoaded", async () => {
    await initDB();
    verProdutos();
});

let produtoEmEdicao = null;

function cadastro() {
    const nome = document.getElementById("name").value.trim();
    const preco = Number(document.getElementById("value").value);
    const quantia = Number(document.getElementById("amount").value);
    const inputImagem = document.getElementById("image");

    if (!nome || preco <= 0 || quantia <= 0) {
        alert("Preencha todos os campos corretamente");
        return;
    }

    if (!inputImagem.files[0]) {
        alert("Selecione uma imagem");
        return;
    }
    else{
        alert("Produto cadastrado🤘")
    }

    const produto = {
        nome,
        preco,
        quantidade: quantia,
        imagem: inputImagem.files[0] 
    };

    addProduto(produto);
    limparFormulario();
    verProdutos();
}

window.cadastro = cadastro;

function verProdutos() {
    const ul = document.getElementById("carrosselProdutos");
    if (!ul) return;

    getProdutos(produtos => {
        ul.innerHTML = "";

        produtos.forEach(produto => {
            const li = document.createElement("li");
            const imgURL = URL.createObjectURL(produto.imagem);

            li.innerHTML = `
                <img src="${imgURL}" width="50" style="vertical-align: middle">
                <strong>${produto.nome}</strong> |
                R$ ${produto.preco} |
                Qtd: ${produto.quantidade}
                <button onclick="deletarProduto(${produto.id})">Excluir</button>
            `;

            ul.appendChild(li);
        });
    });
}

function limparFormulario() {
    document.getElementById("name").value = "";
    document.getElementById("value").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("image").value = "";
}

function deletarProduto(id) {
    if (confirm("Excluir produto??")) {
        deleteProduto(id);
        verProdutos();
    }
}

window.deletarProduto = deletarProduto;
