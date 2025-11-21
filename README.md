# Pokedex CLI (TypeScript + Node)
A small command-line Pokedex built in TypeScript that exercises:
- API integration with [PokeAPI](https://pokeapi.co/)
- Shared application 'State' model
- A custom in-memory caching layer with TTL + background cleanup
- Basic automated testing with Vitest

## At a Glance

**What this project demonstrates:**

**TypeScript in a Node CLI context:**
- Strongly typed shared `State` object (readline, API client, pokedex, pagination state)
- Typed wrappers around external API response (`ShallowLocations`, `Location`, `Pokemon`)

**API client design**
- `Cache` class uses `Map<string, CacheEntry<T>>` with:
    - Timestamped entries (`createdAt` and `val`)
    - A reap loop powered by `setInterval` to remove stale entries
    - `stopReapLoop()` to clean up timers

**Interactive CLI / REPL**
- Custom REPL built on Node's `readline`:
    - Tokenless input (`cleanInput`)
    - Resolves a command from registry
    - Dispatches async command callbacks with variadic arguments: `(state, ...args)`
- Commands are small, focused and testable

**Lightweight game logic**
- Uses Pokemon `base_experience` and `Math.random()` to implement catch difficulty
- Maintains a simple in-memory Pokedex as `Record<string, Pokemon>`


## Tech Stack
- Language: TypeScript
- Runtime: Node.js
- CLI I/O: Node's `readline` interface
- HTTP API: Native `fetch`, talking to PokeAPI
- Testing: Vitest
- Caching: Custom in-memory caching with time-based removal

## Commands
The CLI exposes a small set of focused comamnds. All commands are entered at the `pokedex >` prompt

### Core Utility Commands

- **`help`**: Lists all available commands with their descirptions, using the in-memory command registry
- **`exit`**: Gracefully shuts down the REPL:
    - Closes the `readline` interface
    - Stops the cache reap loop (via `PokeAPI` client / `Cache` )

### World Navigation
- **`map`**: Fetches and displays the next page of 20 Pokemon location areas. 
    - Uses `state.nextLocationsURL` as a cursor
    - On each call:
        - Calls `pokeAPI.fetchLocations(state.nextLocationsURL)`
        - Updates `state.nextLocationsURL` and `state.prevLocationsURL` based on the API response.
    - Example:
        ````bash
        pokedex > map 
        canalave-city-area
        eterna-city-area
        pastoria-city-area
        sunyshore-city-area
        sinnoh-pokemon-league-area
        ````

- **`mapb`**: Moves backwards one page in the location-area list
    - If `state.prevLocationsURL` is `null` or empty, prints a friendly message instead of calling the API
    - Otherwise:
        - Calls `pokeAPI.prevLocationsURL(state.prevLocationsURL)`
        - Updates pagination URLs on `state`
    - Example:
        ````bash
        pokedex > mapb
        ```

### Area Exploration
- **`explore <location-area-name>`**: Shows all unique Pokemon that can be encountered in a specific location area.
    - Calls `pokeAPI.fetchLocation(areaName)` (which is cached)
    - Reads `pokemon_encounters` from the `Location` response
    - Uses a Set to de-duplicate Pokemon names
    - Example:
        ```bash
        pokedex > explore pastoria-city-area
        Exploring pastoria-city-area...
        Found Pokemon:
            - tentacool
            - tentacruel
            - magikarp
            ....
        ```

### Catching & Inspecting Pokemon
- **`catch <pokemon-name>`**: Attempts to catch a Pokemon by name using a simple probability model based on `base_experience`
    - Fetches details via `pokeAPI.fetchPokemon(name)` (with caching by URL)
    - Logs:
        ```bash
        Throwing a Pokeball at <name>
        ```
       before determining the result
    - Uses `Math.random()` and the Pokemon's `base_experience` to decide whether it's caught or escaped. 
    - On success:
        - Prints `<name> was caught`
        - Stores the Pokemon in `state.caughtPokemon[name]`
    - On failure:
        - Prints `<name> has escaped!`

- **`inspect <pokemon-name>`**: Shows detailed information about a single caught Pokemon
    - Looks up the Pokemon in the `state.caughtPokemon`
    - If the Pokemon hasnt been caught yet, prints a friendly message instead of hittin the API:
        ```bash
        <pokemon> is not in your Pokedex. Catch it first! 
        Usage: catch <pokemon-name>
        ```
    - If the Pokemon has been caught, prints the relevant details from the cached Pokemon object.
        ```base
        Name: squirtle
        Height: 5
        Weight: 90
        Stats:
        - hp: 44
        - attack: 48
        - special-attack: 50
        - special-defense: 64
        - speed: 43
        Types:
        - water

- **`pokedex`**: Displays the list of all Pokemon current caught and stored in `state.caughtPokemon`
    - If no Pokemon have been caught, prints a simple message list:
        `You have no caught any Pokemon yet.`
    - Otherwise, prints:
        ```bash
        Caught Pokemon:
        - pikachu
        - squirtle
        - charmander
        ...
        ...

## Running the Project
#### Prerequisites
    - Node.js 18+ (for built-in `fetch()`)
    - npm

### Installation
```bash
git clone https://github.com/kaylavera99/pokedex.git
cd pokedex
npm install
```

### Run the CLI
- Running the scripts that are configured in the package.json
`npm run dev`
- Returns:
`pokedex >`
- Now the CLI tool is active. 


## Running Tests
- Run the Vitest suite:
`npm test`
  or:
`npx vitest`
```bash
    - These test scripts are defined in files named: `<existing-file>**.test.ts**
    - More tests can be added to these files, or additional test files by creating a new file with the same name, but adding the **.test.ts** extention. 
```


    
## Future Extensions
- Create browser JavaScript bundled with Vite
- Import existing JS modules from `dist/`
- Make a simple HTML UI (fake terminal)
- Make a web-based `main.ts` that acts as an 'entrypoint' for a browser-based CLI
    - It will initialize a `State` without `readline`
    - Uses `print` to update the DOM (fake terminal)
    - Parses user input from HTML field and use that when dispatching commands
- Built with Vite, static JS/CSS/HTML, publish to GitHub pages for browser usage. 