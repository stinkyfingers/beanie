'use strict';

const Jimp = require('jimp');

/**
  * getBase64ImageDataAndThumbnail returns an object containing
  * the base64 encoded image and a base64 encoded thumbnail-sized image
*/
const getBase64ImageDataAndThumbnail = (beanie) => {
  if (!beanie || !beanie.image) return;

  const response = {};

  const isLink = beanie.image.match(/^http:\/\/.*/);
  if (isLink && isLink.length > 0) {
    response.data = isLink[0];
  }

  const isHTTPSLink = beanie.image.match(/^https:\/\/.*/);
  if (isHTTPSLink && isHTTPSLink.length > 0) {
    response.data = isHTTPSLink[0];
  }

  const isData = beanie.image.match(/^data:([A-Za-z-+]+);base64,(.+)$/);
  if (isData && isData.length === 3) {
    response.type = isData[1];
    response.data = Buffer.from(isData[2], 'base64');
    response.base64 = Buffer.from(isData[2], 'base64');
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

module.exports = {
  getBase64ImageDataAndThumbnail
};
