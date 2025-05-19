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
        fotoPerfil: 'data:image/octet-stream;base64,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',
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

function logOut() {
  auth
    .signOut()
    .then(() => {
      console.log('Usuário deslogado com sucesso!');
      window.location.href = 'index.html';
    })
    .catch((erro) => {
      console.error('Erro ao deslogar:', erro);
    });
}