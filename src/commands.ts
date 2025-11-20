import {commandHelp} from "./command_help.js";
import {commandExit} from "./command_exit.js";
import { commandExplore } from "./command_explore.js";
import { commandInspect } from "./command_inspect.js";
import {commandMapForward, commandMapBack} from "./command_map.js";
import { CLICommand } from "./state.js";
import { commandCatch } from "./command_catch.js";

// cli command registry
export function getCommands(): Record<string, CLICommand> {
    return {
        
        exit: {
            name: "exit",
            description: "Exits the application",
            callback: commandExit
        },
        help: {
            name: "help",
            description: "Displays help information",
            callback: commandHelp
        },
        map: {
            name: "map",
            description: "Get the next page of locations",
            callback: commandMapForward
        },
        mapb: {
            name: "mapb",
            description: "Get the previous page of locations",
            callback: commandMapBack
        },
        explore: {
            name: "explore <location_name>",
            description: "Explore locations",
            callback: commandExplore
        },
        catch: {
            name: "catch <pokemon_name>",
            description: "Catch a pokemon and add to your pokedex",
            callback: commandCatch
        },
        inspect: {
            name: "inspect <pokemon_name>",
            description: "Inspect a caught pokemon from your pokedex",
            callback: commandInspect
        }

    };
}


