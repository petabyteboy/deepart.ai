import gulp from 'gulp'
import sass from 'gulp-sass'
import cleanCss from 'gulp-clean-css'
import autoprefixer from 'gulp-autoprefixer'
import htmlmin from 'gulp-htmlmin'
import sourcemaps from 'gulp-sourcemaps'
import browserSync from 'browser-sync'
import pump from 'pump'
import rimraf from 'rimraf'
import rollup from 'gulp-rollup'
import rollupResolve from 'rollup-plugin-node-resolve'
import rollupBabel from 'rollup-plugin-babel'

const browsers = ['>1% in DE']

gulp.task('clean', () => {
  rimraf.sync('dev')
  rimraf.sync('dist')
})

gulp.task('scripts', (cb) => {
  pump([
    gulp.src('app/scripts/main.js'),
    sourcemaps.init(),
    rollup({
      allowRealFiles: true,
      input: 'app/scripts/main.js',
      format: 'iife',
      plugins: [
        rollupResolve(),
        rollupBabel({
          babelrc: false,
          presets: [
            [
              'env',
              {
                targets: {browsers: browsers},
                modules: false
              }
            ]
          ],
          plugins: ['external-helpers']
        }),
      ]
    }),
    gulp.dest('dist'),
    sourcemaps.write(),
    gulp.dest('dev')
  ], cb)
})

gulp.task('styles', (cb) => {
  pump([
    gulp.src('app/styles/main.scss'),
    sourcemaps.init(),
    sass({
      includePaths: [
        __dirname + '/bower_components',
        __dirname + '/node_modules'
      ]
    }),
    autoprefixer({
      browsers: browsers
    }),
    cleanCss(),
    gulp.dest('dist'),
    sourcemaps.write(),
    gulp.dest('dev'),
    browserSync.stream()
  ], cb)
})

gulp.task('copy', (cb) => {
  pump([
    gulp.src(['app/**', '!app/**/*.{html,css,scss,js}'], {dot: true}),
    gulp.dest('dist'),
    gulp.dest('dev')
  ], cb)
})

gulp.task('html', (cb) => {
  pump([
    gulp.src('app/**/*.html'),
    htmlmin(),
    gulp.dest('dist'),
    gulp.dest('dev')
  ], cb)
})

gulp.task('serve', ['dist'], () => {
  browserSync.init({
    server: {
      baseDir: 'dev'
    }
  })

  gulp.watch('app/**/*.html', ['html', browserSync.reload])
  gulp.watch('app/**/*.js', ['scripts', browserSync.reload])
  gulp.watch('app/**/*.{scss,css}', ['styles'])
})

gulp.task('dist', ['clean', 'scripts', 'styles', 'copy', 'html'])

gulp.task('default', ['dist'])
