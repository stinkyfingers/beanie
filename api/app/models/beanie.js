const AWS = require('aws-sdk');
const config = require('../config');
const converter = AWS.DynamoDB.Converter;

const region = 'us-west-1';
const tableName = 'beanieboos';

AWS.config.update({region: region});
if (process.env.NODE_ENV === 'local') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'});
}

const ddb = new AWS.DynamoDB();

module.exports = class Beanie {
  constructor(name = '', image = '', family = '', number = '', variety = '', animal = '', exclusiveTo = '', birthday = '', introDate = '', retireDate = '', height = '', length = '', st = '', tt = '') {
    this.name = name,
    this.image = image,
    this.family = family,
    this.number = number,
    this.variety = variety,
    this.animal = animal,
    this.exclusiveTo = exclusiveTo,
    this.birthday = birthday,
    this.introDate = introDate,
    this.retireDate = retireDate,
    this.height = height,
    this.length = length,
    this.st = st,
    this.tt = tt
  }

  async create() {
    const params = {
      TableName: tableName,
      Item: converter.marshall(this, {convertEmptyValues: true}),
      ConditionExpression: 'attribute_not_exists(username)'
    }

    return new Promise((res, rej) => {
      ddb.putItem(params, (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        res(AWS.DynamoDB.Converter.unmarshall(data.Item));
      });
    });
  }

  async get() {
    const params = {
      TableName: tableName,
      Key: {
        'name': {S: this.name}
      },
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
          const u = AWS.DynamoDB.Converter.unmarshall(data.Item)
          this.name = u.name;
          res(this);
        } catch (err) {
          rej(err);
        }
      });
    });
  }

  static async all() {
    const params = {
      TableName: tableName,
    }
    return new Promise((res, rej) => {
      ddb.scan(params, async(err, data) => {
        if (err) {
          rej(err);
        }
        if (!data) {
          rej('data is null');
          return;
        }
        console.log('data', data)
        try {
          let beanies = [];
          await data.Items.forEach((item) => {
            const b = AWS.DynamoDB.Converter.unmarshall(item);
            beanies.push(b);;
          });
          res(beanies);
        } catch (err) {
          console.log('all() error: ', err)
          rej(err);
        }
      });
    });
  }

  upsert() {
    const params = {
      TableName: tableName,
      Item: converter.marshall(this, {convertEmptyValues: true}),
    }

    return new Promise((res, rej) => {
      ddb.putItem(params, (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        res(this)
      });
    });
  }

  delete() {
    const params = {
      TableName: tableName,
      Key: {
        'name': { S: this.name }
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
}
