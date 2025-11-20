import type { State } from "./state.js";
// inspects a caught pokemon from the pokedex
export async function commandPokedex(state: State): Promise<void> {
    const caughtNames = Object.keys(state.caughtPokemon);
    if (caughtNames.length === 0) {
        console.log("You have not caught any Pokemon yet.");
        return;
    }
    
    console.log("Your Pokedex:");
    for (const name of caughtNames) {
        const pokemon = state.caughtPokemon[name];
        console.log(`- ${pokemon.name}`);
    }
}