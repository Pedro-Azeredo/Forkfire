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
  push,
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
import Receita from '/model/Receita.js';
import ModelError from '/model/ModelError.js';

export default class DaoReceita {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if (DaoReceita.promessaConexao == null) {
      DaoReceita.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else reject(new ModelError('Erro ao conectar ao Firebase'));
      });
    }
    return DaoReceita.promessaConexao;
  }

  //--- Métodos CRUD ---//

  async incluir(receita) {
    const db = await this.obterConexao();
    return new Promise((resolve, reject) => {
      const dbRef = ref(db, 'receitas');
      const novaRef = push(dbRef);
      set(novaRef, {
        id: novaRef.key,
        titulo: receita.getTitulo(),
        ingredientes: receita.getIngredientes(),
        tempoPreparo: receita.getTempoPreparo(),
        modoPreparo: receita.getModoPreparo(),
        categoria: receita.getCategoria(),
        foto: receita.getFoto(),
        usuarioId: receita.getUsuarioId(), // Adicione se houver relação com usuário
      })
        .then(() => resolve(novaRef.key))
        .catch((e) => reject(new ModelError(e)));
    });
  }

  async obterPorId(id) {
    const db = await this.obterConexao();
    return new Promise((resolve) => {
      const dbRef = ref(db, 'receitas/' + id);
      get(dbRef).then((snapshot) => {
        const data = snapshot.val();
        if (data)
          resolve(
            new Receita(
              data.id,
              data.titulo,
              data.ingredientes,
              data.tempoPreparo,
              data.modoPreparo,
              data.categoria,
              data.foto
            )
          );
        else resolve(null);
      });
    });
  }

  async obterTodas() {
    const db = await this.obterConexao();
    return new Promise((resolve) => {
      const dbRef = ref(db, 'receitas');
      get(dbRef).then((snapshot) => {
        const receitas = [];
        snapshot.forEach((child) => {
          const data = child.val();
          receitas.push(
            new Receita(
              data.id,
              data.titulo,
              data.ingredientes,
              data.tempoPreparo,
              data.modoPreparo,
              data.categoria,
              data.foto
            )
          );
        });
        resolve(receitas);
      });
    });
  }

  async atualizar(receita) {
    const db = await this.obterConexao();
    return new Promise((resolve, reject) => {
      const dbRef = ref(db, 'receitas/' + receita.getId());
      set(dbRef, {
        id: receita.getId(),
        titulo: receita.getTitulo(),
        ingredientes: receita.getIngredientes(),
        tempoPreparo: receita.getTempoPreparo(),
        modoPreparo: receita.getModoPreparo(),
        categoria: receita.getCategoria(),
        foto: receita.getFoto(),
      })
        .then(() => resolve(true))
        .catch((e) => reject(new ModelError(e)));
    });
  }

  async excluir(id) {
    const db = await this.obterConexao();
    return new Promise((resolve, reject) => {
      const dbRef = ref(db, 'receitas/' + id);
      remove(dbRef)
        .then(() => resolve(true))
        .catch((e) => reject(new ModelError(e)));
    });
  }
}
