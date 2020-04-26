const redis = require('redis');

class Redis {
  constructor() {
    this.redisUrl = 'redis://127.0.0.1:6379';
    this.connected = false;
    this.client = null;
  }

  getConnection() {
    if (this.connected) {
      return this.client;
    } else {
      this.client = redis.createClient(this.redisUrl);

      return this.client;
    }
  }
}

module.exports = new Redis();
