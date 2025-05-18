const receitas = document.getElementById('grade-receitas');
const receitasRef = db.ref('/receitas');
const receitaForm = document.getElementById('receitaForm');
let base64String = null;


// Event listener para o input de imagem
document.getElementById('imagem').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      base64String = await convertImageToBase64(file);
      console.log('Imagem convertida com sucesso');
    } catch (error) {
      console.error('Erro ao converter imagem:', error);
    }
  }
});

// Função para cadastrar nova receita
receitaForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = firebase.auth().currentUser;

  let titulo = document.getElementById('titulo').value;
  let ingredientes = document.getElementById('ingredientes').value;
  let categoria = document.getElementById('categoria').value;
  let modoPreparo = document.getElementById('modoPreparo').value;
  let tempoPreparo = document.getElementById('tempoPreparo').value;
  let dataHora = Date.now();

  try {
    const novaReceitaRef = db.ref(`receitas/${user.uid}/${dataHora}`);

    await novaReceitaRef.set({
      titulo: titulo,
      ingredientes: ingredientes,
      categoria: categoria,
      modoPreparo: modoPreparo,
      tempoPreparo: tempoPreparo,
      foto: base64String,
      criadoPor: user.uid,
      dataCriacao: dataHora,
    });

    console.log('Receita salva com sucesso!');
    receitaForm.reset();
    base64String = null;
  } catch (error) {
    console.error('Erro ao salvar receita:', error);
  }
});

// Função para buscar todas as receitas
function buscarReceitas() {
  const receitasRef = db.ref('receitas');

  receitasRef.on(
    'value',
    (snapshot) => {
      const receitasData = snapshot.val();

      if (receitasData) {
        renderizarReceitas(receitasData);
      } else {
        document.getElementById('grade-receitas').innerHTML =
          '<p class="sem-receitas">Nenhuma receita encontrada.</p>';
      }
    },
    (error) => {
      console.error('Erro ao buscar receitas:', error);
      document.getElementById('grade-receitas').innerHTML =
        '<p class="erro-receitas">Ocorreu um erro ao carregar as receitas.</p>';
    }
  );
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
        <div class="receita-image">
          ${receita.foto ? `<img src="${receita.foto}" alt="${receita.titulo}" class="receita-imagem">` : '<div class="sem-imagem">Sem imagem</div>'}
        </div>
        <div class="receita-text">
          <h2>${receita.titulo}</h2>
          <div class="receita-tempo">
            <span class="tempo">${receita.tempoPreparo} min</span>
          </div>
          <div class="receita-categoria">
            <span class="categoria">${receita.categoria}</span>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  });
}

// Inicialização
buscarReceitas();
