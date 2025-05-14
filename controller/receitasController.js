const receitas = document.getElementById('grade');
const receitasRef = db.ref('/receitas');
const receitaForm = document.getElementById('receitaForm');

function cadastrarReceita() {
  let base64String = null;

  document
    .getElementById('imagem')
    .addEventListener('change', async (event) => {
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

  receitaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

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
}

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

buscarReceitas();
