import redis from 'redis';
import { promisify } from 'util';

const createClient = ({ host, port }) => {
  const client = redis.createClient(port, host);
  client.on('error', error => console.log(error));

  return {
    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client),
  };
};

export default class RedisCache {
  constructor(options) {
    this.client = createClient(options);
  }

  async get(key) {
    const result = await this.client.get(key);
    return JSON.parse(result);
  }

  // TODO: Sensible expiries.
  set(key, value, expiry = 7 * 24 * 60 * 60) {
    return this.client.set(key, JSON.stringify(value), 'EX', expiry);
  }

  async cacheFirst(key, getValue) {
    const cacheHit = await this.get(key);

    if (cacheHit) {
      return cacheHit;
    }

    const value = await getValue();
    this.set(key, value);
    return value;
  }
}
