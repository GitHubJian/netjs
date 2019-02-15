const { parseQuery, decrypt } = require('./../persist/utils/decode.js')
const { get: getResultFromSql } = require('./../persist/mysql/index.js')
const { get: getResultFromKV } = require('./../persist/kv/index.js')
const {
  get: getRedisValue,
  set: setRedisValue
} = require('./../persist/redis/index.js')
const querystring = require('query-string')
// 请求文章
const FeedDetailApiUrl = `/weball/api/proxy/resource/article/feedDetail`
// 请求顶部广告
const TopArticleAdvertisePath = `/weball/api/proxy/top/article/advertise`
// 配置 config
const { news: appConfig } = require('./config.js')

// 解析 UserAgent
// oem_wnl ==> 4
// oem_opera ==> -5
const userType2ProductTypeMap = {
  1: -3,
  oem_wnl: -2,
  oem_opera: -5,
  4: -2,
  5: -5
}

function parseUserAgent (ua = '') {
  // app 在白名单中的没有推广位
  let appWhiteList = {
    sogousearch: 0,
    weixinheadline: 1,
    sogouqudu: 2,
    sogouhealthbook: 3,
    ttnews: 4,
    sogoumobilebrowser: 5,
    TopTenNews: 6,
    TodayRead: 7,
    XiangYang: 8
  }

  let [appWhiteListKey, appWhiteListVal] = Object.entries(appWhiteList).reduce(
    (prev, [k, v]) => {
      prev[0].push(k)
      prev[1].push(v)

      return prev
    },
    [[], []]
  )

  let res = {
    isMyApp: false, // App 是否在白名单中
    appWhiteVal: -1, // App 白名单中的 Val
    appWhiteListVal: appWhiteListVal, // App 白名单可用的 appWhiteVal
    os: 'unknown'
  }

  // 是否匹配白名单
  ua = ua.toLowerCase()
  let matchResult = ua.match(new RegExp(appWhiteListKey.join('|')))
  if (!matchResult) {
    res.isMyApp = false
    res.appWhiteVal = -1 // App Value
  } else {
    res.isMyApp = true
    res.appWhiteVal = appWhiteList[matchResult[0]]
  }

  // 是否移动端
  res.isMobile = true
  if (ua.match(/ios|iphone|ipad|ipod/)) {
    res.os = 'ios'
  } else if (ua.match(/android/)) {
    res.os = 'android'
  } else {
    res.os = 'unknown'
    res.isMobile = false
  }

  res.isWechat = ua.indexOf('micromessenger')
  res.isMQB = ua.indexOf('mqqbrowser') !== -1

  return res
}

// 目前用于 feedDetail
function parseRedisData (data) {
  if (!data) return null
  try {
    let feedDetail = JSON.parse(data)['feedDetail']

    if (feedDetail) {
      let result = {
        openid: feedDetail['openid'] || '',
        title: feedDetail['title'] || '',
        nickName: feedDetail['nickName'] || '',
        sourceType: feedDetail['sourceType'] || '',
        content: feedDetail['content'] || '',
        sendTime: feedDetail['sendTime'] || ''
      }

      return result
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

function parseKVData (data) {
  if (!data) return null

  try {
    let articleData = JSON.parse(data)['articleData'] || {}
    let author = articleData['author'] || {}

    if (articleData) {
      let result = {}

      result['openid'] = author['openid'] || ''
      result['title'] = articleData['title'] || ''
      result['nickName'] = author['nickname'] || ''
      result['sourceType'] = articleData['source_type'] || ''
      result['content'] = articleData['content'] || ''
      result['sendTime'] = articleData['publish_time'] || ''

      return result
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

function parseAdData (data) {
  if (!data) return null

  try {
    data = JSON.parse(data)

    if (!data.status) return null

    return data['result'][0]
  } catch (e) {
    return null
  }
}

function createParams (ctx) {
  let params = {
    xid: appConfig.xid, //
    mid: appConfig.mid, //
    docUrl: '', // 文章链接信息
    uaInfo: {}, // UserAgent 信息
    redisKey: undefined, //
    pid: '', //
    subid: -1, //
    productType: '',
    os: 'unknown'
  }

  let req = ctx.queryParams['req']

  if (req) {
    try {
      let result = JSON.parse(decrypt(req)) || {}
      params.docUrl = result.url || ''
    } catch (e) {
      return {
        params: null,
        adParams: null
      }
    }
  } else {
    // 处理请求参数异常
    return {
      params: null,
      adParams: null
    }
  }
  let uaInfo = parseUserAgent(ctx.request.header['user-agent'])
  params.uaInfo = uaInfo
  params.redisKey = `${req}&appWhiteVal=${uaInfo.appWhiteVal}`
  // 获取页面链接来源
  let referer = ctx.header['referer']
  if (referer) {
    let queryParams = parseQuery(referer)
    params.pid = queryParams.get('pid', 0) || queryParams.get('bid', 0) || '' // I dont know
  } else {
    params.pid = ''
  }

  // 获取userType类型 肯定会存在？？？
  let userType = ctx.params.userType
  params.subid = +userType === 1 ? 0 : -1 // 查询 weball 源码，应该是给后端发的一个参数
  params.productType = userType2ProductTypeMap[userType] || ''
  params.os = uaInfo['os']

  let appInfo = ctx.queryParams['appinfo'] || ''

  let realip = ctx.realip || ''

  let adParams = {
    appinfo: encodeURIComponent(appInfo),
    xid: encodeURIComponent(params.xid),
    mid: encodeURIComponent(params.mid),
    os: uaInfo['os'],
    subid: params.subid,
    ip: encodeURIComponent(realip),
    title: '',
    docid: encodeURIComponent(params.docUrl),
    type: params.productType,
    count: 1
  }

  return {
    params,
    adParams
  }
}

async function control (ctx) {
  let { params: pageParams, adParams } = createParams(ctx)
  if (!pageParams) {
    ctx.articleResult = null
    ctx.adResult = null
    ctx.pageInfo = {}
    return
  }

  // 当前页面的参数
  ctx.pageParams = pageParams

  let redisLog4jId = ctx.log4j.add('Redis')

  let result = await getRedisValue(ctx.pageParams.redisKey).then(async data => {
    if (data) {
      return JSON.parse(data)['feedDetail']
    }

    return null
  })

  ctx.log4j.get(redisLog4jId).end()

  if (!result) {
    let kvLog4jId = ctx.log4j.add('KV')

    let res = await getResultFromKV(
      FeedDetailApiUrl + '?doc_id=' + (ctx.pageParams.docUrl || ''),
      appConfig.retryTimes
    )

    result = parseKVData(res)

    ctx.log4j.get(kvLog4jId).end()

    if (result) {
      setTimeout(() => {
        setRedisValue(
          ctx.pageParams.redisKey,
          JSON.stringify({ feedDetail: res })
        )
      })
    }
  }

  // 文章内容
  ctx.articleResult = result

  /** ************ 顶部广告逻辑 START **************/
  // userType === 1 && pid && first_channel in HasTopAdWhiteList 存在顶部广告
  // userType in NeedTopadList 存在顶部广告
  // other 不存在顶部广告
  let topadLog4jId = ctx.log4j.add('Topad')

  const HasTopAdWhiteList = [
    '无线-银河',
    '无线其他搜索',
    '无线输入法信息推荐',
    '无线其他',
    '无线外购'
  ]
  const NeedTopadList = ['oem_wnl', 'oem_opera', '4', '5']

  ctx.adParams = adParams
  adParams.title = encodeURIComponent((result && result.title) || '') || ''
  let userType = String(ctx.params.userType) // 取 URL 中的 userType
  let pid = ctx.pageParams.pid || ctx.pageParams.bid || ''
  let adQueryString = querystring.stringify(ctx.adParams)
  let adResult = null
  let adPromise

  if (userType === '1') {
    if (pid) {
      let query = {
        sql: 'select * from wx_channel where stdpid = ?',
        values: [pid]
      }

      adPromise = getResultFromSql(query).then(data => {
        if (!data || !data.length) {
          return null
        } else {
          let firstChannel = data[0]['first_channel']

          if (HasTopAdWhiteList.includes(firstChannel)) {
            return getResultFromKV(
              TopArticleAdvertisePath + '?' + adQueryString,
              appConfig.retryTimes
            )
          } else {
            return null
          }
        }
      })
    }
  } else {
    if (NeedTopadList.includes(userType)) {
      adPromise = getResultFromKV(
        TopArticleAdvertisePath + '?' + adQueryString,
        appConfig.retryTimes
      )
    }
  }

  if (adPromise) {
    adResult = await adPromise
    adResult = parseAdData(adResult)
  }

  ctx.log4j.get(topadLog4jId).end()

  // 广告内容
  ctx.adResult = adResult
  /** ************ 顶部广告逻辑 END **************/

  // 信息
  ctx.pageInfo = Object.assign(
    {
      userType: ctx.pageParams.userType || 0,
      productType: ctx.pageParams.productType,
      appWhiteVal: ctx.pageParams.appWhiteVal,
      docUrl: ctx.pageParams.docUrl,
      uuid: ctx.uuid,
      xid: ctx.pageParams.xid,
      mid: ctx.pageParams.mid,
      os: ctx.pageParams.os,
      isMyApp: ctx.pageParams.uaInfo.isMyApp || false
    },
    ctx.queryParams
  )
}

module.exports = {
  controller: control
}
