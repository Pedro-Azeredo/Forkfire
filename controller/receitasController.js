const receitas = document.getElementById('grade-receitas');
const receitasRef = db.ref('/receitas');
const receitaForm = document.getElementById('receitaForm');
let base64String = null;


const categorias = [  
  "Aperitivos",
  "Bebidas",
  "Bolos",
  "Carnes",
  "Comida Árabe",
  "Comida Asiática",
  "Comida Mexicana",
  "Doces",
  "Gluten-Free",
  "Lactose-Free",
  "Lanches",
  "Low Carb",
  "Massas",
  "Pães e Tortas",
  "Saladas",
  "Salgados",
  "Sobremesas",
  "Sopas e Caldos",
  "Vegano",
  "Vegetariano" 
];

const selectCategoria = document.getElementById('categoria');

// Preenche o dropdown dinamicamente
categorias.forEach(categoria => {
  const option = document.createElement('option');
  option.value = categoria;
  option.textContent = categoria;
  selectCategoria.appendChild(option);
});

// Event listener para o input de imagem
document.getElementById('imagem').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Verifica se é uma imagem
  if (!file.type.match('image.*')) {
    alert('Por favor, selecione um arquivo de imagem válido (JPEG, PNG, etc.)');
    return;
  }

  try {
    
    // Comprime a imagem antes de converter para Base64
    base64String = await compressImage(file, 800, 0.6); // 800px largura, 60% qualidade
    
    console.log('Imagem comprimida e convertida. Tamanho:', Math.round(base64String.length/1024) + 'KB');
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    alert('Erro ao processar a imagem. Tente novamente.');
    base64String = null;
  } finally {
    document.getElementById('imagem-loader').style.display = 'none';
  }
});

// Função para cadastrar nova receita
receitaForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = firebase.auth().currentUser;

  let titulo = document.getElementById('titulo').value.trim();
  let ingredientes = document.getElementById('ingredientes').value.trim();
  let categoria = document.getElementById('categoria').value.trim();
  let modoPreparo = document.getElementById('modoPreparo').value.trim().replace(/\s+/g, ' ');
  let tempoPreparo = document.getElementById('tempoPreparo').value.trim();
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
  const container = document.getElementById('grade-receitas');
  const loader = document.getElementById('loader');
  
  // Mostra o loader
  loader.style.display = 'block';
  container.innerHTML = '';

  receitasRef.on(
    'value',
    (snapshot) => {
      const receitasData = snapshot.val();
      
      // Esconde o loader quando os dados chegarem
      loader.style.display = 'none';

      if (receitasData) {
        renderizarReceitas(receitasData);
      } else {
        container.innerHTML = '<p class="sem-receitas">Nenhuma receita encontrada.</p>';
      }
    },
    (error) => {
      // Esconde o loader em caso de erro também
      loader.style.display = 'none';
      console.error('Erro ao buscar receitas:', error);
      container.innerHTML = '<p class="erro-receitas">Ocorreu um erro ao carregar as receitas.</p>';
    }
  );
}

//renderiza as receitas na tela passando receota e categoria
function renderizarReceitas(receitas, categoriaDesejada = null) {
  const container = document.getElementById('grade-receitas');
  const loader = document.getElementById('loader');
  
  // Mostra o loader enquanto limpa e renderiza
  loader.style.display = 'block';
  container.innerHTML = '';

  // Usamos setTimeout para garantir que a UI tenha tempo de atualizar
  setTimeout(() => {
    let receitasEncontradas = false;
    
    Object.entries(receitas).forEach(([userId, userReceitas]) => {
      Object.entries(userReceitas).forEach(([timestamp, receita]) => {
        if (categoriaDesejada && receita.categoria !== categoriaDesejada) {
          return;
        }
        
        receitasEncontradas = true;
        const card = document.createElement('div');
        card.className = 'receita-card';
        
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
    
    // Esconde o loader após renderizar
    loader.style.display = 'none';
    
    if (!receitasEncontradas) {
      container.innerHTML = '<p class="sem-receitas">Nenhuma receita encontrada nesta categoria.</p>';
    }
  }, 100); // Pequeno delay para garantir que o loader apareça
}

// Inicialização
buscarReceitas();
