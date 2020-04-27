const superagent = require('superagent')
const cherrio = require('cheerio')

const url = 'https://my.ishadowx.biz/'
const select = '.portfolio-items .portfolio-item'

// const select = '#free .container .row:nth-child(2) > .col-sm-4'
const translator = {
  'IP Address': 'address',
  Port: 'port',
  Password: 'password',
  Method: 'method'
}

function parseServer (serverStr) {
  const server = {}
  serverStr.split('\n').forEach(function (line) {
    let kv = line.split(':')
    if (kv.length === 1) {
      kv = line.split('：')
    }
    if (kv.length > 1) {
      const key = kv[0].trim()
      const val = kv[1].trim()
      const trueKey = translator[key]
      if (trueKey) {
        server[trueKey] = val
      }
    }
  })
  return server
}

function loadFreeShadowsocks () {
  const freeShadowsocks = []
  return superagent.get(url).then(function (res) {
    const $ = cherrio.load(res.text)
    $(select).each(function (i, elem) {
      freeShadowsocks.push(
        parseServer(
          $(this).text().trim()
        )
      )
    })
    return Promise.resolve(freeShadowsocks)
  })
}

module.exports = loadFreeShadowsocks

if (require.main === module) {
  loadFreeShadowsocks().then(function (freeShadowsocks) {
    console.log(freeShadowsocks)
  }, function (err) {
    console.error(err)
  })
}
