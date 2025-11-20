import type { State } from "./state.js";

// exploring a location area and lists unique pokemon encounters
export async function commandExplore(state: State, ...args: string[]): Promise<void> {

    // explore <areaName>
    const areaName = args[0];

    // if no areaName is provided, then return
    if (!areaName) {
        console.log(areaName)
        console.log("Unknown location");
        return;
    }

    console.log(`Exploring ${areaName}`)

    // fetching full location=area details from pokeapi
    // the fetchLocation() in pokeapi handles caching

    const location = await state.pokeAPI.fetchLocation(areaName);


    
    console.log("Found Pokemon:")
    // for all pokemon in the encounters {} object 
    for (const enc of location.pokemon_encounters) {
        console.log(`- ${enc.pokemon.name}`);
    }
    return;
}