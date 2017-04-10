const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const inject = require('gulp-inject');
const concat = require('gulp-concat');
const css2js = require('gulp-css2js');
const uglify = require('gulp-uglify');
const es = require('event-stream');
const order = require('gulp-order');
const cleancss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const proxy = require('http-proxy-middleware');

var apiServer = null;

config = {
    js: './src/js/**/*.js',
    css: './src/css/**/*.css',
    html: './src/**/*.html',
    devServer: './devServer',
    tmp: './.tmp',
    src: './src',
    dist: './dist'
}

var toDevServerProxy = proxy('/stratum', {
    target: 'http://localhost:3005'
});

gulp.task('styles:dev', () => {
    return gulp.src(config.css)
        .pipe(browserSync.stream())
        .pipe(gulp.dest(config.tmp + '/css/'));
});

gulp.task('scripts:dev', () => {
    return gulp.src([config.js, `!${config.src}/js/StatKOLSV.js`, `!${config.src}/js/widget.js`, `!${config.src}/js/styles.js`])        
        .pipe(gulp.dest(config.tmp + '/js/'));        
});

gulp.task('scripts-reload:dev', ['scripts:dev'], (done)=> {
    browserSync.reload();
    done();
});

gulp.task('inject:dev', ['scripts:dev', 'styles:dev'], () => {
    var sources = gulp.src([`${config.tmp}/**/*`], {
        read: false
    });
    return gulp.src(config.src + '/index.html')
        .pipe(inject(sources, {
            relative: false,
            ignorePath: ['.tmp']
        }))
        .pipe(gulp.dest(config.tmp + '/'));
});

gulp.task('clean:build', () => {
    return del([config.dist + '/*', config.tmp + '/js/styles.js'])
        .then(paths => console.log('Deleting:\n', paths.join('\n')));
});

gulp.task('styles:build', ['clean:build'], () => {
    return gulp.src([config.css])
        .pipe(cleancss({
            compatibility: 'ie8'
        }))
        .pipe(css2js({
            prefix: 'Ext.util.CSS.createStyleSheet("',
            suffix: '");',
            splitOnNewline: false,
        }))
        .pipe(gulp.dest(config.tmp + '/js/'));
});

gulp.task('scripts:build', ['clean:build', 'styles:build'], () => {
    return gulp.src([config.js, `!${config.src}/js/StatKOLSV.js`, `!${config.src}/js/widget.js`, `${config.tmp}/js/styles.js`, `!${config.src}/js/**/*.dev.js`])
        // .pipe(sourcemaps.init())
        .pipe(order([
            'definitions/*.js',
            'utils/*.js',
            'styles.js',
            'init.js'
        ]))
        .pipe(concat('gaugeWidjet.js'))
        // .pipe(uglify())
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.dist + '/js/'));
});

gulp.task('inject:build', ['scripts:build'], () => {
    var sources = gulp.src([config.dist + '/js/*.js'], {
        read: false
    });
    return gulp.src('./src/index.html')
        .pipe(inject(sources, {
            relative: false,
            ignorePath: ['dist']
        }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('serve:build', ['inject:build'], () => {
    apiServer = nodemon({
        script: './devServer/dev-server.js'
    });
    apiServer.on('start', function () {
        browserSync.init({
            server: {
                port: 3000,
                baseDir: './dist',
                middleware: [toDevServerProxy]
            }
        });
    });
});

gulp.task('build', ['inject:build']);


gulp.task('serve:dev:api', ['inject:dev','watch:dev'], () => {
    apiServer = nodemon({
        script: './devServer/dev-server.js',
        tasks: ['scripts-reload:dev']
    });
    apiServer.on('start', function () {
        browserSync.init({
            server: {
                port: 3000,
                baseDir: config.tmp,
                middleware: [toDevServerProxy]
            }
        });
        cb();
    });
});

gulp.task('watch:dev', () => {    
    gulp.watch(config.js, ['scripts-reload:dev']);
    gulp.watch(config.css, ['styles:dev']);
});

process.on('exit', function () {
    // In case the gulp process is closed (e.g. by pressing [CTRL + C]) stop both processes    
});

gulp.task('default', ['serve:dev:api']);