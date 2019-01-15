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
            local.type = res.data.trade_type;
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

exports.getTradingPostsByCurrency = async function (op, currency, page) {
    let cur = String(currency);
    let current = (page > 1 && page != undefined) ? '?page=' + Number(page) : '';
    let trade = (op.toLowerCase() == 'sell') ? 'sell' : 'buy';
    let localbtc = await requestify.get('https://localbitcoins.com/' + trade + '-bitcoins-online/' + cur.toUpperCase() + '/.json' + current);
    let data = localbtc.getBody();
    let resp = getRefactObject(data);
    return resp;
}