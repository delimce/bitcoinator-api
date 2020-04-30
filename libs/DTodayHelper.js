'use strict';

let _ = require("lodash");
const axios = require('axios');

exports.getToday = async function () {
   let url_dtoday = "https://s3.amazonaws.com/dolartoday/data.json"
   let result = {}
   try {
      result = await axios({
         method: 'get',
         timeout: 40000,
         url: url_dtoday,
         json: true,
         gzip: true
      })
   } catch (error) {
      console.log(error)
   } finally {
      return result.data;
   }

}

exports.goldPriceGram = async function (oz_price) {
   let gramxOz = 0.035274;
   return gramxOz * oz_price

}
