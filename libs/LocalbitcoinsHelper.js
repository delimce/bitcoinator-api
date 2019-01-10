'use strict';

let requestify = require('requestify'); ///resource for execute vendor services
let _ = require("lodash");

exports.getSellByCurrency = async function (currency) {

    let cur = String(currency);
    let localbtc = await requestify.get('https://localbitcoins.com/sell-bitcoins-online/' + cur.toUpperCase() + '/.json');
    let data = localbtc.getBody();
    let pagination = data.pagination;

    let list = [];
    let results = [];

    if (Number(data.data.ad_count) > 0) list = data.data.ad_list;

    _.forEach(list, function (res) {
        if (res.data.visible) {
            let newSell = {}
            newSell.profile = res.data.profile;
            newSell.bank = res.data.bank_name;
            newSell.msg = res.data.msg;
            newSell.min = Number(res.data.min_amount);
            newSell.max = (res.data.max_amount_available) ? Number(res.data.max_amount_available) : Number(res.data.max_amount);
            newSell.price = res.data.temp_price,
            newSell.location = res.data.location_string;
            newSell.url = res.actions.public_view;
            results.push(newSell)
        }
    });

    return results;



}