const gulp = require('gulp');
const pump = require('pump');
const rollupPluginUglify = require('rollup-plugin-uglify');
const rollupPluginResolve = require('rollup-plugin-node-resolve');
const rollup = require('rollup-stream');
const loadGulpPlugins = require('gulp-load-plugins');
const cleanCss = require('postcss-clean');
const normalize = require('postcss-normalize');
const importCss = require('postcss-import');
const nested = require('postcss-nested');
const autoprefixer = require('autoprefixer');
const source = require('vinyl-source-stream');
const { minify } = require('uglify-es');
const { execSync } = require('child_process');
const { readFileSync } = require('fs');

const gulpPlugins = loadGulpPlugins();
const browsers = ['>2% in DE'];

function gitRevision () {
	return execSync('git describe --tags --always --abbrev=7 --dirty', { cwd: __dirname }).toString().trim();
}

gulp.task('clean', (cb) => {
	execSync('rm -rf dist/* dev/* tmp/*', { cwd: __dirname });
	cb();
});

gulp.task('js', (cb) => {
	pump([
		rollup({
			input: 'app/main.js',
			format: 'iife',
			plugins: [
				rollupPluginResolve(),
				rollupPluginUglify({
					toplevel: true,
					mangle: {
						properties: {
							builtins: false,
							reserved: require('./node_modules/uglify-es/tools/domprops.json').concat([
								'objects', 'points', 'radius'
							]),
							keep_quoted: true
						}
					},
				}, minify)
			]
		}),
		source('main.js'),
		gulpPlugins.replace('\n', ''),
		gulpPlugins.replace('\\n', ''),
		gulpPlugins.replace('\t', ''),
		gulpPlugins.replace('\\t', ''),
		gulpPlugins.replace('__GIT_REVISION', gitRevision()),
		gulpPlugins.replace('__BUILD_DATE', new Date().valueOf()),
		gulp.dest('dist')
	], cb);
});

gulp.task('sw', (cb) => {
	pump([
		rollup({
			input: 'app/sw.js',
			format: 'es',
			plugins: [
				rollupPluginUglify({
					toplevel: true
				}, minify)
			]
		}),
		source('sw.js'),
		gulpPlugins.replace('__BUILD_DATE', new Date().valueOf()),
		gulp.dest('dist')
	], cb);
});

gulp.task('css', (cb) => {
	pump([
		gulp.src('app/main.css'),
		gulpPlugins.postcss([
			normalize({
				browsers: browsers
			}),
			autoprefixer({
				browsers: browsers
			}),
			cleanCss()
		]),
		gulp.dest('tmp')
	], cb);
});

gulp.task('copy', (cb) => {
	pump([
		gulp.src(['app/**', '!app/*.{html,css,js}', '!app/manifest.json'], { dot: true }),
		gulp.dest('dist')
	], cb);
});

gulp.task('html', (cb) => {
	pump([
		gulp.src('app/index.html'),
		gulpPlugins.htmlmin({ collapseWhitespace: true }),
		gulpPlugins.replace('${INLINE_CSS}', readFileSync('tmp/main.css')),
		gulp.dest('dist')
	], cb);
});

gulp.task('manifest', (cb) => {
	pump([
		gulp.src('app/manifest.json'),
		gulpPlugins.jsonminify(),
		gulp.dest('dist')
	], cb);
});

gulp.task('dist', gulp.parallel('clean', 'copy', 'js', gulp.series('css', 'html'), 'manifest', 'sw'));

gulp.task('watch', gulp.series('dist', () => {
	gulp.watch('app/**/*.js', gulp.series('js', 'html', 'sw'));
	gulp.watch('app/**/*.css', gulp.series('css', 'html', 'sw'));
	gulp.watch('app/*.html', gulp.series('html', 'sw'));
	gulp.watch('app/manifest.json', gulp.series('manifest', 'html', 'sw'));
	gulp.watch('app/sw.js', gulp.series('html', 'sw'));
}));

gulp.task('default', gulp.series('dist'));
