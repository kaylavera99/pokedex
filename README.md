# Pokedex CLI (TypeScript + Node)
A small command-line Pokedex built in TypeScript that exercises:
- API integration with PokeAPI
- Shared application 'State' model
- A custom in-memory caching layer with TTL + background cleanup
- Basic automated testing with Vitest

## At a Glance

**What this project demonstrates:**

**TypeScript in a Node CLI context:**
- Strongly typed shared ```State``` object (readline, API client, pokedex, pagination state)
- Typed wrappers around external API response (```ShallowLocations```, ```Location```, ```Pokemon```)

**API client design**
- ```Cache``` class uses ```Map<string, CacheEntry<T>>``` with:
    - Timestamped entries (```createdAt``` and ```val```)
    - A reap loop powered by ```setInterval``` to remove stale entries
    - ```stopReapLoop()``` to clean up timers

**Interactive CLI / REPL**
- Custom REPL built on Node's ```readline```:
    - Tokenless input (```cleanInput```)
    - Resolves a command from registry
    - Dispatches async command callbacks with variadic arguments: ```(state, ...args)```
- Commands are small, focused and testable

**Lightweight game logic**
- Uses Pokemon ```base_experience``` and ```Math.random()``` to implement catch difficulty
- Maintains a simple in-memory Pokedex as ```Record<string, Pokemon>```


## Tech Stack
- Language: TypeScript
- Runtime: Node.js
- CLI I/O: Node's ```readline``` interface
- HTTP API: Native ```fetch```, talking to PokeAPI
- Testing: Vitest
- Caching: Custom in-memory caching with time-based removal

## Commands
The CLI exposes a small set of focused comamnds. All commands are entered at the ```pokedex > ``` prompt

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