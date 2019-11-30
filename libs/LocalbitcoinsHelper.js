"use strict";

let _ = require("lodash");
const date = require("date-and-time");
const rp = require("request-promise");

const getStatusLabel = function(minutes) {
  let status = "OFFLINE";
  if (minutes >= 0 && minutes < 17) {
    status = "ONLINE";
  } else if (minutes >= 17 && minutes < 223) {
    status = "AWAY";
  }
  return status;
};

const getOnlineStatus = function(datetime) {
  let now = new Date();
  let postDate = new Date(datetime);
  let mins = date.subtract(now, postDate).toMinutes();
  return getStatusLabel(mins);
};

const getRefactObject = function(localBtc) {
  let data = localBtc;
  let resp = {};
  resp.pagination = data.pagination;
  resp.results = [];

  let list = [];
  if (Number(data.data.ad_count) > 0) list = data.data.ad_list;

  _.forEach(list, function(res) {
    if (res.data.visible) {
      let local = {};
      local.profile = res.data.profile;
      local.profile.last_online = getOnlineStatus(local.profile.last_online);
      local.type = res.data.trade_type;
      local.bank = res.data.bank_name;
      local.msg = res.data.msg;
      local.currency = res.data.currency;
      local.min = res.data.limit_to_fiat_amounts
        ? Number(res.data.limit_to_fiat_amounts)
        : Number(res.data.min_amount);
      local.max = res.data.max_amount_available
        ? Number(res.data.max_amount_available)
        : Number(res.data.max_amount);
      (local.price = parseFloat(res.data.temp_price)),
        (local.location = res.data.location_string);
      local.country = res.data.countrycode;
      local.url = res.actions.public_view;
      resp.results.push(local);
    }
  });

  return resp;
};

exports.getTradingPostsByCurrency = async function(op, currency, page) {
  let cur = String(currency);
  let current = page > 1 && page != undefined ? "?page=" + Number(page) : "";
  let trade = op.toLowerCase() == "sell" ? "sell" : "buy";

  let url_localbtc =
    "https://localbitcoins.com/" +
    trade +
    "-bitcoins-online/" +
    cur.toUpperCase() +
    "/.json" +
    current;

  let data = await rp({
    method: "GET",
    uri: url_localbtc,
    json: true,
    gzip: true
  });

  let resp = getRefactObject(data);
  return resp;
};

exports.getTradingPostsByLocation = async function(
  op,
  location,
  country,
  page
) {
  let local = String(location);
  let name = String(country);
  let current = page > 1 && page != undefined ? "?page=" + Number(page) : "";
  let trade = op.toLowerCase() == "sell" ? "sell" : "buy";

  let url_localbtc =
    "https://localbitcoins.com/" +
    trade +
    "-bitcoins-online/" +
    local.toLowerCase() +
    "/" +
    name.toLowerCase() +
    "/.json" +
    current;

  let data = await rp({
    method: "GET",
    uri: url_localbtc,
    json: true,
    gzip: true
  });

  let resp = getRefactObject(data);
  return resp;
};
