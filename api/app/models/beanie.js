const AWS = require('aws-sdk');
const config = require('../config');
const Jimp = require('jimp');
const converter = AWS.DynamoDB.Converter;

const region = 'us-west-1';
const tableName = 'beanieboos';

AWS.config.update({region: region});
if (process.env.NODE_ENV === 'local') {
  AWS.config.endpoint = 'http://localhost:8000';
}
if (process.env.NODE_ENV === 'live') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'}); // run locally with live db
}

const ddb = new AWS.DynamoDB();

module.exports = class Beanie {
  constructor(name = '', image = '', family = '', number = '', variety = '', animal = '', exclusiveTo = '', birthday = '', introDate = '', retireDate = '', height = '', length = '', st = '', tt = '', thumbnail = '') {
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
    this.tt = tt,
    this.thumbnail = thumbnail
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
      }
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
          res(u);
        } catch (err) {
          rej(err);
        }
      });
    });
  }

  static async all() {
    const params = {
      TableName: tableName,
      ExpressionAttributeNames: {
        '#name': 'name',
        '#family': 'family',
        '#animal': 'animal',
        '#thumbnail': 'thumbnail'
      },
      ProjectionExpression: '#name,#family,#animal,#thumbnail'
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

  static async family(family) {
    const params = {
      TableName: tableName,
      IndexName: 'family',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#family': 'family',
        '#animal': 'animal',
        '#thumbnail': 'thumbnail'
      },
      ExpressionAttributeValues: {
        ':family': {
          S: family
        }
      },
      KeyConditionExpression: `#family = :family`,
      ProjectionExpression: '#name,#family,#animal,#thumbnail'
    }
    return new Promise((res, rej) => {
      ddb.query(params, async(err, data) => {
        if (err) {
          rej(err);
        }
        if (!data) {
          rej('data is null');
          return;
        }
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

  async upsert() {
    if (!this.thumbnail) {
      await this.createThumbnail();
    }
    await this.getBase64ImageData();

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

  async createThumbnail() {
    const response = {};

    const isLink = this.image.match(/^http:\/\/.*/);
    if (isLink && isLink.length > 0) {
      response.data = isLink[0];
    }

    const isData = this.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (isData && isData.length === 3) {
      response.type = isData[1];
      response.data = new Buffer(isData[2], 'base64'); // TODO Buffer is deprecated
    }

    const image = await Jimp.read(response.data);
    await image.resize(60, Jimp.AUTO);
		await image.quality(30);
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    this.thumbnail = 'data:image/jpeg;base64,' + buffer.toString('base64');
    // await fs.writeFileSync('test2.jpg', this.thumbnail, {encoding: 'base64'});
  }

  async getBase64ImageData() {
    const isLink = this.image.match(/^http:\/\/.*/);
    if (!isLink || isLink.length === 0) {
      return;
    }
    const response = {};
    response.data = isLink[0];
    const image = await Jimp.read(response.data);
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    this.image = 'data:image/jpeg;base64,' + buffer.toString('base64');
  }
}
