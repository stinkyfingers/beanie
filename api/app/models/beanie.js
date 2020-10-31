const AWS = require('aws-sdk');
const Jimp = require('jimp');
const converter = AWS.DynamoDB.Converter;

const region = 'us-west-1';
const tableName = 'beanies';
const bucket = 'beaniedata.john-shenk.com';

AWS.config.update({region: region});
if (process.env.NODE_ENV === 'local') {
  AWS.config.endpoint = 'http://localhost:8000';
}
if (process.env.NODE_ENV === 'live') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'}); // run locally with live db
}

const ddb = new AWS.DynamoDB();
const s3 = new AWS.S3();

module.exports = class Beanie {
  constructor({name = '', image = '', family = '', number = '', variety = '', animal = '', exclusiveTo = '', birthday = '', introDate = '', retireDate = '', height = '', length = '', st = '', tt = '', thumbnail = ''}) {
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
    this.thumbnail = thumbnail;
  }

  async create() {
    if (this.image) {
      try {
        await this.createThumbnail();
        await this.getBase64ImageData();

        const s3Params = {
          Bucket: bucket,
          Key: `${this.name}.${this.family}`,
          Body: Buffer.from(this.image)
        };
        await s3.upload(s3Params).promise();
      } catch (err) {
        Object.assign(this, { error: err });
      }
    }
    this.image = undefined;
    const dbParams = {
      TableName: tableName,
      Item: converter.marshall(this, {convertEmptyValues: true}),
      ConditionExpression: 'attribute_not_exists(username)'
    };
    try {
      const data = await ddb.putItem(dbParams).promise();
      const resp = AWS.DynamoDB.Converter.unmarshall(data.Item);
      Object.assign(this, resp);
    } catch (err) {
      console.error(err);
      return {error: err};
    }


    return this;
  }

  async get() {
    // db data
    const params = {
      TableName: tableName,
      Key: {
        'name': {S: this.name},
        'family': {S: this.family}
      }
    };
    let u;
    try {
      const data = await ddb.getItem(params).promise();
      u = AWS.DynamoDB.Converter.unmarshall(data.Item);
      Object.assign(this, u);
    } catch (err) {
      console.error(err);
      u.error = err;
      return u;
    }

    // get image from S3
    try {
      const image = await s3.getObject({
        Bucket: bucket,
        Key: `${this.name}.${this.family}`
      }).promise();
      const buff = Buffer.from(image.Body);
      this.image = buff.toString();
    } catch (err) {
      if (err.code === 'NoSuchKey') {
        this.error = 'cannot find image';
      }
    }
    return this;
  }

  static async family(family, startKeyName) {
    const params = {
      TableName: tableName,
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
      KeyConditionExpression: '#family = :family',
      ProjectionExpression: '#name,#family,#animal,#thumbnail',
      Limit: 300, // TODO ponder

    };

    if (startKeyName) {
      params.ExclusiveStartKey = {
        'family': {
          S: family
        },
        'name': {
          S: startKeyName
        }
      }
    };

    try {
      const data = await ddb.query(params).promise();
      let beanies = [];
      await data.Items.forEach((item) => {
        const b = AWS.DynamoDB.Converter.unmarshall(item);
        beanies.push(b);
      });
      return {beanies, lastEvaluatedKey: data.LastEvaluatedKey};
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  async delete () {
    const dbParams = {
      TableName: tableName,
      Key: {
        'name': { S: this.name },
        'family': { S: this.family }
      }
    };
    try {
      const s3Params = {
        Bucket: bucket,
        Key: `${this.name}.${this.family}`
      };
      await s3.deleteObject(s3Params).promise();
    } catch (err) {
      return { error: err };
    }
    try {
      await ddb.deleteItem(dbParams).promise();
    } catch(err) {
      console.error(err);
      return { error: err };
    }
  }

  async createThumbnail() {
    if (!this.image) return;
    const response = {};

    const isLink = this.image.match(/^http:\/\/.*/);
    if (isLink && isLink.length > 0) {
      response.data = isLink[0];
    }

    const isHTTPSLink = this.image.match(/^https:\/\/.*/);
    if (isHTTPSLink && isHTTPSLink.length > 0) {
      response.data = isHTTPSLink[0];
    }

    const isData = this.image.match(/^data:([A-Za-z-+]+);base64,(.+)$/);
    if (isData && isData.length === 3) {
      response.type = isData[1];
      response.data = Buffer.from(isData[2], 'base64');
    }

    if (!response.data) {
      return;
    }

    const image = await Jimp.read(response.data);
    await image.resize(60, Jimp.AUTO);
    await image.quality(30);
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    this.thumbnail = 'data:image/jpeg;base64,' + buffer.toString('base64');
  }

  async getBase64ImageData() {
    if (!this.image) return;
    const isData = this.image.match(/^data:([A-Za-z-+]+);base64,(.+)$/);
    if (isData && isData.length === 3) {
      return Buffer.from(isData[2], 'base64');
    }

    const response = {};

    const isLink = this.image.match(/^http:\/\/.*/);
    if (isLink && isLink.length > 0) {
      response.data = isLink[0];
    }
    const isHTTPSLink = this.image.match(/^https:\/\/.*/);
    if (isHTTPSLink && isHTTPSLink.length > 0) {
      response.data = isHTTPSLink[0];
    }
    if (!isLink && !isHTTPSLink) {
      return;
    }
    try {
      const image = await Jimp.read(response.data);
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
      this.image = 'data:image/jpeg;base64,' + buffer.toString('base64');
    } catch (err) {
      this.error = err;
    }
  }

  static async updateImages(family) {
    const fam = await Beanie.family(family);
    for (let i = 0; i < fam.length; i++) {
      const e = fam[i];
      if (e.thumbnail && e.thumbnail !== '') {
        continue;
      }
      const bb = new Beanie(e.name);

      const b = await bb.get();
      const beanie = new Beanie(
        b.name,
        b.image,
        b.family,
        b.number,
        b.variety,
        b.animal,
        b.exclusiveTo,
        b.birthday,
        b.introDate,
        b.retireDate,
        b.height,
        b.length,
        b.st,
        b.tt
      );
      await beanie.upsert();
    }
    return 'ok';
  }
};
