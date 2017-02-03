const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const inject = require('gulp-inject');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const es = require('event-stream');
const order = require('gulp-order');
const cleancss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

var apiServer = null;

config = {
    js: './src/js/**/*.js',
    css: './src/css/**/*.css',
    html: './src/**/*.html',
    src: './src',
    dist: './dist'
}

gulp.task('start:api', (cb) => {
    apiServer = nodemon({
        script: 'dev-server.js',
        watch: ['dev-server.js'],
        tasks: ['watch']
    });
    cb();
});

gulp.task('inject:dev', () => {
    var sources = gulp.src([config.css, config.js, `!${config.src}/js/StatKOLSV.js`, `!${config.src}/js/widget.js`], {
        read: false
    });
    return gulp.src(config.src + '/index.html')
        .pipe(inject(sources, {
            relative: true
        }))
        .pipe(gulp.dest(config.src));
});

gulp.task('clean:build', () => {
    return del([config.dist + '/*'])
        .then(paths => console.log('Deleting:\n', paths.join('\n')));
});

gulp.task('styles:build', ['clean:build'], () => {
    return gulp.src([config.css])
        .pipe(cleancss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('scripts:build', ['clean:build'], () => {
    return gulp.src([config.js, `!${config.src}/js/StatKOLSV.js`, `!${config.src}/js/widget.js`])
        .pipe(sourcemaps.init())
        .pipe(concat('gaugeWidjet.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.dist));
});



gulp.task('inject:build', ['scripts:build', 'styles:build'], () => {
    var sources = gulp.src([config.dist + '/**/*.css', config.dist + '**/*.js'], {
        read: false
    });
    return gulp.src('./src/index.html')
        .pipe(inject(sources, {
            relative: true
        }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('serve:build', ['inject:build'], () => {
    browserSync.init({
        server: {
            port: 3005,
            baseDir: './dist'
        }
    })
});

gulp.task('build', ['inject:build']);

gulp.task('serve:dev', ['inject:dev', 'watch:dev'], (cb) => {
    browserSync.init({
        server: {
            port: 3005,
            baseDir: './src'
        }
    });
    cb();
});
gulp.task('watch:dev', () => {
    gulp.watch(config.js).on('change', browserSync.reload);
    gulp.watch(config.css).on('change', browserSync.stream);
});

process.on('exit', function () {
    // In case the gulp process is closed (e.g. by pressing [CTRL + C]) stop both processes
    apiServer && apiServer.kill();
});

gulp.task('default', ['serve:dev']);