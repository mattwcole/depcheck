export default class DevCache {
  constructor() {
    this.cache = {};
  }

  async get(key) {
    return this.cache[key];
  }

  async set(key, value) {
    this.cache[key] = value;
  }

  async cacheFirst(key, getValue) {
    const cacheHit = this.cache[key];

    if (cacheHit) {
      return cacheHit;
    }

    const value = await getValue();
    this.cache[key] = value;
    return value;
  }
}
