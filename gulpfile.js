const gulp = require("gulp"),
    babel = require("gulp-babel"),
    sourceMaps = require("gulp-sourcemaps")

gulp.task("babel", function() {
    return gulp.src(["src/**/*.js"])
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

gulp.task("babel-source-maps", function() {
    return gulp.src(["src/**/*.js"])
        .pipe(sourceMaps.init())
        .pipe(babel())
        .pipe(sourceMaps.write("sourceMaps"))
        .pipe(gulp.dest("dist"));
});

gulp.task("dev", ["babel-source-maps"]);
gulp.task("prod", ["babel"]);
gulp.task("default", ["dev"]);