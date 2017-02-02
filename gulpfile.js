const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const inject = require('gulp-inject');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const es = require('event-stream');

let apiServer = null;

config = {
    js: './src/js/**/*.js',
    css: './src/css/**/*.css',
    html: './src/**/*.html',
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

// gulp.task('styles:dev', () => {
//     return gulp.src([config.css]);
// });

// gulp.task('scripts:dev', () => {
//     return gulp.src([config.js]);
// });

gulp.task('inject:dev', () => {
    var sources = gulp.src([config.css, config.js], {read: false});
    return gulp.src('./src/index.html')
    .pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest('./src'));
});

gulp.task('styles:build', () => {
    return gulp.src([config.css])
        .pipe(gulp.dest(config.dist));
});

gulp.task('scripts:build', () => {
    return gulp.src([config.js])
        .pipe(concat('gaugeWidjet.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist));
});

gulp.task('inject:build', ['scripts:build', 'styles:build'], () => {
    var sources = gulp.src([config.dist + '/**/*.css', config.dist + '**/*.js'], {read: false});
    return gulp.src('./src/index.html')
        .pipe(inject(sources,{relative: true}))
        .pipe(gulp.dest(config.dist));
});

gulp.task('serve:build', ['inject:build'],() => {
    browserSync.init({
        server: {
            port: 3005,
            baseDir: './dist'
        }
    })
});

gulp.task('serve:dev',['inject:dev'] ,(cb) => {
    browserSync.init({
        server: {
            port: 3005,
            baseDir: './src'
        }
    });
    cb();
});
gulp.task('watch', ['serve:dev'], () => {
    gulp.watch('./src/**/*').on('change', browserSync.reload);
});

process.on('exit', function () {
    // In case the gulp process is closed (e.g. by pressing [CTRL + C]) stop both processes
    apiServer && apiServer.kill();
});

gulp.task('default', ['watch']);