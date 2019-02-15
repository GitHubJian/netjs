const { newsController } = require('../controller/index.js')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  '/sogou/detail/:productType/:userType': async function (ctx) {
    let routerLog4jId = ctx.log4j.add('Router整体')

    await newsController(ctx)
    ;[1, 3].includes(+ctx.params.userType) && needModifyContent(ctx)

    ctx.__SSR_TITLE__ =
      (ctx.articleResult && ctx.articleResult.title) || 'Error'

    ctx.__SSR_CONTENT__ = {
      articleResult: ctx.articleResult || null,
      adResult: ctx.adResult || null,
      pageInfo: ctx.pageInfo,
      _msg_: 'success'
    }

    !isProduction && console.log(ctx.__SSR_CONTENT__)

    ctx.log4j.get(routerLog4jId).end()
  }
}

function needModifyContent (ctx) {
  let pageInfo = ctx.pageInfo
  if (!pageInfo.isMyApp) {
    let articleResult = ctx.articleResult
    if (articleResult) {
      let html = articleResult.content
      if (html) {
        let reg = /<img src=[\"|\']([\s\S]*?)[\"|\'] data-size=[\"|\']([\s\S]*?)[\"|\'] data-ratio=[\"|\']([\s\S]*?)[\"|\'] data-type=[\s\S]*?>\s*?/

        html = html.replace(reg, (word, $1, $2, $3, $4) => {
          let [w] = $2.split(',')
          let ratio = +$3
          if (+w > 240 && ratio >= 0.51 && ratio <= 1.8) {
            return `
              <div class="__EXPOSURE_CL_ZONE__ __EXPOSURE_PV_ZONE__" data-zone="e0">
                <div class="rd-inject__zone __INVOKE_ZONE__" data-zone="i0">
                  <div class="pgc-img">
                    <img src="${$1}">
                    <div class="btn-ad">
                    <span>打开APP，查看更多精彩资讯</span>
                    </div>
                  </div>
                </div>
              </div>
              `
          } else {
            return word
          }
        })
      }

      articleResult.content = html
    }
  }
}
