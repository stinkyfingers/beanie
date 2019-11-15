const AWS = require('aws-sdk');
const config = require('../config');
const crypto = require('crypto');
const converter = AWS.DynamoDB.Converter;
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const region = 'us-west-1';
const tableName = 'beaniebooUsers';

AWS.config.update({region: region});
if (process.env.NODE_ENV === 'local') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'});
}

const ddb = new AWS.DynamoDB();

module.exports = class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.admin = false;
  }

  async login() {
    const key = await config.getPrivateKey()
    const params = {
      TableName: tableName,
      Key: {
        'username': {S: this.username}
      },
      ProjectionExpression: 'username,password,beanies,wantlist,admin'
    }
    return new Promise((res, rej) => {
      ddb.getItem(params, async(err, data) => {
        if (err) {
          rej(err);
        }
        if (!data) {
          rej('data is null');
          return;
        }
        try {
          const u = AWS.DynamoDB.Converter.unmarshall(data.Item);
          const buf = new Buffer.from(u.password);
          const dec = crypto.privateDecrypt(key.toString(), buf)
          this.beanies = _.get(u.beanies, 'values', []);
          this.wantlist = _.get(u.wantlist, 'values', []);
          this.admin = u.admin;
          if (this.password = dec.toString()) {
            res(this)
          }
          rej('authentication error');
        } catch (err) {
          rej(err);
        }
      });
    });
  }

  async get() {
    const params = {
      TableName: tableName,
      Key: {
        'username': {S: this.username}
      },
      ProjectionExpression: 'username,beanies,wantlist,admin'
    }
    return new Promise((res, rej) => {
      ddb.getItem(params, async(err, data) => {
        if (err) {
          rej(err);
        }
        if (!data) {
          rej('data is null');
          return;
        }
        try {
          const u = AWS.DynamoDB.Converter.unmarshall(data.Item);
          this.username = u.username;
          this.admin = u.admin;
          this.beanies = _.get(u.beanies, 'values', []);
          this.wantlist = _.get(u.wantlist, 'values', []);
          res(this);
        } catch (err) {
          rej(err);
        }
      });
    });
  }

  async create() {
    const buffer = Buffer.from(this.password);
    const key = await config.getPublicKey()
    var encPassword = crypto.publicEncrypt(key.toString(), buffer);
    const params = {
      TableName: tableName,
      Item: {
        'username': { S: this.username },
        'password': { B: encPassword },
        'email': { S: this.email }
      },
      ConditionExpression: 'attribute_not_exists(username)'
    }
    return new Promise((res, rej) => {
      ddb.putItem(params, (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        config.getPrivateKey()
        .then(async(privateKey) => {
          const options = {
            algorithm: 'RS256'
          };
          const token = await jwt.sign(JSON.stringify({username: this.username, email: this.email, beanies: [], wantlist: []}), privateKey, options);
          res({...this, token, password: null});
        }).catch((err) => {
          rej(err);
        });
      });
    });
  }

  updateBeanies() {
    const params = {
      TableName: tableName,
      Key: {
        'username': { S: this.username }
      },
      ExpressionAttributeNames: {
        '#beanies': 'beanies'
      },
      ExpressionAttributeValues: {
        ':beanies': {
          SS: this.beanies
        }
      },
      UpdateExpression: 'set #beanies = :beanies',
      ConditionExpression: 'attribute_exists(username)',
      ReturnValues: 'ALL_NEW'
    }
    return new Promise((res, rej) => {
      ddb.updateItem(params, (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        const u = AWS.DynamoDB.Converter.unmarshall(data.Attributes);
        this.beanies = _.get(u.beanies, 'values', []);
        this.password = null;
        res(this);
      });
    });
  }

  updateWantlist() {
    const params = {
      TableName: tableName,
      Key: {
        'username': { S: this.username }
      },
      ExpressionAttributeNames: {
        '#wantlist': 'wantlist'
      },
      ExpressionAttributeValues: {
        ':wantlist': {
          SS: this.wantlist
        }
      },
      UpdateExpression: 'set #wantlist = :wantlist',
      ConditionExpression: 'attribute_exists(username)',
      ReturnValues: 'ALL_NEW'
    }
    return new Promise((res, rej) => {
      ddb.updateItem(params, (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        const u = AWS.DynamoDB.Converter.unmarshall(data.Attributes);
        this.wantlist = _.get(u.wantlist, 'values', []);
        this.password = null;
        res(this);
      });
    });
  }

  delete() {
    const params = {
      TableName: tableName,
      Key: {
        'username': { S: this.username }
      }
    }
    return new Promise((res, rej) => {
      ddb.deleteItem(params, (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        res(AWS.DynamoDB.Converter.unmarshall(data.Item));
      })
    })
  }

  hello() {
    console.log('hello ', this.username);
  }
};
