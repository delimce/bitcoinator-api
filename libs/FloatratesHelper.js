'use strict';

let _ = require("lodash");
const axios = require('axios');
let currencies = ['eur','ars'];

const getFiats = async function () {
    let url = "https://floatrates.com/daily/usd.json"
    let result = {}
    try {
       result = await axios({
          method: 'get',
          timeout: 40000,
          url: url,
          json: true,
          gzip: true
       })
    } catch (error) {
       console.log(error)
    } finally {
       return result.data;
    }
 
 }

 exports.getInfoFiats = async function(){
        let fiats = await getFiats();
        let values = []
        currencies.forEach(function(item){
            let temp = fiats[item]
            values.push(temp)
        });
        return values;

 }