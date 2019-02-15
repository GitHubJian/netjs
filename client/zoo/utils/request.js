;(function (global, factory) {
  let o = factory

  if (typeof window !== 'undefined') {
    o = factory() // issue: SSR Compatibility
  }

  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = o
  } else if (typeof define === 'function' && define.amd) {
    define([], o)
  } else if (typeof exports === 'object') {
    exports['request'] = o
  } else {
    global['request'] = o
  }
})(this, function () {
  const qs = require('query-string')

  // 对参数中的字符串进行trim
  const trimParams = (params = {}) => {
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (typeof v === 'object') {
          trimParams(v)
        } else if (typeof v === 'string') {
          params[k] = v.trim()
        }
      })
    }
  }

  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }

  function parseRequestOptions (options) {
    let headers = {}
    if (options.headers) {
      headers = options.headers
      delete options.headers
    }
    const opts = {
      credentials: 'same-origin',

      headers: {
        ...defaultHeaders,
        ...headers,
        headers
      }
    }
    return opts
  }

  // 数据转换---------------------------------------------------
  function toQueryString (body) {
    const qsUrl = {}
    Object.keys(body).forEach(key => {
      if (body[key] !== undefined) {
        qsUrl[key] = body[key]
      }
    })
    return qs.stringify(qsUrl)
  }

  function toJSON (body) {
    return JSON.stringify(body)
  }

  function toForm (body) {
    if (body instanceof FormData) {
      return body
    }
    const form = new FormData()
    Object.keys(body).forEach(k => {
      form.append(k, body[k])
    })
    return form
  }

  // 处理基本的错误, 如500, 404等等
  function filterStatus (res) {
    if (res.status >= 200 && res.status < 300) {
      return res
    }
    return res
      .json()
      .then(data => {
        // 有一些500，但是有可读错误信息的时候，先取出错误信息
        const e = new Error((data && data.msg) || res.statusText)
        if (data && data.code) {
          e.code = data.code
        }
        return e
      })
      .catch(() => new Error(res.statusText))
      .then(err => {
        err.type = 'http'
        throw err
      })
  }

  // 解析为json格式
  function parseJSON (res) {
    return res.json().catch(err => {
      if (err) {
        err.res = res
      }
      throw err
    })
  }

  // 处理错误的返回信息(200)
  function filterData (data) {
    if (data) {
      if (data.code === 0) {
        return data.data
      } else if (!data.code && !data.msg) {
        return data
      } else if (data.msg) {
        const error = new Error(data.msg)
        error.data = data
        error.type = 'data'
        throw error
      }
    } else {
      const error = new Error(data)
      error.data = data
      error.type = 'data'
      throw error
    }
  }

  // 结果解析---------------------------------------------------
  function wrapRequest (url, opts) {
    if (
      opts.headers['Content-Type'] &&
      ~opts.headers['Content-Type'].toLowerCase().indexOf('multipart/form-data')
    ) {
      delete opts.headers['Content-Type']
    }
    let fetchResult = fetch(url, opts)

    fetchResult = fetchResult
      .then(filterStatus)
      .then(parseJSON)
      .then(filterData)

    return fetchResult
  }

  function get ({ url, params = {}, options = {} }) {
    const opts = parseRequestOptions(options)
    let urlParams = url.split('?')[1] || ''
    url = url.split('?')[0]
    try {
      urlParams = qs.parse(urlParams)
    } catch (e) {
      console.error('request:get', urlParams, e)
    }
    urlParams = Object.assign(urlParams || {}, params)

    trimParams(urlParams)
    url += `?${toQueryString(urlParams)}`

    const requestArgs = {
      method: 'GET',
      params,
      ...opts
    }
    return wrapRequest(url, requestArgs)
  }

  function post ({ url, body = {}, options = {} }) {
    const opts = parseRequestOptions(options)
    switch (true) {
      case opts.headers['Content-Type'].indexOf('application/json') >= 0:
        trimParams(body)
        body = toJSON(body)
        break
      case opts.headers['Content-Type'].indexOf(
        'application/x-www-form-urlencoded'
      ) >= 0:
        body = toQueryString(body)
        break
      case opts.headers['Content-Type'].indexOf('multipart/form-data') >= 0:
        body = toForm(body)
        break
    }
    const requestArgs = {
      method: 'POST',
      body,
      ...opts
    }
    return wrapRequest(url, requestArgs)
  }

  return {
    get,
    post
  }
})
