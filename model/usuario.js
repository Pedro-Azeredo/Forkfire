import ModelError from '/model/ModelError.js';

export default class Usuario {
  constructor(id, nome, email, senha, fotoPerfil) {
    this.setId(id);
    this.setNome(nome);
    this.setEmail(email);
    this.setSenha(senha);
    this.setFotoPerfil(fotoPerfil);
  }

  getId() {
    return this.id;
  }

  setId(id) {
    Usuario.validarId(id);
    this.id = id;
  }

  getNome() {
    return this.nome;
  }

  setNome(nome) {
    Usuario.validarNome(nome);
    this.nome = nome;
  }

  getEmail() {
    return this.email;
  }

  setEmail(email) {
    Usuario.validarEmail(email);
    this.email = email;
  }

  getSenha() {
    return this.senha;
  }

  setSenha(senha) {
    Usuario.validarSenha(senha);
    this.senha = senha;
  }

  getFotoPerfil() {
    return this.fotoPerfil;
  }

  setFotoPerfil(fotoPerfil) {
    Usuario.validarFotoPerfil(fotoPerfil);
    this.fotoPerfil = fotoPerfil;
  }

  static validarId(id) {
    if (id == null || id == '' || id == undefined)
      throw new ModelError('O ID do usuário não pode ser nulo!');
  }

  static validarNome(nome) {
    if (nome == null || nome == '' || nome == undefined)
      throw new ModelError('O nome do usuário não pode ser nulo!');
    if (nome.length > 100)
      throw new ModelError('O nome do usuário deve ter até 100 caracteres!');
  }

  static validarEmail(email) {
    if (email == null || email == '' || email == undefined)
      throw new ModelError('O email do usuário não pode ser nulo!');

    const padraoEmail = /[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}/;
    if (!padraoEmail.test(email))
      throw new ModelError('O email do usuário não foi digitado corretamente!');
  }

  static validarSenha(senha) {
    if (senha == null || senha == '' || senha == undefined)
      throw new ModelError('A senha não pode ser nula!');
    if (senha.length < 6)
      throw new ModelError('A senha deve ter pelo menos 6 caracteres!');
  }

  static validarFotoPerfil(fotoPerfil) {
    // Validação básica - pode ser expandida para validar formato da foto
    if (fotoPerfil == null || fotoPerfil == undefined)
      throw new ModelError('A foto de perfil não pode ser nula!');
  }
}
