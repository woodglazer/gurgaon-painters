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

let modifiedFiles = 0;

walkDir(path.join(targetDir, 'src'), (filePath) => {
  if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Specific contextual replacements
  content = content.replace(/Gurgaon Painters/g, 'Noida Painters');
  content = content.replace(/gurgaon painters/gi, 'Noida Painters');
  content = content.replace(/Gurgaon &amp; Gurugram/g, 'Noida &amp; Greater Noida');
  content = content.replace(/Gurgaon and Gurugram/g, 'Noida and Greater Noida');
  content = content.replace(/Gurgaon \(Gurugram\)/g, 'Noida & Greater Noida');
  content = content.replace(/in Gurgaon/g, 'in Noida');
  content = content.replace(/for Gurgaon/g, 'for Noida');
  content = content.replace(/across Gurgaon/g, 'across Noida');
  content = content.replace(/Gurgaon homes/g, 'Noida homes');
  content = content.replace(/Gurgaon properties/g, 'Noida properties');
  content = content.replace(/Gurgaon property/g, 'Noida property');
  content = content.replace(/Gurgaon localities/g, 'Noida sectors');
  content = content.replace(/Gurgaon/g, 'Noida');
  content = content.replace(/Gurugram/g, 'Greater Noida');

  // Fix any Double Replacement like "Noida Painters by Home Glazer"
  content = content.replace(/Noida Painters Painters/g, 'Noida Painters');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedFiles++;
    console.log('Cleaned Gurgaon references from:', path.relative(targetDir, filePath));
  }
});

console.log(`Total files cleaned: ${modifiedFiles}`);
