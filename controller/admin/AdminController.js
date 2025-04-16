import DaoUsuario from '/model/dao/DaoUsuario.js';
import DaoReceita from '/model/dao/DaoReceita.js';
import DaoAvaliacao from '/model/dao/DaoAvaliacao.js';
import AuthController from '/controller/auth/AuthController.js';

export default class AdminController {
  // Verifica privilégios antes de cada ação
  static async verificarAdmin(uid) {
    const isAdmin = await AuthController.isAdmin(uid);
    if (!isAdmin) throw new Error('Acesso restrito a administradores');
  }

  // Exclui qualquer usuário
  static async excluirUsuario(adminUid, usuarioId) {
    await this.verificarAdmin(adminUid);
    const daoUsuario = new DaoUsuario();
    await daoUsuario.excluir(usuarioId);
  }

  // Exclui qualquer receita
  static async excluirReceita(adminUid, receitaId) {
    await this.verificarAdmin(adminUid);
    const daoReceita = new DaoReceita();
    await daoReceita.excluir(receitaId);
  }

  // Exclui qualquer avaliação
  static async excluirAvaliacao(adminUid, avaliacaoId) {
    await this.verificarAdmin(adminUid);
    const daoAvaliacao = new DaoAvaliacao();
    await daoAvaliacao.excluir(avaliacaoId);
  }
}
