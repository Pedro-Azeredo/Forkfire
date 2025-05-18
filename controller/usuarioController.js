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
  const file = e.target.files[0];
  if (!file) return;

  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      console.log('Usuário não está logado');
      return;
    }

    const base64Image = await convertImageToBase64(file);
    

    await databaseRef.child(user.uid).update({
      fotoPerfil: base64Image
    });
    

    updateProfileIcon(base64Image);
    
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    alert('Erro ao atualizar foto de perfil: ' + error.message);
  }
});

function trocarFoto() {
  fotoPerfilInput.click();
}