import type { State } from "./state.js";

export async function commandCatch(state: State, ...args: string[]) {
// If no pokemon name is provided, throw an error
  if (args.length !== 1) {
    throw new Error("you must provide a pokemon name");
  }

  const name = args[0];
  const pokemon = await state.pokeAPI.fetchPokemon(name);

  console.log(`Throwing a Pokeball at ${pokemon.name}...`);

  //  catch logic based on base_experience and randomness
  const res = Math.floor(Math.random() * pokemon.base_experience);
  if (res > 40) {
    console.log(`${pokemon.name} escaped!`);
    return;
  }

  console.log(`${pokemon.name} was caught!`);
  console.log("You may now inspect it with the inspect command.");
  // Add caught pokemon to caughtPokemon state (pokedex)
  state.caughtPokemon[pokemon.name] = pokemon;
}
