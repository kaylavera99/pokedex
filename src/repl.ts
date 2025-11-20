import { State } from "./state";

// Starts the repl for cli / user interaction
// reads input, parses commands, pass to command registry
export async function startREPL(state: State) {
    state.rl.prompt();
    state.rl.on("line", async (input) => {        
        const words = cleanInput(input);
        if (words.length === 0) {
            state.rl.prompt();
            return;
        }
        const commandName = words[0];
        const cmd = state.commands[commandName];

        //new arguments for explore function
        const args = words.slice(1);

        // ignore unknown commands and reprompt
        if (!cmd) {
            console.log(`Unknown command: "${commandName}". Type "help" for a list of commands.`);
            state.rl.prompt();
        return;
        }
        try {
            // all command callbacks are async; receive current state
            await cmd.callback(state, ...args);
        } catch (error) {
            console.log((error as Error).message);
        }
        
        state.rl.prompt();
        }
    );
}
// normalize and clean user input into array of words
export function cleanInput(input: string): string[] { 
return input
    .toLowerCase()
    .trim()
    .split(" ")
    .filter((word) => word !== "");
}
