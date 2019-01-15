'use strict';

let requestify = require('requestify'); ///resource for execute vendor services
let _ = require("lodash");


const getRefactObject = function (localBtc) {
    let data = localBtc
    let resp = {}
    resp.pagination = data.pagination;
    resp.results = [];

    let list = [];
    if (Number(data.data.ad_count) > 0) list = data.data.ad_list;

    _.forEach(list, function (res) {
        if (res.data.visible) {
            let local = {}
            local.profile = res.data.profile;
            local.bank = res.data.bank_name;
            local.msg = res.data.msg;
            local.min = (res.data.limit_to_fiat_amounts) ? Number(res.data.limit_to_fiat_amounts) : Number(res.data.min_amount);
            local.max = (res.data.max_amount_available) ? Number(res.data.max_amount_available) : Number(res.data.max_amount);
            local.price = res.data.temp_price,
            local.location = res.data.location_string;
            local.country = res.data.countrycode;
            local.url = res.actions.public_view;
            resp.results.push(local)
        }
    });

    return resp;
}

exports.getSellByCurrency = async function (currency) {

    let cur = String(currency);
    let localbtc = await requestify.get('https://localbitcoins.com/sell-bitcoins-online/' + cur.toUpperCase() + '/.json');
    let data = localbtc.getBody();
    let resp = getRefactObject(data);
    return resp;
}

exports.getBuyByCurrencyLocation = async function (currency) {

    let cur = String(currency);
    let localbtc = await requestify.get('https://localbitcoins.com/buy-bitcoins-online/' + cur.toUpperCase() + '/.json');
    let data = localbtc.getBody();
    let resp = getRefactObject(data);
    return resp;

}