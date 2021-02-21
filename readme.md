[![An old rock in the desert](https://www.delimce.com/images/github_dev_logo.png "go to develemento")](http://delimce.com)
# Bitcoinator api
Restful API for Crypto & Fiat requests information to feed websites and mobile aplications, (builded with Venezuela's situation in mind :D) 

# DEPRECATED: this project is now deprecated, the new api that we continue updating will be -> Rekorbapi
You could find more information in this repo:
https://github.com/delimce/rekorbapi

## Getting started
```bash
git clone https://github.com/delimce/bitcoinator-api
npm install
#create folder for caching files
mkdir /path/to/caching/files
#rename .env.example file and setting up your own values
mv .env.example .env
npm start
 ```
#IMPORTANT! you'll need setting coinmarketcap api key var, (CMC_API_KEY) to use endpoints for cryptocurrency information.
More info in: https://coinmarketcap.com/api/documentation/v1/#section/Quick-Start-Guide

## Api documentation

#### get all coinmarketcap assets
**GET** http://localhost:8080/cmc/coins --cache: applied
*List all cmc assets*

#### get coin by id 
**GET** http://localhost:8080/cmc/coins/coin-id  --cache: applied
*List coin data by id, eX: bitcoin*

#### show a webpage with some assets information
**GET** http://localhost:8080/cmc/myCoins --cache: applied
*List coins data in html format*
