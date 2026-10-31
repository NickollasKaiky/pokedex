const busca = document.querySelector(".busca");
const mostrar = busca.querySelector("input");
const tipos = document.querySelector(".tipos");

busca.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  let nomeDigitado = mostrar.value.toLowerCase();
  let resposta = await fetch(
    "https://pokeapi.co/api/v2/pokemon/" + nomeDigitado,
  );

  if (resposta.ok == false) {
    alert("Nao sei");
    return;
  }

  let pokemon = await resposta.json();
  document.querySelector(".info-top h2").textContent = pokemon.name;
  document.querySelector(".numero").textContent = "#" + pokemon.id;
  document.querySelector(".imgPokemon").src =
    pokemon.sprites.other["official-artwork"].front_default;
    
  tipos.replaceChildren();
  pokemon.types.forEach((item) => {
    const nomeTipo = item.type.name;

    const span = document.createElement("span");
    span.classList.add("tipo", nomeTipo);
    span.textContent = nomeTipo;

    tipos.appendChild(span);
  });

  const tipo = pokemon.types[0].type.name;
  const carta = document.querySelector(".carta");

  carta.className = "container carta " + tipo;

  let medidas = document.querySelectorAll(".medidas p");
  medidas[0].textContent = pokemon.height / 10 + " m";
  medidas[1].textContent = pokemon.weight / 10 + " kg";

  let stats = document.querySelectorAll(".stat");
  stats[0].querySelector("b").textContent = pokemon.stats[0].base_stat; // -> HP
  stats[1].querySelector("b").textContent = pokemon.stats[1].base_stat; // -> Ataque
  stats[2].querySelector("b").textContent = pokemon.stats[2].base_stat; // -> Defesa
  stats[3].querySelector("b").textContent = pokemon.stats[5].base_stat; // -> Velocidade

  document.querySelector(".hp").style.width = pokemon.stats[0].base_stat + "%";
  document.querySelector(".ataque").style.width =
    pokemon.stats[1].base_stat + "%";
  document.querySelector(".defesa").style.width =
    pokemon.stats[2].base_stat + "%";
  document.querySelector(".velocidade").style.width =
    pokemon.stats[5].base_stat + "%";

  document.querySelector(".imgPokebola").id = "mostrar";
});
