const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const f = path.join(dir, item);
    if (fs.statSync(f).isDirectory()) {
      if (!['node_modules', '.angular', 'dist', '.git'].includes(item)) walk(f);
    } else if (f.endsWith('.ts')) {
      let c = fs.readFileSync(f, 'utf8');
      let orig = c;
      
      // Fix pattern: ></button> on its own (stray > from bad regex)
      // The issue: lines like "              ></button>" should just be removed
      // or the previous line's > should be the closing
      c = c.replace(/\n(\s*)><\/button>/g, '\n$1</button>');
      
      if (c !== orig) {
        fs.writeFileSync(f, c, 'utf8');
        console.log('Fixed: ' + path.basename(f));
      }
    }
  }
}

walk(path.join(__dirname, 'src'));
console.log('Done!');
