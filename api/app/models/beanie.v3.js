'use strict';
const redis = require('redis');
const utilities = require('./utilities');
const config = require('../config')

const db = 0;
const client = redis.createClient(config.redisUrl(db));

const create = (beanie) => {
  return utilities.getBase64ImageDataAndThumbnail(beanie)
    .then(resp => {
      if (!resp) return beanie;
      beanie.thumbnail = resp.thumbnail;
      beanie.image = resp.base64String;
      return beanie;
    })
    .then(beanie => new Promise((res, rej) => {
      return client.set(`${beanie.family}:${beanie.name}`, JSON.stringify(beanie), (err, resp) => {
        if (err) rej(err);
        res(resp);
      });
  }));
};

const get = (family, name) => {
  return new Promise((res, rej) => {
    return client.get(`${family}:${name}`, (err, resp) => {
      if (err) rej(err);
      res(JSON.parse(resp));
    });
  });
};

const family = (family) => {
  return new Promise((res, rej) => {
    return client.scan('0', 'match', `${family}:*`, 'count', '10000', (err, resp) => {
      if (err) rej(err);
      if (resp.length < 2) rej(`malformed response: ${resp}`);

      return Promise.all(resp[1].sort().map(key => {
        const [family, name] = key.split(':');
        return get(family, name);
      }))
        .then(res);
    });
  });
};

const remove = (family, name) => {
  return new Promise((res, rej) => {
    return client.del(`${family}:${name}`, (err, resp) => {
      if (err) rej(err);
      res(resp);
    });
  });
};

module.exports = {
  create,
  get,
  family,
  remove
};
