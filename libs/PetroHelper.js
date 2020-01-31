'use strict';

let _ = require("lodash");
const rp = require('request-promise');

const petro_api_url = 'https://petroapp-price.petro.gob.ve/price/';

exports.getValue = async function () {

    let options = {
        method: 'post',
        uri: petro_api_url,
        qs: {
            coins: [
                "PTR"
            ],
            fiats: [
                "USD"
            ]
        },
        headers: {
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest"
            
        },
        json: true // Automatically parses the JSON string in the response
    };



  let result = await  rp(options)
        .then(function (body) {
            console.log(body)
            // Request succeeded but might as well be a 404
            // Usually combined with resolveWithFullResponse = true to check response.statusCode
        })
        .catch(function (err) {
            console.log(err);
        });

     console.log(petro)
     return Number(petro.data.PTR.USD)
}