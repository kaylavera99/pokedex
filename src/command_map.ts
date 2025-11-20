import type { State } from "./state.js";

// Displays the next page of locations
// uses the state's nextLocationsURL to fetch the next page
export async function commandMapForward(state: State){
    const locations = await state.pokeAPI.fetchLocations(state.nextLocationsURL);

    // Update state's next and previous URLs
    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;

    for (const loc of locations.results) {
        console.log(`${loc.name}`);
    }   
}

// Displays the previous page of locations
// uses the state's prevLocationsURL to fetch the previous page
export async function commandMapBack(state: State) {
    if (!state.prevLocationsURL) {
        throw new Error("You are on the first page.");
    }
    
    const locations = await state.pokeAPI.fetchLocations(state.prevLocationsURL);
    // Update state's next and previous URLs backwards
    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;
        

    for (const loc of locations.results) {
        console.log(`- ${loc.name}`);
    }

}

