var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var minifyCSS   = require('gulp-minify-css');
var del         = require('del');
var browserSync = require('browser-sync');
var sourcemaps  = require('gulp-sourcemaps');

gulp.task('js', function () {
    // todo : clean
    gulp.src(
        [
            'src/js/lib/analytics.js',
            'src/js/lib/jquery-2.1.1.min.js',
            'src/js/lib/jquery-ui.min.js',
            'src/js/lib/jquery.ui.touch-punch.min.js',
            'src/js/script/*.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('client.js'))
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/public/javascripts'));
});

gulp.task('css', function () {
    // todo : clean
    gulp.src('src/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/public/stylesheets'));
});

gulp.task('img', function () {
    // todo : clean
    gulp.src(
        [
            'src/img/**/*.*',
            '!src/img/sprite_src/*.*',
            '!src/img/stamp_original/*.*',
            '!src/img/stamp_twitter_optimized/*.*'
        ])
        .pipe(gulp.dest('src/public/images'));
});

gulp.task('font', function () {
    // todo : clean
    gulp.src(
        [
            'src/font/**/*.*'
        ])
        .pipe(gulp.dest('src/public/fonts'));
});

gulp.task('release', function () {
    // todo : clean build
    console.log('not implemented');
});

gulp.task('clean', function () {
    del('dest/**/*');
});

gulp.task('build', ['js', 'css', 'img', 'font'], function () {
    gulp.src(['src/public/javascripts/*.js', 'src/public/javascripts/*.map'])
        .pipe(gulp.dest('dest/public/javascripts'));

    gulp.src(['src/public/stylesheets/*.css', 'src/public/stylesheets/*.map'])
        .pipe(gulp.dest('dest/public/stylesheets'));

    gulp.src('src/public/images/**/*.*')
        .pipe(gulp.dest('dest/public/images'));

    gulp.src('src/public/fonts/**/*.*')
        .pipe(gulp.dest('dest/public/fonts'));

    gulp.src('src/views/**/*.pug')
        .pipe(gulp.dest('dest/views'));

    gulp.src(['src/*.js', 'src/*.json'])
        .pipe(gulp.dest('dest'));

    gulp.src('src/log/.gitkeep')
        .pipe(gulp.dest('dest/log'));
});

gulp.task('watch', function () {
    browserSync.init({
        proxy: 'localhost:3003'
    });

    gulp.watch('src/js/**/*.js', ['js', browserSync.reload]);
    gulp.watch('src/css/**/*.css', ['css', browserSync.reload]);
    gulp.watch('src/img/**/*.*', ['img', browserSync.reload]);
    gulp.watch('src/font/**/*.*', ['font', browserSync.reload]);
    gulp.watch('src/views/*.pug', browserSync.reload);
});

gulp.task('default', ['watch']);
