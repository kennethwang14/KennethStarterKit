var gulp = require('gulp'),

    /* Appending header */
    header = require('gulp-header'),
    packageObject = require('./package.json'),

    /* CSS */
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    sourcemaps = require('gulp-sourcemaps'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),

    /* JavaScript */
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),

    /* HTML */
    browserSync = require('browser-sync').create(),
    htmlmin = require('gulp-htmlmin'),
    critical = require('critical').stream,
    replace = require('gulp-replace'),
    gulpsmith = require('gulpsmith'),
    layout = require('metalsmith-layouts'),
    template = require('metalsmith-in-place'),
    helpers = require('metalsmith-register-helpers'),
    permalinks = require('metalsmith-permalinks'),
    collections = require('metalsmith-collections'),
    gulpFrontMatter = require('gulp-front-matter'),
    assign = require('lodash.assign'),

    /* ImageMin */
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegoptim = require('imagemin-jpegoptim'),
    cache = require('gulp-cache'),

    /* Helpers */
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence'),
    del = require('del');


//Banner header
var banner = [
    '/*!\n' +
    ' * View uncompiled source here:\n' +
    ' * <%= package.repository.url %>\n' +
    ' */',
    '\n\n'
].join('');

var bannerHTML = [
    '<!-- \n' +
    ' - View uncompiled source here:\n' +
    ' - <%= package.repository.url %>\n' +
    ' -->',
    '\n\n'
].join('');

gulp.task('css', function () {
    return new Promise(function(resolve, reject) {
        gulp.src('app/assets/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass({outputStyle: "expanded"}).on("error", sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/css'))
        .on('end', resolve)
    });
});

gulp.task('css-build', function () {
    return new Promise(function(resolve, reject) {
        gulp.src('app/assets/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass({outputStyle: "expanded"}).on("error", sass.logError))
        .pipe(autoprefixer({browsers: ["> 1%", "last 2 versions", "Firefox ESR"]}))
        .pipe(cssnano({discardComments: {removeAll: true}}))
        .pipe(header(banner, { package : packageObject }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/css'))
        .on('end', resolve)
    });
});

gulp.task('js',function(){
    return new Promise(function(resolve, reject) {
        gulp.src(['!app/assets/js/polyfill/**/*.js', 'app/assets/js/vendor/**/*.js', 'app/assets/js/**/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(uglify())
        .pipe(header(banner, { package : packageObject }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/js'))
        .on('end', resolve)
    });
});

gulp.task('html', function() {
    return new Promise(function(resolve, reject) {
        gulp.src(['app/pages/**/*.html', 'app/*.html', '!app/templates', '!app/templates/**/*', '!app/**/README.md'])
        .pipe(gulpFrontMatter()).on("data", function(file) {
            assign(file, file.frontMatter);
            delete file.frontMatter;
        })
        .pipe(
        gulpsmith()
        .use(collections({
            blog: {
                sortBy: 'date',
                reverse: true
            }
        }))
        .use(permalinks({
            pattern: ':root/:title'
        }))
        .use(helpers({
            "directory": "app/templates/handlebar-helpers"
        }))
        .use(template({
            
        }))
        .use(layout({
            engine: "handlebars",
            directory: "app/templates/layouts",
            partials: "app/templates/partials"
        }))
        )
        .pipe(htmlmin({
            removeComments: false,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }))
        .pipe(header(bannerHTML, { package : packageObject }))
        .pipe(gulp.dest('dist'))
        .on('end', resolve)
    });
});

gulp.task('critical', function () {
    return new Promise(function(resolve, reject) {
        gulp.src('dist/**/*.html')
        .pipe(critical({base: 'dist/', inline: true, css: ['dist/assets/css/main.css'], minify: true, width: 1920, height: 1080}))
        .pipe(replace('<style type="text/css">', '<!--#if expr="$HTTP_COOKIE=/fonts-loaded=true/" --><link rel="stylesheet" href="/assets/css/main.css"><!--#else --><style type="text/css">'))
            .pipe(replace('</noscript>', '</noscript><!--#endif -->'))
                .pipe(gulp.dest('dist'))
            .on('end', resolve)
        });
    });
    
gulp.task('imagemin', function() {
    return new Promise(function(resolve, reject) {
        gulp.src('app/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant({quality: "80", floyd: 1, speed: 1}), jpegoptim({progressive: true, max: 90})]
        })))
        .pipe(gulp.dest('dist/assets/images'))
        .on('end', resolve)
    });
    
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('copy', function() {
    return Promise.all([
        new Promise(function(resolve, reject) {
            gulp.src(['app/*.*', 'app/.htaccess', '!app/*.html'])
            .pipe(gulp.dest('dist'))
            .on('end', resolve)
        }),
        new Promise(function(resolve, reject) {
            gulp.src(['app/assets/fonts/**'])
            .pipe(gulp.dest('dist/assets/fonts'))
            .on('end', resolve)
        }),
        new Promise(function(resolve, reject) {
            gulp.src(['app/assets/audio/**'])
            .pipe(gulp.dest('dist/assets/audio'))
            .on('end', resolve)
        }),
        new Promise(function(resolve, reject) {
            gulp.src(['app/assets/videos/**'])
            .pipe(gulp.dest('dist/assets/videos'))
            .on('end', resolve)
        }),
        new Promise(function(resolve, reject) {
            gulp.src(['app/assets/files/**'])
            .pipe(gulp.dest('dist/assets/files'))
            .on('end', resolve)
        }),
    ]);
});
        
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./dist",
        },
        reloadDelay: 0
    });
});
            
gulp.task('watch', function() {
    gulp.watch("app/assets/scss/**/*.scss").on('change', function(evt) {
        runSequence('css', 'reload');
    });

    gulp.watch("app/assets/js/**/*.js").on('change', function(evt) {
        runSequence('js', 'reload');
    });

    gulp.watch("app/**/*.html").on('change', function(evt) {
        runSequence('html', 'reload');
    });

    gulp.watch("app/assets/images/**/*.+(png|jpg|jpeg|gif)").on('change', function(evt) {
        runSequence('imagemin', 'reload');
    });
});
        
gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('default', function (callback) {
    runSequence('clean', 'copy', 'html',
    ['css', 'js'],
    ['watch', 'imagemin'],
    ['browser-sync'],
    callback
    )
});
        
gulp.task('build', function (callback) {
    runSequence('clean', 'copy', 'html',
    ['imagemin', 'css-build', 'js'],
    'critical',
    callback
    )
});
        
gulp.task('build-no-critical', function (callback) {
    runSequence('clean', 'copy', 'html',
    ['imagemin', 'css-build', 'js'],
    callback
    )
});
        
