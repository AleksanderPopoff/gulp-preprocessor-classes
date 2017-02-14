# gulp-preprocessor-classes

Этот плагин будет полезен тем кто часто и много верстает используя фрэймворки CSS.

Лично я часто использую bootstrap но но моя наработка может быть полезна и для других css FW.

И так рассмотрим ситуацию: 

...class="col-lg-3 col-lg-offset-0 col-md-4 col-md-offset-1 col-sm-5 col-sm-offset-2 col-xs-6 col-xs-offset-3"...

теперь попробуем записать эту же строку но вот так:

...class="col-[lg,md,sm,xs]-[3,4,5,6] col-[lg,md,sm,xs]-offset-[0,1,2,3]"...

добавляем в наш gulpfile.js:

var htmlClass = require('gulp-preprocessor-classes');

и, используем:

gulp.task('default', function () {
    gulp.src('./index.php').pipe(htmlClass()).pipe(gulp.dest('./'));
});

