import { State } from "./state";


export async function commandInspect(state: State, ...args: string[]) {
    // if no pokemon name is provided, throw an error
    if (args.length !== 1) {
        throw new Error("you must provide a pokemon name to inspect");
    }
    
    const name = args[0];
    const pokemon = state.caughtPokemon[name];
    
    // if pokemon is not found in caughtPokemon state, notify user
    if (!pokemon) {
        console.log(`${name} is not in your Pokedex. Catch it first!`);
        return;
    }
    // display pokemon details
    console.log(`Name: ${pokemon.name}`);
    console.log(`Height: ${pokemon.height}`);
    console.log(`Weight: ${pokemon.weight}`);
    console.log(`Stats:`);
    // loop for listing stats
    for (const statInfo of pokemon.stats) {
        console.log(`- ${statInfo.stat.name}: ${statInfo.base_stat}`);
    }
    // loop for listing types
    console.log("Types:");
    for (const typeInfo of pokemon.types) {
        console.log(`- ${typeInfo.type.name}`);
    }
}