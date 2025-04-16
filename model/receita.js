import ModelError from '/model/ModelError.js';

export default class Receita {
  constructor(
    id,
    titulo,
    ingredientes,
    tempoPreparo,
    modoPreparo,
    categoria,
    foto
  ) {
    this.setId(id);
    this.setTitulo(titulo);
    this.setIngredientes(ingredientes);
    this.setTempoPreparo(tempoPreparo);
    this.setModoPreparo(modoPreparo);
    this.setCategoria(categoria);
    this.setFoto(foto);
  }

  getId() {
    return this.id;
  }

  setId(id) {
    Receita.validarId(id);
    this.id = id;
  }

  getTitulo() {
    return this.titulo;
  }

  setTitulo(titulo) {
    Receita.validarTitulo(titulo);
    this.titulo = titulo;
  }

  getIngredientes() {
    return this.ingredientes;
  }

  setIngredientes(ingredientes) {
    Receita.validarIngredientes(ingredientes);
    this.ingredientes = ingredientes;
  }

  getTempoPreparo() {
    return this.tempoPreparo;
  }

  setTempoPreparo(tempoPreparo) {
    Receita.validarTempoPreparo(tempoPreparo);
    this.tempoPreparo = tempoPreparo;
  }

  getModoPreparo() {
    return this.modoPreparo;
  }

  setModoPreparo(modoPreparo) {
    Receita.validarModoPreparo(modoPreparo);
    this.modoPreparo = modoPreparo;
  }

  getCategoria() {
    return this.categoria;
  }

  setCategoria(categoria) {
    Receita.validarCategoria(categoria);
    this.categoria = categoria;
  }

  getFoto() {
    return this.foto;
  }

  setFoto(foto) {
    Receita.validarFoto(foto);
    this.foto = foto;
  }

  static validarId(id) {
    if (id == null || id == '' || id == undefined)
      throw new ModelError('O ID da receita não pode ser nulo!');
  }

  static validarTitulo(titulo) {
    if (titulo == null || titulo == '' || titulo == undefined)
      throw new ModelError('O título da receita não pode ser nulo!');
    if (titulo.length > 100)
      throw new ModelError('O título da receita deve ter até 100 caracteres!');
  }

  static validarIngredientes(ingredientes) {
    if (ingredientes == null || ingredientes == '' || ingredientes == undefined)
      throw new ModelError('Os ingredientes não podem ser nulos!');
  }

  static validarTempoPreparo(tempoPreparo) {
    if (tempoPreparo == null || tempoPreparo == undefined)
      throw new ModelError('O tempo de preparo não pode ser nulo!');
    if (isNaN(tempoPreparo) || tempoPreparo <= 0)
      throw new ModelError('O tempo de preparo deve ser um número positivo!');
  }

  static validarModoPreparo(modoPreparo) {
    if (modoPreparo == null || modoPreparo == '' || modoPreparo == undefined)
      throw new ModelError('O modo de preparo não pode ser nulo!');
  }

  static validarCategoria(categoria) {
    if (categoria == null || categoria == '' || categoria == undefined)
      throw new ModelError('A categoria não pode ser nula!');
  }

  static validarFoto(foto) {
    // Validação básica - pode ser expandida para validar formato da foto
    if (foto == null || foto == undefined)
      throw new ModelError('A foto não pode ser nula!');
  }
}
