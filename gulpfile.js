var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var minifyCSS   = require('gulp-minify-css');
var del         = require('del');
var browserSync = require('browser-sync');

gulp.task('js', function () {
    // todo : clean
    gulp.src('src/js/**/*.js')
        .pipe(concat('client.js'))
        .pipe(gulp.dest('src/public/javascripts'));
});

gulp.task('css', function () {
    // todo : clean
    gulp.src('src/css/**/*.css')
        .pipe(concat('style.css'))
        .pipe(gulp.dest('src/public/stylesheets'));
});

gulp.task('img', function () {
    // todo : clean
    gulp.src('src/img/**/*.*')
        .pipe(gulp.dest('src/public/images'));
});

gulp.task('release', function () {
    // todo : clean build
    console.log('not implemented');
});

gulp.task('clean', function () {
    del('dest/**/*');
});

gulp.task('build', ['js', 'css', 'img'], function () {
    gulp.src('src/public/javascripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dest/public/javascripts'));

    gulp.src('src/public/stylesheets/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('dest/public/stylesheets'));

    gulp.src('src/public/images/**/*.*')
        .pipe(gulp.dest('dest/public/images'));

    gulp.src('src/views/**/*.jade')
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
    gulp.watch('src/views/*.jade', browserSync.reload);
});

gulp.task('default', ['watch']);
