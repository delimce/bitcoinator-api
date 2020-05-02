'use strict';

let _ = require("lodash");
const axios = require('axios');


//new:https://www.cronista.com/MercadosOnline/json/getValoresCalculadora.html
//old:http://ws.geeklab.com.ar/dolar/get-dolar-json.php 

exports.getInfoArg = async function () {

   let result = {}
   try {
      result = await axios({
         method: 'get',
         timeout: 40000,
         url: 'https://www.cronista.com/MercadosOnline/json/getValoresCalculadora.html'
      })
   } catch (error) {
      console.log(error)

   } finally {
      return result.data;
   }




}

const getArsCurrencies = async function (json) {
   return _.filter(json, function (item) { return _.includes(item.Nombre, 'DÓLAR'); })
}

exports.getArgByUpperPrice = async function (json) {
   return _.maxBy(await getArsCurrencies(json), function (o) { return o.Compra; });
}

exports.getArsCurrencies = getArsCurrencies