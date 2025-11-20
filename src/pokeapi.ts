import {Cache} from "./pokecache.js";


// wrapper around PokeAPI location-area endpoints with 
// in-memory caching
export class PokeAPI {
    private static readonly baseUrl = "https://pokeapi.co/api/v2";
    private cache: Cache;

    // each pokeapi instance has its own ttl cache with given reap interval
    constructor(cacheIntervalMs: number) {
        this.cache = new Cache(cacheIntervalMs);
    }

    closeCache() {
        this.cache.stopReapLoop();
    }
    // Fetches shallow location-area objects
    // if page has already been retrieved and is in cache, return cached version
    async fetchLocations(pageUrl?: string): Promise<ShallowLocations> {
        const url = pageUrl || `${PokeAPI.baseUrl}/location-area`;
        const cache = this.cache.get<ShallowLocations>(url);
        if (cache) {
            return cache;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`Error: ${response.status} Failed to fetch locations: ${response.statusText}`);
            }

            const locations: ShallowLocations = await response.json();
            return locations;
        } catch (error) {
            throw new Error(`Error fetching locations: ${(error as Error).message}`);
        }
        
    }
    // fetches single location-area by name
    // read from cache if available otherwise fetch from API and cache result
    async fetchLocation(locationName: string): Promise<Location> {
        const url = `${PokeAPI.baseUrl}/location-area/${locationName}`;
        const cache = this.cache.get<Location>(url);
        if (cache) {
            return cache;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch location "${locationName}": ${response.statusText}`);
            }

            const data: Location = await response.json();
            this.cache.add(url, data);
            return data;
        } catch (error) {
            throw new Error(`Error fetching location "${locationName}": ${(error as Error).message}`);
        }
    }



    async fetchPokemon(pokemonName: string): Promise<Pokemon> {
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;

      const cache = this.cache.get<Pokemon>(url);
      if (cache) {
        return cache;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch pokemon "${pokemonName}": ${response.statusText}`);
        }

        const data: Pokemon = await response.json();
        this.cache.add(url, data);
        return data;
      } catch (error) {
        throw new Error(`Error fetching pokemon "${pokemonName}": ${(error as Error).message}`);
      }
         
  }
}
// shallow location area payload 
// reach result only contains a name and URL; not full details
export type ShallowLocations = {
    count: number;
    next: string;
    previous: string;
    results: {
        name: string;
        url: string;
    }[];
};
// full location area payload
// only types for fields used in app are defined
export type Location = {
    encounter_method_rates: {
    encounter_method: {
      name: string;
      url: string;
    };
    version_details: {
      rate: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
  game_index: number;
  id: number;
  location: {
    name: string;
    url: string;
  };
  name: string;
  names: {
    language: {
      name: string;
      url: string;
    };
    name: string;
  }[];
  pokemon_encounters: {
    pokemon: {
      name: string;
      url: string;
    };
    version_details: {
      encounter_details: {
        chance: number;
        condition_values: any[];
        max_level: number;
        method: {
          name: string;
          url: string;
        };
        min_level: number;
      }[];
      max_chance: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
};


export type Pokemon = {
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  base_experience: number;
  forms: {
    name: string;
    url: string;
  }[];
  game_indices: {
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }[];
  height: number;
  held_items: any[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }[];
  }[];
  name: string;
  order: number;
  past_types: any[];
  species: {
    name: string;
    url: string;
  };
  sprites: {
    back_default: string;
    back_female: any;
    back_shiny: string;
    back_shiny_female: any;
    front_default: string;
    front_female: any;
    front_shiny: string;
    front_shiny_female: any;
    other: {
      dream_world: {
        front_default: string;
        front_female: any;
      };
      home: {
        front_default: string;
        front_female: any;
        front_shiny: string;
        front_shiny_female: any;
      };
      official_artwork: {
        front_default: string;
        front_shiny: string;
      };
    };
    versions: {
      [generation: string]: {
        [game: string]: {
          back_default: string;
          back_female?: any;
          back_shiny: string;
          back_shiny_female?: any;
          front_default: string;
          front_female?: any;
          front_shiny: string;
          front_shiny_female?: any;
        };
      };
    };
  };
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  weight: number;
};