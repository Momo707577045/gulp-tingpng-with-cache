let gulp = require('gulp');
let tinypng = require('./index');

const projectPath = '/Users/panyanbing/Desktop/intruction/test/test-tiny'
const TINYPNG_API = "XgNgkoyWbdIZd8OizINMjX2TpxAd_Gp3";

gulp.task('tinypng', function () {
  return gulp.src(projectPath + '/**/*.png', { base: './' })
  .pipe(tinypng({
    apiKey: TINYPNG_API,
    cached: true
  }))
  .pipe(gulp.dest('./', { overwrite: true }));
});
