const gulp = require('gulp');
const path = require('path');
const fs = require('fs');

// Copy SVG icons to dist
gulp.task('build:icons', function (done) {
  const srcPath = path.join(__dirname, 'src', 'nodes', 'Stedi');
  const destPath = path.join(__dirname, 'dist', 'nodes', 'Stedi');

  // Ensure dist directory exists
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  // Copy SVG files
  const svgFiles = ['stedi.svg'];
  svgFiles.forEach((file) => {
    const srcFile = path.join(srcPath, file);
    const destFile = path.join(destPath, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${file} to dist`);
    }
  });

  done();
});

gulp.task('default', gulp.series('build:icons'));
