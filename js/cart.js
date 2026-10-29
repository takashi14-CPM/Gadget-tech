
"use strict";

(function () {
    const CHAVE = "gadgets-tech-carrinho";

    function obter() {
        try {
            const dados = JSON.parse(
                localStorage.getItem(CHAVE) || "[]"
            );
            return Array.isArray(dados) ? dados : [];
        } catch (erro) {
            console.error("Erro ao ler carrinho:", erro);
            return [];
        }
    }

    function atualizarContador() {
        const contador = document.getElementById(
            "contador-carrinho"
        );

        if (!contador) return;

        const total = obter().reduce(
            (soma, item) => soma + item.quantidade,
            0
        );

        contador.textContent = total;
    }

    function salvar(itens) {
        localStorage.setItem(
            CHAVE,
            JSON.stringify(itens)
        );

        atualizarContador();
        window.dispatchEvent(new Event("carrinhoAtualizado"));
    }

    function adicionar(id) {
        const produtos = window.PRODUCTS || [];

        const produto = produtos.find(
            p => Number(p.id) === Number(id)
        );

        if (!produto) {
            console.error("Produto não encontrado:", id);
            return false;
        }

        const itens = obter();

        const existente = itens.find(
            item => Number(item.id) === Number(id)
        );

        if (existente) {
            existente.quantidade += 1;
        } else {
            itens.push({
                id: produto.id,
                nome: produto.nome,
                preco: Number(produto.preco),
                icone: produto.icone,
                quantidade: 1
            });
        }

        salvar(itens);
        return true;
    }

    function remover(id) {
        const itens = obter().filter(
            item => Number(item.id) !== Number(id)
        );

        salvar(itens);
    }

    function alterarQuantidade(id, quantidade) {
        const itens = obter();

        const item = itens.find(
            p => Number(p.id) === Number(id)
        );

        if (!item) return;

        if (quantidade <= 0) {
            remover(id);
            return;
        }

        item.quantidade = quantidade;
        salvar(itens);
    }

    function limpar() {
        salvar([]);
    }

    window.GadgetsCart = {
        obter,
        salvar,
        adicionar,
        remover,
        alterarQuantidade,
        limpar,
        atualizarContador
    };

    document.addEventListener(
        "DOMContentLoaded",
        atualizarContador
    );
})();
