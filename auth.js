// auth.js

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
  const inputSegundaSenhaCadastro = document.querySelector('.segundaSenhaCadastro');
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

function logar() {
  const email = document.querySelector('.email').value;
  const senha = document.querySelector('.senha').value;
  const erroLogin = document.querySelector('.erroLogin');
  const inputSenha = document.querySelector('.senha');
  const inputEmail = document.querySelector('.email');

  auth
    .signInWithEmailAndPassword(email, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('Usuário logado:', user.email);

      erroLogin.textContent = 'Usuario Logado com sucesso!';
      erroLogin.classList.remove('erroVermelho', 'esconder');
      erroLogin.classList.add('erroVerde');

      setTimeout(() => {
        erroLogin.classList.remove('erroVerde');
        erroLogin.classList.add('esconder');
        erroLogin.classList.add('erroVermelho');
        limparEstiloEdado();
      }, 2000);

      window.location.href = 'home.html';
      console.log(user)
    })
    .catch((erro) => {
      console.error('Erro ao logar:', erro.code);
      if (erro.code === 'auth/missing-password') {
        erroLogin.textContent = 'Senha não pode estar vazia.';
        erroLogin.classList.remove('esconder');
        inputSenha.classList.add('bordaVermelha');
      } else if (erro.code === 'auth/invalid-credential') {
        erroLogin.textContent = 'Senha inválida.';
        erroLogin.classList.remove('esconder');
        inputSenha.classList.add('bordaVermelha');
        inputSenha.value = '';
      } else if (erro.code === 'auth/invalid-email') {
        erroLogin.textContent = 'Usuário não encontrado.';
        erroLogin.classList.remove('esconder');
        inputSenha.value = '';
        inputEmail.value = '';
      } else {
        inputSenha.classList.remove('bordaVermelha');
        erroLogin.classList.add('esconder');
        alert('Erro ao fazer login: ' + erro.message);
      }
    });
}

function cadastrar() {
  const email = document.querySelector('.emailCadastro').value;
  const senha = document.querySelector('.senhaCadastro').value;
  const nome = document.querySelector('.nomeCadastro').value;
  const segundaSenha = document.querySelector('.segundaSenhaCadastro').value;
  const erroCadastro = document.querySelector('.erroCadastro');
  const inputSenha = document.querySelector('.senhaCadastro');
  const inputSegundaSenha = document.querySelector('.segundaSenhaCadastro');
  const inputEmail = document.querySelector('.emailCadastro');
  const inputNome = document.querySelector('.nomeCadastro');

  if (senha !== segundaSenha) {
    inputSenha.classList.add('bordaVermelha');
    inputSegundaSenha.classList.add('bordaVermelha');
    erroCadastro.classList.remove('esconder');
    return;
  } else {
    inputSenha.classList.remove('bordaVermelha');
    inputSegundaSenha.classList.remove('bordaVermelha');
  }

  if (!nome) {
    erroCadastro.textContent = 'Nome não pode estar vazio.';
    erroCadastro.classList.remove('esconder');
    inputNome.classList.add('bordaVermelha');
    return;
  } else {
    inputNome.classList.remove('bordaVermelha');
  }

  auth
    .createUserWithEmailAndPassword(email, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('Usuário Cadastrado:', user.email);

      db.ref('usuarios/' + user.uid).set({
        id: user.uid,
        nome: nome,
        email: email,
        senha: senha,
        fotoPerfil: '',
        funcao: 'USUARIO',
      });

      erroCadastro.textContent = 'Cadastro realizado com sucesso!';
      erroCadastro.classList.remove('erroVermelho', 'esconder');
      erroCadastro.classList.add('erroVerde');

      setTimeout(() => {
        erroCadastro.classList.remove('erroVerde');
        erroCadastro.classList.add('erroVermelho');
        divCadastrar();
      }, 2000);
    })
    .catch((erro) => {
      console.error('Erro ao Cadastrar:', erro.code, erro.message);

      if (erro.code === 'auth/email-already-in-use') {
        erroCadastro.textContent = 'Email já está em uso.';
        erroCadastro.classList.remove('esconder');
        inputEmail.classList.add('bordaVermelha');
      } else if (erro.code === 'auth/invalid-email') {
        erroCadastro.textContent = 'Email inválido.';
        erroCadastro.classList.remove('esconder');
        inputEmail.classList.add('bordaVermelha');
      } else if (erro.code === 'auth/missing-password') {
        erroCadastro.textContent = 'Senha não pode estar vazia.';
        erroCadastro.classList.remove('esconder');
        inputSenha.classList.add('bordaVermelha');
      } else if (erro.code === 'auth/weak-password') {
        erroCadastro.textContent = 'Senha muito fraca.';
        erroCadastro.classList.remove('esconder');
        inputSenha.classList.add('bordaVermelha');
      } else {
        alert('Erro ao fazer Cadastro: ' + erro.message);
      }
    });
}
