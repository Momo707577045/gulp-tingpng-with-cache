const fs = require('fs')
const gutil = require('gulp-util')
const request = require('request')
const through = require('through2')
const prettyBytes = require('pretty-bytes')
const PluginError = gutil.PluginError // 错误提示
const TEMP_DIR = '.gulp/tinypng/' // 临时存储文件的路径
const PLUGIN_NAME = 'gulp-tinypng-with-cache' // 插件名
let AUTH_TOKEN = '' // 根据 aypi key 生成的请求头，
let cacheObj = ''  // 压缩日志文件，记录每个文件是否被压缩过，且其压缩后的体积是多少。如果比记录值大，则进行压缩
let cacheInfoPath = __dirname + '/cacheObj.json'
let keyList = [] // key 列表
let keyIndex = 0 // 当前使用第几个 Key
let compressionInfo = {
  num: 0, // 压缩的文件数
  saveSize: 0, // 节省的体积
  originSize: 0, // 文件未被压缩前总体积
  savePercent: 0, // 压缩百分比
}

// 记录压缩结果
function recordResult () {
  gutil.log(`共压缩 ${compressionInfo.num} 个文件，节省${prettyBytes(compressionInfo.saveSize)}空间，压缩百分比${((compressionInfo.saveSize / compressionInfo.originSize || 1) * 100).toFixed(0)}%`)
  fs.writeFileSync(cacheInfoPath, JSON.stringify(cacheObj))
}

// 主函数
function gulpMain ({ apiKeyList = [], cached = true }) {
  keyIndex = 0
  compressionInfo = {
    num: 0, // 压缩的文件数
    saveSize: 0, // 节省的体积
    originSize: 0, // 文件未被压缩前总体积
    savePercent: 0, // 压缩百分比
  }

  keyList = apiKeyList
  if (!apiKeyList.length) {
    throw new PluginError(PLUGIN_NAME, 'tinypny key 列表不能为空!')
  } else {
    AUTH_TOKEN = Buffer.from('api:' + apiKeyList[keyIndex]).toString('base64')
  }

  // gulp 进入的主流程
  cacheObj = JSON.parse(fs.readFileSync(cacheInfoPath) || '{}')
  return through.obj(function (file, enc, callback) {
    if (file.isStream()) {
      throw new PluginError(PLUGIN_NAME, 'Stream is not supported')
    } else if (file.isNull() || cached && cacheObj[file.relative] <= file.contents.length) { // 目标文件在缓存中存在，且不大于记录的体积
      this.push(file)
      return callback()
    } else if (file.isBuffer()) { // 正常处理的类型
      let prevLength = file.contents.length // 压缩前的大小
      // return callback()
      tinypng(file, (data) => {
        this.push(file)
        file.contents = data
        compressionInfo.num++
        compressionInfo.saveSize += prevLength - data.length
        compressionInfo.originSize += prevLength
        cacheObj[file.relative] = data.length // 记录到缓存中
        gutil.log(`压缩成功：${file.relative} 【${prettyBytes(prevLength - data.length)}】【${((1 - data.length / prevLength) * 100).toFixed(0)}%】`)
        return callback()
      })
    }
  }, function (callback) { // 全部处理完后进入的函数，记录压缩缓存
    recordResult()
    callback()
  })
}

// 检测 key 文件，使用下一个 key
function checkKey (errorMsg, cb) {
  const matchError = [  // 匹配的错误信息
    'Credentials are invalid.'
  ]
  if (keyIndex < keyList.length && matchError.indexOf(errorMsg) > -1) {
    keyIndex++
    AUTH_TOKEN = Buffer.from('api:' + keyList[keyIndex]).toString('base64') // 使用下一个 key
    cb() // 重试压缩
  } else {
    recordResult()
    gutil.log('[error] : 文件不可压缩 - ', errorMsg)
  }
}

// 压缩文件
function tinypng (file, cb) {
  request({
    method: 'POST',
    strictSSL: false,
    body: file.contents,
    url: 'https://api.tinypng.com/shrink',
    headers: {
      'Accept': '*/*',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + AUTH_TOKEN
    },
  }, function (error, response, body) {
    if (!error) {
      const results = JSON.parse(body)
      if (results.output && results.output.url) { // 获得实际下载的地址
        request.head(results.output.url, function (error) { // 通过head 请求，提前请求，确保资源存在
          const filePathName = TEMP_DIR + new Date().getTime()
          if (!error) {
            request({
              strictSSL: false,
              url: results.output.url,
            })
            .pipe(fs.createWriteStream(filePathName))
            .on('close', (...params) => {
              fs.readFile(filePathName, function (err, data) {
                cb(data)
              })
            })
          } else {
            recordResult()
            gutil.log('[error] : 文件下载错误 - ', results.message)
          }
        })
      } else {
        checkKey(results.message, tinypng.bind(null, file, cb)) // 检测 key 无效的错误码
      }
    } else {
      recordResult()
      gutil.log('[error] : 上传出错 - ', error)
    }
  })
}


module.exports = gulpMain
