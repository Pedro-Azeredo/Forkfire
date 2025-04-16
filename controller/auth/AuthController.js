import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import DaoUsuario from '/model/dao/DaoUsuario.js';
import UsuarioDTO from '/model/dto/UsuarioDTO.js';

export default class AuthController {
  static auth = getAuth();

  // Login
  static async login(email, senha) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        senha
      );
      const daoUsuario = new DaoUsuario();
      const usuario = await daoUsuario.obterPorId(userCredential.user.uid);
      return new UsuarioDTO(usuario);
    } catch (error) {
      throw new Error('Falha no login: ' + error.message);
    }
  }

  // Logout
  static async logout() {
    await signOut(this.auth);
  }

  // Verifica se usuário é admin
  static async isAdmin(uid) {
    const daoUsuario = new DaoUsuario();
    const usuario = await daoUsuario.obterPorId(uid);
    return usuario && usuario.isAdmin === true;
  }
}
