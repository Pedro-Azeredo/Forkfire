addEventListener('keydown', function (event) {
  if (
    event.key === 'Enter' &&
    document.getElementsByClassName('divLogin')[0].style.display === 'block'
  ) {
    event.preventDefault();
    logar();
  } else if (
    event.key === 'Enter' &&
    document.getElementsByClassName('divCadastro')[0].style.display === 'block'
  ) {
    event.preventDefault();
    cadastrar();
  }
});

function divCadastrar() {
  const divLogin = document.getElementsByClassName('divLogin')[0];
  const divCadastrar = document.getElementsByClassName('divCadastro')[0];

  if (divCadastrar.style.display === 'none') {
    divCadastrar.style.display = 'block';
    divLogin.style.display = 'none';
    limparEstiloEdado();
  } else {
    divCadastrar.style.display = 'none';
    divLogin.style.display = 'block';
    limparEstiloEdado();
  }
}

function limparEstiloEdado() {
  const erroCadastro = document.querySelector('.erroCadastro');
  const erroLogin = document.querySelector('.erroLogin');
  const inputSenhaCadastro = document.querySelector('.senhaCadastro');
  const inputSegundaSenhaCadastro = document.querySelector(
    '.segundaSenhaCadastro'
  );
  const inputSenhaLogin = document.querySelector('.senha');
  const inputNome = document.querySelector('.nomeCadastro');

  inputSenhaCadastro.classList.remove('bordaVermelha');
  inputSegundaSenhaCadastro.classList.remove('bordaVermelha');
  inputSenhaLogin.classList.remove('bordaVermelha');
  inputNome.classList.remove('bordaVermelha');
  erroCadastro.classList.add('esconder');
  erroLogin.classList.add('esconder');

  document.querySelectorAll('input').forEach((input) => {
    input.value = '';
  });
}

function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Função para renderizar as receitas
function renderizarReceitas(receitas) {
  const container = document.getElementById('grade-receitas');
  container.innerHTML = ''; // Limpa o container antes de renderizar

  Object.entries(receitas).forEach(([userId, userReceitas]) => {
    Object.entries(userReceitas).forEach(([timestamp, receita]) => {
      const card = document.createElement('div');
      card.className = 'receita-card';

      // Formata a data (opcional)
      const dataFormatada = new Date(Number(timestamp)).toLocaleDateString();

      // Conteúdo do card
      card.innerHTML = `
        <div class="receita-header">
          ${
            receita.foto
              ? `<img src="${receita.foto}" alt="${receita.titulo}" class="receita-imagem">`
              : '<div class="sem-imagem">Sem imagem</div>'
          }
          <h2>${receita.titulo}</h2>
          <span class="categoria">${receita.categoria}</span>
          <span class="tempo">⏱️ ${receita.tempoPreparo}</span>
        </div>
        <div class="receita-body">
          <h3>Ingredientes</h3>
          <p>${receita.ingredientes.replace(/\n/g, '<br>')}</p>
          <h3>Modo de Preparo</h3>
          <p>${receita.modoPreparo.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="receita-footer">
          <small>Criado em: ${dataFormatada}</small>
        </div>
      `;

      container.appendChild(card);
    });
  });
}
