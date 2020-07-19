"use strict";

const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const del = require('del');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: './dist'
        },
        port: 3000
    });
    done();
}

function html() {
    return gulp.src('src/*.html')
        .pipe(plumber())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'))
        .pipe(browsersync.stream());
}

function watchFiles() {
    gulp.watch('src/*.html', html);
    gulp.watch('src/scss/**/*.scss', styles);
    gulp.watch('src/images/*', images);
}

function clean() {
    return del(['dist']);
}

function styles() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(postcss([cssnano(),autoprefixer()]))
        .pipe(gulp.dest('dist/css'))
        .pipe(browsersync.stream());
}

function images() {
    return gulp.src('src/images/*')
        .pipe(newer('dist/images'))
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}

const watch = gulp.parallel(watchFiles, browserSync);
const build = gulp.series(clean, gulp.parallel(html, styles, images));
const defaultTask = gulp.series(build, watch);

exports.watch = watch;
exports.build = build;
exports.clean = clean;
exports.styles = styles;
exports.default = defaultTask;