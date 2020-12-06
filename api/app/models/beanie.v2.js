const AWS = require('aws-sdk');

const utilities = require('./utilities');

const region = 'us-west-1';
const dbBucket = 'beaniedb.john-shenk.com';
const imageBucket = 'beaniedata.john-shenk.com';

AWS.config.update({region: region});
if (process.env.NODE_ENV === 'live') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'jds'}); // run locally with live db
}

const s3 = new AWS.S3();

/**
* key creates a stringified data key
*/
const key = (family, name) => `${family}/${name}.json`;

/**
* imageKey creates a stringified image key
*/
const imageKey = (family, name) => `${name}.${family}`;

/**
  * family gets the 100 items after 'startAfter' from s3
*/
const family = (family, startAfter) => {
  const params = {
    Bucket: dbBucket,
    MaxKeys: 100,
    StartAfter: startAfter !== 'undefined' ? key(family, startAfter) : null,
    Prefix: `${family}/`
  };
  return s3.listObjectsV2(params)
    .promise()
    .then(res => Promise.all(res.Contents.map(obj => s3.getObject({
      Bucket: dbBucket,
      Key: obj.Key
    }).promise()
      .then(res => JSON.parse(res.Body.toString()))
    )));
};

/**
  * get gets an item and it's image from s3
*/
const get = (family, name) => {
  return s3.getObject({
    Bucket: dbBucket,
    Key: key(family, name)
  }).promise()
    .then(object => s3.getObject({
      Bucket: imageBucket,
      Key: imageKey(family, name)
    }).promise()
      .catch(err => {
        console.log(`no image for ${name}: ${err}`);
      })
      .then(image => {
        const beanie = JSON.parse(object.Body.toString());
        const img = image ? Buffer.from(image.Body).toString() : null;
        return { ...beanie, image: img };
      }));
};

/**
  * create an item and it's image and store in s3
*/
const create = (beanie) => {
  return utilities.getBase64ImageDataAndThumbnail(beanie)
    .then(resp => {
      if (!resp) return null;
      beanie.thumbnail = resp.thumbnail;
      const image = resp.base64String
      return s3.upload({
        Bucket: imageBucket,
        Key: imageKey(beanie.family, beanie.name),
        Body: Buffer.from(image)
      }).promise();
    })
    .then(() => s3.upload({
      Bucket: dbBucket,
      Key: key(beanie.family, beanie.name),
      Body: JSON.stringify(beanie)
    }).promise())
    .then(() => beanie);
};

/**
  * remove an item and it's image from s3
*/
const remove = (family, name) => {
  return s3.deleteObject({
    Bucket: dbBucket,
    Key: key(family, name)
  }).promise()
    .then(() => s3.deleteObject({
      Bucket: imageBucket,
      Key: imageKey(family, name)
    }).promise())
    .then(() => ({ family, name }));
};

module.exports = {
  family,
  get,
  create,
  remove
};
