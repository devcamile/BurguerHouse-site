document.addEventListener('DOMContentLoaded', () => {
  let carrinho = [];
  let total = 0;

  const botaoCarrinho = document.getElementById('botao-carrinho');
  const painelCarrinho = document.getElementById('painel-carrinho');
  const contador = document.getElementById('contador-carrinho');
  const listaCarrinho = document.getElementById('itens-carrinho');
  const totalSpan = document.getElementById('total');
  const mensagem = document.getElementById('mensagem-adicionado');
  const confirmacao = document.getElementById('confirmacao');
  const listaHistorico = document.getElementById('lista-historico');

  botaoCarrinho.addEventListener('click', () => {
    painelCarrinho.classList.toggle('oculto');
  });

  window.fecharPainel = function () {
    painelCarrinho.classList.add('oculto');
  };

  window.adicionar = function (produto, preco) {
    carrinho.push({ produto, preco });
    calcularTotal();
    atualizarCarrinho();
    mostrarMensagemAdicionado();
  };

  function removerItem(index) {
    carrinho.splice(index, 1);
    calcularTotal();
    atualizarCarrinho();
  }

  function calcularTotal() {
    total = carrinho.reduce((acc, item) => acc + item.preco, 0);
  }

  function atualizarCarrinho() {
    listaCarrinho.innerHTML = '';

    carrinho.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = `${item.produto} - R$ ${item.preco.toFixed(2)}`;

      const btnRemover = document.createElement('button');
      btnRemover.textContent = '❌';
      btnRemover.style.marginLeft = '8px';
      btnRemover.addEventListener('click', () => removerItem(index));

      li.appendChild(btnRemover);
      listaCarrinho.appendChild(li);
    });

    totalSpan.textContent = total.toFixed(2);
    contador.textContent = carrinho.length;

    if (carrinho.length === 0) {
      contador.style.display = 'none';
      fecharPainel();
    } else {
      contador.style.display = 'inline-block';
    }
  }

  window.finalizarPedido = function () {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    // Mostrar resumo final
    document.getElementById('resumo-itens').innerHTML = carrinho.map(item =>
      `<li>${item.produto} - R$ ${item.preco.toFixed(2)}</li>`
    ).join('');

    const nome = localStorage.getItem('nome') || 'Cliente';
    const telefone = localStorage.getItem('telefone') || '---';
    document.getElementById('resumo-nome').innerHTML = `<strong>${nome}</strong> - ${telefone}`;
    document.getElementById('resumo-total').textContent = total.toFixed(2);
    document.getElementById('tela-final').classList.remove('oculto');

    // Salvar pedido no histórico
    const pedido = {
      data: new Date().toLocaleString(),
      itens: [...carrinho],
      total: total.toFixed(2)
    };

    let historico = JSON.parse(localStorage.getItem('historicoPedidos')) || [];
    historico.push(pedido);
    localStorage.setItem('historicoPedidos', JSON.stringify(historico));

    mostrarHistorico();

    // Limpar carrinho
    carrinho = [];
    calcularTotal();
    atualizarCarrinho();
    fecharPainel();
  };

  function mostrarMensagemAdicionado() {
    mensagem.classList.remove('oculto');
    setTimeout(() => {
      mensagem.classList.add('oculto');
    }, 2000);
  }

  window.fecharmensagem = function () {
    mensagem.classList.add('oculto');
  };

  function mostrarHistorico() {
    listaHistorico.innerHTML = '';
    const historico = JSON.parse(localStorage.getItem('historicoPedidos')) || [];

    historico.forEach((pedido, index) => {
      const li = document.createElement('li');
      li.style.marginBottom = '1rem';

      const resumo = pedido.itens.map(item => `🍔 ${item.produto} (R$ ${item.preco.toFixed(2)})`).join(', ');

      li.innerHTML = `
        <strong>Pedido ${index + 1}</strong> - ${pedido.data}<br>
        ${resumo}<br>
        <strong>Total:</strong> R$ ${pedido.total}
      `;
      listaHistorico.appendChild(li);
    });
  }

  // Inicializa
  contador.style.display = 'none';
  mostrarHistorico();
});
