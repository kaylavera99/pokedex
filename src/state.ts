import {createInterface, type Interface} from "readline";
import { getCommands } from "./commands.js";
import { PokeAPI } from "./pokeapi.js";


// shared state object passed to commands and repl
export interface State {
    rl: Interface;
    commands: Record<string,CLICommand>;
    pokeAPI: PokeAPI;
    nextLocationsURL: string;
    prevLocationsURL: string;

};

// common structure for CLI commands
export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State, ...args: string[]) => Promise<void>
};

// initialize and return new State object
// loads command registry, pokeapi client, readline interface
export function initState(cacheInterval: number): State {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "pokedex > "
    });


    return {
        rl, 
        commands: getCommands(),
        pokeAPI: new PokeAPI(cacheInterval),
        nextLocationsURL: "",
        prevLocationsURL: "",
        
    };
}



