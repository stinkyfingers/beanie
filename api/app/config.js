const fs = require('fs');
const AWS = require('aws-sdk');

const redisUrl = (db) => {
  return process.env.NODE_ENV !== 'local' ? `redis://:${process.env.REDIS_PASSWORD}@redis-19395.c60.us-west-1-2.ec2.cloud.redislabs.com:19395/${db}` : null;
};

const getPrivateKey = () => {
  return new Promise((res, rej) => {
    if (process.env.NODE_ENV === 'local') {
      res(fs.readFileSync('../../key/private.pem'));
      return;
    }
    if (process.env.NODE_ENV === 'fakelive') {
      AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'});
    }

    const ssm = new AWS.SSM();
    const params = {
      Name: '/flashcard/privatekey',
      WithDecryption: false
    };
    ssm.getParameter(params, (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      if (!data || !data.Parameter || !data.Parameter.Value) {
        rej('data is null');
        return;
      }
      res(data.Parameter.Value);
    });
  });
};

const getPublicKey = () => {
  return new Promise((res, rej) => {
    if (process.env.NODE_ENV === 'local') {
      res(fs.readFileSync('../../key/public.pem'));
      return;
    }
    if (process.env.NODE_ENV === 'fakelive') {
      AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'});
    }

    const ssm = new AWS.SSM();
    const params = {
      Name: '/flashcard/publickey',
      WithDecryption: false
    };
    ssm.getParameter(params, (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      if (!data || !data.Parameter || !data.Parameter.Value) {
        rej('data is null');
        return;
      }
      res(data.Parameter.Value);
    });
  });
};

const getEmailPassword = () => {
  return new Promise((res, rej) => {
    const ssm = new AWS.SSM();
    const params = {
      Name: '/global/emailPassword',
      WithDecryption: false
    };
    ssm.getParameter(params, (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      if (!data || !data.Parameter || !data.Parameter.Value) {
        rej('data is null');
        return;
      }
      res(data.Parameter.Value);
    });
  });
};

module.exports = {
  redisUrl,
  getPrivateKey,
  getPublicKey,
  getEmailPassword
};
