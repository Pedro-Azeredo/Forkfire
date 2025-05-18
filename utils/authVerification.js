const user = auth.currentUser;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    trocarNome(user);
    console.log('Usuário autenticado:', user.uid);
  } else {
    console.log('Usuário não autenticado. Redirecionando para login...');
    window.location.href = 'index.html';
  }
});

function verificarAuth() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log('Usuário autenticado:', user.uid);
    } else {
      console.log('Usuário não autenticado. Redirecionando para login...');
      window.location.href = 'index.html';
    }
  });
}

function trocarNome(user) {
  const nomeUsuario = document.querySelector('.nomeUsuario');

  if (!user || !nomeUsuario) return;

  const userRef = firebase.database().ref(`usuarios/${user.uid}/nome`);

  userRef.once('value')
    .then((snapshot) => {
      const nome = snapshot.val();
      
      if (nome) {
        const nomeCortado = nome.split(' ');
        const primeiroNome = capitalize(nomeCortado[0]); // Usando nossa função capitalize
        nomeUsuario.textContent = `Olá, ${primeiroNome}!`;
      } else {
        nomeUsuario.textContent = "Usuário";
        console.warn("Nome não encontrado no Realtime Database");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar nome:", error);
      nomeUsuario.textContent = "Erro ao carregar";
    });
}
