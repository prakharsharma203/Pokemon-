const typeFilter = document.getElementById("type-filter");
const filterButton = document.getElementById("filter-button");
const resetButton = document.getElementById("reset-button");
const searchInput = document.getElementById("search-input");
const pokedex = document.getElementById("pokedex");

let pokemonsData = [];

// Function to fetch Pokémon data from the API
async function fetchPokemonData() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    const pokemons = data.results;
    for (const pokemon of pokemons) {
      const pokemonData = await fetch(pokemon.url).then((res) => res.json());
      pokemonsData.push(pokemonData);
    }
    createPokemonCards(pokemonsData);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

// Function to create Pokémon cards
pokedex.innerHTML = "";
function createPokemonCards(pokemons) {
  pokemons.forEach((pokemon, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Add a class for the Pokémon's type
    const types = pokemon.types.map((type) => type.type.name);
    types.forEach((type) => {
      card.classList.add(type);
    });

    // Front and Back of the card
    const front = document.createElement("div");
    front.classList.add("front");

    const back = document.createElement("div");
    back.classList.add("back");

    // Common content for both front and back
    const cardNumber = document.createElement("div");
    cardNumber.classList.add("card-number");
    cardNumber.textContent = `#${index + 1}`;

    const nameAndImage = document.createElement("div");
    nameAndImage.classList.add("name-and-image");

    const name = document.createElement("h3");
    name.textContent = pokemon.name;

    const image = document.createElement("img");
    image.src = pokemon.sprites.front_default;
    image.alt = pokemon.name;

    const type = document.createElement("p");
    type.textContent = types.join(", ");
    type.style.backgroundColor ="black";
    // type.style.opacity ="0.9";
    type.style.color ="white";
    type.style.padding ="15px 10px";
    type.style.borderRadius ="7px";
    // type.style.border ="1px dashed white";
    type.style.textTransform="uppercase" ;
    
    nameAndImage.appendChild(name);
    nameAndImage.appendChild(image);
    nameAndImage.appendChild(type);

    front.appendChild(cardNumber);
    front.appendChild(nameAndImage);

    // Back content
    const abilities = document.createElement("div");
    abilities.classList.add("abilities");

    const abilitiesTitle = document.createElement("h3");
    abilitiesTitle.textContent = "Abilities";

    const abilitiesList = document.createElement("ul");
    pokemon.abilities.forEach((ability) => {
      const abilityItem = document.createElement("li");
      abilityItem.textContent = ability.ability.name;
      abilitiesList.appendChild(abilityItem);
    });

    const imageBack = document.createElement("img");
    imageBack.src = pokemon.sprites.back_default;
    imageBack.alt = pokemon.name;

    abilities.appendChild(abilitiesTitle);
    abilities.appendChild(abilitiesList);
    abilities.appendChild(imageBack);

    back.appendChild(abilities);

    card.appendChild(front);
    card.appendChild(back);

    pokedex.appendChild(card);
  });
}

// Function to handle type filtering
filterButton.addEventListener("click", () => {
  const selectedType = typeFilter.value.toLowerCase();

  if (selectedType === "all") {
    createPokemonCards(pokemonsData);
  } else {
    const filtered = pokemonsData.filter((pokemon) =>
      pokemon.types.some((type) => type.type.name === selectedType)
    );
    createPokemonCards(filtered);
  }
});

// Function to reset filters
resetButton.addEventListener("click", () => {
  typeFilter.value = "all";
  createPokemonCards(pokemonsData);
  searchInput.value = "";
});

// Function to handle search as you type
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const matchingPokemons = pokemonsData.filter((pokemon) =>
    pokemon.name.includes(searchTerm)
  );

  if (searchTerm === "") {
    createPokemonCards(pokemonsData);
  } else {
    createPokemonCards(matchingPokemons);
  }
});

// Initialize the app
fetchPokemonData();