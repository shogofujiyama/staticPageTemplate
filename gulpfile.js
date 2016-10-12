/*
 * Initial setting
 * */
"use strict";

var gulp = require("gulp"),
runSequence = require("run-sequence"),

// variables
$ = require("gulp-load-plugins")({
    pattern: ["gulp-*", "gulp.*"],
    replaceString: /\bgulp[\-.]/
}),

browserSync  = require("browser-sync"),
reload       = browserSync.reload,
pagespeed    = require("psi"),

config       = require("./config.js"),
sources      = config.sources,
ftpConf      = config.ftp;

// ===== pug compile ====== //
gulp.task("pug", function () {
  gulp.src(sources.pugChild)
    .pipe($.plumber())
    .pipe($.pug({
      pretty: true,
      locals: {
        built_at: new Date().getTime()
      }
    }))
    .pipe(gulp.dest("./deploy/"));
  gulp.src(sources.tagChild)
    .pipe($.plumber())
    .pipe($.riot({
      template: "pug"
    }))
    .pipe(gulp.dest("./deploy/"));
});
// ===== pug compile ====== //
//
// ===== sass compile ====== //
gulp.task("styles:sass", function () {
  gulp.src(sources.sass)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(gulp.dest(sources.css));
});
// ===== sass compile ====== //

// ===== stylus compile ====== //
gulp.task("styles:styl", function () {
  gulp.src(sources.styl)
    .pipe($.plumber())
    .pipe($.stylus())
    .pipe(gulp.dest(sources.css));
});
// ===== stylus compile ====== //

// ===== css optimaize ====== //
gulp.task("styles:css", function () {
  gulp
    .src(sources.css + "*.css")
    .pipe($.plumber())
    // .pipe($.autoprefixer({
    //   browsers : ["last 1 version"]
    // }))
    // .pipe(gulp.dest(sources.css))
    // .pipe($.csso())
    // .pipe(gulp.dest(sources.css))
    .pipe($.size({title: "styles:css"}));
});
// ===== css optimaize ====== //

// ===== output final css style ====== //
gulp.task("styles", ["styles:sass", "styles:css"]);
// ===== output final css style ====== //

// ===== css sprite ====== //
gulp.task("sprite", function () {
  var spriteData = gulp.src(sources.sprites).pipe($.spritesmith({
    imgName: "sprite.png",
    cssName: "_sprite.scss",
    imgPath: "/assets/images/pages/sprite.png?v=" + new Date().getTime(),
    padding: 10,
    cssFormat : "scss",
    cssVarMap: function (sprite) {
      sprite.name = 'sprite-' + sprite.name; //VarMap(生成されるScssにいろいろな変数の一覧を生成)
    }
  }));
  spriteData.img.pipe(gulp.dest(sources.imgDist));
  spriteData.css.pipe(gulp.dest(sources.spritesCss));
});
// ===== css sprite ====== //

// ===== JavaScript Optimaize ====== //
gulp.task("scripts", function () {
  return gulp.src(["js/lib/*.js"])
    .pipe($.plumber())
    .pipe($.concat("vendor.js"))
    .pipe($.uglify({
      preserveComments: "some"
    }))
    .pipe(gulp.dest(sources.js));
});
gulp.task("scripts:babel", function (){
  return gulp.src(["js/*.js"])
    .pipe($.babel())
    .pipe($.uglify({
      preserveComments: "some"
    }))
    .pipe(gulp.dest(sources.js));
});
// ===== JavaScript Optimaize ====== //

// ===== JShint ====== //
gulp.task("jshint", function () {
  return gulp.src(sources.js + ".js")
    .pipe($.plumber())
    .pipe($.jshint())
    .pipe($.jshint.reporter("jshint-stylish"))
    .pipe($.jshint.reporter("fail"))
    .pipe(reload({stream: true}));
});
// ===== JShint ====== //

// ===== CSShint ====== //
gulp.task("csslint", function () {
  return gulp.src(sources.css + "*.css")
    .pipe($.plumber())
    .pipe($.csslint())
    .pipe($.csslint.reporter());
});
// ===== CSShint ====== //

// ===== image optimize ====== //
gulp.task("images", function () {
  return gulp.src(sources.img)
    .pipe($.plumber())
    .pipe($.cache($.imagemin({
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest("../assets/images"));
});
// ===== image optimize ====== //

// ===== cache clear ====== //
gulp.task("clear", function ( i_done ) {
  return $.cache.clearAll( i_done );
});
// ===== cache clear ====== //

// ===== gzip ====== //
gulp.task("gzip", function() {
  gulp.src(sources.js + "*.js")
    .pipe($.gzip())
    .pipe(gulp.dest(sources.js));
  gulp.src(sources.css + "*.css")
    .pipe($.gzip())
    .pipe(gulp.dest(sources.css));
});
// ===== gzip ====== //

// ===== ftp ====== //
gulp.task("ftp", function() {
  return gulp.src("dist/**")
    .pipe($.ftp(ftpSet))
    .pipe($.util.noop());
});
// ===== ftp ====== //

// ===== files watch and make a local server ====== //
gulp.task("default", function () {
  browserSync({
    server: {
        baseDir: ["./deploy"]
    },
    notify: false,
    debugInfo: false,
    host: "localhost"
  });

  gulp.watch([sources.sprites], ["sprite"]);
  gulp.watch([sources.sassChild], ["styles"]);
  gulp.watch([sources.sass], ["styles"]);
  gulp.watch([sources.pugChild], ["pug"]);
  gulp.watch([sources.pug], ["pug"]);
  gulp.watch([sources.tag], ["pug"]);
  gulp.watch([sources.tagChild], ["pug"]);
  gulp.watch([sources.css + "*.css"], reload);
  gulp.watch([sources.html], reload);
  gulp.watch([sources.js + "*.js"], ["jshint"]);
  gulp.watch([sources.jsAssets], ["scripts", "scripts:babel"]);
  gulp.watch([sources.img], ["images"]);
});
// ===== files watch and make a local server ====== //

// ===== build ====== //
gulp.task("build", function ( i_cb ) {
 runSequence("styles", ["jshint", "csslint", "pug", "images"], i_cb);
});
// ===== build ====== //

// ===== deploy ====== //
gulp.task("deploy", function() {
  return gulp.src("dist/**")
    .pipe($.ftp(ftpConf));
});
// ===== deploy ====== //

// ===== google pageSpeed ====== //
gulp.task("pagespeed", pagespeed.bind(null, {
   url: "https://example.com",
   strategy: "mobile"
}));
// ===== google pageSpeed ====== //
