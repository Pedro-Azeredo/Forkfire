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
import Avaliacao from '/model/Avaliacao.js';
import ModelError from '/model/ModelError.js';

export default class DaoAvaliacao {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if (DaoAvaliacao.promessaConexao == null) {
      DaoAvaliacao.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else reject(new ModelError('Erro ao conectar ao Firebase'));
      });
    }
    return DaoAvaliacao.promessaConexao;
  }

  //--- Métodos CRUD ---//

  async incluir(avaliacao) {
    const db = await this.obterConexao();
    return new Promise((resolve, reject) => {
      const dbRef = ref(db, 'avaliacoes');
      const novaRef = push(dbRef);
      set(novaRef, {
        id: novaRef.key,
        nota: avaliacao.getNota(),
        dataAvaliacao: avaliacao.getDataAvaliacao(),
        usuarioId: avaliacao.getUsuarioId(),
        receitaId: avaliacao.getReceitaId(),
      })
        .then(() => resolve(novaRef.key))
        .catch((e) => reject(new ModelError(e)));
    });
  }

  async obterPorReceita(receitaId) {
    const db = await this.obterConexao();
    return new Promise((resolve) => {
      const dbRef = ref(db, 'avaliacoes');
      const queryRef = query(
        dbRef,
        orderByChild('receitaId'),
        equalTo(receitaId)
      );
      get(queryRef).then((snapshot) => {
        const avaliacoes = [];
        snapshot.forEach((child) => {
          const data = child.val();
          avaliacoes.push(
            new Avaliacao(
              data.id,
              data.nota,
              data.dataAvaliacao,
              data.usuarioId,
              data.receitaId
            )
          );
        });
        resolve(avaliacoes);
      });
    });
  }

  async calcularMediaReceita(receitaId) {
    const avaliacoes = await this.obterPorReceita(receitaId);
    if (avaliacoes.length === 0) return 0;
    const soma = avaliacoes.reduce((total, av) => total + av.getNota(), 0);
    return soma / avaliacoes.length;
  }

  async excluir(id) {
    const db = await this.obterConexao();
    return new Promise((resolve, reject) => {
      const dbRef = ref(db, 'avaliacoes/' + id);
      remove(dbRef)
        .then(() => resolve(true))
        .catch((e) => reject(new ModelError(e)));
    });
  }
}
