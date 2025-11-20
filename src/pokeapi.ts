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