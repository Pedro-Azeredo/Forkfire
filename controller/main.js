import AuthController from '/controller/auth/AuthController.js';
import ReceitaController from '/controller/receitas/ReceitaController.js';
import UsuarioController from '/controller/usuarios/UsuarioController.js';
import AvaliacaoController from '/controller/avaliacoes/AvaliacaoController.js';

// Elementos da DOM
const sections = {
  login: document.getElementById('login-section'),
  register: document.getElementById('register-section'),
  receitas: document.getElementById('receitas-section'),
  receitaForm: document.getElementById('receita-form-section'),
};

// Estado global
let currentUser = null;
let currentReceitaId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  checkAuthState();
});

// Verifica estado de autenticação
async function checkAuthState() {
  try {
    const user = AuthController.auth.currentUser;
    if (user) {
      currentUser = user;
      showUserInfo(user);
      showSection('receitas');
      loadReceitas();
    } else {
      showSection('login');
    }
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
  }
}

// Configura listeners
function setupEventListeners() {
  // Login
  document
    .getElementById('form-login')
    .addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const senha = document.getElementById('login-senha').value;
      try {
        await AuthController.login(email, senha);
        checkAuthState();
      } catch (error) {
        alert(error.message);
      }
    });

  // Cadastro
  document
    .getElementById('form-register')
    .addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('register-nome').value;
      const email = document.getElementById('register-email').value;
      const senha = document.getElementById('register-senha').value;
      try {
        await UsuarioController.cadastrar(nome, email, senha);
        alert('Cadastro realizado! Faça login.');
        showSection('login');
      } catch (error) {
        alert(error.message);
      }
    });

  // Logout
  document.getElementById('btn-logout').addEventListener('click', async () => {
    await AuthController.logout();
    currentUser = null;
    checkAuthState();
  });

  // Navegação
  document.getElementById('btn-show-register').addEventListener('click', () => {
    showSection('register');
  });

  document.getElementById('btn-nova-receita').addEventListener('click', () => {
    currentReceitaId = null;
    document.getElementById('receita-form-title').textContent = 'Nova Receita';
    showSection('receitaForm');
  });

  // Receitas
  document.getElementById('btn-search').addEventListener('click', async () => {
    const termo = document.getElementById('search-input').value;
    await loadReceitas(termo);
  });

  document
    .getElementById('form-receita')
    .addEventListener('submit', async (e) => {
      e.preventDefault();
      const receitaData = {
        titulo: document.getElementById('receita-titulo').value,
        ingredientes: document.getElementById('receita-ingredientes').value,
        tempoPreparo: document.getElementById('receita-tempo').value,
        modoPreparo: document.getElementById('receita-modo').value,
        categoria: document.getElementById('receita-categoria').value,
      };

      try {
        if (currentReceitaId) {
          await ReceitaController.editarReceita(currentReceitaId, receitaData);
        } else {
          await ReceitaController.criarReceita(
            receitaData.titulo,
            receitaData.ingredientes,
            receitaData.tempoPreparo,
            receitaData.modoPreparo,
            receitaData.categoria,
            ''
          );
        }
        showSection('receitas');
        loadReceitas();
      } catch (error) {
        alert(error.message);
      }
    });
}

// Carrega receitas
async function loadReceitas(termo = '') {
  const receitasList = document.getElementById('receitas-list');
  receitasList.innerHTML = '<p>Carregando...</p>';

  try {
    let receitas;
    if (termo) {
      receitas = await ReceitaController.pesquisarReceitas(termo);
    } else {
      receitas = await ReceitaController.obterTodas();
    }

    if (receitas.length === 0) {
      receitasList.innerHTML = '<p>Nenhuma receita encontrada.</p>';
      return;
    }

    receitasList.innerHTML = '';
    receitas.forEach((receita) => {
      const card = document.createElement('div');
      card.className = 'receita-card';
      card.innerHTML = `
        <h3>${receita.titulo}</h3>
        <p><strong>Categoria:</strong> ${receita.categoria}</p>
        <p><strong>Tempo:</strong> ${receita.tempoPreparo} min</p>
        <button class="btn-avaliar" data-id="${receita.id}">Avaliar</button>
        ${
          receita.usuarioId === currentUser?.uid
            ? `
          <button class="btn-editar" data-id="${receita.id}">Editar</button>
          <button class="btn-excluir" data-id="${receita.id}">Excluir</button>
        `
            : ''
        }
      `;
      receitasList.appendChild(card);
    });

    // Adiciona listeners dinâmicos
    document.querySelectorAll('.btn-editar').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        currentReceitaId = e.target.dataset.id;
        await loadReceitaParaEdicao(currentReceitaId);
        showSection('receitaForm');
      });
    });

    // Listeners para avaliação (implementar similarmente)
  } catch (error) {
    console.error('Erro ao carregar receitas:', error);
    receitasList.innerHTML = '<p>Erro ao carregar receitas.</p>';
  }
}

// Funções auxiliares
function showSection(sectionName) {
  Object.values(sections).forEach((section) => {
    section.classList.add('div-oculta');
    section.classList.remove('div-ativa');
  });
  sections[sectionName].classList.remove('div-oculta');
  sections[sectionName].classList.add('div-ativa');
}

function showUserInfo(user) {
  document.getElementById('user-info').classList.remove('hidden');
  document.getElementById('user-name').textContent =
    user.displayName || user.email;
  document.getElementById('user-photo').src =
    user.photoURL || 'default-user.png';
}
