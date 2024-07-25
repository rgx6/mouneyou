var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var cleanCSS    = require('gulp-clean-css');
var del         = require('del');
var browserSync = require('browser-sync');
var sourcemaps  = require('gulp-sourcemaps');

gulp.task('js', function (done) {
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
        .pipe(uglify({ output: { comments: /^!/ } }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/public/javascripts'));
    done();
});

gulp.task('css', function (done) {
    // todo : clean
    gulp.src('src/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/public/stylesheets'));
    done();
});

gulp.task('img', function (done) {
    // todo : clean
    gulp.src(
        [
            'src/img/**/*.*',
            '!src/img/sprite_src/*.*',
            '!src/img/stamp_original/*.*',
            '!src/img/stamp_twitter_optimized/*.*'
        ],
        { encoding: false })
        .pipe(gulp.dest('src/public/images'));
    done();
});

gulp.task('font', function (done) {
    // todo : clean
    gulp.src(
        [
            'src/font/**/*.*'
        ],
        { encoding: false })
        .pipe(gulp.dest('src/public/fonts'));
    done();
});

gulp.task('release', function (done) {
    // todo : clean build
    console.log('not implemented');
    done();
});

gulp.task('clean', function (done) {
    del('dest/**/*');
    done();
});

gulp.task('build', gulp.series(gulp.parallel('js', 'css', 'img', 'font'), function (done) {
    gulp.src(['src/public/javascripts/*.js', 'src/public/javascripts/*.map'])
        .pipe(gulp.dest('dest/public/javascripts'));

    gulp.src(['src/public/stylesheets/*.css', 'src/public/stylesheets/*.map'])
        .pipe(gulp.dest('dest/public/stylesheets'));

    gulp.src('src/public/images/**/*.*', { encoding: false })
        .pipe(gulp.dest('dest/public/images'));

    gulp.src('src/public/fonts/**/*.*', { encoding: false })
        .pipe(gulp.dest('dest/public/fonts'));

    gulp.src('src/views/**/*.pug')
        .pipe(gulp.dest('dest/views'));

    gulp.src(['src/*.js', 'src/*.json'])
        .pipe(gulp.dest('dest'));

    gulp.src('src/log/.gitkeep')
        .pipe(gulp.dest('dest/log'));

    done();
}));

gulp.task('watch', function () {
    browserSync.init({
        proxy: 'localhost:3003'
    });

    gulp.watch('src/js/**/*.js', gulp.series('js', browserSync.reload));
    gulp.watch('src/css/**/*.css', gulp.series('css', browserSync.reload));
    gulp.watch('src/img/**/*.*', gulp.series('img', browserSync.reload));
    gulp.watch('src/font/**/*.*', gulp.series('font', browserSync.reload));
    gulp.watch('src/views/*.pug', browserSync.reload);
});

gulp.task('default', gulp.series('watch'));
