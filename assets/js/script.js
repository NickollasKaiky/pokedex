const busca = document.querySelector(".busca");
const mostrar = busca.querySelector("input");
const tipos = document.querySelector(".tipos");
const botaoShiny = document.querySelector(".shiny");
const imagem = document.querySelector(".imgPokemon");

let normal = "";
let shiny = "";

botaoShiny.addEventListener("click", function () {
  if (imagem.src === normal) {
    imagem.src = shiny;
    botaoShiny.textContent = "Normal";
  } else {
    imagem.src = normal;
    botaoShiny.textContent = "Shiny";
  }
});
busca.addEventListener("submit", async function (evento) { // -> async serve para transformar a função em uma função assícrona //
  evento.preventDefault(); // -> server para não atualizar a pagina. //

  let nomeDigitado = mostrar.value.toLowerCase(); // -> toLowerCase serve para transformar toda a string em minuscula
  let resposta = await fetch(
    "https://pokeapi.co/api/v2/pokemon/" + nomeDigitado,
  ); // -> await serve para pausar a função async ate que o fetch seja resolvido //

  if (resposta.ok == false) {
    document.querySelector(".erro").textContent = ("Não foi possivel encontrar esse Pokemon!!");
    document.querySelector(".tente").textContent = ("Tente novamente");
    return;
  }
  document.querySelector(".erro").textContent = "";
  document.querySelector(".tente").textContent = "";
  let pokemon = await resposta.json();
  document.querySelector(".info-top h2").textContent = pokemon.name;
  document.querySelector(".numero").textContent = "#" + pokemon.id;
  normal = pokemon.sprites.other["official-artwork"].front_default;
  shiny = pokemon.sprites.other["official-artwork"].front_shiny;

  imagem.src = normal;
  botaoShiny.textContent = "Shiny";


  tipos.replaceChildren(); // -> replaceChildren serve para esvaziar os elementos do tipo //
  pokemon.types.forEach((item) => { // -> forEach serve para percorrer os elementos(tipos) do array //
    const nomeTipo = item.type.name;

    const span = document.createElement("span"); // -> createElement serve para criar um elemento(span) //
    span.classList.add("tipo", nomeTipo);
    span.textContent = nomeTipo;

    tipos.appendChild(span); // ->appendChild serve para adicionar um novo elemento(span) no final da lista de filhos de um elemento pai
  });

  const tipo = pokemon.types[0].type.name;
  const carta = document.querySelector(".carta");

  carta.className = "container carta " + tipo;

  let medidas = document.querySelectorAll(".medidas p");
  medidas[0].textContent = pokemon.height / 10 + " m"; // -> metros //
  medidas[1].textContent = pokemon.weight / 10 + " kg"; // -> kilogramas //

  let stats = document.querySelectorAll(".stat");
  stats[0].querySelector("b").textContent = pokemon.stats[0].base_stat; // -> HP //
  stats[1].querySelector("b").textContent = pokemon.stats[1].base_stat; // -> Ataque //
  stats[2].querySelector("b").textContent = pokemon.stats[2].base_stat; // -> Defesa //
  stats[3].querySelector("b").textContent = pokemon.stats[5].base_stat; // -> Velocidade //

  document.querySelector(".hp").style.width = pokemon.stats[0].base_stat + "%";
  document.querySelector(".ataque").style.width =
    pokemon.stats[1].base_stat + "%";
  document.querySelector(".defesa").style.width =
    pokemon.stats[2].base_stat + "%";
  document.querySelector(".velocidade").style.width =
    pokemon.stats[5].base_stat + "%";

  document.querySelector(".imgPokebola").id = "mostrar";
});