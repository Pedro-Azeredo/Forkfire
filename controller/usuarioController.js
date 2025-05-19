const databaseRef = firebase.database().ref('usuarios');
const fotoPerfilInput = document.getElementById('fotoPerfilInput');
const userIcon = document.querySelector('.fa-user');


function updateProfileIcon(imageBase64) {
  if (userIcon.classList.contains('fa-user')) {
    userIcon.classList.remove('fa-user');
    userIcon.classList.add('user-avatar');
  }
  userIcon.style.backgroundImage = `url(${imageBase64})`;
  userIcon.style.backgroundSize = 'cover';
  userIcon.style.borderRadius = '50%';
  userIcon.style.width = '30px';
  userIcon.style.height = '30px';
  userIcon.style.display = 'inline-block';
}

fotoPerfilInput.addEventListener('change', async (e) => {
  const user = auth.currentUser;
  const file = e.target.files[0];
  if (!file) return;

  // Verificação adicional do tipo de arquivo
  if (!file.type.match('image.*')) {
    alert('Por favor, selecione apenas imagens!');
    return;
  }

  try {
    // 1. Comprime a imagem primeiro
    const compressedBase64 = await compressImage(file);
    console.log('Imagem comprimida:', compressedBase64.length);
    
    // 2. Verifica o tamanho (opcional, mas recomendado)
    if (compressedBase64.length > 200 * 1024) { // ~200KB
      alert('Imagem muito grande após compressão. Tente outra foto.');
      return;
    }

    // 4. Atualiza no banco de dados (usando a versão COMPRIMIDA)
    await databaseRef.child(user.uid).update({
      fotoPerfil: compressedBase64
    });

    // 5. Atualiza a exibição
    updateProfileIcon(compressedBase64);
    
    alert('Foto de perfil atualizada com sucesso!');
    
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    alert('Erro ao atualizar foto de perfil: ' + error.message);
  }
});

function trocarFoto() {
  fotoPerfilInput.click();
}