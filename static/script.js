document.addEventListener("DOMContentLoaded", () => {
  carregarConfirmados();
  carregarComentarios();

  document.getElementById("comentario").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      adicionarComentario();
    }
  });
});

function confirmarPresenca() {
  fetch("/api/confirmados")
    .then(res => res.json())
    .then(data => {
      const novaQuantidade = data.quantidade + 1;
      return fetch("/api/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade: novaQuantidade })
      });
    })
    .then(() => carregarConfirmados());
}

function carregarConfirmados() {
  fetch("/api/confirmados")
    .then(res => res.json())
    .then(data => {
      document.getElementById("contador").textContent =
        `${data.quantidade} ${data.quantidade === 1 ? "pessoa confirmou" : "pessoas confirmaram"} presença.`;
    });
}

function adicionarComentario() {
  const nomeInput = document.getElementById("nome");
  const comentarioInput = document.getElementById("comentario");

  const nome = nomeInput.value.trim();
  const texto = comentarioInput.value.trim();
  if (!texto) return;

  fetch("/api/comentarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: nome || "Anônimo", texto })
  })
    .then(() => {
      comentarioInput.value = "";  // limpa comentário
      nomeInput.value = "";        // limpa nome
      carregarComentarios();       // recarrega os comentários
    });
}

function carregarComentarios() {
  fetch("/api/comentarios")
    .then(res => res.json())
    .then(comentarios => {
      const lista = document.getElementById("lista-comentarios");
      lista.innerHTML = "";
      comentarios.slice().reverse().forEach(c => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${c.nome}:</strong> ${c.texto}`;
        lista.appendChild(li);
      });
    });
}
