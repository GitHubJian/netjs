/**
 * Created by hinotohui on 18/11/20.
 */

const crypto = require('crypto-js')
const Query = require('url-query-parser')
const { app: appConfig } = require('./../config/index.js')

function aesDecrypt (src, key) {
  key = crypto.enc.Utf8.parse(key)
  let iv = crypto.enc.Utf8.parse('')

  let decryptResult = crypto.AES.decrypt(src, key, {
    iv: iv,
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7
  })

  return decryptResult.toString(crypto.enc.Utf8)
}

function decrypt (raw) {
  raw = raw
    .replace(/\s/g, '+')
    .replace(/-/g, '+')
    .replace(/_/g, '/') // 可以考虑用batchReplace算法优化，但是意义不大
  return aesDecrypt(raw, appConfig.monica)
}

function parseQuery (url) {
  return Query.parse(Query.search(url))
}

module.exports = {
  decrypt,
  parseQuery
}

/*
function test(){
    return (parseQuery('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=1&rsv_pq=cbf172b8000075b9&rsv_t=dc5c3JC4eJ95tTp2Ut6OLxwMi1Ia060%2F6SbI9aH2O5HkdIh2%2Fl0ZYNg2Vic&rqlang=cn&rsv_enter=1&rsv_sug3=1&rsv_sug1=1&rsv_sug7=100&rsv_sug2=0&inputT=230&rsv_sug4=230'))
}

if(process.env.NODE_ENV!=='production'){
    let query=test()
    console.log(query.get('rsv_t',0))
}
*/
