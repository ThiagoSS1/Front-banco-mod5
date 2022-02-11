const api = axios.create({
  baseURL: 'https://backend-api-banco.herokuapp.com/'
  //baseURLDev: 'http://localhost:8080'
})

class User {
  constructor(name, senha, repeatPass) {
    this.name = name;
    this.password = senha;
    this.repeatPass = repeatPass;
  }
}


preencherLinha();

async function criarUsuario () {
  const form = document.getElementById("form1");
  const name = form.elements["user"].value;
  const senha = form.elements["password"].value;
  const repeatPass = form.elements["reapeat-pass"].value
  const user = new User(name, senha, repeatPass)

  await api.post(`/users`, user).then((response) => {

    alert("usuario criado com exito");

    window.location.replace("index.html");


  }).catch((error) => {
    console.error(error.response.data);
  })

}

// botao de entrar
async function login () {

  const form = document.getElementById("formlogin");
  const nome = form.elements["user"].value;
  const senha = form.elements["password"].value;

  // o sinal de interrogação verifica se o objeto pai é diferente de null, false ou undefined
  if (!!nome && !!senha) {
    await api.post(`/login`, { name: nome, password: senha }).then((response) => {
      alert("Você está logado!");

      localStorage.setItem("userId", response.data.uid);

      window.location.replace("index3.html");
    }).catch((error) => {
      console.error(error);
    })
  } else {
    alert("Erro no login ou usuário nao cadastrado");
  }
}

async function adicionarRecado () {

  const descriptionInput = document.getElementById("description").value;
  const detailsInput = document.getElementById("details").value;
  const id = localStorage.getItem("userId");

  if (!!!descriptionInput && !!!detailsInput) {
    return alert("Preencha os campos");
  } else {
    await api.post(`/messages/${id}`, { title: descriptionInput, description: detailsInput }).then((response) => {
      alert("mesagem criada com exito");
      console.log(response)
    }).catch((error) => {
      console.error(error);
    })
  }

  return preencherLinha();
}

async function preencherLinha (pos) {
  const uid = pos
  const ids = localStorage.getItem("userId")

  //Criar recados
  await api.get(`/messages/${ids}`).then((response) => {

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    for (let i = 0; i < response.data.length; i++) {

      const uid = response.data[i].uid
      console.log(uid)
      const row = tbody.insertRow();
      const ids = row.insertCell(0);
      const titles = row.insertCell(1);
      const descriptions = row.insertCell(2);
      const actions = row.insertCell(3);

      ids.innerHTML = response.data.indexOf(response.data[i]) + 1;
      titles.innerHTML = response.data[i].title;
      descriptions.innerHTML = response.data[i].description;
      actions.innerHTML = `<button onclick="editar('${uid}')" class="btn btn-primary mx-2">Editar</button><button onclick="apagarMensagem('${uid}')" class="btn btn-danger mx-2">Excluir</button>`;

    }

  })
}


async function editar (uid_message) {
  $("#exampleModalCenter").modal("show");

  const ids = localStorage.getItem("userId")

  const descriptionEdit = document.getElementById("descriptionEdit");
  const detailsEdit = document.getElementById("detailsEdit");

  let buttonSaveEdit = document.getElementById("buttonSaveEdit");

  buttonSaveEdit.addEventListener("click", async () => {
    let descriptionEdit = document.getElementById("descriptionEdit").value;
    let detailsEdit = document.getElementById("detailsEdit").value;

    if (!!!descriptionEdit && !!!detailsEdit) {
      return alert("Preencha os campos");
    } else {
      await api.put(`messages/${ids}/${uid_message}`, { title: descriptionEdit, description: detailsEdit })
        .then((response) => {

          alert("mesagem editada com exito");

        })
    }

    // editar recado

    $("#exampleModalCenter").modal("hide");
    preencherLinha();
  })
}

async function apagarMensagem (uid) {
  let id = uid
  const ids = localStorage.getItem("userId")

  await api.delete(`/messages/${ids}/${id}`).then((response) => {
    alert("Mensagem apagada com exito");
    console.log(response.data)
  }).catch((error) => {
    console.error(error);
  })
  preencherLinha();
}

function deslogar () {
  localStorage.removeItem("userId");
  window.location.replace("index.html");
}

async function verificaUsuarioLogado () {
  const id = localStorage.getItem("userId");

  if (id != null) {
    return

  }
  alert("Você precisa estar logado para acessar essa página");
  window.location.replace("index.html");
}

if (window.location.pathname.includes('index3')) {
  verificaUsuarioLogado();
}


