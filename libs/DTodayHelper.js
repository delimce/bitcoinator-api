'use strict';

let _ = require("lodash");
const rp = require('request-promise');

exports.getToday = async function () {

  let url_dtoday = "https://s3.amazonaws.com/dolartoday/data.json"
  return await rp({
    method: 'GET',
    uri: url_dtoday,
    json: true,
    gzip: true
  })

}

exports.goldPriceGram = async function (oz_price) {
  let gramxOz = 0.035274;
  return gramxOz * oz_price

}
