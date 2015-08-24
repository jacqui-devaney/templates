var GitSync = require('./node_modules/git-s3-sync/');
var path = require('path');

module.exports = function(gulp){
  GitSync(gulp);
  gulp.task('git-s3-sync', function(){
    //to be configured
    return gulp.src('src/js/*.js');
  });
}
