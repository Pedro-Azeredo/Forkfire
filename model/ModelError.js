export default class ModelError extends Error {
  // Construtor da Classe ModelError
  constructor(txtDeErro) {
    super(txtDeErro); // Chamando o construtor da superclasse (Error)
    console.log(txtDeErro + '\n\n' + this.stack);
  }
}
