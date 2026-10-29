
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const lista = document.getElementById("lista-produtos");
    const busca = document.getElementById("busca");
    const ordenacao = document.getElementById("ordenacao");
    const quantidade = document.getElementById(
        "quantidade-produtos"
    );
    const mensagemVazia = document.getElementById(
        "mensagem-vazia"
    );
    const filtros = document.querySelectorAll(".filtro");

    let categoriaAtual = "Todas";

    if (!lista) {
        console.error("Lista de produtos não encontrada.");
        return;
    }

    const produtos = window.PRODUCTS;

    if (!Array.isArray(produtos)) {
        lista.textContent =
            "Erro ao carregar produtos. Confira products.js.";
        return;
    }

    function formatarPreco(valor) {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // CRIA OS CARTÕES DOS PRODUTOS

    function criarCartao(produto) {
        const card = document.createElement("article");
        card.className = "produto-card";

        card.innerHTML = `
            <div class="produto-icone">
                ${produto.icone || "✨"}
            </div>

            <p class="produto-categoria">
                ${produto.categoria}
            </p>

            <h3 class="produto-nome">
                ${produto.nome}
            </h3>

            <p class="produto-descricao">
                ${produto.descricao}
            </p>

            <div class="produto-rodape">
                <strong class="produto-preco">
                    ${formatarPreco(produto.preco)}
                </strong>

                <button
                    type="button"
                    class="botao-adicionar"
                    data-adicionar="${produto.id}"
                >
                    Adicionar ao carrinho
                </button>
            </div>
        `;

        return card;
    }

    // MOSTRA OS PRODUTOS

    function renderizarProdutos() {
        const pesquisa = busca
            ? busca.value.toLocaleLowerCase("pt-BR").trim()
            : "";

        let resultado = produtos.filter(produto => {

            const categoriaCorreta =
                categoriaAtual === "Todas" ||
                produto.categoria === categoriaAtual;

            const textoProduto = [
                produto.nome,
                produto.categoria,
                produto.descricao
            ].join(" ").toLocaleLowerCase("pt-BR");

            return categoriaCorreta &&
                textoProduto.includes(pesquisa);
        });

        // ORDENAÇÃO

        if (ordenacao) {
            if (ordenacao.value === "menor") {
                resultado.sort(
                    (a, b) => a.preco - b.preco
                );
            }

            if (ordenacao.value === "maior") {
                resultado.sort(
                    (a, b) => b.preco - a.preco
                );
            }

            if (ordenacao.value === "nome") {
                resultado.sort(
                    (a, b) => a.nome.localeCompare(
                        b.nome, "pt-BR"
                    )
                );
            }
        }

        lista.replaceChildren();

        resultado.forEach(produto => {
            lista.appendChild(criarCartao(produto));
        });

        if (quantidade) {
            quantidade.textContent =
                `${resultado.length} produto(s)`;
        }

        if (mensagemVazia) {
            mensagemVazia.hidden = resultado.length > 0;
        }
    }

    // BUSCA

    if (busca) {
        busca.addEventListener(
            "input",
            renderizarProdutos
        );
    }

    // ORDENAÇÃO

    if (ordenacao) {
        ordenacao.addEventListener(
            "change",
            renderizarProdutos
        );
    }

    // FILTROS POR CATEGORIA

    filtros.forEach(botao => {
        botao.addEventListener("click", () => {
            categoriaAtual =
                botao.dataset.categoria || "Todas";

            filtros.forEach(filtro => {
                filtro.classList.remove("ativo");
            });

            botao.classList.add("ativo");

            renderizarProdutos();
        });
    });

    // ADICIONAR AO CARRINHO

    lista.addEventListener("click", evento => {

        const botao = evento.target.closest(
            "[data-adicionar]"
        );

        if (!botao) return;

        if (
            !window.GadgetsCart ||
            typeof window.GadgetsCart.adicionar !== "function"
        ) {
            alert("Erro ao carregar o carrinho.");
            return;
        }

        const id = Number(botao.dataset.adicionar);

        const sucesso = window.GadgetsCart.adicionar(id);

        if (!sucesso) {
            alert("Não foi possível adicionar o produto.");
            return;
        }

        botao.textContent = "Adicionado ✓";
        botao.disabled = true;

        setTimeout(() => {
            botao.textContent = "Adicionar ao carrinho";
            botao.disabled = false;
        }, 1000);
    });

    // INICIALIZA O SITE

    renderizarProdutos();

    if (window.GadgetsCart) {
        window.GadgetsCart.atualizarContador();
    }
});
