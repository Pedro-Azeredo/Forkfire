// home.js

const receitas = document.getElementById('grade');
const receitasRef = db.ref('/receitas');
const receitaForm = document.getElementById('receitaForm');
const user = auth.currentUser;



firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("Usuário autenticado:", user.uid);

        receitaForm.addEventListener('submit', e => {
            e.preventDefault();

            let titulo = document.getElementById('titulo').value;
            let ingredientes = document.getElementById('ingredientes').value;
            let categoria = document.getElementById('categoria').value;
            let modoPreparo = document.getElementById('modoPreparo').value;
            let tempoPreparo = document.getElementById('tempoPreparo').value;
            let foto = document.getElementById('foto');
            let dataHora = Date.now();

            const novaReceitaRef = db.ref(`receitas/${user.uid}/${dataHora}`);

            novaReceitaRef.set({
                titulo: titulo,
                ingredientes: ingredientes,
                categoria: categoria,
                modoPreparo: modoPreparo,
                tempoPreparo: tempoPreparo,
                foto: foto || null,
                criadoPor: user.uid
            }).then(() => {
                console.log("Receita salva com sucesso!");
                receitaForm.reset();
            }).catch((error) => {
                console.error("Erro ao salvar receita:", error);
            });
        });
    } else {
        console.log("Usuário não autenticado. Redirecionando para login...");
        window.location.href = "login.html";
    }
});