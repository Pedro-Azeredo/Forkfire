'use strict';

import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  set,
  remove,
  child,
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
import Usuario from '/model/Usuario.js';
import ModelError from '/model/ModelError.js';

export default class DaoUsuario {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if (DaoUsuario.promessaConexao == null) {
      DaoUsuario.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else reject(new ModelError('Erro ao conectar ao Firebase'));
      });
    }
    return DaoUsuario.promessaConexao;
  }

  //--- Métodos CRUD ---//

  async incluir(usuario) {
    const db = await this.obterConexao();
    return new Promise((resolve, reject) => {
      const dbRef = ref(db, 'usuarios/' + usuario.getId());
      set(dbRef, {
        id: usuario.getId(),
        nome: usuario.getNome(),
        email: usuario.getEmail(),
        senha: usuario.getSenha(),
        fotoPerfil: usuario.getFotoPerfil(),
      })
        .then(() => resolve(true))
        .catch((e) => reject(new ModelError(e)));
    });
  }

  async obterPorId(id) {
    const db = await this.obterConexao();
    return new Promise((resolve) => {
      const dbRef = ref(db, 'usuarios/' + id);
      get(dbRef).then((snapshot) => {
        const data = snapshot.val();
        if (data)
          resolve(
            new Usuario(
              data.id,
              data.nome,
              data.email,
              data.senha,
              data.fotoPerfil
            )
          );
        else resolve(null);
      });
    });
  }

  async obterPorEmail(email) {
    const db = await this.obterConexao();
    return new Promise((resolve) => {
      const dbRef = ref(db, 'usuarios');
      const queryRef = query(dbRef, orderByChild('email'), equalTo(email));
      get(queryRef).then((snapshot) => {
        snapshot.forEach((child) => {
          const data = child.val();
          resolve(
            new Usuario(
              data.id,
              data.nome,
              data.email,
              data.senha,
              data.fotoPerfil
            )
          );
        });
        resolve(null);
      });
    });
  }

  async atualizar(usuario) {
    return this.incluir(usuario); // Reutiliza o método incluir para atualizar
  }

  async excluir(id) {
    const db = await this.obterConexao();
    return new Promise((resolve, reject) => {
      const dbRef = ref(db, 'usuarios/' + id);
      remove(dbRef)
        .then(() => resolve(true))
        .catch((e) => reject(new ModelError(e)));
    });
  }
}
