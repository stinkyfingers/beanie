#!/Users/john4123/.nvm/versions/node/v8.11.2/bin/node

const AWS = require('aws-sdk');
const Jimp = require('jimp');
const fs = require('fs');

process.env.NODE_ENV = 'local';

const region = 'us-west-1';
const tableName = 'beanieboos';

AWS.config.update({region: region});
if (process.env.DB !== 'live') {
  AWS.config.endpoint = 'http://localhost:8000';
}
if (process.env.DB === 'live') {
  console.log("LIVE")
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'}); // run locally with live db
}

const ddb = new AWS.DynamoDB();

const updateImages = async() => {
  const fam = await family('Beanie Babies');
  for (let i = 0; i < fam.length; i++) {
    const name = fam[i].name;
    if (fam[i].thumbnail) {
      continue;
    }
    console.log(name);
    const beanie = await get({name});
    if (!beanie.image || beanie.image === '') {
      continue;
    }
    try {
      await getBase64ImageData(beanie);
    } catch(e) {
      console.log("ERROR getting image ", e);
      continue;
    }
    try {
      await createThumbnail(beanie);
    } catch (e) {
      console.log("ERROR getting thumbnail ", e);
      continue;
    }
    console.log(beanie.thumbnail.length);
    try {
      await updateBeanieImages(beanie);
    } catch(e) {
      console.log("ERROR updating ", e);
      continue;
    }
  }
};

const updateBeanieImages = async(beanie) => {
  const params = {
    TableName: tableName,
    Key: {
      'name': {
        S: beanie.name
      }
    },
    ExpressionAttributeNames: {
      '#image': 'image',
      '#thumbnail': 'thumbnail'
    },
    ExpressionAttributeValues: {
      ':image': {
        S: beanie.image
      },
      ':thumbnail': {
        S: beanie.thumbnail
      }
    },
    UpdateExpression: 'SET #image = :image, #thumbnail = :thumbnail'
  }
  return new Promise((res, rej) => {
    ddb.updateItem(params, async(err, data) => {
      if (err) {
        rej(err);
      }
      if (!data) {
        rej('data is null');
        return;
      }
      res('ok')
    });
  });
}



const family = async(family) => {
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

const createThumbnail = async(beanie) => {
  const response = {};

  const isLink = beanie.image.match(/^http:\/\/.*/);
  if (isLink && isLink.length > 0) {
    response.data = isLink[0];
  }

  const isHTTPSLink = beanie.image.match(/^https:\/\/.*/);
  if (isHTTPSLink && isHTTPSLink.length > 0) {
    response.data = isHTTPSLink[0];
  }

  const isData = beanie.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (isData && isData.length === 3) {
    response.type = isData[1];
    response.data = Buffer.from(isData[2], 'base64');
  }

  if (!response.data) {
    return;
    console.log('unknown image type: ', beanie.image);
  }

  const image = await Jimp.read(response.data);
  await image.resize(60, Jimp.AUTO);
  await image.quality(30);
  const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
  beanie.thumbnail = 'data:image/jpeg;base64,' + buffer.toString('base64');
}

const getBase64ImageData = async(beanie) => {
  const isLink = beanie.image.match(/^http:\/\/.*/);
  if (!isLink || isLink.length === 0) {
    return;
  }
  const response = {};
  response.data = isLink[0];
  const image = await Jimp.read(response.data);
  const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
  beanie.image = 'data:image/jpeg;base64,' + buffer.toString('base64');
}

const get = async(beanie) => {
  const params = {
    TableName: tableName,
    Key: {
      'name': {S: beanie.name}
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
