import gulp from 'gulp'
import sass from 'gulp-sass'
import cleanCss from 'gulp-clean-css'
import babel from 'babelify'
import composer from 'gulp-uglify/composer'
import uglifyES from 'uglify-es'
import autoprefixer from 'gulp-autoprefixer'
import concat from 'gulp-concat'
import htmlmin from 'gulp-htmlmin'
import sourcemaps from 'gulp-sourcemaps'
import browserSync from 'browser-sync'
import clean from 'gulp-clean'
import pump from 'pump'
import rimraf from 'rimraf'
import browserify from 'browserify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import moduleImporter from 'sass-module-importer'

const browsers = ['>1% in DE']
const uglify = composer(uglifyES, console)

gulp.task('clean', () => {
  rimraf.sync('dev')
  rimraf.sync('dist')
})

gulp.task('scripts', (cb) => {
  pump([
    browserify({
      entries: 'app/scripts/main.js'
    }).transform(babel.configure({
          presets: [['env', {targets: {browsers: browsers}}]]
    })).bundle(),
    source('app/scripts/main.js'),
    buffer(),
    sourcemaps.init(),
    concat('main.js'),
    uglify(),
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
      importer: moduleImporter
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
