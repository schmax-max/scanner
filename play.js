require('./config/connection')

const url = 'https://www.theatlantic.com/international/archive/2020/01/prince-harry-meghan-markle-hypocrisy-royals/604714/'
const {masterPerUrl} = require('./svc')
// masterPerUrl(url)


const testUrl = 'https://www.jim.com/archive/2020/01/prince-harry-meghan-markle-hypocrisy-royals/604714/.png'
// const {urlInfo} = require('./svc/urlInfo')
// const result = urlInfo (testUrl)
// console.log({result})

const {commander} = require('./svc')
const {gateway} = require('./svc/gateway')
const {body, body1, body2} = require('./tests/data')

gateway(body2, 'body')
commander(body2).then((res) => {
  // console.log({res})  
})