document.addEventListener("DOMContentLoaded", async () => {
  const tokenLocal = localStorage.getItem("token");
  const tokenSession = sessionStorage.getItem("token");

  if (!tokenLocal && !tokenSession) {
    window.location.href = "../index.html";
    return;
  }

  const resposta = await getRecados();

  renderizarPaginacao(resposta.totalPaginas);
  montarColunasCard(resposta.listaDeRecados);

  const botoesExcluir = document.querySelectorAll(".btn-excluir");

  for (const botao of botoesExcluir) {
    botao.addEventListener("click", async (event) => {
      const btnDeExcluir = event.target;
      const bodyCard = btnDeExcluir.parentElement;

      if (bodyCard) {
        const idRecado = bodyCard.id;
        console.log(idRecado);
        await delRecados(idRecado);
        window.location.reload();
      }
    });
  }

  const botoesEditar = document.querySelectorAll(".btn-editar");

  for (const botao of botoesEditar) {
    botao.addEventListener("click", (event) => {
      const btnDeEditar = event.target;
      const bodyCard = btnDeEditar.parentElement;

      if (bodyCard) {
        const idRecado = bodyCard.id;

        const formEditar = document.getElementById("editar-recado-form");

        formEditar.addEventListener("submit", async (event) => {
            event.preventDefault();

          const tituloEditado = document.getElementById(
            "editar-recados-titulo"
          ).value;
          const descricaoEditado = document.getElementById(
            "editar-recados-descricao"
          ).value;

          const data = {
            titulo: tituloEditado,
            descricao: descricaoEditado,
          };

          await putRecados(data, idRecado);
        window.location.reload()

        });
      }
    });
  }
});

const formRecados = document.getElementById("adicionar-recado-form");

const spaceCards = document.getElementById("space-cards");

formRecados.addEventListener("submit", async (event) => {
  event.preventDefault();

  const tituloRecado = document.getElementById("recados-titulo").value;
  const descricaoRecado = document.getElementById("recados-descricao").value;

  const data = {
    titulo: tituloRecado,
    descricao: descricaoRecado,
  };

  await postRecados(data);
  window.location.reload();
});

async function postRecados(data) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await apiConfig.post("/recados", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getRecados(pagina = 1) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await apiConfig.get("/recados", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        pagina: pagina,
      },
    });

    const dataAPI = {
      listaDeRecados: response.data.dados,
      totalPaginas: response.data.totalPaginas,
    };
    return dataAPI;
  } catch (error) {
    console.log(error);
  }
}

async function delRecados(idRecado) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await apiConfig.delete(`recados/delete/${idRecado}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function putRecados(data, idRecado) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await apiConfig.put(`recados/${idRecado}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function montarColunasCard(listaRecados) {
  spaceCards.innerHTML = "";

  for (const recado of listaRecados) {
    const newCol = document.createElement("div");
    newCol.setAttribute("class", "col-12 g-5");

    const newCard = document.createElement("div");
    newCard.setAttribute("style", "width: 100%");

    const newCardBody = document.createElement("div");
    newCardBody.setAttribute(
      "class",
      "card-body border-bottom border-primary border-opacity-50 p-2 pb-5 mw-100 text-break"
    );
    newCardBody.setAttribute("id", `${recado.id}`);

    const newBtnExcluir = document.createElement("button");
    newBtnExcluir.setAttribute("type", "button");
    newBtnExcluir.setAttribute("class", "btn btn-danger btn-excluir");
    newBtnExcluir.innerText = "Excluir";

    const newBtnEditar = document.createElement("button");
    newBtnEditar.setAttribute("type", "button");
    newBtnEditar.setAttribute("class", "btn btn-secondary ms-3 btn-editar");
    newBtnEditar.setAttribute("data-bs-toggle", "modal");
    newBtnEditar.setAttribute("data-bs-target", "#modalEditar");
    newBtnEditar.innerHTML = '<i class="bi bi-pencil"></i> Editar';

    newCardBody.innerHTML += `
          <h5 class="card-title fs-2">
            ${recado.titulo}
          </h5>
        `;

    newCardBody.innerHTML += `
          <p class="card-text fw-light">
            ${recado.descricao}
          </p>
        `;

    newCardBody.appendChild(newBtnExcluir);
    newCardBody.appendChild(newBtnEditar);

    newCard.appendChild(newCardBody);
    newCol.appendChild(newCard);

    spaceCards.appendChild(newCol);
  }
}

function renderizarPaginacao(response) {
  const paginacao = document.getElementById("pagination-container");

  for (let i = 1; i <= response; i++) {
    const btn = document.createElement("li");
    btn.innerHTML = `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`;

    btn.addEventListener("click", async () => {
      const resposta = await getRecados(i);
      montarColunasCard(resposta.listaDeRecados);
    });

    paginacao.appendChild(btn);
  }
}
