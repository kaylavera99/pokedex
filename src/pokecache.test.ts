import {Cache} from "./pokecache.js";
import {test, expect} from "vitest";


test.concurrent.each([
    { key: "https://www.google.com", val: "one", interval: 500  },
    { key: "https://www.firefox.com", val: "two", interval: 1500 },
])("Cache add and get for key '$key'", async ({key, val, interval}) => {
    const cache = new Cache(interval);
    
    cache.add(key, val);
    const cached = cache.get(key);
    expect(cached).toBe(val);


    await new Promise((resolve) => setTimeout(resolve,interval * 2));
    const reaped = cache.get(key);
    
    expect(reaped).toBe(undefined)
    cache.stopReapLoop();
});