'use strict';

let _ = require("lodash");
const rp = require('request-promise');

const petro_api_url = 'https://petroapp-price.petro.gob.ve/price/';

const getPetroValue = async function () {
    let url_parg = petro_api_url
    return await rp({
        method: 'POST',
        uri: url_parg,
        json: true,
        gzip: true,
        qs: {
            "coins": [
                "PTR"
            ],
            "fiats": [
                "USD"
            ]
        }
    })
}

exports.getValue = function () {
    let petro = getPetroValue()
    return Number(petro.getPetroValue.PTR.USD)
}