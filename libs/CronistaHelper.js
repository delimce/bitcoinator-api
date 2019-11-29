'use strict';

let _ = require("lodash");
const rp = require('request-promise');


//new:https://www.cronista.com/MercadosOnline/json/getValoresCalculadora.html
//old:http://ws.geeklab.com.ar/dolar/get-dolar-json.php 

exports.getInfoArg = async function () {
   let url_parg = "https://www.cronista.com/MercadosOnline/json/getValoresCalculadora.html"
   return await rp({
      method: 'POST',
      uri: url_parg,
      json: true,
      gzip: true
    })
}

const getArsCurrencies = async function (json) {
   return _.filter(json, function (item) { return _.includes(item.Nombre, 'DÓLAR'); })
}

exports.getArgByUpperPrice = async function (json) {
   return _.maxBy(await getArsCurrencies(json), function (o) { return o.Compra; });
}

exports.getArsCurrencies = getArsCurrencies