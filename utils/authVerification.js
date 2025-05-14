const user = auth.currentUser;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
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
