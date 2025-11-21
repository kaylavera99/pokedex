# Pokedex CLI (TypeScript + Node)
A small command-line Pokedex built in TypeScript that exercises:
- API integration with PokeAPI
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
        - `<name> has escaped!`

- **`pokedex`**: Displays the list of all Pokemon current caught and stored in `state.caughtPokemon`
    - If no Pokemon have been caught, prints a simple message list:
        ```bash
        You have no caught any Pokemon yet.
        ```
    - Otherwise, prints:
        ```bash
        Caught Pokemon:
        - pikachu
        - squirtle
        - charmander
        ...
        ...
    