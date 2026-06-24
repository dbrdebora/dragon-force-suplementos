// Número de WhatsApp da loja, no formato internacional, sem espaços ou símbolos.
const numeroWhatsApp = "5599985464524";

// Array que vai guardar os produtos adicionados ao carrinho.
let carrinho = [];

// Contador usado pra dar um "id" único a cada item adicionado.
let proximoId = 1;

// Elementos do painel lateral (drawer) do carrinho.
const drawer = document.getElementById("drawer-carrinho");
const overlay = document.getElementById("overlay-carrinho");
const btnAbrir = document.getElementById("btn-abrir-carrinho");
const btnFechar = document.getElementById("btn-fechar-carrinho");

// Abre o painel do carrinho.
function abrirCarrinho() {
  drawer.classList.add("aberto");
  overlay.classList.add("aberto");
}

// Fecha o painel do carrinho.
function fecharCarrinho() {
  drawer.classList.remove("aberto");
  overlay.classList.remove("aberto");
}

btnAbrir.addEventListener("click", abrirCarrinho);
btnFechar.addEventListener("click", fecharCarrinho);
overlay.addEventListener("click", fecharCarrinho); // clicar fora do painel também fecha

// Pega todos os botões "Adicionar ao carrinho" que existem na página.
const botoesAdicionar = document.querySelectorAll(".btn-adicionar");

botoesAdicionar.forEach(botao => {
  botao.addEventListener("click", () => {
    const nome = botao.dataset.nome;
    const preco = parseFloat(botao.dataset.preco);

    carrinho.push({ id: proximoId, nome, preco });
    proximoId++;

    atualizarCarrinho();
    abrirCarrinho(); // abre o painel automaticamente ao adicionar um item
  });
});

// Remove um item do carrinho pelo id, e atualiza a tela.
function removerItem(id) {
  carrinho = carrinho.filter(item => item.id !== id);
  atualizarCarrinho();
}

// Redesenha a lista de itens do carrinho dentro do painel.
function desenharListaCarrinho() {
  const lista = document.getElementById("lista-itens-carrinho");
  lista.innerHTML = "";

  if (carrinho.length === 0) {
    lista.innerHTML = "<p style='text-align:center; color:#888; margin-top:20px;'>Seu carrinho está vazio.</p>";
    return;
  }

  carrinho.forEach(item => {
    const div = document.createElement("div");
    div.className = "item-carrinho";

    div.innerHTML = `
      <span class="info-item">${item.nome} - R$ ${item.preco.toFixed(2).replace(".", ",")}</span>
      <button class="btn-remover" data-id="${item.id}">remover</button>
    `;

    lista.appendChild(div);
  });

  lista.querySelectorAll(".btn-remover").forEach(botao => {
    botao.addEventListener("click", () => {
      const id = parseInt(botao.dataset.id);
      removerItem(id);
    });
  });
}

// Atualiza o contador, o total e a lista visual do carrinho.
function atualizarCarrinho() {
  const contador = document.getElementById("contador-carrinho");
  const totalEl = document.getElementById("total-carrinho");

  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);

  contador.textContent = carrinho.length;
  totalEl.textContent = total.toFixed(2).replace(".", ",");

  desenharListaCarrinho();
}

// Monta a mensagem e abre o WhatsApp com o pedido pronto.
function enviarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "Olá! Quero fazer o seguinte pedido:\n\n";

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (R$ ${item.preco.toFixed(2).replace(".", ",")})\n`;
  });

  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
  mensagem += `\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`;

  const link = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  window.open(link, "_blank");
}

document.getElementById("btn-finalizar").addEventListener("click", enviarPedido);

// Inicializa o carrinho vazio na tela.
atualizarCarrinho();