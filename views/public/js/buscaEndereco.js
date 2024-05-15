// Função para exibir alerta com Bootstrap
function exibirAlerta(mensagem, tipo = 'danger') {
    const alerta = document.getElementById('alerta-cep'); // Obtém o elemento do alerta
    alerta.innerText = mensagem; // Define a mensagem do alerta
    alerta.className = `alert alert-${tipo}`; // Define a classe para o tipo de alerta (por exemplo, 'alert-danger')
    alerta.style.display = 'block'; // Exibe o alerta
  }
  
  // Função para ocultar o alerta
  function ocultarAlerta() {
    const alerta = document.getElementById('alerta-cep'); // Obtém o elemento do alerta
    alerta.style.display = 'none'; // Oculta o alerta
  }
  
  // Função para preencher campos com dados do endereço
  function preencheCampos(data) {
    document.getElementById("cidadeEstado").value = `${data.localidade}, ${data.uf}`; // Preenche cidade e estado
    document.getElementById("rua").value = data.logradouro; // Preenche a rua (logradouro)
    ocultarAlerta(); // Oculta o alerta se estiver visível
  }
  
  // Função para buscar dados do CEP usando a API ViaCEP
  async function buscaCep(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`); // Chama a API ViaCEP
      if (response.ok) { // Se a resposta for bem-sucedida
        const data = await response.json(); // Converte a resposta para JSON
        if (!data.erro) { // Se não houver erro na resposta
          preencheCampos(data); // Preenche os campos com os dados do endereço
        } else {
          exibirAlerta("CEP não encontrado"); // Se o CEP não for encontrado, exibe alerta
        }
      } else {
        exibirAlerta("Erro ao buscar o CEP"); // Se houver erro na resposta
      }
    } catch (error) {
      exibirAlerta("Erro de conexão ou servidor indisponível"); // Se houver erro de rede
    }
  }
  
  // Evento para buscar CEP ao sair do campo
  document.addEventListener("DOMContentLoaded", () => { // Garante que o DOM esteja carregado
    const campoCep = document.getElementById("cep"); // Obtém o campo do CEP
  
    campoCep.addEventListener("blur", (e) => { // Define o evento "blur"
      const cep = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
      if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
        buscaCep(cep); // Chama a função para buscar o CEP
      } else {
        exibirAlerta("CEP inválido"); // Exibe alerta se o CEP for inválido
      }
    });
  });  