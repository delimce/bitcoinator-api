[![An old rock in the desert](https://www.delimce.com/images/github_dev_logo.png "go to develemento")](http://delimce.com)
# Bitcoinator api
Restful API for Crypto & Fiat requests information to feed websites and mobile aplications, (builded with Venezuela's situation in mind :D) 
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
