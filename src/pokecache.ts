//cache entry wrapper w/timestamp for reaping
export type CacheEntry<T> = {
    createdAt: number;
    val:T;
};

//simple in-memory cache with time-based reaping
// entries are keyed by string (urls in this app)
export class Cache {
    #cache = new Map<string, CacheEntry<any>>();
    #reapIntervalId: NodeJS.Timeout | undefined= undefined;
    #interval: number;

    constructor(interval:number) {
        this.#interval = interval;
        this.#startReapLoop(); // periodic cleanup loop

        // Loop logic to reap old cache entries
    }

    // add or overwrite cache entry
    add<T>(key:string, val:T) {
        const entry:CacheEntry<T> = {
            createdAt: Date.now(),
            val
        };
        this.#cache.set(key, entry);
    }
    
    // get cache entry by key
    get<T>(key:string){
        const entry = this.#cache.get(key);
        if (!entry) {
            return undefined;
        }
        return entry.val as T;
    }

    // reap old entries after interval
    #reap() {
        const now = Date.now();
        for (const [key, entry] of this.#cache) {
            if (now - entry.createdAt > this.#interval) {
                this.#cache.delete(key);
            }
        }
    }

    // start a timer to periodically reap old entries
    #startReapLoop() {
        if (this.#reapIntervalId) {
            return;
        }
        this.#reapIntervalId = setInterval(() => {
            this.#reap();
        }, this.#interval);
    }   

    // public hook to stop reap loop
    stopReapLoop() {
        if (this.#reapIntervalId) {
            clearInterval(this.#reapIntervalId);
            this.#reapIntervalId = undefined;
        }
    }
}