'use strict';
const AWS = require('aws-sdk');

const utilities = require('./utilities');
const config = require('../config');
const crypto = require('crypto');
const _ = require('lodash');

const region = 'us-west-1';
const userBucket = 'beanieusers.john-shenk.com';

AWS.config.update({region: region});
if (process.env.NODE_ENV === 'local') {
  AWS.config.endpoint = 'http://localhost:8000';
}
if (process.env.NODE_ENV === 'live') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'}); // run locally with live db
}

const filenameKey = (username) => `${username}.json`;

const s3 = new AWS.S3();

/**
  * get gets a user from s3
*/
const get = (username) => {
  return s3.getObject({
    Bucket: userBucket,
    Key: filenameKey(username)
  })
    .promise()
    .then(object => JSON.parse(object.Body.toString()));
};

/**
  * login fetches a user from s3,
  * compares the password and assigns a jwt
*/
const login = (username, password) => {
  return s3.getObject({
    Bucket: userBucket,
    Key: filenameKey(username)
  })
    .promise()
    .then(object => JSON.parse(object.Body.toString()))
    .then(user => {
      const buf = new Buffer.from(user.password);
      return config.getPrivateKey()
        .then(key => {
          const dec = crypto.privateDecrypt(key.toString(), buf);
          if (dec.toString() !== password) {
            throw Error('authentication error');
          }
          return key;
        })
        .then(key => {
          const token = utilities.createToken(user, key);
          _.set(user, ['token'], token);
        })
        .then(() => user);
    })
    .then(user => {
      _.set(user, ['password'], null);
      return user;
    });
};

/**
  * create creates a user in s3
  * and assigns a jwt
*/
const create = (username, password, email) => {
  const user = {
    username,
    password,
    email,
    beanies: [],
    wantlist: []
  };
  return config.getPrivateKey()
    .then(key => {
      const buffer = Buffer.from(password);
      const encPassword = crypto.publicEncrypt(key.toString(), buffer);
      _.set(user, ['password'], encPassword);

      return s3.upload({
        Bucket: userBucket,
        Key: filenameKey(username),
        Body: JSON.stringify(user)
      })
        .promise()
        .then(() => {
          const token = utilities.createToken(user, key);
          _.set(user, ['token'], token);
          _.set(user, ['password'], null);
          return user;
        });
    });
};

/**
  * all fetches all users from s3, returning their usernames
*/
const all = () => {
  return s3.listObjectsV2({
    Bucket: userBucket,
  })
    .promise()
    .then(res => res.Contents.map(object => _.replace(object.Key, '.json', '')));
};

/**
  * updateLists gets a user from S3, then updates their beanies & wantlist
*/
const updateLists = (user) => {
  return get(user.username)
    .then(s3user => {
      _.set(s3user, ['beanies'], user.beanies);
      _.set(s3user, ['wantlist'], user.wantlist);
      _.set(s3user, ['token'], user.jwt);
      return [s3user, s3.upload({
        Bucket: userBucket,
        Key: filenameKey(user.username),
        Body: JSON.stringify(s3user)
      }).promise()];
    })
    .then(([s3user]) => {
      _.set(s3user, ['password'], null);
      return s3user;
    });
};

/**
  * resetPassword
*/
const resetPassword = (username) => {
  return get(username)
    .then(s3user => config.getPublicKey()
      .then(key => {
        const newPassword = utilities.randomPassword();
        const buffer = Buffer.from(newPassword);
        const encPassword = crypto.publicEncrypt(key.toString(), buffer);
        _.set(s3user, ['password'], newPassword);
        return [s3user, s3.upload({
          Bucket: userBucket,
          Key: filenameKey(username),
          Body: JSON.stringify({ ...s3user, password: encPassword })
        }).promise()];
      })
      .then(([s3user]) => {
        return utilities.emailPassword(s3user);
      }));
};

/**
  * changePassword
*/
const changePassword = (user) => {
  return login(user.username, user.password)
    .then((s3user) => config.getPublicKey()
      .then(key => {
        const encPassword = crypto.publicEncrypt(key.toString(), Buffer.from(user.newPassword));
        _.set(s3user, ['password'], user.newPassword);
        return [s3user, s3.upload({
          Bucket: userBucket,
          Key: filenameKey(user.username),
          Body: JSON.stringify({ ...s3user, password: encPassword })
        }).promise()];
      })
      .then(([s3user]) => s3user));
};

module.exports = {
  get,
  login,
  create,
  all,
  updateLists,
  resetPassword,
  changePassword
};
