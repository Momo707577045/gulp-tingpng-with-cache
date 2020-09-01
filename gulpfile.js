let gulp = require('gulp')
let tinypng = require('./index')

const projectPath = '/Users/panyanbing/Desktop/intruction/test/test-tiny'
const TINYPNG_API_LIST = [
  // 'XgNgkoyWbdIZd8OizINMjX2TpxAd_Gp3',
  // 'IAl6s3ekmONUVMEqWZdIp1nV2ItJL1PC',
  'IAl6s3ekmONUVMEqWZdIp1nV2ItJLyPC',
  // 'b8LL1XQ3RwX3lC752S4zLTtTktDTkrFV',
]

gulp.task('tinypng', function () {
  return gulp.src(projectPath + '/**/*.png', { base: './' })
  .pipe(tinypng({
    apiKeyList: TINYPNG_API_LIST,
    cached: false,
    // cacheFilePath: '', // 默认 __dirname + '/cacheObj.json'
  }))
  .pipe(gulp.dest('./', { overwrite: true }))
})
