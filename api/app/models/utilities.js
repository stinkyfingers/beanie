'use strict';

const Jimp = require('jimp');
const nodemailer = require('nodemailer');
const config = require('../config');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

/**
  * getBase64ImageDataAndThumbnail returns an object containing
  * the base64 encoded image and a base64 encoded thumbnail-sized image
*/
const getBase64ImageDataAndThumbnail = (beanie) => {
  if (!beanie || !beanie.image) return Promise.resolve();

  const response = {};

  const isLink = beanie.image.match(/^http:\/\/.*/);
  if (isLink && isLink.length > 0) {
    response.data = isLink[0];
  }

  const isHTTPSLink = beanie.image.match(/^https:\/\/.*/);
  if (isHTTPSLink && isHTTPSLink.length > 0) {
    response.data = isHTTPSLink[0];
  }

  const isData = beanie.image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (isData && isData.length === 3) {
    response.type = isData[1];
    response.data = Buffer.from(isData[2], 'base64');
    response.base64 = beanie.image;
  }

  return Jimp.read(response.data)
    .then(image => {
      response.imageData = image;
      return image;
    })
    .then(image => image.getBufferAsync(Jimp.MIME_JPEG))
    .then(buffer => 'data:image/jpeg;base64,' + buffer.toString('base64'))
    .then(base64String => {
      if (!response.base64) response.base64 = base64String;
    })
    .then(() => response.imageData.resize(60, Jimp.AUTO))
    .then(image => image.quality(30))
    .then(image => image.getBufferAsync(Jimp.MIME_JPEG))
    .then(buffer => 'data:image/jpeg;base64,' + buffer.toString('base64'))
    .then(thumbnail => ({ base64String: response.base64, thumbnail }));
};

/**
  * randomPassword generates a 6-char password
  */
const randomPassword = () => {
  let opts = 'qwertyuiopasdfghjklzxcvbnm';
  let password = '';
  for (let i = 0; i < 6; i++) {
    password += opts[Math.floor(Math.random() * Math.floor(26))];
  }
  return password;
};

/**
  * emailPassword sends a password to a user's email
  */
const emailPassword = (user) => {
  return config.getEmailPassword()
    .then(emailPassword => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'johnshenk77@gmail.com',
          pass: emailPassword
        }
      });
      return transporter.sendMail({
        from: '"Beanie Central" <johnshenk77@gmail.com>',
        to: user.email,
        subject: 'Beanie Central Password Reset',
        text: `New password for ${user.username}: ${user.password}`
      });
    });
};

/**
  * creates a token without private or large fields
  */
const createToken = (user, key) => {
  const options = { algorithm: 'RS256', expiresIn: '24h' };
  const signUser = _.clone(_.omit(user, ['beanies', 'wantlist', 'password']));
  const token =  jwt.sign(signUser, key, options);
  return token;
};

module.exports = {
  getBase64ImageDataAndThumbnail,
  randomPassword,
  emailPassword,
  createToken
};
