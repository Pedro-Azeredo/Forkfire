
function obterEstrela(event) {
  const stars = document.querySelectorAll('.star-icon');
  const clickedStar = event.currentTarget;
  estrelas = clickedStar.getAttribute('data-avaliacao');
  
  // Remove a classe 'ativo' de todas as estrelas
  stars.forEach(star => star.classList.remove('ativo'));
  
  // Adiciona a classe 'ativo' até a estrela clicada
  let shouldActivate = false;
  stars.forEach(star => {
    if (star === clickedStar) shouldActivate = true;
    if (shouldActivate) star.classList.add('ativo');
  });
}

async function enviarAvaliacao() {
    try {
        // obtem o usuario logado
        const user = firebase.auth().currentUser;
        // Obtém a receita atualmente sendo visualizada
        const receitaAtual = window.currentRecipe;
        
        if (!receitaAtual) {
            alert('Nenhuma receita selecionada para avaliação');
            return;
        }

        const comentario = document.querySelector('.comentario').value.trim();
        const estrelaAtiva = document.querySelector('.avaliacao .ativo');
        let dataHora = Date.now();
        
        if (!estrelaAtiva) {
            alert('Por favor, selecione uma avaliação com as estrelas');
            return;
        }
        
        const avaliacao = Number(estrelaAtiva.getAttribute('data-avaliacao'));
        
        if (!comentario) {
            alert('Por favor, escreva um comentário');
            return;
        }

        try {
            const novaAvaliacaoRef = db.ref(`avaliacoes/${user.uid}/${dataHora}`);

            await novaAvaliacaoRef.set({
                nota: avaliacao,
                dataAvaliacao: dataHora,
                criadoPor: user.uid,
                receitaId: `${receitaAtual.dataCriacao}`,
                comentario: comentario,
            });

            console.log('Avaliação enviada com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar avaliação:', error);
        }
        
        //limpeza do formulário
        document.querySelector('.comentario').value = '';
        document.querySelectorAll('.star-icon.ativo').forEach(star => {
            star.classList.remove('ativo');
        });
        
        // Recarrega as avaliações
        carregarAvaliacoes(receitaAtual);

    } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        alert('Ocorreu um erro ao enviar sua avaliação: ' + error.message);
    }
}

// Função para atualizar a média de avaliações da receita
// async function atualizarMediaReceita(receita, novaAvaliacao) {
//     const avaliacoesRef = db.ref('avaliacoes').orderByChild('receitaId').equalTo(`${receita.criadoPor}/${receita.dataCriacao}`);
//     const snapshot = await avaliacoesRef.once('value');
    
//     let total = 0;
//     let count = 0;
    
//     snapshot.forEach(childSnapshot => {
//         const avaliacao = childSnapshot.val();
//         total += avaliacao.avaliacao;
//         count++;
//     });
    
//     const media = count > 0 ? (total / count) : 0;
    
//     // Atualiza a receita no Firebase
//     await db.ref(`receitas/${receita.criadoPor}/${receita.dataCriacao}`).update({
//         avaliacaoMedia: media.toFixed(1),
//         totalAvaliacoes: count
//     });
// }

// Função para carregar as avaliações existentes
function carregarAvaliacoes(receita) {
    const listaAvaliacoes = document.getElementById('listaAvaliacoes');
    listaAvaliacoes.innerHTML = '<p>Carregando avaliações...</p>';
    
    // Busca todas as avaliações e filtra as que pertencem a esta receita
    const avaliacoesRef = db.ref('avaliacoes');
    
    avaliacoesRef.on('value', (snapshot) => {
        listaAvaliacoes.innerHTML = '';
        const avaliacoes = snapshot.val();
        
        if (!avaliacoes) {
            listaAvaliacoes.innerHTML = '<p>Nenhuma avaliação ainda.</p>';
            return;
        }

        let encontrouAvaliacoes = false;
        
        // Percorre todos os usuários que fizeram avaliações
        Object.keys(avaliacoes).forEach(usuarioId => {
            // Percorre todas as avaliações deste usuário
            Object.keys(avaliacoes[usuarioId]).forEach(timestamp => {
                const avaliacao = avaliacoes[usuarioId][timestamp];
                
                // Verifica se a avaliação é para esta receita
                if (avaliacao.receitaId === receita.dataCriacao.toString()) {
                    encontrouAvaliacoes = true;
                    
                    const li = document.createElement('li');
                    li.className = 'avaliacao-item';
                    
                    // Busca o nome do usuário (se disponível)
                    db.ref(`usuarios/${usuarioId}`).once('value').then(userSnapshot => {
                        const usuario = userSnapshot.val();
                        const nomeUsuario = usuario ? usuario.nome : 'Anônimo';
                        
                        li.innerHTML = `
                            <div class="avaliacao-contorno">
                            <div class="avaliacao-header">
                                <img class="perfilAvaliacao" src="${usuario ? usuario.fotoPerfil : 'imagens/anonimo.png'}" alt="Foto de perfil" class="avaliacao-foto">
                                <span class="avaliacao-nome">${nomeUsuario}</span>
                                <span class="avaliacao-data">${new Date(Number(avaliacao.dataAvaliacao)).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div class="avaliacao-estrelas">
                                ${'★'.repeat(avaliacao.nota)}${'☆'.repeat(5 - avaliacao.nota)}
                            </div>
                            <div class="avaliacao-comentario">${avaliacao.comentario}</div>
                            </div>
                        `;
                    });
                    
                    listaAvaliacoes.appendChild(li);
                }
            });
        });
        
        if (!encontrouAvaliacoes) {
            listaAvaliacoes.innerHTML = '<p>Nenhuma avaliação ainda.</p>';
        }
    });
}