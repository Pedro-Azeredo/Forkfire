import DaoAvaliacao from '/model/dao/DaoAvaliacao.js';
import AuthController from '/controller/auth/AuthController.js';

export default class AvaliacaoController {
  // Adiciona avaliação (apenas usuários logados)
  static async avaliarReceita(receitaId, nota) {
    const user = AuthController.auth.currentUser;
    if (!user) throw new Error('Acesso negado');

    const daoAvaliacao = new DaoAvaliacao();
    await daoAvaliacao.incluir({
      nota,
      receitaId,
      usuarioId: user.uid,
      dataAvaliacao: new Date().toISOString(),
    });
  }

  // Remove avaliação (apenas dono ou admin)
  static async removerAvaliacao(avaliacaoId) {
    const user = AuthController.auth.currentUser;
    if (!user) throw new Error('Acesso negado');

    const daoAvaliacao = new DaoAvaliacao();
    const avaliacao = await daoAvaliacao.obterPorId(avaliacaoId);

    const isAdmin = await AuthController.isAdmin(user.uid);
    if (avaliacao.usuarioId !== user.uid && !isAdmin) {
      throw new Error('Acesso negado');
    }

    await daoAvaliacao.excluir(avaliacaoId);
  }
}
