'use strict';

let requestify = require('requestify'); ///resource for execute vendor services
let _ = require("lodash");


//new:https://www.cronista.com/MercadosOnline/json/getValoresCalculadora.html
//old:http://ws.geeklab.com.ar/dolar/get-dolar-json.php 

exports.getInfoArg = async function () {

      let url_parg = "https://www.cronista.com/MercadosOnline/json/getValoresCalculadora.html"
      let $arg = await requestify.post(url_parg);
      return JSON.parse($arg.getBody());
  
  }


exports.getArgByUpperPrice = async function(json){
   return _.maxBy( _.filter(json, function(item) 
   { return _.includes(item.Nombre, 'DÓLAR'); }), function(o) { return o.Compra; });
}