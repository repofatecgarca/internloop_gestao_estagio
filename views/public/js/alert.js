function exibirAlerta(tipo, mensagem) {
  const alerta = document.getElementById('alerta'); // Obtém o elemento do alerta
  alerta.className = `alert alert-${tipo} alerta-topo`; // Define a classe do alerta
  alerta.textContent = mensagem; // Define a mensagem do alerta
  alerta.style.display = 'block'; // Torna o alerta visível
}

// Exemplo: exibir alerta após carregar a página
document.addEventListener("DOMContentLoaded", () => {
  exibirAlerta("success", "Operação bem-sucedida!"); // Exibe um alerta de sucesso
});