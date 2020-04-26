const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const REDIS_PORT = 'redis://localhost:6379';

const client = redis.createClient(REDIS_PORT);

client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;

  this.hashKey = JSON.stringify(options.key || '');

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );
  // Do we have any cached data in redis related to this query
  const cacheValue = await client.hget(this.hashKey, key);

  // If yes, then respond to the request right away and return
  if (cacheValue) {
    const document = JSON.parse(cacheValue);
    return Array.isArray(document)
      ? document.map((doc) => new this.model(doc))
      : new this.model(document);
  }
  // Cache the mongoose query result with redis
  const result = await exec.apply(this, arguments);
  const value = JSON.stringify(result);
  client.hset(this.hashKey, key, value);
  client.expire(this.hashKey, 50);
  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
