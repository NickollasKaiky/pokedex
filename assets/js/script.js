const busca = document.querySelector(".busca");
const mostrar = busca.querySelector("input");
const resultado = document.getElementById("resultado");
const erro = document.querySelector(".erro");
const tente = document.querySelector(".tente");
const imgPokebola = document.querySelector(".imgPokebola");

busca.addEventListener("submit", async function (evento) {
  // -> async serve para transformar a função em uma função assíncrona
  evento.preventDefault(); // -> serve para não atualizar a página

  let nomeDigitado = mostrar.value.toLowerCase(); // -> transforma a string em minúscula
  let resposta = await fetch(
    "https://pokeapi.co/api/v2/pokemon/" + nomeDigitado,
  ); // -> await pausa a função até o fetch ser resolvido

  if (resposta.ok == false) {
    erro.textContent = "Não foi possivel encontrar esse Pokemon!!";
    tente.textContent = "Tente novamente";
    imgPokebola.id = ""; // fecha a pokébola de novo
    return;
  }
  erro.textContent = "";
  tente.textContent = "";

  let pokemon = await resposta.json();

  // apaga a carta e cria uma nova
  resultado.replaceChildren();

  let carta = criarCarta();
  resultado.append(carta);

  carta.querySelector(".info-top h2").textContent = pokemon.name;
  carta.querySelector(".numero").textContent = "#" + pokemon.id;

  // imagem normal e shiny
  const imagem = carta.querySelector(".imgPokemon");
  const normal = pokemon.sprites.other["official-artwork"].front_default;
  const shiny = pokemon.sprites.other["official-artwork"].front_shiny;
  imagem.src = normal;

  const botaoShiny = carta.querySelector(".shiny");
  if (shiny) {
    botaoShiny.addEventListener("click", function () {
      if (imagem.src === normal) {
        imagem.src = shiny;
        botaoShiny.textContent = "Normal";
      } else {
        imagem.src = normal;
        botaoShiny.textContent = "Shiny";
      }
    });
  } else {
    botaoShiny.remove(); // alguns pokémon não têm versão shiny
  }

  // tipos
  const tipos = carta.querySelector(".tipos");
  pokemon.types.forEach((item) => {
    // -> forEach percorre os tipos do array
    const nomeTipo = item.type.name;

    const span = document.createElement("span");
    span.classList.add("tipo", nomeTipo);
    span.textContent = nomeTipo;

    tipos.appendChild(span); // -> adiciona o span no final da lista de filhos
  });

  const tipo = pokemon.types[0].type.name;
  carta.className = "container carta " + tipo;

  let medidas = carta.querySelectorAll(".medidas p");
  medidas[0].textContent = pokemon.height / 10 + " m"; // -> metros
  medidas[1].textContent = pokemon.weight / 10 + " kg"; // -> quilogramas

  let stats = carta.querySelectorAll(".stat");
  stats[0].querySelector("b").textContent = pokemon.stats[0].base_stat; // -> HP
  stats[1].querySelector("b").textContent = pokemon.stats[1].base_stat; // -> Ataque
  stats[2].querySelector("b").textContent = pokemon.stats[2].base_stat; // -> Defesa
  stats[3].querySelector("b").textContent = pokemon.stats[5].base_stat; // -> Velocidade

  carta.querySelector(".hp").style.width = pokemon.stats[0].base_stat + "%";
  carta.querySelector(".ataque").style.width =
    pokemon.stats[1].base_stat + "%";
  carta.querySelector(".defesa").style.width =
    pokemon.stats[2].base_stat + "%";
  carta.querySelector(".velocidade").style.width =
    pokemon.stats[5].base_stat + "%";

  // termina a carta antes de mostrar para que a transição funcione
  carta.offsetHeight;

  imgPokebola.id = "mostrar";
});

// Função para criar elemento com classe e texto mais rápido
function criar(tag, classe, texto) {
  let elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto) elemento.textContent = texto;
  return elemento;
}

function criarCarta() {
  let carta = criar("div", "container carta");

  // nome e número
  let infoTop = criar("div", "info-top");
  infoTop.append(criar("h2"), criar("span", "numero"));

  // img do pokemon
  let imgPokemon = criar("img", "imgPokemon");

  // tipos
  let tipos = criar("div", "tipos");

  // medidas
  let medidas = criar("div", "medidas");
  let nomesMedidas = ["Altura", "Peso"];
  for (let i = 0; i < nomesMedidas.length; i++) {
    let bloco = criar("div");
    bloco.append(criar("p"), criar("span", "", nomesMedidas[i]));
    medidas.append(bloco);
  }

  // status
  let status = criar("section", "status");
  status.append(criar("h3", "", "Status"));

  let listaStats = [
    ["HP ", "hp"],
    ["Ataque ", "ataque"],
    ["Defesa ", "defesa"],
    ["Velocidade ", "velocidade"],
  ];
  for (let i = 0; i < listaStats.length; i++) {
    let stat = criar("div", "stat");
    let barra = criar("div", "barra");
    barra.append(criar("div", "progresso " + listaStats[i][1]));

    stat.append(criar("span", "", listaStats[i][0]), criar("b"), barra);
    status.append(stat);
  }

  // botão shiny
  let botaoShiny = criar("button", "shiny", "Shiny");
  botaoShiny.type = "button";

  carta.append(infoTop, imgPokemon, tipos, medidas, status, botaoShiny);
  return carta;
}
