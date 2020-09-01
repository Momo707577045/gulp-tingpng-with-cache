let gulp = require('gulp')
let tinypng = require('./index')

const projectPath = __dirname + '/test-img' // 测试图片，可通过 test-img-origin 恢复未压缩前图片
const apiKeyList = [
  // 'XgNgkoyWbdIZd8OizINMjX2TpxAd_Gp3',
  // 'IAl6s3ekmONUVMEqWZdIp1nV2ItJL1PC',
  'IAl6s3ekmONUVMEqWZdIp1nV2ItJLyPC',
  // 'b8LL1XQ3RwX3lC752S4zLTtTktDTkrFV',
]

gulp.task('default', function () {
  return gulp.src([
    projectPath + '/**/*.png',
    projectPath + '/**/*.jpg',
    projectPath + '/**/*.jpeg',
  ], { base: './' })
  .pipe(tinypng({
    apiKeyList,
    cacheFilePath: __dirname + '/tinyPngCache.json', // 不设置，则不进行缓存过滤
    recordFilePath: __dirname + '/tinyPngRecord.json', // 不设置，则不进行日志记录
  }))
  .pipe(gulp.dest('./', { overwrite: true }))
})
