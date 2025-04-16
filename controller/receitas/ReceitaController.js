import DaoReceita from '/model/dao/DaoReceita.js';
import ReceitaDTO from '/model/dto/ReceitaDTO.js';
import AuthController from '/controller/auth/AuthController.js';

export default class ReceitaController {
  // Cria uma nova receita (apenas usuários logados)
  static async criarReceita(
    titulo,
    ingredientes,
    tempoPreparo,
    modoPreparo,
    categoria,
    foto
  ) {
    const user = AuthController.auth.currentUser;
    if (!user) throw new Error('Acesso negado: usuário não logado');

    const daoReceita = new DaoReceita();
    const receita = {
      titulo,
      ingredientes,
      tempoPreparo,
      modoPreparo,
      categoria,
      foto,
      usuarioId: user.uid,
    };
    const id = await daoReceita.incluir(receita);
    return id;
  }

  // Edita uma receita (apenas dono ou admin)
  static async editarReceita(id, dadosAtualizados) {
    const user = AuthController.auth.currentUser;
    if (!user) throw new Error('Acesso negado');

    const daoReceita = new DaoReceita();
    const receita = await daoReceita.obterPorId(id);

    // Verifica se é dono ou admin
    const isAdmin = await AuthController.isAdmin(user.uid);
    if (receita.usuarioId !== user.uid && !isAdmin) {
      throw new Error('Acesso negado: você não é o dono desta receita');
    }

    await daoReceita.atualizar({ ...receita, ...dadosAtualizados });
    return new ReceitaDTO(await daoReceita.obterPorId(id));
  }

  // Exclui uma receita (apenas dono ou admin)
  static async excluirReceita(id) {
    const user = AuthController.auth.currentUser;
    if (!user) throw new Error('Acesso negado');

    const daoReceita = new DaoReceita();
    const receita = await daoReceita.obterPorId(id);

    const isAdmin = await AuthController.isAdmin(user.uid);
    if (receita.usuarioId !== user.uid && !isAdmin) {
      throw new Error('Acesso negado');
    }

    await daoReceita.excluir(id);
  }

  // Pesquisa receitas (todos podem acessar)
  static async pesquisarReceitas(termo) {
    const daoReceita = new DaoReceita();
    const todas = await daoReceita.obterTodas();
    return todas
      .filter(
        (receita) =>
          receita.titulo.toLowerCase().includes(termo.toLowerCase()) ||
          receita.ingredientes.toLowerCase().includes(termo.toLowerCase())
      )
      .map((r) => new ReceitaDTO(r));
  }
}
