const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const gutil = require('gulp-util');
const pump = require('pump');
const gulpImports = require('gulp-imports');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', (run) => {
  pump([
    gulp.src('app/css/**/*.scss'),
    $.plumber(),
    $.sourcemaps.init(),
    $.sass.sync({
          outputStyle: 'expanded',
          precision: 10,
          includePaths: ['.']
        }).on('error', $.sass.logError),
    $.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie 9-11']}),
    $.sourcemaps.write(),
    gulp.dest('.tmp/css'),
    reload({stream: true})
    ],
    run
  );
});

gulp.task('scripts', (run) => {
  pump ([
    gulp.src(['app/js/**/*.js','!./app/js/vendor/**.js']),
    $.plumber(),
    // $.sourcemaps.init(),
        gulpImports(),
    $.babel({
            presets: ['es2015']
        }),

    // $.sourcemaps.write('.'),
    gulp.dest('.tmp/js'),
    reload({stream: true})
    ],
    run
  );
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/js/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/js'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', ['styles', 'scripts'], (run) => {
  pump ([
    gulp.src('app/*.html'),
    $.useref({searchPath: ['.tmp', 'app', '.']}),
    // $.if('*.js', $.uglify()),
    $.if('*.css', $.cssnano({safe: true, autoprefixer: true})),
    // $.if('*.html', $.htmlmin({collapseWhitespace: true})),
    gulp.dest('dist')
    ],
    run
  );
});

// add acima para minificar HTML
// .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))

gulp.task('images', (run) => {
  pump ([
    gulp.src('app/images/**/*'),
    //   $.cache($.imagemin({
    //   progressive: true,
    //   interlaced: true,
    //   // don't remove IDs from SVGs, they are often used
    //   // as hooks for embedding and styling
    //   svgoPlugins: [{cleanupIDs: false}]
    // })),
    gulp.dest('dist/images')
    ],
    run
  );
});

gulp.task('fonts', (run) => {
  pump ([
    gulp.src('app/fonts/**/*'),
    gulp.dest('.tmp/fonts'),
    gulp.dest('dist/fonts'),
    ],
  run
  );
});

gulp.task('other', (run) => {
  pump([
    gulp.src('app/other/**/*.*'),
    gulp.dest('dist/other'),
    reload({stream: true})
    ],
    run
  );
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app']
    }
  });

  gulp.watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/css/**/*.scss', ['styles']);
  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('app/fonts/**/*', ['fonts']);
});



gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/js': '.tmp/js'
      }
    }
  });

  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'other'], (run) => {
    gulp.src('dist/**/*')
 });

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
