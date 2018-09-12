'use strict';

let requestify = require('requestify'); ///resource for execute vendor services
let _ = require("lodash");

exports.getToday = async function () {

  //  let url_dtoday = "http://45.32.214.171:8082/calc/dolartoday"
    let url_dtoday = "https://s3.amazonaws.com/dolartoday/data.json"
    let $today = await requestify.get(url_dtoday);
    return $today.getBody()

}

///peso arg http://ws.geeklab.com.ar/
exports.getPesoArg = async function () {

      let url_parg = "http://ws.geeklab.com.ar/dolar/get-dolar-json.php"
      let $arg = await requestify.get(url_parg);
      return JSON.parse($arg.getBody());
  
  }

exports.goldPriceGram = async function (oz_price) {
    let gramxOz = 0.035274;
    return await gramxOz*oz_price

}
