import ModelError from '/model/ModelError.js';

export default class Avaliacao {
  constructor(id, nota, dataAvaliacao, usuarioId, receitaId) {
    this.setId(id);
    this.setNota(nota);
    this.setDataAvaliacao(dataAvaliacao);
    this.setUsuarioId(usuarioId);
    this.setReceitaId(receitaId);
  }

  getId() {
    return this.id;
  }

  setId(id) {
    Avaliacao.validarId(id);
    this.id = id;
  }

  getNota() {
    return this.nota;
  }

  setNota(nota) {
    Avaliacao.validarNota(nota);
    this.nota = nota;
  }

  getDataAvaliacao() {
    return this.dataAvaliacao;
  }

  setDataAvaliacao(dataAvaliacao) {
    Avaliacao.validarDataAvaliacao(dataAvaliacao);
    this.dataAvaliacao = dataAvaliacao;
  }

  getUsuarioId() {
    return this.usuarioId;
  }

  setUsuarioId(usuarioId) {
    Avaliacao.validarUsuarioId(usuarioId);
    this.usuarioId = usuarioId;
  }

  getReceitaId() {
    return this.receitaId;
  }

  setReceitaId(receitaId) {
    Avaliacao.validarReceitaId(receitaId);
    this.receitaId = receitaId;
  }

  static validarId(id) {
    if (id == null || id == '' || id == undefined)
      throw new ModelError('O ID da avaliação não pode ser nulo!');
  }

  static validarNota(nota) {
    if (nota == null || nota == undefined)
      throw new ModelError('A nota não pode ser nula!');
    if (isNaN(nota) || nota < 0 || nota > 5)
      throw new ModelError('A nota deve ser um número entre 0 e 5!');
  }

  static validarDataAvaliacao(dataAvaliacao) {
    if (
      dataAvaliacao == null ||
      dataAvaliacao == '' ||
      dataAvaliacao == undefined
    )
      throw new ModelError('A data da avaliação não pode ser nula!');
    // Pode adicionar validação de formato de data aqui
  }

  static validarUsuarioId(usuarioId) {
    if (usuarioId == null || usuarioId == '' || usuarioId == undefined)
      throw new ModelError('O ID do usuário não pode ser nulo!');
  }

  static validarReceitaId(receitaId) {
    if (receitaId == null || receitaId == '' || receitaId == undefined)
      throw new ModelError('O ID da receita não pode ser nulo!');
  }
}
