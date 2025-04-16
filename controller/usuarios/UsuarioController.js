import {
  getAuth,
  createUserWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import DaoUsuario from '/model/dao/DaoUsuario.js';

export default class UsuarioController {
  // Cadastro público
  static async cadastrar(nome, email, senha) {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      const daoUsuario = new DaoUsuario();
      await daoUsuario.incluir({
        id: userCredential.user.uid,
        nome,
        email,
        senha, // Na prática, armazene um hash!
        isAdmin: false, // Por padrão, não é admin
      });

      return userCredential.user.uid;
    } catch (error) {
      throw new Error('Erro no cadastro: ' + error.message);
    }
  }
}
