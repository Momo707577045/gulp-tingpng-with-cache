let gulp = require('gulp')
let tinypng = require('./index')

const projectPath = __dirname + '/test-img' // 测试项目路径，可通过 test-img-origin 恢复未压缩前图片
const apiKeyList = [
  // 'XgNgkoyWbdIZd8OizINMjX2TpxAd_Gp3', // 无效 key
  // 'IAl6s3ekmONUVMEqWZdIp1nV2ItJL1PC', // 无效 key
  'IAl6s3ekmONUVMEqWZdIp1nV2ItJLyPC', // 有效 key
]

gulp.task('default', function () {
  return gulp.src([
    projectPath + '/**/*.png',
    projectPath + '/**/*.jpg',
    projectPath + '/**/*.jpeg',
    '!/**/node_modules/*', // 忽略无需遍历的文件，路径匹配语法参考：https://www.gulpjs.com.cn/docs/getting-started/explaining-globs/
  ], {
    base: './', // 对文件使用相路径，为了后面覆盖源文件
    nodir: true, // 忽略文件夹
  })
  .pipe(tinypng({
    apiKeyList,
    cacheFilePath: __dirname + '/tinyPngCache.json', // 不设置，则不进行缓存过滤
    recordFilePath: __dirname + '/tinyPngRecord.json', // 不设置，则不进行日志记录
  }))
  .pipe(gulp.dest('./', { overwrite: true })) // 覆写原文件
})