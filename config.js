module.exports = {

  // ===== ftp setting ====== //
  ftp: {
    host: "1.2.3.4",
    user: "user",
    pass: "pass",
    remotePath: "/path/to/dir"
  },
  // ===== ftp path ====== //

  // ===== Sources path ====== //
  sources: {
    // dist
    html: "./deploy/*.html",
    js: "./deploy/javascripts/",
    css: "./deploy/stylesheets/",
    imgDist: "./deploy/images/",
    //src
    sass: "./src/sass/style.scss",
    sassChild: "./src/sass/**/*.scss",
    jsAssets: "./src/js/**/**.js",
    pug: "./src./pug/**.pug",
    pugChild: "./src/pug/**/!(_)*.pug",
    tag: "./src/pug/**.tag",
    tagChild: "./src/pug/**/*.tag",
    img: "./src/images/**/*",
    sprites: "./src/sprites/**/*.png",
    spritesCss: "./src/sass/"
  }
  // ===== Sources path ====== //
};
