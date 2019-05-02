var gulp = require("gulp"),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    ejs = require("gulp-ejs"),
    watch = require("gulp-watch"),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    svgSprite = require('gulp-svg-sprite'),
    browserSync = require('browser-sync').create();

    // SVG Config
var config = {
  mode: {
    symbol: { // symbol mode to build the SVG
      dest: 'sprite', // destination folder
      sprite: 'sprite.svg', //sprite name
      example: true // Build sample page
    }
  },
  svg: {
    xmlDeclaration: false, // strip out the XML attribute
    doctypeDeclaration: false // don't include the !DOCTYPE declaration
  }
};

    // browsersync sass and templates change
    gulp.task('serve', function() {

        browserSync.init({
          server: "dist/"
        });

        gulp.watch('assets/scss/**/*.scss' , gulp.series('sass'));
        gulp.watch('assets/templates/**/*.ejs' , gulp.series('templates'));
        
        gulp.watch('dist/css/styles.css').on('change', browserSync.reload);
        gulp.watch('dist/*.html').on('change', browserSync.reload);
    });

    // sass compilation
    gulp.task('sass', function () {
       return gulp.src('assets/scss/**/*.scss')
          .pipe(sass())
          .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
          .pipe(gulp.dest('./dist/css'))
          .pipe(browserSync.stream());
    });

    // minify css
    gulp.task('minify-css', function() {
      return gulp.src('dist/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css/'));
    });

    // compile ejs templates
    gulp.task('templates', function () {
       return gulp.src('assets/templates/*.ejs')
         .pipe(ejs({}, {ext:'.html'}))
         .pipe(gulp.dest('./dist'))
         .pipe(browserSync.stream());
    });

    // create svg sprite
    gulp.task('sprite-page', function() {
      return gulp.src('assets/svg/**/*.svg')
      .pipe(svgSprite(config))
      .pipe(gulp.dest('dist/'));
    });
    
    // create shortcut to svg sprite
    gulp.task('sprite-shortcut', function() {
      return gulp.src('dist/sprite/sprite.svg')
      .pipe(gulp.dest('dist/'));
    });

    // watch sass and templates
    gulp.task('watch', function() {
        gulp.watch('assets/scss/**/*.scss' , gulp.series('sass'));
        gulp.watch('assets/templates/**/*.ejs' , gulp.series('templates'));
        gulp.watch('assets/svg/*.svg' , ['svg']);
    });
    gulp.task('svg', gulp.parallel(['sprite-page', 'sprite-shortcut']));

    gulp.task('default', gulp.parallel('serve'));
