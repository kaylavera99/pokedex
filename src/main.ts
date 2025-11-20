import {startREPL} from './repl.js';
import { initState } from './state.js';
async function main() {
    // initializing shared application state with 5 minute cache ttl interval
    const state = initState(1000 * 60 * 5);

    // starting repl loop
    await startREPL(state);
}

main();