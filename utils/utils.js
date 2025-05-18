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

//alterna entra div login e cadastro
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

//limpa os estilos
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

//comprimir imagem
async function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400; // 400px
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
        
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // 70% qualidade
      };
    };
    reader.readAsDataURL(file);
  });
}

//converte imagem para base64
function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}