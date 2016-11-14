var gulp = require('gulp'),
	less = require('gulp-less'),
	reactify = require('reactify'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	watchify = require('watchify');
var source = require('vinyl-source-stream');

gulp.task('less', function(){
	gulp.src('./app/static/less/index.less') //该任务针对的文件
		.pipe(less()) //该任务调用的模块
		.pipe(gulp.dest('./app/static/css')) //将会在src/css下生成index.css
});

gulp.task('react', function(){
	var bundler = browserify({
        entries: ['./app/static/js/lib/index.js'], // Only need initial file, browserify finds the deps
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: false // Requirement of watchify
    });
    var watcher  = watchify(bundler);

    return watcher
    .on('update', function () { // When any files update
        var updateStart = Date.now();
        console.log('Updating react!');
        watcher.bundle() // Create new bundle that uses the cache for high performance
        .pipe(source('bundle.js'))
        // This is where you add uglifying etc.
        .pipe(gulp.dest('./app/static/js/build'));
        console.log('Updated react!', (Date.now() - updateStart) + 'ms');
    }).on('error', function(err){
      // print the error (can replace with gulp-util)
      console.log(err.message);
      // end this stream
      this.emit('end');
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./app/static/js/build'));

    /*return browserify('./app/static/js/lib/index.js')
    		.transform(reactify)
    		.bundle()
    		.pipe(source('bundle.js'))
    		.pipe(gulp.dest('./app/static/js/build'));*/
	/*var bundler = browserify({
		entries: './app/static/js/lib/index.js',
		debug: true,
		transform: [reactify]
	});
	var watcher = watchify(bundler);

	return watcher
	.on('update', function(){
		watcher.bundle().pipe(source('bundle.js'))
		.pipe(gulp.dest('./app/static/js/build'));
	})
	.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./app/static/js/build'));*/
});

gulp.task('default',['less', 'react']); //定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务