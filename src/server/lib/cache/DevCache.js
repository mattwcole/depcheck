export default class DevCache {
  constructor() {
    this.cache = {};
  }

  get(key) {
    return this.cache[key];
  }

  put(key, value) {
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
