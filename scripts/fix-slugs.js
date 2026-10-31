const fs = require('fs');
const path = require('path');
const targetDir = 'D:/Full Stack Dev/noida-painters';

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else {
      callback(path.join(dir, f));
    }
  });
}

walkDir(path.join(targetDir, 'src'), (filePath) => {
  if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Slugs
  content = content.replace(/interior-painting-gurgaon/g, 'interior-painting-noida');
  content = content.replace(/exterior-painting-gurgaon/g, 'exterior-painting-noida');
  content = content.replace(/wall-texture-painting-gurgaon/g, 'wall-texture-painting-noida');
  content = content.replace(/waterproofing-services-gurgaon/g, 'waterproofing-services-noida');
  content = content.replace(/wood-metal-painting-polish-gurgaon/g, 'wood-metal-painting-polish-noida');
  content = content.replace(/commercial-painting-gurgaon/g, 'commercial-painting-noida');

  // Blog Slugs
  content = content.replace(/exterior-house-repainting-checklist-gurgaon/g, 'exterior-house-repainting-checklist-noida');
  content = content.replace(/early-signs-wall-waterproofing-gurgaon/g, 'early-signs-wall-waterproofing-noida');
  content = content.replace(/choosing-interior-paint-finishes-gurgaon/g, 'choosing-interior-paint-finishes-noida');

  // Logo replacement
  content = content.replace(/gurgaon-painters-logo-transparent\.png/g, 'noida-painters-logo.png');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed slugs/logos in:', path.relative(targetDir, filePath));
  }
});
